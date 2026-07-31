import { useState } from "react";
import {
  DEFAULT_OVERLAY_APPEARANCE,
  type OverlayAppearance
} from "@elobadge/core";
import { Radio } from "lucide-react";
import { OverlayPreview } from "./OverlayPreview";
import { OverlaySettings } from "./OverlaySettings";
import { AccountDeletion } from "./AccountDeletion";
import { LoginOptions } from "./LoginOptions";
import { PlatformAccountSettings } from "./PlatformAccountSettings";
import { useFirebaseAuthStatus } from "./useFirebaseAuthStatus";
import { useTranslation } from "react-i18next";

export function StreamerPage() {
  const { t } = useTranslation();
  const authStatus = useFirebaseAuthStatus();
  const [appearance, setAppearance] = useState<OverlayAppearance>({
    ...DEFAULT_OVERLAY_APPEARANCE
  });
  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center gap-2 text-emerald-300">
          <Radio aria-hidden="true" size={18} />
          <span className="text-sm font-medium">{t("common.streamer")}</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-white">
          {t("streamer.title")}
        </h1>
      </header>

      <LoginOptions mode="streamer" />
      {authStatus === "signed_in" ? (
        <>
          <PlatformAccountSettings streamer />
          <OverlaySettings onAppearanceChange={setAppearance} />

          <section className="max-w-2xl py-2">
            <h2 className="mb-4 text-lg font-semibold text-white">
              {t("streamer.preview")}
            </h2>
            <OverlayPreview appearance={appearance} />
          </section>

          <AccountDeletion />
        </>
      ) : null}
    </div>
  );
}
