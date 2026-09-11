import { baseApi } from "../baseApi";

import type {
  CorrectVolleyballMatchRulesDto,
  CreateVolleyballMatchDto,
  GetVolleyballMatchRulePresetsResponse,
  GetVolleyballMyMatchesQuery,
  UpdateVolleyballPostMatchDto,
  VolleyballMatch,
  VolleyballMatchRuleCorrectionResponse,
  VolleyballMyMatchesResponse,
} from "@/types/volleyball/match";

import type {
  SubmitVolleyballRosterDto,
  VolleyballMatchRoster,
} from "@/types/volleyball/roster";

import {
  RecordVolleyballLiberoReplacementDto,
  RecordVolleyballLiberoReplacementResponse,
  RecordVolleyballRallyDto,
  RecordVolleyballRallyResponse,
  RecordVolleyballSubstitutionDto,
  RecordVolleyballSubstitutionResponse,
} from "@/types/volleyball/scoring";

import { StartVolleyballSetDto, VolleyballSet } from "@/types/volleyball/set";

import {
  GetVolleyballMatchHistoryResponse,
  GetVolleyballScoringHistoryQuery,
  VolleyballScoringHistoryResponse,
  UndoLastVolleyballEventRequest,
  UndoLastVolleyballEventResponse,
  UndoVolleyballEventDto,
  UndoVolleyballEventResponse,
} from "@/types/volleyball/history";

function getVolleyballMatchLifecycleTags(matchId: string) {
  return [
    {
      type: "VolleyballMatch" as const,
      id: matchId,
    },
    "VolleyballMatch" as const,
    "VolleyballTournaments" as const,
  ];
}

function getVolleyballScoringDerivedTags(matchId: string) {
  return [
    ...getVolleyballMatchLifecycleTags(matchId),
    {
      type: "VolleyballScoringHistory" as const,
      id: matchId,
    },
    "VolleyballHome" as const,
    "VolleyballPerformance" as const,
    "VolleyballProfile" as const,
  ];
}

function getVolleyballSetEventDerivedTags(matchId: string) {
  return [
    ...getVolleyballMatchLifecycleTags(matchId),
    {
      type: "VolleyballScoringHistory" as const,
      id: matchId,
    },
    "VolleyballPerformance" as const,
  ];
}

function getVolleyballPostMatchDerivedTags(matchId: string) {
  return [
    ...getVolleyballMatchLifecycleTags(matchId),
    "VolleyballHome" as const,
    "VolleyballPerformance" as const,
    "VolleyballProfile" as const,
  ];
}

