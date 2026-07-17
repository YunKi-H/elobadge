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

test("prefers a subscription badge over a donation badge", () => {
  assert.equal(
    classifyChzzkChatAuthor({
      userRoleCode: "common_user",
      badges: [
        { badgeType: "subscription" },
        { badgeType: "donation_rank" }
      ]
    }),
    "subscriber"
  );

  assert.equal(
    classifyChzzkChatAuthor({
      userRoleCode: "common_user",
      badges: [
        {
          imageUrl:
            "https://nng-phinf.pstatic.net/glive/subscription/badge/channel/1/custom.png"
        },
        {
          imageUrl: "https://ssl.pstatic.net/static/nng/glive/badge/fan_03.png"
        }
      ]
    }),
    "subscriber"
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
      badges: [
        {
          imageUrl:
            "https://nng-phinf.pstatic.net/glive/subscription/badge/channel/1/custom.png"
        }
      ]
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

test("classifies observed Chzzk fan badges as donation badges", () => {
  for (const badgeName of ["fan_01.png", "fan_03.png"]) {
    assert.equal(
      classifyChzzkChatAuthor({
        userRoleCode: "common_user",
        badges: [
          {
            imageUrl: `https://ssl.pstatic.net/static/nng/glive/badge/${badgeName}`
          }
        ]
      }),
      "donator"
    );
  }
});

test("does not treat subscription gift and event badges as a subscription", () => {
  assert.equal(
    classifyChzzkChatAuthor({
      userRoleCode: "common_user",
      badges: [
        {
          imageUrl:
            "https://ssl.pstatic.net/static/nng/glive/badge/gift_sub_1.png"
        },
        {
          imageUrl: "https://ssl.pstatic.net/static/nng/glive/badge/recap_25.png"
        }
      ]
    }),
    "viewer"
  );
});
