import type { ChzzkAuthConfig } from "../auth/chzzk/client.js";
import { revokeChzzkToken } from "../auth/chzzk/client.js";
import {
  deleteChzzkStreamerTokens,
  loadChzzkStreamerTokens
} from "../firebase/chzzk-tokens.js";
import {
  disconnectChzzkPlatformAccount,
  listUserPlatformAccounts
} from "../firebase/platform-accounts.js";
import { platformUserCache } from "../chess/platform-user-cache.js";
import { chzzkSessionService } from "./session-service.js";

interface ChzzkConnectionDependencies {
  loadTokens: typeof loadChzzkStreamerTokens;
  revokeToken: typeof revokeChzzkToken;
  deleteTokens: typeof deleteChzzkStreamerTokens;
  stopSession(uid: string): Promise<boolean>;
  listAccounts: typeof listUserPlatformAccounts;
  disconnectPlatformAccount(uid: string): Promise<number>;
  invalidatePlatformAccount(platformUserId: string): void;
}

const defaultDependencies: ChzzkConnectionDependencies = {
  loadTokens: loadChzzkStreamerTokens,
  revokeToken: revokeChzzkToken,
  deleteTokens: deleteChzzkStreamerTokens,
  stopSession: (uid) => chzzkSessionService.stop(uid),
  listAccounts: listUserPlatformAccounts,
  disconnectPlatformAccount: disconnectChzzkPlatformAccount,
  invalidatePlatformAccount: (platformUserId) =>
    platformUserCache.invalidate("chzzk", platformUserId)
};

export class ChzzkConnectionService {
  constructor(
    private readonly dependencies: ChzzkConnectionDependencies =
      defaultDependencies
  ) {}

  async disconnect(
    uid: string,
    config: ChzzkAuthConfig,
    disconnectAccount = false
  ): Promise<{ revoked: boolean; disconnected: number }> {
    const accounts = await this.dependencies.listAccounts(uid);
    const chzzkAccountIds = accounts.flatMap((account) =>
      account.platform === "chzzk" ? [account.platformUserId] : []
    );
    let storedTokens;

    try {
      storedTokens = await this.dependencies.loadTokens(uid);
    } catch (error) {
      await this.dependencies.stopSession(uid);
      throw error;
    }

    if (storedTokens) {
      await this.dependencies.stopSession(uid);
      await this.dependencies.revokeToken(
        config,
        storedTokens.refreshToken,
        "refresh_token"
      );
      await this.dependencies.deleteTokens(uid);
    }

    const disconnected = disconnectAccount
      ? await this.dependencies.disconnectPlatformAccount(uid)
      : 0;
    if (disconnected > 0) {
      for (const platformUserId of chzzkAccountIds) {
        this.dependencies.invalidatePlatformAccount(platformUserId);
      }
    }

    return {
      revoked: Boolean(storedTokens),
      disconnected
    };
  }
}

export const chzzkConnectionService = new ChzzkConnectionService();
