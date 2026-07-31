import { UserRound } from "lucide-react";
import { ChessComAccountSettings } from "./ChessComAccountSettings";
import { LichessAccountSettings } from "./LichessAccountSettings";
import { AccountDeletion } from "./AccountDeletion";
import { PlatformAccountSettings } from "./PlatformAccountSettings";
import { useChessBadgePreference } from "./useChessBadgePreference";
import { LoginOptions } from "./LoginOptions";
import { useFirebaseAuthStatus } from "./useFirebaseAuthStatus";
import { useTranslation } from "react-i18next";

export function ViewerPage() {
  const { t } = useTranslation();
  const authStatus = useFirebaseAuthStatus();
  const badgePreference = useChessBadgePreference();

  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sky-300">
          <UserRound aria-hidden="true" size={18} />
          <span className="text-sm font-medium">{t("common.viewer")}</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-white">
          {t("viewer.title")}
        </h1>
      </header>
      <LoginOptions mode="viewer" />
      {authStatus === "signed_in" ? (
        <>
          <PlatformAccountSettings />
          <ChessComAccountSettings badgePreference={badgePreference} />
          <LichessAccountSettings badgePreference={badgePreference} />
          <AccountDeletion />
        </>
      ) : null}
    </div>
  );
}
