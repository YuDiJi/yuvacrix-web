// src/app/(app)/cricket-profile/_components/TrophiesTab.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Award, CalendarDays, RefreshCcw, Trophy } from "lucide-react";

import { cn } from "@/lib/cn";
import { useGetMyCricketProfileTrophiesQuery } from "@/store/api/cricket/cricketProfileApi";

import type {
  CricketProfileTrophyItem,
  CricketProfileTrophyScope,
} from "@/types/cricket/cricketProfile";

const PAGE_LIMIT = 10;

type TrophyScopeTab = {
  label: string;
  value: CricketProfileTrophyScope;
};

const TROPHY_SCOPE_TABS: TrophyScopeTab[] = [
  {
    label: "Matches",
    value: "MATCHES",
  },
  {
    label: "Tournaments",
    value: "TOURNAMENTS",
  },
];

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getAchievementLabel(type: string) {
  const labels: Record<string, string> = {
    PLAYER_OF_THE_MATCH: "Player of the Match",
    BEST_BATTER: "Best Batter",
    BEST_BOWLER: "Best Bowler",
    BEST_FIELDER: "Best Fielder",
    TOURNAMENT_WINNER: "Tournament Winner",
    TOURNAMENT_RUNNER_UP: "Tournament Runner-up",
    MOST_RUNS: "Most Runs",
    MOST_WICKETS: "Most Wickets",
    MOST_CATCHES: "Most Catches",
    OTHER: "Achievement",
  };

  return (
    labels[type] ??
    type
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

function getThemeClasses(item: CricketProfileTrophyItem) {
  switch (item.theme) {
    case "RED":
      return {
        border: "border-l-(--color-live)",
        iconBackground: "bg-red-50",
        iconColor: "text-(--color-live)",
        badge: "bg-red-50 text-(--color-live)",
      };

    case "GOLD":
    case "ORANGE":
      return {
        border: "border-l-(--color-six)",
        iconBackground: "bg-amber-50",
        iconColor: "text-(--color-six)",
        badge: "bg-amber-50 text-amber-700",
      };

    case "GREEN":
      return {
        border: "border-l-(--color-four)",
        iconBackground: "bg-green-50",
        iconColor: "text-(--color-four)",
        badge: "bg-green-50 text-green-700",
      };

    case "PURPLE":
      return {
        border: "border-l-(--color-violet)",
        iconBackground: "bg-purple-50",
        iconColor: "text-(--color-violet)",
        badge: "bg-purple-50 text-purple-700",
      };

    case "BLUE":
    default:
      return {
        border: "border-l-(--color-brand)",
        iconBackground: "bg-(--color-bg-tint)",
        iconColor: "text-(--color-brand)",
        badge: "bg-(--color-bg-tint) text-(--color-brand)",
      };
  }
}

function TrophyScopeTabs({
  value,
  onChange,
}: {
  value: CricketProfileTrophyScope;
  onChange: (value: CricketProfileTrophyScope) => void;
}) {
  return (
    <div className="mx-auto grid w-full max-w-[320px] grid-cols-2 gap-2 rounded-2xl bg-(--color-bg-border) p-1">
      {TROPHY_SCOPE_TABS.map((tab) => {
        const isActive = tab.value === value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "min-h-10 rounded-xl px-4 text-sm font-bold transition-all",
              isActive
                ? "bg-(--color-brand) text-white shadow-sm"
                : "text-(--color-text-secondary)",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function PerformanceSnapshot({ item }: { item: CricketProfileTrophyItem }) {
  const batting = item.performanceSnapshot?.batting;

  const bowling = item.performanceSnapshot?.bowling;

  if (!batting && !bowling) {
    return null;
  }

  return (
    <div className="space-y-3 border-t border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3">
      {batting && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-(--color-brand)">
            Batting
          </p>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-(--color-text-primary)">
            <span>
              {batting.runs}
              {batting.balls > 0 ? ` (${batting.balls})` : ""}
            </span>

            <span>{batting.fours} fours</span>

            <span>{batting.sixes} sixes</span>

            <span>{batting.strikeRate} SR</span>
          </div>
        </div>
      )}

      {bowling && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-(--color-brand)">
            Bowling
          </p>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-(--color-text-primary)">
            <span>{bowling.overs} Ov</span>

            <span>{bowling.runsConceded} Runs</span>

            <span>{bowling.wickets} Wkts</span>

            <span>{bowling.economy} Econ</span>
          </div>
        </div>
      )}
    </div>
  );
}

function TrophyCard({ item }: { item: CricketProfileTrophyItem }) {
  const theme = getThemeClasses(item);

  const awardedDate = formatDate(item.awardedAt);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-(--color-bg-border) border-l-4 bg-(--color-bg-card) shadow-sm",
        theme.border,
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            theme.iconBackground,
          )}
        >
          <Trophy className={cn("h-6 w-6", theme.iconColor)} />
        </div>

        <div className="min-w-0 flex-1">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide",
              theme.badge,
            )}
          >
            {getAchievementLabel(item.type)}
          </span>

          <h3 className="mt-2 font-(family-name:--font-display) text-xl font-black uppercase leading-tight tracking-wide text-(--color-text-primary)">
            {item.title}
          </h3>

          {item.description && (
            <p className="mt-1.5 text-sm leading-5 text-(--color-text-secondary)">
              {item.description}
            </p>
          )}

          {awardedDate && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-(--color-text-muted)">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{awardedDate}</span>
            </div>
          )}
        </div>
      </div>

      <PerformanceSnapshot item={item} />
    </article>
  );
}

function TrophiesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)"
        >
          <div className="flex gap-3 p-4">
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-(--color-bg-border)" />

            <div className="flex-1 space-y-2">
              <div className="h-5 w-28 animate-pulse rounded-full bg-(--color-bg-border)" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-(--color-bg-border)" />
              <div className="h-4 w-full animate-pulse rounded bg-(--color-bg-border)" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-(--color-bg-border)" />
            </div>
          </div>

          <div className="h-20 animate-pulse border-t border-(--color-bg-border) bg-(--color-bg-tint)" />
        </div>
      ))}
    </div>
  );
}

function TrophiesEmptyState({
  message,
  scope,
}: {
  message?: string;
  scope: CricketProfileTrophyScope;
}) {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-6 py-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-(--color-bg-tint)">
        <Award className="h-8 w-8 text-(--color-brand)" />
      </div>

      <h3 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
        No trophies yet
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-(--color-text-secondary)">
        {message ??
          (scope === "MATCHES"
            ? "Match achievements will appear here once they are recorded."
            : "Tournament achievements will appear here once they are recorded.")}
      </p>
    </div>
  );
}

function TrophiesError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--color-bg-tint)">
        <Trophy className="h-7 w-7 text-(--color-brand)" />
      </div>

      <h3 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
        Unable to load trophies
      </h3>

      <p className="mt-2 text-sm text-(--color-text-secondary)">
        Something went wrong while loading achievements.
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

export function TrophiesTab() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [activeScope, setActiveScope] =
    useState<CricketProfileTrophyScope>("MATCHES");

  const [skip, setSkip] = useState(0);

  const [allTrophies, setAllTrophies] = useState<CricketProfileTrophyItem[]>(
    [],
  );

  const { currentData, isLoading, isFetching, isError, refetch } =
    useGetMyCricketProfileTrophiesQuery({
      scope: activeScope,
      skip,
      limit: PAGE_LIMIT,
    });

  /*
   * Reset accumulated data immediately when the
   * user changes Matches/Tournaments.
   */
  function handleScopeChange(scope: CricketProfileTrophyScope) {
    if (scope === activeScope) {
      return;
    }

    setActiveScope(scope);
    setSkip(0);
    setAllTrophies([]);
  }

  useEffect(() => {
    if (!currentData?.items.length) {
      return;
    }

    setAllTrophies((previousTrophies) => {
      const trophyMap = new Map(
        previousTrophies.map((trophy) => [trophy.achievementId, trophy]),
      );

      currentData.items.forEach((trophy) => {
        trophyMap.set(trophy.achievementId, trophy);
      });

      return Array.from(trophyMap.values());
    });
  }, [currentData]);

  const hasMore = currentData?.pagination.hasMore ?? false;

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

        setSkip(allTrophies.length);
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
  }, [hasMore, isFetching, isError, allTrophies.length]);

  const total = currentData?.pagination.total ?? 0;

  const emptyMessage = currentData?.emptyState?.message;

  const showInitialSkeleton =
    isLoading || (isFetching && allTrophies.length === 0);

  const showInitialError = isError && allTrophies.length === 0;

  const isEmpty =
    !showInitialSkeleton && !showInitialError && allTrophies.length === 0;

  const sectionLabel = useMemo(
    () =>
      activeScope === "MATCHES"
        ? "Match achievements"
        : "Tournament achievements",
    [activeScope],
  );

  return (
    <section className="flex flex-col gap-5 p-4">
      <TrophyScopeTabs value={activeScope} onChange={handleScopeChange} />

      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
            {sectionLabel}
          </h2>

          <p className="mt-0.5 text-xs text-(--color-text-secondary)">
            {total} {total === 1 ? "achievement" : "achievements"}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-bg-tint)">
          <Trophy className="h-5 w-5 text-(--color-brand)" />
        </div>
      </div>

      {showInitialSkeleton ? (
        <TrophiesSkeleton />
      ) : showInitialError ? (
        <TrophiesError
          onRetry={() => {
            void refetch();
          }}
        />
      ) : isEmpty ? (
        <TrophiesEmptyState scope={activeScope} message={emptyMessage} />
      ) : (
        <div className="space-y-3">
          {allTrophies.map((trophy) => (
            <TrophyCard key={trophy.achievementId} item={trophy} />
          ))}
        </div>
      )}

      {isFetching && allTrophies.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--color-bg-border) border-t-(--color-brand)" />
        </div>
      )}

      {hasMore && (
        <div ref={loadMoreRef} aria-hidden="true" className="h-10 w-full" />
      )}

      {!hasMore && allTrophies.length > 0 && !isFetching && (
        <p className="py-3 text-center text-xs text-(--color-text-muted)">
          All achievements loaded
        </p>
      )}
    </section>
  );
}
