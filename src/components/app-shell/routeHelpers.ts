// routeHelpers.ts

import { drawerSections, bottomNav } from "./constant";

export function isBottomNavRoute(pathname: string) {
  return bottomNav.some(
    (item) =>
      item.href &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
}
