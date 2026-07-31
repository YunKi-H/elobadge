import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  CheckCircle2,
  LoaderCircle,
  Radio,
  Tv,
  Unlink
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
    <section className="border-t border-white/10 py-8">
      <div>
        <h2 className="text-xl font-semibold text-white">
          연결된 방송 플랫폼
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          EloBadge에 연결된 방송 플랫폼 계정을 관리합니다.
        </p>
      </div>

      {state.status === "loading" ? (
        <div className="mt-5 text-sm text-slate-300">
          <LoaderCircle
            className="mr-2 inline animate-spin"
            aria-hidden="true"
            size={17}
          />
          연결 정보를 확인하고 있습니다.
        </div>
      ) : null}

      {state.status === "error" ? (
        <p className="mt-5 text-sm text-red-300">{state.message}</p>
      ) : null}

      {feedback ? (
        <p
          className={`mt-5 text-sm ${
            feedback.tone === "success"
              ? "text-emerald-300"
              : "text-red-300"
          }`}
        >
          {feedback.message}
        </p>
      ) : null}

      {state.status === "ready" ? (
        <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
          <ChzzkPlatformRow
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
          <TwitchPlatformRow
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

function ChzzkPlatformRow({
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
  const canDisconnect = !streamer || hasAlternativeLogin || authorized;
  const authorizationOnly = streamer && !hasAlternativeLogin;
  const detail = account
    ? streamer && !authorized
      ? `${account.displayName} · 채팅 권한 필요`
      : account.displayName
    : "연결된 계정 없음";

  return (
    <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Radio className="text-emerald-300" aria-hidden="true" size={20} />
        <div className="min-w-0">
          <p className="font-medium text-white">치지직</p>
          <p className="truncate text-sm text-slate-400">{detail}</p>
        </div>
      </div>

      {connected ? (
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${
              !streamer || authorized
                ? "text-emerald-300"
                : "text-amber-300"
            }`}
          >
            <CheckCircle2 aria-hidden="true" size={16} />
            {!streamer || authorized ? "연결됨" : "권한 필요"}
          </span>
          {streamer && !authorized ? (
            <a
              href="/api/auth/chzzk/start?mode=streamer"
              className="inline-flex h-9 items-center rounded-md bg-emerald-500 px-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              채팅 권한 연결
            </a>
          ) : null}
          {canDisconnect ? (
            <button
              type="button"
              disabled={disconnecting}
              onClick={onDisconnect}
              title={
                authorizationOnly
                  ? "치지직 채팅 수집 권한 해제"
                  : "치지직 연결 해제"
              }
              className="inline-flex size-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
            >
              {disconnecting ? (
                <LoaderCircle
                  className="animate-spin"
                  aria-hidden="true"
                  size={16}
                />
              ) : (
                <Unlink aria-hidden="true" size={16} />
              )}
            </button>
          ) : null}
        </div>
      ) : (
        <span className="text-sm text-slate-500">연결 정보 없음</span>
      )}
    </div>
  );
}

function TwitchPlatformRow({
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
    ? twitchSessionStatus(authorization)
    : connected
      ? streamer
        ? { label: "권한 필요", className: "text-amber-300" }
        : { label: "연결됨", className: "text-emerald-300" }
      : null;
  const canDisconnect = hasAlternativeLogin || authorized;
  const authorizationOnly = streamer && !hasAlternativeLogin;

  return (
    <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Tv className="text-violet-300" aria-hidden="true" size={20} />
        <div className="min-w-0">
          <p className="font-medium text-white">Twitch</p>
          <p className="truncate text-sm text-slate-400">{detail}</p>
        </div>
      </div>

      {connected ? (
        <div className="flex items-center gap-3">
          {status ? (
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${status.className}`}
            >
              <CheckCircle2 aria-hidden="true" size={16} />
              {status.label}
            </span>
          ) : null}
          {!authorized && streamer ? (
            <button
              type="button"
              disabled={connecting}
              onClick={onConnect}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-violet-500 px-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-wait disabled:opacity-60"
            >
              {connecting ? (
                <LoaderCircle
                  className="animate-spin"
                  aria-hidden="true"
                  size={16}
                />
              ) : null}
              {connecting ? "연결 중" : "채팅 권한 연결"}
            </button>
          ) : null}
          {canDisconnect ? (
            <button
              type="button"
              disabled={disconnecting}
              onClick={onDisconnect}
              title={
                authorizationOnly
                  ? "Twitch 채팅 수집 권한 해제"
                  : "Twitch 연결 해제"
              }
              className="inline-flex size-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
            >
              {disconnecting ? (
                <LoaderCircle
                  className="animate-spin"
                  aria-hidden="true"
                  size={16}
                />
              ) : (
                <Unlink aria-hidden="true" size={16} />
              )}
            </button>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          disabled={connecting}
          onClick={onConnect}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-800 px-3 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-slate-700 disabled:cursor-wait disabled:opacity-60"
        >
          {connecting ? (
            <LoaderCircle
              className="animate-spin"
              aria-hidden="true"
              size={16}
            />
          ) : null}
          {connecting ? "연결 중" : "Twitch 연결"}
        </button>
      )}
    </div>
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
