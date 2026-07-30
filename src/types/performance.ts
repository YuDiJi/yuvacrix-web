// src/types/performance.ts

// ─────────────────────────────────────────────────────────────────────────────
// Shared enums
// ─────────────────────────────────────────────────────────────────────────────

export type OwnershipStatus = "GUEST" | "CLAIMED";

export type PlayerRole = "BATTER" | "BOWLER" | "ALL_ROUNDER" | "WICKET_KEEPER";

export type BattingStyle = "RIGHT_HAND_BAT" | "LEFT_HAND_BAT";

export type BowlingStyle =
  | "RIGHT_ARM_FAST"
  | "RIGHT_ARM_MEDIUM"
  | "RIGHT_ARM_OFF_SPIN"
  | "RIGHT_ARM_LEG_SPIN"
  | "LEFT_ARM_FAST"
  | "LEFT_ARM_MEDIUM"
  | "LEFT_ARM_ORTHODOX"
  | "LEFT_ARM_CHINAMAN";

export type BowlingStyleCategory = "PACE" | "SPIN";

export type BowlingStyleSource =
  | "CURRENT_PLAYER_PROFILE"
  | "HISTORICAL_SNAPSHOT";

export type MatchType =
  | "LIMITED_OVERS"
  | "BOX_TURF"
  | "PAIR_CRICKET"
  | "TEST"
  | "THE_HUNDRED";

export type BallType = "TENNIS" | "LEATHER" | "OTHER";

export type PitchType =
  | "ROUGH"
  | "CEMENT"
  | "TURF"
  | "ASTROTURF"
  | "MATTING"
  | "OTHER";

export type CompetitionType = "STANDALONE" | "SERIES" | "TOURNAMENT";

export type CoverageQuality =
  | "COMPLETE"
  | "PARTIAL"
  | "INSUFFICIENT"
  | "UNAVAILABLE";

export type BattingAnalysisSection =
  | "BOWLING_STYLE"
  | "PACE_SPIN"
  | "BOWLING_ANGLE"
  | "SHOTS"
  | "WAGON_WHEEL";

export type BowlingAnalysisSection =
  | "BOWLING_ANGLE"
  | "WAGON_WHEEL"
  | "SHOT_IMPACT"
  | "BATTING_POSITION_WICKETS";

export type BattingPositionGroup =
  | "TOP_ORDER"
  | "MIDDLE_ORDER"
  | "LOWER_ORDER"
  | "TAIL"
  | "UNKNOWN";

export type ComparisonLeader = "PLAYER_A" | "PLAYER_B" | "TIE" | "UNAVAILABLE";

export type ComparisonMetricDirection = "HIGHER_IS_BETTER" | "LOWER_IS_BETTER";

export type BowlingAngle =
  | "OVER_THE_WICKET"
  | "BETWEEN_THE_WICKET"
  | "ROUND_THE_WICKET";

export type FieldZone =
  | "THIRD_MAN"
  | "DEEP_FINE_LEG"
  | "FINE_LEG"
  | "SQUARE_LEG"
  | "DEEP_SQUARE_LEG"
  | "MID_WICKET"
  | "DEEP_MID_WICKET"
  | "LONG_ON"
  | "LONG_OFF"
  | "COVER"
  | "DEEP_COVER"
  | "POINT"
  | "DEEP_POINT";

export type ShotType =
  | "FLICK"
  | "PULL"
  | "PUNCH"
  | "DEFENCE"
  | "INSIDE_EDGE"
  | "SWEEP"
  | "LEG_GLANCE"
  | "TOP_EDGE"
  | "HOOK"
  | "DILSCOOP_RAMP"
  | "NONE_OF_THE_ABOVE";

export type WicketType =
  | "BOWLED"
  | "CAUGHT"
  | "CAUGHT_BEHIND"
  | "CAUGHT_AND_BOWLED"
  | "RUN_OUT"
  | "LBW"
  | "STUMPED"
  | "RETIRED_HURT"
  | "MANKADED"
  | "HIT_WICKET"
  | "ABSENT_HURT"
  | "RETIRED_OUT"
  | "HIT_BALL_TWICE"
  | "OBSTRUCTING_FIELD"
  | "TIMED_OUT"
  | "RETIRED";

