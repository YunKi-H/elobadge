import "../config/env.js";
import { createHash } from "node:crypto";
import {
  getChzzkAuthConfig,
  getChzzkRestrictedChannels,
  type ChzzkRestrictedChannel
} from "../auth/chzzk/client.js";
import { chzzkTokenManager } from "../chzzk/token-manager.js";

const MAX_PAGES = 100;
const streamerUid = requiredArgument("--streamer-uid=");
const projectId = requiredEnv("FIREBASE_PROJECT_ID");

if (!streamerUid.startsWith("chzzk:") || streamerUid.length <= "chzzk:".length) {
  throw new Error("--streamer-uid must use the chzzk:{channelId} format");
}

const config = getChzzkAuthConfig();
const accessToken = await chzzkTokenManager.getValidAccessToken(
  streamerUid,
  config
);
const restrictions = await loadAllRestrictions(config, accessToken);
const entries = restrictions
  .map((restriction) => ({
    restrictedChannelFingerprint: fingerprint(
      restriction.restrictedChannelId
    ),
    createdDate: restriction.createdDate,
    releaseDate: restriction.releaseDate
  }))
  .sort((left, right) =>
    left.restrictedChannelFingerprint.localeCompare(
      right.restrictedChannelFingerprint
    )
  );

console.log(
  JSON.stringify(
    {
      firebaseProject: projectId,
      streamerFingerprint: fingerprint(streamerUid),
      count: entries.length,
      entries
    },
    null,
    2
  )
);

async function loadAllRestrictions(
  authConfig: ReturnType<typeof getChzzkAuthConfig>,
  accessToken: string
): Promise<ChzzkRestrictedChannel[]> {
  const restrictions: ChzzkRestrictedChannel[] = [];
  const seenPages = new Set<string>();
  let next: string | null = null;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const result = await getChzzkRestrictedChannels(
      authConfig,
      accessToken,
      next
    );
    restrictions.push(...result.data);

    if (!result.next) {
      return restrictions;
    }
    if (seenPages.has(result.next)) {
      throw new Error("Chzzk restriction pagination returned a repeated cursor");
    }

    seenPages.add(result.next);
    next = result.next;
  }

  throw new Error(`Chzzk restriction list exceeded ${MAX_PAGES} pages`);
}

function fingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function requiredArgument(prefix: string): string {
  const value = process.argv.find((argument) => argument.startsWith(prefix));
  const parsed = value?.slice(prefix.length).trim();

  if (!parsed) {
    throw new Error(`Missing ${prefix}{value}`);
  }
  return parsed;
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}
