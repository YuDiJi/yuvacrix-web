"use client";

import {
  Check,
  ChevronRight,
  CircleCheck,
  Crown,
  Plus,
  Shield,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/common/Button";
import { S3Image } from "@/components/common/S3Image";

import { cn } from "@/lib/cn";

import {
  useConfirmVolleyballRostersMutation,
  useGetVolleyballMatchQuery,
  useSubmitVolleyballRosterMutation,
} from "@/store/api/volleyball/volleyballMatchApi";

import { useGetVolleyballTeamMembersQuery } from "@/store/api/volleyball/volleyballTeamApi";

import { VOLLEYBALL_MATCH_STATUSES } from "@/types/volleyball/match";

import {
  VOLLEYBALL_POSITIONS,
  type VolleyballTeamMember,
} from "@/types/volleyball/team";

import type {
  SubmitVolleyballRosterDto,
  VolleyballMatchRoster,
} from "@/types/volleyball/roster";

/* =========================================================
   TYPES
========================================================= */

type TeamSide = "TEAM_A" | "TEAM_B";

type TeamRosterState = {
  selectedPlayerIds: string[];

  captainPlayerId: string | null;

  liberoPlayerIds: string[];
};

const EMPTY_ROSTER_STATE: TeamRosterState = {
  selectedPlayerIds: [],

  captainPlayerId: null,

  liberoPlayerIds: [],
};

/* =========================================================
   HELPERS
========================================================= */

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

function createRosterStateFromExistingRoster(
  roster: VolleyballMatchRoster | null,
): TeamRosterState {
  if (!roster) {
    return {
      ...EMPTY_ROSTER_STATE,
    };
  }

  return {
    selectedPlayerIds: roster.players.map((player) => player.playerId),

    captainPlayerId: roster.captainPlayerId,

    liberoPlayerIds: roster.liberoPlayerIds,
  };
}

function extractErrorMessage(error: unknown, fallback: string) {
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

  return fallback;
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

export default function VolleyballRosterPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const router = useRouter();

  const matchId = params.matchId as string;

  const tournamentId = searchParams.get("tournamentId");

  const fixtureId = searchParams.get("fixtureId");

  const [activeSide, setActiveSide] = useState<TeamSide>("TEAM_A");

  const [teamARosterState, setTeamARosterState] = useState<TeamRosterState>({
    ...EMPTY_ROSTER_STATE,
  });

  const [teamBRosterState, setTeamBRosterState] = useState<TeamRosterState>({
    ...EMPTY_ROSTER_STATE,
  });

  const [initialized, setInitialized] = useState(false);

  const [error, setError] = useState("");

  /* =====================================================
     API
  ===================================================== */

  const {
    data: match,
    isLoading: isMatchLoading,
    isError: isMatchError,
  } = useGetVolleyballMatchQuery({
    matchId,
  });

  const {
    data: teamAMembersResponse,
    isLoading: areTeamAMembersLoading,
    isError: isTeamAMembersError,
  } = useGetVolleyballTeamMembersQuery(
    {
      teamId: match?.teamAId ?? "",
    },
    {
      skip: !match?.teamAId,
    },
  );

  const {
    data: teamBMembersResponse,
    isLoading: areTeamBMembersLoading,
    isError: isTeamBMembersError,
  } = useGetVolleyballTeamMembersQuery(
    {
      teamId: match?.teamBId ?? "",
    },
    {
      skip: !match?.teamBId,
    },
  );

  const [submitRoster, { isLoading: isSubmittingRoster }] =
    useSubmitVolleyballRosterMutation();

  const [confirmRosters, { isLoading: isConfirmingRosters }] =
    useConfirmVolleyballRostersMutation();

  const teamAMembers = teamAMembersResponse?.members ?? [];

  const teamBMembers = teamBMembersResponse?.members ?? [];

  /* =====================================================
     INITIALIZE EXISTING ROSTERS
  ===================================================== */

  useEffect(() => {
    if (!match || initialized) {
      return;
    }

    setTeamARosterState(createRosterStateFromExistingRoster(match.teamARoster));

    setTeamBRosterState(createRosterStateFromExistingRoster(match.teamBRoster));

    setInitialized(true);
  }, [match, initialized]);

  /* =====================================================
     DERIVED
  ===================================================== */

  const currentTeam = useMemo(() => {
    if (!match) {
      return null;
    }

    if (activeSide === "TEAM_A") {
      return {
        id: match.teamAId,

        snapshot: match.teamASnapshot,

        members: teamAMembers,

        roster: match.teamARoster,

        tone: "orange" as const,
      };
    }

    return {
      id: match.teamBId,

      snapshot: match.teamBSnapshot,

      members: teamBMembers,

      roster: match.teamBRoster,

      tone: "red" as const,
    };
  }, [activeSide, match, teamAMembers, teamBMembers]);

  const currentRosterState =
    activeSide === "TEAM_A" ? teamARosterState : teamBRosterState;

  const teamASelectedCount = teamARosterState.selectedPlayerIds.length;

  const teamBSelectedCount = teamBRosterState.selectedPlayerIds.length;

  const isRosterLocked =
    match?.status === VOLLEYBALL_MATCH_STATUSES.ROSTER_CONFIRMED;

  /* =====================================================
     STATE HELPER
  ===================================================== */

  function setCurrentRosterState(
    updater: TeamRosterState | ((previous: TeamRosterState) => TeamRosterState),
  ) {
    if (activeSide === "TEAM_A") {
      setTeamARosterState(updater);

      return;
    }

    setTeamBRosterState(updater);
  }

  /* =====================================================
     ADD PLAYER
  ===================================================== */

  function handleAddPlayer() {
    if (!currentTeam) {
      return;
    }

    const returnTo = `/volleyball/matches/${matchId}/rosters`;

    router.push(
      `/volleyball/teams/create/players?teamId=${currentTeam.id}&returnTo=${encodeURIComponent(
        returnTo,
      )}`,
    );
  }

  /* =====================================================
     PLAYER SELECTION
  ===================================================== */

  function handleTogglePlayer(member: VolleyballTeamMember) {
    if (isRosterLocked) {
      return;
    }

    setError("");

    setCurrentRosterState((previous) => {
      const alreadySelected = previous.selectedPlayerIds.includes(
        member.playerId,
      );

      if (alreadySelected) {
        return {
          selectedPlayerIds: previous.selectedPlayerIds.filter(
            (id) => id !== member.playerId,
          ),

          captainPlayerId:
            previous.captainPlayerId === member.playerId
              ? null
              : previous.captainPlayerId,

          liberoPlayerIds: previous.liberoPlayerIds.filter(
            (id) => id !== member.playerId,
          ),
        };
      }

      const nextSelectedPlayerIds = [
        ...previous.selectedPlayerIds,
        member.playerId,
      ];

      let nextLiberoPlayerIds = previous.liberoPlayerIds;

      /*
       * Keep your current smart default:
       * automatically flag natural Liberos,
       * up to the backend max of 2.
       */
      if (
        member.primaryPosition === VOLLEYBALL_POSITIONS.LIBERO &&
        !nextLiberoPlayerIds.includes(member.playerId) &&
        nextLiberoPlayerIds.length < 2
      ) {
        nextLiberoPlayerIds = [...nextLiberoPlayerIds, member.playerId];
      }

      return {
        ...previous,

        selectedPlayerIds: nextSelectedPlayerIds,

        liberoPlayerIds: nextLiberoPlayerIds,
      };
    });
  }

  /* =====================================================
     CAPTAIN
  ===================================================== */

  function handleSelectCaptain(member: VolleyballTeamMember) {
    if (isRosterLocked) {
      return;
    }

    if (!currentRosterState.selectedPlayerIds.includes(member.playerId)) {
      setError("Select this player before assigning captain.");

      return;
    }

    setError("");

    setCurrentRosterState((previous) => ({
      ...previous,

      captainPlayerId:
        previous.captainPlayerId === member.playerId ? null : member.playerId,
    }));
  }

  /* =====================================================
     LIBERO
  ===================================================== */

  function handleToggleLibero(member: VolleyballTeamMember) {
    if (isRosterLocked) {
      return;
    }

    if (!currentRosterState.selectedPlayerIds.includes(member.playerId)) {
      setError("Select this player before assigning Libero.");

      return;
    }

    setError("");

    setCurrentRosterState((previous) => {
      const alreadyLibero = previous.liberoPlayerIds.includes(member.playerId);

      if (alreadyLibero) {
        return {
          ...previous,

          liberoPlayerIds: previous.liberoPlayerIds.filter(
            (id) => id !== member.playerId,
          ),
        };
      }

      if (previous.liberoPlayerIds.length >= 2) {
        setError("A maximum of 2 Libero players is allowed.");

        return previous;
      }

      return {
        ...previous,

        liberoPlayerIds: [...previous.liberoPlayerIds, member.playerId],
      };
    });
  }

  /* =====================================================
     VALIDATION
  ===================================================== */

  function validateRoster() {
    if (currentRosterState.selectedPlayerIds.length < 6) {
      return "Select at least 6 players.";
    }

    if (!currentRosterState.captainPlayerId) {
      return "Select a captain.";
    }

    if (
      !currentRosterState.selectedPlayerIds.includes(
        currentRosterState.captainPlayerId,
      )
    ) {
      return "Captain must be part of the roster.";
    }

    if (currentRosterState.liberoPlayerIds.length > 2) {
      return "A maximum of 2 Libero players is allowed.";
    }

    const invalidLibero = currentRosterState.liberoPlayerIds.some(
      (playerId) => !currentRosterState.selectedPlayerIds.includes(playerId),
    );

    if (invalidLibero) {
      return "Libero players must be part of the roster.";
    }

    return null;
  }

  /* =====================================================
     SUBMIT CURRENT ROSTER
  ===================================================== */

  async function handleSubmitRoster() {
    if (!currentTeam || isRosterLocked) {
      return;
    }

    const validationError = validateRoster();

    if (validationError) {
      setError(validationError);

      return;
    }

    setError("");

    const body: SubmitVolleyballRosterDto = {
      captainPlayerId: currentRosterState.captainPlayerId!,

      players: currentRosterState.selectedPlayerIds.map((playerId) => ({
        playerId,
      })),

      liberoPlayerIds: currentRosterState.liberoPlayerIds,
    };

    try {
      await submitRoster({
        matchId,

        teamId: currentTeam.id,

        body,
      }).unwrap();

      /*
       * Save Team A -> immediately
       * guide scorer to Team B.
       */
      if (activeSide === "TEAM_A") {
        setActiveSide("TEAM_B");
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to submit roster."));
    }
  }

  /* =====================================================
     CONFIRM BOTH
  ===================================================== */

  async function handleConfirmRosters() {
    if (!match) {
      return;
    }

    if (!match.teamARoster || !match.teamBRoster) {
      setError("Submit both team rosters before confirming.");

      return;
    }

    setError("");

    try {
      await confirmRosters({
        matchId,
      }).unwrap();

      if (tournamentId && fixtureId) {
        router.push(
          `/volleyball/matches/${matchId}/sets/setup?tournamentId=${tournamentId}&fixtureId=${fixtureId}`,
        );
      }
      router.push(`/volleyball/matches/${matchId}/sets/setup`);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to confirm rosters."));
    }
  }

  /* =====================================================
     LOADING
  ===================================================== */

  const isLoading =
    isMatchLoading || areTeamAMembersLoading || areTeamBMembersLoading;

  const hasLoadError =
    isMatchError || isTeamAMembersError || isTeamBMembersError;

  if (isLoading) {
    return (
      <div className="min-h-full bg-(--color-bg-base) p-3">
        <div className="space-y-3">
          <div className="h-14 animate-pulse rounded-2xl bg-(--color-bg-card)" />

          <div className="h-16 animate-pulse rounded-2xl bg-(--color-bg-card)" />

          {Array.from({
            length: 7,
          }).map((_, index) => (
            <div
              key={index}
              className="h-[62px] animate-pulse rounded-2xl bg-(--color-bg-card)"
            />
          ))}
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (hasLoadError || !match || !currentTeam) {
    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4">
        <div className="w-full max-w-sm rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <Users size={24} className="mx-auto text-(--color-brand)" />

          <p className="mt-3 text-sm font-black text-(--color-text-primary)">
            Unable to load match roster
          </p>

          <p className="mt-1 text-xs text-(--color-text-muted)">
            Please try again.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER DATA
  ===================================================== */

  const selectedCount = currentRosterState.selectedPlayerIds.length;

  const memberCount = currentTeam.members.length;

  const playersRequired = Math.max(6 - memberCount, 0);

  const currentRosterSubmitted = Boolean(currentTeam.roster);

  const bothRostersSubmitted = Boolean(match.teamARoster && match.teamBRoster);

  const hasCaptain = Boolean(currentRosterState.captainPlayerId);

  const rosterReady = selectedCount >= 6 && hasCaptain;

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      {/* =================================================
          TOP CONTENT
      ================================================= */}

      <div className="flex flex-1 flex-col gap-3 px-3 py-3">
        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="flex items-start justify-between px-1">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-(--color-brand)">
              Match Rosters
            </p>

            <h1 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
              Select Players
            </h1>
          </div>

          <div className="rounded-full bg-(--color-bg-card) px-2.5 py-1.5 text-[9px] font-bold text-(--color-text-muted) shadow-sm">
            Min. 6 players
          </div>
        </div>

        {/* ===============================================
            ERROR
        =============================================== */}

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-(--color-live)/20 bg-white px-3 py-2.5 shadow-sm">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-(--color-live)" />

            <p className="min-w-0 flex-1 text-xs font-semibold text-(--color-live)">
              {error}
            </p>

            <button type="button" onClick={() => setError("")}>
              <X size={14} className="text-(--color-text-muted)" />
            </button>
          </div>
        )}

        {/* ===============================================
            TEAM SWITCHER
        =============================================== */}

        <div className="grid grid-cols-2 gap-2">
          <TeamTab
            name={match.teamASnapshot.shortName ?? match.teamASnapshot.name}
            imageKey={match.teamASnapshot.logoUrl}
            tone="orange"
            active={activeSide === "TEAM_A"}
            selectedCount={teamASelectedCount}
            submitted={Boolean(match.teamARoster)}
            onClick={() => {
              setError("");

              setActiveSide("TEAM_A");
            }}
          />

          <TeamTab
            name={match.teamBSnapshot.shortName ?? match.teamBSnapshot.name}
            imageKey={match.teamBSnapshot.logoUrl}
            tone="red"
            active={activeSide === "TEAM_B"}
            selectedCount={teamBSelectedCount}
            submitted={Boolean(match.teamBRoster)}
            onClick={() => {
              setError("");

              setActiveSide("TEAM_B");
            }}
          />
        </div>

        {/* ===============================================
            TEAM SUMMARY
        =============================================== */}

        <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-3 py-3 shadow-(--shadow-card)">
          <div className="flex items-center gap-3">
            <TeamLogo
              imageKey={currentTeam.snapshot.logoUrl}
              name={currentTeam.snapshot.name}
              tone={currentTeam.tone}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-black text-(--color-text-primary)">
                  {currentTeam.snapshot.name}
                </p>

                {currentRosterSubmitted && (
                  <ShieldCheck size={14} className="shrink-0 text-green-600" />
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[9px] font-semibold text-(--color-text-muted)">
                <span>{selectedCount} selected</span>

                <span>•</span>

                <span>{hasCaptain ? "Captain ✓" : "No Captain"}</span>

                <span>•</span>

                <span>
                  {currentRosterState.liberoPlayerIds.length} Libero
                  {currentRosterState.liberoPlayerIds.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {!isRosterLocked && (
              <button
                type="button"
                onClick={handleAddPlayer}
                className="flex h-9 shrink-0 items-center gap-1 rounded-xl bg-(--color-bg-tint) px-2.5 text-[10px] font-black text-(--color-brand)"
              >
                <Plus size={13} />
                Add
              </button>
            )}
          </div>

          {/* COMPACT PROGRESS */}

          <div className="mt-3 flex items-center gap-1">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  index < selectedCount
                    ? currentTeam.tone === "orange"
                      ? "bg-orange-500"
                      : "bg-red-500"
                    : "bg-(--color-bg-base)",
                )}
              />
            ))}

            {selectedCount > 6 && (
              <span className="ml-1 text-[9px] font-black text-(--color-brand)">
                +{selectedCount - 6}
              </span>
            )}
          </div>
        </div>

        {/* ===============================================
            NOT ENOUGH TEAM MEMBERS
        =============================================== */}

        {memberCount < 6 && (
          <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Users size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-(--color-text-primary)">
                {playersRequired} more player
                {playersRequired !== 1 ? "s" : ""} required
              </p>

              <p className="mt-0.5 text-[9px] text-(--color-text-muted)">
                At least 6 team members are required.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddPlayer}
              className="text-[10px] font-black text-orange-600"
            >
              Add
            </button>
          </div>
        )}

        {/* ===============================================
            PLAYERS HEADER
        =============================================== */}

        <div className="mt-1 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-(--color-brand)" />

            <p className="text-section-label">Team Players</p>
          </div>

          <span className="text-[10px] text-(--color-text-muted)">
            {memberCount} total
          </span>
        </div>

        {/* ===============================================
            PLAYER LIST
        =============================================== */}

        {memberCount === 0 ? (
          <EmptyPlayers onAdd={handleAddPlayer} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
            {currentTeam.members.map((member, index) => {
              const selected = currentRosterState.selectedPlayerIds.includes(
                member.playerId,
              );

              const isCaptain =
                currentRosterState.captainPlayerId === member.playerId;

              const isLibero = currentRosterState.liberoPlayerIds.includes(
                member.playerId,
              );

              return (
                <RosterPlayerRow
                  key={member.playerId}
                  member={member}
                  selected={selected}
                  captain={isCaptain}
                  libero={isLibero}
                  tone={currentTeam.tone}
                  locked={isRosterLocked}
                  last={index === currentTeam.members.length - 1}
                  onTogglePlayer={() => handleTogglePlayer(member)}
                  onCaptain={() => handleSelectCaptain(member)}
                  onLibero={() => handleToggleLibero(member)}
                />
              );
            })}
          </div>
        )}

        {/* ===============================================
            LOCKED MESSAGE
        =============================================== */}

        {isRosterLocked && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5">
            <CircleCheck size={15} className="shrink-0 text-green-600" />

            <p className="text-[10px] font-semibold text-green-700">
              Match rosters are confirmed and locked.
            </p>
          </div>
        )}
      </div>

      {/* =================================================
          BOTTOM ACTION
      ================================================= */}

      {!isRosterLocked && (
        <div className="sticky bottom-0 shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-3 py-3 shadow-[0_-8px_24px_rgba(13,27,62,0.06)]">
          {bothRostersSubmitted ? (
            <div className="space-y-2">
              {/* SHOW CURRENT ROSTER UPDATE ONLY WHEN NEEDED */}

              <Button
                fullWidth
                variant="secondary"
                size="sm"
                loading={isSubmittingRoster}
                disabled={
                  !rosterReady || isSubmittingRoster || isConfirmingRosters
                }
                onClick={handleSubmitRoster}
              >
                Update{" "}
                {getTeamLabel(
                  currentTeam.snapshot.shortName ?? currentTeam.snapshot.name,
                )}{" "}
                Roster
              </Button>

              <Button
                fullWidth
                size="sm"
                loading={isConfirmingRosters}
                disabled={isConfirmingRosters || isSubmittingRoster}
                onClick={handleConfirmRosters}
              >
                Confirm Match Rosters
              </Button>
            </div>
          ) : (
            <Button
              fullWidth
              size="sm"
              loading={isSubmittingRoster}
              disabled={isSubmittingRoster || memberCount < 6 || !rosterReady}
              onClick={handleSubmitRoster}
            >
              {currentRosterSubmitted
                ? `Update ${getTeamLabel(
                    currentTeam.snapshot.shortName ?? currentTeam.snapshot.name,
                  )} Roster`
                : `Save ${getTeamLabel(
                    currentTeam.snapshot.shortName ?? currentTeam.snapshot.name,
                  )} Roster`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TEAM TAB
========================================================= */

function TeamTab({
  name,
  imageKey,
  tone,
  active,
  selectedCount,
  submitted,
  onClick,
}: {
  name: string;

  imageKey: string | null;

  tone: "orange" | "red";

  active: boolean;

  selectedCount: number;

  submitted: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex min-w-0 items-center gap-2 rounded-2xl border p-2.5 text-left transition-all",
        active && tone === "orange" && "border-orange-400 bg-orange-50",
        active && tone === "red" && "border-red-400 bg-red-50",
        !active && "border-(--color-bg-border) bg-(--color-bg-card)",
      )}
    >
      <TeamLogo imageKey={imageKey} name={name} tone={tone} size={34} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-black text-(--color-text-primary)">
          {getTeamLabel(name)}
        </p>

        <p className="mt-0.5 text-[9px] font-semibold text-(--color-text-muted)">
          {selectedCount} selected
        </p>
      </div>

      {submitted && (
        <Check size={12} className="absolute right-2 top-2 text-green-600" />
      )}
    </button>
  );
}

/* =========================================================
   PLAYER ROW
========================================================= */

function RosterPlayerRow({
  member,
  selected,
  captain,
  libero,
  tone,
  locked,
  last,
  onTogglePlayer,
  onCaptain,
  onLibero,
}: {
  member: VolleyballTeamMember;

  selected: boolean;
  captain: boolean;
  libero: boolean;

  tone: "orange" | "red";

  locked: boolean;
  last: boolean;

  onTogglePlayer: () => void;
  onCaptain: () => void;
  onLibero: () => void;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[62px] items-center gap-2.5 px-3 py-2 transition-all",
        !last && "border-b border-(--color-bg-border)",
        selected && tone === "orange" && "bg-orange-50/40",
        selected && tone === "red" && "bg-red-50/40",
      )}
    >
      {/* SELECT */}

      <button
        type="button"
        disabled={locked}
        onClick={onTogglePlayer}
        aria-label={
          selected
            ? `Remove ${member.fullName} from roster`
            : `Add ${member.fullName} to roster`
        }
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          selected && tone === "orange" && "border-orange-500 bg-orange-500",
          selected && tone === "red" && "border-red-500 bg-red-500",
          !selected && "border-(--color-bg-border) bg-(--color-bg-base)",
          locked && "cursor-default",
        )}
      >
        {selected && <Check size={13} className="text-white" />}
      </button>

      {/* AVATAR */}

      <MemberAvatar member={member} />

      {/* DETAILS */}

      <button
        type="button"
        disabled={locked}
        onClick={onTogglePlayer}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate text-xs font-black text-(--color-text-primary)">
            {member.fullName}
          </p>

          {captain && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-100 px-1 text-[7px] font-black text-amber-700">
              C
            </span>
          )}

          {libero && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-bg-tint) px-1 text-[7px] font-black text-(--color-brand)">
              L
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-[9px] text-(--color-text-muted)">
          #{member.jerseyNumber}
          {member.primaryPosition
            ? ` · ${formatPosition(member.primaryPosition)}`
            : ""}
        </p>
      </button>

      {/* ROLE BUTTONS */}

      {/* ROLE BUTTONS */}

      {selected && !locked && (
        <div className="flex shrink-0 items-center gap-1.5">
          <RoleButton
            label="Captain"
            shortLabel="Captain"
            icon={<Crown size={11} />}
            active={captain}
            disabled={false}
            tone="captain"
            onClick={onCaptain}
          />

          <RoleButton
            label="Libero"
            shortLabel="Libero"
            icon={<Shield size={11} />}
            active={libero}
            disabled={false}
            tone="libero"
            onClick={onLibero}
          />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ROLE BUTTON
========================================================= */

function RoleButton({
  label,
  shortLabel,
  icon,
  active,
  disabled,
  tone,
  onClick,
}: {
  label: string;

  shortLabel: string;

  icon: React.ReactNode;

  active: boolean;

  disabled: boolean;

  tone: "captain" | "libero";

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-8 items-center justify-center gap-1 rounded-lg border px-2 text-[9px] font-black transition-all",

        !active &&
          "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary)",

        active &&
          tone === "captain" &&
          "border-amber-300 bg-amber-100 text-amber-700",

        active &&
          tone === "libero" &&
          "border-(--color-brand)/30 bg-(--color-bg-tint) text-(--color-brand)",

        disabled && "cursor-not-allowed opacity-35",
      )}
    >
      {active ? <Check size={10} /> : icon}

      <span>{shortLabel}</span>
    </button>
  );
}

