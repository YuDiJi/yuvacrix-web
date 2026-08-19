import { baseApi } from "../baseApi";
import type { GetHomeRequest, HomeResponse } from "@/types/cricket/home";

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHome: builder.query<HomeResponse, GetHomeRequest | void>({
      query: (params) => ({
        url: "/home",
        method: "GET",
        params: {
          liveMatchLimit: params?.liveMatchLimit ?? 5,
          city: params?.city,
        },
      }),
      providesTags: ["Home"],
    }),
  }),
});

export const { useGetHomeQuery } = homeApi;
