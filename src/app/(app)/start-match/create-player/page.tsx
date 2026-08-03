"use client";

import { CreatePlayerFlow } from "@/components/Players/CreatePlayerFlow";
import { useAppSelector } from "@/store/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { selectTeamA, selectTeamB } from "@/store/startMatch/selectors";

import React from "react";

const CreatePlayerPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const activeTeam = useAppSelector((state) => state.startMatch.activeTeam);

  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);

  const currentTeam = activeTeam === "A" ? teamA : teamB;
  return (
    <div>
      <CreatePlayerFlow
        teamId={currentTeam?.id}
        manualAddPath="/start-match/create-player?manual=true"
        createdSource="MATCH_SCORING"
        onDone={() => router.push("/start-match/select-players")}
      />
    </div>
  );
};

export default CreatePlayerPage;
