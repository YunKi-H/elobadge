import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { ChessComPlayer, ChessComRating } from "../chess/chesscom/client.js";
import { getFirestoreDb } from "./admin.js";

export interface StoredChessComAccount {
  username: string;
  normalizedUsername: string;
  playerId: string;
  profileUrl: string;
  avatarUrl: string | null;
  status: string;
  verified: boolean;
  ratings: ChessComRating[];
}

export class ChessAccountConflictError extends Error {
  constructor() {
    super("This Chess.com account is already linked to another user");
    this.name = "ChessAccountConflictError";
  }
}

export async function saveUnverifiedChessComAccount(
  uid: string,
  player: ChessComPlayer
): Promise<StoredChessComAccount> {
  const db = getFirestoreDb();
  const accountId = toChessComAccountId(player.normalizedUsername);
  const accountRef = db.collection("chessAccounts").doc(accountId);
  const userRef = db.collection("users").doc(uid);

  const verified = await db.runTransaction(async (transaction) => {
    const [accountSnapshot, userSnapshot] = await Promise.all([
      transaction.get(accountRef),
      transaction.get(userRef)
    ]);
    const linkedUid = accountSnapshot.data()?.uid;

    if (linkedUid && linkedUid !== uid) {
      throw new ChessAccountConflictError();
    }

    const previousAccountId = userSnapshot.data()?.chessAccountIds?.chesscom;
    const preserveVerification = accountSnapshot.exists && linkedUid === uid;
    const now = FieldValue.serverTimestamp();

    if (typeof previousAccountId === "string" && previousAccountId !== accountId) {
      const previousAccountRef = db.collection("chessAccounts").doc(previousAccountId);
      const previousSnapshot = await transaction.get(previousAccountRef);

      if (previousSnapshot.data()?.uid === uid) {
        transaction.update(previousAccountRef, {
          uid: null,
          disconnectedAt: now,
          updatedAt: now
        });
      }
    }

    transaction.set(
      accountRef,
      {
        uid,
        provider: "chesscom",
        username: player.username,
        normalizedUsername: player.normalizedUsername,
        providerUserId: player.playerId,
        profileUrl: player.profileUrl,
        avatarUrl: player.avatarUrl,
        accountStatus: player.status,
        ...(preserveVerification
          ? {}
          : { verifiedAt: null, verificationMethod: null }),
        disconnectedAt: null,
        ...(accountSnapshot.exists ? {} : { createdAt: now }),
        updatedAt: now,
        ratingsFetchedAt: now
      },
      { merge: true }
    );
    transaction.set(
      userRef,
      {
        chessAccountIds: { chesscom: accountId },
        updatedAt: now
      },
      { merge: true }
    );
    return preserveVerification && accountSnapshot.data()?.verifiedAt instanceof Timestamp;
  });

  const batch = db.batch();

  for (const rating of player.ratings) {
    batch.set(
      accountRef.collection("ratings").doc(rating.speed),
      {
        speed: rating.speed,
        value: rating.value,
        ratingDeviation: rating.ratingDeviation,
        providerUpdatedAt: Timestamp.fromDate(rating.providerUpdatedAt),
        fetchedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  }

  await batch.commit();
  return { ...player, verified };
}

export async function getUserChessComAccount(
  uid: string
): Promise<StoredChessComAccount | null> {
  const db = getFirestoreDb();
  const userSnapshot = await db.collection("users").doc(uid).get();
  const accountId = userSnapshot.data()?.chessAccountIds?.chesscom;

  if (typeof accountId !== "string") {
    return null;
  }

  const accountRef = db.collection("chessAccounts").doc(accountId);
  const [accountSnapshot, ratingsSnapshot] = await Promise.all([
    accountRef.get(),
    accountRef.collection("ratings").get()
  ]);
  const data = accountSnapshot.data();

  if (!data || data.uid !== uid || data.provider !== "chesscom") {
    return null;
  }

  const ratings = ratingsSnapshot.docs.flatMap((document) => {
    const rating = document.data();
    const providerUpdatedAt = rating.providerUpdatedAt;

    if (
      !isChessComSpeed(rating.speed) ||
      typeof rating.value !== "number" ||
      typeof rating.ratingDeviation !== "number" ||
      !(providerUpdatedAt instanceof Timestamp)
    ) {
      return [];
    }

    return [{
      speed: rating.speed,
      value: rating.value,
      ratingDeviation: rating.ratingDeviation,
      providerUpdatedAt: providerUpdatedAt.toDate()
    }];
  });

  return {
    username: String(data.username),
    normalizedUsername: String(data.normalizedUsername),
    playerId: String(data.providerUserId),
    profileUrl: String(data.profileUrl),
    avatarUrl: typeof data.avatarUrl === "string" ? data.avatarUrl : null,
    status: String(data.accountStatus),
    verified: data.verifiedAt instanceof Timestamp,
    ratings
  };
}

function toChessComAccountId(normalizedUsername: string): string {
  return `chesscom:${normalizedUsername}`;
}

function isChessComSpeed(value: unknown): value is ChessComRating["speed"] {
  return value === "bullet" || value === "blitz" || value === "rapid";
}
