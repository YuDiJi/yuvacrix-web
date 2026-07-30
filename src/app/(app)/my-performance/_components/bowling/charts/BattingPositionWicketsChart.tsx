"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BowlingBattingPositionItem } from "@/types/performance";

const COLORS = [
  "var(--color-sky)",
  "var(--color-live)",
  "var(--color-six)",
  "var(--color-four)",
  "var(--color-violet)",
];

export default function BattingPositionWicketsChart({
  items,
}: {
  items: BowlingBattingPositionItem[];
}) {
  return (
    <div className="h-72 w-full">
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
            dataKey="label"
            tick={{ fontSize: 9, fill: "var(--color-text-muted)" }}
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
          <Bar dataKey="wickets" radius={[5, 5, 0, 0]}>
            {items?.map((item, index) => (
              <Cell key={item.key} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
