import { cn } from "@/lib/cn";
import Link from "next/link";
import { bottomNav } from "./constant";

export default function BottomNav({
  pathname,
  onMoreClick,
  drawerOpen,
}: {
  pathname: string;
  onMoreClick: () => void;
  drawerOpen: boolean;
}) {
  return (
    <nav className="safe-bottom absolute bottom-0 left-0 right-0 z-30 border-t border-(--color-bg-border) bg-white/97 backdrop-blur-2xl">
      <div className="grid grid-cols-3">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const isMore = item.href === null;
          const active = isMore
            ? drawerOpen
            : pathname.startsWith(item.href as string);

          const content = (
            <>
              {/* Active pill */}
              <span
                className={cn(
                  "absolute top-2 flex h-12 w-16 items-center justify-center rounded-2xl transition-all duration-300",
                  active
                    ? "bg-(--color-brand) shadow-[0_4px_14px_rgba(27,63,160,0.30)]"
                    : "bg-transparent",
                )}
              />
              {/* Live dot on Matches */}
              {"hasLive" in item && item.hasLive && !active && (
                <span className="absolute right-[calc(50%-14px)] top-2 h-1.5 w-1.5 rounded-full bg-(--color-live) shadow-[0_0_5px_var(--color-live)]" />
              )}
              <Icon
                size={20}
                className={cn(
                  "relative z-10 transition-all duration-200",
                  active ? "text-white" : "text-(--color-text-muted)",
                )}
              />
              <span
                className={cn(
                  "relative z-10 text-[10px] font-semibold transition-colors duration-200",
                  active
                    ? "text-(--color-text-inverse)"
                    : "text-(--color-text-muted)",
                )}
              >
                {item.label}
              </span>
            </>
          );

          if (isMore) {
            return (
              <button
                key={item.label}
                onClick={onMoreClick}
                className="relative flex flex-col items-center justify-center gap-1 py-3 transition-all active:scale-90"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href as string}
              className="relative flex flex-col items-center justify-center gap-1 py-3 transition-all active:scale-90"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
