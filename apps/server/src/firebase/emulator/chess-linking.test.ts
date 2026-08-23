import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { deleteApp } from "firebase-admin/app";
import { Timestamp } from "firebase-admin/firestore";
import { DEFAULT_OVERLAY_APPEARANCE } from "@elobadge/core";
import type { ChessComPlayer } from "../../chess/chesscom/client.js";
import {
  ChessAccountConflictError,
  disconnectChessComAccount,
  getUserChessComAccount,
  saveUnverifiedChessComAccount
} from "../chess-accounts.js";
import { getFirebaseAdminApp, getFirestoreDb } from "../admin.js";
import { deleteUserFirestoreData } from "../account-deletion.js";
import { deleteOrphanedInactiveOverlays } from "../overlay-cleanup.js";
import {
  getChzzkChessBadgeState,
  getChzzkRatingBadge
} from "../chess-badges.js";
import {
  disconnectLichessAccount,
  getUserLichessAccount,
  saveVerifiedLichessAccount
} from "../lichess-accounts.js";
import {
  ChessVerificationError,
  completeChessComLocationVerification,
  createChessComLocationChallenge
} from "../chess-verifications.js";
import { deleteExpiredChessVerificationChallenges } from "../chess-verification-cleanup.js";
import {
  ChessRatingRefreshError,
  claimManualChessComRatingRefresh,
  completeChessComRatingRefresh,
  listDueChessComRatingRefreshes
} from "../chess-rating-refresh.js";
import { listDueLichessRatingRefreshes } from "../lichess-rating-refresh.js";
import { getChessBadgePreference } from "../chess-preferences.js";
import {
  enableStreamerOverlayAccess,
  getStreamerOverlayAccess,
  rotateStreamerOverlayAccess,
  updateStreamerOverlayAppearance
} from "../overlays.js";
import {
  disconnectChzzkPlatformAccount,
  deleteUserPlatformAccounts,
  getPlatformAccount,
  listUserPlatformAccounts,
  PlatformAccountConflictError,
  toPlatformAccountDocumentId,
  upsertPlatformAccount
} from "../platform-accounts.js";
import {
  deleteTwitchStreamerTokens,
  getTwitchStreamerAuthorizationStatus,
  loadTwitchStreamerTokens,
  saveTwitchStreamerAuthorization
} from "../twitch-tokens.js";
import {
  registerChzzkStreamer,
  upsertChzzkUserRecord
} from "../users.js";

const projectId = "demo-elobadge-emulator";
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

if (!emulatorHost) {
  throw new Error("Run this test through pnpm test:emulator");
}

process.env.FIREBASE_PROJECT_ID = projectId;
process.env.TWITCH_TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
delete process.env.FIREBASE_CLIENT_EMAIL;
delete process.env.FIREBASE_PRIVATE_KEY;
delete process.env.GOOGLE_APPLICATION_CREDENTIALS;

beforeEach(async () => {
  const response = await fetch(
    `http://${emulatorHost}/emulator/v1/projects/${projectId}/databases/(default)/documents`,
    { method: "DELETE" }
  );

  assert.equal(response.ok, true, await response.text());
});

after(async () => {
  await deleteApp(getFirebaseAdminApp());
});

