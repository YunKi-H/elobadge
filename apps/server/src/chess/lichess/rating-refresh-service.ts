import type { FastifyBaseLogger } from "fastify";
import {
  claimManualLichessRatingRefresh,
  claimScheduledLichessRatingRefresh,
  completeLichessRatingRefresh,
  failLichessRatingRefresh,
  listDueLichessRatingRefreshes,
  type LichessRatingRefreshClaim
} from "../../firebase/lichess-rating-refresh.js";
import { ratingBadgeCache } from "../badge-cache.js";
import { createLichessClient, getLichessAuthConfig, type LichessPlayer } from "./client.js";
import { getNextLichessRefreshAt } from "./rating-refresh-policy.js";

const STARTUP_DELAY_MS = 20_000;
const SCAN_INTERVAL_MS = 15 * 60 * 1_000;

interface Dependencies {
  listDue(now: Date): Promise<string[]>;
  claimManual(uid: string, now: Date): Promise<LichessRatingRefreshClaim>;
  claimScheduled(accountId: string, now: Date): Promise<LichessRatingRefreshClaim | null>;
  getPlayer(username: string): Promise<LichessPlayer>;
  complete(claim: LichessRatingRefreshClaim, player: LichessPlayer, now: Date, next: Date): Promise<boolean>;
  fail(claim: LichessRatingRefreshClaim, error: unknown, now: Date): Promise<void>;
  invalidate(channelId: string): void;
  now(): Date;
  random(): number;
}

export class LichessRatingRefreshService {
  private startupTimer: NodeJS.Timeout | null = null;
  private scanTimer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(private readonly dependencies: Dependencies = defaultDependencies()) {}

  start(logger: FastifyBaseLogger): void {
    if (this.startupTimer || this.scanTimer) {
      return;
    }
    this.startupTimer = setTimeout(() => {
      this.startupTimer = null;
      void this.refreshDueAccounts(logger);
    }, STARTUP_DELAY_MS);
    this.startupTimer.unref();
    this.scanTimer = setInterval(() => void this.refreshDueAccounts(logger), SCAN_INTERVAL_MS);
    this.scanTimer.unref();
  }

  stop(): void {
    if (this.startupTimer) clearTimeout(this.startupTimer);
    if (this.scanTimer) clearInterval(this.scanTimer);
    this.startupTimer = null;
    this.scanTimer = null;
  }

  async refreshManual(uid: string): Promise<void> {
    const claim = await this.dependencies.claimManual(uid, this.dependencies.now());
    await this.execute(claim);
  }

  async refreshDueAccounts(logger: FastifyBaseLogger): Promise<void> {
    if (this.running) return;
    this.running = true;
    let refreshed = 0;
    let failed = 0;
    try {
      const ids = await this.dependencies.listDue(this.dependencies.now());
      for (const id of ids) {
        const claim = await this.dependencies.claimScheduled(id, this.dependencies.now());
        if (!claim) continue;
        try {
          await this.execute(claim);
          refreshed += 1;
        } catch (error) {
          failed += 1;
          logger.warn({ err: error, accountId: id }, "Lichess automatic rating refresh failed");
        }
      }
      if (ids.length > 0) {
        logger.info({ candidates: ids.length, refreshed, failed }, "Lichess automatic rating refresh completed");
      }
    } catch (error) {
      logger.error({ err: error }, "Lichess rating refresh scan failed");
    } finally {
      this.running = false;
    }
  }

  private async execute(claim: LichessRatingRefreshClaim): Promise<void> {
    try {
      const player = await this.dependencies.getPlayer(claim.username);
      const now = this.dependencies.now();
      const completed = await this.dependencies.complete(
        claim,
        player,
        now,
        getNextLichessRefreshAt(now, () => this.dependencies.random())
      );
      if (completed) this.dependencies.invalidate(claim.chzzkChannelId);
    } catch (error) {
      await this.dependencies.fail(claim, error, this.dependencies.now());
      throw error;
    }
  }
}

function defaultDependencies(): Dependencies {
  let client: ReturnType<typeof createLichessClient> | null = null;
  const getClient = () => (client ??= createLichessClient(getLichessAuthConfig()));
  return {
    listDue: listDueLichessRatingRefreshes,
    claimManual: claimManualLichessRatingRefresh,
    claimScheduled: claimScheduledLichessRatingRefresh,
    getPlayer: (username) => getClient().getPlayer(username),
    complete: completeLichessRatingRefresh,
    fail: failLichessRatingRefresh,
    invalidate: (channelId) => ratingBadgeCache.invalidate(channelId),
    now: () => new Date(),
    random: Math.random
  };
}

export const lichessRatingRefreshService = new LichessRatingRefreshService();
