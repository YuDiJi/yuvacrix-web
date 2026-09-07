import { baseApi } from "../baseApi";

import type { VolleyballHomeResponse } from "@/types/volleyball/home";

export const volleyballHomeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVolleyballHome: builder.query<VolleyballHomeResponse, void>({
      query: () => ({
        url: "/volleyball/home",
        method: "GET",
      }),

      providesTags: ["VolleyballHome"],
    }),
  }),
});

export const { useGetVolleyballHomeQuery } = volleyballHomeApi;
