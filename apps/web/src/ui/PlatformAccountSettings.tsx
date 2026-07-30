import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  CheckCircle2,
  LoaderCircle,
  Radio,
  Tv,
  Unlink
} from "lucide-react";
import {
  disconnectTwitchAccount,
  getPlatformAccounts,
  startTwitchConnection,
  type PlatformAccount
} from "../api/client";
import { getFirebaseClientAuth } from "../firebase/client";

type State =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "ready"; accounts: PlatformAccount[] }
  | { status: "error"; message: string };

const platformPresentation = {
  chzzk: {
    label: "치지직",
    icon: Radio,
    iconClassName: "text-emerald-300"
  },
  twitch: {
    label: "Twitch",
    icon: Tv,
    iconClassName: "text-violet-300"
  }
} as const;

export function PlatformAccountSettings() {
  const [state, setState] = useState<State>({ status: "loading" });
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

      void getPlatformAccounts()
        .then((accounts) => {
          const result = new URLSearchParams(window.location.search)
            .get("twitch");
          setState({ status: "ready", accounts });
          setFeedback(twitchFeedback(result));

          if (result) {
            const url = new URL(window.location.href);
            url.searchParams.delete("twitch");
            window.history.replaceState({}, "", url);
          }
        })
        .catch((error: unknown) =>
          setState({
            status: "error",
            message: errorMessage(error)
          })
        );
    }), []);

  const connectTwitch = async () => {
    setConnectingTwitch(true);
    setFeedback(null);

    try {
      window.location.assign(await startTwitchConnection());
    } catch (error) {
      setFeedback({
        tone: "error",
        message: errorMessage(error)
      });
      setConnectingTwitch(false);
    }
  };

  const disconnectTwitch = async () => {
    if (!window.confirm("Twitch 계정 연결을 해제할까요?")) {
      return;
    }

    setDisconnectingTwitch(true);
    setFeedback(null);

    try {
      await disconnectTwitchAccount();
      setState((current) =>
        current.status === "ready"
          ? {
              status: "ready",
              accounts: current.accounts.filter(
                (account) => account.platform !== "twitch"
              )
            }
          : current
      );
      setFeedback({
        tone: "success",
        message: "Twitch 계정 연결을 해제했습니다."
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
          채팅에서 시청자를 식별할 방송 계정을 관리합니다.
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
          <PlatformRow
            platform="chzzk"
            accounts={state.accounts.filter(
              (account) => account.platform === "chzzk"
            )}
          />
          <PlatformRow
            platform="twitch"
            accounts={state.accounts.filter(
              (account) => account.platform === "twitch"
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

function PlatformRow({
  platform,
  accounts,
  connecting = false,
  disconnecting = false,
  onConnect,
  onDisconnect
}: {
  platform: PlatformAccount["platform"];
  accounts: PlatformAccount[];
  connecting?: boolean;
  disconnecting?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}) {
  const presentation = platformPresentation[platform];
  const Icon = presentation.icon;
  const connected = accounts.length > 0;

  return (
    <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Icon
          className={presentation.iconClassName}
          aria-hidden="true"
          size={20}
        />
        <div className="min-w-0">
          <p className="font-medium text-white">{presentation.label}</p>
          <p className="truncate text-sm text-slate-400">
            {connected
              ? accounts.map((account) => account.displayName).join(", ")
              : "연결된 계정 없음"}
          </p>
        </div>
      </div>

      {connected && platform === "twitch" ? (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300">
            <CheckCircle2 aria-hidden="true" size={16} />
            연결됨
          </span>
          <button
            type="button"
            disabled={disconnecting}
            onClick={onDisconnect}
            title="Twitch 연결 해제"
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
        </div>
      ) : connected ? (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300">
          <CheckCircle2 aria-hidden="true" size={16} />
          연결됨
        </span>
      ) : platform === "twitch" ? (
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
      ) : (
        <span className="text-sm text-slate-500">연결 정보 없음</span>
      )}
    </div>
  );
}

function twitchFeedback(
  result: string | null
): { tone: "success" | "error"; message: string } | null {
  switch (result) {
    case "connected":
      return { tone: "success", message: "Twitch 계정이 연결되었습니다." };
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
        message: "Twitch 계정을 연결하지 못했습니다. 다시 시도해 주세요."
      };
    default:
      return null;
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "방송 플랫폼 연결 정보를 불러오지 못했습니다.";
}
