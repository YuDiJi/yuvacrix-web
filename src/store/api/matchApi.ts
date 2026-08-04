import { baseApi } from "./baseApi";
import {
  CompleteMatchRequest,
  CreateMatchDto,
  CreateMatchResponse,
  GetMatchByIdResponse,
  GetMyMatchesResponse,
  MyMatchOverviewFilter,
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
      invalidatesTags: ["Matches"],
    }),

    updateCaptianWK: builder.mutation<void, SubmitTeamCaptainWKRequest>({
      query: ({ matchId, teamId, body }) => ({
        url: `/matches/${matchId}/teams/${teamId}/roles`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Matches"],
    }),

    submitTeamLineup: builder.mutation<void, SubmitTeamLineupRequest>({
      query: ({ matchId, teamId, body }) => ({
        url: `/matches/${matchId}/teams/${teamId}/lineup`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Matches"],
    }),

    markReadyForToss: builder.mutation<void, { matchId: string }>({
      query: ({ matchId }) => ({
        url: `/matches/${matchId}/ready-for-toss`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Matches"],
    }),

    submitToss: builder.mutation<
      void,
      {
        matchId: string;
        wonByTeamId: string;
        decision: "BAT" | "BOWL";
      }
    >({
      query: ({ matchId, wonByTeamId, decision }) => ({
        url: `/matches/${matchId}/toss`,
        method: "POST",
        body: {
          wonByTeamId,
          decision,
        },
      }),
      invalidatesTags: ["Matches"],
    }),

    startMatch: builder.mutation<void, { matchId: string }>({
      query: ({ matchId }) => ({
        url: `/matches/${matchId}/start`,
        method: "POST",
        body: {},
      }),
    }),

    // getMyMatches: builder.query<any, void>({
    //   query: () => ({
    //     url: "/matches/me/created",
    //   }),
    //   providesTags: ["Matches"],
    // }), /////////////////// add types later

    getMyMatchesOverview: builder.query<
      GetMyMatchesResponse,
      { filter: MyMatchOverviewFilter; skip: number; limit: number }
    >({
      query: (params) => ({
        url: "/matches/me/overview",
        params,
      }),
      providesTags: ["Matches"],
    }),

    getMatchById: builder.query<GetMatchByIdResponse, { matchId: string }>({
      query: ({ matchId }) => ({
        url: `/matches/${matchId}`,
      }),
      providesTags: ["Matches"],
    }),

    completeMatch: builder.mutation<void, CompleteMatchRequest>({
      query: ({ matchId, body }) => ({
        url: `/matches/${matchId}/complete`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Matches", "ScoringState"],
    }),
  }),
});

export const {
  useCreateMatchMutation,
  useUpdateCaptianWKMutation,
  useSubmitTeamLineupMutation,
  useSubmitTossMutation,
  useStartMatchMutation,
  useMarkReadyForTossMutation,
  // useGetMyMatchesQuery,
  useGetMyMatchesOverviewQuery,
  useGetMatchByIdQuery,
  useCompleteMatchMutation,
} = matchApi;
