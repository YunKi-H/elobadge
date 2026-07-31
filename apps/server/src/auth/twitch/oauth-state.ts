import { OneTimeStore } from "../one-time-store.js";

import type { LoginMode } from "@elobadge/core";

export type TwitchOAuthPurpose = "identity" | "streamer_chat" | "login";

interface PendingTwitchAccountOAuth {
  uid: string;
  purpose: "identity" | "streamer_chat";
}

interface PendingTwitchLoginOAuth {
  purpose: "login";
  mode: LoginMode;
}

export type PendingTwitchOAuth =
  | PendingTwitchAccountOAuth
  | PendingTwitchLoginOAuth;

const pendingAuthorizations =
  new OneTimeStore<PendingTwitchOAuth>(10 * 60 * 1_000);

export function issueTwitchOAuthState(value: PendingTwitchOAuth): string {
  return `${purposePrefix(value.purpose)}.${pendingAuthorizations.issue(value)}`;
}

export function consumeTwitchOAuthState(
  state: string
): PendingTwitchOAuth | null {
  const separator = state.indexOf(".");
  if (separator < 1) {
    return null;
  }

  const purpose = purposeFromPrefix(state.slice(0, separator));
  if (!purpose) {
    return null;
  }

  const pending = pendingAuthorizations.consume(state.slice(separator + 1));
  return pending?.purpose === purpose ? pending : null;
}

export function getTwitchOAuthPurposeHint(
  state: string
): TwitchOAuthPurpose | null {
  const separator = state.indexOf(".");
  return separator < 1 ? null : purposeFromPrefix(state.slice(0, separator));
}

function purposePrefix(purpose: TwitchOAuthPurpose): string {
  if (purpose === "streamer_chat") {
    return "streamer";
  }
  return purpose;
}

function purposeFromPrefix(prefix: string): TwitchOAuthPurpose | null {
  if (prefix === "streamer") {
    return "streamer_chat";
  }
  if (prefix === "identity") {
    return "identity";
  }
  if (prefix === "login") {
    return "login";
  }
  return null;
}
