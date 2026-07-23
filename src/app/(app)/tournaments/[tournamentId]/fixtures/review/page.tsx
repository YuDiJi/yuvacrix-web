"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  CalendarDays,
  MapPin,
  Pencil,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/common/Button";

import {
  TournamentFixture,
  useDeleteFixtureMutation,
  useGetTournamentFixturesQuery,
  useUpdateFixtureMutation,
} from "@/store/api/tournamentFixtureApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFixtureDate(dateString?: string | null) {
  if (!dateString) return "Date & Time TBA";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const weekday = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);

  const day = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(date);

  const month = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);

  const time = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);

  return `${weekday} ${day}, ${month} | ${time}`;
}

function formatStatus(status: TournamentFixture["status"]) {
  return status.replaceAll("_", " ");
}

function getStatusClasses(status: TournamentFixture["status"]) {
  switch (status) {
    case "LIVE":
      return "bg-(--color-live)/10 text-(--color-live)";

    case "COMPLETED":
      return "bg-(--color-four)/10 text-(--color-four)";

    case "CANCELLED":
      return "bg-(--color-text-muted)/15 text-(--color-text-secondary)";

    case "MATCH_CREATED":
      return "bg-(--color-brand)/10 text-(--color-brand)";

    case "SCHEDULED":
      return "bg-(--color-sky)/10 text-(--color-sky)";

    default:
      return "bg-(--color-bg-tint) text-(--color-text-secondary)";
  }
}

function getApiErrorMessage(error: unknown) {
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

  return "Failed to delete fixture. Please try again.";
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function FixturesSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-40 w-full animate-pulse rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)"
        />
      ))}
    </div>
  );
}

// ─── Team display ─────────────────────────────────────────────────────────────

// type TeamDisplayProps = {
//   team: TournamentFixture["teamASnapshot"];
//   align?: "left" | "right";
// };

// function TeamDisplay({ team, align = "left" }: TeamDisplayProps) {
//   const isRight = align === "right";

//   return (
//     <div
//       className={cn(
//         "flex min-w-0 flex-1 items-center gap-2.5",
//         isRight && "flex-row-reverse text-right",
//       )}
//     >
//       <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--color-bg-border) bg-(--color-bg-base)">
//         {team.logoUrl ? (
//           <S3Image
//             imageKey={team.logoUrl}
//             alt={team.name}
//             width={44}
//             height={44}
//             className="h-full w-full rounded-full object-cover"
//             fallback={
//               <TeamInitial
//                 name={team.name}
//                 ariaLabel={`${team.name} logo fallback`}
//               />
//             }
//           />
//         ) : (
//           <TeamInitial
//             name={team.name}
//             ariaLabel={`${team.name} logo fallback`}
//           />
//         )}
//       </div>

//       <div className="min-w-0">
//         <p className="truncate font-(family-name:--font-display) text-sm font-black uppercase tracking-wide text-(--color-navy)">
//           {team.name}
//         </p>

//         {team.shortName && team.shortName !== team.name && (
//           <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-(--color-text-muted)">
//             {team.shortName}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

type CompactTeamProps = {
  name: string;
  align?: "left" | "right";
};

function CompactTeam({ name, align = "left" }: CompactTeamProps) {
  return (
    <p
      className={cn(
        "min-w-0 flex-1 truncate font-(family-name:--font-display) text-sm font-black uppercase tracking-wide text-(--color-navy)",
        align === "right" && "text-right",
      )}
      title={name}
    >
      {name}
    </p>
  );
}

function TeamInitial({ name, ariaLabel }: { name: string; ariaLabel: string }) {
  return (
    <div
      aria-label={ariaLabel}
      className="flex h-full w-full items-center justify-center rounded-full bg-(--color-brand)"
    >
      <span className="font-(family-name:--font-display) text-base font-black uppercase text-white">
        {name.trim().charAt(0) || "?"}
      </span>
    </div>
  );
}

