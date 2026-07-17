import { createHash } from "node:crypto";
import type { FastifyBaseLogger } from "fastify";

const MAX_DIAGNOSTIC_SIGNATURES = 100;
const MAX_BADGES_PER_DIAGNOSTIC = 10;
const MAX_FIELDS_PER_BADGE = 20;
const MAX_TEXT_LENGTH = 80;
const MAX_IMAGE_PATH_LENGTH = 300;
const SAFE_METADATA_FIELD_PATTERN = /(type|name|id|tier|level|rank)/i;

interface ChzzkBadgeDiagnosticProfile {
  badges?: unknown[];
  verifiedMark?: boolean;
  userRoleCode?: string;
}

export class ChzzkBadgeDiagnostics {
  private readonly signatures = new Set<string>();

  constructor(
    private readonly enabled =
      process.env.CHZZK_BADGE_DIAGNOSTICS === "true"
  ) {}

  record(
    profile: ChzzkBadgeDiagnosticProfile,
    logger: Pick<FastifyBaseLogger, "info">
  ): void {
    if (!this.enabled || this.signatures.size >= MAX_DIAGNOSTIC_SIGNATURES) {
      return;
    }

    const context = sanitizeProfile(profile);
    const signature = JSON.stringify(context);

    if (this.signatures.has(signature)) {
      return;
    }

    this.signatures.add(signature);
    logger.info(context, "Chzzk badge diagnostic");
  }
}

export const chzzkBadgeDiagnostics = new ChzzkBadgeDiagnostics();

function sanitizeProfile(profile: ChzzkBadgeDiagnosticProfile) {
  return {
    badgeCount: profile.badges?.length ?? 0,
    badges: (profile.badges ?? [])
      .slice(0, MAX_BADGES_PER_DIAGNOSTIC)
      .map(sanitizeBadge),
    verifiedMark: profile.verifiedMark ?? false,
    userRoleCode: profile.userRoleCode ?? null
  };
}

function sanitizeBadge(badge: unknown) {
  if (!badge || typeof badge !== "object" || Array.isArray(badge)) {
    return { fields: [], metadata: {} };
  }

  const record = badge as Record<string, unknown>;
  const originalFields = Object.keys(record)
    .sort()
    .slice(0, MAX_FIELDS_PER_BADGE);
  const fields = originalFields.map((field) => field.slice(0, MAX_TEXT_LENGTH));
  const metadata = Object.fromEntries(
    originalFields.flatMap((field) => {
      if (/url/i.test(field) || !SAFE_METADATA_FIELD_PATTERN.test(field)) {
        return [];
      }

      const value = sanitizeMetadataValue(record[field]);
      return value === null ? [] : [[field.slice(0, MAX_TEXT_LENGTH), value]];
    })
  );
  const image = sanitizeImageUrl(record.imageUrl);

  return { fields, metadata, ...(image ? { image } : {}) };
}

function sanitizeImageUrl(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return null;
    }

    const host = url.hostname.toLowerCase();
    const path = url.pathname;
    const fingerprint = createHash("sha256")
      .update(`${host}${path}`)
      .digest("hex")
      .slice(0, 16);

    return {
      host,
      path: path.slice(0, MAX_IMAGE_PATH_LENGTH),
      fingerprint
    };
  } catch {
    return null;
  }
}

function sanitizeMetadataValue(
  value: unknown
): string | number | boolean | null {
  if (typeof value === "string") {
    return value.slice(0, MAX_TEXT_LENGTH);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  return null;
}
