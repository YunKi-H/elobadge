import type {
  ChatAuthorKind,
  ChatEmote,
  ChatOverlayEvent,
  PlatformBadgeKind,
  PlatformChatBadge
} from "@elobadge/core";
import type { FastifyBaseLogger } from "fastify";
import { z } from "zod";
import {
  createTwitchClient,
  TwitchClientError,
  type TwitchAuthConfig,
  type TwitchChatBadge
} from "../auth/twitch/client.js";
import { ratingBadgeCache } from "../chess/badge-cache.js";
import { platformUserCache } from "../chess/platform-user-cache.js";
import type { ChzzkChessBadgeState } from "../firebase/chess-badges.js";
import { markTwitchStreamerReauthenticationRequired } from "../firebase/twitch-tokens.js";
import { publishChatOverlayEvent } from "../realtime/overlay-events.js";
import { createChatOverlayEvent } from "../chat/chat-event.js";

const DEFAULT_EVENTSUB_URL = "wss://eventsub.wss.twitch.tv/ws";
const MAX_RECONNECT_DELAY_MS = 60_000;
const RATING_LOOKUP_TIMEOUT_MS = 2_000;
const MAX_SEEN_MESSAGE_IDS = 1_000;

const metadataSchema = z.object({
  message_id: z.string().min(1),
  message_type: z.string().min(1),
  message_timestamp: z.string().datetime().optional()
});

const sessionSchema = z.object({
  id: z.string().min(1),
  keepalive_timeout_seconds: z.number().positive().nullable().optional(),
  reconnect_url: z.string().url().nullable().optional()
});

const badgeSchema = z.object({
  set_id: z.string(),
  id: z.string(),
  info: z.string()
});

const fragmentSchema = z.object({
  type: z.string(),
  text: z.string(),
  emote: z.object({
    id: z.string().min(1),
    emote_set_id: z.string().optional()
  }).nullable().optional()
});

const chatEventSchema = z.object({
  broadcaster_user_id: z.string().min(1),
  chatter_user_id: z.string().min(1),
  chatter_user_name: z.string().min(1),
  message_id: z.string().min(1),
  message: z.object({
    text: z.string(),
    fragments: z.array(fragmentSchema)
  }),
  badges: z.array(badgeSchema).default([]),
  cheer: z.object({ bits: z.number().int().nonnegative() }).nullable().optional()
});

const envelopeSchema = z.object({
  metadata: metadataSchema,
  payload: z.object({
    session: sessionSchema.optional(),
    event: z.unknown().optional(),
    subscription: z.object({
      type: z.string().optional(),
      status: z.string().optional()
    }).passthrough().optional()
  })
});

export type TwitchSessionHealth =
  | "connecting"
  | "healthy_idle"
  | "healthy_active"
  | "reconnecting"
  | "subscription_failed"
  | "connection_failed"
  | "authorization_revoked";

export interface TwitchSessionStatus {
  health: TwitchSessionHealth;
  connected: boolean;
  subscribed: boolean;
  sessionId: string | null;
  startedAt: string | null;
  lastMessageAt: string | null;
  lastChatAt: string | null;
  reconnectAttempt: number;
  lastError: string | null;
}

export interface TwitchSessionDependencies {
  createSocket(url: string): WebSocket;
  subscribe(
    config: TwitchAuthConfig,
    accessToken: string,
    broadcasterUserId: string,
    sessionId: string
  ): Promise<void>;
  loadChatBadges(
    config: TwitchAuthConfig,
    accessToken: string,
    broadcasterUserId: string
  ): Promise<TwitchChatBadge[]>;
  getRatingBadge(chatterUserId: string): Promise<ChzzkChessBadgeState>;
  getCachedRatingBadge(chatterUserId: string): Promise<ChzzkChessBadgeState | null>;
  publish(ownerUid: string, event: ChatOverlayEvent): void;
  random(): number;
}

const defaultDependencies: TwitchSessionDependencies = {
  createSocket: (url) => new WebSocket(url),
  subscribe: async (config, accessToken, broadcasterUserId, sessionId) => {
    await createTwitchClient(config).createChatMessageSubscription(
      accessToken,
      broadcasterUserId,
      sessionId
    );
  },
  loadChatBadges: (config, accessToken, broadcasterUserId) =>
    createTwitchClient(config).getChatBadges(accessToken, broadcasterUserId),
  getRatingBadge: loadTwitchRatingBadge,
  getCachedRatingBadge: getCachedTwitchRatingBadge,
  publish: publishChatOverlayEvent,
  random: Math.random
};

