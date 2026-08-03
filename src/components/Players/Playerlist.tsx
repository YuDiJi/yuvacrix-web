// src/components/players/PlayerList.tsx
// ─── Reusable player list ─────────────────────────────────────────────────────
// Renders filtered PlayerCard rows. Parent owns all state.

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { PlayerCard } from "./Playercard";
import type { PlayerListItem, PlayerListProps } from "./Types";

import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function SortablePlayerRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
      }}
    >
      {children}
    </div>
  );
}

export function PlayerList({
  players,
  mode,
  adminId,
  captainId,
  keeperId,
  onAdminChange,
  onCaptainChange,
  onKeeperChange,
  selectedPlayerIds,
  onSelectionChange,
  onDelete,
  orderedPlayerIds,
  onPlayerReorder,
  showSearch = true,
  emptyMessage = "No players in roster",
}: PlayerListProps) {
  const [query, setQuery] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const orderedPlayers = useMemo(() => {
    const basePlayers = orderedPlayerIds?.length
      ? (orderedPlayerIds
          .map((id) => players.find((p) => p.playerId === id))
          .filter(Boolean) as PlayerListItem[])
      : players;

    const q = query.trim().toLowerCase();

    if (!q) {
      return basePlayers;
    }

    return basePlayers.filter((p) => p.fullName.toLowerCase().includes(q));
  }, [players, orderedPlayerIds, query]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = orderedPlayerIds?.indexOf(String(active.id)) ?? -1;

    const newIndex = orderedPlayerIds?.indexOf(String(over.id)) ?? -1;

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const newOrder = arrayMove(orderedPlayerIds!, oldIndex, newIndex);

    onPlayerReorder?.(newOrder);
  }

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
            placeholder="Search players..."
            className="flex-1 bg-transparent text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
          />
        </div>
      )}

      {/* ── Cards ───────────────────────────────────────────────────────── */}
      {/* <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      > */}
      {/* <SortableContext
        items={orderedPlayers.map((p) => p.playerId)}
        strategy={verticalListSortingStrategy}
      > */}
      <div className="flex flex-col gap-2.5">
        {orderedPlayers.length === 0 ? (
          <p className="py-8 text-center text-sm italic text-(--color-text-muted)">
            {query ? `No players match "${query}"` : emptyMessage}
          </p>
        ) : (
          orderedPlayers.map((player) => {
            const isSelected =
              mode === "team-management"
                ? true
                : (selectedPlayerIds?.has(player.playerId) ?? true);

            return (
              <SortablePlayerRow key={player.playerId} id={player.playerId}>
                <PlayerCard
                  player={player}
                  mode={mode}
                  adminId={adminId}
                  onAdminChange={onAdminChange}
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
              </SortablePlayerRow>
            );
          })
        )}
      </div>
      {/* </SortableContext> */}
      {/* </DndContext> */}

      {/* ── End of list marker ──────────────────────────────────────────── */}
      {orderedPlayers.length > 0 && !query && (
        <p className="py-2 text-center text-xs italic text-(--color-text-muted)">
          No more players in roster
        </p>
      )}
    </div>
  );
}
