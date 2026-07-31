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
  overlayFontFamily,
  overlayMessageColor,
  overlayNicknameColor,
  overlayRating
} from "./overlay-appearance";
import { PlatformBadges } from "./PlatformBadges";
import { ChatMessageContent } from "./ChatMessageContent";
import { useOverlayMessageQueue } from "./useOverlayMessageQueue";

const HEARTBEAT_TIMEOUT_MS = 45_000;
const CONNECTION_CHECK_INTERVAL_MS = 5_000;
const MAX_RECONNECT_DELAY_MS = 15_000;

export function BroadcastOverlay({ publicToken }: { publicToken: string }) {
  const [appearance, setAppearance] = useState<OverlayAppearance>({
    ...DEFAULT_OVERLAY_APPEARANCE
  });
  const { messages, addMessage, clearMessages } = useOverlayMessageQueue(
    appearance.messageDurationSeconds
  );

  useEffect(() => {
    document.body.classList.add("broadcast-overlay-page");
    let events: EventSource | null = null;
    let reconnectTimer: number | null = null;
    let reconnectAttempt = 0;
    let lastEventAt = Date.now();
    let disposed = false;
    let revoked = false;

    function connect() {
      if (disposed || revoked) {
        return;
      }

      const nextEvents = new EventSource(`/events/overlay/${publicToken}`);
      events = nextEvents;
      lastEventAt = Date.now();

      nextEvents.addEventListener("open", () => {
        if (events !== nextEvents) {
          return;
        }

        lastEventAt = Date.now();
        reconnectAttempt = 0;
      });

      nextEvents.addEventListener("heartbeat", () => {
        if (events === nextEvents) {
          lastEventAt = Date.now();
        }
      });

      nextEvents.addEventListener("chat", (event) => {
        if (events !== nextEvents) {
          return;
        }

        lastEventAt = Date.now();
        const message = parseChatOverlayEvent(event.data);

        if (message) {
          addMessage(message);
        }
      });

      nextEvents.addEventListener("appearance", (event) => {
        if (events !== nextEvents) {
          return;
        }

        lastEventAt = Date.now();
        const nextAppearance = parseOverlayAppearanceEvent(event.data);

        if (nextAppearance) {
          setAppearance(nextAppearance);
        }
      });

      nextEvents.addEventListener("revoked", () => {
        if (events !== nextEvents) {
          return;
        }

        revoked = true;
        nextEvents.close();
        events = null;
        clearReconnectTimer();
        clearMessages();
      });

      nextEvents.addEventListener("error", () => {
        if (events === nextEvents) {
          scheduleReconnect();
        }
      });
    }

    function scheduleReconnect() {
      if (disposed || revoked || reconnectTimer !== null) {
        return;
      }

      events?.close();
      events = null;

      const delay = Math.min(
        1_000 * 2 ** reconnectAttempt,
        MAX_RECONNECT_DELAY_MS
      );
      reconnectAttempt += 1;
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, delay);
    }

    function clearReconnectTimer() {
      if (reconnectTimer !== null) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    }

    connect();

    const connectionWatchdog = window.setInterval(() => {
      if (
        events &&
        Date.now() - lastEventAt >= HEARTBEAT_TIMEOUT_MS
      ) {
        scheduleReconnect();
      }
    }, CONNECTION_CHECK_INTERVAL_MS);

    return () => {
      disposed = true;
      document.body.classList.remove("broadcast-overlay-page");
      window.clearInterval(connectionWatchdog);
      clearReconnectTimer();
      events?.close();
      events = null;
    };
  }, [addMessage, clearMessages, publicToken]);

  return (
    <main
      className="flex h-screen items-end overflow-hidden bg-transparent p-6"
      aria-live="polite"
    >
      <div
        className={`flex max-h-full w-full max-w-[600px] flex-col justify-end overflow-hidden ${appearance.backgroundVisible ? "gap-2" : "gap-1"}`}
        style={{ maxWidth: `${appearance.messageMaxWidthPx}px` }}
      >
        {messages.map((message) => {
          const rating = overlayRating(appearance, message);
          return (
          <div
            key={message.id}
            className={`overlay-message w-fit max-w-full shrink-0 rounded-md ${appearance.backgroundVisible ? "px-3 py-2 shadow-lg ring-1 ring-white/15" : "p-0"}`}
            style={{
              overflowWrap: "anywhere",
              backgroundColor: overlayBackgroundColor(appearance),
              fontFamily: overlayFontFamily(appearance),
              fontSize: `${appearance.fontSizePx}px`,
              fontWeight: appearance.fontWeight,
              lineHeight: appearance.fontLineHeight
            }}
          >
            {appearance.chzzkBadgesVisible ? (
              <PlatformBadges
                badges={message.platformBadges}
                visibility={appearance.chzzkBadgeVisibility}
                lineHeight={appearance.fontLineHeight}
              />
            ) : null}
            {rating ? (
              <RatingBadge
                rating={rating}
                lineHeight={appearance.fontLineHeight}
              />
            ) : null}
            {appearance.nicknameVisible ? (
              <span
                className="mr-[0.45em]"
                style={{ color: overlayNicknameColor(appearance, message) }}
              >
                {message.nickname}:
              </span>
            ) : null}
            <ChatMessageContent
              message={message}
              color={overlayMessageColor(appearance, message)}
            />
          </div>
          );
        })}
      </div>
    </main>
  );
}
