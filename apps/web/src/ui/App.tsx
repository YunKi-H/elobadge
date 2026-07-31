import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LogOut, Radio, UserRound } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { validateCurrentFirebaseSession } from "../api/client";
import { getFirebaseClientAuth } from "../firebase/client";
import { LanguageSelector } from "./LanguageSelector";

export function App() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const auth = getFirebaseClientAuth();
    let disposed = false;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setSignedIn(false);
        return;
      }

      setSignedIn(true);
      void validateCurrentFirebaseSession().then(async (status) => {
        if (
          disposed ||
          status !== "invalid" ||
          auth.currentUser?.uid !== user.uid
        ) {
          return;
        }

        await signOut(auth).catch(() => undefined);
        if (!disposed) {
          void navigate("/", { replace: true });
        }
      });
    });

    return () => {
      disposed = true;
      unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await signOut(getFirebaseClientAuth());
      void navigate("/", { replace: true });
    } catch {
      window.alert(t("app.signOutFailed"));
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 bg-slate-950/80">
        <div className="mx-auto flex min-h-16 max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-6">
          <Link to="/" className="text-lg font-semibold text-white">
            EloBadge
          </Link>
          <nav
            className="flex flex-wrap items-center justify-end gap-1"
            aria-label={t("app.mainNavigation")}
          >
            {[
              {
                to: "/streamer",
                label: t("common.streamer"),
                icon: Radio
              },
              {
                to: "/viewer",
                label: t("common.viewer"),
                icon: UserRound
              }
            ].map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon aria-hidden="true" size={16} />
                {label}
              </NavLink>
            ))}
            {signedIn ? (
              <button
                type="button"
                disabled={signingOut}
                onClick={() => void handleSignOut()}
                className="ml-1 inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <LogOut aria-hidden="true" size={16} />
                {signingOut ? t("common.signingOut") : t("common.signOut")}
              </button>
            ) : null}
            <LanguageSelector />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-sm text-slate-400 sm:px-6">
          <span>
            {t("app.support")}{" "}
            <a
              href="mailto:support@elobadge.com"
              className="font-medium text-slate-300 transition hover:text-white"
            >
              support@elobadge.com
            </a>
          </span>
          <Link
            to="/privacy"
            className="font-medium text-slate-300 transition hover:text-white"
          >
            {t("app.privacy")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
