import type {
  BattingAnalysisResponse,
  BattingShotsData,
} from "@/types/performance";

import PerformanceEmptyState from "../components/PerformanceEmptyState";
import PerformanceInsight from "../components/PerformanceInsight";
import PerformanceSection from "../components/PerformanceSection";

type BattingShotsAnalysisProps = {
  response?: BattingAnalysisResponse<"SHOTS">;
  isLoading?: boolean;
  isError?: boolean;
};

export default function BattingShotsAnalysis({
  response,
  isLoading = false,
  isError = false,
}: BattingShotsAnalysisProps) {
  const data = response?.data as BattingShotsData | undefined;

  return (
    <PerformanceSection
      title="Shots analysis"
      description="Runs scored by shot type and field zone"
      showShare={false}
      helpText="Check which shots get you most runs and which shots get you out."
    >
      {isLoading && <SectionSkeleton />}

      {!isLoading && (isError || !data) && (
        <PerformanceEmptyState
          title="Shot analysis unavailable"
          description="Shot analytics could not be loaded for this player."
        />
      )}

      {!isLoading && data && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {data.byShotType.slice(0, 6).map((item) => (
              <div
                key={item.shotType}
                className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) p-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-(--color-brand)">
                  {formatEnum(item.shotType)}
                </p>
                <p className="mt-1 font-(family-name:--font-display) text-2xl font-black text-(--color-text-primary)">
                  {item.runs}
                </p>
                <p className="text-[10px] text-(--color-text-secondary)">
                  Runs
                </p>
              </div>
            ))}
          </div>

          {data.byShotType.length > 0 && (
            <div className="mt-4">
              <PerformanceInsight>
                Most productive shot:{" "}
                <strong className="text-(--color-brand)">
                  {formatEnum(
                    [...data.byShotType].sort((a, b) => b.runs - a.runs)[0]
                      .shotType,
                  )}
                </strong>
              </PerformanceInsight>
            </div>
          )}
        </>
      )}
    </PerformanceSection>
  );
}

function SectionSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-xl bg-(--color-bg-tint)"
        />
      ))}
    </div>
  );
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
