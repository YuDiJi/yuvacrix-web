import { baseApi } from "./baseApi";
import type {
  CommentaryResponse,
  MvpResponse,
  ScorecardResponse,
  ScorecardSquads,
  ScorecardSummaryResponse,
} from "@/types/scorecard";

export const scorecardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getScorecard: builder.query<
      ScorecardResponse,
      {
        matchId: string;
        includeSquads?: boolean;
        includeMvp?: boolean;
        includeCommentary?: boolean;
      }
    >({
      query: ({
        matchId,
        includeSquads = true,
        includeMvp = true,
        includeCommentary = false,
      }) => ({
        url: `/matchescored/${matchId}/scorecard`,
        method: "GET",
        params: {
          includeSquads,
          includeMvp,
          includeCommentary,
        },
      }),
      providesTags: ["Scorecard"],
    }),

    getScorecardSummary: builder.query<ScorecardSummaryResponse, string>({
      query: (matchId) => ({
        url: `/matchescored/${matchId}/scorecard/summary`,
        method: "GET",
      }),
      providesTags: ["Scorecard"],
    }),

    getScorecardCommentary: builder.query<
      CommentaryResponse,
      {
        matchId: string;
        limit?: number;
        cursor?: string;
        direction?: "ASC" | "DESC";
        eventType?: string;
        inningsNumber?: number;
      }
    >({
      query: ({
        matchId,
        limit = 30,
        cursor,
        direction = "DESC",
        eventType,
        inningsNumber,
      }) => ({
        url: `/matchescored/${matchId}/scorecard/commentary`,
        method: "GET",
        params: {
          limit,
          cursor,
          direction,
          eventType,
          inningsNumber,
        },
      }),
      providesTags: ["Scorecard"],
    }),

    getScorecardSquads: builder.query<ScorecardSquads, string>({
      query: (matchId) => ({
        url: `/matchescored/${matchId}/scorecard/squads`,
        method: "GET",
      }),
      providesTags: ["Scorecard"],
    }),

    getScorecardMVP: builder.query<MvpResponse, string>({
      query: (matchId) => ({
        url: `/matchescored/${matchId}/scorecard/mvp`,
        method: "GET",
      }),
      providesTags: ["Scorecard"],
    }),
  }),
});

export const {
  useGetScorecardQuery,
  useGetScorecardSummaryQuery,
  useGetScorecardCommentaryQuery,
  useGetScorecardSquadsQuery,
  useGetScorecardMVPQuery,
} = scorecardApi;
