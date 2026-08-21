import type {
  VolleyballSet,
  VolleyballCourtPosition,
  VolleyballSetStatus,
  VolleyballRotationPosition,
} from "@/types/volleyball/set";

export const VOLLEYBALL_POINT_TYPES = {
  SERVE: "SERVE",
  ATTACK: "ATTACK",
  BLOCK: "BLOCK",
  OPPONENT_ERROR: "OPPONENT_ERROR",
} as const;

export type VolleyballPointType =
  (typeof VOLLEYBALL_POINT_TYPES)[keyof typeof VOLLEYBALL_POINT_TYPES];

export interface RecordVolleyballRallyDto {
  clientEventId: string;
  expectedVersion: number;
  winningTeamId: string;
  pointType: VolleyballPointType;
  creditedPlayerId?: string;
}

export interface RecordVolleyballRallyResponse {
  event: VolleyballRallyEvent;
  set: VolleyballSet;
}

export interface RecordVolleyballSubstitutionDto {
  clientEventId: string;
  expectedVersion: number;

  teamId: string;

  outgoingPlayerId: string;
  incomingPlayerId: string;
}

export interface RecordVolleyballLiberoReplacementDto {
  clientEventId: string;
  expectedVersion: number;

  teamId: string;

  outgoingPlayerId: string;
  incomingPlayerId: string;
}

export interface VolleyballSubstitutionEvent {
  id: string;
  sequenceNumber: number;
  eventType: "SUBSTITUTION";

  teamId: string;

  outgoingPlayerId: string;
  incomingPlayerId: string;

  rotationPosition: number;
}

export interface RecordVolleyballSubstitutionResponse {
  event: VolleyballSubstitutionEvent;
  set: VolleyballSet;
}

export interface RecordVolleyballSubstitutionDto {
  clientEventId: string;
  expectedVersion: number;

  teamId: string;

  outgoingPlayerId: string;
  incomingPlayerId: string;
}

export interface VolleyballSubstitutionEvent {
  id: string;

  sequenceNumber: number;

  eventType: "SUBSTITUTION";

  teamId: string;

  outgoingPlayerId: string;
  incomingPlayerId: string;

  rotationPosition: number;
}

export interface RecordVolleyballSubstitutionResponse {
  event: VolleyballSubstitutionEvent;

  set: VolleyballSet;
}

export interface VolleyballLiberoReplacementEvent {
  id: string;
  sequenceNumber: number;

  eventType: "LIBERO_REPLACEMENT";

  teamId: string;

  outgoingPlayerId: string;
  incomingPlayerId: string;

  rotationPosition: VolleyballCourtPosition;
}

export interface RecordVolleyballLiberoReplacementResponse {
  event: VolleyballLiberoReplacementEvent;
  set: VolleyballSet;
}

export interface VolleyballRallyStateAfter {
  status: VolleyballSetStatus;

  teamAPoints: number;
  teamBPoints: number;

  servingTeamId: string | null;
  currentServerPlayerId: string | null;

  teamACurrentRotation: VolleyballRotationPosition[];
  teamBCurrentRotation: VolleyballRotationPosition[];

  winnerTeamId: string | null;

  completedAt: string | null;

  setVersion: number;
}

export interface VolleyballRallyEvent {
  id: string;

  matchId?: string;
  setId?: string;
  setNumber?: number;

  sequenceNumber: number;

  clientEventId?: string;

  eventType: "RALLY";

  pointType?: VolleyballPointType;
  winningTeamId?: string;
  creditedPlayerId?: string | null;
  isSideOut?: boolean;
  causedRotation?: boolean;

  rally?: {
    winningTeamId: string;
    pointType: VolleyballPointType;
    creditedPlayerId: string | null;
    servingTeamBefore: string | null;
    serverPlayerBefore: string | null;
    isSideOut: boolean;
    causedRotation: boolean;
  };

  stateAfter?: VolleyballRallyStateAfter;

  isRevoked?: boolean;

  createdAt?: string;
}

export interface RecordVolleyballRallyResponse {
  event: VolleyballRallyEvent;
  set: VolleyballSet;
}
