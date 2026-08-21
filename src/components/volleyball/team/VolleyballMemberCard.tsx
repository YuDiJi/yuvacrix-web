"use client";

import { Hash, Pencil, Trash2 } from "lucide-react";

import { cn } from "@/lib/cn";
import type { VolleyballTeamMember } from "@/types/volleyball/team";
import { S3Image } from "@/components/common/S3Image";

type VolleyballMemberCardProps = {
  member: VolleyballTeamMember;

  onEdit?: () => void;
  onRemove?: () => void;

  isRemoving?: boolean;
};

function formatPosition(position?: string | null) {
  if (!position) {
    return null;
  }

  return position
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function VolleyballMemberCard({
  member,
  onEdit,
  onRemove,
  isRemoving = false,
}: VolleyballMemberCardProps) {
  const playerName = member.fullName;

  const profileImage = member.profileImageUrl;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-(--shadow-card)">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full",
          "bg-(--color-bg-tint)",
        )}
      >
        {profileImage ? (
          <S3Image
            imageKey={profileImage}
            alt={playerName}
            width={48}
            height={48}
            className="h-full w-full object-cover"
            fallback={
              <span className="font-(family-name:--font-display) text-base font-black text-(--color-brand)">
                {playerName.charAt(0).toUpperCase()}
              </span>
            }
          />
        ) : (
          <span className="font-(family-name:--font-display) text-base font-black text-(--color-brand)">
            {playerName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-(--color-text-primary)">
            {playerName}
          </p>

          <div className="flex shrink-0 items-center gap-0.5 rounded-md bg-(--color-bg-tint) px-1.5 py-0.5">
            <Hash size={10} className="text-(--color-brand)" />

            <span className="text-[11px] font-black text-(--color-brand)">
              {member.jerseyNumber}
            </span>
          </div>
        </div>

        <p className="mt-0.5 text-xs font-semibold text-(--color-brand)">
          {formatPosition(member.primaryPosition)}
        </p>

        {member.secondaryPosition && (
          <p className="mt-0.5 text-[11px] text-(--color-text-muted)">
            Secondary: {formatPosition(member.secondaryPosition)}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary) transition-all hover:border-(--color-brand)/30 hover:bg-(--color-bg-tint) hover:text-(--color-brand) active:scale-90"
            aria-label={`Edit ${playerName}`}
          >
            <Pencil size={15} />
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            disabled={isRemoving}
            onClick={onRemove}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--color-live)/20 bg-(--color-live)/8 text-(--color-live) transition-all active:scale-90 disabled:opacity-50"
            aria-label={`Remove ${playerName}`}
          >
            {isRemoving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--color-live)/30 border-t-(--color-live)" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
