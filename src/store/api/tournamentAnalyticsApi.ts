// src/store/api/tournamentAnalyticsApi.ts

import { baseApi } from "./baseApi";

import {
  TournamentAnalyticsFilters,
  TournamentBattingLeaderboardMetric,
  TournamentBattingLeaderboardQuery,
  TournamentBattingLeaderboardResponse,
  TournamentBoundaryStatsQuery,
  TournamentBoundaryStatsResponse,
  TournamentBowlingLeaderboardMetric,
  TournamentBowlingLeaderboardQuery,
  TournamentBowlingLeaderboardResponse,
  TournamentFieldingLeaderboardMetric,
  TournamentFieldingLeaderboardQuery,
  TournamentFieldingLeaderboardResponse,
  TournamentHeroesQuery,
  TournamentHeroesResponse,
  TournamentMvpLeaderboardQuery,
  TournamentMvpLeaderboardResponse,
  TournamentOverallStatsResponse,
} from "@/types/tournamentAnalytics";

const defaultFilters = {
  teamId: "ALL",
  roundId: "ALL",
  groupId: "ALL",
} as const;

const defaultPagination = {
  skip: 0,
  limit: 50,
} as const;

function removeUndefined<T extends Record<string, unknown>>(
  params: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

export const tournamentAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTournamentOverallStats: builder.query<
      TournamentOverallStatsResponse,
      {
        tournamentId: string;
        query?: TournamentAnalyticsFilters;
      }
    >({
      query: ({ tournamentId, query }) => ({
        url: `/tournaments/${tournamentId}/stats/overall`,
        method: "GET",
        params: removeUndefined({
          ...defaultFilters,
          ...query,
        }),
      }),
    }),

    getTournamentBoundaryStats: builder.query<
      TournamentBoundaryStatsResponse,
      {
        tournamentId: string;
        query: TournamentBoundaryStatsQuery;
      }
    >({
      query: ({ tournamentId, query }) => ({
        url: `/tournaments/${tournamentId}/stats/boundaries`,
        method: "GET",
        params: removeUndefined({
          ...defaultFilters,
          ...defaultPagination,
          ...query,
        }),
      }),
    }),

    getTournamentBattingLeaderboard: builder.query<
      TournamentBattingLeaderboardResponse,
      {
        tournamentId: string;
        query?: TournamentBattingLeaderboardQuery;
      }
    >({
      query: ({ tournamentId, query }) => ({
        url: `/tournaments/${tournamentId}/leaderboard/batting`,
        method: "GET",
        params: removeUndefined({
          ...defaultFilters,
          ...defaultPagination,
          metric: TournamentBattingLeaderboardMetric.RUNS,
          ...query,
        }),
      }),
    }),

    getTournamentBowlingLeaderboard: builder.query<
      TournamentBowlingLeaderboardResponse,
      {
        tournamentId: string;
        query?: TournamentBowlingLeaderboardQuery;
      }
    >({
      query: ({ tournamentId, query }) => ({
        url: `/tournaments/${tournamentId}/leaderboard/bowling`,
        method: "GET",
        params: removeUndefined({
          ...defaultFilters,
          ...defaultPagination,
          metric: TournamentBowlingLeaderboardMetric.WICKETS,
          ...query,
        }),
      }),
    }),

    getTournamentFieldingLeaderboard: builder.query<
      TournamentFieldingLeaderboardResponse,
      {
        tournamentId: string;
        query?: TournamentFieldingLeaderboardQuery;
      }
    >({
      query: ({ tournamentId, query }) => ({
        url: `/tournaments/${tournamentId}/leaderboard/fielding`,
        method: "GET",
        params: removeUndefined({
          ...defaultFilters,
          ...defaultPagination,
          metric: TournamentFieldingLeaderboardMetric.DISMISSALS,
          ...query,
        }),
      }),
    }),

    getTournamentMvpLeaderboard: builder.query<
      TournamentMvpLeaderboardResponse,
      {
        tournamentId: string;
        query?: TournamentMvpLeaderboardQuery;
      }
    >({
      query: ({ tournamentId, query }) => ({
        url: `/tournaments/${tournamentId}/leaderboard/mvp`,
        method: "GET",
        params: removeUndefined({
          ...defaultFilters,
          ...defaultPagination,
          ...query,
        }),
      }),
    }),

    getTournamentHeroes: builder.query<
      TournamentHeroesResponse,
      {
        tournamentId: string;
        query?: TournamentHeroesQuery;
      }
    >({
      query: ({ tournamentId, query }) => ({
        url: `/tournaments/${tournamentId}/heroes`,
        method: "GET",
        params: removeUndefined({
          ...defaultFilters,
          ...query,
        }),
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetTournamentOverallStatsQuery,
  useLazyGetTournamentOverallStatsQuery,

  useGetTournamentBoundaryStatsQuery,
  useLazyGetTournamentBoundaryStatsQuery,

  useGetTournamentBattingLeaderboardQuery,
  useLazyGetTournamentBattingLeaderboardQuery,

  useGetTournamentBowlingLeaderboardQuery,
  useLazyGetTournamentBowlingLeaderboardQuery,

  useGetTournamentFieldingLeaderboardQuery,
  useLazyGetTournamentFieldingLeaderboardQuery,

  useGetTournamentMvpLeaderboardQuery,
  useLazyGetTournamentMvpLeaderboardQuery,

  useGetTournamentHeroesQuery,
  useLazyGetTournamentHeroesQuery,
} = tournamentAnalyticsApi;
