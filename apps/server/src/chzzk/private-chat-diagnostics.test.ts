import assert from "node:assert/strict";
import test from "node:test";
import {
  parsePrivateChatFrame,
  sanitizeDiagnosticPayload
} from "./private-chat-diagnostics.js";

test("parses Chzzk private moderation frames", () => {
  assert.deepEqual(
    parsePrivateChatFrame(JSON.stringify({
      cmd: 94_008,
      bdy: {
        messageTime: 1_783_000_000_000,
        userId: "viewer-id",
        message: "remove me"
      }
    })),
    {
      cmd: 94_008,
      bdy: {
        messageTime: 1_783_000_000_000,
        userId: "viewer-id",
        message: "remove me"
      }
    }
  );
});

test("rejects malformed private chat frames", () => {
  assert.equal(parsePrivateChatFrame("not-json"), null);
  assert.equal(parsePrivateChatFrame(JSON.stringify({ bdy: {} })), null);
});

test("redacts chat text while preserving moderation identifiers", () => {
  assert.deepEqual(
    sanitizeDiagnosticPayload({
      messageTime: 1_783_000_000_000,
      userId: "viewer-id",
      message: "remove me",
      nested: {
        nickname: "viewer",
        blindType: "MANAGER"
      }
    }),
    {
      messageTime: 1_783_000_000_000,
      userId: "viewer-id",
      message: "[REDACTED:9]",
      nested: {
        nickname: "[REDACTED:6]",
        blindType: "MANAGER"
      }
    }
  );
});
