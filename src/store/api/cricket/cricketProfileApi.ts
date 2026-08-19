// src/store/api/cricketProfileApi.ts

import { Match } from "@/types/cricket/match";
import { baseApi } from "../baseApi";

import type {
  CricketProfile,
  CricketProfileBadgeCategory,
  CricketProfileBadgesResponse,
  CricketProfileMatchesResponse,
  CricketProfileStatsCategory,
  CricketProfileStatsResponse,
  CricketProfileTrophiesResponse,
  GetMyCricketProfileMatchesQuery,
  GetMyCricketProfileMatchesResponse,
  GetMyCricketProfileTrophiesQuery,
} from "@/types/cricket/cricketProfile";

const DEFAULT_MATCHES_LIMIT = 15;

export const cricketProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCricketProfile: builder.query<CricketProfile, void>({
      query: () => ({
        url: "/cricket-profile/me",
        method: "GET",
      }),

      providesTags: ["CricketProfile"],
    }),

    getMyCricketProfileMatches: builder.query<
      GetMyCricketProfileMatchesResponse,
      GetMyCricketProfileMatchesQuery | void
    >({
      query: (params) => ({
        url: "/cricket-profile/me/matches",
        method: "GET",

        params: {
          skip: params?.skip ?? 0,
          limit: params?.limit ?? DEFAULT_MATCHES_LIMIT,
        },
      }),

      providesTags: ["CricketProfileMatches"],
    }),

    getMyCricketProfileStats: builder.query<
      CricketProfileStatsResponse,
      CricketProfileStatsCategory
    >({
      query: (category) => ({
        url: "/cricket-profile/me/stats",
        method: "GET",
        params: {
          category,
        },
      }),

      providesTags: (_result, _error, category) => [
        {
          type: "CricketProfileStats",
          id: category,
        },
      ],
    }),

    getMyCricketProfileTrophies: builder.query<
      CricketProfileTrophiesResponse,
      GetMyCricketProfileTrophiesQuery
    >({
      query: ({ scope, skip = 0, limit = 10 }) => ({
        url: "/cricket-profile/me/trophies",
        method: "GET",
        params: {
          scope,
          skip,
          limit,
        },
      }),

      providesTags: (_result, _error, { scope }) => [
        {
          type: "CricketProfileTrophies",
          id: scope,
        },
      ],
    }),

    getMyCricketProfileBadges: builder.query<
      CricketProfileBadgesResponse,
      CricketProfileBadgeCategory
    >({
      query: (category) => ({
        url: "/cricket-profile/me/badges",
        method: "GET",
        params: {
          category,
        },
      }),

      providesTags: (_result, _error, category) => [
        {
          type: "CricketProfileBadges",
          id: category,
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetMyCricketProfileQuery,
  useGetMyCricketProfileMatchesQuery,
  useGetMyCricketProfileStatsQuery,
  useGetMyCricketProfileTrophiesQuery,
  useGetMyCricketProfileBadgesQuery,
} = cricketProfileApi;
