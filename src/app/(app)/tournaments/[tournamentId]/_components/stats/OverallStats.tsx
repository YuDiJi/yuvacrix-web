// _components/stats/OverallStats.tsx

"use client";

import {
  Activity,
  AlertCircle,
  BarChart3,
  CircleDot,
  Gauge,
  Hand,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { useGetTournamentOverallStatsQuery } from "@/store/api/tournamentAnalyticsApi";

type Props = {
  tournamentId: string;
  teamId: string;
};

type StatCard = {
  label: string;
  value: string | number;
  icon: React.ComponentType<{
    className?: string;
  }>;
  wide?: boolean;
};

function formatStatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";

  if (Number.isInteger(value)) {
    return value;
  }

  return value.toFixed(2);
}

export default function OverallStats({ tournamentId, teamId }: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetTournamentOverallStatsQuery({
      tournamentId,
      query: {
        teamId,
        roundId: "ALL",
        groupId: "ALL",
      },
    });

  if (isLoading) {
    return <OverallStatsSkeleton />;
  }

  if (isError || !data) {
    return (
      <StatsMessage
        type="error"
        title="Unable to load tournament stats"
        description="Something went wrong while loading the overall tournament numbers."
        actionLabel="Try Again"
        onAction={refetch}
      />
    );
  }

  if (data.metadata.includedCompletedMatches === 0) {
    return (
      <StatsMessage
        title="No completed matches yet"
        description="Stats will appear after completed matches."
      />
    );
  }

  const summary = data.summary;

  const primaryStats: StatCard[] = [
    {
      label: "Matches",
      value: summary.matches,
      icon: Trophy,
    },
    {
      label: "Innings",
      value: summary.innings,
      icon: Activity,
    },
    {
      label: "Runs",
      value: summary.runs,
      icon: BarChart3,
    },
    {
      label: "Wickets",
      value: summary.wickets,
      icon: Target,
    },
    {
      label: "Legal Balls",
      value: summary.legalBalls,
      icon: CircleDot,
    },
    {
      label: "Overs",
      value: summary.overs,
      icon: Gauge,
    },
    {
      label: "Extras",
      value: summary.extras,
      icon: Sparkles,
    },
    {
      label: "Fours",
      value: summary.fours,
      icon: BarChart3,
    },
    {
      label: "Sixes",
      value: summary.sixes,
      icon: BarChart3,
    },
    {
      label: "Thirties",
      value: summary.thirties,
      icon: Trophy,
    },
    {
      label: "Fifties",
      value: summary.fifties,
      icon: Trophy,
    },
    {
      label: "Hundreds",
      value: summary.hundreds,
      icon: Trophy,
    },
    {
      label: "Dot Balls",
      value: summary.dotBalls,
      icon: CircleDot,
    },
    {
      label: "Maidens",
      value: summary.maidens,
      icon: Shield,
    },
    {
      label: "Catches",
      value: summary.catches,
      icon: Hand,
    },
    {
      label: "Caught Behind",
      value: summary.caughtBehind,
      icon: Hand,
    },
    {
      label: "Stumpings",
      value: summary.stumpings,
      icon: Target,
    },
    {
      label: "Run Outs",
      value: summary.runOuts,
      icon: Target,
    },
    {
      label: "Keeper Dismissals",
      value: summary.wicketKeeperDismissals,
      icon: Shield,
      wide: true,
    },
    {
      label: "Dismissals",
      value: summary.dismissals,
      icon: Target,
      wide: true,
    },
  ];

  const rateStats = [
    {
      label: "Run Rate",
      value: formatStatNumber(summary.runRate),
      suffix: "",
    },
    {
      label: "Boundary %",
      value: formatStatNumber(summary.boundaryPercentage),
      suffix: "%",
    },
    {
      label: "Boundary Frequency",
      value: formatStatNumber(summary.boundaryFrequency),
      suffix: "",
    },
    {
      label: "Dot Ball %",
      value: formatStatNumber(summary.dotBallPercentage),
      suffix: "%",
    },
    {
      label: "Dot Ball Frequency",
      value: formatStatNumber(summary.dotBallFrequency),
      suffix: "",
    },
  ];

  return (
    <div className="relative p-4 pb-24">
      {/* Summary banner */}
      <div className="overflow-hidden rounded-3xl bg-(--color-navy) p-5 text-white shadow-(--shadow-card)">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">
              Tournament Summary
            </p>

            <p className="mt-2 font-(family-name:--font-display) text-3xl font-black uppercase tracking-[0.04em]">
              {summary.runs} Runs
            </p>

            <p className="mt-1 text-sm text-white/70">
              Across {summary.matches} completed{" "}
              {summary.matches === 1 ? "match" : "matches"}
            </p>
          </div>

          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <BarChart3 className="size-6" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <SummaryMiniCard label="Wickets" value={summary.wickets} />

          <SummaryMiniCard label="Sixes" value={summary.sixes} />

          <SummaryMiniCard
            label="Run Rate"
            value={formatStatNumber(summary.runRate)}
          />
        </div>
      </div>

      {/* Main numbers */}
      <div className="mt-5">
        <SectionHeading
          title="Overall Numbers"
          description="Tournament totals from completed matches"
        />

        <div className="mt-3 grid grid-cols-3 gap-2">
          {primaryStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className={cn(
                  "min-w-0 rounded-xl border border-(--color-bg-border)",
                  "bg-(--color-bg-card) px-2.5 py-3 shadow-(--shadow-card)",
                  "flex flex-col items-center justify-center",
                )}
              >
                {/* <div className="flex size-7 items-center justify-center rounded-lg bg-(--color-bg-tint)">
                  <Icon className="size-3.5 text-(--color-brand)" />
                </div> */}

                <p className="mt-2.5 truncate font-(family-name:--font-display) text-xl font-black leading-none text-(--color-text-primary)">
                  {stat.value}
                </p>

                <p className="mt-1 truncate text-[9px] font-bold uppercase leading-tight tracking-[0.04em] text-(--color-text-muted)">
                  {stat.label}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      {/* Percentages and rates */}
      <div className="mt-6">
        <SectionHeading
          title="Rates & Percentages"
          description="Performance indicators calculated by the backend"
        />

        <div className="mt-3 space-y-3">
          {rateStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-4 shadow-(--shadow-card)"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-(--color-bg-tint)">
                  <Gauge className="size-5 text-(--color-brand)" />
                </div>

                <p className="text-sm font-bold text-(--color-text-primary)">
                  {stat.label}
                </p>
              </div>

              <p className="font-(family-name:--font-display) text-2xl font-black text-(--color-brand)">
                {stat.value}
                {stat.suffix}
              </p>
            </div>
          ))}
        </div>
      </div>

      {isFetching && (
        <div className="fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-(--color-navy) px-4 py-2 text-xs font-semibold text-white shadow-lg">
          <RefreshCw className="size-3.5 animate-spin" />
          Updating Stats
        </div>
      )}
    </div>
  );
}

function SummaryMiniCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 text-center">
      <p className="font-(family-name:--font-display) text-xl font-black">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white/60">
        {label}
      </p>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="font-(family-name:--font-display) text-lg font-black uppercase tracking-wider text-(--color-text-primary)">
        {title}
      </h3>

      <p className="mt-0.5 text-xs text-(--color-text-secondary)">
        {description}
      </p>
    </div>
  );
}

function OverallStatsSkeleton() {
  return (
    <div className="space-y-5 p-4">
      <div className="h-44 animate-pulse rounded-3xl bg-(--color-bg-card)" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-(--color-bg-card)"
          />
        ))}
      </div>
    </div>
  );
}

function StatsMessage({
  type = "empty",
  title,
  description,
  actionLabel,
  onAction,
}: {
  type?: "empty" | "error";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex min-h-80 items-center justify-center p-5">
      <div className="w-full max-w-sm rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-7 text-center shadow-(--shadow-card)">
        <div
          className={cn(
            "mx-auto flex size-16 items-center justify-center rounded-full",
            type === "error" ? "bg-red-50" : "bg-(--color-bg-tint)",
          )}
        >
          {type === "error" ? (
            <AlertCircle className="size-7 text-red-500" />
          ) : (
            <BarChart3 className="size-7 text-(--color-brand)" />
          )}
        </div>

        <h3 className="mt-5 font-(family-name:--font-display) text-xl font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-(--color-text-secondary)">
          {description}
        </p>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 rounded-2xl bg-(--color-brand) px-5 py-3 text-sm font-bold text-white"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
