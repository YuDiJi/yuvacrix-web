import BattingPositionChart, {
  type BattingPositionChartItem,
} from "../charts/BattingPositionChart";
import PerformanceEmptyState from "../components/PerformanceEmptyState";
import PerformanceInsight from "../components/PerformanceInsight";
import PerformanceSection from "../components/PerformanceSection";

type BattingPositionAnalysisProps = {
  items?: BattingPositionChartItem[];
};

export default function BattingPositionAnalysis({
  items = [],
}: BattingPositionAnalysisProps) {
  const preferred = items.length
    ? [...items].sort((a, b) => b.runs - a.runs)[0]
    : null;

  const secondPreferred =
    items.length > 1 ? [...items].sort((a, b) => b.runs - a.runs)[1] : null;

  return (
    <PerformanceSection
      title="Batting position"
      description="Performance across batting-order positions"
      showShare={false}
      helpText="See which batting position suits you best based on your past performances."
    >
      {items.length === 0 ? (
        <PerformanceEmptyState
          title="Batting-position API pending"
          description="The current API document does not return aggregated batting-position statistics. This section is ready to receive that data."
        />
      ) : (
        <>
          <BattingPositionChart items={items} />

          <div className="mt-4 space-y-3">
            {preferred && (
              <PerformanceInsight value={preferred.battingOrder}>
                Preferred batting position based on runs scored
              </PerformanceInsight>
            )}

            {secondPreferred && (
              <PerformanceInsight value={secondPreferred.battingOrder}>
                Second preferred batting position
              </PerformanceInsight>
            )}
          </div>
        </>
      )}
    </PerformanceSection>
  );
}
