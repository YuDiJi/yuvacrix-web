"use client";

import { cn } from "@/lib/cn";
import {
  getTeamColorIndicatorStyles,
  resolveVolleyballTeamColor,
  VOLLEYBALL_TEAM_A_FALLBACK_COLOR,
  VOLLEYBALL_TEAM_B_FALLBACK_COLOR,
} from "@/lib/volleyball/teamColors";
import type { VolleyballMatch } from "@/types/volleyball/match";
import type { VolleyballSet } from "@/types/volleyball/set";

type Props = {
  match?: VolleyballMatch | null;
  set?: VolleyballSet | null;
  loading?: boolean;
};

function getCompactTeamLabel(name?: string | null, fallback = "TEAM") {
  const value = name?.trim();

  if (!value) {
    return fallback;
  }

  const words = value.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 6).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function ServingDot({ active, color }: { active: boolean; color: string }) {
  return (
    <span
      className={cn("h-1.5 w-1.5 shrink-0 rounded-full border", !active && "opacity-0")}
      style={getTeamColorIndicatorStyles(color)}
      aria-hidden={!active}
    />
  );
}

export function VolleyballDialogScoreStrip({ match, set, loading = false }: Props) {
  if (loading || !match || !set) {
    return (
      <div className="mt-1.5 flex h-8 w-full items-center justify-center rounded-lg border border-(--color-bg-border) bg-(--color-bg-base)">
        <span className="h-2 w-28 animate-pulse rounded-full bg-(--color-bg-border)" />
      </div>
    );
  }

  const teamAColor = resolveVolleyballTeamColor(
    match.teamASnapshot.teamColor,
    VOLLEYBALL_TEAM_A_FALLBACK_COLOR,
  );
  const teamBColor = resolveVolleyballTeamColor(
    match.teamBSnapshot.teamColor,
    VOLLEYBALL_TEAM_B_FALLBACK_COLOR,
  );
  const teamALabel = getCompactTeamLabel(
    match.teamASnapshot.shortName ?? match.teamASnapshot.name,
    "A",
  );
  const teamBLabel = getCompactTeamLabel(
    match.teamBSnapshot.shortName ?? match.teamBSnapshot.name,
    "B",
  );

  return (
    <div
      className="mt-1.5 flex h-8 w-full min-w-0 items-center gap-1 overflow-hidden rounded-lg border border-(--color-bg-border) bg-(--color-bg-base) px-2"
      aria-label={`Set ${set.setNumber}: ${teamALabel} ${set.teamAPoints}, ${teamBLabel} ${set.teamBPoints}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <ServingDot active={set.servingTeamId === match.teamAId} color={teamAColor} />
        <span className="min-w-0 truncate text-[10px] font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
          {teamALabel}
        </span>
      </div>

      <span className="shrink-0 font-(family-name:--font-display) text-lg font-black leading-none text-(--color-text-primary)">
        {set.teamAPoints}
      </span>

      <span className="shrink-0 text-[10px] font-bold leading-none text-(--color-text-muted)">
        ({match.teamASetsWon})
      </span>

      <span className="shrink-0 px-0.5 text-[10px] font-black text-(--color-text-muted)">
        —
      </span>

      <span className="shrink-0 rounded-full bg-(--color-bg-card) px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.06em] text-(--color-brand)">
        S{set.setNumber}
      </span>

      <span className="shrink-0 px-0.5 text-[10px] font-black text-(--color-text-muted)">
        —
      </span>

      <span className="shrink-0 text-[10px] font-bold leading-none text-(--color-text-muted)">
        ({match.teamBSetsWon})
      </span>

      <span className="shrink-0 font-(family-name:--font-display) text-lg font-black leading-none text-(--color-text-primary)">
        {set.teamBPoints}
      </span>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-1 text-right">
        <span className="min-w-0 truncate text-[10px] font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
          {teamBLabel}
        </span>
        <ServingDot active={set.servingTeamId === match.teamBId} color={teamBColor} />
      </div>
    </div>
  );
}
