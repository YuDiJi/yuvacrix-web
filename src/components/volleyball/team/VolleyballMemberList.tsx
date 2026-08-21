"use client";

import { Users } from "lucide-react";

import { VolleyballMemberCard } from "./VolleyballMemberCard";

import type { VolleyballTeamMember } from "@/types/volleyball/team";

type VolleyballMemberListProps = {
  members: VolleyballTeamMember[];

  removingPlayerId?: string | null;

  onEdit?: (member: VolleyballTeamMember) => void;

  onRemove?: (member: VolleyballTeamMember) => void;
};

export function VolleyballMemberList({
  members,
  removingPlayerId,
  onEdit,
  onRemove,
}: VolleyballMemberListProps) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) px-5 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--color-bg-tint)">
          <Users size={22} className="text-(--color-brand)" />
        </div>

        <p className="mt-3 text-sm font-bold text-(--color-text-primary)">
          No players yet
        </p>

        <p className="mt-1 text-xs text-(--color-text-muted)">
          Add players to build your volleyball roster.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {members.map((member) => (
        <VolleyballMemberCard
          key={member.playerId}
          member={member}
          isRemoving={removingPlayerId === member.playerId}
          onEdit={onEdit ? () => onEdit(member) : undefined}
          onRemove={onRemove ? () => onRemove(member) : undefined}
        />
      ))}
    </div>
  );
}
