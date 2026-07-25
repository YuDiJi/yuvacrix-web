// src/types/tournamentAnalytics.ts

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────

export enum TournamentBoundaryStatType {
  FOURS = "FOURS",
  SIXES = "SIXES",
}

export enum TournamentBattingLeaderboardMetric {
  RUNS = "RUNS",
  HIGHEST_SCORE = "HIGHEST_SCORE",
  AVERAGE = "AVERAGE",
  STRIKE_RATE = "STRIKE_RATE",
  FOURS = "FOURS",
  SIXES = "SIXES",
  THIRTIES = "THIRTIES",
  FIFTIES = "FIFTIES",
  HUNDREDS = "HUNDREDS",
}

export enum TournamentBowlingLeaderboardMetric {
  WICKETS = "WICKETS",
  HIGHEST_WICKETS_IN_INNINGS = "HIGHEST_WICKETS_IN_INNINGS",
  ECONOMY = "ECONOMY",
  AVERAGE = "AVERAGE",
  STRIKE_RATE = "STRIKE_RATE",
  DOT_BALLS = "DOT_BALLS",
  MAIDENS = "MAIDENS",
}

export enum TournamentFieldingLeaderboardMetric {
  DISMISSALS = "DISMISSALS",
  CATCHES = "CATCHES",
  CAUGHT_BEHIND = "CAUGHT_BEHIND",
  STUMPINGS = "STUMPINGS",
  RUN_OUTS = "RUN_OUTS",
  WICKET_KEEPER_DISMISSALS = "WICKET_KEEPER_DISMISSALS",
}

export enum TournamentHeroType {
  ORANGE_CAP = "ORANGE_CAP",
  PURPLE_CAP = "PURPLE_CAP",
  TOURNAMENT_MVP = "TOURNAMENT_MVP",
  MOST_FOURS = "MOST_FOURS",
  MOST_SIXES = "MOST_SIXES",
  MOST_DOT_BALLS = "MOST_DOT_BALLS",
  MOST_MAIDENS = "MOST_MAIDENS",
  MOST_CATCHES = "MOST_CATCHES",
  MOST_CAUGHT_BEHIND = "MOST_CAUGHT_BEHIND",
  MOST_STUMPINGS = "MOST_STUMPINGS",
  MOST_RUN_OUTS = "MOST_RUN_OUTS",
  MOST_FIELDING_DISMISSALS = "MOST_FIELDING_DISMISSALS",
  BEST_WICKET_KEEPER = "BEST_WICKET_KEEPER",
}

export type TournamentAnalyticsSource = "ON_DEMAND";
export type TournamentMvpConfigMode = "DEFAULT" | "CUSTOM";
export type AnalyticsFilterValue = string | "ALL";

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentAnalyticsFilters {
  teamId?: AnalyticsFilterValue;
  roundId?: AnalyticsFilterValue;
  groupId?: AnalyticsFilterValue;
  refresh?: boolean;
}

export interface TournamentAnalyticsPaginationQuery {
  skip?: number;
  limit?: number;
}

export interface TournamentAnalyticsQuery
  extends TournamentAnalyticsFilters, TournamentAnalyticsPaginationQuery {}

export interface TournamentBoundaryStatsQuery extends TournamentAnalyticsQuery {
  type: TournamentBoundaryStatType;
}

export interface TournamentBattingLeaderboardQuery extends TournamentAnalyticsQuery {
  metric?: TournamentBattingLeaderboardMetric;
}

export interface TournamentBowlingLeaderboardQuery extends TournamentAnalyticsQuery {
  metric?: TournamentBowlingLeaderboardMetric;
}

export interface TournamentFieldingLeaderboardQuery extends TournamentAnalyticsQuery {
  metric?: TournamentFieldingLeaderboardMetric;
}

export interface TournamentMvpLeaderboardQuery extends TournamentAnalyticsQuery {}

export interface TournamentHeroesQuery extends TournamentAnalyticsFilters {}

// ─────────────────────────────────────────────────────────────────────────────
// Common response models
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentAnalyticsAppliedFilters {
  teamId: AnalyticsFilterValue;
  roundId: AnalyticsFilterValue;
  groupId: AnalyticsFilterValue;
}

