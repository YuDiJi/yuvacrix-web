export type MatchCardStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "READY_FOR_TOSS"
  | "TOSS_DONE"
  | "LIVE"
  | "INNINGS_BREAK"
  | "COMPLETED"
  | "CANCELLED"
  | "ABANDONED"
  | "IN_REVIEW";

export type MatchCardPrimaryAction =
  | "SET_LINEUP"
  | "DO_TOSS"
  | "START_FIRST_INNINGS"
  | "START_SCORING"
  | "START_SECOND_INNINGS"
  | "RESUME_SCORING"
  | "VIEW_RESULT"
  | "VIEW_SCORECARD"
  | "NONE"
  | string;

export type MatchCardScore = {
  runs: number;
  wickets: number;
  oversText: string;
};

export type MatchCardTeam = {
  teamId: string;
  name: string;
  shortName?: string | null;
  logoUrl?: string | null;

  score?: MatchCardScore | null;

  squadCount?: number;
  captainId?: string | null;
  captainName?: string | null;
  wicketKeeperId?: string | null;
  wicketKeeperName?: string | null;
};

export type MatchCardModel = {
  matchId: string;
  fixtureId?: string | null;

  status: MatchCardStatus;
  primaryAction?: MatchCardPrimaryAction | null;
  matchType?: string | null;

  lineupMode?: "FIXED" | "FLEXIBLE";

  teamA: MatchCardTeam;
  teamB: MatchCardTeam;

  scheduledAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;

  summaryText?: string | null;

  oversLimit?: number | null;

  venue?: {
    city?: string | null;
    groundName?: string | null;
  } | null;

  roundId?: string | null;
  roundName?: string | null;

  source: "MATCH" | "TOURNAMENT";
};
