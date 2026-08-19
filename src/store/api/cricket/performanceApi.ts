// src/store/api/performanceApi.ts

import { baseApi } from "../baseApi";

import type {
  BattingAnalysisResponse,
  BattingAnalysisSection,
  BattingPartnershipsResponse,
  BattingPerformanceResponse,
  BowlingAnalysisResponse,
  BowlingAnalysisSection,
  BowlingPerformanceResponse,
  PerformanceFilters,
  PerformancePlayerSearchResponse,
  PerformanceShellResponse,
  PlayerComparisonResponse,
  PlayerFaceOffResponse,
  PlayerSearchQuery,
} from "@/types/cricket/performance";

type BattingAnalysisQuery<TSection extends BattingAnalysisSection> =
  PerformanceFilters & {
    section: TSection;
  };

type BowlingAnalysisQuery<TSection extends BowlingAnalysisSection> =
  PerformanceFilters & {
    section: TSection;
  };

function removeUndefinedParams<T extends object>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

export const performanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─────────────────────────────────────────────────────────────────────────
    // Performance shell
    // GET /cricket-profile/me/performance
    // ─────────────────────────────────────────────────────────────────────────

    getMyPerformance: builder.query<
      PerformanceShellResponse,
      PerformanceFilters | void
    >({
      query: (filters) => ({
        url: "/cricket-profile/me/performance",
        method: "GET",
        params: filters ? removeUndefinedParams(filters) : undefined,
      }),
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Batting tab
    // GET /cricket-profile/me/performance/batting
    // ─────────────────────────────────────────────────────────────────────────

    getMyBattingPerformance: builder.query<
      BattingPerformanceResponse,
      PerformanceFilters | void
    >({
      query: (filters) => ({
        url: "/cricket-profile/me/performance/batting",
        method: "GET",
        params: filters ? removeUndefinedParams(filters) : undefined,
      }),
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Batting conditional analytics
    // GET /cricket-profile/me/performance/batting/analysis
    // ─────────────────────────────────────────────────────────────────────────

    getMyBattingAnalysis: builder.query<
      BattingAnalysisResponse,
      BattingAnalysisQuery<BattingAnalysisSection>
    >({
      query: ({ section, ...filters }) => ({
        url: "/cricket-profile/me/performance/batting/analysis",
        method: "GET",
        params: removeUndefinedParams({
          section,
          ...filters,
        }),
      }),
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Bowling tab
    // GET /cricket-profile/me/performance/bowling
    // ─────────────────────────────────────────────────────────────────────────

    getMyBowlingPerformance: builder.query<BowlingPerformanceResponse, void>({
      query: () => ({
        url: "/cricket-profile/me/performance/bowling",
        method: "GET",
      }),
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Bowling conditional analytics
    // GET /cricket-profile/me/performance/bowling/analysis
    // ─────────────────────────────────────────────────────────────────────────

    getMyBowlingAnalysis: builder.query<
      BowlingAnalysisResponse<BowlingAnalysisSection>,
      { section: BowlingAnalysisSection }
    >({
      query: ({ section }) => ({
        url: "/cricket-profile/me/performance/bowling/analysis",
        method: "GET",
        params: { section },
      }),
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Player search for Compare and Face Off
    // GET /cricket-profile/performance/players
    // ─────────────────────────────────────────────────────────────────────────

    searchPerformancePlayers: builder.query<
      PerformancePlayerSearchResponse,
      PlayerSearchQuery
    >({
      query: ({ search, limit = 20 }) => ({
        url: "/cricket-profile/performance/players",
        method: "GET",
        params: {
          search,
          limit,
        },
      }),
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Compare tab
    // GET /cricket-profile/me/performance/compare/:comparisonPlayerId
    // ─────────────────────────────────────────────────────────────────────────

    compareMyPerformance: builder.query<
      PlayerComparisonResponse,
      {
        comparisonPlayerId: string;
        filters?: PerformanceFilters;
      }
    >({
      query: ({ comparisonPlayerId, filters }) => ({
        url: `/cricket-profile/me/performance/compare/${comparisonPlayerId}`,
        method: "GET",
        params: filters ? removeUndefinedParams(filters) : undefined,
      }),
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Face Off tab
    // GET /cricket-profile/me/performance/face-off/:opponentPlayerId
    // ─────────────────────────────────────────────────────────────────────────

    getMyFaceOff: builder.query<
      PlayerFaceOffResponse,
      {
        opponentPlayerId: string;
        filters?: PerformanceFilters;
      }
    >({
      query: ({ opponentPlayerId, filters }) => ({
        url: `/cricket-profile/me/performance/face-off/${opponentPlayerId}`,
        method: "GET",
        params: filters ? removeUndefinedParams(filters) : undefined,
      }),
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Top 5 partnership tab
    // GET /cricket-profile/me/performance/batting/partnerships
    // ─────────────────────────────────────────────────────────────────────────

    getMyBattingPartnerships: builder.query<
      BattingPartnershipsResponse,
      { limit?: number } | void
    >({
      query: (params) => ({
        url: "/cricket-profile/me/performance/batting/partnerships",
        method: "GET",
        params: {
          limit: params?.limit ?? 5,
        },
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetMyPerformanceQuery,
  useLazyGetMyPerformanceQuery,

  useGetMyBattingPerformanceQuery,
  useLazyGetMyBattingPerformanceQuery,

  useGetMyBattingAnalysisQuery,
  useLazyGetMyBattingAnalysisQuery,

  useGetMyBowlingPerformanceQuery,
  useLazyGetMyBowlingPerformanceQuery,

  useGetMyBowlingAnalysisQuery,
  useLazyGetMyBowlingAnalysisQuery,

  useSearchPerformancePlayersQuery,
  useLazySearchPerformancePlayersQuery,

  useCompareMyPerformanceQuery,
  useLazyCompareMyPerformanceQuery,

  useGetMyFaceOffQuery,
  useLazyGetMyFaceOffQuery,

  useGetMyBattingPartnershipsQuery,
  useLazyGetMyBattingPartnershipsQuery,
} = performanceApi;
