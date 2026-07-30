import assert from "node:assert/strict";
import test from "node:test";
import type { FastifyBaseLogger } from "fastify";
import type { ChzzkSessionSummary } from "../chzzk/session.js";
import { OperationalMonitor } from "./operational-monitor.js";

test("operational monitor logs healthy session summaries at info level", () => {
  const entries: string[] = [];
  const monitor = new OperationalMonitor({
    getChzzkSessionSummary: () => summary({ healthy: 2, unhealthy: 0 }),
    getProcessMetrics: () => ({
      uptimeSeconds: 60,
      rssMb: 100,
      heapUsedMb: 40,
      heapTotalMb: 80
    })
  });

  monitor.logStatus(logger(entries));

  assert.deepEqual(entries, ["info:Operational health summary"]);
});

test("operational monitor warns when any Chzzk session is unhealthy", () => {
  const entries: string[] = [];
  const monitor = new OperationalMonitor({
    getChzzkSessionSummary: () => summary({ healthy: 1, unhealthy: 1 }),
    getProcessMetrics: () => ({
      uptimeSeconds: 60,
      rssMb: 100,
      heapUsedMb: 40,
      heapTotalMb: 80
    })
  });

  monitor.logStatus(logger(entries));

  assert.deepEqual(entries, ["warn:Operational health summary"]);
});

function summary(
  values: Pick<ChzzkSessionSummary, "healthy" | "unhealthy">
): ChzzkSessionSummary {
  return {
    total: values.healthy + values.unhealthy,
    connected: values.healthy,
    subscribed: values.healthy,
    healthy: values.healthy,
    unhealthy: values.unhealthy,
    byHealth: {
      connecting: 0,
      healthy_idle: values.healthy,
      healthy_active: 0,
      reconnecting: values.unhealthy,
      subscription_failed: 0,
      connection_failed: 0,
      unknown: 0
    }
  };
}

function logger(entries: string[]): FastifyBaseLogger {
  return {
    info: (_context: unknown, message: string) => {
      entries.push(`info:${message}`);
    },
    warn: (_context: unknown, message: string) => {
      entries.push(`warn:${message}`);
    }
  } as FastifyBaseLogger;
}
