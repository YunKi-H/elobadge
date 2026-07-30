import {
  FieldPath,
  FieldValue,
  type DocumentData,
  type Firestore
} from "firebase-admin/firestore";
import { getFirestoreDb } from "./admin.js";
import { toPlatformAccountDocumentId } from "./platform-accounts.js";

const PAGE_SIZE = 300;

export interface PlatformAccountMigrationConflict {
  channelId: string;
  expectedUserId: string;
  actualUserId: string;
}

export interface PlatformAccountMigrationResult {
  scanned: number;
  candidates: number;
  migrated: number;
  unchanged: number;
  invalid: number;
  conflicts: PlatformAccountMigrationConflict[];
}

export async function migrateChzzkPlatformAccounts(
  execute = false,
  db: Firestore = getFirestoreDb()
): Promise<PlatformAccountMigrationResult> {
  const result: PlatformAccountMigrationResult = {
    scanned: 0,
    candidates: 0,
    migrated: 0,
    unchanged: 0,
    invalid: 0,
    conflicts: []
  };

  let lastChannelId: string | null = null;

  while (true) {
    let query = db
      .collection("chzzkAccounts")
      .orderBy(FieldPath.documentId())
      .limit(PAGE_SIZE);

    if (lastChannelId) {
      query = query.startAfter(lastChannelId);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      break;
    }

    const targetRefs = snapshot.docs.map((document) =>
      db
        .collection("platformAccounts")
        .doc(toPlatformAccountDocumentId("chzzk", document.id))
    );
    const targetSnapshots = await db.getAll(...targetRefs);
    const batch = db.batch();
    let pageWrites = 0;

    for (const [index, document] of snapshot.docs.entries()) {
      result.scanned += 1;

      const source = parseChzzkAccount(document.id, document.data());
      if (!source) {
        result.invalid += 1;
        continue;
      }

      const target = targetSnapshots[index];
      if (!target) {
        throw new Error(`Missing migration target snapshot for ${document.id}`);
      }

      const targetData = target.data();
      const existingUserId = targetData?.userId;

      if (
        typeof existingUserId === "string" &&
        existingUserId !== source.userId
      ) {
        result.conflicts.push({
          channelId: source.channelId,
          expectedUserId: source.userId,
          actualUserId: existingUserId
        });
        continue;
      }

      if (isCurrentPlatformAccount(targetData, source)) {
        result.unchanged += 1;
        continue;
      }

      result.candidates += 1;

      if (!execute) {
        continue;
      }

      const now = FieldValue.serverTimestamp();
      batch.set(
        target.ref,
        {
          userId: source.userId,
          platform: "chzzk",
          platformUserId: source.channelId,
          displayName: source.displayName,
          ...(target.exists ? {} : { createdAt: now }),
          updatedAt: now
        },
        { merge: true }
      );
      pageWrites += 1;
    }

    if (pageWrites > 0) {
      await batch.commit();
      result.migrated += pageWrites;
    }

    if (snapshot.size < PAGE_SIZE) {
      break;
    }

    lastChannelId = snapshot.docs.at(-1)?.id ?? null;
    if (!lastChannelId) {
      break;
    }
  }

  return result;
}

interface ChzzkPlatformAccountSource {
  channelId: string;
  userId: string;
  displayName: string;
}

function parseChzzkAccount(
  channelId: string,
  data: DocumentData
): ChzzkPlatformAccountSource | null {
  if (typeof data.uid !== "string" || !data.uid) {
    return null;
  }

  return {
    channelId,
    userId: data.uid,
    displayName:
      typeof data.displayName === "string" && data.displayName
        ? data.displayName
        : channelId
  };
}

function isCurrentPlatformAccount(
  data: DocumentData | undefined,
  source: ChzzkPlatformAccountSource
): boolean {
  return Boolean(
    data &&
      data.userId === source.userId &&
      data.platform === "chzzk" &&
      data.platformUserId === source.channelId &&
      data.displayName === source.displayName
  );
}
