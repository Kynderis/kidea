#pragma once
#include <algorithm>
#include <chrono>
#include <map>
#include <mutex>
#include <string>
namespace workshop {
class Admission {
public:
  using Clock = std::chrono::steady_clock;
  bool global(Clock::time_point now = Clock::now()) {
    std::lock_guard lock(mutex_);
    return take(global_, now, 100, 200);
  }
  bool caller(const std::string &key, Clock::time_point now = Clock::now()) {
    std::lock_guard lock(mutex_);
    for (auto i = callers_.begin(); i != callers_.end();)
      if (now - i->second.at > std::chrono::minutes(2))
        i = callers_.erase(i);
      else
        ++i;
    auto i = callers_.find(key);
    if (i == callers_.end()) {
      if (callers_.size() >= 4096)
        return false;
      i = callers_.emplace(key, Bucket{40, now}).first;
    }
    return take(i->second, now, 20, 40);
  }

private:
  struct Bucket {
    double tokens;
    Clock::time_point at;
  };
  static bool take(Bucket &b, Clock::time_point now, double rate,
                   double burst) {
    b.tokens = std::min(
        burst,
        b.tokens +
            std::max(0.0, std::chrono::duration<double>(now - b.at).count()) *
                rate);
    b.at = now;
    if (b.tokens < 1)
      return false;
    --b.tokens;
    return true;
  }
  std::mutex mutex_;
  Bucket global_{200, Clock::now()};
  std::map<std::string, Bucket> callers_;
};
} // namespace workshop
