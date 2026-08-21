"use client";

import {
  ArrowDown,
  ArrowRightLeft,
  ArrowUp,
  Check,
  CircleDot,
  Users,
  X,
} from "lucide-react";

import { ReactNode, useMemo, useState } from "react";

import { DialogBottom } from "@/components/common/DialogBottom";
import { Button } from "@/components/common/Button";
import { S3Image } from "@/components/common/S3Image";

import { cn } from "@/lib/cn";

import { useRecordVolleyballSubstitutionMutation } from "@/store/api/volleyball/volleyballMatchApi";

import type { VolleyballMatch } from "@/types/volleyball/match";

import type {
  VolleyballMatchRoster,
  VolleyballMatchRosterPlayer,
} from "@/types/volleyball/roster";

import type {
  VolleyballRotationPosition,
  VolleyballSet,
} from "@/types/volleyball/set";

type TeamSide = "TEAM_A" | "TEAM_B";

type VolleyballSubstitutionSheetProps = {
  open: boolean;
  match: VolleyballMatch;
  liveSet: VolleyballSet;
  onClose: () => void;
  onSuccess: (set: VolleyballSet) => void;
};

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

function getCourtPosition(
  rotation: VolleyballRotationPosition[],
  playerId: string,
) {
  return rotation.find((slot) => slot.playerId === playerId)?.position ?? null;
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

  return "Unable to record substitution.";
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

export function VolleyballSubstitutionSheet({
  open,
  match,
  liveSet,
  onClose,
  onSuccess,
}: VolleyballSubstitutionSheetProps) {
  const [selectedSide, setSelectedSide] = useState<TeamSide | null>(null);

  const [outgoingPlayerId, setOutgoingPlayerId] = useState<string | null>(null);

  const [incomingPlayerId, setIncomingPlayerId] = useState<string | null>(null);

  const [error, setError] = useState("");

  const [recordSubstitution, { isLoading: isSubmitting }] =
    useRecordVolleyballSubstitutionMutation();

  const selectedTeam = useMemo(() => {
    if (!selectedSide) {
      return null;
    }

    if (selectedSide === "TEAM_A") {
      return {
        id: match.teamAId,

        name: match.teamASnapshot.name,

        shortName: match.teamASnapshot.shortName,

        logoUrl: match.teamASnapshot.logoUrl,

        roster: match.teamARoster,

        rotation: liveSet.teamACurrentRotation,

        tone: "orange" as const,
      };
    }

    return {
      id: match.teamBId,

      name: match.teamBSnapshot.name,

      shortName: match.teamBSnapshot.shortName,

      logoUrl: match.teamBSnapshot.logoUrl,

      roster: match.teamBRoster,

      rotation: liveSet.teamBCurrentRotation,

      tone: "red" as const,
    };
  }, [selectedSide, match, liveSet]);

  const eligiblePlayers = useMemo(() => {
    if (!selectedTeam || !selectedTeam.roster) {
      return {
        outgoing: [],
        incoming: [],
      };
    }

    const onCourtIds = new Set(
      selectedTeam.rotation.map((slot) => slot.playerId),
    );

    const outgoing = selectedTeam.roster.players.filter(
      (player) => onCourtIds.has(player.playerId) && !player.isLibero,
    );

    const incoming = selectedTeam.roster.players.filter(
      (player) => !onCourtIds.has(player.playerId) && !player.isLibero,
    );

    return {
      outgoing,
      incoming,
    };
  }, [selectedTeam]);

  const outgoingPlayer =
    selectedTeam?.roster?.players.find(
      (player) => player.playerId === outgoingPlayerId,
    ) ?? null;

  const incomingPlayer =
    selectedTeam?.roster?.players.find(
      (player) => player.playerId === incomingPlayerId,
    ) ?? null;

  const outgoingPosition =
    outgoingPlayer && selectedTeam
      ? getCourtPosition(selectedTeam.rotation, outgoingPlayer.playerId)
      : null;

  function reset() {
    setSelectedSide(null);
    setOutgoingPlayerId(null);
    setIncomingPlayerId(null);
    setError("");
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    reset();

    onClose();
  }

  function handleSelectTeam(side: TeamSide) {
    setSelectedSide(side);

    setOutgoingPlayerId(null);

    setIncomingPlayerId(null);

    setError("");
  }

  function selectOutgoing(player: VolleyballMatchRosterPlayer) {
    setOutgoingPlayerId(player.playerId);

    setIncomingPlayerId(null);

    setError("");
  }

  async function handleSubmit() {
    if (!selectedTeam || !outgoingPlayerId || !incomingPlayerId) {
      return;
    }

    setError("");

    try {
      const response = await recordSubstitution({
        matchId: match.id,

        setId: liveSet.id,

        body: {
          clientEventId: crypto.randomUUID(),

          expectedVersion: liveSet.version,

          teamId: selectedTeam.id,

          outgoingPlayerId,

          incomingPlayerId,
        },
      }).unwrap();

      /*
       * Backend remains authoritative.
       */
      onSuccess(response.set);

      reset();

      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <DialogBottom
      open={open}
      onClose={handleClose}
      className="h-[84dvh] max-h-[84dvh] overflow-hidden rounded-t-3xl bg-(--color-bg-card)"
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* =========================
            HEADER
        ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-bg-tint) text-(--color-brand)">
              <ArrowRightLeft size={20} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--color-text-muted)">
                Player Change
              </p>

              <h2 className="text-lg font-black text-(--color-text-primary)">
                Substitution
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary)"
          >
            <X size={18} />
          </button>
        </div>

        {/* =========================
            BODY
        ========================= */}

        <div className="min-h-0 flex-1 overflow-y-auto bg-(--color-bg-base) px-4 py-3 scrollbar-hide">
          {/* TEAM */}

          <div>
            <p className="text-section-label">Select Team</p>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <TeamChoice
                name={match.teamASnapshot.name}
                shortName={match.teamASnapshot.shortName}
                logoUrl={match.teamASnapshot.logoUrl}
                tone="orange"
                selected={selectedSide === "TEAM_A"}
                disabled={isSubmitting}
                onClick={() => handleSelectTeam("TEAM_A")}
              />

              <TeamChoice
                name={match.teamBSnapshot.name}
                shortName={match.teamBSnapshot.shortName}
                logoUrl={match.teamBSnapshot.logoUrl}
                tone="red"
                selected={selectedSide === "TEAM_B"}
                disabled={isSubmitting}
                onClick={() => handleSelectTeam("TEAM_B")}
              />
            </div>
          </div>

          {/* NO TEAM */}

          {!selectedTeam && (
            <EmptyStep
              icon={<Users size={18} />}
              title="Choose a team"
              description="Then select the player leaving the court."
            />
          )}

          {selectedTeam && (
            <>
              {/* =====================
                  PLAYER OUT
              ===================== */}

              <div className="mt-4">
                <StepHeading
                  step="1"
                  icon={<ArrowDown size={14} />}
                  tone="red"
                  title="Player Out"
                  description="Choose a current court player."
                />

                <div className="mt-2 grid grid-cols-2 gap-2">
                  {eligiblePlayers.outgoing.map((player) => {
                    const position = getCourtPosition(
                      selectedTeam.rotation,
                      player.playerId,
                    );

                    return (
                      <CompactPlayerCard
                        key={player.playerId}
                        player={player}
                        selected={outgoingPlayerId === player.playerId}
                        badge={position ? `P${position}` : undefined}
                        tone={selectedTeam.tone}
                        onClick={() => selectOutgoing(player)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* =====================
                  PLAYER IN
              ===================== */}

              {outgoingPlayer && (
                <div className="mt-4">
                  <StepHeading
                    step="2"
                    icon={<ArrowUp size={14} />}
                    tone="green"
                    title="Player In"
                    description={
                      outgoingPosition
                        ? `Replacement will enter position ${outgoingPosition}.`
                        : "Choose an eligible bench player."
                    }
                  />

                  {eligiblePlayers.incoming.length > 0 ? (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {eligiblePlayers.incoming.map((player) => (
                        <CompactPlayerCard
                          key={player.playerId}
                          player={player}
                          selected={incomingPlayerId === player.playerId}
                          badge="Bench"
                          tone={selectedTeam.tone}
                          onClick={() => {
                            setIncomingPlayerId(player.playerId);

                            setError("");
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 rounded-2xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) p-4 text-center">
                      <Users
                        size={20}
                        className="mx-auto text-(--color-text-muted)"
                      />

                      <p className="mt-2 text-xs font-bold text-(--color-text-primary)">
                        No substitutes available
                      </p>

                      <p className="mt-1 text-[10px] text-(--color-text-muted)">
                        All eligible non-Libero players are currently on court.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* =====================
                  SUMMARY
              ===================== */}

              {outgoingPlayer && incomingPlayer && (
                <ReplacementSummary
                  title="Substitution"
                  outgoing={outgoingPlayer}
                  incoming={incomingPlayer}
                  position={outgoingPosition}
                />
              )}
            </>
          )}

          {/* ERROR */}

          {error && (
            <div className="mt-3 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-2.5">
              <p className="text-xs font-semibold text-(--color-live)">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* =========================
            FIXED CONFIRM
        ========================= */}

        <div className="safe-bottom shrink-0 bg-(--color-bg-card) py-2 ">
          <Button
            fullWidth
            loading={isSubmitting}
            disabled={
              !selectedTeam ||
              !outgoingPlayerId ||
              !incomingPlayerId ||
              isSubmitting
            }
            onClick={handleSubmit}
          >
            Confirm Substitution
          </Button>
        </div>
      </div>
    </DialogBottom>
  );
}

/* =========================================================
   TEAM CHOICE
========================================================= */

function TeamChoice({
  name,
  shortName,
  logoUrl,
  tone,
  selected,
  disabled,
  onClick,
}: {
  name: string;
  shortName: string | null;
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
        "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all",
        selected && tone === "orange" && "border-orange-400 bg-orange-50",
        selected && tone === "red" && "border-red-400 bg-red-50",
        !selected && "border-(--color-bg-border) bg-(--color-bg-card)",
      )}
    >
      <TeamBadge imageKey={logoUrl} name={shortName ?? name} tone={tone} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-black text-(--color-text-primary)">
          {getTeamLabel(shortName ?? name)}
        </p>

        <p className="text-[9px] text-(--color-text-muted)">
          {selected ? "Selected" : "Choose"}
        </p>
      </div>

      {selected && (
        <Check
          size={14}
          className={tone === "orange" ? "text-orange-600" : "text-red-600"}
        />
      )}
    </button>
  );
}

/* =========================================================
   COMPACT PLAYER CARD
========================================================= */

function CompactPlayerCard({
  player,
  selected,
  badge,
  tone,
  onClick,
}: {
  player: VolleyballMatchRosterPlayer;

  selected: boolean;

  badge?: string;

  tone: "orange" | "red";

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex min-w-0 items-center gap-2 rounded-2xl border bg-(--color-bg-card) p-2.5 text-left transition-all",
        selected &&
          tone === "orange" &&
          "border-orange-400 bg-orange-50 ring-1 ring-orange-100",
        selected &&
          tone === "red" &&
          "border-red-400 bg-red-50 ring-1 ring-red-100",
        !selected && "border-(--color-bg-border)",
      )}
    >
      <PlayerAvatar player={player} size={38} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-(--color-text-primary)">
          {player.playerNameSnapshot}
        </p>

        <p className="mt-0.5 truncate text-[9px] text-(--color-text-muted)">
          #{player.jerseyNumberSnapshot}
          {" · "}
          {formatPosition(player.positionSnapshot)}
        </p>
      </div>

      {badge && (
        <span
          className={cn(
            "absolute right-2 top-2 rounded-md px-1.5 py-0.5 text-[8px] font-black",
            selected
              ? tone === "orange"
                ? "bg-orange-500 text-white"
                : "bg-red-500 text-white"
              : "bg-(--color-bg-tint) text-(--color-brand)",
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

/* =========================================================
   STEP HEADING
========================================================= */

function StepHeading({
  step,
  icon,
  tone,
  title,
  description,
}: {
  step: string;
  icon: ReactNode;

  tone: "red" | "green";

  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          tone === "red"
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600",
        )}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black text-(--color-text-muted)">
            {step}.
          </span>

          <p className="text-xs font-black text-(--color-text-primary)">
            {title}
          </p>
        </div>

        <p className="text-[9px] text-(--color-text-muted)">{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function ReplacementSummary({
  title,
  outgoing,
  incoming,
  position,
}: {
  title: string;

  outgoing: VolleyballMatchRosterPlayer;
  incoming: VolleyballMatchRosterPlayer;

  position: number | null;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-(--shadow-card)">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-(--color-text-muted)">
          {title}
        </p>

        {position && (
          <span className="rounded-full bg-(--color-bg-tint) px-2 py-0.5 text-[9px] font-black text-(--color-brand)">
            P{position}
          </span>
        )}
      </div>

      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <SummaryPlayer player={outgoing} label="OUT" tone="red" />

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--color-bg-base)">
          <ArrowRightLeft size={15} className="text-(--color-text-muted)" />
        </div>

        <SummaryPlayer player={incoming} label="IN" tone="green" />
      </div>
    </div>
  );
}

function SummaryPlayer({
  player,
  label,
  tone,
}: {
  player: VolleyballMatchRosterPlayer;

  label: string;

  tone: "red" | "green";
}) {
  return (
    <div className="min-w-0 text-center">
      <PlayerAvatar player={player} size={36} />

      <p className="mx-auto mt-1 max-w-[110px] truncate text-[10px] font-bold text-(--color-text-primary)">
        {player.playerNameSnapshot}
      </p>

      <span
        className={cn(
          "mt-1 inline-flex rounded-full px-2 py-0.5 text-[8px] font-black",
          tone === "green"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700",
        )}
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   EMPTY STEP
========================================================= */

function EmptyStep({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) px-4 py-6 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-(--color-bg-tint) text-(--color-brand)">
        {icon}
      </div>

      <p className="mt-2 text-sm font-bold text-(--color-text-primary)">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-(--color-text-muted)">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   TEAM BADGE
========================================================= */

function TeamBadge({
  imageKey,
  name,
  tone,
}: {
  imageKey: string | null;

  name: string;

  tone: "orange" | "red";
}) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg text-white",
        tone === "orange" ? "bg-orange-500" : "bg-red-500",
      )}
    >
      {imageKey ? (
        <S3Image
          imageKey={imageKey}
          alt={name}
          width={32}
          height={32}
          className="h-full w-full object-cover"
          fallback={
            <span className="text-[10px] font-black">{getTeamLabel(name)}</span>
          }
        />
      ) : (
        <span className="text-[10px] font-black">{getTeamLabel(name)}</span>
      )}
    </div>
  );
}

/* =========================================================
   PLAYER AVATAR
========================================================= */

function PlayerAvatar({
  player,
  size,
}: {
  player: VolleyballMatchRosterPlayer;
  size: number;
}) {
  return (
    <div
      className="mx-auto flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--color-bg-tint)"
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
          fallback={
            <span className="font-(family-name:--font-display) text-xs font-black text-(--color-brand)">
              {player.playerNameSnapshot.charAt(0).toUpperCase()}
            </span>
          }
        />
      ) : (
        <span className="font-(family-name:--font-display) text-xs font-black text-(--color-brand)">
          {player.playerNameSnapshot.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
