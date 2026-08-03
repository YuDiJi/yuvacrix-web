"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { BattingByPosition } from "@/types/performance";

type Props = {
  items: BattingByPosition[];
};

export default function BattingPositionChart({ items }: Props) {
  const chartData = [...items].sort(
    (a, b) => a.battingPosition - b.battingPosition,
  );

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 28,
            right: 8,
            bottom: 4,
            left: -18,
          }}
        >
          <CartesianGrid
            stroke="var(--color-bg-border)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="battingPosition"
            tick={{
              fontSize: 10,
              fill: "var(--color-text-muted)",
            }}
            tickLine={false}
            axisLine={{
              stroke: "var(--color-bg-border)",
            }}
            label={{
              value: "Batting position",
              position: "insideBottom",
              offset: -3,
              fontSize: 10,
              fill: "var(--color-text-muted)",
            }}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fontSize: 10,
              fill: "var(--color-text-muted)",
            }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            cursor={{
              fill: "var(--color-bg-tint)",
            }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--color-bg-border)",
              background: "var(--color-bg-card)",
              fontSize: 12,
            }}
            formatter={(value, _name, tooltipItem) => {
              const runs = Number(value);

              const payload = tooltipItem.payload as
                | BattingByPosition
                | undefined;

              return [
                Number.isFinite(runs) ? runs : "—",
                payload?.label ?? "Runs",
              ];
            }}
            labelFormatter={(_label, payload) => {
              const item = payload?.[0]?.payload as
                | BattingByPosition
                | undefined;

              return item
                ? `${item.label} · ${formatGroup(item.group)}`
                : "Batting position";
            }}
          />

          <Bar
            dataKey="stats.runs"
            name="Runs"
            fill="var(--color-brand)"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          >
            <LabelList
              dataKey="stats.runs"
              position="top"
              formatter={(value) => {
                const runs = Number(value);

                return Number.isFinite(runs) && runs > 0 ? String(runs) : "";
              }}
              style={{
                fill: "var(--color-text-secondary)",
                fontSize: 10,
                fontWeight: 700,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatGroup(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
