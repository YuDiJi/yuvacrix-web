import { baseApi } from "../baseApi";

import type {
  AddVolleyballTeamMemberDto,
  GetVolleyballTeamMembersResponse,
  UpdateVolleyballTeamMemberDto,
  VolleyballTeamMember,
} from "@/types/volleyball/team";

export const volleyballTeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVolleyballTeamMembers: builder.query<
      GetVolleyballTeamMembersResponse,
      { teamId: string }
    >({
      query: ({ teamId }) => ({
        url: `/volleyball/teams/${teamId}/members`,
        method: "GET",
      }),

      providesTags: (_result, _error, { teamId }) => [
        {
          type: "VolleyballTeamMembers",
          id: teamId,
        },
      ],
    }),

    addVolleyballTeamMember: builder.mutation<
      VolleyballTeamMember,
      {
        teamId: string;
        body: AddVolleyballTeamMemberDto;
      }
    >({
      query: ({ teamId, body }) => ({
        url: `/volleyball/teams/${teamId}/members`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { teamId }) => [
        {
          type: "VolleyballTeamMembers",
          id: teamId,
        },
        "Team",
      ],
    }),

    updateVolleyballTeamMember: builder.mutation<
      VolleyballTeamMember,
      {
        teamId: string;
        playerId: string;
        body: UpdateVolleyballTeamMemberDto;
      }
    >({
      query: ({ teamId, playerId, body }) => ({
        url: `/volleyball/teams/${teamId}/members/${playerId}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { teamId }) => [
        {
          type: "VolleyballTeamMembers",
          id: teamId,
        },
        "Team",
      ],
    }),

    removeVolleyballTeamMember: builder.mutation<
      void,
      {
        teamId: string;
        playerId: string;
      }
    >({
      query: ({ teamId, playerId }) => ({
        url: `/volleyball/teams/${teamId}/members/${playerId}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, { teamId }) => [
        {
          type: "VolleyballTeamMembers",
          id: teamId,
        },
        "Team",
      ],
    }),
  }),
});

export const {
  useGetVolleyballTeamMembersQuery,
  useAddVolleyballTeamMemberMutation,
  useUpdateVolleyballTeamMemberMutation,
  useRemoveVolleyballTeamMemberMutation,
} = volleyballTeamApi;
