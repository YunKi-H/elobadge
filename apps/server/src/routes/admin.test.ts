import assert from "node:assert/strict";
import test from "node:test";
import Fastify from "fastify";
import { registerFirebaseAuthentication } from "../auth/firebase.js";
import { registerAdminRoutes } from "./admin.js";

test("administrator status requires Firebase authentication", async () => {
  const app = Fastify();
  await registerFirebaseAuthentication(app);
  await registerAdminRoutes(app);

  const response = await app.inject({
    method: "GET",
    url: "/api/admin/status"
  });

  assert.equal(response.statusCode, 401);
  await app.close();
});
