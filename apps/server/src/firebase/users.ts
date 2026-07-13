import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAuth, getFirestoreDb } from "./admin.js";

export interface ChzzkUserIdentity {
  channelId: string;
  channelName: string;
}

export async function upsertChzzkStreamer(identity: ChzzkUserIdentity): Promise<string> {
  const uid = toFirebaseUid(identity.channelId);
  const db = getFirestoreDb();
  const userRef = db.collection("users").doc(uid);
  const chzzkAccountRef = db.collection("chzzkAccounts").doc(identity.channelId);
  const streamerRef = db.collection("streamers").doc(uid);

  await db.runTransaction(async (transaction) => {
    const [userSnapshot, chzzkAccountSnapshot, streamerSnapshot] = await Promise.all([
      transaction.get(userRef),
      transaction.get(chzzkAccountRef),
      transaction.get(streamerRef)
    ]);

    const linkedUid = chzzkAccountSnapshot.data()?.uid;

    if (linkedUid && linkedUid !== uid) {
      throw new Error("This Chzzk account is already linked to another user");
    }

    const now = FieldValue.serverTimestamp();

    transaction.set(
      userRef,
      {
        displayName: identity.channelName,
        ...(userSnapshot.exists ? {} : { createdAt: now }),
        updatedAt: now
      },
      { merge: true }
    );

    transaction.set(
      chzzkAccountRef,
      {
        uid,
        displayName: identity.channelName,
        ...(chzzkAccountSnapshot.exists ? {} : { badge: null, createdAt: now }),
        updatedAt: now
      },
      { merge: true }
    );

    transaction.set(
      streamerRef,
      {
        chzzkChannelId: identity.channelId,
        displayName: identity.channelName,
        ...(streamerSnapshot.exists ? {} : { createdAt: now }),
        updatedAt: now
      },
      { merge: true }
    );
  });

  await upsertFirebaseAuthUser(uid, identity.channelName);

  return uid;
}

function toFirebaseUid(channelId: string): string {
  return `chzzk:${channelId}`;
}

async function upsertFirebaseAuthUser(uid: string, displayName: string) {
  const auth = getFirebaseAuth();
  const normalizedDisplayName = displayName.slice(0, 256);

  try {
    await auth.updateUser(uid, { displayName: normalizedDisplayName });
  } catch (error) {
    if (!hasFirebaseCode(error, "auth/user-not-found")) {
      throw error;
    }

    try {
      await auth.createUser({ uid, displayName: normalizedDisplayName });
    } catch (createError) {
      if (!hasFirebaseCode(createError, "auth/uid-already-exists")) {
        throw createError;
      }

      await auth.updateUser(uid, { displayName: normalizedDisplayName });
    }
  }
}

function hasFirebaseCode(error: unknown, code: string): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: unknown }).code === code
  );
}
