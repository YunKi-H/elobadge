import assert from "node:assert/strict";
import test from "node:test";
import type { ChzzkAuthConfig } from "../auth/chzzk/client.js";
import { ChzzkConnectionService } from "./connection-service.js";

const config: ChzzkAuthConfig = {
  clientId: "client-id",
  clientSecret: "client-secret",
  redirectUri: "http://localhost/callback",
  openApiBaseUrl: "https://openapi.example.com"
};

test("disconnect revokes remotely before deleting stored tokens", async () => {
  const operations: string[] = [];
  const service = new ChzzkConnectionService({
    loadTokens: async () => ({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      tokenType: "Bearer",
      expiresAt: new Date("2026-07-18T00:00:00.000Z"),
      scope: "chat"
    }),
    stopSession: async () => {
      operations.push("stop");
      return true;
    },
    revokeToken: async (_config, token, hint) => {
      operations.push(`revoke:${token}:${hint}`);
    },
    deleteTokens: async () => {
      operations.push("delete");
    },
    listAccounts: async () => [chzzkAccount],
    disconnectPlatformAccount: async () => 0,
    invalidatePlatformAccount: () => {}
  });

  assert.deepEqual(await service.disconnect("chzzk:user", config), {
    revoked: true,
    disconnected: 0
  });
  assert.deepEqual(operations, [
    "stop",
    "revoke:refresh-token:refresh_token",
    "delete"
  ]);
});

test("disconnect preserves stored tokens when remote revocation fails", async () => {
  const operations: string[] = [];
  const service = new ChzzkConnectionService({
    loadTokens: async () => ({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      tokenType: "Bearer",
      expiresAt: new Date("2026-07-18T00:00:00.000Z"),
      scope: null
    }),
    stopSession: async () => {
      operations.push("stop");
      return true;
    },
    revokeToken: async () => {
      operations.push("revoke");
      throw new Error("revoke failed");
    },
    deleteTokens: async () => {
      operations.push("delete");
    },
    listAccounts: async () => [chzzkAccount],
    disconnectPlatformAccount: async () => 0,
    invalidatePlatformAccount: () => {}
  });

  await assert.rejects(service.disconnect("chzzk:user", config));
  assert.deepEqual(operations, ["stop", "revoke"]);
});

test("disconnect stops the session when stored tokens cannot be loaded", async () => {
  const operations: string[] = [];
  const service = new ChzzkConnectionService({
    loadTokens: async () => {
      operations.push("load");
      throw new Error("decrypt failed");
    },
    stopSession: async () => {
      operations.push("stop");
      return true;
    },
    revokeToken: async () => {
      operations.push("revoke");
    },
    deleteTokens: async () => {
      operations.push("delete");
    },
    listAccounts: async () => [chzzkAccount],
    disconnectPlatformAccount: async () => 0,
    invalidatePlatformAccount: () => {}
  });

  await assert.rejects(service.disconnect("chzzk:user", config));
  assert.deepEqual(operations, ["load", "stop"]);
});

test("viewer disconnect can remove the last Chzzk login identity", async () => {
  let stopped = false;
  const operations: string[] = [];
  const service = new ChzzkConnectionService({
    loadTokens: async () => null,
    stopSession: async () => {
      stopped = true;
      return false;
    },
    revokeToken: async () => {},
    deleteTokens: async () => {},
    listAccounts: async () => [chzzkAccount],
    disconnectPlatformAccount: async () => {
      operations.push("disconnect-platform");
      return 1;
    },
    invalidatePlatformAccount: (platformUserId) => {
      operations.push(`invalidate:${platformUserId}`);
    }
  });

  assert.deepEqual(await service.disconnect("chzzk:user", config, true), {
    revoked: false,
    disconnected: 1
  });
  assert.equal(stopped, false);
  assert.deepEqual(operations, [
    "disconnect-platform",
    "invalidate:chzzk-user"
  ]);
});

test("viewer disconnect removes Chzzk identity when another platform exists", async () => {
  const operations: string[] = [];
  const service = new ChzzkConnectionService({
    loadTokens: async () => null,
    stopSession: async () => false,
    revokeToken: async () => {},
    deleteTokens: async () => {},
    listAccounts: async () => [
      chzzkAccount,
      {
        userId: "chzzk:user",
        platform: "twitch",
        platformUserId: "twitch-user",
        displayName: "Twitch User"
      }
    ],
    disconnectPlatformAccount: async () => {
      operations.push("disconnect-platform");
      return 1;
    },
    invalidatePlatformAccount: (platformUserId) => {
      operations.push(`invalidate:${platformUserId}`);
    }
  });

  assert.deepEqual(await service.disconnect("chzzk:user", config, true), {
    revoked: false,
    disconnected: 1
  });
  assert.deepEqual(operations, [
    "disconnect-platform",
    "invalidate:chzzk-user"
  ]);
});

const chzzkAccount = {
  userId: "chzzk:user",
  platform: "chzzk" as const,
  platformUserId: "chzzk-user",
  displayName: "Chzzk User"
};
