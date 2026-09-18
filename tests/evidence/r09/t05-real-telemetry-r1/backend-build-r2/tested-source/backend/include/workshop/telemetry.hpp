#pragma once
#include "model.hpp"
#include <sqlite3.h>
namespace workshop {
// Worker-owned connection only. No migrations, business mutations or raw
// errors.
bool telemetryProfile(sqlite3 *db);
std::int64_t telemetryNow();
void telemetryCreated(sqlite3 *db, std::int64_t event);
void telemetryObserved(sqlite3 *db, const std::vector<std::int64_t> &events);
void telemetryProcessed(sqlite3 *db, const std::vector<std::int64_t> &events);
void telemetryFailed(sqlite3 *db, const std::string &code,
                     const std::vector<std::int64_t> &events);
Json telemetrySnapshot(sqlite3 *db, bool processingConfirmed);
} // namespace workshop
