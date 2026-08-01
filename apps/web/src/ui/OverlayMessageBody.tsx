import { useLayoutEffect, useRef, useState } from "react";
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
  const messageContentRef = useRef<HTMLDivElement>(null);
  const [messageIsMultiline, setMessageIsMultiline] = useState(false);
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
          className={
            appearance.messageLayout === "aligned" ? "" : "mr-[0.45em]"
          }
          style={{ color: overlayNicknameColor(appearance, message) }}
        >
          {message.nickname}
          {appearance.messageLayout === "inline" &&
          appearance.nicknameSeparatorVisible
            ? ":"
            : ""}
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
  const messageAlignmentClass =
    !messageIsMultiline || appearance.chatAlignment === "left"
      ? "text-left"
      : appearance.chatAlignment === "center"
        ? "text-center"
        : "text-right";

  useLayoutEffect(() => {
    const element = messageContentRef.current;

    if (!element) {
      setMessageIsMultiline(false);
      return;
    }

    const updateMultilineState = () => {
      const lineHeight = Number.parseFloat(
        window.getComputedStyle(element).lineHeight
      );
      const multiline =
        Number.isFinite(lineHeight) && element.getBoundingClientRect().height > lineHeight * 1.5;

      setMessageIsMultiline((current) =>
        current === multiline ? current : multiline
      );
    };

    updateMultilineState();
    const observer = new ResizeObserver(updateMultilineState);
    observer.observe(element);

    return () => observer.disconnect();
  }, [appearance.messageLayout, appearance.fontFamily, appearance.fontSizePx]);

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

  if (appearance.messageLayout === "individual") {
    return (
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start">
        <div className="whitespace-nowrap">{metadata}</div>
        <div
          ref={messageContentRef}
          className={`min-w-0 ${messageAlignmentClass}`}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${appearance.messageBoxFilled ? "grid grid-cols-[minmax(0,min(12em,40%))_minmax(0,1fr)]" : "inline-grid max-w-full grid-cols-[minmax(0,min(12em,40vw))_minmax(0,1fr)] align-top"} min-w-0 items-start gap-x-[0.35em]`}
    >
      <div
        className={`min-w-0 overflow-hidden whitespace-nowrap ${appearance.alignedNicknameRightAligned ? "text-right" : "text-left"}`}
      >
        {metadata}
      </div>
      <div
        ref={messageContentRef}
        className={`min-w-0 ${messageAlignmentClass}`}
      >
        {content}
      </div>
    </div>
  );
}