export class TwitchSession {
  private socket: WebSocket | null = null;
  private active = false;
  private generation = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private keepaliveTimer: NodeJS.Timeout | null = null;
  private keepaliveTimeoutMs = 0;
  private config: TwitchAuthConfig | null = null;
  private accessToken: string | null = null;
  private logger: FastifyBaseLogger | null = null;
  private broadcasterUserId: string | null = null;
  private readonly seenMessageIds = new Set<string>();
  private readonly chatBadges = new Map<string, TwitchChatBadge>();
  private badgeLoadGeneration = 0;
  private status: TwitchSessionStatus = emptyStatus();

  constructor(
    private readonly ownerUid: string,
    private readonly dependencies: TwitchSessionDependencies = defaultDependencies
  ) {}

  start(
    config: TwitchAuthConfig,
    accessToken: string,
    broadcasterUserId: string,
    logger: FastifyBaseLogger
  ): TwitchSessionStatus {
    this.stop();
    this.active = true;
    this.config = config;
    this.accessToken = accessToken;
    this.broadcasterUserId = broadcasterUserId;
    this.logger = logger;
    this.status = {
      ...emptyStatus(),
      health: "connecting",
      startedAt: new Date().toISOString()
    };
    this.loadChatBadges(config, accessToken, broadcasterUserId);
    this.connect(config.eventSubWebSocketUrl || DEFAULT_EVENTSUB_URL, false);
    return this.getStatus();
  }

  stop(): void {
    this.active = false;
    this.generation += 1;
    this.clearTimers();
    this.socket?.close(1000, "Session stopped");
    this.socket = null;
    this.status.connected = false;
    this.status.subscribed = false;
    this.status.sessionId = null;
    this.config = null;
    this.accessToken = null;
    this.broadcasterUserId = null;
    this.logger = null;
    this.seenMessageIds.clear();
    this.chatBadges.clear();
    this.badgeLoadGeneration += 1;
  }

  updateAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  getStatus(): TwitchSessionStatus {
    return { ...this.status };
  }

  private connect(url: string, migratedSubscription: boolean): void {
    if (!this.active) {
      return;
    }

    const generation = ++this.generation;
    this.clearTimers();
    this.socket?.close();
    this.status.health =
      this.status.reconnectAttempt === 0 && this.status.lastMessageAt === null
        ? "connecting"
        : "reconnecting";
    this.status.connected = false;
    this.status.subscribed = false;
    this.status.sessionId = null;

    const socket = this.dependencies.createSocket(url);
    this.socket = socket;
    this.keepaliveTimeoutMs = 15_000;
    this.resetKeepalive(generation);

    socket.addEventListener("open", () => {
      if (this.isCurrent(generation, socket)) {
        this.logger?.info(
          { ownerUid: this.ownerUid },
          "Twitch EventSub socket connected"
        );
      }
    });
    socket.addEventListener("message", (event) => {
      if (this.isCurrent(generation, socket)) {
        void this.handleMessage(event.data, generation, migratedSubscription);
      }
    });
    socket.addEventListener("error", () => {
      if (this.isCurrent(generation, socket)) {
        this.status.health = "connection_failed";
        this.status.lastError = "Twitch EventSub WebSocket error";
      }
    });
    socket.addEventListener("close", (event) => {
      if (!this.isCurrent(generation, socket) || !this.active) {
        return;
      }
      this.status.connected = false;
      this.status.subscribed = false;
      this.status.sessionId = null;
      this.scheduleReconnect(
        `Twitch EventSub socket closed (${event.code})`
      );
    });
  }

