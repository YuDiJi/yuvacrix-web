import type {
  VolleyballMatchRulePreset,
  VolleyballMatchRulesConfiguration,
  VolleyballMatchRulesOverrides,
} from "./match";
import type {
  VolleyballMyScope,
  VolleyballViewerRelation,
} from "./myVolleyball";

/* =========================================================
   TOURNAMENT ENUMS
========================================================= */

export const VOLLEYBALL_TOURNAMENT_FORMATS = {
  LEAGUE: "LEAGUE",
  KNOCKOUT: "KNOCKOUT",
  GROUP_KNOCKOUT: "GROUP_KNOCKOUT",
  LEAGUE_PLAYOFF: "LEAGUE_PLAYOFF",
  CUSTOM: "CUSTOM",
} as const;

export type VolleyballTournamentFormat =
  (typeof VOLLEYBALL_TOURNAMENT_FORMATS)[keyof typeof VOLLEYBALL_TOURNAMENT_FORMATS];

export const VOLLEYBALL_PLAYOFF_STRUCTURES = {
  TOP_2_FINAL: "TOP_2_FINAL",
  SEMIFINAL_FINAL: "SEMIFINAL_FINAL",
} as const;

export type VolleyballPlayoffStructure =
  (typeof VOLLEYBALL_PLAYOFF_STRUCTURES)[keyof typeof VOLLEYBALL_PLAYOFF_STRUCTURES];

export interface VolleyballLeaguePlayoffFormatConfig {
  roundRobinCycles: 1;
  qualifyingTeamCount: 2 | 4;
  playoffStructure: VolleyballPlayoffStructure;
}

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

export type VolleyballTournamentViewerRole = "OWNER" | "ADMIN" | "VIEWER";

export interface VolleyballTournamentViewerAccess {
  role: VolleyballTournamentViewerRole;
  canManageTournament: boolean;
  canManageAdmins: boolean;
  canManageFixtures: boolean;
  canCreateExecutionMatch: boolean;
  canScoreMatches: boolean;
}

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

  formatConfig: VolleyballLeaguePlayoffFormatConfig | null;

  status: VolleyballTournamentStatus;

  currentStage: VolleyballTournamentStage | null;

  leaguePhaseComplete: boolean;

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

export interface VolleyballTournamentDetail extends VolleyballTournament {
  viewerAccess: VolleyballTournamentViewerAccess;
}

export interface VolleyballMyTournamentItem extends VolleyballTournament {
  viewerRelation: VolleyballViewerRelation;
}

export interface VolleyballMyTournamentsResponse {
  items: VolleyballMyTournamentItem[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface GetMyVolleyballTournamentsQuery {
  scope?: VolleyballMyScope;
  status?: VolleyballTournamentStatus;
  skip?: number;
  limit?: number;
}

export interface VolleyballTournamentAdminOwner {
  userId: string;
  playerId: string | null;
  fullName: string | null;
  profileImageUrl: string | null;
}

export interface VolleyballTournamentAdminPlayer {
  playerId: string;
  fullName: string;
  profileImageUrl: string | null;
}

export interface VolleyballTournamentAdmin {
  id: string;
  userId: string;
  player: VolleyballTournamentAdminPlayer;
  createdAt: string;
}

export interface VolleyballTournamentAdminsResponse {
  owner: VolleyballTournamentAdminOwner;
  admins: VolleyballTournamentAdmin[];
}

export interface AddVolleyballTournamentAdminDto {
  playerId: string;
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

  formatConfig?: VolleyballLeaguePlayoffFormatConfig | null;

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

export interface RemoveVolleyballTournamentTeamResponse {
  success: boolean;
  tournamentId: string;
  teamId: string;
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

export interface UpdateVolleyballTournamentFixtureDto {
  stage?: VolleyballTournamentStage;

  roundNumber?: number;

  groupName?: string | null;

  teamAId?: string | null;
  teamBId?: string | null;

  teamASourceFixtureId?: string | null;
  teamBSourceFixtureId?: string | null;

  matchRulesPresetKey?: VolleyballMatchRulePreset;

  customRules?: VolleyballMatchRulesOverrides;

  scheduledAt?: string | null;
}

export interface DeleteVolleyballTournamentFixtureResponse {
  success: boolean;

  fixtureId: string;

  deletedExecutionMatchId: string | null;
}
