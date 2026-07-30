import assert from "node:assert/strict";
import test from "node:test";
import {
  createTwitchAuthorizationUrl,
  createTwitchClient,
  type TwitchAuthConfig
} from "./client.js";

const config: TwitchAuthConfig = {
  clientId: "client-id",
  clientSecret: "client-secret",
  redirectUri: "https://elobadge.test/api/auth/twitch/callback",
  identityBaseUrl: "https://id.twitch.test",
  apiBaseUrl: "https://api.twitch.test"
};

test("creates a Twitch authorization code URL with the minimum identity scope", () => {
  const url = createTwitchAuthorizationUrl(config, "state");

  assert.equal(url.toString(), [
    "https://id.twitch.test/oauth2/authorize",
    "?response_type=code",
    "&client_id=client-id",
    "&redirect_uri=https%3A%2F%2Felobadge.test%2Fapi%2Fauth%2Ftwitch%2Fcallback",
    "&scope=openid",
    "&state=state"
  ].join(""));
});

test("creates a Twitch streamer authorization URL with chat read scope", () => {
  const url = createTwitchAuthorizationUrl(
    config,
    "streamer-state",
    ["openid", "user:read:chat"]
  );

  assert.equal(url.searchParams.get("scope"), "openid user:read:chat");
  assert.equal(url.searchParams.get("state"), "streamer-state");
});

test("exchanges a Twitch code and loads the current user", async () => {
  const requests: Array<{ url: string; init: RequestInit | undefined }> = [];
  const client = createTwitchClient(config, async (input, init) => {
    const url = String(input);
    requests.push({ url, init });

    if (url.endsWith("/oauth2/token")) {
      return jsonResponse({
        access_token: "access-token",
        refresh_token: "refresh-token",
        expires_in: 14_400,
        scope: ["openid"],
        token_type: "bearer"
      });
    }

    return jsonResponse({
      data: [{
        id: "123456789",
        login: "testuser",
        display_name: "TestUser"
      }]
    });
  });

  const token = await client.exchangeCode("authorization-code");
  const user = await client.getCurrentUser(token.accessToken);

  assert.equal(token.accessToken, "access-token");
  assert.equal(token.refreshToken, "refresh-token");
  assert.deepEqual(token.scopes, ["openid"]);
  assert.deepEqual(user, {
    id: "123456789",
    login: "testuser",
    displayName: "TestUser"
  });
  assert.equal(requests[0]?.url, "https://id.twitch.test/oauth2/token");
  assert.match(String(requests[0]?.init?.body), /client_secret=client-secret/);
  assert.equal(requests[1]?.url, "https://api.twitch.test/helix/users");
  assert.deepEqual(requests[1]?.init?.headers, {
    Authorization: "Bearer access-token",
    "Client-Id": "client-id"
  });
});

test("refreshes a Twitch authorization token", async () => {
  let requestBody = "";
  const client = createTwitchClient(config, async (_input, init) => {
    requestBody = String(init?.body);
    return jsonResponse({
      access_token: "new-access-token",
      refresh_token: "new-refresh-token",
      expires_in: 14_400,
      scope: ["openid", "user:read:chat"],
      token_type: "bearer"
    });
  });

  const token = await client.refreshAccessToken("old-refresh-token");

  assert.equal(token.accessToken, "new-access-token");
  assert.equal(token.refreshToken, "new-refresh-token");
  assert.equal(
    new URLSearchParams(requestBody).get("refresh_token"),
    "old-refresh-token"
  );
});

test("revokes a temporary Twitch access token", async () => {
  let requestBody = "";
  const client = createTwitchClient(config, async (_input, init) => {
    requestBody = String(init?.body);
    return new Response(null, { status: 200 });
  });

  await client.revokeToken("access-token");

  assert.equal(requestBody, "client_id=client-id&token=access-token");
});

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
