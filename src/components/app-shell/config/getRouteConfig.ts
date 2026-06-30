// src/config/getRouteConfig.ts

// currently not using this file

import { routeConfig } from "./routeConfig";

export function getRouteConfig(pathname: string) {
  // Exact routes
  if (pathname in routeConfig) {
    return routeConfig[pathname as keyof typeof routeConfig];
  }

  // Dynamic routes
  if (/^\/matches\/[^/]+\/scorecard$/.test(pathname)) {
    return {
      title: "League Matches",
      showBackButton: true,
    };
  }

  if (/^\/scoring\/[^/]+$/.test(pathname)) {
    return {
      title: "Scoring",
      showBackButton: true,
    };
  }

  return undefined;
}
