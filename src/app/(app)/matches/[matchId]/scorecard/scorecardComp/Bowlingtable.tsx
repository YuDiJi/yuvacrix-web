"use client";

import { BowlerScore } from "@/types/cricket/scorecard";

type Props = {
  bowlers: BowlerScore[];
};

export default function BowlingTable({ bowlers }: Props) {
  if (!bowlers || bowlers.length === 0) return null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center border-b border-(--color-bg-border) px-3 py-2 bg-(--color-text-muted)/10">
        <span className="text-section-label flex-1">Bowlers</span>
        {["O", "M", "R", "W", "Eco."].map((col) => (
          <span key={col} className="text-section-label w-9 text-center">
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      {bowlers.map((b, i) => (
        <div
          key={i}
          className="flex items-center border-b border-(--color-bg-border) px-3 py-2.5 last:border-b-0"
        >
          <span className="font-display text-[13px] font-bold uppercase tracking-wide text-(--color-brand) truncate flex-1 pr-2">
            {b.playerNameSnapshot}
          </span>
          <span className="w-9 text-center text-[12px] text-(--color-text-body)">
            {b.overs}
          </span>
          <span className="w-9 text-center text-[12px] text-(--color-text-body)">
            {b.maidens}
          </span>
          <span className="w-9 text-center text-[12px] text-(--color-text-body)">
            {b.runsConceded}
          </span>
          <span className="w-9 text-center text-[13px] font-bold text-(--color-navy)">
            {b.wickets}
          </span>
          <span className="w-9 text-center text-[11px] text-(--color-text-secondary)">
            {b.economy != null ? Number(b.economy).toFixed(2) : "-"}
          </span>
        </div>
      ))}
    </div>
  );
}