test("Chess.com verification selects the highest badge and disconnect clears it", async () => {
  const uid = "chzzk:viewer-channel";
  const channelId = "viewer-channel";
  const player = createPlayer();
  const db = getFirestoreDb();

  await upsertPlatformAccount(uid, {
    platform: "chzzk",
    platformUserId: channelId,
    displayName: "viewer"
  });

  const saved = await saveUnverifiedChessComAccount(uid, player);
  assert.equal(saved.verified, false);
  assert.equal(saved.selectedSpeed, null);
  assert.deepEqual(await getChzzkRatingBadge(channelId), null);

  const challenge = await createChessComLocationChallenge(uid);
  const accountId = `chesscom:${player.normalizedUsername}`;

  await assert.rejects(
    completeChessComLocationVerification(uid, accountId, player.playerId, "wrong-code"),
    (error: unknown) =>
      error instanceof ChessVerificationError && error.code === "location_mismatch"
  );

  const failedChallenge = await db
    .collection("chessVerificationChallenges")
    .doc(accountId)
    .get();
  assert.equal(failedChallenge.data()?.failedAttempts, 1);

  await completeChessComLocationVerification(
    uid,
    accountId,
    player.playerId,
    `  ${challenge.code}  `
  );

  const linkedAccount = await getUserChessComAccount(uid);
  assert.equal(linkedAccount?.verified, true);
  assert.equal(linkedAccount?.selectedSpeed, "rapid");
  assert.deepEqual(await getChzzkRatingBadge(channelId), {
    provider: "chesscom",
    speed: "rapid",
    value: 1800,
    provisional: false
  });
  assert.equal(
    (await db.collection("chessVerificationChallenges").doc(accountId).get()).exists,
    false
  );

  const refreshTime = new Date("2026-07-15T12:00:00.000Z");
  await db.collection("chessAccounts").doc(accountId).update({
    manualRefreshAvailableAt: Timestamp.fromMillis(refreshTime.getTime() - 1)
  });
  const refreshClaim = await claimManualChessComRatingRefresh(uid, refreshTime);
  const refreshedPlayer = {
    ...player,
    ratings: [
      { ...player.ratings[0]!, value: 1900 },
      { ...player.ratings[2]!, value: 1850 }
    ]
  };
  await completeChessComRatingRefresh(
    refreshClaim,
    refreshedPlayer,
    refreshTime,
    new Date("2026-07-16T00:00:00.000Z")
  );

  assert.deepEqual(await getChzzkRatingBadge(channelId), {
    provider: "chesscom",
    speed: "bullet",
    value: 1900,
    provisional: false
  });
  assert.equal(
    (await db.collection("chessAccounts").doc(accountId).collection("ratings").doc("blitz").get()).exists,
    false
  );
  await assert.rejects(
    claimManualChessComRatingRefresh(
      uid,
      new Date(refreshTime.getTime() + 60_000)
    ),
    (error: unknown) =>
      error instanceof ChessRatingRefreshError && error.code === "cooldown"
  );

  assert.equal(await disconnectChessComAccount(uid), true);
  assert.equal(await getUserChessComAccount(uid), null);
  assert.equal(await getChzzkRatingBadge(channelId), null);

  const deletedAccount = await db.collection("chessAccounts").doc(accountId).get();
  assert.equal(deletedAccount.exists, false);
  for (const speed of ["bullet", "blitz", "rapid"]) {
    const deletedRating = await db
      .collection("chessAccounts")
      .doc(accountId)
      .collection("ratings")
      .doc(speed)
      .get();
    assert.equal(deletedRating.exists, false);
  }

  assert.equal(await disconnectChessComAccount(uid), true);
});

test("one Chess.com account cannot be linked to two Chzzk users", async () => {
  const player = createPlayer();

  await saveUnverifiedChessComAccount("chzzk:first", player);

  await assert.rejects(
    saveUnverifiedChessComAccount("chzzk:second", player),
    (error: unknown) => error instanceof ChessAccountConflictError
  );
});

test("platform account ownership is stable while profile data can update", async () => {
  const platformUserId = "viewer/channel";

  await upsertPlatformAccount("chzzk:viewer", {
    platform: "chzzk",
    platformUserId,
    displayName: "Before"
  });
  await upsertPlatformAccount("chzzk:viewer", {
    platform: "chzzk",
    platformUserId,
    displayName: "After"
  });

  assert.deepEqual(await getPlatformAccount("chzzk", platformUserId), {
    userId: "chzzk:viewer",
    platform: "chzzk",
    platformUserId,
    displayName: "After"
  });
  assert.deepEqual(await listUserPlatformAccounts("chzzk:viewer"), [{
    userId: "chzzk:viewer",
    platform: "chzzk",
    platformUserId,
    displayName: "After"
  }]);
  assert.equal(
    await deleteUserPlatformAccounts("chzzk:another-viewer", "chzzk"),
    0
  );
  assert.equal(await getPlatformAccount("chzzk", platformUserId) !== null, true);
  await assert.rejects(
    upsertPlatformAccount("chzzk:another-viewer", {
      platform: "chzzk",
      platformUserId,
      displayName: "Conflict"
    }),
    (error: unknown) => error instanceof PlatformAccountConflictError
  );

  assert.equal(
    await deleteUserPlatformAccounts("chzzk:viewer", "chzzk"),
    1
  );
  assert.equal(await getPlatformAccount("chzzk", platformUserId), null);
  await upsertPlatformAccount("chzzk:another-viewer", {
    platform: "chzzk",
    platformUserId,
    displayName: "New owner"
  });
  assert.equal(
    (await getPlatformAccount("chzzk", platformUserId))?.userId,
    "chzzk:another-viewer"
  );
});

