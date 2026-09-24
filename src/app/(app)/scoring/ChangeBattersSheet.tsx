import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { S3Image } from "@/components/common/S3Image";
import { cn } from "@/lib/cn";
import { useChangeStrikeManuallyMutation } from "@/store/api/cricket/scoringApi";
import { ScoringState } from "@/types/cricket/innings";
import { MatchDetailsPlayer } from "@/types/cricket/match";
import { Check, ChevronRight, Search, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ChangeBattersSheetProps = {
  open: boolean;
  onClose: () => void;
  players: MatchDetailsPlayer[] | undefined;
  state: ScoringState | undefined;
  isScoringBusy?: boolean;
  onPendingChange?: (pending: boolean) => void;
  onSaved?: () => void;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
}

function playerName(
  playersById: Map<string, MatchDetailsPlayer>,
  playerId: string | undefined,
) {
  return playerId ? playersById.get(playerId)?.playerNameSnapshot : undefined;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function roleTag(player: MatchDetailsPlayer): string {
  const tags: string[] = [];

  if (player.isCaptain) tags.push("C");
  if (player.isWicketKeeper) tags.push("WK");

  return tags.join(" / ");
}

function PlayerAvatar({ player }: { player: MatchDetailsPlayer }) {
  return (
    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-(--color-bg-border)">
      {player.playerProfileImageSnapshot ? (
        <S3Image
          imageKey={player.playerProfileImageSnapshot}
          alt={player.playerNameSnapshot}
          width={44}
          height={44}
          className="h-full w-full object-cover"
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
              <span className="font-display text-sm font-black text-white">
                {initials(player.playerNameSnapshot)}
              </span>
            </div>
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
          {player.playerNameSnapshot ? (
            <span className="font-display text-sm font-black text-white">
              {initials(player.playerNameSnapshot)}
            </span>
          ) : (
            <Users size={18} className="text-white/40" />
          )}
        </div>
      )}
    </div>
  );
}

export function ChangeBattersSheet({
  open,
  onClose,
  players,
  state,
  isScoringBusy = false,
  onPendingChange,
  onSaved,
}: ChangeBattersSheetProps) {
  const [strikerId, setStrikerId] = useState("");
  const [nonStrikerId, setNonStrikerId] = useState("");
  const [editingRole, setEditingRole] = useState<"STRIKER" | "NON_STRIKER">(
    "STRIKER",
  );
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const submitInFlightRef = useRef(false);
  const [changeStrikeManually, { isLoading }] =
    useChangeStrikeManuallyMutation();

  useEffect(() => {
    onPendingChange?.(isLoading);
  }, [isLoading, onPendingChange]);

  const playersById = useMemo(() => {
    return new Map((players ?? []).map((player) => [player.playerId, player]));
  }, [players]);

  const battingPlayers = useMemo(() => {
    const availableBatterIds = new Set(state?.availableBatters ?? []);
    const currentBatterIds = new Set(
      [state?.currentStrikerId, state?.currentNonStrikerId].filter(Boolean),
    );

    return (players ?? []).filter((player) => {
      if (player.teamId !== state?.battingTeamId) return false;
      if (!player.isPlayingXi) return false;
      if (availableBatterIds.size === 0) return true;

      return (
        availableBatterIds.has(player.playerId) ||
        currentBatterIds.has(player.playerId)
      );
    });
  }, [
    players,
    state?.availableBatters,
    state?.battingTeamId,
    state?.currentNonStrikerId,
    state?.currentStrikerId,
  ]);

  const eligibleBatterIds = useMemo(() => {
    return new Set(battingPlayers.map((player) => player.playerId));
  }, [battingPlayers]);

  const filteredBattingPlayers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return normalizedQuery
      ? battingPlayers.filter((player) =>
          player.playerNameSnapshot.toLowerCase().includes(normalizedQuery),
        )
      : battingPlayers;
  }, [battingPlayers, query]);

  useEffect(() => {
    if (!open) return;

    setStrikerId(state?.currentStrikerId ?? "");
    setNonStrikerId(state?.currentNonStrikerId ?? "");
    setEditingRole("STRIKER");
    setQuery("");
    setErrorMessage("");
  }, [open, state?.currentNonStrikerId, state?.currentStrikerId]);

  const handleClose = () => {
    if (isLoading) return;

    onClose();
  };

  const handleSave = async () => {
    if (submitInFlightRef.current || isLoading || isScoringBusy) return;

    if (!state?.matchId || !state.inningsId) {
      setErrorMessage("Unable to update batters. Please try again.");
      return;
    }

    if (!strikerId) {
      setErrorMessage("Select a striker.");
      return;
    }

    if (!nonStrikerId) {
      setErrorMessage("Select a non-striker.");
      return;
    }

    if (strikerId === nonStrikerId) {
      setErrorMessage("Striker and non-striker must be different players.");
      return;
    }

    if (!eligibleBatterIds.has(strikerId) || !eligibleBatterIds.has(nonStrikerId)) {
      setErrorMessage("Selected batters must be part of the batting XI.");
      return;
    }

    setErrorMessage("");
    submitInFlightRef.current = true;

    try {
      await changeStrikeManually({
        matchId: state.matchId,
        inningsId: state.inningsId,
        strikerId,
        nonStrikerId,
        reason: "Manual batter correction",
      }).unwrap();

      onSaved?.();
      onClose();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        getErrorMessage(error, "Unable to update batters. Please try again."),
      );
    } finally {
      submitInFlightRef.current = false;
    }
  };

  return (
    <DialogBottom
      open={open}
      onClose={handleClose}
      className="max-h-[min(92dvh,720px)] overflow-hidden"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0">
          <h3 className="font-display text-lg font-black uppercase tracking-wide text-(--color-text-primary)">
            Change Batters
          </h3>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Current: {playerName(playersById, state?.currentStrikerId) ?? "-"} /
            {" "}
            {playerName(playersById, state?.currentNonStrikerId) ?? "-"}
          </p>
        </div>

        {errorMessage && (
          <p className="mt-4 shrink-0 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-2 text-center text-sm font-semibold text-(--color-live)">
            {errorMessage}
          </p>
        )}

        <div className="mt-4 grid shrink-0 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setEditingRole("STRIKER")}
            className={cn(
              "rounded-2xl border-2 p-3 text-left transition-colors",
              editingRole === "STRIKER"
                ? "border-(--color-brand) bg-(--color-bg-tint)"
                : "border-(--color-bg-border) bg-white",
            )}
          >
            <span className="block text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
              Striker
            </span>
            <span className="mt-1 block truncate text-sm font-bold text-(--color-text-primary)">
              {playerName(playersById, strikerId) ?? "Select striker"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setEditingRole("NON_STRIKER")}
            className={cn(
              "rounded-2xl border-2 p-3 text-left transition-colors",
              editingRole === "NON_STRIKER"
                ? "border-(--color-brand) bg-(--color-bg-tint)"
                : "border-(--color-bg-border) bg-white",
            )}
          >
            <span className="block text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
              Non-Striker
            </span>
            <span className="mt-1 block truncate text-sm font-bold text-(--color-text-primary)">
              {playerName(playersById, nonStrikerId) ?? "Select non-striker"}
            </span>
          </button>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-(--color-bg-border) pb-2">
            <h4 className="font-display text-lg font-black uppercase tracking-wide text-(--color-text-primary)">
              {editingRole === "STRIKER"
                ? "Select Striker"
                : "Select Non-Striker"}
            </h4>
            <p className="text-meta mt-0.5">
              {editingRole === "STRIKER"
                ? "Choose the batter on strike."
                : "Choose the batter at the other end."}
            </p>
          </div>

          <div className="shrink-0 pt-3 pb-2">
            <label
              htmlFor="change-batters-search"
              className="sr-only"
            >
              Search players
            </label>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-(--color-bg-border) bg-(--color-bg-base) px-4 py-2 transition-all focus-within:border-(--color-sky) focus-within:shadow-[0_0_0_3px_rgba(75,139,255,0.10)]">
              <Search
                size={16}
                className="shrink-0 text-(--color-text-muted)"
              />
              <input
                id="change-batters-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search players..."
                className="flex-1 bg-transparent text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
              />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 touch-pan-y flex-col gap-2 overflow-y-auto overscroll-contain pb-2 scrollbar-none">
            {filteredBattingPlayers.length === 0 ? (
              <p className="py-8 text-center text-sm italic text-(--color-text-muted)">
                No players found
              </p>
            ) : (
              filteredBattingPlayers.map((player) => {
                const selectedPlayerId =
                  editingRole === "STRIKER" ? strikerId : nonStrikerId;
                const disabledPlayerId =
                  editingRole === "STRIKER" ? nonStrikerId : strikerId;
                const isSelected = selectedPlayerId === player.playerId;
                const isDisabled = disabledPlayerId === player.playerId;
                const tag = roleTag(player);

                return (
                  <button
                    key={player.playerId}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (isDisabled) return;

                      setErrorMessage("");

                      if (editingRole === "STRIKER") {
                        setStrikerId(player.playerId);
                      } else {
                        setNonStrikerId(player.playerId);
                      }
                    }}
                    className={cn(
                      "flex shrink-0 items-center gap-3.5 rounded-2xl border-2 px-4 py-2 text-left transition-all active:scale-[0.98]",
                      isDisabled &&
                        "cursor-not-allowed border-(--color-bg-border) bg-(--color-bg-base) opacity-40",
                      !isDisabled &&
                        !isSelected &&
                        "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint)",
                      isSelected &&
                        "border-(--color-sky) bg-(--color-bg-tint) ring-2 ring-(--color-sky)/20",
                    )}
                  >
                    <PlayerAvatar player={player} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-(--color-text-primary)">
                        {player.playerNameSnapshot}
                      </span>
                      {tag && (
                        <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wide text-(--color-brand)">
                          {tag}
                        </span>
                      )}
                      {player.battingOrder !== undefined && (
                        <span className="text-meta mt-0.5 block">
                          Batting #{player.battingOrder}
                        </span>
                      )}
                    </span>

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
              })
            )}
          </div>
        </div>

        <div className="sticky bottom-0 -mx-5 mt-4 shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-5 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button
            fullWidth
            disabled={
              isLoading ||
              isScoringBusy ||
              !strikerId ||
              !nonStrikerId ||
              strikerId === nonStrikerId
            }
            loading={isLoading}
            onClick={handleSave}
          >
            Save Batters
          </Button>
        </div>
      </div>
    </DialogBottom>
  );
}
