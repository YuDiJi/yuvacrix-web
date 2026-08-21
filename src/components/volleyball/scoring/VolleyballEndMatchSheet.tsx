"use client";

import {
  Check,
  ChevronRight,
  Trophy,
  Users,
  Volleyball,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { S3Image } from "@/components/common/S3Image";

import { cn } from "@/lib/cn";

import { useUpdateVolleyballPostMatchMutation } from "@/store/api/volleyball/volleyballMatchApi";

import type { VolleyballMatch } from "@/types/volleyball/match";

import type { VolleyballMatchRosterPlayer } from "@/types/volleyball/roster";

type Props = {
  open: boolean;

  match: VolleyballMatch;

  onClose: () => void;

  onFinished: (match: VolleyballMatch) => void;
};

type PlayerWithTeam = VolleyballMatchRosterPlayer & {
  teamId: string;
  teamName: string;
  teamSide: "TEAM_A" | "TEAM_B";
};

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

  return "Unable to save match details.";
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

export function VolleyballEndMatchSheet({
  open,
  match,
  onClose,
  onFinished,
}: Props) {
  const [bestPlayerId, setBestPlayerId] = useState<string | null>(
    match.bestPlayer?.playerId ?? null,
  );

  const [spectatorCount, setSpectatorCount] = useState(
    match.spectatorCount != null ? String(match.spectatorCount) : "",
  );

  const [playerPickerOpen, setPlayerPickerOpen] = useState(false);

  const [error, setError] = useState("");

  const [updatePostMatch, { isLoading: isSaving }] =
    useUpdateVolleyballPostMatchMutation();

  const players = useMemo<PlayerWithTeam[]>(() => {
    const teamA = (match.teamARoster?.players ?? []).map((player) => ({
      ...player,

      teamId: match.teamAId,

      teamName: match.teamASnapshot.name,

      teamSide: "TEAM_A" as const,
    }));

    const teamB = (match.teamBRoster?.players ?? []).map((player) => ({
      ...player,

      teamId: match.teamBId,

      teamName: match.teamBSnapshot.name,

      teamSide: "TEAM_B" as const,
    }));

    return [...teamA, ...teamB];
  }, [match]);

  const selectedPlayer =
    players.find((player) => player.playerId === bestPlayerId) ?? null;

  const winner =
    match.winnerTeamId === match.teamAId
      ? match.teamASnapshot
      : match.winnerTeamId === match.teamBId
        ? match.teamBSnapshot
        : null;

  function handleSpectators(value: string) {
    const numeric = value.replace(/\D/g, "");

    setSpectatorCount(numeric);

    setError("");
  }

  async function handleSubmit() {
    const spectators = spectatorCount.trim() ? Number(spectatorCount) : null;

    if (
      spectators !== null &&
      (!Number.isInteger(spectators) || spectators < 0)
    ) {
      setError("Enter a valid spectator count.");

      return;
    }

    setError("");

    try {
      const updatedMatch = await updatePostMatch({
        matchId: match.id,

        body: {
          spectatorCount: spectators,

          bestPlayerId: bestPlayerId,
        },
      }).unwrap();

      onFinished(updatedMatch);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <>
      <DialogBottom
        open={open}
        onClose={onClose}
        className="h-[88dvh] max-h-[88dvh] overflow-hidden rounded-t-3xl bg-(--color-bg-card)"
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* HEADER */}

          <div className="flex shrink-0 items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-(--color-text-muted)">
                Match Finished
              </p>

              <h2 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
                End Match
              </h2>
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary)"
            >
              <X size={18} />
            </button>
          </div>

          {/* BODY */}

          <div className="min-h-0 flex-1 overflow-y-auto bg-(--color-bg-base) px-4 py-3">
            {/* RESULT */}

            <div className="overflow-hidden rounded-3xl bg-(--color-navy) text-white shadow-lg">
              <div className="px-4 py-4 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  {match.isTie ? (
                    <Volleyball size={23} />
                  ) : (
                    <Trophy size={23} className="text-amber-400" />
                  )}
                </div>

                <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/50">
                  {match.isTie ? "Final Result" : "Winner"}
                </p>

                <h3 className="mt-1 font-(family-name:--font-display) text-xl font-black uppercase tracking-wide">
                  {match.isTie
                    ? "Match Tied"
                    : (winner?.name ?? "Match Complete")}
                </h3>

                <div className="mt-3 flex items-center justify-center gap-4">
                  <ResultTeam
                    name={
                      match.teamASnapshot.shortName ?? match.teamASnapshot.name
                    }
                    score={match.teamASetsWon}
                    winner={match.winnerTeamId === match.teamAId}
                    tone="orange"
                  />

                  <span className="text-lg font-black text-white/30">:</span>

                  <ResultTeam
                    name={
                      match.teamBSnapshot.shortName ?? match.teamBSnapshot.name
                    }
                    score={match.teamBSetsWon}
                    winner={match.winnerTeamId === match.teamBId}
                    tone="red"
                  />
                </div>
              </div>
            </div>

            {/* DETAILS TITLE */}

            <div className="mt-5">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--color-brand)">
                Add Match Details
              </p>

              <p className="mt-1 text-xs text-(--color-text-muted)">
                Add post-match information before finishing.
              </p>
            </div>

            {/* BEST PLAYER */}

            <div className="mt-3">
              <label className="text-section-label"> Player of the Match</label>

              <button
                type="button"
                onClick={() => setPlayerPickerOpen(true)}
                className={cn(
                  "mt-2 flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all",
                  selectedPlayer
                    ? "border-(--color-brand)/30 bg-(--color-bg-card)"
                    : "border-dashed border-(--color-bg-border) bg-(--color-bg-card)",
                )}
              >
                {selectedPlayer ? (
                  <>
                    <PlayerAvatar player={selectedPlayer} size={46} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-(--color-text-primary)">
                        {selectedPlayer.playerNameSnapshot}
                      </p>

                      <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
                        #{selectedPlayer.jerseyNumberSnapshot}
                        {" · "}
                        {selectedPlayer.teamName}
                      </p>
                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-(--color-brand) text-white">
                      <Check size={14} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <Trophy size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-(--color-text-primary)">
                        Select MVP
                      </p>

                      <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
                        Choose the Player of the Match
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-(--color-text-muted)"
                    />
                  </>
                )}
              </button>
            </div>

            {/* SPECTATORS */}

            <div className="mt-4">
              <label htmlFor="spectatorCount" className="text-section-label">
                Spectators
              </label>

              <div className="relative mt-2">
                <Users
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                />

                <input
                  id="spectatorCount"
                  type="text"
                  inputMode="numeric"
                  value={spectatorCount}
                  disabled={isSaving}
                  onChange={(event) => handleSpectators(event.target.value)}
                  placeholder="Enter spectators"
                  className="h-12 w-full rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) pl-10 pr-4 text-sm font-bold text-(--color-text-primary) outline-none transition focus:border-(--color-brand)"
                />
              </div>

              <p className="mt-1.5 px-1 text-[9px] text-(--color-text-muted)">
                Approximate audience at the match.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-3 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-2.5">
                <p className="text-xs font-semibold text-(--color-live)">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* FOOTER */}

          <div className="safe-bottom shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3 shadow-[0_-8px_24px_rgba(13,27,62,0.06)]">
            <Button
              fullWidth
              loading={isSaving}
              disabled={isSaving}
              onClick={handleSubmit}
            >
              Save & Finish Match
            </Button>
          </div>
        </div>
      </DialogBottom>

      {/* PLAYER PICKER */}

      <BestPlayerPickerSheet
        open={playerPickerOpen}
        players={players}
        selectedPlayerId={bestPlayerId}
        onClose={() => setPlayerPickerOpen(false)}
        onSelect={(player) => {
          setBestPlayerId(player.playerId);

          setPlayerPickerOpen(false);

          setError("");
        }}
      />
    </>
  );
}