test("Chzzk disconnect preserves EloBadge user data and other platforms", async () => {
  const db = getFirestoreDb();
  const uid = "chzzk:disconnect-viewer";
  const channelId = "disconnect-viewer";
  const badge = {
    provider: "chesscom",
    speed: "rapid",
    value: 1810,
    provisional: false
  } as const;

  await Promise.all([
    db.collection("users").doc(uid).set({
      chessBadges: { chesscom: badge },
      preferredChessProvider: "chesscom"
    }),
    db.collection("streamers").doc(uid).set({
      chzzkChannelId: channelId,
      chatSessionEnabled: false
    }),
    upsertPlatformAccount(uid, {
      platform: "chzzk",
      platformUserId: channelId,
      displayName: "Chzzk Viewer"
    })
  ]);

  await upsertPlatformAccount(uid, {
    platform: "twitch",
    platformUserId: "twitch-viewer",
    displayName: "Twitch Viewer"
  });
  assert.equal(await disconnectChzzkPlatformAccount(uid), 1);
  assert.equal(await getPlatformAccount("chzzk", channelId), null);
  assert.equal(
    (await getPlatformAccount("twitch", "twitch-viewer"))?.userId,
    uid
  );
  assert.deepEqual(
    (await db.collection("users").doc(uid).get()).get("chessBadges"),
    { chesscom: badge }
  );
  assert.equal(
    (await db.collection("streamers").doc(uid).get()).get("chzzkChannelId"),
    undefined
  );
});

test("Chzzk login reuses the EloBadge UID linked from a Twitch-first account", async () => {
  const db = getFirestoreDb();
  const uid = "twitch:linked-viewer";
  const channelId = "linked-chzzk-viewer";

  await Promise.all([
    db.collection("users").doc(uid).set({
      displayName: "Twitch Viewer"
    }),
    upsertPlatformAccount(uid, {
      platform: "twitch",
      platformUserId: "linked-viewer",
      displayName: "Twitch Viewer"
    })
  ]);
  await upsertPlatformAccount(uid, {
    platform: "chzzk",
    platformUserId: channelId,
    displayName: "Chzzk Viewer"
  });

  const resolvedUid = await upsertChzzkUserRecord({
    channelId,
    channelName: "Updated Chzzk Viewer"
  });

  assert.equal(resolvedUid, uid);
  assert.equal(
    (await getPlatformAccount("chzzk", channelId))?.userId,
    uid
  );
  assert.equal(
    (await getPlatformAccount("twitch", "linked-viewer"))?.userId,
    uid
  );

  await registerChzzkStreamer(uid, {
    channelId,
    channelName: "Updated Chzzk Viewer"
  });
  assert.equal(
    (await db.collection("streamers").doc(uid).get()).data()?.chzzkChannelId,
    channelId
  );
});

test("last Chzzk identity can be removed without deleting the EloBadge user", async () => {
  const db = getFirestoreDb();
  const uid = "chzzk:last-chzzk-viewer";
  const channelId = "last-chzzk-viewer";

  await Promise.all([
    db.collection("users").doc(uid).set({
      chessBadges: {},
      preferredChessProvider: null
    }),
    upsertPlatformAccount(uid, {
      platform: "chzzk",
      platformUserId: channelId,
      displayName: "Last Chzzk Viewer"
    })
  ]);

  assert.equal(await disconnectChzzkPlatformAccount(uid), 1);
  assert.equal(await getPlatformAccount("chzzk", channelId), null);
  assert.equal(
    (await db.collection("users").doc(uid).get()).exists,
    true
  );
});

test("Lichess OAuth linking stores ratings, selects a badge, and disconnects", async () => {
  const uid = "chzzk:lichess-viewer";
  const channelId = "lichess-viewer";
  const db = getFirestoreDb();
  await Promise.all([
    db.collection("users").doc(uid).set({ displayName: "viewer" }),
    upsertPlatformAccount(uid, {
      platform: "chzzk",
      platformUserId: channelId,
      displayName: "viewer"
    })
  ]);

  const account = await saveVerifiedLichessAccount(uid, {
    username: "LichessViewer",
    normalizedUsername: "lichessviewer",
    playerId: "lichessviewer",
    profileUrl: "https://lichess.org/@/LichessViewer",
    avatarUrl: null,
    status: "active",
    ratings: [
      { speed: "blitz", value: 1900, ratingDeviation: 50, provisional: false, games: 30 },
      { speed: "classical", value: 2050, ratingDeviation: 70, provisional: true, games: 8 }
    ]
  });

  assert.equal(account.selectedSpeed, "classical");
  assert.equal((await getUserLichessAccount(uid))?.username, "LichessViewer");
  assert.deepEqual(await getChzzkRatingBadge(channelId), {
    provider: "lichess",
    speed: "classical",
    value: 2050,
    provisional: true
  });

  assert.equal(await disconnectLichessAccount(uid), true);
  assert.equal(await getUserLichessAccount(uid), null);
  assert.equal(await getChzzkRatingBadge(channelId), null);
});

