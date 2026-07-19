import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getFirebaseAuth, getFirestoreDb } from "./admin.js";
import { consumeFirebaseLoginCode } from "./login-exchange.js";
import { getRequiredFirebaseUser, requireFirebaseUser } from "../auth/firebase.js";
import { getChzzkAuthConfig } from "../auth/chzzk/client.js";
import { accountDeletionService } from "./account-deletion-service.js";

const loginExchangeBodySchema = z.object({
  code: z.string().min(1)
});

export async function registerFirebaseRoutes(app: FastifyInstance) {
  app.post("/api/auth/firebase/exchange", {
    config: {
      rateLimit: { max: 10, timeWindow: "1 minute" }
    }
  }, async (request, reply) => {
    const result = loginExchangeBodySchema.safeParse(request.body);

    if (!result.success) {
      return reply.code(400).send({
        error: "Invalid Firebase login exchange request"
      });
    }

    const exchange = consumeFirebaseLoginCode(result.data.code);

    if (!exchange) {
      return reply.code(400).send({
        error: "Invalid or expired Firebase login code"
      });
    }

    return reply
      .header("Cache-Control", "no-store")
      .send({
        ok: true,
        customToken: exchange.customToken,
        mode: exchange.mode,
        user: exchange.user
      });
  });

  app.get(
    "/api/me",
    { preHandler: requireFirebaseUser },
    async (request, reply) => {
      return reply
        .header("Cache-Control", "no-store")
        .send({
          ok: true,
          user: getRequiredFirebaseUser(request)
        });
    }
  );

  app.delete(
    "/api/account",
    {
      preHandler: requireFirebaseUser,
      config: {
        rateLimit: { max: 3, timeWindow: "1 minute" }
      }
    },
    async (request, reply) => {
      const user = getRequiredFirebaseUser(request);

      if (
        !user.chzzkChannelId ||
        user.uid !== `chzzk:${user.chzzkChannelId}`
      ) {
        return reply.code(403).send({ error: "Chzzk identity required" });
      }

      await accountDeletionService.deleteAccount(
        user.uid,
        user.chzzkChannelId,
        getChzzkAuthConfig(),
        request.log
      );
      request.log.info("EloBadge account deleted");

      return reply.header("Cache-Control", "no-store").send({ ok: true });
    }
  );

  app.get(
    "/api/firebase/status",
    { preHandler: requireFirebaseUser },
    async (request, reply) => {
    try {
      const auth = getFirebaseAuth();
      const db = getFirestoreDb();

      await Promise.all([
        auth.listUsers(1),
        db.collection("_connectionCheck").limit(1).get()
      ]);

      return {
        ok: true,
        projectId: getFirebaseAdminProjectId(),
        services: {
          authentication: true,
          firestore: true
        }
      };
    } catch (error) {
      request.log.error({ err: error }, "Firebase connection check failed");

      return reply.code(503).send({
        ok: false,
        error: "Firebase connection failed"
      });
    }
    }
  );
}

function getFirebaseAdminProjectId() {
  return process.env.FIREBASE_PROJECT_ID ?? null;
}
