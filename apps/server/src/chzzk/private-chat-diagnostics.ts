import type { FastifyBaseLogger } from "fastify";
import { z } from "zod";

const ACCESS_TOKEN_URL =
  "https://comm-api.game.naver.com/nng_main/v1/chats/access-token";
const REQUEST_TIMEOUT_MS = 10_000;
const INITIAL_RECONNECT_DELAY_MS = 5_000;
const MAX_RECONNECT_DELAY_MS = 60_000;

const CONNECT = 100;
const CONNECTED = 10_100;
const PING = 0;
const PONG = 10_000;
const MODERATION_COMMANDS = new Set([94_005, 94_006, 94_008, 94_015]);

const accessTokenResponseSchema = z.object({
  content: z.object({
    accessToken: z.string().min(1)
  })
});

const privateChatFrameSchema = z.object({
  cmd: z.number().int(),
  bdy: z.unknown().optional()
}).passthrough();

interface PrivateChatSocket {
  addEventListener(
    type: "open" | "message" | "close" | "error",
    listener: (event: Event | MessageEvent) => void
  ): void;
  send(data: string): void;
  close(): void;
}

interface PrivateChatDiagnosticDependencies {
  fetchAccessToken(chatChannelId: string): Promise<string>;
  createSocket(url: string): PrivateChatSocket;
}

const defaultDependencies: PrivateChatDiagnosticDependencies = {
  fetchAccessToken: fetchPrivateChatAccessToken,
  createSocket: (url) => new WebSocket(url)
};

export class ChzzkPrivateChatDiagnosticMonitor {
  private socket: PrivateChatSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private chatChannelId: string | null = null;
  private generation = 0;
  private reconnectAttempt = 0;
  private stopped = false;

  constructor(
    private readonly ownerUid: string,
    private readonly logger: FastifyBaseLogger,
    private readonly dependencies: PrivateChatDiagnosticDependencies =
      defaultDependencies
  ) {}

  observe(chatChannelId: string): void {
    if (this.chatChannelId === chatChannelId && (this.socket || this.reconnectTimer)) {
      return;
    }

    this.stopped = false;
    this.chatChannelId = chatChannelId;
    this.reconnectAttempt = 0;
    this.closeConnection();
    void this.connect(++this.generation, chatChannelId);
  }

  stop(): void {
    this.stopped = true;
    this.chatChannelId = null;
    this.generation += 1;
    this.closeConnection();
  }

  private async connect(generation: number, chatChannelId: string): Promise<void> {
    try {
      const accessToken = await this.dependencies.fetchAccessToken(chatChannelId);

      if (!this.isCurrent(generation, chatChannelId)) {
        return;
      }

      const socket = this.dependencies.createSocket(privateChatSocketUrl(chatChannelId));
      this.socket = socket;

      socket.addEventListener("open", () => {
        if (!this.isCurrent(generation, chatChannelId)) {
          socket.close();
          return;
        }

        socket.send(JSON.stringify({
          ver: "2",
          svcid: "game",
          cid: chatChannelId,
          cmd: CONNECT,
          tid: 1,
          bdy: {
            uid: null,
            devType: 2001,
            accTkn: accessToken,
            auth: "READ"
          }
        }));

        this.logger.info(
          { ownerUid: this.ownerUid, chatChannelId },
          "Chzzk private chat diagnostic socket opened"
        );
      });

      socket.addEventListener("message", (event) => {
        if (this.isCurrent(generation, chatChannelId)) {
          this.handleMessage(event as MessageEvent, socket, chatChannelId);
        }
      });

      socket.addEventListener("error", () => {
        if (this.isCurrent(generation, chatChannelId)) {
          this.logger.warn(
            { ownerUid: this.ownerUid, chatChannelId },
            "Chzzk private chat diagnostic socket error"
          );
        }
      });

      socket.addEventListener("close", () => {
        if (!this.isCurrent(generation, chatChannelId)) {
          return;
        }

        this.socket = null;
        this.logger.warn(
          { ownerUid: this.ownerUid, chatChannelId },
          "Chzzk private chat diagnostic socket closed"
        );
        this.scheduleReconnect(chatChannelId);
      });
    } catch (error) {
      if (!this.isCurrent(generation, chatChannelId)) {
        return;
      }

      this.logger.warn(
        { err: error, ownerUid: this.ownerUid, chatChannelId },
        "Chzzk private chat diagnostic connection failed"
      );
      this.scheduleReconnect(chatChannelId);
    }
  }

