// "use client";

// import { useMemo, useState } from "react";
// import { AlertCircle } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";

// import {
//   CreateGroupForm,
//   type CreateGroupFormValues,
//   type CreateGroupRound,
//   type CreateGroupTeam,
// } from "@/components/tournament/CreateGroupForm";

// import { Button } from "@/components/common/Button";

// import {
//   useGetTournamentGroupDetailQuery,
//   useGetTournamentGroupsQuery,
//   useReplaceTournamentGroupTeamsMutation,
//   useUpdateTournamentGroupMutation,
// } from "@/store/api/tournamentGroupApi";

// import { useGetTournamentRoundsQuery } from "@/store/api/tournamentRoundApi";
// import { useGetTournamentTeamsQuery } from "@/store/api/tournamentTeamApi";
// import { skipToken } from "@reduxjs/toolkit/query";

// function getApiErrorMessage(error: unknown, fallback: string): string {
//   if (
//     error &&
//     typeof error === "object" &&
//     "data" in error &&
//     error.data &&
//     typeof error.data === "object" &&
//     "message" in error.data
//   ) {
//     return String(error.data.message);
//   }

//   if (error instanceof Error) {
//     return error.message;
//   }

//   return fallback;
// }

// function arraysContainSameValues(first: string[], second: string[]): boolean {
//   if (first.length !== second.length) {
//     return false;
//   }

//   const firstSet = new Set(first);

//   return second.every((value) => firstSet.has(value));
// }

// export default function EditTournamentGroupPage() {
//   const router = useRouter();
//   const params = useParams();

//   const tournamentId = params.tournamentId as string;
//   const groupId = params.groupId as string;

//   const [submitError, setSubmitError] = useState("");

//   const {
//     data: group,
//     isLoading: isLoadingGroup,
//     isFetching: isFetchingGroup,
//     isError: isGroupError,
//     refetch: refetchGroup,
//   } = useGetTournamentGroupDetailQuery({
//     tournamentId,
//     groupId,
//   });

//   const {
//     data: groups = [],
//     isLoading: isLoadingGroups,
//     isFetching: isFetchingGroups,
//     isError: isGroupsError,
//     refetch: refetchGroups,
//   } = useGetTournamentGroupsQuery(
//     group?.roundId
//       ? {
//           tournamentId,
//           roundId: group.roundId,
//         }
//       : skipToken,
//   );

//   const {
//     data: tournamentRounds = [],
//     isLoading: isLoadingRounds,
//     isFetching: isFetchingRounds,
//     isError: isRoundsError,
//     refetch: refetchRounds,
//   } = useGetTournamentRoundsQuery({
//     tournamentId,
//   });

//   const {
//     data: tournamentTeams = [],
//     isLoading: isLoadingTeams,
//     isFetching: isFetchingTeams,
//     isError: isTeamsError,
//     refetch: refetchTeams,
//   } = useGetTournamentTeamsQuery({
//     tournamentId,
//     status: "ACTIVE",
//   });

//   const [updateTournamentGroup, { isLoading: isUpdatingGroup }] =
//     useUpdateTournamentGroupMutation();

//   const [replaceTournamentGroupTeams, { isLoading: isReplacingTeams }] =
//     useReplaceTournamentGroupTeamsMutation();

//   const rounds = useMemo<CreateGroupRound[]>(
//     () =>
//       tournamentRounds.map((round) => ({
//         id: round.id,
//         name: round.name,
//       })),
//     [tournamentRounds],
//   );

//   const teams = useMemo<CreateGroupTeam[]>(
//     () =>
//       tournamentTeams.map((team) => ({
//         id: team.teamId,
//         name: team.teamNameSnapshot,
//         shortName: team.teamShortNameSnapshot ?? null,
//         logoUrl: team.teamLogoSnapshot ?? null,
//       })),
//     [tournamentTeams],
//   );

//   const existingTeamIds = useMemo<string[]>(() => {
//     if (!group) return [];

//     if (Array.isArray(group.teamIds)) {
//       return group.teamIds;
//     }

//     if (Array.isArray(group.teams)) {
//       return group.teams.map((team) => team.teamId).filter(Boolean);
//     }

//     return [];
//   }, [group]);

//   const isInitialLoading =
//     isLoadingGroup || isLoadingGroups || isLoadingRounds || isLoadingTeams;

