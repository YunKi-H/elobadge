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

interface AccountDeletionDependencies {
  stopSession(uid: string): Promise<boolean>;
  loadTokens: typeof loadChzzkStreamerTokens;
  revokeToken: typeof revokeChzzkToken;
  deleteFirestoreData(
    uid: string,
    chzzkChannelId: string
  ): Promise<DeletedUserData>;
  deleteAuthUser(uid: string): Promise<void>;
  revokeOverlay(publicToken: string): void;
  invalidateBadge(chzzkChannelId: string): void;
}

const defaultDependencies: AccountDeletionDependencies = {
  stopSession: (uid) => chzzkSessionService.stop(uid),
  loadTokens: loadChzzkStreamerTokens,
  revokeToken: revokeChzzkToken,
  deleteFirestoreData: deleteUserFirestoreData,
  deleteAuthUser: deleteFirebaseAuthUser,
  revokeOverlay: revokeOverlayConnections,
  invalidateBadge: (chzzkChannelId) =>
    ratingBadgeCache.invalidate(chzzkChannelId)
};

export class AccountDeletionService {
  constructor(
    private readonly dependencies: AccountDeletionDependencies =
      defaultDependencies
  ) {}

  async deleteAccount(
    uid: string,
    chzzkChannelId: string,
    chzzkConfig: ChzzkAuthConfig,
    logger: FastifyBaseLogger
  ): Promise<void> {
    if (uid !== `chzzk:${chzzkChannelId}`) {
      throw new Error("Firebase user does not match the Chzzk identity");
    }

    await this.dependencies.stopSession(uid);
    await this.revokeStoredChzzkToken(uid, chzzkConfig, logger);

    const deleted = await this.dependencies.deleteFirestoreData(
      uid,
      chzzkChannelId
    );

    for (const publicToken of deleted.overlayTokens) {
      this.dependencies.revokeOverlay(publicToken);
    }
    this.dependencies.invalidateBadge(chzzkChannelId);

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
