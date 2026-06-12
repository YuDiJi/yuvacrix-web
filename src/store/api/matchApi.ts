import { baseApi } from "./baseApi";
import {
  CreateMatchDto,
  CreateMatchResponse,
  SubmitTeamCaptainWKRequest,
  SubmitTeamLineupRequest,
} from "@/types/match";

export const matchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMatch: builder.mutation<CreateMatchResponse, CreateMatchDto>({
      query: (body) => ({
        url: "/matches",
        method: "POST",
        body,
      }),
    }),

    updateCaptianWK: builder.mutation<void, SubmitTeamCaptainWKRequest>({
      query: ({ matchId, teamId, body }) => ({
        url: `/matches/${matchId}/teams/${teamId}/roles`,
        method: "PATCH",
        body,
      }),
    }),

    submitTeamLineup: builder.mutation<void, SubmitTeamLineupRequest>({
      query: ({ matchId, teamId, body }) => ({
        url: `/matches/${matchId}/teams/${teamId}/lineup`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useCreateMatchMutation,
  useUpdateCaptianWKMutation,
  useSubmitTeamLineupMutation,
} = matchApi;
