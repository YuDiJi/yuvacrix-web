import { baseApi } from "../baseApi";

export type TournamentGroupTeam = {
  teamId: string;
  teamNameSnapshot?: string;
  teamShortNameSnapshot?: string | null;
  teamLogoSnapshot?: string | null;
};

export type TournamentGroup = {
  id: string;
  tournamentId: string;
  roundId: string;

  name: string;
  description?: string | null;

  teamIds?: string[];
  // teams?: TournamentGroupTeam[];

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
    name: string;
    description?: string;
  };
};

export type ReplaceTournamentGroupTeamsRequest = {
  tournamentId: string;
  roundId: string;
  groupId: string;
  body: {
    teamIds: string[];
  };
};

export type DeleteTournamentGroupRequest = {
  tournamentId: string;
  roundId: string;
  groupId: string;
};

export const tournamentGroupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTournamentGroups: builder.query<
      TournamentGroup[],
      {
        tournamentId: string;
        roundId: string;
      }
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

    getTournamentGroupDetail: builder.query<
      TournamentGroup,
      {
        tournamentId: string;
        groupId: string;
      }
    >({
      query: ({ tournamentId, groupId }) => ({
        url: `/tournaments/${tournamentId}/groups/${groupId}`,
        method: "GET",
      }),

      providesTags: (_result, _error, { groupId }) => [
        {
          type: "TournamentGroup",
          id: groupId,
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
      query: ({ tournamentId, groupId, body }) => ({
        url: `/tournaments/${tournamentId}/groups/${groupId}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { groupId, roundId }) => [
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

    replaceTournamentGroupTeams: builder.mutation<
      TournamentGroup | void,
      ReplaceTournamentGroupTeamsRequest
    >({
      query: ({ tournamentId, groupId, body }) => ({
        url: `/tournaments/${tournamentId}/groups/${groupId}/teams`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (_result, _error, { groupId, roundId }) => [
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

    deleteTournamentGroupTeam: builder.mutation<
      void,
      {
        tournamentId: string;
        roundId: string;
        groupId: string;
        teamId: string;
      }
    >({
      query: ({ tournamentId, groupId, teamId }) => ({
        url: `/tournaments/${tournamentId}/groups/${groupId}/teams/${teamId}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, { groupId, roundId }) => [
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

    deleteTournamentGroup: builder.mutation<void, DeleteTournamentGroupRequest>(
      {
        query: ({ tournamentId, groupId }) => ({
          url: `/tournaments/${tournamentId}/groups/${groupId}`,
          method: "DELETE",
        }),

        invalidatesTags: (_result, _error, { groupId, roundId }) => [
          {
            type: "TournamentGroup",
            id: groupId,
          },
          {
            type: "TournamentGroup",
            id: `LIST-${roundId}`,
          },
        ],
      },
    ),
  }),
});

export const {
  useGetTournamentGroupsQuery,
  useLazyGetTournamentGroupsQuery,
  useGetTournamentGroupDetailQuery,
  useCreateTournamentGroupMutation,
  useUpdateTournamentGroupMutation,
  useReplaceTournamentGroupTeamsMutation,
  useDeleteTournamentGroupTeamMutation,
  useDeleteTournamentGroupMutation,
} = tournamentGroupApi;
