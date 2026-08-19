"use client";

import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ChevronDown,
  CircleDot,
  Layers3,
  Pencil,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  Trophy,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";

import {
  TournamentGroup,
  TournamentGroupTeam,
  useDeleteTournamentGroupMutation,
  useGetTournamentGroupsQuery,
} from "@/store/api/cricket/tournamentGroupApi";

import {
  TournamentRound,
  TournamentRoundStatus,
  TournamentRoundType,
  useDeleteTournamentRoundMutation,
  useGetTournamentRoundsQuery,
} from "@/store/api/cricket/tournamentRoundApi";
import { S3Image } from "@/components/common/S3Image";
import {
  TournamentTeam,
  useGetTournamentTeamsQuery,
} from "@/store/api/cricket/tournamentTeamApi";
import { DialogBox } from "@/components/common/DialogBox";

// ─── Types ────────────────────────────────────────────────────────────────────

type GroupToDelete = {
  id: string;
  name: string;
  roundId: string;
  teamCount: number;
};

type RoundToDelete = {
  id: string;
  name: string;
  groupCount: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data
  ) {
    return String(error.data.message);
  }

  return fallback;
}

function getTeamInitials(team: TournamentGroupTeam) {
  if (team.teamShortNameSnapshot?.trim()) {
    return team.teamShortNameSnapshot.trim().slice(0, 3).toUpperCase();
  }

  const teamName = team.teamNameSnapshot?.trim();

  if (!teamName) {
    return "TM";
  }

  return teamName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function getRoundTypeLabel(roundType: TournamentRoundType) {
  const labels: Record<TournamentRoundType, string> = {
    LEAGUE: "League",
    GROUP: "Group Stage",
    SUPER_THREE: "Super Three",
    SUPER_FOUR: "Super Four",
    QUARTER_FINAL: "Quarter Final",
    SEMI_FINAL: "Semi Final",
    FINAL: "Final",
    CUSTOM: "Custom",
  };

  return labels[roundType];
}

function getRoundStatusLabel(status: TournamentRoundStatus) {
  const labels: Record<TournamentRoundStatus, string> = {
    DRAFT: "Draft",
    ACTIVE: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  return labels[status];
}

function getRoundStatusClasses(status: TournamentRoundStatus) {
  switch (status) {
    case "ACTIVE":
      return "border-(--color-four)/20 bg-(--color-four)/10 text-(--color-four)";

    case "COMPLETED":
      return "border-(--color-brand)/20 bg-(--color-brand)/10 text-(--color-brand)";

    case "CANCELLED":
      return "border-(--color-live)/20 bg-(--color-live)/10 text-(--color-live)";

    case "DRAFT":
    default:
      return "border-(--color-six)/20 bg-(--color-six)/10 text-(--color-six)";
  }
}

// ─── Loading states ───────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="animate-pulse rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4">
        <div className="h-3 w-24 rounded bg-(--color-bg-border)" />

        <div className="mt-3 h-14 rounded-xl bg-(--color-bg-border)" />
      </div>

      <div className="animate-pulse rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4">
        <div className="h-5 w-32 rounded bg-(--color-bg-border)" />

        <div className="mt-3 h-14 rounded-xl bg-(--color-bg-border)" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)"
          />
        ))}
      </div>
    </div>
  );
}

function GroupsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)"
        >
          <div className="flex animate-pulse items-center gap-3 border-b border-(--color-bg-border) p-4">
            <div className="h-11 w-11 rounded-xl bg-(--color-bg-border)" />

            <div className="flex-1">
              <div className="h-4 w-24 rounded bg-(--color-bg-border)" />
              <div className="mt-2 h-3 w-14 rounded bg-(--color-bg-border)" />
            </div>
          </div>

          <div className="space-y-2 p-4">
            <div className="h-12 animate-pulse rounded-xl bg-(--color-bg-border)" />
            <div className="h-12 animate-pulse rounded-xl bg-(--color-bg-border)" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-live)/10">
        <AlertCircle size={30} className="text-(--color-live)" />
      </div>

      <h3 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
        {title}
      </h3>

      <p className="mt-2 max-w-72 text-sm leading-6 text-(--color-text-secondary)">
        {description}
      </p>

      {onRetry && (
        <Button
          type="button"
          size="sm"
          className="mt-5"
          leftIcon={<RefreshCw size={15} />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

// ─── No rounds state ──────────────────────────────────────────────────────────

function NoRoundsState({ onCreateRound }: { onCreateRound: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-6 py-14 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-(--color-bg-tint)">
        <Trophy size={34} className="text-(--color-brand)" />
      </div>

      <h3 className="mt-5 font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
        Create Your First Round
      </h3>

      <p className="mt-2 max-w-80 text-sm leading-6 text-(--color-text-secondary)">
        Create a round such as League Stage, Super League, Semi Final or Final
        before organising tournament groups.
      </p>

      <Button
        type="button"
        size="sm"
        className="mt-6"
        leftIcon={<Plus size={16} />}
        onClick={onCreateRound}
      >
        Create Round
      </Button>
    </div>
  );
}

// ─── Round summary ────────────────────────────────────────────────────────────

function RoundSummary({
  round,
  groupCount,
  onEdit,
  onDelete,
}: {
  round: TournamentRound;
  groupCount: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)">
      <div className="flex items-start justify-between gap-3 border-b border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--color-brand)/10 text-(--color-brand)">
            <Trophy size={21} strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-(family-name:--font-display) text-lg font-black uppercase text-(--color-navy)">
              {round.name}
            </h2>

            <p className="mt-0.5 text-xs text-(--color-text-secondary)">
              Round {round.sequenceNumber} ·{" "}
              {getRoundTypeLabel(round.roundType)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${round.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-(--color-brand) transition-colors hover:bg-(--color-brand)/10 active:scale-95"
          >
            <Pencil size={16} strokeWidth={2.3} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${round.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-(--color-live) transition-colors hover:bg-(--color-live)/10 active:scale-95"
          >
            <Trash2 size={16} strokeWidth={2.3} />
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
              "font-(family-name:--font-display) text-[10px] font-black uppercase tracking-wide",
              getRoundStatusClasses(round.status),
            )}
          >
            <CircleDot size={10} strokeWidth={3} />

            {getRoundStatusLabel(round.status)}
          </span>

          <span className="inline-flex items-center rounded-full border border-(--color-bg-border) bg-(--color-bg-base) px-2.5 py-1 font-(family-name:--font-display) text-[10px] font-black uppercase tracking-wide text-(--color-text-secondary)">
            {groupCount} {groupCount === 1 ? "Group" : "Groups"}
          </span>
        </div>

        {round.description && (
          <p className="text-sm leading-6 text-(--color-text-secondary)">
            {round.description}
          </p>
        )}
      </div>
    </section>
  );
}

// ─── Empty groups diagram ─────────────────────────────────────────────────────

function EmptyGroupsDiagram({
  roundName,
  onCreateGroup,
}: {
  roundName: string;
  onCreateGroup: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card)">
      <div className="border-b border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-brand)/10 text-(--color-brand)">
            <Layers3 size={20} strokeWidth={2.5} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-navy)">
                Organise This Round
              </h2>

              <span className="inline-flex items-center rounded-full border border-(--color-brand)/20 bg-(--color-brand)/10 px-2.5 py-1 font-(family-name:--font-display) text-[10px] font-black uppercase tracking-wide text-(--color-brand)">
                Optional
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
              Groups are optional. You can run this round without groups or
              divide teams into smaller pools.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="mx-auto flex max-w-60 items-center justify-center rounded-2xl border-2 border-(--color-brand)/25 bg-(--color-brand)/8 px-4 py-3 text-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted)">
              Selected Round
            </p>

            <p className="mt-1 font-(family-name:--font-display) text-base font-black uppercase text-(--color-navy)">
              {roundName}
            </p>
          </div>
        </div>

        <div className="mx-auto h-6 w-px bg-(--color-brand)/30" />

        <div className="mx-auto h-px max-w-60 bg-(--color-brand)/30" />

        <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
          <div className="mx-auto h-5 w-px bg-(--color-brand)/30" />
          <div className="mx-auto h-5 w-px bg-(--color-brand)/30" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-base) p-3">
            <div className="flex items-center gap-2">
              <UsersRound
                size={16}
                className="text-(--color-brand)"
                strokeWidth={2.5}
              />

              <p className="font-(family-name:--font-display) text-sm font-black uppercase text-(--color-navy)">
                Group A
              </p>
            </div>

            <div className="mt-3 space-y-2">
              <div className="rounded-lg bg-(--color-bg-card) px-2 py-2 text-xs font-semibold text-(--color-text-secondary)">
                Team A
              </div>

              <div className="rounded-lg bg-(--color-bg-card) px-2 py-2 text-xs font-semibold text-(--color-text-secondary)">
                Team B
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-base) p-3">
            <div className="flex items-center gap-2">
              <UsersRound
                size={16}
                className="text-(--color-brand)"
                strokeWidth={2.5}
              />

              <p className="font-(family-name:--font-display) text-sm font-black uppercase text-(--color-navy)">
                Group B
              </p>
            </div>

            <div className="mt-3 space-y-2">
              <div className="rounded-lg bg-(--color-bg-card) px-2 py-2 text-xs font-semibold text-(--color-text-secondary)">
                Team C
              </div>

              <div className="rounded-lg bg-(--color-bg-card) px-2 py-2 text-xs font-semibold text-(--color-text-secondary)">
                Team D
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-(--color-brand)/15 bg-(--color-brand)/5 px-4 py-3">
          <p className="text-center text-xs leading-5 text-(--color-text-secondary)">
            Groups help you organise fixtures and maintain separate points
            tables for different pools.
          </p>
        </div>

        <Button
          type="button"
          fullWidth
          className="mt-5"
          leftIcon={<Plus size={16} />}
          onClick={onCreateGroup}
        >
          Create First Group
        </Button>
      </div>
    </div>
  );
}

