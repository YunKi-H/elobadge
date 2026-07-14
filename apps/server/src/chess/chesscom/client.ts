import { z } from "zod";

const profileSchema = z.object({
  username: z.string().min(1),
  player_id: z.number().int().positive(),
  status: z.string().min(1),
  url: z.string().url(),
  avatar: z.string().url().optional(),
  location: z.string().optional()
});

const ratingSchema = z.object({
  last: z.object({
    rating: z.number().int(),
    date: z.number().int().nonnegative(),
    rd: z.number().nonnegative()
  })
});

const statsSchema = z.object({
  chess_bullet: ratingSchema.optional(),
  chess_blitz: ratingSchema.optional(),
  chess_rapid: ratingSchema.optional()
});

export type ChessComSpeed = "bullet" | "blitz" | "rapid";

export interface ChessComRating {
  speed: ChessComSpeed;
  value: number;
  ratingDeviation: number;
  providerUpdatedAt: Date;
}

export interface ChessComProfile {
  username: string;
  normalizedUsername: string;
  playerId: string;
  profileUrl: string;
  avatarUrl: string | null;
  location: string | null;
  status: string;
}

export interface ChessComPlayer extends ChessComProfile {
  ratings: ChessComRating[];
}

export type ChessComClientErrorCode =
  | "invalid_response"
  | "not_found"
  | "rate_limited"
  | "request_failed";

export class ChessComClientError extends Error {
  constructor(
    public readonly code: ChessComClientErrorCode,
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "ChessComClientError";
  }
}

export interface ChessComClientOptions {
  fetch?: typeof fetch;
  baseUrl?: string;
  userAgent: string;
  timeoutMs?: number;
}

export function normalizeChessComUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function createChessComClient(options: ChessComClientOptions) {
  const request = options.fetch ?? fetch;
  const baseUrl = options.baseUrl ?? "https://api.chess.com";
  const timeoutMs = options.timeoutMs ?? 10_000;
  let requestQueue = Promise.resolve();

  const serialRequest = <T>(operation: () => Promise<T>): Promise<T> => {
    const result = requestQueue.then(operation, operation);
    requestQueue = result.then(
      () => undefined,
      () => undefined
    );
    return result;
  };

  const getJson = async (path: string): Promise<unknown> =>
    serialRequest(async () => {
      let response: Response;

      try {
        response = await request(new URL(path, baseUrl), {
          headers: {
            Accept: "application/json",
            "User-Agent": options.userAgent
          },
          signal: AbortSignal.timeout(timeoutMs)
        });
      } catch (error) {
        throw new ChessComClientError(
          "request_failed",
          error instanceof Error ? error.message : "Chess.com request failed"
        );
      }

      if (response.status === 404 || response.status === 410) {
        throw new ChessComClientError(
          "not_found",
          "Chess.com account was not found",
          response.status
        );
      }

      if (response.status === 429) {
        throw new ChessComClientError(
          "rate_limited",
          "Chess.com request was rate limited",
          response.status
        );
      }

      if (!response.ok) {
        throw new ChessComClientError(
          "request_failed",
          `Chess.com request failed with status ${response.status}`,
          response.status
        );
      }

      return (await response.json()) as unknown;
    });

  return {
    async getProfile(username: string): Promise<ChessComProfile> {
      const normalizedUsername = normalizeChessComUsername(username);
      const encodedUsername = encodeURIComponent(normalizedUsername);
      const profileResult = profileSchema.safeParse(
        await getJson(`/pub/player/${encodedUsername}`)
      );

      if (!profileResult.success) {
        throw new ChessComClientError(
          "invalid_response",
          "Chess.com returned an invalid player profile"
        );
      }

      return {
        username: profileResult.data.username,
        normalizedUsername: normalizeChessComUsername(profileResult.data.username),
        playerId: String(profileResult.data.player_id),
        profileUrl: profileResult.data.url,
        avatarUrl: profileResult.data.avatar ?? null,
        location: profileResult.data.location ?? null,
        status: profileResult.data.status
      };
    },

    async getPlayer(username: string): Promise<ChessComPlayer> {
      const profile = await this.getProfile(username);
      const encodedUsername = encodeURIComponent(profile.normalizedUsername);

      const statsResult = statsSchema.safeParse(
        await getJson(`/pub/player/${encodedUsername}/stats`)
      );

      if (!statsResult.success) {
        throw new ChessComClientError(
          "invalid_response",
          "Chess.com returned invalid player stats"
        );
      }

      const ratings: ChessComRating[] = [];
      const speedEntries = [
        ["bullet", statsResult.data.chess_bullet],
        ["blitz", statsResult.data.chess_blitz],
        ["rapid", statsResult.data.chess_rapid]
      ] as const;

      for (const [speed, stats] of speedEntries) {
        if (stats) {
          ratings.push({
            speed,
            value: stats.last.rating,
            ratingDeviation: stats.last.rd,
            providerUpdatedAt: new Date(stats.last.date * 1000)
          });
        }
      }

      return {
        ...profile,
        ratings
      };
    }
  };
}

export type ChessComClient = ReturnType<typeof createChessComClient>;

let defaultClient: ChessComClient | null = null;

export function getChessComClient(): ChessComClient {
  return (defaultClient ??= createChessComClient({
    userAgent: requiredEnv("CHESS_COM_USER_AGENT")
  }));
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}
