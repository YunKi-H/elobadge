import type {
  PlatformBadgeVisibility,
  PlatformChatBadge,
  StreamingPlatform
} from "@elobadge/core";
import { useTranslation } from "react-i18next";

export function PlatformBadges({
  badges,
  visibilityByPlatform,
  lineHeight
}: {
  badges: PlatformChatBadge[];
  visibilityByPlatform: Partial<
    Record<StreamingPlatform, PlatformBadgeVisibility>
  >;
  lineHeight: number;
}) {
  const { t } = useTranslation();
  const visibleBadges = badges?.filter(
    (badge) => visibilityByPlatform[badge.provider]?.[badge.kind] === true
  );

  if (!visibleBadges?.length) {
    return null;
  }

  return (
    <span
      className="mr-[0.45em] inline-flex items-center gap-1 align-top"
      style={{ height: `${lineHeight}em` }}
      aria-label={t("platformBadge")}
    >
      {visibleBadges.map((badge, index) => (
        <img
          key={`${badge.provider}:${badge.kind}:${badge.imageUrl}:${index}`}
          src={badge.imageUrl}
          alt=""
          className="h-[1em] max-w-[3em] shrink-0 object-contain"
          referrerPolicy="no-referrer"
        />
      ))}
    </span>
  );
}
