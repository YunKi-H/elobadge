import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirebaseClientAuth } from "../firebase/client";

export type FirebaseAuthStatus = "loading" | "signed_out" | "signed_in";

export function useFirebaseAuthStatus(): FirebaseAuthStatus {
  const [status, setStatus] = useState<FirebaseAuthStatus>("loading");

  useEffect(
    () =>
      onAuthStateChanged(getFirebaseClientAuth(), (user) => {
        setStatus(user ? "signed_in" : "signed_out");
      }),
    []
  );

  return status;
}
