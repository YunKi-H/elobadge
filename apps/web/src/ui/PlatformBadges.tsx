import type {
  PlatformBadgeVisibility,
  PlatformChatBadge
} from "@elobadge/core";
import { useTranslation } from "react-i18next";

export function PlatformBadges({
  badges,
  visibility,
  lineHeight
}: {
  badges: PlatformChatBadge[];
  visibility: PlatformBadgeVisibility;
  lineHeight: number;
}) {
  const { t } = useTranslation();
  const visibleBadges = badges?.filter((badge) => visibility[badge.kind]);

  if (!visibleBadges?.length) {
    return null;
  }

  return (
    <span
      className="mr-[0.45em] inline-flex items-center gap-1 align-top"
      style={{ height: `${lineHeight}em` }}
      aria-label={t("platformBadge")}
    >
      {visibleBadges.map((badge) => (
        <img
          key={badge.imageUrl}
          src={badge.imageUrl}
          alt=""
          className="h-[1em] max-w-[3em] shrink-0 object-contain"
          referrerPolicy="no-referrer"
        />
      ))}
    </span>
  );
}
