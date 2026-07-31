import type { StreamingPlatform } from "@elobadge/core";
import { getPlatformAccount } from "../firebase/platform-accounts.js";

const DEFAULT_TTL_MS = 10 * 60_000;
const DEFAULT_MAX_ENTRIES = 20_000;

interface CacheEntry {
  uid: string | null;
  expiresAt: number;
}

export class PlatformUserCache {
  private readonly entries = new Map<string, CacheEntry>();
  private readonly pending = new Map<string, Promise<string | null>>();
  private readonly versions = new Map<string, number>();

  constructor(
    private readonly ttlMs = DEFAULT_TTL_MS,
    private readonly maxEntries = DEFAULT_MAX_ENTRIES,
    private readonly loadAccount = getPlatformAccount,
    private readonly now = Date.now
  ) {}

  async get(
    platform: StreamingPlatform,
    platformUserId: string
  ): Promise<string | null> {
    const key = `${platform}:${platformUserId}`;
    const cached = this.entries.get(key);
    if (cached && cached.expiresAt > this.now()) {
      return cached.uid;
    }

    const pending = this.pending.get(key);
    if (pending) {
      return pending;
    }

    const version = this.versions.get(key) ?? 0;
    const load = this.loadAccount(platform, platformUserId)
      .then((account) => {
        const uid = account?.userId ?? null;
        if ((this.versions.get(key) ?? 0) === version) {
          this.ensureCapacity();
          this.entries.set(key, {
            uid,
            expiresAt: this.now() + this.ttlMs
          });
        }
        return uid;
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
    return cached && cached.expiresAt > this.now() ? cached.uid : null;
  }

  invalidate(
    platform: StreamingPlatform,
    platformUserId: string
  ): void {
    const key = `${platform}:${platformUserId}`;
    this.versions.set(key, (this.versions.get(key) ?? 0) + 1);
    this.entries.delete(key);
    this.pending.delete(key);
  }

  clear(): void {
    this.entries.clear();
    this.pending.clear();
    this.versions.clear();
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
