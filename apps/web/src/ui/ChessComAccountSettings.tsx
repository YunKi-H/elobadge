import { useEffect, useState, type FormEvent } from "react";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Link,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
  Unlink
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";
import {
  confirmChessComVerification,
  createChessComVerification,
  disconnectChessComAccount,
  getChessComAccount,
  linkChessComAccount,
  refreshChessComAccount,
  type ChessComAccount,
  type ChessComVerificationChallenge
} from "../api/client";
import { getFirebaseClientAuth } from "../firebase/client";
import { languageLocale } from "../i18n";
import {
  ChessBadgePreferenceControl
} from "./ChessBadgePreferenceSettings";
import type { ChessBadgePreferenceController } from "./useChessBadgePreference";

type ViewState =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "ready"; account: ChessComAccount | null }
  | { status: "error"; message: string; account: ChessComAccount | null };

const speedLabels: Record<ChessComAccount["ratings"][number]["speed"], string> = {
  bullet: "Bullet",
  blitz: "Blitz",
  rapid: "Rapid"
};

export function ChessComAccountSettings({
  badgePreference
}: {
  badgePreference: ChessBadgePreferenceController;
}) {
  const { i18n, t } = useTranslation();
  const [state, setState] = useState<ViewState>({ status: "loading" });
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verification, setVerification] = useState<ChessComVerificationChallenge | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => {
    return onAuthStateChanged(getFirebaseClientAuth(), (user) => {
      if (!user) {
        setState({ status: "signed_out" });
        return;
      }

      void getChessComAccount()
        .then((account) => {
          setState({ status: "ready", account });
          if (account) {
            setUsername(account.username);
          }
        })
        .catch((error: unknown) => {
          setState({
            status: "error",
            message: errorMessage(error, t("chessAccount.requestFailed")),
            account: null
          });
        });
    });
  }, [t]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const account = await linkChessComAccount(username);
      setState({ status: "ready", account });
      setVerification(null);
      setUsername(account.username);
      void badgePreference.refresh();
    } catch (error) {
      setState({
        status: "error",
        message: errorMessage(error, t("chessAccount.requestFailed")),
        account: state.status === "ready" || state.status === "error"
          ? state.account
          : null
      });
    } finally {
      setSubmitting(false);
    }
  };

  const createVerification = async () => {
    setVerifying(true);

    try {
      const challenge = await createChessComVerification();
      setVerification(challenge);
      setCopied(false);
      setState((current) =>
        current.status === "error"
          ? { status: "ready", account: current.account }
          : current
      );
    } catch (error) {
      setVerificationError(error);
    } finally {
      setVerifying(false);
    }
  };

  const confirmVerification = async () => {
    setVerifying(true);

    try {
      const verifiedAccount = await confirmChessComVerification();
      setState({ status: "ready", account: verifiedAccount });
      setVerification(null);
      void badgePreference.refresh();
    } catch (error) {
      setVerificationError(error);
    } finally {
      setVerifying(false);
    }
  };

  const copyCode = async () => {
    if (!verification) {
      return;
    }

    await navigator.clipboard.writeText(verification.code);
    setCopied(true);
  };

  const disconnectAccount = async () => {
    if (!window.confirm(t("chesscom.disconnectConfirm"))) {
      return;
    }

    setDisconnecting(true);

    try {
      await disconnectChessComAccount();
      setState({ status: "ready", account: null });
      setUsername("");
      setVerification(null);
      setCopied(false);
      void badgePreference.refresh();
    } catch (error) {
      setVerificationError(error);
    } finally {
      setDisconnecting(false);
    }
  };

  const refreshAccount = async () => {
    setRefreshing(true);

    try {
      const refreshedAccount = await refreshChessComAccount();
      setState({ status: "ready", account: refreshedAccount });
      setClock(
        refreshedAccount.ratingsFetchedAt
          ? Date.parse(refreshedAccount.ratingsFetchedAt)
          : clock
      );
      void badgePreference.refresh();
    } catch (error) {
      setVerificationError(error);
    } finally {
      setRefreshing(false);
    }
  };

  const setVerificationError = (error: unknown) => {
    setState((current) => ({
      status: "error",
      message: errorMessage(error, t("chessAccount.requestFailed")),
      account: current.status === "ready" || current.status === "error"
        ? current.account
        : null
    }));
  };

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
  const refreshAvailableAt = account?.manualRefreshAvailableAt
    ? Date.parse(account.manualRefreshAvailableAt)
    : 0;
  const refreshCooldownMs = Math.max(0, refreshAvailableAt - clock);
  const refreshOnCooldown = refreshCooldownMs > 0;

  return (
    <section className="border-y border-white/10 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold text-white">
              {t("chesscom.title")}
            </h2>
            <ChessBadgePreferenceControl
              provider="chesscom"
              preference={badgePreference}
            />
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {t("chesscom.description")}
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
            {account.verified ? (
              <button
                type="button"
                disabled={refreshing || disconnecting || refreshOnCooldown}
                onClick={() => void refreshAccount()}
                title={t("chesscom.refreshTitle")}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-slate-800 px-3 text-sm font-medium text-slate-100 ring-1 ring-white/10 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={refreshing ? "animate-spin" : undefined}
                  size={15}
                />
                {refreshing
                  ? t("common.refreshing")
                  : refreshOnCooldown
                    ? t("chessAccount.refreshInMinutes", {
                        count: Math.ceil(refreshCooldownMs / 60_000)
                      })
                    : t("common.refresh")}
              </button>
            ) : null}
            <button
              type="button"
              disabled={disconnecting}
              onClick={() => void disconnectAccount()}
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
        <form
          className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            void submit(event);
          }}
        >
          <label className="min-w-0 flex-1">
            <span className="sr-only">{t("chesscom.username")}</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              minLength={3}
              maxLength={25}
              pattern="[A-Za-z0-9_-]+"
              autoComplete="off"
              placeholder={t("chesscom.username")}
              className="h-10 w-full rounded-md border border-white/15 bg-slate-950 px-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <LoaderCircle className="animate-spin" size={18} /> : <Link size={18} />}
            {t("chesscom.lookup")}
          </button>
        </form>
      ) : null}

      {state.status === "error" ? (
        <p className="mt-3 text-sm text-red-300">{state.message}</p>
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
          {account.verified ? (
            <div className="flex items-center gap-3 border-l-2 border-emerald-400 pl-3 text-sm text-emerald-100">
              <CheckCircle2 className="shrink-0" size={18} />
              <p>{t("chesscom.verified")}</p>
            </div>
          ) : (
            <div className="border-l-2 border-amber-400 pl-3">
              <div className="flex items-start gap-3 text-sm text-amber-100">
                <ShieldAlert className="mt-0.5 shrink-0" size={18} />
                <p>
                  {t("chesscom.unverifiedNotice")}
                </p>
              </div>

              {!verification ? (
                <button
                  type="button"
                  disabled={verifying}
                  onClick={() => void createVerification()}
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-amber-300 px-4 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {verifying ? <LoaderCircle className="animate-spin" size={18} /> : <ShieldAlert size={18} />}
                  {t("chesscom.createCode")}
                </button>
              ) : (
                <div className="mt-4 max-w-xl">
                  <p className="text-sm text-slate-300">
                    {t("chesscom.locationInstruction")}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="min-w-0 flex-1 overflow-x-auto rounded-md bg-slate-950 px-3 py-2 text-sm text-white ring-1 ring-white/15">
                      {verification.code}
                    </code>
                    <button
                      type="button"
                      onClick={() => void copyCode()}
                      title={t("chesscom.copyCode")}
                      aria-label={t("chesscom.copyCode")}
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-800 text-slate-100 ring-1 ring-white/10 transition hover:bg-slate-700"
                    >
                      {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://www.chess.com/settings/profile"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-800 px-4 font-semibold text-slate-100 ring-1 ring-white/10 transition hover:bg-slate-700"
                    >
                      {t("chesscom.openProfileSettings")}
                      <ExternalLink size={16} />
                    </a>
                    <button
                      type="button"
                      disabled={verifying}
                      onClick={() => void confirmVerification()}
                      className="inline-flex h-10 items-center gap-2 rounded-md bg-amber-300 px-4 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {verifying ? <LoaderCircle className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                      {t("chesscom.confirmVerification")}
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    {t("chesscom.expiryNotice")}
                  </p>
                </div>
              )}
            </div>
          )}
          <dl className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-md bg-white/10 sm:grid-cols-3">
            {account.ratings.length > 0 ? account.ratings.map((rating) => (
              <div key={rating.speed} className="bg-slate-900 px-4 py-4">
                <dt className="text-sm text-slate-400">{speedLabels[rating.speed]}</dt>
                <dd className="mt-1 text-2xl font-semibold text-white">{rating.value}</dd>
                {account.verified && account.selectedSpeed === rating.speed ? (
                  <span className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-400 px-3 text-sm font-semibold text-slate-950">
                    <CheckCircle2 size={15} />
                    {t("chessAccount.highestApplied")}
                  </span>
                ) : null}
              </div>
            )) : (
              <div className="bg-slate-900 px-4 py-4 text-sm text-slate-400 sm:col-span-3">
                {t("chessAccount.noSupportedRatings")}
              </div>
            )}
          </dl>
        </div>
      ) : null}
    </section>
  );
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}


function formatDateTime(value: string, language: string): string {
  return new Intl.DateTimeFormat(languageLocale(language), {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