// ─── Fixture card ─────────────────────────────────────────────────────────────

// type FixtureCardProps = {
//   fixture: TournamentFixture;
//   deleting: boolean;
//   onEdit: (fixture: TournamentFixture) => void;
//   onDelete: (fixture: TournamentFixture) => void;
// };

// function FixtureCard({
//   fixture,
//   deleting,
//   onEdit,
//   onDelete,
// }: FixtureCardProps) {
//   const location = [
//     fixture.venueSnapshot?.groundName,
//     fixture.venueSnapshot?.city,
//   ]
//     .filter(Boolean)
//     .join(", ");

//   const overs = fixture.matchRulesSnapshot?.oversLimit;

//   const matchNumber =
//     fixture.groupMatchNumber ??
//     fixture.roundMatchNumber ??
//     fixture.sequenceNumber;

//   const canModify =
//     fixture.status !== "LIVE" &&
//     fixture.status !== "COMPLETED" &&
//     fixture.status !== "CANCELLED";

//   return (
//     <article
//       className={cn(
//         "relative w-full rounded-2xl border bg-(--color-bg-card) p-4 shadow-sm transition-all",
//         deleting
//           ? "border-(--color-live)/20 opacity-60"
//           : "border-(--color-bg-border) hover:border-(--color-brand)/30",
//       )}
//     >
//       {/* Header */}
//       <div className="flex items-start justify-between gap-3 pr-20">
//         <div className="min-w-0">
//           <p className="text-xs font-medium text-(--color-text-secondary)">
//             {formatFixtureDate(fixture.scheduledAt)}
//           </p>

//           <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
//             <span
//               className={cn(
//                 "rounded-full px-2 py-0.5 font-(family-name:--font-display) text-[9px] font-black uppercase tracking-wide",
//                 getStatusClasses(fixture.status),
//               )}
//             >
//               {formatStatus(fixture.status)}
//             </span>

//             <span className="rounded-full bg-(--color-bg-tint) px-2 py-0.5 font-(family-name:--font-display) text-[9px] font-black uppercase tracking-wide text-(--color-text-secondary)">
//               {fixture.createdFrom}
//             </span>

//             {matchNumber != null && (
//               <span className="rounded-full bg-(--color-bg-tint) px-2 py-0.5 font-(family-name:--font-display) text-[9px] font-black uppercase tracking-wide text-(--color-text-secondary)">
//                 Match {matchNumber}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Teams */}
//       <div className="mt-4 flex items-center gap-3">
//         <TeamDisplay team={fixture.teamASnapshot} />

//         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-navy)">
//           <span className="font-(family-name:--font-display) text-[9px] font-black uppercase text-white">
//             VS
//           </span>
//         </div>

//         <TeamDisplay team={fixture.teamBSnapshot} align="right" />
//       </div>

//       {/* Fixture details */}
//       <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-(--color-bg-border) pt-3 text-xs font-medium text-(--color-text-secondary)">
//         <div className="flex min-w-0 flex-1 items-start gap-1.5">
//           <MapPin
//             size={14}
//             className="mt-0.5 shrink-0 text-(--color-text-muted)"
//           />

//           <span className="leading-snug">{location || "Location TBA"}</span>
//         </div>

//         {overs != null && (
//           <span className="shrink-0 font-semibold text-(--color-text-secondary)">
//             {overs} Overs
//           </span>
//         )}

//         {fixture.groupId && (
//           <span className="shrink-0 rounded-full bg-(--color-bg-tint) px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-(--color-text-secondary)">
//             Group Fixture
//           </span>
//         )}
//       </div>

//       {/* Actions */}
//       <div className="absolute right-3 top-3 flex items-center gap-1">
//         <button
//           type="button"
//           disabled={!canModify || deleting}
//           onClick={() => onEdit(fixture)}
//           className="flex h-9 w-9 items-center justify-center rounded-full text-(--color-brand) transition-all hover:bg-(--color-brand)/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
//           aria-label={`Edit ${fixture.teamASnapshot.name} versus ${fixture.teamBSnapshot.name}`}
//         >
//           <Pencil size={17} strokeWidth={2.4} />
//         </button>