test("linking Lichess preserves an existing Chess.com badge", async () => {
  const uid = "chzzk:chesscom-before-lichess";
  const channelId = "chesscom-before-lichess";
  const chessComBadge = {
    provider: "chesscom",
    speed: "rapid",
    value: 1800,
    provisional: false
  } as const;
  const db = getFirestoreDb();
  await Promise.all([
    db.collection("users").doc(uid).set({
      displayName: "viewer",
      chessBadges: { chesscom: chessComBadge },
      preferredChessProvider: "chesscom"
    }),
    upsertPlatformAccount(uid, {
      platform: "chzzk",
      platformUserId: channelId,
      displayName: "viewer"
    })
  ]);

  await saveVerifiedLichessAccount(uid, {
    username: "LegacyViewer",
    normalizedUsername: "legacyviewer",
    playerId: "legacyviewer",
    profileUrl: "https://lichess.org/@/LegacyViewer",
    avatarUrl: null,
    status: "active",
    ratings: [
      {
        speed: "blitz",
        value: 1900,
        ratingDeviation: 50,
        provisional: false,
        games: 30
      }
    ]
  });

  const state = await getChzzkChessBadgeState(channelId);
  assert.deepEqual(state, {
    badges: {
      chesscom: chessComBadge,
      lichess: {
        provider: "lichess",
        speed: "blitz",
        value: 1900,
        provisional: false
      }
    },
    preferredProvider: "chesscom"
  });
});

test("disconnect switches the badge preference to the remaining linked provider", async () => {
  const uid = "chzzk:dual-provider-viewer";
  const channelId = "dual-provider-viewer";
  const chessComAccountId = "chesscom:dual-player";
  const lichessAccountId = "lichess:dual-player";
  const chessComBadge = {
    provider: "chesscom",
    speed: "rapid",
    value: 1800,
    provisional: false
  } as const;
  const lichessBadge = {
    provider: "lichess",
    speed: "blitz",
    value: 1900,
    provisional: false
  } as const;
  const db = getFirestoreDb();

  await Promise.all([
    db.collection("users").doc(uid).set({
      chessAccountIds: {
        chesscom: chessComAccountId,
        lichess: lichessAccountId
      },
      chessBadges: { chesscom: chessComBadge, lichess: lichessBadge },
      preferredChessProvider: "lichess"
    }),
    upsertPlatformAccount(uid, {
      platform: "chzzk",
      platformUserId: channelId,
      displayName: "viewer"
    }),
    db.collection("chessAccounts").doc(chessComAccountId).set({
      uid,
      provider: "chesscom"
    }),
    db.collection("chessAccounts").doc(lichessAccountId).set({
      uid,
      provider: "lichess"
    })
  ]);

  assert.equal(await disconnectLichessAccount(uid), true);
  assert.deepEqual(await getChzzkChessBadgeState(channelId), {
    badges: { chesscom: chessComBadge },
    preferredProvider: "chesscom"
  });
  assert.equal(await disconnectChessComAccount(uid), true);
  assert.deepEqual(await getChzzkChessBadgeState(channelId), {
    badges: {},
    preferredProvider: null
  });
});

test("badge preference restores a missing provider badge from linked accounts", async () => {
  const uid = "chzzk:missing-badge-viewer";
  const chessComAccountId = "chesscom:missing-badge";
  const lichessAccountId = "lichess:missing-badge";
  const db = getFirestoreDb();
  const chessComBadge = {
    provider: "chesscom",
    speed: "rapid",
    value: 1750,
    provisional: false
  } as const;

  await Promise.all([
    db.collection("users").doc(uid).set({
      chessAccountIds: {
        chesscom: chessComAccountId,
        lichess: lichessAccountId
      }
    }),
    db.collection("chessAccounts").doc(chessComAccountId).set({
      uid,
      provider: "chesscom",
      verifiedAt: Timestamp.now()
    }),
    db.collection("chessAccounts").doc(lichessAccountId).set({
      uid,
      provider: "lichess",
      verifiedAt: Timestamp.now()
    }),
    db.collection("chessAccounts").doc(chessComAccountId)
      .collection("ratings").doc("rapid").set({ value: 1750 }),
    db.collection("chessAccounts").doc(lichessAccountId)
      .collection("ratings").doc("rapid").set({
        value: 1900,
        provisional: false
      })
  ]);

  assert.deepEqual(await getChessBadgePreference(uid), {
    badges: {
      chesscom: chessComBadge,
      lichess: {
        provider: "lichess",
        speed: "rapid",
        value: 1900,
        provisional: false
      }
    },
    preferredProvider: "chesscom"
  });
});

