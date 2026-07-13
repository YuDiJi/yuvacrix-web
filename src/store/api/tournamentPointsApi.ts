import { baseApi } from "./baseApi";

export type TournamentPointsScope = "TOURNAMENT" | "ROUND" | "GROUP";

export type NrrCalculationStatus = "COMPLETE" | "INCOMPLETE";

export type TournamentPointsTableRow = {
  position: number;

  teamId: string;
  teamNameSnapshot: string;
  teamShortNameSnapshot?: string | null;
  teamLogoSnapshot?: string | null;

  matchesPlayed: number;
  wins: number;
  losses: number;
  ties: number;
  noResults: number;
  cancelled: number;

  points: number;
  bonusPoints: number;
  penaltyPoints: number;

  runsFor: number;
  ballsFor: number;
  runsAgainst: number;
  ballsAgainst: number;

  runRateFor: number;
  runRateAgainst: number;
  nrr: number;

  nrrCalculationStatus: NrrCalculationStatus;
};

export type TournamentPointsTableResponse = {
  tournamentId: string;
  scope: TournamentPointsScope;

  roundId: string | null;
  groupId: string | null;

  calculatedAt: string;

  rows: TournamentPointsTableRow[];
};

export type GetTournamentPointsTableQuery = {
  tournamentId: string;
  roundId?: string;
  groupId?: string;
};

export const tournamentPointsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTournamentPointsTable: builder.query<
      TournamentPointsTableResponse,
      GetTournamentPointsTableQuery
    >({
      query: ({ tournamentId, roundId, groupId }) => ({
        url: `/tournaments/${tournamentId}/points-table`,
        method: "GET",
        params: {
          ...(roundId && { roundId }),
          ...(groupId && { groupId }),
        },
      }),

      providesTags: (_result, _error, { tournamentId }) => [
        {
          type: "TournamentPointsTable",
          id: tournamentId,
        },
      ],
    }),
  }),
});

export const {
  useGetTournamentPointsTableQuery,
  useLazyGetTournamentPointsTableQuery,
} = tournamentPointsApi;
