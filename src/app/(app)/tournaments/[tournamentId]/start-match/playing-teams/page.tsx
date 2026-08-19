"use client";

import { useAppSelector } from "@/store/hooks";
import {
  selectTeamA,
  selectTeamB,
  selectTournamentId,
} from "@/store/startMatch/selectors";
import TeamSelection from "@/components/cricket/match/TeamSelection";
import { useParams, useRouter } from "next/navigation";
import TournamentMatchDetails from "./MatchDetails";

export default function PlayingTeamPage() {
  const router = useRouter();
  const params = useParams();
  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);
  const tournamentId = params.tournamentId as string;

  // ── SCREEN: TEAM SELECTION ─────────────────────────────────────────────────
  if (!teamA || !teamB) {
    // return <TeamSelection teamA={teamA} teamB={teamB} />;
    return (
      <TeamSelection
        teamA={teamA}
        teamB={teamB}
        onSelectTeamA={() =>
          router.push(
            `/tournaments/${tournamentId}/start-match/select-team?team=A`,
          )
        }
        onSelectTeamB={() =>
          router.push(
            `/tournaments/${tournamentId}/start-match/select-team?team=B`,
          )
        }
      />
    );
  }

  return <TournamentMatchDetails teamA={teamA} teamB={teamB} />;
}
