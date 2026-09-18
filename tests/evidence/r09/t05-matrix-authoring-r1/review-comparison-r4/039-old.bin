#include "workshop/executor.hpp"
#include <cstdlib>
namespace workshop {
Executor::Executor(const std::string &file) {
  std::promise<void> started;
  auto result = started.get_future();
  thread_ = std::thread([this, file, started = std::move(started)]() mutable {
    try {
      Store store(file);
      started.set_value();
      for (;;) {
        Job job;
        {
          std::unique_lock lock(mutex_);
          wake_.wait(lock, [this] { return closing_ || !queue_.empty(); });
          if (queue_.empty() && closing_)
            break;
          auto entry = std::move(queue_.front());
          queue_.pop_front();
          if (entry.first)
            --writes_;
          job = std::move(entry.second);
        }
        // Jobs own their callbacks/request bytes; no request stack references.
        try {
          job(store);
        } catch (...) { /* caller job converts exceptions to UNKNOWN */
        }
      }
    } catch (...) {
      try {
        started.set_exception(std::current_exception());
      } catch (...) {
      }
    }
    {
      std::lock_guard lock(mutex_);
      done_ = true;
    }
    finished_.notify_all();
  });
  try {
    result.get();
  } catch (...) {
    thread_.join();
    throw;
  }
}
Executor::~Executor() {
  if (!drain(std::chrono::seconds(30)))
    std::_Exit(2);
  if (thread_.joinable())
    thread_.join();
}
bool Executor::submit(bool mutation, Job job) {
  std::lock_guard lock(mutex_);
  if (closing_ || done_ || queue_.size() >= 128 || (mutation && writes_ >= 64))
    return false;
  queue_.emplace_back(mutation, std::move(job));
  if (mutation)
    ++writes_;
  wake_.notify_one();
  return true;
}
bool Executor::drain(std::chrono::seconds duration) {
  std::unique_lock lock(mutex_);
  closing_ = true;
  wake_.notify_one();
  return finished_.wait_for(lock, duration, [this] { return done_; });
}
} // namespace workshop
