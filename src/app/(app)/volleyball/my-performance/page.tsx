"use client";

import {
  Activity,
  ArrowUpRight,
  Award,
  ChevronRight,
  CircleDot,
  Crown,
  Flame,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Volleyball,
  Zap,
} from "lucide-react";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/cn";

import { Button } from "@/components/common/Button";

import { useGetMyVolleyballPerformanceQuery } from "@/store/api/volleyball/volleyballPerformanceApi";

import type {
  VolleyballPerformanceMatch,
  VolleyballPerformanceResult,
  VolleyballYearlyPerformance,
} from "@/types/volleyball/performance";

/* =========================================================
   PAGE
========================================================= */

export default function MyVolleyballPerformancePage() {
  const router = useRouter();

  const { data, isLoading, isFetching, isError, refetch } =
    useGetMyVolleyballPerformanceQuery();

  /* =====================================================
     STATES
  ===================================================== */

  if (isLoading) {
    return <PerformanceSkeleton />;
  }

  if (isError || !data) {
    return <PerformanceError onRetry={() => void refetch()} />;
  }

  if (data.metadata.qualifiedMatches === 0) {
    return (
      <PerformanceEmptyState
        onStartMatch={() => router.push("/volleyball/matches/create")}
      />
    );
  }

  const {
    overall,
    currentForm,
    yearly,
    byMatch,
    participation,
    pointComposition,
    metadata,
  } = data;

  /* =====================================================
     DERIVED DISPLAY VALUES
  ===================================================== */

  const winRate =
    overall.matchesPlayed > 0
      ? Math.round((overall.matchesWon / overall.matchesPlayed) * 100)
      : 0;

  const currentFormMatches = currentForm.matches ?? [];

  const recentHistory = byMatch.slice(0, 5);

  const pointTotal =
    pointComposition.serve + pointComposition.attack + pointComposition.block;

  const dominantPointType = getDominantPointType(pointComposition);

  return (
    <div className="min-h-full bg-(--color-bg-base) pb-24">
      {/* =================================================
          PERFORMANCE HERO
      ================================================= */}

      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-[28px] bg-(--color-navy) px-4 pb-4 pt-4 text-white shadow-[0_14px_35px_rgba(13,27,62,0.18)]">
          {/* decorative shapes */}

          <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-(--color-brand)/25 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-amber-400/10 blur-3xl" />

          {/* TOP */}

          <div className="relative flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-5 items-center rounded-full bg-(--color-brand) px-2 text-[7px] font-black uppercase tracking-[0.16em]">
                  Career
                </span>

                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/40">
                  Volleyball
                </span>
              </div>

              <h2 className="mt-2 font-(family-name:--font-display) text-[26px] font-black uppercase leading-none tracking-wide">
                Performance
              </h2>

              <p className="mt-1.5 text-[9px] text-white/45">
                Your completed match record
              </p>
            </div>

            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white/75 backdrop-blur-sm active:scale-90"
              aria-label="Refresh performance"
            >
              <RefreshCw
                size={16}
                className={cn(isFetching && "animate-spin")}
              />
            </button>
          </div>

          {/* PRIMARY SCORE */}

          <div className="relative mt-5 grid grid-cols-[1.2fr_0.8fr] gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3.5 backdrop-blur-sm">
              <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/40">
                Career Record
              </p>

              <div className="mt-2 flex items-end gap-2">
                <p className="font-(family-name:--font-display) text-4xl font-black leading-none">
                  {overall.matchesWon}
                </p>

                <p className="pb-0.5 text-[10px] font-bold text-white/45">
                  wins from {overall.matchesPlayed}
                </p>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-(--color-brand)"
                  style={{
                    width: `${Math.min(winRate, 100)}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[8px] text-white/40">Win rate</span>

                <span className="text-[10px] font-black">{winRate}%</span>
              </div>
            </div>

            <div className="rounded-2xl bg-(--color-brand) p-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15">
                <Zap size={15} />
              </div>

              <p className="mt-3 font-(family-name:--font-display) text-3xl font-black leading-none">
                {overall.totalCreditedPoints}
              </p>

              <p className="mt-1 text-[8px] font-bold uppercase tracking-wide text-white/70">
                Career Points
              </p>
            </div>
          </div>

          {/* QUICK STATS */}

          <div className="relative mt-3 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.05] py-3">
            <HeroMiniStat value={overall.matchesPlayed} label="Matches" />

            <HeroMiniStat value={overall.setsPlayed} label="Sets" />

            <HeroMiniStat value={overall.bestPlayerAwards} label="Awards" />
          </div>
        </div>
      </section>

      <main className="space-y-4 px-4 py-4">
        {/* =================================================
            CURRENT FORM
        ================================================= */}

        <section className="overflow-hidden rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
          <SectionHeader
            icon={<Flame size={15} />}
            title="Current Form"
            subtitle="Last 5 completed matches"
          />

          <div className="px-4 pb-4">
            {currentFormMatches.length > 0 ? (
              <>
                {/* RESULT STRIP */}

                <div className="flex items-center gap-2 rounded-2xl bg-(--color-bg-base) p-2.5">
                  <div className="flex flex-1 gap-1.5">
                    {currentFormMatches.map((match) => (
                      <FormResult key={match.matchId} result={match.result} />
                    ))}
                  </div>

                  <span className="shrink-0 text-[7px] font-black uppercase tracking-wide text-(--color-text-muted)">
                    Recent
                  </span>
                </div>

                {/* LATEST MATCH */}

                <FeaturedRecentMatch
                  match={currentFormMatches[0]}
                  onOpen={() =>
                    router.push(
                      `/volleyball/matches/${currentFormMatches[0].matchId}`,
                    )
                  }
                />
              </>
            ) : (
              <InlineEmpty message="No recent form yet." />
            )}
          </div>
        </section>

        {/* =================================================
            POINT PROFILE
        ================================================= */}

        <section className="overflow-hidden rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
          <SectionHeader
            icon={<Target size={15} />}
            title="Point Profile"
            subtitle="Where your credited points come from"
          />

          <div className="px-4 pb-4">
            {/* DOMINANT */}

            <div className="flex items-center justify-between rounded-2xl bg-(--color-bg-tint) px-3.5 py-3">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.14em] text-(--color-brand)">
                  Strongest Contribution
                </p>

                <p className="mt-1 text-base font-black text-(--color-text-primary)">
                  {dominantPointType.label}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--color-brand) text-white shadow-sm">
                {dominantPointType.icon}
              </div>
            </div>

            {/* POINT BREAKDOWN */}

            <div className="mt-3 grid grid-cols-3 gap-2">
              <PointTypeCard
                label="Attack"
                value={pointComposition.attack}
                percentage={getPercentage(pointComposition.attack, pointTotal)}
                icon={<Zap size={14} />}
              />

              <PointTypeCard
                label="Serve"
                value={pointComposition.serve}
                percentage={getPercentage(pointComposition.serve, pointTotal)}
                icon={<CircleDot size={14} />}
              />

              <PointTypeCard
                label="Block"
                value={pointComposition.block}
                percentage={getPercentage(pointComposition.block, pointTotal)}
                icon={<Shield size={14} />}
              />
            </div>

            {/* AVERAGES */}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <AverageCard
                value={formatDecimal(overall.creditedPointsPerMatch)}
                label="Points / Match"
              />

              <AverageCard
                value={formatDecimal(overall.creditedPointsPerSet)}
                label="Points / Set"
              />
            </div>
          </div>
        </section>

        {/* =================================================
            ROLE & PARTICIPATION
        ================================================= */}

        <section className="overflow-hidden rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
          <SectionHeader
            icon={<Activity size={15} />}
            title="Role & Participation"
            subtitle="How you've been used on court"
          />

          <div className="grid grid-cols-2 gap-2 px-4 pb-4">
            <RoleCard
              icon={<Crown size={16} />}
              value={participation.matchesAsCaptain}
              title="Captain"
              subtitle="matches"
            />

            <RoleCard
              icon={<Shield size={16} />}
              value={participation.matchesDesignatedLibero}
              title="Libero"
              subtitle="matches"
            />

            <RoleCard
              value={participation.substitutionsIn}
              title="Subbed In"
              subtitle="times"
            />

            <RoleCard
              value={participation.substitutionsOut}
              title="Subbed Out"
              subtitle="times"
            />

            {(participation.liberoEntries > 0 ||
              participation.liberoExits > 0) && (
              <>
                <RoleCard
                  value={participation.liberoEntries}
                  title="Libero Entries"
                  subtitle="times"
                />

                <RoleCard
                  value={participation.liberoExits}
                  title="Libero Exits"
                  subtitle="times"
                />
              </>
            )}
          </div>
        </section>

        {/* =================================================
            CAREER HIGHLIGHTS
        ================================================= */}

        <div className="grid grid-cols-2 gap-3">
          <CareerHighlight
            icon={<Award size={18} />}
            value={overall.bestPlayerAwards}
            label="Best Player"
            caption="Awards"
          />

          <CareerHighlight
            icon={<Volleyball size={18} />}
            value={overall.setsStarted}
            label="Sets Started"
            caption={`of ${overall.setsPlayed} played`}
          />
        </div>

        {/* =================================================
            YEARLY PERFORMANCE
        ================================================= */}

        {yearly.length > 0 && (
          <section className="overflow-hidden rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
            <SectionHeader
              icon={<Trophy size={15} />}
              title="Year by Year"
              subtitle="Career progression"
            />

            <div className="space-y-2 px-4 pb-4">
              {yearly.map((item) => (
                <YearPerformanceCard key={item.year} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            MATCH PERFORMANCE
        ================================================= */}

        <section className="overflow-hidden rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
          <SectionHeader
            icon={<Sparkles size={15} />}
            title="Match Performance"
            subtitle="Your latest match contributions"
          />

          <div className="space-y-2 px-4 pb-4">
            {recentHistory.length > 0 ? (
              recentHistory.map((match) => (
                <PerformanceMatchCard
                  key={match.matchId}
                  match={match}
                  onOpen={() =>
                    router.push(`/volleyball/matches/${match.matchId}`)
                  }
                />
              ))
            ) : (
              <InlineEmpty message="No completed match data available." />
            )}
          </div>
        </section>

        {/* =================================================
            COVERAGE
        ================================================= */}

        <div className="flex items-start gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-3.5 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-tint) text-(--color-brand)">
            <Activity size={15} />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-black text-(--color-text-primary)">
              Performance Coverage
            </p>

            <p className="mt-1 text-[8px] leading-4 text-(--color-text-muted)">
              Calculated from{" "}
              <span className="font-black text-(--color-text-primary)">
                {metadata.completedMatchesAnalyzed}
              </span>{" "}
              qualified completed matches.
            </p>

            <p className="mt-1 text-[7px] text-(--color-text-muted)">
              Updated {formatDateTime(metadata.generatedAt)}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   HERO MINI STAT
========================================================= */

function HeroMiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="font-(family-name:--font-display) text-lg font-black">
        {value}
      </p>

      <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-white/40">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 px-4 pb-3 pt-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-bg-tint) text-(--color-brand)">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-black text-(--color-text-primary)">
          {title}
        </p>

        {subtitle && (
          <p className="mt-0.5 text-[7px] text-(--color-text-muted)">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CURRENT FORM RESULT
========================================================= */

function FormResult({ result }: { result: VolleyballPerformanceResult }) {
  const label = result === "WIN" ? "W" : result === "LOSS" ? "L" : "T";

  return (
    <div
      className={cn(
        "flex h-8 flex-1 items-center justify-center rounded-xl text-[9px] font-black",

        result === "WIN" && "bg-emerald-500 text-white",

        result === "LOSS" && "bg-red-50 text-red-600",

        result === "TIE" && "bg-slate-200 text-slate-600",
      )}
    >
      {label}
    </div>
  );
}

/* =========================================================
   FEATURED RECENT MATCH
========================================================= */

function FeaturedRecentMatch({
  match,
  onOpen,
}: {
  match: VolleyballPerformanceMatch;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mt-3 w-full rounded-2xl border border-(--color-bg-border) px-3.5 py-3 text-left active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[7px] font-black uppercase tracking-wide text-(--color-text-muted)">
              Latest
            </span>

            <MatchResultBadge result={match.result} />
          </div>

          <p className="mt-1.5 truncate text-[11px] font-black text-(--color-text-primary)">
            {match.teamName}
          </p>

          <p className="mt-0.5 truncate text-[8px] text-(--color-text-muted)">
            vs {match.opponentTeamName}
          </p>
        </div>

        <div className="text-right">
          <p className="font-(family-name:--font-display) text-2xl font-black leading-none text-(--color-brand)">
            {match.totalCreditedPoints}
          </p>

          <p className="mt-1 text-[6px] font-bold uppercase tracking-wide text-(--color-text-muted)">
            Points
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <CompactMatchMetric value={match.attackPoints} label="ATK" />

        <CompactMatchMetric value={match.servePoints} label="SRV" />

        <CompactMatchMetric value={match.blockPoints} label="BLK" />

        <div className="ml-auto flex items-center text-(--color-text-muted)">
          <ChevronRight size={14} />
        </div>
      </div>

      {(match.wasCaptain || match.wasLibero || match.wonBestPlayerAward) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {match.wasCaptain && (
            <MiniBadge icon={<Crown size={9} />}>Captain</MiniBadge>
          )}

          {match.wasLibero && <MiniBadge>Libero</MiniBadge>}

          {match.wonBestPlayerAward && (
            <MiniBadge icon={<Award size={9} />}>Best Player</MiniBadge>
          )}
        </div>
      )}
    </button>
  );
}

/* =========================================================
   COMPACT MATCH METRIC
========================================================= */

function CompactMatchMetric({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-baseline gap-1 rounded-lg bg-(--color-bg-base) px-2 py-1.5">
      <span className="text-[10px] font-black text-(--color-text-primary)">
        {value}
      </span>

      <span className="text-[6px] font-black text-(--color-text-muted)">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   POINT TYPE CARD
========================================================= */

function PointTypeCard({
  label,
  value,
  percentage,
  icon,
}: {
  label: string;
  value: number;
  percentage: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-(--color-bg-base) p-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--color-bg-card) text-(--color-brand)">
        {icon}
      </div>

      <p className="mt-3 font-(family-name:--font-display) text-xl font-black leading-none text-(--color-text-primary)">
        {value}
      </p>

      <p className="mt-1 text-[7px] font-black uppercase tracking-wide text-(--color-text-secondary)">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-1">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-(--color-bg-border)">
          <div
            className="h-full rounded-full bg-(--color-brand)"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <span className="text-[6px] font-bold text-(--color-text-muted)">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   AVERAGE
========================================================= */

function AverageCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-(--color-bg-border) px-3 py-3">
      <div>
        <p className="font-(family-name:--font-display) text-xl font-black leading-none text-(--color-text-primary)">
          {value}
        </p>

        <p className="mt-1 text-[7px] font-bold uppercase tracking-wide text-(--color-text-muted)">
          {label}
        </p>
      </div>

      <ArrowUpRight size={14} className="text-(--color-brand)" />
    </div>
  );
}

/* =========================================================
   ROLE CARD
========================================================= */

function RoleCard({
  icon,
  value,
  title,
  subtitle,
}: {
  icon?: React.ReactNode;
  value: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl bg-(--color-bg-base) p-3">
      <div className="flex items-center justify-between">
        <p className="font-(family-name:--font-display) text-xl font-black text-(--color-text-primary)">
          {value}
        </p>

        {icon && <div className="text-(--color-brand)">{icon}</div>}
      </div>

      <p className="mt-1 text-[8px] font-black text-(--color-text-secondary)">
        {title}
      </p>

      <p className="mt-0.5 text-[7px] text-(--color-text-muted)">{subtitle}</p>
    </div>
  );
}

/* =========================================================
   CAREER HIGHLIGHT
========================================================= */

function CareerHighlight({
  icon,
  value,
  label,
  caption,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  caption: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[22px] bg-(--color-navy) p-4 text-white shadow-sm">
      <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-(--color-brand)/20" />

      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-(--color-secondary)">
        {icon}
      </div>

      <p className="relative mt-3 font-(family-name:--font-display) text-3xl font-black leading-none">
        {value}
      </p>

      <p className="relative mt-1 text-[8px] font-black uppercase tracking-wide">
        {label}
      </p>

      <p className="relative mt-0.5 text-[7px] text-white/40">{caption}</p>
    </div>
  );
}

/* =========================================================
   YEAR PERFORMANCE
========================================================= */

function YearPerformanceCard({ item }: { item: VolleyballYearlyPerformance }) {
  return (
    <div className="rounded-2xl bg-(--color-bg-base) p-3.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-(family-name:--font-display) text-xl font-black text-(--color-text-primary)">
            {item.year}
          </p>

          <p className="text-[7px] text-(--color-text-muted)">
            {item.matchesPlayed} matches · {item.setsPlayed} sets
          </p>
        </div>

        <div className="rounded-xl bg-(--color-brand) px-3 py-2 text-center text-white">
          <p className="text-sm font-black">{item.totalCreditedPoints}</p>

          <p className="text-[6px] font-bold uppercase">Points</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        <YearMetric label="Attack" value={item.attackPoints} />

        <YearMetric label="Serve" value={item.servePoints} />

        <YearMetric label="Block" value={item.blockPoints} />

        <YearMetric label="Awards" value={item.bestPlayerAwards} />
      </div>
    </div>
  );
}

function YearMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-(--color-bg-card) px-1 py-2 text-center">
      <p className="text-[10px] font-black text-(--color-text-primary)">
        {value}
      </p>

      <p className="mt-0.5 text-[6px] font-bold uppercase tracking-wide text-(--color-text-muted)">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   MATCH PERFORMANCE CARD
========================================================= */

function PerformanceMatchCard({
  match,
  onOpen,
}: {
  match: VolleyballPerformanceMatch;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl bg-(--color-bg-base) p-3 text-left active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <MatchResultMark result={match.result} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-black text-(--color-text-primary)">
            {match.opponentTeamName}
          </p>

          <p className="mt-0.5 truncate text-[7px] text-(--color-text-muted)">
            Playing for {match.teamName}
          </p>
        </div>

        <div className="text-right">
          <p className="font-(family-name:--font-display) text-lg font-black leading-none text-(--color-brand)">
            {match.totalCreditedPoints}
          </p>

          <p className="mt-0.5 text-[6px] uppercase text-(--color-text-muted)">
            pts
          </p>
        </div>

        <ChevronRight size={13} className="text-(--color-text-muted)" />
      </div>

      <div className="mt-2.5 flex items-center gap-2 border-t border-(--color-bg-border) pt-2.5">
        <span className="text-[7px] text-(--color-text-muted)">
          {formatShortDate(match.completedAt)}
        </span>

        <span className="h-1 w-1 rounded-full bg-(--color-bg-border)" />

        <span className="text-[7px] text-(--color-text-muted)">
          {match.setsPlayed} {match.setsPlayed === 1 ? "set" : "sets"}
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          {match.wasCaptain && <MiniBadge>C</MiniBadge>}

          {match.wasLibero && <MiniBadge>L</MiniBadge>}

          {match.wonBestPlayerAward && <MiniBadge>MVP</MiniBadge>}
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   RESULT MARK
========================================================= */

function MatchResultMark({ result }: { result: VolleyballPerformanceResult }) {
  const label = result === "WIN" ? "W" : result === "LOSS" ? "L" : "T";

  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-black",

        result === "WIN" && "bg-emerald-500 text-white",

        result === "LOSS" && "bg-red-50 text-red-600",

        result === "TIE" && "bg-slate-200 text-slate-600",
      )}
    >
      {label}
    </div>
  );
}

/* =========================================================
   RESULT BADGE
========================================================= */

function MatchResultBadge({ result }: { result: VolleyballPerformanceResult }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[6px] font-black uppercase",

        result === "WIN" && "bg-emerald-50 text-emerald-700",

        result === "LOSS" && "bg-red-50 text-red-600",

        result === "TIE" && "bg-slate-100 text-slate-600",
      )}
    >
      {result === "WIN" ? "Win" : result === "LOSS" ? "Loss" : "Tie"}
    </span>
  );
}

/* =========================================================
   MINI BADGE
========================================================= */

function MiniBadge({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex h-5 items-center gap-1 rounded-full bg-(--color-bg-tint) px-2 text-[6px] font-black uppercase tracking-wide text-(--color-brand)">
      {icon}

      {children}
    </span>
  );
}

/* =========================================================
   INLINE EMPTY
========================================================= */

function InlineEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-(--color-bg-base) px-4 py-5 text-center">
      <p className="text-[8px] text-(--color-text-muted)">{message}</p>
    </div>
  );
}

/* =========================================================
   EMPTY PAGE
========================================================= */

function PerformanceEmptyState({ onStartMatch }: { onStartMatch: () => void }) {
  return (
    <div className="min-h-full bg-(--color-bg-base) px-4 py-6">
      <div className="overflow-hidden rounded-[28px] bg-(--color-navy) text-white shadow-lg">
        <div className="px-5 py-7 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-(--color-brand)">
            <Volleyball size={28} />
          </div>

          <p className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase tracking-wide">
            Build Your Numbers
          </p>

          <p className="mx-auto mt-2 max-w-70 text-[9px] leading-5 text-white/50">
            Complete Volleyball matches and actively participate to start
            building your performance profile.
          </p>

          <Button fullWidth className="mt-5" onClick={onStartMatch}>
            Start a Match
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function PerformanceError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-full bg-(--color-bg-base) px-4 py-6">
      <div className="rounded-[26px] border border-red-100 bg-(--color-bg-card) px-5 py-7 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <Activity size={21} />
        </div>

        <p className="mt-3 text-sm font-black text-(--color-text-primary)">
          Performance unavailable
        </p>

        <p className="mx-auto mt-1 max-w-67.5 text-[9px] leading-5 text-(--color-text-muted)">
          We couldn&apos;t load your Volleyball performance right now.
        </p>

        <Button fullWidth className="mt-5" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function PerformanceSkeleton() {
  return (
    <div className="min-h-full bg-(--color-bg-base) px-4 pb-24 pt-4">
      <div className="h-72 animate-pulse rounded-[28px] bg-(--color-navy)" />

      <div className="mt-4 space-y-4">
        <div className="h-48 animate-pulse rounded-3xl bg-(--color-bg-card)" />

        <div className="h-64 animate-pulse rounded-3xl bg-(--color-bg-card)" />

        <div className="h-48 animate-pulse rounded-3xl bg-(--color-bg-card)" />

        <div className="h-72 animate-pulse rounded-3xl bg-(--color-bg-card)" />
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getPercentage(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function getDominantPointType(composition: {
  attack: number;
  serve: number;
  block: number;
}) {
  const entries = [
    {
      label: "Attack",
      value: composition.attack,
      icon: <Zap size={18} />,
    },
    {
      label: "Serve",
      value: composition.serve,
      icon: <CircleDot size={18} />,
    },
    {
      label: "Block",
      value: composition.block,
      icon: <Shield size={18} />,
    },
  ];

  return entries.reduce((best, current) =>
    current.value > best.value ? current : best,
  );
}

function formatDecimal(value: number) {
  if (!Number.isFinite(value)) {
    return "0.00";
  }

  return value.toFixed(2);
}

function formatShortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
