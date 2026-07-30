import type {
  BowlingAnalysisResponse,
  BowlingBattingPositionData,
} from "@/types/performance";
import BattingPositionWicketsChart from "../charts/BattingPositionWicketsChart";
import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";

export default function BattingPositionWickets({
  response,
  isLoading = false,
  isError = false,
}: {
  response?: BowlingAnalysisResponse<"BATTING_POSITION_WICKETS">;
  isLoading?: boolean;
  isError?: boolean;
}) {
  const data = response?.data as BowlingBattingPositionData | undefined;
  const top = data?.items?.length
    ? [...data.items].sort((a, b) => b.wickets - a.wickets)[0]
    : null;

  return (
    <PerformanceSection
      title="Batting position-wise wickets"
      description="Wickets by opposition batting-order group"
      helpText="See which batting positions you take most of your wickets against and plan better."
      showShare={false}
    >
      {isLoading && (
        <div className="h-72 animate-pulse rounded-xl bg-(--color-bg-tint)" />
      )}
      {!isLoading && (isError || !data) && (
        <PerformanceEmptyState
          title="Batting-position wickets unavailable"
          description="Batting-order grouping is not available for enough wicket events."
        />
      )}
      {!isLoading && data && (
        <>
          <BattingPositionWicketsChart items={data.items} />
          {top && (
            <div className="mt-4">
              <PerformanceInsight value={`${top.percentage.toFixed(0)}%`}>
                Most wickets against {top.label.toLowerCase()}
              </PerformanceInsight>
            </div>
          )}
        </>
      )}
    </PerformanceSection>
  );
}
