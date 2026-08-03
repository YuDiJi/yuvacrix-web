"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyPerformanceSectionProps = {
  children: ReactNode;
  onVisible: () => void;
  placeholder?: ReactNode;
  rootMargin?: string;
};

export default function LazyPerformanceSection({
  children,
  onVisible,
  placeholder,
  rootMargin = "240px 0px",
}: LazyPerformanceSectionProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  useEffect(() => {
    const element = rootRef.current;

    if (!element || hasEnteredViewport) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setHasEnteredViewport(true);
      onVisible();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setHasEnteredViewport(true);
        onVisible();
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasEnteredViewport, onVisible, rootMargin]);

  return (
    <div ref={rootRef}>
      {hasEnteredViewport
        ? children
        : placeholder ?? (
            <div className="h-48 animate-pulse rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)" />
          )}
    </div>
  );
}
