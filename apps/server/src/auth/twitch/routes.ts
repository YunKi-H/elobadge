import type {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyReply,
  preHandlerAsyncHookHandler
} from "fastify";
import { z } from "zod";
import {
  getRequiredFirebaseUser,
  requireFirebaseUser
} from "../firebase.js";
import { getWebAppUrl } from "../../config/web.js";
import {
  deleteUserPlatformAccounts,
  PlatformAccountConflictError,
  upsertPlatformAccount
} from "../../firebase/platform-accounts.js";
import {
  deleteTwitchStreamerTokens,
  loadTwitchStreamerTokens,
  saveTwitchStreamerAuthorization
} from "../../firebase/twitch-tokens.js";
import {
  consumeTwitchOAuthState,
  getTwitchOAuthPurposeHint,
  issueTwitchOAuthState,
  type PendingTwitchOAuth
} from "./oauth-state.js";
import {
  createTwitchAuthorizationUrl,
  createTwitchClient,
  getTwitchAuthConfig,
  TwitchClientError,
  type TwitchAccessToken,
  type TwitchClient,
  type TwitchUser
} from "./client.js";
import { twitchSessionService } from "../../twitch/session-service.js";

const callbackQuerySchema = z.object({
  state: z.string().min(1),
  code: z.string().min(1).optional(),
  error: z.string().min(1).optional()
});

export interface TwitchRouteDependencies {
  authenticate: preHandlerAsyncHookHandler;
  issueState(value: PendingTwitchOAuth): string;
  consumeState(state: string): PendingTwitchOAuth | null;
  createAuthorizationUrl(state: string): URL;
  exchangeCode(code: string): Promise<TwitchAccessToken>;
  getCurrentUser(accessToken: string): Promise<TwitchUser>;
  saveAccount(uid: string, user: TwitchUser): Promise<void>;
  saveStreamerAuthorization(
    uid: string,
    user: TwitchUser,
    token: TwitchAccessToken
  ): Promise<void>;
  startStreamerSession(
    uid: string,
    user: TwitchUser,
    logger: FastifyBaseLogger
  ): Promise<void>;
  disconnectAccount(uid: string): Promise<number>;
  revokeToken(accessToken: string): Promise<void>;
  webAppUrl(): string;
}

export async function registerTwitchRoutes(
  app: FastifyInstance,
  dependencies: TwitchRouteDependencies = defaultDependencies()
) {
  app.post(
    "/api/auth/twitch/start",
    {
      preHandler: dependencies.authenticate,
      config: {
        rateLimit: { max: 10, timeWindow: "10 minutes" }
      }
    },
    async (request) => {
      const state = dependencies.issueState({
        uid: getRequiredFirebaseUser(request).uid,
        purpose: "identity"
      });

      return {
        ok: true,
        authorizationUrl: dependencies.createAuthorizationUrl(state).toString()
      };
    }
  );

  app.get(
    "/api/auth/twitch/callback",
    {
      config: {
        rateLimit: { max: 20, timeWindow: "1 minute" }
      }
    },
    async (request, reply) => {
      const result = callbackQuerySchema.safeParse(request.query);
      if (!result.success) {
        return redirectToViewer(reply, dependencies.webAppUrl(), "error");
      }

      const pending = dependencies.consumeState(result.data.state);
      if (!pending) {
        return redirectForPurpose(
          reply,
          dependencies.webAppUrl(),
          getTwitchOAuthPurposeHint(result.data.state) ?? "identity",
          "expired"
        );
      }

      if (result.data.error || !result.data.code) {
        return redirectForPurpose(
          reply,
          dependencies.webAppUrl(),
          pending.purpose,
          result.data.error === "access_denied" ? "denied" : "error"
        );
      }

      let accessToken: string | null = null;

      try {
        const token = await dependencies.exchangeCode(result.data.code);
        accessToken = token.accessToken;
        const twitchUser = await dependencies.getCurrentUser(accessToken);
        if (pending.purpose === "streamer_chat") {
          await dependencies.saveStreamerAuthorization(
            pending.uid,
            twitchUser,
            token
          );
          try {
            await dependencies.startStreamerSession(
              pending.uid,
              twitchUser,
              request.log
            );
          } catch (error) {
            request.log.error(
              { err: error, uid: pending.uid },
              "Twitch chat session did not start after authorization"
            );
          }
        } else {
          await dependencies.saveAccount(pending.uid, twitchUser);
        }
        const streamerAuthorization = pending.purpose === "streamer_chat";

        request.log.info(
          {
            uid: pending.uid,
            twitchUserId: twitchUser.id,
            purpose: pending.purpose
          },
          streamerAuthorization
            ? "Twitch streamer authorization connected"
            : "Twitch account connected"
        );
        accessToken = streamerAuthorization ? null : accessToken;
        return redirectForPurpose(
          reply,
          dependencies.webAppUrl(),
          pending.purpose,
          "connected"
        );
      } catch (error) {
        const redirectResult =
          error instanceof PlatformAccountConflictError
            ? "conflict"
            : "error";
        request.log.warn(
          { err: error, uid: pending.uid },
          "Twitch account connection failed"
        );
        return redirectForPurpose(
          reply,
          dependencies.webAppUrl(),
          pending.purpose,
          redirectResult
        );
      } finally {
        if (accessToken) {
          try {
            await dependencies.revokeToken(accessToken);
          } catch (error) {
            request.log.warn(
              { err: error, uid: pending.uid },
              "Temporary Twitch token revocation failed"
            );
          }
        }
      }
    }
  );

  app.delete(
    "/api/platform-accounts/twitch",
    {
      preHandler: dependencies.authenticate,
      config: {
        rateLimit: { max: 5, timeWindow: "1 minute" }
      }
    },
    async (request) => {
      const disconnected = await dependencies.disconnectAccount(
        getRequiredFirebaseUser(request).uid
      );

      return {
        ok: true,
        disconnected
      };
    }
  );
}

