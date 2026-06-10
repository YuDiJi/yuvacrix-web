// src/components/common/loaders/SkeletonLoader.tsx
// ─── Composable skeleton system ───────────────────────────────────────────────
//
// Usage examples:
//
//   // 1. Pre-built page-level skeletons
//   <PlayerListSkeleton />           // select-players page
//   <TeamListSkeleton />             // select-team page
//   <MatchFormSkeleton />            // start-match form
//
//   // 2. Build custom skeletons from primitives
//   <Skeleton className="h-20 rounded-2xl" />
//   <Skeleton className="h-4 w-32 rounded-full" />

import { cn } from "@/lib/cn";

// ─── Base block ───────────────────────────────────────────────────────────────

import { CSSProperties } from "react";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("animate-pulse bg-(--color-bg-border)", className)}
      style={style}
    />
  );
}

// ─── Single player row ────────────────────────────────────────────────────────

export function PlayerRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-(--color-bg-border) bg-(--color-bg-card) px-3.5 py-3 shadow-(--shadow-card)">
      {/* Avatar */}
      <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
      {/* Text */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-36 rounded-full" />
        <Skeleton className="h-2.5 w-20 rounded-full" />
      </div>
      {/* Action buttons */}
      <Skeleton className="h-9 w-9 rounded-full" />
      <Skeleton className="h-9 w-9 rounded-full" />
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
  );
}

// ─── Single team row ──────────────────────────────────────────────────────────

export function TeamRowSkeleton() {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3.5 shadow-(--shadow-card)">
      <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-32 rounded-full" />
        <Skeleton className="h-2.5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-5 w-5 rounded-full" />
    </div>
  );
}

// ─── Page-level: player list (select-players, team-setup) ────────────────────

export function PlayerListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex min-h-full flex-col gap-3 bg-(--color-bg-base) px-4 pt-4">
      {/* Banner */}
      <Skeleton className="h-20 rounded-2xl" />
      {/* Section heading */}
      <Skeleton className="h-5 w-44 rounded-full" />
      {/* Validation hint */}
      <Skeleton className="h-8 rounded-xl" />
      {/* Search */}
      <Skeleton className="h-12 rounded-2xl" />
      {/* Player rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <PlayerRowSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Page-level: team list (select-team) ─────────────────────────────────────

export function TeamListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex min-h-full flex-col gap-3 bg-(--color-bg-base) px-4 pt-4">
      {/* Search */}
      <Skeleton className="h-13 rounded-2xl" />
      {/* Section label */}
      <Skeleton className="h-3.5 w-20 rounded-full" />
      {/* Team rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <TeamRowSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Page-level: match setup form ─────────────────────────────────────────────

export function MatchFormSkeleton() {
  return (
    <div className="flex min-h-full flex-col gap-3 bg-(--color-bg-base)">
      {/* Hero banner */}
      <Skeleton className="h-36 rounded-none" />
      <div className="flex flex-col gap-3 px-4">
        {/* Section cards */}
        {[96, 72, 120, 80, 56, 72, 96].map((h, i) => (
          <Skeleton
            key={i}
            className={`h-${Math.round(h / 4)} rounded-2xl`}
            style={{ height: h }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Generic card skeleton ────────────────────────────────────────────────────

export function CardSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card) space-y-2.5">
      <Skeleton className="h-3.5 w-24 rounded-full" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3 rounded-full",
            i === lines - 1 ? "w-3/4" : "w-full",
          )}
        />
      ))}
    </div>
  );
}
