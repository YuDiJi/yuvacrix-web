import { Button } from "@/components/common/Button";
import { S3Image } from "@/components/common/S3Image";
import { PlayerPickerSheet } from "@/components/Players/PlayerPickerSheet";
import { cn } from "@/lib/cn";
import { ScoringState } from "@/types/innings";
import { MatchDetailsPlayer } from "@/types/match";
import { Check, User } from "lucide-react";
import React, { useMemo, useState } from "react";

const FielderSelector = ({
  players,
  state,
  numberOfFielders,
  onContinue,
}: {
  players: MatchDetailsPlayer[] | undefined;
  state: ScoringState | undefined;
  numberOfFielders: 1 | 2;
  onContinue: (fielders: (MatchDetailsPlayer | null)[]) => void;
}) => {
  // ── Fielder slots ──────────────────────────────────────────────────────────
  // For numberOfFielders === 1, only slot 0 is ever used.
  // For numberOfFielders === 2, slot 0 = "1st Fielder", slot 1 = "2nd Fielder".
  const [fielders, setFielders] = useState<(MatchDetailsPlayer | null)[]>(
    Array(numberOfFielders).fill(null),
  );
  const [isDirectHit, setIsDirectHit] = useState(false);

  // Which slot's picker sheet is currently open (null = none open)
  const [activeSlot, setActiveSlot] = useState<number | null>(0);

  const bowlingPlayers = players?.filter(
    (player) => player.teamId === state?.bowlingTeamId,
  );

  const disabledIds = useMemo(() => {
    const ids: string[] = [];

    if (state?.currentBowlerId) {
      ids.push(state.currentBowlerId);
    }

    fielders.forEach((fielder, index) => {
      if (index !== activeSlot && fielder) {
        ids.push(fielder.playerId);
      }
    });

    return ids;
  }, [fielders, activeSlot, state?.currentBowlerId]);

  const slotLabel = (slot: number) =>
    numberOfFielders === 1
      ? "Fielder"
      : slot === 0
        ? "1st Fielder"
        : "2nd Fielder";

  function handleSelect(player: MatchDetailsPlayer) {
    if (activeSlot === null) return;

    setFielders((prev) => {
      const next = [...prev];
      next[activeSlot] = player;
      return next;
    });

    if (numberOfFielders === 2) {
      if (activeSlot === 0 && !isDirectHit) {
        setActiveSlot(1);
      } else {
        setActiveSlot(1);
      }
    } else {
      setActiveSlot(0);
    }
  }

  const allSelected = isDirectHit
    ? fielders[0] !== null
    : fielders.slice(0, numberOfFielders).every((f) => f !== null);

  function getInitials(name?: string) {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  return (
    <div className="flex flex-col h-full min-h-0 gap-2">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h3
          className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-text-primary)"
          style={{ letterSpacing: "0.03em" }}
        >
          {numberOfFielders === 1 ? "Select Fielder" : "Select Fielders"}
        </h3>
        <p className="mt-0.5 text-sm text-(--color-text-secondary)">
          {numberOfFielders === 1
            ? "Who fielded the ball?"
            : "Tap a slot to choose who was involved."}
        </p>
      </div>

      {/* ── Fielder slot chips ─────────────────────────────────────────────── */}
      <div className={cn("flex gap-3", numberOfFielders === 1 && "max-w-50")}>
        {fielders
          .slice(0, isDirectHit ? 1 : numberOfFielders)
          .map((fielder, slot) => {
            const isActive = activeSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  setActiveSlot(slot);
                }}
                className={cn(
                  "flex-1 flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all duration-200",
                  "active:scale-[0.98]",
                  isActive
                    ? "border-(--color-brand) bg-(--color-bg-tint) shadow-[0_4px_16px_rgba(27,63,160,0.16)]"
                    : fielder
                      ? "border-(--color-bg-border) bg-(--color-bg-card)"
                      : "border-dashed border-(--color-bg-border) bg-(--color-bg-base) hover:border-(--color-sky)/40",
                )}
              >
                {/* Avatar */}
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-(--color-bg-border)">
                  {fielder ? (
                    fielder.profileImageUrl ? (
                      <S3Image
                        imageKey={fielder.profileImageUrl}
                        alt={fielder.playerNameSnapshot}
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                        fallback={
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-(--color-navy)">
                            {fielder.playerNameSnapshot.charAt(0)}
                          </div>
                        }
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
                        <span className="font-(family-name:--font-display) text-xs font-black text-white">
                          {getInitials(fielder.playerNameSnapshot)}
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-(--color-bg-base)">
                      <User size={18} className="text-(--color-text-muted)" />
                    </div>
                  )}

                  {fielder && (
                    <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-brand)">
                      <Check size={9} strokeWidth={3} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-bold",
                      fielder
                        ? "text-(--color-text-primary)"
                        : "text-(--color-text-muted)",
                    )}
                  >
                    {fielder?.playerNameSnapshot ?? "Tap to select"}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-(--color-brand)">
                    {slotLabel(slot)}
                  </p>
                </div>
              </button>
            );
          })}
      </div>

      {numberOfFielders === 2 && (
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={isDirectHit}
              onChange={(e) => {
                const checked = e.target.checked;

                setIsDirectHit(checked);

                if (checked) {
                  // keep only first fielder
                  setFielders((prev) => [prev[0], null]);
                }
              }}
              className="peer appearance-none w-5 h-5 rounded border-2 border-(--color-bg-border) checked:border-(--color-brand) checked:bg-(--color-brand) transition-colors cursor-pointer group-hover:border-(--color-brand)/50"
            />
            <svg
              className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 14 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1.5 6 4.5 9 10.5 1" />
            </svg>
          </div>
          <span className="text-body font-medium text-(--color-text-body)">
            Direct hit
          </span>
        </label>
      )}

      {/* ── Picker sheet — opens for whichever slot is active ─────────────── */}
      <PlayerPickerSheet
        open={activeSlot !== null}
        players={bowlingPlayers}
        title={
          numberOfFielders === 1 ? "Select Fielder" : slotLabel(activeSlot ?? 0)
        }
        // subTitle={`For over ${oversText}`}
        disabledIds={disabledIds}
        selectedPlayerId={
          activeSlot !== null ? fielders[activeSlot]?.playerId : undefined
        }
        onSelect={handleSelect}
      />

      {/* ── Continue ───────────────────────────────────────────────────────── */}
      <Button
        fullWidth
        disabled={!allSelected}
        onClick={() =>
          onContinue(
            fielders.filter(
              (fielder): fielder is MatchDetailsPlayer => fielder !== null,
            ),
          )
        }
      >
        Continue
      </Button>
    </div>
  );
};

export default FielderSelector;
