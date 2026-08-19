"use client";

import { CommentaryItem } from "@/types/cricket/scorecard";

type Props = {
  item: CommentaryItem;
};

// Derive a visual "kind" from the item so we can pick the right accent.
function getKind(item: CommentaryItem): "wicket" | "six" | "four" | "normal" {
  if (item.isWicket || item.eventType === "WICKET") return "wicket";
  if (item.eventType === "SIX" || item.runs === 6) return "six";
  if (item.eventType === "FOUR" || item.runs === 4) return "four";
  return "normal";
}

const KIND_STYLES = {
  wicket: {
    badgeBg: "bg-(--color-live)",
    badgeText: "text-(--color-text-inverse)",
    border: "border-l-(--color-live)",
    cardBg: "bg-(--color-live)/5",
  },
  four: {
    badgeBg: "bg-(--color-four)",
    badgeText: "text-(--color-text-inverse)",
    border: "border-l-(--color-four)",
    cardBg: "bg-(--color-bg-card)",
  },
  six: {
    badgeBg: "bg-(--color-six)",
    badgeText: "text-(--color-text-inverse)",
    border: "border-l-(--color-six)",
    cardBg: "bg-(--color-bg-card)",
  },
  normal: {
    badgeBg: "bg-(--color-bg-base)",
    badgeText: "text-(--color-navy)",
    border: "border-l-(--color-bg-border)",
    cardBg: "bg-(--color-bg-card)",
  },
} as const;

export default function CommentaryItemCard({ item }: Props) {
  const kind = getKind(item);
  const style = KIND_STYLES[kind];

  const bowlerToBatter =
    item.bowlerNameSnapshot && item.batterNameSnapshot
      ? `${item.bowlerNameSnapshot} to ${item.batterNameSnapshot}`
      : undefined;

  return (
    <div
      className={`flex gap-3 border-l-4 ${style.border} ${style.cardBg} rounded-r-xl border border-(--color-bg-border) px-3 py-3 shadow-(--shadow-card)`}
    >
      {/* Left: over text + marker badge stacked */}
      <div className="flex w-12 shrink-0 flex-col items-center gap-1.5 pt-0.5">
        <span className="font-display text-[12px] font-bold text-(--color-text-secondary)">
          {item.overText}
        </span>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${style.badgeBg} ${style.badgeText}`}
        >
          {item.marker ?? item.runs ?? 0}
        </span>
      </div>

      {/* Right: text content */}
      <div className="min-w-0 flex-1">
        {bowlerToBatter && (
          <p className="text-meta mb-0.5 font-medium text-(--color-text-secondary)">
            {bowlerToBatter}
          </p>
        )}

        <p className="text-body leading-snug text-(--color-text-body)">
          {item.text}
        </p>

        {item.isWicket && item.dismissalText && (
          <p className="mt-1 text-[12px] font-medium leading-snug text-(--color-live)">
            {item.dismissalText}
          </p>
        )}

        {item.createdAt && (
          <p className="mt-1 text-[10px] text-(--color-text-muted)">
            {item.createdAt}
          </p>
        )}
      </div>
    </div>
  );
}
