"use client";

import {
  Activity,
  BarChart3,
  ChevronRight,
  Play,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Users,
  Volleyball,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { S3Image } from "@/components/common/S3Image";
import { getInitials } from "@/lib/getInitials";
import {
  VOLLEYBALL_TEAM_A_FALLBACK_COLOR,
  VOLLEYBALL_TEAM_B_FALLBACK_COLOR,
  getReadableTextColor,
  resolveVolleyballTeamColor,
} from "@/lib/volleyball/teamColors";
import {
  formatVolleyballTournamentFormat,
  formatVolleyballTournamentStage,
} from "@/lib/volleyball/tournamentFormat";
import { useGetVolleyballHomeQuery } from "@/store/api/volleyball/volleyballHomeApi";
import type {
  VolleyballHomeAward,
  VolleyballHomeRecentMatch,
  VolleyballHomeResponse,
  VolleyballHomeSeasonMetric,
  VolleyballHomeTournament,
  VolleyballHomeViewer,
} from "@/types/volleyball/home";

const QUICK_ACTIONS = [
  {
    title: "Score a match",
    description: "Record live sets and points",
    href: "/volleyball/matches/create",
    icon: Play,
    tone: "orange",
  },
  {
    title: "Create tournament",
    description: "Create your tournament format",
    href: "/volleyball/tournaments/create",
    icon: Trophy,
    tone: "blue",
  },
  {
    title: "My Volleyball",
    description: "Matches, tournaments and more",
    href: "/volleyball/my-volleyball",
    icon: Users,
    tone: "green",
  },
] as const;

const toneClasses = {
  orange: {
    soft: "bg-orange-50",
    text: "text-(--color-brand)",
    solid: "bg-(--color-brand)",
  },
  blue: { soft: "bg-blue-50", text: "text-blue-500", solid: "bg-blue-500" },
  green: {
    soft: "bg-emerald-50",
    text: "text-emerald-600",
    solid: "bg-emerald-500",
  },
  purple: {
    soft: "bg-violet-50",
    text: "text-violet-500",
    solid: "bg-violet-500",
  },
} as const;

export default function VolleyballHomePage() {
  const { currentData, isLoading, isError, refetch } =
    useGetVolleyballHomeQuery();
  const showInitialLoading = isLoading && !currentData;
  const showInitialError = isError && !currentData;

  return (
    <div className="min-h-full overflow-x-hidden scrollbar-none bg-(--color-bg-base) pb-16">
      <main className="space-y-7 px-4 py-4">
        <VolleyballHomeHero viewer={currentData?.viewer ?? null} />
        <HomeQuickActions />
        {showInitialLoading ? (
          <HomeSkeleton />
        ) : showInitialError ? (
          <HomeError onRetry={() => void refetch()} />
        ) : currentData ? (
          <>
            <HomeSeasonStats seasonSummary={currentData.seasonSummary} />
            <HomeAwards
              awardSummary={currentData.awardSummary}
              awards={currentData.awards}
            />
            <HomeRecentMatch match={currentData.recentMatches[0] ?? null} />
            <HomeTournaments tournaments={currentData.tournaments} />
          </>
        ) : null}
      </main>
    </div>
  );
}

function VolleyballHomeHero({
  viewer,
}: {
  viewer: VolleyballHomeViewer | null;
}) {
  const viewerName = viewer?.fullName ?? "Welcome to Volleyball";
  const fallback = (
    <span className="flex h-full w-full items-center justify-center bg-white text-[10px] font-black text-blue-600">
      {getInitials(viewerName)}
    </span>
  );

  return (
    <section
      role="img"
      aria-label="Volleyball player jumping to hit the ball with Play Hard Rise Higher message"
      className="relative aspect-3/1 w-full overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 bg-contain bg-center bg-no-repeat shadow-[0_6px_18px_rgba(31,78,140,0.08)]"
      style={{
        backgroundImage: "url('/volleyball/home/volleyball banner.png')",
      }}
    >
      <div className="absolute left-3 top-3 flex max-w-[72%] items-center gap-2 rounded-full bg-white/90 px-2 py-1 shadow-[0_5px_16px_rgba(31,78,140,0.12)]">
        <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-blue-50">
          <S3Image
            imageKey={viewer?.profileImageUrl ?? null}
            alt={viewerName}
            width={28}
            height={28}
            className="h-full w-full object-cover"
            fallback={fallback}
          />
        </span>
        <span className="min-w-0 truncate text-[10px] font-black text-(--color-navy)">
          {viewerName}
        </span>
      </div>
    </section>
  );
}

function HomeQuickActions() {
  return (
    <section>
      <SectionHeading
        title="Quick actions"
        action="All actions"
        href="/volleyball/my-volleyball"
      />
      <div className="-mx-4 mt-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        <div className="flex w-max flex-nowrap gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="flex min-h-[104px] w-[220px] shrink-0 items-center gap-3 rounded-2xl border border-blue-100 bg-(--color-bg-card) p-3 shadow-[0_7px_20px_rgba(31,78,140,0.08)] transition active:scale-[0.99]"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${toneClasses[action.tone].soft} ${toneClasses[action.tone].text}`}
                >
                  <Icon size={22} strokeWidth={2.4} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block min-h-10 break-words text-sm font-black leading-5 text-(--color-navy)">
                    {action.title}
                  </span>
                  <span className="mt-1 block text-[10px] leading-4 text-slate-500">
                    {action.description}
                  </span>
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${toneClasses[action.tone].solid}`}
                >
                  <ChevronRight size={15} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HomeSeasonStats({
  seasonSummary,
}: {
  seasonSummary: VolleyballHomeResponse["seasonSummary"];
}) {
  const icons = [Activity, Target, Shield, Sparkles];
  const stats: Array<{
    label: string;
    metric: VolleyballHomeSeasonMetric;
    tone: keyof typeof toneClasses;
  }> = [
    { label: "Kills", metric: seasonSummary.kills, tone: "orange" },
    { label: "Aces", metric: seasonSummary.aces, tone: "blue" },
    { label: "Blocks", metric: seasonSummary.blocks, tone: "green" },
    { label: "Digs", metric: seasonSummary.digs, tone: "purple" },
  ];

  return (
    <section>
      <SectionHeading
        title="This season's numbers"
        action="View all stats"
        href="/volleyball/my-performance"
      />
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {stats.map((stat, index) => {
          const Icon = icons[index];
          const trend = formatTrend(stat.metric);
          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-blue-100 bg-(--color-bg-card) p-3 shadow-[0_7px_20px_rgba(31,78,140,0.08)]"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneClasses[stat.tone].soft} ${toneClasses[stat.tone].text}`}
                >
                  <Icon size={19} strokeWidth={2.4} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold text-slate-600">
                    {stat.label}
                  </p>
                  <p
                    className={`font-(family-name:--font-display) font-black leading-none text-(--color-navy) ${
                      stat.metric.supported && stat.metric.value !== null
                        ? "text-3xl"
                        : "text-xs"
                    }`}
                  >
                    {stat.metric.supported && stat.metric.value !== null
                      ? stat.metric.value
                      : "Not tracked"}
                  </p>
                </div>
              </div>
              <p className={`mt-3 text-[10px] font-bold ${trend.className}`}>
                {trend.label}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HomeAwards({
  awardSummary,
  awards,
}: {
  awardSummary: VolleyballHomeResponse["awardSummary"];
  awards: VolleyballHomeAward[];
}) {
  const visibleAwards = awards.slice(0, 3);

  return (
    <section>
      <SectionHeading
        title="Awards and badges"
        action="All Awards"
        href="/volleyball/my-awards"
      />
      <div className="-mx-4 mt-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        <div className="flex w-max gap-2.5">
          <article className="flex min-h-[112px] w-[225px] shrink-0 items-center gap-3 rounded-2xl border border-blue-100 bg-(--color-bg-card) p-3 shadow-[0_7px_20px_rgba(31,78,140,0.08)]">
            <AwardIcon iconKey="mvp" />
            <div className="min-w-0">
              <p className="text-xs font-black uppercase leading-4 text-(--color-navy)">
                {awardSummary.total} Total Awards
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-500">
                Season achievements
              </p>
            </div>
          </article>
          {visibleAwards.map((award) => (
            <article
              key={award.id}
              className="flex min-h-[112px] w-[225px] shrink-0 items-center gap-3 rounded-2xl border border-blue-100 bg-(--color-bg-card) p-3 shadow-[0_7px_20px_rgba(31,78,140,0.08)]"
            >
              <AwardIcon iconKey={award.iconKey} />
              <div className="min-w-0">
                <p className="text-xs font-black uppercase leading-4 text-(--color-navy)">
                  {award.title}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-500">
                  {award.subtitle ?? formatDateLabel(award.awardedAt)}
                </p>
              </div>
            </article>
          ))}
          {awards.length === 0 && (
            <article className="flex min-h-[112px] w-[225px] shrink-0 items-center rounded-2xl border border-dashed border-blue-100 bg-(--color-bg-card) p-3 text-[10px] font-bold text-slate-500">
              No awards yet
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

function AwardIcon({ iconKey }: { iconKey: string }) {
  const config = {
    mvp: { icon: Trophy, className: "bg-amber-50 text-amber-500" },
    spiker: { icon: Zap, className: "bg-orange-50 text-orange-500" },
    server: { icon: Target, className: "bg-rose-50 text-rose-500" },
  } as const;
  const normalizedKey = iconKey.toLowerCase();
  const kind = normalizedKey.includes("spik")
    ? "spiker"
    : normalizedKey.includes("serv") || normalizedKey.includes("ace")
      ? "server"
      : "mvp";
  const Icon = config[kind].icon;

  return (
    <span
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${config[kind].className}`}
    >
      <Icon size={30} strokeWidth={2.3} />
    </span>
  );
}

function HomeRecentMatch({
  match,
}: {
  match: VolleyballHomeRecentMatch | null;
}) {
  return (
    <section>
      <SectionHeading
        title="Recent matches"
        action="See all"
        href="/volleyball/my-volleyball?tab=matches&scope=all"
      />
      {!match ? (
        <CompactEmpty message="No recent matches yet" />
      ) : (
        <article className="mt-3 rounded-2xl border border-blue-100 bg-(--color-bg-card) p-3.5 shadow-[0_8px_24px_rgba(31,78,140,0.09)]">
          <div className="flex flex-wrap items-center justify-between gap-1.5 text-[9px] text-slate-500">
            <span>{formatMatchMeta(match)}</span>
            <span>{formatMatchDetail(match)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2.5">
              {[match.teamA, match.teamB].map((team, index) => {
                const color = resolveVolleyballTeamColor(
                  team.teamColor,
                  index === 0
                    ? VOLLEYBALL_TEAM_A_FALLBACK_COLOR
                    : VOLLEYBALL_TEAM_B_FALLBACK_COLOR,
                );

                return (
                  <div
                    key={team.teamId}
                    className="flex min-w-0 items-center gap-2"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-black"
                      style={{
                        backgroundColor: color,
                        color: getReadableTextColor(color),
                      }}
                    >
                      {team.shortName ?? getInitials(team.name)}
                    </span>
                    <span className="truncate text-[11px] font-black text-(--color-navy)">
                      {team.name}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="max-w-[185px] overflow-x-auto pb-1 scrollbar-hide">
              <div className="grid min-w-[172px] grid-cols-5 gap-1.5">
                {[match.teamA, match.teamB].flatMap((team, teamIndex) =>
                  Array.from({ length: 5 }, (_, setIndex) => {
                    const set = match.sets[setIndex];
                    const score = set
                      ? teamIndex === 0
                        ? set.teamAPoints
                        : set.teamBPoints
                      : null;

                    return (
                      <span
                        key={`${team.teamId}-${setIndex}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 bg-blue-50/50 text-[10px] font-black text-(--color-navy)"
                        style={{
                          gridRow: teamIndex + 1,
                          gridColumn: setIndex + 1,
                        }}
                      >
                        {score ?? "-"}
                      </span>
                    );
                  }),
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-blue-50 pt-3">
            <span
              className={`flex items-center gap-1.5 text-[10px] font-black ${getResultClassName(match.result)}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${getResultDotClassName(match.result)}`}
              />
              {formatResult(match.result)}
            </span>
            <button
              type="button"
              disabled
              aria-label="Scorecard preview unavailable"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-blue-100 px-3 text-[9px] font-bold text-blue-500 opacity-60"
            >
              <BarChart3 size={13} />
              Scorecard
            </button>
          </div>
        </article>
      )}
    </section>
  );
}

function HomeTournaments({
  tournaments,
}: {
  tournaments: VolleyballHomeTournament[];
}) {
  return (
    <section>
      <SectionHeading
        title="My tournaments"
        action="Create new"
        href="/volleyball/tournaments/create"
      />
      <div className="mt-3 overflow-hidden rounded-2xl border border-blue-100 bg-(--color-bg-card) shadow-[0_8px_24px_rgba(31,78,140,0.09)]">
        {tournaments.length === 0 ? (
          <div className="p-3">
            <p className="text-[10px] font-bold text-slate-500">
              No tournaments yet
            </p>
          </div>
        ) : (
          tournaments.map((tournament, index) => (
            <div
              key={tournament.id}
              className={`flex items-center gap-3 p-3 ${index > 0 ? "border-t border-blue-50" : ""}`}
            >
              <TournamentArtwork
                tone={tournament.format === "LEAGUE" ? "beach" : "indoor"}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-black text-(--color-navy)">
                  {tournament.name}
                </p>
                <p className="mt-1 truncate text-[9px] text-slate-500">
                  {getTournamentMeta(tournament)}
                </p>
                {getTournamentRelationLabel(tournament) && (
                  <p className="mt-1 truncate text-[8px] text-slate-400">
                    {getTournamentRelationLabel(tournament)}
                  </p>
                )}
              </div>
              {tournament.viewerRelation.admin && (
                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[8px] font-black text-blue-600">
                  Admin
                </span>
              )}
              <span
                className={`shrink-0 rounded-full px-3 py-1.5 text-[8px] font-black ${
                  tournament.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-orange-50 text-orange-500"
                }`}
              >
                {formatTournamentStatus(tournament.status)}
              </span>
              <ChevronRight size={16} className="shrink-0 text-slate-400" />
            </div>
          ))
        )}
      </div>
      <Link
        href="/volleyball/my-volleyball?tab=tournaments&scope=all"
        className="mt-3 flex items-center justify-center gap-1 text-[10px] font-black text-blue-600"
      >
        View all tournaments <ChevronRight size={13} />
      </Link>
    </section>
  );
}

function TournamentArtwork({ tone }: { tone: "beach" | "indoor" }) {
  return (
    <span
      className={`relative flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl ${
        tone === "beach"
          ? "bg-[linear-gradient(145deg,#73c9ff,#fff2ad_58%,#f3a84d)]"
          : "bg-[linear-gradient(145deg,#131d55,#2969bd_58%,#ff6b2c)]"
      }`}
      aria-hidden="true"
    >
      <span className="absolute inset-x-0 bottom-2 h-px bg-white/60" />
      <span className="absolute bottom-2 right-2 h-8 w-px bg-white/60" />
      <Volleyball
        size={26}
        className={tone === "beach" ? "text-(--color-navy)" : "text-white"}
      />
    </span>
  );
}

function SectionHeading({
  title,
  action,
  href,
}: {
  title: string;
  action: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-base font-black text-(--color-navy)">{title}</h2>
      <Link
        href={href}
        className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-blue-600"
      >
        {action}
        <ChevronRight size={13} />
      </Link>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <>
      <section>
        <div className="h-5 w-40 rounded-full bg-blue-100" />
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[118px] animate-pulse rounded-2xl border border-blue-100 bg-(--color-bg-card)"
            />
          ))}
        </div>
      </section>
      <section>
        <div className="h-5 w-36 rounded-full bg-blue-100" />
        <div className="-mx-4 mt-3 overflow-hidden px-4">
          <div className="flex gap-2.5">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-[112px] w-[225px] shrink-0 animate-pulse rounded-2xl border border-blue-100 bg-(--color-bg-card)"
              />
            ))}
          </div>
        </div>
      </section>
      <div className="h-[162px] animate-pulse rounded-2xl border border-blue-100 bg-(--color-bg-card)" />
      <div className="h-[164px] animate-pulse rounded-2xl border border-blue-100 bg-(--color-bg-card)" />
    </>
  );
}

