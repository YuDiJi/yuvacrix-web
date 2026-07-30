import BowlingPositionChart, {
  type BowlingPositionChartItem,
} from "../charts/BowlingPositionChart";
import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceSection from "../../batting/components/PerformanceSection";

export default function BowlingPositionAnalysis({
  items = [],
}: {
  items?: BowlingPositionChartItem[];
}) {
  return (
    <PerformanceSection
      title="Bowling position"
      description="Overs, runs and wickets by bowling position"
      helpText="Check when you're most effective as a bowler, powerplay, middle, or death overs."
      showShare={false}
    >
      {items.length === 0 ? (
        <PerformanceEmptyState
          title="Bowling-position API pending"
          description="The backend will provide over-wise bowling-position data. This chart is ready."
        />
      ) : (
        <BowlingPositionChart items={items} />
      )}
    </PerformanceSection>
  );
}
