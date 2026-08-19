import { baseApi } from "../baseApi";

export type TournamentVisibility = "PUBLIC" | "PRIVATE";

export type TournamentFormat =
  | "LEAGUE"
  | "GROUP_STAGE"
  | "CUSTOM"
  | "KNOCKOUT"
  | "GROUP_STAGE_PLUS_KNOCKOUT"
  | "SUPER_THREE"
  | "SUPER_FOUR"
  | "DOUBLE_ELIMINATION";

export type TournamentStatus =
  | "DRAFT"
  | "FIXTURES_READY"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED"
  | "CANCELLED";

export type TournamentBallType = "TENNIS" | "LEATHER" | "OTHER";

export type TournamentLocation = {
  city: string;
  groundName?: string;
  locationLabel?: string;
};

export type TournamentCounters = {
  teamCount: number;
  roundCount: number;
  groupCount: number;
  fixtureCount: number;
  matchCount: number;
  completedMatchCount: number;
  liveMatchCount: number;
  upcomingMatchCount: number;
};

export type Tournament = {
  id: string;
  isAdmin: boolean;
  ownerUserId: string;
  name: string;
  nameLower?: string;
  shortName?: string | null;
  description?: string | null;
  visibility: TournamentVisibility;
  format: TournamentFormat;
  category: TournamentCategory;
  ballType: TournamentBallType;
  status: TournamentStatus;
  logoUrl: string | null;
  coverImageUrl: string | null;
  viewsCount: number;

  startDate?: string | null;
  endDate?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  archivedAt?: string | null;
  cancelledAt?: string | null;

  location?: {
    city?: string | null;
    groundName?: string | null;
    locationLabel?: string | null;
  } | null;

  pointsConfig?: {
    winPoints: number;
    lossPoints: number;
    tiePoints: number;
    noResultPoints: number;
    bonusPointsEnabled: boolean;
  };

  counters?: TournamentCounters;

  winnerTeamId?: string | null;
  runnerUpTeamId?: string | null;
  resultSummary?: string | null;
  completionReason?: string | null;

  createdBy?: {
    actorType: "USER" | "ADMIN" | string;
    actorId: string;
  };

  createdAt?: string;
  updatedAt?: string;
};

export type TournamentDashboard = {
  tournament: {
    tournamentId: string;
    name: string;
    visibility: TournamentVisibility;
    format: TournamentFormat;
    status: TournamentStatus;
    startDate?: string | null;
    endDate?: string | null;
    winnerTeamId?: string | null;
    resultSummary?: string | null;
  };

  teamCount: number;
  roundCount: number;
  groupCount: number;
  fixtureCount: number;
  matchCount: number;
  liveMatchCount: number;
  upcomingMatchCount: number;
  pastMatchCount: number;

  pointsTablePreview: unknown[];
  leaderboardPreview: unknown[];
  statsPreview: unknown[];

  actions: {
    canEdit: boolean;
    canAddTeams: boolean;
    canCreateRounds: boolean;
    canCreateGroups: boolean;
    canScheduleFixtures: boolean;
    canStartMatch: boolean;
    canCompleteTournament: boolean;
    canArchiveTournament: boolean;
    canCancelTournament: boolean;
  };
};

export type CreateTournamentRequest = {
  name: string;
  shortName?: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  visibility?: TournamentVisibility;
  format?: TournamentFormat;
  category?: TournamentCategory;
  ballType?: TournamentBallType;
  startDate?: string;
  endDate?: string;
  location?: TournamentLocation;
};

export type UpdateTournamentRequest = Partial<CreateTournamentRequest>;

export type GetOwnedTournamentsQuery = {
  status?: TournamentStatus;
  format?: TournamentFormat;
  page?: number;
  limit?: number;
};

export type TournamentOverviewFilter =
  | "YOUR"
  | "PARTICIPATE"
  | "NETWORK"
  | "ALL";
export type GetTournamentOverviewResponse = {
  items: Tournament[];
  pagination: { skip: number; limit: number; total: number; hasMore: boolean };
};

export type SearchTournamentsQuery = {
  q?: string;
  page?: number;
  limit?: number;
};

export type CompleteTournamentRequest = {
  winnerTeamId: string;
  runnerUpTeamId: string;
  resultSummary?: string;
  completionReason?: string;
};

export type CancelTournamentRequest = {
  cancellationReason: string;
};

export type TournamentCategory =
  | "OPEN"
  | "CORPORATE"
  | "COMMUNITY"
  | "SCHOOL"
  | "COLLEGE"
  | "UNIVERSITY"
  | "SERIES"
  | "OTHER";

