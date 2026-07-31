import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type {
  TwitchAccessToken,
  TwitchUser
} from "../auth/twitch/client.js";
import { getTwitchTokenCipher } from "../security/token-cipher.js";
import { getFirestoreDb } from "./admin.js";
import { upsertPlatformAccountInTransaction } from "./platform-accounts.js";

export const TWITCH_STREAMER_SCOPES = ["openid", "user:read:chat"] as const;

export interface StoredTwitchTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: Date;
  scopes: string[];
  platformUserId: string;
  displayName: string;
}

export interface TwitchStreamerAuthorizationStatus {
  connected: boolean;
  platformUserId?: string;
  displayName?: string;
  expiresAt?: string;
  scopes?: string[];
}

export interface RestorableTwitchStreamerAuthorization {
  uid: string;
  platformUserId: string;
}

export async function saveTwitchStreamerAuthorization(
  uid: string,
  user: TwitchUser,
  token: TwitchAccessToken
): Promise<void> {
  assertRequiredTwitchStreamerScopes(token.scopes);

  const cipher = getTwitchTokenCipher();
  const db = getFirestoreDb();
  const tokenRef = db.collection("twitchTokens").doc(uid);
  const streamerRef = db.collection("streamers").doc(uid);
  const encryptedAccessToken = cipher.encrypt(
    token.accessToken,
    encryptionContext(uid, "access")
  );
  const encryptedRefreshToken = cipher.encrypt(
    token.refreshToken,
    encryptionContext(uid, "refresh")
  );

  await db.runTransaction(async (transaction) => {
    const [tokenSnapshot, streamerSnapshot] = await Promise.all([
      transaction.get(tokenRef),
      transaction.get(streamerRef)
    ]);

    await upsertPlatformAccountInTransaction(transaction, db, uid, {
      platform: "twitch",
      platformUserId: user.id,
      displayName: user.displayName
    });

    const now = FieldValue.serverTimestamp();
    transaction.set(
      streamerRef,
      {
        displayName: user.displayName,
        ...(streamerSnapshot.exists ? {} : { createdAt: now }),
        updatedAt: now
      },
      { merge: true }
    );
    transaction.set(
      tokenRef,
      {
        encryptedAccessToken,
        encryptedRefreshToken,
        tokenType: token.tokenType,
        expiresAt: Timestamp.fromMillis(Date.now() + token.expiresIn * 1_000),
        scopes: token.scopes,
        platformUserId: user.id,
        displayName: user.displayName,
        encryptionVersion: 1,
        status: "active",
        chatSessionEnabled: true,
        ...(tokenSnapshot.exists ? {} : { createdAt: now }),
        updatedAt: now
      },
      { merge: true }
    );
  });
}

export async function saveRefreshedTwitchStreamerTokens(
  uid: string,
  token: TwitchAccessToken
): Promise<void> {
  assertRequiredTwitchStreamerScopes(token.scopes);

  const cipher = getTwitchTokenCipher();
  await getFirestoreDb()
    .collection("twitchTokens")
    .doc(uid)
    .set(
      {
        encryptedAccessToken: cipher.encrypt(
          token.accessToken,
          encryptionContext(uid, "access")
        ),
        encryptedRefreshToken: cipher.encrypt(
          token.refreshToken,
          encryptionContext(uid, "refresh")
        ),
        tokenType: token.tokenType,
        expiresAt: Timestamp.fromMillis(Date.now() + token.expiresIn * 1_000),
        scopes: token.scopes,
        encryptionVersion: 1,
        status: "active",
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
}

export async function markTwitchStreamerReauthenticationRequired(
  uid: string
): Promise<void> {
  await getFirestoreDb()
    .collection("twitchTokens")
    .doc(uid)
    .set(
      {
        status: "reauth_required",
        chatSessionEnabled: false,
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
}

export async function setTwitchChatSessionEnabled(
  uid: string,
  enabled: boolean
): Promise<void> {
  await getFirestoreDb()
    .collection("twitchTokens")
    .doc(uid)
    .set(
      {
        chatSessionEnabled: enabled,
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
}

export async function listRestorableTwitchStreamerAuthorizations(): Promise<
  RestorableTwitchStreamerAuthorization[]
> {
  const snapshot = await getFirestoreDb()
    .collection("twitchTokens")
    .where("status", "==", "active")
    .get();

  return snapshot.docs.flatMap((document) => {
    const data = document.data();
    if (
      data.chatSessionEnabled === false ||
      typeof data.platformUserId !== "string"
    ) {
      return [];
    }

    return [{ uid: document.id, platformUserId: data.platformUserId }];
  });
}

export async function loadTwitchStreamerTokens(
  uid: string
): Promise<StoredTwitchTokens | null> {
  const snapshot = await getFirestoreDb()
    .collection("twitchTokens")
    .doc(uid)
    .get();

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();
  if (
    !data ||
    typeof data.encryptedAccessToken !== "string" ||
    typeof data.encryptedRefreshToken !== "string" ||
    typeof data.tokenType !== "string" ||
    !(data.expiresAt instanceof Timestamp) ||
    !Array.isArray(data.scopes) ||
    !data.scopes.every((scope: unknown) => typeof scope === "string") ||
    typeof data.platformUserId !== "string" ||
    typeof data.displayName !== "string"
  ) {
    throw new Error(`Invalid stored Twitch token document for ${uid}`);
  }

  const cipher = getTwitchTokenCipher();
  return {
    accessToken: cipher.decrypt(
      data.encryptedAccessToken,
      encryptionContext(uid, "access")
    ),
    refreshToken: cipher.decrypt(
      data.encryptedRefreshToken,
      encryptionContext(uid, "refresh")
    ),
    tokenType: data.tokenType,
    expiresAt: data.expiresAt.toDate(),
    scopes: data.scopes,
    platformUserId: data.platformUserId,
    displayName: data.displayName
  };
}

export async function getTwitchStreamerAuthorizationStatus(
  uid: string
): Promise<TwitchStreamerAuthorizationStatus> {
  const snapshot = await getFirestoreDb()
    .collection("twitchTokens")
    .doc(uid)
    .get();
  const data = snapshot.data();

  if (
    !data ||
    data.status !== "active" ||
    typeof data.platformUserId !== "string" ||
    typeof data.displayName !== "string" ||
    !(data.expiresAt instanceof Timestamp) ||
    !Array.isArray(data.scopes) ||
    !data.scopes.every((scope: unknown) => typeof scope === "string")
  ) {
    return { connected: false };
  }

  return {
    connected: true,
    platformUserId: data.platformUserId,
    displayName: data.displayName,
    expiresAt: data.expiresAt.toDate().toISOString(),
    scopes: data.scopes
  };
}

export async function deleteTwitchStreamerTokens(uid: string): Promise<void> {
  await getFirestoreDb().collection("twitchTokens").doc(uid).delete();
}

export function assertRequiredTwitchStreamerScopes(scopes: readonly string[]) {
  const missing = TWITCH_STREAMER_SCOPES.filter(
    (requiredScope) => !scopes.includes(requiredScope)
  );

  if (missing.length > 0) {
    throw new Error(`Missing Twitch streamer scopes: ${missing.join(", ")}`);
  }
}

function encryptionContext(uid: string, tokenKind: "access" | "refresh") {
  return `twitch:${uid}:${tokenKind}`;
}
