// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { AlertCircle, Check, ChevronDown, Search, Users } from "lucide-react";

// import { Button } from "@/components/common/Button";
// import { S3Image } from "@/components/common/S3Image";
// import { cn } from "@/lib/cn";

// export type CreateGroupRound = {
//   id: string;
//   name: string;
// };

// export type CreateGroupTeam = {
//   id: string;
//   name: string;
//   shortName?: string | null;
//   logoUrl?: string | null;
// };

// export type CreateGroupFormValues = {
//   roundId: string;
//   name: string;
//   description?: string;
//   teamIds: string[];
// };

// export type CreateGroupFormInitialValues = {
//   roundId: string;
//   name: string;
//   description?: string | null;
//   teamIds?: string[];
// };

// type CreateGroupFormProps = {
//   rounds: CreateGroupRound[];
//   teams: CreateGroupTeam[];

//   title?: string;
//   descriptionText?: string;
//   submitText?: string;

//   initialRoundId?: string;
//   initialValues?: CreateGroupFormInitialValues;

//   /**
//    * Keep false for edit mode when a group cannot be moved
//    * to another round after creation.
//    */
//   allowRoundChange?: boolean;

//   isLoading?: boolean;
//   error?: string;

//   onSubmit: (values: CreateGroupFormValues) => Promise<void> | void;

//   onCancel?: () => void;
// };

// function TeamLogo({ team }: { team: CreateGroupTeam }) {
//   const fallback = (
//     <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
//       <span className="font-(family-name:--font-display) text-base font-black uppercase text-white">
//         {team.name.charAt(0).toUpperCase()}
//       </span>
//     </div>
//   );

//   return (
//     <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint)">
//       {team.logoUrl ? (
//         <S3Image
//           imageKey={team.logoUrl}
//           alt={team.name}
//           width={48}
//           height={48}
//           className="h-full w-full object-cover"
//           fallback={fallback}
//         />
//       ) : (
//         fallback
//       )}
//     </div>
//   );
// }

// export function CreateGroupForm({
//   rounds,
//   teams,

//   title = "Create Group",
//   descriptionText = "Select a round, give the group a name and choose the teams that belong to it.",
//   submitText = "Create Group",

//   initialRoundId,
//   initialValues,

//   allowRoundChange = true,

//   isLoading = false,
//   error = "",

//   onSubmit,
//   onCancel,
// }: CreateGroupFormProps) {
//   const resolvedInitialRoundId =
//     initialValues?.roundId ??
//     initialRoundId ??
//     (rounds.length === 1 ? rounds[0].id : "");

//   const [selectedRoundId, setSelectedRoundId] = useState(
//     resolvedInitialRoundId,
//   );

//   const [roundPickerOpen, setRoundPickerOpen] = useState(false);

//   const [name, setName] = useState(initialValues?.name ?? "");

//   const [description, setDescription] = useState(
//     initialValues?.description ?? "",
//   );

//   const [searchTerm, setSearchTerm] = useState("");

//   const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>(
//     initialValues?.teamIds ?? [],
//   );

//   const [roundError, setRoundError] = useState("");
//   const [nameError, setNameError] = useState("");
//   const [teamError, setTeamError] = useState("");

//   /*
//    * This supports edit pages where group data arrives after
//    * the first render from an API query.
//    */
//   useEffect(() => {
//     if (!initialValues) return;

//     setSelectedRoundId(initialValues.roundId);
//     setName(initialValues.name);
//     setDescription(initialValues.description ?? "");
//     setSelectedTeamIds(initialValues.teamIds ?? []);
//   }, [initialValues]);

//   /*
//    * Supports async rounds loading and automatically selects
//    * the only available round in create mode.
//    */
//   useEffect(() => {
//     if (selectedRoundId) return;

//     if (initialRoundId) {
//       setSelectedRoundId(initialRoundId);
//       return;
//     }

//     if (rounds.length === 1) {
//       setSelectedRoundId(rounds[0].id);
//     }
//   }, [initialRoundId, rounds, selectedRoundId]);

//   const selectedRound = rounds.find((round) => round.id === selectedRoundId);

//   const filteredTeams = useMemo(() => {
//     const query = searchTerm.trim().toLowerCase();

//     if (!query) {
//       return teams;
//     }

//     return teams.filter((team) => {
//       const matchesName = team.name.toLowerCase().includes(query);

//       const matchesShortName =
//         team.shortName?.toLowerCase().includes(query) ?? false;

