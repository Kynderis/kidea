#include "workshop/update_transport.hpp"
#include <drogon/utils/Utilities.h>
#include <set>
namespace workshop {
Updates::Updates(std::shared_ptr<Executor> executor,
                 std::shared_ptr<Admission> admission, std::string file)
    : executor_(std::move(executor)), admission_(std::move(admission)),
      file_(std::move(file)) {}
std::int64_t Updates::now() {
  return std::chrono::duration_cast<std::chrono::seconds>(
             std::chrono::system_clock::now().time_since_epoch())
      .count();
}
void Updates::close(const drogon::WebSocketConnectionPtr &connection) {
  const auto found = sockets_.find(connection);
  if (found != sockets_.end()) {
    quota_.release(found->second.quotaKey);
    sockets_.erase(found);
  }
  connection->forceClose();
}
void Updates::handleNewConnection(
    const drogon::HttpRequestPtr &request,
    const drogon::WebSocketConnectionPtr &connection) {
  // Controller callbacks set this once, before the worker receives the socket.
  // Count pending handshakes as well as authorized connections.
  const auto counted = std::make_shared<std::atomic<bool>>(false);
  connection->setContext(counted);
  if (openings_.fetch_add(1) >= 128) {
    openings_.fetch_sub(1);
    connection->forceClose();
    return;
  }
  counted->store(true);
  connection->disablePing();
  const auto self = shared_from_this();
  const auto origin = request->getHeader("origin"),
             token = request->getCookie("workshop_session"),
             peer = request->peerAddr().toIp();
  // Never accept credentials or subscriptions in URLs. A browser sends CSRF in
  // its first bounded SUBSCRIBE frame; no data is emitted before validation.
  if (!request->getQuery().empty() ||
      !executor_->submit(
          false, [self, connection, origin, token, peer](Store &) {
            try {
              if (!self->journal_)
                self->journal_ = std::make_unique<UpdateJournal>(self->file_);
              const auto key = "peer:" + peer;
              if (!connection->connected() ||
                  origin != self->journal_->metadata("origin") ||
                  !self->quota_.acquire(key, false)) {
                connection->forceClose();
                return;
              }
              State state;
              state.subscription.token = token;
              state.subscription.origin = origin;
              state.peer = peer;
              state.quotaKey = key;
              self->sockets_.emplace(connection, std::move(state));
            } catch (...) {
              connection->forceClose();
            }
          }))
    connection->forceClose();
}
bool Updates::emit(Store &store,
                   const drogon::WebSocketConnectionPtr &connection,
                   State &state, const Json &message) {
  if (!connection->connected() ||
      !updateAuthorized(store, *journal_, state.subscription, now()))
    return false;
  // Place an unpredictable credit receipt AFTER all payload bytes. Returning it
  // proves receipt of this entire frame, not business mutation/delivery
  // success.
  const auto receipt = drogon::utils::secureRandomString(32);
  Json marker(receipt);
  const auto frame =
      "{\"message\":" + dump(message) + ",\"receipt\":" + dump(marker) + "}";
  if (!state.credit.reserve(receipt, frame.size() + 10))
    return false;
  connection->send(frame);
  return true;
}
void Updates::subscribe(Store &store,
                        const drogon::WebSocketConnectionPtr &connection,
                        State &state, const Json &input) {
  keys(input, {"type", "audience", "workshopId", "csrf", "epoch"},
       {"type", "audience", "csrf", "epoch"});
  if (state.subscribed)
    throw Invalid("RESUBSCRIBE");
  auto &s = state.subscription;
  s.audience = string(input, "audience");
  s.epoch = string(input, "epoch");
  s.csrf = string(input, "csrf");
  if (s.audience == "private") {
    if (input.isMember("workshopId"))
      throw Invalid("PRIVATE_SCOPE");
  } else {
    s.workshop = string(input, "workshopId");
    if (s.workshop.empty())
      throw Invalid("SCOPE");
  }
  if (!s.token.empty()) {
    const auto session =
        store.handle("GET", "/session", s.token, "", "", Json{}, now());
    if (session.status != 200)
      throw Invalid("SESSION");
    s.actor = session.body["actor"].asString();
  }
  if (!updateAuthorized(store, *journal_, s, now()) || !admission_->global() ||
      !admission_->caller(store.rateKey(s.token, now(), state.peer)))
    throw Invalid("AUTHORIZATION");
  if (!s.token.empty()) {
    const auto key = "actor:" + s.actor;
    quota_.release(state.quotaKey);
    state.quotaKey.clear();
    if (!quota_.acquire(key, true))
      throw Invalid("ACTOR_QUOTA");
    state.quotaKey = key;
  }
  state.subscribed = true;
  Json subscribed;
  subscribed["type"] = "SUBSCRIBED";
  subscribed["epoch"] = s.epoch;
  subscribed["audience"] = s.audience;
  if (!emit(store, connection, state, subscribed))
    throw Invalid("EMIT");
  // Subscription exists BEFORE reading, so the next worker commit is either
  // in this snapshot or in the durable outbox scanned by tick().
  const auto snapshot = updateSnapshot(store, *journal_, s, now());
  if (!snapshot)
    throw Invalid("SNAPSHOT");
  Json message;
  message["type"] = "SNAPSHOT";
  message["epoch"] = s.epoch;
  message["audience"] = s.audience;
  message["data"] = *snapshot;
  if (!emit(store, connection, state, message))
    throw Invalid("EMIT");
}
void Updates::handleNewMessage(const drogon::WebSocketConnectionPtr &connection,
                               std::string &&message,
                               const drogon::WebSocketMessageType &type) {
  const auto self = shared_from_this();
  if (message.size() > 8192 || type != drogon::WebSocketMessageType::Text) {
    connection->forceClose();
    return;
  }
  if (!executor_->submit(false, [self, connection,
                                 message = std::move(message)](Store &store) {
        auto found = self->sockets_.find(connection);
        if (found == self->sockets_.end()) {
          connection->forceClose();
          return;
        }
        auto &state = found->second;
        try {
          if (!state.frames.accept())
            throw Invalid("FRAME_RATE");
          const auto input = decode(message);
          const auto kind = string(input, "type");
          if (kind == "SUBSCRIBE")
            self->subscribe(store, connection, state, input);
          else if (kind == "ACK") {
            keys(input, {"type", "receipt"}, {"type", "receipt"});
            if (!state.subscribed ||
                !state.credit.acknowledge(string(input, "receipt")))
              throw Invalid("ACK");
          } else
            throw Invalid("FRAME_TYPE");
        } catch (...) {
          self->close(connection);
        }
      }))
    connection->forceClose();
}
void Updates::handleConnectionClosed(
    const drogon::WebSocketConnectionPtr &connection) {
  const auto counted = connection->getContext<std::atomic<bool>>();
  if (counted && counted->exchange(false))
    openings_.fetch_sub(1);
  const auto self = shared_from_this();
  // If saturated, tick removes disconnected sockets; no unbounded cleanup job.
  executor_->submit(false,
                    [self, connection](Store &) { self->close(connection); });
}
void Updates::tick() {
  if (ticking_.exchange(true))
    return;
  const auto self = shared_from_this();
  if (!executor_->submit(false, [self](Store &store) {
        std::vector<UpdateEvent> events;
        std::string failureCode = "PROCESSING";
        try {
          if (!self->journal_)
            self->journal_ = std::make_unique<UpdateJournal>(self->file_);
          events = self->journal_->pending();
          std::set<std::string> workshops;
          for (const auto &e : events) {
            if (e.epoch != self->journal_->metadata("epoch")) {
              failureCode = "RECONCILE";
              throw StorageError("OUTBOX_EPOCH");
            }
            workshops.insert(e.workshop);
          }
          std::vector<drogon::WebSocketConnectionPtr> closing;
          for (auto &[connection, state] : self->sockets_) {
            try {
              if (!connection->connected() ||
                  (!state.subscribed &&
                   Clock::now() - state.accepted > std::chrono::seconds(5))) {
                closing.push_back(connection);
                continue;
              }
              if (!state.subscribed)
                continue;
              if (workshops.contains(state.subscription.workshop) ||
                  (state.subscription.workshop == "*" && !workshops.empty()) ||
                  (state.subscription.audience == "private" &&
                   !workshops.empty())) {
                const auto data = updateSnapshot(store, *self->journal_,
                                                 state.subscription, now());
                if (!data) {
                  closing.push_back(connection);
                  continue;
                }
                Json message;
                message["type"] = "SNAPSHOT";
                message["audience"] = state.subscription.audience;
                message["epoch"] = state.subscription.epoch;
                message["data"] = *data;
                if (!self->emit(store, connection, state, message)) {
                  closing.push_back(connection);
                  continue;
                }
              }
              if (Clock::now() - state.heartbeat >= std::chrono::seconds(2)) {
                Json message;
                message["type"] = "HEARTBEAT";
                message["epoch"] = state.subscription.epoch;
                message["audience"] = state.subscription.audience;
                if (!self->emit(store, connection, state, message))
                  closing.push_back(connection);
                else
                  state.heartbeat = Clock::now();
              }
            } catch (...) {
              throw;
            }
          }
          for (const auto &connection : closing)
            self->close(connection);
          // Authoritative snapshot construction + dispatch processing
          // completed. This does NOT certify each browser's visibility. On
          // send/crash/mark failure the obligation remains pending; duplicate
          // snapshots are safe.
          self->journal_->complete(events);
          store.processingConfirmed(true);
        } catch (...) {
          store.processingConfirmed(false);
          try {
            throw;
          } catch (const StorageError &error) {
            if (std::string_view(error.what()) == "INVARIANT")
              failureCode = "INVARIANT";
          } catch (...) {
          }
          try {
            if (self->journal_)
              self->journal_->failed(failureCode, events);
          } catch (
              ...) { /* The observation stays UNKNOWN if persistence fails. */
          }
          std::vector<drogon::WebSocketConnectionPtr> closing;
          for (const auto &[connection, state] : self->sockets_) {
            static_cast<void>(state);
            closing.push_back(connection);
          }
          for (const auto &connection : closing)
            self->close(connection);
          // Persisted outbox remains pending. A later tick/start retries only
          // projection processing, never a business mutation.
        }
        self->ticking_.store(false);
      }))
    ticking_.store(false);
}
} // namespace workshop
