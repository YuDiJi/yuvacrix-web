import type { VolleyballPosition } from "@/types/volleyball/team";

export const VOLLEYBALL_ROSTER_SIDES = {
  TEAM_A: "TEAM_A",
  TEAM_B: "TEAM_B",
} as const;

export type VolleyballRosterSide =
  (typeof VOLLEYBALL_ROSTER_SIDES)[keyof typeof VOLLEYBALL_ROSTER_SIDES];

export type VolleyballRosterSelectionSource =
  | "MATCH"
  | "TOURNAMENT_DEFAULT";

export interface VolleyballRosterPlayerInput {
  playerId: string;
}

export interface SubmitVolleyballRosterDto {
  captainPlayerId: string;

  players: VolleyballRosterPlayerInput[];

  liberoPlayerIds?: string[];
}

export interface VolleyballMatchRosterPlayer {
  playerId: string;

  playerNameSnapshot: string;

  playerProfileImageSnapshot: string | null;

  jerseyNumberSnapshot: number;

  positionSnapshot: VolleyballPosition;

  isCaptain: boolean;

  isLibero: boolean;
}

export interface VolleyballMatchRoster {
  teamId: string;

  side: VolleyballRosterSide;

  captainPlayerId: string | null;

  liberoPlayerIds: string[];

  playerCount: number;

  isConfirmed: boolean;

  selectionSource: VolleyballRosterSelectionSource;

  players: VolleyballMatchRosterPlayer[];
}
