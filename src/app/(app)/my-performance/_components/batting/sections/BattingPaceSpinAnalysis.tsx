import type {
  BattingAnalysisResponse,
  BattingPaceSpinData,
} from "@/types/performance";

import PerformanceEmptyState from "../components/PerformanceEmptyState";
import PerformanceSection from "../components/PerformanceSection";
import PerformanceTable from "../components/PerformanceTable";

type BattingPaceSpinAnalysisProps = {
  response?: BattingAnalysisResponse<"PACE_SPIN">;
  isLoading?: boolean;
  isError?: boolean;
};

export default function BattingPaceSpinAnalysis({
  response,
  isLoading = false,
  isError = false,
}: BattingPaceSpinAnalysisProps) {
  const data = response?.data as BattingPaceSpinData | undefined;

  return (
    <PerformanceSection
      title="Pace vs spin"
      description="Batting comparison against pace and spin"
      showShare={false}
      helpText="Find out wheather you play better against pace or spin"
    >
      {isLoading && (
        <div className="h-44 animate-pulse rounded-xl bg-(--color-bg-tint)" />
      )}

      {!isLoading && (isError || !data) && (
        <PerformanceEmptyState
          title="Pace-vs-spin data unavailable"
          description="Classified pace and spin deliveries could not be loaded."
        />
      )}

      {!isLoading && data && (
        <PerformanceTable
          rows={data.items}
          getRowKey={(row) => row.category}
          minWidth={700}
          columns={[
            {
              key: "type",
              header: "Type",
              render: (row) => row.category,
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
              key: "fours",
              header: "4s",
              align: "center",
              render: (row) => row.fours,
            },
            {
              key: "sixes",
              header: "6s",
              align: "center",
              render: (row) => row.sixes,
            },
            {
              key: "outs",
              header: "Outs",
              align: "center",
              render: (row) => row.dismissals,
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
