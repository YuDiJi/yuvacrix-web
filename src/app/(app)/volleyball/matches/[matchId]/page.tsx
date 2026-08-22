"use client";

import { useMemo } from "react";

import {
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  RotateCw,
  ShieldCheck,
  Trophy,
  Users,
  Volleyball,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { S3Image } from "@/components/common/S3Image";

import { cn } from "@/lib/cn";

import {
  useGetVolleyballMatchQuery,
  useGetVolleyballMatchSetsQuery,
} from "@/store/api/volleyball/volleyballMatchApi";

import {
  VOLLEYBALL_MATCH_STATUSES,
  type VolleyballMatch,
} from "@/types/volleyball/match";

import {
  VOLLEYBALL_SET_STATUSES,
  type VolleyballSet,
} from "@/types/volleyball/set";

/* =========================================================
   TYPES
========================================================= */

type VolleyballPrimaryAction = {
  label: string;
  description: string;
  href: string;

  type: "ROSTER" | "SETUP" | "SCORING" | "COMPLETE";
};

/* =========================================================
   PRIMARY ACTION
========================================================= */

function getPrimaryAction(
  match: VolleyballMatch,
  sets: VolleyballSet[],
): VolleyballPrimaryAction {
  if (match.status === VOLLEYBALL_MATCH_STATUSES.COMPLETED) {
    return {
      label: "Match Complete",
      description: "View completed match summary.",
      href: `/volleyball/matches/${match.id}`,
      type: "COMPLETE",
    };
  }

  const liveSet = sets.find(
    (set) => set.status === VOLLEYBALL_SET_STATUSES.LIVE,
  );

  if (liveSet) {
    return {
      label: "Resume Scoring",
      description: `Continue Set ${liveSet.setNumber}`,
      href: `/volleyball/matches/${match.id}/scoring?setId=${liveSet.id}`,
      type: "SCORING",
    };
  }

  const pendingSet = sets
    .filter((set) => set.status === VOLLEYBALL_SET_STATUSES.PENDING_LINEUP)
    .sort((a, b) => a.setNumber - b.setNumber)[0];

  if (pendingSet) {
    return {
      label: `Setup Set ${pendingSet.setNumber}`,
      description: "Set starting rotation and first serve.",
      href: `/volleyball/matches/${match.id}/sets/setup?setNumber=${pendingSet.setNumber}`,
      type: "SETUP",
    };
  }

  if (match.status === VOLLEYBALL_MATCH_STATUSES.ROSTER_CONFIRMED) {
    return {
      label: "Start Set 1",
      description: "Set starting rotation and first serve.",
      href: `/volleyball/matches/${match.id}/sets/setup`,
      type: "SETUP",
    };
  }

  return {
    label: "Setup Rosters",
    description: "Select captain, players and Liberos.",
    href: `/volleyball/matches/${match.id}/rosters`,
    type: "ROSTER",
  };
}

/* =========================================================
   HELPERS
========================================================= */

function getStatusLabel(status: string) {
  switch (status) {
    case VOLLEYBALL_MATCH_STATUSES.DRAFT:
      return "Draft";

    case VOLLEYBALL_MATCH_STATUSES.ROSTER_CONFIRMED:
      return "Ready";

    case VOLLEYBALL_MATCH_STATUSES.LIVE:
      return "Live";

    case VOLLEYBALL_MATCH_STATUSES.COMPLETED:
      return "Completed";

    case VOLLEYBALL_MATCH_STATUSES.CANCELLED:
      return "Cancelled";

    case VOLLEYBALL_MATCH_STATUSES.ABANDONED:
      return "Abandoned";

    default:
      return status.toLowerCase().replaceAll("_", " ");
  }
}

function getFormatLabel(match: VolleyballMatch) {
  const rules = match.rulesSnapshot;

  if (rules.formatType === "BEST_OF") {
    return rules.maxSets ? `Best of ${rules.maxSets}` : "Best of";
  }

  if (rules.formatType === "FIXED_SETS") {
    return rules.totalSets ? `${rules.totalSets} Fixed Sets` : "Fixed Sets";
  }

  return rules.formatType;
}

function getTeamLabel(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return "TEAM";
  }

  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/* =========================================================
   PAGE
========================================================= */

export default function VolleyballMatchDetailsPage() {
  const params = useParams();

  const router = useRouter();

  const matchId = params.matchId as string;

  const {
    data: match,
    isLoading: isMatchLoading,
    isError: isMatchError,
    refetch: refetchMatch,
  } = useGetVolleyballMatchQuery({
    matchId,
  });

  const {
    data: sets = [],
    isLoading: isSetsLoading,
    isError: isSetsError,
    refetch: refetchSets,
  } = useGetVolleyballMatchSetsQuery({
    matchId,
  });

  const sortedSets = useMemo(
    () => [...sets].sort((a, b) => a.setNumber - b.setNumber),
    [sets],
  );

  const liveSet = useMemo(
    () =>
      sortedSets.find((set) => set.status === VOLLEYBALL_SET_STATUSES.LIVE) ??
      null,
    [sortedSets],
  );

  const primaryAction = useMemo(() => {
    if (!match) {
      return null;
    }

    return getPrimaryAction(match, sortedSets);
  }, [match, sortedSets]);

  /* =========================
     LOADING
  ========================= */

  if (isMatchLoading || isSetsLoading) {
    return (
      <div className="min-h-full bg-(--color-bg-base) p-3">
        <div className="space-y-3">
          <div className="h-8 animate-pulse rounded-xl bg-(--color-bg-card)" />

          <div className="h-52 animate-pulse rounded-3xl bg-(--color-bg-card)" />

          <div className="h-20 animate-pulse rounded-2xl bg-(--color-bg-card)" />

          <div className="h-48 animate-pulse rounded-2xl bg-(--color-bg-card)" />
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (isMatchError || isSetsError || !match) {
    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4">
        <div className="w-full max-w-sm rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <p className="text-sm font-bold text-(--color-text-primary)">
            Unable to load match
          </p>

          <p className="mt-1 text-xs text-(--color-text-muted)">
            Match details could not be loaded.
          </p>

          <Button
            fullWidth
            className="mt-4"
            onClick={() => void Promise.all([refetchMatch(), refetchSets()])}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const isLive = match.status === VOLLEYBALL_MATCH_STATUSES.LIVE;

  const isCompleted = match.status === VOLLEYBALL_MATCH_STATUSES.COMPLETED;

  const winnerSnapshot =
    match.winnerTeamId === match.teamAId
      ? match.teamASnapshot
      : match.winnerTeamId === match.teamBId
        ? match.teamBSnapshot
        : null;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-full bg-(--color-bg-base)">
      <div className="flex flex-col gap-3 p-3">
        {/* =================================
            STATUS BAR
        ================================= */}

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-(--color-live)" />
            )}

            <span
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.16em]",
                isLive
                  ? "text-(--color-live)"
                  : isCompleted
                    ? "text-(--color-brand)"
                    : "text-(--color-text-muted)",
              )}
            >
              {getStatusLabel(match.status)}
            </span>

            <span className="text-[10px] text-(--color-text-muted)">·</span>

            <span className="text-[10px] font-semibold text-(--color-text-muted)">
              {getFormatLabel(match)}
            </span>
          </div>

          {liveSet && (
            <span className="rounded-full bg-(--color-bg-card) px-2.5 py-1 text-[10px] font-black text-(--color-brand) shadow-sm">
              Set {liveSet.setNumber}
            </span>
          )}
        </div>

        {/* =================================
            MATCH HERO
        ================================= */}

        <MatchHero
          match={match}
          liveSet={liveSet}
          completed={isCompleted}
          winnerName={winnerSnapshot?.name ?? null}
        />

        {/* =================================
            PRIMARY CTA
        ================================= */}

        {!isCompleted && primaryAction && (
          <PrimaryActionCard
            action={primaryAction}
            onClick={() => router.push(primaryAction.href)}
          />
        )}

        {/* =================================
            SET RESULTS
        ================================= */}

        <SetResults sets={sortedSets} match={match} />

        {/* =================================
            COMPLETED SUMMARY
        ================================= */}

        {isCompleted && (
          <CompletedSummary
            match={match}
            winnerName={winnerSnapshot?.name ?? null}
          />
        )}

        {/* =================================
            MATCH DETAILS
        ================================= */}

        <CompactMatchInfo match={match} setsCount={sortedSets.length} />
      </div>
    </div>
  );
}