//       return matchesName || matchesShortName;
//     });
//   }, [searchTerm, teams]);

//   const selectedCount = selectedTeamIds.length;

//   const canSubmit =
//     Boolean(selectedRoundId) &&
//     name.trim().length >= 2 &&
//     selectedCount >= 2 &&
//     !isLoading;

//   const roundSelectionDisabled =
//     isLoading || rounds.length <= 1 || !allowRoundChange;

//   function handleRoundSelect(roundId: string) {
//     if (!allowRoundChange) return;

//     setSelectedRoundId(roundId);
//     setRoundError("");
//     setRoundPickerOpen(false);
//   }

//   function toggleTeam(teamId: string) {
//     if (isLoading) return;

//     setTeamError("");

//     setSelectedTeamIds((current) =>
//       current.includes(teamId)
//         ? current.filter((id) => id !== teamId)
//         : [...current, teamId],
//     );
//   }

//   async function handleSubmit() {
//     const trimmedName = name.trim();
//     const trimmedDescription = description.trim();

//     setRoundError("");
//     setNameError("");
//     setTeamError("");

//     let hasError = false;

//     if (!selectedRoundId) {
//       setRoundError("Select a round.");
//       hasError = true;
//     }

//     if (trimmedName.length < 2) {
//       setNameError("Enter a group name.");
//       hasError = true;
//     }

//     if (selectedTeamIds.length < 2) {
//       setTeamError("Select at least 2 teams.");
//       hasError = true;
//     }

//     if (hasError) return;

//     await onSubmit({
//       roundId: selectedRoundId,
//       name: trimmedName,
//       description: trimmedDescription || undefined,
//       teamIds: selectedTeamIds,
//     });
//   }

//   return (
//     <div className="flex min-h-full flex-col bg-(--color-bg-base)">
//       <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
//         {/* Intro */}
//         <div className="mb-4 rounded-2xl border border-(--color-brand)/20 bg-(--color-bg-tint) p-4">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-brand)/10">
//               <Users size={20} className="text-(--color-brand)" />
//             </div>

//             <div>
//               <h2 className="font-(family-name:--font-display) text-lg font-black uppercase tracking-wide text-(--color-text-primary)">
//                 {title}
//               </h2>

//               <p className="mt-1 text-sm leading-5 text-(--color-text-secondary)">
//                 {descriptionText}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Round */}
//         <section className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
//           <label className="text-section-label mb-1.5 block">
//             Round <span className="text-(--color-live)">*</span>
//           </label>

//           <div className="relative">
//             <button
//               type="button"
//               disabled={roundSelectionDisabled}
//               onClick={() => setRoundPickerOpen((current) => !current)}
//               className={cn(
//                 "flex w-full items-center justify-between rounded-xl border-2 bg-(--color-bg-base) px-4 py-3 text-left",
//                 "transition-colors",
//                 roundError
//                   ? "border-(--color-live)"
//                   : "border-(--color-bg-border)",
//                 !roundSelectionDisabled && "hover:border-(--color-brand)/30",
//                 "disabled:cursor-not-allowed disabled:opacity-70",
//               )}
//             >
//               <div className="min-w-0">
//                 <p
//                   className={cn(
//                     "truncate text-sm font-semibold",
//                     selectedRound
//                       ? "text-(--color-text-primary)"
//                       : "text-(--color-text-muted)",
//                   )}
//                 >
//                   {selectedRound?.name ?? "Select round"}
//                 </p>

//                 {!allowRoundChange && selectedRound && (
//                   <p className="mt-0.5 text-xs text-(--color-text-muted)">
//                     The round cannot be changed while editing.
//                   </p>
//                 )}

//                 {allowRoundChange && rounds.length === 1 && selectedRound && (
//                   <p className="mt-0.5 text-xs text-(--color-text-muted)">
//                     Only one round is available.
//                   </p>
//                 )}
//               </div>

//               {!roundSelectionDisabled && (
//                 <ChevronDown
//                   size={18}
//                   className={cn(
//                     "shrink-0 text-(--color-text-muted) transition-transform",
//                     roundPickerOpen && "rotate-180",
//                   )}
//                 />
//               )}
//             </button>

//             {roundPickerOpen && !roundSelectionDisabled && (
//               <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-2 shadow-[0_12px_40px_rgba(13,27,62,0.18)]">
//                 {rounds.map((round) => {
//                   const isSelected = selectedRoundId === round.id;

