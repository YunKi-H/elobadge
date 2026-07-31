import { OneTimeStore } from "../auth/one-time-store.js";
import type { LoginMode, StreamingPlatform } from "@elobadge/core";

export interface FirebaseLoginExchange {
  customToken: string;
  mode: LoginMode;
  user: {
    uid: string;
    provider: StreamingPlatform;
    platformUserId: string;
    displayName: string;
  };
}

const loginExchanges = new OneTimeStore<FirebaseLoginExchange>(2 * 60 * 1_000);

export function issueFirebaseLoginCode(exchange: FirebaseLoginExchange): string {
  return loginExchanges.issue(exchange);
}

export function consumeFirebaseLoginCode(code: string): FirebaseLoginExchange | null {
  return loginExchanges.consume(code);
}
