"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { BowlingWicketTypeItem } from "@/types/performance";

const COLORS = [
  "var(--color-brand)",
  "var(--color-live)",
  "var(--color-six)",
  "var(--color-four)",
  "var(--color-violet)",
  "var(--color-sky)",
];

export default function WicketTypesPieChart({
  items,
}: {
  items: BowlingWicketTypeItem[];
}) {
  const data = items.map((item) => ({
    name: label(item.wicketType),
    value: item.wickets,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="44%"
            outerRadius={92}
            innerRadius={42}
            paddingAngle={2}
          >
            {data.map((item, index) => (
              <Cell
                key={item.name}
                fill={COLORS[index % COLORS.length]}
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

function label(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}