function HomeError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-(--color-bg-card) p-4 text-center shadow-[0_8px_24px_rgba(31,78,140,0.09)]">
      <p className="text-sm font-black text-(--color-navy)">
        Unable to load Volleyball Home
      </p>
      <p className="mt-1 text-[10px] leading-5 text-slate-500">
        We couldn&apos;t load your Volleyball updates right now.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-lg bg-blue-50 px-4 py-2 text-[10px] font-black text-blue-600"
      >
        Try again
      </button>
    </section>
  );
}

function CompactEmpty({ message }: { message: string }) {
  return (
    <div className="mt-3 rounded-2xl border border-dashed border-blue-100 bg-(--color-bg-card) p-3 text-[10px] font-bold text-slate-500">
      {message}
    </div>
  );
}

function formatTrend(metric: VolleyballHomeSeasonMetric) {
  if (!metric.supported) {
    return { label: "Not tracked", className: "text-slate-400" };
  }

  if (!metric.trend || metric.trend.percent === null) {
    return { label: "No comparison", className: "text-slate-400" };
  }

  if (metric.trend.direction === "SAME") {
    return { label: "Same as last season", className: "text-slate-500" };
  }

  return {
    label: `${metric.trend.direction === "UP" ? "\u2191" : "\u2193"} ${
      metric.trend.percent
    }% vs last season`,
    className:
      metric.trend.direction === "UP" ? "text-emerald-600" : "text-red-500",
  };
}

