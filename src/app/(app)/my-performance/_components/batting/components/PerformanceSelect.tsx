"use client";

import { ChevronDown } from "lucide-react";

export type PerformanceSelectOption<T extends string = string> = {
  value: T;
  label: string;
};

type PerformanceSelectProps<T extends string = string> = {
  value: T;
  options: PerformanceSelectOption<T>[];
  onChange: (value: T) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export default function PerformanceSelect<T extends string = string>({
  value,
  options,
  onChange,
  label,
  className = "",
  disabled = false,
}: PerformanceSelectProps<T>) {
  return (
    <label className={["block min-w-0", className].join(" ")}>
      {label && (
        <span className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-(--color-text-muted)">
          {label}
        </span>
      )}

      <span className="relative block">
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value as T)}
          className="h-10 w-full appearance-none border-0 border-b border-(--color-bg-border) bg-transparent px-1 pr-7 text-xs font-semibold text-(--color-text-primary) outline-none transition focus:border-(--color-brand) disabled:cursor-not-allowed disabled:opacity-50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
        />
      </span>
    </label>
  );
}