//                   return (
//                     <button
//                       key={round.id}
//                       type="button"
//                       onClick={() => handleRoundSelect(round.id)}
//                       className={cn(
//                         "w-full rounded-xl px-3 py-3 text-left transition-colors",
//                         isSelected
//                           ? "bg-(--color-brand) text-white"
//                           : "text-(--color-text-primary) hover:bg-(--color-bg-tint)",
//                       )}
//                     >
//                       <p className="font-(family-name:--font-display) text-sm font-black uppercase">
//                         {round.name}
//                       </p>
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {roundError && (
//             <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-(--color-live)">
//               <AlertCircle size={12} />
//               {roundError}
//             </p>
//           )}
//         </section>

//         {/* Group information */}
//         <section className="mt-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
//           <div>
//             <label
//               htmlFor="group-name"
//               className="text-section-label mb-1.5 block"
//             >
//               Group Name <span className="text-(--color-live)">*</span>
//             </label>

//             <input
//               id="group-name"
//               type="text"
//               value={name}
//               disabled={isLoading}
//               onChange={(event) => {
//                 setName(event.target.value);
//                 setNameError("");
//               }}
//               placeholder="e.g. Group A"
//               maxLength={100}
//               className={cn(
//                 "w-full rounded-xl border-2 bg-(--color-bg-base) px-4 py-3",
//                 "text-sm font-semibold text-(--color-text-primary)",
//                 "placeholder:text-(--color-text-muted)",
//                 "outline-none transition-colors",
//                 nameError
//                   ? "border-(--color-live)"
//                   : "border-(--color-bg-border) focus:border-(--color-sky)",
//               )}
//             />

//             {nameError && (
//               <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-(--color-live)">
//                 <AlertCircle size={12} />
//                 {nameError}
//               </p>
//             )}
//           </div>

//           <div className="mt-4">
//             <label
//               htmlFor="group-description"
//               className="text-section-label mb-1.5 block"
//             >
//               Description{" "}
//               <span className="normal-case text-(--color-text-muted)">
//                 (optional)
//               </span>
//             </label>

//             <textarea
//               id="group-description"
//               value={description}
//               disabled={isLoading}
//               onChange={(event) => setDescription(event.target.value)}
//               placeholder="e.g. First pool of the league stage"
//               rows={3}
//               maxLength={500}
//               className={cn(
//                 "w-full resize-none rounded-xl border-2 border-(--color-bg-border)",
//                 "bg-(--color-bg-base) px-4 py-3",
//                 "text-sm font-medium text-(--color-text-primary)",
//                 "placeholder:text-(--color-text-muted)",
//                 "outline-none transition-colors focus:border-(--color-sky)",
//               )}
//             />
//           </div>
//         </section>

//         {/* Teams */}
//         <section className="mt-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
//           <div className="flex items-start justify-between gap-3">
//             <div>
//               <h3 className="font-(family-name:--font-display) text-base font-black uppercase tracking-wide text-(--color-text-primary)">
//                 Select Teams
//               </h3>

//               <p className="mt-0.5 text-xs text-(--color-text-secondary)">
//                 Select at least 2 teams for this group.
//               </p>
//             </div>

//             <div
//               className={cn(
//                 "shrink-0 rounded-full px-3 py-1.5",
//                 "font-(family-name:--font-display) text-xs font-black uppercase",
//                 selectedCount >= 2
//                   ? "bg-(--color-brand) text-white"
//                   : "bg-(--color-bg-tint) text-(--color-brand)",
//               )}
//             >
//               {selectedCount} Selected
//             </div>
//           </div>

//           <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-(--color-bg-border) bg-(--color-bg-base) px-4 py-3 focus-within:border-(--color-sky)">
//             <Search size={17} className="shrink-0 text-(--color-text-muted)" />

//             <input
//               type="text"
//               value={searchTerm}
//               disabled={isLoading}
//               onChange={(event) => setSearchTerm(event.target.value)}
//               placeholder="Search teams..."
//               className="min-w-0 flex-1 bg-transparent text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
//             />
//           </div>

//           {teamError && (
//             <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-(--color-live)">
//               <AlertCircle size={12} />
//               {teamError}
//             </p>
//           )}

//           <div className="mt-4 flex flex-col gap-2.5">
//             {filteredTeams.map((team) => {
//               const isSelected = selectedTeamIds.includes(team.id);

//               return (
//                 <button
//                   key={team.id}
//                   type="button"
//                   disabled={isLoading}
//                   onClick={() => toggleTeam(team.id)}
//                   className={cn(
//                     "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left",
//                     "transition-all duration-150 active:scale-[0.99]",
//                     isSelected
//                       ? "border-(--color-brand) bg-(--color-brand)/5"
//                       : "border-(--color-bg-border) bg-(--color-bg-base)",
//                     "disabled:cursor-not-allowed disabled:opacity-60",
//                   )}
//                 >
//                   <TeamLogo team={team} />

//                   <div className="min-w-0 flex-1">
//                     <p
//                       className={cn(
//                         "truncate font-(family-name:--font-display) text-sm font-black uppercase",
//                         isSelected
//                           ? "text-(--color-brand)"
//                           : "text-(--color-text-primary)",
//                       )}
//                     >
//                       {team.name}
//                     </p>

//                     {team.shortName && team.shortName !== team.name && (
//                       <p className="mt-0.5 truncate text-xs text-(--color-text-muted)">
//                         {team.shortName}
//                       </p>
//                     )}
//                   </div>

//                   <div
//                     className={cn(
//                       "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
//                       isSelected
//                         ? "border-(--color-brand) bg-(--color-brand)"
//                         : "border-(--color-bg-border) bg-white",
//                     )}
//                   >
//                     {isSelected && (
//                       <Check size={14} strokeWidth={3} className="text-white" />
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {filteredTeams.length === 0 && (
//             <div className="py-10 text-center">
//               <p className="text-sm font-medium text-(--color-text-muted)">
//                 No teams found.
//               </p>
//             </div>
//           )}
//         </section>

//         {error && (
//           <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
//             <AlertCircle
//               size={16}
//               className="mt-0.5 shrink-0 text-(--color-live)"
//             />

//             <p className="text-sm font-medium text-(--color-live)">{error}</p>
//           </div>
//         )}
//       </div>

//       {/* Sticky footer */}
//       <div className="safe-bottom sticky bottom-0 z-20 flex gap-2 border-t border-(--color-bg-border) bg-(--color-bg-card) p-3">
//         {onCancel && (
//           <Button
//             type="button"
//             size="sm"
//             variant="secondary"
//             fullWidth
//             disabled={isLoading}
//             onClick={onCancel}
//           >
//             Cancel
//           </Button>
//         )}

//         <Button
//           type="button"
//           size="sm"
//           fullWidth
//           loading={isLoading}
//           disabled={!canSubmit}
//           onClick={handleSubmit}
//           className={cn(!canSubmit && "cursor-not-allowed opacity-50")}
//         >
//           {submitText}
//         </Button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Lock,
  RefreshCcw,
  Search,
  Users,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";

import { Button } from "@/components/common/Button";
import { S3Image } from "@/components/common/S3Image";
import { cn } from "@/lib/cn";

import { useGetTournamentGroupsQuery } from "@/store/api/tournamentGroupApi";

export type CreateGroupRound = {
  id: string;
  name: string;
};

export type CreateGroupTeam = {
  id: string;
  name: string;
  shortName?: string | null;
  logoUrl?: string | null;
};

export type CreateGroupFormValues = {
  roundId: string;
  name: string;
  description?: string;
  teamIds: string[];
};

export type CreateGroupFormInitialValues = {
  roundId: string;
  name: string;
  description?: string | null;
  teamIds?: string[];
};

type TeamAssignment = {
  teamId: string;
  roundId: string;
  groupId: string;
  groupName: string;
};

type CreateGroupFormProps = {
  tournamentId: string;

  rounds: CreateGroupRound[];
  teams: CreateGroupTeam[];

  /**
   * Pass this only while editing.
   *
   * Teams already belonging to the current group remain enabled.
   */
  currentGroupId?: string;

  title?: string;
  descriptionText?: string;
  submitText?: string;

  initialRoundId?: string;
  initialValues?: CreateGroupFormInitialValues;

  /**
   * Set false in edit mode if a group cannot be moved
   * to another round.
   */
  allowRoundChange?: boolean;

  isLoading?: boolean;
  error?: string;

  onSubmit: (values: CreateGroupFormValues) => Promise<void> | void;

  onCancel?: () => void;
};

function TeamLogo({ team }: { team: CreateGroupTeam }) {
  const fallback = (
    <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
      <span className="font-(family-name:--font-display) text-base font-black uppercase text-white">
        {team.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );

  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint)">
      {team.logoUrl ? (
        <S3Image
          imageKey={team.logoUrl}
          alt={team.name}
          width={48}
          height={48}
          className="h-full w-full object-cover"
          fallback={fallback}
        />
      ) : (
        fallback
      )}
    </div>
  );
}

function getGroupTeamIds(group: unknown): string[] {
  if (!group || typeof group !== "object") {
    return [];
  }

  const typedGroup = group as {
    teamIds?: unknown;
    teams?: unknown;
  };

  if (Array.isArray(typedGroup.teamIds)) {
    return typedGroup.teamIds.filter(
      (teamId): teamId is string =>
        typeof teamId === "string" && teamId.length > 0,
    );
  }

  if (Array.isArray(typedGroup.teams)) {
    return typedGroup.teams
      .map((team) => {
        if (!team || typeof team !== "object") {
          return null;
        }

        const typedTeam = team as {
          teamId?: unknown;
          id?: unknown;
        };

        if (typeof typedTeam.teamId === "string") {
          return typedTeam.teamId;
        }

        if (typeof typedTeam.id === "string") {
          return typedTeam.id;
        }

        return null;
      })
      .filter((teamId): teamId is string => Boolean(teamId));
  }

  return [];
}

export function CreateGroupForm({
  tournamentId,

  rounds,
  teams,

  currentGroupId,

  title = "Create Group",
  descriptionText = "Select a round, give the group a name and choose the teams that belong to it.",
  submitText = "Create Group",

  initialRoundId,
  initialValues,

  allowRoundChange = true,

  isLoading = false,
  error = "",

  onSubmit,
  onCancel,
}: CreateGroupFormProps) {
  const resolvedInitialRoundId =
    initialValues?.roundId ??
    initialRoundId ??
    (rounds.length === 1 ? rounds[0].id : "");

  const [selectedRoundId, setSelectedRoundId] = useState(
    resolvedInitialRoundId,
  );

  const [roundPickerOpen, setRoundPickerOpen] = useState(false);

  const [name, setName] = useState(initialValues?.name ?? "");

  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>(
    initialValues?.teamIds ?? [],
  );

  const [roundError, setRoundError] = useState("");

  const [nameError, setNameError] = useState("");

  const [teamError, setTeamError] = useState("");

  /*
   * This query follows the round currently selected
   * inside the form.
   */
  const {
    data: roundGroups = [],
    isLoading: isLoadingGroups,
    isFetching: isFetchingGroups,
    isError: isGroupsError,
    refetch: refetchGroups,
  } = useGetTournamentGroupsQuery(
    tournamentId && selectedRoundId
      ? {
          tournamentId,
          roundId: selectedRoundId,
        }
      : skipToken,
  );

  /*
   * Supports edit pages where group data arrives
   * asynchronously.
   */
  useEffect(() => {
    if (!initialValues) return;

    setSelectedRoundId(initialValues.roundId);

    setName(initialValues.name);

    setDescription(initialValues.description ?? "");

    setSelectedTeamIds(initialValues.teamIds ?? []);
  }, [initialValues]);

  /*
   * Automatically select the only round when rounds
   * arrive asynchronously.
   */
  useEffect(() => {
    if (selectedRoundId) return;

    if (initialRoundId) {
      setSelectedRoundId(initialRoundId);
      return;
    }

    if (rounds.length === 1) {
      setSelectedRoundId(rounds[0].id);
    }
  }, [initialRoundId, rounds, selectedRoundId]);

  const selectedRound = useMemo(
    () => rounds.find((round) => round.id === selectedRoundId),
    [rounds, selectedRoundId],
  );

  const teamAssignments = useMemo<TeamAssignment[]>(() => {
    return roundGroups.flatMap((rawGroup) => {
      const group = rawGroup as {
        id?: string;
        groupId?: string;
        name?: string;
        roundId?: string;
      };

      const groupId = group.id ?? group.groupId ?? "";

      const groupName = group.name ?? "Another Group";

      const roundId = group.roundId ?? selectedRoundId;

      return getGroupTeamIds(rawGroup).map((teamId) => ({
        teamId,
        roundId,
        groupId,
        groupName,
      }));
    });
  }, [roundGroups, selectedRoundId]);

  /*
   * Teams assigned to another group in this round.
   *
   * Assignments belonging to the current group are excluded
   * during editing.
   */
  const unavailableTeamAssignmentMap = useMemo(() => {
    const map = new Map<string, TeamAssignment>();

    teamAssignments.forEach((assignment) => {
      const belongsToSelectedRound = assignment.roundId === selectedRoundId;

      const belongsToCurrentGroup =
        Boolean(currentGroupId) && assignment.groupId === currentGroupId;

      if (belongsToSelectedRound && !belongsToCurrentGroup) {
        map.set(assignment.teamId, assignment);
      }
    });

    return map;
  }, [currentGroupId, selectedRoundId, teamAssignments]);

  /*
   * If another group receives a team while this form is open,
   * remove that now-unavailable team from the current selection.
   */
  useEffect(() => {
    if (unavailableTeamAssignmentMap.size === 0) {
      return;
    }

    setSelectedTeamIds((current) => {
      const availableSelections = current.filter(
        (teamId) => !unavailableTeamAssignmentMap.has(teamId),
      );

      if (availableSelections.length === current.length) {
        return current;
      }

      return availableSelections;
    });
  }, [unavailableTeamAssignmentMap]);

  const filteredTeams = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return teams;
    }

    return teams.filter((team) => {
      const matchesName = team.name.toLowerCase().includes(query);

      const matchesShortName =
        team.shortName?.toLowerCase().includes(query) ?? false;

      return matchesName || matchesShortName;
    });
  }, [searchTerm, teams]);

  const selectedCount = selectedTeamIds.length;

  const unavailableCount = unavailableTeamAssignmentMap.size;

  const availableCount = Math.max(0, teams.length - unavailableCount);

  const isFormBusy = isLoading || isLoadingGroups || isFetchingGroups;

  const canSubmit =
    Boolean(selectedRoundId) &&
    name.trim().length >= 2 &&
    selectedCount >= 2 &&
    !isFormBusy &&
    !isGroupsError;

  const roundSelectionDisabled =
    isFormBusy || rounds.length <= 1 || !allowRoundChange;

  function handleRoundSelect(roundId: string) {
    if (!allowRoundChange || isFormBusy) {
      return;
    }

    const roundChanged = roundId !== selectedRoundId;

    setSelectedRoundId(roundId);
    setRoundError("");
    setTeamError("");
    setRoundPickerOpen(false);
    setSearchTerm("");

    /*
     * Teams selected for one round must not carry over
     * into another round.
     */
    if (roundChanged) {
      setSelectedTeamIds([]);
    }
  }

  function toggleTeam(teamId: string) {
    if (isFormBusy) return;

    const unavailableAssignment = unavailableTeamAssignmentMap.get(teamId);

    if (unavailableAssignment) {
      setTeamError(
        `This team is already assigned to ${unavailableAssignment.groupName}.`,
      );

      return;
    }

    setTeamError("");

    setSelectedTeamIds((current) =>
      current.includes(teamId)
        ? current.filter((id) => id !== teamId)
        : [...current, teamId],
    );
  }

  async function handleSubmit() {
    const trimmedName = name.trim();

    const trimmedDescription = description.trim();

    setRoundError("");
    setNameError("");
    setTeamError("");

    let hasError = false;

    if (!selectedRoundId) {
      setRoundError("Select a round.");
      hasError = true;
    }

    if (trimmedName.length < 2) {
      setNameError("Enter a group name.");

      hasError = true;
    }

    if (selectedTeamIds.length < 2) {
      setTeamError("Select at least 2 teams.");

      hasError = true;
    }

    if (isGroupsError) {
      setTeamError(
        "Existing group assignments could not be verified. Try loading them again.",
      );

      hasError = true;
    }

    const unavailableSelectedTeam = selectedTeamIds.find((teamId) =>
      unavailableTeamAssignmentMap.has(teamId),
    );

    if (unavailableSelectedTeam) {
      const assignment = unavailableTeamAssignmentMap.get(
        unavailableSelectedTeam,
      );

      setTeamError(
        assignment
          ? `A selected team is already assigned to ${assignment.groupName}.`
          : "A selected team is already assigned to another group.",
      );

      hasError = true;
    }

    if (hasError) return;

    await onSubmit({
      roundId: selectedRoundId,
      name: trimmedName,
      description: trimmedDescription || undefined,
      teamIds: selectedTeamIds,
    });
  }

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
        {/* Intro */}
        <div className="mb-4 rounded-2xl border border-(--color-brand)/20 bg-(--color-bg-tint) p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-brand)/10">
              <Users size={20} className="text-(--color-brand)" />
            </div>

            <div>
              <h2 className="font-(family-name:--font-display) text-lg font-black uppercase tracking-wide text-(--color-text-primary)">
                {title}
              </h2>

              <p className="mt-1 text-sm leading-5 text-(--color-text-secondary)">
                {descriptionText}
              </p>
            </div>
          </div>
        </div>

        {/* Round */}
        <section className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <label className="text-section-label mb-1.5 block">
            Round <span className="text-(--color-live)">*</span>
          </label>

          <div className="relative">
            <button
              type="button"
              disabled={roundSelectionDisabled}
              onClick={() => setRoundPickerOpen((current) => !current)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border-2 bg-(--color-bg-base) px-4 py-3 text-left",
                "transition-colors",
                roundError
                  ? "border-(--color-live)"
                  : "border-(--color-bg-border)",
                !roundSelectionDisabled && "hover:border-(--color-brand)/30",
                "disabled:cursor-not-allowed disabled:opacity-70",
              )}
            >
              <div className="min-w-0">
                <p
                  className={cn(
                    "truncate text-sm font-semibold",
                    selectedRound
                      ? "text-(--color-text-primary)"
                      : "text-(--color-text-muted)",
                  )}
                >
                  {selectedRound?.name ?? "Select round"}
                </p>

                {!allowRoundChange && selectedRound && (
                  <p className="mt-0.5 text-xs text-(--color-text-muted)">
                    The round cannot be changed while editing.
                  </p>
                )}

                {allowRoundChange && rounds.length === 1 && selectedRound && (
                  <p className="mt-0.5 text-xs text-(--color-text-muted)">
                    Only one round is available.
                  </p>
                )}
              </div>

              {!roundSelectionDisabled && (
                <ChevronDown
                  size={18}
                  className={cn(
                    "shrink-0 text-(--color-text-muted) transition-transform",
                    roundPickerOpen && "rotate-180",
                  )}
                />
              )}
            </button>

            {roundPickerOpen && !roundSelectionDisabled && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-2 shadow-[0_12px_40px_rgba(13,27,62,0.18)]">
                {rounds.map((round) => {
                  const isSelected = selectedRoundId === round.id;

                  return (
                    <button
                      key={round.id}
                      type="button"
                      onClick={() => handleRoundSelect(round.id)}
                      className={cn(
                        "w-full rounded-xl px-3 py-3 text-left transition-colors",
                        isSelected
                          ? "bg-(--color-brand) text-white"
                          : "text-(--color-text-primary) hover:bg-(--color-bg-tint)",
                      )}
                    >
                      <p className="font-(family-name:--font-display) text-sm font-black uppercase">
                        {round.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {roundError && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-(--color-live)">
              <AlertCircle size={12} />
              {roundError}
            </p>
          )}
        </section>

        {/* Group information */}
        <section className="mt-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <div>
            <label
              htmlFor="group-name"
              className="text-section-label mb-1.5 block"
            >
              Group Name <span className="text-(--color-live)">*</span>
            </label>

            <input
              id="group-name"
              type="text"
              value={name}
              disabled={isFormBusy}
              onChange={(event) => {
                setName(event.target.value);

                setNameError("");
              }}
              placeholder="e.g. Group A"
              maxLength={100}
              className={cn(
                "w-full rounded-xl border-2 bg-(--color-bg-base) px-4 py-3",
                "text-sm font-semibold text-(--color-text-primary)",
                "placeholder:text-(--color-text-muted)",
                "outline-none transition-colors",
                nameError
                  ? "border-(--color-live)"
                  : "border-(--color-bg-border) focus:border-(--color-sky)",
              )}
            />

            {nameError && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-(--color-live)">
                <AlertCircle size={12} />
                {nameError}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="group-description"
              className="text-section-label mb-1.5 block"
            >
              Description{" "}
              <span className="normal-case text-(--color-text-muted)">
                (optional)
              </span>
            </label>

            <textarea
              id="group-description"
              value={description}
              disabled={isFormBusy}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="e.g. First pool of the league stage"
              rows={3}
              maxLength={500}
              className={cn(
                "w-full resize-none rounded-xl border-2 border-(--color-bg-border)",
                "bg-(--color-bg-base) px-4 py-3",
                "text-sm font-medium text-(--color-text-primary)",
                "placeholder:text-(--color-text-muted)",
                "outline-none transition-colors focus:border-(--color-sky)",
              )}
            />
          </div>
        </section>

        {/* Teams */}
        <section className="mt-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-(family-name:--font-display) text-base font-black uppercase tracking-wide text-(--color-text-primary)">
                Select Teams
              </h3>

              <p className="mt-0.5 text-xs text-(--color-text-secondary)">
                Select at least 2 available teams for this group.
              </p>
            </div>

            <div
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5",
                "font-(family-name:--font-display) text-xs font-black uppercase",
                selectedCount >= 2
                  ? "bg-(--color-brand) text-white"
                  : "bg-(--color-bg-tint) text-(--color-brand)",
              )}
            >
              {selectedCount} Selected
            </div>
          </div>

          {selectedRoundId && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-(--color-bg-tint) px-3 py-1 text-xs font-semibold text-(--color-text-secondary)">
                {availableCount} available
              </span>

              {unavailableCount > 0 && (
                <span className="rounded-full bg-(--color-live)/10 px-3 py-1 text-xs font-semibold text-(--color-live)">
                  {unavailableCount} already assigned
                </span>
              )}
            </div>
          )}

          {isGroupsError && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 p-3">
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0 text-(--color-live)"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-(--color-live)">
                  Existing group assignments could not be loaded.
                </p>

                <p className="mt-0.5 text-xs text-(--color-text-secondary)">
                  Reload the assignments before selecting teams.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  void refetchGroups();
                }}
                className="flex shrink-0 items-center gap-1 text-xs font-bold text-(--color-brand)"
              >
                <RefreshCcw size={13} />
                Retry
              </button>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-(--color-bg-border) bg-(--color-bg-base) px-4 py-3 focus-within:border-(--color-sky)">
            <Search size={17} className="shrink-0 text-(--color-text-muted)" />

            <input
              type="text"
              value={searchTerm}
              disabled={isFormBusy}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search teams..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
            />
          </div>

          {teamError && (
            <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-(--color-live)">
              <AlertCircle size={12} />
              {teamError}
            </p>
          )}

          <div className="mt-4 flex flex-col gap-2.5">
            {filteredTeams.map((team) => {
              const isSelected = selectedTeamIds.includes(team.id);

              const assignment = unavailableTeamAssignmentMap.get(team.id);

              const isUnavailable = Boolean(assignment);

              const isDisabled = isFormBusy || isGroupsError || isUnavailable;

              return (
                <button
                  key={team.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggleTeam(team.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left",
                    "transition-all duration-150",
                    !isDisabled && "active:scale-[0.99]",
                    isSelected
                      ? "border-(--color-brand) bg-(--color-brand)/5"
                      : "border-(--color-bg-border) bg-(--color-bg-base)",
                    isUnavailable && "cursor-not-allowed opacity-60",
                    (isFormBusy || isGroupsError) &&
                      "cursor-not-allowed opacity-60",
                  )}
                >
                  <TeamLogo team={team} />

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate font-(family-name:--font-display) text-sm font-black uppercase",
                        isSelected
                          ? "text-(--color-brand)"
                          : "text-(--color-text-primary)",
                      )}
                    >
                      {team.name}
                    </p>

                    {assignment ? (
                      <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-(--color-live)">
                        <Lock size={11} className="shrink-0" />

                        <span className="truncate">
                          Assigned to {assignment.groupName}
                        </span>
                      </div>
                    ) : (
                      team.shortName &&
                      team.shortName !== team.name && (
                        <p className="mt-0.5 truncate text-xs text-(--color-text-muted)">
                          {team.shortName}
                        </p>
                      )
                    )}
                  </div>

                  {isUnavailable ? (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-(--color-bg-border) bg-(--color-bg-card)">
                      <Lock size={13} className="text-(--color-text-muted)" />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        isSelected
                          ? "border-(--color-brand) bg-(--color-brand)"
                          : "border-(--color-bg-border) bg-white",
                      )}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          strokeWidth={3}
                          className="text-white"
                        />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {filteredTeams.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-(--color-text-muted)">
                No teams found.
              </p>
            </div>
          )}
        </section>

        {error && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0 text-(--color-live)"
            />

            <p className="text-sm font-medium text-(--color-live)">{error}</p>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="safe-bottom sticky bottom-0 z-20 flex gap-2 border-t border-(--color-bg-border) bg-(--color-bg-card) p-3">
        {onCancel && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            fullWidth
            disabled={isFormBusy}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          fullWidth
          loading={isLoading}
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={cn(!canSubmit && "cursor-not-allowed opacity-50")}
        >
          {submitText}
        </Button>
      </div>
    </div>
  );
}