  private async handleMessage(
    raw: unknown,
    generation: number,
    migratedSubscription: boolean
  ): Promise<void> {
    const text = await webSocketMessageText(raw);
    const parsed = envelopeSchema.safeParse(parseJson(text));
    if (!parsed.success || !this.isCurrent(generation, this.socket)) {
      this.logger?.warn("Unknown Twitch EventSub message");
      return;
    }

    this.status.lastMessageAt = new Date().toISOString();
    this.resetKeepalive(generation);

    const { message_type: messageType, message_id: envelopeId } =
      parsed.data.metadata;
    if (messageType === "session_welcome") {
      await this.handleWelcome(
        parsed.data.payload.session,
        generation,
        migratedSubscription
      );
      return;
    }
    if (messageType === "session_reconnect") {
      const reconnectUrl = parsed.data.payload.session?.reconnect_url;
      if (reconnectUrl) {
        this.status.reconnectAttempt = 0;
        this.connect(reconnectUrl, true);
      }
      return;
    }
    if (messageType === "revocation") {
      this.status.health = "authorization_revoked";
      this.status.subscribed = false;
      this.status.lastError =
        parsed.data.payload.subscription?.status ?? "EventSub subscription revoked";
      this.active = false;
      await markTwitchStreamerReauthenticationRequired(this.ownerUid);
      this.socket?.close();
      return;
    }
    if (
      messageType !== "notification" ||
      parsed.data.payload.subscription?.type !== "channel.chat.message" ||
      this.isDuplicate(envelopeId)
    ) {
      return;
    }

    const chat = chatEventSchema.safeParse(parsed.data.payload.event);
    if (!chat.success) {
      this.logger?.warn("Invalid Twitch channel.chat.message event");
      return;
    }

    this.status.lastChatAt = new Date().toISOString();
    this.status.health = "healthy_active";
    void this.publishChat(
      chat.data,
      parsed.data.metadata.message_timestamp,
      generation
    );
  }

  private async handleWelcome(
    session: z.infer<typeof sessionSchema> | undefined,
    generation: number,
    migratedSubscription: boolean
  ) {
    if (
      !session ||
      !this.config ||
      !this.accessToken ||
      !this.broadcasterUserId ||
      !this.isCurrent(generation, this.socket)
    ) {
      return;
    }

    this.status.connected = true;
    this.status.sessionId = session.id;
    this.status.reconnectAttempt = 0;
    this.keepaliveTimeoutMs =
      (session.keepalive_timeout_seconds ?? 10) * 1_000 + 5_000;
    this.resetKeepalive(generation);

    if (!migratedSubscription) {
      try {
        await this.dependencies.subscribe(
          this.config,
          this.accessToken,
          this.broadcasterUserId,
          session.id
        );
      } catch (error) {
        if (!this.isCurrent(generation, this.socket)) {
          return;
        }
        if (
          error instanceof TwitchClientError &&
          error.statusCode === 401
        ) {
          this.status.health = "authorization_revoked";
          this.status.lastError = errorMessage(error);
          this.active = false;
          await markTwitchStreamerReauthenticationRequired(this.ownerUid);
          this.socket?.close();
          return;
        }
        this.status.health = "subscription_failed";
        this.status.lastError = errorMessage(error);
        this.logger?.error(
          { err: error, ownerUid: this.ownerUid },
          "Twitch chat subscription failed"
        );
        this.scheduleReconnect("Twitch chat subscription failed");
        return;
      }
    }

    this.status.subscribed = true;
    this.status.health = "healthy_idle";
    this.status.lastError = null;
    this.logger?.info(
      {
        ownerUid: this.ownerUid,
        broadcasterUserId: this.broadcasterUserId,
        migratedSubscription
      },
      "Twitch channel.chat.message subscribed"
    );
  }

  private async publishChat(
    message: z.infer<typeof chatEventSchema>,
    messageTimestamp: string | undefined,
    generation: number
  ) {
    let badgeState: ChzzkChessBadgeState = {
      badges: {},
      preferredProvider: null
    };

    try {
      badgeState = await withTimeout(
        this.dependencies.getRatingBadge(message.chatter_user_id),
        RATING_LOOKUP_TIMEOUT_MS
      );
    } catch (error) {
      const cachedBadgeState =
        await this.dependencies.getCachedRatingBadge(message.chatter_user_id);
      badgeState = cachedBadgeState ?? badgeState;
      this.logger?.warn(
        {
          broadcasterUserId: message.broadcaster_user_id,
          errorType: safeErrorType(error),
          usedCachedRatingBadge: cachedBadgeState !== null
        },
        "Twitch chatter rating badge lookup failed"
      );
    }

    if (!this.isCurrent(generation, this.socket)) {
      return;
    }

    const normalized = normalizeTwitchMessage(message);
    this.dependencies.publish(
      this.ownerUid,
      createChatOverlayEvent({
        id: `twitch:${message.message_id}`,
        nickname: message.chatter_user_name,
        content: normalized.content,
        ratings: badgeState.badges,
        preferredChessProvider: badgeState.preferredProvider,
        platformBadges: normalizeTwitchBadges(message.badges, this.chatBadges),
        emotes: normalized.emotes,
        authorKind: classifyTwitchAuthor(message),
        sentAt: messageTimestamp ?? new Date().toISOString(),
        source: {
          provider: "twitch",
          channelId: message.broadcaster_user_id,
          senderId: message.chatter_user_id,
          messageId: message.message_id
        }
      })
    );
    this.logger?.info(
      {
        broadcasterUserId: message.broadcaster_user_id,
        contentLength: message.message.text.length,
        ratingProviderCount: Object.keys(badgeState.badges).length
      },
      "Twitch chat overlay event published"
    );
  }