export interface TournamentAnalyticsPagination {
  skip: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface TournamentAnalyticsMetadata {
  includedCompletedMatches: number;
  totalPlayers: number;
  totalTeams: number;
}

export interface TournamentPlayerSnapshot {
  playerId: string;
  playerName: string;
  profileImageUrl: string | null;

  teamId: string;
  teamName: string;
  teamShortName: string | null;
  teamLogoUrl: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cricket stats
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentBattingStats {
  matches: number;
  innings: number;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;

  thirties?: number;
  fifties?: number;
  hundreds?: number;

  highestScore: number;
  dismissals?: number;
  notOuts?: number;

  average: number | null;
  strikeRate: number | null;
}

export interface TournamentBowlingStats {
  matches?: number;
  innings: number;
  overs: string;
  legalBalls: number;
  runsConceded: number;
  wickets: number;
  dotBalls: number;
  maidens: number;

  threeWicketHauls?: number;
  fiveWicketHauls?: number;
  tenWicketHauls?: number;

  bestWicketsInInnings?: number;
  bestRunsConcededInInnings?: number;
  bestOversInInnings?: string;

  economy: number | null;
  average: number | null;
  strikeRate: number | null;
}

export interface TournamentFieldingStats {
  matches?: number;
  catches: number;
  caughtBehind: number;
  stumpings: number;
  runOuts: number;
  wicketKeeperDismissals?: number;
  dismissals: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Overall stats
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentOverallStatsSummary {
  matches: number;
  innings: number;
  runs: number;
  wickets: number;
  legalBalls: number;
  overs: string;
  extras: number;

  fours: number;
  sixes: number;
  thirties: number;
  fifties: number;
  hundreds: number;

  maidens: number;
  dotBalls: number;

  catches: number;
  caughtBehind: number;
  stumpings: number;
  runOuts: number;
  wicketKeeperDismissals: number;
  dismissals: number;

  runRate: number;
  boundaryPercentage: number;
  boundaryFrequency: number;
  dotBallPercentage: number;
  dotBallFrequency: number;
}

export interface TournamentOverallStatsResponse {
  tournamentId: string;
  generatedAt: string;
  source: TournamentAnalyticsSource;
  filters: TournamentAnalyticsAppliedFilters;
  summary: TournamentOverallStatsSummary;
  teams: Record<string, unknown>[];
  metadata: TournamentAnalyticsMetadata;
}

// ─────────────────────────────────────────────────────────────────────────────
// Boundary stats
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentBoundaryStatsItem {
  rank: number;

  playerId: string;
  playerName: string;
  profileImageUrl: string | null;

  teamId: string;
  teamName: string;
  teamShortName: string | null;
  teamLogoUrl: string | null;

  value: number;
  batting: TournamentBattingStats;
}

export interface TournamentBoundaryStatsResponse {
  tournamentId: string;
  type: TournamentBoundaryStatType;
  generatedAt: string;
  source: TournamentAnalyticsSource;
  filters: TournamentAnalyticsAppliedFilters;

  summary: {
    total: number;
    playersWithBoundary: number;
    includedCompletedMatches: number;
  };