// ─── Team row ─────────────────────────────────────────────────────────────────

function TeamRow({ team }: { team: TournamentGroupTeam }) {
  const teamName = team.teamNameSnapshot?.trim() || "Unnamed Team";

  return (
    <div className="flex items-center gap-3 rounded-xl bg-(--color-bg-base) px-3 py-2.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--color-bg-border) bg-(--color-bg-tint)">
        {team.teamLogoSnapshot ? (
          <S3Image
            imageKey={team.teamLogoSnapshot}
            alt={`${teamName} logo`}
            width={40}
            height={40}
            className="h-full w-full object-cover"
            fallback={
              <span className="font-(family-name:--font-display) text-xs font-black uppercase text-(--color-brand)">
                {getTeamInitials(team)}
              </span>
            }
          />
        ) : (
          <span className="font-(family-name:--font-display) text-xs font-black uppercase text-(--color-brand)">
            {getTeamInitials(team)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-(--color-text-primary)">
          {teamName}
        </p>

        {team.teamShortNameSnapshot && (
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-(--color-text-muted)">
            {team.teamShortNameSnapshot}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Group card ───────────────────────────────────────────────────────────────

function GroupCard({
  group,
  onEdit,
  onDelete,
  onManageTeams,
  tournamentTeams,
}: {
  group: TournamentGroup;
  onEdit: () => void;
  onDelete: () => void;
  onManageTeams: () => void;
  tournamentTeams: TournamentTeam[];
}) {
  const [expanded, setExpanded] = useState(false);
  const teamById = new Map(tournamentTeams.map((team) => [team.teamId, team]));

  const teams: TournamentTeam[] = (group.teamIds ?? [])
    .map((teamId) => teamById.get(teamId))
    .filter((team): team is TournamentTeam => team !== undefined);

  const teamCount = group.teamIds?.length ?? 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)">
      <div className="flex items-center justify-between gap-3 border-b border-(--color-bg-border) px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--color-brand)/10 text-(--color-brand)">
            <UsersRound size={21} strokeWidth={2.3} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-(family-name:--font-display) text-lg font-black uppercase text-(--color-navy)">
              {group.name}
            </h3>

            <p className="mt-0.5 text-xs text-(--color-text-secondary)">
              {teamCount} {teamCount === 1 ? "team" : "teams"}
            </p>
          </div>
          <div className="ml-auto">
            <ChevronDown
              size={18}
              className={cn(
                "transition-transform duration-200 text-(--color-text-muted)",
                expanded && "rotate-180",
              )}
            />
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          {/* <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${group.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-(--color-brand) transition-colors hover:bg-(--color-brand)/10 active:scale-95"
          >
            <Pencil size={16} strokeWidth={2.3} />
          </button> */}

          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${group.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-(--color-live) transition-colors hover:bg-(--color-live)/10 active:scale-95"
          >
            <Trash2 size={16} strokeWidth={2.3} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-(--color-bg-border) p-4">
          {group.description && (
            <p className="mb-4 text-xs leading-5 text-(--color-text-secondary)">
              {group.description}
            </p>
          )}

          {teams?.length > 0 ? (
            <div className="space-y-2">
              {teams.map((team) => (
                <TeamRow key={team?.teamId} team={team} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-(--color-bg-border) bg-(--color-bg-base) px-4 py-5 text-center">
              <Shield
                size={23}
                className="mx-auto text-(--color-text-muted)"
                strokeWidth={1.8}
              />

              <p className="mt-2 text-sm font-semibold text-(--color-text-primary)">
                No Teams Assigned
              </p>

              <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
                Add tournament teams to this group.
              </p>
            </div>
          )}

          <Button
            type="button"
            variant="secondary"
            fullWidth
            size="sm"
            className="mt-4"
            onClick={onManageTeams}
          >
            {teamCount > 0 ? "Manage Teams" : "Assign Teams"}
          </Button>
        </div>
      )}
    </article>
  );
}

// ─── Delete group dialog ──────────────────────────────────────────────────────

function DeleteGroupDialog({
  open,
  group,
  error,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  group: GroupToDelete | null;
  error: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!group) return null;

  return (
    <DialogBox
      open={open}
      onClose={() => {
        if (!isDeleting) {
          onCancel();
        }
      }}
      className="max-w-md rounded-3xl bg-(--color-bg-card)"
    >
      <div className="p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-live)/10">
          <Trash2 size={22} className="text-(--color-live)" />
        </div>

        <h3 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
          Delete Group?
        </h3>

        <p className="mt-2 text-sm leading-6 text-(--color-text-secondary)">
          Are you sure you want to delete <strong>{group.name}</strong>?
        </p>

        {group.teamCount > 0 && (
          <div className="mt-4 rounded-xl border border-(--color-six)/20 bg-(--color-six)/8 px-4 py-3">
            <p className="text-xs leading-5 text-(--color-text-secondary)">
              This group currently contains {group.teamCount}{" "}
              {group.teamCount === 1 ? "team" : "teams"}. The teams will remain
              in the tournament, but their group assignments will be removed.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
            <p className="text-sm font-medium text-(--color-live)">{error}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={isDeleting}
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            type="button"
            fullWidth
            loading={isDeleting}
            disabled={isDeleting}
            onClick={onConfirm}
            variant="danger"
          >
            Delete Group
          </Button>
        </div>
      </div>
    </DialogBox>
  );
}

// ─── Delete round dialog ──────────────────────────────────────────────────────

function DeleteRoundDialog({
  open,
  round,
  error,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  round: RoundToDelete | null;
  error: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!round) return null;

  return (
    <DialogBox
      open={open}
      onClose={() => {
        if (!isDeleting) {
          onCancel();
        }
      }}
      className="max-w-md rounded-3xl bg-(--color-bg-card)"
    >
      <div className="p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-live)/10">
          <Trash2 size={22} className="text-(--color-live)" />
        </div>

        <h3 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
          Delete Round?
        </h3>

        <p className="mt-2 text-sm leading-6 text-(--color-text-secondary)">
          Are you sure you want to delete <strong>{round.name}</strong>?
        </p>

        {round.groupCount > 0 && (
          <div className="mt-4 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
            <p className="text-xs leading-5 text-(--color-live)">
              This round contains {round.groupCount}{" "}
              {round.groupCount === 1 ? "group" : "groups"}. You may need to
              remove its groups before the round can be deleted.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
            <p className="text-sm font-medium text-(--color-live)">{error}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={isDeleting}
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            type="button"
            fullWidth
            loading={isDeleting}
            disabled={isDeleting}
            onClick={onConfirm}
            variant="danger"
          >
            Delete Round
          </Button>
        </div>
      </div>
    </DialogBox>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RoundsGroups() {
  const router = useRouter();
  const params = useParams();

  const tournamentId = params.tournamentId as string;

  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const [roundPickerOpen, setRoundPickerOpen] = useState(false);

  const [groupToDelete, setGroupToDelete] = useState<GroupToDelete | null>(
    null,
  );

  const [roundToDelete, setRoundToDelete] = useState<RoundToDelete | null>(
    null,
  );

  const [deleteGroupError, setDeleteGroupError] = useState("");
  const [deleteRoundError, setDeleteRoundError] = useState("");

  // ── Fetch rounds ──────────────────────────────────────────────────────────

  const {
    data: rounds = [],
    isLoading: isLoadingRounds,
    isFetching: isFetchingRounds,
    isError: isRoundsError,
    refetch: refetchRounds,
  } = useGetTournamentRoundsQuery({
    tournamentId,
  });

  const {
    data: tournamentTeams = [],
    isLoading: isLoadingTournamentTeams,
    isFetching: isFetchingTournamentTeams,
    isError: isTournamentTeamsError,
    refetch: refetchTournamentTeams,
  } = useGetTournamentTeamsQuery({
    tournamentId,
  });

  const selectedRound = rounds.find((round) => round.id === selectedRoundId);

  // Select the first round after loading.
  useEffect(() => {
    if (rounds.length === 0) {
      setSelectedRoundId(null);
      return;
    }

    setSelectedRoundId((currentRoundId) => {
      if (
        currentRoundId &&
        rounds.some((round) => round.id === currentRoundId)
      ) {
        return currentRoundId;
      }

      return rounds[0].id;
    });
  }, [rounds]);

  // ── Fetch groups for selected round ───────────────────────────────────────

  const {
    data: groups = [],
    isLoading: isLoadingGroups,
    isFetching: isFetchingGroups,
    isError: isGroupsError,
    refetch: refetchGroups,
  } = useGetTournamentGroupsQuery(
    selectedRoundId
      ? {
          tournamentId,
          roundId: selectedRoundId,
        }
      : skipToken,
  );

  // ── Delete mutations ──────────────────────────────────────────────────────

  const [deleteTournamentGroup, { isLoading: isDeletingGroup }] =
    useDeleteTournamentGroupMutation();

  const [deleteTournamentRound, { isLoading: isDeletingRound }] =
    useDeleteTournamentRoundMutation();

  const isRoundsLoading = isLoadingRounds || isFetchingRounds;
  const isGroupsLoading = isLoadingGroups || isFetchingGroups;

  // ── Navigation handlers ──────────────────────────────────────────────────

  function handleRoundChange(roundId: string) {
    setSelectedRoundId(roundId);
    setRoundPickerOpen(false);
  }

  function handleCreateRound() {
    router.push(`/tournaments/${tournamentId}/start-match/round`);
  }

  function handleEditRound() {
    if (!selectedRoundId) return;

    router.push(`/tournaments/${tournamentId}/rounds/${selectedRoundId}/edit`);
  }

  function handleAddGroup() {
    if (!selectedRoundId) return;

    router.push(
      `/tournaments/${tournamentId}/groups/create?roundId=${selectedRoundId}`,
    );
  }

  function handleEditGroup(groupId: string) {
    router.push(`/tournaments/${tournamentId}/groups/${groupId}/edit`);
  }

  function handleManageTeams(groupId: string) {
    router.push(`/tournaments/${tournamentId}/groups/${groupId}/edit`);
  }

  // ── Group deletion ────────────────────────────────────────────────────────

  function openDeleteGroup(group: TournamentGroup) {
    if (!selectedRoundId) return;

    setDeleteGroupError("");

    setGroupToDelete({
      id: group.id,
      name: group.name,
      roundId: group.roundId ?? selectedRoundId,
      teamCount: group.teamIds?.length ?? group.teamIds?.length ?? 0,
    });
  }

  function closeDeleteGroup() {
    if (isDeletingGroup) return;

    setGroupToDelete(null);
    setDeleteGroupError("");
  }

  async function handleDeleteGroup() {
    if (!groupToDelete) return;

    setDeleteGroupError("");

    try {
      await deleteTournamentGroup({
        tournamentId,
        roundId: groupToDelete.roundId,
        groupId: groupToDelete.id,
      }).unwrap();

      setGroupToDelete(null);
    } catch (error) {
      setDeleteGroupError(
        getApiErrorMessage(error, "Failed to delete group. Please try again."),
      );
    }
  }

  // ── Round deletion ────────────────────────────────────────────────────────

  function openDeleteRound() {
    if (!selectedRound) return;

    setDeleteRoundError("");

    setRoundToDelete({
      id: selectedRound.id,
      name: selectedRound.name,
      groupCount: groups.length,
    });
  }

  function closeDeleteRound() {
    if (isDeletingRound) return;

    setRoundToDelete(null);
    setDeleteRoundError("");
  }

  async function handleDeleteRound() {
    if (!roundToDelete) return;

    setDeleteRoundError("");

    try {
      await deleteTournamentRound({
        tournamentId,
        roundId: roundToDelete.id,
      }).unwrap();

      setRoundToDelete(null);
      setSelectedRoundId(null);
    } catch (error) {
      setDeleteRoundError(
        getApiErrorMessage(error, "Failed to delete round. Please try again."),
      );
    }
  }

  // ── Initial states ────────────────────────────────────────────────────────

  if (isRoundsLoading) {
    return (
      <div className="min-h-full bg-(--color-bg-base)">
        <PageSkeleton />
      </div>
    );
  }

  if (isRoundsError) {
    return (
      <div className="min-h-full bg-(--color-bg-base) p-4">
        <ErrorState
          title="Failed to Load Rounds"
          description="Tournament rounds could not be loaded. Please check your connection and try again."
          onRetry={() => {
            void refetchRounds();
          }}
        />
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="min-h-full bg-(--color-bg-base) p-4">
        <NoRoundsState onCreateRound={handleCreateRound} />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-(--color-bg-base) pb-8">
      {/* Page heading */}
      <div className="border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-4">
        <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-3">
          <div>
            <h1 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-navy)">
              Rounds & Groups
            </h1>

            <p className="mt-1 text-sm leading-5 text-(--color-text-secondary)">
              Organise rounds, groups and their assigned teams.
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            leftIcon={<Plus size={15} />}
            onClick={handleCreateRound}
          >
            Add Round
          </Button>
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl space-y-4 p-4">
        {/* Round selector */}
        <section className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4">
          <div className="mb-3">
            <p className="font-(family-name:--font-display) text-sm font-black uppercase text-(--color-navy)">
              Select Round
            </p>

            <p className="mt-0.5 text-xs text-(--color-text-secondary)">
              Choose a round to view its groups and teams.
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setRoundPickerOpen((current) => !current);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left",
                "border-(--color-bg-border) bg-(--color-bg-card)",
                "transition-colors hover:border-(--color-brand)/30",
              )}
            >
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted)">
                  Current Round
                </p>

                <p className="mt-0.5 truncate font-(family-name:--font-display) text-base font-black uppercase text-(--color-text-primary)">
                  {selectedRound?.name ?? "Select a Round"}
                </p>
              </div>

              <ChevronDown
                size={19}
                className={cn(
                  "shrink-0 text-(--color-text-muted) transition-transform",
                  roundPickerOpen && "rotate-180",
                )}
              />
            </button>

            {roundPickerOpen && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) p-2 shadow-lg">
                {rounds.map((round) => (
                  <button
                    key={round.id}
                    type="button"
                    onClick={() => handleRoundChange(round.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                      selectedRoundId === round.id
                        ? "bg-(--color-brand) text-white"
                        : "text-(--color-text-primary) hover:bg-(--color-bg-tint)",
                    )}
                  >
                    <p className="font-(family-name:--font-display) text-sm font-black uppercase">
                      {round.name}
                    </p>

                    <p
                      className={cn(
                        "mt-0.5 text-[10px]",
                        selectedRoundId === round.id
                          ? "text-white/70"
                          : "text-(--color-text-muted)",
                      )}
                    >
                      Round {round.sequenceNumber} ·{" "}
                      {getRoundTypeLabel(round.roundType)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Round details */}
        {selectedRound && (
          <RoundSummary
            round={selectedRound}
            groupCount={groups.length}
            onEdit={handleEditRound}
            onDelete={openDeleteRound}
          />
        )}

        {/* Groups heading */}
        {selectedRoundId && (
          <div className="flex items-center justify-between gap-3 pt-1">
            <div>
              <h2 className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-navy)">
                Groups
              </h2>

              <p className="mt-0.5 text-xs text-(--color-text-secondary)">
                {groups.length > 0
                  ? `${groups.length} ${
                      groups.length === 1 ? "group" : "groups"
                    } in ${selectedRound?.name ?? "this round"}`
                  : `No groups in ${selectedRound?.name ?? "this round"}`}
              </p>
            </div>

            {groups.length > 0 && (
              <Button
                type="button"
                size="sm"
                leftIcon={<Plus size={15} />}
                onClick={handleAddGroup}
              >
                Add Group
              </Button>
            )}
          </div>
        )}

        {/* Groups content */}
        {selectedRoundId && isGroupsLoading ? (
          <GroupsSkeleton />
        ) : selectedRoundId && isGroupsError ? (
          <ErrorState
            title="Failed to Load Groups"
            description="Groups for the selected round could not be loaded."
            onRetry={() => {
              void refetchGroups();
            }}
          />
        ) : selectedRoundId && groups.length === 0 ? (
          <EmptyGroupsDiagram
            roundName={selectedRound?.name ?? "Selected Round"}
            onCreateGroup={handleAddGroup}
          />
        ) : selectedRoundId ? (
          <div className="flex gap-4 flex-col">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onEdit={() => handleEditGroup(group.id)}
                onDelete={() => openDeleteGroup(group)}
                onManageTeams={() => handleManageTeams(group.id)}
                tournamentTeams={tournamentTeams}
              />
            ))}
          </div>
        ) : null}
      </main>

      <DeleteGroupDialog
        open={groupToDelete !== null}
        group={groupToDelete}
        error={deleteGroupError}
        isDeleting={isDeletingGroup}
        onCancel={closeDeleteGroup}
        onConfirm={handleDeleteGroup}
      />

      <DeleteRoundDialog
        open={roundToDelete !== null}
        round={roundToDelete}
        error={deleteRoundError}
        isDeleting={isDeletingRound}
        onCancel={closeDeleteRound}
        onConfirm={handleDeleteRound}
      />
    </div>
  );
}
