import assert from "node:assert/strict";
import test from "node:test";
import {
  consumeTwitchOAuthState,
  getTwitchOAuthPurposeHint,
  issueTwitchOAuthState
} from "./oauth-state.js";

test("Twitch OAuth state preserves its callback purpose", () => {
  const state = issueTwitchOAuthState({
    uid: "chzzk:streamer",
    purpose: "streamer_chat"
  });

  assert.equal(getTwitchOAuthPurposeHint(state), "streamer_chat");
  assert.deepEqual(consumeTwitchOAuthState(state), {
    uid: "chzzk:streamer",
    purpose: "streamer_chat"
  });
  assert.equal(consumeTwitchOAuthState(state), null);
});
