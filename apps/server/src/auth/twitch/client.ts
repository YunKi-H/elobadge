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

export interface TwitchAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  identityBaseUrl: string;
  apiBaseUrl: string;
}

export interface TwitchAccessToken {
  accessToken: string;
  expiresIn: number;
  scopes: string[];
  tokenType: string;
}

export interface TwitchUser {
  id: string;
  login: string;
  displayName: string;
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
  state: string
): URL {
  const url = new URL("/oauth2/authorize", config.identityBaseUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("scope", "openid");
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
      "https://api.twitch.tv"
  };
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}
