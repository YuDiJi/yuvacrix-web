//

import { Team } from "@/types/team";

type RouteConfig = {
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

  "/matches/[matchId]/scorecard": {
    title: "League Matches",
    showBackButton: true,
  },
} as const;
