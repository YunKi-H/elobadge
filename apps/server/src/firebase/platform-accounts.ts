import type { StreamingPlatform } from "@elobadge/core";
import {
  FieldValue,
  type Firestore,
  type Transaction
} from "firebase-admin/firestore";
import { getFirestoreDb } from "./admin.js";

export interface PlatformAccountIdentity {
  platform: StreamingPlatform;
  platformUserId: string;
  displayName: string;
}

export interface StoredPlatformAccount extends PlatformAccountIdentity {
  userId: string;
}

export class PlatformAccountConflictError extends Error {
  constructor() {
    super("This platform account is already linked to another user");
    this.name = "PlatformAccountConflictError";
  }
}

export async function upsertPlatformAccount(
  userId: string,
  identity: PlatformAccountIdentity
): Promise<void> {
  const db = getFirestoreDb();

  await db.runTransaction((transaction) =>
    upsertPlatformAccountInTransaction(transaction, db, userId, identity)
  );
}

export async function upsertPlatformAccountInTransaction(
  transaction: Transaction,
  db: Firestore,
  userId: string,
  identity: PlatformAccountIdentity
): Promise<void> {
  const accountRef = db
    .collection("platformAccounts")
    .doc(toPlatformAccountDocumentId(identity.platform, identity.platformUserId));
  const accountSnapshot = await transaction.get(accountRef);
  const linkedUserId = accountSnapshot.data()?.userId;

  if (typeof linkedUserId === "string" && linkedUserId !== userId) {
    throw new PlatformAccountConflictError();
  }

  const now = FieldValue.serverTimestamp();

  transaction.set(
    accountRef,
    {
      userId,
      platform: identity.platform,
      platformUserId: identity.platformUserId,
      displayName: identity.displayName,
      ...(accountSnapshot.exists ? {} : { createdAt: now }),
      updatedAt: now
    },
    { merge: true }
  );
}

export async function getPlatformAccount(
  platform: StreamingPlatform,
  platformUserId: string
): Promise<StoredPlatformAccount | null> {
  const snapshot = await getFirestoreDb()
    .collection("platformAccounts")
    .doc(toPlatformAccountDocumentId(platform, platformUserId))
    .get();
  const data = snapshot.data();

  if (
    !data ||
    typeof data.userId !== "string" ||
    data.platform !== platform ||
    data.platformUserId !== platformUserId ||
    typeof data.displayName !== "string"
  ) {
    return null;
  }

  return {
    userId: data.userId,
    platform,
    platformUserId,
    displayName: data.displayName
  };
}

export function toPlatformAccountDocumentId(
  platform: StreamingPlatform,
  platformUserId: string
): string {
  if (!platformUserId || platformUserId.trim() !== platformUserId) {
    throw new Error("Platform user ID must be a non-empty normalized string");
  }

  return `${platform}:${encodeURIComponent(platformUserId)}`;
}
