import type {
  ChatAuthorKind,
  ChatEmote,
  ChatEventSource,
  ChatOverlayEvent,
  ChessBadges,
  ChessProvider,
  PlatformChatBadge
} from "@elobadge/core";

export interface CommonChatEventInput {
  id: string;
  nickname: string;
  content: string;
  ratings: ChessBadges;
  preferredChessProvider: ChessProvider | null;
  platformBadges?: PlatformChatBadge[];
  emotes?: ChatEmote[];
  authorKind: ChatAuthorKind;
  sentAt: string;
  source: ChatEventSource;
}

export function createChatOverlayEvent(
  input: CommonChatEventInput
): ChatOverlayEvent {
  return {
    id: input.id,
    nickname: input.nickname,
    content: input.content,
    ratings: input.ratings,
    preferredChessProvider: input.preferredChessProvider,
    platformBadges: input.platformBadges ?? [],
    emotes: input.emotes ?? [],
    authorKind: input.authorKind,
    sentAt: input.sentAt,
    source: input.source
  };
}
