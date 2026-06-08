import { CreatePlayerDto, GetPlayerResponse } from "@/types/player";
import { baseApi } from "./baseApi";

export const playerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPlayer: builder.mutation({
      query: (body: CreatePlayerDto) => ({
        url: "/players/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    updatePlayer: builder.mutation({
      query: (body: Partial<CreatePlayerDto>) => ({
        url: "/players/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth", "Player"],
    }),

    getPlayer: builder.query<GetPlayerResponse, void>({
      query: () => ({
        url: "/players/me",
      }),
      providesTags: ["Player"],
    }),

    searchPlayerMobile: builder.query({
      query: (mobile: string) => ({
        url: `/players/search/mobile`,
        params: { mobile },
      }),
    }),
  }),
});

export const {
  useCreatePlayerMutation,
  useUpdatePlayerMutation,
  useGetPlayerQuery,
  useSearchPlayerMobileQuery,
  useLazySearchPlayerMobileQuery,
} = playerApi;
