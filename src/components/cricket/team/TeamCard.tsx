"use client";

import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { S3Image } from "@/components/common/S3Image";
import type { Team } from "@/types/cricket/team";

type TeamCardProps = {
  team: Team;
  onClick?: (team: Team) => void;
  selected?: boolean;
  disabled?: boolean;
  variant?: "navigate" | "select";
  rightContent?: React.ReactNode;
};

export function TeamCard({
  team,
  onClick,
  selected = false,
  disabled = false,
  variant = "navigate",
  rightContent,
}: TeamCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick?.(team)}
      className={cn(
        "flex w-full items-center justify-between text-left",
        "rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3.5",
        "shadow-(--shadow-card) transition-all duration-150",
        "active:scale-[0.98] hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint)",
        selected && "border-(--color-brand) bg-(--color-bg-tint)",
        disabled && "cursor-not-allowed opacity-50 active:scale-100",
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div
          className={cn(
            "h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-(--color-bg-border)",
            !team.logoUrl &&
              "flex items-center justify-center bg-(--color-navy)",
          )}
        >
          {team.logoUrl ? (
            <S3Image
              imageKey={team.logoUrl}
              alt={team.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-(--color-brand)">
                  <span className="font-bold text-white">
                    {team.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              }
            />
          ) : (
            <span className="font-(family-name:--font-display) text-xl font-black text-white">
              {team.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h4 className="truncate font-(family-name:--font-display) text-base font-black uppercase tracking-wide text-(--color-text-primary)">
            {team.name}
          </h4>

          <p className="text-meta mt-0.5 truncate">
            {team.memberCount ?? 0} Players
            {/* {team.city ? ` • ${team.city}` : ""} */}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        {rightContent ??
          (variant === "select" && selected ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-(--color-brand) text-white">
              <Check size={15} />
            </div>
          ) : (
            <ChevronRight size={18} className="text-(--color-text-muted)" />
          ))}
      </div>
    </button>
  );
}
