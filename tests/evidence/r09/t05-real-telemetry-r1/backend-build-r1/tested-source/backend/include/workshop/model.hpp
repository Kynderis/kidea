#pragma once
#include <compare>
#include <cstdint>
#include <json/json.h>
#include <stdexcept>
#include <string>
#include <string_view>
#include <vector>
namespace workshop {
using Json = ::Json::Value;
struct Invalid final : std::runtime_error {
  using std::runtime_error::runtime_error;
};
struct StorageError final : std::runtime_error {
  using std::runtime_error::runtime_error;
};
struct Response {
  int status;
  Json body;
};
struct Identity {
  std::string actor;
  bool participant{};
  bool admin{};
  std::string csrf;
};
struct Instant {
  std::int64_t seconds;
  std::string fraction;
  auto operator<=>(const Instant &) const = default;
};
struct Fields {
  std::string title, description, start, end;
  int capacity{};
  Instant from{}, until{};
};
std::vector<std::uint32_t> codepoints(std::string_view);
std::string trim(std::string_view);
bool plain(std::string_view);
Json decode(std::string_view);
void keys(const Json &, const std::vector<std::string> &allowed,
          const std::vector<std::string> &required = {});
std::string string(const Json &, const char *);
Instant instant(std::string_view);
Fields fields(const Json &);
Json normalized(const Fields &);
std::string dump(const Json &);
std::string next_version(const std::string &);
Response reply(int, const std::string &, const std::string &state = "ERROR");
} // namespace workshop
