import { z } from "zod";

const TWITCH_REQUEST_TIMEOUT_MS = 10_000;

const tokenSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.number().int().positive(),
  scope: z.array(z.string()),
  token_type: z.string().min(1)
});

const usersSchema = z.object({
  data: z.array(
    z.object({
      id: z.string().min(1),
      login: z.string().min(1),
      display_name: z.string().min(1)
    })
  )
});

const eventSubSubscriptionsSchema = z.object({
  data: z.array(
    z.object({
      id: z.string().min(1),
      status: z.string().min(1),
      type: z.string().min(1),
      version: z.string().min(1)
    })
  )
});

const chatBadgesSchema = z.object({
  data: z.array(
    z.object({
      set_id: z.string().min(1),
      versions: z.array(
        z.object({
          id: z.string().min(1),
          image_url_1x: z.string().url(),
          image_url_2x: z.string().url(),
          image_url_4x: z.string().url(),
          title: z.string(),
          description: z.string()
        })
      )
    })
  )
});

export interface TwitchAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  identityBaseUrl: string;
  apiBaseUrl: string;
  eventSubWebSocketUrl: string;
}

export interface TwitchAccessToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  scopes: string[];
  tokenType: string;
}

export interface TwitchUser {
  id: string;
  login: string;
  displayName: string;
}

export interface TwitchEventSubSubscription {
  id: string;
  status: string;
  type: string;
  version: string;
}

export interface TwitchChatBadge {
  setId: string;
  versionId: string;
  imageUrl: string;
  title: string;
  description: string;
}

export type TwitchClientErrorCode =
  | "invalid_response"
  | "oauth_failed"
  | "profile_not_found"
  | "request_failed";

export class TwitchClientError extends Error {
  constructor(
    public readonly code: TwitchClientErrorCode,
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "TwitchClientError";
  }
}

