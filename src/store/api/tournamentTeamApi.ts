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
  }),
});

export const {
  useAddTeamToTournamentMutation,
  useGetTournamentTeamsQuery,
  useRemoveTeamFromTournamentMutation,
} = tournamentTeamApi;
