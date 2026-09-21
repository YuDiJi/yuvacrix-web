import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { PlayerPickerSheet } from "@/components/cricket/Players/PlayerPickerSheet";
import { useChangeBowlerManuallyMutation } from "@/store/api/cricket/scoringApi";
import { ScoringState } from "@/types/cricket/innings";
import { MatchDetailsPlayer } from "@/types/cricket/match";
import { useEffect, useMemo, useRef, useState } from "react";

type ChangeBowlerSheetProps = {
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

export function ChangeBowlerSheet({
  open,
  onClose,
  players,
  state,
  isScoringBusy = false,
  onPendingChange,
  onSaved,
}: ChangeBowlerSheetProps) {
  const [selectedBowlerId, setSelectedBowlerId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const submitInFlightRef = useRef(false);
  const [changeBowlerManually, { isLoading }] =
    useChangeBowlerManuallyMutation();

  useEffect(() => {
    onPendingChange?.(isLoading);
  }, [isLoading, onPendingChange]);

  const bowlingPlayers = useMemo(() => {
    return (players ?? []).filter(
      (player) => player.teamId === state?.bowlingTeamId && player.isPlayingXi,
    );
  }, [players, state?.bowlingTeamId]);

  const eligibleBowlerIds = useMemo(() => {
    return new Set(bowlingPlayers.map((player) => player.playerId));
  }, [bowlingPlayers]);

  useEffect(() => {
    if (!open) return;

    setSelectedBowlerId(state?.currentBowlerId ?? "");
    setErrorMessage("");
  }, [open, state?.currentBowlerId]);

  const handleClose = () => {
    if (isLoading) return;

    onClose();
  };

  const handleSave = async () => {
    if (submitInFlightRef.current || isLoading || isScoringBusy) return;

    if (!state?.matchId || !state.inningsId) {
      setErrorMessage("Unable to update bowler. Please try again.");
      return;
    }

    if (!selectedBowlerId) {
      setErrorMessage("Select a bowler.");
      return;
    }

    if (!eligibleBowlerIds.has(selectedBowlerId)) {
      setErrorMessage("Selected bowler must be part of the bowling XI.");
      return;
    }

    if (selectedBowlerId === state.currentBowlerId) {
      setErrorMessage("Select a different bowler.");
      return;
    }

    setErrorMessage("");
    submitInFlightRef.current = true;

    try {
      await changeBowlerManually({
        matchId: state.matchId,
        inningsId: state.inningsId,
        bowlerId: selectedBowlerId,
        reason: "Manual bowler correction",
      }).unwrap();

      onSaved?.();
      onClose();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        getErrorMessage(error, "Unable to update bowler. Please try again."),
      );
    } finally {
      submitInFlightRef.current = false;
    }
  };

  return (
    <DialogBottom open={open} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <PlayerPickerSheet
          open={open}
          players={bowlingPlayers}
          title="Change Bowler"
          subTitle="Select the current bowler."
          selectedPlayerId={selectedBowlerId}
          onSelect={(player) => {
            setErrorMessage("");
            setSelectedBowlerId(player.playerId);
          }}
        />

        {errorMessage && (
          <p className="rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-2 text-center text-sm font-semibold text-(--color-live)">
            {errorMessage}
          </p>
        )}

        <Button
          fullWidth
          disabled={
            isLoading ||
            isScoringBusy ||
            !selectedBowlerId ||
            selectedBowlerId === state?.currentBowlerId
          }
          loading={isLoading}
          onClick={handleSave}
        >
          Save Bowler
        </Button>
      </div>
    </DialogBottom>
  );
}
