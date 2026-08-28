"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

import {
  ArrowRightLeft,
  Ban,
  CircleAlert,
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
import { VolleyballUndoHistorySheet } from "@/components/volleyball/scoring/VolleyballUndoHistorySheet";

import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/getInitials";
import { VOLLEYBALL_COURT_SLOTS } from "@/lib/volleyball/courtPositions";
import {
  getReadableTextColor,
  resolveVolleyballTeamColor,
  VOLLEYBALL_TEAM_A_FALLBACK_COLOR,
  VOLLEYBALL_TEAM_B_FALLBACK_COLOR,
  withHexAlpha,
} from "@/lib/volleyball/teamColors";

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
  const tournamentIdFromQuery = searchParams.get("tournamentId");

  const fixtureIdFromQuery = searchParams.get("fixtureId");

  const setIdFromRoute = searchParams.get("setId");

  /* =========================
     STATE
  ========================= */

  const [liveSet, setLiveSet] = useState<VolleyballSet | null>(null);

  const [restoringSetId, setRestoringSetId] = useState<string | null>(null);

  const [completedSet, setCompletedSet] = useState<VolleyballSet | null>(null);

  const [pointTeamId, setPointTeamId] = useState<string | null>(null);

  const [lastScoringTeamId, setLastScoringTeamId] = useState<string | null>(
    null,
  );

  const [pointSheetOpen, setPointSheetOpen] = useState(false);

  const [pointError, setPointError] = useState("");

  const [pointActionsVisible, setPointActionsVisible] = useState(false);

  const [substitutionOpen, setSubstitutionOpen] = useState(false);

  const [liberoReplacementOpen, setLiberoReplacementOpen] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);

  const [undoOpen, setUndoOpen] = useState(false);

  const [undoError, setUndoError] = useState("");

  const [undoHistoryResetKey, setUndoHistoryResetKey] = useState(0);

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
    isFetching: isMatchFetching,
    isError: isMatchError,
    refetch: refetchMatch,
  } = useGetVolleyballMatchQuery({
    matchId,
  });

  const {
    data: currentSet,
    isLoading: isSetLoading,
    isFetching: isSetFetching,
    isError: isSetError,
    refetch: refetchCurrentSet,
  } = useGetCurrentVolleyballSetQuery({
    matchId,
  });

  const {
    data: sets,
    isLoading: isSetsLoading,
    isFetching: isSetsFetching,
    isError: isSetsError,
    refetch: refetchSets,
  } = useGetVolleyballMatchSetsQuery({
    matchId,
  });

  const [recordRally, { isLoading: isRecordingRally }] =
    useRecordVolleyballRallyMutation();

  const [undoLastEvent, { isLoading: isUndoing }] =
    useUndoLastVolleyballEventMutation();

  const resolvedTournamentId = match?.tournament?.id ?? tournamentIdFromQuery;

  const resolvedFixtureId = match?.fixture?.id ?? fixtureIdFromQuery;

  const scoreUpdatePending =
    isRecordingRally ||
    isUndoing ||
    isMatchFetching ||
    isSetFetching ||
    isSetsFetching;

  /* =========================
     RESOLVE ACTIVE SET
  ========================= */

  useEffect(() => {
    if (scoreUpdatePending) {
      return;
    }

    /*
     * Route set is authoritative.
     *
     * When Set 2+ has just started, `currentSet`
     * can temporarily still contain the previous
     * cached set.
     */
    const authoritativeSetId = restoringSetId ?? setIdFromRoute;

    if (authoritativeSetId) {
      if (!sets?.length) {
        return;
      }

      const routeSet = sets.find((set) => set.id === authoritativeSetId);

      if (!routeSet) {
        /*
         * Do NOT fall back to currentSet here.
         * Wait for the fresh sets request.
         */
        return;
      }

      setLiveSet(routeSet);

      setCompletedSet(
        routeSet.status === VOLLEYBALL_SET_STATUSES.COMPLETED ? routeSet : null,
      );

      return;
    }

    /*
     * Only use currentSet when there is
     * no explicit setId in the URL.
     */
    if (currentSet) {
      setLiveSet(currentSet);

      setCompletedSet(
        currentSet.status === VOLLEYBALL_SET_STATUSES.COMPLETED
          ? currentSet
          : null,
      );
    }
  }, [setIdFromRoute, restoringSetId, sets, currentSet, scoreUpdatePending]);

  const setId = restoringSetId ?? setIdFromRoute ?? liveSet?.id;

  useEffect(() => {
    if (restoringSetId && setIdFromRoute === restoringSetId) {
      setRestoringSetId(null);
    }
  }, [restoringSetId, setIdFromRoute]);

  useEffect(() => {
    setLastScoringTeamId(null);
  }, [liveSet?.id]);

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

  const teamAColor = resolveVolleyballTeamColor(
    match?.teamASnapshot.teamColor,
    VOLLEYBALL_TEAM_A_FALLBACK_COLOR,
  );

  const teamBColor = resolveVolleyballTeamColor(
    match?.teamBSnapshot.teamColor,
    VOLLEYBALL_TEAM_B_FALLBACK_COLOR,
  );

  const servingTeam =
    match && liveSet?.servingTeamId === match.teamAId
      ? {
          name: match.teamASnapshot.name,
          color: teamAColor,
        }
      : match && liveSet?.servingTeamId === match.teamBId
        ? {
            name: match.teamBSnapshot.name,
            color: teamBColor,
          }
        : null;

  const actionsDisabled =
    !liveSet ||
    scoreUpdatePending ||
    liveSet.status !== VOLLEYBALL_SET_STATUSES.LIVE;

  /* =========================
     POINT
  ========================= */

  function openPointSheet(teamId: string) {
    if (actionsDisabled) {
      return;
    }

    setError("");

    setPointError("");

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

    const scoringTeamId = pointTeamId;

    setError("");

    setPointError("");

    try {
      const response = await recordRally({
        matchId,

        setId,

        body: {
          clientEventId: crypto.randomUUID(),

          expectedVersion: liveSet.version,

          winningTeamId: scoringTeamId,

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

      setPointError("");

      setLastScoringTeamId(scoringTeamId);

      setPointSheetOpen(false);

      setPointTeamId(null);

      setPointActionsVisible(false);

      if (response.set.status === VOLLEYBALL_SET_STATUSES.COMPLETED) {
        setCompletedSet(response.set);
      }
    } catch (err) {
      const message = extractErrorMessage(err);

      setError(message);

      setPointError(message);

      void refetchSets();
    }
  }

  /* =========================
     UNDO
  ========================= */

  async function handleUndo(throughEventId?: string) {
    const targetSet = completedSet ?? liveSet;

    if (!targetSet || !match) {
      return;
    }

    setError("");

    try {
      const response = await undoLastEvent({
        matchId,

        body: {
          ...(throughEventId ? { throughEventId } : {}),
          expectedRevision: match.version,
        },
      }).unwrap();

      const restoredSetId = response.set.id;
      const restoredDifferentSet = setIdFromRoute !== restoredSetId;

      if (restoredDifferentSet) {
        setRestoringSetId(restoredSetId);
      }

      /*
       * Backend-authoritative state.
       */
      setLiveSet(response.set);

      setLastScoringTeamId(null);

      setPointTeamId(null);

      setPointSheetOpen(false);

      setPointActionsVisible(false);

      /*
       * If a completed set/match was reopened,
       * remove completion UI.
       */
      if (response.set.status === VOLLEYBALL_SET_STATUSES.LIVE) {
        setCompletedSet(null);
      }

      if (response.match.status === VOLLEYBALL_MATCH_STATUSES.LIVE) {
        setCompletedMatch(null);

        setEndMatchOpen(false);
      }

      setUndoOpen(false);

      setUndoError("");

      setError("");

      if (restoredDifferentSet) {
        const query = new URLSearchParams({ setId: restoredSetId });

        if (resolvedTournamentId) {
          query.set("tournamentId", resolvedTournamentId);
        }

        if (resolvedFixtureId) {
          query.set("fixtureId", resolvedFixtureId);
        }

        router.replace(
          `/volleyball/matches/${matchId}/scoring?${query.toString()}`,
        );
      }

      /*
       * Still refetch lifecycle resources because
       * undo may remove a derived pending next-set shell.
       */
      await Promise.all([refetchMatch(), refetchSets(), refetchCurrentSet()]);
    } catch (err) {
      if (isScoringStateChangedError(err)) {
        setUndoError(
          "The score changed while you were reviewing it. Please choose the correction again.",
        );
        setUndoHistoryResetKey((value) => value + 1);
        await Promise.all([refetchMatch(), refetchSets(), refetchCurrentSet()]);
        return;
      }

      if (isForbiddenError(err)) {
        setUndoError("Your tournament permissions have changed.");
        await refetchMatch();
        return;
      }

      setError(extractErrorMessage(err));
      setUndoError(extractErrorMessage(err));
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
        `/volleyball/matches/${matchId}/sets/setup?setNumber=${nextSet.setNumber}&tournamentId=${resolvedTournamentId}&fixtureId=${resolvedFixtureId}`,
      );
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsRefreshingLifecycle(false);
    }
  }

  const isWaitingForRouteSet = Boolean(
    (restoringSetId ?? setIdFromRoute) &&
      !sets?.some((set) => set.id === (restoringSetId ?? setIdFromRoute)),
  );

  /* =========================
     LOADING
  ========================= */

  if (isMatchLoading || isSetLoading || isSetsLoading || isWaitingForRouteSet) {
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
    <div className="relative flex min-h-full flex-col bg-(--color-bg-base)">
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

          <div className="grid min-w-0 max-w-[62%] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
            <TopTeamIdentity
              imageKey={match.teamASnapshot.logoUrl}
              name={match.teamASnapshot.name}
              teamColor={teamAColor}
            />

            <span className="text-[10px] font-black text-white/35">VS</span>

            <TopTeamIdentity
              imageKey={match.teamBSnapshot.logoUrl}
              name={match.teamBSnapshot.name}
              teamColor={teamBColor}
              right
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
          teamAName={match.teamASnapshot.name}
          teamBName={match.teamBSnapshot.name}
          teamAColor={teamAColor}
          teamBColor={teamBColor}
          teamAId={match.teamAId}
          teamBId={match.teamBId}
          servingTeamId={liveSet.servingTeamId}
          currentServerPlayerId={liveSet.currentServerPlayerId}
        />

        {/* =================================
            SCORE
        ================================= */}

        <ScoreStrip
          teamAId={match.teamAId}
          teamBId={match.teamBId}
          teamAName={match.teamASnapshot.name}
          teamBName={match.teamBSnapshot.name}
          teamAColor={teamAColor}
          teamBColor={teamBColor}
          teamAPoints={liveSet.teamAPoints}
          teamBPoints={liveSet.teamBPoints}
          teamASets={match.teamASetsWon}
          teamBSets={match.teamBSetsWon}
          setNumber={liveSet.setNumber}
          lastScoringTeamId={lastScoringTeamId}
          server={currentServer}
          pending={scoreUpdatePending}
        />

        {/* =================================
            LARGE POINT ACTIONS
        ================================= */}

        {pointActionsVisible ? (
          <div className="grid shrink-0 grid-cols-2 gap-2">
            <PointActionButton
              teamName={match.teamASnapshot.name}
              currentScore={liveSet.teamAPoints}
              teamColor={teamAColor}
              disabled={actionsDisabled}
              onClick={() => openPointSheet(match.teamAId)}
            />

            <PointActionButton
              teamName={match.teamBSnapshot.name}
              currentScore={liveSet.teamBPoints}
              teamColor={teamBColor}
              disabled={actionsDisabled}
              onClick={() => openPointSheet(match.teamBId)}
            />
          </div>
        ) : (
          <ServeActionButton
            teamName={servingTeam?.name ?? "Serving team"}
            teamColor={servingTeam?.color ?? teamAColor}
            disabled={actionsDisabled || !servingTeam}
            onClick={() => setPointActionsVisible(true)}
          />
        )}

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
            title={isUndoing ? "Wait" : "Correct"}
            disabled={actionsDisabled}
            onClick={() => {
              setUndoError("");
              setUndoOpen(true);
            }}
          />
        </div>
      </div>

      {/* =================================
          POINT DIALOG
      ================================= */}

      {pointSheetOpen && (
        <VolleyballPointSheet
          open={pointSheetOpen}
          teamA={{
            id: match.teamAId,
            name: match.teamASnapshot.name,
            shortName: match.teamASnapshot.shortName,
            logoUrl: match.teamASnapshot.logoUrl,
            teamColor: teamAColor,
          }}
          teamB={{
            id: match.teamBId,
            name: match.teamBSnapshot.name,
            shortName: match.teamBSnapshot.shortName,
            logoUrl: match.teamBSnapshot.logoUrl,
            teamColor: teamBColor,
          }}
          selectedTeamId={pointTeamId}
          players={pointPlayers}
          isSubmitting={isRecordingRally}
          error={pointError}
          onChangeTeam={(teamId) => {
            setPointError("");
            setPointTeamId(teamId);
          }}
          onClearError={() => setPointError("")}
          onClose={() => {
            if (isRecordingRally) {
              return;
            }

            setPointSheetOpen(false);

            setPointError("");

            setPointTeamId(null);

            setPointActionsVisible(false);
          }}
          onSubmit={submitRally}
        />
      )}

      {/* SUBSTITUTION */}

      {substitutionOpen && (
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
      )}

      {/* LIBERO */}

      {liberoReplacementOpen && (
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
      )}

      {/* HISTORY */}

      {historyOpen && (
        <VolleyballHistorySheet
          open={historyOpen}
          match={match}
          onClose={() => setHistoryOpen(false)}
        />
      )}

      {/* UNDO */}

      {undoOpen && (
        <VolleyballUndoHistorySheet
          open={undoOpen}
          match={match}
          liveSet={completedSet ?? liveSet}
          loading={isUndoing}
          error={undoError}
          resetKey={undoHistoryResetKey}
          onClose={() => {
            if (isUndoing) return;
            setUndoOpen(false);
            setUndoError("");
          }}
          onUndo={(throughEventId) => void handleUndo(throughEventId)}
        />
      )}

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
          isUndoing={isUndoing}
          onUndoLastPoint={() => {
            setEndMatchOpen(false);

            setUndoError("");
            setUndoOpen(true);
          }}
          onBackToFixtures={
            resolvedTournamentId
              ? () => {
                  router.replace(
                    `/volleyball/tournaments/${resolvedTournamentId}/fixtures`,
                  );
                }
              : undefined
          }
          onClose={() => {
            setEndMatchOpen(false);

            router.replace(`/volleyball/matches/${matchId}`);
          }}
          onFinished={(updatedMatch) => {
            setCompletedMatch(updatedMatch);

            setEndMatchOpen(false);

            if (resolvedTournamentId) {
              router.replace(
                `/volleyball/tournaments/${resolvedTournamentId}/fixtures`,
              );

              return;
            }

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
  teamAColor: string;
  teamBColor: string;

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
  teamAColor,
  teamBColor,
  teamAId,
  teamBId,
  servingTeamId,
  currentServerPlayerId,
}: CompactVolleyballCourtProps) {
  return (
    <div className="shrink-0 overflow-hidden rounded-2xl bg-(--color-navy) p-2.5 shadow-(--shadow-card)">
      {/* TEAM LABELS */}

      <div className="mb-1.5 flex items-center justify-between px-1">
        <CourtTeamLabel
          label={teamAName}
          teamColor={teamAColor}
          side="A"
          serving={servingTeamId === teamAId}
        />

        <CourtTeamLabel
          label={teamBName}
          teamColor={teamBColor}
          side="B"
          serving={servingTeamId === teamBId}
        />
      </div>

      {/* COURT */}

      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl border-[3px] border-white bg-[#3479c7]">
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
            teamColor={teamAColor}
            currentServerPlayerId={currentServerPlayerId}
          />
        </div>

        <div className="absolute inset-y-[6%] left-1/2 right-[6%]">
          <CourtHalf
            side="B"
            roster={teamBRoster}
            rotation={teamBRotation}
            teamColor={teamBColor}
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
  teamColor,
  serving,
}: {
  label: string;
  side: "A" | "B";
  teamColor: string;
  serving: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {side === "A" && (
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: teamColor }}
        />
      )}

      <span
        className={cn(
          "min-w-0 max-w-[125px] truncate font-(family-name:--font-display) text-xs font-black text-white min-[380px]:max-w-[150px] min-[380px]:text-sm",
          side === "B" && "text-right",
        )}
      >
        {label}
      </span>

      {serving && <CircleDot size={10} className="text-white" />}

      {side === "B" && (
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: teamColor }}
        />
      )}
    </div>
  );
}

