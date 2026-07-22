import assert from "node:assert/strict";
import test from "node:test";
import {
  LICHESS_AUTO_REFRESH_JITTER_MS,
  LICHESS_AUTO_REFRESH_MS,
  LICHESS_MANUAL_REFRESH_COOLDOWN_MS,
  getLichessRefreshRetryAt,
  getNextLichessRefreshAt
} from "./rating-refresh-policy.js";

const now = new Date("2026-07-23T00:00:00.000Z");

test("Lichess automatic refresh uses a twelve-hour interval with bounded jitter", () => {
  assert.equal(
    getNextLichessRefreshAt(now, () => 0).getTime(),
    now.getTime() + LICHESS_AUTO_REFRESH_MS
  );
  assert.equal(
    getNextLichessRefreshAt(now, () => 0.999).getTime() <
      now.getTime() + LICHESS_AUTO_REFRESH_MS + LICHESS_AUTO_REFRESH_JITTER_MS,
    true
  );
});

test("Lichess refresh retry starts at five minutes and is capped at six hours", () => {
  assert.equal(
    getLichessRefreshRetryAt(now, 1).getTime(),
    now.getTime() + LICHESS_MANUAL_REFRESH_COOLDOWN_MS
  );
  assert.equal(
    getLichessRefreshRetryAt(now, 20).getTime(),
    now.getTime() + 6 * 60 * 60 * 1_000
  );
});