//   const isFetching =
//     isFetchingGroup || isFetchingGroups || isFetchingRounds || isFetchingTeams;

//   const hasLoadError =
//     isGroupError || isGroupsError || isRoundsError || isTeamsError;

//   const isSubmitting = isUpdatingGroup || isReplacingTeams || isFetching;

//   async function handleUpdateGroup(values: CreateGroupFormValues) {
//     if (!group) return;

//     setSubmitError("");

//     try {
//       const trimmedName = values.name.trim();
//       const trimmedDescription = values.description?.trim() || undefined;

//       const groupInfoChanged =
//         trimmedName !== group.name ||
//         (trimmedDescription ?? "") !== (group.description ?? "");

//       const teamsChanged = !arraysContainSameValues(
//         existingTeamIds,
//         values.teamIds,
//       );

//       if (!groupInfoChanged && !teamsChanged) {
//         router.back();
//         return;
//       }

//       /*
//        * Run independently so both requests can happen together.
//        * Each request is only included when that data changed.
//        */
//       const requests: Promise<unknown>[] = [];

//       if (groupInfoChanged) {
//         requests.push(
//           updateTournamentGroup({
//             tournamentId,
//             roundId: group.roundId,
//             groupId,
//             body: {
//               name: trimmedName,
//               description: trimmedDescription,
//             },
//           }).unwrap(),
//         );
//       }

//       if (teamsChanged) {
//         requests.push(
//           replaceTournamentGroupTeams({
//             tournamentId,
//             roundId: group.roundId,
//             groupId,
//             body: {
//               teamIds: values.teamIds,
//             },
//           }).unwrap(),
//         );
//       }

//       await Promise.all(requests);

//       router.back();
//     } catch (error) {
//       setSubmitError(
//         getApiErrorMessage(error, "Failed to update group. Please try again."),
//       );
//     }
//   }

//   const teamAssignments = useMemo(
//     () =>
//       groups.flatMap((item) => {
//         const teamIds = Array.isArray(item.teamIds)
//           ? item.teamIds
//           : Array.isArray(item.teams)
//             ? item.teams.map((team) => team.teamId).filter(Boolean)
//             : [];

//         return teamIds.map((teamId) => ({
//           teamId,
//           roundId: item.roundId,
//           groupId: item.id,
//           groupName: item.name,
//         }));
//       }),
//     [groups],
//   );

//   if (isInitialLoading) {
//     return (
//       <div className="flex min-h-full flex-col gap-3 bg-(--color-bg-base) p-4">
//         <div className="h-28 animate-pulse rounded-2xl bg-(--color-bg-card)" />
//         <div className="h-36 animate-pulse rounded-2xl bg-(--color-bg-card)" />

//         {Array.from({ length: 4 }).map((_, index) => (
//           <div
//             key={index}
//             className="h-20 animate-pulse rounded-2xl bg-(--color-bg-card)"
//           />
//         ))}
//       </div>
//     );
//   }

//   if (hasLoadError || !group) {
//     return (
//       <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-(--color-bg-base) px-6 text-center">
//         <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-live)/10">
//           <AlertCircle size={30} className="text-(--color-live)" />
//         </div>

//         <div>
//           <h2 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
//             Failed to Load Group
//           </h2>

//           <p className="mt-1 text-sm text-(--color-text-secondary)">
//             Group details, rounds, or tournament teams could not be loaded.
//           </p>
//         </div>

//         <Button
//           type="button"
//           size="sm"
//           onClick={() => {
//             if (isGroupError) {
//               void refetchGroup();
//             }

//             if (isRoundsError) {
//               void refetchRounds();
//             }

//             if (isTeamsError) {
//               void refetchTeams();
//             }
//           }}
//         >
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <CreateGroupForm
//       rounds={rounds}
//       teams={teams}
//       teamAssignments={teamAssignments}
//       currentGroupId={groupId}
//       title="Edit Group"
//       descriptionText="Update the group name, description, and selected teams."
//       submitText="Save Changes"
//       initialValues={{
//         roundId: group.roundId,
//         name: group.name,
//         description: group.description ?? "",
//         teamIds: existingTeamIds,
//       }}
//       allowRoundChange={false}
//       isLoading={isSubmitting}
//       error={submitError}
//       onSubmit={handleUpdateGroup}
//       onCancel={() => router.back()}
//     />
//   );
// }

