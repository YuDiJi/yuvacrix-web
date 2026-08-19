import type { BowlingWicketTypes as Data } from "@/types/cricket/performance";
import WicketTypesPieChart from "../charts/WicketTypesPieChart";
import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";

export default function BowlingWicketTypes({ data }: { data: Data }) {
  const top = data.items.length
    ? [...data.items].sort((a, b) => b.wickets - a.wickets)[0]
    : null;

  return (
    <PerformanceSection
      title="Types of wickets"
      description={`${data.totalWickets} total wickets`}
      helpText="See how you usually take wickets and improve as a bowler."
      showShare={false}
    >
      {data.items.length === 0 ? (
        <PerformanceEmptyState
          title="No wicket data"
          description="No wicket-type records are available."
        />
      ) : (
        <>
          <WicketTypesPieChart items={data.items} />
          {top && (
            <div className="mt-4">
              <PerformanceInsight>
                Most wickets taken through{" "}
                <strong className="text-(--color-brand)">
                  {top.wicketType.replaceAll("_", " ").toLowerCase()}
                </strong>
              </PerformanceInsight>
            </div>
          )}
        </>
      )}
    </PerformanceSection>
  );
}
