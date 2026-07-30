"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CircleHelp, Share2 } from "lucide-react";

type PerformanceSectionProps = {
  title: string;
  description?: string;
  helpText?: string;
  children: ReactNode;
  action?: ReactNode;
  showHelp?: boolean;
  showShare?: boolean;
  className?: string;
};

export default function PerformanceSection({
  title,
  description,
  helpText,
  children,
  action,
  showHelp = true,
  showShare = false,
  className = "",
}: PerformanceSectionProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showTooltip) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (tooltipRef.current && !tooltipRef.current.contains(target)) {
        setShowTooltip(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowTooltip(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showTooltip]);

  return (
    <section
      className={[
        "rounded-2xl border border-(--color-bg-border)",
        "bg-(--color-bg-card) shadow-(--shadow-card)",
        className,
      ].join(" ")}
    >
      <header className="relative flex items-start justify-between gap-3 rounded-t-2xl border-b border-(--color-bg-border) px-4 py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 relative">
            <h2 className="font-(family-name:--font-display) text-base font-black uppercase tracking-wide text-(--color-text-primary)">
              {title}
            </h2>

            {showHelp && helpText && (
              <div ref={tooltipRef} className=" shrink-0">
                <button
                  type="button"
                  aria-label={`About ${title}`}
                  aria-expanded={showTooltip}
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowTooltip((previous) => !previous);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-text-muted) transition hover:bg-(--color-bg-tint) hover:text-(--color-brand)"
                >
                  <CircleHelp size={15} />
                </button>

                {showTooltip && (
                  <div
                    role="tooltip"
                    className="absolute left-0 top-full z-50 mt-1 w-[min(22rem,calc(100vw-2rem))] rounded-md border border-(--color-bg-border) bg-(--color-navy) px-2 py-1 shadow-lg"
                  >
                    <span className="absolute -top-1.5 left-3 h-3 w-3 rotate-45 border-l border-t border-(--color-bg-border) bg-(--color-navy)" />

                    <p className="relative text-xs text-center leading-4 text-(--color-text-inverse)">
                      {helpText}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {description && (
            <p className="mt-0.5 text-xs leading-5 text-(--color-text-secondary)">
              {description}
            </p>
          )}
        </div>

        {action ??
          (showShare ? (
            <button
              type="button"
              aria-label={`Share ${title}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-(--color-text-secondary) transition hover:bg-(--color-bg-tint) hover:text-(--color-brand)"
            >
              <Share2 size={17} />
            </button>
          ) : null)}
      </header>

      <div className="p-4">{children}</div>
    </section>
  );
}
