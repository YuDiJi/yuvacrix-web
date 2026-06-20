import { Button } from "@/components/common/Button";
import { PlayerPickerSheet } from "@/components/Players/PlayerPickerSheet";
import { cn } from "@/lib/cn";
import { useChangeBowlerMutation } from "@/store/api/scoringApi";
import { MatchDetailsPlayer } from "@/types/match";
import { useEffect, useState } from "react";

export function NextBowlerSheet({
  open,
  players,
  onClose,
  oversText,
  matchId,
  inningsId,
  reason,
}: {
  open: boolean;
  players: MatchDetailsPlayer[] | undefined;
  onClose: () => void;
  oversText: string | undefined;
  matchId: string | null;
  inningsId: string | undefined;
  reason: string | undefined;
}) {
  const [selectedBowler, setSelectedBowler] =
    useState<MatchDetailsPlayer | null>(null);

  const [changeBowler, { isLoading }] = useChangeBowlerMutation();

  useEffect(() => {
    if (open) {
      setSelectedBowler(null);
    }
  }, [open]);

  const handleContinue = async () => {
    if (!selectedBowler || !matchId || !inningsId) return;

    try {
      await changeBowler({
        matchId,
        inningsId,
        bowlerId: selectedBowler.playerId,
        reason: reason,
      }).unwrap();

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <PlayerPickerSheet
        open={open}
        players={players}
        title="Select Bowler"
        subTitle={`For over ${oversText}`}
        disabledIds={[]}
        selectedPlayerId={selectedBowler?.playerId}
        onSelect={setSelectedBowler}
        onClose={() => {}}
        footer={
          <Button
            fullWidth
            disabled={!selectedBowler || isLoading}
            onClick={handleContinue}
          >
            Continue Scoring
          </Button>
        }
      />
    </div>
  );
}
