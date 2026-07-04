"use client";

import { Innings } from "@/types/innings";

type Props = {
  innings: any;
};

export default function SummaryInningsCard({ innings }: Props) {
  // Run rate is only shown if the backend already provides it; never computed here.
  const runRate = (innings as unknown as { runRate?: number }).runRate;

  return (
    <div className="flex items-center justify-between rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate font-display text-[12.5px] font-bold uppercase tracking-wide text-(--color-navy)">
          {innings.battingTeam?.teamName ?? `Innings ${innings.inningsNumber}`}
        </p>
        <p className="text-meta">Innings {innings.inningsNumber}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {runRate != null && (
          <span className="text-meta">RR {Number(runRate).toFixed(2)}</span>
        )}
        <div className="text-right">
          <span className="font-display text-[15px] font-black text-(--color-navy)">
            {innings.totalRuns}/{innings.wickets}
          </span>
          <span className="ml-1 text-[11px] text-(--color-text-secondary)">
            ({innings.overs})
          </span>
        </div>
      </div>
    </div>
  );
}
