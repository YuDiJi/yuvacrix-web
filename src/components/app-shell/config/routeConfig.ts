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
  "/dashboard": {
    title: "Dashboard",
    showBackButton: false,
  },

  "/my-cricket": {
    title: "My Cricket",
    showBackButton: false,
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
} as const;
