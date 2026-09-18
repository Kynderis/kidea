#include "workshop/admission.hpp"
#include "workshop/executor.hpp"
#include <atomic>
#include <cerrno>
#include <csignal>
#include <drogon/drogon.h>
#include <fstream>
#include <iostream>
#include <iterator>
#include <map>
#include <pthread.h>
namespace {
std::string load(const char *file) {
  std::ifstream in(file, std::ios::binary);
  if (!in)
    throw workshop::Invalid("FILE");
  return {std::istreambuf_iterator<char>(in), {}};
}
void respond(
    const std::function<void(const drogon::HttpResponsePtr &)> &callback,
    const workshop::Response &result) {
  const auto response = drogon::HttpResponse::newHttpJsonResponse(result.body);
  response->setStatusCode(static_cast<drogon::HttpStatusCode>(result.status));
  response->addHeader("Cache-Control", "no-store");
  response->addHeader("X-Content-Type-Options", "nosniff");
  callback(response);
}
} // namespace
int main(int argc, char **argv) {
  try {
    if (argc == 5 && std::string(argv[1]) == "--initialize") {
      workshop::Store::initialize(argv[2], load(argv[3]),
                                  workshop::decode(load(argv[4])));
      return 0;
    }
    if (argc != 3 || std::string(argv[1]) != "--serve-component-fixture") {
      std::cerr << "usage: workshop_backend --initialize DB SCHEMA SEED | "
                   "--serve-component-fixture DB\n";
      return 2;
    }
    // Block before creating any worker: every thread inherits this mask.
    // The event loop consumes signals synchronously; no allocator, logger or
    // queue operation runs in an asynchronous signal handler.
    sigset_t terminationSignals{};
    if (sigemptyset(&terminationSignals) != 0 ||
        sigaddset(&terminationSignals, SIGTERM) != 0 ||
        sigaddset(&terminationSignals, SIGINT) != 0 ||
        pthread_sigmask(SIG_BLOCK, &terminationSignals, nullptr) != 0)
      return 1;
    bool signalWaitFailed = false;
    auto executor = std::make_shared<workshop::Executor>(argv[2]);
    auto active = std::make_shared<std::atomic<unsigned>>(0);
    auto admission = std::make_shared<workshop::Admission>();
    drogon::app()
        .setLogLevel(trantor::Logger::kWarn)
        .setThreadNum(2)
        .setClientMaxBodySize(131072)
        .addListener("0.0.0.0", 8080);
    // T02 transport is internal to the network-isolated lab; HTTPS ingress is
    // T03/T05.
    drogon::app().registerHandlerViaRegex(
        "/api/v1/.*",
        [executor, active, admission](
            const drogon::HttpRequestPtr &request,
            std::function<void(const drogon::HttpResponsePtr &)> &&callback) {
          const auto method =
              request->method() == drogon::Post ? "POST" : "GET";
          const bool mutation = request->method() == drogon::Post;
          const auto previous = active->fetch_add(1);
          if (previous >= 128) {
            active->fetch_sub(1);
            respond(callback, workshop::reply(503, "ADMISSION", "UNKNOWN"));
            return;
          }
          const auto once = std::make_shared<std::atomic<bool>>(false);
          auto finish = [active, once, callback = std::move(callback)](
                            const workshop::Response &result) {
            if (!once->exchange(true)) {
              active->fetch_sub(1);
              respond(callback, result);
            }
          };
          // Never trust X-Forwarded-For or a role/actor header. Actor rate
          // limit is checked after authentication by the worker; this is
          // the global bucket.
          if (!admission->global()) {
            finish(workshop::reply(429, "RATE_LIMIT", "UNKNOWN"));
            return;
          }
          workshop::Json input(::Json::objectValue);
          try {
            if (mutation)
              input = workshop::decode(request->body());
          } catch (...) {
            finish(workshop::reply(400, "INVALID_INPUT"));
            return;
          }
          const auto peer = request->peerAddr().toIp();
          const auto path = request->path().substr(7),
                     token = request->getCookie("workshop_session"),
                     csrf = request->getHeader("x-csrf-token"),
                     origin = request->getHeader("origin");
          if (!executor->submit(mutation, [finish, path, token, csrf, origin,
                                           input, method, peer,
                                           admission](workshop::Store &store) {
                try {
                  const auto now =
                      std::chrono::duration_cast<std::chrono::seconds>(
                          std::chrono::system_clock::now().time_since_epoch())
                          .count();
                  if (!admission->caller(store.rateKey(token, now, peer))) {
                    finish(workshop::reply(429, "RATE_LIMIT", "UNKNOWN"));
                    return;
                  }
                  finish(store.handle(method, path, token, csrf, origin, input,
                                      now));
                } catch (...) {
                  finish(workshop::reply(503, "UNCONFIRMED", "UNKNOWN"));
                }
              }))
            finish(workshop::reply(503, "QUEUE_FULL", "UNKNOWN"));
        },
        {drogon::Get, drogon::Post});
    drogon::app().disableSigtermHandling();
    drogon::app().getLoop()->runEvery(0.05, [terminationSignals,
                                             &signalWaitFailed]() {
      const timespec noWait{};
      const int signal = sigtimedwait(&terminationSignals, nullptr, &noWait);
      if (signal == SIGTERM || signal == SIGINT) {
        drogon::app().quit();
      } else if (signal < 0 && errno != EAGAIN && errno != EINTR) {
        signalWaitFailed = true;
        drogon::app().quit();
      }
    });
    drogon::app().run();
    if (!executor->drain(std::chrono::seconds(30)))
      std::_Exit(2);
    return signalWaitFailed ? 1 : 0;
  } catch (...) {
    std::cerr << "backend startup/initialization failed; no payload logged\n";
    return 1;
  }
}
