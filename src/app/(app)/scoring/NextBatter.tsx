import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { PlayerPickerSheet } from "@/components/Players/PlayerPickerSheet";
import { cn } from "@/lib/cn";
import { ScoringState } from "@/types/innings";
import { MatchDetailsPlayer } from "@/types/match";
import { ArrowLeft, Check, User } from "lucide-react";
import React, { useState } from "react";
import { WICKET_CONFIG } from "./out/constant";
import { useChangeStrikeManuallyMutation } from "@/store/api/scoringApi";
import { S3Image } from "@/components/common/S3Image";

type NextBatterSheetProps = {
  players: MatchDetailsPlayer[] | undefined;
  state: ScoringState | undefined;
  open: boolean;
  onClose: () => void;
};

// ── Helper ────────────────────────────────────────────────────────────────────

function getInitials(name?: string) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

// ── Strike selection photo-card ───────────────────────────────────────────────
// Replaces the old plain-text button: image on top, name below, checkmark
// badge + brand border when selected.

function StrikeCard({
  player,
  selected,
  onSelect,
}: {
  player: MatchDetailsPlayer | undefined;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex-1 rounded-2xl border-2 p-3 transition-all duration-200 active:scale-[0.98]",
        selected
          ? "border-(--color-brand) bg-(--color-bg-tint) shadow-[0_4px_16px_rgba(27,63,160,0.16)]"
          : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-sky)/40",
      )}
    >
      {/* Image */}
      <div className="relative mx-auto mb-3 h-20 w-20 overflow-hidden rounded-2xl border border-(--color-bg-border) shadow-sm">
        {player?.playerProfileImageSnapshot ? (
          <S3Image
            imageKey={player.playerProfileImageSnapshot}
            alt={player.playerNameSnapshot}
            width={80}
            height={80}
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
                className="font-(family-name:--font-display) text-lg font-black text-white"
                style={{ letterSpacing: "0.04em" }}
              >
                {getInitials(player.playerNameSnapshot)}
              </span>
            ) : (
              <User size={28} className="text-white/40" />
            )}
          </div>
        )}

        {selected && (
          <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-brand) shadow-md">
            <Check size={11} strokeWidth={3} className="text-white" />
          </div>
        )}
      </div>

      {/* Name */}
      <p
        className={cn(
          "truncate text-center text-sm font-bold",
          selected ? "text-(--color-brand)" : "text-(--color-text-primary)",
        )}
        title={player?.playerNameSnapshot}
      >
        {player?.playerNameSnapshot ?? "—"}
      </p>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const NextBatterSheet = ({
  players,
  state,
  open,
  onClose,
}: NextBatterSheetProps) => {
  const [selectedBatter, setSelectedBatter] =
    useState<MatchDetailsPlayer | null>(null);
  const [step, setStep] = useState<"BATTER" | "STRIKE">("BATTER");
  const [onStrike, setOnStrike] = useState<"NEW_BATTER" | "CURRENT_BATTER">();
  const [changeStrikeManually, { isLoading }] =
    useChangeStrikeManuallyMutation();

  const availableBatterIds = new Set(state?.availableBatters ?? []);

  const availableBattingPlayers = players?.filter((player) =>
    availableBatterIds.has(player.playerId),
  );

  const dismissedPlayerId = state?.lastBall?.wicket?.dismissedPlayerId;

  const survivingBatter =
    dismissedPlayerId === state?.currentStrikerId
      ? players?.find((p) => p.playerId === state?.currentNonStrikerId)
      : players?.find((p) => p.playerId === state?.currentStrikerId);

  const handleSelectBatter = async () => {
    // if (!selectedBowler || !matchId || !inningsId) return;
    if (!state?.lastBall?.wicket?.type || !selectedBatter) return;
    try {
      if (
        WICKET_CONFIG[state?.lastBall?.wicket?.type]
          .requiresStrikerSelectionAfterWicket
      ) {
        setStep("STRIKE");
      } else {
        await changeStrikeManually({
          matchId: state.matchId,
          inningsId: state.inningsId,
          strikerId: selectedBatter?.playerId,
          nonStrikerId: state.currentNonStrikerId,
          reason: "wicket out",
        }).unwrap();

        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleContinue = async () => {
    // if (!selectedBowler || !matchId || !inningsId) return;
    if (!state || !selectedBatter || !survivingBatter) return;
    try {
      await changeStrikeManually({
        matchId: state.matchId,
        inningsId: state.inningsId,

        strikerId:
          onStrike === "NEW_BATTER"
            ? selectedBatter.playerId
            : survivingBatter.playerId,

        nonStrikerId:
          onStrike === "NEW_BATTER"
            ? survivingBatter.playerId
            : selectedBatter.playerId,

        reason: "wicket out",
      }).unwrap();

      setStep("BATTER");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  console.log(availableBattingPlayers);

  return (
    <DialogBottom open={open} onClose={() => {}}>
      <div className="flex flex-col gap-4">
        {/* ── BATTER step ──────────────────────────────────────────────────── */}
        {step === "BATTER" && (
          <div>
            <PlayerPickerSheet
              open={open}
              players={availableBattingPlayers}
              title="Select Next Batter"
              subTitle="Choose who's walking in to bat"
              disabledIds={
                state?.currentStrikerId
                  ? [state.currentStrikerId, state.currentNonStrikerId]
                  : []
              }
              selectedPlayerId={selectedBatter?.playerId}
              onSelect={(player) => {
                setSelectedBatter(player);
              }}
            />
            <Button
              fullWidth
              disabled={!selectedBatter}
              onClick={handleSelectBatter}
            >
              Continue
            </Button>
          </div>
        )}

        {/* ── STRIKE step ──────────────────────────────────────────────────── */}
        {step === "STRIKE" && (
          <>
            {/* Header with back button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep("BATTER")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary) transition-all active:scale-90 hover:bg-(--color-bg-border)"
                aria-label="Back"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="min-w-0">
                <h3
                  className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-text-primary)"
                  style={{ letterSpacing: "0.03em" }}
                >
                  Who&apos;s On Strike?
                </h3>
                <p className="mt-0.5 text-sm text-(--color-text-secondary)">
                  Pick the batter facing the next ball.
                </p>
              </div>
            </div>

            {/* Photo cards — new batter vs current non-striker */}
            <div className="flex gap-3">
              <StrikeCard
                player={selectedBatter ?? undefined}
                selected={onStrike === "NEW_BATTER"}
                onSelect={() => setOnStrike("NEW_BATTER")}
              />
              <StrikeCard
                player={survivingBatter}
                selected={onStrike === "CURRENT_BATTER"}
                onSelect={() => setOnStrike("CURRENT_BATTER")}
              />
            </div>

            <Button fullWidth disabled={!onStrike} onClick={handleContinue}>
              Continue
            </Button>
          </>
        )}
      </div>
      {state && (
        <div className="overflow-hidden px-5 py-1">
          <div className="whitespace-nowrap animate-marquee">
            <span className="text-sm font-bold">
              Target: {state.score} in {state.oversText} ({state.runRateSummary}
              )
            </span>
          </div>
        </div>
      )}
    </DialogBottom>
  );
};

export default NextBatterSheet;
