import type { RatingBadge as RatingBadgeData } from "@elobadge/core";

export function RatingBadge({
  rating,
  lineHeight
}: {
  rating: RatingBadgeData;
  lineHeight: number;
}) {
  const providerName = rating.provider === "chesscom" ? "Chess.com" : "Lichess";

  return (
    <span
      className="mr-[0.45em] inline-flex items-center align-top"
      style={{ height: `${lineHeight}em` }}
      aria-label={`${providerName} rating ${rating.value}`}
      title={`${providerName} ${rating.speed} rating`}
    >
      <span
        className="flex items-center gap-[0.25em] rounded bg-white px-[0.45em] py-[0.2em] text-[0.72em] font-bold leading-none shadow-sm ring-1 ring-black/10"
        style={{ color: "#020617" }}
      >
        <img
          src={
            rating.provider === "chesscom"
              ? "/chess-com-logo.svg"
              : "/lichess-logo.svg"
          }
          alt=""
          className="size-[1.15em] shrink-0"
        />
        <span>{rating.value}</span>
      </span>
    </span>
  );
}
