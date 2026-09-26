import { baseApi } from "../baseApi";

// ─────────────────────────────────────────────────────────────────────────────
// Shared enums / unions
// ─────────────────────────────────────────────────────────────────────────────

export type TournamentFixtureStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "MATCH_CREATED"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED";

export type TournamentFixtureSource = "MANUAL" | "AUTO";

export type TournamentMatchFilter = "ALL" | "LIVE" | "UPCOMING" | "PAST";

export type TournamentPitchType =
  | "ROUGH"
  | "CEMENT"
  | "TURF"
  | "ASTROTURF"
  | "MATTING"
  | "OTHER";

export type TournamentMatchType =
  | "LIMITED_OVERS"
  | "BOX_TURF"
  | "PAIR_CRICKET"
  | "TEST"
  | "THE_HUNDRED";

export type TournamentLineupMode = "FLEXIBLE" | "FIXED";

export type TournamentBallType = "TENNIS" | "LEATHER" | "OTHER";

export type TournamentFixtureActorType = "USER" | "SYSTEM";

export type TournamentKnockoutNextFixtureSlot = "TEAM_A" | "TEAM_B";

// ─────────────────────────────────────────────────────────────────────────────
// Shared fixture structures
// ─────────────────────────────────────────────────────────────────────────────

export type TournamentFixtureVenue = {
  city: string;
  groundName?: string | null;
  pitchType?: TournamentPitchType | null;
  addressText?: string | null;
};

export type TournamentFixtureRules = {
  matchType: TournamentMatchType;
  oversLimit?: number | null;
  oversPerBowler?: number | null;
  lineupMode?: TournamentLineupMode | null;
  ballType?: TournamentBallType | null;
  wagonWheelEnabled?: boolean;
  shotSelectionEnabled?: boolean;
};

export type TournamentFixtureOfficials = {
  scorerUserIds?: string[];
  umpireNames?: string[];
  liveStreamerUserIds?: string[];
  otherNames?: string[];
};

export type TournamentFixtureTeamSnapshot = {
  teamId: string;
  name: string;
  shortName?: string | null;
  logoUrl?: string | null;
};

