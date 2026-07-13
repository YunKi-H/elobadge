import assert from "node:assert/strict";
import test from "node:test";
import { getTokenRefreshDelay } from "./token-manager.js";

test("token refresh is scheduled five minutes before expiration", () => {
  const now = Date.parse("2026-07-14T00:00:00.000Z");
  const expiresAt = new Date(now + 60 * 60 * 1_000);

  assert.equal(getTokenRefreshDelay(expiresAt, now), 55 * 60 * 1_000);
});

test("an expired or nearly expired token refreshes immediately", () => {
  const now = Date.parse("2026-07-14T00:00:00.000Z");

  assert.equal(getTokenRefreshDelay(new Date(now - 1), now), 0);
  assert.equal(getTokenRefreshDelay(new Date(now + 60_000), now), 0);
});
