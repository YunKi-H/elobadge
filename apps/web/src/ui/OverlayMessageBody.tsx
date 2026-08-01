import type {
  ChatOverlayEvent,
  OverlayAppearance,
  PlatformBadgeVisibility,
  StreamingPlatform
} from "@elobadge/core";
import { ChatMessageContent } from "./ChatMessageContent";
import {
  overlayMessageColor,
  overlayNicknameColor,
  overlayRating
} from "./overlay-appearance";
import { PlatformBadges } from "./PlatformBadges";
import { RatingBadge } from "./RatingBadge";

export function OverlayMessageBody({
  appearance,
  message
}: {
  appearance: OverlayAppearance;
  message: ChatOverlayEvent;
}) {
  const rating = overlayRating(appearance, message);
  const visibilityByPlatform: Partial<
    Record<StreamingPlatform, PlatformBadgeVisibility>
  > = {
    chzzk: appearance.chzzkBadgesVisible
      ? appearance.chzzkBadgeVisibility
      : undefined,
    twitch: appearance.twitchBadgesVisible
      ? appearance.twitchBadgeVisibility
      : undefined
  };
  const hasMetadata =
    appearance.nicknameVisible ||
    rating !== null ||
    message.platformBadges.some(
      (badge) => visibilityByPlatform[badge.provider]?.[badge.kind] === true
    );
  const metadata = (
    <>
      <PlatformBadges
        badges={message.platformBadges}
        visibilityByPlatform={visibilityByPlatform}
        lineHeight={appearance.fontLineHeight}
      />
      {rating ? (
        <RatingBadge rating={rating} lineHeight={appearance.fontLineHeight} />
      ) : null}
      {appearance.nicknameVisible ? (
        <span
          className="mr-[0.45em]"
          style={{ color: overlayNicknameColor(appearance, message) }}
        >
          {message.nickname}{appearance.nicknameSeparatorVisible ? ":" : ""}
        </span>
      ) : null}
    </>
  );
  const content = (
    <ChatMessageContent
      message={message}
      color={overlayMessageColor(appearance, message)}
    />
  );

  if (!hasMetadata || appearance.messageLayout === "inline") {
    return <>{metadata}{content}</>;
  }

  if (appearance.messageLayout === "stacked") {
    return (
      <>
        <div>{metadata}</div>
        <div className="mt-[0.15em] min-w-0">{content}</div>
      </>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,min(12em,40%))_minmax(0,1fr)] items-start">
      <div
        className={`min-w-0 overflow-hidden whitespace-nowrap ${appearance.alignedNicknameRightAligned ? "text-right" : "text-left"}`}
      >
        {metadata}
      </div>
      <div className="min-w-0">{content}</div>
    </div>
  );
}
