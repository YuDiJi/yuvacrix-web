import type {
  BattingCurrentForm,
  BattingOverallStats,
} from "@/types/cricket/performance";

import BattingFormChart from "../charts/BattingFormChart";
import PerformanceInsight from "../components/PerformanceInsight";
import PerformanceSection from "../components/PerformanceSection";

type BattingPlayingStyleProps = {
  overall: BattingOverallStats;
  currentForm: BattingCurrentForm;
};

export default function BattingPlayingStyle({
  overall,
  currentForm,
}: BattingPlayingStyleProps) {
  const firstTenStrikeRate =
    overall.balls > 0 ? Math.min(overall.strikeRate ?? 0, 999) : null;

  return (
    <PerformanceSection
      title="Playing style"
      description="Scoring progression and batting tempo"
      showShare={false}
      helpText="See how you build your innings and understand your natural game style."
    >
      {currentForm.recentInnings.length > 1 ? (
        <BattingFormChart innings={currentForm.recentInnings} />
      ) : (
        <div className="py-8 text-center text-sm text-(--color-text-secondary)">
          More innings are required to display a form curve.
        </div>
      )}

      <div className="mt-4 space-y-3">
        <PerformanceInsight value={format(firstTenStrikeRate)}>
          Overall batting strike rate across recorded innings
        </PerformanceInsight>

        <PerformanceInsight value={overall.dotBalls}>
          Dot balls faced across completed matches
        </PerformanceInsight>
      </div>
    </PerformanceSection>
  );
}

function format(value: number | null) {
  return value === null ? "—" : value.toFixed(2);
}
