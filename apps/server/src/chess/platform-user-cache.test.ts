import assert from "node:assert/strict";
import test from "node:test";
import type { StoredPlatformAccount } from "../firebase/platform-accounts.js";
import { PlatformUserCache } from "./platform-user-cache.js";

test("platform user cache reuses an unlinked result until it expires", async () => {
  let loads = 0;
  let now = 1_000;
  const cache = new PlatformUserCache(
    10_000,
    100,
    async () => {
      loads += 1;
      return null;
    },
    () => now
  );

  assert.equal(await cache.get("chzzk", "viewer"), null);
  assert.equal(await cache.get("chzzk", "viewer"), null);
  assert.equal(loads, 1);

  now += 10_001;
  assert.equal(await cache.get("chzzk", "viewer"), null);
  assert.equal(loads, 2);
});

test("platform user cache coalesces concurrent unlinked lookups", async () => {
  let loads = 0;
  const cache = new PlatformUserCache(10_000, 100, async () => {
    loads += 1;
    await new Promise((resolve) => setTimeout(resolve, 5));
    return null;
  });

  await Promise.all([
    cache.get("twitch", "viewer"),
    cache.get("twitch", "viewer")
  ]);

  assert.equal(loads, 1);
});

test("an invalidated in-flight miss cannot overwrite a linked account", async () => {
  let loads = 0;
  let releaseFirst: (() => void) | undefined;
  const linkedAccount: StoredPlatformAccount = {
    userId: "user-1",
    platform: "twitch",
    platformUserId: "viewer",
    displayName: "Viewer"
  };
  const cache = new PlatformUserCache(10_000, 100, async () => {
    loads += 1;
    if (loads === 1) {
      await new Promise<void>((resolve) => {
        releaseFirst = resolve;
      });
      return null;
    }
    return linkedAccount;
  });

  const oldLookup = cache.get("twitch", "viewer");
  await waitFor(() => loads === 1);
  cache.invalidate("twitch", "viewer");
  assert.equal(await cache.get("twitch", "viewer"), "user-1");
  releaseFirst?.();
  await oldLookup;

  assert.equal(cache.peek("twitch", "viewer"), "user-1");
  assert.equal(await cache.get("twitch", "viewer"), "user-1");
  assert.equal(loads, 2);
});

async function waitFor(predicate: () => boolean) {
  while (!predicate()) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}
