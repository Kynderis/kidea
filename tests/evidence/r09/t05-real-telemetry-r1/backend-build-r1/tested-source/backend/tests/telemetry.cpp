#include "workshop/updates.hpp"
#include <cstdlib>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <iterator>
#include <unistd.h>
namespace {
unsigned checks{};
void check(bool value, const std::string &name) {
  workshop::Json j;
  j["caseId"] = "TELEMETRY";
  j["variant"] = name;
  j["status"] = value ? "PASS" : "FAIL";
  std::cout << workshop::dump(j) << '\n' << std::flush;
  if (!value)
    throw std::runtime_error(name);
  ++checks;
}
void sql(const std::string &file, const char *s) {
  sqlite3 *db{};
  if (sqlite3_open(file.c_str(), &db) != SQLITE_OK)
    throw std::runtime_error("OPEN");
  const auto r = sqlite3_exec(db, s, nullptr, nullptr, nullptr);
  sqlite3_close(db);
  if (r != SQLITE_OK)
    throw std::runtime_error("SQL");
}
workshop::Json sample(workshop::Store &store,
                      const std::string &token = "FAKE-A") {
  const auto r = store.handle("GET", "/admin/operations", token, "", "",
                              workshop::Json{}, 1800000000);
  check(r.status == 200, "admin-read");
  return r.body;
}
} // namespace
int main() {
  try {
    const char *root = std::getenv("WORKSHOP_CASE_ROOT");
    if (!root)
      throw std::runtime_error("OUTPUT_REQUIRED");
    const auto dir =
        std::filesystem::path(root) / ("telemetry-" + std::to_string(getpid()));
    if (!std::filesystem::create_directory(dir))
      throw std::runtime_error("CREATE_ONLY");
    const auto file = (dir / "db.sqlite").string();
    std::ifstream schema(WORKSHOP_SCHEMA);
    const std::string text{std::istreambuf_iterator<char>(schema), {}};
    const auto seed = workshop::decode(
        R"({"epoch":"E","origin":"https://workshop.test","sessions":[{"actor":"A","token":"FAKE-A","csrf":"FAKE-CSRF-A","participant":false,"admin":true,"expires":4102444800},{"actor":"U","token":"FAKE-U","csrf":"FAKE-CSRF-U","participant":true,"admin":false,"expires":4102444800}]})");
    workshop::Store::initialize(file, text, seed);
    workshop::Store store(file);
    auto j = sample(store);
    check(j["signals"]["M1"]["pending"].asInt64() == 0 &&
              j["signals"]["M1"]["ageBasis"] == "EMPTY_NA",
          "empty-count-confirmed-age-na");
    check(j["signals"]["M2"]["state"] == "UNKNOWN" && !j["writeReady"].asBool(),
          "startup-not-fake-health-or-admission");
    for (const auto &token : {"", "FAKE-U", "INVALID"})
      check(store.handle("GET", "/admin/operations", token, "", "",
                         workshop::Json{}, 1800000000)
                    .status != 200,
            "not-admin-no-telemetry");
    auto create = workshop::decode(
        R"({"epoch":"E","intentId":"CREATE","action":"CREATE","fields":{"title":"Title","description":"Plain text","capacity":10,"schedule":{"start":"2026-10-01T09:00:00+07:00","end":"2026-10-01T10:00:00+07:00"}}})");
    const auto r =
        store.handle("POST", "/admin/intents", "FAKE-A", "FAKE-CSRF-A",
                     "https://workshop.test", create, 1800000000);
    check(r.status == 200, "real-writer-create");
    const auto wid = r.body["workshopId"].asString();
    j = sample(store);
    check(j["signals"]["M1"]["pending"].asInt64() == 1 &&
              j["signals"]["M1"]["state"] == "BOUNDED",
          "timing-durable-with-authority");
    check(j["signals"]["M1"]["oldestAgeUpperMs"].asInt64() >= 0,
          "conservative-age-not-derived-id");
    auto edit = create;
    edit["action"] = "EDIT";
    edit["workshopId"] = wid;
    for (unsigned i = 0; i < 129; ++i) {
      edit["intentId"] = "EDIT" + std::to_string(i);
      edit["fields"]["title"] = "Title " + std::to_string(i);
      check(store.handle("POST", "/admin/intents", "FAKE-A", "FAKE-CSRF-A",
                         "https://workshop.test", edit, 1800000000)
                    .status == 200,
            "writer-change-" + std::to_string(i));
    }
    workshop::UpdateJournal journal(file);
    auto events = journal.pending();
    j = sample(store);
    check(events.size() == 64 && j["signals"]["M1"]["pending"].asInt64() == 130,
          "aggregate-count-not-dispatch-batch");
    auto wrong = events;
    wrong[0].version = "WRONG";
    bool failed = false;
    try {
      journal.failed("PROCESSING", wrong);
    } catch (const workshop::StorageError &) {
      failed = true;
    }
    check(failed, "failure-must-match-exact-event-identity");
    journal.failed("PROCESSING", events);
    journal.failed("PROCESSING", events);
    j = sample(store);
    check(j["signals"]["M2"]["open"][0]["count"].asInt64() == 64,
          "durable-open-count-not-retry-count");
    {
      workshop::Store restart(file);
      check(sample(restart)["signals"]["M2"]["open"][0]["count"].asInt64() ==
                64,
            "restart-preserves-open-errors");
    }
    journal.failed("INVARIANT", {events[0]});
    journal.complete(events);
    store.processingConfirmed(true);
    j = sample(store);
    check(j["signals"]["M1"]["pending"].asInt64() == 66,
          "completion-exact-count");
    check(j["signals"]["M2"]["open"].size() == 1 &&
              j["signals"]["M2"]["open"][0]["code"] == "INVARIANT",
          "ordinary-success-cannot-clear-critical");
    check(j["signals"]["M4"]["lastSuccess"]["epoch"] == "E" &&
              j["signals"]["M4"]["lastSuccess"]["workshop"] == wid,
          "last-success-bound-epoch-workshop-version");
    const auto last = j["signals"]["M4"]["lastSuccess"];
    journal.complete(events);
    check(sample(store)["signals"]["M4"]["lastSuccess"] == last,
          "duplicate-not-new-processing-success");
    failed = false;
    try {
      journal.failed("PROCESSING", events);
    } catch (const workshop::StorageError &) {
      failed = true;
    }
    check(failed, "completed-event-cannot-reopen");
    journal.failed("PROCESSING", {});
    while (!(events = journal.pending()).empty())
      journal.complete(events);
    check(sample(store)["signals"]["M1"]["pending"].asInt64() == 0,
          "all-batches-complete");
    store.processingConfirmed(false);
    check(sample(store)["signals"]["M2"]["state"] == "UNKNOWN",
          "persistence-source-failure-not-zero");
    store.fault([](std::string_view point) {
      if (point == "after_outbox")
        throw workshop::StorageError("INJECTED");
    });
    edit["intentId"] = "ROLLBACK";
    edit["fields"]["title"] = "Rollback";
    check(store.handle("POST", "/admin/intents", "FAKE-A", "FAKE-CSRF-A",
                       "https://workshop.test", edit, 1800000000)
                  .status == 503,
          "transaction-fault");
    store.fault({});
    check(sample(store)["signals"]["M1"]["pending"].asInt64() == 0,
          "rollback-no-fake-timing-obligation");
    // Only this newly-owned test DB is damaged. Production/history never
    // opened.
    sql(file, "UPDATE sessions SET revoked=1 WHERE token='FAKE-A'");
    check(store.handle("GET", "/admin/operations", "FAKE-A", "", "",
                       workshop::Json{}, 1800000000)
                  .status == 401,
          "revocation-before-next-read");
    const auto legacy = (dir / "legacy.sqlite").string();
    workshop::Store::initialize(
        legacy, text.substr(0, text.find("-- Optional telemetry")), seed);
    workshop::Store old(legacy);
    const auto oldr =
        old.handle("POST", "/admin/intents", "FAKE-A", "FAKE-CSRF-A",
                   "https://workshop.test", create, 1800000000);
    check(oldr.status == 200, "legacy-schema-business-unchanged");
    j = sample(old);
    check(j["signals"]["M1"]["pending"].asInt64() == 1 &&
              j["signals"]["M1"]["state"] == "UNKNOWN" &&
              j["signals"]["M2"]["state"] == "UNKNOWN",
          "legacy-no-guessed-age-no-auto-migration");
    sql(file, "DROP TRIGGER registration_capacity; WITH RECURSIVE n(v) AS "
              "(VALUES(1) UNION ALL SELECT v+1 FROM n WHERE v<11) INSERT INTO "
              "registrations(id,actor,workshop,state) SELECT "
              "'I'||v,'FAULT'||v,id,'ACTIVE' FROM workshops,n");
    failed = false;
    try {
      static_cast<void>(journal.pending());
    } catch (const workshop::StorageError &error) {
      failed = std::string_view(error.what()) == "INVARIANT";
    }
    check(failed, "real-damaged-authority-detected-by-dispatch-source");
    journal.failed("INVARIANT", {});
    sql(file, "UPDATE sessions SET revoked=0 WHERE token='FAKE-A'");
    check(sample(store)["signals"]["M2"]["open"][0]["code"] == "INVARIANT",
          "detected-authority-error-durable-readable");
    std::cout << "checks=" << checks << '\n';
    return 0;
  } catch (const std::exception &e) {
    std::cerr << e.what() << '\n';
    return 1;
  }
}
