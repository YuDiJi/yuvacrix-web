import type { BattingByMatchInnings } from "@/types/performance";

import PerformanceInsight from "../components/PerformanceInsight";
import PerformanceSection from "../components/PerformanceSection";
import PerformanceTable from "../components/PerformanceTable";

type BattingInningsAnalysisProps = {
  items: BattingByMatchInnings[];
};

export default function BattingInningsAnalysis({
  items,
}: BattingInningsAnalysisProps) {
  const bestAverage = items.length
    ? [...items].sort(
        (a, b) => (b.stats.average ?? -1) - (a.stats.average ?? -1),
      )[0]
    : null;

  return (
    <PerformanceSection
      title="Performance by match innings"
      description="First and second innings comparison"
      showShare={false}
      helpText="See how your performance changes across innings and plan your role better."
    >
      <PerformanceTable
        rows={items}
        getRowKey={(row) => row.key}
        minWidth={760}
        columns={[
          {
            key: "innings",
            header: "Innings",
            render: (row) => row.label,
          },
          {
            key: "matches",
            header: "Matches",
            align: "center",
            render: (row) => row.stats.matches,
          },
          {
            key: "inningsCount",
            header: "Innings",
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
            key: "notOuts",
            header: "NO",
            align: "center",
            render: (row) => row.stats.notOuts,
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

      {bestAverage && (
        <div className="mt-4">
          <PerformanceInsight value={formatNumber(bestAverage.stats.average)}>
            Best batting average is in {bestAverage.label.toLowerCase()}
          </PerformanceInsight>
        </div>
      )}
    </PerformanceSection>
  );
}

function formatNumber(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
