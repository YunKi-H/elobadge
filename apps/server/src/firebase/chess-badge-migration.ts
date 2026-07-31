import {
  FieldPath,
  FieldValue,
  type Firestore
} from "firebase-admin/firestore";
import { getFirestoreDb } from "./admin.js";
import {
  parseChzzkChessBadgeState,
  parseUserChessBadgeState
} from "./chess-badges.js";

const PAGE_SIZE = 300;

export interface ChessBadgeMigrationResult {
  scanned: number;
  candidates: number;
  migrated: number;
  unchanged: number;
  invalid: number;
  conflicts: number;
}

export async function migrateChessBadgesToUsers(
  execute = false,
  db: Firestore = getFirestoreDb()
): Promise<ChessBadgeMigrationResult> {
  const result: ChessBadgeMigrationResult = {
    scanned: 0,
    candidates: 0,
    migrated: 0,
    unchanged: 0,
    invalid: 0,
    conflicts: 0
  };
  let lastDocumentId: string | null = null;

  while (true) {
    let query = db
      .collection("chzzkAccounts")
      .orderBy(FieldPath.documentId())
      .limit(PAGE_SIZE);
    if (lastDocumentId) {
      query = query.startAfter(lastDocumentId);
    }

    const snapshot = await query.get();
    if (snapshot.empty) {
      break;
    }

    for (const document of snapshot.docs) {
      result.scanned += 1;
      const legacyData = document.data();
      const uid = legacyData.uid;
      if (typeof uid !== "string" || uid.length === 0) {
        result.invalid += 1;
        continue;
      }

      const legacyState = parseChzzkChessBadgeState(legacyData);
      if (
        Object.keys(legacyState.badges).length === 0 &&
        legacyState.preferredProvider === null
      ) {
        result.unchanged += 1;
        continue;
      }

      const userRef = db.collection("users").doc(uid);
      const userSnapshot = await userRef.get();
      if (!userSnapshot.exists) {
        result.invalid += 1;
        continue;
      }

      const userData = userSnapshot.data();
      if (
        userData &&
        (Object.hasOwn(userData, "chessBadges") ||
          Object.hasOwn(userData, "preferredChessProvider"))
      ) {
        const userState = parseUserChessBadgeState(userData);
        if (sameState(userState, legacyState)) {
          result.unchanged += 1;
        } else {
          result.conflicts += 1;
        }
        continue;
      }

      result.candidates += 1;
      if (!execute) {
        continue;
      }

      await userRef.set(
        {
          chessBadges: legacyState.badges,
          preferredChessProvider:
            legacyState.preferredProvider ?? FieldValue.delete(),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
      result.migrated += 1;
    }

    if (snapshot.size < PAGE_SIZE) {
      break;
    }
    lastDocumentId = snapshot.docs.at(-1)?.id ?? null;
    if (!lastDocumentId) {
      break;
    }
  }

  return result;
}

function sameState(
  left: ReturnType<typeof parseUserChessBadgeState>,
  right: ReturnType<typeof parseChzzkChessBadgeState>
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
