"use client";

import type { BowlingWagonWheelData } from "@/types/performance";

const COLORS: Record<number, string> = {
  0: "var(--color-text-muted)",
  1: "var(--color-sky)",
  2: "var(--color-six)",
  3: "var(--color-violet)",
  4: "var(--color-four)",
  6: "var(--color-live)",
};

function normalize(value: number) {
  if (value >= -1 && value <= 1) return value * 100;
  return Math.max(-100, Math.min(100, value));
}

export default function BowlingWagonWheelChart({
  data,
}: {
  data: BowlingWagonWheelData;
}) {
  return (
    <div className="mx-auto w-full max-w-[360px]">
      <svg
        viewBox="0 0 300 300"
        role="img"
        aria-label="Bowling wagon wheel"
        className="h-auto w-full"
      >
        <circle
          cx="150"
          cy="150"
          r="142"
          fill="var(--color-four)"
          opacity="0.16"
          stroke="var(--color-six)"
          strokeWidth="3"
        />
        <circle
          cx="150"
          cy="150"
          r="112"
          fill="none"
          stroke="var(--color-bg-card)"
          strokeWidth="1.5"
        />
        <circle
          cx="150"
          cy="150"
          r="74"
          fill="none"
          stroke="var(--color-bg-card)"
          strokeDasharray="4 4"
        />
        {data.points.map((point, index) => (
          <line
            key={`${point.x}-${point.y}-${index}`}
            x1="150"
            y1="150"
            x2={150 + normalize(point.x) * 1.35}
            y2={150 - normalize(point.y) * 1.35}
            stroke={COLORS[point.runs] ?? "var(--color-brand)"}
            strokeWidth={point.runs >= 4 ? 1.8 : 1.1}
            strokeLinecap="round"
            opacity="0.8"
          />
        ))}
        <circle
          cx="150"
          cy="150"
          r="5"
          fill="var(--color-navy)"
          stroke="var(--color-bg-card)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
