import type { BowlingRecentInnings, BowlingStats } from "@/types/performance";
import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";

export default function BowlingCurrentForm({
  recentInnings,
  summary,
}: {
  recentInnings: BowlingRecentInnings[];
  summary: BowlingStats;
}) {
  return (
    <PerformanceSection
      title="Current form"
      description="Recent bowling spells"
      helpText="Check if you're in good bowling form or need to improve."
      showShare={false}
    >
      {recentInnings.length === 0 ? (
        <PerformanceEmptyState
          title="Recent bowling innings pending"
          description="The backend does not yet return recent bowling innings. This table is ready for that response."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-(--color-bg-border)">
          <div className="grid grid-cols-[76px_minmax(0,1fr)_50px_66px] bg-(--color-bg-tint) px-3 py-2 text-[9px] font-bold uppercase text-(--color-text-muted)">
            <span>O-M-R-W</span>
            <span>Match</span>
            <span>Ov.</span>
            <span>Date</span>
          </div>
          <div className="divide-y divide-(--color-bg-border)">
            {recentInnings.map((item) => (
              <div
                key={item.inningsId}
                className="grid grid-cols-[76px_minmax(0,1fr)_50px_66px] items-center gap-1 px-3 py-3"
              >
                <p className="font-(family-name:--font-display) text-sm font-black text-(--color-text-primary)">
                  {item.overs}-{item.maidens}-{item.runsConceded}-{item.wickets}
                </p>
                <p className="truncate text-[11px] font-semibold text-(--color-text-primary)">
                  <span className="text-(--color-brand)">
                    {item.representedTeamName}
                  </span>{" "}
                  <span className="text-(--color-text-muted)">vs</span>{" "}
                  {item.opponentTeamName}
                </p>
                <p className="text-center text-xs text-(--color-text-secondary)">
                  {item.overs}
                </p>
                <p className="text-right text-[10px] text-(--color-text-secondary)">
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  }).format(new Date(item.completedAt))}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3">
        <PerformanceInsight value={summary.wickets}>
          Total wickets in recorded bowling innings
        </PerformanceInsight>
        <PerformanceInsight
          value={summary.foursConceded + summary.sixesConceded}
        >
          Boundaries conceded
        </PerformanceInsight>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {[
          ["Best bowling", summary.bestBowling?.display ?? "—"],
          ["Dot balls", summary.dotBalls],
          ["4s conceded", summary.foursConceded],
          ["6s conceded", summary.sixesConceded],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-3 py-4 text-center"
          >
            <p className="font-(family-name:--font-display) text-2xl font-black text-(--color-brand)">
              {value}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase text-(--color-text-secondary)">
              {label}
            </p>
          </div>
        ))}
      </div>
    </PerformanceSection>
  );
}
