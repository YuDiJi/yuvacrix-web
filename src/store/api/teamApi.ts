import { CreatePlayerDto, GetPlayerResponse } from "@/types/player";
import { baseApi } from "./baseApi";
import { CreateTeamDto, GetTeamResponse } from "@/types/team";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTeam: builder.mutation({
      query: (body: CreateTeamDto) => ({
        url: "/teams/create",
        method: "POST",
        body,
      }),
    }),
    // updatePlayer: builder.mutation({
    //   query: (body: Partial<CreatePlayerDto>) => ({
    //     url: "/players/me",
    //     method: "PATCH",
    //     body,
    //   }),
    //   invalidatesTags: ["Auth", "Player"],
    // }),
    getOwnedTeam: builder.query<GetTeamResponse, void>({
      query: () => ({
        url: "/teams/me/owned",
      }),
    }),
  }),
});

export const { useCreateTeamMutation, useGetOwnedTeamQuery } = teamApi;
