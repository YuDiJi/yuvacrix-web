import type { VolleyballMyMatchSource } from "./match";
import type { VolleyballViewerRelation } from "./myVolleyball";
import type {
  VolleyballTournamentFormat,
  VolleyballTournamentStage,
  VolleyballTournamentStatus,
} from "./tournament";

export type VolleyballHomeTrendDirection = "UP" | "DOWN" | "SAME";

export interface VolleyballHomeViewer {
  playerId: string;
  fullName: string;
  profileImageUrl: string | null;
}

export interface VolleyballHomeTrend {
  direction: VolleyballHomeTrendDirection;
  percent: number | null;
}

export interface VolleyballHomeSeasonMetric {
  value: number | null;
  trend: VolleyballHomeTrend | null;
  supported: boolean;
}

export interface VolleyballHomeSeasonSummary {
  seasonLabel: string;
  seasonSource: "CALENDAR_YEAR";
  kills: VolleyballHomeSeasonMetric;
  aces: VolleyballHomeSeasonMetric;
  blocks: VolleyballHomeSeasonMetric;
  digs: VolleyballHomeSeasonMetric;
}

export interface VolleyballHomeAwardSummary {
  total: number;
}

export interface VolleyballHomeAward {
  id: string;
  type: string;
  title: string;
  subtitle: string | null;
  awardedAt: string;
  sourceType: string;
  sourceId: string;
  iconKey: string;
}

export interface VolleyballHomeRecentMatchTeam {
  teamId: string;
  name: string;
  shortName: string | null;
  teamColor: string | null;
}

export interface VolleyballHomeRecentMatchSet {
  setNumber: number;
  teamAPoints: number;
  teamBPoints: number;
}

export interface VolleyballHomeRecentMatch {
  matchId: string;
  sourceType: Exclude<VolleyballMyMatchSource, "ALL">;
  playedAt: string;
  venue: {
    name: string;
    city: string | null;
  } | null;
  teamA: VolleyballHomeRecentMatchTeam;
  teamB: VolleyballHomeRecentMatchTeam;
  sets: VolleyballHomeRecentMatchSet[];
  teamASetsWon: number;
  teamBSetsWon: number;
  result: "WON" | "LOST" | "DRAW";
  tournament: {
    id: string;
    name: string;
  } | null;
}

export interface VolleyballHomeTournament {
  id: string;
  name: string;
  format: VolleyballTournamentFormat;
  status: VolleyballTournamentStatus;
  teamCount: number;
  currentStage: VolleyballTournamentStage | null;
  viewerRelation: VolleyballViewerRelation;
  startDate: string | null;
  endDate: string | null;
}

export interface VolleyballHomeResponse {
  generatedAt: string;
  viewer: VolleyballHomeViewer | null;
  seasonSummary: VolleyballHomeSeasonSummary;
  awardSummary: VolleyballHomeAwardSummary;
  awards: VolleyballHomeAward[];
  recentMatches: VolleyballHomeRecentMatch[];
  tournaments: VolleyballHomeTournament[];
}
