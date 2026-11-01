import { z } from "zod/v4";
import { baseApi } from "../baseApi";

export type TournamentPointsScope = "TOURNAMENT" | "ROUND" | "GROUP";

export type NrrCalculationStatus = "COMPLETE" | "INCOMPLETE";

export type TournamentPointsTableRow = {
  position?: number;

  teamId: string;
  teamNameSnapshot: string;
  teamShortNameSnapshot?: string | null;
  teamLogoSnapshot?: string | null;

  matchesPlayed: number;
  wins: number;
  losses: number;
  ties: number;
  noResults: number;
  cancelled?: number;

  points: number;
  bonusPoints: number;
  penaltyPoints: number;

  runsFor?: number;
  ballsFor?: number;
  runsAgainst?: number;
  ballsAgainst?: number;

  runRateFor?: number;
  runRateAgainst?: number;
  nrr: number;

  nrrCalculationStatus: NrrCalculationStatus;
};

export type TournamentPointsTableResponse = {
  tournamentId: string;
  scope?: TournamentPointsScope;

  roundId?: string | null;
  groupId?: string | null;

  calculatedAt?: string;

  rows: TournamentPointsTableRow[];
  validationError?: string;
};

const standingRowSchema = z.object({
  teamId: z.string().min(1),
  teamNameSnapshot: z.string().min(1),
  matchesPlayed: z.number().finite(), wins: z.number().finite(),
  losses: z.number().finite(), ties: z.number().finite(), noResults: z.number().finite(),
  points: z.number().finite(), nrr: z.number().finite(),
  bonusPoints: z.number().finite().default(0), penaltyPoints: z.number().finite().default(0),
  nrrCalculationStatus: z.enum(["COMPLETE", "INCOMPLETE"]).default("COMPLETE"),
}).passthrough();

// Support the documented standings names and the existing frontend response names.
// Reject the entire ranking if a required row is invalid; never remove individual seeds.
export function normalizeTournamentPointsTable(response: unknown): TournamentPointsTableResponse {
  const raw = response && typeof response === "object" ? response as Record<string, unknown> : {};
  const rows: TournamentPointsTableRow[] = [];
  let invalid = !Array.isArray(raw.rows);
  if (Array.isArray(raw.rows)) for (const item of raw.rows) {
    if (!item || typeof item !== "object") { invalid = true; break; }
    const row = item as Record<string, unknown>;
    const parsed = standingRowSchema.safeParse({
      ...row,
      matchesPlayed: row.matchesPlayed ?? row.played,
      wins: row.wins ?? row.won, losses: row.losses ?? row.lost,
      ties: row.ties ?? row.tied, noResults: row.noResults ?? row.noResult,
      nrr: row.nrr ?? row.netRunRate,
    });
    if (!parsed.success || rows.some((existing) => existing.teamId === parsed.data.teamId)) { invalid = true; break; }
    rows.push(parsed.data as TournamentPointsTableRow);
  }
  return {
    ...raw,
    tournamentId: typeof raw.tournamentId === "string" ? raw.tournamentId : "",
    rows: invalid ? [] : rows,
    ...(invalid ? { validationError: "Standings are unavailable because the server returned incomplete data. Please try again." } : {}),
  } as TournamentPointsTableResponse;
}

export const tournamentPointsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTournamentPointsTable: builder.query<
      TournamentPointsTableResponse,
      {
        tournamentId: string;
      }
    >({
      query: ({ tournamentId }) => ({
        url: `/tournaments/${tournamentId}/points-table`,
        method: "GET",
      }),

      transformResponse: normalizeTournamentPointsTable,
      providesTags: (_result, _error, { tournamentId }) => [
        "Matches",
        {
          type: "TournamentPointsTable",
          id: `TOURNAMENT-${tournamentId}`,
        },
      ],
    }),

    getTournamentRoundPointsTable: builder.query<
      TournamentPointsTableResponse,
      {
        tournamentId: string;
        roundId: string;
      }
    >({
      query: ({ tournamentId, roundId }) => ({
        url: `/tournaments/${tournamentId}/rounds/${roundId}/points-table`,
        method: "GET",
      }),

      transformResponse: normalizeTournamentPointsTable,
      providesTags: (_result, _error, { roundId }) => [
        "Matches",
        {
          type: "TournamentPointsTable",
          id: `ROUND-${roundId}`,
        },
      ],
    }),

    getTournamentGroupPointsTable: builder.query<
      TournamentPointsTableResponse,
      {
        tournamentId: string;
        groupId: string;
      }
    >({
      query: ({ tournamentId, groupId }) => ({
        url: `/tournaments/${tournamentId}/groups/${groupId}/points-table`,
        method: "GET",
      }),

      transformResponse: normalizeTournamentPointsTable,
      providesTags: (_result, _error, { groupId }) => [
        "Matches",
        {
          type: "TournamentPointsTable",
          id: `GROUP-${groupId}`,
        },
      ],
    }),
  }),
});

export const {
  useGetTournamentPointsTableQuery,
  useGetTournamentRoundPointsTableQuery,
  useGetTournamentGroupPointsTableQuery,
} = tournamentPointsApi;
