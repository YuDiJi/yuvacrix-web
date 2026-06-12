"use client";

import { useState } from "react";
import {
  Info,
  Zap,
  ListOrdered,
  Lightbulb,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "../../../../components/common/Button"; // Adjust import path if needed

type LineupMode = "FLEXIBLE" | "FIXED";

export function LineupModeSheet({
  open,
  onClose,
  onContinue,
  loading,
  error,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: (mode: LineupMode) => void;
  loading: boolean;
  error: string;
}) {
  const [selected, setSelected] = useState<LineupMode>("FLEXIBLE");

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] bg-(--color-bg-card) shadow-[0_-8px_48px_rgba(13,27,62,0.15)] md:max-w-[430px] md:mx-auto">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1.5 w-10 rounded-full bg-(--color-bg-border)" />
        </div>

        <div className="px-5 pb-8 pt-2">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-2xl font-black uppercase tracking-[0.04em] text-(--color-navy)">
              Choose Lineup Mode
            </h3>
            <Info size={20} className="shrink-0 text-(--color-navy)" />
          </div>
          <p className="mb-6 text-sm font-medium leading-relaxed text-(--color-text-secondary)">
            Select how team lineups will be managed before the toss.
          </p>

          {/* Option cards */}
          <div className="mb-6 flex flex-col gap-4">
            {/* Flexible Lineup Card */}
            <button
              type="button"
              onClick={() => setSelected("FLEXIBLE")}
              className={cn(
                "flex flex-col rounded-2xl border-2 p-5 text-left transition-all duration-150 active:scale-[0.98]",
                selected === "FLEXIBLE"
                  ? "border-(--color-brand) bg-(--color-bg-tint) shadow-sm"
                  : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-text-muted)",
              )}
            >
              {/* Top Row: Icon & Badges */}
              <div className="mb-4 flex w-full items-center justify-between">
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    selected === "FLEXIBLE"
                      ? "bg-(--color-brand)/15 text-(--color-brand)"
                      : "bg-(--color-bg-base) text-(--color-text-muted)",
                  )}
                >
                  <Zap
                    size={22}
                    fill={selected === "FLEXIBLE" ? "currentColor" : "none"}
                  />
                </div>

                {/* Right Badges */}
                {selected === "FLEXIBLE" && (
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-(--color-live) px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                      Recommended
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-(--color-brand) text-white shadow-sm">
                      <Check size={14} strokeWidth={4} />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Row: Text */}
              <div>
                <h4 className="mb-1 font-display text-lg font-black uppercase tracking-[0.04em] text-(--color-navy)">
                  Flexible Lineup
                </h4>
                <p className="text-sm font-medium leading-snug text-(--color-text-secondary)">
                  Player order can be decided during scoring. Best for most
                  matches.
                </p>
              </div>
            </button>

            {/* Fixed Lineup Card */}
            <button
              type="button"
              onClick={() => setSelected("FIXED")}
              className={cn(
                "flex flex-col rounded-2xl border-2 p-5 text-left transition-all duration-150 active:scale-[0.98]",
                selected === "FIXED"
                  ? "border-(--color-brand) bg-(--color-bg-tint) shadow-sm"
                  : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-text-muted)",
              )}
            >
              {/* Top Row: Icon & Badges */}
              <div className="mb-4 flex w-full items-center justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    selected === "FIXED"
                      ? "bg-(--color-brand)/15 text-(--color-brand)"
                      : "bg-(--color-bg-base) text-(--color-text-muted)",
                  )}
                >
                  <ListOrdered size={22} />
                </div>

                {selected === "FIXED" && (
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-(--color-brand) text-white shadow-sm">
                      <Check size={14} strokeWidth={4} />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Row: Text */}
              <div>
                <h4 className="mb-1 font-display text-lg font-black uppercase tracking-[0.04em] text-(--color-navy)">
                  Fixed Lineup
                </h4>
                <p className="text-sm font-medium leading-snug text-(--color-text-secondary)">
                  Configure complete playing order before toss. Batting sequence
                  is locked.
                </p>
              </div>
            </button>
          </div>

          {/* Pro Tip */}
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-sm">
            <Lightbulb
              size={18}
              className="mt-0.5 shrink-0 text-(--color-brand)"
            />
            <p className="text-sm font-medium leading-relaxed text-(--color-text-secondary)">
              <strong className="font-bold text-(--color-navy)">
                Pro Tip:
              </strong>{" "}
              Use{" "}
              <strong className="font-bold text-(--color-navy)">
                Flexible Lineup
              </strong>{" "}
              for casual weekend matches to get the game started faster!
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-(--color-live)/20 bg-(--color-live)/10 px-4 py-3">
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0 text-(--color-live)"
              />
              <p className="text-sm font-semibold text-(--color-live)">
                {error}
              </p>
            </div>
          )}

          {/* Submit Button (Custom Component) */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onClick={() => onContinue(selected)}
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
}
