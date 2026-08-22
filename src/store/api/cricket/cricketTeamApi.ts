import { baseApi } from "../baseApi";
import {
  GetMyCricketProfileTeamsQuery,
  GetMyCricketProfileTeamsResponse,
  GetMyTeamsOverviewParams,
  GetMyTeamsOverviewResponse,
} from "@/types/cricket/team";
import { AddTeamMemberDto, TeamMember } from "@/types/cricket/team";

export const cricketTeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query<TeamMember[], { teamId: string }>({
      query: ({ teamId }: { teamId: string }) => ({
        url: `/teams/${teamId}/members`,
      }),
      providesTags: ["Members"],
    }),

    addTeamMember: builder.mutation<
      void,
      { teamId: string; body: AddTeamMemberDto }
    >({
      query: ({ teamId, body }) => ({
        url: `/teams/${teamId}/members`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Members", "Team"],
    }),

    removeTeamMember: builder.mutation<
      void,
      { teamId: string; playerId: string }
    >({
      query: ({ teamId, playerId }) => ({
        url: `/teams/${teamId}/members/${playerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Members", "Team"],
    }),
    getMyCricketProfileTeams: builder.query<
      GetMyCricketProfileTeamsResponse,
      GetMyCricketProfileTeamsQuery | void
    >({
      query: (params) => ({
        url: "/cricket-profile/me/teams",
        method: "GET",
        params: {
          skip: params?.skip ?? 0,
          limit: params?.limit ?? 10,
          ...(params?.currentOnly !== undefined
            ? {
                currentOnly: params.currentOnly,
              }
            : {}),
        },
      }),

      providesTags: ["CricketProfileTeams"],
    }),

    getMyTeamsOverview: builder.query<
      GetMyTeamsOverviewResponse,
      GetMyTeamsOverviewParams
    >({
      query: ({ filter, skip, limit }) => ({
        url: "/teams/me/overview",
        params: {
          filter,
          skip,
          limit,
        },
      }),

      providesTags: ["Team"],
    }),
  }),
});

export const {
  useGetTeamMembersQuery,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useGetMyCricketProfileTeamsQuery,
  useGetMyTeamsOverviewQuery,
} = cricketTeamApi;
