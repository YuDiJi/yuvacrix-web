// src/features/tournaments/leaderboard/leaderboardConfig.ts

import {
  TournamentBattingLeaderboardMetric,
  TournamentBowlingLeaderboardMetric,
  TournamentFieldingLeaderboardMetric,
} from "@/types/cricket/tournamentAnalytics";

export const battingLeaderboardFilters = [
  {
    label: "Top run scorers",
    metric: TournamentBattingLeaderboardMetric.RUNS,
  },
  {
    label: "Highest individual scores",
    metric: TournamentBattingLeaderboardMetric.HIGHEST_SCORE,
  },
  {
    label: "Highest strike rates",
    metric: TournamentBattingLeaderboardMetric.STRIKE_RATE,
  },
  {
    label: "Highest averages",
    metric: TournamentBattingLeaderboardMetric.AVERAGE,
  },
  {
    label: "Most sixes",
    metric: TournamentBattingLeaderboardMetric.SIXES,
  },
  {
    label: "Most fours",
    metric: TournamentBattingLeaderboardMetric.FOURS,
  },
  {
    label: "Most fifties",
    metric: TournamentBattingLeaderboardMetric.FIFTIES,
  },
  {
    label: "Most centuries",
    metric: TournamentBattingLeaderboardMetric.HUNDREDS,
  },
] as const;

export const bowlingLeaderboardFilters = [
  {
    label: "Most wickets",
    metric: TournamentBowlingLeaderboardMetric.WICKETS,
  },
  {
    label: "Best averages",
    metric: TournamentBowlingLeaderboardMetric.AVERAGE,
  },
  {
    label: "Best economy",
    metric: TournamentBowlingLeaderboardMetric.ECONOMY,
  },
  {
    label: "Best strike rates",
    metric: TournamentBowlingLeaderboardMetric.STRIKE_RATE,
  },
  {
    label: "Highest wickets in an innings",
    metric: TournamentBowlingLeaderboardMetric.HIGHEST_WICKETS_IN_INNINGS,
  },
  {
    label: "Most maiden overs",
    metric: TournamentBowlingLeaderboardMetric.MAIDENS,
  },
  {
    label: "Most dot balls",
    metric: TournamentBowlingLeaderboardMetric.DOT_BALLS,
  },
] as const;

export const fieldingLeaderboardFilters = [
  {
    label: "Most dismissals",
    metric: TournamentFieldingLeaderboardMetric.DISMISSALS,
  },
  {
    label: "Most catches",
    metric: TournamentFieldingLeaderboardMetric.CATCHES,
  },
  {
    label: "Most stumpings",
    metric: TournamentFieldingLeaderboardMetric.STUMPINGS,
  },
  {
    label: "Most run outs",
    metric: TournamentFieldingLeaderboardMetric.RUN_OUTS,
  },
  {
    label: "Best wicket keeper",
    metric: TournamentFieldingLeaderboardMetric.WICKET_KEEPER_DISMISSALS,
  },
] as const;
