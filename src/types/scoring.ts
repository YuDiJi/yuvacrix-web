import { ScoringState } from "./innings";

export type ExtraType = "WIDE" | "NO_BALL" | "BYE" | "LEG_BYE";

export type NextActionType =
  | "CONTINUE_SCORING"
  | "SELECT_NEXT_BOWLER"
  | "SELECT_NEXT_BATTER"
  | "COMPLETE_INNINGS"
  | "START_SECOND_INNINGS"
  | "MATCH_COMPLETED";

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

export interface RecordBallRequest {
  matchId: string;

  inningsId: string;

  clientEventId: string;

  runs: {
    batRuns: number;
  };

  extra?: {
    type: ExtraType;
    additionalRuns: number;
  };
}

export interface NextAction {
  type: NextActionType;
  reason?: string;
}

export interface RecordBallResponse {
  ballEvent: unknown;
  state: ScoringState;
  nextAction: NextAction;
}

export interface UndoBallResponse {
  revokedBallEventId: string;
  state: ScoringState;
}

export interface ChangeBowlerRequest {
  matchId: string;
  inningsId: string;
  bowlerId: string;
  reason?: string;
}
