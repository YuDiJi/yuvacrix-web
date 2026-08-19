"use client";

import { BatterScore } from "@/types/cricket/scorecard";

type Props = {
  batters: BatterScore[];
};

function getPlayerLabel(b: BatterScore): string {
  const tags: string[] = [];
  if (b.isCaptain) tags.push("c");
  if (b.isWicketKeeper) tags.push("wk");
  const suffix = b.isNotOut ? "*" : "";
  const tagStr = tags.length ? ` (${tags.join("/")})` : "";
  return `${b.playerNameSnapshot}${tagStr}${suffix}`;
}

export default function BattingTable({ batters }: Props) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center border-b border-(--color-bg-border) px-3 py-2 bg-(--color-text-muted)/10">
        <span className="text-section-label flex-1">Batters</span>
        {["R", "B", "4s", "6s", "SR"].map((col) => (
          <span key={col} className="text-section-label w-9 text-center">
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      {batters.map((b, i) => (
        <div
          key={i}
          className="flex items-start border-b border-(--color-bg-border) px-3 py-2.5 last:border-b-0"
        >
          {/* Name + dismissal */}
          <div className="flex-1 min-w-0 pr-2">
            <p className="font-display text-[13px] font-bold uppercase tracking-wide text-(--color-brand) leading-tight truncate">
              {getPlayerLabel(b)}
            </p>
            {b.dismissalText && (
              <p className="text-meta mt-0.5 leading-tight">
                {b.dismissalText}
              </p>
            )}
            {b.isNotOut && !b.dismissalText && (
              <p className="mt-0.5 text-[11px] font-medium leading-tight text-(--color-four)">
                not out
              </p>
            )}
          </div>

          {/* Stats */}
          <span className="w-9 text-center text-[13px] font-bold text-(--color-navy)">
            {b.runs}
          </span>
          <span className="w-9 text-center text-[12px] text-(--color-text-body)">
            {b.balls}
          </span>
          <span className="w-9 text-center text-[12px] text-(--color-text-body)">
            {b.fours}
          </span>
          <span className="w-9 text-center text-[12px] text-(--color-text-body)">
            {b.sixes}
          </span>
          <span className="w-9 text-center text-[11px] text-(--color-text-secondary)">
            {b.strikeRate != null ? Number(b.strikeRate).toFixed(2) : "-"}
          </span>
        </div>
      ))}
    </div>
  );
}
