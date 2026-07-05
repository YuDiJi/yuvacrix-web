import { Button } from "@/components/common/Button";
import { S3Image } from "@/components/common/S3Image";
import { cn } from "@/lib/cn";
import { ScoringState } from "@/types/innings";
import { MatchDetailsPlayer } from "@/types/match";
import { DismissalEnd } from "@/types/scoring";
import { Check } from "lucide-react";
import React, { useState } from "react";

type DismissedBatterSelectorProps = {
  players: MatchDetailsPlayer[] | undefined;
  state: ScoringState | undefined;
  onlyStriker: boolean;
  onContinue: (player: MatchDetailsPlayer, dismissalEnd: DismissalEnd) => void;
};

const DismissedBatterSelector = ({
  players,
  state,
  onlyStriker,
  onContinue,
}: DismissedBatterSelectorProps) => {
  const [selected, setSelected] = useState<MatchDetailsPlayer | null>(null);
  const [dismissalEnd, setDismissalEnd] = useState<DismissalEnd>("STRIKER");

  const striker = players?.find(
    (player) => player.playerId === state?.currentStrikerId,
  );

  const nonStriker = players?.find(
    (player) => player.playerId === state?.currentNonStrikerId,
  );

  const getInitials = (name?: string) => {
    if (!name) return "";

    return name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  // ── Shared player card — striker & non-striker render identically ────────
  const renderPlayerCard = (
    player: MatchDetailsPlayer | undefined,
    label: DismissalEnd,
  ) => {
    const isSelected = selected?.playerId === player?.playerId;
    const isDimmed = selected !== null && !isSelected;

    return (
      <button
        type="button"
        onClick={() => {
          setSelected(player ?? null);
          setDismissalEnd(label);
        }}
        className={cn(
          "group flex-1 rounded-2xl border-2 p-3 text-left transition-all duration-200",
          "active:scale-[0.98]",
          isSelected
            ? "border-(--color-brand) bg-(--color-bg-tint) shadow-[0_4px_20px_rgba(27,63,160,0.18)]"
            : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-sky)/40",
          isDimmed && "opacity-40",
        )}
      >
        {/* Avatar */}
        <div className="relative mx-auto mb-3 h-28 w-28 overflow-hidden rounded-2xl border border-(--color-bg-border) shadow-sm">
          {player?.profileImageUrl ? (
            <S3Image
              imageKey={player.profileImageUrl}
              alt={player.playerNameSnapshot}
              width={112}
              height={112}
              className="h-full w-full object-cover"
              fallback={
                <div className="flex h-full w-full items-center justify-center rounded-full bg-(--color-navy)">
                  {player.playerNameSnapshot.charAt(0)}
                </div>
              }
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
              <span
                className="font-(family-name:--font-display) text-2xl font-black text-white"
                style={{ letterSpacing: "0.04em" }}
              >
                {getInitials(player?.playerNameSnapshot)}
              </span>
            </div>
          )}

          {/* Selected checkmark */}
          {isSelected && (
            <div className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-(--color-brand) shadow-md">
              <Check size={14} strokeWidth={3} className="text-white" />
            </div>
          )}
        </div>

        {/* Name */}
        <p
          className={cn(
            "truncate text-center text-sm font-bold",
            isSelected ? "text-(--color-brand)" : "text-(--color-text-primary)",
          )}
          title={player?.playerNameSnapshot}
        >
          {player?.playerNameSnapshot ?? "—"}
        </p>

        {/* Role label — small pill, not just plain text */}
        <div className="mt-1.5 flex justify-center">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              isSelected
                ? "bg-(--color-brand) text-white"
                : "bg-(--color-bg-base) text-(--color-text-muted)",
            )}
          >
            {label}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="px-1 pb-1 pt-2">
      {/* Header */}
      <div className="mb-4 px-1">
        <h3
          className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-text-primary)"
          style={{ letterSpacing: "0.03em" }}
        >
          Who&apos;s Out?
        </h3>
        <p className="mt-0.5 text-sm text-(--color-text-secondary)">
          Select the dismissed batter to continue scoring.
        </p>
      </div>

      {/* Player cards */}
      <div className="flex gap-3">
        {renderPlayerCard(striker, "STRIKER")}
        {!onlyStriker && renderPlayerCard(nonStriker, "NON_STRIKER")}
      </div>

      {/* Continue */}
      <div className="mt-5">
        <Button
          fullWidth
          disabled={!selected}
          onClick={() => selected && onContinue(selected, dismissalEnd)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default DismissedBatterSelector;
