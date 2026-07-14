import assert from "node:assert/strict";
import test from "node:test";
import {
  CHESS_COM_AUTO_REFRESH_JITTER_MS,
  CHESS_COM_AUTO_REFRESH_MS,
  CHESS_COM_MANUAL_REFRESH_COOLDOWN_MS,
  getChessComRefreshRetryAt,
  getNextChessComRefreshAt
} from "./rating-refresh-policy.js";

const now = new Date("2026-07-15T00:00:00.000Z");

test("automatic refresh uses a twelve-hour interval with bounded jitter", () => {
  assert.equal(
    getNextChessComRefreshAt(now, () => 0).getTime(),
    now.getTime() + CHESS_COM_AUTO_REFRESH_MS
  );
  assert.equal(
    getNextChessComRefreshAt(now, () => 0.999).getTime() <
      now.getTime() + CHESS_COM_AUTO_REFRESH_MS + CHESS_COM_AUTO_REFRESH_JITTER_MS,
    true
  );
});

test("refresh retry starts at five minutes and is capped at six hours", () => {
  assert.equal(
    getChessComRefreshRetryAt(now, 1).getTime(),
    now.getTime() + CHESS_COM_MANUAL_REFRESH_COOLDOWN_MS
  );
  assert.equal(
    getChessComRefreshRetryAt(now, 20).getTime(),
    now.getTime() + 6 * 60 * 60 * 1_000
  );
});
