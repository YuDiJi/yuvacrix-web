import type { BattingByPitchType } from "@/types/performance";

import PerformanceSection from "../components/PerformanceSection";
import PerformanceTable from "../components/PerformanceTable";

type BattingPitchAnalysisProps = {
  items: BattingByPitchType[];
};

export default function BattingPitchAnalysis({
  items,
}: BattingPitchAnalysisProps) {
  return (
    <PerformanceSection
      title="Pitch type analysis"
      description="Batting performance across pitch conditions"
      showShare={false}
      helpText="See how your batting performance changes across different pitch types."
    >
      <PerformanceTable
        rows={items}
        getRowKey={(row) => row.pitchType}
        minWidth={780}
        emptyMessage="Pitch-type statistics are not available."
        columns={[
          {
            key: "pitch",
            header: "Pitch type",
            render: (row) => formatEnum(row.pitchType),
          },
          {
            key: "innings",
            header: "Inns",
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
    </PerformanceSection>
  );
}

function format(value: number | null) {
  return value === null ? "—" : value?.toFixed(2);
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
