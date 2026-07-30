"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { BattingDismissalItem } from "@/types/performance";

type DismissalPieChartProps = {
  items: BattingDismissalItem[];
};

const PIE_COLORS = [
  "var(--color-brand)",
  "var(--color-live)",
  "var(--color-six)",
  "var(--color-four)",
  "var(--color-violet)",
  "var(--color-sky)",
  "var(--color-text-muted)",
];

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function DismissalPieChart({
  items,
}: DismissalPieChartProps) {
  const chartData = items.map((item) => ({
    name: formatEnum(item.dismissalType),
    value: item.dismissals,
    percentage: item.percentage,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={88}
            innerRadius={42}
            paddingAngle={2}
          >
            {chartData.map((item, index) => (
              <Cell
                key={item.name}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
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

          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: 10 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
