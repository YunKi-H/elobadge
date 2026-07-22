import type { ChessProvider } from "@elobadge/core";
import { FieldValue } from "firebase-admin/firestore";
import { getFirestoreDb } from "./admin.js";
import {
  getChzzkChessBadgeState,
  type ChzzkChessBadgeState
} from "./chess-badges.js";

export class ChessBadgePreferenceError extends Error {
  constructor(public readonly code: "identity_mismatch" | "badge_unavailable") {
    super(code);
    this.name = "ChessBadgePreferenceError";
  }
}

export async function getChessBadgePreference(
  uid: string,
  chzzkChannelId: string
): Promise<ChzzkChessBadgeState> {
  const snapshot = await getFirestoreDb()
    .collection("chzzkAccounts")
    .doc(chzzkChannelId)
    .get();

  if (snapshot.data()?.uid !== uid) {
    throw new ChessBadgePreferenceError("identity_mismatch");
  }
  return getChzzkChessBadgeState(chzzkChannelId);
}

export async function updateChessBadgePreference(
  uid: string,
  chzzkChannelId: string,
  provider: ChessProvider
): Promise<ChzzkChessBadgeState> {
  const db = getFirestoreDb();
  const ref = db.collection("chzzkAccounts").doc(chzzkChannelId);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const data = snapshot.data();
    if (data?.uid !== uid) {
      throw new ChessBadgePreferenceError("identity_mismatch");
    }

    const providerBadge = data.badges?.[provider];
    const legacyBadge = data.badge;
    const badge = providerBadge?.provider === provider
      ? providerBadge
      : legacyBadge?.provider === provider
        ? legacyBadge
        : null;

    if (!badge) {
      throw new ChessBadgePreferenceError("badge_unavailable");
    }

    transaction.update(ref, {
      preferredChessProvider: provider,
      badge,
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  return getChzzkChessBadgeState(chzzkChannelId);
}
