import assert from "node:assert/strict";
import test from "node:test";
import cors from "@fastify/cors";
import Fastify from "fastify";
import { registerHttpSecurity } from "./http-security.js";

test("HTTP security allows only configured browser origins", async () => {
  const previousWebAppUrl = process.env.WEB_APP_URL;
  const previousAdditionalOrigins = process.env.CORS_ALLOWED_ORIGINS;

  process.env.WEB_APP_URL = "https://badge.example.com";
  process.env.CORS_ALLOWED_ORIGINS = "https://admin.example.com";

  const app = Fastify();
  await registerHttpSecurity(app, cors);
  app.get("/test", async () => ({ ok: true }));

  const webResponse = await app.inject({
    method: "GET",
    url: "/test",
    headers: { origin: "https://badge.example.com" }
  });
  const additionalResponse = await app.inject({
    method: "GET",
    url: "/test",
    headers: { origin: "https://admin.example.com" }
  });
  const rejectedResponse = await app.inject({
    method: "GET",
    url: "/test",
    headers: { origin: "https://attacker.example.com" }
  });

  assert.equal(
    webResponse.headers["access-control-allow-origin"],
    "https://badge.example.com"
  );
  assert.equal(
    additionalResponse.headers["access-control-allow-origin"],
    "https://admin.example.com"
  );
  assert.equal(rejectedResponse.headers["access-control-allow-origin"], undefined);
  assert.equal(webResponse.headers["x-content-type-options"], "nosniff");

  await app.close();
  restoreEnv("WEB_APP_URL", previousWebAppUrl);
  restoreEnv("CORS_ALLOWED_ORIGINS", previousAdditionalOrigins);
});

test("HTTP security applies the global request limit", async () => {
  const previousWebAppUrl = process.env.WEB_APP_URL;
  const previousRateLimit = process.env.RATE_LIMIT_MAX;

  process.env.WEB_APP_URL = "https://badge.example.com";
  process.env.RATE_LIMIT_MAX = "2";

  const app = Fastify();
  await registerHttpSecurity(app, cors);
  app.get("/test", async () => ({ ok: true }));

  assert.equal((await app.inject({ url: "/test" })).statusCode, 200);
  assert.equal((await app.inject({ url: "/test" })).statusCode, 200);

  const limitedResponse = await app.inject({ url: "/test" });
  assert.equal(limitedResponse.statusCode, 429);
  assert.equal(limitedResponse.headers["retry-after"], "60");

  await app.close();
  restoreEnv("WEB_APP_URL", previousWebAppUrl);
  restoreEnv("RATE_LIMIT_MAX", previousRateLimit);
});

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}
