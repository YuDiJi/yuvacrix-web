export type VolleyballPerformanceResult = "WIN" | "LOSS" | "TIE";

export interface VolleyballPerformanceOverall {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  matchesTied: number;

  setsPlayed: number;
  setsStarted: number;

  totalCreditedPoints: number;

  servePoints: number;
  attackPoints: number;
  blockPoints: number;

  creditedPointsPerMatch: number;
  creditedPointsPerSet: number;

  bestPlayerAwards: number;
}

export interface VolleyballPerformanceMatch {
  matchId: string;

  completedAt: string;

  teamId: string;
  teamName: string;

  opponentTeamId: string;
  opponentTeamName: string;

  result: VolleyballPerformanceResult;

  setsPlayed: number;
  setsStarted: number;

  totalCreditedPoints: number;

  servePoints: number;
  attackPoints: number;
  blockPoints: number;

  substitutionsIn: number;
  substitutionsOut: number;

  liberoEntries: number;
  liberoExits: number;

  wasCaptain: boolean;
  wasLibero: boolean;

  wonBestPlayerAward: boolean;
}

export interface VolleyballCurrentForm {
  matches: VolleyballPerformanceMatch[];
}

export interface VolleyballYearlyPerformance {
  year: number;

  matchesPlayed: number;
  setsPlayed: number;

  totalCreditedPoints: number;

  servePoints: number;
  attackPoints: number;
  blockPoints: number;

  bestPlayerAwards: number;
}

export interface VolleyballParticipation {
  matchesAsCaptain: number;

  matchesDesignatedLibero: number;

  substitutionsIn: number;
  substitutionsOut: number;

  liberoEntries: number;
  liberoExits: number;
}

export interface VolleyballPointComposition {
  serve: number;
  attack: number;
  block: number;
}

export interface VolleyballPerformanceMetadata {
  sport: "VOLLEYBALL";

  qualifiedMatches: number;

  completedMatchesAnalyzed: number;

  generatedAt: string;

  schemaVersion: number;
}

export interface VolleyballPerformanceResponse {
  overall: VolleyballPerformanceOverall;

  currentForm: VolleyballCurrentForm;

  yearly: VolleyballYearlyPerformance[];

  byMatch: VolleyballPerformanceMatch[];

  participation: VolleyballParticipation;

  pointComposition: VolleyballPointComposition;

  metadata: VolleyballPerformanceMetadata;
}
