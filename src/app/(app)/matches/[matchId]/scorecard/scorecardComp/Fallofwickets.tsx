"use client";

import { FallOfWicket } from "@/types/cricket/scorecard";

type Props = {
  fallOfWickets: FallOfWicket[];
};

export default function FallOfWickets({ fallOfWickets }: Props) {
  if (!fallOfWickets || fallOfWickets.length === 0) return null;

  return (
    <div className="border-t border-(--color-bg-border)">
      {/* Section header */}
      <div className="flex items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2">
        <span className="text-section-label">Fall of Wickets</span>
        <span className="text-section-label">Score (over)</span>
      </div>

      {/* Rows */}
      {fallOfWickets.map((fw, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-(--color-bg-border) px-3 py-2 last:border-b-0"
        >
          <div className="flex items-center gap-2">
            <span className="w-4 text-[11px] font-bold text-(--color-text-muted)">
              {fw.wicketNumber}
            </span>
            <span className="font-display text-[13px] font-bold uppercase tracking-wide text-(--color-brand)">
              {fw.playerNameSnapshot}
            </span>
          </div>
          <span className="text-[12px] text-(--color-text-body)">
            <span className="font-bold text-(--color-navy)">
              {fw.teamScore}
            </span>
            {fw.overText && (
              <span className="text-(--color-text-muted)">
                {" "}
                ({fw.overText} Ov)
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
