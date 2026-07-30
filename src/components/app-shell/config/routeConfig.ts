//

import { Team } from "@/types/team";

export type HeaderBackConfig =
  | {
      type: "history";
    }
  | {
      type: "route";
      href: string;
      replace?: boolean;
    }
  | {
      type: "disabled";
    };

export type RouteConfig = {
  showBackButton: boolean;
  title?: string;
  back?: HeaderBackConfig;
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
    back: {
      type: "route",
      href: "/home",
    },
    getTitle: ({ teamA, teamB }) =>
      teamA && teamB ? "START A MATCH" : "TEAM SELECTION",
  },

  "/start-match/select-team": {
    showBackButton: true,
    back: {
      type: "history",
    },
    getTitle: ({ searchParams }) =>
      `SELECT TEAM ${searchParams.get("team") ?? ""}`,
  },

  "/start-match/select-players": {
    title: "TEAM SETUP",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  "/start-match/create-player": {
    showBackButton: true,
    back: {
      type: "history",
    },
    getTitle: ({ searchParams }) =>
      `ADD PLAYER TO ${(searchParams.get("team") ?? "").toUpperCase()}`,
  },

  "/start-match/create-team": {
    showBackButton: true,
    back: {
      type: "history",
    },
    getTitle: ({ searchParams }) =>
      `CREATE TEAM ${searchParams.get("team") ?? ""}`,
  },

  "/start-match/line-up": {
    title: "SELECT TEAM LINE-UP",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  "/start-match/start-innings": {
    title: "Innings",
    showBackButton: true,
    back: {
      type: "route",
      href: "/home",
    },
  },

  "/start-match/toss": {
    title: "TOSS",
    showBackButton: true,
    back: {
      type: "route",
      href: "/home",
    },
  },

  "/scoring": {
    title: "Scoring",
    showBackButton: true,
    back: {
      type: "route",
      href: "/my-cricket",
      replace: true,
    },
  },

  "/profile": {
    title: "Profile",
    showBackButton: false,
  },

  "/cricket-profile": {
    title: "My Cricket Profile",
    showBackButton: false,
  },

  // "/matches/[matchId]/scorecard": {
  //   title: "League Matches",
  //   showBackButton: false,
  // },

  "/matches/[matchId]/scorecard": {
    title: "League Matches",
    showBackButton: true,
    back: {
      type: "route",
      href: "/my-cricket",
      replace: true,
    },
  },

  "/add-tournaments-series": {
    title: "Add Tournament / Series",
    showBackButton: false,
  },

  "/add-tournaments-series/create-tournament": {
    title: "Add a Tournament",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  // Tournament routes
  "/tournaments/[tournamentId]": {
    title: "Tournament",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  "/tournaments/[tournamentId]/edit": {
    title: "Edit Tournament",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  "/tournaments/[tournamentId]/add-teams": {
    title: "Add Teams",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  "/tournaments/[tournamentId]/players": {
    title: "Players",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  "/tournaments/[tournamentId]/create-team": {
    title: "Create Team",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  "/tournaments/[tournamentId]/create-player": {
    title: "Add Players",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  "/tournaments/[tournamentId]/start-match": {
    title: "Select Round",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  "/tournaments/[tournamentId]/start-match/round": {
    title: "Add Rounds",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  "/tournaments/[tournamentId]/start-match/playing-teams": {
    title: "Playing Teams",
    showBackButton: true,
    back: {
      type: "history",
    },
  },

  "/tournaments/[tournamentId]/start-match/select-team": {
    title: "Select Teams",
    showBackButton: true,
    back: {
      type: "history",
    },
  },
} as const;
