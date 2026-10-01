import assert from "node:assert/strict";
import test from "node:test";
import { OverlayUsageRecorder } from "./overlay-usage.js";

test("overlay usage writes at most once per streamer per five minutes", async () => {
  let now = 1;
  const writes: string[] = [];
  const recorder = new OverlayUsageRecorder(async (uid) => { writes.push(uid); }, () => now);
  await Promise.all([recorder.record("a"), recorder.record("a"), recorder.record("b")]);
  await recorder.record("a");
  assert.deepEqual(writes, ["a", "b"]);
  now += 300_000;
  await recorder.record("a");
  assert.deepEqual(writes, ["a", "b", "a"]);
});

test("failed usage writes back off and can retry after the interval", async () => {
  let now = 1;
  let calls = 0;
  const recorder = new OverlayUsageRecorder(async () => {
    calls++;
    if (calls === 1) throw new Error("unavailable");
  }, () => now);
  await assert.rejects(recorder.record("a"), /unavailable/);
  await recorder.record("a");
  assert.equal(calls, 1);
  now += 300_000;
  await recorder.record("a");
  assert.equal(calls, 2);
});
