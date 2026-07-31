import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
  ChevronRight,
  LoaderCircle,
  Radio,
  Tv
} from "lucide-react";
import {
  disconnectTwitchAccount,
  disconnectTwitchStreamerAuthorization,
  disconnectChzzkConnection,
  getChzzkStreamerAuthorization,
  getPlatformAccounts,
  getTwitchStreamerAuthorization,
  startChzzkConnection,
  startTwitchConnection,
  startTwitchStreamerAuthorization,
  type ChzzkStreamerAuthorization,
  type PlatformAccount,
  type TwitchStreamerAuthorization
} from "../api/client";
import { getFirebaseClientAuth } from "../firebase/client";
import type { StreamingPlatform } from "@elobadge/core";

type State =
  | { status: "loading" }
  | { status: "signed_out" }
  | {
      status: "ready";
      accounts: PlatformAccount[];
      chzzkAuthorization: ChzzkStreamerAuthorization | null;
      twitchAuthorization: TwitchStreamerAuthorization | null;
    }
  | { status: "error"; message: string };

export function PlatformAccountSettings({
  streamer = false,
  onConnectedPlatformsChange
}: {
  streamer?: boolean;
  onConnectedPlatformsChange?: (platforms: StreamingPlatform[]) => void;
} = {}) {
  const { t } = useTranslation();
  const [state, setState] = useState<State>({ status: "loading" });
  const [connectingChzzk, setConnectingChzzk] = useState(false);
  const [disconnectingChzzk, setDisconnectingChzzk] = useState(false);
  const [connectingTwitch, setConnectingTwitch] = useState(false);
  const [disconnectingTwitch, setDisconnectingTwitch] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (state.status === "ready") {
      const platforms = streamer
        ? [
            state.chzzkAuthorization?.connected ? "chzzk" : null,
            state.twitchAuthorization?.connected ? "twitch" : null
          ].filter((platform): platform is StreamingPlatform => platform !== null)
        : state.accounts.map((account) => account.platform);
      onConnectedPlatformsChange?.([...new Set(platforms)]);
    } else if (state.status === "signed_out") {
      onConnectedPlatformsChange?.([]);
    }
  }, [onConnectedPlatformsChange, state, streamer]);

  useEffect(() =>
    onAuthStateChanged(getFirebaseClientAuth(), (user) => {
      if (!user) {
        setState({ status: "signed_out" });
        return;
      }

      void Promise.all([
        getPlatformAccounts(),
        streamer
          ? getChzzkStreamerAuthorization()
          : Promise.resolve(null),
        streamer
          ? getTwitchStreamerAuthorization()
          : Promise.resolve(null)
      ])
        .then(([accounts, chzzkAuthorization, twitchAuthorization]) => {
          const resultKey = streamer ? "twitchChat" : "twitch";
          const searchParams = new URLSearchParams(window.location.search);
          const result = searchParams.get(resultKey);
          const chzzkResult = searchParams.get("chzzk");
          setState({
            status: "ready",
            accounts,
            chzzkAuthorization,
            twitchAuthorization
          });
          setFeedback(
            chzzkFeedback(chzzkResult, streamer, t) ??
              twitchFeedback(result, streamer, t)
          );

          if (result || chzzkResult) {
            const url = new URL(window.location.href);
            url.searchParams.delete(resultKey);
            url.searchParams.delete("chzzk");
            window.history.replaceState({}, "", url);
          }
        })
        .catch((error: unknown) =>
          setState({
            status: "error",
            message: errorMessage(error, t)
          })
        );
    }), [streamer, t]);

  const disconnectChzzk = async () => {
    const hasAlternativeLogin =
      state.status === "ready" &&
      state.accounts.some((account) => account.platform === "twitch");
    const authorizationOnly = streamer && !hasAlternativeLogin;
    if (
      !window.confirm(
        authorizationOnly
          ? t("platforms.chzzk.disconnectPermissionConfirm")
          : t("platforms.chzzk.disconnectAccountConfirm")
      )
    ) {
      return;
    }

    setDisconnectingChzzk(true);
    setFeedback(null);

    try {
      const result = await disconnectChzzkConnection(!authorizationOnly);
      const shouldSignOut =
        result.disconnected > 0 && !hasAlternativeLogin;
      setState((current) => {
        if (current.status !== "ready") {
          return current;
        }
        return {
          ...current,
          accounts: result.disconnected > 0
            ? current.accounts.filter(
                (account) => account.platform !== "chzzk"
              )
            : current.accounts,
          chzzkAuthorization: streamer
            ? {
                connected: false,
                tokenStatus: "reauth_required"
              }
            : null
        };
      });
      setFeedback({
        tone: "success",
        message: result.disconnected > 0
          ? t("platforms.chzzk.accountDisconnected")
          : t("platforms.chzzk.permissionDisconnected")
      });
      if (shouldSignOut) {
        await signOut(getFirebaseClientAuth()).catch(() => undefined);
        window.location.assign("/");
      }
    } catch (error) {
      setFeedback({
        tone: "error",
        message: errorMessage(error, t)
      });
    } finally {
      setDisconnectingChzzk(false);
    }
  };

  useEffect(() => {
    if (
      !streamer ||
      state.status !== "ready" ||
      !state.twitchAuthorization?.connected ||
      state.twitchAuthorization.session?.subscribed
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      void getTwitchStreamerAuthorization()
        .then((authorization) =>
          setState((current) =>
            current.status === "ready"
              ? {
                  ...current,
                  twitchAuthorization: authorization
                }
              : current
          )
        )
        .catch(() => undefined);
    }, 3_000);

    return () => window.clearInterval(timer);
  }, [state, streamer]);

  const connectChzzk = async () => {
    setConnectingChzzk(true);
    setFeedback(null);

    try {
      window.location.assign(await startChzzkConnection(streamer));
    } catch (error) {
      setFeedback({
        tone: "error",
        message: errorMessage(error, t)
      });
      setConnectingChzzk(false);
    }
  };

  const connectTwitch = async () => {
    setConnectingTwitch(true);
    setFeedback(null);

    try {
      window.location.assign(
        await (streamer
          ? startTwitchStreamerAuthorization()
          : startTwitchConnection())
      );
    } catch (error) {
      setFeedback({
        tone: "error",
        message: errorMessage(error, t)
      });
      setConnectingTwitch(false);
    }
  };

  const disconnectTwitch = async () => {
    const keepLoginIdentity =
      state.status === "ready" &&
      !state.accounts.some((account) => account.platform === "chzzk");
    const authorizationOnly = streamer && keepLoginIdentity;
    const confirmation = authorizationOnly
      ? t("platforms.twitch.disconnectPermissionConfirm")
      : t("platforms.twitch.disconnectAccountConfirm");

    if (!window.confirm(confirmation)) {
      return;
    }

    setDisconnectingTwitch(true);
    setFeedback(null);

    try {
      if (authorizationOnly) {
        await disconnectTwitchStreamerAuthorization();
      } else {
        await disconnectTwitchAccount();
      }
      setState((current) => {
        if (current.status !== "ready") {
          return current;
        }
        const accounts = authorizationOnly
          ? current.accounts
          : current.accounts.filter(
              (account) => account.platform !== "twitch"
            );
        return {
          status: "ready",
          accounts,
          chzzkAuthorization: current.chzzkAuthorization,
          twitchAuthorization: streamer
            ? { connected: false }
            : null
        };
      });
      setFeedback({
        tone: "success",
        message: authorizationOnly
          ? t("platforms.twitch.permissionDisconnected")
          : t("platforms.twitch.accountDisconnected")
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: errorMessage(error, t)
      });
    } finally {
      setDisconnectingTwitch(false);
    }
  };

  if (state.status === "signed_out") {
    return null;
  }

  return (
    <section className="max-w-2xl border-t border-white/10 py-8">
      <h2 className="text-sm font-medium text-slate-400">
        {t("platforms.title")}
      </h2>

      {state.status === "loading" ? (
        <div className="mt-3 text-sm text-slate-300">
          <LoaderCircle
            className="mr-2 inline animate-spin"
            aria-hidden="true"
            size={17}
          />
          {t("platforms.loading")}
        </div>
      ) : null}

      {state.status === "error" ? (
        <p className="mt-3 text-sm text-red-300">{state.message}</p>
      ) : null}

      {feedback ? (
        <p
          className={`mt-3 text-sm ${
            feedback.tone === "success"
              ? "text-emerald-300"
              : "text-red-300"
          }`}
        >
          {feedback.message}
        </p>
      ) : null}

      {state.status === "ready" ? (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ChzzkPlatformToggle
            accounts={state.accounts.filter(
              (account) => account.platform === "chzzk"
            )}
            authorization={state.chzzkAuthorization}
            streamer={streamer}
            hasAlternativeLogin={state.accounts.some(
              (account) => account.platform === "twitch"
            )}
            connecting={connectingChzzk}
            disconnecting={disconnectingChzzk}
            onConnect={() => void connectChzzk()}
            onDisconnect={() => void disconnectChzzk()}
          />
          <TwitchPlatformToggle
            accounts={state.accounts.filter(
              (account) => account.platform === "twitch"
            )}
            authorization={state.twitchAuthorization}
            streamer={streamer}
            hasAlternativeLogin={state.accounts.some(
              (account) => account.platform === "chzzk"
            )}
            connecting={connectingTwitch}
            disconnecting={disconnectingTwitch}
            onConnect={() => void connectTwitch()}
            onDisconnect={() => void disconnectTwitch()}
          />
        </div>
      ) : null}
    </section>
  );
}

