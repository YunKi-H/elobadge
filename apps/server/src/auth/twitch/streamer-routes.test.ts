import assert from "node:assert/strict";
import test from "node:test";
import Fastify from "fastify";
import {
  createFirebaseAuthPreHandler,
  registerFirebaseAuthentication
} from "../firebase.js";
import {
  registerTwitchStreamerRoutes,
  type TwitchStreamerRouteDependencies
} from "./streamer-routes.js";

test("Twitch streamer authorization requires Firebase authentication", async () => {
  const app = await createApp();

  for (const request of [
    { method: "POST", url: "/api/auth/twitch/streamer/start" },
    { method: "GET", url: "/api/twitch/streamer-authorization" },
    { method: "DELETE", url: "/api/twitch/streamer-authorization" }
  ] as const) {
    const response = await app.inject(request);
    assert.equal(response.statusCode, 401);
  }

  await app.close();
});

test("starts Twitch streamer OAuth with purpose bound to shared state", async () => {
  let pendingUid = "";
  let pendingPurpose = "";
  const app = await createApp({
    issueState: (value) => {
      pendingUid = value.uid;
      pendingPurpose = value.purpose;
      return "streamer-state";
    }
  });

  const response = await app.inject({
    method: "POST",
    url: "/api/auth/twitch/streamer/start",
    headers: { authorization: "Bearer valid-token" }
  });

  assert.equal(response.statusCode, 200);
  assert.equal(pendingUid, "chzzk:streamer");
  assert.equal(pendingPurpose, "streamer_chat");
  assert.equal(
    response.json().authorizationUrl,
    "https://twitch.test/oauth?state=streamer-state"
  );
  await app.close();
});

test("returns Twitch streamer authorization status", async () => {
  const app = await createApp({
    getStatus: async () => ({
      connected: true,
      platformUserId: "123456789",
      displayName: "Streamer",
      expiresAt: "2026-08-01T00:00:00.000Z",
      scopes: ["openid", "user:read:chat"]
    })
  });

  const response = await app.inject({
    method: "GET",
    url: "/api/twitch/streamer-authorization",
    headers: { authorization: "Bearer valid-token" }
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.json().authorization.connected, true);
  assert.equal(response.headers["cache-control"], "no-store");
  await app.close();
});

test("disconnects Twitch streamer authorization for the current user", async () => {
  let disconnectedUid = "";
  const app = await createApp({
    disconnect: async (uid) => {
      disconnectedUid = uid;
      return true;
    }
  });

  const response = await app.inject({
    method: "DELETE",
    url: "/api/twitch/streamer-authorization",
    headers: { authorization: "Bearer valid-token" }
  });

  assert.equal(response.statusCode, 200);
  assert.equal(disconnectedUid, "chzzk:streamer");
  assert.deepEqual(response.json(), { ok: true, disconnected: true });
  await app.close();
});

async function createApp(
  overrides: Partial<TwitchStreamerRouteDependencies> = {}
) {
  const app = Fastify();
  await registerFirebaseAuthentication(app);
  const authenticate = createFirebaseAuthPreHandler(async () => ({
    uid: "chzzk:streamer",
    provider: "chzzk",
    chzzkChannelId: "streamer"
  }));

  await registerTwitchStreamerRoutes(app, {
    authenticate,
    issueState: () => "state",
    createAuthorizationUrl: (state) =>
      new URL(`https://twitch.test/oauth?state=${state}`),
    getStatus: async () => ({ connected: false }),
    disconnect: async () => false,
    ...overrides
  });

  return app;
}
