import type { ChatAuthorKind } from "@elobadge/core";

export function classifyChzzkChatAuthor(profile: {
  userRoleCode?: string;
  badges?: unknown[];
}): ChatAuthorKind {
  if (profile.userRoleCode === "streamer") {
    return "streamer";
  }

  if (
    profile.userRoleCode === "streaming_channel_manager" ||
    profile.userRoleCode === "streaming_chat_manager"
  ) {
    return "manager";
  }

  const badgeTypes = (profile.badges ?? [])
    .map(readBadgeType)
    .filter((badgeType): badgeType is string => badgeType !== null);

  if (badgeTypes.some((badgeType) => badgeType.includes("donation"))) {
    return "donator";
  }

  if (badgeTypes.some((badgeType) => badgeType.includes("subscription"))) {
    return "subscriber";
  }

  return "viewer";
}

function readBadgeType(badge: unknown): string | null {
  if (!badge || typeof badge !== "object" || !("badgeType" in badge)) {
    return null;
  }

  return typeof badge.badgeType === "string"
    ? badge.badgeType.toLowerCase()
    : null;
}
