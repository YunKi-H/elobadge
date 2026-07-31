import type { LoginMode } from "@elobadge/core";
import { onAuthStateChanged } from "firebase/auth";
import { Radio, Tv, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { getFirebaseClientAuth } from "../firebase/client";

interface LoginOptionsProps {
  mode: LoginMode;
}

export function LoginOptions({ mode }: LoginOptionsProps) {
  const [signedOut, setSignedOut] = useState<boolean | null>(null);
  const role = mode === "streamer" ? "스트리머" : "시청자";
  const Icon = mode === "streamer" ? Radio : UserRound;

  useEffect(
    () =>
      onAuthStateChanged(getFirebaseClientAuth(), (user) => {
        setSignedOut(!user);
      }),
    []
  );

  if (signedOut !== true) {
    return null;
  }

  return (
    <section className="mb-8 max-w-2xl border-y border-white/10 py-6">
      <div className="flex items-start gap-3">
        <Icon
          className="mt-0.5 shrink-0 text-slate-400"
          aria-hidden="true"
          size={19}
        />
        <div>
          <h2 className="font-semibold text-white">{role} 로그인</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            처음 이용하는 경우에도 방송 플랫폼 계정 하나를 선택해 EloBadge
            계정을 만들 수 있습니다.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`/api/auth/chzzk/start?mode=${mode}`}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-500 px-4 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          <Radio aria-hidden="true" size={17} />
          치지직으로 로그인
        </a>
        <a
          href={`/api/auth/twitch/login/start?mode=${mode}`}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#9146ff] px-4 font-semibold text-white transition hover:bg-[#7f35e8]"
        >
          <Tv aria-hidden="true" size={17} />
          Twitch로 로그인
        </a>
      </div>
    </section>
  );
}
