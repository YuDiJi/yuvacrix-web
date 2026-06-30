export type CommentaryFilterKey = "ALL" | "WICKET" | "FOUR" | "SIX";

type Props = {
  active: CommentaryFilterKey;
  onChange: (filter: CommentaryFilterKey) => void;
};

const FILTERS: { key: CommentaryFilterKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "WICKET", label: "Wickets" },
  { key: "FOUR", label: "4s" },
  { key: "SIX", label: "6s" },
];

export default function CommentaryFilters({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto px-3 py-2.5 scrollbar-hide">
      {FILTERS.map((f) => {
        const isActive = f.key === active;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide transition-colors ${
              isActive
                ? "border-(--color-brand) bg-(--color-brand) text-(--color-text-inverse)"
                : "border-(--color-bg-border) bg-(--color-bg-card) text-(--color-text-secondary)"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
