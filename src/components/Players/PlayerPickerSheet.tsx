import { cn } from "@/lib/cn";
import { Check, ChevronRight, Search, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../common/Button";
import { MatchDetailsPlayer } from "@/types/match";
import { S3Image } from "../common/S3Image";

type PlayerPickerSheetProps = {
  open: boolean;
  players: MatchDetailsPlayer[] | undefined;
  disabledIds?: string[];

  title: string;
  subTitle?: string;

  selectedPlayerId?: string;

  onSelect: (player: MatchDetailsPlayer) => void;

  footer?: React.ReactNode;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function roleTag(p: MatchDetailsPlayer): string {
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
  disabledIds = [],
  selectedPlayerId,
  onSelect,
  footer,
  title,
  subTitle,
}: PlayerPickerSheetProps) {
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? players?.filter((p: any) =>
          p.playerNameSnapshot.toLowerCase().includes(q),
        )
      : players;
  }, [players, query]);

  return (
    <div className="flex flex-col min-h-0 h-full">
      {/* Title */}
      <div className="shrink-0 flex items-center justify-between border-b border-(--color-bg-border) pb-2">
        <div>
          <h3
            className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-text-primary)"
            style={{ letterSpacing: "0.04em" }}
          >
            {title}
          </h3>
          <p className="text-meta mt-0.5">{subTitle}</p>
        </div>
        {/* <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary) active:scale-90 transition-all">
          <X size={16} />
        </button> */}
      </div>
      {/* Search */}
      <div className="shrink-0  pt-3 pb-2">
        <div className="flex items-center gap-3 rounded-2xl border-2 border-(--color-bg-border) bg-(--color-bg-base) px-4 py-2 focus-within:border-(--color-sky) focus-within:shadow-[0_0_0_3px_rgba(75,139,255,0.10)] transition-all">
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
      {/* List */}
      <div className="flex-1 overflow-y-auto pb-2  [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        {filtered?.length === 0 ? (
          <p className="py-8 text-center text-sm italic text-(--color-text-muted)">
            No players found
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered?.map((player: any) => {
              const isDisabled = disabledIds.includes(player.playerId);
              const isSelected = selectedPlayerId === player.playerId;
              const tag = roleTag(player);

              return (
                <button
                  key={player.playerId}
                  onClick={() => !isDisabled && onSelect(player)}
                  disabled={isDisabled}
                  // className={cn(
                  //   "flex items-center gap-3.5 rounded-2xl border-2 px-4 py-3 text-left transition-all active:scale-[0.98]",
                  //   isDisabled
                  //     ? "cursor-not-allowed border-(--color-bg-border) bg-(--color-bg-base) opacity-40"
                  //     : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint)",
                  // )}
                  className={cn(
                    "flex items-center gap-3.5 rounded-2xl border-2 px-4 py-2 text-left transition-all active:scale-[0.98]",

                    isDisabled &&
                      "cursor-not-allowed border-(--color-bg-border) bg-(--color-bg-base) opacity-40",

                    !isDisabled &&
                      !isSelected &&
                      "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint)",

                    isSelected &&
                      "border-(--color-sky) bg-(--color-bg-tint) ring-2 ring-(--color-sky)/20",
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
      {footer && (
        <div className="border-t border-(--color-bg-border) p-4 shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
}
