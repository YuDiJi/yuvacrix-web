"use client";

import { Globe2, Lock, Shield, Trophy, Users } from "lucide-react";

import { useState, type ReactNode } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";

import { cn } from "@/lib/cn";

import { useCreateVolleyballTournamentMutation } from "@/store/api/volleyball/volleyballTournamentApi";

import {
  VOLLEYBALL_TOURNAMENT_FORMATS,
  VOLLEYBALL_TOURNAMENT_VISIBILITIES,
  type VolleyballTournamentFormat,
  type VolleyballTournamentVisibility,
} from "@/types/volleyball/tournament";

/* =========================================================
   PAGE
========================================================= */

export default function CreateVolleyballTournamentPage() {
  const router = useRouter();

  /* =====================================================
     BASIC DETAILS
  ===================================================== */

  const [name, setName] = useState("");

  const [shortName, setShortName] = useState("");

  const [description, setDescription] = useState("");

  /* =====================================================
     VISIBILITY
  ===================================================== */

  const [visibility, setVisibility] = useState<VolleyballTournamentVisibility>(
    VOLLEYBALL_TOURNAMENT_VISIBILITIES.PUBLIC,
  );

  /* =====================================================
     FORMAT
  ===================================================== */

  const [format, setFormat] = useState<VolleyballTournamentFormat>(
    VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE,
  );

  /* =====================================================
     POINTS
  ===================================================== */

  const [winPoints, setWinPoints] = useState(2);

  const [lossPoints, setLossPoints] = useState(0);

  const [tiePoints, setTiePoints] = useState(1);

  /* =====================================================
     DATES
  ===================================================== */

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  /* =====================================================
     ERROR
  ===================================================== */

  const [error, setError] = useState("");

  /* =====================================================
     API
  ===================================================== */

  const [createTournament, { isLoading: isCreatingTournament }] =
    useCreateVolleyballTournamentMutation();

  /* =====================================================
     DERIVED
  ===================================================== */

  const usesLeaguePoints =
    format === VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE ||
    format === VOLLEYBALL_TOURNAMENT_FORMATS.GROUP_KNOCKOUT;

  /* =====================================================
     VALIDATION
  ===================================================== */

  function validate() {
    if (!name.trim()) {
      return "Tournament name is required.";
    }

    if (name.trim().length < 2) {
      return "Tournament name is too short.";
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return "End date cannot be before start date.";
    }

    if (
      usesLeaguePoints &&
      (winPoints < 0 || lossPoints < 0 || tiePoints < 0)
    ) {
      return "Tournament points cannot be negative.";
    }

    return null;
  }

  /* =====================================================
     CREATE
  ===================================================== */

  async function handleCreateTournament() {
    const validationError = validate();

    if (validationError) {
      setError(validationError);

      return;
    }

    setError("");

    try {
      const tournament = await createTournament({
        name: name.trim(),

        ...(shortName.trim()
          ? {
              shortName: shortName.trim().toUpperCase(),
            }
          : {}),

        ...(description.trim()
          ? {
              description: description.trim(),
            }
          : {}),

        visibility,

        format,

        ...(usesLeaguePoints
          ? {
              pointsConfig: {
                winPoints,
                lossPoints,
                tiePoints,
              },
            }
          : {}),

        ...(startDate
          ? {
              startDate: new Date(`${startDate}T00:00:00`).toISOString(),
            }
          : {}),

        ...(endDate
          ? {
              endDate: new Date(`${endDate}T23:59:59`).toISOString(),
            }
          : {}),
      }).unwrap();

      router.push(`/volleyball/tournaments/${tournament.id}/teams`);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to create tournament."));
    }
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-full bg-(--color-bg-base)">
      <div className="flex flex-col gap-5 px-4 py-5">
        {/* =================================================
            HEADER
        ================================================= */}

        <div>
          <p className="text-section-label">New Volleyball Tournament</p>

          <h1 className="mt-1 font-(family-name:--font-display) text-2xl font-black uppercase tracking-wide text-(--color-text-primary)">
            Create Tournament
          </h1>

          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Set up your competition format, teams and tournament details.
          </p>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
            <p className="text-sm font-semibold text-(--color-live)">{error}</p>
          </div>
        )}

        {/* =================================================
            DETAILS
        ================================================= */}

        <section>
          <SectionHeader
            title="Tournament Details"
            description="Basic information shown throughout YuvaCrix."
          />

          <div className="space-y-3">
            <Field>
              <FieldLabel required>Tournament Name</FieldLabel>

              <input
                value={name}
                onChange={(event) => {
                  setError("");

                  setName(event.target.value);
                }}
                placeholder="e.g. YuvaCrix Sunday Cup"
                className={inputClassName()}
              />
            </Field>

            <Field>
              <FieldLabel>Short Name</FieldLabel>

              <input
                value={shortName}
                maxLength={20}
                onChange={(event) => {
                  setShortName(event.target.value);
                }}
                placeholder="e.g. YSC"
                className={inputClassName()}
              />

              <p className="mt-1 text-[9px] text-(--color-text-muted)">
                Used in compact tournament cards and fixtures.
              </p>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>

              <textarea
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
                rows={3}
                placeholder="Tell players about this tournament..."
                className={cn(
                  inputClassName(),
                  "h-auto min-h-24 resize-none py-3",
                )}
              />
            </Field>
          </div>
        </section>

        {/* =================================================
            VISIBILITY
        ================================================= */}

        <section>
          <SectionHeader
            title="Visibility"
            description="Choose who can discover this tournament."
          />

          <div className="grid grid-cols-2 gap-2">
            <VisibilityCard
              title="Public"
              description="Visible to everyone"
              icon={<Globe2 size={17} />}
              selected={
                visibility === VOLLEYBALL_TOURNAMENT_VISIBILITIES.PUBLIC
              }
              onClick={() => {
                setError("");

                setVisibility(VOLLEYBALL_TOURNAMENT_VISIBILITIES.PUBLIC);
              }}
            />

            <VisibilityCard
              title="Private"
              description="Restricted tournament"
              icon={<Lock size={17} />}
              selected={
                visibility === VOLLEYBALL_TOURNAMENT_VISIBILITIES.PRIVATE
              }
              onClick={() => {
                setError("");

                setVisibility(VOLLEYBALL_TOURNAMENT_VISIBILITIES.PRIVATE);
              }}
            />
          </div>
        </section>

        {/* =================================================
            FORMAT
        ================================================= */}

        <section>
          <SectionHeader
            title="Tournament Format"
            description="Choose how teams compete throughout the tournament."
          />

          <div className="space-y-2.5">
            <TournamentFormatCard
              title="League"
              description="Teams play league fixtures and earn points in the standings."
              icon={<Users size={18} />}
              selected={format === VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE}
              onClick={() => {
                setError("");

                setFormat(VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE);
              }}
            />

            <TournamentFormatCard
              title="Knockout"
              description="Single elimination. Winners advance while losing teams are eliminated."
              icon={<Trophy size={18} />}
              selected={format === VOLLEYBALL_TOURNAMENT_FORMATS.KNOCKOUT}
              onClick={() => {
                setError("");

                setFormat(VOLLEYBALL_TOURNAMENT_FORMATS.KNOCKOUT);
              }}
            />

            <TournamentFormatCard
              title="Groups + Knockout"
              description="Teams first compete in groups before qualifying for knockout rounds."
              icon={<Shield size={18} />}
              selected={format === VOLLEYBALL_TOURNAMENT_FORMATS.GROUP_KNOCKOUT}
              onClick={() => {
                setError("");

                setFormat(VOLLEYBALL_TOURNAMENT_FORMATS.GROUP_KNOCKOUT);
              }}
            />
          </div>
        </section>

        {/* =================================================
            LEAGUE POINTS
        ================================================= */}

        {usesLeaguePoints && (
          <section>
            <SectionHeader
              title="Standings Points"
              description="Choose how many competition points teams earn from match results."
            />

            <div className="grid grid-cols-3 gap-2">
              <PointsInput
                label="Win"
                value={winPoints}
                onChange={setWinPoints}
              />

              <PointsInput
                label="Loss"
                value={lossPoints}
                onChange={setLossPoints}
              />

              <PointsInput
                label="Tie"
                value={tiePoints}
                onChange={setTiePoints}
              />
            </div>

            <div className="mt-2 rounded-xl border border-(--color-brand)/10 bg-(--color-bg-tint) px-3 py-2.5">
              <p className="text-[9px] leading-4 text-(--color-text-secondary)">
                Standings also track matches played, wins, losses, ties, set
                difference and point difference.
              </p>
            </div>
          </section>
        )}

        {/* =================================================
            DATES
        ================================================= */}

        <section>
          <SectionHeader
            title="Tournament Dates"
            description="Optional start and end dates for the competition."
          />

          <div className="grid grid-cols-2 gap-2">
            <Field>
              <FieldLabel>Start Date</FieldLabel>

              <input
                type="date"
                value={startDate}
                onChange={(event) => {
                  setError("");

                  setStartDate(event.target.value);

                  /*
                   * If end date becomes invalid
                   * after changing the start date,
                   * clear it automatically.
                   */
                  if (
                    endDate &&
                    event.target.value &&
                    new Date(endDate) < new Date(event.target.value)
                  ) {
                    setEndDate("");
                  }
                }}
                className={inputClassName()}
              />
            </Field>

            <Field>
              <FieldLabel>End Date</FieldLabel>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => {
                  setError("");

                  setEndDate(event.target.value);
                }}
                className={inputClassName()}
              />
            </Field>
          </div>
        </section>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <TournamentSummary
          name={name.trim() || "Your Tournament"}
          format={format}
          visibility={visibility}
          usesLeaguePoints={usesLeaguePoints}
          winPoints={winPoints}
          lossPoints={lossPoints}
          tiePoints={tiePoints}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="safe-bottom sticky bottom-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3 shadow-[0_-8px_24px_rgba(13,27,62,0.06)]">
        <Button
          fullWidth
          loading={isCreatingTournament}
          disabled={!name.trim() || isCreatingTournament}
          onClick={handleCreateTournament}
        >
          Create Tournament
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-2.5">
      <p className="text-section-label">{title}</p>

      <p className="mt-1 text-[10px] text-(--color-text-muted)">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <p className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-(--color-text-secondary)">
      {children}

      {required && <span className="ml-0.5 text-(--color-live)">*</span>}
    </p>
  );
}

