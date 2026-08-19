import { baseApi } from "@/store/api/baseApi";
import {
  ConfigureMatchLiveStreamArgs,
  MatchLiveStream,
  UpdateMatchLiveStreamStatusArgs,
} from "@/types/cricket/liveStream";

export const liveStreamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMatchLiveStream: builder.query<MatchLiveStream, string>({
      query: (matchId) => ({
        url: `/matches/${matchId}/live-stream`,
        method: "GET",
      }),

      providesTags: (_result, _error, matchId) => [
        {
          type: "MatchLiveStream",
          id: matchId,
        },
      ],
    }),

    configureMatchLiveStream: builder.mutation<
      MatchLiveStream,
      ConfigureMatchLiveStreamArgs
    >({
      query: ({ matchId, body }) => ({
        url: `/matches/${matchId}/live-stream`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        {
          type: "MatchLiveStream",
          id: matchId,
        },
      ],
    }),

    updateMatchLiveStreamStatus: builder.mutation<
      MatchLiveStream,
      UpdateMatchLiveStreamStatusArgs
    >({
      query: ({ matchId, body }) => ({
        url: `/matches/${matchId}/live-stream/status`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        {
          type: "MatchLiveStream",
          id: matchId,
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetMatchLiveStreamQuery,
  useConfigureMatchLiveStreamMutation,
  useUpdateMatchLiveStreamStatusMutation,
} = liveStreamApi;
