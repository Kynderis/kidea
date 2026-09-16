#include <mutex>
#include <thread>
int main() {
  std::mutex mutex;
  int value = 0;
  auto increment = [&] {
    for (int i = 0; i < 1000; ++i) {
      std::lock_guard guard(mutex);
      ++value;
    }
  };
  std::thread a(increment), b(increment);
  a.join();
  b.join();
  return value == 2000 ? 0 : 1;
}
