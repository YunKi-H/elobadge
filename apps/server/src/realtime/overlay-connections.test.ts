import assert from "node:assert/strict";
import test from "node:test";
import { OverlayConnectionTracker } from "./overlay-connections.js";

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