/* =========================================================
   MATCH HERO
========================================================= */

function MatchHero({
  match,
  liveSet,
  completed,
  winnerName,
}: {
  match: VolleyballMatch;

  liveSet: VolleyballSet | null;

  completed: boolean;

  winnerName: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-(--color-navy) text-white shadow-lg">
      {/* WINNER */}

      {completed &&
        (match.isTie ? (
          <div className="flex items-center justify-center gap-2 border-b border-white/10 bg-white/5 px-3 py-2">
            <ShieldCheck size={14} />

            <span className="text-xs font-black uppercase tracking-wide">
              Match Tied
            </span>
          </div>
        ) : winnerName ? (
          <div className="flex items-center justify-center gap-2 border-b border-white/10 bg-white/5 px-3 py-2">
            <Trophy size={14} className="text-[#fbbf24]" />

            <span className="truncate text-xs font-black uppercase tracking-wide">
              {winnerName} Won
            </span>
          </div>
        ) : null)}

      {/* TEAMS / SET SCORE */}

      <div className="grid grid-cols-[1fr_86px_1fr] items-center gap-2 px-3 py-4">
        <HeroTeam
          name={match.teamASnapshot.name}
          shortName={match.teamASnapshot.shortName}
          imageKey={match.teamASnapshot.logoUrl}
          tone="orange"
          winner={match.winnerTeamId === match.teamAId}
        />

        <div className="text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/45">
            Sets
          </p>

          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="font-(family-name:--font-display) text-4xl font-black">
              {match.teamASetsWon}
            </span>

            <span className="text-lg font-black text-white/30">:</span>

            <span className="font-(family-name:--font-display) text-4xl font-black">
              {match.teamBSetsWon}
            </span>
          </div>
        </div>

        <HeroTeam
          name={match.teamBSnapshot.name}
          shortName={match.teamBSnapshot.shortName}
          imageKey={match.teamBSnapshot.logoUrl}
          tone="red"
          winner={match.winnerTeamId === match.teamBId}
        />
      </div>

      {/* LIVE SET SCORE */}

      {liveSet && (
        <div className="border-t border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="mb-1.5 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-live)" />

            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/60">
              Live · Set {liveSet.setNumber}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <LiveScoreTeam
              label={getTeamLabel(
                match.teamASnapshot.shortName ?? match.teamASnapshot.name,
              )}
              score={liveSet.teamAPoints}
              serving={liveSet.servingTeamId === match.teamAId}
              tone="orange"
            />

            <span className="px-4 text-sm font-black text-white/30">:</span>

            <LiveScoreTeam
              label={getTeamLabel(
                match.teamBSnapshot.shortName ?? match.teamBSnapshot.name,
              )}
              score={liveSet.teamBPoints}
              serving={liveSet.servingTeamId === match.teamBId}
              tone="red"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function HeroTeam({
  name,
  shortName,
  imageKey,
  tone,
  winner,
}: {
  name: string;

  shortName: string | null;

  imageKey: string | null;

  tone: "orange" | "red";

  winner: boolean;
}) {
  return (
    <div className="min-w-0 text-center">
      <div
        className={cn(
          "mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl",
          tone === "orange" ? "bg-orange-500" : "bg-red-500",
          winner &&
            "ring-2 ring-white ring-offset-2 ring-offset-(--color-navy)",
        )}
      >
        {imageKey ? (
          <S3Image
            imageKey={imageKey}
            alt={name}
            width={56}
            height={56}
            className="h-full w-full object-cover"
            fallback={
              <span className="font-(family-name:--font-display) text-lg font-black text-white">
                {getTeamLabel(shortName ?? name)}
              </span>
            }
          />
        ) : (
          <span className="font-(family-name:--font-display) text-lg font-black text-white">
            {getTeamLabel(shortName ?? name)}
          </span>
        )}
      </div>

      <p className="mt-2 truncate font-(family-name:--font-display) text-sm font-black uppercase tracking-wide">
        {getTeamLabel(shortName ?? name)}
      </p>

      {winner && (
        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-black uppercase">
          <Trophy size={8} />
          Winner
        </span>
      )}
    </div>
  );
}

function LiveScoreTeam({
  label,
  score,
  serving,
  tone,
}: {
  label: string;

  score: number;

  serving: boolean;

  tone: "orange" | "red";
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1">
        {serving && (
          <Volleyball
            size={11}
            className={tone === "orange" ? "text-orange-400" : "text-red-400"}
          />
        )}

        <span className="text-[10px] font-black text-white/65">{label}</span>
      </div>

      <p
        className={cn(
          "mt-0.5 font-(family-name:--font-display) text-3xl font-black",
          serving && tone === "orange" && "text-orange-400",
          serving && tone === "red" && "text-red-400",
        )}
      >
        {score}
      </p>
    </div>
  );
}

/* =========================================================
   PRIMARY ACTION
========================================================= */

function PrimaryActionCard({
  action,
  onClick,
}: {
  action: VolleyballPrimaryAction;

  onClick: () => void;
}) {
  const scoring = action.type === "SCORING";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-left text-white shadow-lg active:scale-[0.99]",
        scoring
          ? "bg-[linear-gradient(135deg,#f59e0b,#ea580c)]"
          : "bg-(--color-brand)",
      )}
    >
      {scoring && (
        <Volleyball
          size={74}
          strokeWidth={1}
          className="absolute -right-3 -top-4 opacity-10"
        />
      )}

      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
        {scoring ? <Volleyball size={20} /> : <ChevronRight size={20} />}
      </div>

      <div className="relative min-w-0 flex-1">
        <p className="font-(family-name:--font-display) text-lg font-black uppercase tracking-wide">
          {action.label}
        </p>

        <p className="truncate text-[10px] text-white/70">
          {action.description}
        </p>
      </div>

      <ChevronRight size={18} className="relative" />
    </button>
  );
}

