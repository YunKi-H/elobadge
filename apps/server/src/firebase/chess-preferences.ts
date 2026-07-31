import type {
  ChessBadges,
  ChessProvider,
  ChessSpeed,
  RatingBadge
} from "@elobadge/core";
import {
  FieldValue,
  Timestamp,
  type DocumentSnapshot
} from "firebase-admin/firestore";
import { getHighestRating } from "../chess/rating-selection.js";
import { getFirestoreDb } from "./admin.js";
import {
  getUserChessBadgeState,
  parseUserChessBadgeState,
  type ChessBadgeState
} from "./chess-badges.js";

export class ChessBadgePreferenceError extends Error {
  constructor(public readonly code: "identity_mismatch" | "badge_unavailable") {
    super(code);
    this.name = "ChessBadgePreferenceError";
  }
}

export async function getChessBadgePreference(
  uid: string
): Promise<ChessBadgeState> {
  return reconcileLinkedChessBadges(uid);
}

async function reconcileLinkedChessBadges(
  uid: string
): Promise<ChessBadgeState> {
  const db = getFirestoreDb();
  const userRef = db.collection("users").doc(uid);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const initialUser = await userRef.get();
    assertUserExists(initialUser);
    const accountIds = readLinkedAccountIds(initialUser);
    const linkedBadges = await Promise.all(
      (["chesscom", "lichess"] as const).map(async (provider) => {
        const accountId = accountIds[provider];
        return typeof accountId === "string"
          ? deriveLinkedBadge(uid, accountId, provider)
          : null;
      })
    );

    const state = parseUserChessBadgeState(initialUser.data());
    const badges: ChessBadges = { ...state.badges };
    for (const badge of linkedBadges) {
      if (badge) {
        badges[badge.provider] = badge;
      }
    }

    const preferredProvider =
      state.preferredProvider && badges[state.preferredProvider]
        ? state.preferredProvider
        : badges.chesscom
          ? "chesscom"
          : badges.lichess
            ? "lichess"
            : null;
    const reconciled = { badges, preferredProvider };

    if (sameBadgeState(state, reconciled)) {
      return reconciled;
    }

    try {
      await userRef.update(
        {
          chessBadges: badges,
          preferredChessProvider: preferredProvider ?? FieldValue.delete(),
          updatedAt: FieldValue.serverTimestamp()
        },
        { lastUpdateTime: initialUser.updateTime }
      );
      return reconciled;
    } catch (error) {
      if (!isFailedPrecondition(error)) {
        throw error;
      }
    }
  }

  return getUserChessBadgeState(uid);
}

export async function updateChessBadgePreference(
  uid: string,
  provider: ChessProvider
): Promise<ChessBadgeState> {
  const db = getFirestoreDb();
  const ref = db.collection("users").doc(uid);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) {
      throw new ChessBadgePreferenceError("identity_mismatch");
    }

    const state = parseUserChessBadgeState(snapshot.data());
    const badge = state.badges[provider];

    if (!badge) {
      throw new ChessBadgePreferenceError("badge_unavailable");
    }

    transaction.update(ref, {
      chessBadges: state.badges,
      preferredChessProvider: provider,
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  return getUserChessBadgeState(uid);
}

async function deriveLinkedBadge(
  uid: string,
  accountId: string,
  provider: ChessProvider
): Promise<RatingBadge | null> {
  const accountRef = getFirestoreDb().collection("chessAccounts").doc(accountId);
  const ratingRefs = getProviderSpeeds(provider).map((speed) =>
    accountRef.collection("ratings").doc(speed)
  );
  const [accountSnapshot, ...ratingSnapshots] = await Promise.all([
    accountRef.get(),
    ...ratingRefs.map((ratingRef) => ratingRef.get())
  ]);
  const account = accountSnapshot.data();
  if (
    account?.uid !== uid ||
    account.provider !== provider ||
    !(account.verifiedAt instanceof Timestamp)
  ) {
    return null;
  }

  const highest = getHighestRating(
    ratingSnapshots.flatMap((document) => {
      const rating = document.data();
      const speed = document.id;
      if (
        !rating ||
        !isProviderSpeed(provider, speed) ||
        typeof rating.value !== "number"
      ) {
        return [];
      }
      return [{
        speed,
        value: rating.value,
        provisional: provider === "lichess" && rating.provisional === true
      }];
    })
  );

  return highest
    ? { provider, ...highest }
    : null;
}

type LinkedAccountIds = Partial<Record<ChessProvider, string>>;

function assertUserExists(
  snapshot: DocumentSnapshot
): asserts snapshot is DocumentSnapshot & { exists: true } {
  if (!snapshot.exists) {
    throw new ChessBadgePreferenceError("identity_mismatch");
  }
}

function readLinkedAccountIds(snapshot: DocumentSnapshot): LinkedAccountIds {
  const value = snapshot.data()?.chessAccountIds;
  return {
    ...(typeof value?.chesscom === "string"
      ? { chesscom: value.chesscom }
      : {}),
    ...(typeof value?.lichess === "string"
      ? { lichess: value.lichess }
      : {})
  };
}

function isFailedPrecondition(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error.code === 9 || error.code === "failed-precondition")
  );
}

function getProviderSpeeds(provider: ChessProvider): readonly ChessSpeed[] {
  return provider === "lichess"
    ? ["bullet", "blitz", "rapid", "classical"]
    : ["bullet", "blitz", "rapid"];
}

function isProviderSpeed(
  provider: ChessProvider,
  speed: string
): speed is ChessSpeed {
  return (
    speed === "bullet" ||
    speed === "blitz" ||
    speed === "rapid" ||
    (provider === "lichess" && speed === "classical")
  );
}

function sameBadgeState(
  left: ChessBadgeState,
  right: ChessBadgeState
): boolean {
  return (
    left.preferredProvider === right.preferredProvider &&
    sameBadge(left.badges.chesscom, right.badges.chesscom) &&
    sameBadge(left.badges.lichess, right.badges.lichess)
  );
}

function sameBadge(
  left: RatingBadge | undefined,
  right: RatingBadge | undefined
): boolean {
  return (
    left?.provider === right?.provider &&
    left?.speed === right?.speed &&
    left?.value === right?.value &&
    left?.provisional === right?.provisional
  );
}
