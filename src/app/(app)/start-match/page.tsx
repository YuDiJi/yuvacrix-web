"use client";

import { useAppSelector } from "@/store/hooks";
import { selectTeamA, selectTeamB } from "@/store/startMatch/selectors";
import MatchDetails from "./_components/MatchDetails";
import TeamSelection from "./_components/TeamSelection";

export default function StartMatchPage() {
  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);

  // ── SCREEN: TEAM SELECTION ─────────────────────────────────────────────────
  if (!teamA || !teamB) {
    return <TeamSelection teamA={teamA} teamB={teamB} />;
  }

  return <MatchDetails teamA={teamA} teamB={teamB} />;
}
