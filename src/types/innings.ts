export interface StartFirstInningRequest {
  matchId: string;
  inningsNumber: 1;
  battingTeamId: string;
  bowlingTeamId: string;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
}

export interface Extras {
  total: number;
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalties: number;
}

export interface ScoringState {
  matchId: string;
  inningsId: string;
  inningsNumber: number;
  version: number;

  battingTeamId: string;
  bowlingTeamId: string;

  score: string;
  totalRuns: number;
  wickets: number;

  extras: Extras;

  legalBalls: number;
  oversText: string;

  currentStrikerId: string;
  currentNonStrikerId: string;
  currentBowlerId: string;

  targetRuns: number | null;
  runsRequired: number | null;
  ballsRemaining: number | null;

  isFreeHitNextBall: boolean;

  overCompleted: boolean;
  inningsCompleted: boolean;

  requiresBowlerSelection: boolean;
  requiresNewBatter: boolean;

  pendingSyncSupported: boolean;

  lastBall: unknown | null;
  currentOver: unknown | null;
}

export interface Innings {
  id: string;
  matchId: string;

  inningsNumber: number;

  battingTeamId: string;
  bowlingTeamId: string;

  status: "LIVE" | "COMPLETED" | "ABANDONED";

  totalRuns: number;
  wickets: number;

  extras: Extras;

  legalBalls: number;
  oversText: string;

  currentStrikerId: string;
  currentNonStrikerId: string;
  currentBowlerId: string;

  targetRuns: number | null;

  isFreeHitNextBall: boolean;

  version: number;

  startedAt: string;
  completedAt: string | null;

  completionReason: string | null;
}

export interface StartFirstInningResponse {
  innings: Innings;
  state: ScoringState;
}
