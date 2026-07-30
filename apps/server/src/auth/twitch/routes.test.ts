import assert from "node:assert/strict";
import test from "node:test";
import Fastify from "fastify";
import {
  createFirebaseAuthPreHandler,
  registerFirebaseAuthentication
} from "../firebase.js";
import { PlatformAccountConflictError } from "../../firebase/platform-accounts.js";
import {
  registerTwitchRoutes,
  type TwitchRouteDependencies
} from "./routes.js";

const twitchUser = {
  id: "123456789",
  login: "testuser",
  displayName: "TestUser"
};

test("Twitch connection requires Firebase authentication", async () => {
  const app = await createApp();
  const response = await app.inject({
    method: "POST",
    url: "/api/auth/twitch/start"
  });

  assert.equal(response.statusCode, 401);
  await app.close();
});

test("Twitch disconnection requires Firebase authentication", async () => {
  const app = await createApp();
  const response = await app.inject({
    method: "DELETE",
    url: "/api/platform-accounts/twitch"
  });

  assert.equal(response.statusCode, 401);
  await app.close();
});

test("starts Twitch OAuth with state bound to the Firebase user", async () => {
  let pendingUid = "";
  let pendingPurpose = "";
  const app = await createApp({
    issueState: (value) => {
      pendingUid = value.uid;
      pendingPurpose = value.purpose;
      return "state";
    }
  });
  const response = await app.inject({
    method: "POST",
    url: "/api/auth/twitch/start",
    headers: { authorization: "Bearer valid-token" }
  });

  assert.equal(response.statusCode, 200);
  assert.equal(pendingUid, "chzzk:viewer");
  assert.equal(pendingPurpose, "identity");
  assert.equal(
    response.json().authorizationUrl,
    "https://twitch.test/oauth?state=state"
  );
  await app.close();
});

test("connects a Twitch identity and revokes its temporary token", async () => {
  const operations: string[] = [];
  const app = await createApp({
    consumeState: () => ({ uid: "chzzk:viewer", purpose: "identity" }),
    exchangeCode: async () => {
      operations.push("exchange");
      return {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 14_400,
        scopes: ["openid"],
        tokenType: "bearer"
      };
    },
    getCurrentUser: async () => {
      operations.push("profile");
      return twitchUser;
    },
    saveAccount: async () => {
      operations.push("save");
    },
    revokeToken: async () => {
      operations.push("revoke");
    }
  });
  const response = await app.inject({
    method: "GET",
    url: "/api/auth/twitch/callback?code=code&state=state"
  });

  assert.equal(response.statusCode, 302);
  assert.equal(
    response.headers.location,
    "https://elobadge.test/viewer?twitch=connected"
  );
  assert.deepEqual(operations, ["exchange", "profile", "save", "revoke"]);
  await app.close();
});

test("stores Twitch streamer tokens through the shared callback", async () => {
  const operations: string[] = [];
  const app = await createApp({
    consumeState: () => ({
      uid: "chzzk:viewer",
      purpose: "streamer_chat"
    }),
    exchangeCode: async () => {
      operations.push("exchange");
      return {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 14_400,
        scopes: ["openid", "user:read:chat"],
        tokenType: "bearer"
      };
    },
    getCurrentUser: async () => {
      operations.push("profile");
      return twitchUser;
    },
    saveStreamerAuthorization: async () => {
      operations.push("save-streamer");
    },
    revokeToken: async () => {
      operations.push("revoke");
    }
  });
  const response = await app.inject({
    method: "GET",
    url: "/api/auth/twitch/callback?code=code&state=state"
  });

  assert.equal(
    response.headers.location,
    "https://elobadge.test/streamer?twitchChat=connected"
  );
  assert.deepEqual(operations, ["exchange", "profile", "save-streamer"]);
  await app.close();
});

test("redirects a Twitch account ownership conflict without losing cleanup", async () => {
  const operations: string[] = [];
  const app = await createApp({
    consumeState: () => ({ uid: "chzzk:viewer", purpose: "identity" }),
    saveAccount: async () => {
      throw new PlatformAccountConflictError();
    },
    revokeToken: async () => {
      operations.push("revoke");
    }
  });
  const response = await app.inject({
    method: "GET",
    url: "/api/auth/twitch/callback?code=code&state=state"
  });

  assert.equal(response.statusCode, 302);
  assert.equal(
    response.headers.location,
    "https://elobadge.test/viewer?twitch=conflict"
  );
  assert.deepEqual(operations, ["revoke"]);
  await app.close();
});

test("disconnects only the current user's Twitch identities", async () => {
  let disconnectedUid = "";
  const app = await createApp({
    disconnectAccount: async (uid) => {
      disconnectedUid = uid;
      return 1;
    }
  });
  const response = await app.inject({
    method: "DELETE",
    url: "/api/platform-accounts/twitch",
    headers: { authorization: "Bearer valid-token" }
  });

  assert.equal(response.statusCode, 200);
  assert.equal(disconnectedUid, "chzzk:viewer");
  assert.deepEqual(response.json(), { ok: true, disconnected: 1 });
  await app.close();
});

async function createApp(
  overrides: Partial<TwitchRouteDependencies> = {}
) {
  const app = Fastify();
  await registerFirebaseAuthentication(app);
  const authenticate = createFirebaseAuthPreHandler(async () => ({
    uid: "chzzk:viewer",
    provider: "chzzk",
    chzzkChannelId: "viewer"
  }));

  await registerTwitchRoutes(app, {
    authenticate,
    issueState: () => "state",
    consumeState: () => null,
    createAuthorizationUrl: (state) =>
      new URL(`https://twitch.test/oauth?state=${state}`),
    exchangeCode: async () => ({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      expiresIn: 14_400,
      scopes: ["openid"],
      tokenType: "bearer"
    }),
    getCurrentUser: async () => twitchUser,
    saveAccount: async () => undefined,
    saveStreamerAuthorization: async () => undefined,
    disconnectAccount: async () => 0,
    revokeToken: async () => undefined,
    webAppUrl: () => "https://elobadge.test",
    ...overrides
  });

  return app;
}
