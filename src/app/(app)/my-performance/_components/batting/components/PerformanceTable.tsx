import type { ReactNode } from "react";

export type PerformanceTableColumn<T> = {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  render: (row: T) => ReactNode;
  className?: string;
};

type PerformanceTableProps<T> = {
  rows: T[];
  columns: PerformanceTableColumn<T>[];
  getRowKey: (row: T, index: number) => string;
  minWidth?: number;
  emptyMessage?: string;
};

function alignmentClass(align: PerformanceTableColumn<unknown>["align"]) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export default function PerformanceTable<T>({
  rows,
  columns,
  getRowKey,
  minWidth = 620,
  emptyMessage = "No data available.",
}: PerformanceTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-8 text-center text-sm text-(--color-text-secondary)">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-none">
      <table className="w-full border-collapse" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-(--color-bg-border) bg-(--color-bg-tint)">
            {columns.map((column) => (
              <th
                key={column.key}
                className={[
                  "whitespace-nowrap px-3 py-2.5 text-[9px] font-bold uppercase tracking-wide text-(--color-text-muted)",
                  alignmentClass(column.align),
                  column.className ?? "",
                ].join(" ")}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={getRowKey(row, index)}
              className="border-b border-(--color-bg-border) last:border-0"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={[
                    "whitespace-nowrap px-3 py-3 text-xs font-medium text-(--color-text-primary)",
                    alignmentClass(column.align),
                    column.className ?? "",
                  ].join(" ")}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
