// helpText="See how often you take three or five wickets in an innings and track your impact."

import type {
  BowlingWicketsByInningsData,
  BowlingWicketsByInningsItem,
} from "@/types/performance";

import WicketsByInningsChart from "../charts/WicketsByInningsChart";

import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";

type Props = {
  data: BowlingWicketsByInningsData;
};

export default function BowlingWicketsByInnings({ data }: Props) {
  const mostCommonBucket = getMostCommonBucket(data.items);

  const wicketTakingInnings = data.items.reduce(
    (total, item) => (item.wicketBucket > 0 ? total + item.innings : total),
    0,
  );

  const wicketTakingPercentage =
    data.totalBowlingInnings > 0
      ? (wicketTakingInnings / data.totalBowlingInnings) * 100
      : 0;

  return (
    <PerformanceSection
      title="Wickets in innings"
      description="Distribution of wickets across bowling innings"
      helpText="See how often you take three or five wickets in an innings and track your impact."
      showShare
    >
      {data.items.length === 0 ? (
        <PerformanceEmptyState
          title="No wicket distribution available"
          description="Complete more bowling innings to see your wickets-per-innings distribution."
        />
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-2">
            <SummaryCard label="Innings" value={data.totalBowlingInnings} />

            <SummaryCard label="With wickets" value={wicketTakingInnings} />

            <SummaryCard
              label="Wicketless"
              value={data.insights.wicketlessMatches}
            />
          </div>

          <WicketsByInningsChart items={data.items} />

          <div className="mt-4 space-y-3">
            {mostCommonBucket && (
              <PerformanceInsight value={mostCommonBucket.innings}>
                Innings with {mostCommonBucket.label.toLowerCase()}
              </PerformanceInsight>
            )}

            <PerformanceInsight
              value={`${formatPercentage(wicketTakingPercentage)}%`}
            >
              Bowling innings where you took at least one wicket
            </PerformanceInsight>

            {data.insights.teamLossPercentageWhenWicketless !== null && (
              <PerformanceInsight
                value={`${formatPercentage(
                  data.insights.teamLossPercentageWhenWicketless,
                )}%`}
              >
                Team loss rate in decided matches when you went wicketless
              </PerformanceInsight>
            )}

            {data.insights.teamWinPercentageWithThreePlusWickets !== null && (
              <PerformanceInsight
                value={`${formatPercentage(
                  data.insights.teamWinPercentageWithThreePlusWickets,
                )}%`}
              >
                Team win rate in decided matches when you took three or more
                wickets
              </PerformanceInsight>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {data.items.map((item) => (
              <WicketBucketRow
                key={item.wicketBucket}
                item={item}
                totalInnings={data.totalBowlingInnings}
              />
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3">
            <p className="text-xs leading-5 text-(--color-text-secondary)">
              Based on{" "}
              <strong className="text-(--color-text-primary)">
                {data.totalBowlingInnings} bowling innings
              </strong>
              . Match-result insights only use decided matches.
            </p>
          </div>
        </>
      )}
    </PerformanceSection>
  );
}

function WicketBucketRow({
  item,
  totalInnings,
}: {
  item: BowlingWicketsByInningsItem;
  totalInnings: number;
}) {
  const progress =
    totalInnings > 0
      ? Math.min(100, Math.max(0, (item.innings / totalInnings) * 100))
      : 0;

  return (
    <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-(--color-text-primary)">
            {item.label}
          </p>

          <p className="mt-0.5 text-[9px] text-(--color-text-muted)">
            {formatPercentage(item.percentage)}% of innings
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-(family-name:--font-display) text-xl font-black leading-none text-(--color-brand)">
            {item.innings}
          </p>

          <p className="mt-1 text-[8px] font-bold uppercase text-(--color-text-muted)">
            Innings
          </p>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-(--color-bg-border)">
        <div
          className="h-full rounded-full bg-(--color-brand) transition-[width] duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
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
    <div className="min-w-0 rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-2 py-3 text-center">
      <p className="whitespace-nowrap font-(family-name:--font-display) text-xl font-black text-(--color-brand)">
        {value}
      </p>

      <p className="mt-1 truncate text-[8px] font-bold uppercase tracking-wide text-(--color-text-secondary)">
        {label}
      </p>
    </div>
  );
}

function getMostCommonBucket(items: BowlingWicketsByInningsItem[]) {
  if (items.length === 0) {
    return null;
  }

  return [...items].sort(
    (a, b) => b.innings - a.innings || a.wicketBucket - b.wicketBucket,
  )[0];
}

function formatPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
