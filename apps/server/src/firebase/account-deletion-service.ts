import type { FastifyBaseLogger } from "fastify";
import {
  isChzzkInvalidTokenError,
  revokeChzzkToken,
  type ChzzkAuthConfig
} from "../auth/chzzk/client.js";
import { ratingBadgeCache } from "../chess/badge-cache.js";
import { chzzkSessionService } from "../chzzk/session-service.js";
import { loadChzzkStreamerTokens } from "./chzzk-tokens.js";
import {
  deleteFirebaseAuthUser,
  deleteUserFirestoreData,
  type DeletedUserData
} from "./account-deletion.js";
import { revokeOverlayConnections } from "../realtime/overlay-access-events.js";
import {
  createTwitchClient,
  getTwitchAuthConfig,
  TwitchClientError
} from "../auth/twitch/client.js";
import { twitchSessionService } from "../twitch/session-service.js";
import { loadTwitchStreamerTokens } from "./twitch-tokens.js";

interface AccountDeletionDependencies {
  stopSession(uid: string): Promise<boolean>;
  disconnectTwitch(uid: string): Promise<void>;
  loadTokens: typeof loadChzzkStreamerTokens;
  revokeToken: typeof revokeChzzkToken;
  deleteFirestoreData(uid: string): Promise<DeletedUserData>;
  deleteAuthUser(uid: string): Promise<void>;
  revokeOverlay(publicToken: string): void;
  invalidateBadge(uid: string): void;
}

const defaultDependencies: AccountDeletionDependencies = {
  stopSession: (uid) => chzzkSessionService.stop(uid),
  disconnectTwitch: async (uid) => {
    await twitchSessionService.stop(uid, false);
    const tokens = await loadTwitchStreamerTokens(uid);
    if (!tokens) {
      return;
    }
    try {
      await createTwitchClient(getTwitchAuthConfig()).revokeToken(
        tokens.accessToken
      );
    } catch (error) {
      if (
        !(error instanceof TwitchClientError) ||
        (error.statusCode !== 400 && error.statusCode !== 401)
      ) {
        throw error;
      }
    }
  },
  loadTokens: loadChzzkStreamerTokens,
  revokeToken: revokeChzzkToken,
  deleteFirestoreData: deleteUserFirestoreData,
  deleteAuthUser: deleteFirebaseAuthUser,
  revokeOverlay: revokeOverlayConnections,
  invalidateBadge: (uid) => ratingBadgeCache.invalidate(uid)
};

export class AccountDeletionService {
  constructor(
    private readonly dependencies: AccountDeletionDependencies =
      defaultDependencies
  ) {}

  async deleteAccount(
    uid: string,
    chzzkConfig: ChzzkAuthConfig,
    logger: FastifyBaseLogger
  ): Promise<void> {
    await this.dependencies.stopSession(uid);
    try {
      await this.dependencies.disconnectTwitch(uid);
    } catch (error) {
      logger.warn(
        { err: error },
        "Twitch disconnection failed during account deletion"
      );
    }
    await this.revokeStoredChzzkToken(uid, chzzkConfig, logger);

    const deleted = await this.dependencies.deleteFirestoreData(uid);

    for (const publicToken of deleted.overlayTokens) {
      this.dependencies.revokeOverlay(publicToken);
    }
    this.dependencies.invalidateBadge(uid);

    await this.dependencies.deleteAuthUser(uid);
  }

  private async revokeStoredChzzkToken(
    uid: string,
    config: ChzzkAuthConfig,
    logger: FastifyBaseLogger
  ): Promise<void> {
    try {
      const tokens = await this.dependencies.loadTokens(uid);

      if (!tokens) {
        return;
      }

      try {
        await this.dependencies.revokeToken(
          config,
          tokens.refreshToken,
          "refresh_token"
        );
      } catch (refreshError) {
        if (!isChzzkInvalidTokenError(refreshError)) {
          throw refreshError;
        }

        try {
          await this.dependencies.revokeToken(
            config,
            tokens.accessToken,
            "access_token"
          );
        } catch (accessError) {
          if (!isChzzkInvalidTokenError(accessError)) {
            throw accessError;
          }
        }
      }
    } catch (error) {
      logger.warn(
        { err: error },
        "Chzzk token revocation failed during account deletion"
      );
    }
  }
}

export const accountDeletionService = new AccountDeletionService();
