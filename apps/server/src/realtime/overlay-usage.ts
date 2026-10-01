export class OverlayUsageRecorder {
  private readonly nextWriteAt = new Map<string, number>();
  private readonly pending = new Set<string>();

  constructor(
    private readonly persist: (uid: string) => Promise<void>,
    private readonly now: () => number = Date.now,
    private readonly intervalMs = 5 * 60_000
  ) {}

  async record(uid: string): Promise<void> {
    const now = this.now();
    if (this.pending.has(uid) || (this.nextWriteAt.get(uid) ?? 0) > now) {
      return;
    }
    for (const [key, expiresAt] of this.nextWriteAt) {
      if (expiresAt <= now) this.nextWriteAt.delete(key);
    }
    this.pending.add(uid);
    // Failed writes also back off so a database outage cannot flood requests.
    this.nextWriteAt.set(uid, now + this.intervalMs);
    try {
      await this.persist(uid);
    } finally {
      this.pending.delete(uid);
    }
  }
}
