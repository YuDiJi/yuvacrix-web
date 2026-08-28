import { baseApi } from "../baseApi";

import type {
  GetVolleyballAwardsQuery,
  VolleyballAwardQueryScope,
  VolleyballMyAwardsResponse,
} from "@/types/volleyball/awards";

export const volleyballProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =====================================================
       MY AWARDS
    ===================================================== */

    getMyVolleyballAwards: builder.query<
      VolleyballMyAwardsResponse,
      GetVolleyballAwardsQuery | void
    >({
      query: (params) => ({
        url: "/volleyball-profile/me/awards",
        params: params ?? undefined,
      }),

      providesTags: ["VolleyballProfile"],
    }),

    /* =====================================================
       PLAYER AWARDS
    ===================================================== */

    getVolleyballPlayerAwards: builder.query<
      VolleyballMyAwardsResponse,
      {
        playerId: string;
        scope?: VolleyballAwardQueryScope;
        skip?: number;
        limit?: number;
      }
    >({
      query: ({ playerId, ...params }) => ({
        url: `/volleyball-profile/players/${playerId}/awards`,
        params,
      }),

      providesTags: (_result, _error, { playerId }) => [
        {
          type: "VolleyballProfile",
          id: playerId,
        },
      ],
    }),
  }),
});

export const {
  useGetMyVolleyballAwardsQuery,
  useGetVolleyballPlayerAwardsQuery,
} = volleyballProfileApi;
