import type { ChessBadges } from "@elobadge/core";
import {
  getUserChessBadgeState,
  type ChessBadgeState
} from "../firebase/chess-badges.js";

const DEFAULT_TTL_MS = 10 * 60_000;
const DEFAULT_MAX_ENTRIES = 10_000;

interface CacheEntry {
  state: ChessBadgeState;
  expiresAt: number;
}

export class RatingBadgeCache {
  private readonly entries = new Map<string, CacheEntry>();
  private readonly pending = new Map<string, Promise<ChessBadgeState>>();
  private readonly versions = new Map<string, number>();

  constructor(
    private readonly loadBadge: (uid: string) => Promise<ChessBadgeState>,
    private readonly ttlMs = DEFAULT_TTL_MS,
    private readonly maxEntries = DEFAULT_MAX_ENTRIES
  ) {}

  async get(uid: string): Promise<ChessBadgeState> {
    const cached = this.entries.get(uid);

    if (cached && cached.expiresAt > Date.now()) {
      return cloneState(cached.state);
    }

    const existingLoad = this.pending.get(uid);

    if (existingLoad) {
      return existingLoad;
    }

    const version = this.versions.get(uid) ?? 0;
    const load = this.loadBadge(uid)
      .then((state) => {
        if ((this.versions.get(uid) ?? 0) === version) {
          this.ensureCapacity();
          this.entries.set(uid, {
            state: cloneState(state),
            expiresAt: Date.now() + this.ttlMs
          });
        }
        return cloneState(state);
      })
      .finally(() => {
        if (this.pending.get(uid) === load) {
          this.pending.delete(uid);
        }
      });

    this.pending.set(uid, load);
    return load;
  }

  peek(uid: string): ChessBadgeState | null {
    const cached = this.entries.get(uid);
    return cached ? cloneState(cached.state) : null;
  }

  invalidate(uid: string): void {
    this.versions.set(uid, (this.versions.get(uid) ?? 0) + 1);
    this.entries.delete(uid);
    this.pending.delete(uid);
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

function cloneState(state: ChessBadgeState): ChessBadgeState {
  const badges: ChessBadges = {};
  if (state.badges.chesscom) {
    badges.chesscom = { ...state.badges.chesscom };
  }
  if (state.badges.lichess) {
    badges.lichess = { ...state.badges.lichess };
  }
  return { badges, preferredProvider: state.preferredProvider };
}

export const ratingBadgeCache = new RatingBadgeCache(getUserChessBadgeState);
