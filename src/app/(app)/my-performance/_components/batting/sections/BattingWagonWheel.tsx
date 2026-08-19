import type {
  BattingAnalysisResponse,
  BattingWagonWheelData,
} from "@/types/cricket/performance";

import WagonWheelChart from "../charts/WagonWheelChart";
import PerformanceEmptyState from "../components/PerformanceEmptyState";
import PerformanceInsight from "../components/PerformanceInsight";
import PerformanceSection from "../components/PerformanceSection";

type BattingWagonWheelProps = {
  response?: BattingAnalysisResponse<"WAGON_WHEEL">;
  isLoading?: boolean;
  isError?: boolean;
};

export default function BattingWagonWheel({
  response,
  isLoading = false,
  isError = false,
}: BattingWagonWheelProps) {
  const data = response?.data as BattingWagonWheelData | undefined;

  const productiveZone = data?.zones.length
    ? [...data.zones].sort((a, b) => b.runs - a.runs)[0]
    : null;

  return (
    <PerformanceSection
      title="Wagon wheel"
      description="Scoring directions from recorded wagon-wheel events"
      showShare={false}
      helpText="See your batting strengths and areas to improve with your wagon wheel"
    >
      {isLoading && (
        <div className="mx-auto h-72 w-72 animate-pulse rounded-full bg-(--color-bg-tint)" />
      )}

      {!isLoading && (isError || !data) && (
        <PerformanceEmptyState
          title="Wagon wheel unavailable"
          description="Wagon-wheel information has not been recorded for enough deliveries."
        />
      )}

      {!isLoading && data && (
        <>
          <WagonWheelChart data={data} />

          <div className="mt-4 space-y-3">
            <PerformanceInsight value={data.recordedEvents}>
              Recorded wagon-wheel events
            </PerformanceInsight>

            <PerformanceInsight value={data.totalRuns}>
              Runs represented in this wagon wheel
            </PerformanceInsight>

            {productiveZone && (
              <PerformanceInsight>
                Most productive region:{" "}
                <strong className="text-(--color-brand)">
                  {formatEnum(productiveZone.fieldZone)}
                </strong>
              </PerformanceInsight>
            )}
          </div>
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
