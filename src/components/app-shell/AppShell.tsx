"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Header from "./Header";
import BottomNav from "./BottomNav";
import SideDrawer from "./SideDrawer";
import { cn } from "@/lib/cn";
import { cricketBottomNav, volleyballBottomNav } from "./constant";
import { useGetPlayerQuery } from "@/store/api/playerApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveSport } from "@/store/sport/sportSlice";
import { selectActiveSport } from "@/store/sport/selectors";
import { SPORT_TYPES } from "@/types/sport";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data: playerData,
    isLoading: isPlayerLoading,
    isSuccess: isPlayerSuccess,
  } = useGetPlayerQuery();

  const activeSport = useAppSelector(selectActiveSport);

  const bottomNav =
    activeSport === SPORT_TYPES.VOLLEYBALL
      ? volleyballBottomNav
      : cricketBottomNav;

  const showBottomNav = bottomNav.some(
    (item) =>
      item.href &&
      // (pathname === item.href || pathname.startsWith(`${item.href}/`)),
      pathname === item.href,
  );

  useEffect(() => {
    if (!isPlayerSuccess) return;

    const backendActiveSport = playerData?.player?.activeSport;

    if (!backendActiveSport) return;

    if (backendActiveSport !== activeSport) {
      dispatch(setActiveSport(backendActiveSport));
    }
  }, [isPlayerSuccess, playerData?.player?.activeSport, activeSport, dispatch]);

  if (isPlayerLoading || !activeSport) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-(--color-bg-base)">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--color-bg-border) border-t-(--color-brand)" />
      </div>
    );
  }

  return (
    <div
      data-sport={activeSport}
      className="flex min-h-dvh items-start justify-center bg-(--color-bg-base) md:bg-[#c9d1df]"
    >
      <div
        data-sport={activeSport}
        className={cn(
          "relative flex h-dvh w-full flex-col overflow-hidden bg-(--color-bg-base)",
          "md:max-w-107.5 md:shadow-[0_0_80px_rgba(13,27,62,0.28)]",
        )}
      >
        <Header pathname={pathname} onMenuClick={() => setDrawerOpen(true)} />

        <main
          className={`flex flex-1 flex-col overflow-y-auto scrollbar-hide overflow-x-hidden ${showBottomNav && "pb-[calc(3.75rem+env(safe-area-inset-bottom,12px))]"}`}
        >
          {children}
        </main>

        {showBottomNav && (
          <BottomNav
            pathname={pathname}
            drawerOpen={drawerOpen}
            onMoreClick={() => setDrawerOpen((v) => !v)}
          />
        )}

        <SideDrawer
          pathname={pathname}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </div>
  );
}
