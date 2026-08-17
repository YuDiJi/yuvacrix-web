export type MatchRulesPresetKey =
  | "LIMITED_OVERS_STANDARD"
  | "T20_STANDARD"
  | "ODI_STANDARD"
  | "BOX_TURF_STANDARD"
  | "CUSTOM";

export type MatchRulesSourceLevel = "PRESET" | "TOURNAMENT" | "ROUND" | "MATCH";

export type MatchRulesPresetReference = {
  key: MatchRulesPresetKey;
  version: number;
};

export type MatchRulesSnapshot = {
  schemaVersion: 1;
  preset: MatchRulesPresetReference;
  format: {
    inningsPerTeam: 1;
    oversPerInnings: number;
    ballsPerOver: number;
    playingPlayers: number | null;
    wicketsToEndInnings: number | null;
  };
  bowling: {
    maxOversPerBowler: number;
    consecutiveOversAllowed: boolean;
    minimumDistinctBowlers: number | null;
    additionalOverBowlerLimit: number | null;
  };
  extras: {
    wide: { enabled: boolean; runs: number; countsAsLegalDelivery: boolean };
    noBall: {
      enabled: boolean;
      runs: number;
      countsAsLegalDelivery: boolean;
      freeHitEnabled: boolean;
    };
    byesEnabled: boolean;
    legByesEnabled: boolean;
  };
  batting: {
    rotateStrikeOnOddRuns: boolean;
    rotateStrikeAtOverEnd: boolean;
    catchStrikePolicy: "NEW_BATTER_ON_STRIKE" | "FOLLOW_COMPLETED_RUNS";
    lastBatterAllowed: boolean;
    retiredBatterCanReturn: boolean;
  };
  powerplays: Array<{
    type: "BOWLING_TARGET_POWERPLAY";
    version: 1;
    enabled: boolean;
    allowedSelections: number;
    selectionAuthority: "BOWLING_CAPTAIN";
    targetRuns: number;
    successOutcome: "KEEP_RUNS_PLUS_BONUS" | "BONUS_REPLACES_RUNS";
    successBonusRuns: number;
    failureOutcome: "ZERO_OVER_RUNS" | "KEEP_RUNS";
    endOverWhenTargetReached: boolean;
  }>;
  wagonWheel: {
    enabled: boolean;
    requiredForBatRuns: number[];
    optionalForBatRuns: number[];
    inputMode: "FIELD_ZONE";
  };
  source: { levels: MatchRulesSourceLevel[] };
};

export type MatchRulesOverrides = {
  format?: Partial<MatchRulesSnapshot["format"]>;
  bowling?: Partial<MatchRulesSnapshot["bowling"]>;
  extras?: {
    wide?: Partial<MatchRulesSnapshot["extras"]["wide"]>;
    noBall?: Partial<MatchRulesSnapshot["extras"]["noBall"]>;
    byesEnabled?: boolean;
    legByesEnabled?: boolean;
  };
  batting?: Partial<MatchRulesSnapshot["batting"]>;
  powerplays?: MatchRulesSnapshot["powerplays"];
  wagonWheel?: Partial<MatchRulesSnapshot["wagonWheel"]>;
};

export type MatchRulesConfiguration = {
  preset: MatchRulesPresetReference;
  overrides: MatchRulesOverrides;
  resolvedSnapshot: MatchRulesSnapshot;
  snapshotHash: string;
  lockedAt?: string | null;
  inheritedSources?: MatchRulesSourceLevel[];
  inheritedSnapshot?: MatchRulesSnapshot;
  issues?: Array<{ code: string; path: string; message: string }>;
  summary?: string;
  isLocked?: boolean;
};

export type UpdateMatchRulesRequest = {
  preset: MatchRulesPresetReference;
  overrides: MatchRulesOverrides;
};

export type MatchRulesPreset = {
  key: MatchRulesPresetKey;
  version: number;
  snapshot: MatchRulesSnapshot;
  summary: string;
};

export type RulesPropagationResult = {
  configuration: MatchRulesConfiguration;
  affectedUnlockedFixtures: number;
  affectedUnlockedMatches: number;
  skippedLockedMatches: number;
};
