"use client";

import { useMemo } from "react";
import { ChevronRight } from "lucide-react";

import type {
  BattingCurrentForm as BattingCurrentFormType,
  BattingRecentInnings,
} from "@/types/cricket/performance";

import BattingFormChart from "../charts/BattingFormChart";
import PerformanceInsight from "../components/PerformanceInsight";
import PerformanceSection from "../components/PerformanceSection";

type BattingCurrentFormProps = {
  currentForm: BattingCurrentFormType;
  onViewAll?: () => void;
};

export default function BattingCurrentForm({
  currentForm,
  onViewAll,
}: BattingCurrentFormProps) {
  const bestInnings = useMemo(() => {
    if (currentForm.recentInnings.length === 0) return null;

    return [...currentForm.recentInnings].sort((a, b) => {
      if (b.runs !== a.runs) return b.runs - a.runs;
      return b.strikeRate - a.strikeRate;
    })[0];
  }, [currentForm.recentInnings]);

  return (
    <PerformanceSection
      title="Current form"
      description={`Last ${currentForm.inningsConsidered} innings`}
      showShare={false}
      helpText="Check if you're in good batting form or need to improve"
    >
      <RecentInningsTable innings={currentForm.recentInnings} />

      {currentForm.recentInnings.length > 0 && (
        <button
          type="button"
          onClick={onViewAll}
          className="flex w-full items-center justify-center gap-1 border-x border-b border-(--color-bg-border) py-3 font-(family-name:--font-display) text-xs font-black uppercase tracking-wide text-(--color-brand)"
        >
          View all
          <ChevronRight size={14} />
        </button>
      )}

      <Divider label="Form summary" />

      <div className="space-y-3">
        <PerformanceInsight value={currentForm.runs}>
          Total runs in last {currentForm.inningsConsidered} innings
        </PerformanceInsight>

        <PerformanceInsight value={currentForm.dismissals}>
          Dismissed in last {currentForm.inningsConsidered} innings
        </PerformanceInsight>

        <PerformanceInsight value={currentForm.notOuts}>
          Not out in last {currentForm.inningsConsidered} innings
        </PerformanceInsight>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <MetricCard
          value={formatNumber(currentForm.strikeRate)}
          label="Strike rate"
        />

        <MetricCard value={formatNumber(currentForm.average)} label="Average" />

        <MetricCard
          value={`${currentForm.fours}/${currentForm.sixes}`}
          label="Fours / Sixes"
          helper={`${currentForm.fours + currentForm.sixes} boundaries`}
        />

        <MetricCard
          value={
            bestInnings
              ? `${bestInnings.runs}${bestInnings.isNotOut ? "*" : ""}`
              : "—"
          }
          label="Best recent score"
          helper={
            bestInnings
              ? `${bestInnings.runs} off ${bestInnings.balls}`
              : undefined
          }
        />
      </div>

      {currentForm.recentInnings.length > 1 && (
        <>
          <Divider label="Recent trend" />
          <BattingFormChart innings={currentForm.recentInnings} />
        </>
      )}
    </PerformanceSection>
  );
}

function RecentInningsTable({ innings }: { innings: BattingRecentInnings[] }) {
  if (innings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-8 text-center text-sm text-(--color-text-secondary)">
        No recent innings available.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-(--color-bg-border)">
      <div className="grid grid-cols-[58px_minmax(0,1fr)_42px_66px] bg-(--color-bg-tint) px-3 py-2">
        <TableHeading>Score</TableHeading>
        <TableHeading>Match</TableHeading>
        <TableHeading>Inn.</TableHeading>
        <TableHeading>Date</TableHeading>
      </div>

      <div className="divide-y divide-(--color-bg-border)">
        {innings.map((item) => (
          <div
            key={item.inningsId}
            className="grid grid-cols-[58px_minmax(0,1fr)_42px_66px] items-center gap-1 px-3 py-3"
          >
            <div>
              <p className="font-(family-name:--font-display) text-sm font-black text-(--color-text-primary)">
                {item.runs}({item.balls}){item.isNotOut ? "*" : ""}
              </p>
              <p className="mt-0.5 text-[9px] text-(--color-text-muted)">
                SR {formatNumber(item.strikeRate)}
              </p>
            </div>

            <div className="min-w-0 pr-2">
              <p className="truncate text-[11px] font-semibold text-(--color-text-primary)">
                <span className="text-(--color-brand)">
                  {item.representedTeamName}
                </span>{" "}
                <span className="text-(--color-text-muted)">vs</span>{" "}
                {item.opponentTeamName}
              </p>

              <p className="mt-1 truncate text-[9px] text-(--color-text-secondary)">
                Position {item.battingOrder ?? "—"}
                {item.dismissalType
                  ? ` · ${formatEnum(item.dismissalType)}`
                  : " · Not out"}
              </p>
            </div>

            <div className="text-center">
              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-(--color-bg-tint) px-2 font-(family-name:--font-display) text-xs font-black text-(--color-brand)">
                {item.inningsNumber}
              </span>
            </div>

            <p className="text-right text-[10px] font-medium text-(--color-text-secondary)">
              {formatDate(item.completedAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TableHeading({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] font-bold uppercase tracking-wide text-(--color-text-muted)">
      {children}
    </span>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-(--color-bg-border)" />
      <span className="font-(family-name:--font-display) text-[10px] font-black uppercase tracking-[0.18em] text-(--color-brand)">
        {label}
      </span>
      <div className="h-px flex-1 bg-(--color-bg-border)" />
    </div>
  );
}

function MetricCard({
  value,
  label,
  helper,
}: {
  value: string | number;
  label: string;
  helper?: string;
}) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-3 py-4 text-center">
      <p className="font-(family-name:--font-display) text-2xl font-black text-(--color-brand)">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-(--color-text-secondary)">
        {label}
      </p>
      {helper && (
        <p className="mt-1 text-[9px] text-(--color-text-muted)">{helper}</p>
      )}
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date);
}

function formatNumber(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  return value.toFixed(2);
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
