"use client";

import {
  CalendarDays,
  ChevronRight,
  CircleDot,
  Plus,
  Trophy,
  Volleyball,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";

import {
  VOLLEYBALL_TOURNAMENT_STATUSES,
  type VolleyballTournament,
  type VolleyballTournamentStatus,
} from "@/types/volleyball/tournament";

import { S3Image } from "@/components/common/S3Image";

import { useGetMyVolleyballMatchesQuery } from "@/store/api/volleyball/volleyballMatchApi";

import {
  VOLLEYBALL_MATCH_FEED_STATUSES,
  VOLLEYBALL_MATCH_PRIMARY_ACTIONS,
  VOLLEYBALL_MY_MATCH_SOURCES,
  type VolleyballMyMatchItem,
  type VolleyballMyMatchStatusFilter,
} from "@/types/volleyball/match";

import { useGetMyVolleyballTournamentsQuery } from "@/store/api/volleyball/volleyballTournamentApi";

/* =========================================================
   LOCAL TYPES
========================================================= */

type MyVolleyballTab = "matches" | "tournaments";

type MatchFilter = "all" | "live" | "upcoming" | "completed";

type TournamentFilter = "all" | "active" | "draft" | "completed";

/* =========================================================
   PAGE
========================================================= */

export default function MyVolleyballPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  /* =====================================================
     URL STATE
  ===================================================== */

  const requestedTab = searchParams.get("tab");

  const requestedFilter = searchParams.get("filter");

  const activeTab: MyVolleyballTab =
    requestedTab === "tournaments" ? "tournaments" : "matches";

  const matchFilter: MatchFilter = isMatchFilter(requestedFilter)
    ? requestedFilter
    : "all";

  const tournamentFilter: TournamentFilter = isTournamentFilter(requestedFilter)
    ? requestedFilter
    : "all";

  /* =====================================================
     TOURNAMENT API
  ===================================================== */

  const tournamentStatus = getTournamentStatus(tournamentFilter);

  const {
    currentData: tournaments = [],
    isLoading: isTournamentsLoading,
    isFetching: isTournamentsFetching,
    isError: isTournamentsError,
    refetch: refetchTournaments,
  } = useGetMyVolleyballTournamentsQuery(
    tournamentStatus
      ? {
          status: tournamentStatus,
        }
      : undefined,
    {
      skip: activeTab !== "tournaments",
    },
  );

  const sortedTournaments = useMemo(() => {
    return [...tournaments].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [tournaments]);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  function changeTab(tab: MyVolleyballTab) {
    const params = new URLSearchParams();

    params.set("tab", tab);
    params.set("filter", "all");

    router.replace(`/volleyball/my-volleyball?${params.toString()}`);
  }

  function changeMatchFilter(filter: MatchFilter) {
    const params = new URLSearchParams();

    params.set("tab", "matches");

    params.set("filter", filter);

    router.replace(`/volleyball/my-volleyball?${params.toString()}`);
  }

  function changeTournamentFilter(filter: TournamentFilter) {
    const params = new URLSearchParams();

    params.set("tab", "tournaments");

    params.set("filter", filter);

    router.replace(`/volleyball/my-volleyball?${params.toString()}`);
  }

  /* =====================================================
     RENDER
  ===================================================== */

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
              My Volleyball
            </h1>

            <p className="mt-1 text-[9px] text-white/50">
              Matches and tournaments in one place
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--color-brand)">
            <Volleyball size={20} />
          </div>
        </div>
      </section>

      {/* =================================================
          PRIMARY TABS
      ================================================= */}

      <div className="sticky top-0 z-20 border-b border-(--color-bg-border) bg-(--color-bg-card)">
        <div className="grid grid-cols-2 px-4">
          <MainTabButton
            active={activeTab === "matches"}
            label="Matches"
            onClick={() => changeTab("matches")}
          />

          <MainTabButton
            active={activeTab === "tournaments"}
            label="Tournaments"
            onClick={() => changeTab("tournaments")}
          />
        </div>
      </div>

      {/* =================================================
          MATCHES
      ================================================= */}

      {activeTab === "matches" && (
        <MatchesTab
          filter={matchFilter}
          onFilterChange={changeMatchFilter}
          onCreateMatch={() => router.push("/volleyball/matches/create")}
        />
      )}

      {/* =================================================
          TOURNAMENTS
      ================================================= */}

      {activeTab === "tournaments" && (
        <TournamentsTab
          filter={tournamentFilter}
          tournaments={sortedTournaments}
          loading={
            isTournamentsLoading ||
            (isTournamentsFetching && !tournaments.length)
          }
          fetching={isTournamentsFetching}
          error={isTournamentsError}
          onFilterChange={changeTournamentFilter}
          onRetry={() => void refetchTournaments()}
          onCreate={() => router.push("/volleyball/tournaments/create")}
          onOpen={(tournamentId) =>
            router.push(`/volleyball/tournaments/${tournamentId}`)
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   MATCHES TAB
========================================================= */

/* =========================================================
   MATCHES TAB
========================================================= */

function MatchesTab({
  filter,
  onFilterChange,
  onCreateMatch,
}: {
  filter: MatchFilter;

  onFilterChange: (filter: MatchFilter) => void;

  onCreateMatch: () => void;
}) {
  const router = useRouter();

  const [limit, setLimit] = useState(20);

  const status = getMatchStatusFilter(filter);

  useEffect(() => {
    setLimit(20);
  }, [filter]);

  const { currentData, isLoading, isFetching, isError, refetch } =
    useGetMyVolleyballMatchesQuery({
      ...(status ? { status } : {}),
      skip: 0,
      limit,
    });

  const matches = currentData?.items ?? [];

  const pagination = currentData?.pagination;

  function handleMatchAction(match: VolleyballMyMatchItem) {
    const query = createMatchContextQuery(match);

    const suffix = query ? `?${query}` : "";

    switch (match.primaryAction) {
      case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.SETUP_ROSTER:
        router.push(`/volleyball/matches/${match.matchId}/rosters${suffix}`);

        return;

      case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.START_SET:
        router.push(`/volleyball/matches/${match.matchId}/sets/setup${suffix}`);

        return;

      /*
       * The scorer route needs the active setId.
       *
       * My Matches intentionally returns compact score data,
       * not the VolleyballSet id.
       *
       * The existing Match Details page already resolves the
       * live set and creates the correct scoring URL.
       */
      case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.RESUME_SCORING:
      case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.VIEW_RESULT:
      case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.VIEW_MATCH:
      default:
        router.push(`/volleyball/matches/${match.matchId}${suffix}`);
    }
  }

  function handleLoadMore() {
    setLimit((current) => Math.min(current + 20, 100));
  }

  return (
    <main className="px-4 py-4">
      {/* =================================================
          FILTERS
      ================================================= */}

      <HorizontalFilters>
        <FilterChip
          selected={filter === "all"}
          onClick={() => onFilterChange("all")}
        >
          All
        </FilterChip>

        <FilterChip
          selected={filter === "live"}
          onClick={() => onFilterChange("live")}
        >
          Live
        </FilterChip>

        <FilterChip
          selected={filter === "upcoming"}
          onClick={() => onFilterChange("upcoming")}
        >
          Upcoming
        </FilterChip>

        <FilterChip
          selected={filter === "completed"}
          onClick={() => onFilterChange("completed")}
        >
          Completed
        </FilterChip>
      </HorizontalFilters>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="mt-5">
        {isLoading || (isFetching && !currentData) ? (
          <MatchesSkeleton />
        ) : isError ? (
          <MatchesError
            onRetry={() => {
              void refetch();
            }}
          />
        ) : matches.length === 0 ? (
          <MatchesEmpty filter={filter} onCreateMatch={onCreateMatch} />
        ) : (
          <div className="space-y-3">
            {/* =============================================
                HEADING
            ============================================= */}

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wide text-(--color-text-secondary)">
                  My Matches
                </p>

                <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
                  {pagination?.total ?? matches.length}{" "}
                  {(pagination?.total ?? matches.length) === 1
                    ? "match"
                    : "matches"}
                </p>
              </div>

              <button
                type="button"
                onClick={onCreateMatch}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-(--color-brand) px-3 text-[9px] font-black text-white active:scale-[0.98]"
              >
                <Plus size={13} />
                New
              </button>
            </div>

            {/* =============================================
                BACKGROUND REFRESH
            ============================================= */}

            {isFetching && currentData && (
              <div className="h-1 overflow-hidden rounded-full bg-(--color-bg-border)">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-(--color-brand)" />
              </div>
            )}

            {/* =============================================
                MATCH CARDS
            ============================================= */}

            <div className="space-y-3">
              {matches.map((match) => (
                <VolleyballMatchFeedCard
                  key={match.matchId}
                  match={match}
                  onAction={() => handleMatchAction(match)}
                />
              ))}
            </div>

            {/* =============================================
                LOAD MORE
            ============================================= */}

            {pagination?.hasMore && limit < 100 && (
              <button
                type="button"
                disabled={isFetching}
                onClick={handleLoadMore}
                className="flex h-11 w-full items-center justify-center rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) text-[9px] font-black text-(--color-brand) shadow-sm disabled:opacity-50 active:scale-[0.99]"
              >
                {isFetching ? "Loading..." : "Load More Matches"}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   MATCH FEED CARD
========================================================= */

function VolleyballMatchFeedCard({
  match,
  onAction,
}: {
  match: VolleyballMyMatchItem;

  onAction: () => void;
}) {
  const isLive = match.feedStatus === VOLLEYBALL_MATCH_FEED_STATUSES.LIVE;

  const isCompleted =
    match.feedStatus === VOLLEYBALL_MATCH_FEED_STATUSES.COMPLETED;

  const isUpcoming =
    match.feedStatus === VOLLEYBALL_MATCH_FEED_STATUSES.UPCOMING;

  const actionLabel = getMatchActionLabel(match);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border bg-(--color-bg-card) shadow-sm",

        isLive ? "border-red-200" : "border-(--color-bg-border)",
      )}
    >
      {/* =================================================
          TOP META
      ================================================= */}

      <div className="flex items-center justify-between gap-3 border-b border-(--color-bg-border) px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <MatchFeedStatusBadge status={match.feedStatus} />

          <span className="h-1 w-1 shrink-0 rounded-full bg-(--color-bg-border)" />

          <p className="truncate text-[8px] font-bold text-(--color-text-muted)">
            {getMatchSourceLabel(match)}
          </p>
        </div>

        {match.scheduledAt && (
          <div className="flex shrink-0 items-center gap-1">
            <CalendarDays size={10} className="text-(--color-text-muted)" />

            <span className="text-[8px] font-semibold text-(--color-text-muted)">
              {formatMatchDateTime(match.scheduledAt)}
            </span>
          </div>
        )}
      </div>

      {/* =================================================
          TEAMS / SCORE
      ================================================= */}

      <div className="px-3.5 py-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* TEAM A */}

          <MatchFeedTeam
            team={match.teamA}
            score={isLive || isCompleted ? match.score.teamASetsWon : null}
          />

          {/* CENTER */}

          <div className="flex min-w-[58px] flex-col items-center justify-center">
            {isLive ? (
              <>
                <span className="rounded-full bg-red-50 px-2 py-1 text-[7px] font-black uppercase tracking-wide text-red-600">
                  Live
                </span>

                {match.score.currentSetNumber !== null && (
                  <p className="mt-1 text-[7px] font-black uppercase tracking-wide text-(--color-text-muted)">
                    Set {match.score.currentSetNumber}
                  </p>
                )}

                {match.score.teamACurrentSetPoints !== null &&
                  match.score.teamBCurrentSetPoints !== null && (
                    <p className="mt-1 font-(family-name:--font-display) text-lg font-black leading-none text-(--color-text-primary)">
                      {match.score.teamACurrentSetPoints}
                      <span className="mx-1 text-(--color-text-muted)">–</span>
                      {match.score.teamBCurrentSetPoints}
                    </p>
                  )}
              </>
            ) : isCompleted ? (
              <>
                <p className="text-[7px] font-black uppercase tracking-wide text-(--color-text-muted)">
                  Sets
                </p>

                <p className="mt-1 font-(family-name:--font-display) text-xl font-black leading-none text-(--color-text-primary)">
                  {match.score.teamASetsWon}
                  <span className="mx-1.5 text-(--color-text-muted)">–</span>
                  {match.score.teamBSetsWon}
                </p>
              </>
            ) : (
              <>
                <p className="font-(family-name:--font-display) text-sm font-black uppercase text-(--color-text-muted)">
                  VS
                </p>

                {isUpcoming && (
                  <p className="mt-1 text-[7px] font-bold text-(--color-text-muted)">
                    {getUpcomingTimeLabel(match.scheduledAt)}
                  </p>
                )}
              </>
            )}
          </div>

          {/* TEAM B */}

          <MatchFeedTeam
            team={match.teamB}
            score={isLive || isCompleted ? match.score.teamBSetsWon : null}
            align="right"
          />
        </div>

        {/* =================================================
            RESULT
        ================================================= */}

        {isCompleted && match.result && (
          <div className="mt-3 rounded-xl bg-(--color-bg-tint) px-3 py-2 text-center">
            <p className="text-[9px] font-black text-(--color-brand)">
              {match.result.resultText}
            </p>
          </div>
        )}

        {/* =================================================
            TOURNAMENT CONTEXT
        ================================================= */}

        {match.sourceType === VOLLEYBALL_MY_MATCH_SOURCES.TOURNAMENT &&
          match.tournament && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-(--color-bg-base) px-3 py-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--color-bg-tint)">
                <Trophy size={12} className="text-(--color-brand)" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[8px] font-black text-(--color-text-primary)">
                  {match.tournament.name}
                </p>

                {match.fixture && (
                  <p className="mt-0.5 truncate text-[7px] font-semibold text-(--color-text-muted)">
                    {formatFixtureStage(match.fixture.stage)}
                    {" · "}
                    Match {match.fixture.roundNumber}
                    {match.fixture.groupName
                      ? ` · ${match.fixture.groupName}`
                      : ""}
                  </p>
                )}
              </div>
            </div>
          )}
      </div>

      {/* =================================================
          ACTION
      ================================================= */}

      <button
        type="button"
        onClick={onAction}
        className={cn(
          "flex h-11 w-full items-center justify-between border-t px-3.5 text-left active:bg-(--color-bg-base)",

          isLive ? "border-red-100 bg-red-50/50" : "border-(--color-bg-border)",
        )}
      >
        <span
          className={cn(
            "text-[9px] font-black",

            isLive ? "text-red-600" : "text-(--color-brand)",
          )}
        >
          {actionLabel}
        </span>

        <ChevronRight
          size={14}
          className={isLive ? "text-red-500" : "text-(--color-brand)"}
        />
      </button>
    </article>
  );
}

/* =========================================================
   MATCH TEAM
========================================================= */

function MatchFeedTeam({
  team,
  score,
  align = "left",
}: {
  team: VolleyballMyMatchItem["teamA"];

  score: number | null;

  align?: "left" | "right";
}) {
  const isRight = align === "right";

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",

        isRight && "flex-row-reverse",
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-base)">
        {team.logoUrl ? (
          <S3Image
            imageKey={team.logoUrl}
            alt={team.name}
            width={20}
            height={20}
            className="h-full w-full object-cover"
            fallback={
              <span className="text-[10px] font-black text-(--color-brand)">
                {getTeamInitials(team.name)}
              </span>
            }
          />
        ) : (
          <span className="text-[10px] font-black text-(--color-brand)">
            {getTeamInitials(team.name)}
          </span>
        )}
      </div>

      <div
        className={cn(
          "min-w-0",

          isRight && "text-right",
        )}
      >
        <p className="line-clamp-2 text-[10px] font-black leading-4 text-(--color-text-primary)">
          {team.name}
        </p>

        {score !== null && (
          <p className="mt-1 text-[8px] font-bold text-(--color-text-muted)">
            {score} {score === 1 ? "set" : "sets"}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MATCH STATUS
========================================================= */

function MatchFeedStatusBadge({
  status,
}: {
  status: VolleyballMyMatchItem["feedStatus"];
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-1 text-[7px] font-black uppercase tracking-wide",

        status === VOLLEYBALL_MATCH_FEED_STATUSES.LIVE &&
          "bg-red-50 text-red-600",

        status === VOLLEYBALL_MATCH_FEED_STATUSES.UPCOMING &&
          "bg-(--color-bg-tint) text-(--color-brand)",

        status === VOLLEYBALL_MATCH_FEED_STATUSES.COMPLETED &&
          "bg-emerald-50 text-emerald-700",

        status === VOLLEYBALL_MATCH_FEED_STATUSES.CANCELLED &&
          "bg-slate-100 text-slate-500",
      )}
    >
      {getMatchFeedStatusLabel(status)}
    </span>
  );
}

/* =========================================================
   MATCH EMPTY
========================================================= */

function MatchesEmpty({
  filter,
  onCreateMatch,
}: {
  filter: MatchFilter;

  onCreateMatch: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
      <div className="px-5 py-7 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
          <CircleDot size={21} className="text-(--color-brand)" />
        </div>

        <p className="mt-3 text-sm font-black text-(--color-text-primary)">
          {getMatchEmptyTitle(filter)}
        </p>

        <p className="mx-auto mt-1 max-w-71.25 text-[10px] leading-5 text-(--color-text-muted)">
          {getMatchEmptyMessage(filter)}
        </p>

        {filter === "all" && (
          <Button fullWidth className="mt-5" onClick={onCreateMatch}>
            <Plus size={15} />
            Start New Match
          </Button>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   MATCH ERROR
========================================================= */

function MatchesError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-7 text-center shadow-sm">
      <CircleDot size={24} className="mx-auto text-(--color-brand)" />

      <p className="mt-3 text-sm font-black text-(--color-text-primary)">
        Unable to load matches
      </p>

      <p className="mt-1 text-[10px] leading-5 text-(--color-text-muted)">
        We couldn&apos;t load your Volleyball matches.
      </p>

      <Button fullWidth className="mt-4" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

/* =========================================================
   MATCH SKELETON
========================================================= */

function MatchesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-48 animate-pulse rounded-2xl bg-(--color-bg-card)"
        />
      ))}
    </div>
  );
}

/* =========================================================
   TOURNAMENT TAB
========================================================= */

function TournamentsTab({
  filter,
  tournaments,
  loading,
  fetching,
  error,
  onFilterChange,
  onRetry,
  onCreate,
  onOpen,
}: {
  filter: TournamentFilter;

  tournaments: VolleyballTournament[];

  loading: boolean;

  fetching: boolean;

  error: boolean;

  onFilterChange: (filter: TournamentFilter) => void;

  onRetry: () => void;

  onCreate: () => void;

  onOpen: (tournamentId: string) => void;
}) {
  return (
    <main className="px-4 py-4">
      {/* FILTERS */}

      <HorizontalFilters>
        <FilterChip
          selected={filter === "all"}
          onClick={() => onFilterChange("all")}
        >
          All
        </FilterChip>

        <FilterChip
          selected={filter === "active"}
          onClick={() => onFilterChange("active")}
        >
          Active
        </FilterChip>

        <FilterChip
          selected={filter === "draft"}
          onClick={() => onFilterChange("draft")}
        >
          Draft
        </FilterChip>

        <FilterChip
          selected={filter === "completed"}
          onClick={() => onFilterChange("completed")}
        >
          Completed
        </FilterChip>
      </HorizontalFilters>

      <div className="mt-5">
        {loading ? (
          <TournamentSkeleton />
        ) : error ? (
          <TournamentError onRetry={onRetry} />
        ) : tournaments.length === 0 ? (
          <TournamentEmpty filter={filter} onCreate={onCreate} />
        ) : (
          <div className="space-y-3">
            {/* SECTION HEADING */}

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wide text-(--color-text-secondary)">
                  My Tournaments
                </p>

                <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
                  {tournaments.length}{" "}
                  {tournaments.length === 1 ? "tournament" : "tournaments"}
                </p>
              </div>

              <button
                type="button"
                onClick={onCreate}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-(--color-brand) px-3 text-[9px] font-black text-white active:scale-[0.98]"
              >
                <Plus size={13} />
                New
              </button>
            </div>

            {/* REFRESH INDICATOR */}

            {fetching && (
              <div className="h-1 overflow-hidden rounded-full bg-(--color-bg-border)">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-(--color-brand)" />
              </div>
            )}

            {/* CARDS */}

            <div className="space-y-3">
              {tournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onClick={() => onOpen(tournament.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   TOURNAMENT CARD
========================================================= */

function TournamentCard({
  tournament,
  onClick,
}: {
  tournament: VolleyballTournament;

  onClick: () => void;
}) {
  const dateLabel = formatTournamentDates(tournament);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) text-left shadow-sm active:scale-[0.99]"
    >
      <div className="px-3.5 py-3.5">
        <div className="flex items-start gap-3">
          {/* ICON */}

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
            <Trophy size={18} className="text-(--color-brand)" />
          </div>

          {/* DETAILS */}

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black text-(--color-text-primary)">
                  {tournament.name}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[8px] font-semibold text-(--color-text-muted)">
                    {formatTournamentFormat(tournament.format)}
                  </span>

                  <span className="h-1 w-1 rounded-full bg-(--color-bg-border)" />

                  <span className="text-[8px] font-semibold text-(--color-text-muted)">
                    {tournament.visibility}
                  </span>
                </div>
              </div>

              <TournamentStatusBadge status={tournament.status} />
            </div>

            {tournament.description && (
              <p className="mt-2 line-clamp-2 text-[9px] leading-4 text-(--color-text-muted)">
                {tournament.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="flex items-center gap-3 border-t border-(--color-bg-border) bg-(--color-bg-base)/60 px-3.5 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <CalendarDays
            size={11}
            className="shrink-0 text-(--color-text-muted)"
          />

          <p className="truncate text-[8px] font-semibold text-(--color-text-muted)">
            {dateLabel ?? "Dates not set"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-[8px] font-black text-(--color-brand)">
          Manage
          <ChevronRight size={12} />
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   PRIMARY TAB
========================================================= */

function MainTabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;

  label: string;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative h-12 text-xs font-black",

        active ? "text-(--color-brand)" : "text-(--color-text-muted)",
      )}
    >
      {label}

      {active && (
        <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-(--color-brand)" />
      )}
    </button>
  );
}

/* =========================================================
   FILTERS
========================================================= */

function HorizontalFilters({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2">{children}</div>
    </div>
  );
}

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
        "h-9 rounded-full border px-4 text-[9px] font-black transition",

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
   STATUS
========================================================= */

function TournamentStatusBadge({
  status,
}: {
  status: VolleyballTournamentStatus;
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-1 text-[7px] font-black",

        status === VOLLEYBALL_TOURNAMENT_STATUSES.ACTIVE &&
          "bg-emerald-50 text-emerald-700",

        status === VOLLEYBALL_TOURNAMENT_STATUSES.DRAFT &&
          "bg-(--color-bg-tint) text-(--color-brand)",

        status === VOLLEYBALL_TOURNAMENT_STATUSES.COMPLETED &&
          "bg-slate-100 text-slate-600",

        status === VOLLEYBALL_TOURNAMENT_STATUSES.CANCELLED &&
          "bg-red-50 text-red-600",
      )}
    >
      {formatTournamentStatus(status)}
    </span>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function TournamentEmpty({
  filter,
  onCreate,
}: {
  filter: TournamentFilter;

  onCreate: () => void;
}) {
  return (
    <div className="rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-7 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
        <Trophy size={21} className="text-(--color-brand)" />
      </div>

      <p className="mt-3 text-sm font-black text-(--color-text-primary)">
        {getEmptyTitle(filter)}
      </p>

      <p className="mx-auto mt-1 max-w-[280px] text-[10px] leading-5 text-(--color-text-muted)">
        {getEmptyMessage(filter)}
      </p>

      {filter === "all" && (
        <Button fullWidth className="mt-5" onClick={onCreate}>
          <Plus size={15} />
          Create Tournament
        </Button>
      )}
    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function TournamentError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-7 text-center">
      <Trophy size={24} className="mx-auto text-(--color-brand)" />

      <p className="mt-3 text-sm font-black text-(--color-text-primary)">
        Unable to load tournaments
      </p>

      <p className="mt-1 text-[10px] leading-5 text-(--color-text-muted)">
        We couldn&apos;t load your Volleyball tournaments.
      </p>

      <Button fullWidth className="mt-4" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function TournamentSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-32 animate-pulse rounded-2xl bg-(--color-bg-card)"
        />
      ))}
    </div>
  );
}

/* =========================================================
   FILTER HELPERS
========================================================= */

function isMatchFilter(value: string | null): value is MatchFilter {
  return (
    value === "all" ||
    value === "live" ||
    value === "upcoming" ||
    value === "completed"
  );
}

function isTournamentFilter(value: string | null): value is TournamentFilter {
  return (
    value === "all" ||
    value === "active" ||
    value === "draft" ||
    value === "completed"
  );
}

function getTournamentStatus(
  filter: TournamentFilter,
): VolleyballTournamentStatus | undefined {
  switch (filter) {
    case "active":
      return VOLLEYBALL_TOURNAMENT_STATUSES.ACTIVE;

    case "draft":
      return VOLLEYBALL_TOURNAMENT_STATUSES.DRAFT;

    case "completed":
      return VOLLEYBALL_TOURNAMENT_STATUSES.COMPLETED;

    default:
      return undefined;
  }
}

/* =========================================================
   MATCH HELPERS
========================================================= */

function getMatchStatusFilter(
  filter: MatchFilter,
): VolleyballMyMatchStatusFilter | undefined {
  switch (filter) {
    case "live":
      return VOLLEYBALL_MATCH_FEED_STATUSES.LIVE;

    case "upcoming":
      return VOLLEYBALL_MATCH_FEED_STATUSES.UPCOMING;

    case "completed":
      return VOLLEYBALL_MATCH_FEED_STATUSES.COMPLETED;

    default:
      return undefined;
  }
}

function createMatchContextQuery(match: VolleyballMyMatchItem) {
  if (
    match.sourceType !== VOLLEYBALL_MY_MATCH_SOURCES.TOURNAMENT ||
    !match.tournament ||
    !match.fixture
  ) {
    return "";
  }

  return new URLSearchParams({
    tournamentId: match.tournament.id,

    fixtureId: match.fixture.id,
  }).toString();
}

function getMatchActionLabel(match: VolleyballMyMatchItem) {
  switch (match.primaryAction) {
    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.SETUP_ROSTER:
      return "Setup Rosters";

    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.START_SET:
      return "Start Match";

    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.RESUME_SCORING:
      return "Resume Scoring";

    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.VIEW_RESULT:
      return "View Result";

    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.VIEW_MATCH:
    default:
      return "View Match";
  }
}

function getMatchSourceLabel(match: VolleyballMyMatchItem) {
  if (match.sourceType === VOLLEYBALL_MY_MATCH_SOURCES.TOURNAMENT) {
    if (match.fixture) {
      return `${formatFixtureStage(
        match.fixture.stage,
      )} · Match ${match.fixture.roundNumber}`;
    }

    return "Tournament Match";
  }

  return "Standalone Match";
}

function getMatchFeedStatusLabel(status: VolleyballMyMatchItem["feedStatus"]) {
  switch (status) {
    case VOLLEYBALL_MATCH_FEED_STATUSES.LIVE:
      return "Live";

    case VOLLEYBALL_MATCH_FEED_STATUSES.UPCOMING:
      return "Upcoming";

    case VOLLEYBALL_MATCH_FEED_STATUSES.COMPLETED:
      return "Completed";

    case VOLLEYBALL_MATCH_FEED_STATUSES.CANCELLED:
      return "Cancelled";

    default:
      return status;
  }
}

function formatFixtureStage(value: string) {
  switch (value) {
    case "LEAGUE":
      return "League";

    case "GROUP_STAGE":
      return "Group Stage";

    case "ROUND_OF_16":
      return "Round of 16";

    case "QUARTER_FINAL":
      return "Quarter Final";

    case "SEMI_FINAL":
      return "Semi Final";

    case "THIRD_PLACE":
      return "Third Place";

    case "FINAL":
      return "Final";

    default:
      return value
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function formatMatchDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getUpcomingTimeLabel(scheduledAt: string | null) {
  if (!scheduledAt) {
    return "Scheduled";
  }

  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return "Scheduled";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getTeamInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getMatchEmptyTitle(filter: MatchFilter) {
  switch (filter) {
    case "live":
      return "No live matches";

    case "upcoming":
      return "No upcoming matches";

    case "completed":
      return "No completed matches";

    default:
      return "No matches yet";
  }
}

function getMatchEmptyMessage(filter: MatchFilter) {
  switch (filter) {
    case "live":
      return "Matches you're currently scoring will appear here.";

    case "upcoming":
      return "Matches waiting for setup or scoring will appear here.";

    case "completed":
      return "Your finished Volleyball matches will appear here.";

    default:
      return "Start a standalone match or create a tournament match to begin.";
  }
}

/* =========================================================
   FORMATTERS
========================================================= */

function formatTournamentStatus(status: VolleyballTournamentStatus) {
  switch (status) {
    case VOLLEYBALL_TOURNAMENT_STATUSES.ACTIVE:
      return "Active";

    case VOLLEYBALL_TOURNAMENT_STATUSES.DRAFT:
      return "Draft";

    case VOLLEYBALL_TOURNAMENT_STATUSES.COMPLETED:
      return "Completed";

    case VOLLEYBALL_TOURNAMENT_STATUSES.CANCELLED:
      return "Cancelled";

    default:
      return status;
  }
}

function formatTournamentFormat(format: string) {
  switch (format) {
    case "LEAGUE":
      return "League";

    case "KNOCKOUT":
      return "Knockout";

    case "GROUP_KNOCKOUT":
      return "Group + Knockout";

    default:
      return format;
  }
}

function formatTournamentDates(tournament: VolleyballTournament) {
  if (tournament.startDate && tournament.endDate) {
    return `${formatDate(tournament.startDate)} – ${formatDate(
      tournament.endDate,
    )}`;
  }

  if (tournament.startDate) {
    return `Starts ${formatDate(tournament.startDate)}`;
  }

  if (tournament.endDate) {
    return `Ends ${formatDate(tournament.endDate)}`;
  }

  return null;
}

function formatDate(value: string) {
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

function getEmptyTitle(filter: TournamentFilter) {
  switch (filter) {
    case "active":
      return "No active tournaments";

    case "draft":
      return "No draft tournaments";

    case "completed":
      return "No completed tournaments";

    default:
      return "No tournaments yet";
  }
}

function getEmptyMessage(filter: TournamentFilter) {
  switch (filter) {
    case "active":
      return "Your active Volleyball tournaments will appear here.";

    case "draft":
      return "Tournament drafts you're preparing will appear here.";

    case "completed":
      return "Your finished Volleyball tournaments will appear here.";

    default:
      return "Create your first Volleyball tournament and manage teams, fixtures and matches from one place.";
  }
}