  items: TournamentBoundaryStatsItem[];
  pagination: TournamentAnalyticsPagination;
}

// ─────────────────────────────────────────────────────────────────────────────
// Batting leaderboard
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentBattingLeaderboardItem {
  rank: number;
  player: TournamentPlayerSnapshot;
  value: number;
  batting: TournamentBattingStats;
}

export interface TournamentBattingLeaderboardResponse {
  tournamentId: string;
  metric: TournamentBattingLeaderboardMetric;
  generatedAt: string;
  source: TournamentAnalyticsSource;
  filters: TournamentAnalyticsAppliedFilters;
  items: TournamentBattingLeaderboardItem[];
  pagination: TournamentAnalyticsPagination;
  metadata: TournamentAnalyticsMetadata;
}

// ─────────────────────────────────────────────────────────────────────────────
// Bowling leaderboard
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentBowlingLeaderboardItem {
  rank: number;
  player: TournamentPlayerSnapshot;
  value: number;
  bowling: TournamentBowlingStats;
}

export interface TournamentBowlingLeaderboardResponse {
  tournamentId: string;
  metric: TournamentBowlingLeaderboardMetric;
  generatedAt: string;
  source: TournamentAnalyticsSource;
  filters: TournamentAnalyticsAppliedFilters;
  items: TournamentBowlingLeaderboardItem[];
  pagination: TournamentAnalyticsPagination;
  metadata: TournamentAnalyticsMetadata;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fielding leaderboard
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentFieldingLeaderboardItem {
  rank: number;
  player: TournamentPlayerSnapshot;
  value: number;
  fielding: TournamentFieldingStats;
}

export interface TournamentFieldingLeaderboardResponse {
  tournamentId: string;
  metric: TournamentFieldingLeaderboardMetric;
  generatedAt: string;
  source: TournamentAnalyticsSource;
  filters: TournamentAnalyticsAppliedFilters;
  items: TournamentFieldingLeaderboardItem[];
  pagination: TournamentAnalyticsPagination;
  metadata?: TournamentAnalyticsMetadata;
}

// ─────────────────────────────────────────────────────────────────────────────
// MVP leaderboard
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentMvpStats {
  totalMvpPoints: number;
  battingPoints: number;
  bowlingPoints: number;
  fieldingPoints: number;
  penaltyPoints: number;

  breakdown: {
    batting: {
      baseRunPoints: number;
      boundaryBonus: number;
      milestoneBonus: number;
      strikeRateBonus: number;
    };

    bowling: {
      wicketPoints: number;
      dotBallPoints: number;
      maidenPoints: number;
      wicketHaulBonus: number;
      economyBonus: number;
    };

    fielding: {
      catchPoints: number;
      caughtBehindPoints: number;
      stumpingPoints: number;
      runOutPoints: number;
    };

    penalties: {
      duckPenalty: number;
      slowStrikeRatePenalty: number;
      expensiveBowlingPenalty: number;
    };
  };
}

export interface TournamentMvpLeaderboardItem {
  rank: number;
  player: TournamentPlayerSnapshot;
  value: number;
  mvp: TournamentMvpStats;

  batting: {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number | null;
  };

  bowling: {
    overs: string;
    wickets: number;
    runsConceded: number;
    economy: number | null;
    dotBalls: number;
    maidens: number;
  };

  fielding: {
    catches: number;
    stumpings: number;
    runOuts: number;
    dismissals: number;
  };
}

export interface TournamentMvpLeaderboardResponse {
  tournamentId: string;
  section: "MVP";
  metric: "MVP_POINTS";
  formulaVersion: string;
  mvpConfigMode: TournamentMvpConfigMode;
  generatedAt: string;
  source: TournamentAnalyticsSource;
  filters: TournamentAnalyticsAppliedFilters;
  items: TournamentMvpLeaderboardItem[];
  pagination: TournamentAnalyticsPagination;
}

// ─────────────────────────────────────────────────────────────────────────────
// Heroes
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentHeroCard {
  type: TournamentHeroType;
  title: string;
  subtitle: string;
  metricLabel: string;
  value: number;
  hasWinner: boolean;
  player: TournamentPlayerSnapshot | null;

  stats: {
    batting: TournamentBattingStats;
    bowling: TournamentBowlingStats;
    fielding: TournamentFieldingStats;
  } | null;
}

export interface TournamentHeroesResponse {
  tournamentId: string;
  generatedAt: string;
  source: TournamentAnalyticsSource;
  filters: TournamentAnalyticsAppliedFilters;
  cards: TournamentHeroCard[];

  grouped: {
    batting: TournamentHeroCard[];
    bowling: TournamentHeroCard[];
    fielding: TournamentHeroCard[];
    mvp: TournamentHeroCard[];
  };

  metadata: TournamentAnalyticsMetadata & {
    mvpConfigMode: TournamentMvpConfigMode;
    mvpFormulaVersion: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI types
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentLeaderboardTeamOption {
  id: string;
  name: string;
  shortName?: string | null;
}
