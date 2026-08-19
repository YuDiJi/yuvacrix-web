"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { InningsScorecard } from "@/types/cricket/scorecard";
import BattingTable from "./Battingtable";
import BowlingTable from "./Bowlingtable";
import ExtrasRow from "./Extrasrow";
import FallOfWickets from "./Fallofwickets";
import YetToBat from "./Yettobat";

type Props = {
  innings: InningsScorecard;
  defaultExpanded?: boolean;
};

export default function ScorecardInningsAccordion({
  innings,
  defaultExpanded = false,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const scoreLabel = `${innings.totalRuns}/${innings.wickets}`;
  const oversLabel = `(${innings.overs} Ov)`;

  return (
    <div className="mb-3 overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
      {/* Accordion Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
          expanded ? "bg-(--color-navy)" : "bg-(--color-bg-card)"
        }`}
      >
        {/* Team name */}
        <span
          className={`font-display text-[15px] font-black uppercase tracking-wide ${
            expanded ? "text-(--color-text-inverse)" : "text-(--color-navy)"
          }`}
        >
          {innings.battingTeam?.teamNameSnapshot ??
            `Innings ${innings.inningsNumber}`}
        </span>

        {/* Score + chevron */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span
              className={`font-display text-[17px] font-black ${
                expanded ? "text-(--color-text-inverse)" : "text-(--color-navy)"
              }`}
            >
              {scoreLabel}{" "}
            </span>
            <span
              className={`font-body text-[12px] font-normal ${
                expanded
                  ? "text-(--color-sky)"
                  : "text-(--color-text-secondary)"
              }`}
            >
              {oversLabel}
            </span>
          </div>
          {expanded ? (
            <ChevronUp
              size={18}
              className={
                expanded ? "text-(--color-text-inverse)" : "text-(--color-navy)"
              }
            />
          ) : (
            <ChevronDown
              size={18}
              className={
                expanded ? "text-(--color-text-inverse)" : "text-(--color-navy)"
              }
            />
          )}
        </div>
      </button>

      {/* Accordion Body */}
      {expanded && (
        <div className="divide-y divide-(--color-bg-border)">
          {/* Batting */}
          {innings.batters && innings.batters.length > 0 && (
            <BattingTable batters={innings.batters} />
          )}

          {/* Extras + Total */}
          {innings.extras && (
            <ExtrasRow
              extras={innings.extras}
              totalRuns={innings.totalRuns}
              wickets={innings.wickets}
              overs={innings.overs}
            />
          )}

          {innings.scoreAdjustments?.length > 0 && (
            <div className="px-3 py-3">
              <div className="text-section-label mb-2">Rule adjustments</div>
              <div className="space-y-1.5">
                {innings.scoreAdjustments.map((adjustment) => (
                  <div
                    key={adjustment.id}
                    className="flex justify-between text-xs text-(--color-text-secondary)"
                  >
                    <span>
                      Bowling target powerplay · Over{" "}
                      {adjustment.overNumber + 1}
                      {` (${adjustment.rawOverRuns}/${adjustment.targetRuns})`}
                    </span>
                    <span className="font-bold text-(--color-navy)">
                      {adjustment.runs > 0 ? "+" : ""}
                      {adjustment.runs} runs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Yet to bat */}
          {innings.toBat && innings.toBat.length > 0 && (
            <YetToBat players={innings.toBat} />
          )}

          {/* Bowling */}
          {innings.bowlers && innings.bowlers.length > 0 && (
            <div className="pt-1">
              <div className="px-3 pt-2 pb-1">
                <span className="text-section-label">Bowling</span>
              </div>
              <BowlingTable bowlers={innings.bowlers} />
            </div>
          )}

          {/* Fall of Wickets */}
          {innings.fallOfWickets && innings.fallOfWickets.length > 0 && (
            <FallOfWickets fallOfWickets={innings.fallOfWickets} />
          )}
        </div>
      )}
    </div>
  );
}
