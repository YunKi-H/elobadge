import { createHash } from "node:crypto";
import type { FastifyBaseLogger } from "fastify";

const MAX_FIELDS = 50;
const MAX_DEPTH = 2;
const SAFE_SIGNAL_PATTERN = /^[A-Za-z0-9_-]{1,80}$/;
const IDENTIFIER_FIELD_PATTERN =
  /^(channelId|senderChannelId|targetChannelId|messageId|userId|id)$/i;
const SIGNAL_FIELD_PATTERN = /^(type|eventType|action|command|status)$/i;
const TIME_FIELD_PATTERN = /(time|date|timestamp)$/i;

interface SocketPayloadSummary {
  type: string;
  fields?: string[];
  nestedFields?: Record<string, string[]>;
  identifiers?: Record<string, string>;
  signals?: Record<string, string>;
  timestamps?: Record<string, string | number>;
}

export function logChzzkSocketEvent(
  eventName: unknown,
  payload: unknown,
  logger: Pick<FastifyBaseLogger, "debug" | "info">
): void {
  const context = {
    eventName: sanitizeEventName(eventName),
    payload: summarizeChzzkSocketPayload(payload)
  };

  if (process.env.CHZZK_SOCKET_DIAGNOSTICS === "true") {
    logger.info(context, "Chzzk raw socket event received");
    return;
  }

  logger.debug(context, "Chzzk raw socket event received");
}

export function summarizeChzzkSocketPayload(
  payload: unknown
): SocketPayloadSummary {
  const normalized = normalizeSocketPayload(payload);

  if (!normalized || typeof normalized !== "object" || Array.isArray(normalized)) {
    return { type: normalized === null ? "null" : typeof normalized };
  }

  const fields = Object.keys(normalized).sort().slice(0, MAX_FIELDS);
  const nestedFields: Record<string, string[]> = {};
  const identifiers: Record<string, string> = {};
  const signals: Record<string, string> = {};
  const timestamps: Record<string, string | number> = {};

  collectSafeMetadata(
    normalized as Record<string, unknown>,
    "",
    0,
    nestedFields,
    identifiers,
    signals,
    timestamps
  );

  return {
    type: "object",
    fields,
    ...(Object.keys(nestedFields).length > 0 ? { nestedFields } : {}),
    ...(Object.keys(identifiers).length > 0 ? { identifiers } : {}),
    ...(Object.keys(signals).length > 0 ? { signals } : {}),
    ...(Object.keys(timestamps).length > 0 ? { timestamps } : {})
  };
}

function collectSafeMetadata(
  value: Record<string, unknown>,
  parentPath: string,
  depth: number,
  nestedFields: Record<string, string[]>,
  identifiers: Record<string, string>,
  signals: Record<string, string>,
  timestamps: Record<string, string | number>
): void {
  for (const field of Object.keys(value).sort().slice(0, MAX_FIELDS)) {
    const fieldValue = value[field];
    const path = parentPath ? `${parentPath}.${field}` : field;

    if (IDENTIFIER_FIELD_PATTERN.test(field) && typeof fieldValue === "string") {
      identifiers[path] = fingerprint(fieldValue);
    }

    if (
      SIGNAL_FIELD_PATTERN.test(field) &&
      typeof fieldValue === "string" &&
      SAFE_SIGNAL_PATTERN.test(fieldValue)
    ) {
      signals[path] = fieldValue;
    }

    if (
      TIME_FIELD_PATTERN.test(field) &&
      (typeof fieldValue === "number" ||
        (typeof fieldValue === "string" && isSafeTimestamp(fieldValue)))
    ) {
      timestamps[path] = fieldValue;
    }

    if (
      depth < MAX_DEPTH &&
      fieldValue &&
      typeof fieldValue === "object" &&
      !Array.isArray(fieldValue)
    ) {
      const nested = fieldValue as Record<string, unknown>;
      nestedFields[path] = Object.keys(nested).sort().slice(0, MAX_FIELDS);
      collectSafeMetadata(
        nested,
        path,
        depth + 1,
        nestedFields,
        identifiers,
        signals,
        timestamps
      );
    }
  }
}

function sanitizeEventName(value: unknown): string {
  if (typeof value === "string" && SAFE_SIGNAL_PATTERN.test(value)) {
    return value;
  }
  return `unknown:${typeof value}`;
}

function normalizeSocketPayload(payload: unknown): unknown {
  if (typeof payload !== "string") {
    return payload;
  }

  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

function fingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function isSafeTimestamp(value: string): boolean {
  return (
    /^\d{10,17}$/.test(value) ||
    /^\d{4}-\d{2}-\d{2}T[\d:.+-]+Z?$/.test(value)
  );
}