export const volleyballMatchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =====================================================
         MATCH RULES
      ===================================================== */

    getVolleyballMatchRulePresets: builder.query<
      GetVolleyballMatchRulePresetsResponse,
      void
    >({
      query: () => ({
        url: "/volleyball/match-rule-presets",
        method: "GET",
      }),
    }),

    /* =====================================================
         MATCH
      ===================================================== */

    createVolleyballMatch: builder.mutation<
      VolleyballMatch,
      CreateVolleyballMatchDto
    >({
      query: (body) => ({
        url: "/volleyball/matches",
        method: "POST",
        body,
      }),

      invalidatesTags: ["VolleyballMatch"],
    }),

    getVolleyballMatch: builder.query<
      VolleyballMatch,
      {
        matchId: string;
      }
    >({
      query: ({ matchId }) => ({
        url: `/volleyball/matches/${matchId}`,
        method: "GET",
      }),

      providesTags: (_result, _error, { matchId }) => [
        {
          type: "VolleyballMatch",
          id: matchId,
        },
      ],
    }),

    correctVolleyballMatchRules: builder.mutation<
      VolleyballMatchRuleCorrectionResponse,
      {
        matchId: string;
        body: CorrectVolleyballMatchRulesDto;
      }
    >({
      query: ({ matchId, body }) => ({
        url: `/volleyball/matches/${matchId}/rules`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (result, _error, { matchId }) => {
        const tournamentId =
          result?.match.tournament?.id ??
          result?.linkedFixture?.tournamentId ??
          null;

        return [
          {
            type: "VolleyballMatch",
            id: matchId,
          },
          {
            type: "VolleyballScoringHistory",
            id: matchId,
          },
          "VolleyballMatch",
          "VolleyballHome",
          "VolleyballTournaments",
          ...(tournamentId
            ? [
                {
                  type: "VolleyballTournament" as const,
                  id: tournamentId,
                },
                {
                  type: "VolleyballTournamentFixtures" as const,
                  id: tournamentId,
                },
                {
                  type: "VolleyballTournamentStandings" as const,
                  id: tournamentId,
                },
              ]
            : []),
        ];
      },
    }),

    /* =====================================================
         ROSTERS
      ===================================================== */

    submitVolleyballRoster: builder.mutation<
      VolleyballMatchRoster,
      {
        matchId: string;
        teamId: string;
        body: SubmitVolleyballRosterDto;
      }
    >({
      query: ({ matchId, teamId, body }) => ({
        url: `/volleyball/matches/${matchId}/teams/${teamId}/roster`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        ...getVolleyballMatchLifecycleTags(matchId),
      ],
    }),

    confirmVolleyballRosters: builder.mutation<
      VolleyballMatch,
      {
        matchId: string;
      }
    >({
      query: ({ matchId }) => ({
        url: `/volleyball/matches/${matchId}/roster/confirm`,
        method: "POST",
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        ...getVolleyballMatchLifecycleTags(matchId),
      ],
    }),

    /* =====================================================
         SET 1
      ===================================================== */

    startVolleyballSet: builder.mutation<
      VolleyballSet,
      {
        matchId: string;
        body: StartVolleyballSetDto;
      }
    >({
      query: ({ matchId, body }) => ({
        url: `/volleyball/matches/${matchId}/sets`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        ...getVolleyballMatchLifecycleTags(matchId),
      ],
    }),

    /* =====================================================
         SET 2+
      ===================================================== */

    startNextVolleyballSet: builder.mutation<
      VolleyballSet,
      {
        matchId: string;
        setNumber: number;
        body: StartVolleyballSetDto;
      }
    >({
      query: ({ matchId, setNumber, body }) => ({
        url: `/volleyball/matches/${matchId}/sets/${setNumber}/start`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        ...getVolleyballMatchLifecycleTags(matchId),
      ],
    }),

    /* =====================================================
         SETS
      ===================================================== */

    getVolleyballMatchSets: builder.query<
      VolleyballSet[],
      {
        matchId: string;
      }
    >({
      query: ({ matchId }) => ({
        url: `/volleyball/matches/${matchId}/sets`,
        method: "GET",
      }),

      providesTags: (_result, _error, { matchId }) => [
        {
          type: "VolleyballMatch",
          id: matchId,
        },
      ],
    }),

    getCurrentVolleyballSet: builder.query<
      VolleyballSet,
      {
        matchId: string;
      }
    >({
      query: ({ matchId }) => ({
        url: `/volleyball/matches/${matchId}/sets/current`,
        method: "GET",
      }),

      providesTags: (_result, _error, { matchId }) => [
        {
          type: "VolleyballMatch",
          id: matchId,
        },
      ],
    }),

    /* =====================================================
         RALLY
      ===================================================== */

    recordVolleyballRally: builder.mutation<
      RecordVolleyballRallyResponse,
      {
        matchId: string;
        setId: string;
        body: RecordVolleyballRallyDto;
      }
    >({
      query: ({ matchId, setId, body }) => ({
        url: `/volleyball/matches/${matchId}/sets/${setId}/rallies`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        ...getVolleyballSetEventDerivedTags(matchId),
      ],
    }),

    /* =====================================================
         SUBSTITUTION
      ===================================================== */

    recordVolleyballSubstitution: builder.mutation<
      RecordVolleyballSubstitutionResponse,
      {
        matchId: string;
        setId: string;
        body: RecordVolleyballSubstitutionDto;
      }
    >({
      query: ({ matchId, setId, body }) => ({
        url: `/volleyball/matches/${matchId}/sets/${setId}/substitutions`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        ...getVolleyballSetEventDerivedTags(matchId),
      ],
    }),

    /* =====================================================
         LIBERO
      ===================================================== */

    recordVolleyballLiberoReplacement: builder.mutation<
      RecordVolleyballLiberoReplacementResponse,
      {
        matchId: string;
        setId: string;
        body: RecordVolleyballLiberoReplacementDto;
      }
    >({
      query: ({ matchId, setId, body }) => ({
        url: `/volleyball/matches/${matchId}/sets/${setId}/libero-replacements`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        ...getVolleyballPostMatchDerivedTags(matchId),
      ],
    }),

    /* =====================================================
         HISTORY
      ===================================================== */

    getVolleyballMatchHistory: builder.query<
      GetVolleyballMatchHistoryResponse,
      {
        matchId: string;
        limit?: number;
        includeRevoked?: boolean;
      }
    >({
      query: ({ matchId, limit = 50, includeRevoked = false }) => ({
        url: `/volleyball/matches/${matchId}/events`,
        method: "GET",

        params: {
          limit,
          includeRevoked,
        },
      }),

      providesTags: (_result, _error, { matchId }) => [
        {
          type: "VolleyballMatch",
          id: matchId,
        },
      ],
    }),

    getVolleyballScoringHistory: builder.query<
      VolleyballScoringHistoryResponse,
      GetVolleyballScoringHistoryQuery
    >({
      query: ({ matchId, setId, setNumber, limit = 30, skip = 0 }) => ({
        url: `/volleyball/matches/${matchId}/scoring-history`,
        method: "GET",
        params: {
          ...(setId ? { setId } : {}),
          ...(setNumber !== undefined ? { setNumber } : {}),
          limit,
          skip,
        },
      }),
      providesTags: (_result, _error, { matchId }) => [
        { type: "VolleyballScoringHistory", id: matchId },
      ],
    }),

    /* =====================================================
         UNDO
      ===================================================== */

    undoLastVolleyballEvent: builder.mutation<
      UndoLastVolleyballEventResponse,
      {
        matchId: string;
        body: UndoLastVolleyballEventRequest;
      }
    >({
      query: ({ matchId, body }) => ({
        url: `/volleyball/matches/${matchId}/undo`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        ...getVolleyballScoringDerivedTags(matchId),
      ],
    }),

    /* =====================================================
         POST MATCH
      ===================================================== */

    updateVolleyballPostMatch: builder.mutation<
      VolleyballMatch,
      {
        matchId: string;
        body: UpdateVolleyballPostMatchDto;
      }
    >({
      query: ({ matchId, body }) => ({
        url: `/volleyball/matches/${matchId}/post-match`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        ...getVolleyballScoringDerivedTags(matchId),
      ],
    }),

    getVolleyballMatches: builder.query<VolleyballMatch[], void>({
      query: () => ({
        url: "/volleyball/matches",
        method: "GET",
      }),

      providesTags: ["VolleyballMatch"],
    }),

    getMyVolleyballMatches: builder.query<
      VolleyballMyMatchesResponse,
      GetVolleyballMyMatchesQuery | void
    >({
      query: (params) => ({
        url: "/volleyball/matches/me",
        method: "GET",
        params: params ?? undefined,
      }),

      providesTags: ["VolleyballMatch"],
    }),
  }),
});

export const {
  useGetVolleyballMatchRulePresetsQuery,

  useCreateVolleyballMatchMutation,

  useGetVolleyballMatchQuery,

  useCorrectVolleyballMatchRulesMutation,

  useSubmitVolleyballRosterMutation,

  useConfirmVolleyballRostersMutation,

  useStartVolleyballSetMutation,

  useStartNextVolleyballSetMutation,

  useGetVolleyballMatchSetsQuery,

  useGetCurrentVolleyballSetQuery,

  useGetVolleyballScoringHistoryQuery,

  useRecordVolleyballRallyMutation,

  useRecordVolleyballSubstitutionMutation,

  useRecordVolleyballLiberoReplacementMutation,

  useGetVolleyballMatchHistoryQuery,

  useUndoLastVolleyballEventMutation,

  useUpdateVolleyballPostMatchMutation,

  useGetVolleyballMatchesQuery,

  useGetMyVolleyballMatchesQuery,
} = volleyballMatchApi;
