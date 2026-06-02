import { cn } from "@/lib/cn";
import { Bell, Menu } from "lucide-react";
import LogoMark from "./LogoMark";

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="safe-top relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-(--color-navy) px-4">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-all active:scale-90 hover:bg-white/15"
        aria-label="Open menu"
      >
        <Menu size={19} />
      </button>

      {/* Logo — absolutely centred */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5">
        <LogoMark />
      </div>

      {/* Right actions */}
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
    </header>
  );
}

export default Header;
