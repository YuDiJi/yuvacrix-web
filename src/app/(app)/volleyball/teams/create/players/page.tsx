"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Player } from "@/types/player";
import type { AddVolleyballTeamMemberDto } from "@/types/volleyball/team";

import { CreatePlayerFlow } from "@/components/player/CreatePlayerFlow";
import { VolleyballMemberForm } from "@/components/volleyball/team/VolleyballMemberForm";

import {
  useAddVolleyballTeamMemberMutation,
  useRemoveVolleyballTeamMemberMutation,
} from "@/store/api/volleyball/volleyballTeamApi";

type Step = "PLAYER" | "VOLLEYBALL_DETAILS";

export default function CreateVolleyballPlayersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTo = searchParams.get("returnTo");

  const teamId = searchParams.get("teamId");

  const [step, setStep] = useState<Step>("PLAYER");

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [addedPlayers, setAddedPlayers] = useState<Player[]>([]);

  const [error, setError] = useState("");

  const [addVolleyballTeamMember, { isLoading: isAddingMember }] =
    useAddVolleyballTeamMemberMutation();

  const [removeVolleyballTeamMember] = useRemoveVolleyballTeamMemberMutation();

  function handlePlayerReady(player: Player) {
    setError("");
    setSelectedPlayer(player);
    setStep("VOLLEYBALL_DETAILS");

    return false;
  }

  async function handleMemberSubmit(
    values: Omit<AddVolleyballTeamMemberDto, "playerId">,
  ) {
    if (!teamId || !selectedPlayer) {
      setError("Team or player information is missing.");
      return;
    }

    setError("");

    try {
      await addVolleyballTeamMember({
        teamId,
        body: {
          playerId: selectedPlayer.id,
          jerseyNumber: values.jerseyNumber,
          primaryPosition: values.primaryPosition,
          ...(values.secondaryPosition
            ? {
                secondaryPosition: values.secondaryPosition,
              }
            : {}),
        },
      }).unwrap();

      setAddedPlayers((prev) => {
        const alreadyAdded = prev.some(
          (player) => player.id === selectedPlayer.id,
        );

        if (alreadyAdded) {
          return prev;
        }

        return [...prev, selectedPlayer];
      });

      setSelectedPlayer(null);
      setStep("PLAYER");
    } catch (err) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
          ? String(err.data.message)
          : "Failed to add player to volleyball team.";

      setError(message);
    }
  }

  async function handleRemovePlayer(player: Player) {
    if (!teamId) {
      throw new Error("Team ID not found.");
    }

    await removeVolleyballTeamMember({
      teamId,
      playerId: player.id,
    }).unwrap();

    setAddedPlayers((prev) => prev.filter((item) => item.id !== player.id));
  }

  if (!teamId) {
    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4">
        <div className="w-full rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <p className="text-sm font-bold text-(--color-text-primary)">
            Team not found
          </p>

          <p className="mt-1 text-xs text-(--color-text-muted)">
            Create or select a volleyball team before adding players.
          </p>
        </div>
      </div>
    );
  }

  if (step === "VOLLEYBALL_DETAILS" && selectedPlayer) {
    return (
      <div className="min-h-full bg-(--color-bg-base) px-4 py-5">
        <VolleyballMemberForm
          player={selectedPlayer}
          isLoading={isAddingMember}
          error={error}
          onCancel={() => {
            setError("");
            setSelectedPlayer(null);
            setStep("PLAYER");
          }}
          onSubmit={handleMemberSubmit}
        />
      </div>
    );
  }

  return (
    <CreatePlayerFlow
      addedPlayers={addedPlayers}
      onAddPlayer={handlePlayerReady}
      onRemovePlayer={addedPlayers.length > 0 ? handleRemovePlayer : undefined}
      createdSource="TEAM_MANAGEMENT"
      helperText="Find or create a player, then add their volleyball details."
      onDone={() => {
        if (returnTo) {
          router.push(returnTo);
          return;
        }

        router.push(`/volleyball/teams/${teamId}`);
      }}
      doneLabel={(count) =>
        `Done — ${count} Player${count > 1 ? "s" : ""} Added`
      }
    />
  );
}
