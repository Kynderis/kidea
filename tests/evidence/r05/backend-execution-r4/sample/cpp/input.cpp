#include "input.hpp"
#include "domain.hpp"
#include <memory>
namespace kidea {
std::optional<Json::Value> decode_json(std::string_view body) {
  try {
    static_cast<void>(utf8_count(body));
  } catch (const std::invalid_argument &) {
    return std::nullopt;
  }
  Json::CharReaderBuilder builder;
  builder["allowComments"] = false;
  builder["collectComments"] = false;
  builder["strictRoot"] = true;
  builder["failIfExtra"] = true;
  builder["rejectDupKeys"] = true;
  builder["allowSpecialFloats"] = false;
  builder["allowTrailingCommas"] = false;
  const auto reader = std::unique_ptr<Json::CharReader>(builder.newCharReader());
  Json::Value value;
  std::string errors;
  if (!reader->parse(body.data(), body.data() + body.size(), &value, &errors) || !value.isObject())
    return std::nullopt;
  return value;
}
} // namespace kidea
