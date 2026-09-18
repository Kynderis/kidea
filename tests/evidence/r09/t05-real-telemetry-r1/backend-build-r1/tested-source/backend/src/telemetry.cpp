#include "workshop/telemetry.hpp"
#include <chrono>
#include <deque>
#include <limits>
namespace workshop {
namespace {
class Query {
  sqlite3_stmt *s_{};
  std::deque<std::string> strings_;

public:
  Query(sqlite3 *db, const char *sql) {
    if (sqlite3_prepare_v2(db, sql, -1, &s_, nullptr) != SQLITE_OK)
      throw StorageError("TELEMETRY_PREPARE");
  }
  ~Query() { sqlite3_finalize(s_); }
  Query(const Query &) = delete;
  Query &operator=(const Query &) = delete;
  void number(int i, std::int64_t n) {
    if (sqlite3_bind_int64(s_, i, n) != SQLITE_OK)
      throw StorageError("TELEMETRY_BIND");
  }
  void text(int i, const std::string &v) {
    strings_.push_back(v);
    const auto &owned = strings_.back();
    if (v.size() > static_cast<std::size_t>(std::numeric_limits<int>::max()) ||
        sqlite3_bind_text(s_, i, owned.data(), static_cast<int>(owned.size()),
                          SQLITE_STATIC) != SQLITE_OK)
      throw StorageError("TELEMETRY_BIND");
  }
  bool row() {
    const int r = sqlite3_step(s_);
    if (r == SQLITE_ROW)
      return true;
    if (r == SQLITE_DONE)
      return false;
    throw StorageError("TELEMETRY_STEP");
  }
  std::int64_t number(int i) const { return sqlite3_column_int64(s_, i); }
  std::string text(int i) const {
    const auto *v = sqlite3_column_text(s_, i);
    if (!v)
      throw StorageError("TELEMETRY_NULL");
    return {reinterpret_cast<const char *>(v),
            static_cast<std::size_t>(sqlite3_column_bytes(s_, i))};
  }
};
void done(Query &q) {
  if (q.row())
    throw StorageError("TELEMETRY_ROW");
}
Json unknown() {
  Json j;
  j["state"] = "UNKNOWN";
  return j;
}
} // namespace
std::int64_t telemetryNow() {
  return std::chrono::duration_cast<std::chrono::milliseconds>(
             std::chrono::system_clock::now().time_since_epoch())
      .count();
}
bool telemetryProfile(sqlite3 *db) {
  Query q(db, "SELECT value FROM metadata WHERE key='telemetry_profile'");
  return q.row() && q.text(0) == "outbox-telemetry-r1";
}
void telemetryCreated(sqlite3 *db, std::int64_t event) {
  if (!telemetryProfile(db))
    return;
  Query q(db,
          "INSERT INTO outbox_timing(outbox_id,transaction_at_ms) VALUES(?,?)");
  q.number(1, event);
  q.number(2, telemetryNow());
  done(q);
}
void telemetryObserved(sqlite3 *db, const std::vector<std::int64_t> &events) {
  if (!telemetryProfile(db) || events.empty())
    return;
  const auto at = telemetryNow();
  for (const auto id : events) {
    Query q(db,
            "UPDATE outbox_timing SET first_observed_at_ms=? WHERE outbox_id=? "
            "AND first_observed_at_ms IS NULL AND transaction_at_ms<=? AND "
            "EXISTS(SELECT 1 FROM outbox WHERE id=? AND completed=0)");
    q.number(1, at);
    q.number(2, id);
    q.number(3, at);
    q.number(4, id);
    done(q);
  }
}
void telemetryProcessed(sqlite3 *db, const std::vector<std::int64_t> &events) {
  if (!telemetryProfile(db))
    return;
  const auto at = telemetryNow();
  for (const auto id : events) {
    Query q(db, "INSERT INTO outbox_processing(outbox_id,processed_at_ms) "
                "SELECT id,? FROM outbox WHERE id=? AND completed=1 ON "
                "CONFLICT(outbox_id) DO NOTHING");
    q.number(1, at);
    q.number(2, id);
    done(q);
    Query resolve(
        db, "UPDATE processing_errors SET resolved_at_ms=? WHERE outbox_id=? "
            "AND code='PROCESSING' AND resolved_at_ms IS NULL AND "
            "EXISTS(SELECT 1 FROM outbox WHERE id=? AND completed=1)");
    resolve.number(1, at);
    resolve.number(2, id);
    resolve.number(3, id);
    done(resolve);
  }
  // A successful complete processing cycle reconciles an earlier source-read
  // failure. Critical/reconciliation incidents require a separate checked path.
  Query source(db,
               "UPDATE processing_errors SET resolved_at_ms=? WHERE "
               "outbox_id=0 AND code='PROCESSING' AND resolved_at_ms IS NULL");
  source.number(1, at);
  done(source);
}
void telemetryFailed(sqlite3 *db, const std::string &code,
                     const std::vector<std::int64_t> &events) {
  if (!telemetryProfile(db))
    return;
  if (code != "PROCESSING" && code != "RECONCILE" && code != "INVARIANT")
    throw StorageError("TELEMETRY_CODE");
  const auto ids = events.empty() ? std::vector<std::int64_t>{0} : events;
  for (const auto id : ids) {
    Query q(db, "INSERT INTO processing_errors(outbox_id,code,first_seen_ms) "
                "SELECT ?,?,? WHERE ?=0 OR EXISTS(SELECT 1 FROM outbox WHERE "
                "id=? AND completed=0) ON CONFLICT(outbox_id,code) DO UPDATE "
                "SET resolved_at_ms=NULL");
    q.number(1, id);
    q.text(2, code);
    q.number(3, telemetryNow());
    q.number(4, id);
    q.number(5, id);
    done(q);
  }
}
Json telemetrySnapshot(sqlite3 *db, bool processingConfirmed) {
  Json result;
  const auto now = telemetryNow();
  result["schema"] = 1;
  result["sampledAtMs"] = static_cast<::Json::Int64>(now);
  result["profile"] = "outbox-telemetry-r1";
  result["writeReady"] = false;
  result["unknown"] = Json(::Json::arrayValue);
  for (const char *id :
       {"M3", "M5", "M6", "M7", "M8", "M9", "BACKEND_ADMISSION_NOT_WIRED"})
    result["unknown"].append(id);
  auto &m1 = result["signals"]["M1"];
  m1 = unknown();
  try {
    Query q(db, "SELECT count(*) FROM outbox WHERE completed=0");
    if (!q.row())
      throw StorageError("TELEMETRY_COUNT");
    const auto count = q.number(0);
    m1["pending"] = static_cast<::Json::Int64>(count);
    m1["countState"] = "KNOWN";
    m1["oldestAgeUpperMs"] = Json{};
    m1["oldestAgeLowerMs"] = Json{};
    if (count == 0) {
      m1["state"] = "KNOWN";
      m1["ageBasis"] = "EMPTY_NA";
    } else if (telemetryProfile(db)) {
      Query age(db, "SELECT "
                    "count(t.outbox_id),min(t.transaction_at_ms),max(t."
                    "transaction_at_ms),min(t.first_observed_at_ms),max(t."
                    "first_observed_at_ms) FROM outbox o LEFT JOIN "
                    "outbox_timing t ON t.outbox_id=o.id WHERE o.completed=0");
      if (!age.row())
        throw StorageError("TELEMETRY_AGE");
      if (age.number(0) == count && age.number(1) >= 0 &&
          age.number(2) <= now) {
        m1["state"] = "BOUNDED";
        m1["ageBasis"] = "TRANSACTION_START_UPPER_BOUND";
        m1["oldestAgeUpperMs"] =
            static_cast<::Json::Int64>(now - age.number(1));
        // Any witnessed committed row provides a lower bound on the age of
        // the oldest pending obligation. Unwitnessed rows cannot be guessed.
        if (age.number(3) <= now && age.number(3) > 0)
          m1["oldestAgeLowerMs"] =
              static_cast<::Json::Int64>(now - age.number(3));
      }
    }
  } catch (...) { /* Never replace an unknown count with zero. */
  }
  auto &m2 = result["signals"]["M2"];
  m2 = unknown();
  m2["open"] = Json(::Json::arrayValue);
  auto &m4 = result["signals"]["M4"];
  m4 = unknown();
  if (telemetryProfile(db)) {
    try {
      Query q(db,
              "SELECT code,count(*),min(first_seen_ms) FROM processing_errors "
              "WHERE resolved_at_ms IS NULL GROUP BY code ORDER BY code");
      Json open(::Json::arrayValue);
      while (q.row()) {
        Json e;
        e["code"] = q.text(0);
        e["count"] = static_cast<::Json::Int64>(q.number(1));
        e["firstSeenMs"] = static_cast<::Json::Int64>(q.number(2));
        open.append(e);
      }
      m2["open"] = open;
      m2["catalogState"] = "KNOWN";
      m2["state"] = processingConfirmed ? "KNOWN" : "UNKNOWN";
    } catch (...) {
    }
    try {
      Query q(db,
              "SELECT p.processed_at_ms,o.epoch,o.workshop,o.version FROM "
              "outbox_processing p JOIN outbox o ON o.id=p.outbox_id AND "
              "o.completed=1 WHERE o.epoch=(SELECT value FROM metadata WHERE "
              "key='epoch') ORDER BY p.processed_at_ms DESC,o.id DESC LIMIT 1");
      m4["lastSuccess"] = Json{};
      if (q.row()) {
        auto &v = m4["lastSuccess"];
        v["atMs"] = static_cast<::Json::Int64>(q.number(0));
        v["epoch"] = q.text(1);
        v["workshop"] = q.text(2);
        v["version"] = q.text(3);
      }
      m4["state"] = "KNOWN";
      m4["timeBasis"] = "PROCESSING_TRANSACTION_TIME";
    } catch (...) {
      m4 = unknown();
    }
  }
  return result;
}
} // namespace workshop
