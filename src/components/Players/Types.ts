// src/components/players/types.ts
// ─── Shared player component types ───────────────────────────────────────────

/**
 * Mode controls which actions are visible on each card.
 *
 * team-management  → C + WK + Delete  (no playing toggle)
 * flexible-lineup  → C + WK + Playing toggle  (no delete)
 * fixed-lineup     → C + WK + Playing toggle  (no delete, batting order handled separately)
 */
export type PlayerListMode =
  | "team-management"
  | "flexible-lineup"
  | "fixed-lineup";

/** Minimal player shape the component needs — extend as required */
export interface PlayerListItem {
  playerId: string;
  fullName: string;
  profileImageUrl?: string | null;
  roles?: string[];
}

/** All state + callbacks the parent must provide */
export interface PlayerListProps {
  players: PlayerListItem[];
  mode: PlayerListMode;

  // ── Roles (all modes) ───────────────────────────────────────────────────
  captainId: string | null;
  keeperId: string | null;
  onCaptainChange: (playerId: string | null) => void;
  onKeeperChange: (playerId: string | null) => void;

  // ── Playing selection (lineup modes only) ──────────────────────────────
  selectedPlayerIds?: Set<string>;
  onSelectionChange?: (playerId: string, selected: boolean) => void;

  // ── Delete (team-management only) ──────────────────────────────────────
  onDelete?: (playerId: string) => Promise<void>;
  showSearch?: boolean;
  emptyMessage?: string;
}

/** Props for a single card — derived from PlayerListProps per-item */
export interface PlayerCardProps {
  player: PlayerListItem;
  mode: PlayerListMode;

  isCaptain: boolean;
  isKeeper: boolean;
  isSelected: boolean; // always true in team-management

  onCaptainToggle: () => void;
  onKeeperToggle: () => void;
  onSelectionToggle?: () => void;
  onDelete?: (playerId: string) => Promise<void>;
}
