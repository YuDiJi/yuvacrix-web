import { WicketType } from "./scoring";

export interface StartInningsRequest {
  matchId: string;
  inningsNumber: 1 | 2;
  battingTeamId: string;
  bowlingTeamId: string;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
}
export interface CompleteInningsRequest {
  matchId: string;
  inningsId: string;
  reason:
    | "OVERS_COMPLETED"
    | "ALL_OUT"
    | "TARGET_CHASED"
    | "MANUAL"
    | "ABANDONED";
  note: string;
}

export interface Extras {
  total: number;
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalties: number;
}

export interface OverBall {
  sequenceNumber: number;
  symbol: string;
  runs: number;
  isLegalDelivery: boolean;
  isWicket: boolean;
  isExtra: boolean;
}

export interface CurrentOver {
  overNumber: number;
  bowlerId: string;
  runs: number;
  wickets: number;
  extras: number;
  balls: OverBall[];
  completed: boolean;
}

export interface BallRuns {
  batRuns: number;
  totalRuns: number;
}

export interface BallFlags {
  isLegalDelivery: boolean;
  isBoundary: boolean;
  isWicket: boolean;
  isExtra: boolean;
  isFreeHit: boolean;
  createsFreeHit: boolean;
  overCompleted: boolean;
  inningsCompleted: boolean;
}

export interface ScoreAfterBall {
  totalRuns: number;
  wickets: number;
  extrasTotal: number;
  legalBalls: number;
  oversText: string;

  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;

  targetRuns: number | null;
  runsRequired: number | null;
  ballsRemaining: number | null;

  inningsVersion: number;
}

export interface CreatedBy {
  actorType: "USER" | "SYSTEM";
  actorId: string;
}

export interface BallEvent {
  id: string;
  matchId: string;
  inningsId: string;

  clientEventId: string;
  clientRecordedAt: string | null;

  sequenceNumber: number;
  overNumber: number;
  ballNumber: number;
  legalBallNumber: number;

  battingTeamId: string;
  bowlingTeamId: string;

  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;

  eventType: "NORMAL" | "WIDE" | "NO_BALL" | "BYE" | "LEG_BYE";

  runs: BallRuns;

  extras: unknown | null;
  wicket: {
    type: WicketType;
    dismissedPlayerId: string;
  } | null;

  flags: BallFlags;

  wagonWheel: unknown | null;
  shot: unknown | null;
  bowling: unknown | null;

  scoreAfterBall: ScoreAfterBall;

  createdBy: CreatedBy;

  isRevoked: boolean;
  revokedAt: string | null;
  revokedBy: string | null;
  revokeReason: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CompletedOverBall {
  ballEventId: string;
  sequenceNumber: number;
  overNumber: number;
  ballNumber: number;
  legalBallNumber: number;
  symbol: string;

  label: string;
  runs: number;

  isLegalDelivery: boolean;
  isBoundary: boolean;
  isWicket: boolean;
  isExtra: boolean;

  extraType: string | null;
  wicketType: string | null;
}

export interface LastCompletedOver {
  overNumber: number;
  displayOverNumber: number;

  bowlerId: string;
  bowlerName: string | null;

  balls: CompletedOverBall[];

  legalBalls: number;
  totalRuns: number;
  wickets: number;
  extras: number;

  display: string;
}

export interface ScoringState {
  matchId: string;
  inningsId: string;
  inningsNumber: number;
  version: number;
  runRateSummary: string;

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

  activeSpecialOver: {
    ruleType: "BOWLING_TARGET_POWERPLAY";
    overNumber: number;
    targetRuns: number;
    rawRuns: number;
  } | null;
  powerplay: {
    enabled: boolean;
    canDeclare: boolean;
    currentOverNumber: number;
    bowlingCaptainPlayerId: string | null;
    rule: {
      targetRuns: number;
      successBonusRuns: number;
      endOverWhenTargetReached: boolean;
    } | null;
  };

  overCompleted: boolean;
  inningsCompleted: boolean;

  requiresBowlerSelection: boolean;
  requiresNewBatter: boolean;

  pendingSyncSupported: boolean;

  lastBall: BallEvent | null;
  currentOver: CurrentOver | null;
  lastCompletedOver: LastCompletedOver | null;
  currentBowlerFigures: { display: string } | null;
  availableBatters: string[];
  matchResult: {
    isCompleted: string;
    losingTeamId: string;
    marginText: string;
    resultType: string;
    summaryText: string;
    winningTeamId: string;
    winnerTeamId: string;
    scoreRows: {
      teamName: string;
      overs: string;
      inningsNumber: number;
      runs: number;
      wickets: number;
    }[];
  };
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

export interface StartInningsResponse {
  innings: Innings;
  state: ScoringState;
}
