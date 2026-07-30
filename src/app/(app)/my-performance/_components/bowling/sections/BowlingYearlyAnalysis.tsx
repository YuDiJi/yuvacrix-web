import type { BowlingYearlyStats } from "@/types/performance";
import BowlingYearlyChart from "../charts/BowlingYearlyChart";
import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";

export default function BowlingYearlyAnalysis({
  items,
}: {
  items: BowlingYearlyStats[];
}) {
  const best = items.length
    ? [...items].sort((a, b) => b.stats.wickets - a.stats.wickets)[0]
    : null;

  return (
    <PerformanceSection
      title="Stats year-on-year"
      description="Wickets taken each year"
      helpText="See how your bowling has improved year on year and track your progress."
      showShare={false}
    >
      {items.length === 0 ? (
        <PerformanceEmptyState
          title="Yearly data unavailable"
          description="More completed-match data is required for a yearly chart."
        />
      ) : (
        <>
          <BowlingYearlyChart items={items} />
          {best && (
            <div className="mt-4">
              <PerformanceInsight>
                Took most wickets in{" "}
                <strong className="text-(--color-brand)">{best.year}</strong>
              </PerformanceInsight>
            </div>
          )}
        </>
      )}
    </PerformanceSection>
  );
}
