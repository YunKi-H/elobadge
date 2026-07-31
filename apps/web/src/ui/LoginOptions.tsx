import type { LoginMode } from "@elobadge/core";
import { Radio, Tv, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFirebaseAuthStatus } from "./useFirebaseAuthStatus";

interface LoginOptionsProps {
  mode: LoginMode;
}

export function LoginOptions({ mode }: LoginOptionsProps) {
  const { t } = useTranslation();
  const authStatus = useFirebaseAuthStatus();
  const role = t(`common.${mode}`);
  const Icon = mode === "streamer" ? Radio : UserRound;

  if (authStatus !== "signed_out") {
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
          <h2 className="font-semibold text-white">
            {t("login.title", { role })}
          </h2>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`/api/auth/chzzk/start?mode=${mode}`}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-500 px-4 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          <Radio aria-hidden="true" size={17} />
          {t("login.chzzk")}
        </a>
        <a
          href={`/api/auth/twitch/login/start?mode=${mode}`}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#9146ff] px-4 font-semibold text-white transition hover:bg-[#7f35e8]"
        >
          <Tv aria-hidden="true" size={17} />
          {t("login.twitch")}
        </a>
      </div>
    </section>
  );
}
