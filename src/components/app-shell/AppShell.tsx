// components/app-shell/AppShell.tsx

"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

import Header from "./Header";
import BottomNav from "./BottomNav";
import SideDrawer from "./SideDrawer";
import { cn } from "@/lib/cn";
import { bottomNav } from "./constant";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // const showBottomNav = bottomNav.some(
  //   (route) => pathname === route || pathname.startsWith(`${route}/`),
  // );

  const showBottomNav = bottomNav.some(
    (item) =>
      item.href &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );

  return (
    <div className="flex min-h-dvh items-start justify-center bg-(--color-bg-base) md:bg-[#c9d1df]">
      <div
        className={cn(
          "relative flex h-dvh w-full flex-col overflow-hidden bg-(--color-bg-base)",
          "md:max-w-[430px] md:shadow-[0_0_80px_rgba(13,27,62,0.28)]",
        )}
      >
        <Header pathname={pathname} onMenuClick={() => setDrawerOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[calc(3.75rem+env(safe-area-inset-bottom,12px))]">
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
