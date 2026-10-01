import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { OverlayUsageRecorder } from "../realtime/overlay-usage.js";
import { getFirestoreDb } from "./admin.js";
import { listUserPlatformAccounts } from "./platform-accounts.js";

export const overlayUsageRecorder = new OverlayUsageRecorder(async (uid) => {
  // Update only: never recreate a streamer removed during account deletion.
  await getFirestoreDb().collection("streamers").doc(uid).update({
    lastOverlayUsedAt: FieldValue.serverTimestamp()
  });
});

export async function listRecentOverlayStreamers(now = Date.now()) {
  const snapshot = await getFirestoreDb()
    .collection("streamers")
    .where("lastOverlayUsedAt", ">=", Timestamp.fromMillis(now - 30 * 86_400_000))
    .orderBy("lastOverlayUsedAt", "desc")
    .limit(50)
    .get();

  return Promise.all(snapshot.docs.map(async (document) => {
    const data = document.data();
    const accounts = await listUserPlatformAccounts(document.id);
    return {
      uid: document.id,
      displayName: accounts[0]?.displayName ??
        (typeof data.displayName === "string" ? data.displayName : document.id),
      lastUsedAt: (data.lastOverlayUsedAt as Timestamp).toDate().toISOString(),
      platforms: accounts.map(({ platform, displayName }) => ({ platform, displayName }))
    };
  }));
}