  private loadChatBadges(
    config: TwitchAuthConfig,
    accessToken: string,
    broadcasterUserId: string
  ) {
    const generation = ++this.badgeLoadGeneration;
    void this.dependencies
      .loadChatBadges(config, accessToken, broadcasterUserId)
      .then((badges) => {
        if (!this.active || generation !== this.badgeLoadGeneration) {
          return;
        }
        this.chatBadges.clear();
        for (const badge of badges) {
          this.chatBadges.set(`${badge.setId}:${badge.versionId}`, badge);
        }
        this.logger?.info(
          { ownerUid: this.ownerUid, badgeCount: this.chatBadges.size },
          "Twitch chat badge catalog loaded"
        );
      })
      .catch((error: unknown) => {
        if (!this.active || generation !== this.badgeLoadGeneration) {
          return;
        }
        this.logger?.warn(
          { ownerUid: this.ownerUid, errorType: safeErrorType(error) },
          "Twitch chat badge catalog load failed"
        );
      });
  }

  private resetKeepalive(generation: number) {
    if (this.keepaliveTimer) {
      clearTimeout(this.keepaliveTimer);
    }
    if (this.keepaliveTimeoutMs <= 0) {
      return;
    }
    this.keepaliveTimer = setTimeout(() => {
      if (this.isCurrent(generation, this.socket)) {
        this.scheduleReconnect("Twitch EventSub keepalive timed out");
      }
    }, this.keepaliveTimeoutMs);
    this.keepaliveTimer.unref();
  }

  private scheduleReconnect(reason: string) {
    if (!this.active || this.reconnectTimer) {
      return;
    }
    this.status.health = "reconnecting";
    this.status.lastError = reason;
    const attempt = this.status.reconnectAttempt + 1;
    this.status.reconnectAttempt = attempt;
    const delay = Math.min(1_000 * 2 ** Math.min(attempt - 1, 6), MAX_RECONNECT_DELAY_MS);
    const jitter = Math.floor(delay * 0.2 * this.dependencies.random());
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.config) {
        this.connect(this.config.eventSubWebSocketUrl || DEFAULT_EVENTSUB_URL, false);
      }
    }, delay + jitter);
    this.reconnectTimer.unref();
    this.socket?.close();
    this.socket = null;
    this.logger?.warn(
      { ownerUid: this.ownerUid, attempt, delay: delay + jitter, reason },
      "Twitch EventSub reconnect scheduled"
    );
  }

  private isDuplicate(messageId: string): boolean {
    if (this.seenMessageIds.has(messageId)) {
      return true;
    }
    if (this.seenMessageIds.size >= MAX_SEEN_MESSAGE_IDS) {
      const oldest = this.seenMessageIds.values().next().value;
      if (oldest) {
        this.seenMessageIds.delete(oldest);
      }
    }
    this.seenMessageIds.add(messageId);
    return false;
  }

  private isCurrent(generation: number, socket: WebSocket | null): boolean {
    return (
      this.active &&
      generation === this.generation &&
      socket !== null &&
      socket === this.socket
    );
  }

  private clearTimers() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.keepaliveTimer) {
      clearTimeout(this.keepaliveTimer);
      this.keepaliveTimer = null;
    }
  }
}

export class TwitchSessionManager {
  private readonly sessions = new Map<string, TwitchSession>();

  start(
    uid: string,
    config: TwitchAuthConfig,
    accessToken: string,
    broadcasterUserId: string,
    logger: FastifyBaseLogger
  ): TwitchSessionStatus {
    this.stop(uid);
    const session = new TwitchSession(uid);
    this.sessions.set(uid, session);
    try {
      return session.start(config, accessToken, broadcasterUserId, logger);
    } catch (error) {
      this.sessions.delete(uid);
      session.stop();
      throw error;
    }
  }

