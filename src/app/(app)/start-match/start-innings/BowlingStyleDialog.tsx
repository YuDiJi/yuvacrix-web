import { cn } from "@/lib/cn";
import { BowlingStyle } from "@/types/cricket/player";
import { Check } from "lucide-react";
import { useState } from "react";

const BOWLING_STYLES: BowlingStyle[] = [
  "RIGHT_ARM_FAST",
  "RIGHT_ARM_FAST_MEDIUM",
  "RIGHT_ARM_MEDIUM",
  "RIGHT_ARM_OFF_BREAK",
  "RIGHT_ARM_LEG_BREAK",
  "LEFT_ARM_FAST",
  "LEFT_ARM_FAST_MEDIUM",
  "LEFT_ARM_ORTHODOX",
  "LEFT_ARM_WRIST_SPIN",
];

export function BowlingStyleDialog({
  playerName,
  onConfirm,
  onCancel,
}: {
  playerName: string;
  onConfirm: (style: BowlingStyle) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<BowlingStyle | null>(null);

  const formatBowlingStyle = (style: BowlingStyle) =>
    style
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <>
      <div
        className="absolute inset-0 z-50"
        style={{
          background: "rgba(13,27,62,0.60)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div className="absolute inset-x-4 top-1/2 z-50 -translate-y-1/2 flex flex-col max-h-[85%] overflow-hidden rounded-3xl bg-(--color-bg-card) shadow-[0_20px_60px_rgba(13,27,62,0.35)]">
        <div className="fixture-bar flex flex-col flex-1 overflow-hidden rounded-3xl">
          <div className="shrink-0 px-5 pt-5 pb-4 border-b border-(--color-bg-border)">
            <h3
              className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-navy)"
              style={{ letterSpacing: "0.04em" }}
            >
              Bowling Style
            </h3>
            <p className="mt-1 text-sm text-(--color-text-secondary)">
              What&apos;s the style of{" "}
              <span className="font-bold text-(--color-text-primary)">
                {playerName}
              </span>
              ?
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-2.5">
              {BOWLING_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelected(style)}
                  className={cn(
                    "relative flex min-h-18 items-center justify-center rounded-2xl border-2 px-3 py-3.5 text-center transition-all duration-150 active:scale-[0.97]",
                    selected === style
                      ? "border-(--color-brand) bg-(--color-bg-tint) shadow-[0_2px_12px_rgba(27,63,160,0.14)]"
                      : "border-(--color-bg-border) bg-(--color-bg-base) hover:border-(--color-sky)/40",
                  )}
                >
                  {selected === style && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-brand)">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-sm font-semibold leading-snug",
                      selected === style
                        ? "font-black text-(--color-text-primary)"
                        : "text-(--color-text-secondary)",
                    )}
                  >
                    {formatBowlingStyle(style)}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="shrink-0 flex border-t border-(--color-bg-border)">
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
