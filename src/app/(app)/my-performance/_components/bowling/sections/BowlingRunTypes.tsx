import type { BowlingRunComposition } from "@/types/cricket/performance";
import BowlingRunTypesChart from "../charts/BowlingRunTypesChart";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";

export default function BowlingRunTypes({
  data,
}: {
  data: BowlingRunComposition;
}) {
  const percentage =
    data.totalDeliveries > 0
      ? ((data.fours + data.sixes) / data.totalDeliveries) * 100
      : 0;

  return (
    <PerformanceSection
      title="Types of runs"
      description={`${data.totalDeliveries} recorded deliveries`}
      helpText="See which types of runs batter score most often off your bowling and plan your strategy."
      showShare={false}
    >
      <BowlingRunTypesChart data={data} />
      <div className="mt-4">
        <PerformanceInsight value={`${percentage.toFixed(0)}%`}>
          Deliveries resulting in a four or six
        </PerformanceInsight>
      </div>
    </PerformanceSection>
  );
}