  stop(uid: string): boolean {
    const session = this.sessions.get(uid);
    session?.stop();
    return this.sessions.delete(uid);
  }

  stopAll(): void {
    for (const uid of this.sessions.keys()) {
      this.stop(uid);
    }
  }

  getStatus(uid: string): TwitchSessionStatus | null {
    return this.sessions.get(uid)?.getStatus() ?? null;
  }

  updateAccessToken(uid: string, accessToken: string): void {
    this.sessions.get(uid)?.updateAccessToken(accessToken);
  }
}

function emptyStatus(): TwitchSessionStatus {
  return {
    health: "connecting",
    connected: false,
    subscribed: false,
    sessionId: null,
    startedAt: null,
    lastMessageAt: null,
    lastChatAt: null,
    reconnectAttempt: 0,
    lastError: null
  };
}

async function loadTwitchRatingBadge(
  chatterUserId: string
): Promise<ChzzkChessBadgeState> {
  const uid = await platformUserCache.get("twitch", chatterUserId);
  return uid
    ? ratingBadgeCache.get(uid)
    : { badges: {}, preferredProvider: null };
}

async function getCachedTwitchRatingBadge(
  chatterUserId: string
): Promise<ChzzkChessBadgeState | null> {
  const uid = platformUserCache.peek("twitch", chatterUserId);
  return uid ? ratingBadgeCache.peek(uid) : null;
}

function normalizeTwitchMessage(
  event: z.infer<typeof chatEventSchema>
): { content: string; emotes: ChatEmote[] } {
  const emotes: ChatEmote[] = [];
  let emoteIndex = 0;
  const content = event.message.fragments.map((fragment) => {
    if (fragment.type !== "emote" || !fragment.emote) {
      return fragment.text;
    }
    const token = `{:twitch_emote_${emoteIndex}:}`;
    emoteIndex += 1;
    emotes.push({
      token,
      imageUrl:
        `https://static-cdn.jtvnw.net/emoticons/v2/` +
        `${encodeURIComponent(fragment.emote.id)}/default/dark/2.0`
    });
    return token;
  }).join("");

  return {
    content: content || event.message.text,
    emotes
  };
}

function classifyTwitchAuthor(
  event: z.infer<typeof chatEventSchema>
): ChatAuthorKind {
  const badgeKinds = new Set(event.badges.map((badge) => badge.set_id));
  if (
    event.chatter_user_id === event.broadcaster_user_id ||
    badgeKinds.has("broadcaster")
  ) {
    return "streamer";
  }
  if (badgeKinds.has("moderator")) {
    return "manager";
  }
  if (badgeKinds.has("subscriber")) {
    return "subscriber";
  }
  if (event.cheer || badgeKinds.has("bits")) {
    return "donator";
  }
  return "viewer";
}

function normalizeTwitchBadges(
  eventBadges: z.infer<typeof badgeSchema>[],
  catalog: ReadonlyMap<string, TwitchChatBadge>
): PlatformChatBadge[] {
  return eventBadges.flatMap((badge) => {
    const resolved = catalog.get(`${badge.set_id}:${badge.id}`);
    return resolved
      ? [{
          provider: "twitch" as const,
          kind: classifyTwitchBadge(badge.set_id),
          imageUrl: resolved.imageUrl
        }]
      : [];
  });
}

function classifyTwitchBadge(setId: string): PlatformBadgeKind {
  if (
    ["broadcaster", "moderator", "vip", "staff", "admin", "global_mod"]
      .includes(setId)
  ) {
    return "role";
  }
  if (["subscriber", "founder"].includes(setId)) {
    return "subscription";
  }
  if (setId === "sub-gifter") {
    return "subscription_gift";
  }
  if (["bits", "bits-leader", "cheerer"].includes(setId)) {
    return "donation";
  }
  return "unknown";
}

async function webSocketMessageText(raw: unknown): Promise<string> {
  if (typeof raw === "string") {
    return raw;
  }
  if (raw instanceof ArrayBuffer) {
    return new TextDecoder().decode(raw);
  }
  if (raw instanceof Blob) {
    return raw.text();
  }
  return "";
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function safeErrorType(error: unknown): string {
  const name = error instanceof Error ? error.name : typeof error;
  return /^[A-Za-z][A-Za-z0-9]*$/.test(name) ? name : "UnknownError";
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
      timeoutMs
    );
    timer.unref();
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export const twitchSessionManager = new TwitchSessionManager();