  private handleMessage(
    event: MessageEvent,
    socket: PrivateChatSocket,
    chatChannelId: string
  ): void {
    const frame = parsePrivateChatFrame(event.data);

    if (!frame) {
      this.logger.debug(
        { ownerUid: this.ownerUid, chatChannelId, dataType: typeof event.data },
        "Unknown Chzzk private chat diagnostic frame"
      );
      return;
    }

    if (frame.cmd === PING) {
      socket.send(JSON.stringify({ cmd: PONG, ver: "2" }));
      return;
    }

    if (frame.cmd === CONNECTED) {
      this.reconnectAttempt = 0;
      this.logger.info(
        { ownerUid: this.ownerUid, chatChannelId },
        "Chzzk private chat diagnostic socket connected"
      );
      return;
    }

    if (MODERATION_COMMANDS.has(frame.cmd) || isUndocumentedControlCommand(frame.cmd)) {
      this.logger.info(
        {
          ownerUid: this.ownerUid,
          chatChannelId,
          command: frame.cmd,
          payload: sanitizeDiagnosticPayload(frame.bdy)
        },
        "Chzzk private chat moderation event received"
      );
    }
  }

  private scheduleReconnect(chatChannelId: string): void {
    if (this.stopped || this.reconnectTimer || this.chatChannelId !== chatChannelId) {
      return;
    }

    this.reconnectAttempt += 1;
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY_MS * 2 ** Math.min(this.reconnectAttempt - 1, 5),
      MAX_RECONNECT_DELAY_MS
    );
    const generation = ++this.generation;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.connect(generation, chatChannelId);
    }, delay);
    this.reconnectTimer.unref();
  }

  private closeConnection(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    const socket = this.socket;
    this.socket = null;
    socket?.close();
  }

  private isCurrent(generation: number, chatChannelId: string): boolean {
    return !this.stopped &&
      generation === this.generation &&
      chatChannelId === this.chatChannelId;
  }
}

export function createPrivateChatDiagnosticMonitor(
  ownerUid: string,
  logger: FastifyBaseLogger
): ChzzkPrivateChatDiagnosticMonitor | null {
  const allowedUids = new Set(
    (process.env.CHZZK_PRIVATE_CHAT_DIAGNOSTIC_UIDS ?? "")
      .split(",")
      .map((uid) => uid.trim())
      .filter(Boolean)
  );

  if (!allowedUids.has(ownerUid)) {
    return null;
  }

  return new ChzzkPrivateChatDiagnosticMonitor(ownerUid, logger);
}

export function parsePrivateChatFrame(data: unknown): {
  cmd: number;
  bdy?: unknown;
} | null {
  let decoded: string;

  if (typeof data === "string") {
    decoded = data;
  } else {
    if (data instanceof ArrayBuffer) {
      decoded = new TextDecoder().decode(data);
    } else if (ArrayBuffer.isView(data)) {
      decoded = new TextDecoder().decode(data);
    } else {
      return null;
    }
  }

  try {
    const parsed = privateChatFrameSchema.safeParse(JSON.parse(decoded));
    return parsed.success ? { cmd: parsed.data.cmd, bdy: parsed.data.bdy } : null;
  } catch {
    return null;
  }
}

export function sanitizeDiagnosticPayload(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeDiagnosticPayload);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(value)) {
    if (/^(?:message|msg|content|nickname|profile)$/i.test(key)) {
      sanitized[key] = typeof child === "string"
        ? `[REDACTED:${child.length}]`
        : "[REDACTED]";
    } else {
      sanitized[key] = sanitizeDiagnosticPayload(child);
    }
  }

  return sanitized;
}

async function fetchPrivateChatAccessToken(chatChannelId: string): Promise<string> {
  const url = new URL(ACCESS_TOKEN_URL);
  url.searchParams.set("channelId", chatChannelId);
  url.searchParams.set("chatType", "STREAMING");

  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      Accept: "application/json, text/plain, */*",
      Origin: "https://chzzk.naver.com",
      Referer: "https://chzzk.naver.com/",
      "User-Agent": "Mozilla/5.0"
    }
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Chzzk private chat access token failed: ${response.status}`);
  }

  return accessTokenResponseSchema.parse(body).content.accessToken;
}

function privateChatSocketUrl(chatChannelId: string): string {
  const serverId = [...chatChannelId]
    .map((character) => character.charCodeAt(0))
    .reduce((sum, value) => sum + value, 0) % 9 + 1;

  return `wss://kr-ss${serverId}.chat.naver.com/chat`;
}

function isUndocumentedControlCommand(command: number): boolean {
  return command >= 94_000 && command < 95_000;
}
