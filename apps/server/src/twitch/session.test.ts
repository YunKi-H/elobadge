import assert from "node:assert/strict";
import test from "node:test";
import type { ChatOverlayEvent } from "@elobadge/core";
import type { FastifyBaseLogger } from "fastify";
import type { TwitchAuthConfig } from "../auth/twitch/client.js";
import {
  TwitchSession,
  type TwitchSessionDependencies
} from "./session.js";

const config: TwitchAuthConfig = {
  clientId: "client-id",
  clientSecret: "client-secret",
  redirectUri: "https://elobadge.test/api/auth/twitch/callback",
  identityBaseUrl: "https://id.twitch.test",
  apiBaseUrl: "https://api.twitch.test",
  eventSubWebSocketUrl: "wss://eventsub.twitch.test/ws"
};

test("publishes Twitch chat with ratings, role, and emotes", async () => {
  const sockets: FakeWebSocket[] = [];
  const published: ChatOverlayEvent[] = [];
  const logs: RecordedLog[] = [];
  let subscriptions = 0;
  const session = new TwitchSession(
    "chzzk:owner",
    dependencies(sockets, published, async () => {
      subscriptions += 1;
    })
  );

  session.start(
    config,
    "access-token",
    "broadcaster-1",
    recordingLogger(logs)
  );
  sockets[0]!.emitMessage(welcome("session-1"));
  await settle();

  sockets[0]!.emitMessage(notification("event-1"));
  await settle();

  assert.equal(subscriptions, 1);
  assert.equal(published.length, 1);
  assert.deepEqual(published[0]?.ratings.chesscom, {
    provider: "chesscom",
    speed: "rapid",
    value: 1700,
    provisional: false
  });
  assert.equal(published[0]?.authorKind, "subscriber");
  assert.deepEqual(published[0]?.platformBadges, [{
    provider: "twitch",
    kind: "subscription",
    imageUrl: "https://static.twitch.test/subscriber-3-2x.png"
  }]);
  assert.equal(published[0]?.content, "hello {:twitch_emote_0:}");
  assert.match(
    published[0]?.emotes[0]?.imageUrl ?? "",
    /emoticons\/v2\/25\/default\/dark\/2\.0/
  );
  assert.deepEqual(published[0]?.source, {
    provider: "twitch",
    channelId: "broadcaster-1",
    senderId: "viewer-1",
    messageId: "chat-1"
  });
  const publishedLog = logs.find(
    (entry) => entry.message === "Twitch chat overlay event published"
  );
  assert.deepEqual(publishedLog?.context, {
    broadcasterUserId: "broadcaster-1",
    contentLength: 11,
    ratingProviderCount: 1
  });
  assert.equal(JSON.stringify(publishedLog).includes("viewer-1"), false);
  assert.equal(JSON.stringify(publishedLog).includes("Viewer"), false);
  assert.equal(JSON.stringify(publishedLog).includes("hello Kappa"), false);
  assert.equal(session.getStatus().health, "healthy_active");
  session.stop();
});

test("Twitch rating lookup failure logs no chatter identifiers", async () => {
  const sockets: FakeWebSocket[] = [];
  const published: ChatOverlayEvent[] = [];
  const logs: RecordedLog[] = [];
  const sessionDependencies = dependencies(
    sockets,
    published,
    async () => undefined
  );
  sessionDependencies.getRatingBadge = async () => {
    throw new Error("rating lookup failed for viewer-1");
  };
  const session = new TwitchSession(
    "chzzk:owner",
    sessionDependencies
  );

  session.start(
    config,
    "access-token",
    "broadcaster-1",
    recordingLogger(logs)
  );
  sockets[0]!.emitMessage(welcome("session-1"));
  await settle();
  sockets[0]!.emitMessage(notification("event-1"));
  await settle();

  const warning = logs.find(
    (entry) => entry.message === "Twitch chatter rating badge lookup failed"
  );
  assert.deepEqual(warning?.context, {
    broadcasterUserId: "broadcaster-1",
    errorType: "Error",
    usedCachedRatingBadge: false
  });
  assert.equal(JSON.stringify(warning).includes("viewer-1"), false);
  assert.equal(JSON.stringify(warning).includes("Viewer"), false);
  assert.equal(JSON.stringify(warning).includes("rating lookup failed"), false);
  session.stop();
});

test("ignores Twitch chat made only from invisible characters", async () => {
  const sockets: FakeWebSocket[] = [];
  const published: ChatOverlayEvent[] = [];
  let ratingLookups = 0;
  const sessionDependencies = dependencies(
    sockets,
    published,
    async () => undefined
  );
  sessionDependencies.getRatingBadge = async () => {
    ratingLookups += 1;
    return { badges: {}, preferredProvider: null };
  };
  const session = new TwitchSession("chzzk:owner", sessionDependencies);

  session.start(config, "access-token", "broadcaster-1", logger);
  sockets[0]!.emitMessage(welcome("session-1"));
  await settle();
  sockets[0]!.emitMessage(blankNotification("blank-event"));
  await settle();

  assert.equal(ratingLookups, 0);
  assert.equal(published.length, 0);
  session.stop();
});

