"use client";

import { Circle, Clock, Settings } from "lucide-react";

import { DialogBottom } from "@/components/common/DialogBottom";
import { cn } from "@/lib/cn";

type ShortcutAction = "MATCH_RULES" | "MATCH_OVERS" | "WAGON_WHEEL";

type ScoringShortcutsSheetProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (action: ShortcutAction) => void;
};

const shortcuts = [
  {
    key: "MATCH_RULES" as const,
    label: "Match Rules",
    description: "Change scoring and match rules",
    icon: Settings,
  },
  {
    key: "MATCH_OVERS" as const,
    label: "Match Overs",
    description: "Change total overs",
    icon: Clock,
  },
  {
    key: "WAGON_WHEEL" as const,
    label: "Wagon Wheel",
    description: "Configure shot directions",
    icon: Circle,
  },
];

export function ScoringShortcutsSheet({
  open,
  onClose,
  onSelect,
}: ScoringShortcutsSheetProps) {
  return (
    <DialogBottom open={open} onClose={onClose}>
      <div className="pb-2">
        <div className="text-center">
          <h2 className="font-display text-xl font-black uppercase tracking-[0.04em] text-(--color-navy)">
            Scoring Shortcuts
          </h2>

          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Quick match settings while scoring
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;

            return (
              <button
                key={shortcut.key}
                type="button"
                onClick={() => onSelect(shortcut.key)}
                className={cn(
                  "flex min-h-28 flex-col items-center justify-center rounded-2xl",
                  "border border-(--color-bg-border) bg-(--color-bg-card)",
                  "px-3 py-4 text-center shadow-sm transition-all",
                  "hover:border-(--color-brand)/30 hover:bg-(--color-bg-tint)",
                  "active:scale-[0.97]",
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--color-bg-tint) text-(--color-brand)">
                  <Icon size={22} strokeWidth={2} />
                </div>

                <p className="mt-2 font-display text-sm font-black uppercase text-(--color-navy)">
                  {shortcut.label}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-(--color-text-muted)">
                  {shortcut.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </DialogBottom>
  );
}
