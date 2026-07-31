import type { StreamingPlatform } from "@elobadge/core";
import { getPlatformAccount } from "../firebase/platform-accounts.js";

const DEFAULT_TTL_MS = 10 * 60_000;
const DEFAULT_MAX_ENTRIES = 20_000;

interface CacheEntry {
  uid: string;
  expiresAt: number;
}

export class PlatformUserCache {
  private readonly entries = new Map<string, CacheEntry>();
  private readonly pending = new Map<string, Promise<string | null>>();

  constructor(
    private readonly ttlMs = DEFAULT_TTL_MS,
    private readonly maxEntries = DEFAULT_MAX_ENTRIES
  ) {}

  async get(
    platform: StreamingPlatform,
    platformUserId: string
  ): Promise<string | null> {
    const key = `${platform}:${platformUserId}`;
    const cached = this.entries.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.uid;
    }

    const pending = this.pending.get(key);
    if (pending) {
      return pending;
    }

    const load = getPlatformAccount(platform, platformUserId)
      .then((account) => {
        if (!account) {
          return null;
        }
        this.ensureCapacity();
        this.entries.set(key, {
          uid: account.userId,
          expiresAt: Date.now() + this.ttlMs
        });
        return account.userId;
      })
      .finally(() => {
        if (this.pending.get(key) === load) {
          this.pending.delete(key);
        }
      });
    this.pending.set(key, load);
    return load;
  }

  peek(
    platform: StreamingPlatform,
    platformUserId: string
  ): string | null {
    const cached = this.entries.get(`${platform}:${platformUserId}`);
    return cached && cached.expiresAt > Date.now() ? cached.uid : null;
  }

  clear(): void {
    this.entries.clear();
    this.pending.clear();
  }

  private ensureCapacity(): void {
    if (this.entries.size < this.maxEntries) {
      return;
    }
    const firstKey = this.entries.keys().next().value;
    if (typeof firstKey === "string") {
      this.entries.delete(firstKey);
    }
  }
}

export const platformUserCache = new PlatformUserCache();