test("concurrent badge reconciliation does not restore a disconnected account", async () => {
  const uid = "chzzk:concurrent-disconnect-viewer";
  const channelId = "concurrent-disconnect-viewer";
  const chessComAccountId = "chesscom:concurrent-disconnect";
  const lichessAccountId = "lichess:concurrent-disconnect";
  const db = getFirestoreDb();
  const chessComBadge = {
    provider: "chesscom",
    speed: "rapid",
    value: 1800,
    provisional: false
  } as const;
  await Promise.all([
    db.collection("users").doc(uid).set({
      chessAccountIds: {
        chesscom: chessComAccountId,
        lichess: lichessAccountId
      },
      chessBadges: { chesscom: chessComBadge },
      preferredChessProvider: "chesscom"
    }),
    upsertPlatformAccount(uid, {
      platform: "chzzk",
      platformUserId: channelId,
      displayName: "viewer"
    }),
    db.collection("chessAccounts").doc(chessComAccountId).set({
      uid,
      provider: "chesscom",
      verifiedAt: Timestamp.now()
    }),
    db.collection("chessAccounts").doc(lichessAccountId).set({
      uid,
      provider: "lichess",
      verifiedAt: Timestamp.now()
    }),
    db.collection("chessAccounts").doc(chessComAccountId)
      .collection("ratings").doc("rapid").set({ value: 1800 }),
    db.collection("chessAccounts").doc(lichessAccountId)
      .collection("ratings").doc("blitz").set({
        value: 1900,
        provisional: false
      })
  ]);

  const results = await Promise.all([
    getChessBadgePreference(uid),
    disconnectLichessAccount(uid)
  ]);

  assert.equal(results.at(-1), true);
  assert.deepEqual(await getChzzkChessBadgeState(channelId), {
    badges: { chesscom: chessComBadge },
    preferredProvider: "chesscom"
  });
});

test("rating refresh queries isolate providers and limit results by due time", async () => {
  const db = getFirestoreDb();
  const accounts = db.collection("chessAccounts");
  const now = new Date("2026-07-23T00:00:00.000Z");
  const batch = db.batch();

  batch.set(accounts.doc("chesscom:due-first"), {
    provider: "chesscom",
    nextRatingRefreshAt: Timestamp.fromMillis(now.getTime() - 2)
  });
  batch.set(accounts.doc("chesscom:due-second"), {
    provider: "chesscom",
    nextRatingRefreshAt: Timestamp.fromMillis(now.getTime() - 1)
  });
  batch.set(accounts.doc("lichess:due"), {
    provider: "lichess",
    nextRatingRefreshAt: Timestamp.fromMillis(now.getTime() - 2)
  });
  batch.set(accounts.doc("chesscom:scheduled"), {
    provider: "chesscom",
    nextRatingRefreshAt: Timestamp.fromMillis(now.getTime() + 1)
  });
  await batch.commit();

  assert.deepEqual(await listDueChessComRatingRefreshes(now, 1), [
    "chesscom:due-first"
  ]);
  assert.deepEqual(await listDueLichessRatingRefreshes(now, 1), [
    "lichess:due"
  ]);
});

test("verification cleanup deletes expired challenges and unverified accounts", async () => {
  const db = getFirestoreDb();
  const now = new Date("2026-07-20T00:00:00.000Z");
  const challenges = db.collection("chessVerificationChallenges");
  const expiredUid = "chzzk:expired-verification";
  const expiredAccountId = "chesscom:expired-verification";
  const expiredAccount = db.collection("chessAccounts").doc(expiredAccountId);
  const activeAccount = db.collection("chessAccounts").doc("chesscom:active-verification");
  const verifiedAccount = db.collection("chessAccounts").doc("chesscom:verified-account");
  const legacyAccount = db.collection("chessAccounts").doc("chesscom:legacy-unverified");

  await Promise.all([
    challenges.doc("expired").set({
      expiresAt: Timestamp.fromMillis(now.getTime() - 1)
    }),
    challenges.doc("active").set({
      expiresAt: Timestamp.fromMillis(now.getTime() + 1)
    }),
    challenges.doc("legacy-without-expiry").set({ createdAt: Timestamp.now() }),
    db.collection("users").doc(expiredUid).set({
      chessAccountIds: { chesscom: expiredAccountId },
      chessBadges: {},
      preferredChessProvider: null
    }),
    expiredAccount.set({
      uid: expiredUid,
      provider: "chesscom",
      verifiedAt: null,
      verificationExpiresAt: Timestamp.fromMillis(now.getTime() - 1),
      updatedAt: Timestamp.fromMillis(now.getTime() - 1)
    }),
    expiredAccount.collection("ratings").doc("rapid").set({ value: 1200 }),
    activeAccount.set({
      uid: "chzzk:active-verification",
      provider: "chesscom",
      verifiedAt: null,
      verificationExpiresAt: Timestamp.fromMillis(now.getTime() + 1),
      updatedAt: Timestamp.fromMillis(now.getTime() - 1)
    }),
    verifiedAccount.set({
      uid: "chzzk:verified-account",
      provider: "chesscom",
      verifiedAt: Timestamp.fromMillis(now.getTime() - 1),
      verificationExpiresAt: Timestamp.fromMillis(now.getTime() - 1),
      updatedAt: Timestamp.fromMillis(now.getTime() - 1)
    }),
    legacyAccount.set({
      uid: null,
      provider: "chesscom",
      verifiedAt: null,
      updatedAt: Timestamp.fromMillis(
        now.getTime() - 48 * 60 * 60 * 1_000 - 1
      )
    })
  ]);

  assert.equal(await deleteExpiredChessVerificationChallenges(now), 3);
  assert.equal((await challenges.doc("expired").get()).exists, false);
  assert.equal((await challenges.doc("active").get()).exists, true);
  assert.equal((await challenges.doc("legacy-without-expiry").get()).exists, true);
  assert.equal((await expiredAccount.get()).exists, false);
  assert.equal(
    (await expiredAccount.collection("ratings").doc("rapid").get()).exists,
    false
  );
  assert.equal(
    (await db.collection("users").doc(expiredUid).get()).get(
      "chessAccountIds.chesscom"
    ),
    undefined
  );
  assert.equal((await activeAccount.get()).exists, true);
  assert.equal((await verifiedAccount.get()).exists, true);
  assert.equal((await legacyAccount.get()).exists, false);
});

