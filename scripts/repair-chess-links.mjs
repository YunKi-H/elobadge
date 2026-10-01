// Run through stdin inside the app container; no image rebuild is required.
/* global console, process */
import { createRequire } from "node:module";

const serverDir = "/app/apps/server";
const require = createRequire(`${serverDir}/package.json`);
const { FieldValue } = require("firebase-admin/firestore");
const { getFirestoreDb } = await import(`${serverDir}/dist/firebase/admin.js`);
const db = getFirestoreDb();
const execute = process.argv.includes("--execute");
const confirmation = process.argv.find(arg => arg.startsWith("--confirm-project="));

if (execute && confirmation !== `--confirm-project=${db.projectId}`) {
  throw new Error(`Expected --confirm-project=${db.projectId}`);
}

console.log(`Project: ${db.projectId}; mode: ${execute ? "execute" : "dry run"}`);
const users = await db.collection("users").select().get();
let changed = 0;
let failed = 0;

for (const user of users.docs) {
  try {
    const repairs = await db.runTransaction(async transaction => {
      const snapshot = await transaction.get(user.ref);
      if (!snapshot.exists) return [];
      const data = snapshot.data();
      const findings = [];

      // Read both account documents before making any transaction writes.
      for (const provider of ["chesscom", "lichess"]) {
        const id = data.chessAccountIds?.[provider];
        const hasBadge = data.chessBadges?.[provider] !== undefined;
        if (id === undefined && !hasBadge) continue;

        let reason = null;
        if (typeof id !== "string" || !id || id.includes("/")) {
          reason = id === undefined ? "badge_without_link" : "invalid_reference";
        } else {
          const account = await transaction.get(db.collection("chessAccounts").doc(id));
          if (!account.exists) reason = "account_missing";
          else if (account.data().provider !== provider) reason = "provider_mismatch";
          else if (account.data().uid !== user.id) reason = "owner_mismatch";
        }
        if (reason) findings.push({ provider, accountId: id ?? null, reason });
      }

      if (findings.length === 0) return [];
      const removed = new Set(findings.map(finding => finding.provider));
      const patch = { updatedAt: FieldValue.serverTimestamp() };
      for (const { provider } of findings) {
        patch[`chessAccountIds.${provider}`] = FieldValue.delete();
        patch[`chessBadges.${provider}`] = FieldValue.delete();
      }
      const available = ["chesscom", "lichess"].filter(provider =>
        !removed.has(provider) && data.chessBadges?.[provider]
      );
      const preferred = available.includes(data.preferredChessProvider)
        ? data.preferredChessProvider
        : available[0];
      patch.preferredChessProvider = preferred ?? FieldValue.delete();
      if (execute) transaction.update(user.ref, patch);
      return findings;
    });

    if (repairs.length > 0) {
      changed++;
      console.log(JSON.stringify({ uid: user.id, repairs }));
    }
  } catch (error) {
    failed++;
    console.error(`Failed ${user.id}: ${error.message}`);
  }
}

console.log(`${execute ? "Updated" : "Candidates"}: ${changed} user(s); failed: ${failed}`);
if (!execute) console.log("No data was changed.");
if (failed) process.exitCode = 1;
