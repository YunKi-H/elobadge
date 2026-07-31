import { useCallback, useEffect, useState } from "react";
import type { ChessProvider } from "@elobadge/core";
import { onAuthStateChanged } from "firebase/auth";
import {
  getChessBadgePreference,
  updateChessBadgePreference,
  type ChessBadgePreference
} from "../api/client";
import { getFirebaseClientAuth } from "../firebase/client";
import { useTranslation } from "react-i18next";

export interface ChessBadgePreferenceController {
  state: ChessBadgePreference | null;
  error: string | null;
  savingProvider: ChessProvider | null;
  refresh: () => Promise<void>;
  select: (provider: ChessProvider) => Promise<void>;
}

export function useChessBadgePreference(): ChessBadgePreferenceController {
  const { t } = useTranslation();
  const [state, setState] = useState<ChessBadgePreference | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingProvider, setSavingProvider] = useState<ChessProvider | null>(null);

  const refresh = useCallback(async () => {
    try {
      setState(await getChessBadgePreference());
      setError(null);
    } catch (reason) {
      setError(errorMessage(reason, t("badgePreference.loadFailed")));
    }
  }, [t]);

  useEffect(() => onAuthStateChanged(getFirebaseClientAuth(), (user) => {
    if (user) {
      void refresh();
    } else {
      setState(null);
      setError(null);
      setSavingProvider(null);
    }
  }), [refresh]);

  const select = useCallback(async (provider: ChessProvider) => {
    setSavingProvider(provider);
    setError(null);
    try {
      setState(await updateChessBadgePreference(provider));
    } catch (reason) {
      setError(errorMessage(reason, t("badgePreference.saveFailed")));
    } finally {
      setSavingProvider(null);
    }
  }, [t]);

  return { state, error, savingProvider, refresh, select };
}

function errorMessage(reason: unknown, fallback: string): string {
  return reason instanceof Error ? reason.message : fallback;
}
