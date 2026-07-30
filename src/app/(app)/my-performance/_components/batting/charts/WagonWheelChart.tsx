"use client";

import { useId } from "react";

import type { BattingWagonWheelData } from "@/types/performance";

type WagonWheelChartProps = {
  data: BattingWagonWheelData;
};

const RUN_COLORS: Record<number, string> = {
  0: "var(--color-text-muted)",
  1: "var(--color-sky)",
  2: "var(--color-six)",
  3: "var(--color-violet)",
  4: "var(--color-four)",
  6: "var(--color-live)",
};

function normalizeCoordinate(value: number) {
  if (value >= -1 && value <= 1) {
    return value * 100;
  }

  return Math.max(-100, Math.min(100, value));
}

export default function WagonWheelChart({
  data,
}: WagonWheelChartProps) {
  const clipId = useId().replaceAll(":", "");

  return (
    <div className="mx-auto w-full max-w-[360px]">
      <svg
        viewBox="0 0 300 300"
        role="img"
        aria-label="Batting wagon wheel"
        className="h-auto w-full"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="150" cy="150" r="136" />
          </clipPath>
        </defs>

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
          opacity="0.9"
        />

        <circle
          cx="150"
          cy="150"
          r="74"
          fill="none"
          stroke="var(--color-bg-card)"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.75"
        />

        <line
          x1="150"
          y1="8"
          x2="150"
          y2="292"
          stroke="var(--color-bg-card)"
          strokeWidth="1"
          opacity="0.8"
        />
        <line
          x1="8"
          y1="150"
          x2="292"
          y2="150"
          stroke="var(--color-bg-card)"
          strokeWidth="1"
          opacity="0.8"
        />

        <g clipPath={`url(#${clipId})`}>
          {data.points.map((point, index) => {
            const normalizedX = normalizeCoordinate(point.x);
            const normalizedY = normalizeCoordinate(point.y);
            const x2 = 150 + normalizedX * 1.35;
            const y2 = 150 - normalizedY * 1.35;

            return (
              <line
                key={`${point.x}-${point.y}-${index}`}
                x1="150"
                y1="150"
                x2={x2}
                y2={y2}
                stroke={RUN_COLORS[point.runs] ?? "var(--color-brand)"}
                strokeWidth={point.runs >= 4 ? 1.8 : 1.1}
                strokeLinecap="round"
                opacity="0.8"
              />
            );
          })}
        </g>

        <circle
          cx="150"
          cy="150"
          r="5"
          fill="var(--color-navy)"
          stroke="var(--color-bg-card)"
          strokeWidth="2"
        />

        <text
          x="150"
          y="28"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-secondary)"
        >
          OFF
        </text>

        <text
          x="150"
          y="282"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-secondary)"
        >
          LEG
        </text>
      </svg>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {[
          ["Dot", 0],
          ["1s", 1],
          ["2s", 2],
          ["3s", 3],
          ["4s", 4],
          ["6s", 6],
        ].map(([label, runs]) => (
          <span
            key={String(label)}
            className="inline-flex items-center gap-1.5 rounded-full border border-(--color-bg-border) bg-(--color-bg-card) px-2.5 py-1 text-[10px] font-bold text-(--color-text-secondary)"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: RUN_COLORS[Number(runs)] }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
