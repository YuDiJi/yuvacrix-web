"use client";

import { Trophy, Medal } from "lucide-react";
import type { Tournament } from "@/store/api/cricket/tournamentApi";
import { useGetTournamentTeamsQuery } from "@/store/api/cricket/tournamentTeamApi";

export default function TournamentResult({ tournament }: { tournament: Tournament }) {
  const { data: teams = [] } = useGetTournamentTeamsQuery({ tournamentId: tournament.id });
  const winner = teams.find((team) => team.teamId === tournament.winnerTeamId);
  const runnerUp = teams.find((team) => team.teamId === tournament.runnerUpTeamId);
  return <div className="space-y-2 bg-(--color-navy) px-4 pb-4 text-sm text-white" aria-label="Tournament results">
    <p className="flex items-center gap-2"><Trophy size={18} className="text-amber-300" />Winner: {winner?.teamNameSnapshot ?? "Team details pending"}</p>
    {tournament.runnerUpTeamId && <p className="flex items-center gap-2"><Medal size={18} />Runner-up: {runnerUp?.teamNameSnapshot ?? "Team details pending"}</p>}
    {tournament.resultSummary && <p>{tournament.resultSummary}</p>}
  </div>;
}
