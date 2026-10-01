import assert from "node:assert/strict";
import test from "node:test";
import type { ChatOverlayEvent } from "@elobadge/core";
import {
  publishChatOverlayEvent,
  publishChatOverlayModerationEvent,
  subscribeStreamerChatOverlayEvents,
  subscribeStreamerChatOverlayModerationEvents
} from "./overlay-events.js";

test("streamer event subscriptions do not receive another streamer's chat", () => {
  const received: ChatOverlayEvent[] = [];
  const unsubscribe = subscribeStreamerChatOverlayEvents(
    "streamer-a",
    (event) => received.push(event)
  );

  const event = chatEvent("message-a");
  publishChatOverlayEvent("streamer-b", chatEvent("message-b"));
  publishChatOverlayEvent("streamer-a", event);
  unsubscribe();
  publishChatOverlayEvent("streamer-a", chatEvent("message-after-unsubscribe"));

  assert.deepEqual(received, [event]);
});

test("streamer moderation subscriptions are isolated by streamer", () => {
  const received: string[] = [];
  const unsubscribe = subscribeStreamerChatOverlayModerationEvents(
    "streamer-a",
    (event) => received.push(event.senderId)
  );

  publishChatOverlayModerationEvent("streamer-b", {
    action: "remove_user_messages",
    provider: "chzzk",
    senderId: "viewer-b",
    occurredAt: "2026-10-01T00:00:00.000Z"
  });
  publishChatOverlayModerationEvent("streamer-a", {
    action: "remove_user_messages",
    provider: "chzzk",
    senderId: "viewer-a",
    occurredAt: "2026-10-01T00:00:00.000Z"
  });
  unsubscribe();
  publishChatOverlayModerationEvent("streamer-a", {
    action: "remove_user_messages",
    provider: "chzzk",
    senderId: "viewer-after-unsubscribe",
    occurredAt: "2026-10-01T00:00:00.000Z"
  });

  assert.deepEqual(received, ["viewer-a"]);
});

function chatEvent(id: string): ChatOverlayEvent {
  return {
    id,
    nickname: "viewer",
    content: "message",
    ratings: {},
    preferredChessProvider: null,
    platformBadges: [],
    emotes: [],
    authorKind: "viewer",
    sentAt: "2026-07-14T00:00:00.000Z",
    source: {
      provider: "chzzk",
      channelId: "streamer",
      senderId: "viewer",
      messageId: id
    }
  };
}