//         <button
//           type="button"
//           disabled={!canModify || deleting}
//           onClick={() => onDelete(fixture)}
//           className="flex h-9 w-9 items-center justify-center rounded-full text-(--color-brand) transition-all hover:bg-(--color-live)/10 hover:text-(--color-live) active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
//           aria-label={`Delete ${fixture.teamASnapshot.name} versus ${fixture.teamBSnapshot.name}`}
//         >
//           {deleting ? (
//             <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--color-live)/30 border-t-(--color-live)" />
//           ) : (
//             <Trash2 size={17} strokeWidth={2.4} />
//           )}
//         </button>
//       </div>
//     </article>
//   );
// }

type FixtureCardProps = {
  fixture: TournamentFixture;
  deleting: boolean;
  onEdit: (fixture: TournamentFixture) => void;
  onDelete: (fixture: TournamentFixture) => void;
};

function FixtureCard({
  fixture,
  deleting,
  onEdit,
  onDelete,
}: FixtureCardProps) {
  const location = [
    fixture.venueSnapshot?.groundName,
    fixture.venueSnapshot?.city,
  ]
    .filter(Boolean)
    .join(", ");

  const matchNumber =
    fixture.groupMatchNumber ??
    fixture.roundMatchNumber ??
    fixture.sequenceNumber;

  const overs = fixture.matchRulesSnapshot?.oversLimit;

  const canModify =
    fixture.status !== "LIVE" &&
    fixture.status !== "COMPLETED" &&
    fixture.status !== "CANCELLED";

  return (
    <article
      className={cn(
        "relative w-full rounded-xl border bg-(--color-bg-card) px-3 py-2.5 shadow-sm transition-all",
        deleting
          ? "border-(--color-live)/20 opacity-60"
          : "border-(--color-bg-border) hover:border-(--color-brand)/30",
      )}
    >
      {/* Date, status and actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-[11px] font-semibold text-(--color-text-secondary)">
            {formatFixtureDate(fixture.scheduledAt)}
          </p>

          {matchNumber != null && (
            <span className="shrink-0 rounded-full bg-(--color-bg-tint) px-1.5 py-0.5 text-[9px] font-bold uppercase text-(--color-text-secondary)">
              M{matchNumber}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            disabled={!canModify || deleting}
            onClick={() => onEdit(fixture)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-brand) transition-colors hover:bg-(--color-brand)/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={`Edit ${fixture.teamASnapshot.name} versus ${fixture.teamBSnapshot.name}`}
          >
            <Pencil size={14} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            disabled={!canModify || deleting}
            onClick={() => onDelete(fixture)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-live) transition-colors hover:bg-(--color-live)/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={`Delete ${fixture.teamASnapshot.name} versus ${fixture.teamBSnapshot.name}`}
          >
            {deleting ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-(--color-live)/30 border-t-(--color-live)" />
            ) : (
              <Trash2 size={14} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Teams */}
      <div className="mt-2 flex items-center gap-2">
        <CompactTeam name={fixture.teamASnapshot.name} />

        <span className="shrink-0 rounded bg-(--color-navy) px-1.5 py-0.5 font-(family-name:--font-display) text-[9px] font-black text-white">
          VS
        </span>

        <CompactTeam name={fixture.teamBSnapshot.name} align="right" />
      </div>

      {/* Venue and rules */}
      <div className="mt-2 flex items-center gap-2 border-t border-(--color-bg-border) pt-2 text-[10px] font-medium text-(--color-text-secondary)">
        <MapPin size={12} className="shrink-0 text-(--color-text-muted)" />

        <span className="min-w-0 flex-1 truncate">
          {location || "Location TBA"}
        </span>

        {overs != null && (
          <span className="shrink-0 font-semibold">{overs} Ov</span>
        )}

        <span
          className={cn(
            "shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase",
            getStatusClasses(fixture.status),
          )}
        >
          {formatStatus(fixture.status)}
        </span>
      </div>
    </article>
  );
}

