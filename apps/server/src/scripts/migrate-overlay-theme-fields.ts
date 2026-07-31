import "../config/env.js";
import { migrateOverlayThemeBadgeFields } from "../firebase/overlay-theme-migration.js";

const projectId = requiredEnv("FIREBASE_PROJECT_ID");
const execute = process.argv.includes("--execute");
const confirmedProject = readArgument("--confirm-project=");

if (execute && confirmedProject !== projectId) {
  throw new Error(
    `Project confirmation mismatch. Expected --confirm-project=${projectId}`
  );
}

const result = await migrateOverlayThemeBadgeFields(execute);

console.log(`Firebase project: ${projectId}`);
console.log(
  `${execute ? "Migration" : "Dry run"}: ${result.scanned} overlay(s) scanned.`
);
console.log(
  `${result.candidates} candidate(s), ${result.unchanged} unchanged, ` +
    `${result.invalid} invalid.`
);

if (execute) {
  console.log(`Updated ${result.migrated} overlay theme(s).`);
} else {
  console.log("No document was changed.");
  console.log(
    "To execute: pnpm overlay-themes:migrate --execute " +
      `--confirm-project=${projectId}`
  );
}

if (result.invalid > 0) {
  process.exitCode = 1;
}

function readArgument(prefix: string): string | null {
  const argument = process.argv.find((value) => value.startsWith(prefix));
  return argument?.slice(prefix.length) ?? null;
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}
