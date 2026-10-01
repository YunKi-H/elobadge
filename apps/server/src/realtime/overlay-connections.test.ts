import assert from "node:assert/strict";
import test from "node:test";
import { OverlayConnectionTracker } from "./overlay-connections.js";

test("streamer connection counts survive token rotation and close independently", () => {
  const tracker = new OverlayConnectionTracker();
  const first = tracker.connect("old", "a");
  const second = tracker.connect("new", "a");
  const other = tracker.connect("other", "b");
  assert.equal(tracker.getStreamerConnectionCount("a"), 2);
  first();
  first();
  assert.equal(tracker.getStreamerConnectionCount("a"), 1);
  assert.equal(tracker.getStreamerConnectionCount("b"), 1);
  second();
  other();
  assert.equal(tracker.getStreamerConnectionCount("a"), 0);
  assert.equal(tracker.getStreamerConnectionCount("b"), 0);
});

test("overlay connection tracker counts connections and unique overlays", () => {
  const tracker = new OverlayConnectionTracker();
  const closeFirst = tracker.connect("overlay-a");
  const closeSecond = tracker.connect("overlay-a");
  const closeThird = tracker.connect("overlay-b");

  assert.deepEqual(tracker.getSummary(), {
    total: 3,
    uniqueOverlays: 2
  });

  closeFirst();
  closeFirst();
  closeSecond();
  closeThird();

  assert.deepEqual(tracker.getSummary(), {
    total: 0,
    uniqueOverlays: 0
  });
});
