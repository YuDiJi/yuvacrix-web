import type { BattingRunComposition } from "@/types/cricket/performance";

import RunTypesBarChart from "../charts/RunTypesBarChart";
import PerformanceInsight from "../components/PerformanceInsight";
import PerformanceSection from "../components/PerformanceSection";

type BattingRunTypesProps = {
  data: BattingRunComposition;
};

export default function BattingRunTypes({ data }: BattingRunTypesProps) {
  const scoringRuns =
    data.ones +
    data.twos * 2 +
    data.threes * 3 +
    data.fours * 4 +
    data.sixes * 6;

  const dotPercentage =
    data.totalRecordedEvents > 0
      ? (data.dots / data.totalRecordedEvents) * 100
      : 0;

  const boundaryRuns = data.fours * 4 + data.sixes * 6;

  return (
    <PerformanceSection
      title="Types of runs"
      description="Distribution of dots, singles, doubles and boundaries"
      helpText="See which types of runs you score the most and plan your practice better."
      showShare={false}
    >
      <RunTypesBarChart data={data} />

      <div className="mt-4 space-y-3">
        <PerformanceInsight>
          Played{" "}
          <strong className="text-(--color-brand)">
            {dotPercentage.toFixed(1)}%
          </strong>{" "}
          dot balls across recorded events
        </PerformanceInsight>

        <PerformanceInsight>
          Scored{" "}
          <strong className="text-(--color-brand)">{boundaryRuns}</strong> runs
          through fours and sixes
        </PerformanceInsight>

        <PerformanceInsight value={scoringRuns}>
          Runs represented by the recorded run composition
        </PerformanceInsight>
      </div>
    </PerformanceSection>
  );
}
