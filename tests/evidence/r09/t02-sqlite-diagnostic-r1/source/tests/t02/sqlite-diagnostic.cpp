// Diagnostic only: intentionally racy control is never linked into the app.
#include <array>
#include <barrier>
#include <exception>
#include <filesystem>
#include <iostream>
#include <sqlite3.h>
#include <stdexcept>
#include <string>
#include <thread>

namespace {
int deliberatelyRacy = 0;
struct Db {
  sqlite3 *db = nullptr;
  explicit Db(const std::string &path) {
    if (sqlite3_open_v2(path.c_str(), &db,
                        SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE |
                            SQLITE_OPEN_FULLMUTEX,
                        nullptr) != SQLITE_OK)
      throw std::runtime_error("open");
    if (sqlite3_busy_timeout(db, 5000) != SQLITE_OK)
      throw std::runtime_error("busy timeout");
  }
  ~Db() {
    if (db)
      sqlite3_close(db);
  }
  Db(const Db &) = delete;
  Db &operator=(const Db &) = delete;
  void exec(const char *sql) {
    if (sqlite3_exec(db, sql, nullptr, nullptr, nullptr) != SQLITE_OK)
      throw std::runtime_error(sqlite3_errmsg(db));
  }
  std::string scalar(const char *sql) {
    sqlite3_stmt *stmt = nullptr;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK)
      throw std::runtime_error("prepare");
    if (sqlite3_step(stmt) != SQLITE_ROW) {
      sqlite3_finalize(stmt);
      throw std::runtime_error("step");
    }
    const auto *text = sqlite3_column_text(stmt, 0);
    const std::string value = text ? reinterpret_cast<const char *>(text) : "";
    if (sqlite3_finalize(stmt) != SQLITE_OK)
      throw std::runtime_error("finalize");
    return value;
  }
};
void writes(Db &db) {
  for (int i = 0; i < 50; ++i) {
    db.exec("BEGIN IMMEDIATE");
    db.exec("UPDATE counter SET value=value+1");
    db.exec("COMMIT");
  }
}
} // namespace
int main(int argc, char **argv) {
  try {
    if (argc != 3)
      throw std::runtime_error("mode and new database path required");
    const std::string mode = argv[1];
    if (mode == "detector-control") {
      std::barrier gate(3);
      auto race = [&gate] {
        gate.arrive_and_wait();
        for (int i = 0; i < 10000; ++i)
          deliberatelyRacy += 1;
      };
      std::thread a(race), b(race);
      gate.arrive_and_wait();
      a.join();
      b.join();
      std::cout << "CONTROL_NO_DETECTION value=" << deliberatelyRacy << '\n';
      return 2;
    }
    if (mode != "wal-parallel" && mode != "delete-parallel" &&
        mode != "wal-serial")
      throw std::runtime_error("unknown mode");
    if (std::filesystem::exists(argv[2]))
      throw std::runtime_error("CREATE_ONLY");
    Db owner(argv[2]);
    const std::string journal = mode == "delete-parallel" ? "delete" : "wal";
    const std::string pragma = "PRAGMA journal_mode=" + journal;
    if (owner.scalar(pragma.c_str()) != journal)
      throw std::runtime_error("journal mismatch");
    owner.exec("PRAGMA synchronous=FULL");
    owner.exec("CREATE TABLE counter(value INTEGER NOT NULL) STRICT");
    owner.exec("INSERT INTO counter VALUES(0)");
    Db first(argv[2]), second(argv[2]);
    first.exec("PRAGMA synchronous=FULL");
    second.exec("PRAGMA synchronous=FULL");
    std::cout << "mode=" << mode << " sqlite=" << sqlite3_libversion()
              << " journal=" << journal
              << " threadsafe=" << sqlite3_threadsafe() << '\n'
              << std::flush;
    if (mode == "wal-serial") {
      writes(first);
      writes(second);
    } else {
      std::barrier gate(3);
      std::array<std::exception_ptr, 2> errors{};
      auto work = [&gate](Db &db, std::exception_ptr &error) {
        gate.arrive_and_wait();
        try {
          writes(db);
        } catch (...) {
          error = std::current_exception();
        }
      };
      std::thread a(work, std::ref(first), std::ref(errors[0]));
      std::thread b(work, std::ref(second), std::ref(errors[1]));
      gate.arrive_and_wait();
      a.join();
      b.join();
      for (const auto &error : errors)
        if (error)
          std::rethrow_exception(error);
    }
    if (owner.scalar("SELECT value FROM counter") != "100" ||
        owner.scalar("PRAGMA quick_check") != "ok")
      throw std::runtime_error("data invariant");
    std::cout << "DIAGNOSTIC_INVARIANTS_OK count=100 quick_check=ok\n";
    return 0;
  } catch (const std::exception &error) {
    std::cerr << "DIAGNOSTIC_ERROR " << error.what() << '\n';
    return 1;
  }
}
