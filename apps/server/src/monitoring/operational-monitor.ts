import type { FastifyBaseLogger } from "fastify";
import {
  chzzkSessionManager,
  type ChzzkSessionSummary
} from "../chzzk/session.js";

const STARTUP_DELAY_MS = 30_000;
const LOG_INTERVAL_MS = 5 * 60 * 1_000;

interface OperationalMonitorDependencies {
  getChzzkSessionSummary(): ChzzkSessionSummary;
  getProcessMetrics(): {
    uptimeSeconds: number;
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
  };
}

export class OperationalMonitor {
  private startupTimer: NodeJS.Timeout | null = null;
  private logTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly dependencies: OperationalMonitorDependencies =
      defaultDependencies
  ) {}

  start(logger: FastifyBaseLogger): void {
    if (this.startupTimer || this.logTimer) {
      return;
    }

    this.startupTimer = setTimeout(() => {
      this.startupTimer = null;
      this.logStatus(logger);
    }, STARTUP_DELAY_MS);
    this.startupTimer.unref();

    this.logTimer = setInterval(() => {
      this.logStatus(logger);
    }, LOG_INTERVAL_MS);
    this.logTimer.unref();
  }

  stop(): void {
    if (this.startupTimer) {
      clearTimeout(this.startupTimer);
      this.startupTimer = null;
    }
    if (this.logTimer) {
      clearInterval(this.logTimer);
      this.logTimer = null;
    }
  }

  logStatus(logger: FastifyBaseLogger): void {
    const chzzkSessions = this.dependencies.getChzzkSessionSummary();
    const context = {
      process: this.dependencies.getProcessMetrics(),
      chzzkSessions
    };

    if (chzzkSessions.unhealthy > 0) {
      logger.warn(context, "Operational health summary");
      return;
    }

    logger.info(context, "Operational health summary");
  }
}

const defaultDependencies: OperationalMonitorDependencies = {
  getChzzkSessionSummary: () => chzzkSessionManager.getSummary(),
  getProcessMetrics: () => {
    const memory = process.memoryUsage();

    return {
      uptimeSeconds: Math.round(process.uptime()),
      rssMb: toMegabytes(memory.rss),
      heapUsedMb: toMegabytes(memory.heapUsed),
      heapTotalMb: toMegabytes(memory.heapTotal)
    };
  }
};

function toMegabytes(bytes: number): number {
  return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}

export const operationalMonitor = new OperationalMonitor();
