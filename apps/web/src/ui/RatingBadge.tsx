import type { RatingBadge as RatingBadgeData } from "@chessbadge/core";

export function RatingBadge({ rating }: { rating: RatingBadgeData }) {
  const providerName = rating.provider === "chesscom" ? "Chess.com" : "Lichess";

  return (
    <span
      className="flex shrink-0 items-center gap-1.5 rounded bg-white px-2 py-1 text-sm font-bold text-slate-950 shadow-sm ring-1 ring-black/10"
      aria-label={`${providerName} rating ${rating.value}`}
      title={`${providerName} ${rating.speed} rating`}
    >
      {rating.provider === "chesscom" ? (
        <img
          src="/chess-com-logo.svg"
          alt=""
          className="h-5 w-5 shrink-0"
          width="20"
          height="20"
        />
      ) : (
        <span aria-hidden="true">♟</span>
      )}
      <span>{rating.value}</span>
    </span>
  );
}
