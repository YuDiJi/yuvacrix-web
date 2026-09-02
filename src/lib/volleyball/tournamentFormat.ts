import {
  VOLLEYBALL_PLAYOFF_STRUCTURES,
  VOLLEYBALL_TOURNAMENT_FORMATS,
  VOLLEYBALL_TOURNAMENT_STAGES,
  type VolleyballLeaguePlayoffFormatConfig,
  type VolleyballTournamentFormat,
  type VolleyballTournamentStage,
} from "@/types/volleyball/tournament";

export function formatVolleyballTournamentFormat(
  format: VolleyballTournamentFormat,
) {
  switch (format) {
    case VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE:
      return "League";
    case VOLLEYBALL_TOURNAMENT_FORMATS.KNOCKOUT:
      return "Knockout";
    case VOLLEYBALL_TOURNAMENT_FORMATS.GROUP_KNOCKOUT:
      return "Groups + Knockout";
    case VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE_PLAYOFF:
      return "League + Playoffs";
    case VOLLEYBALL_TOURNAMENT_FORMATS.CUSTOM:
      return "Custom";
  }
}

export function formatVolleyballTournamentStage(
  stage: VolleyballTournamentStage,
) {
  switch (stage) {
    case VOLLEYBALL_TOURNAMENT_STAGES.LEAGUE:
      return "League Stage";
    case VOLLEYBALL_TOURNAMENT_STAGES.GROUP_STAGE:
      return "Group Stage";
    case VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16:
      return "Round of 16";
    case VOLLEYBALL_TOURNAMENT_STAGES.QUARTER_FINAL:
      return "Quarterfinals";
    case VOLLEYBALL_TOURNAMENT_STAGES.SEMI_FINAL:
      return "Semifinals";
    case VOLLEYBALL_TOURNAMENT_STAGES.THIRD_PLACE:
      return "Third Place";
    case VOLLEYBALL_TOURNAMENT_STAGES.FINAL:
      return "Final";
  }
}

export function formatLeaguePlayoffConfig(
  config: VolleyballLeaguePlayoffFormatConfig,
) {
  return config.playoffStructure === VOLLEYBALL_PLAYOFF_STRUCTURES.TOP_2_FINAL
    ? "Single round robin · Top 2 → Final"
    : "Single round robin · Top 4 → Semifinals → Final";
}
