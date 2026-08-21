"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

import {
  ArrowRightLeft,
  Ban,
  CircleDot,
  History,
  RotateCcw,
  Shield,
  Volleyball,
  X,
  Zap,
} from "lucide-react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { S3Image } from "@/components/common/S3Image";

import { VolleyballSubstitutionSheet } from "@/components/volleyball/scoring/VolleyballSubstitutionSheet";
import { VolleyballLiberoReplacementSheet } from "@/components/volleyball/scoring/VolleyballLiberoReplacementSheet";
import { VolleyballHistorySheet } from "@/components/volleyball/scoring/VolleyballHistorySheet";
import { VolleyballSetCompletedSheet } from "@/components/volleyball/scoring/VolleyballSetCompletedSheet";

import { cn } from "@/lib/cn";

import {
  useGetCurrentVolleyballSetQuery,
  useGetVolleyballMatchQuery,
  useGetVolleyballMatchSetsQuery,
  useRecordVolleyballRallyMutation,
  useUndoLastVolleyballEventMutation,
} from "@/store/api/volleyball/volleyballMatchApi";

import {
  VOLLEYBALL_POINT_TYPES,
  type VolleyballPointType,
} from "@/types/volleyball/scoring";

import {
  VOLLEYBALL_SET_STATUSES,
  type VolleyballCourtPosition,
  type VolleyballRotationPosition,
  type VolleyballSet,
} from "@/types/volleyball/set";

import {
  VOLLEYBALL_MATCH_STATUSES,
  VolleyballMatch,
} from "@/types/volleyball/match";

import type {
  VolleyballMatchRoster,
  VolleyballMatchRosterPlayer,
} from "@/types/volleyball/roster";
import { VolleyballEndMatchSheet } from "@/components/volleyball/scoring/VolleyballEndMatchSheet";

/* =========================================================
   HELPERS
========================================================= */

function extractErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = (
      error as {
        data?: unknown;
      }
    ).data;

    if (data && typeof data === "object" && "message" in data) {
      const message = (
        data as {
          message?: unknown;
        }
      ).message;

      if (Array.isArray(message)) {
        return message.join(", ");
      }

      if (message) {
        return String(message);
      }
    }
  }

  return "Something went wrong. Please try again.";
}

function getPlayer(roster: VolleyballMatchRoster, playerId?: string | null) {
  if (!playerId) {
    return null;
  }

  return roster.players.find((player) => player.playerId === playerId) ?? null;
}

function getPlayerAtPosition(
  roster: VolleyballMatchRoster,
  rotation: VolleyballRotationPosition[],
  position: VolleyballCourtPosition,
) {
  const slot = rotation.find((item) => item.position === position);

  if (!slot) {
    return null;
  }

  return getPlayer(roster, slot.playerId);
}

