"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

import { cn } from "@/lib/cn";
import { useAppDispatch } from "@/store/hooks";
import { resetMatch } from "@/store/startMatch/startMatchSlice";

import { useGetMyTournamentsOverviewQuery } from "@/store/api/cricket/tournamentApi";

import type {
  TournamentOverviewFilter,
  Tournament,
  TournamentsOverviewPagination,
} from "@/store/api/cricket/tournamentApi";

import { TournamentCard } from "./TournamentCard";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOURNAMENT_FILTERS: TournamentOverviewFilter[] = [
  "YOUR",
  "PARTICIPATE",
  // "NETWORK",
  "ALL",
];

const TOURNAMENT_FILTER_LABELS: Record<TournamentOverviewFilter, string> = {
  YOUR: "Your",
  PARTICIPATE: "Played",
  NETWORK: "Network",
  ALL: "All",
};

const TOURNAMENTS_LIMIT = 10;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TournamentSkeletonCard() {
  return (
    <div
      className={cn(
        "fixture-bar animate-pulse space-y-3 rounded-r-2xl",
        "bg-(--color-bg-card) p-4 shadow-(--shadow-card)",
      )}
    >
      <div className="flex justify-between gap-4">
        <div className="h-3 w-32 rounded-full bg-(--color-bg-border)" />
        <div className="h-5 w-20 rounded-full bg-(--color-bg-border)" />
      </div>

      <div className="h-3 w-48 rounded-full bg-(--color-bg-border)" />

      <div className="h-px bg-(--color-bg-border)" />

      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-(--color-bg-border)" />
        <div className="h-4 w-36 rounded-full bg-(--color-bg-border)" />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-(--color-bg-border)" />
        <div className="h-4 w-28 rounded-full bg-(--color-bg-border)" />
      </div>
    </div>
  );
}

function TournamentsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <TournamentSkeletonCard key={index} />
      ))}
    </div>
  );
}

// ─── Filter chips ─────────────────────────────────────────────────────────────

