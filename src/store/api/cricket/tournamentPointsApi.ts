import { baseApi } from "../baseApi";

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

export const tournamentPointsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTournamentPointsTable: builder.query<
      TournamentPointsTableResponse,
      {
        tournamentId: string;
      }
    >({
      query: ({ tournamentId }) => ({
        url: `/tournaments/${tournamentId}/points-table`,
        method: "GET",
      }),

      providesTags: (_result, _error, { tournamentId }) => [
        {
          type: "TournamentPointsTable",
          id: `TOURNAMENT-${tournamentId}`,
        },
      ],
    }),

    getTournamentRoundPointsTable: builder.query<
      TournamentPointsTableResponse,
      {
        tournamentId: string;
        roundId: string;
      }
    >({
      query: ({ tournamentId, roundId }) => ({
        url: `/tournaments/${tournamentId}/rounds/${roundId}/points-table`,
        method: "GET",
      }),

      providesTags: (_result, _error, { roundId }) => [
        {
          type: "TournamentPointsTable",
          id: `ROUND-${roundId}`,
        },
      ],
    }),

    getTournamentGroupPointsTable: builder.query<
      TournamentPointsTableResponse,
      {
        tournamentId: string;
        groupId: string;
      }
    >({
      query: ({ tournamentId, groupId }) => ({
        url: `/tournaments/${tournamentId}/groups/${groupId}/points-table`,
        method: "GET",
      }),

      providesTags: (_result, _error, { groupId }) => [
        {
          type: "TournamentPointsTable",
          id: `GROUP-${groupId}`,
        },
      ],
    }),
  }),
});

export const {
  useGetTournamentPointsTableQuery,
  useGetTournamentRoundPointsTableQuery,
  useGetTournamentGroupPointsTableQuery,
} = tournamentPointsApi;