test("account deletion removes user-owned Firestore data", async () => {
  const db = getFirestoreDb();
  const uid = "chzzk:delete-channel";
  const channelId = "delete-channel";
  const accountId = "chesscom:delete-player";
  const accountRef = db.collection("chessAccounts").doc(accountId);
  const lichessAccountRef = db.collection("chessAccounts").doc("lichess:delete-player");
  const chzzkPlatformAccountRef = db
    .collection("platformAccounts")
    .doc(toPlatformAccountDocumentId("chzzk", channelId));
  const twitchPlatformAccountRef = db
    .collection("platformAccounts")
    .doc(toPlatformAccountDocumentId("twitch", "123456789"));
  const twitchTokenRef = db.collection("twitchTokens").doc(uid);
  const ownedDocuments = [
    db.collection("users").doc(uid),
    db.collection("streamers").doc(uid),
    db.collection("chzzkTokens").doc(uid),
    db.collection("overlays").doc("active-overlay"),
    db.collection("overlays").doc("rotated-overlay"),
    accountRef,
    accountRef.collection("ratings").doc("bullet"),
    accountRef.collection("ratings").doc("blitz"),
    accountRef.collection("ratings").doc("rapid"),
    db.collection("chessVerificationChallenges").doc(accountId),
    lichessAccountRef,
    lichessAccountRef.collection("ratings").doc("bullet"),
    lichessAccountRef.collection("ratings").doc("blitz"),
    lichessAccountRef.collection("ratings").doc("rapid"),
    lichessAccountRef.collection("ratings").doc("classical"),
    chzzkPlatformAccountRef,
    twitchPlatformAccountRef,
    twitchTokenRef
  ];

  await Promise.all([
    ownedDocuments[0]!.set({
      chessAccountIds: { chesscom: accountId, lichess: "lichess:delete-player" }
    }),
    ownedDocuments[1]!.set({ overlayToken: "active-overlay" }),
    ownedDocuments[2]!.set({ encryptedAccessToken: "secret" }),
    ownedDocuments[3]!.set({ streamerUid: uid, active: true }),
    ownedDocuments[4]!.set({ streamerUid: uid, active: false }),
    ownedDocuments[5]!.set({ uid, provider: "chesscom" }),
    ownedDocuments[6]!.set({ value: 1000 }),
    ownedDocuments[7]!.set({ value: 1100 }),
    ownedDocuments[8]!.set({ value: 1200 }),
    ownedDocuments[9]!.set({ uid }),
    ownedDocuments[10]!.set({ uid, provider: "lichess" }),
    ownedDocuments[11]!.set({ value: 1300 }),
    ownedDocuments[12]!.set({ value: 1400 }),
    ownedDocuments[13]!.set({ value: 1500 }),
    ownedDocuments[14]!.set({ value: 1600 }),
    ownedDocuments[15]!.set({ userId: uid, platform: "chzzk" }),
    ownedDocuments[16]!.set({ userId: uid, platform: "twitch" }),
    twitchTokenRef.set({ encryptedAccessToken: "twitch-secret" }),
    db.collection("overlays").doc("another-overlay").set({
      streamerUid: "chzzk:another-channel",
      active: true
    })
  ]);

  const deleted = await deleteUserFirestoreData(uid);

  assert.deepEqual(deleted.overlayTokens.sort(), [
    "active-overlay",
    "rotated-overlay"
  ]);
  for (const document of ownedDocuments) {
    assert.equal((await document.get()).exists, false);
  }
  assert.equal(
    (await db.collection("overlays").doc("another-overlay").get()).exists,
    true
  );
});

