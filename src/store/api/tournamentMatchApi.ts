import { MatchType } from "@/types/match";
import { baseApi } from "./baseApi";

export type TournamentMatchFilter = "ALL" | "LIVE" | "UPCOMING" | "PAST";

export type TournamentMatchStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "READY_FOR_TOSS"
  | "TOSS_DONE"
  | "LIVE"
  | "INNINGS_BREAK"
  | "COMPLETED"
  | "CANCELLED"
  | "ABANDONED";

export type TournamentMatchScoringStatus =
  | "NOT_STARTED"
  | "FIRST_INNINGS"
  | "INNINGS_BREAK"
  | "SECOND_INNINGS"
  | "MATCH_COMPLETED"
  | string;

export type TournamentMatchPrimaryAction =
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

export type TournamentMatchInningsStatus =
  | "NOT_STARTED"
  | "LIVE"
  | "COMPLETED"
  | "DECLARED"
  | string;

export type TournamentMatchTeamScore = {
  runs: number;
  wickets: number;
  oversText: string;
  inningsNumber: number;
  status: TournamentMatchInningsStatus;
};

export type TournamentMatchTeam = {
  teamId: string;
  name: string;
  shortName?: string | null;
  logoUrl?: string | null;

  score?: TournamentMatchTeamScore | null;

  captainId?: string | null;
  viceCaptainId?: string | null;
  wicketKeeperId?: string | null;
};

export type TournamentMatchVenue = {
  groundName?: string | null;
  city?: string | null;
};

export type TournamentMatchRoundSummary = {
  roundId: string;
  name: string;
};

export type TournamentMatchListItem = {
  matchId: string;
  fixtureId: string;

  status: TournamentMatchStatus;
  scoringStatus: TournamentMatchScoringStatus;
  primaryAction: TournamentMatchPrimaryAction;

  matchType: MatchType;

  summaryText?: string | null;

  teamA: TournamentMatchTeam;
  teamB: TournamentMatchTeam;

  oversLimit?: number | null;
  venue?: TournamentMatchVenue | null;

  round: TournamentMatchRoundSummary;
  roundId: string;

  scheduledAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;

  createdAt: string;
  updatedAt: string;
};

export type GetTournamentMatchesQuery = {
  tournamentId: string;
  filter?: TournamentMatchFilter;
  roundId?: string;
  groupId?: string;
  teamId?: string;
  skip?: number;
  limit?: number;
};

export type GetTournamentMatchRequest = {
  tournamentId: string;
  matchId: string;
};

export const tournamentMatchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTournamentMatches: builder.query<
      TournamentMatchListItem[],
      GetTournamentMatchesQuery
    >({
      query: ({
        tournamentId,
        filter = "ALL",
        roundId,
        groupId,
        teamId,
        skip = 0,
        limit = 50,
      }) => ({
        url: `/tournaments/${tournamentId}/matches`,
        method: "GET",
        params: {
          filter,
          skip,
          limit,
          ...(roundId && { roundId }),
          ...(groupId && { groupId }),
          ...(teamId && { teamId }),
        },
      }),
      providesTags: (result, _error, { tournamentId }) =>
        result
          ? [
              ...result.map((match) => ({
                type: "TournamentMatch" as const,
                id: match.matchId,
              })),
              {
                type: "TournamentMatch" as const,
                id: `LIST-${tournamentId}`,
              },
            ]
          : [
              {
                type: "TournamentMatch" as const,
                id: `LIST-${tournamentId}`,
              },
            ],
    }),

    getTournamentMatch: builder.query<
      TournamentMatchListItem,
      GetTournamentMatchRequest
    >({
      query: ({ tournamentId, matchId }) => ({
        url: `/tournaments/${tournamentId}/matches/${matchId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { matchId }) => [
        {
          type: "TournamentMatch",
          id: matchId,
        },
      ],
    }),
  }),
});

export const {
  useGetTournamentMatchesQuery,
  useLazyGetTournamentMatchesQuery,
  useGetTournamentMatchQuery,
} = tournamentMatchApi;
