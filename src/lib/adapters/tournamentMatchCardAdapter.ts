import type { TournamentMatchListItem } from "@/store/api/tournamentMatchApi";
import type { MatchCardModel } from "@/types/matchCard";

export function tournamentMatchToMatchCard(
  match: TournamentMatchListItem,
): MatchCardModel {
  return {
    source: "TOURNAMENT",

    matchId: match.matchId,
    fixtureId: match.fixtureId,

    status: match.status,
    primaryAction: match.primaryAction,

    // Backend does not currently return lineupMode in the list response.
    // Keep this fallback until it is added.
    lineupMode: "FLEXIBLE",

    teamA: {
      teamId: match.teamA.teamId,
      name: match.teamA.name,
      shortName: match.teamA.shortName ?? null,
      logoUrl: match.teamA.logoUrl ?? null,

      captainId: match.teamA.captainId ?? null,
      //   viceCaptainId: match.teamA.viceCaptainId ?? null,
      wicketKeeperId: match.teamA.wicketKeeperId ?? null,

      score: match.teamA.score
        ? {
            runs: match.teamA.score.runs,
            wickets: match.teamA.score.wickets,
            oversText: match.teamA.score.oversText,
          }
        : null,
    },

    teamB: {
      teamId: match.teamB.teamId,
      name: match.teamB.name,
      shortName: match.teamB.shortName ?? null,
      logoUrl: match.teamB.logoUrl ?? null,

      captainId: match.teamB.captainId ?? null,
      //   viceCaptainId: match.teamB.viceCaptainId ?? null,
      wicketKeeperId: match.teamB.wicketKeeperId ?? null,

      score: match.teamB.score
        ? {
            runs: match.teamB.score.runs,
            wickets: match.teamB.score.wickets,
            oversText: match.teamB.score.oversText,
          }
        : null,
    },

    scheduledAt: match.scheduledAt ?? null,
    startedAt: match.startedAt ?? null,
    completedAt: match.completedAt ?? null,

    summaryText: match.summaryText ?? null,
    oversLimit: match.oversLimit ?? null,

    venue: match.venue
      ? {
          city: match.venue.city ?? null,
          groundName: match.venue.groundName ?? null,
        }
      : null,

    roundId: match.roundId,
    roundName: match.round?.name ?? null,
  };
}
