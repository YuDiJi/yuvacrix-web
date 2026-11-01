import type { TournamentFormat, TournamentFormatConfig, TournamentPlayoffStructure } from "@/store/api/cricket/tournamentApi";
import type { GenerateKnockoutFixturesBody, GenerateTournamentBracketRulesDto } from "@/store/api/cricket/tournamentFixtureApi";

export const PLAYOFF_OPTIONS: { config: TournamentFormatConfig; label: string; description: string }[] = [
  { config: { qualifyingTeamCount: 2, playoffStructure: "TOP_2_FINAL" }, label: "Top 2 — Direct Final", description: "The top two teams play one final." },
  { config: { qualifyingTeamCount: 3, playoffStructure: "TOP_3_FIRST_TO_FINAL" }, label: "Top 3 — Qualifier & Final (Recommended)", description: "Rank 2 plays Rank 3 in the semifinal. Rank 1 advances directly to the final." },
  { config: { qualifyingTeamCount: 4, playoffStructure: "SEMIFINAL_FINAL" }, label: "Top 4 — Semifinals & Final", description: "Rank 1 plays Rank 4 and Rank 2 plays Rank 3 in the semifinals." },
];

export function playoffConfig(structure?: TournamentPlayoffStructure | ""): TournamentFormatConfig | undefined {
  return PLAYOFF_OPTIONS.find((option) => option.config.playoffStructure === structure)?.config;
}

export function validPlayoffConfig(config?: TournamentFormatConfig | null): config is TournamentFormatConfig {
  return !!config && playoffConfig(config.playoffStructure)?.qualifyingTeamCount === config.qualifyingTeamCount;
}

export function tournamentFormatFields(canEdit: boolean, format: TournamentFormat, structure: TournamentPlayoffStructure | "") {
  if (!canEdit) return {};
  return { format, ...(format === "GROUP_STAGE_PLUS_KNOCKOUT" ? { formatConfig: playoffConfig(structure) } : {}) };
}

export function playoffGenerationBody(override: boolean, fields: Record<string, string>): GenerateKnockoutFixturesBody {
  if (!override) return {};
  const rules: GenerateTournamentBracketRulesDto = {};
  for (const key of ["oversLimit", "oversPerBowler"] as const) {
    if (fields[key]?.trim()) {
      const value = Number(fields[key]);
      // Match the existing auto-fixture form's validation. Backend limits still require verification.
      const max = key === "oversLimit" ? 200 : 50;
      if (!Number.isSafeInteger(value) || value < 1 || value > max) throw new Error(`Enter a whole number from 1 to ${max} for ${key === "oversLimit" ? "overs" : "overs per bowler"}.`);
      rules[key] = value;
    }
  }
  if (rules.oversLimit && rules.oversPerBowler && rules.oversPerBowler > rules.oversLimit) throw new Error("Overs per bowler cannot exceed total overs.");
  const city = fields.city?.trim();
  const groundName = fields.groundName?.trim();
  const pitchType = fields.pitchType?.trim();
  if (pitchType && !["ROUGH", "CEMENT", "TURF", "ASTROTURF", "MATTING"].includes(pitchType)) throw new Error("Select a valid pitch type.");
  if (city || groundName || pitchType) rules.venue = {
    ...(city ? { city } : {}), ...(groundName ? { groundName } : {}),
    ...(pitchType ? { pitchType: pitchType as NonNullable<GenerateTournamentBracketRulesDto["venue"]>["pitchType"] } : {}),
  };
  return Object.keys(rules).length ? { rulesOverrides: rules } : {};
}

export function qualificationLabel(config: TournamentFormatConfig, index: number) {
  if (index >= config.qualifyingTeamCount) return null;
  if (config.playoffStructure === "TOP_2_FINAL") return "Final";
  if (config.playoffStructure === "TOP_3_FIRST_TO_FINAL" && index === 0) return "Final (Direct Bye)";
  return "Semifinal";
}

export function playoffPreview(config: TournamentFormatConfig, names: string[]): string[] {
  if (names.length < config.qualifyingTeamCount) return [];
  if (config.playoffStructure === "TOP_2_FINAL") return [`Final: ${names[0]} vs ${names[1]}`];
  if (config.playoffStructure === "TOP_3_FIRST_TO_FINAL") return [
    `Semifinal: ${names[1]} vs ${names[2]}`,
    `Final: ${names[0]} (Direct Bye) vs Winner of Semifinal`,
  ];
  return [`Semifinal 1: ${names[0]} vs ${names[3]}`, `Semifinal 2: ${names[1]} vs ${names[2]}`, "Final: Winners of Semifinals"];
}

export function tournamentPlayoffError(error: unknown, fallback = "Unable to generate playoffs. Please try again.") {
  if (!error || typeof error !== "object") return fallback;
  if ("status" in error && error.status === 403) return "You do not have permission to generate playoffs.";
  const data = "data" in error && error.data && typeof error.data === "object" ? error.data : {};
  const message = "message" in data ? data.message : undefined;
  const code = "code" in data && typeof data.code === "string" ? data.code : message;
  const messages: Record<string, string> = {
    QUALIFYING_STAGE_NOT_COMPLETED: "Complete or cancel pending qualifying-stage fixtures before generating playoffs. At least one qualifying match must be completed.",
    NOT_ENOUGH_QUALIFIED_TEAMS: "There are not enough teams in the points table for this playoff structure.",
    KNOCKOUT_BRACKET_UNSUPPORTED_FOR_FORMAT: "This tournament format does not support playoff generation.",
    ONE_OR_MORE_SEEDS_NOT_ACTIVE_IN_TOURNAMENT: "One or more qualifying teams are no longer active. Review the tournament teams and standings.",
    SEEDED_TEAM_IDS_NOT_ALLOWED: "Playoff teams must be selected by the server from the points table. Refresh and try again.",
    FORMAT_CONFIG_REQUIRED: "Select a playoff structure for League + Playoffs.",
    FORMAT_CONFIG_INCONSISTENT: "Select a valid playoff structure and try again.",
    TOURNAMENT_FORMAT_LOCKED_BY_FIXTURES: "Tournament format and playoff structure are locked because fixtures have already been created. Refresh before editing metadata.",
  };
  if (typeof code === "string" && messages[code]) return messages[code];
  return typeof message === "string" ? message : Array.isArray(message) ? message.join(" ") : fallback;
}

export function hasLinkedMatch(fixture: { matchId?: string | null; teamAId?: string | null; teamBId?: string | null }) {
  return !!(fixture.matchId?.trim() && fixture.teamAId && fixture.teamBId);
}
