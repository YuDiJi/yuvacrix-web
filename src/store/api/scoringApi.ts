import {
  StartFirstInningRequest,
  StartFirstInningResponse,
} from "@/types/innings";
import { baseApi } from "./baseApi";

export const scoringApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startFirstInning: builder.mutation<
      StartFirstInningResponse,
      StartFirstInningRequest
    >({
      query: ({ matchId, ...body }) => ({
        url: `/match/${matchId}/scoring/innings/start`,
        method: "POST",
        body,
      }),
    }),

    // GET /matches/:matchId/scoring/state
    // getScoringState: builder.query<GetStateResponse, { matchId: string }>({
    //   query: ({ matchId }) => `/matches/${matchId}/scoring/state`,
    // }),

    // // POST /matches/:matchId/scoring/balls
    // recordBall: builder.mutation<
    //   RecordBallResponse,
    //   { matchId: string; body: RecordBallRequest }
    // >({
    //   query: ({ matchId, body }) => ({
    //     url: `/matches/${matchId}/scoring/balls`,
    //     method: "POST",
    //     body,
    //   }),
    // }),

    // // DELETE /matches/:matchId/scoring/balls/last
    // undoLastBall: builder.mutation<UndoBallResponse, { matchId: string }>({
    //   query: ({ matchId }) => ({
    //     url: `/matches/${matchId}/scoring/balls/last`,
    //     method: "DELETE",
    //   }),
    // }),

    // // POST /matches/:matchId/scoring/strike
    // changeStrike: builder.mutation<
    //   { state: GetStateResponse["state"] },
    //   { matchId: string; body: SelectStrikeRequest }
    // >({
    //   query: ({ matchId, body }) => ({
    //     url: `/matches/${matchId}/scoring/strike`,
    //     method: "POST",
    //     body,
    //   }),
    // }),

    // // POST /matches/:matchId/scoring/overs/next
    // nextOver: builder.mutation<
    //   RecordBallResponse,
    //   { matchId: string; body: NextOverRequest }
    // >({
    //   query: ({ matchId, body }) => ({
    //     url: `/matches/${matchId}/scoring/overs/next`,
    //     method: "POST",
    //     body,
    //   }),
    // }),
  }),
});

export const {
  useStartFirstInningMutation,
  // useGetScoringStateQuery,
  // useRecordBallMutation,
  // useUndoLastBallMutation,
  // useChangeStrikeMutation,
  // useNextOverMutation,
} = scoringApi;