function getTeamDisplayLabel(name: string) {
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

export default function VolleyballScoringPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const matchId = params.matchId as string;

  const setIdFromRoute = searchParams.get("setId");

  /* =========================
     STATE
  ========================= */

  const [liveSet, setLiveSet] = useState<VolleyballSet | null>(null);

  const [completedSet, setCompletedSet] = useState<VolleyballSet | null>(null);

  const [pointTeamId, setPointTeamId] = useState<string | null>(null);

  const [pointSheetOpen, setPointSheetOpen] = useState(false);

  const [substitutionOpen, setSubstitutionOpen] = useState(false);

  const [liberoReplacementOpen, setLiberoReplacementOpen] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);

  const [undoOpen, setUndoOpen] = useState(false);

  const [isRefreshingLifecycle, setIsRefreshingLifecycle] = useState(false);

  const [endMatchOpen, setEndMatchOpen] = useState(false);

  const [completedMatch, setCompletedMatch] = useState<VolleyballMatch | null>(
    null,
  );

  const [error, setError] = useState("");

  /* =========================
     API
  ========================= */

  const {
    data: match,
    isLoading: isMatchLoading,
    isError: isMatchError,
    refetch: refetchMatch,
  } = useGetVolleyballMatchQuery({
    matchId,
  });

  const {
    data: currentSet,
    isLoading: isSetLoading,
    isError: isSetError,
  } = useGetCurrentVolleyballSetQuery({
    matchId,
  });

  const {
    data: sets,
    isLoading: isSetsLoading,
    isError: isSetsError,
    refetch: refetchSets,
  } = useGetVolleyballMatchSetsQuery({
    matchId,
  });

  const [recordRally, { isLoading: isRecordingRally }] =
    useRecordVolleyballRallyMutation();

  const [undoLastEvent, { isLoading: isUndoing }] =
    useUndoLastVolleyballEventMutation();

  /* =========================
     RESOLVE ACTIVE SET
  ========================= */

  useEffect(() => {
    /*
     * Explicit route set wins.
     * Important for Set 2+.
     */
    if (setIdFromRoute && sets?.length) {
      const routeSet = sets.find((set) => set.id === setIdFromRoute);

      if (routeSet) {
        setLiveSet(routeSet);

        setCompletedSet(
          routeSet.status === VOLLEYBALL_SET_STATUSES.COMPLETED
            ? routeSet
            : null,
        );

        return;
      }
    }

    if (currentSet) {
      setLiveSet(currentSet);

      setCompletedSet(
        currentSet.status === VOLLEYBALL_SET_STATUSES.COMPLETED
          ? currentSet
          : null,
      );
    }
  }, [setIdFromRoute, sets, currentSet]);

  const setId = setIdFromRoute ?? liveSet?.id;

  /* =========================
     DERIVED STATE
  ========================= */

  const currentServer = useMemo(() => {
    if (!match || !liveSet || !liveSet.currentServerPlayerId) {
      return null;
    }

    if (liveSet.servingTeamId === match.teamAId && match.teamARoster) {
      return getPlayer(match.teamARoster, liveSet.currentServerPlayerId);
    }

    if (liveSet.servingTeamId === match.teamBId && match.teamBRoster) {
      return getPlayer(match.teamBRoster, liveSet.currentServerPlayerId);
    }

    return null;
  }, [match, liveSet]);

  const pointRoster = useMemo(() => {
    if (!match || !pointTeamId) {
      return null;
    }

    return pointTeamId === match.teamAId
      ? match.teamARoster
      : match.teamBRoster;
  }, [match, pointTeamId]);

  const pointRotation = useMemo(() => {
    if (!match || !liveSet || !pointTeamId) {
      return [];
    }

    return pointTeamId === match.teamAId
      ? liveSet.teamACurrentRotation
      : liveSet.teamBCurrentRotation;
  }, [match, liveSet, pointTeamId]);

  /*
   * Only on-court players appear
   * as possible credited players.
   */
  const pointPlayers = useMemo(() => {
    if (!pointRoster) {
      return [];
    }

    const courtIds = new Set(pointRotation.map((slot) => slot.playerId));

    return pointRoster.players.filter((player) =>
      courtIds.has(player.playerId),
    );
  }, [pointRoster, pointRotation]);

  const teamAIsServing = liveSet?.servingTeamId === match?.teamAId;

  const teamBIsServing = liveSet?.servingTeamId === match?.teamBId;

  const actionsDisabled =
    !liveSet ||
    isRecordingRally ||
    isUndoing ||
    liveSet.status !== VOLLEYBALL_SET_STATUSES.LIVE;

  /* =========================
     POINT
  ========================= */

  function openPointSheet(teamId: string) {
    if (actionsDisabled) {
      return;
    }

    setError("");

    setPointTeamId(teamId);

    setPointSheetOpen(true);
  }

  async function submitRally({
    pointType,
    playerId,
  }: {
    pointType: VolleyballPointType;
    playerId?: string;
  }) {
    if (!liveSet || !setId || !pointTeamId || isRecordingRally) {
      return;
    }

    setError("");

    try {
      const response = await recordRally({
        matchId,

        setId,

        body: {
          clientEventId: crypto.randomUUID(),

          expectedVersion: liveSet.version,

          winningTeamId: pointTeamId,

          pointType,

          ...(playerId
            ? {
                creditedPlayerId: playerId,
              }
            : {}),
        },
      }).unwrap();

      /*
       * Backend is authoritative.
       */
      setLiveSet(response.set);

      setPointSheetOpen(false);

      setPointTeamId(null);

      if (response.set.status === VOLLEYBALL_SET_STATUSES.COMPLETED) {
        setCompletedSet(response.set);
      }
    } catch (err) {
      setError(extractErrorMessage(err));

      void refetchSets();
    }
  }

  /* =========================
     UNDO
  ========================= */

  async function handleUndo() {
    if (!liveSet || isUndoing || isRecordingRally) {
      return;
    }

    setError("");

    try {
      const response = await undoLastEvent({
        matchId,

        body: {
          clientEventId: crypto.randomUUID(),

          expectedSetVersion: liveSet.version,
        },
      }).unwrap();

      setLiveSet(response.set);

      setCompletedSet(
        response.set.status === VOLLEYBALL_SET_STATUSES.COMPLETED
          ? response.set
          : null,
      );

      setUndoOpen(false);
    } catch (err) {
      setError(extractErrorMessage(err));

      setUndoOpen(false);

      void refetchSets();
    }
  }

  /* =========================
     COMPLETED SET
  ========================= */

  async function handleSetCompletedContinue() {
    if (isRefreshingLifecycle) {
      return;
    }

    try {
      setIsRefreshingLifecycle(true);

      setError("");

      const [matchResult, setsResult] = await Promise.all([
        refetchMatch(),
        refetchSets(),
      ]);

      const updatedMatch = matchResult.data;

      const updatedSets = setsResult.data;

      if (!updatedMatch) {
        setError("Unable to refresh match state.");

        return;
      }

      /*
       * MATCH COMPLETE
       */
      if (updatedMatch.status === VOLLEYBALL_MATCH_STATUSES.COMPLETED) {
        /*
         * Final set has completed the match.
         *
         * Do NOT navigate away yet.
         * First show the post-match flow.
         */
        setCompletedSet(null);

        setCompletedMatch(updatedMatch);

        setEndMatchOpen(true);

        return;
      }

      /*
       * MATCH CONTINUES
       */
      if (!updatedSets?.length) {
        setError("Unable to load the next set.");

        return;
      }

      const nextSet = updatedSets
        .filter((set) => set.status === VOLLEYBALL_SET_STATUSES.PENDING_LINEUP)
        .sort((a, b) => a.setNumber - b.setNumber)[0];

      if (!nextSet) {
        setError("Next set is not ready yet.");

        return;
      }

      setCompletedSet(null);

      router.replace(
        `/volleyball/matches/${matchId}/sets/setup?setNumber=${nextSet.setNumber}`,
      );
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsRefreshingLifecycle(false);
    }
  }

  /* =========================
     LOADING
  ========================= */

  if (isMatchLoading || isSetLoading || isSetsLoading) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden bg-(--color-bg-base) p-3">
        <div className="h-14 animate-pulse rounded-2xl bg-(--color-bg-card)" />

        <div className="h-52 animate-pulse rounded-3xl bg-(--color-bg-card)" />

        <div className="h-20 animate-pulse rounded-2xl bg-(--color-bg-card)" />

        <div className="grid grid-cols-2 gap-2">
          <div className="h-24 animate-pulse rounded-2xl bg-(--color-bg-card)" />
          <div className="h-24 animate-pulse rounded-2xl bg-(--color-bg-card)" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-(--color-bg-card)"
            />
          ))}
        </div>
      </div>
    );
  }

  /* =========================
     INVALID MATCH
  ========================= */

  if (
    isMatchError ||
    isSetError ||
    isSetsError ||
    !match ||
    !liveSet ||
    !match.teamARoster ||
    !match.teamBRoster
  ) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-(--color-bg-base) px-4">
        <div className="w-full max-w-sm rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <p className="font-bold text-(--color-text-primary)">
            Unable to load live scoring
          </p>

          <p className="mt-1 text-xs text-(--color-text-muted)">
            This match may not have an active set.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-(--color-bg-base)">
      {/* ERROR TOAST */}

      {error && (
        <div className="absolute left-3 right-3 top-2 z-40 rounded-2xl border border-(--color-live)/20 bg-white px-3 py-2 shadow-xl">
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-(--color-live)" />

            <p className="min-w-0 flex-1 text-xs font-semibold leading-4 text-(--color-live)">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 text-(--color-text-muted)"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        {/* =================================
            LIVE / MATCH STRIP
        ================================= */}

        <div className="flex shrink-0 items-center justify-between rounded-2xl bg-(--color-navy) px-3 py-2 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-(--color-live)" />

              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/75">
                Live
              </span>

              <span className="text-xs font-bold">Set {liveSet.setNumber}</span>
            </div>

            <p className="mt-0.5 text-[10px] text-white/55">
              First to {liveSet.targetPoints}
              {" · "}
              Win by {liveSet.winByMargin}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TopTeamIdentity
              imageKey={match.teamASnapshot.logoUrl}
              name={match.teamASnapshot.shortName ?? match.teamASnapshot.name}
            />

            <span className="text-[10px] font-black text-white/35">VS</span>

            <TopTeamIdentity
              imageKey={match.teamBSnapshot.logoUrl}
              name={match.teamBSnapshot.shortName ?? match.teamBSnapshot.name}
            />
          </div>
        </div>

        {/* =================================
            COMPACT COURT
        ================================= */}

        <CompactVolleyballCourt
          teamARoster={match.teamARoster}
          teamBRoster={match.teamBRoster}
          teamARotation={liveSet.teamACurrentRotation}
          teamBRotation={liveSet.teamBCurrentRotation}
          teamAName={match.teamASnapshot.shortName ?? match.teamASnapshot.name}
          teamBName={match.teamBSnapshot.shortName ?? match.teamBSnapshot.name}
          teamAId={match.teamAId}
          teamBId={match.teamBId}
          servingTeamId={liveSet.servingTeamId}
          currentServerPlayerId={liveSet.currentServerPlayerId}
        />

        {/* =================================
            SCORE
        ================================= */}

        <ScoreStrip
          teamAName={match.teamASnapshot.shortName ?? match.teamASnapshot.name}
          teamBName={match.teamBSnapshot.shortName ?? match.teamBSnapshot.name}
          teamAPoints={liveSet.teamAPoints}
          teamBPoints={liveSet.teamBPoints}
          teamASets={match.teamASetsWon}
          teamBSets={match.teamBSetsWon}
          setNumber={liveSet.setNumber}
          teamAIsServing={teamAIsServing}
          teamBIsServing={teamBIsServing}
          server={currentServer}
        />

        {/* =================================
            LARGE POINT ACTIONS
        ================================= */}

        <div className="grid shrink-0 grid-cols-2 gap-2">
          <PointActionButton
            teamName={match.teamASnapshot.shortName ?? match.teamASnapshot.name}
            currentScore={liveSet.teamAPoints}
            side="A"
            disabled={actionsDisabled}
            onClick={() => openPointSheet(match.teamAId)}
          />

          <PointActionButton
            teamName={match.teamBSnapshot.shortName ?? match.teamBSnapshot.name}
            currentScore={liveSet.teamBPoints}
            side="B"
            disabled={actionsDisabled}
            onClick={() => openPointSheet(match.teamBId)}
          />
        </div>

        {/* =================================
            SECONDARY ACTIONS
        ================================= */}

        <div className="grid shrink-0 grid-cols-4 gap-2">
          <SmallActionButton
            icon={<ArrowRightLeft size={18} />}
            title="Substitute"
            disabled={actionsDisabled}
            onClick={() => setSubstitutionOpen(true)}
          />

          <SmallActionButton
            icon={<Shield size={18} />}
            title="Libero"
            disabled={actionsDisabled}
            onClick={() => setLiberoReplacementOpen(true)}
          />

          <SmallActionButton
            icon={<History size={18} />}
            title="History"
            disabled={isUndoing}
            onClick={() => setHistoryOpen(true)}
          />

          <SmallActionButton
            icon={<RotateCcw size={18} />}
            title={isUndoing ? "Wait" : "Undo"}
            disabled={actionsDisabled}
            onClick={() => setUndoOpen(true)}
          />
        </div>
      </div>

      {/* =================================
          POINT DIALOG
      ================================= */}

      <VolleyballPointSheet
        open={pointSheetOpen}
        teamA={{
          id: match.teamAId,
          name: match.teamASnapshot.name,
          shortName: match.teamASnapshot.shortName,
          logoUrl: match.teamASnapshot.logoUrl,
        }}
        teamB={{
          id: match.teamBId,
          name: match.teamBSnapshot.name,
          shortName: match.teamBSnapshot.shortName,
          logoUrl: match.teamBSnapshot.logoUrl,
        }}
        selectedTeamId={pointTeamId}
        players={pointPlayers}
        isSubmitting={isRecordingRally}
        onChangeTeam={(teamId) => {
          setPointTeamId(teamId);
        }}
        onClose={() => {
          if (isRecordingRally) {
            return;
          }

          setPointSheetOpen(false);

          setPointTeamId(null);
        }}
        onSubmit={submitRally}
      />

      {/* SUBSTITUTION */}

      <VolleyballSubstitutionSheet
        open={substitutionOpen}
        match={match}
        liveSet={liveSet}
        onClose={() => setSubstitutionOpen(false)}
        onSuccess={(updatedSet) => {
          setLiveSet(updatedSet);

          setError("");
        }}
      />

      {/* LIBERO */}

      <VolleyballLiberoReplacementSheet
        open={liberoReplacementOpen}
        match={match}
        liveSet={liveSet}
        onClose={() => setLiberoReplacementOpen(false)}
        onSuccess={(updatedSet) => {
          setLiveSet(updatedSet);

          setError("");
        }}
      />

      {/* HISTORY */}

      <VolleyballHistorySheet
        open={historyOpen}
        match={match}
        onClose={() => setHistoryOpen(false)}
      />

      {/* UNDO */}

      <UndoSheet
        open={undoOpen}
        loading={isUndoing}
        onClose={() => setUndoOpen(false)}
        onConfirm={() => void handleUndo()}
      />

      {/* SET COMPLETE */}

      {completedSet && (
        <VolleyballSetCompletedSheet
          open
          match={match}
          set={completedSet}
          isLoading={isRefreshingLifecycle}
          onContinue={() => void handleSetCompletedContinue()}
        />
      )}

      {completedMatch && (
        <VolleyballEndMatchSheet
          open={endMatchOpen}
          match={completedMatch}
          onClose={() => {
            setEndMatchOpen(false);

            router.replace(`/volleyball/matches/${matchId}`);
          }}
          onFinished={() => {
            setEndMatchOpen(false);

            router.replace(`/volleyball/matches/${matchId}`);
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   COURT
========================================================= */

type CompactVolleyballCourtProps = {
  teamARoster: VolleyballMatchRoster;
  teamBRoster: VolleyballMatchRoster;

  teamARotation: VolleyballRotationPosition[];
  teamBRotation: VolleyballRotationPosition[];

  teamAName: string;
  teamBName: string;

  teamAId: string;
  teamBId: string;

  servingTeamId: string | null;

  currentServerPlayerId: string | null;
};

function CompactVolleyballCourt({
  teamARoster,
  teamBRoster,
  teamARotation,
  teamBRotation,
  teamAName,
  teamBName,
  teamAId,
  teamBId,
  servingTeamId,
  currentServerPlayerId,
}: CompactVolleyballCourtProps) {
  const teamALabel = getTeamDisplayLabel(teamAName);

  const teamBLabel = getTeamDisplayLabel(teamBName);

  return (
    <div className="shrink-0 overflow-hidden rounded-2xl bg-(--color-navy) p-2.5 shadow-(--shadow-card)">
      {/* TEAM LABELS */}

      <div className="mb-1.5 flex items-center justify-between px-1">
        <CourtTeamLabel
          label={teamALabel}
          side="A"
          serving={servingTeamId === teamAId}
        />

        <CourtTeamLabel
          label={teamBLabel}
          side="B"
          serving={servingTeamId === teamBId}
        />
      </div>

      {/* COURT */}

      <div className="relative aspect-[2.2/1] w-full overflow-hidden rounded-xl border-[3px] border-white bg-[#3479c7]">
        {/* PLAYING SURFACE */}

        <div className="absolute inset-[6%] border-2 border-white/95 bg-[#edc990]" />

        {/* CENTER / NET */}

        <div className="absolute bottom-[6%] left-1/2 top-[6%] z-10 w-[3px] -translate-x-1/2 bg-white" />

        {/* ATTACK LINES */}

        <div className="absolute bottom-[6%] left-[34%] top-[6%] z-10 w-[2px] bg-white/90" />

        <div className="absolute bottom-[6%] right-[34%] top-[6%] z-10 w-[2px] bg-white/90" />

        {/*
         * IMPORTANT:
         *
         * Each team receives exactly
         * HALF the court.
         *
         * Players can therefore never
         * cross into the other side.
         */}

        <div className="absolute inset-y-[6%] left-[6%] right-1/2">
          <CourtHalf
            side="A"
            roster={teamARoster}
            rotation={teamARotation}
            currentServerPlayerId={currentServerPlayerId}
          />
        </div>

        <div className="absolute inset-y-[6%] left-1/2 right-[6%]">
          <CourtHalf
            side="B"
            roster={teamBRoster}
            rotation={teamBRotation}
            currentServerPlayerId={currentServerPlayerId}
          />
        </div>

        {/* BALL */}

        <div
          className={cn(
            "absolute top-1.5 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300",
            servingTeamId === teamAId ? "left-1.5" : "right-1.5",
          )}
        >
          <Volleyball size={19} className="text-[#526171]" />
        </div>
      </div>
    </div>
  );
}

function CourtTeamLabel({
  label,
  side,
  serving,
}: {
  label: string;
  side: "A" | "B";
  serving: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {side === "A" && (
        <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
      )}

      <span className="font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.12em] text-white">
        {label}
      </span>

      {serving && <CircleDot size={10} className="text-white" />}

      {side === "B" && (
        <span className="h-2.5 w-2.5 rounded-full bg-[#ef3b2d]" />
      )}
    </div>
  );
}

type CourtHalfProps = {
  side: "A" | "B";

  roster: VolleyballMatchRoster;

  rotation: VolleyballRotationPosition[];

  currentServerPlayerId: string | null;
};

function CourtHalf({
  side,
  roster,
  rotation,
  currentServerPlayerId,
}: CourtHalfProps) {
  /*
   * Each half:
   *
   * 3 front-row players
   * 3 back-row players
   *
   * We use percentages RELATIVE
   * TO THAT TEAM'S HALF.
   */

  const positions: {
    position: VolleyballCourtPosition;
    left: string;
    top: string;
  }[] =
    side === "A"
      ? [
          {
            position: 4,
            left: "18%",
            top: "26%",
          },
          {
            position: 3,
            left: "50%",
            top: "26%",
          },
          {
            position: 2,
            left: "82%",
            top: "26%",
          },

          {
            position: 5,
            left: "18%",
            top: "74%",
          },
          {
            position: 6,
            left: "50%",
            top: "74%",
          },
          {
            position: 1,
            left: "82%",
            top: "74%",
          },
        ]
      : [
          /*
           * Visually mirrored.
           */
          {
            position: 2,
            left: "18%",
            top: "26%",
          },
          {
            position: 3,
            left: "50%",
            top: "26%",
          },
          {
            position: 4,
            left: "82%",
            top: "26%",
          },

          {
            position: 1,
            left: "18%",
            top: "74%",
          },
          {
            position: 6,
            left: "50%",
            top: "74%",
          },
          {
            position: 5,
            left: "82%",
            top: "74%",
          },
        ];

  return (
    <div className="relative h-full w-full">
      {positions.map((slot) => {
        const player = getPlayerAtPosition(roster, rotation, slot.position);

        return (
          <CourtPlayerMarker
            key={`${side}-${slot.position}`}
            player={player}
            side={side}
            isServer={player?.playerId === currentServerPlayerId}
            left={slot.left}
            top={slot.top}
          />
        );
      })}
    </div>
  );
}

function CourtPlayerMarker({
  player,
  side,
  isServer,
  left,
  top,
}: {
  player: VolleyballMatchRosterPlayer | null;

  side: "A" | "B";

  isServer: boolean;

  left: string;
  top: string;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left,
        top,
      }}
    >
      <div
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full shadow-[0_5px_12px_rgba(0,0,0,0.2)]",
          "min-[380px]:h-11 min-[380px]:w-11",
          side === "A"
            ? "bg-[linear-gradient(145deg,#fbbf24,#f59e0b)]"
            : "bg-[linear-gradient(145deg,#fb5746,#ef3025)]",
          isServer && "ring-[3px] ring-white",
        )}
      >
        <span className="font-(family-name:--font-display) text-lg font-black text-white min-[380px]:text-xl">
          {player?.jerseyNumberSnapshot ?? "–"}
        </span>

        {isServer && (
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-(--color-brand)">
            <CircleDot size={7} className="text-white" />
          </span>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SCORE
========================================================= */

function ScoreStrip({
  teamAName,
  teamBName,
  teamAPoints,
  teamBPoints,
  teamASets,
  teamBSets,
  setNumber,
  teamAIsServing,
  teamBIsServing,
  server,
}: {
  teamAName: string;
  teamBName: string;

  teamAPoints: number;
  teamBPoints: number;

  teamASets: number;
  teamBSets: number;

  setNumber: number;

  teamAIsServing: boolean;
  teamBIsServing: boolean;

  server: VolleyballMatchRosterPlayer | null;
}) {
  return (
    <div className="shrink-0 overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2">
        <ScoreTeam
          name={teamAName}
          points={teamAPoints}
          sets={teamASets}
          serving={teamAIsServing}
          side="A"
        />

        <div className="px-1 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-(--color-text-muted)">
            Set {setNumber}
          </p>

          <div className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-(--color-brand)" />
        </div>

        <ScoreTeam
          name={teamBName}
          points={teamBPoints}
          sets={teamBSets}
          serving={teamBIsServing}
          side="B"
          align="right"
        />
      </div>

      <div className="border-t border-(--color-bg-border) bg-(--color-bg-tint) px-3 py-1.5 text-center">
        <p className="truncate text-[10px] text-(--color-text-secondary)">
          Serving{" "}
          <span className="font-bold text-(--color-text-primary)">
            {server ? server.playerNameSnapshot : "—"}
          </span>
        </p>
      </div>
    </div>
  );
}

function ScoreTeam({
  name,
  points,
  sets,
  serving,
  side,
  align = "left",
}: {
  name: string;

  points: number;
  sets: number;

  serving: boolean;

  side: "A" | "B";

  align?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <div
        className={cn(
          "flex h-9 min-w-9 items-center justify-center rounded-xl px-2 font-(family-name:--font-display) text-2xl font-black",
          serving
            ? side === "A"
              ? "bg-[#f59e0b] text-white"
              : "bg-[#ef3b2d] text-white"
            : "bg-(--color-bg-base) text-(--color-text-primary)",
        )}
      >
        {points}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[10px] font-black uppercase text-(--color-text-primary)">
          {getTeamDisplayLabel(name)}
        </p>

        <p className="text-[9px] text-(--color-text-muted)">Sets {sets}</p>
      </div>
    </div>
  );
}

/* =========================================================
   PRIMARY POINT ACTIONS
========================================================= */

function PointActionButton({
  teamName,
  currentScore,
  side,
  disabled,
  onClick,
}: {
  teamName: string;

  currentScore: number;

  side: "A" | "B";

  disabled: boolean;

  onClick: () => void;
}) {
  const teamA = side === "A";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl px-3 py-3 text-left text-white shadow-lg transition-transform",
        teamA
          ? "bg-[linear-gradient(135deg,#f59e0b,#ea580c)]"
          : "bg-[linear-gradient(135deg,#fb4938,#dc2626)]",
        !disabled && "active:scale-[0.98]",
        disabled && "cursor-not-allowed opacity-45",
      )}
    >
      {/* LARGE DECORATIVE BALL */}

      <Volleyball
        size={72}
        strokeWidth={1}
        className="absolute -right-3 -top-3 opacity-15"
      />

      <div className="relative flex items-center gap-2">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/18">
          <Volleyball size={23} />

          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-base font-black text-(--color-navy)">
            +
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-black uppercase tracking-[0.13em] text-white/75">
            Award Point
          </p>

          <p className="mt-0.5 truncate font-(family-name:--font-display) text-xl font-black uppercase tracking-wide">
            {getTeamDisplayLabel(teamName)}
          </p>
        </div>

        <span className="font-(family-name:--font-display) text-3xl font-black">
          +1
        </span>
      </div>

      <div className="relative mt-2 flex items-center justify-between border-t border-white/20 pt-1.5">
        <span className="text-[9px] text-white/75">Current score</span>

        <span className="text-sm font-black">{currentScore}</span>
      </div>
    </button>
  );
}

/* =========================================================
   SECONDARY ACTION
========================================================= */

function SmallActionButton({
  icon,
  title,
  disabled,
  onClick,
}: {
  icon: ReactNode;

  title: string;

  disabled: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-1 py-2 shadow-(--shadow-card)",
        !disabled && "active:scale-[0.96]",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-bg-tint) text-(--color-brand)">
        {icon}
      </div>

      <span className="w-full truncate text-center text-[9px] font-bold text-(--color-text-primary)">
        {title}
      </span>
    </button>
  );
}

/* =========================================================
   POINT SHEET
========================================================= */

type PointTeam = {
  id: string;
  name: string;
  shortName?: string | null;
  logoUrl?: string | null;
};

function VolleyballPointSheet({
  open,
  teamA,
  teamB,
  selectedTeamId,
  players,
  isSubmitting,
  onChangeTeam,
  onClose,
  onSubmit,
}: {
  open: boolean;

  teamA: PointTeam;
  teamB: PointTeam;

  selectedTeamId: string | null;

  players: VolleyballMatchRosterPlayer[];

  isSubmitting: boolean;

  onChangeTeam: (teamId: string) => void;

  onClose: () => void;

  onSubmit: (args: {
    pointType: VolleyballPointType;
    playerId?: string;
  }) => Promise<void>;
}) {
  const [pointType, setPointType] = useState<VolleyballPointType | null>(null);

  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPointType(null);
      setPlayerId(null);
    }
  }, [open]);

  /*
   * Switching winning team should
   * clear player credit because the
   * available players have changed.
   */
  useEffect(() => {
    setPlayerId(null);
  }, [selectedTeamId]);

  const selectedTeam = selectedTeamId === teamB.id ? teamB : teamA;

  const requiresPlayer =
    pointType !== null && pointType !== VOLLEYBALL_POINT_TYPES.OPPONENT_ERROR;

  const canSubmit =
    Boolean(pointType) && (!requiresPlayer || Boolean(playerId));

  return (
    <DialogBottom
      open={open}
      onClose={onClose}
      className="h-full max-h-[89dvh] overflow-hidden rounded-t-3xl bg-(--color-bg-card)"
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* =========================
            HEADER
        ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-card) px-2 py-1.5">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--color-text-muted)">
              Rally
            </p>

            <h2 className="mt-0.5 truncate text-lg font-black text-(--color-text-primary)">
              Point for {selectedTeam.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <TeamBadge
              imageKey={selectedTeam.logoUrl ?? null}
              name={selectedTeam.shortName ?? selectedTeam.name}
              tone={selectedTeam.id === teamA.id ? "orange" : "red"}
            />

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* =========================
            SCROLLABLE CONTENT
        ========================= */}

        <div className="min-h-0 flex-1 overflow-y-auto bg-(--color-bg-base) px-4 py-3 scrollbar-hide">
          {/* ASSIGN POINT FOR */}

          <p className="text-section-label">Assign point for</p>

          <div className="mt-1 grid grid-cols-2 gap-2">
            <TeamChoiceCard
              team={teamA}
              selected={selectedTeam.id === teamA.id}
              tone="orange"
              disabled={isSubmitting}
              onClick={() => onChangeTeam(teamA.id)}
            />

            <TeamChoiceCard
              team={teamB}
              selected={selectedTeam.id === teamB.id}
              tone="red"
              disabled={isSubmitting}
              onClick={() => onChangeTeam(teamB.id)}
            />
          </div>

          {/* =========================
              SCORED BY
          ========================= */}

          <div className="mt-3">
            <p className="text-section-label">Scored by</p>

            <div className="mt-1 grid grid-cols-3 gap-2">
              <ScoringTypeCard
                label="Serve"
                selected={pointType === VOLLEYBALL_POINT_TYPES.SERVE}
                disabled={isSubmitting}
                visual={<ServeVisual />}
                onClick={() => {
                  setPointType(VOLLEYBALL_POINT_TYPES.SERVE);

                  setPlayerId(null);
                }}
              />

              <ScoringTypeCard
                label="Attack"
                selected={pointType === VOLLEYBALL_POINT_TYPES.ATTACK}
                disabled={isSubmitting}
                visual={<AttackVisual />}
                onClick={() => {
                  setPointType(VOLLEYBALL_POINT_TYPES.ATTACK);

                  setPlayerId(null);
                }}
              />

              <ScoringTypeCard
                label="Block"
                selected={pointType === VOLLEYBALL_POINT_TYPES.BLOCK}
                disabled={isSubmitting}
                visual={<BlockVisual />}
                onClick={() => {
                  setPointType(VOLLEYBALL_POINT_TYPES.BLOCK);

                  setPlayerId(null);
                }}
              />
            </div>
          </div>

          {/* =========================
              OPPONENT ERROR
          ========================= */}

          <div className="mt-1 border-t border-(--color-bg-border) pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setPointType(VOLLEYBALL_POINT_TYPES.OPPONENT_ERROR);

                setPlayerId(null);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left shadow-(--shadow-card)",
                pointType === VOLLEYBALL_POINT_TYPES.OPPONENT_ERROR
                  ? "border-red-400 bg-red-50"
                  : "border-(--color-bg-border) bg-(--color-bg-card)",
              )}
            >
              <div>
                <p className="text-sm font-black text-(--color-text-primary)">
                  Opponent error
                </p>

                <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
                  No player credit required
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Ban size={22} />
              </div>
            </button>
          </div>

          {/* =========================
              PLAYER PICKER
          ========================= */}

          {requiresPlayer && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-section-label">Select player</p>

                <span className="text-[10px] text-(--color-text-muted)">
                  On court
                </span>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                {players.map((player) => {
                  const selected = playerId === player.playerId;

                  return (
                    <button
                      key={player.playerId}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setPlayerId(player.playerId)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border bg-(--color-bg-card) p-2.5 text-left shadow-(--shadow-card)",
                        selected
                          ? "border-(--color-brand) bg-(--color-bg-tint) ring-1 ring-(--color-brand)/15"
                          : "border-(--color-bg-border)",
                      )}
                    >
                      <PlayerPhoto player={player} size={42} />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-(--color-text-primary)">
                          {player.playerNameSnapshot}
                        </p>

                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-[11px] text-(--color-text-muted)">
                            #{player.jerseyNumberSnapshot}
                          </span>

                          {player.isLibero && (
                            <span className="rounded-full bg-(--color-bg-tint) px-2 py-0.5 text-[8px] font-black uppercase text-(--color-brand)">
                              Libero
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={cn(
                          "h-4 w-4 shrink-0 rounded-full border-2",
                          selected
                            ? "border-(--color-brand) bg-(--color-brand)"
                            : "border-(--color-bg-border)",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* =========================
            FIXED CONFIRM
        ========================= */}

        <div className="safe-bottom shrink-0 bg-(--color-bg-card) pb-2 pt-3">
          <Button
            fullWidth
            loading={isSubmitting}
            disabled={!canSubmit || isSubmitting}
            onClick={() => {
              if (!pointType) {
                return;
              }

              void onSubmit({
                pointType,

                ...(playerId
                  ? {
                      playerId,
                    }
                  : {}),
              });
            }}
          >
            Confirm Point
          </Button>
        </div>
      </div>
    </DialogBottom>
  );
}

/* =========================================================
   SCORING TYPE VISUALS
========================================================= */

function ServeVisual() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#e8f2f8]">
      {/* Court floor — sandy bottom-left triangle */}
      <div
        className="absolute bottom-0 left-0 right-0 h-9"
        style={{ background: "#e8c98a" }}
      />
      {/* Net / sky area — blue top-right */}
      <div
        className="absolute right-0 top-0 h-9 w-full"
        style={{ background: "#5eb6ef" }}
      />
      {/* Diagonal floor/sky divide */}
      <div
        className="absolute left-0 top-0 w-full"
        style={{
          height: "100%",
          background:
            "linear-gradient(135deg, #5eb6ef 0%, #5eb6ef 48%, #e8c98a 48%, #e8c98a 100%)",
        }}
      />
      {/* Net line */}
      <div className="absolute left-0 right-0 top-[44%] h-[3px] bg-[#257bb4] opacity-70" />
      {/* Ball */}
      <Volleyball
        size={34}
        strokeWidth={2.2}
        className="relative z-10 text-[#0b426d] drop-shadow-sm"
      />
    </div>
  );
}

function AttackVisual() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#dcefff]">
      {/* Motion blur arc 1 — large outer trail */}
      <div
        className="absolute"
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background:
            "conic-gradient(from 210deg, #1597df 0deg, #1597df 80deg, transparent 80deg)",
          opacity: 0.55,
        }}
      />
      {/* Motion blur arc 2 — inner trail, slightly lighter */}
      <div
        className="absolute"
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background:
            "conic-gradient(from 215deg, #4bb3ed 0deg, #4bb3ed 70deg, transparent 70deg)",
          opacity: 0.5,
        }}
      />
      {/* Motion blur arc 3 — smallest highlight arc */}
      <div
        className="absolute"
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background:
            "conic-gradient(from 220deg, #7dcaf5 0deg, #7dcaf5 55deg, transparent 55deg)",
          opacity: 0.45,
        }}
      />
      {/* Ball */}

      <Volleyball
        size={36}
        strokeWidth={2.2}
        className="relative z-10 text-[#0b426d] drop-shadow-sm ml-4 mb-4"
      />
    </div>
  );
}

