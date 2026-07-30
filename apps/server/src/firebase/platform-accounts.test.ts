import assert from "node:assert/strict";
import { test } from "node:test";
import type {
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  Transaction
} from "firebase-admin/firestore";
import {
  PlatformAccountConflictError,
  toPlatformAccountDocumentId,
  upsertPlatformAccountInTransaction
} from "./platform-accounts.js";

test("platform account document IDs are namespaced and URL-safe", () => {
  assert.equal(
    toPlatformAccountDocumentId("chzzk", "viewer/channel"),
    "chzzk:viewer%2Fchannel"
  );
  assert.equal(
    toPlatformAccountDocumentId("twitch", "123456789"),
    "twitch:123456789"
  );
  assert.throws(() => toPlatformAccountDocumentId("chzzk", ""));
  assert.throws(() => toPlatformAccountDocumentId("chzzk", " viewer"));
});

test("platform account upsert preserves ownership and updates profile data", async () => {
  const writes: unknown[][] = [];
  const accountRef = { id: "chzzk:viewer" } as DocumentReference;
  const db = createFirestore(accountRef);
  const transaction = createTransaction(
    {
      exists: true,
      data: () => ({ userId: "chzzk:viewer", displayName: "Before" })
    } as DocumentSnapshot,
    writes
  );

  await upsertPlatformAccountInTransaction(
    transaction,
    db,
    "chzzk:viewer",
    {
      platform: "chzzk",
      platformUserId: "viewer",
      displayName: "After"
    }
  );

  assert.equal(writes.length, 1);
  assert.equal(writes[0]?.[0], accountRef);
  const record = writes[0]?.[1] as Record<string, unknown>;
  assert.equal(record.userId, "chzzk:viewer");
  assert.equal(record.platform, "chzzk");
  assert.equal(record.platformUserId, "viewer");
  assert.equal(record.displayName, "After");
  assert.ok(record.updatedAt);
  assert.equal("createdAt" in record, false);
  assert.deepEqual(writes[0]?.[2], { merge: true });
});

test("platform account upsert rejects an account owned by another user", async () => {
  const writes: unknown[][] = [];
  const transaction = createTransaction(
    {
      exists: true,
      data: () => ({ userId: "chzzk:owner" })
    } as DocumentSnapshot,
    writes
  );

  await assert.rejects(
    upsertPlatformAccountInTransaction(
      transaction,
      createFirestore({ id: "chzzk:viewer" } as DocumentReference),
      "chzzk:another",
      {
        platform: "chzzk",
        platformUserId: "viewer",
        displayName: "Viewer"
      }
    ),
    (error: unknown) => error instanceof PlatformAccountConflictError
  );
  assert.equal(writes.length, 0);
});

function createFirestore(accountRef: DocumentReference): Firestore {
  return {
    collection: (name: string) => {
      assert.equal(name, "platformAccounts");
      return {
        doc: () => accountRef
      };
    }
  } as unknown as Firestore;
}

function createTransaction(
  snapshot: DocumentSnapshot,
  writes: unknown[][]
): Transaction {
  const transaction = {
    get: async () => snapshot,
    set: (...args: unknown[]) => {
      writes.push(args);
      return transaction;
    }
  } as unknown as Transaction;

  return transaction;
}
