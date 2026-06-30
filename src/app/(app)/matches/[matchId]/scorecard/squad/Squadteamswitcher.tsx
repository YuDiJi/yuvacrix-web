"use client";

export type SquadTeamSide = "teamA" | "teamB";

type Props = {
  teamALabel: string;
  teamBLabel: string;
  active: SquadTeamSide;
  onChange: (side: SquadTeamSide) => void;
};

export default function SquadTeamSwitcher({
  teamALabel,
  teamBLabel,
  active,
  onChange,
}: Props) {
  const options: { side: SquadTeamSide; label: string }[] = [
    { side: "teamA", label: teamALabel },
    { side: "teamB", label: teamBLabel },
  ];

  return (
    <div className="flex gap-2 px-3 pt-3">
      {options.map(({ side, label }) => {
        const isActive = side === active;
        return (
          <button
            key={side}
            onClick={() => onChange(side)}
            className={`flex-1 rounded-xl border px-3 py-2.5 text-center transition-colors ${
              isActive
                ? "border-(--color-navy) bg-(--color-navy)"
                : "border-(--color-bg-border) bg-(--color-bg-card)"
            }`}
          >
            <span
              className={`truncate font-display text-[13px] font-bold uppercase tracking-wide ${
                isActive ? "text-(--color-text-inverse)" : "text-(--color-navy)"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
