import type { ChzzkBadge } from "@elobadge/core";

export function ChzzkBadges({ badges }: { badges: ChzzkBadge[] | undefined }) {
  if (!badges?.length) {
    return null;
  }

  return (
    <span
      className="mt-0.5 flex shrink-0 items-center gap-1"
      aria-label="치지직 배지"
    >
      {badges.map((badge) => (
        <img
          key={badge.imageUrl}
          src={badge.imageUrl}
          alt=""
          className="h-5 max-w-[3.75rem] shrink-0 object-contain"
          referrerPolicy="no-referrer"
        />
      ))}
    </span>
  );
}
