"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { BowlingBattingPositionItem } from "@/types/cricket/performance";

type BattingPositionWicketsChartProps = {
  items: BowlingBattingPositionItem[];
};

const BAR_COLORS = [
  "var(--color-sky)",
  "var(--color-live)",
  "var(--color-six)",
  "var(--color-four)",
  "var(--color-violet)",
  "var(--color-brand)",
  "var(--color-navy)",
];

export default function BattingPositionWicketsChart({
  items,
}: BattingPositionWicketsChartProps) {
  const chartData = [...items]
    .sort((a, b) => a.battingOrder - b.battingOrder)
    .map((item) => ({
      ...item,
      positionLabel: String(item.battingOrder),
    }));

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
            dataKey="positionLabel"
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
              offset: -2,
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
            label={{
              value: "Wickets",
              angle: -90,
              position: "insideLeft",
              fontSize: 10,
              fill: "var(--color-text-muted)",
            }}
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
              const wickets = Number(value);

              const payload = tooltipItem.payload as
                | BowlingBattingPositionItem
                | undefined;

              if (!Number.isFinite(wickets)) {
                return ["—", payload?.label ?? "Batting position"];
              }

              return [
                `${wickets} wicket${wickets === 1 ? "" : "s"} · ${
                  payload?.percentage ?? 0
                }%`,
                payload?.label ?? "Batting position",
              ];
            }}
          />

          <Bar
            dataKey="wickets"
            name="Wickets"
            radius={[6, 6, 0, 0]}
            maxBarSize={46}
          >
            {chartData.map((item, index) => (
              <Cell
                key={`${item.battingOrder}-${item.label}`}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}

            <LabelList
              dataKey="percentage"
              position="top"
              formatter={(value) => {
                const percentage = Number(value);

                if (!Number.isFinite(percentage) || percentage <= 0) {
                  return "";
                }

                return `${percentage.toFixed(0)}%`;
              }}
              style={{
                fill: "var(--color-text-secondary)",
                fontSize: 9,
                fontWeight: 700,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
