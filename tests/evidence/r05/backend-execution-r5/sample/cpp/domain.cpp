#include "domain.hpp"
#include <array>
#include <cmark.h>
#include <limits>

namespace kidea {
std::recursive_mutex Store::mutex_;
bool valid_version(std::string_view value) {
  if (value.empty() || value.size() > 20 || (value.size() > 1 && value.front() == '0'))
    return false;
  std::uint64_t number = 0;
  for (char c : value) {
    if (c < '0' || c > '9')
      return false;
    const auto digit = static_cast<std::uint64_t>(c - '0');
    if (number > (std::numeric_limits<std::uint64_t>::max() - digit) / 10)
      return false;
    number = number * 10 + digit;
  }
  return true;
}
std::size_t utf8_count(std::string_view value) {
  std::size_t count = 0;
  for (std::size_t i = 0; i < value.size();) {
    const auto first = static_cast<unsigned char>(value[i]);
    std::size_t width = 0;
    std::uint32_t point = 0;
    if (first < 0x80) {
      width = 1;
      point = first;
    } else if (first >= 0xc2 && first <= 0xdf) {
      width = 2;
      point = first & 0x1fU;
    } else if (first >= 0xe0 && first <= 0xef) {
      width = 3;
      point = first & 0x0fU;
    } else if (first >= 0xf0 && first <= 0xf4) {
      width = 4;
      point = first & 0x07U;
    } else
      throw std::invalid_argument("Invalid UTF-8");
    if (i + width > value.size())
      throw std::invalid_argument("Truncated UTF-8");
    for (std::size_t j = 1; j < width; ++j) {
      const auto c = static_cast<unsigned char>(value[i + j]);
      if ((c & 0xc0U) != 0x80U)
        throw std::invalid_argument("Invalid continuation");
      point = (point << 6U) | (c & 0x3fU);
    }
    if ((width == 2 && point < 0x80) || (width == 3 && point < 0x800) ||
        (width == 4 && point < 0x10000) || point > 0x10ffff ||
        (point >= 0xd800 && point <= 0xdfff) || point == 0)
      throw std::invalid_argument("Invalid code point");
    i += width;
    ++count;
  }
  return count;
}
bool plain_text(std::string_view value, std::size_t maximum, bool title) {
  const auto start = value.find_first_not_of(" \t\r\n");
  if (start == std::string_view::npos)
    return false;
  value = value.substr(start, value.find_last_not_of(" \t\r\n") - start + 1);
  try {
    if (utf8_count(value) > maximum)
      return false;
  } catch (const std::invalid_argument &) {
    return false;
  }
  if (title && value.find_first_of("\r\n") != std::string_view::npos)
    return false;
  const auto parser = std::unique_ptr<cmark_parser, decltype(&cmark_parser_free)>(
      cmark_parser_new(CMARK_OPT_DEFAULT), cmark_parser_free);
  cmark_parser_feed(parser.get(), value.data(), value.size());
  const auto node = std::unique_ptr<cmark_node, decltype(&cmark_node_free)>(
      cmark_parser_finish(parser.get()), cmark_node_free);
  if (cmark_parser_has_reference_definition(parser.get()))
    return false;
  const auto iter = std::unique_ptr<cmark_iter, decltype(&cmark_iter_free)>(
      cmark_iter_new(node.get()), cmark_iter_free);
  while (cmark_iter_next(iter.get()) != CMARK_EVENT_DONE) {
    const auto type = cmark_node_get_type(cmark_iter_get_node(iter.get()));
    if (type != CMARK_NODE_DOCUMENT && type != CMARK_NODE_PARAGRAPH && type != CMARK_NODE_TEXT &&
        type != CMARK_NODE_SOFTBREAK)
      return false;
  }
  return true;
}
namespace {
class Statement {
public:
  sqlite3_stmt *value{};
  Statement(sqlite3 *db, const char *sql) {
    if (sqlite3_prepare_v2(db, sql, -1, &value, nullptr) != SQLITE_OK)
      throw DatabaseError("prepare failed");
  }
  ~Statement() { sqlite3_finalize(value); }
  Statement(const Statement &) = delete;
  Statement &operator=(const Statement &) = delete;
  void bind(int index, const std::string &data) {
    if (data.size() > static_cast<std::size_t>(std::numeric_limits<int>::max()) ||
        sqlite3_bind_text(value, index, data.data(), static_cast<int>(data.size()),
                          // R05-TIDY-01: SQLite 3.53.4 API copy-lifetime sentinel.
                          // NOLINTNEXTLINE(performance-no-int-to-ptr)
                          SQLITE_TRANSIENT) != SQLITE_OK)
      throw DatabaseError("bind failed");
  }
  void done() {
    if (sqlite3_step(value) != SQLITE_DONE)
      throw DatabaseError("step failed");
  }
};
} // namespace
void Store::exec(const char *sql) {
  if (sqlite3_exec(db_, sql, nullptr, nullptr, nullptr) != SQLITE_OK)
    throw DatabaseError("exec failed");
}
Store::Store(const std::string &file) {
  std::lock_guard guard(mutex_);
  if (sqlite3_open(file.c_str(), &db_) != SQLITE_OK) {
    sqlite3_close(db_);
    db_ = nullptr;
    throw DatabaseError("open failed");
  }
  try {
    if (sqlite3_busy_timeout(db_, 100) != SQLITE_OK)
      throw DatabaseError("busy timeout failed");
    exec("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA "
         "foreign_keys=ON;");
    if (pragma("synchronous") != 2 || pragma("foreign_keys") != 1)
      throw DatabaseError("PRAGMA mismatch");
    Statement mode(db_, "PRAGMA journal_mode");
    if (sqlite3_step(mode.value) != SQLITE_ROW ||
        std::string(reinterpret_cast<const char *>(sqlite3_column_text(mode.value, 0))) != "wal")
      throw DatabaseError("WAL missing");
    exec("CREATE TABLE IF NOT EXISTS domain(id TEXT PRIMARY KEY,actor TEXT NOT "
         "NULL,value TEXT NOT NULL);CREATE TABLE IF NOT EXISTS results(id TEXT "
         "PRIMARY KEY,actor TEXT NOT NULL,payload TEXT NOT NULL,result TEXT "
         "NOT NULL);CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY,actor "
         "TEXT NOT NULL);CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY "
         "KEY,actor TEXT NOT NULL);");
  } catch (...) {
    sqlite3_close(db_);
    db_ = nullptr;
    throw;
  }
}
Store::~Store() {
  std::lock_guard guard(mutex_);
  sqlite3_close(db_);
}
int Store::pragma(const char *name) {
  std::lock_guard guard(mutex_);
  const std::string sql = std::string("PRAGMA ") + name;
  Statement s(db_, sql.c_str());
  if (sqlite3_step(s.value) != SQLITE_ROW)
    throw DatabaseError("PRAGMA read failed");
  return sqlite3_column_int(s.value, 0);
}
std::string Store::apply(const std::string &actor, const std::string &id,
                         const std::string &payload,
                         const std::function<void(std::string_view)> &fault) {
  std::lock_guard guard(mutex_);
  if (poisoned_)
    return "UNKNOWN";
  bool transaction = false;
  auto checkpoint = [&](std::string_view at) {
    if (fault)
      fault(at);
  };
  try {
    checkpoint("prepare");
    exec("BEGIN IMMEDIATE");
    transaction = true;
    Statement prior(db_, "SELECT actor,payload,result FROM results WHERE id=?");
    prior.bind(1, id);
    const int row = sqlite3_step(prior.value);
    if (row == SQLITE_ROW) {
      const auto text = [&](int column) {
        return std::string(
            reinterpret_cast<const char *>(sqlite3_column_text(prior.value, column)));
      };
      const std::string result = (text(0) == actor && text(1) == payload) ? text(2) : "CONFLICT";
      exec("ROLLBACK");
      transaction = false;
      return result;
    }
    if (row != SQLITE_DONE)
      throw DatabaseError("read result failed");
    const std::array<const char *, 4> sql = {
        "INSERT INTO domain VALUES(?,?,?)", "INSERT INTO results VALUES(?,?,?,'SUCCESS')",
        "INSERT INTO audit VALUES(?,?)", "INSERT INTO outbox VALUES(?,?)"};
    const std::array<std::string_view, 4> stages = {"domain", "result", "audit", "outbox"};
    for (std::size_t i = 0; i < sql.size(); ++i) {
      checkpoint(stages[i]);
      Statement write(db_, sql[i]);
      write.bind(1, id);
      write.bind(2, actor);
      if (i < 2)
        write.bind(3, payload);
      checkpoint("step");
      write.done();
    }
    checkpoint("commit");
    exec("COMMIT");
    transaction = false;
    checkpoint("after-commit");
    return "SUCCESS";
  } catch (...) {
    if (transaction) {
      try {
        checkpoint("rollback");
        exec("ROLLBACK");
      } catch (...) {
        poisoned_ = true;
        const int rollback = sqlite3_exec(db_, "ROLLBACK", nullptr, nullptr, nullptr);
        if (rollback != SQLITE_OK)
          poisoned_ = true;
      }
    }
    return "UNKNOWN";
  }
}
std::string Store::lookup(const std::string &actor, const std::string &id) {
  std::lock_guard guard(mutex_);
  Statement s(db_, "SELECT result FROM results WHERE actor=? AND id=?");
  s.bind(1, actor);
  s.bind(2, id);
  const int rc = sqlite3_step(s.value);
  if (rc == SQLITE_DONE)
    return "UNKNOWN";
  if (rc != SQLITE_ROW)
    throw DatabaseError("lookup failed");
  return reinterpret_cast<const char *>(sqlite3_column_text(s.value, 0));
}
Counts Store::counts() {
  std::lock_guard guard(mutex_);
  std::array<int, 4> result{};
  const std::array<const char *, 4> sql = {
      "SELECT count(*) FROM domain", "SELECT count(*) FROM results", "SELECT count(*) FROM audit",
      "SELECT count(*) FROM outbox"};
  for (std::size_t i = 0; i < sql.size(); ++i) {
    Statement s(db_, sql[i]);
    if (sqlite3_step(s.value) != SQLITE_ROW)
      throw DatabaseError("count failed");
    result[i] = sqlite3_column_int(s.value, 0);
  }
  return {result[0], result[1], result[2], result[3]};
}
} // namespace kidea
