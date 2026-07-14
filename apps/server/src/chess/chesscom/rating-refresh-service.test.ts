import assert from "node:assert/strict";
import test from "node:test";
import type { FastifyBaseLogger } from "fastify";
import type { ChessComPlayer } from "./client.js";
import { ChessComRatingRefreshService } from "./rating-refresh-service.js";

const now = new Date("2026-07-15T00:00:00.000Z");
const claim = {
  accountId: "chesscom:testuser",
  uid: "chzzk:viewer",
  chzzkChannelId: "viewer",
  username: "TestUser",
  playerId: "42",
  leaseId: "lease"
};
const player: ChessComPlayer = {
  username: "TestUser",
  normalizedUsername: "testuser",
  playerId: "42",
  profileUrl: "https://www.chess.com/member/testuser",
  avatarUrl: null,
  location: null,
  status: "basic",
  ratings: []
};
const logger = {
  info() {},
  warn() {},
  error() {}
} as unknown as FastifyBaseLogger;

test("manual refresh fetches, stores, and invalidates the badge", async () => {
  let completed = false;
  let invalidated = false;
  const service = createService({
    complete: async () => {
      completed = true;
      return true;
    },
    invalidateBadge: () => {
      invalidated = true;
    }
  });

  await service.refreshManual(claim.uid);

  assert.equal(completed, true);
  assert.equal(invalidated, true);
});

test("failed refresh persists retry state and rethrows", async () => {
  const expected = new Error("rate limited");
  let failedWith: unknown;
  const service = createService({
    getPlayer: async () => {
      throw expected;
    },
    fail: async (_claim, error) => {
      failedWith = error;
    }
  });

  await assert.rejects(service.refreshManual(claim.uid), expected);
  assert.equal(failedWith, expected);
});

test("automatic scan processes due accounts independently", async () => {
  const completed: string[] = [];
  const failed: string[] = [];
  const service = createService({
    listDue: async () => ["first", "second"],
    claimScheduled: async (accountId) => ({ ...claim, accountId }),
    getPlayer: async (username) => {
      if (username === "TestUser" && completed.length === 0) {
        return player;
      }
      throw new Error("temporary");
    },
    complete: async (refreshClaim) => {
      completed.push(refreshClaim.accountId);
      return true;
    },
    fail: async (refreshClaim) => {
      failed.push(refreshClaim.accountId);
    }
  });

  await service.refreshDueAccounts(logger);

  assert.deepEqual(completed, ["first"]);
  assert.deepEqual(failed, ["second"]);
});

function createService(
  overrides: Partial<ConstructorParameters<typeof ChessComRatingRefreshService>[0]> = {}
) {
  return new ChessComRatingRefreshService({
    listDue: async () => [],
    claimManual: async () => claim,
    claimScheduled: async () => null,
    getPlayer: async () => player,
    complete: async () => true,
    fail: async () => {},
    invalidateBadge: () => {},
    now: () => now,
    random: () => 0,
    ...overrides
  });
}