export type TournamentAboutBallType = "TENNIS" | "LEATHER" | "OTHER";

export type TournamentAboutResponse = {
  tournament: {
    id: string;
    name: string;
    visibility: TournamentVisibility;
    format: TournamentFormat;
    category: TournamentCategory;
    status: TournamentStatus;
    viewsCount: number;
    startDate?: string | null;
    endDate?: string | null;
    location?: TournamentLocation | null;
    ballType?: TournamentAboutBallType | null;
    shareUrl?: string | null;
    qrPayload?: string | null;
  };

  organiser: {
    userId: string;
    name: string;
    city?: string | null;
    avatarUrl?: string | null;
    tournamentsOrganised: number;
  } | null;

  setupGuide: {
    helpVideosEnabled: boolean;
    helplineEnabled: boolean;
    whatsappEnabled: boolean;
  };

  actions: {
    canEdit: boolean;
    canGoLive: boolean;
    canShare: boolean;
    canViewQr: boolean;
  };
};

export interface GetMyTournamentsOverviewParams {
  filter: TournamentOverviewFilter;
  skip: number;
  limit: number;
}

export interface TournamentsOverviewPagination {
  skip: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface GetMyTournamentsOverviewResponse {
  items: Tournament[];
  pagination: TournamentsOverviewPagination;
}

export const tournamentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTournament: builder.mutation<Tournament, CreateTournamentRequest>({
      query: (body) => ({
        url: "/tournaments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tournament"],
    }),

    getMyTournamentsOverview: builder.query<
      GetMyTournamentsOverviewResponse,
      GetMyTournamentsOverviewParams
    >({
      query: ({ filter, skip, limit }) => ({
        url: "/tournaments/me/overview",
        method: "GET",
        params: {
          filter,
          skip,
          limit,
        },
      }),
      providesTags: ["Tournament"],
    }),

    getMyTournamentOverview: builder.query<
      GetTournamentOverviewResponse,
      { filter: TournamentOverviewFilter; skip: number; limit: number }
    >({
      query: (params) => ({
        url: "/tournaments/me/overview",
        method: "GET",
        params,
      }),
      providesTags: ["Tournament"],
    }),

    searchPublicTournaments: builder.query<
      Tournament[],
      SearchTournamentsQuery | void
    >({
      query: (params) => ({
        url: "/tournaments/search",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["Tournament"],
    }),

    getTournamentDetails: builder.query<Tournament, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, tournamentId) => [
        { type: "Tournament", id: tournamentId },
      ],
    }),

    updateTournament: builder.mutation<
      Tournament,
      {
        tournamentId: string;
        body: UpdateTournamentRequest;
      }
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),

    markFixturesReady: builder.mutation<Tournament, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}/fixtures-ready`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, tournamentId) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),

    activateTournament: builder.mutation<Tournament, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}/activate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, tournamentId) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),

    completeTournament: builder.mutation<
      Tournament,
      {
        tournamentId: string;
        body: CompleteTournamentRequest;
      }
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/complete`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),

    cancelTournament: builder.mutation<
      Tournament,
      {
        tournamentId: string;
        body: CancelTournamentRequest;
      }
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/cancel`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),

    archiveTournament: builder.mutation<Tournament, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}/archive`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, tournamentId) => [
        "Tournament",
        { type: "Tournament", id: tournamentId },
      ],
    }),

    getTournamentDashboard: builder.query<TournamentDashboard, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}/dashboard`,
        method: "GET",
      }),
      providesTags: (_result, _error, tournamentId) => [
        { type: "Tournament", id: tournamentId },
      ],
    }),

    getAbout: builder.query<TournamentAboutResponse, string>({
      query: (tournamentId) => ({
        url: `/tournaments/${tournamentId}/about`,
        method: "GET",
      }),
      providesTags: (_result, _error, tournamentId) => [
        { type: "Tournament", id: tournamentId },
      ],
    }),
  }),
});

export const {
  useCreateTournamentMutation,
  useGetMyTournamentsOverviewQuery,
  useSearchPublicTournamentsQuery,
  useGetTournamentDetailsQuery,
  useUpdateTournamentMutation,
  useMarkFixturesReadyMutation,
  useActivateTournamentMutation,
  useCompleteTournamentMutation,
  useCancelTournamentMutation,
  useArchiveTournamentMutation,
  useGetTournamentDashboardQuery,
  useGetAboutQuery,
} = tournamentApi;
