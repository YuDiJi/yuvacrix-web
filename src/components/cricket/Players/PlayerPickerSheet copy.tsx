import { cn } from "@/lib/cn";
import { BattingStyle, BowlingStyle } from "@/types/player";
import { Check, ChevronRight, Search, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../common/Button";
import { S3Image } from "../../common/S3Image";

interface InningsPlayer {
  playerId: string;
  fullName: string;
  profileImageUrl?: string | null;
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
  battingOrder?: number;
  battingStyle?: BattingStyle | null;
  bowlingStyle?: BowlingStyle | null;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function roleTag(p: InningsPlayer): string {
  const t: string[] = [];
  if (p.isCaptain) t.push("C");
  if (p.isWicketKeeper) t.push("WK");
  return t.join(" · ");
}

function PlayerAvatar({ player, size = 48 }: { player: any; size?: number }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full border-2 border-(--color-bg-border)"
      style={{ width: size, height: size }}
    >
      {player?.profileImageUrl ? (
        <S3Image
          imageKey={player.profileImageUrl}
          alt={player.playerNameSnapshot}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          fallback={
            <div className="flex h-full w-full items-center justify-center rounded-full bg-(--color-navy)">
              {player.playerNameSnapshot.charAt(0)}
            </div>
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
          {player ? (
            <span
              className="font-(family-name:--font-display) font-black text-white"
              style={{ fontSize: size * 0.33 }}
            >
              {initials(player.playerNameSnapshot)}
            </span>
          ) : (
            <Users size={size * 0.4} className="text-white/40" />
          )}
        </div>
      )}
    </div>
  );
}

export function PlayerPickerSheet({
  open,
  players,
  disabledIds,

  onClose,
  title,
  subTitle,
}: {
  open: boolean;
  //   role: PickerRole | null;
  players: any;
  disabledIds: string[];
  onClose: () => void;
  title: string;
  subTitle: string;
}) {
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? players.filter((p: any) => p.fullName.toLowerCase().includes(q))
      : players;
  }, [players, query]);

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 z-40 transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        style={{
          background: "rgba(13,27,62,0.55)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-50 flex flex-col",
          "rounded-t-3xl bg-(--color-bg-card) shadow-[0_-8px_40px_rgba(13,27,62,0.18)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-y-0" : "translate-y-full",
        )}
        style={{ maxHeight: "72%" }}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="h-1 w-10 rounded-full bg-(--color-bg-border)" />
        </div>
        <div className="shrink-0 flex items-center justify-between border-b border-(--color-bg-border) px-5 pb-3">
          <div>
            <h3
              className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-text-primary)"
              style={{ letterSpacing: "0.04em" }}
            >
              {title}
            </h3>
            <p className="text-meta mt-0.5">{subTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary) active:scale-90 transition-all"
          >
            <X size={16} />
          </button>
        </div>
        <div className="shrink-0 px-4 pt-3 pb-2">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-(--color-bg-border) bg-(--color-bg-base) px-4 py-2.5 focus-within:border-(--color-sky) focus-within:shadow-[0_0_0_3px_rgba(75,139,255,0.10)] transition-all">
            <Search size={16} className="shrink-0 text-(--color-text-muted)" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search players..."
              className="flex-1 bg-transparent text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {filtered?.length === 0 ? (
            <p className="py-8 text-center text-sm italic text-(--color-text-muted)">
              No players found
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered?.map((player: any) => {
                const isDisabled = disabledIds.includes(player.playerId);
                const tag = roleTag(player);
                return (
                  <button
                    key={player.playerId}
                    // onClick={() => !isDisabled && onPick(player)}
                    disabled={isDisabled}
                    className={cn(
                      "flex items-center gap-3.5 rounded-2xl border-2 px-4 py-3 text-left transition-all active:scale-[0.98]",
                      isDisabled
                        ? "cursor-not-allowed border-(--color-bg-border) bg-(--color-bg-base) opacity-40"
                        : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint)",
                    )}
                  >
                    <PlayerAvatar player={player} size={44} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-(--color-text-primary) truncate">
                        {player.playerNameSnapshot}
                      </p>
                      {tag && (
                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-(--color-brand)">
                          {tag}
                        </p>
                      )}
                      {player.battingOrder !== undefined && (
                        <p className="text-meta mt-0.5">
                          Batting #{player.battingOrder}
                        </p>
                      )}
                    </div>
                    {isDisabled ? (
                      <span className="flex items-center gap-1 rounded-full bg-(--color-bg-tint) px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-(--color-brand)">
                        <Check size={10} strokeWidth={3} /> Selected
                      </span>
                    ) : (
                      <ChevronRight
                        size={16}
                        className="shrink-0 text-(--color-text-muted)"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Button>Continue Scoring</Button>
      </div>
    </>
  );
}
