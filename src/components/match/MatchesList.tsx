"use client";

import { MatchCard } from "@/components/match/MatchCard";
import { MatchCardModel } from "@/types/matchCard";

type MatchesListProps = {
  matches: MatchCardModel[];
  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  onMatchClick: (match: MatchCardModel) => void;
};

function MatchCardSkeleton() {
  return (
    <div className="fixture-bar animate-pulse space-y-3 rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
      <div className="flex items-center justify-between">
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

export function MatchesList({
  matches,
  isLoading = false,
  isError = false,
  errorText = "Failed to load matches. Please try again.",
  onMatchClick,
}: MatchesListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <MatchCardSkeleton />
        <MatchCardSkeleton />
        <MatchCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-(--color-live)">{errorText}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {matches.map((match) => (
        <MatchCard
          key={match.matchId}
          match={match}
          onClick={() => onMatchClick(match)}
        />
      ))}
    </div>
  );
}
