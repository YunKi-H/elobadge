import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  CheckCircle2,
  LoaderCircle,
  Tv,
  Unplug
} from "lucide-react";
import {
  disconnectTwitchStreamerAuthorization,
  getTwitchStreamerAuthorization,
  startTwitchStreamerAuthorization,
  type TwitchStreamerAuthorization as Authorization
} from "../api/client";
import { getFirebaseClientAuth } from "../firebase/client";

type State =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "ready"; authorization: Authorization }
  | { status: "error"; message: string };

export function TwitchStreamerAuthorization() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [working, setWorking] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(
    () =>
      onAuthStateChanged(getFirebaseClientAuth(), (user) => {
        if (!user) {
          setState({ status: "signed_out" });
          return;
        }

        void getTwitchStreamerAuthorization()
          .then((authorization) => {
            setState({ status: "ready", authorization });
            const result = new URLSearchParams(window.location.search).get(
              "twitchChat"
            );
            setFeedback(callbackFeedback(result));

            if (result) {
              const url = new URL(window.location.href);
              url.searchParams.delete("twitchChat");
              window.history.replaceState({}, "", url);
            }
          })
          .catch((error: unknown) =>
            setState({
              status: "error",
              message: errorMessage(error)
            })
          );
      }),
    []
  );

  const connect = async () => {
    setWorking(true);
    setFeedback(null);

    try {
      window.location.assign(await startTwitchStreamerAuthorization());
    } catch (error) {
      setFeedback({ tone: "error", message: errorMessage(error) });
      setWorking(false);
    }
  };

  const disconnect = async () => {
    if (!window.confirm("Twitch 채팅 권한을 해제할까요?")) {
      return;
    }

    setWorking(true);
    setFeedback(null);

    try {
      await disconnectTwitchStreamerAuthorization();
      setState({
        status: "ready",
        authorization: { connected: false }
      });
      setFeedback({
        tone: "success",
        message: "Twitch 채팅 권한을 해제했습니다."
      });
    } catch (error) {
      setFeedback({ tone: "error", message: errorMessage(error) });
    } finally {
      setWorking(false);
    }
  };

  if (state.status === "signed_out") {
    return null;
  }

  return (
    <section className="mb-8 border-y border-white/10 py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Tv className="text-violet-300" aria-hidden="true" size={20} />
          <div className="min-w-0">
            <h2 className="font-semibold text-white">Twitch 채팅</h2>
            <p className="truncate text-sm text-slate-400">
              {state.status === "ready" && state.authorization.connected
                ? state.authorization.displayName
                : "연결된 스트리머 계정 없음"}
            </p>
          </div>
        </div>

        {state.status === "loading" ? (
          <LoaderCircle
            className="animate-spin text-slate-400"
            aria-label="Twitch 채팅 권한 확인 중"
            size={18}
          />
        ) : null}

        {state.status === "ready" && state.authorization.connected ? (
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300">
              <CheckCircle2 aria-hidden="true" size={16} />
              권한 연결됨
            </span>
            <button
              type="button"
              disabled={working}
              onClick={() => void disconnect()}
              title="Twitch 채팅 권한 해제"
              className="inline-flex size-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
            >
              {working ? (
                <LoaderCircle
                  className="animate-spin"
                  aria-hidden="true"
                  size={16}
                />
              ) : (
                <Unplug aria-hidden="true" size={16} />
              )}
            </button>
          </div>
        ) : state.status === "ready" ? (
          <button
            type="button"
            disabled={working}
            onClick={() => void connect()}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-violet-500 px-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-wait disabled:opacity-60"
          >
            {working ? (
              <LoaderCircle
                className="animate-spin"
                aria-hidden="true"
                size={16}
              />
            ) : null}
            {working ? "연결 중" : "Twitch 연결"}
          </button>
        ) : null}
      </div>

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
    </section>
  );
}

function callbackFeedback(
  result: string | null
): { tone: "success" | "error"; message: string } | null {
  switch (result) {
    case "connected":
      return {
        tone: "success",
        message: "Twitch 채팅 권한이 연결되었습니다."
      };
    case "denied":
      return {
        tone: "error",
        message: "Twitch 채팅 권한 요청을 취소했습니다."
      };
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
        message: "Twitch 채팅 권한을 연결하지 못했습니다."
      };
    default:
      return null;
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Twitch 채팅 권한 요청을 처리하지 못했습니다.";
}
