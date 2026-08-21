// "use client";

// import { CreatePlayerFlow } from "@/components/cricket/Players/CreatePlayerFlow";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import React from "react";

// const CreatePlayerPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const currentTeam = searchParams.get("team");
//   const tournamentId = params.tournamentId as string;

//   return (
//     <div>
//       <CreatePlayerFlow
//         teamId={currentTeam}
//         createdSource="TOURNAMENT_REGISTRATION"
//         manualAddPath={`/tournaments/${tournamentId}/create-player?team=${currentTeam}&manual=true`}
//         onDone={() =>
//           router.push(
//             `/tournaments/${tournamentId}/players?team=${currentTeam}`,
//           )
//         }
//       />
//     </div>
//   );
// };

// export default CreatePlayerPage;

"use client";

import { CreatePlayerFlow } from "@/components/player/CreatePlayerFlow";

import {
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
} from "@/store/api/cricket/cricketTeamApi";

import type { Player } from "@/types/player";

import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function CreatePlayerPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const currentTeam = searchParams.get("team");
  const tournamentId = params.tournamentId as string;

  const [addTeamMember, { isLoading: isAddingPlayer }] =
    useAddTeamMemberMutation();

  const [removeTeamMember] = useRemoveTeamMemberMutation();

  async function handleAddPlayer(player: Player) {
    if (!currentTeam) {
      throw new Error("Team ID not found.");
    }

    await addTeamMember({
      teamId: currentTeam,
      body: {
        playerId: player.id,
      },
    }).unwrap();

    return true;
  }

  async function handleRemovePlayer(player: Player) {
    if (!currentTeam) {
      throw new Error("Team ID not found.");
    }

    await removeTeamMember({
      teamId: currentTeam,
      playerId: player.id,
    }).unwrap();
  }

  return (
    <div>
      <CreatePlayerFlow
        onAddPlayer={handleAddPlayer}
        onRemovePlayer={handleRemovePlayer}
        isAddingPlayer={isAddingPlayer}
        createdSource="TOURNAMENT_REGISTRATION"
        manualAddPath={`/tournaments/${tournamentId}/create-player?team=${currentTeam}&manual=true`}
        onDone={() =>
          router.push(
            `/tournaments/${tournamentId}/players?team=${currentTeam}`,
          )
        }
      />
    </div>
  );
}
