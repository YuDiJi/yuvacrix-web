"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { MatchesList } from "@/components/match/MatchesList";
import { matchToMatchCard } from "@/lib/adapters/matchCardAdapter";
import { useGetMyCricketProfileMatchesQuery } from "@/store/api/cricketProfileApi";

import type { Match } from "@/types/match";
import type { MatchCardModel } from "@/types/matchCard";

const PAGE_LIMIT = 20;

export function MatchesTab() {
  const router = useRouter();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [skip, setSkip] = useState(0);

  const [allMatches, setAllMatches] = useState<Match[]>([]);

  const { currentData, isLoading, isFetching, isError, refetch } =
    useGetMyCricketProfileMatchesQuery({
      skip,
      limit: PAGE_LIMIT,
    });

  useEffect(() => {
    if (!currentData?.items.length) {
      return;
    }

    setAllMatches((previousMatches) => {
      const matchesMap = new Map(
        previousMatches.map((match) => [match.matchId, match]),
      );

      currentData.items.forEach((match) => {
        matchesMap.set(match.matchId, match);
      });

      return Array.from(matchesMap.values());
    });
  }, [currentData]);

  const matchCards = useMemo<MatchCardModel[]>(() => {
    return allMatches.map(matchToMatchCard);
  }, [allMatches]);

  const hasMore = currentData?.pagination.hasMore ?? false;

  const totalMatches = currentData?.pagination.total ?? 0;

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !hasMore || isFetching || isError) {
          return;
        }

        setSkip(allMatches.length);
      },
      {
        root: null,
        rootMargin: "300px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [allMatches.length, hasMore, isFetching, isError]);

  function handleMatchClick(match: MatchCardModel) {
    router.push(`/matches/${match.matchId}/scorecard`);
  }

  const isInitialLoading = isLoading && allMatches.length === 0;

  const isInitialError = isError && allMatches.length === 0;

  return (
    <section className="flex flex-col gap-4 p-4">
      {isInitialError ? (
        <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center">
          <p className="text-sm text-(--color-live)">
            Failed to load match history.
          </p>

          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="mt-3 text-sm font-bold text-(--color-brand)"
          >
            Try again
          </button>
        </div>
      ) : (
        <MatchesList
          matches={matchCards}
          isLoading={isInitialLoading}
          isError={false}
          onMatchClick={handleMatchClick}
        />
      )}

      {isFetching && allMatches.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--color-bg-border) border-t-(--color-brand)" />
        </div>
      )}

      {hasMore && (
        <div ref={loadMoreRef} aria-hidden="true" className="h-10 w-full" />
      )}

      {!hasMore && allMatches.length > 0 && !isFetching && (
        <p className="py-3 text-center text-xs text-(--color-text-muted)">
          No more matches
        </p>
      )}
    </section>
  );
}
