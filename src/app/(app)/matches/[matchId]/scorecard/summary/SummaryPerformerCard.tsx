"use client";

import { S3Image } from "@/components/common/S3Image";
import { MvpPlayer } from "@/types/scorecard";

type Props = {
  title: string;
  performer: MvpPlayer;
  kind: "player_of_match" | "batter" | "bowler" | "star";
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

// Label colour per card type
const LABEL_COLORS: Record<Props["kind"], string> = {
  player_of_match: "bg-(--color-six)",
  batter: "bg-(--color-brand)",
  bowler: "bg-(--color-sky)",
  star: "bg-(--color-violet)",
};

export default function SummaryPerformerCard({
  title,
  performer,
  kind,
}: Props) {
  const labelBg = LABEL_COLORS[kind];

  // batting stat line  e.g. "54(32) · 2×4 · 1×6 · SR 168.75"
  const battingLine = performer.batting
    ? [
        performer.batting.runs != null && performer.batting.balls != null
          ? `${performer.batting.runs}(${performer.batting.balls})`
          : performer.batting.runs != null
            ? `${performer.batting.runs} runs`
            : null,
        performer.batting.fours != null ? `${performer.batting.fours}×4` : null,
        performer.batting.sixes != null ? `${performer.batting.sixes}×6` : null,
        performer.batting.strikeRate != null
          ? `SR ${Number(performer.batting.strikeRate).toFixed(2)}`
          : null,
      ]
        .filter(Boolean)
        .join("  ·  ")
    : null;

  // bowling stat line  e.g. "1.0-0-2-3"
  const bowlingLine = performer.bowling
    ? [
        performer.bowling.overs != null
          ? `${performer.bowling.overs}-0-${performer.bowling.runsConceded ?? "?"}-${performer.bowling.wickets ?? "?"}`
          : null,
        performer.bowling.economy != null
          ? `Eco ${Number(performer.bowling.economy).toFixed(2)}`
          : null,
      ]
        .filter(Boolean)
        .join("  ·  ")
    : null;

  const statsLine =
    battingLine && bowlingLine
      ? `${battingLine}  |  ${bowlingLine}`
      : (battingLine ?? bowlingLine ?? null);

  return (
    <div className="overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-hero)">
      {/* Large player photo area */}
      <div className="relative h-56 w-full bg-(--color-navy)">
        {performer.profileImageSnapshot ? (
          <S3Image
            imageKey={performer.profileImageSnapshot}
            alt={performer.playerNameSnapshot}
            width={300}
            height={224}
            className="h-full w-full object-cover"
            fallback={
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-brand)">
                <span className="font-bold text-white">
                  {getInitials(performer.playerNameSnapshot)}
                </span>
              </div>
            }
          />
        ) : (
          /* Initials fallback fills the whole hero area */
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-[64px] font-black text-(--color-text-inverse)/30">
              {getInitials(performer.playerNameSnapshot)}
            </span>
          </div>
        )}

        {/* Gradient scrim so label is readable on any photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(13,27,62,0.70) 0%, rgba(13,27,62,0.15) 55%, transparent 100%)",
          }}
        />

        {/* Card-type label — bottom-left overlay */}
        <span
          className={`absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-(--color-text-inverse) ${labelBg}`}
        >
          {title}
        </span>
      </div>

      {/* Info row below the photo */}
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="font-display text-[16px] font-black uppercase tracking-wide text-(--color-navy) leading-tight">
            {performer.playerNameSnapshot}
          </p>
          {performer.teamNameSnapshot && (
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-(--color-text-secondary) italic">
              {performer.teamNameSnapshot}
            </p>
          )}
          {statsLine && (
            <p className="mt-1.5 font-display text-[13px] font-bold tracking-wide text-(--color-text-body)">
              {statsLine}
            </p>
          )}
          {performer.reason && (
            <p className="text-meta mt-1">{performer.reason}</p>
          )}
        </div>

        {/* MVP score chip — right side */}
        {performer.mvpScore != null && (
          <div className="flex flex-shrink-0 flex-col items-center">
            <span className="font-display text-[22px] font-black leading-none text-(--color-navy)">
              {performer.mvpScore}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-(--color-text-muted)">
              MVP
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
