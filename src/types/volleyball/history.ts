import type { VolleyballPointType } from "@/types/volleyball/scoring";
import type { VolleyballSet } from "@/types/volleyball/set";
import type { VolleyballMatch } from "./match";

export const VOLLEYBALL_EVENT_TYPES = {
  RALLY: "RALLY",
  SUBSTITUTION: "SUBSTITUTION",
  LIBERO_REPLACEMENT: "LIBERO_REPLACEMENT",
  UNDO: "UNDO",
} as const;

export type VolleyballEventType =
  (typeof VOLLEYBALL_EVENT_TYPES)[keyof typeof VOLLEYBALL_EVENT_TYPES];

export interface VolleyballEventScoreAfter {
  teamAPoints: number;
  teamBPoints: number;
}

export interface VolleyballHistoryRally {
  winningTeamId: string;
  pointType: VolleyballPointType;
  creditedPlayerId: string | null;
  isSideOut: boolean;
  causedRotation: boolean;
}

export interface VolleyballHistorySubstitution {
  teamId: string;
  outgoingPlayerId: string;
  incomingPlayerId: string;
  rotationPosition: number;
}

export interface VolleyballHistoryLiberoReplacement {
  teamId: string;
  outgoingPlayerId: string;
  incomingPlayerId: string;
  rotationPosition: number;
}

export interface VolleyballHistoryEvent {
  id: string;

  matchId: string;
  setId: string | null;

  setNumber: number | null;

  sequenceNumber: number;

  clientEventId: string;

  eventType: VolleyballEventType;

  isRevoked: boolean;

  createdByUserId: string;

  createdAt: string;

  rally?: VolleyballHistoryRally;

  substitution?: VolleyballHistorySubstitution;

  liberoReplacement?: VolleyballHistoryLiberoReplacement;

  scoreAfter: VolleyballEventScoreAfter | null;

  servingTeamAfter: string | null;
}

export interface GetVolleyballMatchHistoryResponse {
  events: VolleyballHistoryEvent[];
  total: number;
}

export interface UndoVolleyballEventDto {
  clientEventId: string;
  expectedSetVersion: number;
}

export interface VolleyballUndoEvent {
  id: string;

  sequenceNumber: number;

  eventType: "UNDO";

  targetEventId: string;

  targetEventType: VolleyballEventType;

  targetSequenceNumber: number;

  isRevoked: boolean;

  createdAt: string;
}

export interface VolleyballUndoMatchState {
  id: string;

  status: string;

  teamASetsWon: number;
  teamBSetsWon: number;

  winnerTeamId: string | null;

  isTie: boolean;

  completedAt: string | null;
}

export interface UndoVolleyballEventResponse {
  event: VolleyballUndoEvent;

  set: VolleyballSet;

  match: VolleyballUndoMatchState;
}

export interface UndoLastVolleyballEventRequest {
  throughEventId?: string;
  expectedRevision?: number;
}

export interface UndoLastVolleyballEventResponse {
  success: boolean;
  undoneEventsCount: number;
  event: VolleyballUndoEvent;
  set: VolleyballSet;
  match: VolleyballMatch;
  revision: number;
}

export interface VolleyballScoringHistoryScore {
  teamAPoints: number;
  teamBPoints: number;
}

export interface VolleyballScoringHistoryItem {
  eventId: string;
  sequence: number;
  type: string;
  createdAt: string;
  description: string;
  scoreAfter: VolleyballScoringHistoryScore | null;
  servingTeamIdAfter: string | null;
  reversible: boolean;
}

export interface VolleyballScoringHistoryResponse {
  matchId: string;
  setId: string | null;
  items: VolleyballScoringHistoryItem[];
  total: number;
}

export interface GetVolleyballScoringHistoryQuery {
  matchId: string;
  setId?: string;
  setNumber?: number;
  limit?: number;
  skip?: number;
}
