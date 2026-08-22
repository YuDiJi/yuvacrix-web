import { baseApi } from "../baseApi";

import type { VolleyballMatch } from "@/types/volleyball/match";

import type {
  CreateVolleyballTournamentDto,
  CreateVolleyballTournamentFixtureDto,
  RegisterVolleyballTournamentTeamDto,
  VolleyballTournament,
  VolleyballTournamentFixture,
  VolleyballTournamentStandingsResponse,
  VolleyballTournamentStatus,
  VolleyballTournamentTeam,
  VolleyballTournamentStage,
  VolleyballFixtureStatus,
} from "@/types/volleyball/tournament";

export const volleyballTournamentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =====================================================
         TOURNAMENTS
      ===================================================== */

    createVolleyballTournament: builder.mutation<
      VolleyballTournament,
      CreateVolleyballTournamentDto
    >({
      query: (body) => ({
        url: "/volleyball/tournaments",
        method: "POST",
        body,
      }),

      invalidatesTags: ["VolleyballTournaments"],
    }),

    getVolleyballTournaments: builder.query<
      VolleyballTournament[],
      {
        status?: VolleyballTournamentStatus;
        ownerUserId?: string;
      } | void
    >({
      query: (params) => ({
        url: "/volleyball/tournaments",
        params: params ?? undefined,
      }),

      providesTags: ["VolleyballTournaments"],
    }),

    getVolleyballTournament: builder.query<
      VolleyballTournament,
      {
        tournamentId: string;
      }
    >({
      query: ({ tournamentId }) => `/volleyball/tournaments/${tournamentId}`,

      providesTags: (_result, _error, { tournamentId }) => [
        {
          type: "VolleyballTournament",
          id: tournamentId,
        },
      ],
    }),

    /* =====================================================
         TEAMS
      ===================================================== */

    registerVolleyballTournamentTeam: builder.mutation<
      VolleyballTournamentTeam,
      {
        tournamentId: string;
        body: RegisterVolleyballTournamentTeamDto;
      }
    >({
      query: ({ tournamentId, body }) => ({
        url: `/volleyball/tournaments/${tournamentId}/teams`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { tournamentId }) => [
        {
          type: "VolleyballTournamentTeams",
          id: tournamentId,
        },
      ],
    }),

    getVolleyballTournamentTeams: builder.query<
      VolleyballTournamentTeam[],
      {
        tournamentId: string;
        groupName?: string;
      }
    >({
      query: ({ tournamentId, groupName }) => ({
        url: `/volleyball/tournaments/${tournamentId}/teams`,
        params: groupName
          ? {
              groupName,
            }
          : undefined,
      }),

      providesTags: (_result, _error, { tournamentId }) => [
        {
          type: "VolleyballTournamentTeams",
          id: tournamentId,
        },
      ],
    }),

    /* =====================================================
         FIXTURES
      ===================================================== */

    createVolleyballTournamentFixture: builder.mutation<
      VolleyballTournamentFixture,
      {
        tournamentId: string;
        body: CreateVolleyballTournamentFixtureDto;
      }
    >({
      query: ({ tournamentId, body }) => ({
        url: `/volleyball/tournaments/${tournamentId}/fixtures`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { tournamentId }) => [
        {
          type: "VolleyballTournamentFixtures",
          id: tournamentId,
        },
      ],
    }),

    getVolleyballTournamentFixtures: builder.query<
      VolleyballTournamentFixture[],
      {
        tournamentId: string;

        stage?: VolleyballTournamentStage;

        groupName?: string;

        status?: VolleyballFixtureStatus;
      }
    >({
      query: ({ tournamentId, stage, groupName, status }) => ({
        url: `/volleyball/tournaments/${tournamentId}/fixtures`,

        params: {
          ...(stage
            ? {
                stage,
              }
            : {}),

          ...(groupName
            ? {
                groupName,
              }
            : {}),

          ...(status
            ? {
                status,
              }
            : {}),
        },
      }),

      providesTags: (_result, _error, { tournamentId }) => [
        {
          type: "VolleyballTournamentFixtures",
          id: tournamentId,
        },
      ],
    }),

    /* =====================================================
         FIXTURE -> MATCH
      ===================================================== */

    createVolleyballMatchFromFixture: builder.mutation<
      VolleyballMatch,
      {
        tournamentId: string;
        fixtureId: string;
      }
    >({
      query: ({ tournamentId, fixtureId }) => ({
        url: `/volleyball/tournaments/${tournamentId}/fixtures/${fixtureId}/create-match`,
        method: "POST",
      }),

      invalidatesTags: (_result, _error, { tournamentId }) => [
        {
          type: "VolleyballTournamentFixtures",
          id: tournamentId,
        },

        {
          type: "VolleyballTournament",
          id: tournamentId,
        },
      ],
    }),

    /* =====================================================
         ADVANCE
      ===================================================== */

    advanceVolleyballTournamentFixture: builder.mutation<
      VolleyballTournamentFixture,
      {
        tournamentId: string;
        fixtureId: string;
      }
    >({
      query: ({ tournamentId, fixtureId }) => ({
        url: `/volleyball/tournaments/${tournamentId}/fixtures/${fixtureId}/advance`,
        method: "POST",
      }),

      invalidatesTags: (_result, _error, { tournamentId }) => [
        {
          type: "VolleyballTournamentFixtures",
          id: tournamentId,
        },

        {
          type: "VolleyballTournament",
          id: tournamentId,
        },

        {
          type: "VolleyballTournamentStandings",
          id: tournamentId,
        },
      ],
    }),

    /* =====================================================
         STANDINGS
      ===================================================== */

    getVolleyballTournamentStandings: builder.query<
      VolleyballTournamentStandingsResponse,
      {
        tournamentId: string;
        groupName?: string;
      }
    >({
      query: ({ tournamentId, groupName }) => ({
        url: `/volleyball/tournaments/${tournamentId}/standings`,

        params: groupName
          ? {
              groupName,
            }
          : undefined,
      }),

      providesTags: (_result, _error, { tournamentId }) => [
        {
          type: "VolleyballTournamentStandings",
          id: tournamentId,
        },
      ],
    }),
  }),
});

export const {
  useCreateVolleyballTournamentMutation,

  useGetVolleyballTournamentsQuery,

  useGetVolleyballTournamentQuery,

  useRegisterVolleyballTournamentTeamMutation,

  useGetVolleyballTournamentTeamsQuery,

  useCreateVolleyballTournamentFixtureMutation,

  useGetVolleyballTournamentFixturesQuery,

  useCreateVolleyballMatchFromFixtureMutation,

  useAdvanceVolleyballTournamentFixtureMutation,

  useGetVolleyballTournamentStandingsQuery,
} = volleyballTournamentApi;
