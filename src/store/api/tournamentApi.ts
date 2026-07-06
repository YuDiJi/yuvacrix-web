import { baseApi } from "./baseApi";

export type TournamentVisibility = "PUBLIC" | "PRIVATE";

export type TournamentFormat =
  | "LEAGUE"
  | "GROUP_STAGE"
  | "CUSTOM"
  | "KNOCKOUT"
  | "GROUP_STAGE_PLUS_KNOCKOUT"
  | "SUPER_THREE"
  | "SUPER_FOUR"
  | "DOUBLE_ELIMINATION";

export type TournamentStatus =
  | "DRAFT"
  | "FIXTURES_READY"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED"
  | "CANCELLED";

export type TournamentLocation = {
  city: string;
  groundName?: string;
  locationLabel?: string;
};

export type Tournament = {
  id: string;
  name: string;
  shortName?: string | null;
  description?: string | null;
  visibility: TournamentVisibility;
  format: TournamentFormat;
  status: TournamentStatus;
  startDate?: string | null;
  endDate?: string | null;
  location?: TournamentLocation | null;
  teamCount?: number;
  fixtureCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTournamentRequest = {
  name: string;
  shortName?: string;
  description?: string;
  visibility: TournamentVisibility;
  format: TournamentFormat;
  startDate?: string;
  endDate?: string;
  location?: TournamentLocation;
};

export type UpdateTournamentRequest = Partial<CreateTournamentRequest>;

export type GetOwnedTournamentsQuery = {
  status?: TournamentStatus;
  format?: TournamentFormat;
  page?: number;
  limit?: number;
};

export type SearchTournamentsQuery = {
  q?: string;
  page?: number;
  limit?: number;
};

export type CompleteTournamentRequest = {
  winnerTeamId: string;
  runnerUpTeamId: string;
  resultSummary?: string;
  completionReason?: string;
};

export type CancelTournamentRequest = {
  cancellationReason: string;
};

export const tournamentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTournament: builder.mutation<Tournament, CreateTournamentRequest>({
      query: (body) => ({
        url: "/tournaments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tournament"],
    }),

    getMyOwnedTournaments: builder.query<
      Tournament[],
      GetOwnedTournamentsQuery | void
    >({
      query: (params) => ({
        url: "/tournaments/me/owned",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["Tournament"],
    }),

    searchPublicTournaments: builder.query<
      Tournament[],
      SearchTournamentsQuery | void
    >({
      query: (params) => ({
        url: "/tournaments/search",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["Tournament"],
    }),

    getTournamentDetails: builder.query<Tournament, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, tournamentId) => [
        { type: "Tournament", id: tournamentId },
      ],
    }),

    updateTournament: builder.mutation<
      Tournament,
      {
        tournamentId: string;
        body: UpdateTournamentRequest;
      }
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),

    markFixturesReady: builder.mutation<Tournament, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}/fixtures-ready`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, tournamentId) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),

    activateTournament: builder.mutation<Tournament, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}/activate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, tournamentId) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),

    completeTournament: builder.mutation<
      Tournament,
      {
        tournamentId: string;
        body: CompleteTournamentRequest;
      }
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/complete`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),

    cancelTournament: builder.mutation<
      Tournament,
      {
        tournamentId: string;
        body: CancelTournamentRequest;
      }
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/cancel`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),

    archiveTournament: builder.mutation<Tournament, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}/archive`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, tournamentId) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),
  }),
});

export const {
  useCreateTournamentMutation,
  useGetMyOwnedTournamentsQuery,
  useSearchPublicTournamentsQuery,
  useGetTournamentDetailsQuery,
  useUpdateTournamentMutation,
  useMarkFixturesReadyMutation,
  useActivateTournamentMutation,
  useCompleteTournamentMutation,
  useCancelTournamentMutation,
  useArchiveTournamentMutation,
} = tournamentApi;
