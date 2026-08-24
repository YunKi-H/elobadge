import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  ExternalLink,
  Link,
  LoaderCircle,
  RefreshCw,
  Unlink
} from "lucide-react";
import {
  disconnectLichessAccount,
  getLichessAccount,
  refreshLichessAccount,
  startLichessConnection,
  type LichessAccount
} from "../api/client";
import { getFirebaseClientAuth } from "../firebase/client";
import { languageLocale } from "../i18n";
import {
  ChessBadgePreferenceControl
} from "./ChessBadgePreferenceSettings";
import type { ChessBadgePreferenceController } from "./useChessBadgePreference";

type State =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "ready"; account: LichessAccount | null; message?: string }
  | { status: "error"; account: LichessAccount | null; message: string };

const speedLabels = {
  bullet: "Bullet",
  blitz: "Blitz",
  rapid: "Rapid",
  classical: "Classical"
} as const;

export function LichessAccountSettings({
  badgePreference
}: {
  badgePreference: ChessBadgePreferenceController;
}) {
  const { i18n, t } = useTranslation();
  const [state, setState] = useState<State>({ status: "loading" });
  const [connecting, setConnecting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => onAuthStateChanged(getFirebaseClientAuth(), (user) => {
    if (!user) {
      setState({ status: "signed_out" });
      return;
    }
    void getLichessAccount()
      .then((account) => {
        const result = new URLSearchParams(window.location.search).get("lichess");
        setState({
          status: "ready",
          account,
          message: result === "connected"
            ? t("lichess.connected")
            : result === "expired"
              ? t("lichess.expired")
              : result === "error"
                ? t("lichess.failed")
                : undefined
        });
        if (result) {
          const url = new URL(window.location.href);
          url.searchParams.delete("lichess");
          window.history.replaceState({}, "", url);
        }
      })
      .catch((error: unknown) => setState({
        status: "error",
        account: null,
        message: errorMessage(error, t("chessAccount.requestFailed"))
      }));
  }), [t]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const connect = async () => {
    setConnecting(true);
    try {
      window.location.assign(await startLichessConnection());
    } catch (error) {
      setError(error);
      setConnecting(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      const refreshed = await refreshLichessAccount();
      setState({ status: "ready", account: refreshed });
      void badgePreference.refresh();
      if (refreshed.ratingsFetchedAt) {
        setClock(Date.parse(refreshed.ratingsFetchedAt));
      }
    } catch (error) {
      setError(error);
    } finally {
      setRefreshing(false);
    }
  };

  const disconnect = async () => {
    if (!window.confirm(t("lichess.disconnectConfirm"))) {
      return;
    }
    setDisconnecting(true);
    try {
      await disconnectLichessAccount();
      setState({ status: "ready", account: null });
      void badgePreference.refresh();
    } catch (error) {
      setError(error);
    } finally {
      setDisconnecting(false);
    }
  };

  const setError = (error: unknown) => setState((current) => ({
    status: "error",
    account: "account" in current ? current.account : null,
    message: errorMessage(error, t("chessAccount.requestFailed"))
  }));

  if (state.status === "loading") {
    return (
      <section className="py-8 text-slate-300">
        <LoaderCircle className="mr-2 inline animate-spin" size={18} />
        {t("chessAccount.loading")}
      </section>
    );
  }
  if (state.status === "signed_out") {
    return null;
  }

  const account = state.account;
  const availableAt = account?.manualRefreshAvailableAt
    ? Date.parse(account.manualRefreshAvailableAt)
    : 0;
  const cooldownMs = Math.max(0, availableAt - clock);
  const ratingGridColumns =
    account?.ratings.length === 2
      ? "sm:grid-cols-2"
      : account?.ratings.length === 3
        ? "sm:grid-cols-3"
        : account && account.ratings.length >= 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1";

  return (
    <section className="py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold text-white">
              {t("lichess.title")}
            </h2>
            <ChessBadgePreferenceControl
              provider="lichess"
              preference={badgePreference}
            />
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {t("lichess.description")}
          </p>
        </div>
        {account ? (
          <div className="flex flex-wrap items-center justify-end gap-3">
            <a
              href={account.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300 hover:text-emerald-200"
            >
              {account.username}
              <ExternalLink aria-hidden="true" size={15} />
            </a>
            <button
              type="button"
              disabled={refreshing || disconnecting || cooldownMs > 0}
              onClick={() => void refresh()}
              title={t("lichess.refreshTitle")}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-slate-800 px-3 text-sm font-medium text-slate-100 ring-1 ring-white/10 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={refreshing ? "animate-spin" : undefined}
                size={15}
              />
              {refreshing
                ? t("common.refreshing")
                : cooldownMs > 0
                  ? t("chessAccount.refreshInMinutes", {
                      count: Math.ceil(cooldownMs / 60_000)
                    })
                  : t("common.refresh")}
            </button>
            <button
              type="button"
              disabled={refreshing || disconnecting}
              onClick={() => void disconnect()}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-slate-800 px-3 text-sm font-medium text-red-200 ring-1 ring-white/10 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {disconnecting ? (
                <LoaderCircle className="animate-spin" size={15} />
              ) : (
                <Unlink size={15} />
              )}
              {t("chessAccount.disconnect")}
            </button>
          </div>
        ) : null}
      </div>

      {!account ? (
        <button
          type="button"
          disabled={connecting}
          onClick={() => void connect()}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-emerald-500 px-4 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {connecting ? (
            <LoaderCircle className="animate-spin" size={18} />
          ) : (
            <Link size={18} />
          )}
          {t("lichess.connect")}
        </button>
      ) : null}

      {"message" in state && state.message ? (
        <p className={`mt-4 text-sm ${state.status === "error" ? "text-red-300" : "text-emerald-300"}`}>{state.message}</p>
      ) : null}

      {account ? (
        <div className="mt-6">
          {account.ratingsFetchedAt ? (
            <p className="mb-4 text-xs text-slate-400">
              {t("chessAccount.lastUpdated", {
                date: formatDateTime(account.ratingsFetchedAt, i18n.language)
              })}
            </p>
          ) : null}
          <div className="flex items-center gap-3 border-l-2 border-emerald-400 pl-3 text-sm text-emerald-100">
            <CheckCircle2 className="shrink-0" size={18} />
            <p>{t("lichess.verified")}</p>
          </div>
          <dl className={`mt-5 grid gap-px overflow-hidden rounded-md bg-white/10 ${ratingGridColumns}`}>
            {account.ratings.length > 0 ? account.ratings.map((rating) => (
              <div key={rating.speed} className="bg-slate-900 px-4 py-4">
                <dt className="text-sm text-slate-400">
                  {speedLabels[rating.speed]}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  {rating.value}{rating.provisional ? "?" : ""}
                </dd>
                <p className="mt-1 text-xs text-slate-500">
                  {t("chessAccount.games", { count: rating.games })}
                </p>
                {account.selectedSpeed === rating.speed ? (
                  <span className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-400 px-3 text-sm font-semibold text-slate-950">
                    <CheckCircle2 size={15} />
                    {t("chessAccount.highestApplied")}
                  </span>
                ) : null}
              </div>
            )) : (
              <div className="bg-slate-900 px-4 py-4 text-sm text-slate-400 sm:col-span-2 lg:col-span-4">
                {t("chessAccount.noSupportedRatings")}
              </div>
            )}
          </dl>
        </div>
      ) : null}
    </section>
  );
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}


function formatDateTime(value: string, language: string): string {
  return new Intl.DateTimeFormat(languageLocale(language), {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
