#pragma once
#include <cstdint>
#include <functional>
#include <memory>
#include <mutex>
#include <sqlite3.h>
#include <stdexcept>
#include <string>
#include <string_view>
#include <vector>

namespace kidea {
bool valid_version(std::string_view value);
bool plain_text(std::string_view value, std::size_t maximum, bool title);
std::size_t utf8_count(std::string_view value);
struct Counts {
  int domain;
  int result;
  int audit;
  int outbox;
  bool operator==(const Counts &) const = default;
};
class DatabaseError : public std::runtime_error {
public:
  using std::runtime_error::runtime_error;
};
class Store {
public:
  explicit Store(const std::string &file);
  ~Store();
  Store(const Store &) = delete;
  Store &operator=(const Store &) = delete;
  std::string apply(const std::string &actor, const std::string &id, const std::string &payload,
                    const std::function<void(std::string_view)> &fault = {});
  std::string lookup(const std::string &actor, const std::string &id);
  Counts counts();
  int pragma(const char *name);

private:
  sqlite3 *db_{};
  std::mutex mutex_;
  bool poisoned_{};
  void exec(const char *sql);
};
} // namespace kidea
