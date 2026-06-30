export type ScorecardResponse = {
  match: ScorecardMatch;
  innings: InningsScorecard[];
  squads?: ScorecardSquads | null;
  mvp?: MvpResponse | null;
};

export type ScorecardSummaryResponse = {
  teamAScore: TeamScoreSummary;
  teamBScore: TeamScoreSummary;
  resultText: string | null;
  winnerTeamId: string | null;
};

export type CommentaryResponse = {
  matchId: string;
  teamA: CommentaryTeamBlock;
  teamB: CommentaryTeamBlock;
  pagination: CommentaryPagination;
};

export type CommentaryTeamBlock = {
  team: MatchTeamSnapshot;
  inningsNumber: number;
  inningsId: string;
  commentary: CommentaryItem[];
};

export type CommentaryPagination = {
  limit: number;
  cursor: string | null;
  nextCursor: string | null;
  hasMore: boolean;
};

export type CommentaryItem = {
  sequenceNumber: number;
  inningsId: string;
  inningsNumber: number;
  overText: string;
  marker: string;
  text: string;
  eventType: "NORMAL" | "WICKET" | string;
  batterId: string | null;
  batterNameSnapshot: string | null;
  bowlerId: string | null;
  bowlerNameSnapshot: string | null;
  runs: number;
  isWicket: boolean;
  wicketType: string | null;
  dismissedPlayerId: string | null;
  dismissedPlayerNameSnapshot: string | null;
  dismissalText: string | null;
  createdAt: string;
};

export type ScorecardMatch = {
  matchId: string;
  status: string;
  matchType: string;
  teamA: MatchTeamSnapshot;
  teamB: MatchTeamSnapshot;
  venue?: {
    groundName?: string | null;
    city?: string | null;
  } | null;
  toss?: {
    wonByTeamId?: string | null;
    decision?: "BAT" | "BOWL" | null;
  } | null;
  result?: {
    resultType?: string | null;
    marginText?: string | null;
    summaryText?: string | null;
  } | null;
};

export type MatchTeamSnapshot = {
  teamId: string;
  teamNameSnapshot: string;
  shortNameSnapshot?: string | null;
  logoUrlSnapshot?: string | null;
};

export type TeamScoreSummary = {
  teamId: string;
  teamNameSnapshot: string;
  runs: number;
  wickets: number;
  overs: string;
  runRate: number;
};

export type InningsScorecard = {
  inningsId: string;
  inningsNumber: number;
  battingTeam: MatchTeamSnapshot;
  bowlingTeam: MatchTeamSnapshot;
  totalRuns: number;
  wickets: number;
  overs: string;
  batters: BatterScore[];
  bowlers: BowlerScore[];
  extras: Extras;
  fallOfWickets: FallOfWicket[];
  toBat: ToBatPlayer[];
  overSummaries: OverSummary[];
};

export type BatterScore = {
  playerId: string;
  playerNameSnapshot: string;
  profileImageSnapshot?: string | null;
  isCaptain: boolean;
  isWicketKeeper: boolean;
  battingOrder?: number | null;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissalText?: string | null;
  dismissalType?: string | null;
  isOut: boolean;
  isNotOut: boolean;
};

export type BowlerScore = {
  playerId: string;
  playerNameSnapshot: string;
  profileImageSnapshot?: string | null;
  overs: string;
  legalBalls: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  wides: number;
  noBalls: number;
};

export type Extras = {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalties: number;
  total: number;
};

export type FallOfWicket = {
  wicketNumber: number;
  playerId: string;
  playerNameSnapshot: string;
  teamScore: number;
  overText: string;
  dismissalText?: string | null;
};

export type ToBatPlayer = {
  playerId: string;
  playerNameSnapshot: string;
  profileImageSnapshot?: string | null;
  isCaptain: boolean;
  isWicketKeeper: boolean;
  battingOrder?: number | null;
};

export type OverSummary = {
  overNumber: number;
  bowlerId: string;
  bowlerNameSnapshot: string;
  runs: number;
  wickets: number;
  legalBalls: number;
  summaryText: string;
  balls: OverBall[];
};

export type OverBall = {
  sequenceNumber: number;
  overText: string;
  runs: number;
  isLegalDelivery: boolean;
  marker: string;
  eventType: string;
  isWicket: boolean;
};

export type ScorecardSquads = {
  teamA: SquadTeam;
  teamB: SquadTeam;
};

export type SquadTeam = {
  team: MatchTeamSnapshot;
  players: SquadPlayer[];
};

export type SquadPlayer = {
  playerId: string;
  playerNameSnapshot: string;
  profileImageSnapshot?: string | null;
  isPlayingXi: boolean;
  isSubstitute: boolean;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isWicketKeeper: boolean;
  battingOrder?: number | null;
  roleTags: string[];
};

export type MvpResponse = {
  playerOfTheMatchCandidate: MvpPlayer | null;
  bestBatter: MvpPlayer | null;
  bestBowler: MvpPlayer | null;
  rankings: MvpPlayer[];
  formulaVersion?: string;
};

export type MvpPlayer = {
  playerId: string;
  playerNameSnapshot: string;
  profileImageSnapshot?: string | null;
  teamId: string;
  teamNameSnapshot: string;
  batting?: Record<string, unknown>;
  bowling?: Record<string, unknown>;
  fielding?: Record<string, unknown>;
  mvpScore: number;
  reason?: string | null;
};
