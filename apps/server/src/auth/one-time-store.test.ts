import assert from "node:assert/strict";
import test from "node:test";
import { OneTimeStore } from "./one-time-store.js";

test("a one-time value can only be consumed once", () => {
  const store = new OneTimeStore<string>(1_000);
  const code = store.issue("token");

  assert.equal(store.consume(code), "token");
  assert.equal(store.consume(code), null);
});

test("an expired one-time value cannot be consumed", () => {
  let now = 1_000;
  const store = new OneTimeStore<string>(100, () => now);
  const code = store.issue("token");

  now = 1_100;

  assert.equal(store.consume(code), null);
});
