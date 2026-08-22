"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { VolleyballMemberList } from "@/components/volleyball/team/VolleyballMemberList";
import { VolleyballMemberForm } from "@/components/volleyball/team/VolleyballMemberForm";

import {
  useGetVolleyballTeamMembersQuery,
  useRemoveVolleyballTeamMemberMutation,
  useUpdateVolleyballTeamMemberMutation,
} from "@/store/api/volleyball/volleyballTeamApi";

import { useGetTeamDetailQuery } from "@/store/api/teamApi";

import type {
  UpdateVolleyballTeamMemberDto,
  VolleyballTeamMember,
} from "@/types/volleyball/team";

export default function VolleyballTeamPage() {
  const params = useParams();
  const router = useRouter();

  const teamId = params.teamId as string;

  const [error, setError] = useState("");

  const [removingPlayerId, setRemovingPlayerId] = useState<string | null>(null);

  const [editingMember, setEditingMember] =
    useState<VolleyballTeamMember | null>(null);

  const {
    data: team,
    isLoading: isTeamLoading,
    isError: isTeamError,
  } = useGetTeamDetailQuery({
    teamId,
  });

  const {
    data: membersResponse,
    isLoading: areMembersLoading,
    isError: areMembersError,
  } = useGetVolleyballTeamMembersQuery({
    teamId,
  });

  const members = membersResponse?.members ?? [];

  const [removeMember] = useRemoveVolleyballTeamMemberMutation();

  const [updateMember, { isLoading: isUpdatingMember }] =
    useUpdateVolleyballTeamMemberMutation();

  async function handleUpdateMember(values: UpdateVolleyballTeamMemberDto) {
    if (!editingMember) {
      return;
    }

    setError("");

    try {
      await updateMember({
        teamId,
        playerId: editingMember.playerId,
        body: {
          jerseyNumber: values.jerseyNumber,
          primaryPosition: values.primaryPosition,
          secondaryPosition: values.secondaryPosition ?? null,
        },
      }).unwrap();

      setEditingMember(null);
    } catch (err) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
          ? String(err.data.message)
          : "Failed to update player.";

      setError(message);
    }
  }

  async function handleRemove(member: VolleyballTeamMember) {
    setError("");
    setRemovingPlayerId(member.playerId);

    try {
      await removeMember({
        teamId,
        playerId: member.playerId,
      }).unwrap();
    } catch (err) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
          ? String(err.data.message)
          : "Failed to remove player.";

      setError(message);
    } finally {
      setRemovingPlayerId(null);
    }
  }

  if (isTeamLoading || areMembersLoading) {
    return (
      <div className="min-h-full bg-(--color-bg-base) px-4 py-5">
        <div className="animate-pulse space-y-4">
          <div className="h-24 rounded-2xl bg-(--color-bg-card)" />

          <div className="h-4 w-32 rounded bg-(--color-bg-border)" />

          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 rounded-2xl bg-(--color-bg-card)" />
          ))}
        </div>
      </div>
    );
  }

  if (isTeamError || areMembersError || !team) {
    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4">
        <div className="rounded-2xl bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <p className="text-sm font-bold text-(--color-text-primary)">
            Unable to load team
          </p>

          <p className="mt-1 text-xs text-(--color-text-muted)">
            Please try again.
          </p>
        </div>
      </div>
    );
  }

  /*
   * Edit mode
   *
   * We reuse the same VolleyballMemberForm used while adding a player.
   * The form receives the member's existing jersey/position values.
   */
  if (editingMember) {
    return (
      <div className="min-h-full bg-(--color-bg-base) px-4 py-5">
        <VolleyballMemberForm
          player={{
            id: editingMember.playerId,
            fullName: editingMember.fullName,
            profileImageUrl: editingMember.profileImageUrl,
          }}
          initialValues={{
            jerseyNumber: editingMember.jerseyNumber,
            primaryPosition: editingMember.primaryPosition,
            secondaryPosition: editingMember.secondaryPosition,
          }}
          submitText="Save Changes"
          isLoading={isUpdatingMember}
          error={error}
          onCancel={() => {
            setError("");
            setEditingMember(null);
          }}
          onSubmit={handleUpdateMember}
        />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-(--color-bg-base)">
      <div className="px-4 py-5">
        {/* Team overview */}

        <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <p className="text-section-label">Volleyball Team</p>

          <h1 className="mt-1 font-(family-name:--font-display) text-2xl font-black uppercase tracking-wide text-(--color-text-primary)">
            {team.name}
          </h1>

          {team.city && (
            <p className="mt-1 text-sm text-(--color-text-secondary)">
              {team.city}
            </p>
          )}
        </div>

        {/* Roster heading */}

        <div className="mb-3 mt-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users size={15} className="text-(--color-brand)" />

              <p className="text-section-label">Team Roster</p>
            </div>

            <p className="mt-1 text-xs text-(--color-text-muted)">
              {members.length} player
              {members.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(`/volleyball/teams/create/players?teamId=${teamId}`)
            }
            className="flex h-9 items-center gap-1.5 rounded-xl bg-(--color-bg-tint) px-3 text-xs font-bold text-(--color-brand) transition-all active:scale-95"
          >
            <Plus size={15} />
            Add Player
          </button>
        </div>

        {/* API error */}

        {error && (
          <div className="mb-3 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
            <p className="text-sm font-medium text-(--color-live)">{error}</p>
          </div>
        )}

        {/* Volleyball roster */}

        <VolleyballMemberList
          members={members}
          removingPlayerId={removingPlayerId}
          onEdit={(member) => {
            setError("");
            setEditingMember(member);
          }}
          onRemove={handleRemove}
        />

        {/* Minimum six players required before starting match */}

        {members.length >= 6 && (
          <div className="safe-bottom mt-6">
            <Button
              fullWidth
              onClick={() => {
                // Next phase:
                // Volleyball match creation / match rules.
              }}
            >
              Start Volleyball Match
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
