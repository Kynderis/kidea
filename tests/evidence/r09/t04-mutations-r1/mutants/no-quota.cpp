#include "workshop/store.hpp"
#include <chrono>
#include <deque>
#include <filesystem>
#include <limits>
#include <memory>
namespace workshop {
namespace {
class Statement {
  sqlite3_stmt *statement_{};
  std::deque<std::string> strings_;

public:
  Statement(sqlite3 *db, const char *sql) {
    if (sqlite3_prepare_v2(db, sql, -1, &statement_, nullptr) != SQLITE_OK)
      throw StorageError("PREPARE");
  }
  ~Statement() { sqlite3_finalize(statement_); }
  Statement(const Statement &) = delete;
  Statement &operator=(const Statement &) = delete;
  void bind(int i, const std::string &s) {
    if (s.size() > static_cast<std::size_t>(std::numeric_limits<int>::max()))
      throw Invalid("SIZE");
    strings_.push_back(s);
    // Owned deque elements live until AFTER sqlite3_finalize; no transient
    // cast/waiver.
    if (sqlite3_bind_text(statement_, i, strings_.back().data(),
                          static_cast<int>(s.size()),
                          SQLITE_STATIC) != SQLITE_OK)
      throw StorageError("BIND");
  }
  void bind(int i, std::int64_t n) {
    if (sqlite3_bind_int64(statement_, i, n) != SQLITE_OK)
      throw StorageError("BIND");
  }
  bool row() {
    const int r = sqlite3_step(statement_);
    if (r == SQLITE_ROW)
      return true;
    if (r == SQLITE_DONE)
      return false;
    throw StorageError("STEP");
  }
  void done() {
    if (row())
      throw StorageError("UNEXPECTED_ROW");
  }
  std::string text(int i) const {
    const auto *v = sqlite3_column_text(statement_, i);
    if (!v)
      throw StorageError("NULL");
    return {reinterpret_cast<const char *>(v),
            static_cast<std::size_t>(sqlite3_column_bytes(statement_, i))};
  }
  std::int64_t number(int i) const {
    return sqlite3_column_int64(statement_, i);
  }
};
std::string scalar(sqlite3 *db, const char *sql) {
  Statement s(db, sql);
  if (!s.row())
    throw StorageError("MISSING");
  return s.text(0);
}
std::string id(sqlite3 *db) {
  return scalar(db, "SELECT lower(hex(randomblob(16)))");
}
std::string opaque(const Json &j, const char *field) {
  auto v = string(j, field);
  if (v.empty())
    throw Invalid("ID");
  return v;
}
Json finalBody(const std::string &code, const std::string &effect) {
  auto r = reply(200, code, "FINAL");
  r.body["effect"] = effect;
  return r.body;
}
} // namespace
void Store::exec(const char *sql) {
  if (sqlite3_exec(db_, sql, nullptr, nullptr, nullptr) != SQLITE_OK)
    throw StorageError("EXEC");
}
void Store::point(std::string_view name) {
#ifdef WORKSHOP_TESTING
  if (hook_)
    hook_(name);
#else
  static_cast<void>(name);
#endif
}
Store::Store(const std::string &file) {
  if (sqlite3_open_v2(file.c_str(), &db_,
                      SQLITE_OPEN_READWRITE | SQLITE_OPEN_FULLMUTEX,
                      nullptr) != SQLITE_OK) {
    sqlite3_close(db_);
    db_ = nullptr;
    throw StorageError("OPEN");
  }
  try {
    if (sqlite3_busy_timeout(db_, 100) != SQLITE_OK)
      throw StorageError("BUSY_TIMEOUT");
    exec("PRAGMA foreign_keys=ON; PRAGMA synchronous=FULL;");
    if (scalar(db_, "PRAGMA journal_mode") != "wal" ||
        scalar(db_, "PRAGMA foreign_keys") != "1" ||
        scalar(db_, "PRAGMA synchronous") != "2" ||
        scalar(db_, "PRAGMA user_version") != "1")
      throw StorageError("READINESS");
    static_cast<void>(meta("epoch"));
    static_cast<void>(meta("origin"));
    if (scalar(db_, "PRAGMA quick_check") != "ok")
      throw StorageError("INTEGRITY");
  } catch (...) {
    sqlite3_close(db_);
    db_ = nullptr;
    throw;
  }
}
Store::~Store() { sqlite3_close(db_); }
std::string Store::meta(const char *key) {
  Statement s(db_, "SELECT value FROM metadata WHERE key=?");
  s.bind(1, std::string(key));
  if (!s.row())
    throw StorageError("METADATA");
  return s.text(0);
}
void Store::initialize(const std::string &file, const std::string &schema,
                       const Json &seed) {
  if (std::filesystem::exists(file))
    throw StorageError("CREATE_ONLY");
  keys(seed, {"epoch", "origin", "sessions"}, {"epoch", "origin", "sessions"});
  if (!seed["sessions"].isArray())
    throw Invalid("SEED");
  sqlite3 *raw{};
  if (sqlite3_open_v2(file.c_str(), &raw,
                      SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE,
                      nullptr) != SQLITE_OK) {
    sqlite3_close(raw);
    throw StorageError("OPEN");
  }
  const auto db =
      std::unique_ptr<sqlite3, decltype(&sqlite3_close)>(raw, sqlite3_close);
  const auto execute = [&](const char *sql) {
    if (sqlite3_exec(raw, sql, nullptr, nullptr, nullptr) != SQLITE_OK)
      throw StorageError("INITIALIZE");
  };
  execute("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA "
          "foreign_keys=ON; BEGIN IMMEDIATE;");
  execute(schema.c_str());
  for (const char *k : {"epoch", "origin"}) {
    Statement s(raw, "INSERT INTO metadata VALUES(?,?)");
    s.bind(1, std::string(k));
    s.bind(2, opaque(seed, k));
    s.done();
  }
  for (const auto &v : seed["sessions"]) {
    keys(v, {"token", "csrf", "actor", "participant", "admin", "expires"},
         {"token", "csrf", "actor", "participant", "admin", "expires"});
    if (!v["participant"].isBool() || !v["admin"].isBool() ||
        !v["expires"].isInt64())
      throw Invalid("SESSION");
    Statement s(
        raw, "INSERT INTO sessions(token,csrf,actor,participant,admin,expires) "
             "VALUES(?,?,?,?,?,?)");
    s.bind(1, opaque(v, "token"));
    s.bind(2, opaque(v, "csrf"));
    s.bind(3, opaque(v, "actor"));
    s.bind(4, v["participant"].asBool() ? 1 : 0);
    s.bind(5, v["admin"].asBool() ? 1 : 0);
    s.bind(6, v["expires"].asInt64());
    s.done();
  }
  execute("COMMIT;");
}
std::optional<Identity> Store::identity(const std::string &token,
                                        const std::string &csrf,
                                        const std::string &origin,
                                        bool mutation, std::int64_t now) {
  Statement q(db_, "SELECT actor,participant,admin,csrf FROM sessions WHERE "
                   "token=? AND revoked=0 AND expires>?");
  q.bind(1, token);
  q.bind(2, now);
  if (!q.row())
    return std::nullopt;
  if (mutation &&
      (origin != meta("origin") || csrf.empty() || csrf != q.text(3)))
    return std::nullopt;
  return Identity{q.text(0), q.number(1) == 1, q.number(2) == 1, q.text(3)};
}
std::optional<Json> Store::workshop(const std::string &wid, bool adminScope) {
  Statement s(
      db_,
      "SELECT id,title,description,capacity,start,end,state,version,(SELECT "
      "count(*) FROM registrations WHERE workshop=w.id AND state='ACTIVE') "
      "FROM workshops w WHERE id=?");
  s.bind(1, wid);
  if (!s.row())
    return std::nullopt;
  if (!adminScope && s.text(6) == "DRAFT")
    return std::nullopt;
  Json j;
  j["id"] = s.text(0);
  j["title"] = s.text(1);
  j["description"] = s.text(2);
  j["capacity"] = static_cast<::Json::Int64>(s.number(3));
  j["schedule"]["start"] = s.text(4);
  j["schedule"]["end"] = s.text(5);
  j["state"] = s.text(6);
  j["version"] = s.text(7);
  j["active"] = static_cast<::Json::Int64>(s.number(8));
  j["epoch"] = meta("epoch");
  j["remaining"] = static_cast<::Json::Int64>(s.number(3) - s.number(8));
  j["observedAt"] = static_cast<::Json::Int64>(received_);
  if (s.number(8) > s.number(3))
    throw StorageError("INVARIANT");
  return j;
}
std::string Store::rateKey(const std::string &token, std::int64_t now,
                           const std::string &peer) {
  const auto actor = identity(token, "", "", false, now);
  return actor ? "actor:" + actor->actor : "peer:" + peer;
}
Response Store::read(const std::string &route,
                     const std::optional<Identity> &actor) {
  const bool adminRoute = route.starts_with("/admin/");
  if (route == "/session") {
    if (!actor)
      return reply(401, "UNAVAILABLE");
    Json body;
    body["actor"] = actor->actor;
    body["epoch"] = meta("epoch");
    body["participant"] = actor->participant;
    body["admin"] = actor->admin;
    body["csrf"] = actor->csrf;
    return {200, body};
  }
  if (adminRoute && (!actor || !actor->admin))
    return reply(actor ? 404 : 401, "UNAVAILABLE");
  const std::string prefix = adminRoute ? "/admin/workshops" : "/workshops";
  if (route == prefix) {
    Json body(::Json::arrayValue);
    Statement ids(db_, adminRoute
                           ? "SELECT id FROM workshops ORDER BY "
                             "start_seconds,start_fraction,id"
                           : "SELECT id FROM workshops WHERE state<>'DRAFT' "
                             "ORDER BY start_seconds,start_fraction,id");
    while (ids.row())
      body.append(*workshop(ids.text(0), adminRoute));
    return {200, body};
  }
  if (route.starts_with(prefix + "/")) {
    const auto w = workshop(route.substr(prefix.size() + 1), adminRoute);
    return w ? Response{200, *w} : reply(404, "UNAVAILABLE");
  }
  if (route == "/me/registrations") {
    if (!actor || !actor->participant)
      return reply(actor ? 404 : 401, "UNAVAILABLE");
    Json groups(::Json::arrayValue);
    Statement ws(db_, "SELECT DISTINCT workshop FROM registrations WHERE "
                      "actor=? ORDER BY workshop");
    ws.bind(1, actor->actor);
    while (ws.row()) {
      const std::string wid = ws.text(0);
      auto w = workshop(wid, true);
      Json group;
      group["actor"] = actor->actor;
      group["epoch"] = meta("epoch");
      group["workshopId"] = wid;
      group["workshopVersion"] = (*w)["version"];
      group["registrations"] = Json(::Json::arrayValue);
      Statement rs(db_, "SELECT id,state FROM registrations WHERE actor=? AND "
                        "workshop=? ORDER BY id");
      rs.bind(1, actor->actor);
      rs.bind(2, wid);
      while (rs.row()) {
        Json entry;
        entry["id"] = rs.text(0);
        entry["state"] = rs.text(1);
        group["registrations"].append(entry);
      }
      groups.append(group);
    }
    return {200, groups};
  }
  const bool adminLookup = route.starts_with("/admin/intents/");
  if (adminLookup || route.starts_with("/requests/")) {
    if (!actor || !(adminLookup ? actor->admin : actor->participant))
      return reply(actor ? 404 : 401, "UNAVAILABLE");
    const std::string requestId = route.substr(adminLookup ? 15 : 10),
                      ns = adminLookup ? "admin" : "registration",
                      owner = adminLookup ? "" : actor->actor;
    Statement q(db_, "SELECT actor,result FROM request_results WHERE epoch=? "
                     "AND namespace=? AND owner=? AND request_id=?");
    q.bind(1, meta("epoch"));
    q.bind(2, ns);
    q.bind(3, owner);
    q.bind(4, requestId);
    if (!q.row())
      return reply(202, "UNCONFIRMED", "UNKNOWN");
    if (q.text(0) != actor->actor)
      return reply(404, "UNAVAILABLE");
    return {200, decode(q.text(1))};
  }
  return reply(404, "UNAVAILABLE");
}
Response Store::remembered(const std::string &ns, const std::string &owner,
                           const std::string &req, const std::string &actor,
                           const std::string &payload) {
  Statement q(db_, "SELECT actor,payload,result FROM request_results WHERE "
                   "epoch=? AND namespace=? AND owner=? AND request_id=?");
  q.bind(1, meta("epoch"));
  q.bind(2, ns);
  q.bind(3, owner);
  q.bind(4, req);
  if (!q.row())
    return {0, Json{}};
  if (q.text(0) != actor)
    return reply(404, "UNAVAILABLE");
  if (q.text(1) != payload)
    return reply(409, "REQUEST_CONFLICT");
  return {200, decode(q.text(2))};
}
void Store::remember(const std::string &ns, const std::string &owner,
                     const std::string &req, const std::string &actor,
                     const std::string &payload, const Response &response) {
  Statement q(db_, "INSERT INTO request_results VALUES(?,?,?,?,?,?,?)");
  q.bind(1, meta("epoch"));
  q.bind(2, ns);
  q.bind(3, owner);
  q.bind(4, req);
  q.bind(5, actor);
  q.bind(6, payload);
  q.bind(7, dump(response.body));
  q.done();
  point("after_result");
}
void Store::changed(const std::string &wid) {
  const auto w = workshop(wid, true);
  if (!w)
    throw StorageError("WORKSHOP");
  const auto version = next_version((*w)["version"].asString());
  Statement q(db_, "UPDATE workshops SET version=? WHERE id=?");
  q.bind(1, version);
  q.bind(2, wid);
  q.done();
  Statement event(db_,
                  "INSERT INTO outbox(epoch,workshop,version) VALUES(?,?,?)");
  event.bind(1, meta("epoch"));
  event.bind(2, wid);
  event.bind(3, version);
  event.done();
  point("after_outbox");
}
Response Store::registration(const std::string &route, const Json &input,
                             const Identity &actor) {
  const bool cancel = route != "/registrations";
  keys(input, {"epoch", "requestId", "workshopId"},
       {"epoch", "requestId", "workshopId"});
  const std::string req = opaque(input, "requestId"),
                    wid = opaque(input, "workshopId");
  const std::string rid = cancel ? route.substr(15, route.size() - 15 - 7) : "";
  if (cancel && rid.empty())
    throw Invalid("REGISTRATION_ID");
  if (!actor.participant)
    return reply(404, "UNAVAILABLE");
  auto w = workshop(wid, false);
  if (!w)
    return reply(404, "UNAVAILABLE");
  std::string registrationState;
  if (cancel) {
    Statement q(db_, "SELECT state FROM registrations WHERE id=? AND actor=? "
                     "AND workshop=?");
    q.bind(1, rid);
    q.bind(2, actor.actor);
    q.bind(3, wid);
    if (!q.row())
      return reply(404, "UNAVAILABLE");
    registrationState = q.text(0);
  }
  Json content = input;
  content["action"] = cancel ? "CANCEL" : "REGISTER";
  content["registrationId"] = rid;
  const auto payload = dump(content);
  auto prior =
      remembered("registration", actor.actor, req, actor.actor, payload);
  if (prior.status)
    return prior;
  Response result{200, finalBody("PAUSED", "REJECTED")};
  if ((*w)["state"] == "OPEN") {
    if (cancel) {
      result.body = finalBody(
          registrationState == "ACTIVE" ? "CANCELLED" : "ALREADY_CANCELLED",
          registrationState == "ACTIVE" ? "APPLIED" : "NO_CHANGE");
      result.body["registrationId"] = rid;
      if (registrationState == "ACTIVE") {
        Statement q(db_,
                    "UPDATE registrations SET state='CANCELLED' WHERE id=?");
        q.bind(1, rid);
        q.done();
        point("after_domain");
        changed(wid);
      }
    } else {
      Statement q(db_, "SELECT id FROM registrations WHERE actor=? AND "
                       "workshop=? AND state='ACTIVE'");
      q.bind(1, actor.actor);
      q.bind(2, wid);
      if (q.row()) {
        result.body = finalBody("ALREADY_REGISTERED", "NO_CHANGE");
        result.body["registrationId"] = q.text(0);
      } else {
        Statement quota(db_, "SELECT count(*) FROM registrations WHERE actor=? "
                             "AND state='ACTIVE'");
        quota.bind(1, actor.actor);
        if (!quota.row())
          throw StorageError("QUOTA_READ");
        if (quota.number(0) >= 2000000)
          result.body = finalBody("LIMIT_REACHED", "REJECTED");
        else if ((*w)["active"].asInt64() >= (*w)["capacity"].asInt64())
          result.body = finalBody("FULL", "REJECTED");
        else {
          const auto newId = id(db_);
          Statement add(db_,
                        "INSERT INTO registrations VALUES(?,?,?,'ACTIVE')");
          add.bind(1, newId);
          add.bind(2, actor.actor);
          add.bind(3, wid);
          add.done();
          point("after_domain");
          changed(wid);
          result.body = finalBody("REGISTERED", "APPLIED");
          result.body["registrationId"] = newId;
        }
      }
    }
  }
  result.body["workshopId"] = wid;
  remember("registration", actor.actor, req, actor.actor, payload, result);
  return result;
}
Response Store::admin(const Json &input, const Identity &actor) {
  keys(input,
       {"epoch", "intentId", "action", "workshopId", "fields", "targetState"},
       {"epoch", "intentId", "action"});
  const auto req = opaque(input, "intentId"), action = string(input, "action");
  if (!actor.admin)
    return reply(404, "UNAVAILABLE");
  if (action != "CREATE" && action != "EDIT" && action != "STATE")
    throw Invalid("ACTION");
  if (action == "CREATE")
    keys(input, {"epoch", "intentId", "action", "fields"}, {"fields"});
  if (action == "EDIT")
    keys(input, {"epoch", "intentId", "action", "workshopId", "fields"},
         {"workshopId", "fields"});
  if (action == "STATE")
    keys(input, {"epoch", "intentId", "action", "workshopId", "targetState"},
         {"workshopId", "targetState"});
  std::string wid = action == "CREATE" ? "" : opaque(input, "workshopId");
  auto current =
      action == "CREATE" ? std::optional<Json>{} : workshop(wid, true);
  if (action != "CREATE" && !current)
    return reply(404, "UNAVAILABLE");
  Json canonical = input;
  if (action != "STATE") {
    keys(input["fields"], {"title", "description", "capacity", "schedule"});
    if (input["fields"]["title"].isString())
      canonical["fields"]["title"] = trim(string(input["fields"], "title"));
    if (input["fields"]["description"].isString())
      canonical["fields"]["description"] =
          trim(string(input["fields"], "description"));
  }
  const auto payload = dump(canonical);
  auto prior = remembered("admin", "", req, actor.actor, payload);
  if (prior.status)
    return prior;
  Response result{200, finalBody("INVALID_FIELDS", "REJECTED")};
  bool didChange = false;
  if (action == "STATE") {
    const auto target = string(input, "targetState"),
               before = (*current)["state"].asString();
    if (target == before)
      result.body = finalBody("UNCHANGED", "NO_CHANGE");
    else if ((before == "DRAFT" && target == "OPEN") ||
             (before == "OPEN" && target == "PAUSED") ||
             (before == "PAUSED" && target == "OPEN")) {
      Statement q(db_, "UPDATE workshops SET state=? WHERE id=?");
      q.bind(1, target);
      q.bind(2, wid);
      q.done();
      didChange = true;
      result.body = finalBody("UPDATED", "APPLIED");
    } else
      result.body = finalBody("STATE_REJECTED", "REJECTED");
  } else {
    Json merged =
        action == "CREATE" ? canonical["fields"] : Json(::Json::objectValue);
    if (current) {
      for (const char *k : {"title", "description", "capacity", "schedule"})
        merged[k] = (*current)[k];
      for (const auto &k : canonical["fields"].getMemberNames())
        merged[k] = canonical["fields"][k];
    }
    std::optional<Fields> parsed;
    try {
      parsed = fields(merged);
    } catch (const Invalid &) { /* durable domain rejection, no mutation */
    }
    if (parsed) {
      const auto &f = *parsed;
      if (current && f.capacity < (*current)["active"].asInt())
        result.body = finalBody("BELOW_ACTIVE", "REJECTED");
      else if (current && f.title == (*current)["title"].asString() &&
               f.description == (*current)["description"].asString() &&
               f.capacity == (*current)["capacity"].asInt() &&
               f.from == instant((*current)["schedule"]["start"].asString()) &&
               f.until == instant((*current)["schedule"]["end"].asString()))
        result.body = finalBody("UNCHANGED", "NO_CHANGE");
      else {
        if (action == "CREATE")
          wid = id(db_);
        Statement q(db_, action == "CREATE"
                             ? "INSERT INTO "
                               "workshops(title,description,capacity,start,end,"
                               "start_seconds,start_fraction,id,state,version) "
                               "VALUES(?,?,?,?,?,?,?,?,'DRAFT','0')"
                             : "UPDATE workshops SET "
                               "title=?,description=?,capacity=?,start=?,end=?,"
                               "start_seconds=?,start_fraction=? WHERE id=?");
        q.bind(1, f.title);
        q.bind(2, f.description);
        q.bind(3, f.capacity);
        q.bind(4, f.start);
        q.bind(5, f.end);
        q.bind(6, f.from.seconds);
        q.bind(7, f.from.fraction);
        q.bind(8, wid);
        q.done();
        didChange = true;
        result.body =
            finalBody(action == "CREATE" ? "CREATED" : "UPDATED", "APPLIED");
      }
    }
  }
  if (!wid.empty())
    result.body["workshopId"] = wid;
  point("after_domain");
  if (didChange)
    changed(wid);
  Json changes(::Json::arrayValue);
  Json names(::Json::arrayValue);
  const auto after = wid.empty() ? std::optional<Json>{} : workshop(wid, true);
  if (didChange && after) {
    for (const char *field :
         {"title", "description", "capacity", "schedule", "state"}) {
      if (current && (*current)[field] == (*after)[field])
        continue;
      Json delta;
      delta["field"] = field;
      names.append(field);
      if (std::string(field) == "title" ||
          std::string(field) == "description") {
        delta["beforeRevision"] = current ? (*current)["version"] : Json{};
        delta["afterRevision"] = (*after)["version"];
      } else {
        delta["before"] = current ? (*current)[field] : Json{};
        delta["after"] = (*after)[field];
      }
      changes.append(delta);
    }
  }
  Statement audit(
      db_, "INSERT INTO "
           "admin_audit(epoch,actor,intent_id,action,workshop,result,changed_"
           "fields,received_at,result_at,changes) VALUES(?,?,?,?,?,?,?,?,?,?)");
  audit.bind(1, meta("epoch"));
  audit.bind(2, actor.actor);
  audit.bind(3, req);
  audit.bind(4, action);
  audit.bind(5, wid);
  audit.bind(6, result.body["code"].asString());
  audit.bind(7, dump(names));
  audit.bind(8, received_);
  audit.bind(9, received_ + std::chrono::duration_cast<std::chrono::seconds>(
                                std::chrono::steady_clock::now() - started_)
                                .count());
  audit.bind(10, dump(changes));
  audit.done();
  point("after_audit");
  remember("admin", "", req, actor.actor, payload, result);
  return result;
}
Response Store::mutate(const std::string &route, const Json &input,
                       const Identity &actor) {
  if (opaque(input, "epoch") != meta("epoch"))
    return reply(409, "EPOCH_CONFLICT");
  if (route == "/admin/intents")
    return admin(input, actor);
  if (route == "/registrations" ||
      (route.starts_with("/registrations/") && route.ends_with("/cancel")))
    return registration(route, input, actor);
  return reply(404, "UNAVAILABLE");
}
Response Store::handle(const std::string &method, const std::string &route,
                       const std::string &token, const std::string &csrf,
                       const std::string &origin, const Json &input,
                       std::int64_t now) {
  received_ = now;
  started_ = std::chrono::steady_clock::now();
  const bool mutation = method == "POST";
  if (method != "POST" && method != "GET")
    return reply(405, "METHOD");
  bool transaction = false;
  try {
    point("before_begin");
    exec(mutation ? "BEGIN IMMEDIATE" : "BEGIN");
    transaction = true;
    const auto actor = identity(token, csrf, origin, mutation, now);
    Response result = mutation ? (actor ? mutate(route, input, *actor)
                                        : reply(401, "UNAVAILABLE"))
                               : read(route, actor);
    if (mutation && route == "/admin/intents" && result.status != 200) {
      Statement audit(db_,
                      "INSERT INTO "
                      "admin_audit(epoch,actor,intent_id,action,workshop,"
                      "result,changed_fields,received_at,result_at,changes) "
                      "VALUES(?,?,?,'DENIED','',?,'[]',?,?,'[]')");
      audit.bind(1, meta("epoch"));
      audit.bind(2, actor ? actor->actor : "UNAUTHENTICATED");
      audit.bind(3, id(db_));
      audit.bind(4, result.body["code"].asString());
      audit.bind(5, received_);
      audit.bind(6, received_);
      audit.done();
    }
    point("before_commit");
    exec("COMMIT");
    transaction = false;
    point("after_commit");
    return result;
  } catch (const Invalid &) {
    if (transaction) {
      try {
        exec("ROLLBACK");
      } catch (...) {
        return reply(503, "UNCONFIRMED", "UNKNOWN");
      }
    }
    return reply(400, "INVALID_INPUT");
  } catch (...) {
    if (transaction) {
      try {
        point("before_rollback");
        exec("ROLLBACK");
      } catch (...) { /* uncertainty remains UNKNOWN */
      }
    }
    return reply(503, "UNCONFIRMED", "UNKNOWN");
  }
}
} // namespace workshop
