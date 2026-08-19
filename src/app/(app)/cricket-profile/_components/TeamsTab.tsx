// src/app/(app)/cricket-profile/_components/TeamsTab.tsx

"use client";

import { RefreshCcw, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useGetMyCricketProfileTeamsQuery } from "@/store/api/cricket/teamApi";

import type { CricketProfileTeamHistoryItem } from "@/types/cricket/team";

import { TeamHistoryCard } from "./TeamHistoryCard";

const PAGE_LIMIT = 10;

function TeamsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)"
        >
          <div className="flex gap-3.5 p-4">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-2xl bg-(--color-bg-border)" />

            <div className="flex-1 space-y-2">
              <div className="h-5 w-2/3 animate-pulse rounded bg-(--color-bg-border)" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-(--color-bg-border)" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-(--color-bg-border)" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-(--color-bg-border)" />
            </div>
          </div>

          <div className="mx-4 h-px bg-(--color-bg-border)" />

          <div className="grid grid-cols-3 gap-4 p-4">
            {Array.from({
              length: 3,
            }).map((_, statIndex) => (
              <div key={statIndex} className="space-y-2">
                <div className="mx-auto h-5 w-8 animate-pulse rounded bg-(--color-bg-border)" />
                <div className="mx-auto h-3 w-12 animate-pulse rounded bg-(--color-bg-border)" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamsEmptyState() {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-6 py-10 text-center shadow-(--shadow-card)">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-(--color-bg-tint)">
        <Shield className="h-8 w-8 text-(--color-brand)" />
      </div>

      <h3 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
        No teams found
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-(--color-text-secondary)">
        Teams represented by this player will appear here.
      </p>
    </div>
  );
}

function TeamsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--color-bg-tint)">
        <Shield className="h-7 w-7 text-(--color-brand)" />
      </div>

      <h3 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
        Unable to load teams
      </h3>

      <p className="mt-2 text-sm text-(--color-text-secondary)">
        Something went wrong while loading the team history.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mx-auto mt-5 flex items-center gap-2 rounded-xl bg-(--color-brand) px-5 py-2.5 text-sm font-bold text-white"
      >
        <RefreshCcw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}

export function TeamsTab() {
  const router = useRouter();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [skip, setSkip] = useState(0);

  const [allTeams, setAllTeams] = useState<CricketProfileTeamHistoryItem[]>([]);

  const { currentData, isLoading, isFetching, isError, refetch } =
    useGetMyCricketProfileTeamsQuery({
      skip,
      limit: PAGE_LIMIT,
    });

  useEffect(() => {
    if (!currentData?.items.length) {
      return;
    }

    setAllTeams((previousTeams) => {
      const teamMap = new Map(previousTeams.map((team) => [team.teamId, team]));

      currentData.items.forEach((team) => {
        teamMap.set(team.teamId, team);
      });

      return Array.from(teamMap.values());
    });
  }, [currentData]);

  const hasMore = currentData?.pagination.hasMore ?? false;

  const totalTeams = currentData?.pagination.total ?? 0;

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

        setSkip(allTeams.length);
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
  }, [allTeams.length, hasMore, isFetching, isError]);

  // function handleTeamClick(team: CricketProfileTeamHistoryItem) {
  //   router.push(`/teams/${team.teamId}`);
  // }

  const showInitialLoading = isLoading && allTeams.length === 0;

  const showInitialError = isError && allTeams.length === 0;

  const showEmptyState =
    !showInitialLoading && !showInitialError && allTeams.length === 0;

  return (
    <section className="flex flex-col gap-4 p-4">
      <div>
        <h2 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
          Teams
        </h2>

        <p className="mt-0.5 text-xs text-(--color-text-secondary)">
          {totalTeams}{" "}
          {totalTeams === 1 ? "team represented" : "teams represented"}
        </p>
      </div>

      {showInitialLoading ? (
        <TeamsSkeleton />
      ) : showInitialError ? (
        <TeamsError
          onRetry={() => {
            void refetch();
          }}
        />
      ) : showEmptyState ? (
        <TeamsEmptyState />
      ) : (
        <div className="space-y-3">
          {allTeams.map((team) => (
            <TeamHistoryCard
              key={team.teamId}
              team={team}
              // onClick={handleTeamClick}
            />
          ))}
        </div>
      )}

      {isFetching && allTeams.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--color-bg-border) border-t-(--color-brand)" />
        </div>
      )}

      {hasMore && (
        <div ref={loadMoreRef} aria-hidden="true" className="h-10 w-full" />
      )}

      {!hasMore && allTeams.length > 0 && !isFetching && (
        <p className="py-3 text-center text-xs text-(--color-text-muted)">
          All teams loaded
        </p>
      )}
    </section>
  );
}
