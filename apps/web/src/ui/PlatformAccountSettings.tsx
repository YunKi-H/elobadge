import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
  startTwitchConnection,
  startTwitchStreamerAuthorization,
  type ChzzkStreamerAuthorization,
  type PlatformAccount,
  type TwitchStreamerAuthorization
} from "../api/client";
import { getFirebaseClientAuth } from "../firebase/client";

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
  streamer = false
}: {
  streamer?: boolean;
} = {}) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [disconnectingChzzk, setDisconnectingChzzk] = useState(false);
  const [connectingTwitch, setConnectingTwitch] = useState(false);
  const [disconnectingTwitch, setDisconnectingTwitch] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

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
          const result = new URLSearchParams(window.location.search)
            .get(resultKey);
          setState({
            status: "ready",
            accounts,
            chzzkAuthorization,
            twitchAuthorization
          });
          setFeedback(twitchFeedback(result, streamer));

          if (result) {
            const url = new URL(window.location.href);
            url.searchParams.delete(resultKey);
            window.history.replaceState({}, "", url);
          }
        })
        .catch((error: unknown) =>
          setState({
            status: "error",
            message: errorMessage(error)
          })
        );
    }), [streamer]);

  const disconnectChzzk = async () => {
    const hasAlternativeLogin =
      state.status === "ready" &&
      state.accounts.some((account) => account.platform === "twitch");
    const authorizationOnly = streamer && !hasAlternativeLogin;
    if (
      !window.confirm(
        authorizationOnly
          ? "치지직 채팅 수집 권한을 해제할까요? 치지직 로그인 계정 연결은 유지됩니다."
          : "치지직 계정 연결과 채팅 수집 권한을 모두 해제할까요?"
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
          ? "치지직 연결을 해제했습니다."
          : "치지직 채팅 수집 권한을 해제했습니다."
      });
      if (shouldSignOut) {
        await signOut(getFirebaseClientAuth()).catch(() => undefined);
        window.location.assign("/");
      }
    } catch (error) {
      setFeedback({
        tone: "error",
        message: errorMessage(error)
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
        message: errorMessage(error)
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
      ? "Twitch 채팅 수집 권한을 해제할까요? Twitch 로그인 계정 연결은 유지됩니다."
      : "Twitch 계정 연결과 채팅 수집 권한을 모두 해제할까요?";

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
          ? "Twitch 채팅 수집 권한을 해제했습니다."
          : "Twitch 연결을 해제했습니다."
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: errorMessage(error)
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
      <h2 className="text-sm font-medium text-slate-400">방송 플랫폼</h2>

      {state.status === "loading" ? (
        <div className="mt-3 text-sm text-slate-300">
          <LoaderCircle
            className="mr-2 inline animate-spin"
            aria-hidden="true"
            size={17}
          />
          연결 정보를 확인하고 있습니다.
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
            disconnecting={disconnectingChzzk}
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
  disconnecting,
  onDisconnect
}: {
  accounts: PlatformAccount[];
  authorization: ChzzkStreamerAuthorization | null;
  streamer: boolean;
  hasAlternativeLogin: boolean;
  disconnecting: boolean;
  onDisconnect: () => void;
}) {
  const account = accounts[0];
  const connected = Boolean(account);
  const authorized = streamer && authorization?.connected === true;
  const active = streamer ? authorized : connected;
  const canDisconnect = !streamer || hasAlternativeLogin || authorized;
  const authorizationOnly = streamer && !hasAlternativeLogin;
  const detail = account
    ? streamer && !authorized
      ? `${account.displayName} · 채팅 권한 필요`
      : account.displayName
    : "연결된 계정 없음";
  const status = active
    ? "연결됨"
    : connected && streamer
      ? "권한 필요"
      : "미연결";
  const actionTitle = active
    ? canDisconnect
      ? authorizationOnly
        ? "치지직 채팅 수집 권한 해제"
        : "치지직 연결 해제"
      : "다른 로그인 계정을 연결한 후 해제할 수 있습니다."
    : connected && streamer
      ? "치지직 채팅 수집 권한 연결"
      : "치지직 계정 연결 정보가 없습니다.";

  return (
    <PlatformConnectionToggle
      icon={<Radio aria-hidden="true" size={20} />}
      iconClassName="text-emerald-300"
      name="치지직"
      detail={detail}
      status={status}
      actionLabel={
        active
          ? authorizationOnly
            ? "권한 해제"
            : "연결 해제"
          : connected && streamer
            ? "권한 연결"
            : "연결"
      }
      tone={active ? "connected" : connected ? "attention" : "disconnected"}
      accent="chzzk"
      checked={active}
      loading={disconnecting}
      disabled={
        disconnecting ||
        (active ? !canDisconnect : !(connected && streamer))
      }
      href={
        !active && connected && streamer
          ? "/api/auth/chzzk/start?mode=streamer"
          : undefined
      }
      title={actionTitle}
      onToggle={active ? onDisconnect : undefined}
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
  const account = accounts[0];
  const authorized = streamer && authorization?.connected === true;
  const connected = Boolean(account) || authorized;
  const active = streamer ? authorized : connected;
  const displayName = authorization?.displayName ?? account?.displayName;
  const sessionDetail = authorized
    ? twitchSessionDetail(authorization)
    : null;
  const detail = displayName
    ? streamer
      ? authorized
        ? sessionDetail
          ? `${displayName} · ${sessionDetail}`
          : displayName
        : `${displayName} · 채팅 권한 필요`
      : displayName
    : "연결된 계정 없음";
  const status = authorized
    ? twitchSessionStatus(authorization).label
    : connected && streamer
      ? "권한 필요"
      : connected
        ? "연결됨"
        : "미연결";
  const canDisconnect = hasAlternativeLogin || authorized;
  const authorizationOnly = streamer && !hasAlternativeLogin;
  const actionTitle = active
    ? canDisconnect
      ? authorizationOnly
        ? "Twitch 채팅 수집 권한 해제"
        : "Twitch 연결 해제"
      : "다른 로그인 계정을 연결한 후 해제할 수 있습니다."
    : streamer
      ? "Twitch 채팅 수집 권한 연결"
      : "Twitch 계정 연결";

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
            ? "권한 해제"
            : "연결 해제"
          : streamer
            ? "권한 연결"
            : "연결"
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
  streamer: boolean
): { tone: "success" | "error"; message: string } | null {
  switch (result) {
    case "connected":
      return {
        tone: "success",
        message: streamer
          ? "Twitch 연결과 채팅 수집 권한 설정을 완료했습니다."
          : "Twitch 계정이 연결되었습니다."
      };
    case "denied":
      return { tone: "error", message: "Twitch 연결 요청을 취소했습니다." };
    case "expired":
      return {
        tone: "error",
        message: "Twitch 연결 요청이 만료되었습니다. 다시 시도해 주세요."
      };
    case "conflict":
      return {
        tone: "error",
        message: "이미 다른 EloBadge 사용자가 연결한 Twitch 계정입니다."
      };
    case "error":
      return {
        tone: "error",
        message: streamer
          ? "Twitch 연결 또는 채팅 권한 설정을 완료하지 못했습니다."
          : "Twitch 계정을 연결하지 못했습니다. 다시 시도해 주세요."
      };
    default:
      return null;
  }
}

function twitchSessionDetail(
  authorization: TwitchStreamerAuthorization
): string | null {
  const session = authorization.session;
  if (!session) {
    return "연결 중";
  }
  if (session.subscribed) {
    return null;
  }
  if (session.health === "reconnecting") {
    return "연결 중";
  }
  if (
    session.health === "subscription_failed" ||
    session.health === "connection_failed" ||
    session.health === "authorization_revoked"
  ) {
    return "재연결 필요";
  }
  return "연결 중";
}

function twitchSessionStatus(
  authorization: TwitchStreamerAuthorization
): { label: string; className: string } {
  const health = authorization.session?.health;
  if (authorization.session?.subscribed) {
    return { label: "연결됨", className: "text-emerald-300" };
  }
  if (
    health === "subscription_failed" ||
    health === "connection_failed" ||
    health === "authorization_revoked"
  ) {
    return { label: "재연결 필요", className: "text-red-300" };
  }
  return {
    label: "연결 중",
    className: "text-amber-300"
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "방송 플랫폼 연결 정보를 불러오지 못했습니다.";
}
