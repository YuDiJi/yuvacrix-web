"use client";

import { SquadPlayer } from "@/types/scorecard";
import SquadPlayerCard from "./Squadplayercard";

type Props = {
  title: string;
  players: SquadPlayer[];
};

export default function SquadSection({ title, players }: Props) {
  if (!players || players.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-section-label px-1">{title}</p>
      <div className="flex flex-col gap-2">
        {players.map((p) => (
          <SquadPlayerCard key={p.playerId} player={p} />
        ))}
      </div>
    </div>
  );
}