function ChzzkPlatformToggle({
  accounts,
  authorization,
  streamer,
  hasAlternativeLogin,
  connecting,
  disconnecting,
  onConnect,
  onDisconnect
}: {
  accounts: PlatformAccount[];
  authorization: ChzzkStreamerAuthorization | null;
  streamer: boolean;
  hasAlternativeLogin: boolean;
  connecting: boolean;
  disconnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const { t } = useTranslation();
  const account = accounts[0];
  const connected = Boolean(account);
  const authorized = streamer && authorization?.connected === true;
  const active = streamer ? authorized : connected;
  const canDisconnect = !streamer || hasAlternativeLogin || authorized;
  const authorizationOnly = streamer && !hasAlternativeLogin;
  const detail = account
    ? streamer && !authorized
      ? `${account.displayName} · ${t("platforms.permissionRequired")}`
      : account.displayName
    : t("platforms.noAccount");
  const status = active
    ? t("common.connected")
    : connected && streamer
      ? t("platforms.permissionStatus")
      : t("common.notConnected");
  const actionTitle = active
    ? canDisconnect
      ? authorizationOnly
        ? t("platforms.chzzk.disconnectPermission")
        : t("platforms.chzzk.disconnectAccount")
      : t("platforms.alternativeRequired")
    : connected && streamer
      ? t("platforms.chzzk.connectPermission")
      : t("platforms.chzzk.connectAccount");

  return (
    <PlatformConnectionToggle
      icon={<Radio aria-hidden="true" size={20} />}
      iconClassName="text-emerald-300"
      name={t("platforms.chzzk.name")}
      detail={detail}
      status={status}
      actionLabel={
        active
          ? authorizationOnly
            ? t("platforms.revokePermission")
            : t("common.disconnect")
          : connected && streamer
            ? t("platforms.grantPermission")
            : t("common.connect")
      }
      tone={active ? "connected" : connected ? "attention" : "disconnected"}
      accent="chzzk"
      checked={active}
      loading={connecting || disconnecting}
      disabled={
        connecting ||
        disconnecting ||
        (active && !canDisconnect)
      }
      title={actionTitle}
      onToggle={active ? onDisconnect : onConnect}
    />
  );
}

function TwitchPlatformToggle({
  accounts,
  authorization,
  streamer,
  hasAlternativeLogin,
  connecting,
  disconnecting,
  onConnect,
  onDisconnect
}: {
  accounts: PlatformAccount[];
  authorization: TwitchStreamerAuthorization | null;
  streamer: boolean;
  hasAlternativeLogin: boolean;
  connecting: boolean;
  disconnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const { t } = useTranslation();
  const account = accounts[0];
  const authorized = streamer && authorization?.connected === true;
  const connected = Boolean(account) || authorized;
  const active = streamer ? authorized : connected;
  const displayName = authorization?.displayName ?? account?.displayName;
  const sessionDetail = authorized
    ? twitchSessionDetail(authorization, t)
    : null;
  const detail = displayName
    ? streamer
      ? authorized
        ? sessionDetail
          ? `${displayName} · ${sessionDetail}`
          : displayName
        : `${displayName} · ${t("platforms.permissionRequired")}`
      : displayName
    : t("platforms.noAccount");
  const status = authorized
    ? twitchSessionStatus(authorization, t).label
    : connected && streamer
      ? t("platforms.permissionStatus")
      : connected
        ? t("common.connected")
        : t("common.notConnected");
  const canDisconnect = hasAlternativeLogin || authorized;
  const authorizationOnly = streamer && !hasAlternativeLogin;
  const actionTitle = active
    ? canDisconnect
      ? authorizationOnly
        ? t("platforms.twitch.disconnectPermission")
        : t("platforms.twitch.disconnectAccount")
      : t("platforms.alternativeRequired")
    : streamer
      ? t("platforms.twitch.connectPermission")
      : t("platforms.twitch.connectAccount");

  return (
    <PlatformConnectionToggle
      icon={<Tv aria-hidden="true" size={20} />}
      iconClassName="text-violet-300"
      name="Twitch"
      detail={detail}
      status={status}
      actionLabel={
        active
          ? authorizationOnly
            ? t("platforms.revokePermission")
            : t("common.disconnect")
          : streamer
            ? t("platforms.grantPermission")
            : t("common.connect")
      }
      tone={active ? "connected" : connected ? "attention" : "disconnected"}
      accent="twitch"
      checked={active}
      loading={connecting || disconnecting}
      disabled={
        connecting ||
        disconnecting ||
        (active && !canDisconnect)
      }
      title={actionTitle}
      onToggle={active ? onDisconnect : onConnect}
    />
  );
}

function PlatformConnectionToggle({
  icon,
  iconClassName,
  name,
  detail,
  status,
  actionLabel,
  tone,
  accent,
  checked,
  loading,
  disabled,
  href,
  title,
  onToggle
}: {
  icon: React.ReactNode;
  iconClassName: string;
  name: string;
  detail: string;
  status: string;
  actionLabel: string;
  tone: "connected" | "attention" | "disconnected";
  accent: "chzzk" | "twitch";
  checked: boolean;
  loading: boolean;
  disabled: boolean;
  href?: string;
  title: string;
  onToggle?: () => void;
}) {
  const controlClassName = `group flex min-h-14 min-w-0 items-center justify-between gap-3 rounded-md border px-3 py-2 text-left transition ${
    checked
      ? accent === "chzzk"
        ? "border-emerald-300/45 bg-emerald-400/15 hover:border-emerald-200/70 hover:bg-emerald-400/20"
        : "border-violet-300/45 bg-violet-400/15 hover:border-violet-200/70 hover:bg-violet-400/20"
      : tone === "attention"
        ? "border-amber-300/40 bg-amber-400/10 hover:border-amber-200/65 hover:bg-amber-400/15"
        : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
  } ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"}`;
  const statusClassName =
    tone === "connected"
      ? "text-emerald-300"
      : tone === "attention"
        ? "text-amber-300"
        : "text-slate-500";

  const content = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <span className={`shrink-0 ${iconClassName}`}>{icon}</span>
        <span className="min-w-0">
          <span className="block font-medium text-white">{name}</span>
          <span className="block truncate text-xs text-slate-400">
            {detail}
          </span>
        </span>
      </span>

      <span
        className={`flex shrink-0 items-center gap-1 text-sm font-medium ${statusClassName}`}
      >
        {loading ? (
          <LoaderCircle
            className="animate-spin"
            aria-hidden="true"
            size={16}
          />
        ) : (
          <>
            <span
              className={
                checked && !disabled
                  ? "group-hover:hidden"
                  : undefined
              }
            >
              {checked || disabled ? status : actionLabel}
            </span>
            {checked && !disabled ? (
              <span className="hidden text-red-200 group-hover:inline">
                {actionLabel}
              </span>
            ) : null}
            {!checked && !disabled ? (
              <ChevronRight aria-hidden="true" size={17} />
            ) : null}
          </>
        )}
      </span>
    </>
  );

  return (
    <>
      {href && !disabled ? (
        <a
          href={href}
          aria-label={`${name} ${title}`}
          title={title}
          className={controlClassName}
        >
          {content}
        </a>
      ) : (
        <button
          type="button"
          aria-pressed={checked}
          aria-label={`${name} ${title}`}
          disabled={disabled}
          onClick={onToggle}
          title={title}
          className={controlClassName}
        >
          {content}
        </button>
      )}
    </>
  );
}

function twitchFeedback(
  result: string | null,
  streamer: boolean,
  t: TFunction
): { tone: "success" | "error"; message: string } | null {
  switch (result) {
    case "connected":
      return {
        tone: "success",
        message: streamer
          ? t("platforms.twitch.streamerConnected")
          : t("platforms.twitch.connected")
      };
    case "denied":
      return { tone: "error", message: t("platforms.twitch.denied") };
    case "expired":
      return {
        tone: "error",
        message: t("platforms.twitch.expired")
      };
    case "conflict":
      return {
        tone: "error",
        message: t("platforms.twitch.conflict")
      };
    case "error":
      return {
        tone: "error",
        message: streamer
          ? t("platforms.twitch.streamerFailed")
          : t("platforms.twitch.failed")
      };
    default:
      return null;
  }
}

function chzzkFeedback(
  result: string | null,
  streamer: boolean,
  t: TFunction
): { tone: "success" | "error"; message: string } | null {
  switch (result) {
    case "connected":
      return {
        tone: "success",
        message: streamer
          ? t("platforms.chzzk.streamerConnected")
          : t("platforms.chzzk.connected")
      };
    case "conflict":
      return {
        tone: "error",
        message: t("platforms.chzzk.conflict")
      };
    case "error":
      return {
        tone: "error",
        message: streamer
          ? t("platforms.chzzk.streamerFailed")
          : t("platforms.chzzk.failed")
      };
    default:
      return null;
  }
}

function twitchSessionDetail(
  authorization: TwitchStreamerAuthorization,
  t: TFunction
): string | null {
  const session = authorization.session;
  if (!session) {
    return t("platforms.connecting");
  }
  if (session.subscribed) {
    return null;
  }
  if (session.health === "reconnecting") {
    return t("platforms.connecting");
  }
  if (
    session.health === "subscription_failed" ||
    session.health === "connection_failed" ||
    session.health === "authorization_revoked"
  ) {
    return t("platforms.reconnectRequired");
  }
  return t("platforms.connecting");
}

function twitchSessionStatus(
  authorization: TwitchStreamerAuthorization,
  t: TFunction
): { label: string; className: string } {
  const health = authorization.session?.health;
  if (authorization.session?.subscribed) {
    return { label: t("common.connected"), className: "text-emerald-300" };
  }
  if (
    health === "subscription_failed" ||
    health === "connection_failed" ||
    health === "authorization_revoked"
  ) {
    return {
      label: t("platforms.reconnectRequired"),
      className: "text-red-300"
    };
  }
  return {
    label: t("platforms.connecting"),
    className: "text-amber-300"
  };
}

function errorMessage(error: unknown, t: TFunction): string {
  return error instanceof Error
    ? error.message
    : t("platforms.loadFailed");
}
