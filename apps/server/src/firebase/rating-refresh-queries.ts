import type { ChessProvider } from "@elobadge/core";
import { Timestamp } from "firebase-admin/firestore";
import { getFirestoreDb } from "./admin.js";

export async function listDueRatingRefreshAccountIds(
  provider: ChessProvider,
  now: Date,
  limit: number
): Promise<string[]> {
  const snapshot = await getFirestoreDb().collection("chessAccounts")
    .where("provider", "==", provider)
    .where("nextRatingRefreshAt", "<=", Timestamp.fromDate(now))
    .orderBy("nextRatingRefreshAt")
    .limit(limit)
    .get();
  return snapshot.docs.map((document) => document.id);
}
