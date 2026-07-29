import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import {
  logChzzkSocketEvent,
  summarizeChzzkSocketPayload
} from "./socket-diagnostics.js";

test("socket diagnostics retain structure while redacting private values", () => {
  const summary = summarizeChzzkSocketPayload(
    JSON.stringify({
      type: "BLIND",
      channelId: "streamer-channel",
      senderChannelId: "viewer-channel",
      messageId: "message-id",
      messageTime: 1_784_000_000_000,
      content: "private chat content",
      profile: {
        nickname: "private nickname",
        channelId: "profile-channel"
      },
      data: {
        action: "DELETE",
        targetChannelId: "target-channel"
      }
    })
  );

  assert.deepEqual(summary, {
    type: "object",
    fields: [
      "channelId",
      "content",
      "data",
      "messageId",
      "messageTime",
      "profile",
      "senderChannelId",
      "type"
    ],
    nestedFields: {
      data: ["action", "targetChannelId"],
      profile: ["channelId", "nickname"]
    },
    identifiers: {
      channelId: hash("streamer-channel"),
      "data.targetChannelId": hash("target-channel"),
      messageId: hash("message-id"),
      "profile.channelId": hash("profile-channel"),
      senderChannelId: hash("viewer-channel")
    },
    signals: {
      "data.action": "DELETE",
      type: "BLIND"
    },
    timestamps: {
      messageTime: 1_784_000_000_000
    }
  });
  assert.equal(JSON.stringify(summary).includes("private chat content"), false);
  assert.equal(JSON.stringify(summary).includes("private nickname"), false);
});

test("socket diagnostics use info logs only when explicitly enabled", () => {
  const previousValue = process.env.CHZZK_SOCKET_DIAGNOSTICS;
  const entries: Array<{ level: string; context: unknown }> = [];
  const logger = {
    debug(context: unknown) {
      entries.push({ level: "debug", context });
    },
    info(context: unknown) {
      entries.push({ level: "info", context });
    }
  };

  delete process.env.CHZZK_SOCKET_DIAGNOSTICS;
  logChzzkSocketEvent("CHAT", { content: "private" }, logger);
  process.env.CHZZK_SOCKET_DIAGNOSTICS = "true";
  logChzzkSocketEvent("BLIND", { content: "private" }, logger);
  restoreEnv(previousValue);

  assert.deepEqual(
    entries.map(({ level }) => level),
    ["debug", "info"]
  );
  assert.equal(JSON.stringify(entries).includes("private"), false);
});

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function restoreEnv(value: string | undefined): void {
  if (value === undefined) {
    delete process.env.CHZZK_SOCKET_DIAGNOSTICS;
    return;
  }
  process.env.CHZZK_SOCKET_DIAGNOSTICS = value;
}
