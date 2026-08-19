import { Check } from "lucide-react";
import { Button } from "@/components/common/Button";
import { MatchDetailsPlayer } from "@/types/cricket/match";
import { WicketFlowState } from "@/types/cricket/scoring";
import { cn } from "@/lib/cn";
import { WICKET_CONFIG } from "./constant";
import { Dispatch, SetStateAction, useState } from "react";
import { S3Image } from "@/components/common/S3Image";

type ConfirmProps = {
  form: WicketFlowState;
  players?: MatchDetailsPlayer[];
  onSubmit: () => void;
  isLoading?: boolean;
  setForm: Dispatch<SetStateAction<WicketFlowState>>;
};

const getInitials = (name?: string) => {
  if (!name) return "P";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Compact inline player chip: avatar + name side by side
function PlayerChip({
  player,
  size = "sm",
}: {
  player?: MatchDetailsPlayer;
  size?: "sm" | "md";
}) {
  const avatarSize = size === "md" ? "h-9 w-9 text-base" : "h-7 w-7 text-xs";
  const nameSize = size === "md" ? "text-sm" : "text-xs";

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-(--color-bg-border) shadow-sm",
          avatarSize,
        )}
      >
        {player?.playerProfileImageSnapshot ? (
          <S3Image
            imageKey={player.playerProfileImageSnapshot}
            alt={player.playerNameSnapshot}
            width={size === "md" ? 36 : 28}
            height={size === "md" ? 36 : 28}
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
              className={cn(
                "font-display font-black text-white",
                size === "md" ? "text-sm" : "text-[10px]",
              )}
            >
              {getInitials(player?.playerNameSnapshot)}
            </span>
          </div>
        )}
      </div>
      <span
        className={cn(
          "font-display font-bold uppercase tracking-wide text-(--color-navy)",
          nameSize,
        )}
      >
        {player?.playerNameSnapshot ?? "—"}
      </span>
    </div>
  );
}