function ResultTeam({
  name,
  score,
  winner,
  tone,
}: {
  name: string;
  score: number;
  winner: boolean;
  tone: "orange" | "red";
}) {
  return (
    <div>
      <p
        className={cn(
          "text-[10px] font-black uppercase",
          winner
            ? tone === "orange"
              ? "text-orange-400"
              : "text-red-400"
            : "text-white/55",
        )}
      >
        {getTeamLabel(name)}
      </p>

      <p className="font-(family-name:--font-display) text-4xl font-black">
        {score}
      </p>
    </div>
  );
}

function BestPlayerPickerSheet({
  open,
  players,
  selectedPlayerId,
  onClose,
  onSelect,
}: {
  open: boolean;

  players: PlayerWithTeam[];

  selectedPlayerId: string | null;

  onClose: () => void;

  onSelect: (player: PlayerWithTeam) => void;
}) {
  const teamAPlayers = players.filter((player) => player.teamSide === "TEAM_A");

  const teamBPlayers = players.filter((player) => player.teamSide === "TEAM_B");

  return (
    <DialogBottom
      open={open}
      onClose={onClose}
      className="h-[82dvh] max-h-[82dvh] overflow-hidden rounded-t-3xl bg-(--color-bg-card)"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-(--color-bg-border) px-4 py-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--color-text-muted)">
              Match Award
            </p>

            <h2 className="text-lg font-black text-(--color-text-primary)">
              Select Best Player
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-bg-base)"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-(--color-bg-base) px-4 py-3">
          <PlayerTeamSection
            label={teamAPlayers[0]?.teamName ?? "Team A"}
            tone="orange"
            players={teamAPlayers}
            selectedPlayerId={selectedPlayerId}
            onSelect={onSelect}
          />

          <div className="mt-5">
            <PlayerTeamSection
              label={teamBPlayers[0]?.teamName ?? "Team B"}
              tone="red"
              players={teamBPlayers}
              selectedPlayerId={selectedPlayerId}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>
    </DialogBottom>
  );
}

