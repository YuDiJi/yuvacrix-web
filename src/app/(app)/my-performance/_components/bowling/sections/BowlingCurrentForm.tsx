import type {
  BowlingCurrentForm as BowlingCurrentFormData,
  BowlingRecentInnings,
} from "@/types/performance";

import PerformanceEmptyState from "../../batting/components/PerformanceEmptyState";
import PerformanceInsight from "../../batting/components/PerformanceInsight";
import PerformanceSection from "../../batting/components/PerformanceSection";

type Props = {
  data: BowlingCurrentFormData;
};

export default function BowlingCurrentForm({ data }: Props) {
  const bestRecentSpell =
    data.recentInnings.length > 0
      ? [...data.recentInnings].sort(compareBowlingSpells)[0]
      : null;

  const mostEconomicalSpell =
    data.recentInnings.length > 0
      ? [...data.recentInnings].sort(
          (a, b) =>
            a.economy - b.economy ||
            b.wickets - a.wickets ||
            a.runsConceded - b.runsConceded,
        )[0]
      : null;

  return (
    <PerformanceSection
      title="Current form"
      description={`Last ${data.innings} bowling innings`}
      helpText="Check if you're in good bowling form or need to improve."
      showShare={false}
    >
      {data.recentInnings.length === 0 ? (
        <PerformanceEmptyState
          title="No recent bowling innings"
          description="Complete a bowling innings to see your current form."
        />
      ) : (
        <>
          <RecentBowlingTable items={data.recentInnings} />

          <div className="mt-4 space-y-3">
            <PerformanceInsight value={data.wickets}>
              Wickets in your recent bowling innings
            </PerformanceInsight>

            <PerformanceInsight value={formatNumber(data.economy)}>
              Current-form economy rate
            </PerformanceInsight>

            {bestRecentSpell && (
              <PerformanceInsight
                value={`${bestRecentSpell.wickets}/${bestRecentSpell.runsConceded}`}
              >
                Best recent spell against {bestRecentSpell.opponentTeamName}
              </PerformanceInsight>
            )}

            {mostEconomicalSpell && (
              <PerformanceInsight
                value={formatNumber(mostEconomicalSpell.economy)}
              >
                Best recent economy against{" "}
                {mostEconomicalSpell.opponentTeamName}
              </PerformanceInsight>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <SummaryCard
              label="Best bowling"
              value={data.bestBowling?.display ?? "—"}
            />

            <SummaryCard label="Economy" value={formatNumber(data.economy)} />

            <SummaryCard label="Average" value={formatNumber(data.average)} />

            <SummaryCard
              label="Strike rate"
              value={formatNumber(data.strikeRate)}
            />

            <SummaryCard label="Dot balls" value={data.dotBalls} />

            <SummaryCard label="Maidens" value={data.maidens} />
          </div>
        </>
      )}
    </PerformanceSection>
  );
}

// function RecentBowlingTable({ items }: { items: BowlingRecentInnings[] }) {
//   return (
//     <div className="overflow-hidden rounded-xl border border-(--color-bg-border)">
//       <div className="grid grid-cols-[70px_minmax(120px,1fr)_46px_48px_58px] gap-2 bg-(--color-bg-tint) px-3 py-2">
//         <TableHeading>O-M-R-W</TableHeading>
//         <TableHeading>Match</TableHeading>
//         <TableHeading align="center">Eco</TableHeading>
//         <TableHeading align="center">Dots</TableHeading>
//         <TableHeading align="right">Date</TableHeading>
//       </div>

//       <div className="divide-y divide-(--color-bg-border)">
//         {items.map((item) => (
//           <div
//             key={item.inningsId}
//             className="grid grid-cols-[70px_minmax(120px,1fr)_46px_48px_58px] items-center gap-2 px-3 py-3"
//           >
//             <div>
//               <p className="font-(family-name:--font-display) text-sm font-black text-(--color-text-primary)">
//                 {item.overs}-{item.maidens}-{item.runsConceded}-{item.wickets}
//               </p>

//               <p className="mt-0.5 text-[9px] font-semibold uppercase text-(--color-text-muted)">
//                 Innings {item.inningsNumber}
//               </p>
//             </div>

//             <div className="min-w-0">
//               <p className="truncate text-[11px] font-semibold text-(--color-text-primary)">
//                 <span className="text-(--color-brand)">
//                   {item.representedTeamName}
//                 </span>{" "}
//                 <span className="text-(--color-text-muted)">vs</span>{" "}
//                 {item.opponentTeamName}
//               </p>

//               <p className="mt-1 text-[9px] text-(--color-text-muted)">
//                 {item.foursConceded} fours · {item.sixesConceded} sixes
//               </p>
//             </div>

//             <p className="text-center text-xs font-semibold text-(--color-text-secondary)">
//               {formatNumber(item.economy)}
//             </p>

//             <p className="text-center text-xs font-semibold text-(--color-text-secondary)">
//               {item.dotBalls}
//             </p>

//             <p className="text-right text-[10px] text-(--color-text-secondary)">
//               {formatDate(item.completedAt)}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

function RecentBowlingTable({ items }: { items: BowlingRecentInnings[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)">
      <div className="grid grid-cols-[94px_minmax(0,1fr)_54px] gap-3 bg-(--color-bg-tint) px-3 py-2">
        <TableHeading>O-M-R-W</TableHeading>
        <TableHeading>Match</TableHeading>
        <TableHeading align="right">Eco</TableHeading>
      </div>

      <div className="divide-y divide-(--color-bg-border)">
        {items.map((item) => (
          <div
            key={item.inningsId}
            className="grid grid-cols-[94px_minmax(0,1fr)_54px] items-center gap-3 px-3 py-3"
          >
            <div>
              <p className="whitespace-nowrap font-(family-name:--font-display) text-sm font-black text-(--color-text-primary)">
                {item.overs}-{item.maidens}-{item.runsConceded}-{item.wickets}
              </p>

              <p className="mt-0.5 whitespace-nowrap text-[9px] font-semibold uppercase text-(--color-text-muted)">
                Innings {item.inningsNumber}
              </p>
            </div>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-(--color-text-primary)">
                <span className="text-(--color-brand)">
                  {item.representedTeamName}
                </span>{" "}
                <span className="text-(--color-text-muted)">vs</span>{" "}
                {item.opponentTeamName}
              </p>

              <p className="mt-1 truncate text-[9px] text-(--color-text-muted)">
                {item.dotBalls} dots · {item.foursConceded} fours ·{" "}
                {item.sixesConceded} sixes · {formatDate(item.completedAt)}
              </p>
            </div>

            <p className="whitespace-nowrap text-right text-xs font-semibold text-(--color-text-secondary)">
              {formatNumber(item.economy)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-3 py-4 text-center">
      <p className="font-(family-name:--font-display) text-2xl font-black text-(--color-brand)">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-(--color-text-secondary)">
        {label}
      </p>
    </div>
  );
}

function TableHeading({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <span
      className={[
        "text-[9px] font-bold uppercase tracking-wide text-(--color-text-muted)",
        align === "center" ? "text-center" : "",
        align === "right" ? "text-right" : "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function compareBowlingSpells(
  a: BowlingRecentInnings,
  b: BowlingRecentInnings,
) {
  return (
    b.wickets - a.wickets ||
    a.runsConceded - b.runsConceded ||
    a.economy - b.economy ||
    b.dotBalls - a.dotBalls
  );
}

function formatNumber(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(date);
}
