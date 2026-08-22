import type {
  VolleyballMatchRulePreset,
  VolleyballMatchRulesConfiguration,
  VolleyballMatchRulesOverrides,
} from "./match";

/* =========================================================
   TOURNAMENT ENUMS
========================================================= */

export const VOLLEYBALL_TOURNAMENT_FORMATS = {
  LEAGUE: "LEAGUE",
  KNOCKOUT: "KNOCKOUT",
  GROUP_KNOCKOUT: "GROUP_KNOCKOUT",
} as const;

export type VolleyballTournamentFormat =
  (typeof VOLLEYBALL_TOURNAMENT_FORMATS)[keyof typeof VOLLEYBALL_TOURNAMENT_FORMATS];

export const VOLLEYBALL_TOURNAMENT_VISIBILITIES = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const;

export type VolleyballTournamentVisibility =
  (typeof VOLLEYBALL_TOURNAMENT_VISIBILITIES)[keyof typeof VOLLEYBALL_TOURNAMENT_VISIBILITIES];

export const VOLLEYBALL_TOURNAMENT_STATUSES = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type VolleyballTournamentStatus =
  (typeof VOLLEYBALL_TOURNAMENT_STATUSES)[keyof typeof VOLLEYBALL_TOURNAMENT_STATUSES];

export const VOLLEYBALL_TOURNAMENT_STAGES = {
  LEAGUE: "LEAGUE",
  GROUP_STAGE: "GROUP_STAGE",
  ROUND_OF_16: "ROUND_OF_16",
  QUARTER_FINAL: "QUARTER_FINAL",
  SEMI_FINAL: "SEMI_FINAL",
  THIRD_PLACE: "THIRD_PLACE",
  FINAL: "FINAL",
} as const;

export type VolleyballTournamentStage =
  (typeof VOLLEYBALL_TOURNAMENT_STAGES)[keyof typeof VOLLEYBALL_TOURNAMENT_STAGES];

export const VOLLEYBALL_FIXTURE_STATUSES = {
  SCHEDULED: "SCHEDULED",
  MATCH_CREATED: "MATCH_CREATED",
  LIVE: "LIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type VolleyballFixtureStatus =
  (typeof VOLLEYBALL_FIXTURE_STATUSES)[keyof typeof VOLLEYBALL_FIXTURE_STATUSES];

/* =========================================================
   POINTS
========================================================= */

export interface VolleyballTournamentPointsConfig {
  winPoints: number;
  lossPoints: number;
  tiePoints: number;
}

/* =========================================================
   TEAM SNAPSHOT
========================================================= */

export interface VolleyballTournamentTeamSnapshot {
  teamId: string;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
}

/* =========================================================
   TOURNAMENT
========================================================= */

export interface VolleyballTournament {
  id: string;

  name: string;
  shortName: string | null;
  description: string | null;

  ownerUserId: string;

  sportType: "VOLLEYBALL";

  visibility: VolleyballTournamentVisibility;

  format: VolleyballTournamentFormat;

  status: VolleyballTournamentStatus;

  pointsConfig: VolleyballTournamentPointsConfig;

  defaultMatchRulesPresetKey: VolleyballMatchRulePreset | null;

  defaultMatchRulesSnapshot: VolleyballMatchRulesConfiguration;

  winnerTeamId: string | null;
  runnerUpTeamId: string | null;

  startDate: string | null;
  endDate: string | null;

  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   CREATE TOURNAMENT
========================================================= */

export interface CreateVolleyballTournamentDto {
  name: string;

  shortName?: string;

  description?: string;

  visibility?: VolleyballTournamentVisibility;

  format: VolleyballTournamentFormat;

  pointsConfig?: Partial<VolleyballTournamentPointsConfig>;

  startDate?: string;

  endDate?: string;
}
/* =========================================================
   TOURNAMENT TEAM
========================================================= */

export interface VolleyballTournamentTeam {
  id: string;

  tournamentId: string;

  teamId: string;

  teamSnapshot: VolleyballTournamentTeamSnapshot;

  registeredByUserId: string;

  groupName: string | null;

  createdAt: string;
}

export interface RegisterVolleyballTournamentTeamDto {
  teamId: string;

  groupName?: string;
}

/* =========================================================
   FIXTURE
========================================================= */

export interface VolleyballTournamentFixture {
  id: string;

  tournamentId: string;

  stage: VolleyballTournamentStage;

  groupName: string | null;

  roundNumber: number;

  teamAId: string | null;
  teamBId: string | null;

  teamASnapshot: VolleyballTournamentTeamSnapshot | null;

  teamBSnapshot: VolleyballTournamentTeamSnapshot | null;

  teamASourceFixtureId: string | null;

  teamBSourceFixtureId: string | null;

  matchRulesSnapshot: VolleyballMatchRulesConfiguration;

  scheduledAt: string | null;

  status: VolleyballFixtureStatus;

  executionMatchId: string | null;

  nextFixtureId: string | null;

  nextFixtureSlot: string | null;

  inconsistency: unknown | null;

  createdAt: string;

  updatedAt: string;
}

export interface CreateVolleyballTournamentFixtureDto {
  stage: VolleyballTournamentStage;

  roundNumber: number;

  groupName?: string;

  teamAId?: string;

  teamBId?: string;

  teamASourceFixtureId?: string;

  teamBSourceFixtureId?: string;

  matchRulesPresetKey?: VolleyballMatchRulePreset;

  customRules?: VolleyballMatchRulesOverrides;

  scheduledAt?: string;
}

/* =========================================================
   STANDINGS
========================================================= */

export interface VolleyballTournamentStanding {
  position: number;

  teamId: string;

  teamName: string;

  played: number;

  won: number;

  lost: number;

  tied: number;

  setsWon: number;

  setsLost: number;

  setDifference: number;

  pointsFor: number;

  pointsAgainst: number;

  pointDifference: number;

  competitionPoints: number;
}

export interface VolleyballTournamentStandingsResponse {
  tournamentId: string;

  groupName: string | null;

  standings: VolleyballTournamentStanding[];

  generatedAt: string;
}
