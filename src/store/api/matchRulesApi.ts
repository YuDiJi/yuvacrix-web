import { baseApi } from "./baseApi";
import {
  MatchRulesConfiguration,
  MatchRulesPreset,
  RulesPropagationResult,
  UpdateMatchRulesRequest,
} from "@/types/matchRules";

export const matchRulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMatchRulePresets: builder.query<MatchRulesPreset[], void>({
      query: () => "/match-rule-presets",
      providesTags: ["MatchRules"],
    }),
    getMatchRules: builder.query<MatchRulesConfiguration, string>({
      query: (matchId) => `/matches/${matchId}/rules`,
      providesTags: (_result, _error, matchId) => [
        { type: "MatchRules", id: matchId },
      ],
    }),
    validateMatchRules: builder.mutation<
      MatchRulesConfiguration,
      { matchId: string; body: UpdateMatchRulesRequest }
    >({
      query: ({ matchId, body }) => ({
        url: `/matches/${matchId}/rules/validate`,
        method: "POST",
        body,
      }),
    }),
    updateMatchRules: builder.mutation<
      MatchRulesConfiguration,
      { matchId: string; body: UpdateMatchRulesRequest }
    >({
      query: ({ matchId, body }) => ({
        url: `/matches/${matchId}/rules`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { matchId }) => [
        { type: "MatchRules", id: matchId },
        "Matches",
      ],
    }),
    getTournamentMatchRules: builder.query<MatchRulesConfiguration, string>({
      query: (tournamentId) => `/tournaments/${tournamentId}/match-rules`,
      providesTags: (_result, _error, tournamentId) => [
        { type: "MatchRules", id: `tournament-${tournamentId}` },
      ],
    }),
    updateTournamentMatchRules: builder.mutation<
      RulesPropagationResult,
      { tournamentId: string; body: UpdateMatchRulesRequest }
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/match-rules`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        { type: "MatchRules", id: `tournament-${tournamentId}` },
        { type: "TournamentRound", id: tournamentId },
        "TournamentFixture",
        "Matches",
      ],
    }),
    updateTournamentRoundMatchRules: builder.mutation<
      RulesPropagationResult,
      {
        tournamentId: string;
        roundId: string;
        body: Pick<UpdateMatchRulesRequest, "overrides">;
      }
    >({
      query: ({ tournamentId, roundId, body }) => ({
        url: `/tournaments/${tournamentId}/rounds/${roundId}/match-rules`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId, roundId }) => [
        { type: "MatchRules", id: `tournament-${tournamentId}` },
        { type: "TournamentRound", id: tournamentId },
        { type: "TournamentRound", id: roundId },
        "TournamentFixture",
        "Matches",
      ],
    }),
  }),
});

export const {
  useGetMatchRulePresetsQuery,
  useGetMatchRulesQuery,
  useValidateMatchRulesMutation,
  useUpdateMatchRulesMutation,
  useGetTournamentMatchRulesQuery,
  useUpdateTournamentMatchRulesMutation,
  useUpdateTournamentRoundMatchRulesMutation,
} = matchRulesApi;
