"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BowlingYearlyStats } from "@/types/performance";

export default function BowlingYearlyChart({
  items,
}: {
  items: BowlingYearlyStats[];
}) {
  const data = items.map((item) => ({
    year: item.year,
    wickets: item.stats.wickets,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 15, right: 4, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--color-bg-border)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-bg-border)" }}
          />
          <YAxis
            allowDecimals={false}
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
          <Bar
            dataKey="wickets"
            fill="var(--color-sky)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
