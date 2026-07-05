"use client";

import { S3Image } from "@/components/common/S3Image";
import { MvpPlayer } from "@/types/scorecard";

type Props = {
  player: MvpPlayer;
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

export default function MvpCandidateCard({ player }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-(--color-bg-border) shadow-(--shadow-hero)">
      {/* Gradient navy header */}
      <div
        className="px-4 pb-5 pt-4"
        style={{
          background:
            "linear-gradient(135deg, var(--color-navy) 0%, var(--color-brand) 100%)",
        }}
      >
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-(--color-sky)">
          Player of the Match Candidate
        </p>

        <div className="mt-3 flex flex-col items-center">
          {/* Avatar */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-(--color-text-inverse)/30 bg-white shadow-(--shadow-hero)">
            {player.profileImageSnapshot ? (
              <S3Image
                imageKey={player.profileImageSnapshot}
                alt={player.playerNameSnapshot}
                // width={80}
                // height={80}
                className="h-full w-full object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-(--color-navy)">
                    {player.playerNameSnapshot.charAt(0)}
                  </div>
                }
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
                <span className="font-display text-2xl font-black text-(--color-text-inverse)">
                  {getInitials(player.playerNameSnapshot)}
                </span>
              </div>
            )}
          </div>

          {/* Name + team */}
          <p className="mt-2.5 font-display text-[19px] font-black uppercase tracking-wide text-(--color-text-inverse)">
            {player.playerNameSnapshot}
          </p>
          <p className="text-[12px] italic text-(--color-sky)">
            {player.teamNameSnapshot}
          </p>

          {/* MVP Score */}
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-display text-[40px] font-black leading-none text-(--color-text-inverse)">
              {player.mvpScore}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-(--color-sky)">
              MVP Score
            </span>
          </div>

          {/* Reason */}
          {player.reason && (
            <span className="mt-3 rounded-full bg-(--color-text-inverse)/15 px-3.5 py-1 text-[11px] font-semibold text-(--color-text-inverse)">
              {player.reason}
            </span>
          )}
        </div>
      </div>

      {/* White footer */}
      <div className="bg-(--color-bg-card) px-4 py-2.5 text-center">
        <p className="text-meta">Calculated from match performance data</p>
      </div>
    </div>
  );
}
