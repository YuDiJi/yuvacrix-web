import type { ReactNode } from "react";

type PerformanceInsightProps = {
  value?: string | number;
  children: ReactNode;
  className?: string;
};

export default function PerformanceInsight({
  value,
  children,
  className = "",
}: PerformanceInsightProps) {
  return (
    <div
      className={[
        "flex min-h-14 items-center overflow-hidden rounded-xl",
        "border border-(--color-bg-border) bg-(--color-bg-tint)",
        className,
      ].join(" ")}
    >
      {value !== undefined && (
        <div className="flex w-20 shrink-0 items-center justify-center self-stretch border-r border-(--color-bg-border) bg-(--color-brand)/8 px-2">
          <span className="font-(family-name:--font-display) text-lg font-black text-(--color-brand)">
            {value}
          </span>
        </div>
      )}

      <div className="px-4 py-3 text-xs leading-5 text-(--color-text-primary)">
        {children}
      </div>
    </div>
  );
}
