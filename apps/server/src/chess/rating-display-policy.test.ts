import assert from "node:assert/strict";
import test from "node:test";
import { resolveRatingBadge, type ChessBadges } from "@elobadge/core";

const badges: ChessBadges = {
  chesscom: {
    provider: "chesscom",
    speed: "rapid",
    value: 1800,
    provisional: false
  }
};

test("forced Lichess policy hides the badge when Lichess is not linked", () => {
  assert.equal(resolveRatingBadge("lichess_only", badges, "chesscom"), null);
});

test("viewer choice uses the selected provider without silently falling back", () => {
  assert.equal(resolveRatingBadge("viewer_choice", badges, "lichess"), null);
  assert.equal(resolveRatingBadge("viewer_choice", badges, "chesscom")?.value, 1800);
});