function defaultDependencies(): TwitchRouteDependencies {
  let client: TwitchClient | null = null;
  const getClient = () =>
    (client ??= createTwitchClient(getTwitchAuthConfig()));

  return {
    authenticate: requireFirebaseUser,
    issueState: issueTwitchOAuthState,
    consumeState: consumeTwitchOAuthState,
    createAuthorizationUrl: (state) =>
      createTwitchAuthorizationUrl(getTwitchAuthConfig(), state),
    exchangeCode: (code) => getClient().exchangeCode(code),
    getCurrentUser: (accessToken) =>
      getClient().getCurrentUser(accessToken),
    saveAccount: (uid, user) =>
      upsertPlatformAccount(uid, {
        platform: "twitch",
        platformUserId: user.id,
        displayName: user.displayName
      }),
    saveStreamerAuthorization: saveTwitchStreamerAuthorization,
    startStreamerSession: (uid, user, logger) =>
      twitchSessionService.startAfterAuthorization(
        uid,
        getTwitchAuthConfig(),
        user.id,
        logger
      ),
    disconnectAccount: async (uid) => {
      const tokens = await loadTwitchStreamerTokens(uid);

      if (tokens) {
        await twitchSessionService.stop(uid, false);
        try {
          await getClient().revokeToken(tokens.accessToken);
        } catch (error) {
          if (
            !(error instanceof TwitchClientError) ||
            (error.statusCode !== 400 && error.statusCode !== 401)
          ) {
            throw error;
          }
        }

        await deleteTwitchStreamerTokens(uid);
      }

      return deleteUserPlatformAccounts(uid, "twitch");
    },
    revokeToken: (accessToken) => getClient().revokeToken(accessToken),
    webAppUrl: getWebAppUrl
  };
}

function redirectToViewer(
  reply: FastifyReply,
  webAppUrl: string,
  result: string
) {
  const url = new URL("/viewer", webAppUrl);
  url.searchParams.set("twitch", result);
  return reply.redirect(url.toString());
}

function redirectForPurpose(
  reply: FastifyReply,
  webAppUrl: string,
  purpose: PendingTwitchOAuth["purpose"],
  result: string
) {
  if (purpose === "streamer_chat") {
    const url = new URL("/streamer", webAppUrl);
    url.searchParams.set("twitchChat", result);
    return reply.redirect(url.toString());
  }

  return redirectToViewer(reply, webAppUrl, result);
}
