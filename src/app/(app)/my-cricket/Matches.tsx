"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/cn";
import { MatchesList } from "@/components/match/MatchesList";
import { LiveOptionsSheet } from "@/components/match/LiveOptionsSheet";

import { useGetMyMatchesOverviewQuery } from "@/store/api/matchApi";
import { useAppDispatch } from "@/store/hooks";
import {
  resetMatch,
  setMatchContext,
} from "@/store/startMatch/startMatchSlice";

import type { Team } from "@/types/team";
import type {
  MatchOverviewFilter,
  Match,
  MatchesOverviewPagination,
} from "@/types/match";

import { matchToMatchCard } from "@/lib/adapters/matchCardAdapter";
import type { MatchCardModel } from "@/types/matchCard";

// ─── Constants ────────────────────────────────────────────────────────────────

const MY_MATCH_TABS: MatchOverviewFilter[] = [
  "YOUR",
  "PLAYED",
  // "NETWORK",
  "ALL",
];

const MY_MATCH_TAB_LABELS: Record<MatchOverviewFilter, string> = {
  YOUR: "Your",
  PLAYED: "Played",
  // NETWORK: "Network",
  ALL: "All",
};

const MATCHES_LIMIT = 10;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MyMatches() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Used by IntersectionObserver
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Prevents the observer from triggering the same page repeatedly
  // before React updates isLoadingMore.
  const loadingMoreLockRef = useRef(false);

  // ─── UI state ─────────────────────────────────────────────────────────────

  const [activeTab, setActiveTab] = useState<MatchOverviewFilter>("YOUR");

  const [selectedMatch, setSelectedMatch] = useState<MatchCardModel | null>(
    null,
  );

  const [showLiveOptions, setShowLiveOptions] = useState(false);

  // ─── Pagination state ─────────────────────────────────────────────────────

  const [skip, setSkip] = useState(0);

  const [matches, setMatches] = useState<Match[]>([]);

  /*
   * Keep pagination separately from currentData.
   *
   * When skip changes, RTK Query's currentData can temporarily become
   * undefined while the next page is loading. If hasMore is derived directly
   * from currentData, the sentinel disappears and the spinner never renders.
   */
  const [pagination, setPagination] =
    useState<MatchesOverviewPagination | null>(null);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // ─── API ──────────────────────────────────────────────────────────────────

  const { currentData, isLoading, isFetching, isError } =
    useGetMyMatchesOverviewQuery({
      filter: activeTab,
      skip,
      limit: MATCHES_LIMIT,
    });

  // ─── Store received pages ─────────────────────────────────────────────────

  useEffect(() => {
    if (!currentData) return;

    setMatches((previousMatches) => {
      // First page or a newly selected filter
      if (currentData.pagination.skip === 0) {
        return currentData.items;
      }

      // Prevent duplicate cards after refetching
      const existingMatchIds = new Set(
        previousMatches.map((match) => match.matchId),
      );

      const newMatches = currentData.items.filter(
        (match) => !existingMatchIds.has(match.matchId),
      );

      return [...previousMatches, ...newMatches];
    });

    setPagination(currentData.pagination);

    setIsFilterLoading(false);
    setIsLoadingMore(false);
    loadingMoreLockRef.current = false;
  }, [currentData]);

  // Stop the pagination spinner if a load-more request fails.
  useEffect(() => {
    if (!isFetching && isError && skip > 0) {
      setIsFilterLoading(false);
      setIsLoadingMore(false);
      loadingMoreLockRef.current = false;
    }
  }, [isError, isFetching, skip]);

  // ─── Derived pagination values ────────────────────────────────────────────

  const hasMore = pagination?.hasMore === true;

  const hasReachedEnd =
    pagination !== null &&
    pagination.hasMore === false &&
    matches.length > 0 &&
    !isFetching &&
    !isLoadingMore;

  const showFullPageSkeleton =
    isFilterLoading || (isLoading && matches.length === 0);

  const showInitialError = isError && matches.length === 0 && !isFilterLoading;

  const showEmptyState =
    !showFullPageSkeleton && !showInitialError && matches.length === 0;

  const isInitialLoading = isLoading && matches.length === 0;

  const isInitialError = isError && matches.length === 0;

  // ─── Infinite scroll observer ─────────────────────────────────────────────

  useEffect(() => {
    const element = loadMoreRef.current;

    if (
      !element ||
      !hasMore ||
      isFetching ||
      isLoadingMore ||
      loadingMoreLockRef.current
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        const nextSkip = matches.length;

        /*
         * Do not request the same page again.
         * For example, when skip is already 10, nextSkip must be greater
         * than 10 before another request starts.
         */
        if (nextSkip <= skip) return;

        loadingMoreLockRef.current = true;
        setIsLoadingMore(true);
        setSkip(nextSkip);
      },
      {
        root: null,

        /*
         * Start loading when the sentinel actually reaches the viewport.
         * This makes the spinner visible instead of starting the request
         * hundreds of pixels before the user reaches the bottom.
         */
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetching, isLoadingMore, matches.length, skip]);

  // ─── Match card models ────────────────────────────────────────────────────

  const matchCards = useMemo<MatchCardModel[]>(
    () => matches.map(matchToMatchCard),
    [matches],
  );

  // ─── Tab change ───────────────────────────────────────────────────────────

  function handleTabChange(tab: MatchOverviewFilter) {
    if (tab === activeTab) return;

    loadingMoreLockRef.current = false;

    setActiveTab(tab);
    setSkip(0);
    setMatches([]);
    setPagination(null);
    setIsLoadingMore(false);
    setIsFilterLoading(true);
    setSelectedMatch(null);
    setShowLiveOptions(false);
  }

  // ─── Match navigation ─────────────────────────────────────────────────────

  function getMatchRoute(match: MatchCardModel) {
    switch (match.status) {
      case "DRAFT":
      case "SCHEDULED":
        return "/start-match/line-up";

      case "READY_FOR_TOSS":
        return "/start-match/toss";

      case "TOSS_DONE":
      case "INNINGS_BREAK":
        return "/start-match/start-innings";

      case "LIVE":
        if (
          match.primaryAction === "START_SCORING" ||
          match.primaryAction === "START_SECOND_INNINGS"
        ) {
          return "/start-match/start-innings";
        }

        return "/scoring";

      case "COMPLETED":
        return `/matches/${match.matchId}/scorecard`;

      default:
        return `/start-match/${match.matchId}`;
    }
  }

  function setSelectedMatchContext(match: MatchCardModel) {
    dispatch(
      setMatchContext({
        matchId: match.matchId,
        lineUpMode: match.lineupMode ?? "FLEXIBLE",

        teamA: {
          id: match.teamA.teamId,
          name: match.teamA.name,
          logoUrl: match.teamA.logoUrl,
          sportType: "CRICKET",
          memberCount: match.teamA.squadCount,
        } as Team,

        teamB: {
          id: match.teamB.teamId,
          name: match.teamB.name,
          logoUrl: match.teamB.logoUrl,
          sportType: "CRICKET",
          memberCount: match.teamB.squadCount,
        } as Team,

        teamACaptain: match.teamA.captainId
          ? {
              id: match.teamA.captainId,
              name: "",
            }
          : null,

        teamAKeeper: match.teamA.wicketKeeperId
          ? {
              id: match.teamA.wicketKeeperId,
              name: "",
            }
          : null,

        teamBCaptain: match.teamB.captainId
          ? {
              id: match.teamB.captainId,
              name: "",
            }
          : null,

        teamBKeeper: match.teamB.wicketKeeperId
          ? {
              id: match.teamB.wicketKeeperId,
              name: "",
            }
          : null,
      }),
    );
  }

  function handleMatchClick(match: MatchCardModel) {
    setSelectedMatchContext(match);

    if (match.status === "LIVE") {
      setSelectedMatch(match);
      setShowLiveOptions(true);
      return;
    }

    router.push(getMatchRoute(match));
  }

  function handleStartMatch() {
    dispatch(resetMatch());
    router.push("/start-match");
  }

  // ─── Empty state ──────────────────────────────────────────────────────────

  function getEmptyText() {
    switch (activeTab) {
      case "PLAYED":
        return "You are not participating in any matches yet";

      // case "NETWORK":
      //   return "No matches found in your network";

      case "ALL":
        return "No matches found";

      case "YOUR":
      default:
        return "You haven't created any matches yet";
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col bg-(--color-bg-base)">
      {/* ── Start match banner ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3.5">
        <p className="text-sm font-medium text-(--color-text-secondary)">
          Want to start a match?
        </p>

        <button
          type="button"
          onClick={handleStartMatch}
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

      {/* ── Filter tabs ─────────────────────────────────────────────────── */}
      <div className="bg-(--color-bg-base) py-3">
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1">
          {MY_MATCH_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2",
                "font-(family-name:--font-display) text-sm font-bold uppercase tracking-[0.04em]",
                "transition-all duration-150 active:scale-95",
                activeTab === tab
                  ? "bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.3)]"
                  : "border border-(--color-bg-border) bg-(--color-bg-card) text-(--color-text-secondary)",
              )}
            >
              {MY_MATCH_TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Match list area ─────────────────────────────────────────────── */}
      <div className="flex-1 px-4 pb-6">
        {showFullPageSkeleton ? (
          <MatchesList
            matches={[]}
            isLoading
            isError={false}
            onMatchClick={handleMatchClick}
          />
        ) : showInitialError ? (
          <MatchesList
            matches={[]}
            isLoading={false}
            isError
            onMatchClick={handleMatchClick}
          />
        ) : showEmptyState ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="7"
                  y="6"
                  width="2.5"
                  height="16"
                  rx="1.25"
                  fill="var(--color-brand)"
                  opacity="0.5"
                />

                <rect
                  x="12.75"
                  y="5"
                  width="2.5"
                  height="17"
                  rx="1.25"
                  fill="var(--color-brand)"
                  opacity="0.7"
                />

                <rect
                  x="18.5"
                  y="6"
                  width="2.5"
                  height="16"
                  rx="1.25"
                  fill="var(--color-brand)"
                  opacity="0.5"
                />
              </svg>
            </div>

            <p className="text-sm font-medium text-(--color-text-muted)">
              {getEmptyText()}
            </p>

            <button
              type="button"
              onClick={handleStartMatch}
              className={cn(
                "mt-1 rounded-xl bg-(--color-brand) px-5 py-2.5",
                "font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em]",
                "text-white shadow-(--shadow-button)",
                "transition-all active:scale-95",
              )}
            >
              Start a Match
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <MatchesList
              matches={matchCards}
              isLoading={false}
              isError={false}
              onMatchClick={handleMatchClick}
            />

            {isError && matches.length > 0 && !isLoadingMore && (
              <p className="py-3 text-center text-xs font-medium text-(--color-live)">
                Failed to load more matches.
              </p>
            )}

            {hasMore && !isError && (
              <div
                ref={loadMoreRef}
                className={cn(
                  "flex items-center justify-center",
                  isLoadingMore ? "min-h-20 py-5" : "h-4",
                )}
                aria-label={isLoadingMore ? "Loading more matches" : undefined}
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

            {hasReachedEnd && (
              <p className="py-3 text-center text-xs italic text-(--color-text-muted)">
                You have reached the end
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Live match options ──────────────────────────────────────────── */}
      {selectedMatch && (
        <LiveOptionsSheet
          showLiveOptions={showLiveOptions}
          setShowLiveOptions={setShowLiveOptions}
          match={selectedMatch}
          getMatchRoute={getMatchRoute}
        />
      )}
    </div>
  );
}