type EditFixtureValues = {
  scheduledDate: string;
  scheduledTime: string;
  groundName: string;
  city: string;
};

function getFixtureDateTime(scheduledAt?: string | null): {
  date: string;
  time: string;
} {
  if (!scheduledAt) {
    return {
      date: "",
      time: "",
    };
  }

  const parsedDate = new Date(scheduledAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      date: "",
      time: "",
    };
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(parsedDate);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${getPart("year")}-${getPart("month")}-${getPart("day")}`,
    time: `${getPart("hour")}:${getPart("minute")}`,
  };
}

function createScheduledAt(scheduledDate: string, scheduledTime: string) {
  return new Date(`${scheduledDate}T${scheduledTime}:00+05:30`).toISOString();
}

function getUpdateErrorMessage(error: unknown) {
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

  return "Failed to update fixture. Please try again.";
}

type EditFixtureDialogProps = {
  fixture: TournamentFixture | null;
  isUpdating: boolean;
  updateError: string;
  onClose: () => void;
  onUpdate: (
    fixture: TournamentFixture,
    values: EditFixtureValues,
  ) => Promise<void>;
};

function EditFixtureDialog({
  fixture,
  isUpdating,
  updateError,
  onClose,
  onUpdate,
}: EditFixtureDialogProps) {
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [groundName, setGroundName] = useState("");
  const [city, setCity] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!fixture) return;

    const scheduled = getFixtureDateTime(fixture.scheduledAt);

    setScheduledDate(scheduled.date);
    setScheduledTime(scheduled.time);
    setGroundName(fixture.venueSnapshot?.groundName ?? "");
    setCity(fixture.venueSnapshot?.city ?? "");
    setValidationError("");
  }, [fixture]);

  useEffect(() => {
    if (!fixture) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isUpdating) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [fixture, isUpdating, onClose]);

  if (!fixture) return null;
  const currentFixture = fixture;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!scheduledDate) {
      setValidationError("Please select a match date.");
      return;
    }

    if (!scheduledTime) {
      setValidationError("Please select a match time.");
      return;
    }

    if (!groundName.trim()) {
      setValidationError("Please enter the venue or ground name.");
      return;
    }

    if (!city.trim()) {
      setValidationError("Please enter the city.");
      return;
    }

    setValidationError("");

    await onUpdate(currentFixture, {
      scheduledDate,
      scheduledTime,
      groundName: groundName.trim(),
      city: city.trim(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isUpdating) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-fixture-title"
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-(--color-bg-card) shadow-2xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="px-5 pb-5 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="edit-fixture-title"
                  className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-brand)"
                >
                  Edit Match Details
                </h2>

                <p className="mt-3 font-(family-name:--font-display) text-base font-bold uppercase tracking-wide text-(--color-text-primary)">
                  {fixture.teamASnapshot.name} vs {fixture.teamBSnapshot.name}
                </p>
              </div>

              <button
                type="button"
                disabled={isUpdating}
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-(--color-text-muted) transition-colors hover:bg-(--color-bg-tint) hover:text-(--color-text-primary) disabled:opacity-50"
                aria-label="Close edit fixture dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="fixture-date"
                  className="text-xs font-bold text-(--color-text-secondary)"
                >
                  Date
                </label>

                <div className="mt-1 flex w-full min-w-0 rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2.5 focus-within:border-(--color-brand)">
                  <input
                    id="fixture-date"
                    type="date"
                    value={scheduledDate}
                    onChange={(event) => setScheduledDate(event.target.value)}
                    disabled={isUpdating}
                    className="block w-full min-w-0 border-0 bg-transparent p-0 text-sm font-medium text-(--color-text-primary) outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="fixture-time"
                  className="text-xs font-bold text-(--color-text-secondary)"
                >
                  Time
                </label>

                <div className="mt-1 flex w-full min-w-0 rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2.5 focus-within:border-(--color-brand)">
                  <input
                    id="fixture-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(event) => setScheduledTime(event.target.value)}
                    disabled={isUpdating}
                    className="block w-full min-w-0 border-0 bg-transparent p-0 text-sm font-medium text-(--color-text-primary) outline-none disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="fixture-ground"
                className="text-xs font-bold text-(--color-text-secondary)"
              >
                Venue
              </label>

              <div className="relative mt-1">
                <MapPin
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                />

                <input
                  id="fixture-ground"
                  type="text"
                  value={groundName}
                  onChange={(event) => setGroundName(event.target.value)}
                  disabled={isUpdating}
                  placeholder="Ground name"
                  className="w-full rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) py-2.5 pl-9 pr-3 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand) disabled:opacity-60"
                />
              </div>
            </div>

            <div className="mt-3">
              <label
                htmlFor="fixture-city"
                className="text-xs font-bold text-(--color-text-secondary)"
              >
                City
              </label>

              <input
                id="fixture-city"
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                disabled={isUpdating}
                placeholder="City"
                className="mt-1 w-full rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2.5 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand) disabled:opacity-60"
              />
            </div>

            {(validationError || updateError) && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-(--color-live)/20 bg-(--color-live)/10 px-3 py-2.5">
                <AlertCircle
                  size={15}
                  className="mt-0.5 shrink-0 text-(--color-live)"
                />

                <p className="text-xs font-semibold text-(--color-live)">
                  {validationError || updateError}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 border-t border-(--color-bg-border)">
            <button
              type="button"
              disabled={isUpdating}
              onClick={onClose}
              className="h-13 bg-(--color-bg-card) font-(family-name:--font-display) text-sm font-black uppercase tracking-wide text-(--color-text-primary) transition-colors hover:bg-(--color-bg-tint) disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="flex h-13 items-center justify-center gap-2 bg-(--color-brand) font-(family-name:--font-display) text-sm font-black uppercase tracking-wide text-white transition-opacity disabled:opacity-60"
            >
              {isUpdating && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {isUpdating ? "Updating" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReviewFixturesPage() {
  const router = useRouter();
  const params = useParams();

  const tournamentId = params.tournamentId as string;

  const [deletingFixtureId, setDeletingFixtureId] = useState<string | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState("");

  const [editingFixture, setEditingFixture] =
    useState<TournamentFixture | null>(null);

  const [updateError, setUpdateError] = useState("");

  const [deleteFixture] = useDeleteFixtureMutation();

  const [updateFixture, { isLoading: isUpdating }] = useUpdateFixtureMutation();

  const {
    data: fixtures = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetTournamentFixturesQuery(
    {
      tournamentId,

      /*
       * Add the roundId here when it is available in the route or query string:
       *
       * roundId,
       *
       * You can also filter generated fixtures:
       *
       * createdFrom: "AUTO",
       */
    },
    {
      skip: !tournamentId,
    },
  );

  function handleEdit(fixture: TournamentFixture) {
    setUpdateError("");
    setEditingFixture(fixture);
  }

  async function handleUpdateFixture(
    fixture: TournamentFixture,
    values: EditFixtureValues,
  ) {
    setUpdateError("");

    try {
      await updateFixture({
        tournamentId,
        fixtureId: fixture.id,

        body: {
          scheduledAt: createScheduledAt(
            values.scheduledDate,
            values.scheduledTime,
          ),

          timezone: fixture.timezone ?? "Asia/Kolkata",

          venue: {
            groundName: values.groundName,
            city: values.city,

            /*
             * Preserve the existing venue values that are
             * not editable in this dialog.
             */
            pitchType: fixture.venueSnapshot?.pitchType ?? "OTHER",

            addressText: fixture.venueSnapshot?.addressText || undefined,
          },
        },
      }).unwrap();

      setEditingFixture(null);
    } catch (error) {
      setUpdateError(getUpdateErrorMessage(error));
    }
  }

  async function handleDelete(fixture: TournamentFixture) {
    const confirmed = window.confirm(
      `Delete ${fixture.teamASnapshot.name} vs ${fixture.teamBSnapshot.name}?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeleteError("");
    setDeletingFixtureId(fixture.id);

    try {
      await deleteFixture({
        tournamentId,
        fixtureId: fixture.id,
      }).unwrap();

      /*
       * Your mutation invalidates the tournament fixture tag,
       * so RTK Query should automatically refresh this list.
       *
       * Calling refetch() is not required.
       */
    } catch (error) {
      setDeleteError(getApiErrorMessage(error));
    } finally {
      setDeletingFixtureId(null);
    }
  }

  function handleDone() {
    router.push(`/tournaments/${tournamentId}`);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-(--color-bg-base)">
      <main className="relative mx-auto w-full flex-1 pb-24 md:max-w-md">
        {/* Delete error */}
        {deleteError && (
          <div className="mx-4 mt-4 flex items-start gap-2.5 rounded-2xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0 text-(--color-live)"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-(--color-live)">
                {deleteError}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDeleteError("")}
              className="text-xs font-bold uppercase text-(--color-live)"
            >
              Close
            </button>
          </div>
        )}

        {isLoading ? (
          <FixturesSkeleton />
        ) : isError ? (
          <div className="mt-10 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-live)/10">
              <CalendarDays size={30} className="text-(--color-live)" />
            </div>

            <h3 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
              Failed to load fixtures
            </h3>

            <p className="mt-2 text-sm text-(--color-text-secondary)">
              Please check your connection and try again.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 flex items-center gap-2 rounded-xl bg-(--color-brand) px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        ) : fixtures.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
              <CalendarDays size={30} className="text-(--color-brand)" />
            </div>

            <h3 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
              No Fixtures Found
            </h3>

            <p className="mt-2 text-sm text-(--color-text-secondary)">
              You haven&apos;t scheduled any matches for this tournament yet.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 pb-1 pt-4">
              <div>
                <p className="font-(family-name:--font-display) text-lg font-black uppercase tracking-wide text-(--color-text-primary)">
                  Review Fixtures
                </p>

                <p className="mt-0.5 text-xs text-(--color-text-secondary)">
                  {fixtures.length}{" "}
                  {fixtures.length === 1 ? "fixture" : "fixtures"}
                </p>
              </div>

              <button
                type="button"
                disabled={isFetching}
                onClick={() => void refetch()}
                className="flex h-9 w-9 items-center justify-center rounded-full text-(--color-brand) hover:bg-(--color-brand)/10 disabled:opacity-50"
                aria-label="Refresh fixtures"
              >
                <RefreshCw
                  size={17}
                  className={cn(isFetching && "animate-spin")}
                />
              </button>
            </div>

            <div className="flex flex-col gap-2 px-3 py-3">
              {fixtures.map((fixture) => (
                <FixtureCard
                  key={fixture.id}
                  fixture={fixture}
                  deleting={deletingFixtureId === fixture.id}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}

        {/* Sticky footer */}
        <div className="safe-bottom fixed bottom-0 left-0 right-0 z-30 mx-auto w-full border-t border-(--color-bg-border) bg-(--color-bg-base)/90 px-4 py-4 backdrop-blur-md sm:max-w-md">
          <Button
            size="sm"
            fullWidth
            onClick={handleDone}
            disabled={Boolean(deletingFixtureId)}
            className="shadow-(--shadow-button)"
          >
            Done
          </Button>
        </div>
      </main>

      <EditFixtureDialog
        fixture={editingFixture}
        isUpdating={isUpdating}
        updateError={updateError}
        onClose={() => {
          if (isUpdating) return;

          setUpdateError("");
          setEditingFixture(null);
        }}
        onUpdate={handleUpdateFixture}
      />
    </div>
  );
}
