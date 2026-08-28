export const VOLLEYBALL_AWARD_SCOPES = {
  ALL: "ALL",
  MATCHES: "MATCHES",
  TOURNAMENTS: "TOURNAMENTS",
} as const;

export type VolleyballAwardQueryScope =
  (typeof VOLLEYBALL_AWARD_SCOPES)[keyof typeof VOLLEYBALL_AWARD_SCOPES];

export const VOLLEYBALL_AWARD_TYPES = {
  BEST_PLAYER: "BEST_PLAYER",
  TOURNAMENT_WINNER: "TOURNAMENT_WINNER",
  TOURNAMENT_RUNNER_UP: "TOURNAMENT_RUNNER_UP",
} as const;

export type VolleyballAwardType =
  (typeof VOLLEYBALL_AWARD_TYPES)[keyof typeof VOLLEYBALL_AWARD_TYPES];

export const VOLLEYBALL_AWARD_ITEM_SCOPES = {
  MATCH: "MATCH",
  TOURNAMENT: "TOURNAMENT",
} as const;

export type VolleyballAwardItemScope =
  (typeof VOLLEYBALL_AWARD_ITEM_SCOPES)[keyof typeof VOLLEYBALL_AWARD_ITEM_SCOPES];

/* =========================================================
   SUMMARY
========================================================= */

export interface VolleyballAwardsSummary {
  total: number;

  matchAwards: number;

  tournamentAwards: number;

  bestPlayerAwards: number;

  tournamentWins: number;

  tournamentRunnerUps: number;
}

/* =========================================================
   MATCH AWARD CONTEXT
========================================================= */

export interface VolleyballAwardMatch {
  matchId: string;

  teamId: string;

  teamName: string;

  opponentTeamId: string;

  opponentTeamName: string;
}

/* =========================================================
   TOURNAMENT AWARD CONTEXT
========================================================= */

export interface VolleyballAwardTournament {
  tournamentId: string;

  tournamentName: string;

  teamId: string;

  teamName: string;
}

/* =========================================================
   AWARD ITEM
========================================================= */

export interface VolleyballAwardItem {
  id: string;

  type: VolleyballAwardType;

  scope: VolleyballAwardItemScope;

  title: string;

  description: string | null;

  awardedAt: string;

  match: VolleyballAwardMatch | null;

  tournament: VolleyballAwardTournament | null;
}

/* =========================================================
   PAGINATION
========================================================= */

export interface VolleyballAwardsPagination {
  skip: number;

  limit: number;

  total: number;

  hasMore: boolean;
}

/* =========================================================
   RESPONSE
========================================================= */

export interface VolleyballMyAwardsResponse {
  playerId: string;

  summary: VolleyballAwardsSummary;

  items: VolleyballAwardItem[];

  pagination: VolleyballAwardsPagination;
}

/* =========================================================
   QUERY
========================================================= */

export interface GetVolleyballAwardsQuery {
  scope?: VolleyballAwardQueryScope;

  skip?: number;

  limit?: number;
}
