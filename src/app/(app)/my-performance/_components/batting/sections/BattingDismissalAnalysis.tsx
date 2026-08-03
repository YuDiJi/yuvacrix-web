import type { BattingDismissals } from "@/types/performance";

import DismissalPieChart from "../charts/DismissalPieChart";
import PerformanceEmptyState from "../components/PerformanceEmptyState";
import PerformanceInsight from "../components/PerformanceInsight";
import PerformanceSection from "../components/PerformanceSection";

type BattingDismissalAnalysisProps = {
  data: BattingDismissals;
};

export default function BattingDismissalAnalysis({
  data,
}: BattingDismissalAnalysisProps) {
  const mostCommon = data.items.length
    ? [...data.items].sort((a, b) => b.dismissals - a.dismissals)[0]
    : null;

  return (
    <PerformanceSection
      title="Out type"
      description={`${data.totalDismissals} total dismissals`}
      showShare={false}
      helpText="See how you usually get out and understand which bowling type challenges you most."
    >
      {data.items.length === 0 ? (
        <PerformanceEmptyState
          title="No dismissals"
          description="No dismissal records are available for completed matches."
        />
      ) : (
        <>
          <DismissalPieChart items={data.items} />

          {mostCommon && (
            <div className="mt-4">
              <PerformanceInsight>
                Most common dismissal:{" "}
                <strong className="text-(--color-brand)">
                  {formatEnum(mostCommon.dismissalType)}
                </strong>{" "}
                ({mostCommon.percentage.toFixed(1)}%)
              </PerformanceInsight>
            </div>
          )}
        </>
      )}
    </PerformanceSection>
  );
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
