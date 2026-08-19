import type {
  BowlingAnalysisResponse,
  BowlingBattingPositionData,
  BowlingBattingPositionGroupItem,
} from "@/types/cricket/performance";

import BattingPositionWicketsChart from "../charts/BattingPositionWicketsChart";

import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";

type BattingPositionWicketsProps = {
  response?: BowlingAnalysisResponse<"BATTING_POSITION_WICKETS">;
  isLoading?: boolean;
  isError?: boolean;
};

export default function BattingPositionWickets({
  response,
  isLoading = false,
  isError = false,
}: BattingPositionWicketsProps) {
  const data = response?.data as BowlingBattingPositionData | undefined;

  const recordedPositions =
    data?.byPosition.filter((item) => item.wickets > 0) ?? [];

  const topPosition =
    recordedPositions.length > 0
      ? [...recordedPositions].sort(
          (a, b) => b.wickets - a.wickets || a.battingOrder - b.battingOrder,
        )[0]
      : null;

  const topGroup = getGroup(data?.byGroup, "TOP_ORDER");
  const middleGroup = getGroup(data?.byGroup, "MIDDLE_ORDER");
  const lowerGroup = getGroup(data?.byGroup, "LOWER_ORDER");
  const tailGroup = getGroup(data?.byGroup, "TAIL");

  return (
    <PerformanceSection
      title="Batting position-wise wickets"
      description="Wickets by opposition batting position"
      helpText="See which batting positions you take most of your wickets against and plan better."
      showShare={false}
    >
      {isLoading && <SectionSkeleton />}

      {!isLoading && (isError || !data) && (
        <PerformanceEmptyState
          title="Batting-position analysis unavailable"
          description="Batting-order information could not be loaded for your wicket events."
        />
      )}

      {!isLoading && data && data.byPosition.length === 0 && (
        <PerformanceEmptyState
          title="No classified wicket events"
          description="Your wickets do not yet have batting-order information."
        />
      )}

      {!isLoading && data && data.byPosition.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-3 pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-(--color-text-muted)">
                Total wicket events
              </p>

              <p className="mt-0.5 font-(family-name:--font-display) text-xl font-black text-(--color-text-primary)">
                {data.eligibleWicketEvents}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wide text-(--color-text-muted)">
                Classified
              </p>

              <p className="mt-0.5 font-(family-name:--font-display) text-xl font-black text-(--color-brand)">
                {data.classifiedWicketEvents}
              </p>
            </div>
          </div>

          <BattingPositionWicketsChart items={data.byPosition} />

          <div className="mt-4 space-y-3">
            {topGroup && (
              <PerformanceInsight
                value={`${formatPercentage(topGroup.percentage)}%`}
              >
                Top-order wickets
              </PerformanceInsight>
            )}

            {middleGroup && (
              <PerformanceInsight
                value={`${formatPercentage(middleGroup.percentage)}%`}
              >
                Middle-order wickets
              </PerformanceInsight>
            )}

            {topPosition && (
              <PerformanceInsight value={topPosition.battingOrder}>
                Most successful exact batting position
              </PerformanceInsight>
            )}
          </div>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-(--color-bg-border)" />

            <span className="font-(family-name:--font-display) text-[10px] font-black uppercase tracking-[0.18em] text-(--color-brand)">
              Batting-order groups
            </span>

            <div className="h-px flex-1 bg-(--color-bg-border)" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {topGroup && <GroupCard item={topGroup} />}

            {middleGroup && <GroupCard item={middleGroup} />}

            {lowerGroup && <GroupCard item={lowerGroup} />}

            {tailGroup && <GroupCard item={tailGroup} />}
          </div>

          {response?.coverage && (
            <div className="mt-4 rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-(--color-text-muted)">
                    Data coverage
                  </p>

                  <p className="mt-1 text-xs font-semibold text-(--color-text-primary)">
                    {response.coverage.recordedEvents} of{" "}
                    {response.coverage.eligibleEvents} events
                  </p>
                </div>

                <span className="rounded-full bg-(--color-brand)/10 px-3 py-1 font-(family-name:--font-display) text-xs font-black uppercase text-(--color-brand)">
                  {formatPercentage(response.coverage.percentage)}%
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </PerformanceSection>
  );
}

function GroupCard({ item }: { item: BowlingBattingPositionGroupItem }) {
  return (
    <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-3 py-4 text-center">
      <p className="font-(family-name:--font-display) text-2xl font-black text-(--color-brand)">
        {item.wickets}
      </p>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-(--color-text-primary)">
        {item.label}
      </p>

      <p className="mt-1 text-[10px] text-(--color-text-secondary)">
        {formatPercentage(item.percentage)}% of wickets
      </p>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 animate-pulse rounded-xl bg-(--color-bg-tint)" />
      <div className="h-72 animate-pulse rounded-xl bg-(--color-bg-tint)" />

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl bg-(--color-bg-tint)"
          />
        ))}
      </div>
    </div>
  );
}

function getGroup(
  groups: BowlingBattingPositionGroupItem[] | undefined,
  group: BowlingBattingPositionGroupItem["group"],
) {
  return groups?.find((item) => item.group === group);
}

function formatPercentage(value: number) {
  if (!Number.isFinite(value)) return "0";

  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
