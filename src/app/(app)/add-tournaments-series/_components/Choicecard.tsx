// src/app/(app)/add-tournaments-series/_components/ChoiceCard.tsx

import { cn } from "@/lib/cn";
import { LucideIcon } from "lucide-react";

interface ChoiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  disabled?: boolean;
  onClick: () => void;
}

export function ChoiceCard({
  icon: Icon,
  title,
  description,
  badge,
  disabled = false,
  onClick,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200",
        disabled
          ? "cursor-not-allowed border-(--color-bg-border) bg-(--color-bg-base) opacity-60"
          : "border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card) hover:border-(--color-brand)/30 hover:shadow-[0_4px_20px_rgba(27,63,160,0.10)] active:scale-[0.98]",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
          disabled ? "bg-(--color-bg-border)" : "bg-(--color-bg-tint)",
        )}
      >
        <Icon
          size={26}
          className={
            disabled ? "text-(--color-text-muted)" : "text-(--color-brand)"
          }
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-(family-name:--font-display) text-base font-black uppercase tracking-[0.03em]",
            disabled ? "text-(--color-text-muted)" : "text-(--color-navy)",
          )}
        >
          {title}
        </p>
        <p className="mt-0.5 text-sm text-(--color-text-secondary) leading-snug">
          {description}
        </p>
      </div>

      {/* Coming soon badge */}
      {badge && (
        <span className="shrink-0 rounded-full bg-(--color-bg-border) px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted)">
          {badge}
        </span>
      )}

      {/* Arrow for active */}
      {!disabled && !badge && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="shrink-0 text-(--color-text-muted)"
        >
          <path
            d="M7.5 5l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
