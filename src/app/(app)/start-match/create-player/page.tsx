// "use client";

// import { CreatePlayerFlow } from "@/components/cricket/Players/CreatePlayerFlow";
// import { useAppSelector } from "@/store/hooks";
// import { useRouter, useSearchParams } from "next/navigation";
// import { selectTeamA, selectTeamB } from "@/store/startMatch/selectors";

// import React from "react";

// const CreatePlayerPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const from = searchParams.get("from");

//   const activeTeam = useAppSelector((state) => state.startMatch.activeTeam);

//   const teamA = useAppSelector(selectTeamA);
//   const teamB = useAppSelector(selectTeamB);

//   const currentTeam = activeTeam === "A" ? teamA : teamB;
//   return (
//     <div>
//       <CreatePlayerFlow
//         teamId={currentTeam?.id}
//         manualAddPath="/start-match/create-player?manual=true"
//         createdSource="MATCH_SCORING"
//         onDone={() => router.push("/start-match/select-players")}
//       />
//     </div>
//   );
// };

// export default CreatePlayerPage;

"use client";

import { CreatePlayerFlow } from "@/components/player/CreatePlayerFlow";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

import { selectTeamA, selectTeamB } from "@/store/startMatch/selectors";

import {
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
} from "@/store/api/cricket/cricketTeamApi";

import type { Player } from "@/types/player";

export default function CreatePlayerPage() {
  const router = useRouter();

  const activeTeam = useAppSelector((state) => state.startMatch.activeTeam);

  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);

  const currentTeam = activeTeam === "A" ? teamA : teamB;

  const [addTeamMember, { isLoading: isAddingPlayer }] =
    useAddTeamMemberMutation();

  const [removeTeamMember] = useRemoveTeamMemberMutation();

  async function handleAddPlayer(player: Player) {
    if (!currentTeam?.id) {
      throw new Error("Team ID not found.");
    }

    await addTeamMember({
      teamId: currentTeam.id,
      body: {
        playerId: player.id,
      },
    }).unwrap();
    return true;
  }

  async function handleRemovePlayer(player: Player) {
    if (!currentTeam?.id) {
      throw new Error("Team ID not found.");
    }

    await removeTeamMember({
      teamId: currentTeam.id,
      playerId: player.id,
    }).unwrap();
  }

  return (
    <div>
      <CreatePlayerFlow
        onAddPlayer={handleAddPlayer}
        onRemovePlayer={handleRemovePlayer}
        isAddingPlayer={isAddingPlayer}
        manualAddPath="/start-match/create-player?manual=true"
        createdSource="MATCH_SCORING"
        onDone={() => router.push("/start-match/select-players")}
      />
    </div>
  );
}
