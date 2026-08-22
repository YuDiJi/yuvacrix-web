import { VolleyballMatchRoster } from "./roster";

export const VOLLEYBALL_MATCH_RULE_PRESETS = {
  DEFAULT: "DEFAULT",
  BEST_OF_5: "BEST_OF_5",
  ALWAYS_3_SETS: "ALWAYS_3_SETS",
  JUST_1_SET: "JUST_1_SET",
  CUSTOM: "CUSTOM",
} as const;

export type VolleyballMatchRulePreset =
  (typeof VOLLEYBALL_MATCH_RULE_PRESETS)[keyof typeof VOLLEYBALL_MATCH_RULE_PRESETS];

export const VOLLEYBALL_RULE_FORMAT_TYPES = {
  BEST_OF: "BEST_OF",
  FIXED_SETS: "FIXED_SETS",
} as const;

export type VolleyballRuleFormatType =
  (typeof VOLLEYBALL_RULE_FORMAT_TYPES)[keyof typeof VOLLEYBALL_RULE_FORMAT_TYPES];

export const VOLLEYBALL_MATCH_STATUSES = {
  DRAFT: "DRAFT",
  ROSTER_CONFIRMED: "ROSTER_CONFIRMED",
  LIVE: "LIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  ABANDONED: "ABANDONED",
} as const;

export type VolleyballMatchStatus =
  (typeof VOLLEYBALL_MATCH_STATUSES)[keyof typeof VOLLEYBALL_MATCH_STATUSES];

export interface VolleyballMatchRulesConfiguration {
  formatType: VolleyballRuleFormatType;
  maxSets: number | null;
  totalSets?: number | null;
  setsToWin: number | null;
  normalSetPoints: number;
  decidingSetPoints: number | null;
  winByMargin: number;
  schemaVersion: number;
}

export interface VolleyballMatchRulePresetItem {
  key: VolleyballMatchRulePreset;
  name: string;
  description: string;
  configuration: VolleyballMatchRulesConfiguration;
}

export interface GetVolleyballMatchRulePresetsResponse {
  presets: VolleyballMatchRulePresetItem[];
}

export const VOLLEYBALL_MATCH_FORMAT_TYPES = {
  BEST_OF: "BEST_OF",
  FIXED_SETS: "FIXED_SETS",
} as const;

export type VolleyballMatchFormatType =
  (typeof VOLLEYBALL_MATCH_FORMAT_TYPES)[keyof typeof VOLLEYBALL_MATCH_FORMAT_TYPES];

export interface VolleyballMatchRulesOverrides {
  formatType: VolleyballMatchFormatType;

  maxSets?: number | null;
  totalSets?: number | null;
  setsToWin?: number | null;

  normalSetPoints?: number;
  decidingSetPoints?: number | null;

  winByMargin?: number;
}

export interface CreateVolleyballMatchRules {
  presetKey: VolleyballMatchRulePreset;

  customRules?: VolleyballMatchRulesOverrides;

  /**
   * Backend-supported alias.
   * Prefer customRules in frontend code.
   */
  overrides?: VolleyballMatchRulesOverrides;
}

export interface CreateVolleyballMatchRules {
  presetKey: VolleyballMatchRulePreset;
  customRules?: VolleyballMatchRulesOverrides;
}

export interface CreateVolleyballMatchDto {
  teamAId: string;
  teamBId: string;

  rules: CreateVolleyballMatchRules;
}

export interface VolleyballMatchTeamSnapshot {
  teamId: string;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
}

/* =========================================================
   POST MATCH
========================================================= */

export interface VolleyballBestPlayerSnapshot {
  playerId: string;
  teamId: string;

  playerNameSnapshot: string;

  jerseyNumberSnapshot: number | null;

  profileImageSnapshot: string | null;

  selectedByUserId: string;

  selectedAt: string;
}

export interface VolleyballPostMatch {
  spectatorCount: number | null;

  bestPlayer: VolleyballBestPlayerSnapshot | null;
}

export interface UpdateVolleyballPostMatchDto {
  spectatorCount?: number | null;

  bestPlayerId?: string | null;
}

/* =========================================================
   MATCH
========================================================= */

export interface VolleyballMatch {
  id: string;

  teamAId: string;
  teamBId: string;

  teamASnapshot: VolleyballMatchTeamSnapshot;
  teamBSnapshot: VolleyballMatchTeamSnapshot;

  rulesSnapshot: VolleyballMatchRulesConfiguration;

  rulesPresetKey: VolleyballMatchRulePreset;

  status: VolleyballMatchStatus;

  createdByUserId: string;

  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;

  winnerTeamId: string | null;

  teamASetsWon: number;
  teamBSetsWon: number;

  isTie: boolean;

  spectatorCount: number | null;

  bestPlayer: VolleyballBestPlayerSnapshot | null;

  postMatch: VolleyballPostMatch;

  version: number;

  teamARoster: VolleyballMatchRoster | null;
  teamBRoster: VolleyballMatchRoster | null;

  createdAt: string;
  updatedAt: string;
}
