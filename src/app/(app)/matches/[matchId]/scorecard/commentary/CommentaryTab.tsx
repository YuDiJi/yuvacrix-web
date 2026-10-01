"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGetScorecardCommentaryQuery } from "@/store/api/cricket/scorecardApi";
import { CommentaryItem } from "@/types/cricket/scorecard";
import CommentaryItemCard from "./CommentaryItemCard";
import CommentaryFilters, { CommentaryFilterKey } from "./CommentaryFilters";
import CommentaryTeamSelector, { TeamSide } from "./CommentaryTeamSelector";

type Props = {
  matchId: string;
};

const LIMIT = 20;

// Build a unique key for de-duping commentary items across pages.
function itemKey(item: CommentaryItem): string {
  return `${item.inningsId}-${item.sequenceNumber}`;
}

// Local fallback filtering for FOUR/SIX when eventType isn't reliably set.
function matchesLocalFilter(
  item: CommentaryItem,
  filter: CommentaryFilterKey,
): boolean {
  if (filter === "ALL") return true;
  if (filter === "WICKET")
    return Boolean(item.isWicket || item.eventType === "WICKET");
  if (filter === "FOUR") return item.eventType === "FOUR" || item.runs === 4;
  if (filter === "SIX") return item.eventType === "SIX" || item.runs === 6;
  return true;
}

export default function CommentaryTab({ matchId }: Props) {
  const [activeTeam, setActiveTeam] = useState<TeamSide>("teamA");
  const [filter, setFilter] = useState<CommentaryFilterKey>("ALL");
  const [items, setItems] = useState<CommentaryItem[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lastRequestedCursorRef = useRef<string | null>(null);

  // Only pass eventType to the API for WICKET (server-supported per spec).
  const eventType = filter === "WICKET" ? "WICKET" : undefined;

  const { data, isLoading, isFetching, isError } =
    useGetScorecardCommentaryQuery(
      {
        matchId,
        limit: LIMIT,
        cursor,
        direction: "DESC",
        eventType,
      },
      { skip: !matchId },
    );

  const teamBlock = data ? data[activeTeam] : undefined;
  const pagination = data?.pagination;

  // Reset pagination whenever the filter or selected team changes.
  useEffect(() => {
    setItems([]);
    setCursor(undefined);
    setIsLoadingMore(false);
    lastRequestedCursorRef.current = null;
  }, [filter, activeTeam]);

  // Merge incoming page into local state, de-duping by sequence/innings.
  useEffect(() => {
    if (!teamBlock) return;

    setItems((prev) => {
      if (cursor === undefined) {
        // First page for this filter/team — replace.
        return teamBlock.commentary;
      }
      // Subsequent page — append unique items only.
      const existingKeys = new Set(prev.map(itemKey));
      const newUnique = teamBlock.commentary.filter(
        (i) => !existingKeys.has(itemKey(i)),
      );
      return [...prev, ...newUnique];
    });

    setIsLoadingMore(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamBlock]);

  // Apply local-only filtering for FOUR/SIX (server doesn't support these eventTypes).
  const visibleItems = useMemo(() => {
    if (filter === "FOUR" || filter === "SIX") {
      return items.filter((i) => matchesLocalFilter(i, filter));
    }
    return items;
  }, [items, filter]);

  // Group items by overText's integer part (e.g. "12.4" -> over 12).
  const groups = useMemo(() => {
    const map = new Map<string, CommentaryItem[]>();
    for (const item of visibleItems) {
      const overNumber = item.overText?.split(".")[0] ?? "—";
      const key = `Over ${overNumber}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [visibleItems]);

  const nextCursor = pagination?.nextCursor ?? null;
  const hasMore = Boolean(pagination?.hasMore && nextCursor);
  const showInitialLoading = isLoading && items.length === 0;
  const showNextPageLoading =
    !showInitialLoading && !isError && items.length > 0 && isLoadingMore;

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (
      !sentinel ||
      showInitialLoading ||
      isError ||
      !hasMore ||
      !nextCursor
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (isFetching || isLoadingMore) return;
        if (cursor === nextCursor) return;
        if (lastRequestedCursorRef.current === nextCursor) return;

        lastRequestedCursorRef.current = nextCursor;
        setIsLoadingMore(true);
        setCursor(nextCursor);
      },
      {
        root: null,
        rootMargin: "200px",
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [
    cursor,
    hasMore,
    isError,
    isFetching,
    isLoadingMore,
    nextCursor,
    showInitialLoading,
  ]);

  return (
    <div className="flex flex-col">
      {/* Team selector */}
      {data && (
        <CommentaryTeamSelector
          teamA={data.teamA.team}
          teamB={data.teamB.team}
          active={activeTeam}
          onChange={setActiveTeam}
        />
      )}

      {/* Filter chips */}
      <CommentaryFilters active={filter} onChange={setFilter} />

      {/* Content */}
      <div className="flex flex-col gap-4 px-3 pb-4">
        {showInitialLoading && <CommentarySkeleton />}

        {!showInitialLoading && isError && (
          <div className="mt-8 flex flex-col items-center gap-2 px-6 text-center">
            <p className="font-display text-[15px] font-bold uppercase text-(--color-navy)">
              Unable to load commentary
            </p>
            <p className="text-meta">Check your connection and try again.</p>
          </div>
        )}

        {!showInitialLoading && !isError && visibleItems.length === 0 && (
          <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-6 text-center shadow-(--shadow-card)">
            <p className="text-body text-(--color-text-secondary)">
              No commentary yet.
            </p>
          </div>
        )}

        {!showInitialLoading &&
          !isError &&
          groups.map(([groupLabel, groupItems]) => (
            <div key={groupLabel} className="flex flex-col gap-2">
              <p className="text-section-label px-1">{groupLabel}</p>
              <div className="flex flex-col gap-2">
                {groupItems.map((item) => (
                  <CommentaryItemCard key={itemKey(item)} item={item} />
                ))}
              </div>
            </div>
          ))}

        {!showInitialLoading && !isError && hasMore && (
          <div ref={sentinelRef} className="h-1" aria-hidden="true" />
        )}

        {showNextPageLoading && (
          <div className="flex items-center justify-center gap-2 py-2 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-(--color-bg-border) border-t-(--color-brand)" />
            Loading commentary
          </div>
        )}
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────
function CommentarySkeleton() {
  return (
    <div className="flex flex-col gap-2 px-3 pt-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex gap-3 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-3 py-3 shadow-(--shadow-card)"
        >
          <div className="flex w-12 shrink-0 flex-col items-center gap-1.5">
            <div className="h-3 w-8 rounded bg-(--color-bg-border)" />
            <div className="h-7 w-7 rounded-full bg-(--color-bg-border)" />
          </div>
          <div className="flex-1 space-y-2 py-0.5">
            <div className="h-3 w-1/2 rounded bg-(--color-bg-border)" />
            <div className="h-3 w-full rounded bg-(--color-bg-border)" />
          </div>
        </div>
      ))}
    </div>
  );
}
