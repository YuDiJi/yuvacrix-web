import type { BattingOverallStats } from "@/types/performance";

import PerformanceSection from "../components/PerformanceSection";

type BattingOverallStatsProps = {
  data: BattingOverallStats;
};

export default function BattingOverallStatsSection({
  data,
}: BattingOverallStatsProps) {
  const stats = [
    ["Innings", data.innings],
    ["Not out", data.notOuts],
    ["Runs", data.runs],
    ["Highest", `${data.highestScore}${data.highestScoreNotOut ? "*" : ""}`],
    ["Average", format(data.average)],
    ["Strike rate", format(data.strikeRate)],
    ["30s", data.thirties],
    ["50s", data.fifties],
    ["100s", data.hundreds],
    ["4s", data.fours],
    ["6s", data.sixes],
    ["Dot balls", data.dotBalls],
    ["Ducks", data.ducks],
  ] as const;

  return (
    <PerformanceSection
      title="Overall stats"
      description="Career batting summary from completed matches"
      showShare={false}
      helpText="Get to know yourself better with simple and meaningful cricket insights."
    >
      <div className="grid grid-cols-3 gap-2.5">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-2 py-3 text-center"
          >
            <p className="font-(family-name:--font-display) text-xl font-black text-(--color-brand)">
              {value}
            </p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-(--color-text-secondary)">
              {label}
            </p>
          </div>
        ))}
      </div>
    </PerformanceSection>
  );
}

function format(value: number | null) {
  return value === null ? "—" : value.toFixed(2);
}