function BlockVisual() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0e5]">
      <span className="absolute -top-2 text-[26px] leading-none">🙌</span>

      <Volleyball
        size={31}
        strokeWidth={2.2}
        className="relative z-10 mt-5 text-[#0b426d]"
      />
    </div>
  );
}

function ScoringTypeCard({
  label,
  visual,
  selected,
  disabled,
  onClick,
}: {
  label: string;

  visual: ReactNode;

  selected: boolean;

  disabled: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex min-w-0 flex-col items-center rounded-2xl border bg-(--color-bg-card) px-1.5 py-2.5 shadow-(--shadow-card) transition-all",
        selected
          ? "border-(--color-brand) bg-(--color-bg-tint) ring-2 ring-(--color-brand)/10"
          : "border-(--color-bg-border)",
        disabled && "opacity-50",
      )}
    >
      {visual}

      <p className="mt-2 font-(family-name:--font-display) text-lg font-black text-(--color-text-primary)">
        {label}
      </p>
    </button>
  );
}

/* =========================================================
   POINT TEAM CHOICE
========================================================= */

function TeamChoiceCard({
  team,
  selected,
  tone,
  disabled,
  onClick,
}: {
  team: PointTeam;

  selected: boolean;

  tone: "orange" | "red";

  disabled: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left shadow-sm transition-all",
        selected && tone === "orange" && "border-orange-400 bg-orange-50",
        selected && tone === "red" && "border-red-400 bg-red-50",
        !selected && "border-(--color-bg-border) bg-(--color-bg-card)",
      )}
    >
      <TeamBadge
        imageKey={team.logoUrl ?? null}
        name={team.shortName ?? team.name}
        tone={tone}
      />

      <span className="truncate text-sm font-black text-(--color-text-primary)">
        {getTeamDisplayLabel(team.shortName ?? team.name)}
      </span>
    </button>
  );
}

