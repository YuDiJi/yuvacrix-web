"use client";

import { TeamScoreSummary } from "@/types/scorecard";

type Props = {
  team: TeamScoreSummary;
  isWinner: boolean;
};

function getInitials(name?: string): string {
  if (!name) return "T";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function SummaryScoreCard({ team, isWinner }: Props) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border bg-(--color-bg-card) px-4 py-3 shadow-(--shadow-card) ${
        isWinner
          ? "border-2 border-(--color-navy)"
          : "border-(--color-bg-border)"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Logo / initials */}
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-(--color-bg-border) bg-(--color-navy)">
          {team.logoUrlSnapshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={team.logoUrlSnapshot}
              alt={team.teamNameSnapshot}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-[12px] font-black text-(--color-text-inverse)">
                {getInitials(team.teamNameSnapshot)}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-display text-[13px] font-bold uppercase tracking-wide text-(--color-navy)">
              {team.teamNameSnapshot ?? team.teamNameSnapshot}
            </p>
            {isWinner && (
              <span className="shrink-0 rounded-full bg-(--color-six) px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-(--color-text-inverse)">
                Won
              </span>
            )}
          </div>
          {team.runRate != null && (
            <p className="text-meta">RR {Number(team.runRate).toFixed(2)}</p>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="text-right">
        <p className="font-display text-[19px] font-black leading-none text-(--color-navy)">
          {team.runs}/{team.wickets}
        </p>
        <p className="text-meta mt-0.5">({team.overs} Ov)</p>
      </div>
    </div>
  );
}