export type ExtraType = "WIDE" | "NO_BALL" | "BYE" | "LEG_BYE" | "PENALTY";

// ─────────────────────────────────────────────────────────────────────────────
// Query parameters
// ─────────────────────────────────────────────────────────────────────────────

export type PerformanceFilters = {
  teamId?: string;
  tournamentId?: string;
  seriesId?: string;
  year?: number;
  matchType?: MatchType;
  ballType?: BallType;
  competitionType?: CompetitionType;
  pitchType?: PitchType;
  inningsNumber?: 1 | 2;
};

export type PlayerSearchQuery = {
  search: string;
  limit?: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared response types
// ─────────────────────────────────────────────────────────────────────────────

export type PerformancePlayer = {
  playerId: string;
  displayName: string;
  username: string | null;
  profileImageUrl: string | null;
  city: string | null;
  playerRole: PlayerRole | null;
  battingStyle: BattingStyle | null;
  bowlingStyle: BowlingStyle | null;
  bowlingStyleCategory?: BowlingStyleCategory | null;
  bowlingStyleSource?: BowlingStyleSource | null;
  ownershipStatus?: OwnershipStatus;
};

export type CoverageDetails = {
  eligibleEvents: number;
  recordedEvents: number;
  missingEvents: number;
  percentage: number;
  quality: CoverageQuality;
};

export type PerformanceCounts = {
  matches: number;
  teams: number;
  tournaments: number;
  awards: number;
  badges: number;
  trophies: number;
};

export type CommonPerformanceMetadata = {
  includedCompletedMatches: number;
  generatedAt?: string;
  source: string;
  version: string;
  completedMatchesOnly: boolean;
  activeBallEventsOnly: boolean;
};

export type PerformanceErrorResponse = {
  statusCode: number;
  message: string | string[];
  error?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Performance shell
// GET /cricket-profile/me/performance
// ─────────────────────────────────────────────────────────────────────────────

export type PerformanceTabs = {
  battingAvailable: boolean;
  bowlingAvailable: boolean;
  compareAvailable: boolean;
  faceOffAvailable: boolean;
};

export type PerformanceHeadline = {
  counts: PerformanceCounts;

  /**
   * The documentation currently shows these objects without their complete
   * internal contracts. They can be tightened when the backend sends a real
   * response.
   */
  batting: Record<string, unknown>;
  bowling: Record<string, unknown>;
  recentBattingForm: Record<string, unknown>;
};

export type PerformanceShellMetadata = CommonPerformanceMetadata & {
  supportedInningsNumbers: Array<1 | 2>;
};

export type PerformanceShellResponse = {
  player: PerformancePlayer;
  tabs: PerformanceTabs;
  headline: PerformanceHeadline;
  coverage: {
    wagonWheel: CoverageDetails;
    shots: CoverageDetails;
    bowlingAngle: CoverageDetails;
  };
  metadata: PerformanceShellMetadata;
};

// ─────────────────────────────────────────────────────────────────────────────
// Batting reliable analytics
// ─────────────────────────────────────────────────────────────────────────────

export type BattingOverallStats = {
  matches: number;
  innings: number;
  runs: number;
  balls: number;
  highestScore: number;
  highestScoreNotOut: boolean;
  dismissals: number;
  notOuts: number;
  average: number | null;
  strikeRate: number | null;
  dotBalls: number;
  fours: number;
  sixes: number;
  thirties: number;
  fifties: number;
  hundreds: number;
  ducks: number;
};

export type BattingRecentInnings = {
  matchId: string;
  inningsId: string;
  inningsNumber: 1 | 2;

  teamId: string;
  opponentTeamId: string;

  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;

  isOut: boolean;
  isNotOut: boolean;
  dismissalType: WicketType | null;

  battingOrder: number | null;
  completedAt: string;

  representedTeamName: string;
  opponentTeamName: string;
};

export type BattingCurrentForm = {
  inningsConsidered: number;
  runs: number;
  balls: number;
  dismissals: number;
  notOuts: number;
  average: number | null;
  strikeRate: number | null;
  fours: number;
  sixes: number;
  recentInnings: BattingRecentInnings[];
};

export type BattingYearlyStats = BattingOverallStats & {
  year: number;
};

export type BattingByMatchInnings = {
  inningsNumber: 1 | 2;
  matches: number;
  innings: number;
  runs: number;
  balls: number;
  dismissals: number;
  notOuts: number;
  average: number | null;
  strikeRate: number | null;
  fours: number;
  sixes: number;
};

export type BattingByPitchType = {
  pitchType: PitchType;
  matches: number;
  innings: number;
  runs: number;
  balls: number;
  dismissals: number;
  average: number | null;
  strikeRate: number | null;
  fours: number;
  sixes: number;
};

export type BattingDismissalItem = {
  dismissalType: WicketType;
  dismissals: number;
  percentage: number;
};

export type BattingDismissals = {
  totalDismissals: number;
  items: BattingDismissalItem[];
};

export type BattingRunComposition = {
  totalRecordedEvents: number;
  dots: number;
  ones: number;
  twos: number;
  threes: number;
  fours: number;
  sixes: number;
  other: number;
};

export type PerformanceFiltersApplied = {
  teamId: string | null;
  tournamentId: string | null;
  seriesId: string | null;
  year: number | null;
  matchType: MatchType | null;
  ballType: BallType | null;
  competitionType: CompetitionType | null;
  pitchType: PitchType | null;
  inningsNumber: 1 | 2 | null;
};

export type BattingPerformanceMetadata = CommonPerformanceMetadata & {
  includedBattingInnings: number;
  filtersApplied: PerformanceFiltersApplied;
};

export type BattingPerformanceResponse = {
  playerId: string;
  overall: BattingOverallStats;
  currentForm: BattingCurrentForm;
  yearly: BattingYearlyStats[];
  byMatchInnings: BattingByMatchInnings[];
  byPitchType: BattingByPitchType[];
  dismissals: BattingDismissals;
  runComposition: BattingRunComposition;
  metadata: BattingPerformanceMetadata;
};

// ─────────────────────────────────────────────────────────────────────────────
// Batting conditional analytics
// ─────────────────────────────────────────────────────────────────────────────

export type BattingPaceSpinItem = {
  category: BowlingStyleCategory;
  deliveries: number;
  balls: number;
  runs: number;
  dismissals: number;
  dotBalls: number;
  fours: number;
  sixes: number;
  strikeRate: number | null;
  average: number | null;
};

export type BattingPaceSpinData = {
  styleSource: BowlingStyleSource;
  historicalSnapshotAvailable: boolean;
  eligibleEvents: number;
  classifiedEvents: number;
  items: BattingPaceSpinItem[];
};

export type BattingBowlingStyleItem = {
  bowlingStyle: BowlingStyle;
  deliveries: number;
  balls: number;
  runs: number;
  dismissals: number;
  dotBalls: number;
  fours: number;
  sixes: number;
  strikeRate: number | null;
  average: number | null;
};

export type BattingBowlingStyleData = {
  styleSource: BowlingStyleSource;
  historicalSnapshotAvailable: boolean;
  eligibleEvents: number;
  classifiedEvents: number;
  items: BattingBowlingStyleItem[];
};

export type BattingBowlingAngleItem = {
  angle: BowlingAngle;
  deliveries: number;
  balls: number;
  runs: number;
  dismissals: number;
  dotBalls: number;
  fours: number;
  sixes: number;
  strikeRate: number | null;
  average: number | null;
};

export type BattingBowlingAngleData = {
  recordedEvents: number;
  items: BattingBowlingAngleItem[];
};

export type BattingShotTypeItem = {
  shotType: ShotType;
  deliveries: number;
  balls?: number;
  runs: number;
  dotBalls?: number;
  fours: number;
  sixes: number;
  strikeRate?: number | null;
  percentage?: number;
};

export type BattingFieldZoneItem = {
  fieldZone: FieldZone;
  deliveries?: number;
  balls?: number;
  runs: number;
  fours: number;
  sixes: number;
  percentage?: number;
};

export type BattingShotsData = {
  recordedEvents: number;
  totalRuns: number;
  byShotType: BattingShotTypeItem[];
  byFieldZone: BattingFieldZoneItem[];
};

export type WagonWheelPoint = {
  x: number;
  y: number;
  runs: number;
  fieldZone?: FieldZone | null;
  shotType?: ShotType | null;
};

export type WagonWheelZone = {
  fieldZone: FieldZone;
  deliveries?: number;
  runs: number;
  fours: number;
  sixes: number;
  percentage?: number;
};

export type BattingWagonWheelData = {
  recordedEvents: number;
  totalRuns: number;
  points: WagonWheelPoint[];
  zones: WagonWheelZone[];
};

export type ConditionalAnalyticsMetadata = CommonPerformanceMetadata;

export type BattingAnalysisDataMap = {
  BOWLING_STYLE: BattingBowlingStyleData;
  PACE_SPIN: BattingPaceSpinData;
  BOWLING_ANGLE: BattingBowlingAngleData;
  SHOTS: BattingShotsData;
  WAGON_WHEEL: BattingWagonWheelData;
};

export type BattingAnalysisResponse<
  TSection extends BattingAnalysisSection = BattingAnalysisSection,
> = {
  playerId: string;
  section: TSection;
  coverage: CoverageDetails;
  data: BattingAnalysisDataMap[TSection];
  metadata: ConditionalAnalyticsMetadata;
};

// ─────────────────────────────────────────────────────────────────────────────
// Bowling reliable analytics
// ─────────────────────────────────────────────────────────────────────────────

export type BestBowlingFigures = {
  wickets: number;
  runsConceded: number;
  legalBalls: number;
  overs: string;
  display: string;
};

export type BowlingOverallStats = {
  matches: number;
  innings: number;
  legalBalls: number;
  overs: string;
  maidens: number;
  runsConceded: number;
  wickets: number;
  bestBowling: BestBowlingFigures | null;
  economy: number | null;
  average: number | null;
  strikeRate: number | null;
  dotBalls: number;
  wides: number;
  noBalls: number;
  foursConceded: number;
  sixesConceded: number;
  threeWicketHauls: number;
  fiveWicketHauls: number;
  tenWicketHauls: number;
};

export type BowlingExtraSummary = {
  deliveries: number;
  runs: number;
};

export type BowlingPerformanceMetadata = CommonPerformanceMetadata & {
  includedBowlingInnings: number;
  filtersApplied?: PerformanceFiltersApplied;
};

// ─────────────────────────────────────────────────────────────────────────────
// Bowling conditional analytics
// ─────────────────────────────────────────────────────────────────────────────

export type BowlingAngleAnalysisItem = {
  angle: BowlingAngle;
  deliveries: number;
  legalBalls: number;
  runsConceded: number;
  wickets: number;
  dotBalls: number;
  boundariesConceded: number;
  economy: number | null;
  bowlingStrikeRate: number | null;
  dotBallPercentage: number | null;
};

export type BowlingAngleAnalysisData = {
  recordedEvents: number;
  items: BowlingAngleAnalysisItem[];
};

export type BattingPositionWicketItem = {
  battingOrder: number;
  label: string;
  wickets: number;
  percentage: number;
};

export type BattingPositionGroupItem = {
  group: BattingPositionGroup;
  label: string;
  wickets: number;
  percentage: number;
};

export type BattingPositionWicketsData = {
  eligibleWicketEvents: number;
  classifiedWicketEvents: number;
  byPosition: BattingPositionWicketItem[];
  byGroup: BattingPositionGroupItem[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Player search
// ─────────────────────────────────────────────────────────────────────────────

export type PerformancePlayerSearchItem = {
  playerId: string;
  fullName: string;
  profileImageUrl: string | null;
  city: string | null;
  playerRole: PlayerRole | null;
  battingStyle: BattingStyle | null;
  bowlingStyle: BowlingStyle | null;
  ownershipStatus: OwnershipStatus;
};

export type PerformancePlayerSearchResponse = {
  items: PerformancePlayerSearchItem[];
  metadata: {
    search: string;
    limit: number;
    returned: number;
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Compare
// ─────────────────────────────────────────────────────────────────────────────

export type ComparisonPlayerIdentity = {
  playerId: string;
  displayName: string;
  username?: string | null;
  profileImageUrl: string | null;
  city: string | null;
  playerRole: PlayerRole | null;
  battingStyle: BattingStyle | null;
  bowlingStyle: BowlingStyle | null;
};

export type ComparisonParticipation = {
  matches?: number;
  teams?: number;
  tournaments?: number;
  series?: number;
};

export type ComparisonPlayerData = {
  identity: ComparisonPlayerIdentity;
  participation: ComparisonParticipation;

  /**
   * The documentation only defines the top-level comparison structure for
   * these sections. These can be replaced with strict types after receiving
   * the actual response.
   */
  batting: Partial<BattingOverallStats>;
  bowling: Partial<BowlingOverallStats>;
  fielding: Record<string, unknown>;
  captaincy: Record<string, unknown>;
  recentBattingForm: Partial<BattingCurrentForm>;
  yearlyBatting: BattingYearlyStats[];
  yearlyBowling: BowlingYearlyStats[];
};

export type ComparisonMetric = {
  key: string;
  label: string;
  playerAValue: number | null;
  playerBValue: number | null;
  displayPlayerAValue: string;
  displayPlayerBValue: string;
  direction: ComparisonMetricDirection;
  leader: ComparisonLeader;
};

export type ComparisonScore = {
  playerAWins: number;
  playerBWins: number;
  ties: number;
  unavailable: number;
  overallLeader: ComparisonLeader;
};

export type PlayerComparisonResponse = {
  playerA: ComparisonPlayerData;
  playerB: ComparisonPlayerData;
  metrics: ComparisonMetric[];
  score: ComparisonScore;
  metadata: {
    includedCompletedMatches: {
      playerA: number;
      playerB: number;
    };
    source: string;
    version: string;
    completedMatchesOnly: boolean;
    activeBallEventsOnly: boolean;
    samePlayerComparison: boolean;
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Face Off
// ─────────────────────────────────────────────────────────────────────────────

export type FaceOffPlayer = {
  playerId: string;
  displayName: string;
  username: string | null;
  profileImageUrl: string | null;
  city: string | null;
  playerRole: PlayerRole | null;
  battingStyle: BattingStyle | null;
  bowlingStyle: BowlingStyle | null;
};

export type FaceOffBattingVsBowling = {
  batterId: string;
  bowlerId: string;
  matches: number;
  innings: number;
  deliveries: number;
  balls: number;
  runs: number;
  dismissals: number;
  dotBalls: number;
  fours: number;
  sixes: number;
  boundaries: number;
  strikeRate: number;
  average: number | null;
  dotBallPercentage: number | null;
  boundaryPercentage: number | null;
};

export type FaceOffRecentEncounter = {
  matchId: string;
  inningsId: string;
  completedAt: string;
  batterId: string;
  bowlerId: string;
  balls: number;
  runs: number;
  dismissals: number;
  dotBalls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
};

export type PlayerFaceOffResponse = {
  playerA: FaceOffPlayer;
  playerB: FaceOffPlayer;
  playerABattingVsPlayerBBowling: FaceOffBattingVsBowling;
  playerBBattingVsPlayerABowling: FaceOffBattingVsBowling;
  commonMatches: {
    total: number;
    matchIds: string[];
  };
  recentEncounters: FaceOffRecentEncounter[];
  metadata: {
    includedCompletedMatches: number;
    source: string;
    version: string;
    completedMatchesOnly: boolean;
    activeBallEventsOnly: boolean;
    formulas: {
      ballsFaced: string;
      batterDismissal: string;
      strikeRate: string;
    };
  };
};

// Merge these additions into src/types/performance.ts

export type BowlingBestFigure = {
  wickets: number;
  runsConceded: number;
  legalBalls: number;
  overs: string;
  display: string;
};

export type BowlingStats = {
  matches: number;
  innings: number;
  legalBalls: number;
  overs: string;
  maidens: number;
  runsConceded: number;
  wickets: number;
  bestBowling: BowlingBestFigure | null;
  economy: number | null;
  average: number | null;
  strikeRate: number | null;
  dotBalls: number;
  wides: number;
  noBalls: number;
  foursConceded: number;
  sixesConceded: number;
  threeWicketHauls: number;
  fiveWicketHauls: number;
  tenWicketHauls: number;
};

export type BowlingYearlyStats = {
  key: string;
  label: string;
  year: number;
  stats: BowlingStats;
};

export type BowlingByMatchInnings = {
  key: string;
  label: string;
  inningsNumber: 1 | 2;
  stats: BowlingStats;
};

export type BowlingByPitchType = {
  key: string;
  label: string;
  pitchType: "ROUGH" | "CEMENT" | "TURF" | "ASTROTURF" | "MATTING" | "OTHER";
  stats: BowlingStats;
};

export type BowlingWicketTypeItem = {
  wicketType: WicketType;
  wickets: number;
  percentage: number;
};

export type BowlingWicketTypes = {
  totalWickets: number;
  items: BowlingWicketTypeItem[];
};

export type BowlingRunComposition = {
  totalDeliveries: number;
  totalLegalBalls: number;
  dots: number;
  ones: number;
  twos: number;
  threes: number;
  fours: number;
  sixes: number;
  other: number;
};

export type BowlingExtraItem = {
  extraType: "WIDE" | "NO_BALL";
  deliveries: number;
  runs: number;
};

export type BowlingExtras = {
  totalExtraDeliveries: number;
  totalExtraRuns: number;
  wides: { deliveries: number; runs: number };
  noBalls: { deliveries: number; runs: number };
  items: BowlingExtraItem[];
};

export type BowlingPerformanceResponse = {
  playerId: string;
  overall: BowlingStats;
  yearly: BowlingYearlyStats[];
  byMatchInnings: BowlingByMatchInnings[];
  byPitchType: BowlingByPitchType[];
  wicketTypes: BowlingWicketTypes;
  runComposition: BowlingRunComposition;
  extras: BowlingExtras;
  metadata: {
    includedCompletedMatches: number;
    includedBowlingInnings: number;
    generatedAt: string;
    source: string;
    version: string;
    completedMatchesOnly: boolean;
    activeBallEventsOnly: boolean;
    formulas: Record<string, string>;
    filtersApplied: Record<string, string | number | null>;
  };
};

export type BowlingRecentInnings = {
  matchId: string;
  inningsId: string;
  inningsNumber: 1 | 2;
  representedTeamName: string;
  opponentTeamName: string;
  legalBalls: number;
  overs: string;
  maidens: number;
  runsConceded: number;
  wickets: number;
  completedAt: string;
};

export type BowlingCoverage = {
  eligibleEvents: number;
  recordedEvents: number;
  missingEvents: number;
  percentage: number;
  quality: "COMPLETE" | "PARTIAL" | "INSUFFICIENT" | "UNAVAILABLE";
};

export type BowlingAngleItem = {
  angle: string;
  wickets: number;
  runsConceded: number;
  balls: number;
  economy: number | null;
  average: number | null;
};

export type BowlingAngleData = {
  items: BowlingAngleItem[];
};

export type BowlingShotImpactItem = {
  shotType: string;
  wickets: number;
};

export type BowlingShotImpactData = {
  items: BowlingShotImpactItem[];
};

export type BowlingBattingPositionItem = {
  key: string;
  label: string;
  group: string;
  wickets: number;
  percentage: number;
};

export type BowlingBattingPositionData = {
  items: BowlingBattingPositionItem[];
};

export type BowlingWagonWheelPoint = {
  x: number;
  y: number;
  runs: number;
};

export type BowlingWagonWheelData = {
  recordedEvents: number;
  totalRuns: number;
  points: BowlingWagonWheelPoint[];
  zones: Array<{
    fieldZone: string;
    events: number;
    runs: number;
    percentage: number;
  }>;
};

export type BowlingAnalysisDataMap = {
  BOWLING_ANGLE: BowlingAngleData;
  WAGON_WHEEL: BowlingWagonWheelData;
  SHOT_IMPACT: BowlingShotImpactData;
  BATTING_POSITION_WICKETS: BowlingBattingPositionData;
};

export type BowlingAnalysisResponse<T extends BowlingAnalysisSection> = {
  playerId: string;
  section: T;
  coverage: BowlingCoverage;
  data: BowlingAnalysisDataMap[T];
  metadata: {
    includedCompletedMatches: number;
    source: string;
    version: string;
    completedMatchesOnly: boolean;
    activeBallEventsOnly: boolean;
  };
};
