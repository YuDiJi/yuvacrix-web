// components/app-shell/AppShell.tsx

"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

import Header from "./Header";
import BottomNav from "./BottomNav";
import SideDrawer from "./SideDrawer";
import { cn } from "@/lib/cn";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-dvh items-start justify-center bg-(--color-bg-base) md:bg-[#c9d1df]">
      <div
        className={cn(
          "relative flex h-dvh w-full flex-col overflow-hidden bg-(--color-bg-base)",
          "md:max-w-[430px] md:shadow-[0_0_80px_rgba(13,27,62,0.28)]",
        )}
      >
        <Header onMenuClick={() => setDrawerOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[calc(3.75rem+env(safe-area-inset-bottom,12px))]">
          {children}
        </main>

        <BottomNav
          pathname={pathname}
          drawerOpen={drawerOpen}
          onMoreClick={() => setDrawerOpen((v) => !v)}
        />

        <SideDrawer
          pathname={pathname}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </div>
  );
}
