import type {
  FastifyInstance,
  FastifyReply,
  preHandlerAsyncHookHandler
} from "fastify";
import type { LoginMode } from "@elobadge/core";
import { z } from "zod";
import {
  ChzzkTokenRequestError,
  createChzzkAuthorizationUrl,
  exchangeChzzkAuthorizationCode,
  getChzzkCurrentUser,
  getChzzkAuthConfig,
  revokeChzzkToken
} from "./client.js";
import { chzzkSessionService } from "../../chzzk/session-service.js";
import { chzzkConnectionService } from "../../chzzk/connection-service.js";
import { getWebAppUrl } from "../../config/web.js";
import { getFirebaseAuth } from "../../firebase/admin.js";
import {
  ChzzkStoredTokenDecryptionError,
  saveChzzkStreamerTokens
} from "../../firebase/chzzk-tokens.js";
import { issueFirebaseLoginCode } from "../../firebase/login-exchange.js";
import {
  getChzzkStreamerSessionIntent,
  registerChzzkStreamer,
  upsertChzzkUser
} from "../../firebase/users.js";
import {
  PlatformAccountConflictError,
  upsertPlatformAccount
} from "../../firebase/platform-accounts.js";
import { OneTimeStore } from "../one-time-store.js";
import { getRequiredFirebaseUser, requireFirebaseUser } from "../firebase.js";
import { platformUserCache } from "../../chess/platform-user-cache.js";

const callbackQuerySchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1)
});

const startQuerySchema = z.object({
  mode: z.enum(["streamer", "viewer"])
});
const connectionStartBodySchema = z.object({
  mode: z.enum(["streamer", "viewer"])
});
const disconnectBodySchema = z.object({
  disconnectAccount: z.boolean().default(false)
});

export type PendingChzzkOAuth =
  | { purpose: "login"; mode: LoginMode }
  | { purpose: "identity" | "streamer_chat"; uid: string };

const pendingStates = new OneTimeStore<PendingChzzkOAuth>(10 * 60 * 1_000);

export interface ChzzkRouteDependencies {
  authenticate: preHandlerAsyncHookHandler;
  issueState(value: PendingChzzkOAuth): string;
  consumeState(state: string): PendingChzzkOAuth | null;
}

const defaultDependencies: ChzzkRouteDependencies = {
  authenticate: requireFirebaseUser,
  issueState: (value) => pendingStates.issue(value),
  consumeState: (state) => pendingStates.consume(state)
};