export type TournamentFixtureAuditActor = {
  actorType: TournamentFixtureActorType;
  actorId?: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Fixture response
// ─────────────────────────────────────────────────────────────────────────────

export type TournamentFixture = {
  id: string;
  tournamentId: string;
  roundId: string;

  groupId: string | null;
  matchId: string | null;

  teamAId: string | null;
  teamBId: string | null;

  teamASnapshot: TournamentFixtureTeamSnapshot | null;
  teamBSnapshot: TournamentFixtureTeamSnapshot | null;

  teamASourceFixtureId?: string | null;
  teamBSourceFixtureId?: string | null;
  nextFixtureId?: string | null;
  nextFixtureSlot?: TournamentKnockoutNextFixtureSlot | null;
  generationKey?: string | null;
  inconsistency?: string | null;

  scheduledAt: string | null;
  timezone: string | null;

  sequenceNumber: number | null;
  roundMatchNumber: number | null;
  groupMatchNumber: number | null;

  venueSnapshot: TournamentFixtureVenue | null;
  matchRulesSnapshot: TournamentFixtureRules | null;
  officialsSnapshot: TournamentFixtureOfficials | null;

  status: TournamentFixtureStatus;
  createdFrom: TournamentFixtureSource;

  /**
   * The current API examples contain null for this property.
   * Replace unknown with an exact type after receiving a completed fixture.
   */
  resultMirror: unknown | null;

  cancellationReason: string | null;
  cancelledAt: string | null;

  createdBy: TournamentFixtureAuditActor | null;
  updatedBy: TournamentFixtureAuditActor | null;

  createdAt: string;
  updatedAt: string;
};

export type GenerateKnockoutFixturesBody =
  | {
      seededTeamIds: string[];
    }
  | Record<string, never>;

export type GenerateKnockoutFixturesRequest = {
  tournamentId: string;
  body: GenerateKnockoutFixturesBody;
};

export type GeneratedKnockoutFixture = {
  id: string;
  tournamentId: string;
  roundId: string;

  groupId: string | null;
  matchId: string | null;

  teamAId: string | null;
  teamBId: string | null;

  teamASnapshot: TournamentFixtureTeamSnapshot | null;
  teamBSnapshot: TournamentFixtureTeamSnapshot | null;

  teamASourceFixtureId: string | null;
  teamBSourceFixtureId: string | null;
  nextFixtureId: string | null;
  nextFixtureSlot: TournamentKnockoutNextFixtureSlot | null;
  generationKey: string | null;
  inconsistency: string | null;

  scheduledAt?: string | null;
  timezone?: string | null;

  sequenceNumber?: number | null;
  roundMatchNumber?: number | null;
  groupMatchNumber?: number | null;

  venueSnapshot?: TournamentFixtureVenue | null;
  matchRulesSnapshot?: TournamentFixtureRules | null;
  officialsSnapshot?: TournamentFixtureOfficials | null;

  status?: TournamentFixtureStatus;
  createdFrom?: TournamentFixtureSource;

  createdAt?: string;
  updatedAt?: string;
};

export type GenerateKnockoutFixturesResponse = {
  tournamentId: string;
  fixtures: GeneratedKnockoutFixture[];
};

export type CreateMatchFromFixtureRequest = {
  tournamentId: string;
  fixtureId: string;
};

export type CreateMatchFromFixtureResponse = {
  fixture: {
    id: string;
    matchId: string;
    status: "MATCH_CREATED";
  };
  matchId: string;
  created: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Manual fixture
// ─────────────────────────────────────────────────────────────────────────────

export type CreateManualFixtureBody = {
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

export type CreateManualFixtureRequest = {
  tournamentId: string;
  body: CreateManualFixtureBody;
};

// ─────────────────────────────────────────────────────────────────────────────
// Auto-generate fixtures
// ─────────────────────────────────────────────────────────────────────────────

export type AutoGenerateFixturesBody = {
  roundId: string;

  /**
   * Send groupId only when generating fixtures for one group.
   */
  groupId?: string;

  /**
   * Send teamIds only when generating fixtures for selected teams.
   * Do not send both groupId and teamIds.
   */
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

export type AutoGenerateFixturesRequest = {
  tournamentId: string;
  body: AutoGenerateFixturesBody;
};

export type AutoGeneratedFixture = {
  fixtureId: string;
  matchId: string;

  teamAId: string;
  teamBId: string;

  scheduledAt: string | null;
};

export type AutoGenerateFixturesResponse = {
  tournamentId: string;
  roundId: string;
  groupId: string | null;

  totalFixturesCreated: number;
  totalMatchesCreated: number;

  fixtures: AutoGeneratedFixture[];
};

export type PreviewAutoFixtureTeam = {
  teamId: string;
  name: string;
  shortName: string;
  logoUrl: string | null;
};

export type PreviewAutoFixtureVenue = {
  city: string;
  groundName: string;
  pitchType: TournamentPitchType;
  addressText?: string;
};

export type PreviewAutoFixtureRules = {
  matchType: TournamentMatchType;
  oversLimit: number;
  oversPerBowler: number;
  lineupMode: TournamentLineupMode;
  ballType: TournamentBallType;
  wagonWheelEnabled: boolean;
  shotSelectionEnabled: boolean;
};

export type PreviewAutoFixtureOfficials = {
  scorerUserIds: string[];
  umpireNames: string[];
  liveStreamerUserIds: string[];
  otherNames: string[];
};

export type PreviewAutoFixture = {
  clientFixtureId: string;

  sequenceNumber: number;
  roundMatchNumber: number;
  groupMatchNumber: number | null;
  repeatNumber: number;

  teamAId: string;
  teamBId: string;

  teamA: PreviewAutoFixtureTeam;
  teamB: PreviewAutoFixtureTeam;

  scheduledAt: string;
  timezone: string;

  venue: PreviewAutoFixtureVenue;
  rules: PreviewAutoFixtureRules;
  officials: PreviewAutoFixtureOfficials;
};

export type PreviewAutoFixturesResponse = {
  tournamentId: string;
  roundId: string;
  groupId: string | null;

  totalProposedFixtures: number;
  canConfirm: boolean;
  warnings: string[];

  fixtures: PreviewAutoFixture[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Get fixtures
// ─────────────────────────────────────────────────────────────────────────────

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

// The current API returns a direct array.
export type GetTournamentFixturesResponse = TournamentFixture[];

// ─────────────────────────────────────────────────────────────────────────────
// Fixture details
// ─────────────────────────────────────────────────────────────────────────────

export type GetFixtureDetailsRequest = {
  tournamentId: string;
  fixtureId: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Update fixture
// ─────────────────────────────────────────────────────────────────────────────

export type UpdateFixtureBody = Partial<{
  scheduledAt: string;
  timezone: string;

  sequenceNumber: number;
  roundMatchNumber: number;
  groupMatchNumber: number;

  venue: TournamentFixtureVenue;
  rules: TournamentFixtureRules;
  officials: TournamentFixtureOfficials;
}>;

export type UpdateFixtureRequest = {
  tournamentId: string;
  fixtureId: string;
  body: UpdateFixtureBody;
};

// ─────────────────────────────────────────────────────────────────────────────
// Cancel fixture
// ─────────────────────────────────────────────────────────────────────────────

export type CancelFixtureRequest = {
  tournamentId: string;
  fixtureId: string;

  body: {
    cancellationReason: string;
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Delete fixture
// ─────────────────────────────────────────────────────────────────────────────

export type DeleteFixtureRequest = {
  tournamentId: string;
  fixtureId: string;
};

export type DeleteFixtureResponse = {
  success?: boolean;
  message?: string;
};

export type ConfirmAutoFixtureItem = {
  clientFixtureId: string;

  teamAId: string;
  teamBId: string;

  scheduledAt: string;
  timezone: string;

  sequenceNumber: number;
  roundMatchNumber: number;

  venue: {
    city: string;
    groundName: string;
    pitchType: TournamentPitchType;
  };

  rules: {
    matchType: TournamentMatchType;
    oversLimit: number;
    oversPerBowler: number;
    lineupMode: TournamentLineupMode;
    ballType: TournamentBallType;
    wagonWheelEnabled: boolean;
  };

  officials: {
    scorerUserIds: string[];
    umpireNames: string[];
    liveStreamerUserIds: string[];
    otherNames: string[];
  };
};

export type ConfirmAutoFixturesRequest = {
  tournamentId: string;

  body: {
    roundId: string;
    groupId: string | null;
    fixtures: ConfirmAutoFixtureItem[];
  };
};

export type ConfirmAutoFixturesResponse = {
  success?: boolean;
  createdCount?: number;
  fixtureIds?: string[];
};

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────

export const tournamentFixtureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─────────────────────────────────────────────────────────────────────────
    // Create manual fixture
    // ─────────────────────────────────────────────────────────────────────────

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
        {
          type: "Tournament",
          id: tournamentId,
        },
        {
          type: "TournamentFixture",
          id: tournamentId,
        },
      ],
    }),

    generateKnockoutFixtures: builder.mutation<
      GenerateKnockoutFixturesResponse,
      GenerateKnockoutFixturesRequest
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/fixtures/knockout/generate`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { tournamentId }) => [
        {
          type: "Tournament",
          id: tournamentId,
        },
        {
          type: "TournamentFixture",
          id: tournamentId,
        },
      ],
    }),

    createMatchFromFixture: builder.mutation<
      CreateMatchFromFixtureResponse,
      CreateMatchFromFixtureRequest
    >({
      query: ({ tournamentId, fixtureId }) => ({
        url: `/tournaments/${tournamentId}/fixtures/${fixtureId}/create-match`,
        method: "POST",
      }),

      invalidatesTags: (_result, _error, { tournamentId, fixtureId }) => [
        {
          type: "Tournament",
          id: tournamentId,
        },
        {
          type: "TournamentFixture",
          id: tournamentId,
        },
        {
          type: "TournamentFixture",
          id: fixtureId,
        },
        {
          type: "TournamentMatch",
          id: `LIST-${tournamentId}`,
        },
      ],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Auto-generate fixtures
    // ─────────────────────────────────────────────────────────────────────────

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
        {
          type: "Tournament",
          id: tournamentId,
        },
        {
          type: "TournamentFixture",
          id: tournamentId,
        },
      ],
    }),
    // ─────────────────────────────────────────────────────────────────────────
    // Preview Auto fixtures
    // ─────────────────────────────────────────────────────────────────────────

    previewAutoFixtures: builder.mutation<
      PreviewAutoFixturesResponse,
      AutoGenerateFixturesRequest
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/fixtures/auto-generate/preview`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { tournamentId }) => [
        {
          type: "Tournament",
          id: tournamentId,
        },
        {
          type: "TournamentFixture",
          id: tournamentId,
        },
      ],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Confirm Auto fixtures
    // ─────────────────────────────────────────────────────────────────────────

    confirmAutoFixtures: builder.mutation<
      ConfirmAutoFixturesResponse,
      ConfirmAutoFixturesRequest
    >({
      query: ({ tournamentId, body }) => ({
        url: `/tournaments/${tournamentId}/fixtures/auto-generate/confirm`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { tournamentId }) => [
        {
          type: "TournamentFixture",
          id: tournamentId,
        },
      ],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Get tournament fixtures
    // ─────────────────────────────────────────────────────────────────────────

    getTournamentFixtures: builder.query<
      GetTournamentFixturesResponse,
      GetTournamentFixturesQuery
    >({
      query: ({ tournamentId, ...params }) => ({
        url: `/tournaments/${tournamentId}/fixtures`,
        method: "GET",
        params,
      }),

      providesTags: (result, _error, { tournamentId }) => {
        if (!result) {
          return [
            {
              type: "TournamentFixture",
              id: tournamentId,
            },
          ];
        }

        return [
          {
            type: "TournamentFixture",
            id: tournamentId,
          },

          ...result.map((fixture) => ({
            type: "TournamentFixture" as const,
            id: fixture.id,
          })),
        ];
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Get fixture details
    // ─────────────────────────────────────────────────────────────────────────

    getFixtureDetails: builder.query<
      TournamentFixture,
      GetFixtureDetailsRequest
    >({
      query: ({ tournamentId, fixtureId }) => ({
        url: `/tournaments/${tournamentId}/fixtures/${fixtureId}`,
        method: "GET",
      }),

      providesTags: (_result, _error, { fixtureId }) => [
        {
          type: "TournamentFixture",
          id: fixtureId,
        },
      ],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Update fixture
    // ─────────────────────────────────────────────────────────────────────────

    updateFixture: builder.mutation<TournamentFixture, UpdateFixtureRequest>({
      query: ({ tournamentId, fixtureId, body }) => ({
        url: `/tournaments/${tournamentId}/fixtures/${fixtureId}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { tournamentId, fixtureId }) => [
        {
          type: "TournamentFixture",
          id: tournamentId,
        },
        {
          type: "TournamentFixture",
          id: fixtureId,
        },
      ],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Cancel fixture
    // ─────────────────────────────────────────────────────────────────────────

    cancelFixture: builder.mutation<TournamentFixture, CancelFixtureRequest>({
      query: ({ tournamentId, fixtureId, body }) => ({
        url: `/tournaments/${tournamentId}/fixtures/${fixtureId}/cancel`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { tournamentId, fixtureId }) => [
        {
          type: "TournamentFixture",
          id: tournamentId,
        },
        {
          type: "TournamentFixture",
          id: fixtureId,
        },
      ],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // Delete fixture
    // ─────────────────────────────────────────────────────────────────────────

    deleteFixture: builder.mutation<
      DeleteFixtureResponse,
      DeleteFixtureRequest
    >({
      query: ({ tournamentId, fixtureId }) => ({
        url: `/tournaments/${tournamentId}/fixtures/${fixtureId}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, { tournamentId, fixtureId }) => [
        {
          type: "TournamentFixture",
          id: tournamentId,
        },
        {
          type: "TournamentFixture",
          id: fixtureId,
        },
      ],
    }),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

export const {
  useCreateManualFixtureMutation,
  useGenerateKnockoutFixturesMutation,
  useCreateMatchFromFixtureMutation,
  useAutoGenerateFixturesMutation,
  usePreviewAutoFixturesMutation,
  useConfirmAutoFixturesMutation,
  useGetTournamentFixturesQuery,
  useLazyGetTournamentFixturesQuery,
  useGetFixtureDetailsQuery,
  useLazyGetFixtureDetailsQuery,
  useUpdateFixtureMutation,
  useCancelFixtureMutation,
  useDeleteFixtureMutation,
} = tournamentFixtureApi;
