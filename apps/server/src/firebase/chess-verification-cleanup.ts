import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { CHESS_COM_VERIFICATION_LIFETIME_MS } from "../chess/chesscom/verification-policy.js";
import { getFirestoreDb } from "./admin.js";
import {
  parseUserChessBadgeState,
  selectPreferredChessProvider
} from "./chess-badges.js";

export const VERIFICATION_CLEANUP_BATCH_SIZE = 100;
const CHESS_COM_RATING_SPEEDS = ["bullet", "blitz", "rapid"] as const;

export async function deleteExpiredChessVerificationChallenges(
  now: Date,
  limit = VERIFICATION_CLEANUP_BATCH_SIZE
): Promise<number> {
  const db = getFirestoreDb();
  const nowTimestamp = Timestamp.fromDate(now);
  const legacyCutoff = Timestamp.fromMillis(
    now.getTime() - CHESS_COM_VERIFICATION_LIFETIME_MS
  );
  const [expiredChallenges, expiredAccounts, legacyAccounts] = await Promise.all([
    db
      .collection("chessVerificationChallenges")
      .where("expiresAt", "<=", nowTimestamp)
      .orderBy("expiresAt", "asc")
      .limit(limit)
      .get(),
    db
      .collection("chessAccounts")
      .where("verificationExpiresAt", "<=", nowTimestamp)
      .orderBy("verificationExpiresAt", "asc")
      .limit(limit)
      .get(),
    db
      .collection("chessAccounts")
      .where("verifiedAt", "==", null)
      .limit(limit)
      .get()
  ]);
  const accountIds = new Set<string>();

  for (const document of expiredChallenges.docs) {
    accountIds.add(document.id);
  }
  for (const document of expiredAccounts.docs) {
    accountIds.add(document.id);
  }
  for (const document of legacyAccounts.docs) {
    const data = document.data();

    if (
      data.provider === "chesscom" &&
      !(data.verificationExpiresAt instanceof Timestamp) &&
      (!(data.updatedAt instanceof Timestamp) ||
        data.updatedAt.toMillis() <= legacyCutoff.toMillis())
    ) {
      accountIds.add(document.id);
    }
  }

  let deleted = 0;

  for (const accountId of [...accountIds].slice(0, limit)) {
    if (await deleteExpiredVerificationArtifacts(accountId, now)) {
      deleted += 1;
    }
  }

  return deleted;
}

async function deleteExpiredVerificationArtifacts(
  accountId: string,
  now: Date
): Promise<boolean> {
  const db = getFirestoreDb();
  const accountRef = db.collection("chessAccounts").doc(accountId);
  const challengeRef = db
    .collection("chessVerificationChallenges")
    .doc(accountId);

  return db.runTransaction(async (transaction) => {
    const [accountSnapshot, challengeSnapshot] = await Promise.all([
      transaction.get(accountRef),
      transaction.get(challengeRef)
    ]);
    const account = accountSnapshot.data();
    const challenge = challengeSnapshot.data();

    if (!account) {
      if (challengeSnapshot.exists && isExpired(challenge?.expiresAt, now)) {
        transaction.delete(challengeRef);
        return true;
      }

      return false;
    }

    if (
      account.provider !== "chesscom" ||
      account.verifiedAt instanceof Timestamp ||
      !isPendingAccountExpired(account, challenge, now)
    ) {
      if (challengeSnapshot.exists && isExpired(challenge?.expiresAt, now)) {
        transaction.delete(challengeRef);
        return true;
      }

      return false;
    }

    const uid = typeof account.uid === "string" ? account.uid : null;
    const userRef = uid ? db.collection("users").doc(uid) : null;
    const userSnapshot = userRef ? await transaction.get(userRef) : null;
    const ratingRefs = CHESS_COM_RATING_SPEEDS.map((speed) =>
      accountRef.collection("ratings").doc(speed)
    );

    transaction.delete(accountRef);
    transaction.delete(challengeRef);
    for (const ratingRef of ratingRefs) {
      transaction.delete(ratingRef);
    }

    if (
      userRef &&
      userSnapshot?.data()?.chessAccountIds?.chesscom === accountId
    ) {
      const currentState = parseUserChessBadgeState(userSnapshot.data());
      const remainingBadges = { ...currentState.badges };
      delete remainingBadges.chesscom;
      const preferredProvider = selectPreferredChessProvider(
        remainingBadges,
        currentState.preferredProvider
      );

      transaction.update(userRef, {
        "chessAccountIds.chesscom": FieldValue.delete(),
        chessBadges: remainingBadges,
        preferredChessProvider: preferredProvider ?? FieldValue.delete(),
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    return true;
  });
}

function isPendingAccountExpired(
  account: FirebaseFirestore.DocumentData,
  challenge: FirebaseFirestore.DocumentData | undefined,
  now: Date
): boolean {
  if (account.verificationExpiresAt instanceof Timestamp) {
    return isExpired(account.verificationExpiresAt, now);
  }

  if (challenge?.expiresAt instanceof Timestamp) {
    return isExpired(challenge.expiresAt, now);
  }

  return (
    !(account.updatedAt instanceof Timestamp) ||
    account.updatedAt.toMillis() <=
      now.getTime() - CHESS_COM_VERIFICATION_LIFETIME_MS
  );
}

function isExpired(value: unknown, now: Date): boolean {
  return value instanceof Timestamp && value.toMillis() <= now.getTime();
}
