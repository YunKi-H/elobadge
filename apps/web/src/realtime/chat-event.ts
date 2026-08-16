import {
  hasVisibleChatContent,
  isOverlayFontFamily,
  type ChatAuthorKind,
  type ChatEmote,
  type ChatEventSource,
  type ChatOverlayEvent,
  type ChessBadges,
  type ChessProvider,
  type OverlayAppearance,
  type PlatformBadgeKind,
  type PlatformChatBadge,
  type RatingBadge
} from "@elobadge/core";

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
    !hasVisibleChatContent(event.content) ||
    typeof event.sentAt !== "string"
  ) {
    return null;
  }

  const platformBadges = parsePlatformBadges(event.platformBadges);
  const ratings = parseChessBadges(event.ratings);
  const preferredChessProvider = parseChessProvider(
    event.preferredChessProvider
  );
  const emotes = parseChatEmotes(event.emotes);
  const authorKind = parseChatAuthorKind(event.authorKind);
  const source = parseChatEventSource(event.source);

  if (
    !platformBadges ||
    !ratings ||
    preferredChessProvider === undefined ||
    !emotes ||
    !authorKind ||
    !source
  ) {
    return null;
  }

  return {
    ...(event as ChatOverlayEvent),
    platformBadges,
    ratings,
    preferredChessProvider,
    emotes,
    authorKind,
    source
  };
}

function parseChatEmotes(value: unknown): ChatEmote[] | null {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || value.length > 50) {
    return null;
  }

  const emotes: ChatEmote[] = [];

  for (const emote of value) {
    if (!emote || typeof emote !== "object") {
      return null;
    }

    const parsed = emote as Partial<ChatEmote>;

    if (
      typeof parsed.token !== "string" ||
      !/^\{:[^{}]{1,100}:\}$/.test(parsed.token) ||
      typeof parsed.imageUrl !== "string" ||
      !isHttpsUrl(parsed.imageUrl)
    ) {
      return null;
    }

    emotes.push({ token: parsed.token, imageUrl: parsed.imageUrl });
  }

  return emotes;
}

