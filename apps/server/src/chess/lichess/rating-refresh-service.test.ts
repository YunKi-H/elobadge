import assert from "node:assert/strict";
import test from "node:test";
import type { FastifyBaseLogger } from "fastify";
import type { LichessPlayer } from "./client.js";
import { LichessRatingRefreshService } from "./rating-refresh-service.js";

const now = new Date("2026-07-23T00:00:00.000Z");
const claim = {
  accountId: "lichess:testuser",
  uid: "chzzk:viewer",
  chzzkChannelId: "viewer",
  username: "TestUser",
  playerId: "testuser",
  leaseId: "lease"
};
const player: LichessPlayer = {
  username: "TestUser",
  normalizedUsername: "testuser",
  playerId: "testuser",
  profileUrl: "https://lichess.org/@/TestUser",
  avatarUrl: null,
  status: "active",
  ratings: []
};
const logger = {
  info() {},
  warn() {},
  error() {}
} as unknown as FastifyBaseLogger;

test("Lichess manual refresh fetches, stores, and invalidates the badge", async () => {
  let completed = false;
  let invalidated = false;
  const service = createService({
    complete: async () => {
      completed = true;
      return true;
    },
    invalidate: () => {
      invalidated = true;
    }
  });

  await service.refreshManual(claim.uid);

  assert.equal(completed, true);
  assert.equal(invalidated, true);
});

test("failed Lichess refresh persists retry state and rethrows", async () => {
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

test("Lichess automatic scan processes due accounts independently", async () => {
  const completed: string[] = [];
  const failed: string[] = [];
  const service = createService({
    listDue: async () => ["first", "second"],
    claimScheduled: async (accountId) => ({ ...claim, accountId }),
    getPlayer: async () => {
      if (completed.length === 0) {
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
  overrides: Partial<ConstructorParameters<typeof LichessRatingRefreshService>[0]> = {}
) {
  return new LichessRatingRefreshService({
    listDue: async () => [],
    claimManual: async () => claim,
    claimScheduled: async () => null,
    getPlayer: async () => player,
    complete: async () => true,
    fail: async () => {},
    invalidate: () => {},
    now: () => now,
    random: () => 0,
    ...overrides
  });
}
