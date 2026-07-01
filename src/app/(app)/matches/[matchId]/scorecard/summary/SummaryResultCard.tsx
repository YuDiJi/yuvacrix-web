"use client";

type Props = {
  resultText?: string | null;
  matchStatus?: string | null;
  hasWinner: boolean;
};

export default function SummaryResultCard({ resultText, matchStatus, hasWinner }: Props) {
  const isLive = matchStatus === "LIVE" || matchStatus === "IN_PROGRESS";
  const displayText = resultText || matchStatus;

  if (!displayText) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3 shadow-(--shadow-card)">
      <div className="flex items-center gap-2">
        {hasWinner && (
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-(--color-six) text-[11px]">
            🏆
          </span>
        )}
        <p
          className={`text-[13px] font-semibold ${
            hasWinner ? "text-(--color-brand)" : "text-(--color-text-body)"
          }`}
        >
          {resultText ?? matchStatus}
        </p>
      </div>

      {isLive && (
        <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-(--color-live) px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-(--color-text-inverse)" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-inverse)">
            Live
          </span>
        </span>
      )}
    </div>
  );
}