/* =========================================================
   VISIBILITY
========================================================= */

function VisibilityCard({
  title,
  description,
  icon,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-all",

        selected
          ? "border-(--color-brand) bg-(--color-bg-tint)"
          : "border-(--color-bg-border) bg-(--color-bg-card)",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",

          selected
            ? "bg-(--color-brand) text-white"
            : "bg-(--color-bg-base) text-(--color-text-secondary)",
        )}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black text-(--color-text-primary)">
          {title}
        </p>

        <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
          {description}
        </p>
      </div>
    </button>
  );
}

/* =========================================================
   TOURNAMENT FORMAT
========================================================= */

function TournamentFormatCard({
  title,
  description,
  icon,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left shadow-(--shadow-card) transition-all",

        selected
          ? "border-(--color-brand)/40 bg-(--color-bg-tint)"
          : "border-(--color-bg-border) bg-(--color-bg-card)",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",

          selected
            ? "bg-(--color-brand) text-white"
            : "bg-(--color-bg-base) text-(--color-text-secondary)",
        )}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-(--color-text-primary)">
          {title}
        </p>

        <p className="mt-0.5 text-[9px] leading-4 text-(--color-text-muted)">
          {description}
        </p>
      </div>

      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",

          selected
            ? "border-(--color-brand) bg-(--color-brand)"
            : "border-(--color-bg-border)",
        )}
      >
        {selected && <div className="h-2 w-2 rounded-full bg-white" />}
      </div>
    </button>
  );
}

