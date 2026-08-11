"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  Shield,
  Sparkles,
  User,
  Users2,
  UsersRound,
  Video,
} from "lucide-react";

import { cn } from "@/lib/cn";
import {
  PreviewAutoFixturesResponse,
  usePreviewAutoFixturesMutation,
  type AutoGenerateFixturesRequest,
} from "@/store/api/tournamentFixtureApi";
import { useGetTournamentRoundsQuery } from "@/store/api/tournamentRoundApi";
import { useGetTournamentGroupsQuery } from "@/store/api/tournamentGroupApi";

import {
  useGetTournamentTeamsQuery,
  type TournamentTeam,
} from "@/store/api/tournamentTeamApi";

type AutoGenerateFixturesFormProps = {
  tournamentId: string;

  initialValues?: AutoGenerateFixturesRequest["body"];

  onPreviewSuccess: (
    response: PreviewAutoFixturesResponse,
    request: AutoGenerateFixturesRequest["body"],
  ) => void;

  onCancel: () => void;
};

type GenerationScope = "ALL" | "GROUP" | "SELECTED";

type BallTypeOption = {
  value: "TENNIS" | "LEATHER" | "OTHER";
  label: string;
  color: string;
  dot?: boolean;
};

const schema = z
  .object({
    scope: z.enum(["ALL", "GROUP", "SELECTED"]),

    roundId: z.string().min(1, "Select a tournament round"),
    groupId: z.string().optional(),
    teamIds: z.array(z.string()),

    repeatCount: z
      .number({ error: "Required" })
      .int()
      .min(1, "Minimum 1 repeat")
      .max(10, "Maximum 10 repeats"),

    firstMatchDate: z.string().min(1, "Select the first match date"),
    firstMatchTime: z.string().min(1, "Select the first match time"),

    timezone: z.string().min(1),

    intervalMinutes: z
      .number({ error: "Required" })
      .int()
      .min(1, "Minimum 1 minute"),

    dailyMatchesPerGround: z
      .number({ error: "Required" })
      .int()
      .min(1, "Minimum 1 match")
      .max(50, "Maximum 50 matches"),

    matchType: z.enum([
      "LIMITED_OVERS",
      "BOX_TURF",
      "PAIR_CRICKET",
      "TEST",
      "THE_HUNDRED",
    ]),

    oversLimit: z
      .number({ error: "Required" })
      .int()
      .min(1, "Minimum 1 over")
      .max(200, "Maximum 200 overs"),

    oversPerBowler: z
      .number({ error: "Required" })
      .int()
      .min(1, "Minimum 1 over")
      .max(50, "Maximum 50 overs"),

    lineupMode: z.enum(["FLEXIBLE", "FIXED"]),

    ballType: z.enum(["TENNIS", "LEATHER", "OTHER"]),

    city: z.string().min(2, "Enter a city"),
    groundName: z.string().min(2, "Enter a ground name"),

    pitchType: z.enum([
      "ROUGH",
      "CEMENT",
      "TURF",
      "ASTROTURF",
      "MATTING",
      "OTHER",
    ]),

    addressText: z.string().optional(),

    wagonWheelEnabled: z.boolean(),
    shotSelectionEnabled: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.scope === "GROUP" && !values.groupId) {
      context.addIssue({
        code: "custom",
        path: ["groupId"],
        message: "Select a tournament group",
      });
    }

    if (values.scope === "SELECTED" && values.teamIds.length < 2) {
      context.addIssue({
        code: "custom",
        path: ["teamIds"],
        message: "Select at least two teams",
      });
    }

    if (values.oversPerBowler > values.oversLimit) {
      context.addIssue({
        code: "custom",
        path: ["oversPerBowler"],
        message: "Cannot exceed total overs",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const GENERATION_SCOPES: {
  value: GenerationScope;
  title: string;
  description: string;
  icon: typeof Shield;
}[] = [
  {
    value: "ALL",
    title: "All Teams",
    description: "Generate fixtures for every tournament team",
    icon: Shield,
  },
  {
    value: "GROUP",
    title: "One Group",
    description: "Generate fixtures for teams in one group",
    icon: UsersRound,
  },
  {
    value: "SELECTED",
    title: "Selected Teams",
    description: "Choose specific tournament teams",
    icon: Check,
  },
];

const MATCH_TYPES = [
  { value: "LIMITED_OVERS", label: "Limited Overs" },
  { value: "BOX_TURF", label: "Box/Turf Cricket" },
  { value: "PAIR_CRICKET", label: "Pair Cricket" },
  { value: "TEST", label: "Test Match" },
  { value: "THE_HUNDRED", label: "The Hundred" },
] as const;

const BALL_TYPES: BallTypeOption[] = [
  {
    value: "TENNIS",
    label: "Tennis",
    color: "#84cc16",
  },
  {
    value: "LEATHER",
    label: "Leather",
    color: "#ef4444",
  },
  {
    value: "OTHER",
    label: "Other",
    color: "#f59e0b",
    dot: true,
  },
] as const;

const PITCH_TYPES = [
  "ROUGH",
  "CEMENT",
  "TURF",
  "ASTROTURF",
  "MATTING",
  "OTHER",
] as const;

const LINEUP_MODES = [
  {
    value: "FLEXIBLE",
    label: "Flexible",
    description: "Batting order can be changed during the match",
  },
  {
    value: "FIXED",
    label: "Fixed",
    description: "Batting order is set before the match",
  },
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-(--color-live)">
      <AlertCircle size={11} className="shrink-0" />
      {message}
    </p>
  );
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

  return "Failed to generate tournament fixtures. Please try again.";
}

export default function AutoGenerateFixturesForm({
  tournamentId,
  initialValues,
  onPreviewSuccess,
  onCancel,
}: AutoGenerateFixturesFormProps) {
  const router = useRouter();
  const params = useParams();

  const roundRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);

  const [submitError, setSubmitError] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      scope: "ALL",

      roundId: "",
      groupId: "",
      teamIds: [],

      repeatCount: 1,
      firstMatchDate: "",
      firstMatchTime: "08:00",
      timezone: "Asia/Kolkata",

      intervalMinutes: 120,
      dailyMatchesPerGround: 4,

      matchType: "LIMITED_OVERS",
      oversLimit: 10,
      oversPerBowler: 2,
      lineupMode: "FLEXIBLE",
      ballType: "TENNIS",

      city: "",
      groundName: "",
      pitchType: "TURF",
      addressText: "",

      wagonWheelEnabled: false,
      shotSelectionEnabled: false,
    },
  });

  const scope = watch("scope");
  const roundId = watch("roundId");
  const selectedTeamIds = watch("teamIds");

  const {
    data: rounds = [],
    isLoading: isLoadingRounds,
    isError: isRoundsError,
  } = useGetTournamentRoundsQuery({
    tournamentId,
  });

  const { data: groups = [], isLoading: isLoadingGroups } =
    useGetTournamentGroupsQuery(
      scope === "GROUP" && roundId
        ? {
            tournamentId,
            roundId,
          }
        : skipToken,
    );

  const {
    data: tournamentTeams = [],
    isLoading: isLoadingTeams,
    isError: isTeamsError,
  } = useGetTournamentTeamsQuery({
    tournamentId,
  });

  const [previewAutoFixtures, { isLoading: isGenerating }] =
    usePreviewAutoFixturesMutation();

  useEffect(() => {
    if (!roundId && rounds.length > 0) {
      setValue("roundId", rounds[0].id, {
        shouldValidate: true,
      });
    }
  }, [roundId, rounds, setValue]);

  function handleScopeChange(nextScope: GenerationScope) {
    setValue("scope", nextScope, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("groupId", "");
    setValue("teamIds", []);
    setSubmitError("");
  }

  function toggleTeam(teamId: string) {
    const isSelected = selectedTeamIds.includes(teamId);

    setValue(
      "teamIds",
      isSelected
        ? selectedTeamIds.filter((id) => id !== teamId)
        : [...selectedTeamIds, teamId],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  }

  function scrollTo(ref: React.RefObject<HTMLDivElement>) {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  async function handleGenerateClick() {
    const valid = await trigger();

    if (valid) return;

    if (errors.roundId) {
      scrollTo(roundRef);
      return;
    }

    if (errors.groupId) {
      scrollTo(groupRef);
      return;
    }

    if (errors.teamIds) {
      scrollTo(teamRef);
      return;
    }

    if (errors.firstMatchDate) {
      setFocus("firstMatchDate");
      scrollTo(dateRef);
      return;
    }

    if (errors.city) {
      setFocus("city");
      scrollTo(cityRef);
      return;
    }

    if (errors.groundName) {
      setFocus("groundName");
      scrollTo(groundRef);
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError("");

    const body: AutoGenerateFixturesRequest["body"] = {
      roundId: values.roundId,

      repeatCount: values.repeatCount,
      firstMatchDate: values.firstMatchDate,
      firstMatchTime: values.firstMatchTime,
      timezone: values.timezone,

      intervalMinutes: values.intervalMinutes,
      dailyMatchesPerGround: values.dailyMatchesPerGround,

      venue: {
        city: values.city.trim(),
        groundName: values.groundName.trim(),
        pitchType: values.pitchType,

        ...(values.addressText?.trim() && {
          addressText: values.addressText.trim(),
        }),
      },

      rules: {
        matchType: values.matchType,
        oversLimit: values.oversLimit,
        oversPerBowler: values.oversPerBowler,
        lineupMode: values.lineupMode,
        ballType: values.ballType,
        wagonWheelEnabled: values.wagonWheelEnabled,
        shotSelectionEnabled: values.shotSelectionEnabled,
      },

      officials: {
        scorerUserIds: [],
        umpireNames: [],
        liveStreamerUserIds: [],
        otherNames: [],
      },
    };

    if (values.scope === "GROUP") {
      body.groupId = values.groupId;
    }

    if (values.scope === "SELECTED") {
      body.teamIds = values.teamIds;
    }

    try {
      const response = await previewAutoFixtures({
        tournamentId,
        body,
      }).unwrap();

      onPreviewSuccess(response, body);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  });

  if (isLoadingRounds) {
    return (
      <div className="flex min-h-80 items-center justify-center bg-(--color-bg-base)">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-(--color-brand)/30 border-t-(--color-brand)" />
      </div>
    );
  }

  if (isRoundsError) {
    return (
      <div className="bg-(--color-bg-base) p-4">
        <div className="rounded-2xl border border-(--color-live)/20 bg-(--color-live)/8 p-5 text-center">
          <AlertCircle size={28} className="mx-auto text-(--color-live)" />

          <p className="mt-3 text-sm font-semibold text-(--color-live)">
            Failed to load tournament rounds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex min-h-full flex-col bg-(--color-bg-base)"
    >
      {/* Header banner */}
      <div className="relative overflow-hidden bg-(--color-navy) px-5 py-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, white 0%, transparent 70%)",
          }}
        />

        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--color-brand) text-white shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
            <Sparkles size={25} strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="font-(family-name:--font-display) text-lg font-black uppercase tracking-[0.04em] text-white">
              Auto Generate Fixtures
            </h1>

            <p className="mt-1 text-xs leading-5 text-white/55">
              Configure the tournament schedule and automatically create all
              required fixtures.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="flex flex-col gap-3 p-4">
          {/* Generation scope */}
          <div className="fixture-bar rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <p className="text-section-label mb-3">
              Generate Fixtures For
              <span className="text-(--color-live)"> *</span>
            </p>

            <Controller
              name="scope"
              control={control}
              render={({ field }) => (
                <div className="grid gap-2">
                  {GENERATION_SCOPES.map(
                    ({ value, title, description, icon: Icon }) => {
                      const selected = field.value === value;

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleScopeChange(value)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all active:scale-[0.99]",
                            selected
                              ? "border-(--color-brand) bg-(--color-brand)/6"
                              : "border-(--color-bg-border) bg-(--color-bg-base)",
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                              selected
                                ? "bg-(--color-brand) text-white"
                                : "bg-(--color-bg-card) text-(--color-text-secondary)",
                            )}
                          >
                            <Icon size={19} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
                              {title}
                            </p>

                            <p className="mt-0.5 text-[11px] leading-4 text-(--color-text-secondary)">
                              {description}
                            </p>
                          </div>

                          <div
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                              selected
                                ? "border-(--color-brand) bg-(--color-brand) text-white"
                                : "border-(--color-bg-border)",
                            )}
                          >
                            {selected && <Check size={11} strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            />
          </div>

          {/* Round and group */}
          <div
            ref={roundRef}
            className="fixture-bar flex flex-col gap-4 rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)"
          >
            <div>
              <p className="text-section-label mb-1.5">
                Tournament Round
                <span className="text-(--color-live)"> *</span>
              </p>

              <div className="relative border-b-2 border-(--color-bg-border) focus-within:border-(--color-sky)">
                <Controller
                  name="roundId"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                        setValue("groupId", "");
                      }}
                      className="w-full appearance-none bg-transparent pb-2 pr-8 text-sm font-semibold text-(--color-text-primary) outline-none"
                    >
                      <option value="">Select tournament round</option>

                      {rounds.map((round) => (
                        <option key={round.id} value={round.id}>
                          {round.name}
                        </option>
                      ))}
                    </select>
                  )}
                />

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                />
              </div>

              <FieldError message={errors.roundId?.message} />
            </div>

            {scope === "GROUP" && (
              <div ref={groupRef}>
                <p className="text-section-label mb-1.5">
                  Tournament Group
                  <span className="text-(--color-live)"> *</span>
                </p>

                <div className="relative border-b-2 border-(--color-bg-border) focus-within:border-(--color-sky)">
                  <Controller
                    name="groupId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        disabled={isLoadingGroups || !roundId}
                        className="w-full appearance-none bg-transparent pb-2 pr-8 text-sm font-semibold text-(--color-text-primary) outline-none disabled:opacity-50"
                      >
                        <option value="">
                          {isLoadingGroups
                            ? "Loading groups..."
                            : "Select tournament group"}
                        </option>

                        {groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name} ({group.teamIds?.length ?? 0} teams)
                          </option>
                        ))}
                      </select>
                    )}
                  />

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                  />
                </div>

                <FieldError message={errors.groupId?.message} />
              </div>
            )}
          </div>

          {/* Team selection */}
          {scope === "SELECTED" && (
            <div
              ref={teamRef}
              className="fixture-bar rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-section-label">
                    Select Teams
                    <span className="text-(--color-live)"> *</span>
                  </p>

                  <p className="text-meta mt-0.5">
                    Select at least two tournament teams
                  </p>
                </div>

                <span className="rounded-full bg-(--color-brand)/10 px-3 py-1 font-(family-name:--font-display) text-[10px] font-black uppercase text-(--color-brand)">
                  {selectedTeamIds.length} Selected
                </span>
              </div>

              {isLoadingTeams ? (
                <div className="flex h-24 items-center justify-center">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-(--color-brand)/30 border-t-(--color-brand)" />
                </div>
              ) : isTeamsError ? (
                <p className="text-sm font-medium text-(--color-live)">
                  Failed to load tournament teams.
                </p>
              ) : (
                <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                  {tournamentTeams.map((team) => {
                    const selected = selectedTeamIds.includes(team.teamId);

                    return (
                      <button
                        key={team.teamId}
                        type="button"
                        onClick={() => toggleTeam(team.teamId)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all",
                          selected
                            ? "border-(--color-brand) bg-(--color-brand)/5"
                            : "border-(--color-bg-border) bg-(--color-bg-base)",
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-bg-card)">
                          <Shield size={18} className="text-(--color-brand)" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-(--color-text-primary)">
                            {team.teamNameSnapshot ?? "Unnamed Team"}
                          </p>

                          {team.teamShortNameSnapshot && (
                            <p className="text-[10px] font-bold uppercase tracking-wide text-(--color-text-muted)">
                              {team.teamShortNameSnapshot}
                            </p>
                          )}
                        </div>

                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full border-2",
                            selected
                              ? "border-(--color-brand) bg-(--color-brand) text-white"
                              : "border-(--color-bg-border)",
                          )}
                        >
                          {selected && <Check size={11} strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <FieldError message={errors.teamIds?.message} />
            </div>
          )}

          {/* Scheduling */}
          <div
            ref={dateRef}
            className="fixture-bar rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)"
          >
            <div className="mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-(--color-brand)" />

              <p className="font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
                Fixture Schedule
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-section-label mb-1.5">
                  First Match Date
                  <span className="text-(--color-live)"> *</span>
                </p>

                <Controller
                  name="firstMatchDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1.5 text-sm font-semibold text-(--color-text-primary) outline-none focus:border-(--color-sky)"
                    />
                  )}
                />

                <FieldError message={errors.firstMatchDate?.message} />
              </div>

              <div>
                <p className="text-section-label mb-1.5">
                  First Match Time
                  <span className="text-(--color-live)"> *</span>
                </p>

                <Controller
                  name="firstMatchTime"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="time"
                      className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1.5 text-sm font-semibold text-(--color-text-primary) outline-none focus:border-(--color-sky)"
                    />
                  )}
                />

                <FieldError message={errors.firstMatchTime?.message} />
              </div>
            </div>
          </div>

          {/* Fixture frequency */}
          <div className="fixture-bar rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 size={16} className="text-(--color-brand)" />

              <p className="font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
                Fixture Frequency
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <p className="text-section-label mb-1.5">Repeat Count</p>

                <Controller
                  name="repeatCount"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1 text-xl font-bold text-(--color-text-primary) outline-none focus:border-(--color-sky)"
                    />
                  )}
                />

                <FieldError message={errors.repeatCount?.message} />
              </div>

              <div>
                <p className="text-section-label mb-1.5">Match Interval</p>

                <div className="flex items-end border-b-2 border-(--color-bg-border) pb-1 focus-within:border-(--color-sky)">
                  <Controller
                    name="intervalMinutes"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        min={1}
                        value={field.value}
                        onChange={(event) =>
                          field.onChange(Number(event.target.value))
                        }
                        className="w-full bg-transparent text-xl font-bold text-(--color-text-primary) outline-none"
                      />
                    )}
                  />

                  <span className="pb-1 text-[10px] font-bold uppercase text-(--color-text-muted)">
                    Minutes
                  </span>
                </div>

                <FieldError message={errors.intervalMinutes?.message} />
              </div>

              <div>
                <p className="text-section-label mb-1.5">Matches Per Ground</p>

                <Controller
                  name="dailyMatchesPerGround"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1 text-xl font-bold text-(--color-text-primary) outline-none focus:border-(--color-sky)"
                    />
                  )}
                />

                <FieldError message={errors.dailyMatchesPerGround?.message} />
              </div>

              <div>
                <p className="text-section-label mb-1.5">Timezone</p>

                <Controller
                  name="timezone"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      readOnly
                      className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1.5 text-sm font-semibold text-(--color-text-secondary) outline-none"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Match type */}
          <div className="fixture-bar rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <p className="text-section-label mb-3">
              Match Type
              <span className="text-(--color-live)"> *</span>
            </p>

            <Controller
              name="matchType"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {MATCH_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={cn(
                        "rounded-full px-4 py-1.5 font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95",
                        field.value === value
                          ? "bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.25)]"
                          : "bg-(--color-bg-base) text-(--color-text-secondary) hover:bg-(--color-bg-tint)",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Overs */}
          <div className="fixture-bar rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <p className="text-section-label mb-1.5">
                  No. of Overs
                  <span className="text-(--color-live)"> *</span>
                </p>

                <Controller
                  name="oversLimit"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1 text-xl font-bold text-(--color-text-primary) outline-none focus:border-(--color-sky)"
                    />
                  )}
                />

                <FieldError message={errors.oversLimit?.message} />
              </div>

              <div className="flex-1">
                <p className="text-section-label mb-1.5">Overs Per Bowler</p>

                <Controller
                  name="oversPerBowler"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1 text-xl font-bold text-(--color-text-primary) outline-none focus:border-(--color-sky)"
                    />
                  )}
                />

                <FieldError message={errors.oversPerBowler?.message} />
              </div>
            </div>
          </div>

          {/* Lineup mode */}
          <div className="fixture-bar rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <p className="text-section-label mb-3">Lineup Mode</p>

            <Controller
              name="lineupMode"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {LINEUP_MODES.map(({ value, label, description }) => {
                    const selected = field.value === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={cn(
                          "rounded-xl border-2 p-3 text-left transition-all",
                          selected
                            ? "border-(--color-brand) bg-(--color-brand)/5"
                            : "border-(--color-bg-border) bg-(--color-bg-base)",
                        )}
                      >
                        <p
                          className={cn(
                            "font-(family-name:--font-display) text-xs font-black uppercase",
                            selected
                              ? "text-(--color-brand)"
                              : "text-(--color-text-primary)",
                          )}
                        >
                          {label}
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-(--color-text-secondary)">
                          {description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          {/* Location */}
          <div className="fixture-bar flex flex-col gap-4 rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <div ref={cityRef}>
              <p className="text-section-label mb-1.5">
                City / Town
                <span className="text-(--color-live)"> *</span>
              </p>

              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Mumbai"
                    className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1.5 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-sky)"
                  />
                )}
              />

              <FieldError message={errors.city?.message} />
            </div>

            <div ref={groundRef}>
              <p className="text-section-label mb-1.5">
                Ground
                <span className="text-(--color-live)"> *</span>
              </p>

              <Controller
                name="groundName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Shivaji Park"
                    className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1.5 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-sky)"
                  />
                )}
              />

              <FieldError message={errors.groundName?.message} />
            </div>

            <div>
              <p className="text-section-label mb-1.5">Address</p>

              <Controller
                name="addressText"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Dadar, Mumbai"
                    className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1.5 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-sky)"
                  />
                )}
              />
            </div>
          </div>

          {/* Ball Type */}
          <div className="fixture-bar rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <p className="text-section-label mb-3">
              Ball Type
              <span className="text-(--color-live)"> *</span>
            </p>

            <Controller
              name="ballType"
              control={control}
              render={({ field }) => (
                <div className="flex items-end gap-6">
                  {BALL_TYPES.map(({ value, label, color, dot }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className="flex flex-col items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <div
                        className={cn(
                          "h-12 w-12 rounded-full transition-all duration-150",
                          field.value === value &&
                            "ring-[3px] ring-offset-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
                        )}
                        style={{ backgroundColor: color }}
                      >
                        {dot && (
                          <div className="flex h-full items-center justify-center">
                            <div className="h-3 w-3 rounded-full border-2 border-white/60" />
                          </div>
                        )}
                      </div>

                      <span className="text-section-label">{label}</span>
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Wagon wheel */}
          <div className="flex items-center justify-between rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <div>
              <p className="font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
                Wagon Wheel
              </p>

              <p className="text-meta mt-0.5">
                Record wagon wheel positions during scoring
              </p>
            </div>

            <Controller
              name="wagonWheelEnabled"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    "flex h-7 w-12 items-center rounded-full p-1 transition-all duration-200",
                    field.value
                      ? "justify-end bg-(--color-brand)"
                      : "justify-start bg-(--color-bg-border)",
                  )}
                >
                  <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
                </button>
              )}
            />
          </div>

          {/* Shot selection */}
          <div className="flex items-center justify-between rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <div>
              <p className="font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
                Shot Selection
              </p>

              <p className="text-meta mt-0.5">
                Record the shot played for each scoring delivery
              </p>
            </div>

            <Controller
              name="shotSelectionEnabled"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    "flex h-7 w-12 items-center rounded-full p-1 transition-all duration-200",
                    field.value
                      ? "justify-end bg-(--color-brand)"
                      : "justify-start bg-(--color-bg-border)",
                  )}
                >
                  <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
                </button>
              )}
            />
          </div>

          {/* Pitch Type */}
          <div className="fixture-bar rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <p className="text-section-label mb-3">Pitch Type</p>

            <Controller
              name="pitchType"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {PITCH_TYPES.map((pitchType) => (
                    <button
                      key={pitchType}
                      type="button"
                      onClick={() => field.onChange(pitchType)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95",
                        field.value === pitchType
                          ? "border-(--color-brand) bg-(--color-brand) text-white"
                          : "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary)",
                      )}
                    >
                      {pitchType}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Match officials */}
          {/* <div className="fixture-bar rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <p className="text-section-label mb-4">Match Officials</p>

            <div className="flex items-center justify-around">
              {[
                {
                  icon: User,
                  label: "Umpires",
                },
                {
                  icon: ClipboardList,
                  label: "Scorers",
                },
                {
                  icon: Video,
                  label: "Streamer",
                },
                {
                  icon: Users2,
                  label: "Others",
                },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="flex flex-col items-center gap-2 transition-transform active:scale-90"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-(--color-bg-border) bg-(--color-bg-base)">
                    <Icon size={20} className="text-(--color-text-secondary)" />
                  </div>

                  <span className="text-section-label">{label}</span>
                </button>
              ))}
            </div>
          </div> */}
        </div>

        {submitError && (
          <div className="mx-4 mb-4 flex items-start gap-2.5 rounded-2xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0 text-(--color-live)"
            />

            <p className="text-sm font-medium text-(--color-live)">
              {submitError}
            </p>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="safe-bottom sticky bottom-0 z-30 flex shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card)">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isGenerating}
          className="flex flex-1 items-center justify-center py-4 font-(family-name:--font-display) text-xs font-black uppercase tracking-[0.06em] text-(--color-text-secondary) disabled:opacity-50"
        >
          Cancel
        </button>

        <div className="h-8 w-px self-center bg-(--color-bg-border)" />

        <button
          type="submit"
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="flex flex-1 items-center justify-center gap-1.5 bg-(--color-brand) py-4 font-(family-name:--font-display) text-xs font-black uppercase tracking-[0.06em] text-white shadow-[0_-2px_12px_rgba(27,63,160,0.20)] transition-all active:scale-[0.97] disabled:opacity-60"
        >
          {isGenerating ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              Generate Fixtures
              <ChevronRight size={14} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
