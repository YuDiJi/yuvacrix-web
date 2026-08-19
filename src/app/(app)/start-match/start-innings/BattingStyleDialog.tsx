import { cn } from "@/lib/cn";
import { BattingStyle } from "@/types/cricket/player";
import { Check } from "lucide-react";
import { useState } from "react";

export function BattingStyleDialog({
  playerName,
  onConfirm,
  onCancel,
}: {
  playerName: string;
  onConfirm: (style: BattingStyle) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<BattingStyle | null>(null);

  return (
    <>
      <div
        className="absolute inset-0 z-50"
        style={{
          background: "rgba(13,27,62,0.60)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div className="absolute inset-x-4 top-1/2 z-50 -translate-y-1/2 overflow-hidden rounded-3xl bg-(--color-bg-card) shadow-[0_20px_60px_rgba(13,27,62,0.35)]">
        <div className="fixture-bar rounded-3xl overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-(--color-bg-border)">
            <h3
              className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-live)"
              style={{ letterSpacing: "0.04em" }}
            >
              Batting Style
            </h3>
            <p className="mt-1 text-sm text-(--color-text-secondary)">
              What&apos;s the style of{" "}
              <span className="font-bold text-(--color-text-primary)">
                {playerName}
              </span>
              ?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4">
            {(["RIGHT_HAND_BAT", "LEFT_HAND_BAT"] as BattingStyle[]).map(
              (value) => (
                <button
                  key={value}
                  onClick={() => setSelected(value)}
                  className={cn(
                    "relative flex flex-col items-center gap-4 rounded-2xl border-2 py-6 px-3 transition-all duration-150 active:scale-[0.97]",
                    selected === value
                      ? "border-(--color-brand) bg-(--color-bg-tint) shadow-[0_2px_12px_rgba(27,63,160,0.14)]"
                      : "border-(--color-bg-border) bg-(--color-bg-base) hover:border-(--color-sky)/40",
                  )}
                >
                  {selected === value && (
                    <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-brand)">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </span>
                  )}
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="28"
                      cy="28"
                      r="26"
                      fill="var(--color-bg-border)"
                    />
                    <circle
                      cx="28"
                      cy="16"
                      r="5"
                      fill="var(--color-text-secondary)"
                      opacity="0.7"
                    />
                    <rect
                      x="24"
                      y="21"
                      width="8"
                      height="13"
                      rx="2.5"
                      fill="var(--color-text-secondary)"
                      opacity="0.7"
                    />
                    {value === "LEFT_HAND_BAT" ? (
                      <rect
                        x="12"
                        y="24"
                        width="14"
                        height="3.5"
                        rx="1.75"
                        fill="var(--color-text-secondary)"
                        opacity="0.8"
                        transform="rotate(20 12 24)"
                      />
                    ) : (
                      <rect
                        x="30"
                        y="24"
                        width="14"
                        height="3.5"
                        rx="1.75"
                        fill="var(--color-text-secondary)"
                        opacity="0.8"
                        transform="rotate(-20 30 24)"
                      />
                    )}
                    <rect
                      x="23"
                      y="34"
                      width="4"
                      height="10"
                      rx="2"
                      fill="var(--color-text-secondary)"
                      opacity="0.6"
                    />
                    <rect
                      x="29"
                      y="34"
                      width="4"
                      height="10"
                      rx="2"
                      fill="var(--color-text-secondary)"
                      opacity="0.6"
                    />
                  </svg>
                  <span
                    className={cn(
                      "text-sm font-bold text-center",
                      selected === value
                        ? "text-(--color-text-primary)"
                        : "text-(--color-text-secondary)",
                    )}
                  >
                    {value === "LEFT_HAND_BAT"
                      ? "Left Hand Bat"
                      : "Right Hand Bat"}
                  </span>
                </button>
              ),
            )}
          </div>

          <div className="flex border-t border-(--color-bg-border)">
            <button
              onClick={onCancel}
              className="flex-1 py-4 font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em] text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
            >
              Cancel
            </button>
            <div className="w-px self-stretch bg-(--color-bg-border)" />
            <button
              onClick={() => selected && onConfirm(selected)}
              disabled={!selected}
              className={cn(
                "flex-1 rounded-br-3xl py-4 font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em] text-white transition-all active:scale-[0.97]",
                selected
                  ? "bg-(--color-brand)"
                  : "cursor-not-allowed bg-(--color-bg-border) text-(--color-text-muted)",
              )}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
