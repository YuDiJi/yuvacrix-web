"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

import { cn } from "@/lib/cn";
import { TeamCard } from "@/components/team/TeamCard";
import { useGetMyTeamsOverviewQuery } from "@/store/api/teamApi";

import type {
  Team,
  TeamOverviewFilter,
  TeamsOverviewPagination,
} from "@/types/team";

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAM_FILTERS: TeamOverviewFilter[] = [
  "YOUR",
  "PARTICIPATE",
  //   "NETWORK",
  "ALL",
];

const TEAM_FILTER_LABELS: Record<TeamOverviewFilter, string> = {
  YOUR: "Your",
  PARTICIPATE: "Participate",
  //   NETWORK: "Network",
  ALL: "All",
};

const TEAMS_LIMIT = 10;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TeamCardSkeleton() {
  return (
    <div
      className={cn(
        "flex w-full animate-pulse items-center justify-between",
        "rounded-2xl border border-(--color-bg-border)",
        "bg-(--color-bg-card) p-3.5 shadow-(--shadow-card)",
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-(--color-bg-border)" />

        <div className="min-w-0 space-y-2">
          <div className="h-4 w-36 rounded-full bg-(--color-bg-border)" />
          <div className="h-3 w-20 rounded-full bg-(--color-bg-border)" />
        </div>
      </div>

      <div className="h-5 w-5 rounded-full bg-(--color-bg-border)" />
    </div>
  );
}

function TeamsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <TeamCardSkeleton key={index} />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Teams() {
  const router = useRouter();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /*
   * This prevents IntersectionObserver from starting the same request
   * multiple times before React finishes updating its state.
   */
  const loadingMoreLockRef = useRef(false);

  // ─── Filter state ──────────────────────────────────────────────────────────

  const [activeFilter, setActiveFilter] = useState<TeamOverviewFilter>("YOUR");

  /*
   * This is separate from RTK Query's isLoading because cached queries may
   * return isLoading=false immediately. We still want a full skeleton whenever
   * the user changes filters.
   */
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // ─── Pagination state ─────────────────────────────────────────────────────

  const [skip, setSkip] = useState(0);

  const [teams, setTeams] = useState<Team[]>([]);

  /*
   * Store pagination separately from currentData.
   *
   * When skip changes, currentData may briefly become undefined. Keeping the
   * latest pagination state ensures that the infinite-scroll sentinel remains
   * mounted and the spinner remains visible.
   */
  const [pagination, setPagination] = useState<TeamsOverviewPagination | null>(
    null,
  );

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // ─── API ──────────────────────────────────────────────────────────────────

  const { currentData, isLoading, isFetching, isError } =
    useGetMyTeamsOverviewQuery({
      filter: activeFilter,
      skip,
      limit: TEAMS_LIMIT,
    });

  // ─── Receive and merge API pages ──────────────────────────────────────────

  useEffect(() => {
    if (!currentData) return;

    setTeams((previousTeams) => {
      /*
       * skip === 0 means this is the first page for a filter.
       * Replace the list instead of appending.
       */
      if (currentData.pagination.skip === 0) {
        return currentData.items;
      }

      const existingTeamIds = new Set(previousTeams.map((team) => team.id));

      const newTeams = currentData.items.filter(
        (team) => !existingTeamIds.has(team.id),
      );

      return [...previousTeams, ...newTeams];
    });

    setPagination(currentData.pagination);

    setIsFilterLoading(false);
    setIsLoadingMore(false);

    loadingMoreLockRef.current = false;
  }, [currentData]);

  // Stop loaders if the request fails.

  useEffect(() => {
    if (isFetching || !isError) return;

    setIsFilterLoading(false);
    setIsLoadingMore(false);

    loadingMoreLockRef.current = false;
  }, [isError, isFetching]);

  // ─── Pagination values ────────────────────────────────────────────────────

  const hasMore = pagination?.hasMore === true;

  const hasReachedEnd =
    pagination !== null &&
    pagination.hasMore === false &&
    teams.length > 0 &&
    !isFetching &&
    !isLoadingMore &&
    !isFilterLoading;

  const showFullPageSkeleton =
    isFilterLoading || (isLoading && teams.length === 0);

  const showInitialError =
    isError && teams.length === 0 && !isFilterLoading && !isLoading;

  const showEmptyState =
    !showFullPageSkeleton &&
    !showInitialError &&
    pagination !== null &&
    teams.length === 0;

  // ─── Infinite scroll ──────────────────────────────────────────────────────

  useEffect(() => {
    const element = loadMoreRef.current;

    if (
      !element ||
      !hasMore ||
      isFetching ||
      isLoadingMore ||
      isFilterLoading ||
      loadingMoreLockRef.current
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        const nextSkip = teams.length;

        /*
         * Prevent requesting the same offset again.
         */
        if (nextSkip <= skip) return;

        loadingMoreLockRef.current = true;

        setIsLoadingMore(true);
        setSkip(nextSkip);
      },
      {
        root: null,

        /*
         * Trigger once the spinner section enters the viewport.
         * Keeping this at zero makes the spinner visible to the user.
         */
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetching, isLoadingMore, isFilterLoading, skip, teams.length]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function handleFilterChange(filter: TeamOverviewFilter) {
    if (filter === activeFilter) return;

    loadingMoreLockRef.current = false;

    setActiveFilter(filter);

    setSkip(0);
    setTeams([]);
    setPagination(null);

    setIsLoadingMore(false);
    setIsFilterLoading(true);
  }

  function handleTeamClick(team: Team) {
    router.push(`/my-cricket/${team.id}/players`);
  }

  //   function handleCreateTeam() {
  //     router.push("/create-team");
  //   }

  function getEmptyText() {
    switch (activeFilter) {
      case "PARTICIPATE":
        return "You haven't played for any teams yet";

      //   case "NETWORK":
      //     return "No teams found in your network";

      case "ALL":
        return "No teams found";

      case "YOUR":
      default:
        return "You haven't created any teams yet";
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col bg-(--color-bg-base)">
      {/* ── Create team banner ──────────────────────────────────────────── */}

      {/* <div className="flex items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3.5">
        <p className="text-sm font-medium text-(--color-text-secondary)">
          Want to create a new team?
        </p>

        <button
          type="button"
          onClick={handleCreateTeam}
          className={cn(
            "rounded-xl bg-(--color-brand) px-5 py-2",
            "font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em]",
            "text-white shadow-(--shadow-button)",
            "transition-all active:scale-95",
          )}
        >
          Create
        </button>
      </div> */}

      {/* ── Filters ─────────────────────────────────────────────────────── */}

      <div className="bg-(--color-bg-base) py-3">
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1">
          {TEAM_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => handleFilterChange(filter)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2",
                "font-(family-name:--font-display) text-sm font-bold uppercase tracking-[0.04em]",
                "transition-all duration-150 active:scale-95",
                activeFilter === filter
                  ? "bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.3)]"
                  : "border border-(--color-bg-border) bg-(--color-bg-card) text-(--color-text-secondary)",
              )}
            >
              {TEAM_FILTER_LABELS[filter]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Teams area ──────────────────────────────────────────────────── */}

      <div className="flex-1 px-4 pb-6">
        {showFullPageSkeleton ? (
          <TeamsSkeleton />
        ) : showInitialError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-sm font-medium text-(--color-live)">
              Failed to load teams.
            </p>

            <button
              type="button"
              onClick={() => {
                setIsFilterLoading(true);
                setSkip(0);
              }}
              className={cn(
                "rounded-xl border border-(--color-brand)/25",
                "bg-(--color-bg-card) px-5 py-2.5",
                "font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em]",
                "text-(--color-brand)",
              )}
            >
              Try Again
            </button>
          </div>
        ) : showEmptyState ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
              <Users
                size={28}
                className="text-(--color-brand)"
                strokeWidth={1.8}
              />
            </div>

            <p className="text-sm font-medium text-(--color-text-muted)">
              {getEmptyText()}
            </p>

            {/* <button
              type="button"
              onClick={handleCreateTeam}
              className={cn(
                "mt-1 rounded-xl bg-(--color-brand) px-5 py-2.5",
                "font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em]",
                "text-white shadow-(--shadow-button)",
                "transition-all active:scale-95",
              )}
            >
              Create Team
            </button> */}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Team cards */}

            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onClick={handleTeamClick}
                variant="navigate"
              />
            ))}

            {/* Pagination failure while retaining loaded teams */}

            {isError && teams.length > 0 && !isLoadingMore && (
              <p className="py-3 text-center text-xs font-medium text-(--color-live)">
                Failed to load more teams.
              </p>
            )}

            {/* Infinite-scroll sentinel and spinner */}

            {hasMore && !isError && (
              <div
                ref={loadMoreRef}
                className={cn(
                  "flex items-center justify-center",
                  isLoadingMore ? "min-h-20 py-5" : "h-6",
                )}
                aria-label={isLoadingMore ? "Loading more teams" : undefined}
                aria-live="polite"
              >
                {isLoadingMore && (
                  <span
                    className={cn(
                      "h-8 w-8 animate-spin rounded-full border-[3px]",
                      "border-(--color-brand)/20 border-t-(--color-brand)",
                    )}
                  />
                )}
              </div>
            )}

            {/* End message */}

            {hasReachedEnd && (
              <p className="py-3 text-center text-xs italic text-(--color-text-muted)">
                You have reached the end
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
