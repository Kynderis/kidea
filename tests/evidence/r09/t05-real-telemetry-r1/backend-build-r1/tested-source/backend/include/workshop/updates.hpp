#pragma once
#include "store.hpp"
#include <chrono>
#include <deque>
#include <map>
namespace workshop {
struct UpdateEvent {
  std::int64_t id;
  std::string epoch, workshop, version;
};
// Own this connection on the same worker as Store. Never share sqlite handles
// with the HTTP/socket loops. Schema 1 already contains these obligations.
class UpdateJournal {
public:
  explicit UpdateJournal(const std::string &file);
  ~UpdateJournal();
  UpdateJournal(const UpdateJournal &) = delete;
  UpdateJournal &operator=(const UpdateJournal &) = delete;
  std::string metadata(const char *key);
  std::vector<UpdateEvent> pending();
  void complete(const std::vector<UpdateEvent> &events);
  void failed(const std::string &code, const std::vector<UpdateEvent> &events);

private:
  sqlite3 *db_{};
};
struct Subscription {
  std::string token, origin, csrf, actor, epoch, audience, workshop;
};
// All callers must revalidate before EVERY emit, including heartbeat. Invalid
// supplied credentials cannot fall back to anonymous public access.
bool updateAuthorized(Store &, UpdateJournal &, const Subscription &,
                      std::int64_t now);
std::optional<Json> updateSnapshot(Store &, UpdateJournal &,
                                   const Subscription &, std::int64_t now);
class UpdateCredit {
public:
  bool reserve(const std::string &receipt, std::size_t bytes);
  bool acknowledge(const std::string &receipt);
  std::size_t count() const { return pending_.size(); }
  std::size_t bytes() const { return bytes_; }

private:
  std::deque<std::pair<std::string, std::size_t>> pending_;
  std::size_t bytes_{};
};
class SocketQuota {
public:
  bool acquire(const std::string &key, bool authenticated);
  void release(const std::string &key);
  std::size_t count() const { return total_; }

private:
  std::map<std::string, std::size_t> owners_;
  std::size_t total_{};
};
class FrameRate {
public:
  using Clock = std::chrono::steady_clock;
  bool accept(Clock::time_point now = Clock::now());

private:
  double tokens_{10};
  Clock::time_point at_{Clock::now()};
};
} // namespace workshop
