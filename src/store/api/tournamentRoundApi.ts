import { baseApi } from "./baseApi";
import { TournamentFormat } from "./tournamentApi";

export type TournamentRoundType =
  | "LEAGUE"
  | "GROUP"
  | "SUPER_THREE"
  | "SUPER_FOUR"
  | "QUARTER_FINAL"
  | "SEMI_FINAL"
  | "FINAL"
  | "CUSTOM";

export type TournamentRoundStatus =
  | "DRAFT"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export type TournamentRound = {
  id: string;
  tournamentId: string;
  name: string;
  description?: string | null;
  roundType: TournamentRoundType;
  sequenceNumber: number;
  status: TournamentRoundStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTournamentRoundRequest = {
  tournamentId: string;
  body: {
    name: string;
    description?: string;
    roundType: TournamentRoundType;
    sequenceNumber: number;
  };
};

export type GetTournamentRoundsQuery = {
  tournamentId: string;
  roundType?: TournamentRoundType;
  status?: TournamentRoundStatus;
};

export type UpdateTournamentRoundRequest = {
  tournamentId: string;
  roundId: string;
  body: Partial<{
    name: string;
    description: string;
    roundType: TournamentRoundType;
    sequenceNumber: number;
  }>;
};

export type DeleteTournamentRoundRequest = {
  tournamentId: string;
  roundId: string;
};

export type TournamentRoundTemplateCategory =
  | "ROUND_ROBIN"
  | "KNOCKOUT"
  | "PLAYOFFS"
  | "FINALS"
  | "POSITION_MATCHES"
  | "TEST_MATCHES";

export type TournamentRoundTemplate = {
  key: string;
  label: string;
  description: string;
  category: TournamentRoundTemplateCategory;
  roundType: TournamentRoundType;
  suggestedSequenceNumber: number;
  supportedFormats: TournamentFormat[];
  isPopular: boolean;
  isFinalRound: boolean;
  isQualifierRound: boolean;
};

export type TournamentRoundTemplateGroup = {
  category: TournamentRoundTemplateCategory;
  title: string;
  description: string;
  templates: TournamentRoundTemplate[];
};

export type TournamentRoundTemplatesResponse = {
  groups: TournamentRoundTemplateGroup[];
};

export type GetTournamentRoundTemplatesQuery = {
  format?: TournamentFormat;
  category?: TournamentRoundTemplateCategory;
};

export const tournamentRoundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDefaultLeagueRound: builder.mutation<TournamentRound, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}/rounds/default-league`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, tournamentId) => [
        { type: "Tournament", id: tournamentId },
        { type: "TournamentRound", id: tournamentId },
      ],
    }),

    createTournamentRound: builder.mutation<
      TournamentRound,
      CreateTournamentRoundRequest
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/rounds`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        { type: "Tournament", id: tournamentId },
        { type: "TournamentRound", id: tournamentId },
      ],
    }),

    getTournamentRounds: builder.query<
      TournamentRound[],
      GetTournamentRoundsQuery
    >({
      query: ({ tournamentId, roundType, status }) => ({
        url: `/tournaments/${tournamentId}/rounds`,
        method: "GET",
        params: {
          ...(roundType && { roundType }),
          ...(status && { status }),
        },
      }),
      providesTags: (_result, _error, { tournamentId }) => [
        { type: "TournamentRound", id: tournamentId },
      ],
    }),

    getTournamentRoundDetails: builder.query<
      TournamentRound,
      {
        tournamentId: string;
        roundId: string;
      }
    >({
      query: ({ tournamentId, roundId }) => ({
        url: `/tournaments/${tournamentId}/rounds/${roundId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { roundId }) => [
        { type: "TournamentRound", id: roundId },
      ],
    }),

    updateTournamentRound: builder.mutation<
      TournamentRound,
      UpdateTournamentRoundRequest
    >({
      query: ({ tournamentId, roundId, body }) => ({
        url: `/tournaments/${tournamentId}/rounds/${roundId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId, roundId }) => [
        { type: "Tournament", id: tournamentId },
        { type: "TournamentRound", id: tournamentId },
        { type: "TournamentRound", id: roundId },
      ],
    }),

    deleteTournamentRound: builder.mutation<
      { success?: boolean; message?: string },
      DeleteTournamentRoundRequest
    >({
      query: ({ tournamentId, roundId }) => ({
        url: `/tournaments/${tournamentId}/rounds/${roundId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { tournamentId, roundId }) => [
        { type: "Tournament", id: tournamentId },
        { type: "TournamentRound", id: tournamentId },
        { type: "TournamentRound", id: roundId },
      ],
    }),

    getTournamentRoundTemplates: builder.query<
      TournamentRoundTemplatesResponse,
      GetTournamentRoundTemplatesQuery | void
    >({
      query: (params) => ({
        url: "/tournament-round-templates",
        method: "GET",
        params: params ?? undefined,
      }),
    }),
  }),
});

export const {
  useCreateDefaultLeagueRoundMutation,
  useCreateTournamentRoundMutation,
  useGetTournamentRoundsQuery,
  useGetTournamentRoundDetailsQuery,
  useUpdateTournamentRoundMutation,
  useDeleteTournamentRoundMutation,
  useGetTournamentRoundTemplatesQuery,
} = tournamentRoundApi;
