import type {
  BowlingAnalysisResponse,
  BowlingWagonWheelData,
} from "@/types/performance";
import BowlingWagonWheelChart from "../charts/BowlingWagonWheelChart";
import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";

export default function BowlingWagonWheel({
  response,
  isLoading = false,
  isError = false,
}: {
  response?: BowlingAnalysisResponse<"WAGON_WHEEL">;
  isLoading?: boolean;
  isError?: boolean;
}) {
  const data = response?.data as BowlingWagonWheelData | undefined;

  return (
    <PerformanceSection
      title="Wagon wheel"
      description="Scoring directions conceded from your bowling"
      helpText="See where batter score most of their runs off your bowling and find areas to improve."
      showShare={false}
    >
      {isLoading && (
        <div className="mx-auto h-72 w-72 animate-pulse rounded-full bg-(--color-bg-tint)" />
      )}
      {!isLoading && (isError || !data) && (
        <PerformanceEmptyState
          title="Wagon wheel unavailable"
          description="Wagon-wheel events have not been recorded for enough deliveries."
        />
      )}
      {!isLoading && data && (
        <>
          <BowlingWagonWheelChart data={data} />
          <div className="mt-4">
            <PerformanceInsight value={data.recordedEvents}>
              Recorded scoring events against your bowling
            </PerformanceInsight>
          </div>
        </>
      )}
    </PerformanceSection>
  );
}
