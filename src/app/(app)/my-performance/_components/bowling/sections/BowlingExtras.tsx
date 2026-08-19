import type { BowlingExtras as Data } from "@/types/cricket/performance";
import BowlingExtrasPieChart from "../charts/BowlingExtrasPieChart";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";

export default function BowlingExtras({ data }: { data: Data }) {
  return (
    <PerformanceSection
      title="Extras"
      description="Wide and no-ball distribution"
      helpText="See how many extra runs you've conceded and assess the control in your bowling."
      showShare={false}
    >
      <BowlingExtrasPieChart items={data.items} />
      <div className="mt-4 space-y-3">
        <PerformanceInsight value={data.wides.runs}>
          Runs conceded through wides
        </PerformanceInsight>
        <PerformanceInsight value={data.noBalls.runs}>
          Runs conceded through no-balls
        </PerformanceInsight>
      </div>
    </PerformanceSection>
  );
}
