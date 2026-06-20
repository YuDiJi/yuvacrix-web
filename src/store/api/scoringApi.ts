import {
  ScoringState,
  StartInningsRequest,
  StartInningsResponse,
} from "@/types/innings";
import { baseApi } from "./baseApi";
import {
  ChangeBowlerRequest,
  RecordBallRequest,
  RecordBallResponse,
  UndoBallResponse,
} from "@/types/scoring";

export const scoringApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startFirstInning: builder.mutation<
      StartInningsResponse,
      StartInningsRequest
    >({
      query: ({ matchId, ...body }) => ({
        url: `/match/${matchId}/scoring/innings/start`,
        method: "POST",
        body,
      }),
    }),

    getScoringState: builder.query<ScoringState, string>({
      query: (matchId) => ({
        url: `/match/${matchId}/scoring/state`,
      }),
      providesTags: ["ScoringState"],
    }),

    recordBall: builder.mutation<RecordBallResponse, RecordBallRequest>({
      query: ({ matchId, ...body }) => ({
        url: `/match/${matchId}/scoring/balls`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ScoringState"],
    }),

    undoLastBall: builder.mutation<
      unknown,
      {
        matchId: string;
        inningsId: string;
        reason: string;
      }
    >({
      query: ({ matchId, inningsId, reason }) => ({
        url: `/match/${matchId}/scoring/balls/last`,
        method: "DELETE", // change to POST if your backend expects POST
        body: {
          inningsId,
          reason,
        },
      }),
      invalidatesTags: ["ScoringState"],
    }),

    changeBowler: builder.mutation<void, ChangeBowlerRequest>({
      query: ({ matchId, inningsId, bowlerId, reason }) => ({
        url: `/match/${matchId}/scoring/bowler`,
        method: "POST",
        body: {
          inningsId,
          bowlerId,
          reason,
        },
      }),

      invalidatesTags: ["ScoringState", "Matches"],
    }),
  }),
});

export const {
  useStartFirstInningMutation,
  useGetScoringStateQuery,
  useRecordBallMutation,
  useUndoLastBallMutation,
  useChangeBowlerMutation,
} = scoringApi;
