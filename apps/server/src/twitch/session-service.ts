import type { FastifyBaseLogger } from "fastify";
import {
  TwitchClientError,
  type TwitchAuthConfig
} from "../auth/twitch/client.js";
import {
  listRestorableTwitchStreamerAuthorizations,
  setTwitchChatSessionEnabled
} from "../firebase/twitch-tokens.js";
import {
  twitchSessionManager,
  type TwitchSessionStatus
} from "./session.js";
import { twitchTokenManager } from "./token-manager.js";

const RESTORE_CONCURRENCY = 5;
const INITIAL_RETRY_DELAY_MS = 5_000;
const MAX_RETRY_DELAY_MS = 5 * 60_000;

export class TwitchSessionService {
  private readonly operations = new Map<string, Promise<void>>();
  private readonly retryTimers = new Map<string, NodeJS.Timeout>();

  async startAfterAuthorization(
    uid: string,
    config: TwitchAuthConfig,
    broadcasterUserId: string,
    logger: FastifyBaseLogger
  ): Promise<void> {
    this.cancelRetry(uid);
    await this.runSerially(uid, async () => {
      await setTwitchChatSessionEnabled(uid, true);
      const accessToken = await twitchTokenManager.getValidAccessToken(uid, config);
      twitchSessionManager.start(
        uid,
        config,
        accessToken,
        broadcasterUserId,
        logger
      );
      await twitchTokenManager.startAutoRefresh(uid, config, logger);
    });
  }

  async stop(uid: string, disable = true): Promise<boolean> {
    this.cancelRetry(uid);
    return this.runSerially(uid, async () => {
      if (disable) {
        await setTwitchChatSessionEnabled(uid, false);
      }
      twitchTokenManager.stopAutoRefresh(uid);
      return twitchSessionManager.stop(uid);
    });
  }

  getStatus(uid: string): TwitchSessionStatus | null {
    return twitchSessionManager.getStatus(uid);
  }

  async restoreEnabledSessions(
    config: TwitchAuthConfig,
    logger: FastifyBaseLogger
  ): Promise<void> {
    const candidates =
      await listRestorableTwitchStreamerAuthorizations();
    let nextIndex = 0;
    let restored = 0;

    const worker = async () => {
      while (nextIndex < candidates.length) {
        const candidate = candidates[nextIndex++];
        if (
          candidate &&
          (await this.restoreOne(
            candidate.uid,
            candidate.platformUserId,
            config,
            logger,
            0
          ))
        ) {
          restored += 1;
        }
      }
    };

    await Promise.all(
      Array.from(
        { length: Math.min(RESTORE_CONCURRENCY, candidates.length) },
        () => worker()
      )
    );
    logger.info(
      { candidates: candidates.length, restored },
      "Twitch session startup recovery completed"
    );
  }

  close(): void {
    for (const timer of this.retryTimers.values()) {
      clearTimeout(timer);
    }
    this.retryTimers.clear();
    twitchTokenManager.stopAll();
    twitchSessionManager.stopAll();
  }

  private async restoreOne(
    uid: string,
    broadcasterUserId: string,
    config: TwitchAuthConfig,
    logger: FastifyBaseLogger,
    attempt: number
  ): Promise<boolean> {
    try {
      await this.runSerially(uid, async () => {
        const accessToken = await twitchTokenManager.getValidAccessToken(uid, config);
        twitchSessionManager.start(
          uid,
          config,
          accessToken,
          broadcasterUserId,
          logger
        );
        await twitchTokenManager.startAutoRefresh(uid, config, logger);
      });
      this.cancelRetry(uid);
      logger.info({ uid }, "Twitch session restored");
      return true;
    } catch (error) {
      logger.error(
        { err: error, uid, attempt },
        "Twitch session startup recovery failed"
      );
      if (
        !(error instanceof TwitchClientError) ||
        (error.statusCode !== 400 && error.statusCode !== 401)
      ) {
        this.scheduleRetry(
          uid,
          broadcasterUserId,
          config,
          logger,
          attempt + 1
        );
      }
      return false;
    }
  }

  private scheduleRetry(
    uid: string,
    broadcasterUserId: string,
    config: TwitchAuthConfig,
    logger: FastifyBaseLogger,
    attempt: number
  ) {
    if (this.retryTimers.has(uid)) {
      return;
    }
    const delay = Math.min(
      INITIAL_RETRY_DELAY_MS * 2 ** Math.min(attempt, 10),
      MAX_RETRY_DELAY_MS
    );
    const timer = setTimeout(() => {
      this.retryTimers.delete(uid);
      void this.restoreOne(
        uid,
        broadcasterUserId,
        config,
        logger,
        attempt
      );
    }, delay);
    timer.unref();
    this.retryTimers.set(uid, timer);
    logger.warn(
      { uid, attempt, delay },
      "Twitch session recovery retry scheduled"
    );
  }

  private cancelRetry(uid: string) {
    const timer = this.retryTimers.get(uid);
    if (timer) {
      clearTimeout(timer);
      this.retryTimers.delete(uid);
    }
  }

  private runSerially<T>(uid: string, operation: () => Promise<T>): Promise<T> {
    const previous = this.operations.get(uid) ?? Promise.resolve();
    const current = previous.then(operation, operation);
    const tail = current.then(
      () => undefined,
      () => undefined
    );
    this.operations.set(uid, tail);
    void tail.then(() => {
      if (this.operations.get(uid) === tail) {
        this.operations.delete(uid);
      }
    });
    return current;
  }
}

export const twitchSessionService = new TwitchSessionService();
