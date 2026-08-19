// =============================================================================
// Match Rules - Domain Enums
// =============================================================================

export type MatchRulesPresetKey =
  | "LIMITED_OVERS_STANDARD"
  | "T20_STANDARD"
  | "ODI_STANDARD"
  | "BOX_TURF_STANDARD"
  | "CUSTOM";

export type MatchRulesSourceLevel = "PRESET" | "TOURNAMENT" | "ROUND" | "MATCH";

export type CatchStrikePolicy =
  | "NEW_BATTER_ON_STRIKE"
  | "FOLLOW_COMPLETED_RUNS";

export type WagonWheelInputMode = "FIELD_ZONE";

// =============================================================================
// Preset Reference
// =============================================================================

export type MatchRulesPresetReference = {
  key: MatchRulesPresetKey;
  version: number;
};

// =============================================================================
// Rule Snapshot
// =============================================================================

export type MatchRulesSnapshot = {
  schemaVersion: 1;

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
    wide: {
      enabled: boolean;
      runs: number;
      countsAsLegalDelivery: boolean;
    };

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
    catchStrikePolicy: CatchStrikePolicy;
    lastBatterAllowed: boolean;
    retiredBatterCanReturn: boolean;
  };

  wagonWheel: {
    enabled: boolean;
    requiredForBatRuns: number[];
    optionalForBatRuns: number[];
    inputMode: WagonWheelInputMode;
  };

  /**
   * Present on resolved match configurations.
   *
   * Preset examples in the API documentation don't show `source`,
   * while resolved match snapshots do, so keep this optional so the
   * same snapshot type can safely represent both responses.
   */
  source?: {
    levels: MatchRulesSourceLevel[];
  };
};

// =============================================================================
// Overrides
// =============================================================================

/**
 * IMPORTANT:
 *
 * Do not use:
 *
 * Partial<MatchRulesSnapshot["format"]>
 *
 * because that would allow `inningsPerTeam` to be sent as an override,
 * while the current API contract does not allow it.
 */
export type MatchRulesFormatOverrides = {
  oversPerInnings?: number;
  ballsPerOver?: number;
  playingPlayers?: number | null;
  wicketsToEndInnings?: number | null;
};

export type MatchRulesBowlingOverrides = {
  maxOversPerBowler?: number;
  consecutiveOversAllowed?: boolean;
  minimumDistinctBowlers?: number | null;
  additionalOverBowlerLimit?: number | null;
};

export type MatchRulesExtrasOverrides = {
  wide?: {
    enabled?: boolean;
    runs?: number;
    countsAsLegalDelivery?: boolean;
  };

  noBall?: {
    enabled?: boolean;
    runs?: number;
    countsAsLegalDelivery?: boolean;
    freeHitEnabled?: boolean;
  };

  byesEnabled?: boolean;
  legByesEnabled?: boolean;
};

export type MatchRulesBattingOverrides = {
  rotateStrikeOnOddRuns?: boolean;
  rotateStrikeAtOverEnd?: boolean;
  catchStrikePolicy?: CatchStrikePolicy;
  lastBatterAllowed?: boolean;
  retiredBatterCanReturn?: boolean;
};

export type MatchRulesWagonWheelOverrides = {
  enabled?: boolean;
  requiredForBatRuns?: number[];
  optionalForBatRuns?: number[];
  inputMode?: WagonWheelInputMode;
};

export type MatchRulesOverrides = {
  format?: MatchRulesFormatOverrides;
  bowling?: MatchRulesBowlingOverrides;
  extras?: MatchRulesExtrasOverrides;
  batting?: MatchRulesBattingOverrides;
  wagonWheel?: MatchRulesWagonWheelOverrides;
};

// =============================================================================
// Issues
// =============================================================================

export type MatchRulesIssue = {
  code: string;
  path: string;
  message: string;
};

// =============================================================================
// Requests
// =============================================================================

export type UpdateMatchRulesRequest = {
  preset: MatchRulesPresetReference;
  overrides: MatchRulesOverrides;
};

// =============================================================================
// Responses
// =============================================================================

/**
 * Persisted Match Rules configuration returned by:
 *
 * GET /matches/:matchId/rules
 * PUT /matches/:matchId/rules
 */
export type MatchRulesConfiguration = {
  preset: MatchRulesPresetReference;
  overrides: MatchRulesOverrides;

  resolvedSnapshot: MatchRulesSnapshot;

  snapshotHash: string;

  inheritedSources: MatchRulesSourceLevel[];

  issues: MatchRulesIssue[];

  isLocked: boolean;
};

/**
 * Dry-run validation result.
 *
 * The new API documentation does not guarantee snapshotHash or
 * inheritedSources on /rules/validate, so this should not incorrectly
 * be typed as MatchRulesConfiguration.
 */
export type MatchRulesValidationResult = {
  preset: MatchRulesPresetReference;
  overrides: MatchRulesOverrides;

  resolvedSnapshot: MatchRulesSnapshot;

  issues: MatchRulesIssue[];

  isLocked: boolean;
};

// =============================================================================
// Presets
// =============================================================================

export type MatchRulesPreset = {
  key: MatchRulesPresetKey;
  version: number;
  snapshot: MatchRulesSnapshot;
};

// =============================================================================
// Tournament Rule Propagation
// =============================================================================

/**
 * These fields belong to the existing tournament match-rule integration.
 *
 * The newly supplied Match Rules document doesn't document the tournament
 * endpoints, so this contract is being preserved rather than inferred or
 * removed.
 */
export type RulesPropagationResult = {
  configuration: MatchRulesConfiguration;

  affectedUnlockedFixtures: number;
  affectedUnlockedMatches: number;
  skippedLockedMatches: number;
};