/* =========================================================
   TEAM LOGO
========================================================= */

function TeamLogo({
  imageKey,
  name,
  tone,
  size = 40,
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

function MemberAvatar({ member }: { member: VolleyballTeamMember }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--color-bg-tint)">
      {member.profileImageUrl ? (
        <S3Image
          imageKey={member.profileImageUrl}
          alt={member.fullName}
          width={40}
          height={40}
          className="h-full w-full object-cover"
          fallback={<MemberInitial name={member.fullName} />}
        />
      ) : (
        <MemberInitial name={member.fullName} />
      )}
    </div>
  );
}

function MemberInitial({ name }: { name: string }) {
  return (
    <span className="font-(family-name:--font-display) text-sm font-black text-(--color-brand)">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyPlayers({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) px-5 py-7 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-(--color-bg-tint)">
        <Users size={19} className="text-(--color-brand)" />
      </div>

      <p className="mt-2 text-sm font-black text-(--color-text-primary)">
        No players yet
      </p>

      <p className="mt-1 text-[10px] text-(--color-text-muted)">
        Add at least six players to build the match roster.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 inline-flex items-center gap-1 text-xs font-black text-(--color-brand)"
      >
        <Plus size={13} />
        Add Player
        <ChevronRight size={13} />
      </button>
    </div>
  );
}
