import assert from "node:assert/strict";
import test from "node:test";
import { classifyChzzkChatAuthor } from "./chat-author.js";

test("classifies official Chzzk channel roles", () => {
  assert.equal(
    classifyChzzkChatAuthor({
      userRoleCode: "streamer",
      badges: [{ badgeType: "subscription" }]
    }),
    "streamer"
  );
  assert.equal(
    classifyChzzkChatAuthor({ userRoleCode: "streaming_channel_manager" }),
    "manager"
  );
  assert.equal(
    classifyChzzkChatAuthor({ userRoleCode: "streaming_chat_manager" }),
    "manager"
  );
});

test("prefers a donation badge over a subscription badge", () => {
  assert.equal(
    classifyChzzkChatAuthor({
      userRoleCode: "common_user",
      badges: [
        { badgeType: "subscription" },
        { badgeType: "donation_rank" }
      ]
    }),
    "donator"
  );
});

test("classifies subscription badges and falls back to viewer", () => {
  assert.equal(
    classifyChzzkChatAuthor({
      userRoleCode: "common_user",
      badges: [{ badgeType: "SUBSCRIPTION" }]
    }),
    "subscriber"
  );
  assert.equal(
    classifyChzzkChatAuthor({
      userRoleCode: "common_user",
      badges: [{ imageUrl: "https://example.com/badge.png" }]
    }),
    "viewer"
  );
});
