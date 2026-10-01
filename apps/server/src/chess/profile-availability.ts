import { ChessComClientError } from "./chesscom/client.js";
import { LichessClientError } from "./lichess/client.js";

export function nextProfileNotFoundCount(error: unknown, previous: unknown): number {
  const missingProfile =
    (error instanceof ChessComClientError || error instanceof LichessClientError) &&
    error.code === "not_found" && error.resource === "profile";
  if (!missingProfile) return 0;
  return (typeof previous === "number" && Number.isFinite(previous) ? previous : 0) + 1;
}
