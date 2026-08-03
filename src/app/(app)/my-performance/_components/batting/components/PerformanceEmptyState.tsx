import type { LucideIcon } from "lucide-react";
import { ChartNoAxesColumn } from "lucide-react";

type PerformanceEmptyStateProps = {
  title?: string;
  description: string;
  icon?: LucideIcon;
};

export default function PerformanceEmptyState({
  title = "No data available",
  description,
  icon: Icon = ChartNoAxesColumn,
}: PerformanceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-(--color-bg-border) bg-(--color-bg-tint) px-5 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-brand)/10 text-(--color-brand)">
        <Icon size={22} />
      </div>

      <p className="mt-3 font-(family-name:--font-display) text-base font-black uppercase tracking-wide text-(--color-text-primary)">
        {title}
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-(--color-text-secondary)">
        {description}
      </p>
    </div>
  );
}
