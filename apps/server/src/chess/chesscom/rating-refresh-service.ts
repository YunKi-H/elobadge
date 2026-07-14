import type { FastifyBaseLogger } from "fastify";
import {
  claimManualChessComRatingRefresh,
  claimScheduledChessComRatingRefresh,
  completeChessComRatingRefresh,
  failChessComRatingRefresh,
  listDueChessComRatingRefreshes,
  type ChessComRatingRefreshClaim
} from "../../firebase/chess-rating-refresh.js";
import { ratingBadgeCache } from "../badge-cache.js";
import { getChessComClient, type ChessComClient, type ChessComPlayer } from "./client.js";
import { getNextChessComRefreshAt } from "./rating-refresh-policy.js";

const STARTUP_DELAY_MS = 10_000;
const SCAN_INTERVAL_MS = 15 * 60 * 1_000;

interface RatingRefreshServiceDependencies {
  listDue(now: Date): Promise<string[]>;
  claimManual(uid: string, now: Date): Promise<ChessComRatingRefreshClaim>;
  claimScheduled(
    accountId: string,
    now: Date
  ): Promise<ChessComRatingRefreshClaim | null>;
  getPlayer(username: string): Promise<ChessComPlayer>;
  complete(
    claim: ChessComRatingRefreshClaim,
    player: ChessComPlayer,
    now: Date,
    nextRefreshAt: Date
  ): Promise<boolean>;
  fail(claim: ChessComRatingRefreshClaim, error: unknown, now: Date): Promise<void>;
  invalidateBadge(channelId: string): void;
  now(): Date;
  random(): number;
}

export class ChessComRatingRefreshService {
  private startupTimer: NodeJS.Timeout | null = null;
  private scanTimer: NodeJS.Timeout | null = null;
  private scanRunning = false;

  constructor(
    private readonly dependencies: RatingRefreshServiceDependencies =
      defaultDependencies()
  ) {}

  start(logger: FastifyBaseLogger): void {
    if (this.startupTimer || this.scanTimer) {
      return;
    }

    this.startupTimer = setTimeout(() => {
      this.startupTimer = null;
      void this.refreshDueAccounts(logger);
    }, STARTUP_DELAY_MS);
    this.startupTimer.unref();

    this.scanTimer = setInterval(() => {
      void this.refreshDueAccounts(logger);
    }, SCAN_INTERVAL_MS);
    this.scanTimer.unref();
  }

  stop(): void {
    if (this.startupTimer) {
      clearTimeout(this.startupTimer);
      this.startupTimer = null;
    }
    if (this.scanTimer) {
      clearInterval(this.scanTimer);
      this.scanTimer = null;
    }
  }

  async refreshManual(uid: string): Promise<void> {
    const claim = await this.dependencies.claimManual(uid, this.dependencies.now());
    await this.executeRefresh(claim);
  }

  async refreshDueAccounts(logger: FastifyBaseLogger): Promise<void> {
    if (this.scanRunning) {
      return;
    }

    this.scanRunning = true;
    let refreshed = 0;
    let failed = 0;

    try {
      const now = this.dependencies.now();
      const accountIds = await this.dependencies.listDue(now);

      for (const accountId of accountIds) {
        const claim = await this.dependencies.claimScheduled(
          accountId,
          this.dependencies.now()
        );

        if (!claim) {
          continue;
        }

        try {
          await this.executeRefresh(claim);
          refreshed += 1;
        } catch (error) {
          failed += 1;
          logger.warn(
            { err: error, accountId },
            "Chess.com automatic rating refresh failed"
          );
        }
      }

      if (accountIds.length > 0) {
        logger.info(
          { candidates: accountIds.length, refreshed, failed },
          "Chess.com automatic rating refresh completed"
        );
      }
    } catch (error) {
      logger.error({ err: error }, "Chess.com rating refresh scan failed");
    } finally {
      this.scanRunning = false;
    }
  }

  private async executeRefresh(claim: ChessComRatingRefreshClaim): Promise<void> {
    try {
      const player = await this.dependencies.getPlayer(claim.username);
      const now = this.dependencies.now();
      const completed = await this.dependencies.complete(
        claim,
        player,
        now,
        getNextChessComRefreshAt(now, () => this.dependencies.random())
      );

      if (completed) {
        this.dependencies.invalidateBadge(claim.chzzkChannelId);
      }
    } catch (error) {
      await this.dependencies.fail(claim, error, this.dependencies.now());
      throw error;
    }
  }
}

function defaultDependencies(): RatingRefreshServiceDependencies {
  let client: ChessComClient | null = null;
  const getClient = () => (client ??= getChessComClient());

  return {
    listDue: (now) => listDueChessComRatingRefreshes(now),
    claimManual: claimManualChessComRatingRefresh,
    claimScheduled: claimScheduledChessComRatingRefresh,
    getPlayer: (username) => getClient().getPlayer(username),
    complete: completeChessComRatingRefresh,
    fail: failChessComRatingRefresh,
    invalidateBadge: (channelId) => ratingBadgeCache.invalidate(channelId),
    now: () => new Date(),
    random: Math.random
  };
}

export const chessComRatingRefreshService = new ChessComRatingRefreshService();
