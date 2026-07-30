import type {
  BattingAnalysisResponse,
  BattingBowlingStyleData,
} from "@/types/performance";

import PerformanceEmptyState from "../components/PerformanceEmptyState";
import PerformanceSection from "../components/PerformanceSection";
import PerformanceTable from "../components/PerformanceTable";

type BattingBowlingStyleAnalysisProps = {
  response?: BattingAnalysisResponse<"BOWLING_STYLE">;
  isLoading?: boolean;
  isError?: boolean;
};

export default function BattingBowlingStyleAnalysis({
  response,
  isLoading = false,
  isError = false,
}: BattingBowlingStyleAnalysisProps) {
  const data = response?.data as BattingBowlingStyleData | undefined;

  return (
    <PerformanceSection
      title="Performance against bowling types"
      description="Batting output against individual bowling styles"
      helpText="See how you've performed against different bowling types based on your past matches."
      showShare={false}
    >
      {isLoading && <TableSkeleton />}

      {!isLoading && (isError || !data) && (
        <PerformanceEmptyState
          title="Bowling-style analysis unavailable"
          description="Bowling-style classified deliveries are not available."
        />
      )}

      {!isLoading && data && (
        <PerformanceTable
          rows={data.items}
          getRowKey={(row) => row.bowlingStyle}
          minWidth={760}
          columns={[
            {
              key: "style",
              header: "Bowling type",
              render: (row) => formatEnum(row.bowlingStyle),
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
          ]}
        />
      )}
    </PerformanceSection>
  );
}

function TableSkeleton() {
  return <div className="h-56 animate-pulse rounded-xl bg-(--color-bg-tint)" />;
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
