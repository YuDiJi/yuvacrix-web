import { baseApi } from "../baseApi";

import type { VolleyballPerformanceResponse } from "@/types/volleyball/performance";

export const volleyballPerformanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyVolleyballPerformance: builder.query<
      VolleyballPerformanceResponse,
      void
    >({
      query: () => ({
        url: "/volleyball-profile/me/performance",
        method: "GET",
      }),

      providesTags: ["VolleyballPerformance"],
    }),
  }),
});

export const { useGetMyVolleyballPerformanceQuery } = volleyballPerformanceApi;
