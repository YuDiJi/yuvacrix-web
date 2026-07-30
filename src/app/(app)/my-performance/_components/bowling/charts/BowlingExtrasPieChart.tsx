"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { BowlingExtraItem } from "@/types/performance";

export default function BowlingExtrasPieChart({
  items,
}: {
  items: BowlingExtraItem[];
}) {
  const data = items.map((item) => ({
    name: item.extraType === "WIDE" ? "Wide" : "No ball",
    value: item.runs,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={85}
          >
            {data.map((item, index) => (
              <Cell
                key={item.name}
                fill={
                  index === 0
                    ? "var(--color-sky)"
                    : "var(--color-live)"
                }
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--color-bg-border)",
              background: "var(--color-bg-card)",
              fontSize: 12,
            }}
          />
          <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
