import PerformanceEmptyState from "../components/PerformanceEmptyState";
import PerformanceSection from "../components/PerformanceSection";

export type BattingPartnershipItem = {
  partnerPlayerId: string;
  partnerName: string;
  innings: number;
  partnershipRuns: number;
  playerRuns: number;
  partnerRuns: number;
};

type BattingPartnershipsProps = {
  items?: BattingPartnershipItem[];
};

export default function BattingPartnerships({
  items = [],
}: BattingPartnershipsProps) {
  return (
    <PerformanceSection
      title="Top 5 partnerships"
      description="Highest batting partnerships"
      showShare={false}
      helpText="Relive your top 5 batting partnership and the moments that mattered most."
    >
      {items.length === 0 ? (
        <PerformanceEmptyState
          title="Partnership API pending"
          description="The current performance API does not return partnership aggregates. This section is ready for the backend response."
        />
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((item) => (
            <article
              key={item.partnerPlayerId}
              className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) p-3.5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs text-(--color-text-secondary)">
                    With
                  </p>
                  <p className="truncate font-(family-name:--font-display) text-base font-black uppercase tracking-wide text-(--color-text-primary)">
                    {item.partnerName}
                  </p>
                </div>

                <span className="font-(family-name:--font-display) text-2xl font-black text-(--color-brand)">
                  {item.partnershipRuns}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Mini label="Innings" value={item.innings} />
                <Mini label="Your runs" value={item.playerRuns} />
                <Mini label="Partner" value={item.partnerRuns} />
              </div>
            </article>
          ))}
        </div>
      )}
    </PerformanceSection>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-(--color-bg-card) px-2 py-2">
      <p className="font-(family-name:--font-display) text-base font-black text-(--color-brand)">
        {value}
      </p>
      <p className="text-[9px] font-bold uppercase text-(--color-text-muted)">
        {label}
      </p>
    </div>
  );
}
