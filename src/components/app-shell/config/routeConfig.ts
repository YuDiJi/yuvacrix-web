//

import { Team } from "@/types/team";

export type RouteConfig = {
  showBackButton: boolean;
  title?: string;
  getTitle?: (ctx: {
    searchParams: URLSearchParams;
    teamA?: Team | null;
    teamB?: Team | null;
  }) => string;
};

export const routeConfig: Record<string, RouteConfig> = {
  "/home": {
    title: "Home",
    showBackButton: false,
  },

  "/my-cricket": {
    title: "My Cricket",
    showBackButton: false,
  },

  "/contact-us": {
    title: "Contact Us",
    showBackButton: false,
  },

  "/terms-of-service": {
    title: "Terms of service",
    showBackButton: false,
  },

  "/about-us": {
    title: "About Us",
    showBackButton: false,
  },

  "/privacy-policy": {
    title: "About Us",
    showBackButton: true,
  },

  "/start-match": {
    showBackButton: true,
    getTitle: ({ teamA, teamB }) =>
      teamA && teamB ? "START A MATCH" : "TEAM SELECTION",
  },

  "/start-match/select-team": {
    showBackButton: true,
    getTitle: ({ searchParams }) =>
      `SELECT TEAM ${searchParams.get("team") ?? ""}`,
  },

  "/start-match/select-players": {
    title: "TEAM SETUP",
    showBackButton: true,
  },

  "/start-match/create-player": {
    showBackButton: true,
    getTitle: ({ searchParams }) =>
      `ADD PLAYER TO ${(searchParams.get("team") ?? "").toUpperCase()}`,
  },

  "/start-match/create-team": {
    showBackButton: true,
    getTitle: ({ searchParams }) =>
      `CREATE TEAM ${searchParams.get("team") ?? ""}`,
  },

  "/start-match/line-up": {
    title: "SELECT TEAM LINE-UP",
    showBackButton: true,
  },
  "/start-match/toss": {
    title: "TOSS",
    showBackButton: true,
  },

  "/scoring": {
    title: "Scoring",
    showBackButton: true,
    // getTitle: ({ teamA, teamB }) =>
    //   teamA ? teamA.name : teamB ? teamB.name : "Scoring",
  },

  "/profile": {
    title: "Profile",
    showBackButton: false,
  },

  "/cricket-profile": {
    title: "My Cricket Profile",
    showBackButton: false,
  },

  "/matches/[matchId]/scorecard": {
    title: "League Matches",
    showBackButton: false,
  },

  "/add-tournaments-series": {
    title: "Add Tournament / Series",
    showBackButton: false,
  },

  "/add-tournaments-series/create-tournament": {
    title: "Add a Tournament",
    showBackButton: true,
  },

  // Tournament routes
  "/tournaments/[tournamentId]": {
    title: "Tournament",
    showBackButton: true,
  },

  "/tournaments/[tournamentId]/edit": {
    title: "Edit Tournament",
    showBackButton: true,
  },

  "/tournaments/[tournamentId]/add-teams": {
    title: "Add Teams",
    showBackButton: true,
  },

  "/tournaments/[tournamentId]/players": {
    title: "Players",
    showBackButton: true,
  },

  "/tournaments/[tournamentId]/create-team": {
    title: "Create Team",
    showBackButton: true,
  },

  "/tournaments/[tournamentId]/create-player": {
    title: "Add Players",
    showBackButton: true,
  },

  "/tournaments/[tournamentId]/start-match": {
    title: "Select Round",
    showBackButton: true,
  },

  "/tournaments/[tournamentId]/start-match/round": {
    title: "Add Rounds",
    showBackButton: true,
  },

  "/tournaments/[tournamentId]/start-match/playing-teams": {
    title: "Playing Teams",
    showBackButton: true,
  },

  "/tournaments/[tournamentId]/start-match/select-team": {
    title: "Select Teams",
    showBackButton: true,
  },
} as const;
