"use client";

type StatItem = {
  label: string;
  value: string;
};

type Props = {
  title: string;
  player?: { playerNameSnapshot: string; teamNameSnapshot: string; profileImageSnapshot?: string | null } | null;
  stats: StatItem[];
  accent?: "brand" | "sky";
};

function getInitials(name?: string): string {
  if (!name) return "P";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function MvpStatCard({ title, player, stats, accent = "brand" }: Props) {
  const accentColor = accent === "sky" ? "bg-(--color-sky)" : "bg-(--color-brand)";

  if (!player) {
    return (
      <div className="flex-1 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-(--shadow-card)">
        <p className="text-section-label mb-2">{title}</p>
        <p className="text-meta">Not available.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
      {/* Header strip */}
      <div className={`px-3 py-1.5 ${accentColor}`}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-inverse)">
          {title}
        </p>
      </div>

      <div className="p-3">
        {/* Player */}
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-(--color-bg-border) bg-white">
            {player.profileImageSnapshot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={player.profileImageSnapshot}
                alt={player.playerNameSnapshot}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
                <span className="font-display text-[11px] font-black text-(--color-text-inverse)">
                  {getInitials(player.playerNameSnapshot)}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-[12.5px] font-bold uppercase tracking-wide text-(--color-navy)">
              {player.playerNameSnapshot}
            </p>
            <p className="truncate text-[10.5px] italic text-(--color-text-secondary)">
              {player.teamNameSnapshot}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5 border-t border-(--color-bg-border) pt-2.5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">
                {s.label}
              </span>
              <span className="text-[13px] font-bold text-(--color-navy)">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
