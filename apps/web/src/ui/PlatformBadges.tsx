import type {
  PlatformBadgeVisibility,
  PlatformChatBadge
} from "@elobadge/core";

export function PlatformBadges({
  badges,
  visibility,
  lineHeight
}: {
  badges: PlatformChatBadge[];
  visibility: PlatformBadgeVisibility;
  lineHeight: number;
}) {
  const visibleBadges = badges?.filter((badge) => visibility[badge.kind]);

  if (!visibleBadges?.length) {
    return null;
  }

  return (
    <span
      className="mr-[0.45em] inline-flex items-center gap-1 align-top"
      style={{ height: `${lineHeight}em` }}
      aria-label="플랫폼 배지"
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
