"use client";

import { S3Image } from "@/components/common/S3Image";
import { SquadPlayer } from "@/types/cricket/scorecard";

type Props = {
  player: SquadPlayer;
  align?: "left" | "right";
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

export default function SquadPlayerCard({ player, align = "left" }: Props) {
  const badges: { label: string; bg: string; text: string }[] = [];

  if (player.isCaptain) {
    badges.push({
      label: "C",
      bg: "bg-(--color-navy)",
      text: "text-(--color-text-inverse)",
    });
  }
  if (player.isViceCaptain) {
    badges.push({
      label: "VC",
      bg: "bg-(--color-brand)",
      text: "text-(--color-text-inverse)",
    });
  }
  if (player.isWicketKeeper) {
    badges.push({
      label: "WK",
      bg: "bg-(--color-sky)",
      text: "text-(--color-text-inverse)",
    });
  }
  if (player.isSubstitute) {
    badges.push({
      label: "SUB",
      bg: "bg-(--color-bg-base)",
      text: "text-(--color-text-secondary)",
    });
  }

  const avatar = (
    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-(--color-bg-border) bg-white">
      {player.profileImageSnapshot ? (
        <S3Image
          imageKey={player.profileImageSnapshot}
          alt={player.playerNameSnapshot}
          width={36}
          height={36}
          className="h-full w-full object-cover"
          fallback={
            <div className="flex h-full w-full items-center justify-center rounded-full bg-(--color-navy)">
              {player.playerNameSnapshot.charAt(0)}
            </div>
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
          <span className="font-display text-[11px] font-black text-(--color-text-inverse)">
            {getInitials(player.playerNameSnapshot)}
          </span>
        </div>
      )}
    </div>
  );

  const info = (
    <div className={`min-w-0 flex-1 ${align === "right" ? "text-right" : ""}`}>
      <p
        className={`truncate font-display text-[12.5px] font-bold uppercase tracking-wide text-(--color-navy) ${
          align === "right" ? "text-right" : ""
        }`}
      >
        {player.playerNameSnapshot}
      </p>
      {(player.roleTags && player.roleTags.length > 0) || badges.length > 0 ? (
        <div
          className={`mt-0.5 flex flex-wrap items-center gap-1 ${
            align === "right" ? "justify-end" : ""
          }`}
        >
          {player.roleTags && player.roleTags.length > 0 && (
            <span className="text-meta truncate">
              {player.roleTags.join(" • ")}
            </span>
          )}
          {badges.map((b) => (
            <span
              key={b.label}
              className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[8px] font-bold ${b.bg} ${b.text}`}
            >
              {b.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      className={`flex items-center gap-2 py-2.5 ${
        align === "right" ? "flex-row-reverse" : ""
      }`}
    >
      {avatar}
      {info}
    </div>
  );
}