function PlayerTeamSection({
  label,
  tone,
  players,
  selectedPlayerId,
  onSelect,
}: {
  label: string;

  tone: "orange" | "red";

  players: PlayerWithTeam[];

  selectedPlayerId: string | null;

  onSelect: (player: PlayerWithTeam) => void;
}) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            tone === "orange" ? "bg-orange-500" : "bg-red-500",
          )}
        />

        <p className="text-section-label">{label}</p>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {players.map((player) => (
          <button
            key={player.playerId}
            type="button"
            onClick={() => onSelect(player)}
            className={cn(
              "relative flex min-w-0 items-center gap-2 rounded-2xl border bg-(--color-bg-card) p-2.5 text-left",
              selectedPlayerId === player.playerId
                ? tone === "orange"
                  ? "border-orange-400 bg-orange-50"
                  : "border-red-400 bg-red-50"
                : "border-(--color-bg-border)",
            )}
          >
            <PlayerAvatar player={player} size={38} />

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-(--color-text-primary)">
                {player.playerNameSnapshot}
              </p>

              <p className="mt-0.5 text-[9px] text-(--color-text-muted)">
                #{player.jerseyNumberSnapshot}
              </p>
            </div>

            {selectedPlayerId === player.playerId && (
              <Check
                size={13}
                className={cn(
                  "absolute right-2 top-2",
                  tone === "orange" ? "text-orange-600" : "text-red-600",
                )}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

function PlayerAvatar({
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
          fallback={
            <span className="font-(family-name:--font-display) text-sm font-black text-(--color-brand)">
              {player.playerNameSnapshot.charAt(0).toUpperCase()}
            </span>
          }
        />
      ) : (
        <span className="font-(family-name:--font-display) text-sm font-black text-(--color-brand)">
          {player.playerNameSnapshot.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
