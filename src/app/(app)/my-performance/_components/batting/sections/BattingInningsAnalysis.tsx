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
    ? [...items].sort((a, b) => (b.average ?? -1) - (a.average ?? -1))[0]
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
        getRowKey={(row) => String(row.inningsNumber)}
        minWidth={700}
        columns={[
          {
            key: "innings",
            header: "Inns No.",
            render: (row) => row.inningsNumber,
          },
          {
            key: "matches",
            header: "Matches",
            align: "center",
            render: (row) => row.matches,
          },
          {
            key: "inningsCount",
            header: "Innings",
            align: "center",
            render: (row) => row.innings,
          },
          {
            key: "runs",
            header: "Runs",
            align: "center",
            render: (row) => row.runs,
          },
          {
            key: "average",
            header: "Avg",
            align: "center",
            render: (row) => format(row.average),
          },
          {
            key: "strikeRate",
            header: "SR",
            align: "center",
            render: (row) => format(row.strikeRate),
          },
          {
            key: "notOuts",
            header: "NO",
            align: "center",
            render: (row) => row.notOuts,
          },
          {
            key: "fours",
            header: "4s",
            align: "center",
            render: (row) => row.fours,
          },
          {
            key: "sixes",
            header: "6s",
            align: "center",
            render: (row) => row.sixes,
          },
        ]}
      />

      {bestAverage && (
        <div className="mt-4">
          <PerformanceInsight value={format(bestAverage.average)}>
            Best batting average is in innings number{" "}
            {bestAverage.inningsNumber}
          </PerformanceInsight>
        </div>
      )}
    </PerformanceSection>
  );
}

function format(value: number | null) {
  return value === null ? "—" : value?.toFixed(2);
}
