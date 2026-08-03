"use client";

import { CreatePlayerFlow } from "@/components/Players/CreatePlayerFlow";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const CreatePlayerPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const currentTeam = searchParams.get("team");
  const tournamentId = params.tournamentId as string;

  return (
    <div>
      <CreatePlayerFlow
        teamId={currentTeam}
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
};

export default CreatePlayerPage;
