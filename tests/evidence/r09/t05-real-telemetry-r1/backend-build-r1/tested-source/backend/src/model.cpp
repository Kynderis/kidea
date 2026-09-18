#include "workshop/model.hpp"
#include <algorithm>
#include <charconv>
#include <chrono>
#include <cmark.h>
#include <limits>
#include <memory>
#include <regex>
namespace workshop {
std::vector<std::uint32_t> codepoints(std::string_view s) {
  std::vector<std::uint32_t> result;
  for (std::size_t i = 0; i < s.size();) {
    const auto c = static_cast<unsigned char>(s[i]);
    std::size_t n{};
    std::uint32_t cp{};
    if (c < 128) {
      n = 1;
      cp = c;
    } else if (c >= 194 && c <= 223) {
      n = 2;
      cp = c & 31U;
    } else if (c >= 224 && c <= 239) {
      n = 3;
      cp = c & 15U;
    } else if (c >= 240 && c <= 244) {
      n = 4;
      cp = c & 7U;
    } else
      throw Invalid("UTF8");
    if (i + n > s.size())
      throw Invalid("UTF8");
    for (std::size_t k = 1; k < n; ++k) {
      auto b = static_cast<unsigned char>(s[i + k]);
      if ((b & 192U) != 128U)
        throw Invalid("UTF8");
      cp = (cp << 6U) | (b & 63U);
    }
    if ((n == 2 && cp < 128) || (n == 3 && cp < 2048) ||
        (n == 4 && cp < 65536) || cp > 0x10ffffU ||
        (cp >= 0xd800U && cp <= 0xdfffU))
      throw Invalid("UTF8");
    result.push_back(cp);
    i += n;
  }
  return result;
}
std::string trim(std::string_view s) {
  const auto points = codepoints(s);
  const auto whitespace = [](std::uint32_t p) {
    return (p >= 9 && p <= 13) || p == 32 || p == 0x85 || p == 0xa0 ||
           p == 0x1680 || (p >= 0x2000 && p <= 0x200a) || p == 0x2028 ||
           p == 0x2029 || p == 0x202f || p == 0x205f || p == 0x3000 ||
           p == 0xfeff;
  };
  std::vector<std::size_t> offsets{0};
  for (auto cp : points)
    offsets.push_back(offsets.back() + (cp < 0x80      ? 1U
                                        : cp < 0x800   ? 2U
                                        : cp < 0x10000 ? 3U
                                                       : 4U));
  std::size_t a = 0, b = points.size();
  while (a < b && whitespace(points[a]))
    ++a;
  while (b > a && whitespace(points[b - 1]))
    --b;
  return std::string(s.substr(offsets[a], offsets[b] - offsets[a]));
}
bool plain(std::string_view s) {
  const auto parser =
      std::unique_ptr<cmark_parser, decltype(&cmark_parser_free)>(
          cmark_parser_new(CMARK_OPT_DEFAULT), cmark_parser_free);
  if (!parser)
    throw std::bad_alloc();
  cmark_parser_feed(parser.get(), s.data(), s.size());
  const auto doc = std::unique_ptr<cmark_node, decltype(&cmark_node_free)>(
      cmark_parser_finish(parser.get()), cmark_node_free);
  if (!doc)
    throw std::bad_alloc();
  if (cmark_parser_has_reference_definition(parser.get()))
    return false;
  const auto it = std::unique_ptr<cmark_iter, decltype(&cmark_iter_free)>(
      cmark_iter_new(doc.get()), cmark_iter_free);
  if (!it)
    throw std::bad_alloc();
  while (cmark_iter_next(it.get()) != CMARK_EVENT_DONE) {
    const auto t = cmark_node_get_type(cmark_iter_get_node(it.get()));
    if (t != CMARK_NODE_DOCUMENT && t != CMARK_NODE_PARAGRAPH &&
        t != CMARK_NODE_TEXT && t != CMARK_NODE_SOFTBREAK)
      return false;
  }
  return true;
}
Json decode(std::string_view s) {
  if (s.size() > 131072)
    throw Invalid("BODY_LIMIT");
  static_cast<void>(codepoints(s));
  // JsonCpp can accept comments despite allowComments=false. Reject the
  // non-JSON slash token outside strings; preserve slashes and escapes inside.
  bool quoted = false;
  bool escaped = false;
  for (const char c : s) {
    if (quoted) {
      if (escaped)
        escaped = false;
      else if (c == '\\')
        escaped = true;
      else if (c == '"')
        quoted = false;
    } else if (c == '"')
      quoted = true;
    else if (c == '/')
      throw Invalid("JSON");
  }
  ::Json::CharReaderBuilder b;
  b["allowComments"] = false;
  b["collectComments"] = false;
  b["strictRoot"] = true;
  b["failIfExtra"] = true;
  b["rejectDupKeys"] = true;
  b["allowSpecialFloats"] = false;
  b["allowTrailingCommas"] = false;
  b["stackLimit"] = 64;
  const std::unique_ptr<::Json::CharReader> reader(b.newCharReader());
  Json j;
  std::string errors;
  if (!reader->parse(s.data(), s.data() + s.size(), &j, &errors) ||
      !j.isObject())
    throw Invalid("JSON");
  return j;
}
void keys(const Json &j, const std::vector<std::string> &allowed,
          const std::vector<std::string> &required) {
  if (!j.isObject())
    throw Invalid("OBJECT");
  for (const auto &k : j.getMemberNames())
    if (std::find(allowed.begin(), allowed.end(), k) == allowed.end())
      throw Invalid("FIELD");
  for (const auto &k : required)
    if (!j.isMember(k) || j[k].isNull())
      throw Invalid("REQUIRED");
}
std::string string(const Json &j, const char *k) {
  if (!j[k].isString())
    throw Invalid("STRING");
  const auto v = j[k].asString();
  const auto cp = codepoints(v);
  if (std::find(cp.begin(), cp.end(), 0U) != cp.end())
    throw Invalid("NUL");
  return v;
}
Instant instant(std::string_view input) {
  // RFC3339 offsets; fractional precision is retained, never rounded.
  static const std::regex pattern(
      R"(^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]+)?(Z|[+-][0-9]{2}:[0-9]{2})$)");
  const std::string s(input);
  std::smatch m;
  if (!std::regex_match(s, m, pattern))
    throw Invalid("TIME");
  const int y = std::stoi(m[1]), mo = std::stoi(m[2]), d = std::stoi(m[3]),
            h = std::stoi(m[4]), mi = std::stoi(m[5]), se = std::stoi(m[6]);
  const std::chrono::year_month_day date{
      std::chrono::year(y), std::chrono::month(static_cast<unsigned>(mo)),
      std::chrono::day(static_cast<unsigned>(d))};
  if (!date.ok() || h > 23 || mi > 59 || se > 59)
    throw Invalid("TIME");
  int offset = 0;
  const std::string zone = m[8];
  if (zone != "Z") {
    const int oh = std::stoi(zone.substr(1, 2)),
              om = std::stoi(zone.substr(4, 2));
    if (oh > 23 || om > 59 || zone == "-00:00")
      throw Invalid("TIME_ZONE");
    offset = (oh * 60 + om) * 60 * (zone[0] == '-' ? -1 : 1);
  }
  std::string fraction = m[7];
  if (!fraction.empty())
    fraction.erase(0, 1);
  while (!fraction.empty() && fraction.back() == '0')
    fraction.pop_back();
  return {std::chrono::duration_cast<std::chrono::seconds>(
              std::chrono::sys_days(date).time_since_epoch())
                  .count() +
              h * 3600 + mi * 60 + se - offset,
          fraction};
}
Fields fields(const Json &j) {
  keys(j, {"title", "description", "capacity", "schedule"},
       {"title", "description", "capacity", "schedule"});
  Fields f;
  f.title = trim(string(j, "title"));
  f.description = trim(string(j, "description"));
  const auto titlePoints = codepoints(f.title);
  const bool lineBreak =
      std::any_of(titlePoints.begin(), titlePoints.end(), [](auto cp) {
        return cp == 10 || cp == 13 || cp == 0x85 || cp == 0x2028 ||
               cp == 0x2029;
      });
  if (lineBreak || f.title.empty() || codepoints(f.title).size() > 120 ||
      f.title.find_first_of("\r\n") != std::string::npos ||
      f.description.empty() || codepoints(f.description).size() > 5000 ||
      !plain(f.title) || !plain(f.description))
    throw Invalid("CONTENT");
  if (!j["capacity"].isInt() || j["capacity"].asInt() < 1 ||
      j["capacity"].asInt() > 1000)
    throw Invalid("CAPACITY");
  f.capacity = j["capacity"].asInt();
  const auto &schedule = j["schedule"];
  keys(schedule, {"start", "end"}, {"start", "end"});
  f.start = string(schedule, "start");
  f.end = string(schedule, "end");
  f.from = instant(f.start);
  f.until = instant(f.end);
  if (!(f.from < f.until))
    throw Invalid("SCHEDULE");
  return f;
}
Json normalized(const Fields &f) {
  Json j;
  j["title"] = f.title;
  j["description"] = f.description;
  j["capacity"] = f.capacity;
  j["schedule"]["start"] = f.start;
  j["schedule"]["end"] = f.end;
  return j;
}
std::string dump(const Json &j) {
  ::Json::StreamWriterBuilder b;
  b["indentation"] = "";
  return ::Json::writeString(b, j);
}
std::string next_version(const std::string &s) {
  std::uint64_t n{};
  const auto r = std::from_chars(s.data(), s.data() + s.size(), n);
  if (r.ec != std::errc{} || r.ptr != s.data() + s.size() ||
      n == std::numeric_limits<std::uint64_t>::max())
    throw StorageError("VERSION");
  return std::to_string(n + 1);
}
Response reply(int status, const std::string &code, const std::string &state) {
  Json j;
  j["state"] = state;
  j["code"] = code;
  return {status, j};
}
} // namespace workshop
