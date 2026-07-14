import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

export function getFirebaseClientApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp({
    apiKey: requiredEnv("VITE_FIREBASE_API_KEY"),
    authDomain: requiredEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: requiredEnv("VITE_FIREBASE_PROJECT_ID"),
    appId: requiredEnv("VITE_FIREBASE_APP_ID")
  });
}

export function getFirebaseClientAuth(): Auth {
  return getAuth(getFirebaseClientApp());
}

type FirebaseEnvName =
  | "VITE_FIREBASE_API_KEY"
  | "VITE_FIREBASE_AUTH_DOMAIN"
  | "VITE_FIREBASE_PROJECT_ID"
  | "VITE_FIREBASE_APP_ID";

function requiredEnv(name: FirebaseEnvName): string {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}
