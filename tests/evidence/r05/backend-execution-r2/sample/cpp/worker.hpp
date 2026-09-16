#pragma once
#include <condition_variable>
#include <deque>
#include <functional>
#include <mutex>
#include <thread>
namespace kidea {
class Worker {
public:
  explicit Worker(std::size_t capacity = 64)
      : capacity_(capacity), thread_([this] { run(); }) {}
  ~Worker() {
    close();
    thread_.join();
  }
  Worker(const Worker &) = delete;
  Worker &operator=(const Worker &) = delete;
  bool submit(std::function<void()> work) {
    std::lock_guard guard(mutex_);
    if (closed_ || queue_.size() >= capacity_)
      return false;
    queue_.push_back(std::move(work));
    ready_.notify_one();
    return true;
  }
  void close() {
    std::lock_guard guard(mutex_);
    closed_ = true;
    ready_.notify_all();
  }
  std::size_t pending() {
    std::lock_guard guard(mutex_);
    return queue_.size() + active_;
  }

private:
  void run() {
    for (;;) {
      std::function<void()> task;
      {
        std::unique_lock lock(mutex_);
        ready_.wait(lock, [this] { return closed_ || !queue_.empty(); });
        if (queue_.empty())
          return;
        task = std::move(queue_.front());
        queue_.pop_front();
        active_ = 1;
      }
      task();
      {
        std::lock_guard guard(mutex_);
        active_ = 0;
      }
    }
  }
  std::size_t capacity_;
  std::mutex mutex_;
  std::condition_variable ready_;
  std::deque<std::function<void()>> queue_;
  bool closed_{};
  std::size_t active_{};
  std::thread thread_;
};
} // namespace kidea