export function parseOverlayAppearanceEvent(
  data: unknown
): OverlayAppearance | null {
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

  const appearance = value as Partial<OverlayAppearance>;

  if (
    typeof appearance.messageMaxWidthPx !== "number" ||
    !Number.isInteger(appearance.messageMaxWidthPx) ||
    appearance.messageMaxWidthPx < 300 ||
    appearance.messageMaxWidthPx > 600 ||
    (appearance.chatAlignment !== "left" &&
      appearance.chatAlignment !== "center" &&
      appearance.chatAlignment !== "right") ||
    (appearance.messageLayout !== "inline" &&
      appearance.messageLayout !== "stacked" &&
      appearance.messageLayout !== "aligned" &&
      appearance.messageLayout !== "individual") ||
    typeof appearance.nicknameSeparatorVisible !== "boolean" ||
    typeof appearance.alignedNicknameRightAligned !== "boolean" ||
    typeof appearance.messageBoxFilled !== "boolean" ||
    typeof appearance.backgroundVisible !== "boolean" ||
    typeof appearance.backgroundColor !== "string" ||
    !/^#[0-9A-Fa-f]{6}$/.test(appearance.backgroundColor) ||
    typeof appearance.backgroundOpacity !== "number" ||
    !Number.isInteger(appearance.backgroundOpacity) ||
    appearance.backgroundOpacity < 0 ||
    appearance.backgroundOpacity > 100 ||
    typeof appearance.chzzkBadgesVisible !== "boolean" ||
    !isChzzkBadgeVisibility(appearance.chzzkBadgeVisibility) ||
    typeof appearance.twitchBadgesVisible !== "boolean" ||
    !isChzzkBadgeVisibility(appearance.twitchBadgeVisibility) ||
    (appearance.ratingProviderPolicy !== "viewer_choice" &&
      appearance.ratingProviderPolicy !== "chesscom_only" &&
      appearance.ratingProviderPolicy !== "lichess_only" &&
      appearance.ratingProviderPolicy !== "hidden") ||
    typeof appearance.nicknameVisible !== "boolean" ||
    (appearance.nicknameColorMode !== "fixed" &&
      appearance.nicknameColorMode !== "by_user" &&
      appearance.nicknameColorMode !== "by_role") ||
    typeof appearance.nicknameColor !== "string" ||
    !/^#[0-9A-Fa-f]{6}$/.test(appearance.nicknameColor) ||
    !isChatAuthorColors(appearance.nicknameRoleColors) ||
    (appearance.messageColorMode !== "fixed" &&
      appearance.messageColorMode !== "by_role") ||
    typeof appearance.messageColor !== "string" ||
    !/^#[0-9A-Fa-f]{6}$/.test(appearance.messageColor) ||
    !isChatAuthorColors(appearance.messageRoleColors) ||
    !isOverlayFontFamily(appearance.fontFamily) ||
    typeof appearance.fontSizePx !== "number" ||
    !Number.isInteger(appearance.fontSizePx) ||
    appearance.fontSizePx < 12 ||
    appearance.fontSizePx > 36 ||
    (appearance.fontWeight !== 400 &&
      appearance.fontWeight !== 500 &&
      appearance.fontWeight !== 600 &&
      appearance.fontWeight !== 700 &&
      appearance.fontWeight !== 900) ||
    (appearance.fontLineHeight !== 1.2 &&
      appearance.fontLineHeight !== 1.4 &&
      appearance.fontLineHeight !== 1.6) ||
    (appearance.messageDurationSeconds !== 0 &&
      appearance.messageDurationSeconds !== 10 &&
      appearance.messageDurationSeconds !== 20 &&
      appearance.messageDurationSeconds !== 30 &&
      appearance.messageDurationSeconds !== 60)
  ) {
    return null;
  }

  return {
    messageMaxWidthPx: appearance.messageMaxWidthPx,
    chatAlignment: appearance.chatAlignment,
    messageLayout: appearance.messageLayout,
    nicknameSeparatorVisible: appearance.nicknameSeparatorVisible,
    alignedNicknameRightAligned: appearance.alignedNicknameRightAligned,
    messageBoxFilled: appearance.messageBoxFilled,
    backgroundVisible: appearance.backgroundVisible,
    backgroundColor: appearance.backgroundColor.toUpperCase(),
    backgroundOpacity: appearance.backgroundOpacity,
    chzzkBadgesVisible: appearance.chzzkBadgesVisible,
    chzzkBadgeVisibility: { ...appearance.chzzkBadgeVisibility },
    twitchBadgesVisible: appearance.twitchBadgesVisible,
    twitchBadgeVisibility: { ...appearance.twitchBadgeVisibility },
    ratingProviderPolicy: appearance.ratingProviderPolicy,
    nicknameVisible: appearance.nicknameVisible,
    nicknameColorMode: appearance.nicknameColorMode,
    nicknameColor: appearance.nicknameColor.toUpperCase(),
    nicknameRoleColors: {
      streamer: appearance.nicknameRoleColors.streamer.toUpperCase(),
      manager: appearance.nicknameRoleColors.manager.toUpperCase(),
      donator: appearance.nicknameRoleColors.donator.toUpperCase(),
      subscriber: appearance.nicknameRoleColors.subscriber.toUpperCase(),
      viewer: appearance.nicknameRoleColors.viewer.toUpperCase()
    },
    messageColorMode: appearance.messageColorMode,
    messageColor: appearance.messageColor.toUpperCase(),
    messageRoleColors: {
      streamer: appearance.messageRoleColors.streamer.toUpperCase(),
      manager: appearance.messageRoleColors.manager.toUpperCase(),
      donator: appearance.messageRoleColors.donator.toUpperCase(),
      subscriber: appearance.messageRoleColors.subscriber.toUpperCase(),
      viewer: appearance.messageRoleColors.viewer.toUpperCase()
    },
    fontFamily: appearance.fontFamily,
    fontSizePx: appearance.fontSizePx,
    fontWeight: appearance.fontWeight,
    fontLineHeight: appearance.fontLineHeight,
    messageDurationSeconds: appearance.messageDurationSeconds
  };
}

