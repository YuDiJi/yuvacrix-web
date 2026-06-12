// src/components/players/PlayerCard.tsx
// ─── Reusable player card — exact existing UI, no redesign ───────────────────
// Mode controls which actions render. Parent owns all state.

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PlayerCardProps } from "./Types";

// ─── Inline delete confirmation (same as original) ───────────────────────────

function DeleteConfirmRow({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-(--color-live)/20 bg-(--color-live)/6 px-3 py-2">
      <p className="text-xs font-semibold text-(--color-live)">
        Remove from team?
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-(--color-bg-border) bg-(--color-bg-card) px-3 py-1 text-xs font-bold text-(--color-text-secondary) transition-all active:scale-95"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg bg-(--color-live) px-3 py-1 text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-60"
        >
          {loading && (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
          Remove
        </button>
      </div>
    </div>
  );
}

// ─── WK gloves icon (inline SVG — no lucide equivalent) ─────────────────────

function WKIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "white" : "var(--color-text-secondary)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────

export function PlayerCard({
  player,
  mode,
  isCaptain,
  isKeeper,
  isSelected,
  onCaptainToggle,
  onKeeperToggle,
  onSelectionToggle,
  onDelete,
}: PlayerCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isHighlighted = isCaptain || isKeeper;
  const isLineupMode = mode === "flexible-lineup" || mode === "fixed-lineup";
  const isTeamMgmt = mode === "team-management";

  // A deselected player in lineup mode gets a muted appearance
  const isMuted = isLineupMode && !isSelected;

  async function handleDeleteConfirm() {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(player.playerId);
    } finally {
      setIsDeleting(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border-2 bg-(--color-bg-card) px-3.5 py-3",
          "shadow-(--shadow-card) transition-all duration-150",
          // Border priority: highlighted > confirming delete > default
          isHighlighted && isSelected
            ? "border-(--color-brand) shadow-[0_2px_12px_rgba(27,63,160,0.12)]"
            : confirmingDelete
              ? "border-(--color-live)/40"
              : "border-(--color-bg-border)",
          // Mute deselected lineup players
          isMuted && "opacity-50",
        )}
      >
        {/* ── Playing toggle checkbox (lineup modes only) ──────────────── */}
        {isLineupMode && onSelectionToggle && (
          <button
            onClick={onSelectionToggle}
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 active:scale-90",
              isSelected
                ? "border-(--color-brand) bg-(--color-brand)"
                : "border-(--color-bg-border) bg-(--color-bg-base) hover:border-(--color-sky)/50",
            )}
            aria-label={isSelected ? "Deselect player" : "Select player"}
          >
            {isSelected && (
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1.5 4L3 5.5L6.5 2"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )}

        {/* ── Avatar ───────────────────────────────────────────────────── */}
        <div
          className={cn(
            "h-12 w-12 shrink-0 overflow-hidden rounded-full border-2",
            isHighlighted && isSelected
              ? "border-(--color-brand)"
              : "border-(--color-bg-border)",
          )}
        >
          {player.profileImageUrl ? (
            <Image
              src={player.profileImageUrl}
              alt={player.fullName}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
              <span
                className="font-(family-name:--font-display) text-base font-black text-white"
                style={{ letterSpacing: "0.04em" }}
              >
                {player.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* ── Name + role label ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-bold text-(--color-text-primary)">
            {player.fullName}
          </p>
          {/* Role from captain/keeper assignment */}
          {(isCaptain || isKeeper) && isSelected && (
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-(--color-brand)">
              {isCaptain && isKeeper
                ? "Captain · Wicket-Keeper"
                : isCaptain
                  ? "Captain"
                  : "Wicket-Keeper"}
            </p>
          )}
          {/* Optional role from data */}
          {!isCaptain && !isKeeper && player.role && (
            <p className="mt-0.5 text-meta truncate">{player.role}</p>
          )}
        </div>

        {/* ── Captain (C) ──────────────────────────────────────────────── */}
        <button
          onClick={onCaptainToggle}
          disabled={isMuted}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 active:scale-90",
            isCaptain && isSelected
              ? "border-(--color-brand) bg-(--color-brand) shadow-[0_2px_8px_rgba(27,63,160,0.30)]"
              : "border-(--color-bg-border) bg-(--color-bg-base) hover:border-(--color-sky)/50",
            isMuted && "cursor-not-allowed",
          )}
          aria-label={`${isCaptain ? "Remove" : "Set"} captain`}
        >
          <span
            className={cn(
              "font-(family-name:--font-display) text-sm font-black",
              isCaptain && isSelected
                ? "text-white"
                : "text-(--color-text-secondary)",
            )}
            style={{ letterSpacing: "0.04em" }}
          >
            C
          </span>
        </button>

        {/* ── Wicketkeeper (WK) ─────────────────────────────────────────── */}
        <button
          onClick={onKeeperToggle}
          disabled={isMuted}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 active:scale-90",
            isKeeper && isSelected
              ? "border-(--color-brand) bg-(--color-brand) shadow-[0_2px_8px_rgba(27,63,160,0.30)]"
              : "border-(--color-bg-border) bg-(--color-bg-base) hover:border-(--color-sky)/50",
            isMuted && "cursor-not-allowed",
          )}
          aria-label={`${isKeeper ? "Remove" : "Set"} wicketkeeper`}
        >
          <WKIcon active={isKeeper && isSelected} />
        </button>

        {/* ── Delete (team-management only) ────────────────────────────── */}
        {isTeamMgmt && (
          <button
            onClick={() => setConfirmingDelete((v) => !v)}
            disabled={isDeleting}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 active:scale-90",
              confirmingDelete
                ? "border-(--color-live)/40 bg-(--color-live)/10 text-(--color-live)"
                : "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-muted) hover:border-(--color-live)/40 hover:bg-(--color-live)/8 hover:text-(--color-live)",
            )}
            aria-label="Remove player"
          >
            {isDeleting ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-(--color-live)/30 border-t-(--color-live)" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        )}
      </div>

      {/* Inline delete confirmation */}
      {confirmingDelete && isTeamMgmt && (
        <DeleteConfirmRow
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmingDelete(false)}
          loading={isDeleting}
        />
      )}
    </div>
  );
}
