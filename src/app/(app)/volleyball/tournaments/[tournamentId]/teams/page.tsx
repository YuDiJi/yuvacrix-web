"use client";

import { Check, ChevronRight, Plus, Shield, Trophy, Users } from "lucide-react";

import { useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";

import { cn } from "@/lib/cn";

import { useGetOwnedTeamQuery } from "@/store/api/teamApi";

import {
  useGetVolleyballTournamentQuery,
  useGetVolleyballTournamentTeamsQuery,
  useRegisterVolleyballTournamentTeamMutation,
} from "@/store/api/volleyball/volleyballTournamentApi";

import { SPORT_TYPES } from "@/types/sport";

import {
  VOLLEYBALL_TOURNAMENT_FORMATS,
  type VolleyballTournamentTeam,
} from "@/types/volleyball/tournament";

import type { Team } from "@/types/team";

/* =========================================================
   PAGE
========================================================= */

export default function VolleyballTournamentTeamsPage() {
  const params = useParams();

  const router = useRouter();

  const tournamentId =
    typeof params.tournamentId === "string" ? params.tournamentId : "";

  /* =====================================================
     STATE
  ===================================================== */

  const [selectedGroup, setSelectedGroup] = useState("Pool A");

  const [customGroup, setCustomGroup] = useState("");

  const [addingTeamId, setAddingTeamId] = useState<string | null>(null);

  const [error, setError] = useState("");

  /* =====================================================
     API
  ===================================================== */

  const {
    data: tournament,
    isLoading: isTournamentLoading,
    isError: isTournamentError,
  } = useGetVolleyballTournamentQuery(
    {
      tournamentId,
    },
    {
      skip: !tournamentId,
    },
  );

  const {
    data: registeredTeams = [],
    isLoading: areRegisteredTeamsLoading,
    isError: areRegisteredTeamsError,
  } = useGetVolleyballTournamentTeamsQuery(
    {
      tournamentId,
    },
    {
      skip: !tournamentId,
    },
  );

  const {
    data: ownedTeams = [],
    isLoading: areOwnedTeamsLoading,
    isError: areOwnedTeamsError,
  } = useGetOwnedTeamQuery();

  const [registerTeam] = useRegisterVolleyballTournamentTeamMutation();

  /* =====================================================
     DERIVED
  ===================================================== */

  const isGroupKnockout =
    tournament?.format === VOLLEYBALL_TOURNAMENT_FORMATS.GROUP_KNOCKOUT;

  const volleyballTeams = useMemo(
    () =>
      ownedTeams.filter((team) => team.sportType === SPORT_TYPES.VOLLEYBALL),
    [ownedTeams],
  );

  const registeredTeamIds = useMemo(
    () => new Set(registeredTeams.map((team) => team.teamId)),
    [registeredTeams],
  );

  const availableTeams = useMemo(
    () => volleyballTeams.filter((team) => !registeredTeamIds.has(team.id)),
    [volleyballTeams, registeredTeamIds],
  );

  const groupedTeams = useMemo(() => {
    const groups = new Map<string, VolleyballTournamentTeam[]>();

    for (const team of registeredTeams) {
      const key = team.groupName?.trim() || "Unassigned";

      const current = groups.get(key) ?? [];

      current.push(team);

      groups.set(key, current);
    }

    return Array.from(groups.entries());
  }, [registeredTeams]);

  const effectiveGroupName =
    selectedGroup === "CUSTOM" ? customGroup.trim() : selectedGroup;

  const canContinue = registeredTeams.length >= 2;

  /* =====================================================
     REGISTER
  ===================================================== */

  async function handleRegisterTeam(team: Team) {
    if (isGroupKnockout && !effectiveGroupName) {
      setError("Select or enter a pool before adding this team.");

      return;
    }

    setError("");

    setAddingTeamId(team.id);

    try {
      await registerTeam({
        tournamentId,

        body: {
          teamId: team.id,

          ...(isGroupKnockout
            ? {
                groupName: effectiveGroupName,
              }
            : {}),
        },
      }).unwrap();
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to add team to tournament."));
    } finally {
      setAddingTeamId(null);
    }
  }

  /* =====================================================
     CONTINUE
  ===================================================== */

  function handleContinue() {
    if (registeredTeams.length < 2) {
      setError("Add at least 2 teams before creating fixtures.");

      return;
    }

    router.push(`/volleyball/tournaments/${tournamentId}/fixtures`);
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (
    isTournamentLoading ||
    areRegisteredTeamsLoading ||
    areOwnedTeamsLoading
  ) {
    return (
      <div className="min-h-full bg-(--color-bg-base) px-4 py-5">
        <div className="animate-pulse space-y-4">
          <div className="h-20 rounded-2xl bg-(--color-bg-card)" />

          <div className="h-24 rounded-2xl bg-(--color-bg-card)" />

          <div className="h-16 rounded-2xl bg-(--color-bg-card)" />

          <div className="h-64 rounded-2xl bg-(--color-bg-card)" />
        </div>
      </div>
    );
  }

  /* =====================================================
     LOAD ERROR
  ===================================================== */

  if (
    isTournamentError ||
    areRegisteredTeamsError ||
    areOwnedTeamsError ||
    !tournament
  ) {
    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4">
        <div className="w-full rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <Users size={24} className="mx-auto text-(--color-brand)" />

          <p className="mt-3 text-sm font-black text-(--color-text-primary)">
            Unable to load tournament teams
          </p>

          <p className="mt-1 text-xs text-(--color-text-muted)">
            Please try again.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-full bg-(--color-bg-base)">
      <div className="flex flex-col gap-5 px-4 py-5">
        {/* ===============================================
            HEADER
        =============================================== */}

        <div>
          <p className="text-section-label">Tournament Teams</p>

          <h1 className="mt-1 truncate font-(family-name:--font-display) text-2xl font-black uppercase tracking-wide text-(--color-text-primary)">
            {tournament.name}
          </h1>

          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Add the volleyball teams participating in this tournament.
          </p>
        </div>

        {/* ===============================================
            PROGRESS
        =============================================== */}

        <div className="grid grid-cols-3 gap-2">
          <SetupStep number="1" label="Tournament" completed />

          <SetupStep number="2" label="Teams" active />

          <SetupStep number="3" label="Fixtures" />
        </div>

        {/* ===============================================
            SUMMARY
        =============================================== */}

        <div className="overflow-hidden rounded-2xl bg-(--color-navy) text-white">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/45">
                Teams Registered
              </p>

              <p className="mt-0.5 font-(family-name:--font-display) text-2xl font-black">
                {registeredTeams.length}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Users size={20} className="text-orange-400" />
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-2">
            <p className="text-[9px] text-white/55">
              {formatTournamentFormat(tournament.format)}
            </p>
          </div>
        </div>

        {/* ===============================================
            ERROR
        =============================================== */}

        {error && (
          <div className="rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
            <p className="text-sm font-semibold text-(--color-live)">{error}</p>
          </div>
        )}

        {/* ===============================================
            GROUP SELECTION
        =============================================== */}

        {isGroupKnockout && (
          <section>
            <SectionHeader
              title="Assign Pool"
              description="Choose which group newly added teams should join."
            />

            <div className="grid grid-cols-3 gap-2">
              <GroupButton
                label="Pool A"
                selected={selectedGroup === "Pool A"}
                onClick={() => {
                  setError("");

                  setSelectedGroup("Pool A");
                }}
              />

              <GroupButton
                label="Pool B"
                selected={selectedGroup === "Pool B"}
                onClick={() => {
                  setError("");

                  setSelectedGroup("Pool B");
                }}
              />

              <GroupButton
                label="Other"
                selected={selectedGroup === "CUSTOM"}
                onClick={() => {
                  setError("");

                  setSelectedGroup("CUSTOM");
                }}
              />
            </div>

            {selectedGroup === "CUSTOM" && (
              <input
                value={customGroup}
                onChange={(event) => {
                  setError("");

                  setCustomGroup(event.target.value);
                }}
                placeholder="e.g. Pool C"
                className={cn(
                  "mt-2 h-11 w-full rounded-xl border border-(--color-bg-border)",
                  "bg-(--color-bg-card) px-3 text-sm font-semibold text-(--color-text-primary)",
                  "outline-none transition",
                  "placeholder:text-(--color-text-muted)",
                  "focus:border-(--color-brand)/50 focus:ring-2 focus:ring-(--color-brand)/10",
                )}
              />
            )}

            <div className="mt-2 rounded-xl bg-(--color-bg-tint) px-3 py-2">
              <p className="text-[9px] text-(--color-text-secondary)">
                New teams will be added to{" "}
                <span className="font-black text-(--color-brand)">
                  {effectiveGroupName || "your selected pool"}
                </span>
                .
              </p>
            </div>
          </section>
        )}

        {/* ===============================================
            REGISTERED
        =============================================== */}

        {registeredTeams.length > 0 && (
          <section>
            <SectionHeader
              title="Registered Teams"
              description={`${registeredTeams.length} team${
                registeredTeams.length === 1 ? "" : "s"
              } added`}
            />

            {isGroupKnockout ? (
              <div className="space-y-4">
                {groupedTeams.map(([groupName, teams]) => (
                  <div key={groupName}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-wide text-(--color-text-secondary)">
                        {groupName}
                      </p>

                      <span className="rounded-full bg-(--color-bg-tint) px-2 py-0.5 text-[8px] font-black text-(--color-brand)">
                        {teams.length} teams
                      </span>
                    </div>

                    <div className="space-y-2">
                      {teams.map((team) => (
                        <RegisteredTeamCard key={team.id} team={team} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {registeredTeams.map((team) => (
                  <RegisteredTeamCard key={team.id} team={team} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ===============================================
            AVAILABLE TEAMS
        =============================================== */}

        <section>
          <SectionHeader
            title="Add Teams"
            description="Choose from your existing volleyball teams."
          />

          {availableTeams.length > 0 ? (
            <div className="space-y-2">
              {availableTeams.map((team) => (
                <AvailableTeamCard
                  key={team.id}
                  team={team}
                  groupName={isGroupKnockout ? effectiveGroupName : null}
                  loading={addingTeamId === team.id}
                  disabled={addingTeamId !== null}
                  onAdd={() => void handleRegisterTeam(team)}
                />
              ))}
            </div>
          ) : (
            <EmptyTeamsState
              registeredCount={registeredTeams.length}
              totalCount={volleyballTeams.length}
            />
          )}
        </section>

        {/* ===============================================
            INFO
        =============================================== */}

        <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3.5">
          <div className="flex items-start gap-2.5">
            <Shield
              size={16}
              className="mt-0.5 shrink-0 text-(--color-brand)"
            />

            <div>
              <p className="text-[10px] font-black text-(--color-text-primary)">
                Team setup
              </p>

              <p className="mt-1 text-[9px] leading-4 text-(--color-text-muted)">
                Players and match rosters are configured when an actual
                tournament match is created from a fixture.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===============================================
          FOOTER
      =============================================== */}

      <div className="safe-bottom sticky bottom-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3 shadow-[0_-8px_24px_rgba(13,27,62,0.06)]">
        <div className="flex items-center justify-between gap-3">
          <div className="shrink-0">
            <p className="text-[8px] font-black uppercase tracking-wide text-(--color-text-muted)">
              Registered
            </p>

            <p className="font-(family-name:--font-display) text-lg font-black text-(--color-text-primary)">
              {registeredTeams.length}
            </p>
          </div>

          <Button fullWidth disabled={!canContinue} onClick={handleContinue}>
            Continue to Fixtures
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REGISTERED TEAM
========================================================= */

function RegisteredTeamCard({ team }: { team: VolleyballTournamentTeam }) {
  const initials = getInitials(team.teamSnapshot.name);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-(--color-brand)/15 bg-(--color-bg-card) px-3 py-3 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-tint) font-(family-name:--font-display) text-sm font-black text-(--color-brand)">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-black text-(--color-text-primary)">
            {team.teamSnapshot.name}
          </p>

          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <Check size={10} className="text-white" />
          </div>
        </div>

        <div className="mt-0.5 flex items-center gap-1.5">
          {team.teamSnapshot.shortName && (
            <span className="text-[9px] font-semibold text-(--color-text-muted)">
              {team.teamSnapshot.shortName}
            </span>
          )}

          {team.groupName && (
            <>
              <span className="h-1 w-1 rounded-full bg-(--color-text-muted)" />

              <span className="rounded-full bg-(--color-bg-tint) px-1.5 py-0.5 text-[8px] font-black text-(--color-brand)">
                {team.groupName}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   AVAILABLE TEAM
========================================================= */

function AvailableTeamCard({
  team,
  groupName,
  loading,
  disabled,
  onAdd,
}: {
  team: Team;

  groupName: string | null;

  loading: boolean;

  disabled: boolean;

  onAdd: () => void;
}) {
  const initials = getInitials(team.name);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-base) font-(family-name:--font-display) text-sm font-black text-(--color-text-secondary)">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-(--color-text-primary)">
          {team.name}
        </p>

        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          {team.city && (
            <span className="text-[9px] text-(--color-text-muted)">
              {team.city}
            </span>
          )}

          {groupName && (
            <>
              <span className="h-1 w-1 rounded-full bg-(--color-text-muted)" />

              <span className="text-[8px] font-bold text-(--color-brand)">
                → {groupName}
              </span>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onAdd}
        className={cn(
          "flex h-9 shrink-0 items-center justify-center gap-1 rounded-xl px-3 text-[10px] font-black transition-all",
          "bg-(--color-brand) text-white",
          "disabled:cursor-not-allowed disabled:opacity-45",
        )}
      >
        {loading ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <>
            <Plus size={13} />
            Add
          </>
        )}
      </button>
    </div>
  );
}

/* =========================================================
   GROUP BUTTON
========================================================= */

function GroupButton({
  label,
  selected,
  onClick,
}: {
  label: string;

  selected: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 rounded-xl border text-[10px] font-black transition-all",

        selected
          ? "border-(--color-brand) bg-(--color-brand) text-white"
          : "border-(--color-bg-border) bg-(--color-bg-card) text-(--color-text-secondary)",
      )}
    >
      {label}
    </button>
  );
}

/* =========================================================
   SETUP STEP
========================================================= */

function SetupStep({
  number,
  label,
  completed = false,
  active = false,
}: {
  number: string;

  label: string;

  completed?: boolean;

  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-2 py-2.5 text-center",

        completed && "border-emerald-200 bg-emerald-50",

        active && "border-(--color-brand)/25 bg-(--color-bg-tint)",

        !completed &&
          !active &&
          "border-(--color-bg-border) bg-(--color-bg-card)",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-black",

          completed && "bg-emerald-500 text-white",

          active && "bg-(--color-brand) text-white",

          !completed &&
            !active &&
            "bg-(--color-bg-base) text-(--color-text-muted)",
        )}
      >
        {completed ? <Check size={10} /> : number}
      </div>

      <p
        className={cn(
          "mt-1.5 text-[8px] font-black uppercase tracking-wide",

          active
            ? "text-(--color-brand)"
            : completed
              ? "text-emerald-700"
              : "text-(--color-text-muted)",
        )}
      >
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyTeamsState({
  registeredCount,
  totalCount,
}: {
  registeredCount: number;

  totalCount: number;
}) {
  if (totalCount === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) px-4 py-7 text-center">
        <Users size={23} className="mx-auto text-(--color-text-muted)" />

        <p className="mt-3 text-sm font-black text-(--color-text-primary)">
          No volleyball teams found
        </p>

        <p className="mt-1 text-xs text-(--color-text-muted)">
          Create volleyball teams before adding them to this tournament.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-(--color-brand)/15 bg-(--color-bg-tint) px-4 py-5 text-center">
      <Check size={22} className="mx-auto text-(--color-brand)" />

      <p className="mt-2 text-sm font-black text-(--color-text-primary)">
        All available teams added
      </p>

      <p className="mt-1 text-[10px] text-(--color-text-muted)">
        {registeredCount} team
        {registeredCount === 1 ? "" : "s"} registered.
      </p>
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
   HELPERS
========================================================= */

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTournamentFormat(format: string) {
  switch (format) {
    case VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE:
      return "League Tournament";

    case VOLLEYBALL_TOURNAMENT_FORMATS.KNOCKOUT:
      return "Knockout Tournament";

    case VOLLEYBALL_TOURNAMENT_FORMATS.GROUP_KNOCKOUT:
      return "Groups + Knockout";

    default:
      return format;
  }
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
