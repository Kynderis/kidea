#pragma once
#include "model.hpp"
#include <chrono>
#include <functional>
#include <optional>
#include <sqlite3.h>
namespace workshop {
class Store {
public:
  explicit Store(const std::string &file);
  ~Store();
  Store(const Store &) = delete;
  Store &operator=(const Store &) = delete;
  static void initialize(const std::string &file, const std::string &schema,
                         const Json &seed);
  void processingConfirmed(bool value) { processingConfirmed_ = value; }
  std::string rateKey(const std::string &token, std::int64_t now,
                      const std::string &peer);
  Response handle(const std::string &method, const std::string &route,
                  const std::string &token, const std::string &csrf,
                  const std::string &origin, const Json &input,
                  std::int64_t now);
#ifdef WORKSHOP_TESTING
  void rejectCommit(bool on) {
    sqlite3_commit_hook(db_, on ? +[](void *) -> int { return 1; } : nullptr,
                        nullptr);
  }
  void denyResultRead(bool on) {
    sqlite3_set_authorizer(db_, on ? +[](void*,int op,const char* table,const char*,const char*,const char*) -> int { return op==SQLITE_READ && table && std::string_view(table)=="request_results" ? SQLITE_DENY : SQLITE_OK; } : nullptr,nullptr);
  }
  void fault(std::function<void(std::string_view)> hook) {
    hook_ = std::move(hook);
  }
#endif
private:
  sqlite3 *db_{};
  bool processingConfirmed_{};
  std::int64_t received_{};
  std::chrono::steady_clock::time_point started_{};
#ifdef WORKSHOP_TESTING
  std::function<void(std::string_view)> hook_;
#endif
  void point(std::string_view);
  void exec(const char *);
  std::string meta(const char *);
  std::optional<Identity> identity(const std::string &, const std::string &,
                                   const std::string &, bool, std::int64_t);
  std::optional<Json> workshop(const std::string &, bool);
  Response read(const std::string &, const std::optional<Identity> &);
  Response mutate(const std::string &, const Json &, const Identity &);
  Response registration(const std::string &, const Json &, const Identity &);
  Response admin(const Json &, const Identity &);
  Response remembered(const std::string &, const std::string &,
                      const std::string &, const std::string &,
                      const std::string &);
  void remember(const std::string &, const std::string &, const std::string &,
                const std::string &, const std::string &, const Response &);
  void changed(const std::string &);
};
} // namespace workshop
