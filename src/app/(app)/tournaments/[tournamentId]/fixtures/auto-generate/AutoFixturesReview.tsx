import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  MapPin,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/common/Button";

import type {
  PreviewAutoFixture,
  PreviewAutoFixturesResponse,
} from "@/store/api/tournamentFixtureApi";

// ─── Types ────────────────────────────────────────────────────────────────────

type EditFixtureValues = {
  scheduledDate: string;
  scheduledTime: string;
  groundName: string;
  city: string;
};

type AutoFixturesReviewProps = {
  preview: PreviewAutoFixturesResponse;

  isConfirming: boolean;
  confirmError?: string;

  onBack: () => void;

  onDone: (preview: PreviewAutoFixturesResponse) => Promise<void> | void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFixtureDate(
  dateString?: string | null,
  timezone = "Asia/Kolkata",
) {
  if (!dateString) return "Date & Time TBA";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const weekday = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    timeZone: timezone,
  }).format(date);

  const day = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    timeZone: timezone,
  }).format(date);

  const month = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    timeZone: timezone,
  }).format(date);

  const time = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  }).format(date);

  return `${weekday} ${day}, ${month} | ${time}`;
}

function getFixtureDateTime(
  scheduledAt?: string | null,
  timezone = "Asia/Kolkata",
) {
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
    timeZone: timezone,
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

function createScheduledAt(date: string, time: string, timezone: string) {
  /*
   * YuvaCrix currently uses Asia/Kolkata.
   *
   * If you later support multiple timezones, use a timezone-aware
   * date library rather than hardcoding +05:30.
   */
  if (timezone === "Asia/Kolkata") {
    return new Date(`${date}T${time}:00+05:30`).toISOString();
  }

  return new Date(`${date}T${time}:00`).toISOString();
}

// ─── Compact team ─────────────────────────────────────────────────────────────

type CompactTeamProps = {
  name: string;
  align?: "left" | "right";
};

function CompactTeam({ name, align = "left" }: CompactTeamProps) {
  return (
    <p
      title={name}
      className={cn(
        "min-w-0 flex-1 truncate font-(family-name:--font-display) text-sm font-black uppercase tracking-wide text-(--color-navy)",
        align === "right" && "text-right",
      )}
    >
      {name}
    </p>
  );
}

// ─── Preview fixture card ─────────────────────────────────────────────────────

type PreviewFixtureCardProps = {
  fixture: PreviewAutoFixture;
  onEdit: (fixture: PreviewAutoFixture) => void;
  onDelete: (fixture: PreviewAutoFixture) => void;
};

function PreviewFixtureCard({
  fixture,
  onEdit,
  onDelete,
}: PreviewFixtureCardProps) {
  const location = [fixture.venue.groundName, fixture.venue.city]
    .filter(Boolean)
    .join(", ");

  const matchNumber =
    fixture.groupMatchNumber ??
    fixture.roundMatchNumber ??
    fixture.sequenceNumber;

  return (
    <article className="relative w-full rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-3 py-2.5 shadow-sm transition-all hover:border-(--color-brand)/30">
      {/* Date and actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-[11px] font-semibold text-(--color-text-secondary)">
            {formatFixtureDate(fixture.scheduledAt, fixture.timezone)}
          </p>

          <span className="shrink-0 rounded-full bg-(--color-bg-tint) px-1.5 py-0.5 text-[9px] font-bold uppercase text-(--color-text-secondary)">
            M{matchNumber}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => onEdit(fixture)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-brand) transition-colors hover:bg-(--color-brand)/10 active:scale-95"
            aria-label={`Edit ${fixture.teamA.name} versus ${fixture.teamB.name}`}
          >
            <Pencil size={14} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(fixture)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-live) transition-colors hover:bg-(--color-live)/10 active:scale-95"
            aria-label={`Delete ${fixture.teamA.name} versus ${fixture.teamB.name}`}
          >
            <Trash2 size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Teams */}
      <div className="mt-2 flex items-center gap-2">
        <CompactTeam name={fixture.teamA.name} />

        <span className="shrink-0 rounded bg-(--color-navy) px-1.5 py-0.5 font-(family-name:--font-display) text-[9px] font-black text-white">
          VS
        </span>

        <CompactTeam name={fixture.teamB.name} align="right" />
      </div>

      {/* Venue and rules */}
      <div className="mt-2 flex items-center gap-2 border-t border-(--color-bg-border) pt-2 text-[10px] font-medium text-(--color-text-secondary)">
        <MapPin size={12} className="shrink-0 text-(--color-text-muted)" />

        <span className="min-w-0 flex-1 truncate">
          {location || "Location TBA"}
        </span>

        <span className="shrink-0 font-semibold">
          {fixture.rules.oversLimit} Ov
        </span>

        <span className="shrink-0 rounded-full bg-(--color-brand)/10 px-1.5 py-0.5 text-[8px] font-black uppercase text-(--color-brand)">
          Preview
        </span>
      </div>
    </article>
  );
}

// ─── Edit dialog ──────────────────────────────────────────────────────────────

type EditFixtureDialogProps = {
  fixture: PreviewAutoFixture | null;
  onClose: () => void;

  onUpdate: (fixture: PreviewAutoFixture, values: EditFixtureValues) => void;
};

function EditFixtureDialog({
  fixture,
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

    const scheduled = getFixtureDateTime(fixture.scheduledAt, fixture.timezone);

    setScheduledDate(scheduled.date);
    setScheduledTime(scheduled.time);
    setGroundName(fixture.venue.groundName ?? "");
    setCity(fixture.venue.city);
    setValidationError("");
  }, [fixture]);

  useEffect(() => {
    if (!fixture) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [fixture, onClose]);

  if (!fixture) return null;

  const currentFixture = fixture;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    onUpdate(currentFixture, {
      scheduledDate,
      scheduledTime,
      groundName: groundName.trim(),
      city: city.trim(),
    });
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-preview-fixture-title"
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-(--color-bg-card) shadow-2xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="px-5 pb-5 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2
                  id="edit-preview-fixture-title"
                  className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-brand)"
                >
                  Edit Match Details
                </h2>

                <p className="mt-3 truncate font-(family-name:--font-display) text-base font-bold uppercase tracking-wide text-(--color-text-primary)">
                  {fixture.teamA.name} vs {fixture.teamB.name}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-(--color-text-muted) transition-colors hover:bg-(--color-bg-tint) hover:text-(--color-text-primary)"
                aria-label="Close edit fixture dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="preview-fixture-date"
                  className="text-xs font-bold text-(--color-text-secondary)"
                >
                  Date
                </label>

                <div className="mt-1 flex w-full min-w-0 rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2.5 focus-within:border-(--color-brand)">
                  <input
                    id="preview-fixture-date"
                    type="date"
                    value={scheduledDate}
                    onChange={(event) => setScheduledDate(event.target.value)}
                    className="block w-full min-w-0 border-0 bg-transparent p-0 text-sm font-medium text-(--color-text-primary) outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="preview-fixture-time"
                  className="text-xs font-bold text-(--color-text-secondary)"
                >
                  Time
                </label>

                <div className="mt-1 flex w-full min-w-0 rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2.5 focus-within:border-(--color-brand)">
                  <input
                    id="preview-fixture-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(event) => setScheduledTime(event.target.value)}
                    className="block w-full min-w-0 border-0 bg-transparent p-0 text-sm font-medium text-(--color-text-primary) outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="preview-fixture-ground"
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
                  id="preview-fixture-ground"
                  type="text"
                  value={groundName}
                  onChange={(event) => setGroundName(event.target.value)}
                  placeholder="Ground name"
                  className="w-full rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) py-2.5 pl-9 pr-3 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand)"
                />
              </div>
            </div>

            <div className="mt-3">
              <label
                htmlFor="preview-fixture-city"
                className="text-xs font-bold text-(--color-text-secondary)"
              >
                City
              </label>

              <input
                id="preview-fixture-city"
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="City"
                className="mt-1 w-full rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2.5 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand)"
              />
            </div>

            {validationError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-(--color-live)/20 bg-(--color-live)/10 px-3 py-2.5">
                <AlertCircle
                  size={15}
                  className="mt-0.5 shrink-0 text-(--color-live)"
                />

                <p className="text-xs font-semibold text-(--color-live)">
                  {validationError}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 border-t border-(--color-bg-border)">
            <button
              type="button"
              onClick={onClose}
              className="h-13 bg-(--color-bg-card) font-(family-name:--font-display) text-sm font-black uppercase tracking-wide text-(--color-text-primary) transition-colors hover:bg-(--color-bg-tint)"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-13 bg-(--color-brand) font-(family-name:--font-display) text-sm font-black uppercase tracking-wide text-white"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main review ──────────────────────────────────────────────────────────────

export default function AutoFixturesReview({
  preview,
  isConfirming,
  confirmError = "",
  onBack,
  onDone,
}: AutoFixturesReviewProps) {
  const [fixtures, setFixtures] = useState<PreviewAutoFixture[]>(
    preview.fixtures,
  );

  const [editingFixture, setEditingFixture] =
    useState<PreviewAutoFixture | null>(null);

  useEffect(() => {
    setFixtures(preview.fixtures);
  }, [preview]);

  function handleEdit(fixture: PreviewAutoFixture) {
    setEditingFixture(fixture);
  }

  function handleUpdateFixture(
    fixture: PreviewAutoFixture,
    values: EditFixtureValues,
  ) {
    setFixtures((currentFixtures) =>
      currentFixtures.map((currentFixture) => {
        if (currentFixture.clientFixtureId !== fixture.clientFixtureId) {
          return currentFixture;
        }

        return {
          ...currentFixture,

          scheduledAt: createScheduledAt(
            values.scheduledDate,
            values.scheduledTime,
            currentFixture.timezone,
          ),

          venue: {
            ...currentFixture.venue,
            groundName: values.groundName,
            city: values.city,
          },
        };
      }),
    );

    setEditingFixture(null);
  }

  function handleDelete(fixture: PreviewAutoFixture) {
    const confirmed = window.confirm(
      `Remove ${fixture.teamA.name} vs ${fixture.teamB.name} from this fixture preview?`,
    );

    if (!confirmed) return;

    setFixtures((currentFixtures) =>
      currentFixtures.filter(
        (currentFixture) =>
          currentFixture.clientFixtureId !== fixture.clientFixtureId,
      ),
    );

    if (editingFixture?.clientFixtureId === fixture.clientFixtureId) {
      setEditingFixture(null);
    }
  }

  async function handleDone() {
    if (!preview.canConfirm || fixtures.length === 0) {
      return;
    }

    await onDone({
      ...preview,
      totalProposedFixtures: fixtures.length,
      fixtures,
    });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-(--color-bg-base)">
      <main className="relative mx-auto w-full flex-1 pb-24 md:max-w-md">
        {/* Header */}
        <div className="sticky top-0 z-30 border-b border-(--color-bg-border) bg-(--color-bg-card)/95 backdrop-blur-md">
          <div className="flex items-center gap-3 px-3 py-3">
            <button
              type="button"
              disabled={isConfirming}
              onClick={onBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--color-text-primary) hover:bg-(--color-bg-tint) disabled:opacity-50"
              aria-label="Back to auto fixture settings"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="font-(family-name:--font-display) text-lg font-black uppercase tracking-wide text-(--color-text-primary)">
                Review Fixtures
              </h1>

              <p className="text-xs text-(--color-text-secondary)">
                {fixtures.length}{" "}
                {fixtures.length === 1 ? "fixture" : "fixtures"} ready to create
              </p>
            </div>
          </div>
        </div>

        {/* Confirm status */}
        <div className="px-3 pt-3">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-3 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-(--color-text-secondary)">
                Proposed Fixtures
              </p>

              <p className="mt-0.5 font-(family-name:--font-display) text-2xl font-black text-(--color-text-primary)">
                {fixtures.length}
              </p>
            </div>

            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[9px] font-black uppercase",
                preview.canConfirm && fixtures.length > 0
                  ? "bg-(--color-four)/10 text-(--color-four)"
                  : "bg-(--color-live)/10 text-(--color-live)",
              )}
            >
              {preview.canConfirm && fixtures.length > 0
                ? "Ready to Confirm"
                : "Cannot Confirm"}
            </span>
          </div>
        </div>

        {/* Backend warnings */}
        {preview.warnings.length > 0 && (
          <div className="mx-3 mt-3 rounded-xl border border-(--color-six)/20 bg-(--color-six)/10 px-3 py-3">
            <p className="text-[10px] font-black uppercase tracking-wide text-(--color-six)">
              Warnings
            </p>

            <div className="mt-2 space-y-1">
              {preview.warnings.map((warning, index) => (
                <p
                  key={`${warning}-${index}`}
                  className="text-xs text-(--color-text-secondary)"
                >
                  {warning}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Confirm error */}
        {confirmError && (
          <div className="mx-3 mt-3 flex items-start gap-2.5 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-2.5">
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0 text-(--color-live)"
            />

            <p className="text-xs font-semibold text-(--color-live)">
              {confirmError}
            </p>
          </div>
        )}

        {fixtures.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
              <CalendarDays size={30} className="text-(--color-brand)" />
            </div>

            <h2 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
              No Fixtures Remaining
            </h2>

            <p className="mt-2 text-sm text-(--color-text-secondary)">
              Go back and regenerate the fixtures to continue.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-3 py-3">
            {fixtures.map((fixture) => (
              <PreviewFixtureCard
                key={fixture.clientFixtureId}
                fixture={fixture}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="safe-bottom fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-md border-t border-(--color-bg-border) bg-(--color-bg-card)/95 px-4 py-4 backdrop-blur-md">
          <Button
            size="sm"
            fullWidth
            disabled={
              isConfirming || !preview.canConfirm || fixtures.length === 0
            }
            onClick={() => void handleDone()}
            className="shadow-(--shadow-button)"
          >
            {isConfirming ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Confirming Fixtures
              </>
            ) : (
              "Done"
            )}
          </Button>
        </div>
      </main>

      <EditFixtureDialog
        fixture={editingFixture}
        onClose={() => setEditingFixture(null)}
        onUpdate={handleUpdateFixture}
      />
    </div>
  );
}
