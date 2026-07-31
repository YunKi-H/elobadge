import assert from "node:assert/strict";
import test from "node:test";
import Fastify from "fastify";
import {
  createFirebaseAuthPreHandler,
  registerFirebaseAuthentication
} from "../firebase.js";
import {
  registerChzzkAuthRoutes,
  type PendingChzzkOAuth
} from "./routes.js";

test("Chzzk login requires an explicit mode", async () => {
  const app = Fastify();
  await registerChzzkAuthRoutes(app);

  const response = await app.inject({
    method: "GET",
    url: "/api/auth/chzzk/start"
  });

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.json(), {
    error: "A valid Chzzk login mode is required",
    modes: ["streamer", "viewer"]
  });
  await app.close();
});

test("Chzzk login accepts streamer and viewer modes", async () => {
  const previousClientId = process.env.CHZZK_CLIENT_ID;
  const previousClientSecret = process.env.CHZZK_CLIENT_SECRET;
  const previousRedirectUri = process.env.CHZZK_REDIRECT_URI;

  process.env.CHZZK_CLIENT_ID = "test-client";
  process.env.CHZZK_CLIENT_SECRET = "test-secret";
  process.env.CHZZK_REDIRECT_URI = "http://localhost:3000/api/auth/chzzk/callback";

  const app = Fastify();
  await registerChzzkAuthRoutes(app);

  for (const mode of ["streamer", "viewer"]) {
    const response = await app.inject({
      method: "GET",
      url: `/api/auth/chzzk/start?mode=${mode}`
    });

    assert.equal(response.statusCode, 302);
    assert.match(response.headers.location ?? "", /^https:\/\/chzzk\.naver\.com\/account-interlock/);
  }

  await app.close();
  restoreEnv("CHZZK_CLIENT_ID", previousClientId);
  restoreEnv("CHZZK_CLIENT_SECRET", previousClientSecret);
  restoreEnv("CHZZK_REDIRECT_URI", previousRedirectUri);
});

test("Chzzk account connection requires Firebase authentication", async () => {
  const app = Fastify();
  await registerChzzkAuthRoutes(app);

  const response = await app.inject({
    method: "POST",
    url: "/api/auth/chzzk/start",
    payload: { mode: "viewer" }
  });

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.json(), { error: "Authentication required" });
  await app.close();
});

test("Chzzk account connection binds the current EloBadge UID to OAuth state", async () => {
  const previousClientId = process.env.CHZZK_CLIENT_ID;
  const previousClientSecret = process.env.CHZZK_CLIENT_SECRET;
  const previousRedirectUri = process.env.CHZZK_REDIRECT_URI;
  process.env.CHZZK_CLIENT_ID = "test-client";
  process.env.CHZZK_CLIENT_SECRET = "test-secret";
  process.env.CHZZK_REDIRECT_URI =
    "http://localhost:3000/api/auth/chzzk/callback";

  let pending: PendingChzzkOAuth | null = null;
  const app = Fastify();
  await registerFirebaseAuthentication(app);
  await registerChzzkAuthRoutes(app, {
    authenticate: createFirebaseAuthPreHandler(async () => ({
      uid: "twitch:123456789",
      provider: "twitch"
    })),
    issueState: (value) => {
      pending = value;
      return "connection-state";
    },
    consumeState: () => null
  });

  const response = await app.inject({
    method: "POST",
    url: "/api/auth/chzzk/start",
    headers: { authorization: "Bearer valid-token" },
    payload: { mode: "streamer" }
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(pending, {
    purpose: "streamer_chat",
    uid: "twitch:123456789"
  });
  assert.match(
    response.json().authorizationUrl,
    /^https:\/\/chzzk\.naver\.com\/account-interlock/
  );

  await app.close();
  restoreEnv("CHZZK_CLIENT_ID", previousClientId);
  restoreEnv("CHZZK_CLIENT_SECRET", previousClientSecret);
  restoreEnv("CHZZK_REDIRECT_URI", previousRedirectUri);
});

test("Chzzk connection disconnect requires Firebase authentication", async () => {
  const app = Fastify();
  await registerChzzkAuthRoutes(app);

  const response = await app.inject({
    method: "DELETE",
    url: "/api/chzzk/connection"
  });

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.json(), { error: "Authentication required" });
  await app.close();
});

test("Chzzk streamer authorization status requires Firebase authentication", async () => {
  const app = Fastify();
  await registerChzzkAuthRoutes(app);

  const response = await app.inject({
    method: "GET",
    url: "/api/chzzk/streamer-authorization"
  });

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.json(), { error: "Authentication required" });
  await app.close();
});

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}
