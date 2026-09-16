#include "domain.hpp"
#include "input.hpp"
#include <atomic>
#include <barrier>
#include <chrono>
#include <filesystem>
#include <future>
#include <iostream>
#include <sys/wait.h>
#include <thread>
#include <unistd.h>

namespace {
void require(bool condition, const char *message) {
  if (!condition)
    throw std::runtime_error(message);
}
std::string db_file() {
  static std::atomic<unsigned> sequence{0};
  return "/tmp/kidea-" + std::to_string(getpid()) + "-" +
         std::to_string(sequence++) + ".db";
}
void grammar() {
  for (const std::string text :
       {"Lớp học thủ công", "C++ & C#", "2 * 3 < 10", "a_b_c",
        "https://example.test", "😀", "é", "first\nsecond", "one\n\ntwo",
        "a &amp; b", "\\*literal\\*"})
    require(kidea::plain_text(text, 5000, false),
            ("plain vector: " + text).c_str());
  for (const std::string text :
       {"<b>abc</b>", "**abc**", "_abc_", "[abc](https://example.test)",
        "# Tiêu đề", "- mục", "```\ncode\n```", "<!-- x -->",
        "<https://example.test>", "[x]: https://example.test",
        "[x]:\n  https://example.test", "[x]: /one\n[x]: /two", "a  \nb",
        "a\\\nb"})
    require(!kidea::plain_text(text, 5000, false),
            ("markup vector: " + text).c_str());
  require(kidea::plain_text(std::string(120, 'a'), 120, true), "title120");
  require(!kidea::plain_text(std::string(121, 'a'), 120, true), "title121");
  require(kidea::plain_text(std::string(5000, 'a'), 5000, false),
          "description5000");
  require(!kidea::plain_text(std::string(5001, 'a'), 5000, false),
          "description5001");
  require(!kidea::plain_text(" \r\n\t ", 120, true), "empty");
  require(!kidea::plain_text("a\r\nb", 120, true), "title newline");
}
void unicode() {
  require(kidea::decode_json("{\"value\":\"safe\"}").has_value(), "valid JSON");
  for (const std::string text : {"{\"value\":1,\"value\":2}", "{\"x\":1,}",
                                 "{} extra", "[]", "{\"x\":NaN}"})
    require(!kidea::decode_json(text).has_value(), "malformed JSON accepted");
  require(kidea::utf8_count("😀") == 1, "emoji count");
  require(kidea::utf8_count("é") == 2, "combining not normalized");
  for (const auto &text :
       {std::string("\xc0\xaf", 2), std::string("\xed\xa0\x80", 3),
        std::string("\xf4\x90\x80\x80", 4), std::string("\xf0\x9f", 2),
        std::string("\0", 1)})
    require(!kidea::plain_text(text, 120, true), "malformed UTF8 accepted");
  for (const std::string v : {"0", "1", "18446744073709551615"})
    require(kidea::valid_version(v), "valid version");
  for (const std::string v :
       {"", "01", "-1", "1.0", "1e2", "18446744073709551616",
        "99999999999999999999999"})
    require(!kidea::valid_version(v), "invalid version accepted");
}
void atomicity() {
  for (const std::string stage :
       {"prepare", "domain", "result", "audit", "outbox", "step", "commit"}) {
    kidea::Store store(db_file());
    const auto result =
        store.apply("A", "id", "payload", [&](std::string_view at) {
          if (at == stage)
            throw kidea::DatabaseError("injected");
        });
    require(result == "UNKNOWN", "fault incorrectly FINAL");
    require(store.counts() == kidea::Counts{0, 0, 0, 0}, "partial transaction");
  }
  kidea::Store store(db_file());
  require(store.apply("A", "id", "payload") == "SUCCESS", "write");
  require(store.counts() == kidea::Counts{1, 1, 1, 1}, "atomic four writes");
  require(store.apply("A", "id", "payload") == "SUCCESS", "idempotency");
  require(store.apply("B", "id", "payload") == "CONFLICT", "actor conflict");
  require(store.apply("A", "id", "different") == "CONFLICT",
          "payload conflict");
  require(store.lookup("B", "id") == "UNKNOWN", "result actor leak");
  require(store.counts() == kidea::Counts{1, 1, 1, 1}, "repeated write");
}
void rollback() {
  kidea::Store store(db_file());
  const auto result =
      store.apply("A", "id", "payload", [](std::string_view at) {
        if (at == "commit" || at == "rollback")
          throw kidea::DatabaseError("injected");
      });
  require(result == "UNKNOWN", "rollback not UNKNOWN");
  require(store.apply("A", "next", "payload") == "UNKNOWN",
          "poisoned connection reused");
  require(store.counts() == kidea::Counts{0, 0, 0, 0}, "rollback state");
}
void sql() {
  kidea::Store store(db_file());
  require(store.apply("A'", "x'); DROP TABLE results;--", "quote';--") ==
              "SUCCESS",
          "bound input");
  require(store.counts() == kidea::Counts{1, 1, 1, 1}, "SQL injection");
  require(store.pragma("foreign_keys") == 1 && store.pragma("synchronous") == 2,
          "PRAGMA state");
}
void concurrency() {
  const auto file = db_file();
  kidea::Store first(file), second(file);
  std::barrier start(3);
  std::string a, b;
  std::thread one([&] {
    start.arrive_and_wait();
    a = first.apply("A", "one", "text");
  });
  std::thread two([&] {
    start.arrive_and_wait();
    b = second.apply("A", "two", "text");
  });
  start.arrive_and_wait();
  one.join();
  two.join();
  require(a == "SUCCESS" && b == "SUCCESS", "writer contention");
  require(first.counts() == kidea::Counts{2, 2, 2, 2}, "lost write");
}
void crash() {
  for (const std::string stage :
       {"domain", "result", "audit", "outbox", "commit", "after-commit"}) {
    const auto file = db_file();
    { kidea::Store initialize(file); }
    const auto child = fork();
    require(child >= 0, "fork");
    if (child == 0) {
      kidea::Store store(file);
      store.apply("A", "id", "text", [&](std::string_view at) {
        if (at == stage)
          _exit(23);
      });
      _exit(24);
    }
    int status = 0;
    require(waitpid(child, &status, 0) == child, "waitpid");
    require(WIFEXITED(status) && WEXITSTATUS(status) == 23,
            "fault point not reached");
    kidea::Store reopened(file);
    const int expected = stage == "after-commit" ? 1 : 0;
    require(reopened.counts() ==
                kidea::Counts{expected, expected, expected, expected},
            "crash atomicity");
  }
}
void lifetime() {
  std::function<int()> delayed;
  {
    const auto value = std::make_shared<int>(42);
    delayed = [value] { return *value; };
  }
  require(std::async(std::launch::async, delayed).get() == 42,
          "callback lifetime");
  std::weak_ptr<int> weak;
  {
    const auto value = std::make_shared<int>(7);
    weak = value;
    std::function<int()> cancelled = [value] { return *value; };
    cancelled = {};
  }
  require(weak.expired(), "cancel resource leak");
}
} // namespace
int main(int argc, char **argv) {
  try {
    require(argc == 2, "test name");
    const std::string name = argv[1];
    if (name == "grammar")
      grammar();
    else if (name == "unicode")
      unicode();
    else if (name == "atomicity")
      atomicity();
    else if (name == "rollback")
      rollback();
    else if (name == "sql")
      sql();
    else if (name == "concurrency")
      concurrency();
    else if (name == "crash")
      crash();
    else if (name == "lifetime")
      lifetime();
    else
      throw std::runtime_error("unknown test");
    std::cout << name << " PASS\n";
    return 0;
  } catch (const std::exception &e) {
    std::cerr << e.what() << '\n';
    return 1;
  }
}
