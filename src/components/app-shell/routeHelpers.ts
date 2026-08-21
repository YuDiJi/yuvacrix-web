// src/components/app-shell/routeHelpers.ts

import { volleyballBottomNav, cricketBottomNav } from "./constant";
import { SPORT_TYPES, SportType } from "@/types/sport";

export function isBottomNavRoute(pathname: string, activeSport: SportType) {
  const bottomNav =
    activeSport === SPORT_TYPES.VOLLEYBALL
      ? volleyballBottomNav
      : cricketBottomNav;

  return bottomNav.some(
    (item) =>
      item.href &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
}
