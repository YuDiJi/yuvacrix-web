import type { BowlingStats } from "@/types/performance";
import PerformanceSection from "../../batting/components/PerformanceSection";

const fmt = (value: number | null) => (value === null ? "—" : value.toFixed(2));

export default function BowlingOverallStats({ data }: { data: BowlingStats }) {
  const stats = [
    ["Matches", data.matches],
    ["Innings", data.innings],
    ["Overs", data.overs],
    ["Maidens", data.maidens],
    ["Wickets", data.wickets],
    ["Runs", data.runsConceded],
    ["Best bowling", data.bestBowling?.display ?? "—"],
    ["Economy", fmt(data.economy)],
    ["SR", fmt(data.strikeRate)],
    ["Average", fmt(data.average)],
    ["Wides", data.wides],
    ["No balls", data.noBalls],
    ["Dot balls", data.dotBalls],
    ["4s conceded", data.foursConceded],
    ["6s conceded", data.sixesConceded],
  ] as const;

  return (
    <PerformanceSection
      title="Overall stats"
      description="Career bowling summary from completed matches"
      helpText="See all your bowling stats in one place and understand your overall performance."
      showShare={false}
    >
      <div className="grid grid-cols-3 gap-2.5">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-2 py-4 text-center"
          >
            <p className="font-(family-name:--font-display) text-xl font-black text-(--color-brand)">
              {value}
            </p>
            <p className="mt-1 text-[9px] font-bold uppercase text-(--color-text-secondary)">
              {label}
            </p>
          </div>
        ))}
      </div>
    </PerformanceSection>
  );
}
