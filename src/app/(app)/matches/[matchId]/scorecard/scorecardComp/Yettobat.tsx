"use client";

type ToBatPlayer = {
  playerNameSnapshot: string;
};

type Props = {
  players: ToBatPlayer[];
};

export default function YetToBat({ players }: Props) {
  if (!players || players.length === 0) return null;

  return (
    <div className="border-t border-(--color-bg-border) px-3 py-2.5">
      <p className="text-section-label mb-1">To Bat</p>
      <p className="text-body leading-relaxed">
        {players.map((p) => p.playerNameSnapshot).join(", ")}
      </p>
    </div>
  );
}
