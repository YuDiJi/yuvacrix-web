import { baseApi } from "../baseApi";

import type { VolleyballMatch } from "@/types/volleyball/match";

import type {
  CreateVolleyballTournamentDto,
  CreateVolleyballTournamentFixtureDto,
  RegisterVolleyballTournamentTeamDto,
  VolleyballTournament,
  VolleyballTournamentDetail,
  VolleyballTournamentFixture,
  VolleyballTournamentStandingsResponse,
  VolleyballTournamentStatus,
  VolleyballTournamentTeam,
  VolleyballTournamentStage,
  VolleyballFixtureStatus,
  UpdateVolleyballTournamentFixtureDto,
  DeleteVolleyballTournamentFixtureResponse,
  AddVolleyballTournamentAdminDto,
  VolleyballTournamentAdmin,
  VolleyballTournamentAdminsResponse,
  RemoveVolleyballTournamentTeamResponse,
  GetMyVolleyballTournamentsQuery,
  VolleyballMyTournamentsResponse,
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
      VolleyballTournamentDetail,
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

    getVolleyballTournamentAdmins: builder.query<
      VolleyballTournamentAdminsResponse,
      { tournamentId: string }
    >({
      query: ({ tournamentId }) =>
        `/volleyball/tournaments/${tournamentId}/admins`,
      providesTags: (_result, _error, { tournamentId }) => [
        { type: "VolleyballTournamentAdmins", id: tournamentId },
      ],
    }),

    addVolleyballTournamentAdmin: builder.mutation<
      VolleyballTournamentAdmin,
      { tournamentId: string; body: AddVolleyballTournamentAdminDto }
    >({
      query: ({ tournamentId, body }) => ({
        url: `/volleyball/tournaments/${tournamentId}/admins`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        { type: "VolleyballTournamentAdmins", id: tournamentId },
        { type: "VolleyballTournament", id: tournamentId },
      ],
    }),

    removeVolleyballTournamentAdmin: builder.mutation<
      { success: boolean },
      { tournamentId: string; userId: string }
    >({
      query: ({ tournamentId, userId }) => ({
        url: `/volleyball/tournaments/${tournamentId}/admins/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        { type: "VolleyballTournamentAdmins", id: tournamentId },
        { type: "VolleyballTournament", id: tournamentId },
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

    removeVolleyballTournamentTeam: builder.mutation<
      RemoveVolleyballTournamentTeamResponse,
      { tournamentId: string; teamId: string }
    >({
      query: ({ tournamentId, teamId }) => ({
        url: `/volleyball/tournaments/${tournamentId}/teams/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        { type: "VolleyballTournament", id: tournamentId },
        { type: "VolleyballTournamentTeams", id: tournamentId },
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

    generateVolleyballLeagueFixtures: builder.mutation<
      unknown,
      { tournamentId: string }
    >({
      query: ({ tournamentId }) => ({
        url: `/volleyball/tournaments/${tournamentId}/fixtures/generate-league`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        { type: "VolleyballTournamentFixtures", id: tournamentId },
        { type: "VolleyballTournament", id: tournamentId },
        { type: "VolleyballTournamentStandings", id: tournamentId },
      ],
    }),

    /* =====================================================
   UPDATE FIXTURE
===================================================== */

    updateVolleyballTournamentFixture: builder.mutation<
      VolleyballTournamentFixture,
      {
        tournamentId: string;
        fixtureId: string;
        body: UpdateVolleyballTournamentFixtureDto;
      }
    >({
      query: ({ tournamentId, fixtureId, body }) => ({
        url: `/volleyball/tournaments/${tournamentId}/fixtures/${fixtureId}`,
        method: "PATCH",
        body,
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
   DELETE FIXTURE
===================================================== */

    deleteVolleyballTournamentFixture: builder.mutation<
      DeleteVolleyballTournamentFixtureResponse,
      {
        tournamentId: string;
        fixtureId: string;
      }
    >({
      query: ({ tournamentId, fixtureId }) => ({
        url: `/volleyball/tournaments/${tournamentId}/fixtures/${fixtureId}`,
        method: "DELETE",
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

    getMyVolleyballTournaments: builder.query<
      VolleyballMyTournamentsResponse,
      GetMyVolleyballTournamentsQuery | void
    >({
      query: (params) => ({
        url: "/volleyball/tournaments/me",
        params: params ?? undefined,
      }),

      providesTags: ["VolleyballTournaments"],
    }),
  }),
});

export const {
  useCreateVolleyballTournamentMutation,

  useGetVolleyballTournamentsQuery,

  useGetVolleyballTournamentQuery,

  useGetVolleyballTournamentAdminsQuery,

  useAddVolleyballTournamentAdminMutation,

  useRemoveVolleyballTournamentAdminMutation,

  useRegisterVolleyballTournamentTeamMutation,

  useRemoveVolleyballTournamentTeamMutation,

  useGetVolleyballTournamentTeamsQuery,

  useCreateVolleyballTournamentFixtureMutation,

  useGenerateVolleyballLeagueFixturesMutation,

  useGetVolleyballTournamentFixturesQuery,

  useCreateVolleyballMatchFromFixtureMutation,

  useAdvanceVolleyballTournamentFixtureMutation,

  useGetVolleyballTournamentStandingsQuery,

  useUpdateVolleyballTournamentFixtureMutation,

  useDeleteVolleyballTournamentFixtureMutation,

  useGetMyVolleyballTournamentsQuery,
} = volleyballTournamentApi;
