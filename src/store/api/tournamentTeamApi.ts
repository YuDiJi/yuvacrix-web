import { baseApi } from "./baseApi";

export type TournamentTeamStatus = "ACTIVE" | "REMOVED" | "DISQUALIFIED";

export type TournamentTeam = {
  id: string;
  tournamentId: string;
  teamId: string;
  status: TournamentTeamStatus;
  memberCount: number;

  teamNameSnapshot: string;
  teamShortNameSnapshot?: string | null;
  teamLogoSnapshot?: string | null;

  seedNumber?: number | null;
  joinedAt?: string | null;
  removedAt?: string | null;
  disqualifiedAt?: string | null;
  removalReason?: string | null;

  createdBy?: {
    actorType: "USER" | "SYSTEM" | "ADMIN" | string;
    actorId: string;
  };

  createdAt?: string;
  updatedAt?: string;
};

export type AddTeamToTournamentRequest = {
  tournamentId: string;
  teamId: string;
  seedNumber?: number;
};

export type GetTournamentTeamsQuery = {
  tournamentId: string;
  status?: TournamentTeamStatus;
};

export type RemoveTeamFromTournamentRequest = {
  tournamentId: string;
  teamId: string;
  removalReason?: string;
};

export type AssignTournamentPlayerRolesRequest = {
  tournamentId: string;
  teamId: string;
  playerId: string;
  body: {
    isAdmin?: boolean;
    isWicketKeeper?: boolean;
    isCaptain?: boolean;
  };
};

export type TournamentTeamPlayerStatus = "ACTIVE" | "REMOVED";

export type TournamentActorType = "USER" | "SYSTEM" | "ADMIN" | string;

export type TournamentAuditActor = {
  actorType: TournamentActorType;
  actorId: string;
};

export type TournamentTeamPlayerRoles = {
  isAdmin: boolean;
  isScorer: boolean;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isWicketKeeper: boolean;
};

export type TournamentTeamRolePlayer = {
  id: string;
  tournamentId: string;
  teamId: string;
  playerId: string;
  userId?: string | null;

  playerNameSnapshot: string;
  playerProfileImageSnapshot?: string | null;
  jerseyNumber?: string | number | null;

  roles: TournamentTeamPlayerRoles;
  status: TournamentTeamPlayerStatus;

  addedAt: string;
  removedAt?: string | null;
  removalReason?: string | null;

  createdBy: TournamentAuditActor;
  updatedBy?: TournamentAuditActor | null;

  createdAt: string;
  updatedAt: string;
};

export type TournamentTeamRoleSummary = {
  tournamentId: string;
  teamId: string;

  captain: TournamentTeamRolePlayer | null;
  viceCaptain: TournamentTeamRolePlayer | null;
  wicketKeeper: TournamentTeamRolePlayer | null;

  admins: TournamentTeamRolePlayer[];
  scorers: TournamentTeamRolePlayer[];
};

export type GetTournamentTeamRoleSummaryRequest = {
  tournamentId: string;
  teamId: string;
};

export const tournamentTeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTeamToTournament: builder.mutation<
      TournamentTeam,
      AddTeamToTournamentRequest
    >({
      query: ({ tournamentId, teamId, seedNumber }) => ({
        url: `/tournaments/${tournamentId}/teams/${teamId}`,
        method: "POST",
        body:
          seedNumber !== undefined
            ? {
                seedNumber,
              }
            : {},
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
        { type: "TournamentTeam", id: tournamentId },
      ],
    }),

    getTournamentTeams: builder.query<
      TournamentTeam[],
      GetTournamentTeamsQuery
    >({
      query: ({ tournamentId, status }) => ({
        url: `/tournaments/${tournamentId}/teams`,
        method: "GET",
        params: status ? { status } : undefined,
      }),
      providesTags: (_result, _error, { tournamentId }) => [
        { type: "TournamentTeam", id: tournamentId },
      ],
    }),

    removeTeamFromTournament: builder.mutation<
      { success?: boolean; message?: string },
      RemoveTeamFromTournamentRequest
    >({
      query: ({ tournamentId, teamId, removalReason }) => ({
        url: `/tournaments/${tournamentId}/teams/${teamId}`,
        method: "DELETE",
        body: {
          removalReason: removalReason ?? "Removed from tournament",
        },
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
        { type: "TournamentTeam", id: tournamentId },
      ],
    }),

    assignTournamentPlayerRoles: builder.mutation<
      { success?: boolean; message?: string },
      AssignTournamentPlayerRolesRequest
    >({
      query: ({ tournamentId, teamId, playerId, body }) => ({
        url: `/tournaments/${tournamentId}/teams/${teamId}/players/${playerId}/roles`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        { type: "TournamentTeam", id: tournamentId },
      ],
    }),

    getTeamsRoleSummary: builder.query<
      TournamentTeamRoleSummary,
      GetTournamentTeamRoleSummaryRequest
    >({
      query: ({ tournamentId, teamId }) => ({
        url: `/tournaments/${tournamentId}/teams/${teamId}/roles`,
        method: "GET",
        params: status ? { status } : undefined,
      }),
      providesTags: (_result, _error, { tournamentId, teamId }) => [
        { type: "TournamentTeam", id: tournamentId },
        { type: "TournamentTeam", id: teamId },
      ],
    }),
  }),
});

export const {
  useAddTeamToTournamentMutation,
  useGetTournamentTeamsQuery,
  useRemoveTeamFromTournamentMutation,
  useAssignTournamentPlayerRolesMutation,
  useGetTeamsRoleSummaryQuery,
} = tournamentTeamApi;
