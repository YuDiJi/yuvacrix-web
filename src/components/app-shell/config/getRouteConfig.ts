import { routeConfig, type RouteConfig } from "./routeConfig";

function routePatternToRegex(routePattern: string): RegExp {
  const escapedPattern = routePattern
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\\\[\.{3}[^/]+\\\]/g, ".+")
    .replace(/\\\[[^/]+\\\]/g, "[^/]+");

  return new RegExp(`^${escapedPattern}$`);
}

// function routePatternToRegex(routePattern: string): RegExp {
//   const pattern = routePattern.replace(/\[[^\]]+\]/g, "[^/]+");

//   return new RegExp(`^${pattern}$`);
// }

export function getRouteConfig(pathname: string): RouteConfig | undefined {
  // Exact route first
  const exactConfig = routeConfig[pathname];

  if (exactConfig) {
    return exactConfig;
  }

  // Dynamic route match
  const matchedEntry = Object.entries(routeConfig).find(([pattern]) =>
    routePatternToRegex(pattern).test(pathname),
  );

  return matchedEntry?.[1];
}
