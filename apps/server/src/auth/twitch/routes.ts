import type {
  FastifyInstance,
  FastifyReply,
  preHandlerAsyncHookHandler
} from "fastify";
import { z } from "zod";
import {
  getRequiredFirebaseUser,
  requireFirebaseUser
} from "../firebase.js";
import { OneTimeStore } from "../one-time-store.js";
import { getWebAppUrl } from "../../config/web.js";
import {
  deleteUserPlatformAccounts,
  PlatformAccountConflictError,
  upsertPlatformAccount
} from "../../firebase/platform-accounts.js";
import {
  createTwitchAuthorizationUrl,
  createTwitchClient,
  getTwitchAuthConfig,
  type TwitchAccessToken,
  type TwitchClient,
  type TwitchUser
} from "./client.js";

const callbackQuerySchema = z.object({
  state: z.string().min(1),
  code: z.string().min(1).optional(),
  error: z.string().min(1).optional()
});

interface PendingTwitchConnection {
  uid: string;
}

const pendingConnections =
  new OneTimeStore<PendingTwitchConnection>(10 * 60 * 1_000);

export interface TwitchRouteDependencies {
  authenticate: preHandlerAsyncHookHandler;
  issueState(value: PendingTwitchConnection): string;
  consumeState(state: string): PendingTwitchConnection | null;
  createAuthorizationUrl(state: string): URL;
  exchangeCode(code: string): Promise<TwitchAccessToken>;
  getCurrentUser(accessToken: string): Promise<TwitchUser>;
  saveAccount(uid: string, user: TwitchUser): Promise<void>;
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
        uid: getRequiredFirebaseUser(request).uid
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
        return redirectToViewer(reply, dependencies.webAppUrl(), "expired");
      }

      if (result.data.error || !result.data.code) {
        return redirectToViewer(
          reply,
          dependencies.webAppUrl(),
          result.data.error === "access_denied" ? "denied" : "error"
        );
      }

      let accessToken: string | null = null;

      try {
        const token = await dependencies.exchangeCode(result.data.code);
        accessToken = token.accessToken;
        const twitchUser = await dependencies.getCurrentUser(accessToken);
        await dependencies.saveAccount(pending.uid, twitchUser);

        request.log.info(
          {
            uid: pending.uid,
            twitchUserId: twitchUser.id
          },
          "Twitch account connected"
        );
        return redirectToViewer(
          reply,
          dependencies.webAppUrl(),
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
        return redirectToViewer(
          reply,
          dependencies.webAppUrl(),
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
    issueState: (value) => pendingConnections.issue(value),
    consumeState: (state) => pendingConnections.consume(state),
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
    disconnectAccount: (uid) =>
      deleteUserPlatformAccounts(uid, "twitch"),
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
