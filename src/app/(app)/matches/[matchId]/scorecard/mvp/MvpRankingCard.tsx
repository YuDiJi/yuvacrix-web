"use client";

import { S3Image } from "@/components/common/S3Image";
import { MvpPlayer } from "@/types/scorecard";

type Props = {
  player: MvpPlayer;
  rank: number;
  highlighted?: boolean;
};

function getInitials(name?: string): string {
  if (!name) return "P";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const RANK_COLORS: Record<number, string> = {
  1: "bg-(--color-six)",
  2: "bg-(--color-text-muted)",
  3: "bg-(--color-brand)",
};

export default function MvpRankingCard({ player, rank, highlighted }: Props) {
  const rankBg = RANK_COLORS[rank] ?? "bg-(--color-bg-base)";
  const rankText =
    rank <= 3 ? "text-(--color-text-inverse)" : "text-(--color-text-secondary)";

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 ${
        highlighted ? "bg-(--color-sky)/10" : ""
      }`}
    >
      {/* Rank badge */}
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${rankBg} ${rankText}`}
      >
        {rank}
      </span>

      {/* Avatar */}
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-(--color-bg-border) bg-white">
        {player.profileImageSnapshot ? (
          <S3Image
            imageKey={player.profileImageSnapshot}
            alt={player.playerNameSnapshot}
            width={36}
            height={36}
            className="h-full w-full object-cover"
            fallback={
              <div className="flex h-full w-full items-center justify-center rounded-full bg-(--color-navy)">
                {player.playerNameSnapshot.charAt(0)}
              </div>
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
            <span className="font-display text-[11px] font-black text-(--color-text-inverse)">
              {getInitials(player.playerNameSnapshot)}
            </span>
          </div>
        )}
      </div>

      {/* Name + team + reason */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[13px] font-bold uppercase tracking-wide text-(--color-navy)">
          {player.playerNameSnapshot}
        </p>
        <p className="truncate text-[11px] italic text-(--color-text-secondary)">
          {player.teamNameSnapshot}
        </p>
        {player.reason && (
          <p className="text-meta mt-0.5 truncate">{player.reason}</p>
        )}
      </div>

      {/* MVP score */}
      <span className="shrink-0 font-display text-[20px] font-black text-(--color-navy)">
        {player.mvpScore}
      </span>
    </div>
  );
}
