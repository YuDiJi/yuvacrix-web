"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/providers/HeaderProvider";
import {
  Search,
  UserPlus,
  Trash2,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetTeamMembersQuery,
  useRemoveTeamMemberMutation,
} from "@/store/api/teamApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTeamA, selectTeamB } from "@/store/startMatch/selectors";
import Image from "next/image";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";
import { PlayerListSkeleton } from "@/components/common/loaders/Skeletonloader";
import {
  setTeamARoles,
  setTeamBRoles,
} from "@/store/startMatch/startMatchSlice";

// ─── Inline delete confirmation (replaces window.confirm) ─────────────────────

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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SelectPlayersPage() {
  const { setHeader } = useHeader();
  const router = useRouter();

  const [removeTeamMember, { isLoading: isRemoving }] =
    useRemoveTeamMemberMutation();

  const activeTeam = useAppSelector((state) => state.startMatch.activeTeam);
  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);
  const currentTeam = activeTeam === "A" ? teamA : teamB;

  const [query, setQuery] = useState("");
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [keeperId, setKeeperId] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    setHeader({
      title: "Team Setup",
      showBackButton: true,
      showNotifications: false,
    });
  }, [setHeader]);

  const {
    data: allPlayers,
    isLoading: isLoadingPlayers,
    isError: isPlayersError,
    refetch,
  } = useGetTeamMembersQuery(
    currentTeam ? { teamId: currentTeam.id } : skipToken,
  );

  const players = allPlayers ?? [];
  const filtered = players.filter(
    (p) =>
      query.trim() === "" ||
      p.fullName.toLowerCase().includes(query.toLowerCase()),
  );
  const canConfirm = captainId !== null && keeperId !== null;

  // ── Remove player ─────────────────────────────────────────────────────────
  async function handleRemove(playerId: string) {
    if (!currentTeam) return;
    setRemovingId(playerId);
    try {
      await removeTeamMember({ teamId: currentTeam.id, playerId }).unwrap();
      if (captainId === playerId) setCaptainId(null);
      if (keeperId === playerId) setKeeperId(null);
    } catch {
      // error is shown inline via removingId reset — refetch to sync
      refetch();
    } finally {
      setRemovingId(null);
      setConfirmRemoveId(null);
    }
  }

  // ── Confirm roles + navigate ──────────────────────────────────────────────
  // async function handleConfirm() {
  //   if (!currentTeam || !captainId || !keeperId) return;
  //   setConfirmError("");
  //   try {
  //     router.push("/start-match");
  //   } catch {
  //     setConfirmError("Failed to assign roles. Please try again.");
  //   }
  // }

  async function handleConfirm() {
    if (!currentTeam || !captainId || !keeperId) return;

    const captain = allPlayers?.find((p) => p.playerId === captainId);

    const keeper = allPlayers?.find((p) => p.playerId === keeperId);

    if (!captain || !keeper) return;

    if (activeTeam === "A") {
      dispatch(
        setTeamARoles({
          captain: {
            id: captain.playerId,
            name: captain.fullName,
          },
          keeper: {
            id: keeper.playerId,
            name: keeper.fullName,
          },
        }),
      );
    } else {
      dispatch(
        setTeamBRoles({
          captain: {
            id: captain.playerId,
            name: captain.fullName,
          },
          keeper: {
            id: keeper.playerId,
            name: keeper.fullName,
          },
        }),
      );
    }

    router.push("/start-match");
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoadingPlayers) {
    return <PlayerListSkeleton rows={5} />;
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (isPlayersError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center bg-(--color-bg-base)">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-(--color-live)/10">
          <AlertCircle size={36} className="text-(--color-live)" />
        </div>
        <div>
          <h3
            className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)"
            style={{ letterSpacing: "0.04em" }}
          >
            Failed to Load
          </h3>
          <p className="mt-1.5 text-sm text-(--color-text-secondary)">
            Couldn&apos;t load the squad. Check your connection and try again.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-2xl bg-(--color-brand) px-6 py-3.5 font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em] text-white shadow-(--shadow-button) transition-all active:scale-95"
        >
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (players.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center bg-(--color-bg-base)">
        <div
          onClick={() => router.push("/start-match/create-player")}
          className="relative mb-6 cursor-pointer"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-(--color-navy) shadow-[0_8px_32px_rgba(13,27,62,0.18)]">
            <UserPlus size={44} className="text-white/85" />
          </div>
          <div className="absolute inset-0 scale-110 rounded-3xl border-2 border-(--color-brand)/20" />
        </div>
        <h3
          className="font-(family-name:--font-display) text-2xl font-black uppercase text-(--color-text-primary)"
          style={{ letterSpacing: "0.04em" }}
        >
          No Players Yet
        </h3>
        <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-(--color-text-secondary)">
          Add players to your squad and start scoring matches.
        </p>
        <button
          onClick={() => router.push("/start-match/create-player")}
          className="mt-6 flex items-center gap-2 rounded-2xl bg-(--color-brand) px-6 py-3.5 font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em] text-white shadow-(--shadow-button) transition-all active:scale-95"
        >
          <UserPlus size={16} /> Add Players
        </button>
      </div>
    );
  }

  // ── Main view ─────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
        {/* Team banner */}
        <div className="mb-4 flex items-center gap-4 rounded-2xl bg-(--color-navy) px-5 py-4 shadow-[0_4px_20px_rgba(13,27,62,0.20)]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-(family-name:--font-display) text-xl font-black uppercase text-white truncate"
              style={{ letterSpacing: "0.04em" }}
            >
              {currentTeam?.name}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-white/55">
              {players.length} Player{players.length !== 1 ? "s" : ""} in Squad
            </p>
          </div>
        </div>

        {/* Roles assignment header */}
        <div className="mb-4">
          <h2
            className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-text-primary)"
            style={{ letterSpacing: "0.04em" }}
          >
            Roles Assignment
          </h2>
          <p className="mt-0.5 text-sm text-(--color-text-secondary)">
            Identify the Captain (C) and Wicketkeeper (WK) for this match.
          </p>

          {/* Validation hint */}
          {!canConfirm && (
            <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-(--color-six)/30 bg-(--color-six)/8 px-3 py-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-six)" />
              <p className="text-xs font-semibold text-(--color-six)">
                {!captainId && !keeperId
                  ? "Select a Captain and Wicketkeeper to continue"
                  : !captainId
                    ? "Select a Captain to continue"
                    : "Select a Wicketkeeper to continue"}
              </p>
            </div>
          )}
        </div>

        {/* Search */}
        <div
          className={cn(
            "mb-4 flex items-center gap-3 rounded-2xl border-2 border-(--color-bg-border)",
            "bg-(--color-bg-card) px-4 py-3 shadow-(--shadow-card) transition-all duration-150",
            "focus-within:border-(--color-sky) focus-within:shadow-[0_0_0_3px_rgba(75,139,255,0.10)]",
          )}
        >
          <Search size={17} className="shrink-0 text-(--color-text-muted)" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="flex-1 bg-transparent text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
          />
        </div>

        {/* Player list */}
        <div className="flex flex-col gap-2.5">
          {filtered.map((player) => {
            const isCaptain = captainId === player.playerId;
            const isKeeper = keeperId === player.playerId;
            const isHighlighted = isCaptain || isKeeper;
            const isThisRemoving = removingId === player.playerId;
            const isConfirming = confirmRemoveId === player.playerId;

            return (
              <div key={player.playerId} className="flex flex-col gap-2">
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border-2 bg-(--color-bg-card) px-3.5 py-3",
                    "shadow-(--shadow-card) transition-all duration-150",
                    isHighlighted
                      ? "border-(--color-brand) shadow-[0_2px_12px_rgba(27,63,160,0.12)]"
                      : isConfirming
                        ? "border-(--color-live)/40"
                        : "border-(--color-bg-border)",
                    isThisRemoving && "opacity-50",
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "h-12 w-12 shrink-0 overflow-hidden rounded-full border-2",
                      isHighlighted
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

                  {/* Name + assigned role label */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-bold text-(--color-text-primary)">
                      {player.fullName}
                    </p>
                    {(isCaptain || isKeeper) && (
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-(--color-brand)">
                        {isCaptain && isKeeper
                          ? "Captain · WK-Batter"
                          : isCaptain
                            ? "Captain"
                            : "WK-Batter"}
                      </p>
                    )}
                  </div>

                  {/* Captain (C) */}
                  <button
                    onClick={() =>
                      setCaptainId(isCaptain ? null : player.playerId)
                    }
                    disabled={isThisRemoving}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 active:scale-90",
                      isCaptain
                        ? "border-(--color-brand) bg-(--color-brand) shadow-[0_2px_8px_rgba(27,63,160,0.30)]"
                        : "border-(--color-bg-border) bg-(--color-bg-base) hover:border-(--color-sky)/50",
                    )}
                    aria-label={`${isCaptain ? "Remove" : "Set"} captain`}
                  >
                    <span
                      className={cn(
                        "font-(family-name:--font-display) text-sm font-black",
                        isCaptain
                          ? "text-white"
                          : "text-(--color-text-secondary)",
                      )}
                      style={{ letterSpacing: "0.04em" }}
                    >
                      C
                    </span>
                  </button>

                  {/* Wicketkeeper (WK) */}
                  <button
                    onClick={() =>
                      setKeeperId(isKeeper ? null : player.playerId)
                    }
                    disabled={isThisRemoving}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 active:scale-90",
                      isKeeper
                        ? "border-(--color-brand) bg-(--color-brand) shadow-[0_2px_8px_rgba(27,63,160,0.30)]"
                        : "border-(--color-bg-border) bg-(--color-bg-base) hover:border-(--color-sky)/50",
                    )}
                    aria-label={`${isKeeper ? "Remove" : "Set"} wicketkeeper`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={
                        isKeeper ? "white" : "var(--color-text-secondary)"
                      }
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
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() =>
                      setConfirmRemoveId(isConfirming ? null : player.playerId)
                    }
                    disabled={isThisRemoving}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 active:scale-90",
                      isConfirming
                        ? "border-(--color-live)/40 bg-(--color-live)/10 text-(--color-live)"
                        : "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-muted) hover:border-(--color-live)/40 hover:bg-(--color-live)/8 hover:text-(--color-live)",
                    )}
                    aria-label="Remove player"
                  >
                    {isThisRemoving ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-(--color-live)/30 border-t-(--color-live)" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </div>

                {/* Inline delete confirmation — no browser dialog */}
                {isConfirming && (
                  <DeleteConfirmRow
                    onConfirm={() => handleRemove(player.playerId)}
                    onCancel={() => setConfirmRemoveId(null)}
                    loading={isThisRemoving}
                  />
                )}
              </div>
            );
          })}
        </div>

        {filtered.length > 0 && (
          <p className="mt-6 text-center text-xs italic text-(--color-text-muted)">
            No more players in roster
          </p>
        )}

        {filtered.length === 0 && query && (
          <p className="mt-8 text-center text-sm text-(--color-text-muted)">
            No players match &quot;{query}&quot;
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="safe-bottom fixed bottom-0 w-full shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3">
        {/* Role-save error */}
        {confirmError && (
          <div className="mb-2.5 flex items-center gap-2 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-2">
            <AlertCircle size={14} className="shrink-0 text-(--color-live)" />
            <p className="text-xs font-semibold text-(--color-live)">
              {confirmError}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            fullWidth
            disabled={!canConfirm}
            // loading={isSavingRoles}
            onClick={handleConfirm}
            rightIcon={<ChevronRight size={18} />}
            className={cn(!canConfirm && "opacity-50 cursor-not-allowed")}
          >
            Start Match
          </Button>

          <button
            onClick={() => router.push("/start-match/create-player")}
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
              "border-2 border-(--color-bg-border) bg-(--color-bg-base)",
              "text-(--color-text-secondary) transition-all active:scale-90",
              "hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint) hover:text-(--color-brand)",
            )}
            aria-label="Add player"
          >
            <UserPlus size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
