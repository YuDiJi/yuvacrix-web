"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Plus, Trophy, Users } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  CreateGroupForm,
  type CreateGroupFormValues,
  type CreateGroupRound,
  type CreateGroupTeam,
} from "@/components/cricket/tournament/CreateGroupForm";

import { Button } from "@/components/common/Button";

import { useGetTournamentRoundsQuery } from "@/store/api/cricket/tournamentRoundApi";
import { useGetTournamentTeamsQuery } from "@/store/api/cricket/tournamentTeamApi";
import { useCreateTournamentGroupMutation } from "@/store/api/cricket/tournamentGroupApi";

function getApiErrorMessage(error: unknown, fallback: string): string {
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

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export default function CreateTournamentGroupPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const tournamentId = params.tournamentId as string;

  const requestedRoundId = searchParams.get("roundId") ?? undefined;

  const [submitError, setSubmitError] = useState("");

  const {
    data: tournamentRounds = [],
    isLoading: isLoadingRounds,
    isFetching: isFetchingRounds,
    isError: isRoundsError,
    refetch: refetchRounds,
  } = useGetTournamentRoundsQuery({
    tournamentId,
  });

  const {
    data: tournamentTeams = [],
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    isError: isTeamsError,
    refetch: refetchTeams,
  } = useGetTournamentTeamsQuery({
    tournamentId,
    status: "ACTIVE",
  });

  const [createTournamentGroup, { isLoading: isCreatingGroup }] =
    useCreateTournamentGroupMutation();

  const rounds = useMemo<CreateGroupRound[]>(
    () =>
      tournamentRounds.map((round) => ({
        id: round.id,
        name: round.name,
      })),
    [tournamentRounds],
  );

  const teams = useMemo<CreateGroupTeam[]>(
    () =>
      tournamentTeams.map((team) => ({
        id: team.teamId,
        name: team.teamNameSnapshot,
        shortName: team.teamShortNameSnapshot ?? null,
        logoUrl: team.teamLogoSnapshot ?? null,
      })),
    [tournamentTeams],
  );

  const initialRoundId =
    requestedRoundId && rounds.some((round) => round.id === requestedRoundId)
      ? requestedRoundId
      : rounds.length === 1
        ? rounds[0].id
        : undefined;

  const isInitialLoading = isLoadingRounds || isLoadingTeams;

  const isSubmitting = isCreatingGroup || isFetchingRounds || isFetchingTeams;

  async function handleCreateGroup(values: CreateGroupFormValues) {
    setSubmitError("");

    try {
      const createdGroup = await createTournamentGroup({
        tournamentId,
        roundId: values.roundId,

        body: {
          name: values.name,
          description: values.description,
          teamIds: values.teamIds,
        },
      }).unwrap();

      router.replace(
        `/tournaments/${tournamentId}?tab=points&roundId=${values.roundId}&groupId=${createdGroup.id}`,
      );
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "Failed to create group. Please try again."),
      );
    }
  }

  if (isInitialLoading) {
    return (
      <div className="flex min-h-full flex-col gap-3 bg-(--color-bg-base) p-4">
        <div className="h-28 animate-pulse rounded-2xl bg-(--color-bg-card)" />
        <div className="h-36 animate-pulse rounded-2xl bg-(--color-bg-card)" />

        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-2xl bg-(--color-bg-card)"
          />
        ))}
      </div>
    );
  }

  if (isRoundsError || isTeamsError) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-(--color-bg-base) px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-live)/10">
          <AlertCircle size={30} className="text-(--color-live)" />
        </div>

        <div>
          <h2 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
            Failed to Load Group Setup
          </h2>

          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Tournament rounds or teams could not be loaded.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (isRoundsError) {
              void refetchRounds();
            }

            if (isTeamsError) {
              void refetchTeams();
            }
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-(--color-bg-base) px-6 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-(--color-bg-tint)">
          <Trophy size={34} className="text-(--color-brand)" />
        </div>

        <h2 className="mt-5 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
          Create a Round First
        </h2>

        <p className="mt-2 max-w-72 text-sm leading-6 text-(--color-text-secondary)">
          Every group must belong to a tournament round. Create a round before
          adding groups.
        </p>

        <Button
          type="button"
          size="sm"
          className="mt-6"
          leftIcon={<Plus size={16} />}
          onClick={() =>
            router.push(`/tournaments/${tournamentId}/start-match/round`)
          }
        >
          Create Round
        </Button>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 text-sm font-semibold text-(--color-text-secondary)"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (teams.length < 2) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-(--color-bg-base) px-6 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-(--color-bg-tint)">
          <Users size={34} className="text-(--color-brand)" />
        </div>

        <h2 className="mt-5 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
          More Teams Required
        </h2>

        <p className="mt-2 max-w-72 text-sm leading-6 text-(--color-text-secondary)">
          Add at least two active teams to the tournament before creating a
          group.
        </p>

        <Button
          type="button"
          size="sm"
          className="mt-6"
          leftIcon={<Plus size={16} />}
          onClick={() => router.push(`/tournaments/${tournamentId}/add-teams`)}
        >
          Add Teams
        </Button>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 text-sm font-semibold text-(--color-text-secondary)"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <CreateGroupForm
      tournamentId={tournamentId}
      rounds={rounds}
      teams={teams}
      initialRoundId={initialRoundId}
      title="Create Group"
      descriptionText="Select a round, give the group a name, and choose the available teams."
      submitText="Create Group"
      isLoading={isSubmitting}
      error={submitError}
      onSubmit={handleCreateGroup}
      onCancel={() => router.back()}
    />
  );
}
