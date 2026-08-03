import {
  TournamentFixtureOfficials,
  TournamentFixtureRules,
  TournamentFixtureVenue,
} from "@/store/api/tournamentFixtureApi";

export type FixtureGenerationScope = "ALL" | "GROUP" | "SELECTED";

export type AutoGenerateFixturesFormValues = {
  scope: FixtureGenerationScope;

  roundId: string;
  groupId: string;
  teamIds: string[];

  repeatCount: number;
  firstMatchDate: string;
  firstMatchTime: string;
  timezone: string;

  intervalMinutes: number;
  dailyMatchesPerGround: number;

  venue: TournamentFixtureVenue;
  rules: TournamentFixtureRules;
  officials: TournamentFixtureOfficials;
};
