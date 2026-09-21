import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { PlayerPickerSheet } from "@/components/cricket/Players/PlayerPickerSheet";
import { cn } from "@/lib/cn";
import { useChangeStrikeManuallyMutation } from "@/store/api/cricket/scoringApi";
import { ScoringState } from "@/types/cricket/innings";
import { MatchDetailsPlayer } from "@/types/cricket/match";
import { useEffect, useMemo, useRef, useState } from "react";

type ChangeBattersSheetProps = {
  open: boolean;
  onClose: () => void;
  players: MatchDetailsPlayer[] | undefined;
  state: ScoringState | undefined;
  isScoringBusy?: boolean;
  onPendingChange?: (pending: boolean) => void;
  onSaved?: () => void;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
}

function playerName(
  playersById: Map<string, MatchDetailsPlayer>,
  playerId: string | undefined,
) {
  return playerId ? playersById.get(playerId)?.playerNameSnapshot : undefined;
}

export function ChangeBattersSheet({
  open,
  onClose,
  players,
  state,
  isScoringBusy = false,
  onPendingChange,
  onSaved,
}: ChangeBattersSheetProps) {
  const [strikerId, setStrikerId] = useState("");
  const [nonStrikerId, setNonStrikerId] = useState("");
  const [editingRole, setEditingRole] = useState<"STRIKER" | "NON_STRIKER">(
    "STRIKER",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const submitInFlightRef = useRef(false);
  const [changeStrikeManually, { isLoading }] =
    useChangeStrikeManuallyMutation();

  useEffect(() => {
    onPendingChange?.(isLoading);
  }, [isLoading, onPendingChange]);

  const playersById = useMemo(() => {
    return new Map((players ?? []).map((player) => [player.playerId, player]));
  }, [players]);

  const battingPlayers = useMemo(() => {
    const availableBatterIds = new Set(state?.availableBatters ?? []);
    const currentBatterIds = new Set(
      [state?.currentStrikerId, state?.currentNonStrikerId].filter(Boolean),
    );

    return (players ?? []).filter((player) => {
      if (player.teamId !== state?.battingTeamId) return false;
      if (!player.isPlayingXi) return false;
      if (availableBatterIds.size === 0) return true;

      return (
        availableBatterIds.has(player.playerId) ||
        currentBatterIds.has(player.playerId)
      );
    });
  }, [
    players,
    state?.availableBatters,
    state?.battingTeamId,
    state?.currentNonStrikerId,
    state?.currentStrikerId,
  ]);

  const eligibleBatterIds = useMemo(() => {
    return new Set(battingPlayers.map((player) => player.playerId));
  }, [battingPlayers]);

  useEffect(() => {
    if (!open) return;

    setStrikerId(state?.currentStrikerId ?? "");
    setNonStrikerId(state?.currentNonStrikerId ?? "");
    setEditingRole("STRIKER");
    setErrorMessage("");
  }, [open, state?.currentNonStrikerId, state?.currentStrikerId]);

  const handleClose = () => {
    if (isLoading) return;

    onClose();
  };

  const handleSave = async () => {
    if (submitInFlightRef.current || isLoading || isScoringBusy) return;

    if (!state?.matchId || !state.inningsId) {
      setErrorMessage("Unable to update batters. Please try again.");
      return;
    }

    if (!strikerId) {
      setErrorMessage("Select a striker.");
      return;
    }

    if (!nonStrikerId) {
      setErrorMessage("Select a non-striker.");
      return;
    }

    if (strikerId === nonStrikerId) {
      setErrorMessage("Striker and non-striker must be different players.");
      return;
    }

    if (!eligibleBatterIds.has(strikerId) || !eligibleBatterIds.has(nonStrikerId)) {
      setErrorMessage("Selected batters must be part of the batting XI.");
      return;
    }

    setErrorMessage("");
    submitInFlightRef.current = true;

    try {
      await changeStrikeManually({
        matchId: state.matchId,
        inningsId: state.inningsId,
        strikerId,
        nonStrikerId,
        reason: "Manual batter correction",
      }).unwrap();

      onSaved?.();
      onClose();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        getErrorMessage(error, "Unable to update batters. Please try again."),
      );
    } finally {
      submitInFlightRef.current = false;
    }
  };

  return (
    <DialogBottom open={open} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-display text-lg font-black uppercase tracking-wide text-(--color-text-primary)">
            Change Batters
          </h3>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Current: {playerName(playersById, state?.currentStrikerId) ?? "-"} /
            {" "}
            {playerName(playersById, state?.currentNonStrikerId) ?? "-"}
          </p>
        </div>

        {errorMessage && (
          <p className="rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-2 text-center text-sm font-semibold text-(--color-live)">
            {errorMessage}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setEditingRole("STRIKER")}
            className={cn(
              "rounded-2xl border-2 p-3 text-left transition-colors",
              editingRole === "STRIKER"
                ? "border-(--color-brand) bg-(--color-bg-tint)"
                : "border-(--color-bg-border) bg-white",
            )}
          >
            <span className="block text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
              Striker
            </span>
            <span className="mt-1 block truncate text-sm font-bold text-(--color-text-primary)">
              {playerName(playersById, strikerId) ?? "Select striker"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setEditingRole("NON_STRIKER")}
            className={cn(
              "rounded-2xl border-2 p-3 text-left transition-colors",
              editingRole === "NON_STRIKER"
                ? "border-(--color-brand) bg-(--color-bg-tint)"
                : "border-(--color-bg-border) bg-white",
            )}
          >
            <span className="block text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
              Non-Striker
            </span>
            <span className="mt-1 block truncate text-sm font-bold text-(--color-text-primary)">
              {playerName(playersById, nonStrikerId) ?? "Select non-striker"}
            </span>
          </button>
        </div>

        <PlayerPickerSheet
          open={open}
          players={battingPlayers}
          title={editingRole === "STRIKER" ? "Select Striker" : "Select Non-Striker"}
          subTitle={
            editingRole === "STRIKER"
              ? "Choose the batter on strike."
              : "Choose the batter at the other end."
          }
          selectedPlayerId={editingRole === "STRIKER" ? strikerId : nonStrikerId}
          disabledIds={
            editingRole === "STRIKER"
              ? nonStrikerId
                ? [nonStrikerId]
                : []
              : strikerId
                ? [strikerId]
                : []
          }
          onSelect={(player) => {
            setErrorMessage("");
            if (editingRole === "STRIKER") {
              setStrikerId(player.playerId);
            } else {
              setNonStrikerId(player.playerId);
            }
          }}
        />

        <Button
          fullWidth
          disabled={
            isLoading ||
            isScoringBusy ||
            !strikerId ||
            !nonStrikerId ||
            strikerId === nonStrikerId
          }
          loading={isLoading}
          onClick={handleSave}
        >
          Save Batters
        </Button>
      </div>
    </DialogBottom>
  );
}
