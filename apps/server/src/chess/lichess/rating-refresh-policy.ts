export const LICHESS_AUTO_REFRESH_MS = 12 * 60 * 60 * 1_000;
export const LICHESS_AUTO_REFRESH_JITTER_MS = 30 * 60 * 1_000;
export const LICHESS_MANUAL_REFRESH_COOLDOWN_MS = 5 * 60 * 1_000;
export const LICHESS_REFRESH_LEASE_MS = 2 * 60 * 1_000;

const MAX_RETRY_DELAY_MS = 6 * 60 * 60 * 1_000;

export function getNextLichessRefreshAt(
  now: Date,
  random: () => number = Math.random
): Date {
  return new Date(
    now.getTime() +
      LICHESS_AUTO_REFRESH_MS +
      Math.floor(random() * LICHESS_AUTO_REFRESH_JITTER_MS)
  );
}

export function getLichessRefreshRetryAt(now: Date, failureCount: number): Date {
  const delay = Math.min(
    LICHESS_MANUAL_REFRESH_COOLDOWN_MS * 2 ** Math.max(0, failureCount - 1),
    MAX_RETRY_DELAY_MS
  );
  return new Date(now.getTime() + delay);
}
