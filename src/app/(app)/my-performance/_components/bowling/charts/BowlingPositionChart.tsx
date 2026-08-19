"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { BowlingOverSlotItem } from "@/types/cricket/performance";

type Props = {
  items: BowlingOverSlotItem[];
};

export default function BowlingPositionChart({ items }: Props) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={items}
          margin={{
            top: 28,
            right: 6,
            bottom: 6,
            left: -18,
          }}
        >
          <CartesianGrid
            stroke="var(--color-bg-border)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tick={{
              fontSize: 10,
              fill: "var(--color-text-muted)",
            }}
            tickLine={false}
            axisLine={{
              stroke: "var(--color-bg-border)",
            }}
          />

          <YAxis
            yAxisId="wickets"
            allowDecimals={false}
            tick={{
              fontSize: 10,
              fill: "var(--color-text-muted)",
            }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            yAxisId="runs"
            orientation="right"
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
            formatter={(value, name, tooltipItem) => {
              const numericValue = Number(value);

              const item = tooltipItem.payload as
                | BowlingOverSlotItem
                | undefined;

              if (name === "Wickets") {
                return [
                  Number.isFinite(numericValue) ? numericValue : "—",
                  "Wickets",
                ];
              }

              if (name === "Runs conceded") {
                return [
                  Number.isFinite(numericValue) ? numericValue : "—",
                  "Runs conceded",
                ];
              }

              return [
                Number.isFinite(numericValue) ? numericValue : "—",
                String(name),
              ];
            }}
            labelFormatter={(_label, payload) => {
              const item = payload?.[0]?.payload as
                | BowlingOverSlotItem
                | undefined;

              if (!item) return "Over slot";

              return `${item.label} · ${item.overs} overs`;
            }}
          />

          <Legend
            wrapperStyle={{
              fontSize: 10,
            }}
          />

          <Bar
            yAxisId="wickets"
            dataKey="wickets"
            name="Wickets"
            fill="var(--color-brand)"
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          >
            <LabelList
              dataKey="wickets"
              position="top"
              formatter={(value) => {
                const wickets = Number(value);

                return Number.isFinite(wickets) && wickets > 0
                  ? String(wickets)
                  : "";
              }}
              style={{
                fill: "var(--color-text-primary)",
                fontSize: 10,
                fontWeight: 700,
              }}
            />
          </Bar>

          <Bar
            yAxisId="runs"
            dataKey="runsConceded"
            name="Runs conceded"
            fill="var(--color-live)"
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
