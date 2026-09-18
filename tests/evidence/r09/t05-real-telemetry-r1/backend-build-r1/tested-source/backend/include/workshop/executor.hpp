#pragma once
#include "store.hpp"
#include <condition_variable>
#include <deque>
#include <future>
#include <mutex>
#include <thread>
namespace workshop {
class Executor {
public:
  using Job = std::function<void(Store &)>;
  explicit Executor(const std::string &file);
  ~Executor();
  Executor(const Executor &) = delete;
  Executor &operator=(const Executor &) = delete;
  bool submit(bool mutation, Job);
  bool drain(std::chrono::seconds);

private:
  std::mutex mutex_;
  std::condition_variable wake_, finished_;
  std::deque<std::pair<bool, Job>> queue_;
  std::size_t writes_{};
  bool closing_{}, done_{};
  std::thread thread_;
};
} // namespace workshop