export default function Confirm({
  form,
  players,
  onSubmit,
  isLoading,
  setForm,
}: ConfirmProps) {
  const config = form.wicketType ? WICKET_CONFIG[form.wicketType] : undefined;

  const dismissedPlayer = players?.find(
    (p) => p.playerId === form.dismissedPlayerId,
  );
  const nextBatter = players?.find((p) => p.playerId === form.nextBatterId);
  const wicketKeeper = players?.find((p) => p.playerId === form.wicketKeeperId);
  const fielders =
    players?.filter((p) => form.fielderIds.includes(p.playerId)) ?? [];

  const runsDisplay = (() => {
    if (!form.extraType) {
      return form.selectedRuns !== undefined
        ? `${form.selectedRuns}`
        : undefined;
    }

    switch (form.extraType) {
      case "WIDE":
        return form.selectedRuns !== undefined
          ? `${form.selectedRuns} (Wide)`
          : "Wide";

      case "NO_BALL":
        return form.selectedRuns !== undefined
          ? `${form.selectedRuns} (No Ball)`
          : "No Ball";

      case "BYE":
        return form.selectedRuns !== undefined
          ? `${form.selectedRuns} (Bye)`
          : "Bye";

      case "LEG_BYE":
        return form.selectedRuns !== undefined
          ? `${form.selectedRuns} (Leg Bye)`
          : "Leg Bye";

      default:
        return undefined;
    }
  })();
  return (
    /* Outer shell: fills the bottom sheet, scrollable content above sticky CTA */
    <div className="flex h-full max-h-[85dvh] flex-col">
      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-1 pb-2 space-y-3">
        {/* 1. Header */}
        <div className="flex flex-col items-center text-center pt-1">
          <p className="text-section-label tracking-widest text-(--color-text-muted)">
            Confirm Wicket
          </p>
          <span className="font-display text-2xl font-black uppercase text-(--color-navy) leading-tight">
            {form.wicketType?.replace(/_/g, " ") ?? "OUT"}
          </span>
        </div>

        {/* 2. Dismissed batter — hero card, compact */}
        <div className="rounded-2xl border-2 border-(--color-brand) bg-(--color-bg-tint) p-3 shadow-[0_4px_16px_rgba(27,63,160,0.10)] flex items-center gap-3">
          {/* Avatar */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-(--color-bg-border) bg-white shadow-sm">
            {dismissedPlayer?.playerProfileImageSnapshot ? (
              <S3Image
                imageKey={dismissedPlayer.playerProfileImageSnapshot}
                alt={dismissedPlayer.playerNameSnapshot}
                width={56}
                height={56}
                className="h-full w-full object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-(--color-navy)">
                    {dismissedPlayer.playerNameSnapshot.charAt(0)}
                  </div>
                }
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
                <span className="font-display text-lg font-black text-white tracking-widest">
                  {getInitials(dismissedPlayer?.playerNameSnapshot)}
                </span>
              </div>
            )}
            {/* Check badge */}
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-brand) shadow">
              <Check size={10} strokeWidth={3.5} className="text-white" />
            </div>
          </div>

          {/* Name + end pill */}
          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-display text-lg font-black uppercase tracking-wide text-(--color-brand) truncate">
              {dismissedPlayer?.playerNameSnapshot ?? "—"}
            </p>
            <span className="self-start rounded-full bg-(--color-brand) px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
              {form.dismissalEnd}
            </span>
          </div>
        </div>

        {/* 3. Dismissal details */}
        <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm overflow-hidden">
          <p className="text-section-label px-4 py-2 border-b border-(--color-bg-border) bg-(--color-bg-base)/60">
            Dismissal Details
          </p>

          <div className="divide-y divide-(--color-bg-border)">
            {fielders.length > 0 && (
              <DetailRow label={fielders.length > 1 ? "Fielders" : "Fielder"}>
                <div className="flex flex-col gap-1.5 items-end">
                  {fielders.map((f) => (
                    <PlayerChip key={f.playerId} player={f} />
                  ))}
                </div>
              </DetailRow>
            )}

            {wicketKeeper && (
              <DetailRow label="Keeper">
                <PlayerChip player={wicketKeeper} />
              </DetailRow>
            )}

            {runsDisplay && (
              <DetailRow label="Runs on Ball">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-black text-(--color-navy)">
                    {form.selectedRuns}
                  </span>

                  {form.extraType && (
                    <span className="rounded-full bg-(--color-bg-tint) px-2 py-0.5 text-[10px] font-bold uppercase text-(--color-brand)">
                      {form.extraType.replace("_", " ")}
                    </span>
                  )}
                </div>
              </DetailRow>
            )}

            {nextBatter && (
              <DetailRow label="Next In">
                <PlayerChip player={nextBatter} />
              </DetailRow>
            )}
          </div>
        </div>

        {/* 4. Extra checkboxes — visually prominent since they're the only interactive element */}
        {(config?.confirmOption === "WIDE_BALL" ||
          config?.confirmOption === "NO_BALL") && (
          <div className="rounded-xl border-2 border-(--color-brand)/30 bg-(--color-bg-tint) px-4 py-3">
            <p className="text-section-label mb-2.5">Extra?</p>

            {config?.confirmOption === "WIDE_BALL" && (
              <ExtraCheckbox
                label="Wide Ball"
                checked={form.extraType === "WIDE"}
                onChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    extraType: checked ? "WIDE" : undefined,
                    additionalRuns: checked ? 0 : undefined,
                  }))
                }
              />
            )}

            {config?.confirmOption === "NO_BALL" && (
              <ExtraCheckbox
                label="No Ball"
                checked={form.extraType === "NO_BALL"}
                onChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    extraType: checked ? "NO_BALL" : undefined,
                    additionalRuns: checked ? 0 : undefined,
                  }))
                }
              />
            )}
          </div>
        )}
        {config?.confirmOption === "CAN_BAT_AGAIN" && (
          <div className="rounded-xl border  p-4 border-(--color-brand)/30 bg-(--color-bg-tint)">
            <p className="text-section-label mb-3">Can bat again?</p>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="canBatAgain"
                  checked={form.canBatAgain === true}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      canBatAgain: true,
                    }))
                  }
                />
                <span>Yes</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="canBatAgain"
                  checked={form.canBatAgain === false}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      canBatAgain: false,
                    }))
                  }
                />
                <span>No</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky CTA ── */}
      <div className="shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) pt-3 pb-safe-bottom px-1">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onSubmit}
          loading={isLoading}
        >
          {isLoading ? "Recording…" : " Record Wicket"}
        </Button>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5">
      <span className="text-meta font-medium uppercase tracking-wider text-(--color-text-muted) flex-shrink-0">
        {label}
      </span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

function ExtraCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2.5 transition-colors",
        checked
          ? "bg-(--color-brand) shadow-(--shadow-button)"
          : "bg-white border border-(--color-bg-border) hover:border-(--color-brand)/50",
      )}
    >
      {/* Hidden native checkbox for a11y */}
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      {/* Custom checkbox visual */}
      <div
        className={cn(
          "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
          checked
            ? "border-white bg-white"
            : "border-(--color-brand) bg-transparent",
        )}
      >
        {checked && (
          <Check size={12} strokeWidth={3} className="text-(--color-brand)" />
        )}
      </div>

      <span
        className={cn(
          "font-display text-sm font-bold uppercase tracking-widest transition-colors",
          checked ? "text-white" : "text-(--color-navy)",
        )}
      >
        {label}
      </span>
    </label>
  );
}
