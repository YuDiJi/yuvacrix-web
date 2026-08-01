import type { BattingByPosition } from "@/types/performance";

import BattingPositionChart from "../charts/BattingPositionChart";

import PerformanceEmptyState from "../components/PerformanceEmptyState";
import PerformanceInsight from "../components/PerformanceInsight";
import PerformanceSection from "../components/PerformanceSection";
import PerformanceTable from "../components/PerformanceTable";

type Props = {
  items: BattingByPosition[];
};

export default function BattingPositionAnalysis({ items }: Props) {
  const sortedItems = [...items].sort(
    (a, b) => a.battingPosition - b.battingPosition,
  );

  const mostUsedPosition =
    items.length > 0
      ? [...items].sort(
          (a, b) =>
            b.stats.innings - a.stats.innings ||
            b.stats.runs - a.stats.runs ||
            a.battingPosition - b.battingPosition,
        )[0]
      : null;

  const highestScoringPosition =
    items.length > 0
      ? [...items].sort(
          (a, b) =>
            b.stats.runs - a.stats.runs ||
            b.stats.highestScore - a.stats.highestScore,
        )[0]
      : null;

  const highestStrikeRatePosition =
    items.length > 0
      ? [...items]
          .filter((item) => item.stats.strikeRate !== null)
          .sort(
            (a, b) => (b.stats.strikeRate ?? 0) - (a.stats.strikeRate ?? 0),
          )[0]
      : null;

  return (
    <PerformanceSection
      title="Batting position"
      description="Performance by batting-order position"
      helpText="See which batting position suits you best based on your past performances."
      showShare={false}
    >
      {items.length === 0 ? (
        <PerformanceEmptyState
          title="Batting-position data unavailable"
          description="No completed batting innings are available for batting-position analysis."
        />
      ) : (
        <>
          <BattingPositionChart items={sortedItems} />

          <div className="mt-4 space-y-3">
            {mostUsedPosition && (
              <PerformanceInsight value={mostUsedPosition.battingPosition}>
                Most frequently used batting position
              </PerformanceInsight>
            )}

            {highestScoringPosition && (
              <PerformanceInsight value={highestScoringPosition.stats.runs}>
                Runs scored from {highestScoringPosition.label.toLowerCase()}
              </PerformanceInsight>
            )}

            {highestStrikeRatePosition && (
              <PerformanceInsight
                value={formatNumber(highestStrikeRatePosition.stats.strikeRate)}
              >
                Best strike rate at{" "}
                {highestStrikeRatePosition.label.toLowerCase()}
              </PerformanceInsight>
            )}
          </div>

          <div className="mt-4">
            <PerformanceTable
              rows={sortedItems}
              getRowKey={(row) => String(row.battingPosition)}
              minWidth={980}
              emptyMessage="No batting-position statistics available."
              columns={[
                {
                  key: "position",
                  header: "Position",
                  render: (row) => (
                    <div>
                      <p className="font-semibold text-(--color-text-primary)">
                        {row.label}
                      </p>

                      <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
                        {formatGroup(row.group)}
                      </p>
                    </div>
                  ),
                },
                {
                  key: "innings",
                  header: "Inns",
                  align: "center",
                  render: (row) => row.stats.innings,
                },
                {
                  key: "runs",
                  header: "Runs",
                  align: "center",
                  render: (row) => row.stats.runs,
                },
                {
                  key: "balls",
                  header: "Balls",
                  align: "center",
                  render: (row) => row.stats.balls,
                },
                {
                  key: "highestScore",
                  header: "HS",
                  align: "center",
                  render: (row) =>
                    `${row.stats.highestScore}${
                      row.stats.highestScoreNotOut ? "*" : ""
                    }`,
                },
                {
                  key: "average",
                  header: "Avg",
                  align: "center",
                  render: (row) => formatNumber(row.stats.average),
                },
                {
                  key: "strikeRate",
                  header: "SR",
                  align: "center",
                  render: (row) => formatNumber(row.stats.strikeRate),
                },
                {
                  key: "fours",
                  header: "4s",
                  align: "center",
                  render: (row) => row.stats.fours,
                },
                {
                  key: "sixes",
                  header: "6s",
                  align: "center",
                  render: (row) => row.stats.sixes,
                },
              ]}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <SummaryCard label="Positions" value={items.length} />

            <SummaryCard
              label="Total runs"
              value={items.reduce((total, item) => total + item.stats.runs, 0)}
            />

            <SummaryCard
              label="Total innings"
              value={items.reduce(
                (total, item) => total + item.stats.innings,
                0,
              )}
            />
          </div>
        </>
      )}
    </PerformanceSection>
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

function formatNumber(value: number | null) {
  if (value === null) return "—";

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formatGroup(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