function formatDateLabel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMatchMeta(match: VolleyballHomeRecentMatch) {
  const parts = [formatDateLabel(match.playedAt)];
  const venue = match.venue
    ? [match.venue.name, match.venue.city].filter(Boolean).join(", ")
    : null;

  if (venue) {
    parts.push(venue);
  }

  return parts.join(" \u00B7 ");
}

function formatMatchDetail(match: VolleyballHomeRecentMatch) {
  const source =
    match.sourceType === "TOURNAMENT"
      ? (match.tournament?.name ?? "Tournament")
      : "Standalone";

  return `${match.teamASetsWon}-${match.teamBSetsWon} Sets / ${source}`;
}

function formatResult(result: VolleyballHomeRecentMatch["result"]) {
  switch (result) {
    case "WON":
      return "Won";
    case "LOST":
      return "Lost";
    case "DRAW":
      return "Draw";
  }
}

function getResultClassName(result: VolleyballHomeRecentMatch["result"]) {
  if (result === "WON") return "text-emerald-600";
  if (result === "LOST") return "text-red-500";
  return "text-slate-500";
}

function getResultDotClassName(result: VolleyballHomeRecentMatch["result"]) {
  if (result === "WON") return "bg-emerald-500";
  if (result === "LOST") return "bg-red-500";
  return "bg-slate-400";
}

function getTournamentMeta(tournament: VolleyballHomeTournament) {
  const parts = [
    `${tournament.teamCount} Teams`,
    formatVolleyballTournamentFormat(tournament.format),
  ];

  if (tournament.currentStage) {
    parts.push(formatVolleyballTournamentStage(tournament.currentStage));
  }

  return parts.join(" \u00B7 ");
}

function getTournamentRelationLabel(tournament: VolleyballHomeTournament) {
  if (tournament.viewerRelation.played) return "Played tournament";
  if (tournament.viewerRelation.created) return "Created tournament";
  if (tournament.viewerRelation.network) return "Network tournament";
  return null;
}

function formatTournamentStatus(status: VolleyballHomeTournament["status"]) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}
