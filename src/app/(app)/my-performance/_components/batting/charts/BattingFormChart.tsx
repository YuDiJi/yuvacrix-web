"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { BattingRecentInnings } from "@/types/performance";

type BattingFormChartProps = {
  innings: BattingRecentInnings[];
};

export default function BattingFormChart({
  innings,
}: BattingFormChartProps) {
  const data = [...innings]
    .reverse()
    .map((item, index) => ({
      label: `${index + 1}`,
      runs: item.runs,
      balls: item.balls,
      opponent: item.opponentTeamName,
    }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--color-bg-border)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-bg-border)" }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--color-bg-border)",
              background: "var(--color-bg-card)",
              fontSize: 12,
            }}
            formatter={(value) => [`${value}`, "Runs"]}
          />
          <Line
            type="monotone"
            dataKey="runs"
            stroke="var(--color-brand)"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "var(--color-bg-card)",
              stroke: "var(--color-brand)",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "var(--color-brand)",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
