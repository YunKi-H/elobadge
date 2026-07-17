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

  const badges = (profile.badges ?? []).map(readBadgeIdentity);

  if (badges.some(isSubscriptionBadge)) {
    return "subscriber";
  }

  if (badges.some(isDonationBadge)) {
    return "donator";
  }

  return "viewer";
}

interface BadgeIdentity {
  type: string | null;
  imagePath: string | null;
}

function readBadgeIdentity(badge: unknown): BadgeIdentity {
  if (!badge || typeof badge !== "object") {
    return { type: null, imagePath: null };
  }

  const candidate = badge as { badgeType?: unknown; imageUrl?: unknown };

  return {
    type:
      typeof candidate.badgeType === "string"
        ? candidate.badgeType.toLowerCase()
        : null,
    imagePath: readImagePath(candidate.imageUrl)
  };
}

function isDonationBadge(badge: BadgeIdentity): boolean {
  return (
    badge.type?.includes("donation") === true ||
    /^\/static\/nng\/glive\/badge\/fan_\d+\.png$/i.test(
      badge.imagePath ?? ""
    )
  );
}

function isSubscriptionBadge(badge: BadgeIdentity): boolean {
  return (
    badge.type?.includes("subscription") === true ||
    badge.imagePath?.startsWith("/glive/subscription/badge/") === true
  );
}

function readImagePath(imageUrl: unknown): string | null {
  if (typeof imageUrl !== "string") {
    return null;
  }

  try {
    return new URL(imageUrl).pathname;
  } catch {
    return null;
  }
}
