// src/app/(app)/add-tournaments-series/_components/ChipSelect.tsx

import { cn } from "@/lib/cn";

interface ChipOption<T extends string> {
  label: string;
  value: T;
  /** Optional dot color for ball-type options */
  dotColor?: string;
}

interface ChipSelectProps<T extends string> {
  label: string;
  required?: boolean;
  options: ChipOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  hint?: string;
  /** Allow wrapping into multiple rows (default true) */
  wrap?: boolean;
}

export function ChipSelect<T extends string>({
  label,
  required,
  options,
  value,
  onChange,
  hint,
  wrap = true,
}: ChipSelectProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-text-secondary)">
        {label}
        {required && <span className="ml-0.5 text-(--color-live)"> *</span>}
      </label>

      {/* Chips */}
      <div
        className={cn(
          "flex gap-2",
          wrap ? "flex-wrap" : "flex-nowrap overflow-x-auto",
        )}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border-2 px-4 py-2 transition-all duration-150 active:scale-95",
                "font-(family-name:--font-display) text-[11px] font-bold uppercase tracking-[0.05em]",
                isSelected
                  ? "border-(--color-brand) bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.30)]"
                  : "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary) hover:border-(--color-brand)/40",
              )}
            >
              {opt.dotColor && (
                <span
                  className="h-3 w-3 rounded-full border border-white/20 shrink-0"
                  style={{ background: opt.dotColor }}
                />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>

      {hint && (
        <p className="text-[11px] italic text-(--color-text-muted)">{hint}</p>
      )}
    </div>
  );
}
