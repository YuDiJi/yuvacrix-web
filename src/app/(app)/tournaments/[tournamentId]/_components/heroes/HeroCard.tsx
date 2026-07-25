// _components/heroes/HeroCard.tsx

"use client";

import { Award, ChevronDown, ChevronUp, Share2, Trophy } from "lucide-react";
import { useState } from "react";

import { S3Image } from "@/components/common/S3Image";
import { cn } from "@/lib/cn";
import { TournamentHeroCard } from "@/types/tournamentAnalytics";

import { HERO_VISUAL_CONFIG } from "./heroConfig";

type Props = {
  card: TournamentHeroCard;
};

function formatValue(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default function HeroCard({ card }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const config = HERO_VISUAL_CONFIG[card.type];
  const Icon = config.icon;

  if (!card.hasWinner || !card.player) {
    return (
      <article className="rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-6 text-center shadow-(--shadow-card)">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
          <Trophy className="size-6 text-(--color-brand)" />
        </div>

        <h3 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
          {card.title}
        </h3>

        <p className="mt-2 text-sm text-(--color-text-secondary)">
          Winner will appear after completed matches.
        </p>
      </article>
    );
  }

  const { player, stats } = card;

  return (
    <article className="overflow-hidden rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br px-4 pb-4 pt-4 text-white",
          config.gradientClassName,
        )}
      >
        <div className="pointer-events-none absolute -right-12 -top-16 size-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 size-40 rounded-full bg-black/10" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Icon className="size-5 text-white" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.12em] text-white/65">
                {config.label}
              </p>

              <h3 className="truncate font-(family-name:--font-display) text-lg font-black uppercase tracking-[0.04em] text-white">
                {card.title}
              </h3>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.06em] backdrop-blur">
            #{card.type === "TOURNAMENT_MVP" ? "MVP" : "1"}
          </span>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/20 bg-black/15">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            {player.profileImageUrl ? (
              <S3Image
                imageKey={player.profileImageUrl}
                alt={player.playerName}
                width={600}
                height={450}
                className="h-full w-full object-cover"
                fallback={<HeroPlayerFallback playerName={player.playerName} />}
              />
            ) : (
              <HeroPlayerFallback playerName={player.playerName} />
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/45 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-4">
              <h4 className="font-(family-name:--font-display) text-2xl font-black uppercase tracking-[0.04em] text-white">
                {player.playerName}
              </h4>

              <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.08em] text-white/65">
                {player.teamShortName || player.teamName}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-4 flex items-center justify-between gap-3 rounded-2xl bg-black/15 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/60">
              {card.metricLabel}
            </p>

            <p className="mt-0.5 font-(family-name:--font-display) text-3xl font-black text-white">
              {formatValue(card.value)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/60">
              Award
            </p>

            <div className="mt-1 flex items-center gap-1.5">
              <Award className="size-4 text-white" />

              <span className="text-xs font-black uppercase text-white">
                Tournament Hero
              </span>
            </div>
          </div>
        </div>
      </div>

      {stats && (
        <>
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            className="flex w-full items-center justify-between border-b border-(--color-bg-border) px-4 py-3 text-left"
          >
            <span className="text-xs font-black uppercase tracking-[0.06em] text-(--color-text-primary)">
              Performance details
            </span>

            {isExpanded ? (
              <ChevronUp className="size-4 text-(--color-brand)" />
            ) : (
              <ChevronDown className="size-4 text-(--color-brand)" />
            )}
          </button>

          {isExpanded && <HeroStatsDetails card={card} />}
        </>
      )}

      {/* <div className="grid grid-cols-2 divide-x divide-(--color-bg-border)">
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-(--color-text-secondary) transition hover:bg-(--color-bg-tint) hover:text-(--color-brand)"
        >
          <Trophy className="size-4" />
          Congratulate
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-(--color-text-secondary) transition hover:bg-(--color-bg-tint) hover:text-(--color-brand)"
        >
          <Share2 className="size-4" />
          Share
        </button>
      </div> */}
    </article>
  );
}

function HeroStatsDetails({ card }: { card: TournamentHeroCard }) {
  if (!card.stats) return null;

  const { batting, bowling, fielding } = card.stats;

  return (
    <div className="bg-(--color-bg-tint) p-4">
      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Runs" value={batting.runs} />
        <StatBox label="Wickets" value={bowling.wickets} />
        <StatBox label="Dismissals" value={fielding.dismissals} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <DetailRow label="Batting innings" value={batting.innings} />

        <DetailRow
          label="Strike rate"
          value={formatValue(batting.strikeRate)}
        />

        <DetailRow label="Fours" value={batting.fours} />

        <DetailRow label="Sixes" value={batting.sixes} />

        <DetailRow label="Bowling overs" value={bowling.overs} />

        <DetailRow label="Economy" value={formatValue(bowling.economy)} />

        <DetailRow label="Dot balls" value={bowling.dotBalls} />

        <DetailRow label="Maidens" value={bowling.maidens} />

        <DetailRow label="Catches" value={fielding.catches} />

        <DetailRow label="Stumpings" value={fielding.stumpings} />

        <DetailRow label="Run outs" value={fielding.runOuts} />

        <DetailRow
          label="Keeper dismissals"
          value={fielding.wicketKeeperDismissals ?? 0}
        />
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-(--color-bg-card) p-3 text-center">
      <p className="font-(family-name:--font-display) text-xl font-black text-(--color-brand)">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.05em] text-(--color-text-muted)">
        {label}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-(--color-bg-card) px-3 py-2.5">
      <span className="truncate text-[11px] text-(--color-text-secondary)">
        {label}
      </span>

      <strong className="shrink-0 text-xs text-(--color-text-primary)">
        {value}
      </strong>
    </div>
  );
}

function HeroPlayerFallback({ playerName }: { playerName: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-white/10">
      <div className="flex size-24 items-center justify-center rounded-full bg-white/15 font-(family-name:--font-display) text-4xl font-black text-white">
        {initials(playerName)}
      </div>
    </div>
  );
}
