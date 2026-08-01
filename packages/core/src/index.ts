export type ChessProvider = "lichess" | "chesscom";

export const STREAMING_PLATFORM_VALUES = ["chzzk", "twitch"] as const;

export type StreamingPlatform =
  (typeof STREAMING_PLATFORM_VALUES)[number];

export type LoginMode = "streamer" | "viewer";

/** @deprecated Use LoginMode for platform-neutral authentication flows. */
export type ChzzkLoginMode = LoginMode;

export type NicknameColorMode = "fixed" | "by_user" | "by_role";

export type MessageColorMode = "fixed" | "by_role";

export const OVERLAY_FONT_FAMILY_VALUES = [
  "system",
  "pretendard",
  "freesentation",
  "paperlogy",
  "noto_sans_kr",
  "aggro",
  "nanum_square",
  "nanum_square_neo",
  "nanum_square_round",
  "jalnan",
  "maru_buri",
  "nanum_gothic",
  "nanum_myeongjo",
  "chosun_gungseo",
  "mona12",
  "dohyeon"
] as const;

export type OverlayFontFamily =
  (typeof OVERLAY_FONT_FAMILY_VALUES)[number];

export function isOverlayFontFamily(
  value: unknown
): value is OverlayFontFamily {
  return (
    typeof value === "string" &&
    (OVERLAY_FONT_FAMILY_VALUES as readonly string[]).includes(value)
  );
}

export type OverlayFontWeight = 400 | 500 | 600 | 700 | 900;

export type OverlayFontLineHeight = 1.2 | 1.4 | 1.6;

export type ChatAuthorKind =
  | "streamer"
  | "manager"
  | "donator"
  | "subscriber"
  | "viewer";

export type ChatAuthorColors = Record<ChatAuthorKind, string>;

export type OverlayMessageDurationSeconds = 0 | 10 | 20 | 30 | 60;

export const OVERLAY_CHAT_ALIGNMENT_VALUES = [
  "left",
  "center",
  "right"
] as const;

export type OverlayChatAlignment =
  (typeof OVERLAY_CHAT_ALIGNMENT_VALUES)[number];

export const MAX_OVERLAY_MESSAGES = 30;

export type ChessSpeed = "bullet" | "blitz" | "rapid" | "classical";

export interface RatingBadge {
  provider: ChessProvider;
  speed: ChessSpeed;
  value: number;
  provisional: boolean;
}

export type ChessBadges = Partial<Record<ChessProvider, RatingBadge>>;

export type RatingProviderPolicy =
  | "viewer_choice"
  | "chesscom_only"
  | "lichess_only"
  | "hidden";

export function resolveRatingBadge(
  policy: RatingProviderPolicy,
  badges: ChessBadges,
  preferredProvider: ChessProvider | null
): RatingBadge | null {
  if (policy === "hidden") {
    return null;
  }
  if (policy === "chesscom_only") {
    return badges.chesscom ?? null;
  }
  if (policy === "lichess_only") {
    return badges.lichess ?? null;
  }
  if (preferredProvider) {
    return badges[preferredProvider] ?? null;
  }
  return badges.chesscom ?? badges.lichess ?? null;
}

export type PlatformBadgeKind =
  | "role"
  | "subscription"
  | "donation"
  | "subscription_gift"
  | "unknown";

export type PlatformBadgeVisibility = Record<PlatformBadgeKind, boolean>;

export interface PlatformChatBadge {
  provider: StreamingPlatform;
  kind: PlatformBadgeKind;
  imageUrl: string;
}

export interface ChatEmote {
  token: string;
  imageUrl: string;
}

export interface ChatEventSource {
  provider: StreamingPlatform;
  channelId: string;
  senderId: string;
  messageId: string;
}

export interface ChatOverlayEvent {
  id: string;
  nickname: string;
  content: string;
  ratings: ChessBadges;
  preferredChessProvider: ChessProvider | null;
  platformBadges: PlatformChatBadge[];
  emotes: ChatEmote[];
  authorKind: ChatAuthorKind;
  sentAt: string;
  source: ChatEventSource;
}

export interface OverlayAppearance {
  messageMaxWidthPx: number;
  chatAlignment: OverlayChatAlignment;
  backgroundVisible: boolean;
  backgroundColor: string;
  backgroundOpacity: number;
  chzzkBadgesVisible: boolean;
  chzzkBadgeVisibility: PlatformBadgeVisibility;
  twitchBadgesVisible: boolean;
  twitchBadgeVisibility: PlatformBadgeVisibility;
  ratingProviderPolicy: RatingProviderPolicy;
  nicknameVisible: boolean;
  nicknameColorMode: NicknameColorMode;
  nicknameColor: string;
  nicknameRoleColors: ChatAuthorColors;
  messageColorMode: MessageColorMode;
  messageColor: string;
  messageRoleColors: ChatAuthorColors;
  fontFamily: OverlayFontFamily;
  fontSizePx: number;
  fontWeight: OverlayFontWeight;
  fontLineHeight: OverlayFontLineHeight;
  messageDurationSeconds: OverlayMessageDurationSeconds;
}

export const DEFAULT_OVERLAY_APPEARANCE: OverlayAppearance = {
  messageMaxWidthPx: 600,
  chatAlignment: "left",
  backgroundVisible: true,
  backgroundColor: "#020617",
  backgroundOpacity: 90,
  chzzkBadgesVisible: true,
  chzzkBadgeVisibility: {
    role: true,
    subscription: true,
    donation: true,
    subscription_gift: true,
    unknown: true
  },
  twitchBadgesVisible: true,
  twitchBadgeVisibility: {
    role: true,
    subscription: true,
    donation: true,
    subscription_gift: true,
    unknown: true
  },
  ratingProviderPolicy: "viewer_choice",
  nicknameVisible: true,
  nicknameColorMode: "fixed",
  nicknameColor: "#7DD3FC",
  nicknameRoleColors: {
    streamer: "#34D399",
    manager: "#60A5FA",
    donator: "#FBBF24",
    subscriber: "#C084FC",
    viewer: "#E2E8F0"
  },
  messageColorMode: "fixed",
  messageColor: "#FFFFFF",
  messageRoleColors: {
    streamer: "#86EFAC",
    manager: "#93C5FD",
    donator: "#FDE68A",
    subscriber: "#D8B4FE",
    viewer: "#FFFFFF"
  },
  fontFamily: "system",
  fontSizePx: 18,
  fontWeight: 400,
  fontLineHeight: 1.4,
  messageDurationSeconds: 20
};
