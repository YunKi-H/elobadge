import assert from "node:assert/strict";
import test from "node:test";
import { refreshChzzkAccessToken, type ChzzkAuthConfig } from "./client.js";

test("Chzzk token refresh sends the one-time refresh token", async () => {
  const originalFetch = globalThis.fetch;
  let requestBody: unknown;

  globalThis.fetch = async (_input, init) => {
    requestBody = JSON.parse(String(init?.body));

    return new Response(
      JSON.stringify({
        content: {
          accessToken: "new-access-token",
          refreshToken: "new-refresh-token",
          tokenType: "Bearer",
          expiresIn: "86400",
          scope: "chat"
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  };

  const config: ChzzkAuthConfig = {
    clientId: "client-id",
    clientSecret: "client-secret",
    redirectUri: "http://localhost/callback",
    openApiBaseUrl: "https://openapi.example.com"
  };

  try {
    const token = await refreshChzzkAccessToken(config, "old-refresh-token");

    assert.deepEqual(requestBody, {
      grantType: "refresh_token",
      refreshToken: "old-refresh-token",
      clientId: "client-id",
      clientSecret: "client-secret"
    });
    assert.equal(token.accessToken, "new-access-token");
    assert.equal(token.refreshToken, "new-refresh-token");
    assert.equal(token.expiresIn, 86400);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