export async function registerChzzkAuthRoutes(
  app: FastifyInstance,
  dependencies: ChzzkRouteDependencies = defaultDependencies
) {
  app.get("/api/auth/chzzk/start", {
    config: {
      rateLimit: { max: 10, timeWindow: "1 minute" }
    }
  }, async (request, reply) => {
    const result = startQuerySchema.safeParse(request.query);

    if (!result.success) {
      return reply.code(400).send({
        error: "A valid Chzzk login mode is required",
        modes: ["streamer", "viewer"]
      });
    }

    const config = getChzzkAuthConfig();
    const state = dependencies.issueState({
      purpose: "login",
      mode: result.data.mode
    });

    return reply.redirect(createChzzkAuthorizationUrl(config, state).toString());
  });

  app.post(
    "/api/auth/chzzk/start",
    {
      preHandler: dependencies.authenticate,
      config: {
        rateLimit: { max: 10, timeWindow: "10 minutes" }
      }
    },
    async (request, reply) => {
      const result = connectionStartBodySchema.safeParse(request.body);
      if (!result.success) {
        return reply.code(400).send({
          error: "A valid Chzzk connection mode is required",
          modes: ["streamer", "viewer"]
        });
      }

      const state = dependencies.issueState({
        purpose:
          result.data.mode === "streamer" ? "streamer_chat" : "identity",
        uid: getRequiredFirebaseUser(request).uid
      });

      return {
        ok: true,
        authorizationUrl: createChzzkAuthorizationUrl(
          getChzzkAuthConfig(),
          state
        ).toString()
      };
    }
  );

  app.get("/api/auth/chzzk/callback", {
    config: {
      rateLimit: { max: 20, timeWindow: "1 minute" }
    }
  }, async (request, reply) => {
    const result = callbackQuerySchema.safeParse(request.query);

    if (!result.success) {
      return reply.code(400).send({
        error: "Invalid Chzzk OAuth callback query"
      });
    }

    const { code, state } = result.data;

    const pendingLogin = dependencies.consumeState(state);

    if (!pendingLogin) {
      return reply.code(400).send({
        error: "Invalid or expired Chzzk OAuth state"
      });
    }

    const config = getChzzkAuthConfig();
    let temporaryRefreshToken: string | null = null;

    try {
      const token = await exchangeChzzkAuthorizationCode(config, code, state);
      if (pendingLogin.purpose !== "login") {
        temporaryRefreshToken = token.refreshToken;
      }
      const chzzkUser = await getChzzkCurrentUser(config, token.accessToken);

      if (pendingLogin.purpose === "login") {
        const firebaseUid = await upsertChzzkUser(chzzkUser);
        platformUserCache.invalidate("chzzk", chzzkUser.channelId);

        if (pendingLogin.mode === "streamer") {
          await registerChzzkStreamer(firebaseUid, chzzkUser);
          await saveChzzkStreamerTokens(firebaseUid, token);
          try {
            await chzzkSessionService.startAfterLogin(
              firebaseUid,
              config,
              token.accessToken,
              request.log
            );
          } catch (error) {
            request.log.error(
              { err: error },
              "Chzzk chat session did not start after login"
            );
          }
        }

        const customToken = await getFirebaseAuth().createCustomToken(
          firebaseUid,
          {
            provider: "chzzk",
            chzzkChannelId: chzzkUser.channelId
          }
        );
        const loginCode = issueFirebaseLoginCode({
          customToken,
          mode: pendingLogin.mode,
          user: {
            uid: firebaseUid,
            provider: "chzzk",
            platformUserId: chzzkUser.channelId,
            displayName: chzzkUser.channelName
          }
        });

        request.log.info(
          {
            tokenType: token.tokenType,
            expiresIn: token.expiresIn,
            scope: token.scope,
            mode: pendingLogin.mode
          },
          "Chzzk OAuth token exchange succeeded"
        );

        const callbackUrl = new URL("/auth/chzzk/callback", getWebAppUrl());
        callbackUrl.searchParams.set("code", loginCode);
        return reply.redirect(callbackUrl.toString());
      }

      await upsertPlatformAccount(pendingLogin.uid, {
        platform: "chzzk",
        platformUserId: chzzkUser.channelId,
        displayName: chzzkUser.channelName
      });
      platformUserCache.invalidate("chzzk", chzzkUser.channelId);

      if (pendingLogin.purpose === "streamer_chat") {
        await registerChzzkStreamer(pendingLogin.uid, chzzkUser);
        await saveChzzkStreamerTokens(pendingLogin.uid, token);
        temporaryRefreshToken = null;
        try {
          await chzzkSessionService.startAfterLogin(
            pendingLogin.uid,
            config,
            token.accessToken,
            request.log
          );
        } catch (error) {
          request.log.error(
            { err: error, uid: pendingLogin.uid },
            "Chzzk chat session did not start after authorization"
          );
        }
      }

      request.log.info(
        {
          uid: pendingLogin.uid,
          chzzkChannelId: chzzkUser.channelId,
          purpose: pendingLogin.purpose
        },
        pendingLogin.purpose === "streamer_chat"
          ? "Chzzk streamer authorization connected"
          : "Chzzk account connected"
      );

      return redirectForConnection(
        reply,
        pendingLogin.purpose,
        "connected"
      );
    } catch (error) {
      request.log.warn(
        {
          err: error,
          uid: "uid" in pendingLogin ? pendingLogin.uid : undefined
        },
        "Chzzk account connection failed"
      );

      if (pendingLogin.purpose === "login") {
        throw error;
      }

      return redirectForConnection(
        reply,
        pendingLogin.purpose,
        error instanceof PlatformAccountConflictError ? "conflict" : "error"
      );
    } finally {
      if (temporaryRefreshToken) {
        try {
          await revokeChzzkToken(
            config,
            temporaryRefreshToken,
            "refresh_token"
          );
        } catch (error) {
          request.log.warn(
            {
              err: error,
              uid: "uid" in pendingLogin ? pendingLogin.uid : undefined
            },
            "Temporary Chzzk token revocation failed"
          );
        }
      }
    }
  });

  app.get(
    "/api/chzzk/streamer-authorization",
    { preHandler: dependencies.authenticate },
    async (request, reply) => {
      const user = getRequiredFirebaseUser(request);
      const intent = await getChzzkStreamerSessionIntent(user.uid);

      return reply
        .header("Cache-Control", "no-store")
        .send({
          ok: true,
          authorization: {
            connected: intent.tokenStatus === "active",
            tokenStatus: intent.tokenStatus
          },
          session: chzzkSessionService.getStatus(user.uid)
        });
    }
  );

  app.get(
    "/api/chzzk/session/status",
    { preHandler: dependencies.authenticate },
    async (request) => {
      const user = getRequiredFirebaseUser(request);

      return {
        ok: true,
        session: chzzkSessionService.getStatus(user.uid)
      };
    }
  );

  app.post(
    "/api/chzzk/session/stop",
    { preHandler: dependencies.authenticate },
    async (request) => {
      const user = getRequiredFirebaseUser(request);
      const stopped = await chzzkSessionService.stop(user.uid);

      return {
        ok: true,
        stopped,
        session: chzzkSessionService.getStatus(user.uid)
      };
    }
  );

  app.delete(
    "/api/chzzk/connection",
    {
      preHandler: dependencies.authenticate,
      config: {
        rateLimit: { max: 5, timeWindow: "1 minute" }
      }
    },
    async (request, reply) => {
      const user = getRequiredFirebaseUser(request);
      const body = disconnectBodySchema.safeParse(request.body ?? {});
      if (!body.success) {
        return reply.code(400).send({
          error: "치지직 연결 해제 요청이 올바르지 않습니다."
        });
      }

      try {
        const result = await chzzkConnectionService.disconnect(
          user.uid,
          getChzzkAuthConfig(),
          body.data.disconnectAccount
        );

        return { ok: true, ...result };
      } catch (error) {
        request.log.error(
          { err: error, uid: user.uid },
          "Chzzk connection disconnect failed"
        );

        if (error instanceof ChzzkStoredTokenDecryptionError) {
          return reply.code(409).send({
            code: "chzzk_token_decryption_failed",
            error:
              "저장된 치지직 토큰을 현재 암호화 키로 읽을 수 없습니다. 토큰을 저장한 환경에서 다시 시도해 주세요."
          });
        }

        if (error instanceof ChzzkTokenRequestError) {
          return reply.code(502).send({
            code: "chzzk_token_revoke_failed",
            error:
              "치지직에서 토큰을 해제하지 못했습니다. 앱 설정과 토큰을 확인해 주세요."
          });
        }

        throw error;
      }
    }
  );
}

function redirectForConnection(
  reply: FastifyReply,
  purpose: "identity" | "streamer_chat",
  result: string
) {
  const url = new URL(
    purpose === "streamer_chat" ? "/streamer" : "/viewer",
    getWebAppUrl()
  );
  url.searchParams.set("chzzk", result);
  return reply.redirect(url.toString());
}
