import WicketsByInningsChart, {
  type BowlingWicketsByInningsItem,
} from "../charts/WicketsByInningsChart";
import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceSection from "../../batting/components/PerformanceSection";

export default function BowlingWicketsByInnings({
  items = [],
}: {
  items?: BowlingWicketsByInningsItem[];
}) {
  return (
    <PerformanceSection
      title="Wickets in innings"
      description="Distribution of wickets per bowling innings"
      helpText="See how often you take three or five wickets in an innings and track your impact."
      showShare={false}
    >
      {items.length === 0 ? (
        <PerformanceEmptyState
          title="Wickets-in-innings API pending"
          description="The backend will provide wicket-count distribution per bowling spell. This chart is ready."
        />
      ) : (
        <WicketsByInningsChart items={items} />
      )}
    </PerformanceSection>
  );
}
