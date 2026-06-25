import { Button } from "@/components/common/Button";
import { PlayerPickerSheet } from "@/components/Players/PlayerPickerSheet";
import { ScoringState } from "@/types/innings";
import { MatchDetailsPlayer } from "@/types/match";
import React, { useState } from "react";

const WicketKeeperSelector = ({
  players,
  state,
}: {
  players: MatchDetailsPlayer[] | undefined;
  state: ScoringState | undefined;
}) => {
  const [selectedBowler, setSelectedBowler] =
    useState<MatchDetailsPlayer | null>(null);

  const bowlingPlayers = players?.filter(
    (player) => player.teamId === state?.bowlingTeamId,
  );
  return (
    <div>
      <PlayerPickerSheet
        open={true}
        players={bowlingPlayers}
        title="Select Wicket-keeper"
        // subTitle={`For over ${oversText}`}
        disabledIds={[]}
        selectedPlayerId={selectedBowler?.playerId}
        onSelect={setSelectedBowler}
      />
      <Button
        fullWidth
        // disabled={!selectedBowler || isStartingNextOver}
        // onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  );
};

export default WicketKeeperSelector;
