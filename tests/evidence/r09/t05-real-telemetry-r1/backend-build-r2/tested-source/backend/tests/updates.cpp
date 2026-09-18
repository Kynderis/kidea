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
  workshop::Json result;
  result["caseId"] = "UPDATES";
  result["variant"] = name;
  result["status"] = value ? "PASS" : "FAIL";
  std::cout << workshop::dump(result) << '\n' << std::flush;
  if (!value)
    throw std::runtime_error(name);
  ++checks;
}
void sql(const std::string &file, const char *statement) {
  sqlite3 *db{};
  if (sqlite3_open(file.c_str(), &db) != SQLITE_OK)
    throw std::runtime_error("OPEN");
  const auto code = sqlite3_exec(db, statement, nullptr, nullptr, nullptr);
  sqlite3_close(db);
  if (code != SQLITE_OK)
    throw std::runtime_error("SQL");
}
} // namespace
int main() {
  try {
    const char *root = std::getenv("WORKSHOP_CASE_ROOT");
    if (!root)
      throw std::runtime_error("OUTPUT_REQUIRED");
    const auto dir =
        std::filesystem::path(root) / ("updates-" + std::to_string(getpid()));
    if (!std::filesystem::create_directory(dir))
      throw std::runtime_error("CREATE_ONLY");
    const auto file = (dir / "db.sqlite").string();
    std::ifstream schema(WORKSHOP_SCHEMA);
    const std::string schemaText{std::istreambuf_iterator<char>(schema), {}};
    auto seed = workshop::decode(
        R"({"epoch":"E","origin":"https://workshop.test","sessions":[{"actor":"A","token":"FAKE-A","csrf":"FAKE-CSRF-A","participant":false,"admin":true,"expires":4102444800},{"actor":"U","token":"FAKE-U","csrf":"FAKE-CSRF-U","participant":true,"admin":false,"expires":4102444800}]})");
    workshop::Store::initialize(file, schemaText, seed);
    workshop::Store store(file);
    constexpr std::int64_t now = 1800000000;
    const auto create = workshop::decode(
        R"({"epoch":"E","intentId":"CREATE","action":"CREATE","fields":{"title":"Draft","description":"Plain text","capacity":10,"schedule":{"start":"2026-10-01T09:00:00+07:00","end":"2026-10-01T10:00:00+07:00"}}})");
    const auto result =
        store.handle("POST", "/admin/intents", "FAKE-A", "FAKE-CSRF-A",
                     "https://workshop.test", create, now);
    check(result.body["code"] == "CREATED", "fixture-created");
    const auto wid = result.body["workshopId"].asString();
    workshop::Subscription a{
        "FAKE-A", "https://workshop.test", "FAKE-CSRF-A", "A", "E", "admin",
        wid};
    workshop::Subscription u{
        "FAKE-U", "https://workshop.test", "FAKE-CSRF-U", "U", "E", "private",
        ""};
    workshop::Subscription guest{
        "", "https://workshop.test", "", "", "E", "public", wid};
    {
      workshop::UpdateJournal journal(file);
      const auto pending = journal.pending();
      check(pending.size() == 1, "durable-obligation-before-dispatch");
      check(workshop::updateSnapshot(store, journal, a, now).has_value(),
            "admin-draft-visible");
      check(!workshop::updateSnapshot(store, journal, guest, now),
            "draft-never-public");
      check(workshop::updateSnapshot(store, journal, u, now)->empty(),
            "private-empty-own-history");
      auto bad = guest;
      bad.token = "REVOKED";
      check(!workshop::updateAuthorized(store, journal, bad, now),
            "invalid-credential-never-downgrade");
      bad = a;
      bad.csrf = "WRONG";
      check(!workshop::updateAuthorized(store, journal, bad, now),
            "csrf-before-data");
      bad = a;
      bad.origin = "https://evil.test";
      check(!workshop::updateAuthorized(store, journal, bad, now),
            "origin-before-data");
      bad = a;
      bad.epoch = "OLD";
      check(!workshop::updateAuthorized(store, journal, bad, now),
            "epoch-before-data");
      bad = a;
      bad.actor = "U";
      check(!workshop::updateAuthorized(store, journal, bad, now),
            "captured-actor-revalidated");
      bad = u;
      bad.audience = "admin";
      check(!workshop::updateAuthorized(store, journal, bad, now),
            "participant-not-admin");
      bad = a;
      bad.audience = "private";
      check(!workshop::updateAuthorized(store, journal, bad, now),
            "admin-not-participant-default");
    }
    workshop::UpdateJournal journal(file);
    check(journal.pending().size() == 1, "restart-keeps-unprocessed-event");
    auto events = journal.pending();
    auto wrong = events;
    wrong[0].version = "wrong";
    bool threw = false;
    try {
      journal.complete(wrong);
    } catch (const workshop::StorageError &) {
      threw = true;
    }
    check(threw && journal.pending().size() == 1,
          "failed-processing-preserves-pending");
    journal.complete(events);
    check(journal.pending().empty(), "processing-mark-durable");
    journal.complete(events);
    check(journal.pending().empty(), "duplicate-processing-idempotent");
    auto publish = workshop::decode(
        R"({"epoch":"E","intentId":"PUBLISH","action":"STATE","targetState":"OPEN"})");
    publish["workshopId"] = wid;
    check(store.handle("POST", "/admin/intents", "FAKE-A", "FAKE-CSRF-A",
                       "https://workshop.test", publish, now)
                  .status == 200,
          "publish-fixture");
    const auto publicSnapshot =
        workshop::updateSnapshot(store, journal, guest, now);
    check(publicSnapshot && !publicSnapshot->isMember("actor"),
          "public-no-private-fields");
    auto registration =
        workshop::decode(R"({"epoch":"E","requestId":"REGISTER"})");
    registration["workshopId"] = wid;
    const auto registered =
        store.handle("POST", "/registrations", "FAKE-U", "FAKE-CSRF-U",
                     "https://workshop.test", registration, now);
    check(registered.body["code"] == "REGISTERED", "register-fixture");
    store.fault([](std::string_view point) {
      if (point == "before_begin")
        throw workshop::StorageError("INJECTED_READ_FAILURE");
    });
    bool unavailable = false;
    try {
      static_cast<void>(workshop::updateSnapshot(store, journal, u, now));
    } catch (const workshop::StorageError &) {
      unavailable = true;
    }
    check(unavailable && journal.pending().size() == 2,
          "storage-unknown-is-not-permission-denial-or-processing-completion");
    store.fault({});
    const auto history = workshop::updateSnapshot(store, journal, u, now);
    check(history && history->size() == 1 && (*history)[0]["actor"] == "U",
          "private-authoritative-group");
    sql(file, "UPDATE sessions SET revoked=1 WHERE token='FAKE-U'");
    check(!workshop::updateSnapshot(store, journal, u, now),
          "revocation-before-next-emit");
    check(!workshop::updateAuthorized(store, journal, a, 4102444800),
          "expiry-before-heartbeat");
    sql(file, "UPDATE metadata SET value='NEW' WHERE key='epoch'");
    check(!workshop::updateAuthorized(store, journal, a, now),
          "restore-epoch-revokes-subscription");
    workshop::UpdateCredit credit;
    for (unsigned i = 0; i < 8; ++i)
      check(credit.reserve(std::to_string(i), 100),
            "credit-message-" + std::to_string(i));
    check(!credit.reserve("overflow", 1) && credit.count() == 8 &&
              credit.bytes() == 800,
          "credit-limit-eight");
    check(!credit.acknowledge("7") && !credit.acknowledge("guessed"),
          "cannot-ack-unread-or-out-of-order");
    check(credit.acknowledge("0") && credit.reserve("new", 100),
          "exact-oldest-receipt-releases-one");
    workshop::UpdateCredit bytes;
    check(bytes.reserve("big", 1048576) && !bytes.reserve("more", 1),
          "credit-byte-limit-one-MiB");
    check(!bytes.reserve("oversize", 1048577), "single-frame-too-large");
    workshop::SocketQuota quota;
    for (unsigned i = 0; i < 8; ++i)
      check(quota.acquire("actor:A", true),
            "actor-socket-" + std::to_string(i));
    check(!quota.acquire("actor:A", true), "actor-max-eight");
    quota.release("actor:A");
    check(quota.acquire("actor:A", true), "closed-socket-releases-slot");
    for (unsigned i = 0; i < 16; ++i)
      check(quota.acquire("peer:P", false),
            "anonymous-socket-" + std::to_string(i));
    check(!quota.acquire("peer:P", false), "anonymous-max-sixteen");
    for (unsigned i = 24; i < 128; ++i)
      if (!quota.acquire("actor:" + std::to_string(i), true))
        throw std::runtime_error("global-fill");
    check(!quota.acquire("actor:last", true) && quota.count() == 128,
          "global-max-128");
    workshop::FrameRate rate;
    const auto at = workshop::FrameRate::Clock::now();
    for (unsigned i = 0; i < 10; ++i)
      check(rate.accept(at), "frame-burst-" + std::to_string(i));
    check(!rate.accept(at), "frame-burst-ten");
    check(rate.accept(at + std::chrono::milliseconds(200)) &&
              !rate.accept(at + std::chrono::milliseconds(200)),
          "frame-refill-five-per-second");
    std::cout << "checks=" << checks << '\n';
    return 0;
  } catch (const std::exception &e) {
    std::cerr << e.what() << '\n';
    return 1;
  }
}
