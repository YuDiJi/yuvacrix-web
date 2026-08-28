import { baseApi } from "./baseApi";
import { CreateTeamDto, Team, UpdateTeamDto } from "@/types/team";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTeam: builder.mutation<Team, CreateTeamDto>({
      query: (body: CreateTeamDto) => ({
        url: "/teams/create",
        method: "POST",
        body,
      }),
    }),

    updateTeam: builder.mutation<
      Team,
      {
        teamId: string;
        body: UpdateTeamDto;
      }
    >({
      query: ({ teamId, body }) => ({
        url: `/teams/${teamId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { teamId }) => [
        "Team",
        {
          type: "Team",
          id: teamId,
        },
      ],
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
  }),
});

export const {
  useCreateTeamMutation,

  useUpdateTeamMutation,
  useGetOwnedTeamQuery,
  useGetTeamDetailQuery,
} = teamApi;
