import { baseApi } from "../baseApi";

import {
  MatchRulesConfiguration,
  MatchRulesPreset,
  MatchRulesValidationResult,
  RulesPropagationResult,
  UpdateMatchRulesRequest,
} from "@/types/cricket/matchRules";

// =============================================================================
// Match Rules API
// =============================================================================

export const matchRulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -------------------------------------------------------------------------
    // Presets
    // GET /match-rule-presets
    // -------------------------------------------------------------------------

    getMatchRulePresets: builder.query<MatchRulesPreset[], void>({
      query: () => ({
        url: "/match-rule-presets",
        method: "GET",
      }),

      providesTags: [
        {
          type: "MatchRules",
          id: "PRESETS",
        },
      ],
    }),

    // -------------------------------------------------------------------------
    // Get current match rules
    // GET /matches/:matchId/rules
    // -------------------------------------------------------------------------

    getMatchRules: builder.query<MatchRulesConfiguration, string>({
      query: (matchId) => ({
        url: `/matches/${matchId}/rules`,
        method: "GET",
      }),

      providesTags: (_result, _error, matchId) => [
        {
          type: "MatchRules",
          id: matchId,
        },
      ],
    }),

    // -------------------------------------------------------------------------
    // Validate proposed rules - dry run
    // POST /matches/:matchId/rules/validate
    // -------------------------------------------------------------------------

    validateMatchRules: builder.mutation<
      MatchRulesValidationResult,
      {
        matchId: string;
        body: UpdateMatchRulesRequest;
      }
    >({
      query: ({ matchId, body }) => ({
        url: `/matches/${matchId}/rules/validate`,
        method: "POST",
        body,
      }),
    }),

    // -------------------------------------------------------------------------
    // Update match rules
    // PUT /matches/:matchId/rules
    // -------------------------------------------------------------------------

    updateMatchRules: builder.mutation<
      MatchRulesConfiguration,
      {
        matchId: string;
        body: UpdateMatchRulesRequest;
      }
    >({
      query: ({ matchId, body }) => ({
        url: `/matches/${matchId}/rules`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        {
          type: "MatchRules",
          id: matchId,
        },
        "Matches",
        "ScoringState",
      ],
    }),

    // =========================================================================
    // Tournament Match Rules
    //
    // These APIs are retained from the existing implementation.
    // They are NOT covered by the newly provided Match Rules API documentation,
    // so no endpoint/path behavior is being inferred or changed here.
    // =========================================================================

    // -------------------------------------------------------------------------
    // Get tournament-level match rules
    // -------------------------------------------------------------------------

    getTournamentMatchRules: builder.query<MatchRulesConfiguration, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}/match-rules`,
        method: "GET",
      }),

      providesTags: (_result, _error, tournamentId) => [
        {
          type: "MatchRules",
          id: `tournament-${tournamentId}`,
        },
      ],
    }),

    // -------------------------------------------------------------------------
    // Update tournament-level match rules
    // -------------------------------------------------------------------------

    updateTournamentMatchRules: builder.mutation<
      RulesPropagationResult,
      {
        tournamentId: string;
        body: UpdateMatchRulesRequest;
      }
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/match-rules`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (_result, _error, { tournamentId }) => [
        {
          type: "MatchRules",
          id: `tournament-${tournamentId}`,
        },
        {
          type: "TournamentRound",
          id: tournamentId,
        },
        "TournamentFixture",
        "Matches",
      ],
    }),

    // -------------------------------------------------------------------------
    // Update round-level match-rule overrides
    // -------------------------------------------------------------------------

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
        {
          type: "MatchRules",
          id: `tournament-${tournamentId}`,
        },
        {
          type: "TournamentRound",
          id: tournamentId,
        },
        {
          type: "TournamentRound",
          id: roundId,
        },
        "TournamentFixture",
        "Matches",
      ],
    }),
  }),
});

// =============================================================================
// Hooks
// =============================================================================

export const {
  useGetMatchRulePresetsQuery,
  useGetMatchRulesQuery,
  useValidateMatchRulesMutation,
  useUpdateMatchRulesMutation,

  useGetTournamentMatchRulesQuery,
  useUpdateTournamentMatchRulesMutation,
  useUpdateTournamentRoundMatchRulesMutation,
} = matchRulesApi;
