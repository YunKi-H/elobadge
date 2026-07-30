import { getFirestoreDb } from "./admin.js";

export interface AdminDatabaseStats {
  users: number;
  streamers: number;
  chatEnabledStreamers: number;
  activeOverlays: number;
}

export async function getAdminDatabaseStats(): Promise<AdminDatabaseStats> {
  const db = getFirestoreDb();
  const [
    users,
    streamers,
    chatEnabledStreamers,
    activeOverlays
  ] = await Promise.all([
    db.collection("users").count().get(),
    db.collection("streamers").count().get(),
    db.collection("streamers")
      .where("chatSessionEnabled", "==", true)
      .count()
      .get(),
    db.collection("overlays")
      .where("active", "==", true)
      .count()
      .get()
  ]);

  return {
    users: users.data().count,
    streamers: streamers.data().count,
    chatEnabledStreamers: chatEnabledStreamers.data().count,
    activeOverlays: activeOverlays.data().count
  };
}
