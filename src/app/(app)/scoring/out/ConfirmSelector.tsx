"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/common/Button";
import { MatchDetailsPlayer } from "@/types/match";
import { WicketFlowState } from "@/types/scoring";
import { cn } from "@/lib/cn";

type ConfirmProps = {
  form: WicketFlowState;
  players?: MatchDetailsPlayer[];
  onSubmit: () => void;
  isLoading?: boolean;
};

// Helper to get initials for the avatar fallback
const getInitials = (name?: string) => {
  if (!name) return "P";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function Confirm({
  form,
  players,
  onSubmit,
  isLoading,
}: ConfirmProps) {
  const dismissedPlayer = players?.find(
    (p) => p.playerId === form.dismissedPlayerId,
  );

  const nextBatter = players?.find((p) => p.playerId === form.nextBatterId);
  const wicketKeeper = players?.find((p) => p.playerId === form.wicketKeeperId);
  const fielders =
    players?.filter((p) => form.fielderIds.includes(p.playerId)) ?? [];

  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      <div className="flex flex-col gap-2">
        {/* 1. Header & Wicket Type Highlight */}
        <div className="flex flex-col items-center text-center">
          <h3 className="font-display text-base font-bold uppercase tracking-widest text-(--color-brand)">
            Confirm Wicket
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-display text-3xl font-black uppercase text-(--color-navy)">
              {form.wicketType?.replace(/_/g, " ") ?? "OUT"}
            </span>
          </div>
        </div>

        {/* 2. "WHO?" SECTION - The Visual Player Card */}
        <div className="flex flex-col items-center">
          <p className="text-section-label mb-4 self-start">Who?</p>

          <div className="w-full max-w-50">
            <div className="rounded-2xl border-2 border-(--color-brand) bg-(--color-bg-tint) p-4 shadow-[0_4px_20px_rgba(27,160,160,0.12)]">
              {/* Avatar Container */}
              <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-2xl border border-(--color-bg-border) bg-white shadow-sm">
                {dismissedPlayer?.profileImageUrl ? (
                  <Image
                    src={dismissedPlayer.profileImageUrl}
                    alt={dismissedPlayer.playerNameSnapshot}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
                    <span className="font-display text-3xl font-black text-white tracking-widest">
                      {getInitials(dismissedPlayer?.playerNameSnapshot)}
                    </span>
                  </div>
                )}
                {/* Selected Checkmark Overlay */}
                <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-(--color-brand) shadow-md">
                  <Check size={16} strokeWidth={3} className="text-white" />
                </div>
              </div>

              {/* Name */}
              <p className="truncate text-center font-display text-lg font-black uppercase tracking-wide text-(--color-brand)">
                {dismissedPlayer?.playerNameSnapshot ?? "—"}
              </p>

              {/* Role Label Pill */}
              <div className="mt-2 flex justify-center">
                <span className="rounded-full bg-(--color-brand) px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                  {form.dismissalEnd}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Summary Details List */}
        <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 space-y-3.5 shadow-sm">
          <p className="text-section-label border-b border-(--color-bg-border) pb-2">
            Dismissal Details
          </p>

          {fielders.length > 0 && (
            <Row
              label="Fielder(s)"
              value={fielders.map((f) => f.playerNameSnapshot).join(", ")}
            />
          )}

          {wicketKeeper && (
            <Row
              label="Wicket Keeper"
              value={wicketKeeper.playerNameSnapshot}
            />
          )}

          {(form.batRuns !== undefined ||
            form.additionalRuns !== undefined) && (
            <Row
              label="Runs on Ball"
              value={`${form.batRuns ?? 0}${form.extraType ? " (" + form.extraType + ")" : ""}`}
            />
          )}

          {nextBatter && (
            <Row
              label="Next In"
              value={nextBatter.playerNameSnapshot}
              isHighlight
            />
          )}
        </div>

        {/* 4. Action Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onSubmit}
            loading={isLoading}
          >
            {isLoading ? "Recording..." : "Record Wicket"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Optimized Data Row
function Row({
  label,
  value,
  isHighlight,
}: {
  label: string;
  value: string;
  isHighlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-meta font-medium uppercase tracking-wider text-(--color-text-muted)">
        {label}
      </span>
      <span
        className={cn(
          "font-display text-sm font-bold uppercase tracking-wide",
          isHighlight ? "text-(--color-brand)" : "text-(--color-navy)",
        )}
      >
        {value}
      </span>
    </div>
  );
}
