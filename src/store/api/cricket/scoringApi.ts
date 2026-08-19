import {
  CompleteInningsRequest,
  ScoringState,
  StartInningsRequest,
  StartInningsResponse,
} from "@/types/cricket/innings";
import { baseApi } from "../baseApi";
import {
  ChangeBatterRequest,
  ChangeBowlerRequest,
  ContinueCurrentOverRequest,
  RecordBallRequest,
  RecordBallResponse,
  StartNextOverRequest,
  UndoBallResponse,
} from "@/types/cricket/scoring";

export const scoringApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startInning: builder.mutation<StartInningsResponse, StartInningsRequest>({
      query: ({ matchId, ...body }) => ({
        url: `/match/${matchId}/scoring/innings/start`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ScoringState", "Matches", "Scorecard"],
    }),

    getScoringState: builder.query<ScoringState, string>({
      query: (matchId) => ({
        url: `/match/${matchId}/scoring/state`,
      }),
      providesTags: ["ScoringState"],
    }),

    // completeInnings: builder.mutation<any, CompleteInningsRequest>({
    //   query: ({ matchId, inningsId, ...body }) => ({
    //     url: `/match/${matchId}/scoring/innings/${inningsId}/complete`,
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: ["ScoringState", "Matches", "Scorecard"],
    // }),

    // getInningsState: builder.query<
    //   ScoringState,
    //   { matchId: string; number: number }
    // >({
    //   query: ({ matchId, number }) => ({
    //     url: `/match/${matchId}/scoring/state?inningsNumber=${number}`,
    //   }),
    //   providesTags: ["ScoringState"],
    // }),

    recordBall: builder.mutation<RecordBallResponse, RecordBallRequest>({
      query: ({ matchId, ...body }) => ({
        url: `/match/${matchId}/scoring/balls`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ScoringState", "Matches", "Scorecard"],
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
      invalidatesTags: ["ScoringState", "Matches", "Scorecard"],
    }),

    changeBowlerManually: builder.mutation<void, ChangeBowlerRequest>({
      query: ({ matchId, inningsId, bowlerId, reason }) => ({
        url: `/match/${matchId}/scoring/bowler`,
        method: "POST",
        body: {
          inningsId,
          bowlerId,
          reason,
        },
      }),
      invalidatesTags: ["ScoringState", "Matches", "Scorecard"],
    }),

    changeStrikeManually: builder.mutation<void, ChangeBatterRequest>({
      query: ({ matchId, inningsId, strikerId, nonStrikerId, reason }) => ({
        url: `/match/${matchId}/scoring/strike`,
        method: "POST",
        body: {
          inningsId,
          strikerId,
          nonStrikerId,
          // reason,
        },
      }),
      invalidatesTags: ["ScoringState", "Matches", "Scorecard"],
    }),

    startNextOver: builder.mutation<void, StartNextOverRequest>({
      query: ({ matchId, inningsId, bowlerId }) => ({
        url: `/match/${matchId}/scoring/overs/next`,
        method: "POST",
        body: {
          inningsId,
          bowlerId,
        },
      }),
      invalidatesTags: ["ScoringState", "Matches", "Scorecard"],
    }),

    continueCurrentOver: builder.mutation<void, ContinueCurrentOverRequest>({
      query: ({ matchId, inningsId, reason }) => ({
        url: `/match/${matchId}/scoring/overs/continue`,
        method: "POST",
        body: {
          inningsId,
          reason,
        },
      }),
      invalidatesTags: ["ScoringState", "Matches", "Scorecard"],
    }),

    declareBowlingPowerplay: builder.mutation<
      {
        activeSpecialOver: ScoringState["activeSpecialOver"];
        state: ScoringState;
      },
      {
        matchId: string;
        inningsId: string;
        overNumber: number;
        declaredByPlayerId: string;
        expectedInningsVersion: number;
      }
    >({
      query: ({ matchId, overNumber, ...body }) => ({
        url: `/match/${matchId}/scoring/overs/${overNumber}/powerplay`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ScoringState", "Scorecard"],
    }),
  }),
});

export const {
  useStartInningMutation,
  useGetScoringStateQuery,
  useRecordBallMutation,
  useUndoLastBallMutation,
  useChangeBowlerManuallyMutation,
  useStartNextOverMutation,
  useContinueCurrentOverMutation,
  useChangeStrikeManuallyMutation,
  useDeclareBowlingPowerplayMutation,
  // useCompleteInningsMutation,
  // useGetInningsStateQuery,
} = scoringApi;
