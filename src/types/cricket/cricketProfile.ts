// src/types/cricketProfile.ts

import { Match } from "./match";
import type { BattingStyle, BowlingStyle, PlayerRole } from "../player";

export type Nullable<T> = T | null;

// ─── Profile enums ────────────────────────────────────────────────────────────

export type OwnershipStatus = "CLAIMED" | "UNCLAIMED" | "GUEST";

// ─── Profile header ───────────────────────────────────────────────────────────

export type CricketProfileHeader = {
  displayName: string;
  username: Nullable<string>;
  profileImageUrl: Nullable<string>;
  city: Nullable<string>;
  bio: Nullable<string>;

  playerRole: Nullable<PlayerRole>;
  battingStyle: Nullable<BattingStyle>;
  bowlingStyle: Nullable<BowlingStyle>;

  ownershipStatus: OwnershipStatus;
  isClaimed: boolean;
  isProfileCompleted: boolean;
};

// ─── Counts ───────────────────────────────────────────────────────────────────

export type CricketProfileCounts = {
  matches: number;
  teams: number;
  tournaments: number;
  awards: number;
  badges: number;
  trophies: number;
};

// ─── Analytics summary ────────────────────────────────────────────────────────

export type CricketProfileAdvancedAnalyticsSummary = {
  available: boolean;
  wagonWheelAvailable: boolean;
  shotAnalyticsAvailable: boolean;
  bowlingAngleAnalyticsAvailable: boolean;

  dominantScoringZone: Nullable<string>;
  mostProductiveShot: Nullable<string>;
  mostEffectiveBowlingAngle: Nullable<string>;

  insightsCount: number;
};

// ─── GET /cricket-profile/me ──────────────────────────────────────────────────

export type CricketProfile = {
  playerId: string;
  isOwnProfile: boolean;

  header: CricketProfileHeader;
  counts: CricketProfileCounts;

  advancedAnalyticsSummary: CricketProfileAdvancedAnalyticsSummary;
};

// ─── Match history enums ──────────────────────────────────────────────────────

export type CricketProfileCompetitionType =
  | "TOURNAMENT"
  | "SERIES"
  | "STANDALONE";

export type CricketProfileMatchOutcome =
  | "WIN"
  | "LOSS"
  | "DRAW"
  | "TIE"
  | "NO_RESULT";

export type CricketProfileMatchType = "LIMITED_OVERS" | "TEST" | "THE_HUNDRED";

export type CricketProfileBallType =
  | "TENNIS"
  | "LEATHER"
  | "RUBBER"
  | "PLASTIC";

export type CricketProfilePitchType =
  | "TURF"
  | "CEMENT"
  | "MAT"
  | "ASTRO_TURF"
  | "OTHER";

// ─── Match history models ─────────────────────────────────────────────────────

export type CricketProfileMatchCompetition = {
  type: CricketProfileCompetitionType;
  label: Nullable<string>;
  name: Nullable<string>;
  locationLabel: Nullable<string>;
};

export type CricketProfileMatchInfo = {
  date: string;
  oversLimit: Nullable<number>;

  matchType: CricketProfileMatchType;
  matchTypeLabel: string;

  ballType: CricketProfileBallType;

  city: Nullable<string>;
  groundName: Nullable<string>;
  pitchType: Nullable<CricketProfilePitchType>;
};

export type CricketProfileMatchTeam = {
  teamId: string;
  name: string;

  shortName: Nullable<string>;
  logoUrl: Nullable<string>;

  score: Nullable<string>;
  overs: Nullable<string>;

  isRepresentedTeam: boolean;
};

export type CricketProfileMatchActions = {
  resultAvailable: boolean;
  insightsAvailable: boolean;
  tableAvailable: boolean;
  leaderboardAvailable: boolean;
};

export type CricketProfileMatch = {
  matchId: string;

  competition: CricketProfileMatchCompetition;
  matchInfo: CricketProfileMatchInfo;

  teamA: CricketProfileMatchTeam;
  teamB: CricketProfileMatchTeam;

  outcome: CricketProfileMatchOutcome;
  resultText: Nullable<string>;

  actions: CricketProfileMatchActions;
};