function isChzzkBadgeVisibility(
  value: unknown
): value is OverlayAppearance["chzzkBadgeVisibility"] {
  if (!value || typeof value !== "object") {
    return false;
  }

  const visibility = value as Partial<
    OverlayAppearance["chzzkBadgeVisibility"]
  >;

  return [
    visibility.role,
    visibility.subscription,
    visibility.donation,
    visibility.subscription_gift,
    visibility.unknown
  ].every((visible) => typeof visible === "boolean");
}

function parseChatAuthorKind(value: unknown): ChatAuthorKind | null {
  return value === "streamer" ||
    value === "manager" ||
    value === "donator" ||
    value === "subscriber" ||
    value === "viewer"
    ? value
    : null;
}

function isChatAuthorColors(
  value: unknown
): value is OverlayAppearance["nicknameRoleColors"] {
  if (!value || typeof value !== "object") {
    return false;
  }

  const colors = value as Partial<OverlayAppearance["nicknameRoleColors"]>;
  return [
    colors.streamer,
    colors.manager,
    colors.donator,
    colors.subscriber,
    colors.viewer
  ].every(
    (color) => typeof color === "string" && /^#[0-9A-Fa-f]{6}$/.test(color)
  );
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

function parseChessBadges(value: unknown): ChessBadges | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const badges = value as Partial<Record<ChessProvider, unknown>>;
  const parsed: ChessBadges = {};
  for (const provider of ["chesscom", "lichess"] as const) {
    const badge = badges[provider];
    if (badge !== undefined) {
      if (!isRatingBadge(badge) || badge === null || badge.provider !== provider) {
        return null;
      }
      parsed[provider] = badge;
    }
  }
  return parsed;
}

function parseChessProvider(
  value: unknown
): ChessProvider | null | undefined {
  if (value === null) {
    return null;
  }
  return value === "chesscom" || value === "lichess" ? value : undefined;
}

function parsePlatformBadges(value: unknown): PlatformChatBadge[] | null {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || value.length > 10) {
    return null;
  }

  const badges: PlatformChatBadge[] = [];

  for (const badge of value) {
    if (!badge || typeof badge !== "object") {
      return null;
    }

    const parsed = badge as Partial<PlatformChatBadge>;
    const imageUrl = parsed.imageUrl;
    const kind =
      parsed.kind === undefined
        ? "unknown"
        : parsePlatformBadgeKind(parsed.kind);

    if (
      (parsed.provider !== "chzzk" && parsed.provider !== "twitch") ||
      !kind ||
      typeof imageUrl !== "string" ||
      !isHttpsUrl(imageUrl)
    ) {
      return null;
    }

    badges.push({ provider: parsed.provider, kind, imageUrl });
  }

  return badges;
}

function parsePlatformBadgeKind(value: unknown): PlatformBadgeKind | null {
  return value === "role" ||
    value === "subscription" ||
    value === "donation" ||
    value === "subscription_gift" ||
    value === "unknown"
    ? value
    : null;
}

function parseChatEventSource(value: unknown): ChatEventSource | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const source = value as Partial<ChatEventSource>;
  if (
    (source.provider !== "chzzk" && source.provider !== "twitch") ||
    typeof source.channelId !== "string" ||
    source.channelId.length === 0 ||
    typeof source.senderId !== "string" ||
    source.senderId.length === 0 ||
    typeof source.messageId !== "string" ||
    source.messageId.length === 0
  ) {
    return null;
  }

  return {
    provider: source.provider,
    channelId: source.channelId,
    senderId: source.senderId,
    messageId: source.messageId
  };
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
