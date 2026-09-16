#pragma once
#include <json/json.h>
#include <optional>
#include <string_view>
namespace kidea {
std::optional<Json::Value> decode_json(std::string_view body);
}
