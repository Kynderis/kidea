#pragma once
#include "admission.hpp"
#include "executor.hpp"
#include "updates.hpp"
#include <atomic>
#include <drogon/WebSocketController.h>
#include <memory>
namespace workshop {
class Updates final : public drogon::WebSocketController<Updates, false>,
                      public std::enable_shared_from_this<Updates> {
public:
  Updates(std::shared_ptr<Executor> executor,
          std::shared_ptr<Admission> admission, std::string file);
  WS_PATH_LIST_BEGIN
  WS_PATH_ADD("/api/v1/updates");
  WS_PATH_LIST_END
  void handleNewConnection(const drogon::HttpRequestPtr &,
                           const drogon::WebSocketConnectionPtr &) override;
  void handleNewMessage(const drogon::WebSocketConnectionPtr &, std::string &&,
                        const drogon::WebSocketMessageType &) override;
  void handleConnectionClosed(const drogon::WebSocketConnectionPtr &) override;
  void tick();

private:
  using Clock = std::chrono::steady_clock;
  struct State {
    Subscription subscription;
    std::string peer, quotaKey;
    UpdateCredit credit;
    FrameRate frames;
    bool subscribed{};
    Clock::time_point accepted{Clock::now()}, heartbeat{Clock::now()};
  };
  std::shared_ptr<Executor> executor_;
  std::shared_ptr<Admission> admission_;
  std::string file_;
  std::unique_ptr<UpdateJournal> journal_;
  std::map<drogon::WebSocketConnectionPtr, State> sockets_;
  SocketQuota quota_;
  std::atomic<unsigned> openings_{0};
  std::atomic<bool> ticking_{false};
  void close(const drogon::WebSocketConnectionPtr &);
  bool emit(Store &, const drogon::WebSocketConnectionPtr &, State &,
            const Json &);
  void subscribe(Store &, const drogon::WebSocketConnectionPtr &, State &,
                 const Json &);
  static std::int64_t now();
};
} // namespace workshop
