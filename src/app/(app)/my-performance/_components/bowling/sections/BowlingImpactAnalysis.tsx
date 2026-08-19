import type {
  BowlingAnalysisResponse,
  BowlingShotImpactData,
} from "@/types/cricket/performance";
import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceSection from "../../batting/components/PerformanceSection";

export default function BowlingImpactAnalysis({
  response,
  isLoading = false,
  isError = false,
}: {
  response?: BowlingAnalysisResponse<"SHOT_IMPACT">;
  isLoading?: boolean;
  isError?: boolean;
}) {
  const data = response?.data as BowlingShotImpactData | undefined;

  return (
    <PerformanceSection
      title="Impact analysis"
      description="Wickets by batter shot intent"
      helpText="See which shots of batters help you take the most wickets."
      showShare={false}
    >
      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-(--color-bg-tint)"
            />
          ))}
        </div>
      )}
      {!isLoading && (isError || !data) && (
        <PerformanceEmptyState
          title="Impact analysis unavailable"
          description="Shot-impact data has not been recorded for enough wicket events."
        />
      )}
      {!isLoading && data && (
        <div className="grid grid-cols-2 gap-3">
          {data.items.map((item) => (
            <div
              key={item.shotType}
              className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) p-4"
            >
              <p className="text-[10px] font-bold uppercase text-(--color-brand)">
                {item.shotType.replaceAll("_", " ")}
              </p>
              <p className="mt-2 font-(family-name:--font-display) text-2xl font-black text-(--color-text-primary)">
                {item.wickets}
              </p>
              <p className="text-[10px] text-(--color-text-secondary)">
                Wickets
              </p>
            </div>
          ))}
        </div>
      )}
    </PerformanceSection>
  );
}
