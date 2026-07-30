import assert from "node:assert/strict";
import test from "node:test";
import { createChatOverlayEvent } from "./chat-event.js";

test("creates a platform-neutral chat overlay event", () => {
  const event = createChatOverlayEvent({
    id: "twitch:message-1",
    nickname: "viewer",
    content: "good move",
    ratings: {},
    preferredChessProvider: null,
    authorKind: "viewer",
    sentAt: "2026-07-31T00:00:00.000Z",
    source: {
      provider: "twitch",
      channelId: "channel-1",
      senderId: "viewer-1",
      messageId: "message-1"
    }
  });

  assert.deepEqual(event.platformBadges, []);
  assert.deepEqual(event.emotes, []);
  assert.deepEqual(event.source, {
    provider: "twitch",
    channelId: "channel-1",
    senderId: "viewer-1",
    messageId: "message-1"
  });
});
