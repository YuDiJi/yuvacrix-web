import { CreatePlayerDto, GetPlayerResponse } from "@/types/player";
import { baseApi } from "./baseApi";
import {
  AddTeamMemberDto,
  CreateTeamDto,
  Team,
  TeamMember,
} from "@/types/team";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTeam: builder.mutation({
      query: (body: CreateTeamDto) => ({
        url: "/teams/create",
        method: "POST",
        body,
      }),
    }),

    getOwnedTeam: builder.query<Team[], void>({
      query: () => ({
        url: "/teams/me/owned",
      }),
      providesTags: ["Team"],
    }),

    getTeamDetail: builder.query<Team, { teamId: string }>({
      query: ({ teamId }) => ({
        url: `/teams/${teamId}`,
      }),
      providesTags: ["Team"],
    }),

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

    // setTeamMemberRole: builder.mutation<
    //   void,
    //   {
    //     teamId: string;
    //     playerId: string;
    //     body: {
    //       role: "CAPTAIN" | "WICKET_KEEPER";
    //     };
    //   }
    // >({
    //   query: ({ teamId, playerId, body }) => ({
    //     url: `/teams/${teamId}/members/${playerId}/roles`,
    //     method: "PATCH",
    //     body,
    //   }),
    //   invalidatesTags: ["Members", "Team"],
    // }),
  }),
});

export const {
  useCreateTeamMutation,
  useGetOwnedTeamQuery,
  useGetTeamMembersQuery,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useGetTeamDetailQuery,
} = teamApi;
