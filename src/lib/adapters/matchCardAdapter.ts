import type { Match } from "@/types/match";
import type { MatchCardModel } from "@/types/matchCard";

export function matchToMatchCard(match: Match): MatchCardModel {
  return {
    source: "MATCH",

    matchId: match.matchId,
    fixtureId: null,

    status: match.status,
    primaryAction: match.primaryAction ?? null,
    lineupMode: match.lineupMode,

    matchType: match.matchType ?? null,

    teamA: {
      teamId: match.teamA.teamId,
      name: match.teamA.name,
      shortName: match.teamA.shortName ?? null,
      logoUrl: match.teamA.logoUrl ?? null,

      squadCount: match.teamA.squadCount,

      captainId: match.teamA.captainId ?? null,
      //   captainName: match.teamA.captainName ?? null,

      wicketKeeperId: match.teamA.wicketKeeperId ?? null,
      //   wicketKeeperName: match.teamA.wicketKeeperName ?? null,

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

      squadCount: match.teamB.squadCount,

      captainId: match.teamB.captainId ?? null,
      //   captainName: match.teamB.captainName ?? null,

      wicketKeeperId: match.teamB.wicketKeeperId ?? null,
      //   wicketKeeperName: match.teamB.wicketKeeperName ?? null,

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

    roundId: null,
    roundName: null,
  };
}