// ─── Match history response ───────────────────────────────────────────────────

export type CricketProfileMatchesPagination = {
  skip: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type CricketProfileMatchesResponse = {
  items: CricketProfileMatch[];
  pagination: CricketProfileMatchesPagination;
};

export type GetMyCricketProfileMatchesQuery = {
  skip?: number;
  limit?: number;
};

export type GetMyCricketProfileMatchesResponse = {
  items: Match[];

  pagination: {
    skip: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
};

// ─── Cricket profile stats ────────────────────────────────────────────────────

export type CricketProfileStatsCategory =
  | "BATTING"
  | "BOWLING"
  | "FIELDING"
  | "CAPTAINCY";

export type CricketProfileStatsSectionKey = "OVERALL" | string;

export type CricketProfileStatsFilters = Record<string, unknown> | null;

// ─── Batting stats ────────────────────────────────────────────────────────────

export type CricketProfileBattingStats = {
  matches: number;
  innings: number;
  runs: number;
  balls: number;

  highestScore: number;
  highestScoreNotOut: boolean;

  average: number;
  strikeRate: number;

  notOuts: number;
  dotBalls: number;

  fours: number;
  sixes: number;

  thirties: number;
  fifties: number;
  hundreds: number;

  ducks: number;
};

// ─── Bowling stats ────────────────────────────────────────────────────────────

export type CricketProfileBowlingStats = {
  matches: number;
  innings: number;

  overs: string;
  legalBalls: number;

  maidens: number;
  runsConceded: number;
  wickets: number;

  bestBowling: string;

  economy: number;
  strikeRate: number;
  average: number;

  wides: number;
  noBalls: number;
  dotBalls: number;

  foursConceded: number;
  sixesConceded: number;

  threeWicketHauls: number;
  fiveWicketHauls: number;
  tenWicketHauls: number;
};

// ─── Fielding stats ───────────────────────────────────────────────────────────

export type CricketProfileFieldingStats = {
  matches: number;

  catches: number;
  caughtBehind: number;
  stumpings: number;

  runOutInvolvements: number;
  wicketKeeperDismissals: number;
  totalDismissals: number;
};

// ─── Captaincy stats ──────────────────────────────────────────────────────────

export type CricketProfileCaptaincyStats = {
  matchesCaptained: number;
  matchesWithTossData: number;

  tossesWon: number;

  wins: number;
  losses: number;

  ties: number;
  draws: number;
  noResults: number;

  winPercentage: number;
  tossWinPercentage: number;
};

// ─── Stats sections ───────────────────────────────────────────────────────────

export type CricketProfileBattingStatsSection = {
  key: CricketProfileStatsSectionKey;
  label: string;
  filters: CricketProfileStatsFilters;
  stats: CricketProfileBattingStats;
};

export type CricketProfileBowlingStatsSection = {
  key: CricketProfileStatsSectionKey;
  label: string;
  filters: CricketProfileStatsFilters;
  stats: CricketProfileBowlingStats;
};

export type CricketProfileFieldingStatsSection = {
  key: CricketProfileStatsSectionKey;
  label: string;
  filters: CricketProfileStatsFilters;
  stats: CricketProfileFieldingStats;
};

export type CricketProfileCaptaincyStatsSection = {
  key: CricketProfileStatsSectionKey;
  label: string;
  filters: CricketProfileStatsFilters;
  stats: CricketProfileCaptaincyStats;
};

// ─── Stats API responses ──────────────────────────────────────────────────────

export type CricketProfileBattingStatsResponse = {
  playerId: string;
  category: "BATTING";
  sections: CricketProfileBattingStatsSection[];
};

export type CricketProfileBowlingStatsResponse = {
  playerId: string;
  category: "BOWLING";
  sections: CricketProfileBowlingStatsSection[];
};

export type CricketProfileFieldingStatsResponse = {
  playerId: string;
  category: "FIELDING";
  sections: CricketProfileFieldingStatsSection[];
};

export type CricketProfileCaptaincyStatsResponse = {
  playerId: string;
  category: "CAPTAINCY";
  sections: CricketProfileCaptaincyStatsSection[];
};

export type CricketProfileStatsResponse =
  | CricketProfileBattingStatsResponse
  | CricketProfileBowlingStatsResponse
  | CricketProfileFieldingStatsResponse
  | CricketProfileCaptaincyStatsResponse;

// ─── Trophies ─────────────────────────────────────────────────────────────────

export type CricketProfileTrophyScope = "MATCHES" | "TOURNAMENTS";

/**
 * The backend documentation says this enum may grow in the future,
 * so keep known values while allowing unknown values.
 */
export type CricketProfileAchievementType =
  | "PLAYER_OF_THE_MATCH"
  | "BEST_BATTER"
  | "BEST_BOWLER"
  | "BEST_FIELDER"
  | "TOURNAMENT_WINNER"
  | "TOURNAMENT_RUNNER_UP"
  | "MOST_RUNS"
  | "MOST_WICKETS"
  | "MOST_CATCHES"
  | "OTHER"
  | (string & {});

export type CricketProfileTrophyTheme =
  | "RED"
  | "GREEN"
  | "BLUE"
  | "GOLD"
  | "PURPLE"
  | "ORANGE"
  | (string & {});

export type CricketProfileTrophyBattingSnapshot = {
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
};

export type CricketProfileTrophyBowlingSnapshot = {
  overs: string;
  runsConceded: number;
  wickets: number;
  economy: number;
};

export type CricketProfileTrophyPerformanceSnapshot = {
  batting: Nullable<CricketProfileTrophyBattingSnapshot>;
  bowling: Nullable<CricketProfileTrophyBowlingSnapshot>;
};

export type CricketProfileTrophyItem = {
  achievementId: string;
  type: CricketProfileAchievementType;
  scope: CricketProfileTrophyScope;

  title: string;
  description: Nullable<string>;
  theme: Nullable<CricketProfileTrophyTheme>;

  matchId: Nullable<string>;
  tournamentId: Nullable<string>;
  teamId: Nullable<string>;

  awardedAt: Nullable<string>;

  performanceSnapshot: Nullable<CricketProfileTrophyPerformanceSnapshot>;
};

export type CricketProfileTrophyPagination = {
  skip: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type CricketProfileTrophyEmptyState = {
  code: string;
  message: string;
};

export type CricketProfileTrophiesResponse = {
  playerId: string;
  scope: CricketProfileTrophyScope;
  items: CricketProfileTrophyItem[];
  pagination: CricketProfileTrophyPagination;
  emptyState: Nullable<CricketProfileTrophyEmptyState>;
};

export type GetMyCricketProfileTrophiesQuery = {
  scope: CricketProfileTrophyScope;
  skip?: number;
  limit?: number;
};

// ─── Badges ───────────────────────────────────────────────────────────────────

export type CricketProfileBadgeCategory = "BATTING" | "BOWLING" | "FIELDING";

export type CricketProfileBadgeFormat =
  | "LIMITED_OVERS"
  | "TEST"
  | "BOX_CRICKET"
  | (string & {});

export type CricketProfileBadgeItem = {
  badgeId: string;
  name: string;
  description: Nullable<string>;

  threshold: number;
  currentValue: number;

  isUnlocked: boolean;
  unlockedAt: Nullable<string>;

  repeatCount: number;
  imageKey: Nullable<string>;
};

export type CricketProfileBadgeGroup = {
  key: string;
  label: string;

  currentValue: number;

  unlockedCount: number;
  totalCount: number;

  badges: CricketProfileBadgeItem[];
};

export type CricketProfileBadgeSection = {
  matchFormat: CricketProfileBadgeFormat;
  label: string;
  groups: CricketProfileBadgeGroup[];
};

export type CricketProfileBadgeEmptyState = {
  code: string;
  message: string;
};

export type CricketProfileBadgesResponse = {
  playerId: string;
  category: CricketProfileBadgeCategory;

  sections: CricketProfileBadgeSection[];

  emptyState: Nullable<CricketProfileBadgeEmptyState>;
};
