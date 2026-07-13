import { randomBytes } from "node:crypto";

export class OneTimeStore<T> {
  private readonly entries = new Map<string, { value: T; expiresAt: number }>();

  constructor(
    private readonly ttlMs: number,
    private readonly now: () => number = Date.now
  ) {}

  issue(value: T): string {
    this.removeExpired();

    const code = randomBytes(32).toString("base64url");
    this.entries.set(code, {
      value,
      expiresAt: this.now() + this.ttlMs
    });

    return code;
  }

  consume(code: string): T | null {
    const entry = this.entries.get(code);

    if (!entry) {
      return null;
    }

    this.entries.delete(code);

    if (entry.expiresAt <= this.now()) {
      return null;
    }

    return entry.value;
  }

  private removeExpired() {
    const now = this.now();

    for (const [code, entry] of this.entries) {
      if (entry.expiresAt <= now) {
        this.entries.delete(code);
      }
    }
  }
}