test("Twitch-first streamer authorization supports overlay creation", async () => {
  const uid = "twitch:123456789";
  const db = getFirestoreDb();

  await saveTwitchStreamerAuthorization(
    uid,
    {
      id: "123456789",
      login: "streamer",
      displayName: "Streamer"
    },
    {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      expiresIn: 14_400,
      scopes: ["openid", "user:read:chat"],
      tokenType: "bearer"
    }
  );

  const raw = (
    await db.collection("twitchTokens").doc(uid).get()
  ).data();
  assert.notEqual(raw?.encryptedAccessToken, "access-token");
  assert.notEqual(raw?.encryptedRefreshToken, "refresh-token");
  assert.equal(raw?.accessToken, undefined);
  assert.equal(raw?.refreshToken, undefined);

  const stored = await loadTwitchStreamerTokens(uid);
  assert.equal(stored?.accessToken, "access-token");
  assert.equal(stored?.refreshToken, "refresh-token");
  assert.deepEqual(await getTwitchStreamerAuthorizationStatus(uid), {
    connected: true,
    platformUserId: "123456789",
    displayName: "Streamer",
    expiresAt: stored?.expiresAt.toISOString(),
    scopes: ["openid", "user:read:chat"]
  });
  assert.equal(
    (await getPlatformAccount("twitch", "123456789"))?.userId,
    uid
  );
  assert.equal(
    (await db.collection("streamers").doc(uid).get()).data()?.displayName,
    "Streamer"
  );

  // Existing Twitch-first users may predate the shared streamer document.
  await db.collection("streamers").doc(uid).delete();
  const overlay = await enableStreamerOverlayAccess(uid);
  assert.equal(overlay.active, true);
  assert.equal(
    (await db.collection("streamers").doc(uid).get()).data()?.overlayToken,
    overlay.publicToken
  );

  await deleteTwitchStreamerTokens(uid);
  assert.deepEqual(await getTwitchStreamerAuthorizationStatus(uid), {
    connected: false
  });
});

test("overlay cleanup preserves the streamer's current disabled URL", async () => {
  const db = getFirestoreDb();
  const uid = "chzzk:cleanup-streamer";
  const overlays = db.collection("overlays");

  await Promise.all([
    db.collection("streamers").doc(uid).set({
      overlayToken: "current-disabled"
    }),
    overlays.doc("current-disabled").set({ streamerUid: uid, active: false }),
    overlays.doc("rotated-old").set({ streamerUid: uid, active: false }),
    overlays.doc("malformed-old").set({ active: false }),
    overlays.doc("active-overlay").set({ streamerUid: uid, active: true })
  ]);

  assert.deepEqual(await deleteOrphanedInactiveOverlays(), {
    scanned: 3,
    deleted: 2
  });
  assert.equal((await overlays.doc("current-disabled").get()).exists, true);
  assert.equal((await overlays.doc("rotated-old").get()).exists, false);
  assert.equal((await overlays.doc("malformed-old").get()).exists, false);
  assert.equal((await overlays.doc("active-overlay").get()).exists, true);
});

test("deployed Firestore rules deny direct unauthenticated client access", async () => {
  const response = await fetch(
    `http://${emulatorHost}/v1/projects/${projectId}/databases/(default)/documents/users/direct-client`
  );

  assert.equal(response.status, 403);
});

test("enabling an invalid legacy overlay replaces it with current defaults", async () => {
  const uid = "chzzk:legacy-overlay-streamer";
  const oldToken = "legacy-overlay-token";
  const db = getFirestoreDb();

  await Promise.all([
    db.collection("streamers").doc(uid).set({ uid, overlayToken: oldToken }),
    db.collection("overlays").doc(oldToken).set({
      streamerUid: uid,
      active: false,
      theme: DEFAULT_OVERLAY_APPEARANCE
    })
  ]);

  assert.equal(await getStreamerOverlayAccess(uid), null);

  const replacement = await enableStreamerOverlayAccess(uid);
  assert.notEqual(replacement.publicToken, oldToken);
  assert.deepEqual(replacement.appearance, DEFAULT_OVERLAY_APPEARANCE);
  assert.equal(
    (await db.collection("overlays").doc(oldToken).get()).exists,
    false
  );
  assert.equal(
    (
      await db
        .collection("overlays")
        .doc(replacement.publicToken)
        .get()
    ).get("theme.platformBadgeSettings.chzzk.visible"),
    true
  );
});

