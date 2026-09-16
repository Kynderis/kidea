#include "domain.hpp"
#include "input.hpp"
#include "worker.hpp"
#include <atomic>
#include <chrono>
#include <drogon/HttpFilter.h>
#include <drogon/WebSocketController.h>
#include <drogon/drogon.h>
#include <fstream>
#include <openssl/crypto.h>
#include <optional>
#include <sstream>
#include <unordered_map>

namespace {
using Clock = std::chrono::steady_clock;
using Callback = std::function<void(const drogon::HttpResponsePtr &)>;
constexpr std::string_view origin = "https://localhost:8443";
struct Session {
  std::string actor;
  std::string csrf;
  std::string role;
  Clock::time_point expires;
  bool revoked{};
};
std::mutex sessions_mutex;
std::unordered_map<std::string, Session> sessions;
std::atomic<bool> stopping{false};
std::atomic<unsigned> delayed{0};
std::optional<Session> session(const std::string &token) {
  std::lock_guard guard(sessions_mutex);
  const auto it = sessions.find(token);
  if (it == sessions.end() || it->second.revoked ||
      it->second.expires <= Clock::now())
    return std::nullopt;
  return it->second;
}
bool equal_secret(const std::string &a, const std::string &b) {
  return a.size() == b.size() && !a.empty() &&
         CRYPTO_memcmp(a.data(), b.data(), a.size()) == 0;
}
drogon::HttpResponsePtr response(drogon::HttpStatusCode code,
                                 const Json::Value &value) {
  auto out = drogon::HttpResponse::newHttpJsonResponse(value);
  out->setStatusCode(code);
  out->addHeader("Cache-Control", "no-store");
  out->addHeader("X-Robots-Tag", "noindex, nofollow");
  return out;
}
Json::Value message(const std::string &value) {
  Json::Value out;
  out["status"] = value;
  return out;
}
void fail(const Callback &callback, drogon::HttpStatusCode code) {
  callback(response(code, message("DENIED")));
}
bool csrf(const drogon::HttpRequestPtr &req, const Session &s) {
  return req->getHeader("origin") == origin &&
         equal_secret(req->getHeader("x-csrf-token"), s.csrf) &&
         req->getParameter("token").empty();
}
std::string trim(std::string value) {
  const auto start = value.find_first_not_of(" \t\r\n");
  if (start == std::string::npos)
    return {};
  return value.substr(start, value.find_last_not_of(" \t\r\n") - start + 1);
}
bool protocol_proof(const std::string &protocols, const std::string &expected) {
  std::istringstream stream(protocols);
  std::string p;
  bool fixed = false, proof = false;
  while (std::getline(stream, p, ',')) {
    p = trim(p);
    fixed = fixed || p == "kidea.v1";
    proof = proof || equal_secret(p, "kidea.csrf." + expected);
  }
  return fixed && proof;
}
std::vector<std::weak_ptr<drogon::WebSocketConnection>> sockets;
std::mutex sockets_mutex;
} // namespace
class SocketAuth final : public drogon::HttpFilter<SocketAuth, false> {
public:
  void doFilter(const drogon::HttpRequestPtr &req,
                drogon::FilterCallback &&reject,
                drogon::FilterChainCallback &&next) override {
    const auto s = session(req->getCookie("__Host-kidea_session"));
    if (stopping || !s || req->getHeader("origin") != origin ||
        !req->getParameter("token").empty() ||
        !protocol_proof(req->getHeader("sec-websocket-protocol"), s->csrf)) {
      fail(reject, drogon::k403Forbidden);
      return;
    }
    next();
  }
};
class Updates final : public drogon::WebSocketController<Updates> {
public:
  void handleNewMessage(const drogon::WebSocketConnectionPtr &connection,
                        std::string &&,
                        const drogon::WebSocketMessageType &) override {
    const auto token = connection->getContext<std::string>();
    if (!token || !session(*token))
      connection->shutdown();
  }
  void handleNewConnection(
      const drogon::HttpRequestPtr &req,
      const drogon::WebSocketConnectionPtr &connection) override {
    connection->setContext(
        std::make_shared<std::string>(req->getCookie("__Host-kidea_session")));
    std::lock_guard guard(sockets_mutex);
    sockets.push_back(connection);
  }
  void handleConnectionClosed(const drogon::WebSocketConnectionPtr &) override {
  }
  WS_PATH_LIST_BEGIN
  WS_PATH_ADD("/api/ws", "SocketAuth");
  WS_PATH_LIST_END
};
int main() {
  try {
    std::ifstream input("/secrets/sessions.json");
    std::string raw((std::istreambuf_iterator<char>(input)), {});
    const auto fixture = kidea::decode_json(raw);
    if (!fixture)
      throw std::runtime_error("Missing synthetic sessions");
    for (const auto &item : (*fixture)["sessions"]) {
      sessions.emplace(item["token"].asString(),
                       Session{item["actor"].asString(),
                               item["csrf"].asString(), item["role"].asString(),
                               Clock::now() + std::chrono::seconds(
                                                  item.get("ttl", 900).asInt()),
                               false});
    }
    kidea::Store store("/data/sample.db");
    kidea::Worker writer;
    auto &app = drogon::app();
    app.registerFilter(std::make_shared<SocketAuth>());
    if (!std::dynamic_pointer_cast<SocketAuth>(
            drogon::DrClassMap::getSingleInstance("SocketAuth")))
      throw std::runtime_error("Socket authorization filter not registered");
    app.setLogLevel(trantor::Logger::kError)
        .setUploadPath("/tmp/kidea-uploads")
        .setThreadNum(1)
        .setMaxConnectionNum(128)
        .setClientMaxBodySize(131072)
        .setClientMaxMemoryBodySize(131072)
        .setClientMaxWebSocketMessageSize(8192)
        .addListener("0.0.0.0", 8080);
    app.setTermSignalHandler([] { stopping.store(true); });
    app.registerPreSendingAdvice([](const drogon::HttpRequestPtr &req,
                                    const drogon::HttpResponsePtr &res) {
      if (req->path() == "/api/ws" &&
          res->statusCode() == drogon::k101SwitchingProtocols)
        res->addHeader("Sec-WebSocket-Protocol", "kidea.v1");
    });
    app.registerHandlerViaRegex(
        "/api/.*",
        [&](const drogon::HttpRequestPtr &req, Callback &&callback) {
          if (stopping) {
            fail(callback, drogon::k503ServiceUnavailable);
            return;
          }
          if (req->getHeader("host") != "localhost:8443") {
            fail(callback, drogon::k400BadRequest);
            return;
          }
          if (req->path() == "/api/health") {
            callback(response(drogon::k200OK, message("READY")));
            return;
          }
          const auto token = req->getCookie("__Host-kidea_session");
          const auto s = session(token);
          if (!s) {
            fail(callback, drogon::k401Unauthorized);
            return;
          }
          if (req->method() != drogon::Get && !csrf(req, *s)) {
            fail(callback, drogon::k403Forbidden);
            return;
          }
          if (req->path() == "/api/session" && req->method() == drogon::Get) {
            Json::Value out;
            out["actor"] = s->actor;
            out["csrf"] = s->csrf;
            out["sentinel"] = "private-" + s->actor;
            callback(response(drogon::k200OK, out));
            return;
          }
          if (req->path() == "/api/refresh" && req->method() == drogon::Post) {
            auto out = response(drogon::k200OK, message("REFRESHED"));
            out->addHeader("Set-Cookie",
                           "__Host-kidea_session=" + token +
                               "; Path=/; Secure; HttpOnly; SameSite=Strict");
            callback(out);
            return;
          }
          if (req->path() == "/api/logout" && req->method() == drogon::Post) {
            {
              std::lock_guard guard(sessions_mutex);
              sessions.at(token).revoked = true;
            }
            auto out = response(drogon::k200OK, message("REVOKED"));
            out->addHeader("Set-Cookie",
                           "__Host-kidea_session=; Path=/; Secure; HttpOnly; "
                           "SameSite=Strict; Max-Age=0");
            callback(out);
            return;
          }
          if (req->path() == "/api/counts" && req->method() == drogon::Get) {
            if (s->role != "admin") {
              fail(callback, drogon::k403Forbidden);
              return;
            }
            if (!writer.submit([&, callback] {
                  const auto c = store.counts();
                  Json::Value out;
                  out["domain"] = c.domain;
                  out["result"] = c.result;
                  out["audit"] = c.audit;
                  out["outbox"] = c.outbox;
                  callback(response(drogon::k200OK, out));
                }))
              fail(callback, drogon::k503ServiceUnavailable);
            return;
          }
          if (req->path() == "/api/result" && req->method() == drogon::Get) {
            const auto id = req->getParameter("id");
            if (!writer.submit([&, callback, actor = s->actor, id] {
                  callback(response(drogon::k200OK,
                                    message(store.lookup(actor, id))));
                }))
              fail(callback, drogon::k503ServiceUnavailable);
            return;
          }
          if (req->path() == "/api/echo" && req->method() == drogon::Post) {
            Json::Value out;
            out["bytes"] = static_cast<Json::UInt64>(req->body().size());
            callback(response(drogon::k200OK, out));
            return;
          }
          if (req->path() == "/api/drain" && req->method() == drogon::Get) {
            ++delayed;
            if (req->getParameter("stuck") != "1")
              drogon::app().getLoop()->runAfter(0.8, [callback] {
                callback(response(drogon::k200OK, message("DONE")));
                --delayed;
              });
            return;
          }
          if (req->path() == "/api/write" && req->method() == drogon::Post) {
            if (s->role != "admin") {
              fail(callback, drogon::k403Forbidden);
              return;
            }
            const auto body = kidea::decode_json(req->body());
            if (!body || !(*body)["id"].isString() ||
                !(*body)["value"].isString() ||
                !(*body)["version"].isString() ||
                !kidea::valid_version((*body)["version"].asString()) ||
                !kidea::plain_text((*body)["value"].asString(), 120, true) ||
                (*body)["id"].asString().empty()) {
              fail(callback, drogon::k400BadRequest);
              return;
            }
            const auto id = (*body)["id"].asString(),
                       value = trim((*body)["value"].asString());
            if (!writer.submit([&, callback, id, value, actor = s->actor] {
                  const auto result = store.apply(actor, id, value);
                  callback(response(result == "SUCCESS" ? drogon::k200OK
                                                        : drogon::k409Conflict,
                                    message(result)));
                }))
              fail(callback, drogon::k503ServiceUnavailable);
            return;
          }
          fail(callback, drogon::k404NotFound);
        },
        {drogon::Get, drogon::Post, drogon::Options});
    app.getLoop()->runEvery(0.1, [] {
      std::lock_guard guard(sockets_mutex);
      std::erase_if(sockets, [](const auto &weak) {
        const auto socket = weak.lock();
        if (!socket)
          return true;
        const auto token = socket->template getContext<std::string>();
        const auto s = token ? session(*token) : std::nullopt;
        if (!s) {
          socket->shutdown();
          return true;
        }
        Json::Value value;
        value["actor"] = s->actor;
        value["sentinel"] = "private-" + s->actor;
        Json::StreamWriterBuilder builder;
        socket->send(Json::writeString(builder, value));
        return false;
      });
    });
    std::optional<Clock::time_point> stopped;
    app.getLoop()->runEvery(0.02, [&] {
      if (!stopping)
        return;
      if (!stopped) {
        stopped = Clock::now();
        writer.close();
      }
      if ((writer.pending() == 0 && delayed == 0) ||
          Clock::now() - *stopped >= std::chrono::seconds(30))
        app.quit();
    });
    app.run();
    return 0;
  } catch (const std::exception &error) {
    std::cerr << error.what() << '\n';
    return 1;
  }
}
