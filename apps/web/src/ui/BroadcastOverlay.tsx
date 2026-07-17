import { useEffect, useState } from "react";
import {
  DEFAULT_OVERLAY_APPEARANCE,
  type OverlayAppearance
} from "@elobadge/core";
import {
  parseChatOverlayEvent,
  parseOverlayAppearanceEvent
} from "../realtime/chat-event";
import { RatingBadge } from "./RatingBadge";
import {
  overlayBackgroundColor,
  overlayNicknameColor
} from "./overlay-appearance";
import { useOverlayMessageQueue } from "./useOverlayMessageQueue";

export function BroadcastOverlay({ publicToken }: { publicToken: string }) {
  const [appearance, setAppearance] = useState<OverlayAppearance>({
    ...DEFAULT_OVERLAY_APPEARANCE
  });
  const { messages, addMessage, clearMessages } = useOverlayMessageQueue(
    appearance.messageDurationSeconds
  );

  useEffect(() => {
    document.body.classList.add("broadcast-overlay-page");
    const events = new EventSource(`/events/overlay/${publicToken}`);

    events.addEventListener("chat", (event) => {
      const message = parseChatOverlayEvent(event.data);

      if (!message) {
        return;
      }
      addMessage(message);
    });

    events.addEventListener("appearance", (event) => {
      const nextAppearance = parseOverlayAppearanceEvent(event.data);

      if (nextAppearance) {
        setAppearance(nextAppearance);
      }
    });

    events.addEventListener("revoked", () => {
      events.close();
      clearMessages();
    });

    return () => {
      document.body.classList.remove("broadcast-overlay-page");
      events.close();
    };
  }, [addMessage, clearMessages, publicToken]);

  return (
    <main className="flex min-h-screen items-end bg-transparent p-6" aria-live="polite">
      <div
        className={`w-full max-w-[600px] ${appearance.backgroundVisible ? "space-y-2" : "space-y-1"}`}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`overlay-message flex w-fit max-w-full items-start gap-2 rounded-md text-lg ${appearance.backgroundVisible ? "px-3 py-2 shadow-lg ring-1 ring-white/15" : "p-0"}`}
            style={{
              backgroundColor: overlayBackgroundColor(appearance)
            }}
          >
            {message.rating ? (
              <RatingBadge rating={message.rating} />
            ) : null}
            {appearance.nicknameVisible ? (
              <span
                className="shrink-0 font-semibold"
                style={{ color: overlayNicknameColor(appearance, message) }}
              >
                {message.nickname}:
              </span>
            ) : null}
            <span
              className="min-w-0 break-words"
              style={{
                color: appearance.messageColor,
                textShadow: "0 1px 2px rgb(0 0 0 / 85%)"
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
