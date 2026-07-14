import type { ChatOverlayEvent, RatingBadge } from "@chessbadge/core";

export function parseChatOverlayEvent(data: unknown): ChatOverlayEvent | null {
  if (typeof data !== "string") {
    return null;
  }

  let value: unknown;

  try {
    value = JSON.parse(data);
  } catch {
    return null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const event = value as Partial<ChatOverlayEvent>;

  if (
    typeof event.id !== "string" ||
    typeof event.nickname !== "string" ||
    typeof event.content !== "string" ||
    typeof event.sentAt !== "string" ||
    !isRatingBadge(event.rating)
  ) {
    return null;
  }

  return event as ChatOverlayEvent;
}

function isRatingBadge(value: unknown): value is RatingBadge | null {
  if (value === null) {
    return true;
  }

  if (!value || typeof value !== "object") {
    return false;
  }

  const badge = value as Partial<RatingBadge>;
  return (
    (badge.provider === "chesscom" || badge.provider === "lichess") &&
    (badge.speed === "bullet" ||
      badge.speed === "blitz" ||
      badge.speed === "rapid" ||
      badge.speed === "classical") &&
    typeof badge.value === "number" &&
    typeof badge.provisional === "boolean"
  );
}
