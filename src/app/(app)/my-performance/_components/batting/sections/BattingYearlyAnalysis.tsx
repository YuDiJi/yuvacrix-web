import type { BattingYearlyStats } from "@/types/cricket/performance";

import YearlyRunsChart from "../charts/YearlyRunsChart";
import PerformanceEmptyState from "../components/PerformanceEmptyState";
import PerformanceInsight from "../components/PerformanceInsight";
import PerformanceSection from "../components/PerformanceSection";

type BattingYearlyAnalysisProps = {
  items: BattingYearlyStats[];
};

export default function BattingYearlyAnalysis({
  items,
}: BattingYearlyAnalysisProps) {
  const bestYear = items.length
    ? [...items].sort((a, b) => b.stats.runs - a.stats.runs)[0]
    : null;

  return (
    <PerformanceSection
      title="Stats year-on-year"
      description="Runs scored in each completion year"
      showShare={false}
      helpText="Compare your batting stats year on year."
    >
      {items.length === 0 ? (
        <PerformanceEmptyState
          title="Yearly data unavailable"
          description="More completed-match data is required for a year-on-year chart."
        />
      ) : (
        <>
          <YearlyRunsChart items={items} />

          {bestYear && (
            <div className="mt-4">
              <PerformanceInsight>
                Scored maximum runs in{" "}
                <strong className="text-(--color-brand)">
                  {bestYear.year}
                </strong>{" "}
                with {bestYear.stats.runs} runs
              </PerformanceInsight>
            </div>
          )}
        </>
      )}
    </PerformanceSection>
  );
}
