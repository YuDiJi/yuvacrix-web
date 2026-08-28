"use client";

import { Award, Medal, RefreshCw, Sparkles, Trophy } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";

import { useGetMyVolleyballAwardsQuery } from "@/store/api/volleyball/volleyballProfileApi";

import {
  VOLLEYBALL_AWARD_SCOPES,
  VOLLEYBALL_AWARD_TYPES,
  type VolleyballAwardItem,
  type VolleyballAwardQueryScope,
} from "@/types/volleyball/awards";

/* =========================================================
   LOCAL TYPES
========================================================= */

type AwardsFilter = "all" | "matches" | "tournaments";

/* =========================================================
   PAGE
========================================================= */

export default function VolleyballMyAwardsPage() {
  const [filter, setFilter] = useState<AwardsFilter>("all");

  const scope = getAwardScope(filter);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetMyVolleyballAwardsQuery({
      scope,
      skip: 0,
      limit: 20,
    });

  const awards = useMemo(() => {
    return data?.items ?? [];
  }, [data]);

  return (
    <div className="min-h-full bg-(--color-bg-base) pb-24">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="bg-(--color-navy) px-4 pb-5 pt-5 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/45">
              Volleyball
            </p>

            <h1 className="mt-1 font-(family-name:--font-display) text-2xl font-black uppercase tracking-wide">
              My Awards
            </h1>

            <p className="mt-1 text-[9px] text-white/50">
              Your match and tournament achievements
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--color-brand)">
            <Trophy size={20} />
          </div>
        </div>
      </section>

      <main className="px-4 py-4">
        {/* =================================================
            SUMMARY
        ================================================= */}

        {isLoading ? (
          <AwardsSummarySkeleton />
        ) : data ? (
          <AwardsSummary
            total={data.summary.total}
            bestPlayerAwards={data.summary.bestPlayerAwards}
            tournamentWins={data.summary.tournamentWins}
            tournamentRunnerUps={data.summary.tournamentRunnerUps}
          />
        ) : null}

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mt-5">
          <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2">
              <FilterChip
                selected={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All
              </FilterChip>

              <FilterChip
                selected={filter === "matches"}
                onClick={() => setFilter("matches")}
              >
                Match Awards
              </FilterChip>

              <FilterChip
                selected={filter === "tournaments"}
                onClick={() => setFilter("tournaments")}
              >
                Tournaments
              </FilterChip>
            </div>
          </div>
        </div>

        {/* =================================================
            FETCHING INDICATOR
        ================================================= */}

        {isFetching && !isLoading && (
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-(--color-bg-border)">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-(--color-brand)" />
          </div>
        )}

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="mt-5">
          {isLoading ? (
            <AwardsListSkeleton />
          ) : isError ? (
            <AwardsError onRetry={() => void refetch()} />
          ) : awards.length === 0 ? (
            <AwardsEmpty filter={filter} />
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wide text-(--color-text-secondary)">
                  Achievements
                </p>

                <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
                  {data?.pagination.total ?? awards.length}{" "}
                  {(data?.pagination.total ?? awards.length) === 1
                    ? "award"
                    : "awards"}
                </p>
              </div>

              <div className="space-y-3">
                {awards.map((award) => (
                  <AwardCard key={award.id} award={award} />
                ))}
              </div>

              {data?.pagination.hasMore && (
                <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3 text-center">
                  <p className="text-[9px] font-semibold text-(--color-text-muted)">
                    More awards are available.
                  </p>

                  <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
                    Pagination can be connected next.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function AwardsSummary({
  total,
  bestPlayerAwards,
  tournamentWins,
  tournamentRunnerUps,
}: {
  total: number;
  bestPlayerAwards: number;
  tournamentWins: number;
  tournamentRunnerUps: number;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
      {/* MAIN TOTAL */}

      <div className="relative overflow-hidden bg-(--color-bg-tint) px-5 py-5">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-(--color-brand)/10" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--color-brand) text-white shadow-sm">
            <Trophy size={25} />
          </div>

          <div>
            <p className="font-(family-name:--font-display) text-3xl font-black leading-none text-(--color-text-primary)">
              {total}
            </p>

            <p className="mt-1 text-[9px] font-black uppercase tracking-wide text-(--color-brand)">
              Total Awards
            </p>

            <p className="mt-1 text-[8px] text-(--color-text-muted)">
              Volleyball achievements earned
            </p>
          </div>
        </div>
      </div>

      {/* BREAKDOWN */}

      <div className="grid grid-cols-3 divide-x divide-(--color-bg-border)">
        <SummaryMetric
          icon={<Sparkles size={15} />}
          value={bestPlayerAwards}
          label="Best Player"
        />

        <SummaryMetric
          icon={<Trophy size={15} />}
          value={tournamentWins}
          label="Champion"
        />

        <SummaryMetric
          icon={<Medal size={15} />}
          value={tournamentRunnerUps}
          label="Runner-up"
        />
      </div>
    </section>
  );
}

function SummaryMetric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="px-2 py-3.5 text-center">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-brand)">
        {icon}
      </div>

      <p className="mt-2 text-sm font-black text-(--color-text-primary)">
        {value}
      </p>

      <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-(--color-text-muted)">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   AWARD CARD
========================================================= */

function AwardCard({ award }: { award: VolleyballAwardItem }) {
  const meta = getAwardMeta(award);

  return (
    <article className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
      <div className="px-3.5 py-3.5">
        <div className="flex items-start gap-3">
          {/* AWARD ICON */}

          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
              getAwardIconBackground(award.type),
            )}
          >
            {getAwardIcon(award.type)}
          </div>

          {/* DETAILS */}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-black text-(--color-text-primary)">
                  {award.title}
                </p>

                <p className="mt-1 text-[8px] font-black uppercase tracking-wide text-(--color-brand)">
                  {getAwardTypeLabel(award.type)}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-(--color-bg-base) px-2 py-1 text-[7px] font-black text-(--color-text-muted)">
                {formatAwardDate(award.awardedAt)}
              </span>
            </div>

            {award.description && (
              <p className="mt-2 text-[9px] leading-4 text-(--color-text-muted)">
                {award.description}
              </p>
            )}

            {/* CONTEXT */}

            <div className="mt-3 rounded-xl bg-(--color-bg-base) px-3 py-2.5">
              <p className="text-[8px] font-black text-(--color-text-primary)">
                {meta.primary}
              </p>

              {meta.secondary && (
                <p className="mt-1 text-[8px] text-(--color-text-muted)">
                  {meta.secondary}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="border-t border-(--color-bg-border) bg-(--color-bg-base)/60 px-3.5 py-2.5">
        <p className="text-[7px] font-black uppercase tracking-[0.14em] text-(--color-text-muted)">
          {award.scope === "MATCH"
            ? "Match Achievement"
            : "Tournament Achievement"}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   FILTER
========================================================= */

function FilterChip({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-full border px-4 text-[9px] font-black transition active:scale-[0.98]",
        selected
          ? "border-(--color-brand) bg-(--color-brand) text-white"
          : "border-(--color-bg-border) bg-(--color-bg-card) text-(--color-text-secondary)",
      )}
    >
      {children}
    </button>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function AwardsEmpty({ filter }: { filter: AwardsFilter }) {
  return (
    <div className="rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
        <Award size={22} className="text-(--color-brand)" />
      </div>

      <p className="mt-3 text-sm font-black text-(--color-text-primary)">
        {getEmptyTitle(filter)}
      </p>

      <p className="mx-auto mt-1 max-w-[285px] text-[10px] leading-5 text-(--color-text-muted)">
        {getEmptyMessage(filter)}
      </p>
    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function AwardsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-7 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
        <RefreshCw size={20} className="text-(--color-brand)" />
      </div>

      <p className="mt-3 text-sm font-black text-(--color-text-primary)">
        Unable to load awards
      </p>

      <p className="mx-auto mt-1 max-w-[280px] text-[10px] leading-5 text-(--color-text-muted)">
        We couldn&apos;t load your Volleyball achievements.
      </p>

      <Button fullWidth className="mt-4" onClick={onRetry}>
        <RefreshCw size={14} />
        Try Again
      </Button>
    </div>
  );
}

/* =========================================================
   SKELETONS
========================================================= */

function AwardsSummarySkeleton() {
  return (
    <div className="h-44 animate-pulse rounded-3xl bg-(--color-bg-card)" />
  );
}

function AwardsListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-36 animate-pulse rounded-2xl bg-(--color-bg-card)"
        />
      ))}
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getAwardScope(filter: AwardsFilter): VolleyballAwardQueryScope {
  switch (filter) {
    case "matches":
      return VOLLEYBALL_AWARD_SCOPES.MATCHES;

    case "tournaments":
      return VOLLEYBALL_AWARD_SCOPES.TOURNAMENTS;

    default:
      return VOLLEYBALL_AWARD_SCOPES.ALL;
  }
}

function getAwardMeta(award: VolleyballAwardItem): {
  primary: string;
  secondary: string | null;
} {
  if (award.scope === "MATCH" && award.match) {
    return {
      primary: award.match.teamName,
      secondary: `vs ${award.match.opponentTeamName}`,
    };
  }

  if (award.scope === "TOURNAMENT" && award.tournament) {
    return {
      primary: award.tournament.tournamentName,
      secondary: award.tournament.teamName,
    };
  }

  return {
    primary: award.title,
    secondary: null,
  };
}

function getAwardIcon(type: VolleyballAwardItem["type"]) {
  switch (type) {
    case VOLLEYBALL_AWARD_TYPES.BEST_PLAYER:
      return <Sparkles size={19} className="text-(--color-brand)" />;

    case VOLLEYBALL_AWARD_TYPES.TOURNAMENT_WINNER:
      return <Trophy size={19} className="text-amber-600" />;

    case VOLLEYBALL_AWARD_TYPES.TOURNAMENT_RUNNER_UP:
      return <Medal size={19} className="text-slate-500" />;

    default:
      return <Award size={19} className="text-(--color-brand)" />;
  }
}

function getAwardIconBackground(type: VolleyballAwardItem["type"]) {
  switch (type) {
    case VOLLEYBALL_AWARD_TYPES.TOURNAMENT_WINNER:
      return "bg-amber-50";

    case VOLLEYBALL_AWARD_TYPES.TOURNAMENT_RUNNER_UP:
      return "bg-slate-100";

    default:
      return "bg-(--color-bg-tint)";
  }
}

function getAwardTypeLabel(type: VolleyballAwardItem["type"]) {
  switch (type) {
    case VOLLEYBALL_AWARD_TYPES.BEST_PLAYER:
      return "Player of the Match";

    case VOLLEYBALL_AWARD_TYPES.TOURNAMENT_WINNER:
      return "Tournament Champion";

    case VOLLEYBALL_AWARD_TYPES.TOURNAMENT_RUNNER_UP:
      return "Tournament Runner-up";

    default:
      return type;
  }
}

function formatAwardDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getEmptyTitle(filter: AwardsFilter) {
  switch (filter) {
    case "matches":
      return "No match awards yet";

    case "tournaments":
      return "No tournament awards yet";

    default:
      return "Your trophy cabinet is waiting";
  }
}

function getEmptyMessage(filter: AwardsFilter) {
  switch (filter) {
    case "matches":
      return "Player of the Match awards you earn will appear here.";

    case "tournaments":
      return "Tournament championships and runner-up finishes will appear here.";

    default:
      return "Complete Volleyball matches and tournaments to start building your achievements.";
  }
}
