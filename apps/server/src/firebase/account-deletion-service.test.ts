import assert from "node:assert/strict";
import test from "node:test";
import type { FastifyBaseLogger } from "fastify";
import {
  ChzzkTokenRequestError,
  type ChzzkAuthConfig
} from "../auth/chzzk/client.js";
import { AccountDeletionService } from "./account-deletion-service.js";

const uid = "chzzk:channel-id";
const channelId = "channel-id";
const config: ChzzkAuthConfig = {
  clientId: "client-id",
  clientSecret: "client-secret",
  redirectUri: "https://example.com/callback",
  openApiBaseUrl: "https://openapi.example.com"
};
const tokens = {
  accessToken: "access-token",
  refreshToken: "refresh-token",
  tokenType: "Bearer",
  expiresAt: new Date("2026-07-21T00:00:00.000Z"),
  scope: null
};

test("account deletion removes every local resource after revoking Chzzk", async () => {
  const operations: string[] = [];
  const service = new AccountDeletionService({
    stopSession: async () => {
      operations.push("stop-session");
      return true;
    },
    loadTokens: async () => tokens,
    revokeToken: async (_config, token, hint) => {
      operations.push(`revoke:${token}:${hint}`);
    },
    deleteFirestoreData: async () => {
      operations.push("delete-firestore");
      return { overlayTokens: ["first", "second"] };
    },
    deleteAuthUser: async () => {
      operations.push("delete-auth");
    },
    revokeOverlay: (publicToken) => {
      operations.push(`close-overlay:${publicToken}`);
    },
    invalidateBadge: () => {
      operations.push("invalidate-badge");
    }
  });

  await service.deleteAccount(uid, channelId, config, createLogger());

  assert.deepEqual(operations, [
    "stop-session",
    "revoke:refresh-token:refresh_token",
    "delete-firestore",
    "close-overlay:first",
    "close-overlay:second",
    "invalidate-badge",
    "delete-auth"
  ]);
});

test("account deletion falls back to the Chzzk access token", async () => {
  const revoked: string[] = [];
  const service = createService({
    revokeToken: async (_config, token, hint) => {
      revoked.push(`${token}:${hint}`);

      if (hint === "refresh_token") {
        throw new ChzzkTokenRequestError(401, "401", "INVALID_TOKEN");
      }
    }
  });

  await service.deleteAccount(uid, channelId, config, createLogger());

  assert.deepEqual(revoked, [
    "refresh-token:refresh_token",
    "access-token:access_token"
  ]);
});

test("remote token failure does not block personal data deletion", async () => {
  let firestoreDeleted = false;
  let authDeleted = false;
  const warningLogs: unknown[] = [];
  const service = createService({
    revokeToken: async () => {
      throw new Error("Chzzk unavailable");
    },
    deleteFirestoreData: async () => {
      firestoreDeleted = true;
      return { overlayTokens: [] };
    },
    deleteAuthUser: async () => {
      authDeleted = true;
    }
  });

  await service.deleteAccount(
    uid,
    channelId,
    config,
    createLogger(warningLogs)
  );

  assert.equal(firestoreDeleted, true);
  assert.equal(authDeleted, true);
  assert.equal(warningLogs.length, 1);
});

function createService(
  overrides: Partial<ConstructorParameters<typeof AccountDeletionService>[0]> = {}
) {
  return new AccountDeletionService({
    stopSession: async () => true,
    loadTokens: async () => tokens,
    revokeToken: async () => {},
    deleteFirestoreData: async () => ({ overlayTokens: [] }),
    deleteAuthUser: async () => {},
    revokeOverlay: () => {},
    invalidateBadge: () => {},
    ...overrides
  });
}

function createLogger(warningLogs: unknown[] = []): FastifyBaseLogger {
  return {
    warn(value: unknown) {
      warningLogs.push(value);
    }
  } as unknown as FastifyBaseLogger;
}
