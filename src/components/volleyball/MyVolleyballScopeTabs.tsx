import { cn } from "@/lib/cn";
import {
  VOLLEYBALL_MY_SCOPES,
  type VolleyballMyScope,
} from "@/types/volleyball/myVolleyball";

const OPTIONS: Array<{ value: VolleyballMyScope; label: string }> = [
  { value: VOLLEYBALL_MY_SCOPES.ALL, label: "All" },
  { value: VOLLEYBALL_MY_SCOPES.PLAYED, label: "Played" },
  { value: VOLLEYBALL_MY_SCOPES.CREATED, label: "Created" },
  { value: VOLLEYBALL_MY_SCOPES.NETWORK, label: "Network" },
];

export function MyVolleyballScopeTabs({
  value,
  onChange,
}: {
  value: VolleyballMyScope;
  onChange: (value: VolleyballMyScope) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Relationship scope"
      className="scrollbar-hide flex gap-1.5 overflow-x-auto rounded-xl bg-(--color-bg-card) p-1"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-8 min-w-16 shrink-0 rounded-lg px-3 text-[9px] font-black uppercase tracking-wide transition-colors",
            value === option.value
              ? "bg-(--color-brand) text-white shadow-sm"
              : "text-(--color-text-secondary) hover:bg-(--color-bg-base)",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

