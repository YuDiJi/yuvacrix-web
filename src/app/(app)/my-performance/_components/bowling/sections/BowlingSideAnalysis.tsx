import type {
  BowlingAnalysisResponse,
  BowlingAngleData,
} from "@/types/cricket/performance";
import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceSection from "../../batting/components/PerformanceSection";
import PerformanceTable from "../../batting/components/PerformanceTable";

const fmt = (value: number | null) => (value === null ? "—" : value.toFixed(2));

export default function BowlingSideAnalysis({
  response,
  isLoading = false,
  isError = false,
}: {
  response?: BowlingAnalysisResponse<"BOWLING_ANGLE">;
  isLoading?: boolean;
  isError?: boolean;
}) {
  const data = response?.data as BowlingAngleData | undefined;

  return (
    <PerformanceSection
      title="Bowling side analysis"
      description="Performance by bowling angle"
      helpText="See how your bowling performance varies from different sides."
      showShare={false}
    >
      {isLoading && (
        <div className="h-48 animate-pulse rounded-xl bg-(--color-bg-tint)" />
      )}
      {!isLoading && (isError || !data) && (
        <PerformanceEmptyState
          title="Bowling-side analysis unavailable"
          description="Bowling-angle classification is not available."
        />
      )}
      {!isLoading && data && (
        <PerformanceTable
          rows={data.items}
          getRowKey={(row) => row.angle}
          minWidth={700}
          columns={[
            {
              key: "angle",
              header: "Bowling side",
              render: (row) => row.angle.replaceAll("_", " "),
            },
            {
              key: "wickets",
              header: "Wkts",
              align: "center",
              render: (row) => row.wickets,
            },
            {
              key: "runs",
              header: "Runs",
              align: "center",
              render: (row) => row.runsConceded,
            },
            {
              key: "average",
              header: "Avg",
              align: "center",
              render: (row) => fmt(row.average),
            },
            {
              key: "economy",
              header: "Eco",
              align: "center",
              render: (row) => fmt(row.economy),
            },
          ]}
        />
      )}
    </PerformanceSection>
  );
}
