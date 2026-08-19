"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CalendarDays, ChevronDown, CircleDot, Swords } from "lucide-react";

import type {
  BattingPartnershipItem,
  BattingPartnershipsResponse,
} from "@/types/cricket/performance";

import PerformanceEmptyState from "../components/PerformanceEmptyState";
import PerformanceSection from "../components/PerformanceSection";

type Props = {
  data?: BattingPartnershipsResponse;
  isLoading?: boolean;
  isError?: boolean;
};

export default function BattingPartnerships({
  data,
  isLoading = false,
  isError = false,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const items = data?.items ?? [];

  const highestContribution = useMemo(() => {
    return items.reduce(
      (highest, item) =>
        Math.max(highest, item.profilePlayerRuns, item.partnerRuns),
      0,
    );
  }, [items]);

  function handleToggle(item: BattingPartnershipItem) {
    const id = getPartnershipId(item);

    setExpandedId((currentId) => (currentId === id ? null : id));
  }

  return (
    <PerformanceSection
      title="Top 5 partnerships"
      description="Your highest-scoring batting partnerships"
      helpText="Relive your top 5 batting partnership and the moments that mattered most."
      showShare={false}
    >
      {isLoading && <PartnershipsSkeleton />}

      {!isLoading && isError && (
        <PerformanceEmptyState
          title="Partnerships unavailable"
          description="We could not load your batting partnerships."
        />
      )}

      {!isLoading && !isError && data && items.length === 0 && (
        <PerformanceEmptyState
          title="No partnerships recorded"
          description="Complete more batting innings to see your top partnerships."
        />
      )}

      {!isLoading && !isError && data && items.length > 0 && (
        <>
          <div className="overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)">
            <div className="divide-y divide-(--color-bg-border)">
              {items.map((item) => {
                const id = getPartnershipId(item);

                return (
                  <PartnershipRow
                    key={id}
                    item={item}
                    highestContribution={highestContribution}
                    isExpanded={expandedId === id}
                    onToggle={() => handleToggle(item)}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 px-1">
            <p className="text-[9px] text-(--color-text-muted)">
              Tap a partnership to view details
            </p>

            <p className="text-[9px] text-(--color-text-muted)">
              Showing {data.metadata.returned} of{" "}
              {data.metadata.partnershipsFound}
            </p>
          </div>
        </>
      )}
    </PerformanceSection>
  );
}

function PartnershipRow({
  item,
  highestContribution,
  isExpanded,
  onToggle,
}: {
  item: BattingPartnershipItem;
  highestContribution: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const profileWidth = getBarWidth(item.profilePlayerRuns, highestContribution);

  const partnerWidth = getBarWidth(item.partnerRuns, highestContribution);

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={[
          "w-full px-2.5 py-2 text-left transition-colors",
          isExpanded
            ? "bg-(--color-bg-tint)"
            : "bg-(--color-bg-card) active:bg-(--color-bg-tint)",
        ].join(" ")}
      >
        <div className="grid grid-cols-[38px_minmax(0,1fr)_50px_minmax(0,1fr)_58px] items-center gap-1">
          {/* Left player */}
          <p className="truncate text-[9px] font-semibold text-(--color-text-secondary)">
            You
          </p>

          {/* Profile-player contribution */}
          <div className="flex min-w-0 justify-end">
            {item.profilePlayerRuns > 0 ? (
              <div
                className="flex h-7 min-w-[28px] items-center justify-end rounded-l-md bg-(--color-brand) px-1.5 transition-[width] duration-300"
                style={{
                  width: `${profileWidth}%`,
                }}
              >
                <span className="whitespace-nowrap font-(family-name:--font-display) text-[11px] font-black text-white">
                  {item.profilePlayerRuns}
                </span>
              </div>
            ) : (
              <div className="h-7 w-px bg-(--color-bg-border)" />
            )}
          </div>

          {/* Partnership total */}
          <div className="flex min-w-0 flex-col items-center">
            <p className="whitespace-nowrap font-(family-name:--font-display) text-[13px] font-black leading-none text-(--color-text-primary)">
              {item.partnershipRuns}
              <span className="ml-0.5 text-[8px] font-semibold text-(--color-text-muted)">
                ({item.legalBalls})
              </span>
            </p>

            <ChevronDown
              className={[
                "mt-0.5 h-3 w-3 text-(--color-text-muted) transition-transform duration-300",
                isExpanded ? "rotate-180" : "",
              ].join(" ")}
            />
          </div>

          {/* Partner contribution */}
          <div className="min-w-0">
            {item.partnerRuns > 0 ? (
              <div
                className="flex h-7 min-w-[28px] items-center rounded-r-md bg-(--color-sky) px-1.5 transition-[width] duration-300"
                style={{
                  width: `${partnerWidth}%`,
                }}
              >
                <span className="whitespace-nowrap font-(family-name:--font-display) text-[11px] font-black text-white">
                  {item.partnerRuns}
                </span>
              </div>
            ) : (
              <div className="h-7 w-px bg-(--color-bg-border)" />
            )}
          </div>

          {/* Partner name */}
          <p className="truncate text-right text-[9px] font-semibold text-(--color-text-secondary)">
            {item.partner.playerName}
          </p>
        </div>
      </button>

      <div
        className={[
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <PartnershipDetails item={item} />
        </div>
      </div>
    </div>
  );
}

function PartnershipDetails({ item }: { item: BattingPartnershipItem }) {
  const profilePercentage = getContributionPercentage(
    item.profilePlayerRuns,
    item.partnershipRuns,
  );

  const partnerPercentage = getContributionPercentage(
    item.partnerRuns,
    item.partnershipRuns,
  );

  const extrasPercentage = getContributionPercentage(
    item.extras,
    item.partnershipRuns,
  );

  return (
    <div className="border-t border-(--color-bg-border) bg-(--color-bg-tint) px-3 py-3">
      {/* Match */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[8px] font-bold uppercase tracking-wide text-(--color-text-muted)">
            Match
          </p>

          <p className="mt-0.5 truncate text-[11px] font-semibold text-(--color-text-primary)">
            <span className="text-(--color-brand)">
              {item.representedTeamName}
            </span>{" "}
            <span className="text-(--color-text-muted)">vs</span>{" "}
            {item.opponentTeamName}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-(--color-brand)/10 px-2 py-1 text-[8px] font-bold uppercase text-(--color-brand)">
          Innings {item.inningsNumber}
        </span>
      </div>

      {/* Main statistics */}
      <div className="mt-3 grid grid-cols-4 divide-x divide-(--color-bg-border) overflow-hidden rounded-lg border border-(--color-bg-border) bg-(--color-bg-card)">
        <CompactMetric label="Total" value={item.partnershipRuns} />

        <CompactMetric label="Balls" value={item.legalBalls} />

        <CompactMetric label="Extras" value={item.extras} />

        <CompactMetric label="Rank" value={`#${item.rank}`} />
      </div>

      {/* Contributions */}
      <div className="mt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[8px] font-bold uppercase tracking-wide text-(--color-text-muted)">
            Contribution
          </p>

          <p className="text-[9px] font-semibold text-(--color-text-secondary)">
            {item.profilePlayerRuns} + {item.partnerRuns}
            {item.extras > 0 ? ` + ${item.extras}` : ""}
          </p>
        </div>

        <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-(--color-bg-border)">
          {profilePercentage > 0 && (
            <div
              className="h-full bg-(--color-brand)"
              style={{
                width: `${profilePercentage}%`,
              }}
            />
          )}

          {partnerPercentage > 0 && (
            <div
              className="h-full bg-(--color-sky)"
              style={{
                width: `${partnerPercentage}%`,
              }}
            />
          )}

          {extrasPercentage > 0 && (
            <div
              className="h-full bg-(--color-six)"
              style={{
                width: `${extrasPercentage}%`,
              }}
            />
          )}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <ContributionDetail
            label="You"
            runs={item.profilePlayerRuns}
            fours={item.profilePlayerFours}
            sixes={item.profilePlayerSixes}
            percentage={profilePercentage}
            isProfilePlayer
          />

          <ContributionDetail
            label={item.partner.playerName}
            runs={item.partnerRuns}
            fours={item.partnerFours}
            sixes={item.partnerSixes}
            percentage={partnerPercentage}
          />
        </div>
      </div>

      {/* Additional details */}
      <div className="mt-3 space-y-2 border-t border-(--color-bg-border) pt-3">
        <DetailRow
          icon={<CalendarDays className="h-3.5 w-3.5" />}
          label="Date"
          value={formatFullDate(item.completedAt)}
        />

        <DetailRow
          icon={<Swords className="h-3.5 w-3.5" />}
          label="Partnership ended"
          value={formatEndReason(item)}
        />

        {item.wicketType && (
          <DetailRow
            icon={<CircleDot className="h-3.5 w-3.5" />}
            label="Wicket type"
            value={formatEnum(item.wicketType)}
          />
        )}
      </div>
    </div>
  );
}

function ContributionDetail({
  label,
  runs,
  fours,
  sixes,
  percentage,
  isProfilePlayer = false,
}: {
  label: string;
  runs: number;
  fours: number;
  sixes: number;
  percentage: number;
  isProfilePlayer?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-(--color-bg-border) bg-(--color-bg-card) px-2.5 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[8px] font-bold uppercase tracking-wide text-(--color-text-muted)">
            {label}
          </p>

          <p
            className={[
              "mt-1 font-(family-name:--font-display) text-lg font-black leading-none",
              isProfilePlayer ? "text-(--color-brand)" : "text-(--color-sky)",
            ].join(" ")}
          >
            {runs}
          </p>
        </div>

        <p className="shrink-0 text-[9px] font-bold text-(--color-text-secondary)">
          {formatPercentage(percentage)}%
        </p>
      </div>

      <p className="mt-1.5 whitespace-nowrap text-[8px] text-(--color-text-muted)">
        {fours}×4 · {sixes}×6
      </p>
    </div>
  );
}

function CompactMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0 px-1 py-2 text-center">
      <p className="whitespace-nowrap font-(family-name:--font-display) text-sm font-black text-(--color-text-primary)">
        {value}
      </p>

      <p className="mt-0.5 truncate text-[7px] font-bold uppercase tracking-wide text-(--color-text-muted)">
        {label}
      </p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-(--color-brand)">{icon}</span>

      <div className="min-w-0">
        <p className="text-[8px] font-bold uppercase tracking-wide text-(--color-text-muted)">
          {label}
        </p>

        <p className="mt-0.5 text-[10px] font-semibold leading-4 text-(--color-text-primary)">
          {value}
        </p>
      </div>
    </div>
  );
}

function PartnershipsSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-(--color-bg-border)">
      <div className="divide-y divide-(--color-bg-border)">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-11 animate-pulse bg-(--color-bg-tint)"
          />
        ))}
      </div>
    </div>
  );
}

function getPartnershipId(item: BattingPartnershipItem) {
  return `${item.matchId}-${item.inningsId}-${item.rank}`;
}

function getBarWidth(runs: number, highestContribution: number) {
  if (runs <= 0 || highestContribution <= 0) {
    return 0;
  }

  return Math.max(20, Math.min(100, (runs / highestContribution) * 100));
}

function getContributionPercentage(value: number, total: number) {
  if (total <= 0 || value <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (value / total) * 100));
}

function formatEndReason(item: BattingPartnershipItem) {
  if (item.endReason === "INNINGS_COMPLETED") {
    return "Innings completed";
  }

  if (item.endReason === "WICKET") {
    return item.wicketType
      ? `Wicket · ${formatEnum(item.wicketType)}`
      : "Wicket";
  }

  return formatEnum(item.endReason);
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatFullDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
