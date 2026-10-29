import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

type BaseQueryResult = Awaited<ReturnType<typeof baseQuery>>;
let refreshInFlight: Promise<BaseQueryResult> | null = null;
let authenticationFailureHandled = false;

function requestPath(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

function isAccountRestriction(result: BaseQueryResult): boolean {
  if (result.error?.status !== 403) return false;
  const data = result.error.data as { message?: unknown } | undefined;
  return data?.message === "ACCOUNT_ACCESS_RESTRICTED";
}

function handleAuthenticationFailure(api: Parameters<typeof baseQuery>[1]) {
  if (authenticationFailureHandled) return;
  authenticationFailureHandled = true;
  api.dispatch(logout());
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const path = requestPath(args);

  if (!result.error && path === "/auth/verify-otp") {
    authenticationFailureHandled = false;
  }

  if (result.error?.status === 401 && path !== "/auth/refresh") {
    if (!refreshInFlight) {
      refreshInFlight = Promise.resolve(
        baseQuery(
          { url: "/auth/refresh", method: "POST" },
          api,
          extraOptions,
        ),
      ).finally(() => {
        refreshInFlight = null;
      });
    }
    const activeRefresh = refreshInFlight;
    const refreshResult = await activeRefresh;

    if (refreshResult.data) {
      authenticationFailureHandled = false;
      result = await baseQuery(args, api, extraOptions);
    } else {
      handleAuthenticationFailure(api);
    }
  }

  if (isAccountRestriction(result)) handleAuthenticationFailure(api);

  return result;
};

// src/store/api/baseApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { logout } from "../auth/authSlice";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithInterceptor,

  tagTypes: [
    "Auth",
    "Player",
    "Members",
    "Team",
    "Matches",
    "MatchRules",
    "ScoringState",
    "Scorecard",
    "Home",
    "Tournament",
    "TournamentTeam",
    "TournamentRound",
    "TournamentGroup",
    "TournamentFixture",
    "TournamentMatch",
    "TournamentPointsTable",
    "CricketProfile",
    "CricketProfileMatches",
    "CricketProfileStats",
    "CricketProfileTrophies",
    "CricketProfileBadges",
    "CricketProfileTeams",
    "MatchLiveStream",
    "VolleyballTeamMembers",
    "VolleyballMatch",
    "VolleyballTournament",
    "VolleyballTournaments",
    "VolleyballTournamentTeams",
    "VolleyballTournamentFixtures",
    "VolleyballTournamentStandings",
    "VolleyballTournamentAdmins",
    "VolleyballScoringHistory",
    "VolleyballPerformance",
    "VolleyballProfile",
    "VolleyballHome",
  ],

  endpoints: () => ({}),
});
