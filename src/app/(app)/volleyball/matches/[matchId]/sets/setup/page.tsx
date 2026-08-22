"use client";

import { type ReactNode, useMemo, useState } from "react";

import {
  Check,
  ChevronRight,
  CircleDot,
  RotateCw,
  Users,
  Volleyball,
  X,
} from "lucide-react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { S3Image } from "@/components/common/S3Image";

import { cn } from "@/lib/cn";

import {
  useGetVolleyballMatchQuery,
  useStartNextVolleyballSetMutation,
  useStartVolleyballSetMutation,
} from "@/store/api/volleyball/volleyballMatchApi";

import type {
  StartVolleyballSetDto,
  VolleyballCourtPosition,
  VolleyballRotationPosition,
  VolleyballSet,
} from "@/types/volleyball/set";

import type {
  VolleyballMatchRoster,
  VolleyballMatchRosterPlayer,
} from "@/types/volleyball/roster";

/* =========================================================
   TYPES
========================================================= */

type TeamSide = "TEAM_A" | "TEAM_B";

type RotationState = Partial<Record<VolleyballCourtPosition, string>>;

type LineupSheetState = {
  open: boolean;
  side: TeamSide;
  position: VolleyballCourtPosition | null;
};

/* =========================================================
   HELPERS
========================================================= */

function buildRotationPayload(
  rotation: RotationState,
): VolleyballRotationPosition[] {
  return ([1, 2, 3, 4, 5, 6] as VolleyballCourtPosition[]).map((position) => ({
    position,
    playerId: rotation[position]!,
  }));
}

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

  return "Failed to start volleyball set.";
}

function getPlayer(roster: VolleyballMatchRoster, playerId?: string | null) {
  if (!playerId) {
    return null;
  }

  return roster.players.find((player) => player.playerId === playerId) ?? null;
}

function getPlayerForPosition(
  roster: VolleyballMatchRoster,
  rotation: RotationState,
  position: VolleyballCourtPosition,
) {
  return getPlayer(roster, rotation[position]);
}

