"use client";

import { Extras } from "@/types/cricket/scorecard";

type Props = {
  extras: Extras;
  totalRuns: number;
  wickets: number;
  overs: string | number;
};

export default function ExtrasRow({
  extras,
  totalRuns,
  wickets,
  overs,
}: Props) {
  // Build the breakdown string — only include non-zero values
  const parts: string[] = [];
  if (extras.wides) parts.push(`wd ${extras.wides}`);
  if (extras.noBalls) parts.push(`nb ${extras.noBalls}`);
  if (extras.byes) parts.push(`b ${extras.byes}`);
  if (extras.legByes) parts.push(`lb ${extras.legByes}`);
  if (extras.penalties) parts.push(`p ${extras.penalties}`);

  const breakdown = parts.length ? ` (${parts.join(", ")})` : "";

  return (
    <>
      {/* Extras */}
      <div className="flex items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2.5">
        <span className="text-body font-semibold">Extras</span>
        <span className="text-[12px] text-(--color-text-body)">
          <span className="font-bold text-(--color-navy)">{extras.total}</span>
          <span className="text-(--color-text-muted)">{breakdown}</span>
        </span>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between bg-(--color-bg-base) px-3 py-2.5">
        <span className="font-display text-[13px] font-bold uppercase tracking-wide text-(--color-navy)">
          Total
        </span>
        <span className="font-display text-[13px] font-bold uppercase text-(--color-navy)">
          {totalRuns}/{wickets}{" "}
          <span className="font-body text-[12px] font-normal text-(--color-text-secondary)">
            ({overs} Ov)
          </span>
        </span>
      </div>
    </>
  );
}
