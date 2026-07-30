import { cn } from "@/lib/cn";
import { ArrowLeft, Bell, Menu } from "lucide-react";
import LogoMark from "./LogoMark";
import { isBottomNavRoute } from "./routeHelpers";
import { useRouter, useSearchParams } from "next/navigation";
import { useHeader } from "@/providers/HeaderProvider";
import { useAppSelector } from "@/store/hooks";
import {
  selectCreatedMatchId,
  selectTeamA,
  selectTeamB,
} from "@/store/startMatch/selectors";
import { getRouteConfig } from "./config/getRouteConfig";

function Header({
  onMenuClick,
  pathname,
}: {
  onMenuClick: () => void;
  pathname: string;
}) {
  const router = useRouter();
  const showBottomNav = isBottomNavRoute(pathname);

  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);
  const matchId = useAppSelector(selectCreatedMatchId);

  const { header } = useHeader();
  const searchParams = useSearchParams();

  // type RoutePath = keyof typeof routeConfig;

  // let config =
  //   pathname in routeConfig ? routeConfig[pathname as RoutePath] : undefined;

  let config = getRouteConfig(pathname);

  if (!config && /^\/matches\/[^/]+\/scorecard$/.test(pathname)) {
    config = {
      title: "League Matches",
      showBackButton: true,
    };
  }

  const pageTitle =
    config?.getTitle?.({ searchParams, teamA, teamB }) ??
    config?.title ??
    header.title ??
    "";

  const isHome = pathname === "/home";
  const rootRoutes = ["/home", "/my-cricket"];

  const showBackButton = config?.showBackButton ?? false;
  // const showNotifications = header.showNotifications;

  const handleBack = () => {
    const backConfig = config?.back;

    if (!backConfig || backConfig.type === "history") {
      router.back();
      return;
    }

    if (backConfig.type === "disabled") {
      return;
    }

    if (backConfig.type === "route") {
      if (backConfig.replace) {
        router.replace(backConfig.href);
      } else {
        router.push(backConfig.href);
      }
    }
  };

  return (
    <header className="safe-top relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-(--color-navy) px-4">
      {/* Hamburger */}
      {showBackButton ? (
        <button
          onClick={() => handleBack()}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-all active:scale-90"
          aria-label="Go back"
        >
          <ArrowLeft size={19} />
        </button>
      ) : (
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-all active:scale-90 hover:bg-white/15"
          aria-label="Open menu"
        >
          <Menu size={19} />
        </button>
      )}
      {/* Logo — absolutely centred */}
      {isHome ? (
        <div className="absolute left-1/3 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5">
          <LogoMark />
        </div>
      ) : (
        <h1 className="absolute left-1/6 top-1/3 text-base font-semibold text-white truncate max-w-50">
          {pageTitle}
        </h1>
      )}

      {/* Right actions */}
      {showBottomNav && (
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-all active:scale-90 hover:bg-white/15"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-(--color-live) shadow-[0_0_4px_var(--color-live)]" />
          </button>
          <button
            className={cn(
              "flex items-center gap-1 rounded-xl px-2.5 py-1.5",
              "bg-(--color-live) text-white",
              "shadow-[0_2px_8px_rgba(255,59,48,0.40)]",
              "font-(family-name:--font-display) text-[11px] font-bold uppercase tracking-widest",
              "transition-all active:scale-90",
            )}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
