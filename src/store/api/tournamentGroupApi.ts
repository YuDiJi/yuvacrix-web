import { baseApi } from "./baseApi";

export type TournamentGroupStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "COMPLETED"
  | "ARCHIVED";

export type TournamentGroup = {
  id: string;
  tournamentId: string;
  roundId: string;

  name: string;
  description?: string | null;

  sequenceNumber?: number | null;
  status?: TournamentGroupStatus;

  createdAt?: string;
  updatedAt?: string;
};

export type CreateTournamentGroupRequest = {
  tournamentId: string;
  roundId: string;
  body: {
    name: string;
    description?: string;
    teamIds: string[];
  };
};

export type UpdateTournamentGroupRequest = {
  tournamentId: string;
  roundId: string;
  groupId: string;
  body: {
    name?: string;
    description?: string | null;
    sequenceNumber?: number;
  };
};

export type GetTournamentGroupsRequest = {
  tournamentId: string;
  roundId: string;
};

export const tournamentGroupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTournamentGroups: builder.query<
      TournamentGroup[],
      GetTournamentGroupsRequest
    >({
      query: ({ tournamentId, roundId }) => ({
        url: `/tournaments/${tournamentId}/rounds/${roundId}/groups`,
        method: "GET",
      }),

      providesTags: (result, _error, { roundId }) =>
        result
          ? [
              ...result.map((group) => ({
                type: "TournamentGroup" as const,
                id: group.id,
              })),
              {
                type: "TournamentGroup" as const,
                id: `LIST-${roundId}`,
              },
            ]
          : [
              {
                type: "TournamentGroup" as const,
                id: `LIST-${roundId}`,
              },
            ],
    }),

    createTournamentGroup: builder.mutation<
      TournamentGroup,
      CreateTournamentGroupRequest
    >({
      query: ({ tournamentId, roundId, body }) => ({
        url: `/tournaments/${tournamentId}/rounds/${roundId}/groups`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { roundId }) => [
        {
          type: "TournamentGroup",
          id: `LIST-${roundId}`,
        },
      ],
    }),

    updateTournamentGroup: builder.mutation<
      TournamentGroup,
      UpdateTournamentGroupRequest
    >({
      query: ({ tournamentId, roundId, groupId, body }) => ({
        url: `/tournaments/${tournamentId}/rounds/${roundId}/groups/${groupId}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { roundId, groupId }) => [
        {
          type: "TournamentGroup",
          id: groupId,
        },
        {
          type: "TournamentGroup",
          id: `LIST-${roundId}`,
        },
      ],
    }),
  }),
});

export const {
  useGetTournamentGroupsQuery,
  useLazyGetTournamentGroupsQuery,
  useCreateTournamentGroupMutation,
  useUpdateTournamentGroupMutation,
} = tournamentGroupApi;