export function createTwitchAuthorizationUrl(
  config: TwitchAuthConfig,
  state: string,
  scopes: readonly string[] = ["openid"]
): URL {
  const url = new URL("/oauth2/authorize", config.identityBaseUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("state", state);
  return url;
}

export function createTwitchClient(
  config: TwitchAuthConfig,
  request: typeof fetch = fetch
) {
  const requestJson = async (
    url: URL,
    init: RequestInit,
    errorCode: TwitchClientErrorCode
  ): Promise<unknown> => {
    let response: Response;

    try {
      response = await request(url, {
        ...init,
        signal: AbortSignal.timeout(TWITCH_REQUEST_TIMEOUT_MS)
      });
    } catch (error) {
      throw new TwitchClientError(
        "request_failed",
        error instanceof Error ? error.message : "Twitch request failed"
      );
    }

    if (!response.ok) {
      throw new TwitchClientError(
        errorCode,
        `Twitch request failed with status ${response.status}`,
        response.status
      );
    }

    return response.json() as Promise<unknown>;
  };

  return {
    async exchangeCode(code: string): Promise<TwitchAccessToken> {
      const result = tokenSchema.safeParse(
        await requestJson(
          new URL("/oauth2/token", config.identityBaseUrl),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              client_id: config.clientId,
              client_secret: config.clientSecret,
              code,
              grant_type: "authorization_code",
              redirect_uri: config.redirectUri
            })
          },
          "oauth_failed"
        )
      );

      if (!result.success) {
        throw new TwitchClientError(
          "invalid_response",
          "Twitch returned an invalid token response"
        );
      }

      return {
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token,
        expiresIn: result.data.expires_in,
        scopes: result.data.scope,
        tokenType: result.data.token_type
      };
    },

    async refreshAccessToken(refreshToken: string): Promise<TwitchAccessToken> {
      const result = tokenSchema.safeParse(
        await requestJson(
          new URL("/oauth2/token", config.identityBaseUrl),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              client_id: config.clientId,
              client_secret: config.clientSecret,
              grant_type: "refresh_token",
              refresh_token: refreshToken
            })
          },
          "oauth_failed"
        )
      );

      if (!result.success) {
        throw new TwitchClientError(
          "invalid_response",
          "Twitch returned an invalid refreshed token response"
        );
      }

      return {
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token,
        expiresIn: result.data.expires_in,
        scopes: result.data.scope,
        tokenType: result.data.token_type
      };
    },

    async getCurrentUser(accessToken: string): Promise<TwitchUser> {
      const result = usersSchema.safeParse(
        await requestJson(
          new URL("/helix/users", config.apiBaseUrl),
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": config.clientId
            }
          },
          "request_failed"
        )
      );

      if (!result.success) {
        throw new TwitchClientError(
          "invalid_response",
          "Twitch returned an invalid user response"
        );
      }

      const user = result.data.data[0];
      if (!user) {
        throw new TwitchClientError(
          "profile_not_found",
          "Twitch user profile was not found"
        );
      }

      return {
        id: user.id,
        login: user.login,
        displayName: user.display_name
      };
    },

    async createChatMessageSubscription(
      accessToken: string,
      broadcasterUserId: string,
      sessionId: string
    ): Promise<TwitchEventSubSubscription> {
      const result = eventSubSubscriptionsSchema.safeParse(
        await requestJson(
          new URL("/helix/eventsub/subscriptions", config.apiBaseUrl),
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": config.clientId,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              type: "channel.chat.message",
              version: "1",
              condition: {
                broadcaster_user_id: broadcasterUserId,
                user_id: broadcasterUserId
              },
              transport: {
                method: "websocket",
                session_id: sessionId
              }
            })
          },
          "request_failed"
        )
      );

      const subscription = result.success ? result.data.data[0] : undefined;
      if (!subscription) {
        throw new TwitchClientError(
          "invalid_response",
          "Twitch returned an invalid EventSub subscription response"
        );
      }

      return subscription;
    },

    async getChatBadges(
      accessToken: string,
      broadcasterUserId: string
    ): Promise<TwitchChatBadge[]> {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": config.clientId
      };
      const channelUrl = new URL("/helix/chat/badges", config.apiBaseUrl);
      channelUrl.searchParams.set("broadcaster_id", broadcasterUserId);
      const globalUrl = new URL("/helix/chat/badges/global", config.apiBaseUrl);
      const [globalResponse, channelResponse] = await Promise.all([
        requestJson(globalUrl, { headers }, "request_failed"),
        requestJson(channelUrl, { headers }, "request_failed")
      ]);
      const globalBadges = chatBadgesSchema.safeParse(globalResponse);
      const channelBadges = chatBadgesSchema.safeParse(channelResponse);

      if (!globalBadges.success || !channelBadges.success) {
        throw new TwitchClientError(
          "invalid_response",
          "Twitch returned an invalid chat badge response"
        );
      }

      const badges = new Map<string, TwitchChatBadge>();
      for (const badgeSet of [
        ...globalBadges.data.data,
        ...channelBadges.data.data
      ]) {
        for (const version of badgeSet.versions) {
          badges.set(`${badgeSet.set_id}:${version.id}`, {
            setId: badgeSet.set_id,
            versionId: version.id,
            imageUrl: version.image_url_2x,
            title: version.title,
            description: version.description
          });
        }
      }
      return [...badges.values()];
    },

    async revokeToken(accessToken: string): Promise<void> {
      let response: Response;

      try {
        response = await request(
          new URL("/oauth2/revoke", config.identityBaseUrl),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              client_id: config.clientId,
              token: accessToken
            }),
            signal: AbortSignal.timeout(TWITCH_REQUEST_TIMEOUT_MS)
          }
        );
      } catch (error) {
        throw new TwitchClientError(
          "request_failed",
          error instanceof Error ? error.message : "Twitch token revocation failed"
        );
      }

      if (!response.ok) {
        throw new TwitchClientError(
          "oauth_failed",
          `Twitch token revocation failed with status ${response.status}`,
          response.status
        );
      }
    }
  };
}

export type TwitchClient = ReturnType<typeof createTwitchClient>;

export function getTwitchAuthConfig(): TwitchAuthConfig {
  return {
    clientId: requiredEnv("TWITCH_CLIENT_ID"),
    clientSecret: requiredEnv("TWITCH_CLIENT_SECRET"),
    redirectUri: requiredEnv("TWITCH_REDIRECT_URI"),
    identityBaseUrl:
      process.env.TWITCH_IDENTITY_BASE_URL?.trim() ||
      "https://id.twitch.tv",
    apiBaseUrl:
      process.env.TWITCH_API_BASE_URL?.trim() ||
      "https://api.twitch.tv",
    eventSubWebSocketUrl:
      process.env.TWITCH_EVENTSUB_WEBSOCKET_URL?.trim() ||
      "wss://eventsub.wss.twitch.tv/ws"
  };
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}