test("overlay appearance persists and survives public token rotation", async () => {
  const uid = "chzzk:streamer-channel";
  const db = getFirestoreDb();
  await db.collection("streamers").doc(uid).set({ uid });

  const initial = await enableStreamerOverlayAccess(uid);
  const initialTheme = await db.collection("overlays").doc(initial.publicToken).get();
  assert.equal(
    initialTheme.get("theme.platformBadgeSettings.chzzk.visible"),
    true
  );
  assert.equal(
    initialTheme.get("theme.platformBadgeSettings.twitch.visible"),
    true
  );
  assert.equal(initialTheme.get("theme.chzzkBadgesVisible"), undefined);
  assert.deepEqual(initial.appearance, {
    customCss: "",
    messageMaxWidthPx: 600,
    chatAlignment: "left",
    messageLayout: "inline",
    nicknameSeparatorVisible: true,
    alignedNicknameRightAligned: false,
    messageBoxFilled: false,
    backgroundVisible: true,
    backgroundColor: "#020617",
    backgroundOpacity: 90,
    chzzkBadgesVisible: true,
    chzzkBadgeVisibility: {
      role: true,
      subscription: true,
      donation: true,
      subscription_gift: true,
      unknown: true
    },
    twitchBadgesVisible: true,
    twitchBadgeVisibility: {
      role: true,
      subscription: true,
      donation: true,
      subscription_gift: true,
      unknown: true
    },
    ratingProviderPolicy: "viewer_choice",
    nicknameVisible: true,
    nicknameColorMode: "fixed",
    nicknameColor: "#7DD3FC",
    nicknameRoleColors: {
      streamer: "#34D399",
      manager: "#60A5FA",
      donator: "#FBBF24",
      subscriber: "#C084FC",
      viewer: "#E2E8F0"
    },
    messageColorMode: "fixed",
    messageColor: "#FFFFFF",
    messageRoleColors: {
      streamer: "#86EFAC",
      manager: "#93C5FD",
      donator: "#FDE68A",
      subscriber: "#D8B4FE",
      viewer: "#FFFFFF"
    },
    fontFamily: "system",
    fontSizePx: 18,
    fontWeight: 400,
    fontLineHeight: 1.4,
    messageDurationSeconds: 20
  });

  const appearance = {
    customCss: ".nickname { color: #FDE047; }",
    messageMaxWidthPx: 480,
    chatAlignment: "right" as const,
    messageLayout: "aligned" as const,
    nicknameSeparatorVisible: false,
    alignedNicknameRightAligned: true,
    messageBoxFilled: false,
    backgroundVisible: false,
    backgroundColor: "#172554",
    backgroundOpacity: 45,
    chzzkBadgesVisible: false,
    chzzkBadgeVisibility: {
      role: false,
      subscription: true,
      donation: false,
      subscription_gift: true,
      unknown: false
    },
    twitchBadgesVisible: true,
    twitchBadgeVisibility: {
      role: true,
      subscription: false,
      donation: true,
      subscription_gift: false,
      unknown: true
    },
    ratingProviderPolicy: "lichess_only" as const,
    nicknameVisible: false,
    nicknameColorMode: "by_user" as const,
    nicknameColor: "#FDE047",
    nicknameRoleColors: {
      streamer: "#34D399",
      manager: "#60A5FA",
      donator: "#FBBF24",
      subscriber: "#C084FC",
      viewer: "#E2E8F0"
    },
    messageColorMode: "by_role" as const,
    messageColor: "#7DD3FC",
    messageRoleColors: {
      streamer: "#86EFAC",
      manager: "#93C5FD",
      donator: "#FDE68A",
      subscriber: "#D8B4FE",
      viewer: "#FFFFFF"
    },
    fontFamily: "freesentation" as const,
    fontSizePx: 22,
    fontWeight: 600 as const,
    fontLineHeight: 1.6 as const,
    messageDurationSeconds: 60 as const
  };
  await updateStreamerOverlayAppearance(uid, appearance);
  assert.deepEqual((await getStreamerOverlayAccess(uid))?.appearance, appearance);

  const rotated = await rotateStreamerOverlayAccess(uid);
  assert.notEqual(rotated.publicToken, initial.publicToken);
  assert.deepEqual(rotated.appearance, appearance);
  assert.equal(
    (await db.collection("overlays").doc(initial.publicToken).get()).exists,
    false
  );
});

function createPlayer(): ChessComPlayer {
  return {
    username: "TestPlayer",
    normalizedUsername: "testplayer",
    playerId: "123456",
    profileUrl: "https://www.chess.com/member/testplayer",
    avatarUrl: null,
    location: null,
    status: "premium",
    ratings: [
      {
        speed: "bullet",
        value: 1650,
        ratingDeviation: 45,
        providerUpdatedAt: new Date("2026-07-01T00:00:00.000Z")
      },
      {
        speed: "blitz",
        value: 1800,
        ratingDeviation: 40,
        providerUpdatedAt: new Date("2026-07-02T00:00:00.000Z")
      },
      {
        speed: "rapid",
        value: 1800,
        ratingDeviation: 35,
        providerUpdatedAt: new Date("2026-07-03T00:00:00.000Z")
      }
    ]
  };
}