type CourtHalfProps = {
  side: "A" | "B";

  roster: VolleyballMatchRoster;

  rotation: VolleyballRotationPosition[];
  teamColor: string;

  currentServerPlayerId: string | null;
};

function CourtHalf({
  side,
  roster,
  rotation,
  teamColor,
  currentServerPlayerId,
}: CourtHalfProps) {
  return (
    <div className="relative h-full w-full">
      {VOLLEYBALL_COURT_SLOTS.map((slot) => {
        const player = getPlayerAtPosition(roster, rotation, slot.position);

        return (
          <CourtPlayerMarker
            key={`${side}-${slot.position}`}
            player={player}
            teamColor={teamColor}
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
  teamColor,
  isServer,
  left,
  top,
}: {
  player: VolleyballMatchRosterPlayer | null;

  teamColor: string;

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
          isServer && "ring-[3px] ring-white",
        )}
        style={{
          backgroundColor: teamColor,
          boxShadow: `0 5px 12px ${withHexAlpha(teamColor, "4D")}`,
        }}
      >
        {player ? (
          <PlayerPhoto player={player} size={40} />
        ) : (
          <span className="font-(family-name:--font-display) text-lg font-black text-white min-[380px]:text-xl">
            –
          </span>
        )}

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
  teamAId,
  teamBId,
  teamAName,
  teamBName,
  teamAColor,
  teamBColor,
  teamAPoints,
  teamBPoints,
  teamASets,
  teamBSets,
  setNumber,
  server,
  pending,
  lastScoringTeamId,
}: {
  teamAId: string;
  teamBId: string;
  teamAName: string;
  teamBName: string;
  teamAColor: string;
  teamBColor: string;
  teamAPoints: number;
  teamBPoints: number;
  teamASets: number;
  teamBSets: number;
  setNumber: number;
  server: VolleyballMatchRosterPlayer | null;
  pending: boolean;
  lastScoringTeamId: string | null;
}) {
  return (
    <div className="shrink-0 overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2">
        <ScoreTeam
          name={teamAName}
          points={teamAPoints}
          sets={teamASets}
          scoredLastPoint={lastScoringTeamId === teamAId}
          teamColor={teamAColor}
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
          scoredLastPoint={lastScoringTeamId === teamBId}
          teamColor={teamBColor}
          align="right"
        />
      </div>

      <div className="border-t border-(--color-bg-border) bg-(--color-bg-tint) px-3 py-1.5 text-center">
        {pending ? (
          <div
            className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-(--color-brand)"
            role="status"
            aria-live="polite"
          >
            <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-(--color-brand)/25 border-t-(--color-brand)" />
            Saving score…
          </div>
        ) : (
          <p className="truncate text-[10px] text-(--color-text-secondary)">
            Serving{" "}
            <span className="font-bold text-(--color-text-primary)">
              {server ? server.playerNameSnapshot : "—"}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

function ScoreTeam({
  name,
  points,
  sets,
  scoredLastPoint,
  teamColor,
  align = "left",
}: {
  name: string;
  points: number;
  sets: number;
  scoredLastPoint: boolean;
  teamColor: string;
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
        className="flex h-10 min-w-10 items-center justify-center rounded-xl border-2 px-2 font-(family-name:--font-display) text-2xl font-black transition-colors"
        style={{
          borderColor: scoredLastPoint ? teamColor : "var(--color-bg-border)",

          backgroundColor: scoredLastPoint
            ? teamColor
            : "var(--color-bg-border)",

          color: scoredLastPoint
            ? getReadableTextColor(teamColor)
            : "var(--color-text-muted)",

          boxShadow: scoredLastPoint
            ? `0 0 0 2px ${withHexAlpha(teamColor, "33")}`
            : undefined,
        }}
      >
        {points}
      </div>

      <div className="min-w-0">
        <p
          className="truncate text-[10px] font-black text-(--color-text-primary)"
          title={name}
        >
          {name}
        </p>

        <p className="text-[9px] text-(--color-text-muted)">
          <span style={{ color: teamColor }}>●</span> Sets {sets}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PRIMARY POINT ACTIONS
========================================================= */

function ServeActionButton({
  teamName,
  teamColor,
  disabled,
  onClick,
}: {
  teamName: string;
  teamColor: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const foreground = getReadableTextColor(teamColor);

  return (
    <div
      className="shrink-0 rounded-2xl border p-2"
      style={{
        borderColor: withHexAlpha(teamColor, "66"),
        backgroundColor: withHexAlpha(teamColor, "14"),
      }}
    >
      <p className="mb-1.5 truncate px-1 text-center text-xs font-bold text-(--color-text-primary)">
        {teamName} serving
      </p>

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-(family-name:--font-display) text-xl font-black shadow-lg transition-transform",
          !disabled && "active:scale-[0.98]",
          disabled && "cursor-not-allowed opacity-45",
        )}
        style={{ backgroundColor: teamColor, color: foreground }}
      >
        <Volleyball size={22} />
        Serve
      </button>
    </div>
  );
}

function getApiErrorCode(error: unknown) {
  if (!error || typeof error !== "object" || !("data" in error)) return null;
  const data = error.data;
  if (!data || typeof data !== "object" || !("code" in data)) return null;
  return typeof data.code === "string" ? data.code : null;
}

function isScoringStateChangedError(error: unknown) {
  return Boolean(
    error &&
    typeof error === "object" &&
    "status" in error &&
    error.status === 409 &&
    getApiErrorCode(error) === "VOLLEYBALL_SCORING_STATE_CHANGED",
  );
}

function isForbiddenError(error: unknown) {
  return Boolean(
    error &&
    typeof error === "object" &&
    "status" in error &&
    error.status === 403,
  );
}

function PointActionButton({
  teamName,
  currentScore,
  teamColor,
  disabled,
  onClick,
}: {
  teamName: string;

  currentScore: number;

  teamColor: string;

  disabled: boolean;

  onClick: () => void;
}) {
  const foreground = getReadableTextColor(teamColor);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl px-3 py-3 text-left shadow-lg transition-transform",
        !disabled && "active:scale-[0.98]",
        disabled && "cursor-not-allowed opacity-45",
      )}
      style={{ backgroundColor: teamColor, color: foreground }}
    >
      {/* LARGE DECORATIVE BALL */}

      <Volleyball
        size={72}
        strokeWidth={1}
        className="absolute -right-3 -top-3 opacity-15"
      />

      <div className="relative flex items-center gap-2">
        <div
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: withHexAlpha(foreground, "24") }}
        >
          <Volleyball size={23} />

          <span
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-base font-black"
            style={{ backgroundColor: foreground, color: teamColor }}
          >
            +
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-black uppercase tracking-[0.13em] opacity-75">
            Award Point
          </p>

          <p className="mt-0.5 line-clamp-2 font-(family-name:--font-display) text-base leading-tight font-black">
            {teamName}
          </p>
        </div>

        <span className="font-(family-name:--font-display) text-3xl font-black">
          +1
        </span>
      </div>

      <div
        className="relative mt-2 flex items-center justify-between border-t pt-1.5"
        style={{ borderColor: withHexAlpha(foreground, "33") }}
      >
        <span className="text-[9px] opacity-75">Current score</span>

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
  teamColor: string;
};

function VolleyballPointSheet({
  open,
  teamA,
  teamB,
  selectedTeamId,
  players,
  isSubmitting,
  error,
  onChangeTeam,
  onClearError,
  onClose,
  onSubmit,
}: {
  open: boolean;

  teamA: PointTeam;
  teamB: PointTeam;

  selectedTeamId: string | null;

  players: VolleyballMatchRosterPlayer[];

  isSubmitting: boolean;

  error?: string;

  onChangeTeam: (teamId: string) => void;

  onClearError: () => void;

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
              teamColor={selectedTeam.teamColor}
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
              disabled={isSubmitting}
              onClick={() => onChangeTeam(teamA.id)}
            />

            <TeamChoiceCard
              team={teamB}
              selected={selectedTeam.id === teamB.id}
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
                  onClearError();

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
                  onClearError();

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
                  onClearError();

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
                onClearError();

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
                      onClick={() => {
                        onClearError();
                        setPlayerId(player.playerId);
                      }}
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

        <div className="safe-bottom shrink-0 bg-(--color-bg-card) px-4 pb-2 pt-3">
          {error && (
            <div className="mb-2 flex min-w-0 items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-red-700">
              <CircleAlert size={16} className="mt-0.5 shrink-0" />
              <p className="min-w-0 break-words text-xs font-semibold leading-4">
                {error}
              </p>
            </div>
          )}

          <Button
            fullWidth
            loading={isSubmitting}
            disabled={!canSubmit || isSubmitting}
            onClick={() => {
              if (!pointType) {
                return;
              }

              onClearError();

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
  disabled,
  onClick,
}: {
  team: PointTeam;

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
        "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left shadow-sm transition-all",
        !selected && "border-(--color-bg-border) bg-(--color-bg-card)",
      )}
      style={
        selected
          ? {
              borderColor: team.teamColor,
              backgroundColor: withHexAlpha(team.teamColor, "14"),
            }
          : undefined
      }
    >
      <TeamBadge
        imageKey={team.logoUrl ?? null}
        name={team.shortName ?? team.name}
        teamColor={team.teamColor}
      />

      <span className="truncate text-sm font-black text-(--color-text-primary)">
        {team.shortName ?? team.name}
      </span>
    </button>
  );
}

function TeamBadge({
  imageKey,
  name,
  teamColor,
}: {
  imageKey: string | null;

  name: string;

  teamColor: string;
}) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl"
      style={{
        backgroundColor: teamColor,
        color: getReadableTextColor(teamColor),
      }}
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
      {getInitials(name)}
    </span>
  );
}

/* =========================================================
   TOP TEAM IDENTITY
========================================================= */

function TopTeamIdentity({
  imageKey,
  name,
  teamColor,
  right = false,
}: {
  imageKey: string | null;

  name: string;
  teamColor: string;
  right?: boolean;
}) {
  const label = getTeamDisplayLabel(name);

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-1.5",
        right && "flex-row-reverse text-right",
      )}
    >
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-lg"
        style={{
          backgroundColor: teamColor,
          color: getReadableTextColor(teamColor),
        }}
      >
        {imageKey ? (
          <S3Image
            imageKey={imageKey}
            alt={name}
            width={24}
            height={24}
            className="h-full w-full object-cover"
            fallback={<span className="text-[9px] font-black">{label}</span>}
          />
        ) : (
          <span className="text-[9px] font-black">{label}</span>
        )}
      </div>

      <span
        className="min-w-0 truncate font-(family-name:--font-display) text-[10px] font-black text-white min-[380px]:text-xs"
        title={name}
      >
        {name}
      </span>
    </div>
  );
}
