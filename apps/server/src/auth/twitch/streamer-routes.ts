import type {
  FastifyInstance,
  preHandlerAsyncHookHandler
} from "fastify";
import {
  deleteTwitchStreamerTokens,
  getTwitchStreamerAuthorizationStatus,
  loadTwitchStreamerTokens,
  TWITCH_STREAMER_SCOPES,
  type TwitchStreamerAuthorizationStatus
} from "../../firebase/twitch-tokens.js";
import {
  getRequiredFirebaseUser,
  requireFirebaseUser
} from "../firebase.js";
import {
  createTwitchAuthorizationUrl,
  createTwitchClient,
  getTwitchAuthConfig,
  TwitchClientError,
  type TwitchClient
} from "./client.js";
import {
  issueTwitchOAuthState,
  type PendingTwitchOAuth
} from "./oauth-state.js";

export interface TwitchStreamerRouteDependencies {
  authenticate: preHandlerAsyncHookHandler;
  issueState(value: PendingTwitchOAuth): string;
  createAuthorizationUrl(state: string): URL;
  getStatus(uid: string): Promise<TwitchStreamerAuthorizationStatus>;
  disconnect(uid: string): Promise<boolean>;
}

export async function registerTwitchStreamerRoutes(
  app: FastifyInstance,
  dependencies: TwitchStreamerRouteDependencies = defaultDependencies()
) {
  app.post(
    "/api/auth/twitch/streamer/start",
    {
      preHandler: dependencies.authenticate,
      config: {
        rateLimit: { max: 10, timeWindow: "10 minutes" }
      }
    },
    async (request) => {
      const state = dependencies.issueState({
        uid: getRequiredFirebaseUser(request).uid,
        purpose: "streamer_chat"
      });

      return {
        ok: true,
        authorizationUrl: dependencies.createAuthorizationUrl(state).toString()
      };
    }
  );

  app.get(
    "/api/twitch/streamer-authorization",
    {
      preHandler: dependencies.authenticate,
      config: {
        rateLimit: { max: 30, timeWindow: "1 minute" }
      }
    },
    async (request, reply) =>
      reply
        .header("Cache-Control", "no-store")
        .send({
          ok: true,
          authorization: await dependencies.getStatus(
            getRequiredFirebaseUser(request).uid
          )
        })
  );

  app.delete(
    "/api/twitch/streamer-authorization",
    {
      preHandler: dependencies.authenticate,
      config: {
        rateLimit: { max: 5, timeWindow: "1 minute" }
      }
    },
    async (request) => ({
      ok: true,
      disconnected: await dependencies.disconnect(
        getRequiredFirebaseUser(request).uid
      )
    })
  );
}

function defaultDependencies(): TwitchStreamerRouteDependencies {
  let client: TwitchClient | null = null;
  const getClient = () =>
    (client ??= createTwitchClient(getTwitchAuthConfig()));

  return {
    authenticate: requireFirebaseUser,
    issueState: issueTwitchOAuthState,
    createAuthorizationUrl: (state) =>
      createTwitchAuthorizationUrl(
        getTwitchAuthConfig(),
        state,
        TWITCH_STREAMER_SCOPES
      ),
    getStatus: getTwitchStreamerAuthorizationStatus,
    disconnect: async (uid) => {
      const tokens = await loadTwitchStreamerTokens(uid);
      if (!tokens) {
        return false;
      }

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
      return true;
    }
  };
}
