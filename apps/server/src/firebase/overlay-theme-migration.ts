import {
  FieldPath,
  type DocumentData,
  type Firestore
} from "firebase-admin/firestore";
import { getFirestoreDb } from "./admin.js";
import { parseOverlayAppearance } from "./overlays.js";

const PAGE_SIZE = 300;

export interface OverlayThemeMigrationResult {
  scanned: number;
  candidates: number;
  migrated: number;
  unchanged: number;
  invalid: number;
}

export async function migrateOverlayThemeBadgeFields(
  execute = false,
  db: Firestore = getFirestoreDb()
): Promise<OverlayThemeMigrationResult> {
  const result: OverlayThemeMigrationResult = {
    scanned: 0,
    candidates: 0,
    migrated: 0,
    unchanged: 0,
    invalid: 0
  };
  let lastToken: string | null = null;

  while (true) {
    let query = db
      .collection("overlays")
      .orderBy(FieldPath.documentId())
      .limit(PAGE_SIZE);
    if (lastToken) {
      query = query.startAfter(lastToken);
    }

    const snapshot = await query.get();
    if (snapshot.empty) {
      break;
    }

    const batch = db.batch();
    let pageWrites = 0;

    for (const document of snapshot.docs) {
      result.scanned += 1;
      const theme = getTheme(document.data());
      const appearance = parseOverlayAppearance(theme);

      if (!appearance) {
        result.invalid += 1;
        continue;
      }
      if (hasPlatformBadgeFields(theme)) {
        result.unchanged += 1;
        continue;
      }

      result.candidates += 1;
      if (!execute) {
        continue;
      }

      batch.update(document.ref, {
        "theme.platformBadgesVisible": appearance.chzzkBadgesVisible,
        "theme.platformBadgeVisibility": {
          ...appearance.chzzkBadgeVisibility
        }
      });
      pageWrites += 1;
    }

    if (pageWrites > 0) {
      await batch.commit();
      result.migrated += pageWrites;
    }
    if (snapshot.size < PAGE_SIZE) {
      break;
    }

    lastToken = snapshot.docs.at(-1)?.id ?? null;
    if (!lastToken) {
      break;
    }
  }

  return result;
}

function getTheme(data: DocumentData): unknown {
  return data.theme;
}

function hasPlatformBadgeFields(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  const theme = value as Record<string, unknown>;
  return (
    typeof theme.platformBadgesVisible === "boolean" &&
    Boolean(
      theme.platformBadgeVisibility &&
        typeof theme.platformBadgeVisibility === "object"
    )
  );
}