test("deduplicates notifications and migrates a reconnect session", async () => {
  const sockets: FakeWebSocket[] = [];
  const published: ChatOverlayEvent[] = [];
  let subscriptions = 0;
  const session = new TwitchSession(
    "chzzk:owner",
    dependencies(sockets, published, async () => {
      subscriptions += 1;
    })
  );

  session.start(config, "access-token", "broadcaster-1", logger);
  sockets[0]!.emitMessage(welcome("session-1"));
  await settle();
  sockets[0]!.emitMessage(notification("duplicate-event"));
  sockets[0]!.emitMessage(notification("duplicate-event"));
  await settle();

  sockets[0]!.emitMessage(JSON.stringify({
    metadata: {
      message_id: "reconnect-1",
      message_type: "session_reconnect",
      message_timestamp: "2026-07-31T00:00:02Z"
    },
    payload: {
      session: {
        id: "session-1",
        reconnect_url: "wss://eventsub.twitch.test/reconnect"
      }
    }
  }));
  await settle();
  assert.equal(sockets.length, 2);
  assert.equal(sockets[1]?.url, "wss://eventsub.twitch.test/reconnect");

  sockets[1].emitMessage(welcome("session-2"));
  await settle();
  assert.equal(subscriptions, 1);
  assert.equal(published.length, 1);
  assert.equal(session.getStatus().subscribed, true);
  session.stop();
});

function dependencies(
  sockets: FakeWebSocket[],
  published: ChatOverlayEvent[],
  subscribe: TwitchSessionDependencies["subscribe"]
): TwitchSessionDependencies {
  return {
    createSocket: (url) => {
      const socket = new FakeWebSocket(url);
      sockets.push(socket);
      return socket as unknown as WebSocket;
    },
    subscribe,
    loadChatBadges: async () => [{
      setId: "subscriber",
      versionId: "3",
      imageUrl: "https://static.twitch.test/subscriber-3-2x.png",
      title: "3-Month Subscriber",
      description: "Subscribed for 3 months"
    }],
    getRatingBadge: async () => ({
      badges: {
        chesscom: {
          provider: "chesscom",
          speed: "rapid",
          value: 1700,
          provisional: false
        }
      },
      preferredProvider: "chesscom"
    }),
    getCachedRatingBadge: async () => null,
    publish: (_ownerUid, event) => published.push(event),
    random: () => 0
  };
}

class FakeWebSocket {
  readonly listeners = new Map<string, Array<(event: never) => void>>();

  constructor(readonly url: string) {}

  addEventListener(type: string, listener: (event: never) => void) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  close() {
    // Tests explicitly drive lifecycle events.
  }

  emitMessage(data: string) {
    for (const listener of this.listeners.get("message") ?? []) {
      listener({ data } as never);
    }
  }
}

function welcome(sessionId: string) {
  return JSON.stringify({
    metadata: {
      message_id: `welcome-${sessionId}`,
      message_type: "session_welcome",
      message_timestamp: "2026-07-31T00:00:00Z"
    },
    payload: {
      session: {
        id: sessionId,
        keepalive_timeout_seconds: 10,
        reconnect_url: null
      }
    }
  });
}

function notification(messageId: string) {
  return JSON.stringify({
    metadata: {
      message_id: messageId,
      message_type: "notification",
      message_timestamp: "2026-07-31T00:00:01Z"
    },
    payload: {
      subscription: {
        type: "channel.chat.message",
        status: "enabled"
      },
      event: {
        broadcaster_user_id: "broadcaster-1",
        chatter_user_id: "viewer-1",
        chatter_user_name: "Viewer",
        message_id: "chat-1",
        message: {
          text: "hello Kappa",
          fragments: [
            { type: "text", text: "hello ", emote: null },
            {
              type: "emote",
              text: "Kappa",
              emote: { id: "25", emote_set_id: "0" }
            }
          ]
        },
        badges: [{ set_id: "subscriber", id: "3", info: "3" }],
        cheer: null
      }
    }
  });
}

function blankNotification(messageId: string) {
  const value = JSON.parse(notification(messageId));
  value.payload.event.message_id = "blank-chat";
  value.payload.event.message = {
    text: " \u200B\u3164 ",
    fragments: [{ type: "text", text: " \u200B\u3164 ", emote: null }]
  };
  return JSON.stringify(value);
}

function settle() {
  return new Promise<void>((resolve) => setImmediate(resolve));
}

const logger = {
  debug() {},
  info() {},
  warn() {},
  error() {}
} as unknown as FastifyBaseLogger;

interface RecordedLog {
  level: "info" | "warn" | "error";
  context: unknown;
  message: string;
}

function recordingLogger(logs: RecordedLog[]): FastifyBaseLogger {
  const record =
    (level: RecordedLog["level"]) =>
    (context: unknown, message?: string) => {
      logs.push({
        level,
        context: typeof context === "string" ? undefined : context,
        message: typeof context === "string" ? context : (message ?? "")
      });
    };

  return {
    info: record("info"),
    warn: record("warn"),
    error: record("error")
  } as unknown as FastifyBaseLogger;
}
