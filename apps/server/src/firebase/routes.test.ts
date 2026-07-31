import assert from "node:assert/strict";
import test from "node:test";
import Fastify from "fastify";
import { registerFirebaseAuthentication } from "../auth/firebase.js";
import { issueFirebaseLoginCode } from "./login-exchange.js";
import { registerFirebaseRoutes } from "./routes.js";

test("Firebase login exchange returns platform-neutral login metadata", async () => {
  const app = Fastify();
  await registerFirebaseAuthentication(app);
  await registerFirebaseRoutes(app);

  const code = issueFirebaseLoginCode({
    customToken: "custom-token",
    mode: "viewer",
    user: {
      uid: "chzzk:channel-id",
      provider: "chzzk",
      platformUserId: "channel-id",
      displayName: "viewer"
    }
  });

  const response = await app.inject({
    method: "POST",
    url: "/api/auth/firebase/exchange",
    payload: { code }
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    ok: true,
    customToken: "custom-token",
    mode: "viewer",
    user: {
      uid: "chzzk:channel-id",
      provider: "chzzk",
      platformUserId: "channel-id",
      displayName: "viewer"
    }
  });
  await app.close();
});

test("account deletion requires Firebase authentication", async () => {
  const app = Fastify();
  await registerFirebaseAuthentication(app);
  await registerFirebaseRoutes(app);

  const response = await app.inject({
    method: "DELETE",
    url: "/api/account"
  });

  assert.equal(response.statusCode, 401);
  await app.close();
});

test("platform account listing requires Firebase authentication", async () => {
  const app = Fastify();
  await registerFirebaseAuthentication(app);
  await registerFirebaseRoutes(app);

  const response = await app.inject({
    method: "GET",
    url: "/api/platform-accounts"
  });

  assert.equal(response.statusCode, 401);
  await app.close();
});
