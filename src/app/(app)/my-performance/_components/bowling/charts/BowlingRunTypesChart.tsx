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
import type { BowlingRunComposition } from "@/types/performance";

const COLORS = [
  "var(--color-text-muted)",
  "var(--color-sky)",
  "var(--color-six)",
  "var(--color-violet)",
  "var(--color-four)",
  "var(--color-live)",
  "var(--color-navy)",
];

export default function BowlingRunTypesChart({
  data,
}: {
  data: BowlingRunComposition;
}) {
  const items = [
    { label: "Dots", value: data.dots },
    { label: "1s", value: data.ones },
    { label: "2s", value: data.twos },
    { label: "3s", value: data.threes },
    { label: "4s", value: data.fours },
    { label: "6s", value: data.sixes },
    { label: "Other", value: data.other },
  ];

  return (
    <div className="h-64 w-full">
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
          <Bar dataKey="value" radius={[5, 5, 0, 0]}>
            {items.map((item, index) => (
              <Cell
                key={item.label}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
