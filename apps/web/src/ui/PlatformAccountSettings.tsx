import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  CheckCircle2,
  LoaderCircle,
  Radio,
  Tv
} from "lucide-react";
import {
  getPlatformAccounts,
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

  useEffect(() =>
    onAuthStateChanged(getFirebaseClientAuth(), (user) => {
      if (!user) {
        setState({ status: "signed_out" });
        return;
      }

      void getPlatformAccounts()
        .then((accounts) => setState({ status: "ready", accounts }))
        .catch((error: unknown) =>
          setState({
            status: "error",
            message: errorMessage(error)
          })
        );
    }), []);

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
          />
        </div>
      ) : null}
    </section>
  );
}

function PlatformRow({
  platform,
  accounts
}: {
  platform: PlatformAccount["platform"];
  accounts: PlatformAccount[];
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

      {connected ? (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300">
          <CheckCircle2 aria-hidden="true" size={16} />
          연결됨
        </span>
      ) : platform === "twitch" ? (
        <button
          type="button"
          disabled
          className="inline-flex h-9 items-center rounded-md bg-slate-800 px-3 text-sm font-medium text-slate-400 ring-1 ring-white/10 disabled:cursor-not-allowed"
        >
          지원 준비 중
        </button>
      ) : (
        <span className="text-sm text-slate-500">연결 정보 없음</span>
      )}
    </div>
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "방송 플랫폼 연결 정보를 불러오지 못했습니다.";
}
