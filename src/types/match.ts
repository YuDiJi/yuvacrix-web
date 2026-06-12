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

export interface Venue {
  city: string;
  groundName: string;
  pitchType: PitchType;
}

export interface ScoringSettings {
  wagonWheelEnabled: boolean;
  wagonWheelForRuns: number[];
}

export interface Officials {
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
  lineupMode?: "FLEXIBLE" | "FIXED";
  ballType: BallType;
  venue: Venue;
  scheduledAt?: string;
  scoringSettings?: ScoringSettings;
  officials?: Officials;
}

export type CreateMatchForm = {
  teamAId: string;
  teamBId: string;
  matchType: string;
  oversLimit: number;
  oversPerBowler: number;
  ballType: string;
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
    side: "TEAM_A" | "TEAM_B";
    captainId: string | null;
    wicketKeeperId: string | null;
  }>;

  players: unknown[];
}
