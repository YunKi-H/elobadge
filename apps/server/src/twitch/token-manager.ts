import type { FastifyBaseLogger } from "fastify";
import {
  createTwitchClient,
  TwitchClientError,
  type TwitchAuthConfig
} from "../auth/twitch/client.js";
import {
  loadTwitchStreamerTokens,
  getTwitchStreamerAuthorizationStatus,
  markTwitchStreamerReauthenticationRequired,
  saveRefreshedTwitchStreamerTokens,
  type StoredTwitchTokens
} from "../firebase/twitch-tokens.js";
import { twitchSessionManager } from "./session.js";

const REFRESH_WINDOW_MS = 5 * 60_000;
const RETRY_DELAY_MS = 60_000;

interface AutoRefreshState {
  config: TwitchAuthConfig;
  logger: FastifyBaseLogger;
  timer: NodeJS.Timeout | null;
}

export class TwitchTokenManager {
  private readonly states = new Map<string, AutoRefreshState>();
  private readonly refreshes = new Map<string, Promise<StoredTwitchTokens>>();

  async startAutoRefresh(
    uid: string,
    config: TwitchAuthConfig,
    logger: FastifyBaseLogger
  ): Promise<void> {
    this.stopAutoRefresh(uid);
    const token = await loadTwitchStreamerTokens(uid);
    if (!token) {
      throw new Error(`No stored Twitch token for ${uid}`);
    }

    const state: AutoRefreshState = { config, logger, timer: null };
    this.states.set(uid, state);
    this.schedule(uid, state, token.expiresAt);
  }

  stopAutoRefresh(uid: string): void {
    const state = this.states.get(uid);
    if (state?.timer) {
      clearTimeout(state.timer);
    }
    this.states.delete(uid);
  }

  stopAll(): void {
    for (const uid of this.states.keys()) {
      this.stopAutoRefresh(uid);
    }
  }

  async getValidAccessToken(
    uid: string,
    config: TwitchAuthConfig
  ): Promise<string> {
    const token = await loadTwitchStreamerTokens(uid);
    if (!token) {
      throw new Error(`No stored Twitch token for ${uid}`);
    }

    return getTwitchTokenRefreshDelay(token.expiresAt) > 0
      ? token.accessToken
      : (await this.refresh(uid, config)).accessToken;
  }

  private schedule(
    uid: string,
    state: AutoRefreshState,
    expiresAt: Date,
    delayOverride?: number
  ) {
    if (this.states.get(uid) !== state) {
      return;
    }
    if (state.timer) {
      clearTimeout(state.timer);
    }

    state.timer = setTimeout(
      () => void this.runScheduledRefresh(uid, state),
      delayOverride ?? getTwitchTokenRefreshDelay(expiresAt)
    );
    state.timer.unref();
  }

  private async runScheduledRefresh(uid: string, state: AutoRefreshState) {
    if (this.states.get(uid) !== state) {
      return;
    }
    state.timer = null;

    try {
      const authorization =
        await getTwitchStreamerAuthorizationStatus(uid);
      if (!authorization.connected) {
        this.stopAutoRefresh(uid);
        state.logger.warn(
          { uid },
          "Twitch token auto-refresh stopped pending reauthentication"
        );
        return;
      }
      const refreshed = await this.refresh(uid, state.config);
      twitchSessionManager.updateAccessToken(uid, refreshed.accessToken);
      this.schedule(uid, state, refreshed.expiresAt);
      state.logger.info(
        { uid, expiresAt: refreshed.expiresAt.toISOString() },
        "Twitch access token refreshed"
      );
    } catch (error) {
      state.logger.error({ err: error, uid }, "Twitch access token refresh failed");
      if (isTwitchAuthorizationError(error)) {
        this.stopAutoRefresh(uid);
        return;
      }
      this.schedule(uid, state, new Date(), RETRY_DELAY_MS);
    }
  }

  private refresh(
    uid: string,
    config: TwitchAuthConfig
  ): Promise<StoredTwitchTokens> {
    const active = this.refreshes.get(uid);
    if (active) {
      return active;
    }

    const refresh = this.performRefresh(uid, config);
    this.refreshes.set(uid, refresh);
    void refresh.finally(() => {
      if (this.refreshes.get(uid) === refresh) {
        this.refreshes.delete(uid);
      }
    }).catch(() => undefined);
    return refresh;
  }

  private async performRefresh(
    uid: string,
    config: TwitchAuthConfig
  ): Promise<StoredTwitchTokens> {
    const stored = await loadTwitchStreamerTokens(uid);
    if (!stored) {
      throw new Error(`No stored Twitch token for ${uid}`);
    }

    try {
      const refreshed = await createTwitchClient(config).refreshAccessToken(
        stored.refreshToken
      );
      await saveRefreshedTwitchStreamerTokens(uid, refreshed);
      return {
        ...stored,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        tokenType: refreshed.tokenType,
        scopes: refreshed.scopes,
        expiresAt: new Date(Date.now() + refreshed.expiresIn * 1_000)
      };
    } catch (error) {
      if (isTwitchAuthorizationError(error)) {
        await markTwitchStreamerReauthenticationRequired(uid);
      }
      throw error;
    }
  }
}

export function getTwitchTokenRefreshDelay(
  expiresAt: Date,
  now = Date.now()
): number {
  return Math.max(0, expiresAt.getTime() - now - REFRESH_WINDOW_MS);
}

function isTwitchAuthorizationError(error: unknown): boolean {
  return (
    error instanceof TwitchClientError &&
    (error.statusCode === 400 || error.statusCode === 401)
  );
}

export const twitchTokenManager = new TwitchTokenManager();