function TeamBadge({
  imageKey,
  name,
  tone = "orange",
}: {
  imageKey: string | null;

  name: string;

  tone?: "orange" | "red";
}) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl text-white",
        tone === "orange" ? "bg-[#f59e0b]" : "bg-[#ef3b2d]",
      )}
    >
      {imageKey ? (
        <S3Image
          imageKey={imageKey}
          alt={name}
          width={36}
          height={36}
          className="h-full w-full object-cover"
          fallback={
            <span className="font-(family-name:--font-display) text-sm font-black">
              {getTeamDisplayLabel(name)}
            </span>
          }
        />
      ) : (
        <span className="font-(family-name:--font-display) text-sm font-black">
          {getTeamDisplayLabel(name)}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   UNDO
========================================================= */

function UndoSheet({
  open,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;

  loading: boolean;

  onClose: () => void;

  onConfirm: () => void;
}) {
  return (
    <DialogBottom
      open={open}
      onClose={onClose}
      className="rounded-t-3xl bg-(--color-bg-card)"
    >
      <div className="px-4 pb-4 pt-5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--color-bg-tint)">
          <RotateCcw size={22} className="text-(--color-brand)" />
        </div>

        <div className="mt-3 text-center">
          <h2 className="text-lg font-black text-(--color-text-primary)">
            Undo last action?
          </h2>

          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-(--color-text-secondary)">
            Score, rotation and serving state will be rebuilt from match
            history.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="h-11 rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) text-sm font-bold text-(--color-text-primary)"
          >
            Cancel
          </button>

          <Button
            fullWidth
            loading={loading}
            disabled={loading}
            onClick={onConfirm}
          >
            Undo
          </Button>
        </div>
      </div>
    </DialogBottom>
  );
}

/* =========================================================
   PLAYER PHOTO
========================================================= */

function PlayerPhoto({
  player,
  size,
}: {
  player: VolleyballMatchRosterPlayer;

  size: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--color-bg-tint)"
      style={{
        width: size,
        height: size,
      }}
    >
      {player.playerProfileImageSnapshot ? (
        <S3Image
          imageKey={player.playerProfileImageSnapshot}
          alt={player.playerNameSnapshot}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          fallback={<PlayerInitial name={player.playerNameSnapshot} />}
        />
      ) : (
        <PlayerInitial name={player.playerNameSnapshot} />
      )}
    </div>
  );
}

function PlayerInitial({ name }: { name: string }) {
  return (
    <span className="font-(family-name:--font-display) text-sm font-black text-(--color-brand)">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

/* =========================================================
   TOP TEAM IDENTITY
========================================================= */

function TopTeamIdentity({
  imageKey,
  name,
}: {
  imageKey: string | null;

  name: string;
}) {
  const label = getTeamDisplayLabel(name);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10">
        {imageKey ? (
          <S3Image
            imageKey={imageKey}
            alt={name}
            width={24}
            height={24}
            className="h-full w-full object-cover"
            fallback={
              <span className="text-[9px] font-black text-white">{label}</span>
            }
          />
        ) : (
          <span className="text-[9px] font-black text-white">{label}</span>
        )}
      </div>

      <span className="font-(family-name:--font-display) text-xs font-black uppercase text-white">
        {label}
      </span>
    </div>
  );
}
