"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type BattingPositionChartItem = {
  battingOrder: number;
  innings: number;
  runs: number;
  average: number | null;
};

type BattingPositionChartProps = {
  items: BattingPositionChartItem[];
};

export default function BattingPositionChart({
  items,
}: BattingPositionChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={items}
          margin={{ top: 15, right: 5, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            stroke="var(--color-bg-border)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="battingOrder"
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
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar
            dataKey="innings"
            name="Innings"
            fill="var(--color-live)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="runs"
            name="Runs"
            fill="var(--color-sky)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="average"
            name="Average"
            fill="var(--color-six)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
