export type VolleyballCourtPosition = 1 | 2 | 3 | 4 | 5 | 6;

export interface VolleyballRotationPosition {
  position: VolleyballCourtPosition;
  playerId: string;
}

export interface VolleyballSetTeamLineup {
  positions: VolleyballRotationPosition[];
}

export interface StartVolleyballSetDto {
  initialServingTeamId: string;

  teamA: VolleyballSetTeamLineup;

  teamB: VolleyballSetTeamLineup;
}

export const VOLLEYBALL_SET_STATUSES = {
  PENDING_LINEUP: "PENDING_LINEUP",
  LIVE: "LIVE",
  COMPLETED: "COMPLETED",
} as const;

export type VolleyballSetStatus =
  (typeof VOLLEYBALL_SET_STATUSES)[keyof typeof VOLLEYBALL_SET_STATUSES];

export interface VolleyballSet {
  id: string;
  matchId: string;

  setNumber: number;

  status: VolleyballSetStatus;

  teamAPoints: number;
  teamBPoints: number;

  teamAStartingRotation: VolleyballRotationPosition[];
  teamBStartingRotation: VolleyballRotationPosition[];

  teamACurrentRotation: VolleyballRotationPosition[];
  teamBCurrentRotation: VolleyballRotationPosition[];

  initialServingTeamId?: string | null;
  initialServerPlayerId?: string | null;

  servingTeamId: string | null;
  currentServerPlayerId: string | null;

  targetPoints: number;
  winByMargin: number;

  winnerTeamId: string | null;

  startedAt: string | null;
  completedAt: string | null;

  version: number;

  createdAt: string;
  updatedAt: string;
}
