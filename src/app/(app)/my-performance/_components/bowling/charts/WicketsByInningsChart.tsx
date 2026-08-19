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

import type { BowlingWicketsByInningsItem } from "@/types/cricket/performance";

type Props = {
  items: BowlingWicketsByInningsItem[];
};

const BAR_COLORS = [
  "var(--color-text-muted)",
  "var(--color-sky)",
  "var(--color-brand)",
  "var(--color-six)",
  "var(--color-live)",
];

export default function WicketsByInningsChart({ items }: Props) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={items}
          margin={{
            top: 26,
            right: 4,
            bottom: 4,
            left: -22,
          }}
        >
          <CartesianGrid
            stroke="var(--color-bg-border)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="wicketBucket"
            tickFormatter={(value) =>
              Number(value) >= 4 ? "4+" : String(value)
            }
            tick={{
              fontSize: 10,
              fill: "var(--color-text-muted)",
            }}
            tickLine={false}
            axisLine={{
              stroke: "var(--color-bg-border)",
            }}
            label={{
              value: "Wickets in an innings",
              position: "insideBottom",
              offset: -2,
              fontSize: 9,
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
              const innings = Number(value);

              const item = tooltipItem.payload as
                | BowlingWicketsByInningsItem
                | undefined;

              return [
                Number.isFinite(innings)
                  ? `${innings} innings · ${item?.percentage ?? 0}%`
                  : "—",
                item?.label ?? "Bowling innings",
              ];
            }}
          />

          <Bar
            dataKey="innings"
            name="Innings"
            radius={[6, 6, 0, 0]}
            maxBarSize={44}
          >
            {items.map((item, index) => (
              <Cell
                key={item.wicketBucket}
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

                return `${formatNumber(percentage)}%`;
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

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
