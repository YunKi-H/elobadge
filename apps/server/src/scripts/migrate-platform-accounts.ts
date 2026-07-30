import "../config/env.js";
import { migrateChzzkPlatformAccounts } from "../firebase/platform-account-migration.js";

const projectId = requiredEnv("FIREBASE_PROJECT_ID");
const execute = process.argv.includes("--execute");
const confirmedProject = readArgument("--confirm-project=");

if (execute && confirmedProject !== projectId) {
  throw new Error(
    `Project confirmation mismatch. Expected --confirm-project=${projectId}`
  );
}

const result = await migrateChzzkPlatformAccounts(execute);

console.log(`Firebase project: ${projectId}`);
console.log(
  `${execute ? "Migration" : "Dry run"}: ${result.scanned} Chzzk account(s) scanned.`
);
console.log(
  `${result.candidates} candidate(s), ${result.unchanged} unchanged, ${result.invalid} invalid, ${result.conflicts.length} conflict(s).`
);

for (const conflict of result.conflicts) {
  console.error(
    `Conflict for Chzzk channel ${conflict.channelId}: expected ${conflict.expectedUserId}, found ${conflict.actualUserId}.`
  );
}

if (execute) {
  console.log(`Updated ${result.migrated} platform account(s).`);
} else {
  console.log("No document was changed.");
  console.log(
    `To execute: pnpm platform-accounts:migrate --execute --confirm-project=${projectId}`
  );
}

if (result.conflicts.length > 0 || result.invalid > 0) {
  process.exitCode = 1;
}

function readArgument(prefix: string): string | null {
  const argument = process.argv.find((value) => value.startsWith(prefix));
  return argument?.slice(prefix.length) ?? null;
}

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}
