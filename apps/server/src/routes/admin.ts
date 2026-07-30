import type { FastifyInstance } from "fastify";
import { requireFirebaseAdmin } from "../auth/firebase.js";
import { chzzkSessionManager } from "../chzzk/session.js";
import { getAdminDatabaseStats } from "../firebase/admin-stats.js";
import { overlayConnectionTracker } from "../realtime/overlay-connections.js";

export async function registerAdminRoutes(app: FastifyInstance) {
  app.get(
    "/api/admin/status",
    {
      preHandler: requireFirebaseAdmin,
      config: {
        rateLimit: { max: 12, timeWindow: "1 minute" }
      }
    },
    async () => {
      const memory = process.memoryUsage();

      return {
        ok: true,
        generatedAt: new Date().toISOString(),
        database: await getAdminDatabaseStats(),
        runtime: {
          uptimeSeconds: Math.round(process.uptime()),
          memory: {
            rssMb: toMegabytes(memory.rss),
            heapUsedMb: toMegabytes(memory.heapUsed),
            heapTotalMb: toMegabytes(memory.heapTotal)
          },
          chzzkSessions: chzzkSessionManager.getSummary(),
          overlayConnections: overlayConnectionTracker.getSummary()
        }
      };
    }
  );
}

function toMegabytes(bytes: number): number {
  return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}
