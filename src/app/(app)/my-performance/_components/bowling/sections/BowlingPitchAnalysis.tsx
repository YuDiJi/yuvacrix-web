import type { BowlingByPitchType } from "@/types/performance";
import PerformanceSection from "../../batting/components/PerformanceSection";
import PerformanceTable from "../../batting/components/PerformanceTable";

const fmt = (value: number | null) => (value === null ? "—" : value.toFixed(2));

export default function BowlingPitchAnalysis({
  items,
}: {
  items: BowlingByPitchType[];
}) {
  return (
    <PerformanceSection
      title="Pitch type analysis"
      description="Bowling performance across pitch surfaces"
      helpText="See how your bowling performance changes across different pitch types."
      showShare={false}
    >
      <PerformanceTable
        rows={items}
        getRowKey={(row) => row.key}
        minWidth={820}
        emptyMessage="Pitch-type bowling statistics are unavailable."
        columns={[
          { key: "pitch", header: "Pitch", render: (row) => row.label },
          {
            key: "innings",
            header: "Inns",
            align: "center",
            render: (row) => row.stats.innings,
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
        ]}
      />
    </PerformanceSection>
  );
}