/* =========================================================
   POINT INPUT
========================================================= */

function PointsInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-2.5 text-center shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-wide text-(--color-text-muted)">
        {label}
      </p>

      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);

          onChange(Number.isFinite(next) ? Math.max(0, next) : 0);
        }}
        className="mt-1 w-full bg-transparent text-center font-(family-name:--font-display) text-xl font-black text-(--color-text-primary) outline-none"
      />

      <p className="text-[8px] text-(--color-text-muted)">points</p>
    </div>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function TournamentSummary({
  name,
  format,
  visibility,
  usesLeaguePoints,
  winPoints,
  lossPoints,
  tiePoints,
  startDate,
  endDate,
}: {
  name: string;

  format: VolleyballTournamentFormat;

  visibility: VolleyballTournamentVisibility;

  usesLeaguePoints: boolean;

  winPoints: number;

  lossPoints: number;

  tiePoints: number;

  startDate: string;

  endDate: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-(--color-navy) text-white shadow-(--shadow-card)">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
        <Trophy size={13} className="text-orange-400" />

        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/55">
          Tournament Summary
        </p>
      </div>

      <div className="p-3">
        <p className="truncate font-(family-name:--font-display) text-lg font-black uppercase tracking-wide">
          {name}
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <SummaryBadge>{formatTournamentFormat(format)}</SummaryBadge>

          <SummaryBadge>
            {visibility === VOLLEYBALL_TOURNAMENT_VISIBILITIES.PUBLIC
              ? "Public"
              : "Private"}
          </SummaryBadge>

          {startDate && (
            <SummaryBadge>
              {formatDate(startDate)}
              {endDate && endDate !== startDate
                ? ` – ${formatDate(endDate)}`
                : ""}
            </SummaryBadge>
          )}
        </div>

        {usesLeaguePoints && (
          <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 rounded-xl bg-white/[0.06]">
            <SummaryValue label="Win" value={`${winPoints} pts`} />

            <SummaryValue label="Loss" value={`${lossPoints} pts`} />

            <SummaryValue label="Tie" value={`${tiePoints} pts`} />
          </div>
        )}

        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <p className="text-[9px] leading-4 text-white/55">
            Match format will be selected while creating tournament fixtures.
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 px-2 py-1 text-[8px] font-bold text-white/80">
      {children}
    </span>
  );
}

function SummaryValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-2 text-center">
      <p className="text-[8px] font-black uppercase tracking-wide text-white/40">
        {label}
      </p>

      <p className="mt-0.5 text-xs font-black">{value}</p>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function inputClassName() {
  return cn(
    "h-11 w-full rounded-xl border border-(--color-bg-border)",
    "bg-(--color-bg-card) px-3 text-sm font-semibold text-(--color-text-primary)",
    "outline-none transition",
    "placeholder:text-(--color-text-muted)",
    "focus:border-(--color-brand)/50 focus:ring-2 focus:ring-(--color-brand)/10",
  );
}

function formatTournamentFormat(format: VolleyballTournamentFormat) {
  switch (format) {
    case VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE:
      return "League";

    case VOLLEYBALL_TOURNAMENT_FORMATS.KNOCKOUT:
      return "Knockout";

    case VOLLEYBALL_TOURNAMENT_FORMATS.GROUP_KNOCKOUT:
      return "Groups + Knockout";

    default:
      return format;
  }
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "data" in error) {
    const data = (
      error as {
        data?: unknown;
      }
    ).data;

    if (data && typeof data === "object" && "message" in data) {
      const message = (
        data as {
          message?: unknown;
        }
      ).message;

      if (Array.isArray(message)) {
        return message.join(", ");
      }

      if (message) {
        return String(message);
      }
    }
  }

  return fallback;
}
