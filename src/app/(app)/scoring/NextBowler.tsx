import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { PlayerPickerSheet } from "@/components/cricket/Players/PlayerPickerSheet";
import { cn } from "@/lib/cn";
import { useStartNextOverMutation } from "@/store/api/cricket/scoringApi";
import { ScoringState } from "@/types/cricket/innings";
import { MatchDetailsPlayer } from "@/types/cricket/match";
import { useEffect, useState } from "react";

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

export function NextBowlerSheet({
  open,
  players,
  onClose,
  oversText,
  matchId,
  inningsId,
  bowlingTeamId,
  currentBowlerId,
  state,
}: {
  open: boolean;
  players: MatchDetailsPlayer[] | undefined;
  onClose: () => void;
  oversText: string | undefined;
  matchId: string | null;
  inningsId: string | undefined;
  bowlingTeamId: string | undefined;
  currentBowlerId: string | undefined;
  state: ScoringState | undefined;
}) {
  const [selectedBowler, setSelectedBowler] =
    useState<MatchDetailsPlayer | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [startNextOver, { isLoading: isStartingNextOver }] =
    useStartNextOverMutation();

  useEffect(() => {
    if (open) {
      setSelectedBowler(null);
      setErrorMessage("");
    }
  }, [open]);

  const handleContinue = async () => {
    if (!selectedBowler || !matchId || !inningsId) return;

    setErrorMessage("");

    try {
      await startNextOver({
        matchId,
        inningsId,
        bowlerId: selectedBowler.playerId,
      }).unwrap();

      onClose();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to start the next over. Please try again.",
        ),
      );
    }
  };

  const battingPlayers = players?.filter(
    (player) => player.teamId === bowlingTeamId,
  );

  return (
    <DialogBottom open={open} onClose={() => {}}>
      <PlayerPickerSheet
        open={open}
        players={battingPlayers}
        title="Select Bowler"
        subTitle={`For over ${oversText}`}
        disabledIds={currentBowlerId ? [currentBowlerId] : []}
        selectedPlayerId={selectedBowler?.playerId}
        onSelect={setSelectedBowler}
        // onClose={() => {}}
        // footer={
        //   <Button
        //     fullWidth
        //     disabled={!selectedBowler || isStartingNextOver}
        //     onClick={handleContinue}
        //   >
        //     Continue Scoring
        //   </Button>
        // }
      />
      <Button
        fullWidth
        disabled={!selectedBowler || isStartingNextOver}
        loading={isStartingNextOver}
        onClick={handleContinue}
      >
        Continue Scoring
      </Button>
      {errorMessage && (
        <p className="mt-3 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-2 text-center text-sm font-semibold text-(--color-live)">
          {errorMessage}
        </p>
      )}
      {state && (
        <div className="overflow-hidden px-5 py-1">
          <div className="whitespace-nowrap animate-marquee">
            <span className="text-sm font-bold">
              Target: {state.score} in {state.oversText} ({state.runRateSummary}
              )
            </span>
          </div>
        </div>
      )}
    </DialogBottom>
  );
}
