import assert from "node:assert/strict";
import test from "node:test";
import { ChessComClientError } from "./chesscom/client.js";
import { LichessClientError } from "./lichess/client.js";
import { nextProfileNotFoundCount } from "./profile-availability.js";

test("counts only missing profiles, not missing stats or transient failures", () => {
  assert.equal(nextProfileNotFoundCount(new ChessComClientError("not_found", "missing", 404, "profile"), 1), 2);
  assert.equal(nextProfileNotFoundCount(new LichessClientError("not_found", "missing", 410, "profile"), undefined), 1);
  assert.equal(nextProfileNotFoundCount(new ChessComClientError("not_found", "missing", 404, "stats"), 1), 0);
  assert.equal(nextProfileNotFoundCount(new ChessComClientError("rate_limited", "busy", 429), 1), 0);
  assert.equal(nextProfileNotFoundCount(new Error("timeout"), 1), 0);
});
