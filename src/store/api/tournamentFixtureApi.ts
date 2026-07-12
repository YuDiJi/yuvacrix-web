import { baseApi } from "./baseApi";

export type TournamentFixtureStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "MATCH_CREATED"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED";

export type TournamentFixtureSource = "MANUAL" | "AUTO";

export type TournamentMatchFilter = "ALL" | "LIVE" | "UPCOMING" | "PAST";

export type TournamentFixtureVenue = {
  city: string;
  groundName?: string;
  pitchType?: "ROUGH" | "CEMENT" | "TURF" | "ASTROTURF" | "MATTING" | "OTHER";
  addressText?: string;
};

export type TournamentFixtureRules = {
  matchType:
    | "LIMITED_OVERS"
    | "BOX_TURF"
    | "PAIR_CRICKET"
    | "TEST"
    | "THE_HUNDRED";
  oversLimit?: number;
  oversPerBowler?: number;
  lineupMode?: "FLEXIBLE" | "FIXED";
  ballType?: "TENNIS" | "LEATHER" | "OTHER";
  wagonWheelEnabled?: boolean;
  shotSelectionEnabled?: boolean;
};

export type TournamentFixtureOfficials = {
  scorerUserIds?: string[];
  umpireNames?: string[];
  liveStreamerUserIds?: string[];
  otherNames?: string[];
};

export type TournamentFixture = {
  id: string;
  tournamentId: string;
  roundId: string;
  groupId?: string | null;

  teamAId: string;
  teamBId: string;

  matchId?: string | null;

  scheduledAt?: string | null;
  timezone?: string | null;

  sequenceNumber?: number | null;
  roundMatchNumber?: number | null;
  groupMatchNumber?: number | null;

  status: TournamentFixtureStatus;
  createdFrom?: TournamentFixtureSource;

  venue?: TournamentFixtureVenue | null;
  rules?: TournamentFixtureRules | null;
  officials?: TournamentFixtureOfficials | null;

  cancellationReason?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

export type CreateManualFixtureRequest = {
  tournamentId: string;
  body: {
    roundId: string;
    groupId?: string;
    teamAId: string;
    teamBId: string;
    scheduledAt?: string;
    timezone?: string;
    sequenceNumber?: number;
    roundMatchNumber?: number;
    groupMatchNumber?: number;
    venue: TournamentFixtureVenue;
    rules: TournamentFixtureRules;
    officials?: TournamentFixtureOfficials;
  };
};

export type AutoGenerateFixturesRequest = {
  tournamentId: string;
  body: {
    roundId: string;
    groupId?: string;
    teamIds?: string[];
    repeatCount?: number;
    firstMatchDate: string;
    firstMatchTime: string;
    timezone?: string;
    intervalMinutes?: number;
    dailyMatchesPerGround?: number;
    venue: TournamentFixtureVenue;
    rules: TournamentFixtureRules;
    officials?: TournamentFixtureOfficials;
  };
};

export type AutoGenerateFixturesResponse = {
  tournamentId: string;
  roundId: string;
  groupId?: string | null;
  totalFixturesCreated: number;
  totalMatchesCreated: number;
  fixtures: {
    fixtureId: string;
    matchId: string;
    teamAId: string;
    teamBId: string;
    scheduledAt?: string | null;
  }[];
};

export type GetTournamentFixturesQuery = {
  tournamentId: string;
  roundId?: string;
  groupId?: string;
  teamId?: string;
  status?: TournamentFixtureStatus;
  createdFrom?: TournamentFixtureSource;
  fromDate?: string;
  toDate?: string;
  skip?: number;
  limit?: number;
};

export type UpdateFixtureRequest = {
  tournamentId: string;
  fixtureId: string;
  body: Partial<{
    scheduledAt: string;
    timezone: string;
    sequenceNumber: number;
    roundMatchNumber: number;
    groupMatchNumber: number;
    venue: TournamentFixtureVenue;
    rules: TournamentFixtureRules;
    officials: TournamentFixtureOfficials;
  }>;
};

export type CancelFixtureRequest = {
  tournamentId: string;
  fixtureId: string;
  body: {
    cancellationReason: string;
  };
};

export type DeleteFixtureRequest = {
  tournamentId: string;
  fixtureId: string;
};

export const tournamentFixtureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createManualFixture: builder.mutation<
      TournamentFixture,
      CreateManualFixtureRequest
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/fixtures/manual`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        { type: "Tournament", id: tournamentId },
        { type: "TournamentFixture", id: tournamentId },
      ],
    }),

    autoGenerateFixtures: builder.mutation<
      AutoGenerateFixturesResponse,
      AutoGenerateFixturesRequest
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/fixtures/auto-generate`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId }) => [
        { type: "Tournament", id: tournamentId },
        { type: "TournamentFixture", id: tournamentId },
      ],
    }),

    getTournamentFixtures: builder.query<
      TournamentFixture[],
      GetTournamentFixturesQuery
    >({
      query: ({ tournamentId, ...params }) => ({
        url: `/tournaments/${tournamentId}/fixtures`,
        method: "GET",
        params,
      }),
      providesTags: (_result, _error, { tournamentId }) => [
        { type: "TournamentFixture", id: tournamentId },
      ],
    }),

    getFixtureDetails: builder.query<
      TournamentFixture,
      {
        tournamentId: string;
        fixtureId: string;
      }
    >({
      query: ({ tournamentId, fixtureId }) => ({
        url: `/tournaments/${tournamentId}/fixtures/${fixtureId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { fixtureId }) => [
        { type: "TournamentFixture", id: fixtureId },
      ],
    }),

    updateFixture: builder.mutation<TournamentFixture, UpdateFixtureRequest>({
      query: ({ tournamentId, fixtureId, body }) => ({
        url: `/tournaments/${tournamentId}/fixtures/${fixtureId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId, fixtureId }) => [
        { type: "TournamentFixture", id: tournamentId },
        { type: "TournamentFixture", id: fixtureId },
      ],
    }),

    cancelFixture: builder.mutation<TournamentFixture, CancelFixtureRequest>({
      query: ({ tournamentId, fixtureId, body }) => ({
        url: `/tournaments/${tournamentId}/fixtures/${fixtureId}/cancel`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { tournamentId, fixtureId }) => [
        { type: "TournamentFixture", id: tournamentId },
        { type: "TournamentFixture", id: fixtureId },
      ],
    }),

    deleteFixture: builder.mutation<
      { success?: boolean; message?: string },
      DeleteFixtureRequest
    >({
      query: ({ tournamentId, fixtureId }) => ({
        url: `/tournaments/${tournamentId}/fixtures/${fixtureId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { tournamentId, fixtureId }) => [
        { type: "TournamentFixture", id: tournamentId },
        { type: "TournamentFixture", id: fixtureId },
      ],
    }),
  }),
});

export const {
  useCreateManualFixtureMutation,
  useAutoGenerateFixturesMutation,
  useGetTournamentFixturesQuery,
  useGetFixtureDetailsQuery,
  useUpdateFixtureMutation,
  useCancelFixtureMutation,
  useDeleteFixtureMutation,
} = tournamentFixtureApi;
