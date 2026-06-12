// src/components/players/PlayerList.tsx
// ─── Reusable player list ─────────────────────────────────────────────────────
// Renders filtered PlayerCard rows. Parent owns all state.

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { PlayerCard } from "./Playercard";
import type { PlayerListProps } from "./Types";

export function PlayerList({
  players,
  mode,
  captainId,
  keeperId,
  onCaptainChange,
  onKeeperChange,
  selectedPlayerIds,
  onSelectionChange,
  onDelete,
  showSearch = true,
  emptyMessage = "No players in roster",
}: PlayerListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.role?.toLowerCase().includes(q),
    );
  }, [players, query]);

  return (
    <div className="flex flex-col gap-3">
      {/* ── Optional search ─────────────────────────────────────────────── */}
      {showSearch && (
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border-2 border-(--color-bg-border)",
            "bg-(--color-bg-card) px-4 py-3 shadow-(--shadow-card) transition-all duration-150",
            "focus-within:border-(--color-sky) focus-within:shadow-[0_0_0_3px_rgba(75,139,255,0.10)]",
          )}
        >
          <Search size={17} className="shrink-0 text-(--color-text-muted)" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or role..."
            className="flex-1 bg-transparent text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
          />
        </div>
      )}

      {/* ── Cards ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm italic text-(--color-text-muted)">
            {query ? `No players match "${query}"` : emptyMessage}
          </p>
        ) : (
          filtered.map((player) => {
            // In team-management mode every player is always "selected"
            const isSelected =
              mode === "team-management"
                ? true
                : (selectedPlayerIds?.has(player.playerId) ?? true);

            return (
              <PlayerCard
                key={player.playerId}
                player={player}
                mode={mode}
                isCaptain={captainId === player.playerId}
                isKeeper={keeperId === player.playerId}
                isSelected={isSelected}
                onCaptainToggle={() =>
                  onCaptainChange(
                    captainId === player.playerId ? null : player.playerId,
                  )
                }
                onKeeperToggle={() =>
                  onKeeperChange(
                    keeperId === player.playerId ? null : player.playerId,
                  )
                }
                onSelectionToggle={
                  onSelectionChange
                    ? () => onSelectionChange(player.playerId, !isSelected)
                    : undefined
                }
                onDelete={onDelete}
              />
            );
          })
        )}
      </div>

      {/* ── End of list marker ──────────────────────────────────────────── */}
      {filtered.length > 0 && !query && (
        <p className="py-2 text-center text-xs italic text-(--color-text-muted)">
          No more players in roster
        </p>
      )}
    </div>
  );
}
