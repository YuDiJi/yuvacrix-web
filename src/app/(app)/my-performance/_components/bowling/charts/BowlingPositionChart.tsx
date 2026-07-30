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

export type BowlingPositionChartItem = {
  overNumber: number;
  innings: number;
  runs: number;
  wickets: number;
};

export default function BowlingPositionChart({
  items,
}: {
  items: BowlingPositionChartItem[];
}) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={items}
          margin={{ top: 15, right: 4, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--color-bg-border)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="overNumber"
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
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar
            dataKey="innings"
            name="Innings"
            fill="var(--color-sky)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="runs"
            name="Runs"
            fill="var(--color-live)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="wickets"
            name="Wickets"
            fill="var(--color-six)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
