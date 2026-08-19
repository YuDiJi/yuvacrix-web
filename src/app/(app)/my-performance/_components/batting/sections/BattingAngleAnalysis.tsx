import type {
  BattingAnalysisResponse,
  BattingBowlingAngleData,
} from "@/types/cricket/performance";

import PerformanceEmptyState from "../components/PerformanceEmptyState";
import PerformanceSection from "../components/PerformanceSection";
import PerformanceTable from "../components/PerformanceTable";

type BattingAngleAnalysisProps = {
  response?: BattingAnalysisResponse<"BOWLING_ANGLE">;
  isLoading?: boolean;
  isError?: boolean;
};

export default function BattingAngleAnalysis({
  response,
  isLoading = false,
  isError = false,
}: BattingAngleAnalysisProps) {
  const data = response?.data as BattingBowlingAngleData | undefined;

  return (
    <PerformanceSection
      title="Bowling side analysis"
      description="Performance against bowling angles"
      showShare={false}
      helpText="See how your batting performance varies against different bowling sides."
    >
      {isLoading && (
        <div className="h-48 animate-pulse rounded-xl bg-(--color-bg-tint)" />
      )}

      {!isLoading && (isError || !data) && (
        <PerformanceEmptyState
          title="Bowling-angle analysis unavailable"
          description="Bowling-angle data has not been recorded for enough deliveries."
        />
      )}

      {!isLoading && data && (
        <PerformanceTable
          rows={data.items}
          getRowKey={(row) => row.angle}
          minWidth={760}
          columns={[
            {
              key: "angle",
              header: "Bowling side",
              render: (row) => formatEnum(row.angle),
            },
            {
              key: "runs",
              header: "Runs",
              align: "center",
              render: (row) => row.runs,
            },
            {
              key: "average",
              header: "Avg",
              align: "center",
              render: (row) => format(row.average),
            },
            {
              key: "strikeRate",
              header: "SR",
              align: "center",
              render: (row) => format(row.strikeRate),
            },
            {
              key: "dismissals",
              header: "Outs",
              align: "center",
              render: (row) => row.dismissals,
            },
            {
              key: "dots",
              header: "Dots",
              align: "center",
              render: (row) => row.dotBalls,
            },
            {
              key: "boundaries",
              header: "Boundaries",
              align: "center",
              render: (row) => row.fours + row.sixes,
            },
          ]}
        />
      )}
    </PerformanceSection>
  );
}

function format(value: number | null) {
  return value === null ? "—" : value.toFixed(2);
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
