"use client";

import { DialogBottom } from "@/components/common/DialogBottom";
import { cn } from "@/lib/cn";

type WagonWheelSettingsSheetProps = {
  open: boolean;
  showForRunningRuns: boolean;
  showForBoundaries: boolean;
  saving: boolean;
  onClose: () => void;
  onToggleRunningRuns: (enabled: boolean) => Promise<void>;
  onToggleBoundaries: (enabled: boolean) => Promise<void>;
};

export function WagonWheelSettingsSheet({
  open,
  showForRunningRuns,
  showForBoundaries,
  saving,
  onClose,
  onToggleRunningRuns,
  onToggleBoundaries,
}: WagonWheelSettingsSheetProps) {
  return (
    <DialogBottom open={open} onClose={saving ? () => undefined : onClose}>
      <div className="pb-2">
        <div className="text-center">
          <h2 className="font-display text-xl font-black uppercase tracking-[0.04em] text-(--color-navy)">
            Wagon Wheel
          </h2>

          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Choose which scoring events ask for shot direction
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)">
          <ShortcutToggle
            label="1s, 2s & 3s"
            description="Ask for direction on running runs"
            checked={showForRunningRuns}
            disabled={saving}
            onChange={onToggleRunningRuns}
          />

          <ShortcutToggle
            label="4s & 6s"
            description="Ask for direction on boundaries"
            checked={showForBoundaries}
            disabled={saving}
            onChange={onToggleBoundaries}
          />
        </div>

        {!showForRunningRuns && !showForBoundaries && (
          <p className="mt-3 text-center text-xs text-(--color-text-muted)">
            Wagon wheel is currently disabled.
          </p>
        )}
      </div>
    </DialogBottom>
  );
}

function ShortcutToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (enabled: boolean) => Promise<void>;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => void onChange(!checked)}
      className="flex w-full items-center gap-4 border-b border-(--color-bg-border) px-4 py-4 text-left last:border-b-0 disabled:opacity-60"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-(--color-text-primary)">{label}</p>

        <p className="mt-0.5 text-xs text-(--color-text-muted)">
          {description}
        </p>
      </div>

      <div
        role="switch"
        aria-checked={checked}
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors",
          checked ? "bg-(--color-brand)" : "bg-(--color-bg-border)",
        )}
      >
        <span
          className={cn(
            "absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </div>
    </button>
  );
}
