import type { BowlingByMatchInnings } from "@/types/performance";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";
import PerformanceTable from "../../batting/components/PerformanceTable";

const fmt = (value: number | null) => (value === null ? "—" : value.toFixed(2));

export default function BowlingInningsAnalysis({
  items,
}: {
  items: BowlingByMatchInnings[];
}) {
  const best = items.length
    ? [...items].sort((a, b) => b.stats.wickets - a.stats.wickets)[0]
    : null;

  return (
    <PerformanceSection
      title="Performance by match innings"
      description="First and second innings comparison"
      helpText="See how your performance changes across innings and plan your role better."
      showShare={false}
    >
      <PerformanceTable
        rows={items}
        getRowKey={(row) => row.key}
        minWidth={780}
        columns={[
          { key: "innings", header: "Innings", render: (row) => row.label },
          {
            key: "matches",
            header: "Matches",
            align: "center",
            render: (row) => row.stats.matches,
          },
          {
            key: "overs",
            header: "Overs",
            align: "center",
            render: (row) => row.stats.overs,
          },
          {
            key: "wickets",
            header: "Wkts",
            align: "center",
            render: (row) => row.stats.wickets,
          },
          {
            key: "runs",
            header: "Runs",
            align: "center",
            render: (row) => row.stats.runsConceded,
          },
          {
            key: "economy",
            header: "Eco",
            align: "center",
            render: (row) => fmt(row.stats.economy),
          },
          {
            key: "average",
            header: "Avg",
            align: "center",
            render: (row) => fmt(row.stats.average),
          },
          {
            key: "strikeRate",
            header: "SR",
            align: "center",
            render: (row) => fmt(row.stats.strikeRate),
          },
        ]}
      />
      {best && (
        <div className="mt-4">
          <PerformanceInsight value={best.stats.wickets}>
            Most wickets taken in {best.label.toLowerCase()}
          </PerformanceInsight>
        </div>
      )}
    </PerformanceSection>
  );
}