function getTeamLabel(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
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

function formatPosition(position?: string | null) {
  if (!position) {
    return "";
  }

  return position
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/* =========================================================
   PAGE
========================================================= */

export default function VolleyballSetSetupPage() {
  const params = useParams();

  const router = useRouter();

  const searchParams = useSearchParams();

  const matchId = params.matchId as string;
  const tournamentId = searchParams.get("tournamentId");

  const fixtureId = searchParams.get("fixtureId");

  /*
   * SET 1:
   * /sets/setup
   *
   * SET 2+:
   * /sets/setup?setNumber=2
   */

  const rawSetNumber = Number(searchParams.get("setNumber"));

  const setNumber =
    Number.isInteger(rawSetNumber) && rawSetNumber > 1 ? rawSetNumber : 1;

  const isFirstSet = setNumber === 1;

  /* =========================
     STATE
  ========================= */

  const [initialServingTeamId, setInitialServingTeamId] = useState<
    string | null
  >(null);

  const [teamARotation, setTeamARotation] = useState<RotationState>({});

  const [teamBRotation, setTeamBRotation] = useState<RotationState>({});

  const [lineupSheet, setLineupSheet] = useState<LineupSheetState>({
    open: false,
    side: "TEAM_A",
    position: null,
  });

  const [error, setError] = useState("");

  /* =========================
     API
  ========================= */

  const {
    data: match,
    isLoading: isMatchLoading,
    isError: isMatchError,
  } = useGetVolleyballMatchQuery({
    matchId,
  });

  const [startFirstSet, { isLoading: isStartingFirstSet }] =
    useStartVolleyballSetMutation();

  const [startNextSet, { isLoading: isStartingNextSet }] =
    useStartNextVolleyballSetMutation();

  const isStartingSet = isStartingFirstSet || isStartingNextSet;

  /* =========================
     DERIVED
  ========================= */

  const teamAAssignedCount =
    Object.values(teamARotation).filter(Boolean).length;

  const teamBAssignedCount =
    Object.values(teamBRotation).filter(Boolean).length;

  const setupComplete =
    teamAAssignedCount === 6 &&
    teamBAssignedCount === 6 &&
    Boolean(initialServingTeamId);

  const sheetRoster = useMemo(() => {
    if (!match) {
      return null;
    }

    return lineupSheet.side === "TEAM_A"
      ? match.teamARoster
      : match.teamBRoster;
  }, [lineupSheet.side, match]);

  const sheetRotation =
    lineupSheet.side === "TEAM_A" ? teamARotation : teamBRotation;

  const sheetTeamSnapshot = match
    ? lineupSheet.side === "TEAM_A"
      ? match.teamASnapshot
      : match.teamBSnapshot
    : null;

  /* =========================
     ROTATION HELPERS
  ========================= */

  function updateRotation(
    side: TeamSide,
    updater: RotationState | ((previous: RotationState) => RotationState),
  ) {
    if (side === "TEAM_A") {
      setTeamARotation(updater);

      return;
    }

    setTeamBRotation(updater);
  }

  function openLineup(
    side: TeamSide,
    position: VolleyballCourtPosition | null = null,
  ) {
    setError("");

    setLineupSheet({
      open: true,
      side,
      position,
    });
  }

  function closeLineup() {
    setLineupSheet((previous) => ({
      ...previous,
      open: false,
      position: null,
    }));
  }

  function selectPosition(position: VolleyballCourtPosition) {
    setLineupSheet((previous) => ({
      ...previous,
      position,
    }));
  }

  function assignPlayer(player: VolleyballMatchRosterPlayer) {
    const position = lineupSheet.position;

    if (!position) {
      return;
    }

    updateRotation(lineupSheet.side, (previous) => {
      const next = {
        ...previous,
      };

      /*
       * A player can only occupy
       * one court position.
       */
      for (const key of Object.keys(next)) {
        const courtPosition = Number(key) as VolleyballCourtPosition;

        if (next[courtPosition] === player.playerId) {
          delete next[courtPosition];
        }
      }

      next[position] = player.playerId;

      return next;
    });

    /*
     * Move automatically to the
     * next unfilled position.
     */
    const courtOrder: VolleyballCourtPosition[] = [4, 3, 2, 5, 6, 1];

    const currentIndex = courtOrder.indexOf(position);

    const nextPosition = courtOrder.find(
      (courtPosition, index) =>
        index > currentIndex && !sheetRotation[courtPosition],
    );

    if (nextPosition) {
      setLineupSheet((previous) => ({
        ...previous,
        position: nextPosition,
      }));
    }
  }

  function clearPosition(side: TeamSide, position: VolleyballCourtPosition) {
    updateRotation(side, (previous) => {
      const next = {
        ...previous,
      };

      delete next[position];

      return next;
    });
  }

  /* =========================
     VALIDATE
  ========================= */

  function validateSetup() {
    if (!match) {
      return "Match not found.";
    }

    if (!match.teamARoster) {
      return "Team A roster is missing.";
    }

    if (!match.teamBRoster) {
      return "Team B roster is missing.";
    }

    if (teamAAssignedCount !== 6) {
      return "Assign all 6 court positions for Team A.";
    }

    if (teamBAssignedCount !== 6) {
      return "Assign all 6 court positions for Team B.";
    }

    if (!initialServingTeamId) {
      return "Select the team serving first.";
    }

    return null;
  }

  /* =========================
     START SET
  ========================= */

  async function handleStartSet() {
    if (!match || isStartingSet) {
      return;
    }

    const validationError = validateSetup();

    if (validationError) {
      setError(validationError);

      return;
    }

    setError("");

    const body: StartVolleyballSetDto = {
      initialServingTeamId: initialServingTeamId!,

      teamA: {
        positions: buildRotationPayload(teamARotation),
      },

      teamB: {
        positions: buildRotationPayload(teamBRotation),
      },
    };

    try {
      let startedSet: VolleyballSet;

      if (isFirstSet) {
        startedSet = await startFirstSet({
          matchId,
          body,
        }).unwrap();
      } else {
        startedSet = await startNextSet({
          matchId,
          setNumber,
          body,
        }).unwrap();
      }

      if (tournamentId && fixtureId) {
        router.replace(
          `/volleyball/matches/${matchId}/scoring?setId=${startedSet.id}&tournamentId=${tournamentId}&fixtureId=${fixtureId}`,
        );
      }
      router.replace(
        `/volleyball/matches/${matchId}/scoring?setId=${startedSet.id}`,
      );
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  /* =========================
     LOADING
  ========================= */

  if (isMatchLoading) {
    return (
      <div className="flex min-h-full flex-col gap-3 bg-(--color-bg-base) p-3">
        <div className="h-14 animate-pulse rounded-2xl bg-(--color-bg-card)" />

        <div className="aspect-[2.1/1] animate-pulse rounded-3xl bg-(--color-bg-card)" />

        <div className="h-20 animate-pulse rounded-2xl bg-(--color-bg-card)" />

        <div className="grid grid-cols-2 gap-2">
          <div className="h-16 animate-pulse rounded-2xl bg-(--color-bg-card)" />
          <div className="h-16 animate-pulse rounded-2xl bg-(--color-bg-card)" />
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (isMatchError || !match || !match.teamARoster || !match.teamBRoster) {
    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4">
        <div className="w-full max-w-sm rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <p className="text-sm font-bold text-(--color-text-primary)">
            Unable to setup set
          </p>

          <p className="mt-1 text-xs text-(--color-text-muted)">
            Confirm both team rosters first.
          </p>
        </div>
      </div>
    );
  }

  const teamARoster = match.teamARoster;

  const teamBRoster = match.teamBRoster;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      {/* ERROR */}

      {error && (
        <div className="mx-3 mt-3 flex items-start gap-2 rounded-2xl border border-(--color-live)/20 bg-white px-3 py-2 shadow-md">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-(--color-live)" />

          <p className="min-w-0 flex-1 text-xs font-semibold text-(--color-live)">
            {error}
          </p>

          <button type="button" onClick={() => setError("")}>
            <X size={14} className="text-(--color-text-muted)" />
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 px-3 py-3">
        {/* =================================
            HEADER
        ================================= */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--color-brand)">
              Set {setNumber}
            </p>

            <h1 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
              Starting Lineup
            </h1>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-(--color-bg-card) px-3 py-1.5 text-[10px] font-bold text-(--color-text-muted) shadow-sm">
            <RotateCw size={12} className="text-(--color-brand)" />
            Rotation
          </div>
        </div>

        {/* =================================
            FULL COURT
        ================================= */}

        <SetupVolleyballCourt
          teamARoster={teamARoster}
          teamBRoster={teamBRoster}
          teamARotation={teamARotation}
          teamBRotation={teamBRotation}
          teamAName={match.teamASnapshot.shortName ?? match.teamASnapshot.name}
          teamBName={match.teamBSnapshot.shortName ?? match.teamBSnapshot.name}
          servingTeamId={initialServingTeamId}
          teamAId={match.teamAId}
          teamBId={match.teamBId}
          onPositionClick={(side, position) => openLineup(side, position)}
        />

        {/* =================================
            LINEUP STATUS
        ================================= */}

        <div className="grid grid-cols-2 gap-2">
          <LineupTeamCard
            name={match.teamASnapshot.name}
            logoUrl={match.teamASnapshot.logoUrl}
            count={teamAAssignedCount}
            tone="orange"
            onClick={() => openLineup("TEAM_A")}
          />

          <LineupTeamCard
            name={match.teamBSnapshot.name}
            logoUrl={match.teamBSnapshot.logoUrl}
            count={teamBAssignedCount}
            tone="red"
            onClick={() => openLineup("TEAM_B")}
          />
        </div>

        {/* =================================
            FIRST SERVE
        ================================= */}

        <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-(--shadow-card)">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-section-label">Serving First</p>

              <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
                Position 1 becomes the first server.
              </p>
            </div>

            <Volleyball size={18} className="text-(--color-brand)" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ServingTeamButton
              name={match.teamASnapshot.name}
              logoUrl={match.teamASnapshot.logoUrl}
              tone="orange"
              selected={initialServingTeamId === match.teamAId}
              disabled={isStartingSet}
              onClick={() => {
                setError("");

                setInitialServingTeamId(match.teamAId);
              }}
            />

            <ServingTeamButton
              name={match.teamBSnapshot.name}
              logoUrl={match.teamBSnapshot.logoUrl}
              tone="red"
              selected={initialServingTeamId === match.teamBId}
              disabled={isStartingSet}
              onClick={() => {
                setError("");

                setInitialServingTeamId(match.teamBId);
              }}
            />
          </div>
        </div>

        {/* =================================
            READY STATUS
        ================================= */}

        <div
          className={cn(
            "flex items-center justify-between rounded-2xl border px-3 py-2.5",
            setupComplete
              ? "border-green-200 bg-green-50"
              : "border-(--color-bg-border) bg-(--color-bg-card)",
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                setupComplete
                  ? "bg-green-100 text-green-600"
                  : "bg-(--color-bg-tint) text-(--color-brand)",
              )}
            >
              {setupComplete ? <Check size={16} /> : <Users size={15} />}
            </div>

            <div>
              <p className="text-xs font-bold text-(--color-text-primary)">
                {setupComplete ? `Set ${setNumber} ready` : "Complete lineup"}
              </p>

              <p className="text-[9px] text-(--color-text-muted)">
                {teamAAssignedCount}/6
                {" · "}
                {teamBAssignedCount}/6
                {" · "}
                {initialServingTeamId ? "Serve selected" : "Select serve"}
              </p>
            </div>
          </div>

          {setupComplete && <CircleDot size={13} className="text-green-600" />}
        </div>
      </div>

      {/* =================================
          FIXED START CTA
      ================================= */}

      <div className="sticky bottom-0 shrink-0 bg-(--color-bg-card) px-3 py-3 shadow-[0_-8px_24px_rgba(13,27,62,0.06)]">
        <Button
          fullWidth
          size="sm"
          loading={isStartingSet}
          disabled={!setupComplete || isStartingSet}
          onClick={handleStartSet}
        >
          Start Set {setNumber}
        </Button>
      </div>

      {/* =================================
          LINEUP SHEET
      ================================= */}

      {sheetRoster && sheetTeamSnapshot && (
        <LineupSelectionSheet
          open={lineupSheet.open}
          side={lineupSheet.side}
          roster={sheetRoster}
          rotation={sheetRotation}
          selectedPosition={lineupSheet.position}
          teamName={sheetTeamSnapshot.name}
          logoUrl={sheetTeamSnapshot.logoUrl}
          tone={lineupSheet.side === "TEAM_A" ? "orange" : "red"}
          disabled={isStartingSet}
          onClose={closeLineup}
          onSelectPosition={selectPosition}
          onSelectPlayer={assignPlayer}
          onClearPosition={(position) =>
            clearPosition(lineupSheet.side, position)
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   SETUP COURT
========================================================= */

function SetupVolleyballCourt({
  teamARoster,
  teamBRoster,
  teamARotation,
  teamBRotation,
  teamAName,
  teamBName,
  teamAId,
  teamBId,
  servingTeamId,
  onPositionClick,
}: {
  teamARoster: VolleyballMatchRoster;

  teamBRoster: VolleyballMatchRoster;

  teamARotation: RotationState;

  teamBRotation: RotationState;

  teamAName: string;

  teamBName: string;

  teamAId: string;

  teamBId: string;

  servingTeamId: string | null;

  onPositionClick: (side: TeamSide, position: VolleyballCourtPosition) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-(--color-navy) p-2.5 shadow-(--shadow-card)">
      {/* HEADER */}

      <div className="mb-1.5 flex items-center justify-between px-1">
        <CourtTeamName
          name={teamAName}
          side="A"
          serving={servingTeamId === teamAId}
        />

        <CourtTeamName
          name={teamBName}
          side="B"
          serving={servingTeamId === teamBId}
        />
      </div>

      {/* COURT */}

      <div className="relative aspect-[2.2/1] overflow-hidden rounded-xl border-[3px] border-white bg-[#3479c7]">
        <div className="absolute inset-[6%] border-2 border-white/95 bg-[#edc990]" />

        <div className="absolute bottom-[6%] left-1/2 top-[6%] z-10 w-[3px] -translate-x-1/2 bg-white" />

        <div className="absolute bottom-[6%] left-[34%] top-[6%] z-10 w-[2px] bg-white/90" />

        <div className="absolute bottom-[6%] right-[34%] top-[6%] z-10 w-[2px] bg-white/90" />

        {/* TEAM A HALF */}

        <div className="absolute inset-y-[6%] left-[6%] right-1/2">
          <SetupCourtHalf
            side="TEAM_A"
            roster={teamARoster}
            rotation={teamARotation}
            onPositionClick={onPositionClick}
          />
        </div>

        {/* TEAM B HALF */}

        <div className="absolute inset-y-[6%] left-1/2 right-[6%]">
          <SetupCourtHalf
            side="TEAM_B"
            roster={teamBRoster}
            rotation={teamBRotation}
            onPositionClick={onPositionClick}
          />
        </div>

        {/* SERVE BALL */}

        {servingTeamId && (
          <div
            className={cn(
              "absolute top-1.5 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300",
              servingTeamId === teamAId ? "left-1.5" : "right-1.5",
            )}
          >
            <Volleyball size={19} className="text-[#526171]" />
          </div>
        )}
      </div>

      <p className="mt-1.5 text-center text-[9px] font-semibold text-white/55">
        Tap a court position to assign or replace a player
      </p>
    </div>
  );
}

function SetupCourtHalf({
  side,
  roster,
  rotation,
  onPositionClick,
}: {
  side: TeamSide;

  roster: VolleyballMatchRoster;

  rotation: RotationState;

  onPositionClick: (side: TeamSide, position: VolleyballCourtPosition) => void;
}) {
  const markerSide = side === "TEAM_A" ? "A" : "B";

  const positions: {
    position: VolleyballCourtPosition;
    left: string;
    top: string;
  }[] =
    markerSide === "A"
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
      {positions.map(({ position, left, top }) => {
        const player = getPlayerForPosition(roster, rotation, position);

        return (
          <button
            key={`${side}-${position}`}
            type="button"
            onClick={() => onPositionClick(side, position)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left,
              top,
            }}
          >
            <div
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-full shadow-[0_5px_12px_rgba(0,0,0,0.18)] min-[380px]:h-11 min-[380px]:w-11",
                player
                  ? markerSide === "A"
                    ? "bg-[linear-gradient(145deg,#fbbf24,#f59e0b)]"
                    : "bg-[linear-gradient(145deg,#fb5746,#ef3025)]"
                  : "border-2 border-dashed border-white/80 bg-white/25",
              )}
            >
              {player ? (
                <span className="font-(family-name:--font-display) text-lg font-black text-white">
                  {player.jerseyNumberSnapshot}
                </span>
              ) : (
                <span className="font-(family-name:--font-display) text-[10px] font-black text-white">
                  P{position}
                </span>
              )}

              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-navy) px-1 text-[7px] font-bold text-white">
                {position}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CourtTeamName({
  name,
  side,
  serving,
}: {
  name: string;

  side: "A" | "B";

  serving: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {side === "A" && (
        <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
      )}

      <span className="font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.12em] text-white">
        {getTeamLabel(name)}
      </span>

      {serving && <CircleDot size={9} className="text-white" />}

      {side === "B" && (
        <span className="h-2.5 w-2.5 rounded-full bg-[#ef3b2d]" />
      )}
    </div>
  );
}

/* =========================================================
   TEAM LINEUP SUMMARY
========================================================= */

function LineupTeamCard({
  name,
  logoUrl,
  count,
  tone,
  onClick,
}: {
  name: string;

  logoUrl: string | null;

  count: number;

  tone: "orange" | "red";

  onClick: () => void;
}) {
  const complete = count === 6;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 items-center gap-2 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 text-left shadow-(--shadow-card)"
    >
      <TeamBadge imageKey={logoUrl} name={name} tone={tone} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-black text-(--color-text-primary)">
          {getTeamLabel(name)}
        </p>

        <div className="mt-0.5 flex items-center gap-1">
          <span
            className={cn(
              "text-[10px] font-bold",
              complete ? "text-green-600" : "text-(--color-text-muted)",
            )}
          >
            {count}/6
          </span>

          {complete && <Check size={10} className="text-green-600" />}
        </div>
      </div>

      <ChevronRight size={16} className="shrink-0 text-(--color-text-muted)" />
    </button>
  );
}

/* =========================================================
   SERVING TEAM
========================================================= */

function ServingTeamButton({
  name,
  logoUrl,
  tone,
  selected,
  disabled,
  onClick,
}: {
  name: string;

  logoUrl: string | null;

  tone: "orange" | "red";

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
        "relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all",
        selected
          ? tone === "orange"
            ? "border-orange-400 bg-orange-50"
            : "border-red-400 bg-red-50"
          : "border-(--color-bg-border) bg-(--color-bg-base)",
        disabled && "opacity-50",
      )}
    >
      <TeamBadge imageKey={logoUrl} name={name} tone={tone} size={32} />

      <div className="min-w-0">
        <p className="truncate text-xs font-black text-(--color-text-primary)">
          {getTeamLabel(name)}
        </p>

        <p className="text-[9px] text-(--color-text-muted)">
          {selected ? "Serving" : "Select"}
        </p>
      </div>

      {selected && (
        <span
          className={cn(
            "absolute right-2 top-2 h-2 w-2 rounded-full",
            tone === "orange" ? "bg-orange-500" : "bg-red-500",
          )}
        />
      )}
    </button>
  );
}

/* =========================================================
   LINEUP SELECTION SHEET
========================================================= */

function LineupSelectionSheet({
  open,
  side,
  roster,
  rotation,
  selectedPosition,
  teamName,
  logoUrl,
  tone,
  disabled,
  onClose,
  onSelectPosition,
  onSelectPlayer,
  onClearPosition,
}: {
  open: boolean;

  side: TeamSide;

  roster: VolleyballMatchRoster;

  rotation: RotationState;

  selectedPosition: VolleyballCourtPosition | null;

  teamName: string;

  logoUrl: string | null;

  tone: "orange" | "red";

  disabled: boolean;

  onClose: () => void;

  onSelectPosition: (position: VolleyballCourtPosition) => void;

  onSelectPlayer: (player: VolleyballMatchRosterPlayer) => void;

  onClearPosition: (position: VolleyballCourtPosition) => void;
}) {
  const assignedIds = Object.values(rotation).filter(
    (playerId): playerId is string => Boolean(playerId),
  );

  const selectedPlayerId = selectedPosition
    ? rotation[selectedPosition]
    : undefined;

  const availablePlayers = roster.players.filter(
    (player) =>
      !assignedIds.includes(player.playerId) ||
      player.playerId === selectedPlayerId,
  );

  const positionOrder: VolleyballCourtPosition[] = [4, 3, 2, 5, 6, 1];

  return (
    <DialogBottom
      open={open}
      onClose={onClose}
      className="h-[84dvh] max-h-[84dvh] overflow-hidden rounded-t-3xl bg-(--color-bg-card)"
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* HEADER */}

        <div className="flex shrink-0 items-center justify-between border-b border-(--color-bg-border) px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <TeamBadge
              imageKey={logoUrl}
              name={teamName}
              tone={tone}
              size={40}
            />

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--color-text-muted)">
                Starting lineup
              </p>

              <h2 className="truncate text-lg font-black text-(--color-text-primary)">
                {teamName}
              </h2>
            </div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary)"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}

        <div className="min-h-0 flex-1 overflow-y-auto bg-(--color-bg-base) px-4 py-3 scrollbar-hide">
          {/* POSITIONS */}

          <div>
            <div className="flex items-center justify-between">
              <p className="text-section-label">Court Positions</p>

              <span className="text-[10px] text-(--color-text-muted)">
                {assignedIds.length}
                /6 assigned
              </span>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {positionOrder.map((position) => {
                const player = getPlayerForPosition(roster, rotation, position);

                const selected = selectedPosition === position;

                return (
                  <button
                    key={position}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectPosition(position)}
                    className={cn(
                      "relative rounded-2xl border p-2.5 text-center transition-all",
                      selected
                        ? tone === "orange"
                          ? "border-orange-400 bg-orange-50 ring-2 ring-orange-100"
                          : "border-red-400 bg-red-50 ring-2 ring-red-100"
                        : "border-(--color-bg-border) bg-(--color-bg-card)",
                    )}
                  >
                    <span
                      className={cn(
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full font-(family-name:--font-display) text-sm font-black text-white",
                        tone === "orange" ? "bg-orange-500" : "bg-red-500",
                      )}
                    >
                      {player?.jerseyNumberSnapshot ?? position}
                    </span>

                    <p className="mt-1 text-[9px] font-black uppercase text-(--color-text-muted)">
                      Position {position}
                    </p>

                    {player && (
                      <p className="mt-0.5 truncate text-[9px] font-semibold text-(--color-text-primary)">
                        {player.playerNameSnapshot}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PLAYER PICKER */}

          <div className="mt-5">
            {selectedPosition ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-section-label">Select Player</p>

                    <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
                      Position {selectedPosition}
                    </p>
                  </div>

                  {rotation[selectedPosition] && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onClearPosition(selectedPosition)}
                      className="text-[10px] font-bold text-(--color-live)"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  {availablePlayers.map((player) => {
                    const selected =
                      player.playerId === rotation[selectedPosition];

                    return (
                      <button
                        key={player.playerId}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSelectPlayer(player)}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border bg-(--color-bg-card) p-2.5 text-left shadow-(--shadow-card)",
                          selected
                            ? tone === "orange"
                              ? "border-orange-400 bg-orange-50"
                              : "border-red-400 bg-red-50"
                            : "border-(--color-bg-border)",
                        )}
                      >
                        <PlayerAvatar player={player} size={42} />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-bold text-(--color-text-primary)">
                              {player.playerNameSnapshot}
                            </p>

                            {player.isCaptain && (
                              <span className="rounded-full bg-(--color-bg-tint) px-1.5 py-0.5 text-[8px] font-black text-(--color-brand)">
                                C
                              </span>
                            )}

                            {player.isLibero && (
                              <span className="rounded-full bg-(--color-bg-tint) px-1.5 py-0.5 text-[8px] font-black text-(--color-brand)">
                                L
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
                            #{player.jerseyNumberSnapshot}
                            {" · "}
                            {formatPosition(player.positionSnapshot)}
                          </p>
                        </div>

                        {selected ? (
                          <div
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white",
                              tone === "orange"
                                ? "bg-orange-500"
                                : "bg-red-500",
                            )}
                          >
                            <Check size={13} />
                          </div>
                        ) : (
                          <ChevronRight
                            size={16}
                            className="text-(--color-text-muted)"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) px-4 py-6 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-(--color-bg-tint)">
                  <Users size={18} className="text-(--color-brand)" />
                </div>

                <p className="mt-2 text-sm font-bold text-(--color-text-primary)">
                  Choose a court position
                </p>

                <p className="mt-1 text-xs text-(--color-text-muted)">
                  Then select the player for that position.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* DONE */}

        <div className="safe-bottom shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3">
          <Button fullWidth disabled={disabled} onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </DialogBottom>
  );
}

/* =========================================================
   TEAM BADGE
========================================================= */

function TeamBadge({
  imageKey,
  name,
  tone,
  size = 36,
}: {
  imageKey: string | null;

  name: string;

  tone: "orange" | "red";

  size?: number;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl text-white",
        tone === "orange" ? "bg-orange-500" : "bg-red-500",
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      {imageKey ? (
        <S3Image
          imageKey={imageKey}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          fallback={
            <span className="font-(family-name:--font-display) text-sm font-black">
              {getTeamLabel(name)}
            </span>
          }
        />
      ) : (
        <span className="font-(family-name:--font-display) text-sm font-black">
          {getTeamLabel(name)}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   PLAYER AVATAR
========================================================= */

function PlayerAvatar({
  player,
  size = 40,
}: {
  player: VolleyballMatchRosterPlayer;

  size?: number;
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