function FilterChips({
  active,
  onChange,
}: {
  active: TournamentOverviewFilter;
  onChange: (filter: TournamentOverviewFilter) => void;
}) {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1">
      {TOURNAMENT_FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={cn(
            "shrink-0 rounded-full px-5 py-2",
            "font-(family-name:--font-display) text-sm font-bold uppercase tracking-[0.04em]",
            "transition-all duration-150 active:scale-95",
            active === filter
              ? "bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.3)]"
              : "border border-(--color-bg-border) bg-(--color-bg-card) text-(--color-text-secondary) hover:border-(--color-brand)/30",
          )}
        >
          {TOURNAMENT_FILTER_LABELS[filter]}
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Tournaments() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreLockRef = useRef(false);

  // ─── Filter state ──────────────────────────────────────────────────────────

  const [activeFilter, setActiveFilter] =
    useState<TournamentOverviewFilter>("YOUR");

  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // ─── Pagination state ─────────────────────────────────────────────────────

  const [skip, setSkip] = useState(0);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const [pagination, setPagination] =
    useState<TournamentsOverviewPagination | null>(null);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // ─── API ──────────────────────────────────────────────────────────────────

  const { currentData, isLoading, isFetching, isError } =
    useGetMyTournamentsOverviewQuery({
      filter: activeFilter,
      skip,
      limit: TOURNAMENTS_LIMIT,
    });

  // ─── Merge API pages ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!currentData) return;

    setTournaments((previousTournaments) => {
      if (currentData.pagination.skip === 0) {
        return currentData.items;
      }

      const existingTournamentIds = new Set(
        previousTournaments.map((tournament) => tournament.id),
      );

      const newTournaments = currentData.items.filter(
        (tournament) => !existingTournamentIds.has(tournament.id),
      );

      return [...previousTournaments, ...newTournaments];
    });

    setPagination(currentData.pagination);

    setIsFilterLoading(false);
    setIsLoadingMore(false);

    loadingMoreLockRef.current = false;
  }, [currentData]);

  // Stop loaders when a request fails.

  useEffect(() => {
    if (isFetching || !isError) return;

    setIsFilterLoading(false);
    setIsLoadingMore(false);

    loadingMoreLockRef.current = false;
  }, [isError, isFetching]);

  // ─── Derived states ────────────────────────────────────────────────────────

  const hasMore = pagination?.hasMore === true;

  const showFullPageSkeleton =
    isFilterLoading || (isLoading && tournaments.length === 0);

  const showInitialError =
    isError && tournaments.length === 0 && !isFilterLoading && !isLoading;

  const showEmptyState =
    !showFullPageSkeleton &&
    !showInitialError &&
    pagination !== null &&
    tournaments.length === 0;

  const hasReachedEnd =
    pagination !== null &&
    pagination.hasMore === false &&
    tournaments.length > 0 &&
    !isFetching &&
    !isLoadingMore &&
    !isFilterLoading;

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

        const nextSkip = tournaments.length;

        if (nextSkip <= skip) return;

        loadingMoreLockRef.current = true;

        setIsLoadingMore(true);
        setSkip(nextSkip);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    hasMore,
    isFetching,
    isFilterLoading,
    isLoadingMore,
    skip,
    tournaments.length,
  ]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function handleFilterChange(filter: TournamentOverviewFilter) {
    if (filter === activeFilter) return;

    loadingMoreLockRef.current = false;

    setActiveFilter(filter);
    setSkip(0);

    setTournaments([]);
    setPagination(null);

    setIsLoadingMore(false);
    setIsFilterLoading(true);
  }

  function handleTournamentClick(tournament: Tournament) {
    router.push(`/tournaments/${tournament.id}`);
  }

  function handleCreateTournament() {
    dispatch(resetMatch());

    router.push("/add-tournaments-series/create-tournament");
  }

  function retryInitialRequest() {
    /*
     * Changing skip from 0 to 0 does not necessarily force RTK Query
     * to execute again. If you require a retry button, prefer exposing
     * refetch() from the query hook, as shown below.
     */
  }

  function getEmptyText() {
    switch (activeFilter) {
      case "PARTICIPATE":
        return "You are not participating in any tournaments yet";

      // case "NETWORK":
      //   return "No tournaments found in your network";

      case "ALL":
        return "No tournaments found";

      case "YOUR":
      default:
        return "You haven't created any tournaments yet";
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col bg-(--color-bg-base)">
      {/* Host tournament banner */}
      <div className="flex items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3.5">
        <p className="text-sm font-medium text-(--color-text-secondary)">
          Want to host a tournament?
        </p>

        <button
          type="button"
          onClick={handleCreateTournament}
          className={cn(
            "rounded-xl bg-(--color-brand) px-5 py-2",
            "font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em]",
            "text-white shadow-(--shadow-button)",
            "transition-all active:scale-95",
          )}
        >
          Start
        </button>
      </div>

      {/* Filter chips */}
      <div className="bg-(--color-bg-base) py-3">
        <FilterChips active={activeFilter} onChange={handleFilterChange} />
      </div>

      {/* Tournament list */}
      <div className="flex-1 px-4 pb-6">
        {showFullPageSkeleton ? (
          <TournamentsSkeleton />
        ) : showInitialError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-sm font-medium text-(--color-live)">
              Failed to load tournaments.
            </p>
          </div>
        ) : showEmptyState ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
              <Trophy
                size={28}
                strokeWidth={1.8}
                className="text-(--color-brand)"
              />
            </div>

            <p className="text-sm font-medium text-(--color-text-muted)">
              {getEmptyText()}
            </p>

            <button
              type="button"
              onClick={handleCreateTournament}
              className={cn(
                "mt-1 rounded-xl bg-(--color-brand) px-5 py-2.5",
                "font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em]",
                "text-white shadow-(--shadow-button)",
                "transition-all active:scale-95",
              )}
            >
              Start a Tournament
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onClick={() => handleTournamentClick(tournament)}
              />
            ))}

            {/* Pagination error while retaining loaded tournaments */}
            {isError && tournaments.length > 0 && !isLoadingMore && (
              <p className="py-3 text-center text-xs font-medium text-(--color-live)">
                Failed to load more tournaments.
              </p>
            )}

            {/* Infinite-scroll sentinel */}
            {hasMore && !isError && (
              <div
                ref={loadMoreRef}
                className={cn(
                  "flex items-center justify-center",
                  isLoadingMore ? "min-h-20 py-5" : "h-6",
                )}
                aria-label={
                  isLoadingMore ? "Loading more tournaments" : undefined
                }
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

            {/* End marker */}
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
