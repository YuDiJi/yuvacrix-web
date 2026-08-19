import type {
  BowlingAnalysisResponse,
  BowlingOverSlotData,
  BowlingOverSlotItem,
} from "@/types/cricket/performance";

import BowlingPositionChart from "../charts/BowlingPositionChart";

import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";
import PerformanceTable from "../../batting/components/PerformanceTable";

type Props = {
  response?: BowlingAnalysisResponse<"BOWLING_OVER_SLOT">;
  isLoading?: boolean;
  isError?: boolean;
};

export default function BowlingPositionAnalysis({
  response,
  isLoading = false,
  isError = false,
}: Props) {
  const data = response?.data as BowlingOverSlotData | undefined;

  return (
    <PerformanceSection
      title="Bowling position"
      description="Bowling performance across over ranges"
      helpText="Check when you're most effective as a bowler, powerplay, middle, or death overs."
      showShare
    >
      {isLoading && <SectionSkeleton />}

      {!isLoading && (isError || !data) && (
        <PerformanceEmptyState
          title="Bowling-position analysis unavailable"
          description="Over-slot bowling data could not be loaded."
        />
      )}

      {!isLoading && data && data.items.length === 0 && (
        <PerformanceEmptyState
          title="No bowling-position data"
          description="Complete more bowling innings to see your performance across over ranges."
        />
      )}

      {!isLoading && data && data.items.length > 0 && (
        <>
          <div className="mb-4 grid grid-cols-3 gap-2.5">
            <SummaryCard label="Over slots" value={data.items.length} />

            <SummaryCard label="Deliveries" value={data.recordedEvents} />

            <SummaryCard label="Slot size" value={`${data.slotSize} overs`} />
          </div>

          <BowlingPositionChart items={data.items} />

          <div className="mt-4 space-y-3">
            {data.insights.mostWicketsSlot && (
              <PerformanceInsight value={data.insights.mostWicketsSlot.value}>
                Most wickets in {data.insights.mostWicketsSlot.label}
              </PerformanceInsight>
            )}

            {data.insights.bestEconomySlot && (
              <PerformanceInsight
                value={formatNumber(data.insights.bestEconomySlot.value)}
              >
                Best economy in {data.insights.bestEconomySlot.label}
              </PerformanceInsight>
            )}

            {data.insights.mostDotBallsSlot && (
              <PerformanceInsight value={data.insights.mostDotBallsSlot.value}>
                Most dot balls in {data.insights.mostDotBallsSlot.label}
              </PerformanceInsight>
            )}
          </div>

          <div className="mt-4">
            <OverSlotCards items={data.items} />
          </div>

          <div className="mt-4">
            <PerformanceTable
              rows={data.items}
              getRowKey={(row) => row.slotKey}
              minWidth={920}
              emptyMessage="No over-slot statistics available."
              columns={[
                {
                  key: "slot",
                  header: "Overs",
                  render: (row) => (
                    <div>
                      <p className="whitespace-nowrap font-semibold text-(--color-text-primary)">
                        {row.label}
                      </p>

                      <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
                        {row.innings} innings
                      </p>
                    </div>
                  ),
                },
                {
                  key: "oversBowled",
                  header: "Bowled",
                  align: "center",
                  render: (row) => row.overs,
                },
                {
                  key: "runs",
                  header: "Runs",
                  align: "center",
                  render: (row) => row.runsConceded,
                },
                {
                  key: "wickets",
                  header: "Wkts",
                  align: "center",
                  render: (row) => row.wickets,
                },
                {
                  key: "dots",
                  header: "Dots",
                  align: "center",
                  render: (row) => row.dotBalls,
                },
                {
                  key: "economy",
                  header: "Eco",
                  align: "center",
                  render: (row) => formatNumber(row.economy),
                },
                {
                  key: "strikeRate",
                  header: "SR",
                  align: "center",
                  render: (row) => formatNumber(row.bowlingStrikeRate),
                },
                {
                  key: "dotPercentage",
                  header: "Dot %",
                  align: "center",
                  render: (row) => `${formatNumber(row.dotBallPercentage)}%`,
                },
              ]}
            />
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
                    {response.coverage.eligibleEvents} deliveries
                  </p>
                </div>

                <span className="rounded-full bg-(--color-brand)/10 px-3 py-1 font-(family-name:--font-display) text-xs font-black text-(--color-brand)">
                  {formatNumber(response.coverage.percentage)}%
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </PerformanceSection>
  );
}

function OverSlotCards({ items }: { items: BowlingOverSlotItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.slotKey}
          className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-(--color-bg-tint) px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-(family-name:--font-display) text-base font-black uppercase text-(--color-text-primary)">
                {item.label}
              </p>

              <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
                {item.overs} overs · {item.innings} innings
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-(--color-brand)/10 px-3 py-2 text-center">
              <p className="font-(family-name:--font-display) text-2xl font-black leading-none text-(--color-brand)">
                {item.wickets}
              </p>

              <p className="mt-1 text-[8px] font-bold uppercase tracking-wide text-(--color-brand)">
                Wickets
              </p>
            </div>
          </div>

          {/* Main metrics */}
          <div className="grid grid-cols-2 divide-x divide-y divide-(--color-bg-border) sm:grid-cols-4 sm:divide-y-0">
            <OverSlotMetric label="Runs" value={item.runsConceded} />

            <OverSlotMetric
              label="Economy"
              value={formatNumber(item.economy)}
            />

            <OverSlotMetric label="Dot balls" value={item.dotBalls} />

            <OverSlotMetric
              label="Strike rate"
              value={formatNumber(item.bowlingStrikeRate)}
            />
          </div>

          {/* Dot ball percentage */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold text-(--color-text-secondary)">
                Dot-ball percentage
              </p>

              <p className="whitespace-nowrap font-(family-name:--font-display) text-sm font-black text-(--color-brand)">
                {formatNumber(item.dotBallPercentage)}%
              </p>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-(--color-bg-border)">
              <div
                className="h-full rounded-full bg-(--color-brand) transition-[width] duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, item.dotBallPercentage),
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-2 py-4 text-center">
      <p className="font-(family-name:--font-display) text-xl font-black text-(--color-brand)">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-(--color-text-secondary)">
        {label}
      </p>
    </div>
  );
}

function OverSlotMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0 px-3 py-3 text-center">
      <p className="whitespace-nowrap font-(family-name:--font-display) text-lg font-black leading-none text-(--color-text-primary)">
        {value}
      </p>

      <p className="mt-1.5 whitespace-nowrap text-[8px] font-bold uppercase tracking-wide text-(--color-text-muted)">
        {label}
      </p>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-xl bg-(--color-bg-tint)"
          />
        ))}
      </div>

      <div className="h-80 animate-pulse rounded-xl bg-(--color-bg-tint)" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-xl bg-(--color-bg-tint)"
          />
        ))}
      </div>
    </div>
  );
}

function formatNumber(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
