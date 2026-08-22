import { baseApi } from "../baseApi";

import type {
  CreateVolleyballMatchDto,
  GetVolleyballMatchRulePresetsResponse,
  UpdateVolleyballPostMatchDto,
  VolleyballMatch,
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
  UndoLastVolleyballEventRequest,
  UndoLastVolleyballEventResponse,
  UndoVolleyballEventDto,
  UndoVolleyballEventResponse,
} from "@/types/volleyball/history";

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
        {
          type: "VolleyballMatch",
          id: matchId,
        },
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
        {
          type: "VolleyballMatch",
          id: matchId,
        },
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
        {
          type: "VolleyballMatch",
          id: matchId,
        },
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
        {
          type: "VolleyballMatch",
          id: matchId,
        },
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
        {
          type: "VolleyballMatch",
          id: matchId,
        },
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
        {
          type: "VolleyballMatch",
          id: matchId,
        },
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
        {
          type: "VolleyballMatch",
          id: matchId,
        },
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
        url: `/volleyball/matches/${matchId}/events/undo-last`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { matchId }) => [
        {
          type: "VolleyballMatch",
          id: matchId,
        },
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
        {
          type: "VolleyballMatch",
          id: matchId,
        },
      ],
    }),

    getVolleyballMatches: builder.query<VolleyballMatch[], void>({
      query: () => ({
        url: "/volleyball/matches",
        method: "GET",
      }),

      providesTags: ["VolleyballMatch"],
    }),
  }),
});

export const {
  useGetVolleyballMatchRulePresetsQuery,

  useCreateVolleyballMatchMutation,

  useGetVolleyballMatchQuery,

  useSubmitVolleyballRosterMutation,

  useConfirmVolleyballRostersMutation,

  useStartVolleyballSetMutation,

  useStartNextVolleyballSetMutation,

  useGetVolleyballMatchSetsQuery,

  useGetCurrentVolleyballSetQuery,

  useRecordVolleyballRallyMutation,

  useRecordVolleyballSubstitutionMutation,

  useRecordVolleyballLiberoReplacementMutation,

  useGetVolleyballMatchHistoryQuery,

  useUndoLastVolleyballEventMutation,

  useUpdateVolleyballPostMatchMutation,

  useGetVolleyballMatchesQuery,
} = volleyballMatchApi;