"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  CreateGroupForm,
  type CreateGroupFormValues,
  type CreateGroupRound,
  type CreateGroupTeam,
} from "@/components/tournament/CreateGroupForm";

import { Button } from "@/components/common/Button";

import {
  useGetTournamentGroupDetailQuery,
  useReplaceTournamentGroupTeamsMutation,
  useUpdateTournamentGroupMutation,
} from "@/store/api/tournamentGroupApi";

import { useGetTournamentRoundsQuery } from "@/store/api/tournamentRoundApi";
import { useGetTournamentTeamsQuery } from "@/store/api/tournamentTeamApi";

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

function arraysContainSameValues(first: string[], second: string[]): boolean {
  if (first.length !== second.length) {
    return false;
  }

  const firstSet = new Set(first);

  return second.every((value) => firstSet.has(value));
}

export default function EditTournamentGroupPage() {
  const router = useRouter();
  const params = useParams();

  const tournamentId = params.tournamentId as string;

  const groupId = params.groupId as string;

  const [submitError, setSubmitError] = useState("");

  const {
    data: group,
    isLoading: isLoadingGroup,
    isFetching: isFetchingGroup,
    isError: isGroupError,
    refetch: refetchGroup,
  } = useGetTournamentGroupDetailQuery({
    tournamentId,
    groupId,
  });

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

  const [updateTournamentGroup, { isLoading: isUpdatingGroup }] =
    useUpdateTournamentGroupMutation();

  const [replaceTournamentGroupTeams, { isLoading: isReplacingTeams }] =
    useReplaceTournamentGroupTeamsMutation();

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

  const existingTeamIds = useMemo<string[]>(() => {
    if (!group) return [];

    if (Array.isArray(group.teamIds)) {
      return group.teamIds;
    }

    if (Array.isArray(group.teams)) {
      return group.teams
        .map((team) => team.teamId)
        .filter((teamId): teamId is string => Boolean(teamId));
    }

    return [];
  }, [group]);

  const isInitialLoading = isLoadingGroup || isLoadingRounds || isLoadingTeams;

  const isFetching = isFetchingGroup || isFetchingRounds || isFetchingTeams;

  const hasLoadError = isGroupError || isRoundsError || isTeamsError;

  const isSubmitting = isUpdatingGroup || isReplacingTeams || isFetching;

  async function handleUpdateGroup(values: CreateGroupFormValues) {
    if (!group) return;

    setSubmitError("");

    try {
      const trimmedName = values.name.trim();

      const trimmedDescription = values.description?.trim() || undefined;

      const groupInfoChanged =
        trimmedName !== group.name ||
        (trimmedDescription ?? "") !== (group.description ?? "");

      const teamsChanged = !arraysContainSameValues(
        existingTeamIds,
        values.teamIds,
      );

      if (!groupInfoChanged && !teamsChanged) {
        router.back();
        return;
      }

      const requests: Promise<unknown>[] = [];

      if (groupInfoChanged) {
        requests.push(
          updateTournamentGroup({
            tournamentId,
            roundId: group.roundId,
            groupId,

            body: {
              name: trimmedName,
              description: trimmedDescription,
            },
          }).unwrap(),
        );
      }

      if (teamsChanged) {
        requests.push(
          replaceTournamentGroupTeams({
            tournamentId,
            roundId: group.roundId,
            groupId,

            body: {
              teamIds: values.teamIds,
            },
          }).unwrap(),
        );
      }

      await Promise.all(requests);

      router.back();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "Failed to update group. Please try again."),
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

  if (hasLoadError || !group) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-(--color-bg-base) px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-live)/10">
          <AlertCircle size={30} className="text-(--color-live)" />
        </div>

        <div>
          <h2 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
            Failed to Load Group
          </h2>

          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Group details, rounds, or tournament teams could not be loaded.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (isGroupError) {
              void refetchGroup();
            }

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

  return (
    <CreateGroupForm
      tournamentId={tournamentId}
      rounds={rounds}
      teams={teams}
      currentGroupId={groupId}
      title="Edit Group"
      descriptionText="Update the group name, description, and selected teams."
      submitText="Save Changes"
      initialValues={{
        roundId: group.roundId,
        name: group.name,
        description: group.description ?? "",
        teamIds: existingTeamIds,
      }}
      allowRoundChange={false}
      isLoading={isSubmitting}
      error={submitError}
      onSubmit={handleUpdateGroup}
      onCancel={() => router.back()}
    />
  );
}