/* =========================================================
   SET RESULTS
========================================================= */

function SetResults({
  sets,
  match,
}: {
  sets: VolleyballSet[];

  match: VolleyballMatch;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <RotateCw size={13} className="text-(--color-brand)" />

          <p className="text-section-label">Set Results</p>
        </div>

        {sets.length > 0 && (
          <span className="text-[10px] text-(--color-text-muted)">
            {sets.length} sets
          </span>
        )}
      </div>

      {sets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) py-5 text-center">
          <p className="text-xs font-bold text-(--color-text-primary)">
            No sets yet
          </p>

          <p className="mt-1 text-[10px] text-(--color-text-muted)">
            Start Set 1 to begin scoring.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
          {/* TABLE HEADER */}

          <div className="grid grid-cols-[44px_1fr_52px_52px] items-center border-b border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2">
            <span className="text-[9px] font-black uppercase text-(--color-text-muted)">
              Set
            </span>

            <span className="text-[9px] font-black uppercase text-(--color-text-muted)">
              Status
            </span>

            <span className="text-center text-[9px] font-black uppercase text-orange-600">
              {getTeamLabel(
                match.teamASnapshot.shortName ?? match.teamASnapshot.name,
              )}
            </span>

            <span className="text-center text-[9px] font-black uppercase text-red-600">
              {getTeamLabel(
                match.teamBSnapshot.shortName ?? match.teamBSnapshot.name,
              )}
            </span>
          </div>

          {sets.map((set, index) => (
            <CompactSetRow
              key={set.id}
              set={set}
              match={match}
              last={index === sets.length - 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CompactSetRow({
  set,
  match,
  last,
}: {
  set: VolleyballSet;

  match: VolleyballMatch;

  last: boolean;
}) {
  const live = set.status === VOLLEYBALL_SET_STATUSES.LIVE;

  const completed = set.status === VOLLEYBALL_SET_STATUSES.COMPLETED;

  const pending = set.status === VOLLEYBALL_SET_STATUSES.PENDING_LINEUP;

  const teamAWon = set.winnerTeamId === match.teamAId;

  const teamBWon = set.winnerTeamId === match.teamBId;

  return (
    <div
      className={cn(
        "grid min-h-12 grid-cols-[44px_1fr_52px_52px] items-center px-3 py-2",
        !last && "border-b border-(--color-bg-border)",
        live && "bg-(--color-bg-tint)/50",
      )}
    >
      <span className="font-(family-name:--font-display) text-sm font-black text-(--color-text-primary)">
        {set.setNumber}
      </span>

      <div>
        {live ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-(--color-live)">
            <CircleDot size={8} />
            Live
          </span>
        ) : completed ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-green-600">
            <Check size={9} />
            Final
          </span>
        ) : pending ? (
          <span className="text-[9px] font-black uppercase text-(--color-text-muted)">
            Setup
          </span>
        ) : (
          <span className="text-[9px] text-(--color-text-muted)">
            {set.status}
          </span>
        )}
      </div>

      <div
        className={cn(
          "text-center font-(family-name:--font-display) text-lg font-black",
          teamAWon ? "text-orange-600" : "text-(--color-text-primary)",
        )}
      >
        {set.teamAPoints}
      </div>

      <div
        className={cn(
          "text-center font-(family-name:--font-display) text-lg font-black",
          teamBWon ? "text-red-600" : "text-(--color-text-primary)",
        )}
      >
        {set.teamBPoints}
      </div>
    </div>
  );
}

/* =========================================================
   COMPLETED SUMMARY
========================================================= */

function CompletedSummary({
  match,
  winnerName,
}: {
  match: VolleyballMatch;
  winnerName: string | null;
}) {
  const spectatorCount =
    match.spectatorCount ?? match.postMatch?.spectatorCount ?? null;

  const bestPlayer = match.bestPlayer ?? match.postMatch?.bestPlayer ?? null;

  /*
   * IMPORTANT:
   * bestPlayer is `unknown`, so convert it
   * to a real boolean before using it in JSX.
   */
  const hasBestPlayer = bestPlayer !== null && bestPlayer !== undefined;

  if (!hasBestPlayer && spectatorCount === null) {
    return null;
  }

  return (
    <section>
      <p className="mb-2 px-1 text-section-label">Match Highlights</p>

      <div className="grid grid-cols-2 gap-2">
        {hasBestPlayer && (
          <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-(--shadow-card)">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Trophy size={16} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase text-(--color-text-muted)">
                  Best Player
                </p>

                <p className="truncate text-xs font-black text-(--color-text-primary)">
                  {getBestPlayerName(bestPlayer, match)}
                </p>
              </div>
            </div>
          </div>
        )}

        {spectatorCount !== null && (
          <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-(--shadow-card)">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-bg-tint) text-(--color-brand)">
                <Users size={16} />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase text-(--color-text-muted)">
                  Spectators
                </p>

                <p className="text-xs font-black text-(--color-text-primary)">
                  {spectatorCount}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {winnerName && (
        <p className="mt-2 text-center text-[10px] text-(--color-text-muted)">
          {winnerName} won {match.teamASetsWon}-{match.teamBSetsWon} in sets.
        </p>
      )}
    </section>
  );
}

function getBestPlayerName(bestPlayer: unknown, match: VolleyballMatch) {
  const players = [
    ...(match.teamARoster?.players ?? []),
    ...(match.teamBRoster?.players ?? []),
  ];

  /*
   * Backend may return just the player id.
   */
  if (typeof bestPlayer === "string") {
    return (
      players.find((player) => player.playerId === bestPlayer)
        ?.playerNameSnapshot ?? "Best Player"
    );
  }

  /*
   * unknown must be narrowed before
   * accessing any object properties.
   */
  if (bestPlayer && typeof bestPlayer === "object") {
    if ("playerNameSnapshot" in bestPlayer) {
      const name = bestPlayer.playerNameSnapshot;

      if (typeof name === "string") {
        return name;
      }
    }

    if ("playerName" in bestPlayer) {
      const name = bestPlayer.playerName;

      if (typeof name === "string") {
        return name;
      }
    }

    if ("playerId" in bestPlayer) {
      const playerId = bestPlayer.playerId;

      if (typeof playerId === "string") {
        return (
          players.find((player) => player.playerId === playerId)
            ?.playerNameSnapshot ?? "Best Player"
        );
      }
    }
  }

  return "Best Player";
}

/* =========================================================
   COMPACT INFO
========================================================= */

function CompactMatchInfo({
  match,
  setsCount,
}: {
  match: VolleyballMatch;

  setsCount: number;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2 px-1">
        <Clock3 size={13} className="text-(--color-brand)" />

        <p className="text-section-label">Match Info</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
        <div className="grid grid-cols-2 divide-x divide-(--color-bg-border)">
          <CompactInfoItem label="Format" value={getFormatLabel(match)} />

          <CompactInfoItem
            label="Set Points"
            value={`${match.rulesSnapshot.normalSetPoints}`}
          />
        </div>

        <div className="grid grid-cols-2 divide-x divide-(--color-bg-border) border-t border-(--color-bg-border)">
          <CompactInfoItem
            label="Win By"
            value={`${match.rulesSnapshot.winByMargin}`}
          />

          <CompactInfoItem
            label="Decider"
            value={
              match.rulesSnapshot.decidingSetPoints
                ? `${match.rulesSnapshot.decidingSetPoints} pts`
                : "—"
            }
          />
        </div>

        <div className="grid grid-cols-2 divide-x divide-(--color-bg-border) border-t border-(--color-bg-border)">
          <CompactInfoItem
            label="Preset"
            value={match.rulesPresetKey ?? "Custom"}
          />

          <CompactInfoItem label="Sets" value={String(setsCount)} />
        </div>
      </div>
    </section>
  );
}

function CompactInfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2.5">
      <p className="text-[8px] font-black uppercase tracking-[0.12em] text-(--color-text-muted)">
        {label}
      </p>

      <p className="mt-0.5 truncate text-xs font-black text-(--color-text-primary)">
        {value}
      </p>
    </div>
  );
}
