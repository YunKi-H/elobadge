import { useEffect, useState } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { getFirebaseClientAuth } from "../firebase/client";
import { getCurrentApiUser } from "../api/client";
import type { LoginMode } from "@elobadge/core";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type LoginState =
  | { status: "loading" }
  | { status: "success"; displayName: string; mode: LoginMode }
  | { status: "error"; message: string };

interface LoginExchangeResponse {
  ok: true;
  customToken: string;
  mode: LoginMode;
  user: {
    displayName: string;
  };
}

const pendingLogins = new Map<string, Promise<LoginExchangeResponse>>();

export function AuthCallback() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [code] = useState(() =>
    new URLSearchParams(window.location.search).get("code")
  );
  const [state, setState] = useState<LoginState>(() =>
    code
      ? { status: "loading" }
      : { status: "error", message: t("authCallback.missingCode") }
  );

  useEffect(() => {
    if (!code) {
      return;
    }

    void completeLogin(code, t("authCallback.invalidCode"))
      .then((result) => {
        setState({
          status: "success",
          displayName: result.user.displayName,
          mode: result.mode
        });
        void navigate(window.location.pathname, { replace: true });
      })
      .catch((error: unknown) => {
        const message = error instanceof Error
          ? error.message
          : t("authCallback.loginFailed");
        setState({ status: "error", message });
      });
  }, [code, navigate, t]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-md rounded-md bg-slate-900 p-6 ring-1 ring-white/10">
        {state.status === "loading" ? (
          <p className="text-slate-200">{t("authCallback.loggingIn")}</p>
        ) : null}
        {state.status === "success" ? (
          <>
            <h1 className="text-xl font-semibold text-white">
              {t("authCallback.success")}
            </h1>
            <p className="mt-2 text-slate-300">
              {t("authCallback.successDescription", {
                name: state.displayName,
                role: t(`common.${state.mode}`)
              })}
            </p>
            <Link
              to={`/${state.mode}`}
              className="mt-5 inline-flex rounded-md bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              {t("authCallback.continue")}
            </Link>
          </>
        ) : null}
        {state.status === "error" ? (
          <>
            <h1 className="text-xl font-semibold text-white">
              {t("authCallback.failure")}
            </h1>
            <p className="mt-2 text-red-300">{state.message}</p>
          </>
        ) : null}
      </section>
    </main>
  );
}

function completeLogin(
  code: string,
  invalidCodeMessage: string
): Promise<LoginExchangeResponse> {
  const pendingLogin = pendingLogins.get(code);

  if (pendingLogin) {
    return pendingLogin;
  }

  const login = exchangeLoginCode(code, invalidCodeMessage).then(async (result) => {
    await signInWithCustomToken(getFirebaseClientAuth(), result.customToken);
    await getCurrentApiUser();
    return result;
  });

  pendingLogins.set(code, login);
  return login;
}

async function exchangeLoginCode(
  code: string,
  invalidCodeMessage: string
): Promise<LoginExchangeResponse> {
  const response = await fetch("/api/auth/firebase/exchange", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code })
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isLoginExchangeResponse(body)) {
    throw new Error(invalidCodeMessage);
  }

  return body;
}

function isLoginExchangeResponse(value: unknown): value is LoginExchangeResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as Partial<LoginExchangeResponse>;
  return (
    response.ok === true &&
    typeof response.customToken === "string" &&
    (response.mode === "streamer" || response.mode === "viewer") &&
    Boolean(response.user) &&
    typeof response.user?.displayName === "string"
  );
}

export const ChzzkAuthCallback = AuthCallback;
