// src/app/(app)/cricket-profile/_components/TeamHistoryCard.tsx

"use client";

import { BadgeCheck, ChevronRight, MapPin } from "lucide-react";

import { S3Image } from "@/components/common/S3Image";
import { cn } from "@/lib/cn";

import type { CricketProfileTeamHistoryItem } from "@/types/team";

type TeamHistoryCardProps = {
  team: CricketProfileTeamHistoryItem;
  onClick?: (team: CricketProfileTeamHistoryItem) => void;
};

function formatMemberSince(value: string | null) {
  if (!value) {
    return "Joining date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Joining date unavailable";
  }

  return `Since ${new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)}`;
}

function PerformanceItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
      <strong className="font-(family-name:--font-display) text-lg font-black leading-none text-(--color-text-primary)">
        {value}
      </strong>

      <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-(--color-text-muted)">
        {label}
      </span>
    </div>
  );
}

export function TeamHistoryCard({ team, onClick }: TeamHistoryCardProps) {
  const hasClickHandler = Boolean(onClick);

  return (
    <button
      type="button"
      disabled={!hasClickHandler}
      onClick={() => onClick?.(team)}
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-(--color-bg-border)",
        "bg-(--color-bg-card) text-left shadow-(--shadow-card)",
        hasClickHandler &&
          "transition-all duration-150 hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint) active:scale-[0.99]",
        !hasClickHandler && "cursor-default",
      )}
    >
      <div className="flex items-start gap-3.5 p-4">
        <div
          className={cn(
            "h-16 w-16 shrink-0 overflow-hidden rounded-2xl",
            "border border-(--color-bg-border)",
            !team.logoUrl &&
              "flex items-center justify-center bg-(--color-navy)",
          )}
        >
          {team.logoUrl ? (
            <S3Image
              imageKey={team.logoUrl}
              alt={team.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-(--color-brand)">
                  <span className="font-(family-name:--font-display) text-xl font-black text-white">
                    {team.initials || team.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              }
            />
          ) : (
            <span className="font-(family-name:--font-display) text-xl font-black uppercase text-white">
              {team.initials || team.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-1.5">
                <h3 className="truncate font-(family-name:--font-display) text-lg font-black uppercase tracking-wide text-(--color-text-primary)">
                  {team.name}
                </h3>

                {team.isVerified && (
                  <BadgeCheck className="h-4 w-4 shrink-0 fill-(--color-brand) text-white" />
                )}
              </div>

              <p className="mt-0.5 text-xs font-medium italic text-(--color-text-muted)">
                {formatMemberSince(team.memberSince)}
              </p>
            </div>

            {hasClickHandler && (
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-(--color-text-muted)" />
            )}
          </div>

          {team.city && (
            <div className="mt-2 flex items-center gap-1 text-xs text-(--color-text-secondary)">
              <MapPin className="h-3.5 w-3.5 text-(--color-brand)" />

              <span className="truncate">{team.city}</span>
            </div>
          )}

          <div className="mt-2">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1",
                "text-[9px] font-black uppercase tracking-wider",
                team.membershipStatus === "ACTIVE"
                  ? "bg-green-50 text-green-700"
                  : "bg-(--color-bg-border) text-(--color-text-secondary)",
              )}
            >
              {team.membershipStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-4 border-t border-(--color-bg-border)" />

      <div className="flex items-center px-3 py-3">
        <PerformanceItem label="Played" value={team.performance.played} />

        <div className="h-8 w-px bg-(--color-bg-border)" />

        <PerformanceItem label="Won" value={team.performance.won} />

        <div className="h-8 w-px bg-(--color-bg-border)" />

        <PerformanceItem label="Lost" value={team.performance.lost} />
      </div>
    </button>
  );
}
