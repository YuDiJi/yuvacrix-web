export type MatchType =
  | "LIMITED_OVERS"
  | "BOX_TURF"
  | "PAIR_CRICKET"
  | "TEST"
  | "THE_HUNDRED";

export type BallType = "TENNIS" | "LEATHER" | "OTHER";

export type PitchType =
  | "ROUGH"
  | "CEMENT"
  | "TURF"
  | "ASTROTURF"
  | "MATTING"
  | "OTHER";

export type LineupMode = "FIXED" | "FLEXIBLE";

export type TossDecision = "BAT" | "BOWL";

export type MatchStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "READY_FOR_TOSS"
  | "TOSS_DONE"
  | "LIVE"
  | "INNINGS_BREAK"
  | "COMPLETED"
  | "CANCELLED"
  | "ABANDONED";

export interface Venue {
  city: string;
  groundName: string;
  pitchType: PitchType;
}

export interface ScoringSettings {
  wagonWheelEnabled: boolean;
  wagonWheelForRuns: number[];
}

export interface MatchOfficials {
  scorerUserIds: string[];
  umpireNames: string[];
  liveStreamerUserIds: string[];
  otherNames: string[];
}

export interface CreateMatchDto {
  teamAId: string;
  teamBId: string;
  matchType: MatchType;
  oversLimit: number;
  oversPerBowler: number;
  lineupMode?: LineupMode;
  ballType: BallType;
  venue: Venue;
  scheduledAt?: string;
  scoringSettings?: ScoringSettings;
  officials?: MatchOfficials;
}

export type CreateMatchForm = {
  teamAId: string;
  teamBId: string;
  matchType: MatchType;
  oversLimit: number;
  oversPerBowler: number;
  ballType: BallType;
};

export interface SubmitLineupPlayerDto {
  playerId: string;
  isPlayingXi: boolean;
  battingOrder: number;
}

export interface SubmitLineupDto {
  playingXiCount: number;
  players: SubmitLineupPlayerDto[];
  captainId: string;
  wicketKeeperId: string;
}

export interface SubmitTeamLineupRequest {
  matchId: string;
  teamId: string;
  body: SubmitLineupDto;
}
export interface SubmitTeamCaptainWKRequest {
  matchId: string;
  teamId: string;
  body: { captainId: string; wicketKeeperId: string };
}

export interface CreateMatchResponse {
  match: {
    id: string;
    teamAId: string;
    teamBId: string;
    status: string;
  };

  teams: Array<{
    id: string;
    matchId: string;
    teamId: string;
    side: MatchSide;
    captainId: string | null;
    wicketKeeperId: string | null;
  }>;

  players: unknown[];
}

export interface MatchActor {
  actorType: "USER";
  actorId: string;
}

export interface MatchRules {
  matchType: MatchType;
  oversLimit: number;
  oversPerBowler: number;
  lineupMode: LineupMode;
}

export interface MatchEnvironment {
  ballType: BallType;
  venueSnapshot: Venue;
}

export interface MatchTeam {
  teamId: string;
  name: string;
  shortName: string;
  logoUrl: string | null;

  captainId: string | null;
  viceCaptainId: string | null;
  wicketKeeperId: string | null;

  squadCount: number;
  playingXiCount: number;
}

export interface MatchToss {
  wonByTeamId: string;
  decision: TossDecision;
  electedAt: string;
  updatedBy: MatchActor;
}

export interface MatchResult {
  // add fields when backend finalizes schema
}

export interface Match {
  matchId: string;
  status: MatchStatus;

  seriesId: string | null;

  matchType: MatchType;
  lineupMode: LineupMode;

  oversLimit: number;
  oversPerBowler: number;

  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;

  teamA: MatchTeam;
  teamB: MatchTeam;

  venue: Venue;
  ballType: BallType;

  toss: MatchToss | null;
  result: MatchResult | null;

  createdAt: string;
  updatedAt: string;
}

export type GetMyMatchesResponse = Match[];

export type MatchSide = "TEAM_A" | "TEAM_B";

export interface MatchDetailsTeam {
  id: string;
  matchId: string;

  teamId: string;
  side: MatchSide;

  teamNameSnapshot: string;
  teamShortNameSnapshot: string;

  captainId: string | null;
  viceCaptainId: string | null;
  wicketKeeperId: string | null;

  squadCount: number;
  playingXiCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface MatchDetailsPlayer {
  id: string;
  matchId: string;

  teamId: string;
  playerId: string;

  playerNameSnapshot: string;
  profileImageUrl?: string;

  isPlayingXi: boolean;
  isSubstitute: boolean;

  battingOrder: number;

  isCaptain: boolean;
  isWicketKeeper: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface GetMatchByIdResponse {
  match: Match;
  teams: MatchDetailsTeam[];
  players: MatchDetailsPlayer[];
}
