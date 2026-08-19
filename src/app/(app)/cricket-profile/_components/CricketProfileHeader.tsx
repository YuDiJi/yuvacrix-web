"use client";

import {
  BarChart3,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import { S3Image } from "@/components/common/S3Image";
import { cn } from "@/lib/cn";
import type {
  CricketProfile,
  CricketProfileHeader,
} from "@/types/cricket/cricketProfile";

type CricketProfileHeaderProps = {
  profile: CricketProfile;
  onStatsClick: () => void;
};

function getInitials(name?: string | null): string {
  if (!name?.trim()) {
    return "P";
  }

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatEnumLabel(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPlayingDescription(player: CricketProfileHeader): string {
  const details = [
    formatEnumLabel(player.playerRole),
    formatEnumLabel(player.battingStyle),
    formatEnumLabel(player.bowlingStyle),
  ].filter(Boolean);

  return details.length > 0 ? details.join(" • ") : "Cricket player";
}

export function CricketProfileHeader({
  profile,
  onStatsClick,
}: CricketProfileHeaderProps) {
  const { header, counts, advancedAnalyticsSummary } = profile;
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        "bg-[linear-gradient(145deg,var(--color-brand),var(--color-navy))]",
        "px-4 pb-5 pt-4 text-white",
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />

      <div className="pointer-events-none absolute -bottom-28 -left-16 h-56 w-56 rounded-full bg-black/10" />

      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="h-[92px] w-[92px] shrink-0 overflow-hidden rounded-full border-[3px] border-white/80 bg-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
            {header.profileImageUrl ? (
              <S3Image
                imageKey={header.profileImageUrl}
                alt={header.displayName}
                width={92}
                height={92}
                className="h-full w-full object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
                    <span className="font-display text-[30px] font-black text-white">
                      {getInitials(header.displayName)}
                    </span>
                  </div>
                }
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
                <span className="font-display text-[30px] font-black text-white">
                  {getInitials(header.displayName)}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-display text-[25px] font-black uppercase leading-tight tracking-wide">
                {header.displayName}
              </h1>

              {header.isClaimed && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/15 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                  <ShieldCheck size={11} />
                  Claimed
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium text-white/75">
              {header.city && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {header.city}
                </span>
              )}

              <span>{counts.matches} matches</span>
              <span>{counts.teams} teams</span>
            </div>

            <p className="mt-2 line-clamp-2 text-[12px] font-medium leading-5 text-white/90">
              {getPlayingDescription(header)}
            </p>

            {counts.tournaments > 0 && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold text-white/90">
                  <Trophy size={10} />
                  {counts.tournaments} tournaments
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onStatsClick}
            className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 text-white transition-all active:scale-[0.98]"
          >
            <BarChart3 size={18} />

            <span className="font-display text-[13px] font-black uppercase tracking-wider">
              View Stats
            </span>
          </button>

          <button
            type="button"
            disabled={!advancedAnalyticsSummary.available}
            className={cn(
              "flex min-h-14 items-center justify-center gap-2 rounded-xl px-3",
              "font-display text-[13px] font-black uppercase tracking-wider",
              "transition-all active:scale-[0.98]",
              advancedAnalyticsSummary.available
                ? "bg-white text-(--color-brand)"
                : "cursor-not-allowed bg-white/15 text-white/50",
            )}
          >
            <Sparkles size={18} />
            Insights
            {advancedAnalyticsSummary.available && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </section>
  );
}
