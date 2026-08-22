import { baseApi } from "./baseApi";
import { CreateTeamDto, Team } from "@/types/team";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTeam: builder.mutation<Team, CreateTeamDto>({
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
  }),
});

export const {
  useCreateTeamMutation,
  useGetOwnedTeamQuery,
  useGetTeamDetailQuery,
} = teamApi;
