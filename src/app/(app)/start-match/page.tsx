"use client";

import { useAppSelector } from "@/store/hooks";
import { selectTeamA, selectTeamB } from "@/store/startMatch/selectors";
import MatchDetails from "./_components/MatchDetails";
import TeamSelection from "@/components/cricket/match/TeamSelection";
import { useRouter } from "next/navigation";

export default function StartMatchPage() {
  const router = useRouter();
  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);

  // ── SCREEN: TEAM SELECTION ─────────────────────────────────────────────────
  if (!teamA || !teamB) {
    // return <TeamSelection teamA={teamA} teamB={teamB} />;
    return (
      <TeamSelection
        teamA={teamA}
        teamB={teamB}
        onSelectTeamA={() => router.push("/start-match/select-team?team=A")}
        onSelectTeamB={() => router.push("/start-match/select-team?team=B")}
      />
    );
  }

  return <MatchDetails teamA={teamA} teamB={teamB} />;
}
