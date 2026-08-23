import type { ChatOverlayEvent } from "@elobadge/core";
import { Fragment } from "react";

const CHAT_EMOTE_TOKEN_PATTERN = /(\{:[^{}]+:\})/g;

export function ChatMessageContent({
  message,
  color
}: {
  message: ChatOverlayEvent;
  color: string;
}) {
  const emotesByToken = new Map(
    message.emotes.map((emote) => [emote.token, emote.imageUrl])
  );
  const parts = message.content.split(CHAT_EMOTE_TOKEN_PATTERN);

  return (
    <span
      className="content min-w-0 break-words"
      style={{
        color,
        textShadow: "0 1px 2px rgb(0 0 0 / 85%)"
      }}
    >
      {parts.map((part, index) => {
        const imageUrl = emotesByToken.get(part);

        return imageUrl ? (
          <img
            key={`${index}:${part}`}
            src={imageUrl}
            alt={part}
            draggable={false}
            className="emote mx-0.5 inline-block size-[1.25em] align-[-0.22em] object-contain"
          />
        ) : (
          <Fragment key={index}>{part}</Fragment>
        );
      })}
    </span>
  );
}
