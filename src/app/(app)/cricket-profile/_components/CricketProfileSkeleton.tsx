export function CricketProfileSkeleton() {
  return (
    <div className="animate-pulse bg-(--color-bg-base)">
      <div className="bg-(--color-navy) px-4 pb-5 pt-4">
        <div className="flex items-center gap-4">
          <div className="h-23 w-23 shrink-0 rounded-full bg-white/15" />

          <div className="flex-1 space-y-3">
            <div className="h-6 w-2/3 rounded bg-white/15" />

            <div className="h-3 w-1/2 rounded bg-white/10" />

            <div className="h-3 w-full rounded bg-white/10" />

            <div className="h-3 w-4/5 rounded bg-white/10" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="h-14 rounded-xl bg-white/10" />
          <div className="h-14 rounded-xl bg-white/15" />
        </div>
      </div>

      <div className="flex gap-5 border-b border-(--color-bg-border) bg-white px-4 py-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-4 w-14 shrink-0 rounded bg-(--color-bg-border)"
          />
        ))}
      </div>

      <div className="space-y-4 p-4">
        <div className="h-32 rounded-2xl bg-(--color-bg-border)" />
        <div className="h-32 rounded-2xl bg-(--color-bg-border)" />
        <div className="h-32 rounded-2xl bg-(--color-bg-border)" />
      </div>
    </div>
  );
}
