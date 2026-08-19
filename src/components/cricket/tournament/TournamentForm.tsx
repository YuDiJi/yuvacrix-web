"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useRouter } from "next/navigation";
import { AlertCircle, ChevronRight, Loader2 } from "lucide-react";

import { cn } from "@/lib/cn";
import { ImageUploader } from "@/components/common/ImageUploaderV1";
import { Button } from "@/components/common/Button";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { useEffect, useState } from "react";

import {
  useCreateTournamentMutation,
  useUpdateTournamentMutation,
  type Tournament,
} from "@/store/api/cricket/tournamentApi";

const EMPTY_FORM_VALUES: TournamentFormValues = {
  name: "",
  shortName: "",
  description: "",

  city: "",
  groundName: "",
  locationLabel: "",

  startDate: "",
  endDate: "",

  visibility: "PUBLIC",
  format: "LEAGUE",
  category: "OPEN",
  ballType: "TENNIS",

  pitchType: "ASTROTURF",
  matchType: "BOX_TURF",

  enableLastBatterRule: true,
  needMoreTeams: true,
  needOfficials: true,

  entryFee: "",
  totalTeams: "",
  requiredTeams: "",

  winningPrize: "CASH",
  matchesOn: "WEEKENDS",
  matchTiming: "DAY",

  additionalDetails: "",
  informPreviousPlayers: true,
};

const schema = z
  .object({
    name: z.string().min(2, "Enter tournament name"),
    shortName: z.string().optional(),
    description: z.string().optional(),

    city: z.string().min(2, "Enter city"),
    groundName: z.string().optional(),
    locationLabel: z.string().optional(),

    // organiserName: z.string().min(2, "Enter organiser name"),
    // organiserNumber: z.string().min(10, "Enter organiser number"),
    // organiserEmail: z
    //   .string()
    //   .email("Enter valid email")
    //   .optional()
    //   .or(z.literal("")),

    startDate: z.string().min(1, "Select start date"),
    endDate: z.string().min(1, "Select end date"),

    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    format: z.enum([
      "LEAGUE",
      "GROUP_STAGE",
      "KNOCKOUT",
      "CUSTOM",
      "GROUP_STAGE_PLUS_KNOCKOUT",
      "SUPER_THREE",
      "SUPER_FOUR",
      "DOUBLE_ELIMINATION",
    ]),

    category: z.enum([
      "OPEN",
      "CORPORATE",
      "COMMUNITY",
      "SCHOOL",
      "OTHER",
      "SERIES",
      "COLLEGE",
      "UNIVERSITY",
    ]),

    ballType: z.enum(["TENNIS", "LEATHER", "OTHER"]),
    pitchType: z.enum(["ROUGH", "CEMENT", "TURF", "ASTROTURF", "MATTING"]),
    matchType: z.enum([
      "LIMITED_OVERS",
      "BOX_TURF",
      "PAIR_CRICKET",
      "TEST",
      "THE_HUNDRED",
    ]),

    enableLastBatterRule: z.boolean(),
    needMoreTeams: z.boolean(),
    needOfficials: z.boolean(),

    entryFee: z.string().optional(),
    totalTeams: z.string().optional(),
    requiredTeams: z.string().optional(),

    winningPrize: z.enum(["CASH", "TROPHIES", "BOTH"]),
    matchesOn: z.enum(["WEEKENDS", "WEEKDAYS", "ALL_DAYS"]),
    matchTiming: z.enum(["DAY", "NIGHT", "DAY_NIGHT"]),

    additionalDetails: z.string().optional(),
    informPreviousPlayers: z.boolean(),
  })
  .refine(
    (values) =>
      !values.startDate ||
      !values.endDate ||
      new Date(values.endDate) >= new Date(values.startDate),
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    },
  );

export type TournamentFormValues = z.infer<typeof schema>;

const CATEGORY_OPTIONS = [
  "OPEN",
  "CORPORATE",
  "COMMUNITY",
  "SCHOOL",
  "OTHER",
  "SERIES",
  "COLLEGE",
  "UNIVERSITY",
] as const;

const BALL_TYPES = [
  { value: "TENNIS", label: "Tennis", colorClass: "bg-lime-500" },
  { value: "LEATHER", label: "Leather", colorClass: "bg-red-500" },
  { value: "OTHER", label: "Other", colorClass: "bg-amber-500" },
] as const;

const PITCH_TYPES = [
  "ROUGH",
  "CEMENT",
  "TURF",
  "ASTROTURF",
  "MATTING",
] as const;

const MATCH_TYPES = [
  { value: "LIMITED_OVERS", label: "Limited Overs" },
  { value: "BOX_TURF", label: "Box/Turf Cricket" },
  { value: "PAIR_CRICKET", label: "Pair Cricket" },
  { value: "TEST", label: "Test Match" },
  { value: "THE_HUNDRED", label: "The Hundred" },
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-(--color-live)">
      <AlertCircle size={11} />
      {message}
    </p>
  );
}

function FormInput({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-[12px] font-medium text-(--color-text-secondary)">
        {label} {required && <span className="text-(--color-live)">*</span>}
      </p>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function inputClassName() {
  return cn(
    "w-full border-b border-(--color-bg-border) bg-transparent pb-1.5",
    "text-sm font-medium text-(--color-text-primary)",
    "outline-none transition-colors placeholder:text-(--color-text-muted)",
    "focus:border-(--color-brand)",
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 font-(family-name:--font-display)",
        "text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95",
        active
          ? "bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.25)]"
          : "bg-(--color-bg-base) text-(--color-text-secondary)",
      )}
    >
      {children}
    </button>
  );
}

function CheckboxField({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-left"
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded border text-xs font-black",
          checked
            ? "border-(--color-brand) bg-(--color-brand) text-white"
            : "border-(--color-bg-border) bg-white",
        )}
      >
        {checked ? "✓" : ""}
      </span>

      <span className="text-sm font-medium text-(--color-text-body)">
        {label}
      </span>
    </button>
  );
}

function toDateInputValue(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function tournamentToFormValues(tournament?: Tournament): TournamentFormValues {
  if (!tournament) {
    return EMPTY_FORM_VALUES;
  }

  return {
    ...EMPTY_FORM_VALUES,

    name: tournament.name ?? "",
    shortName: tournament.shortName ?? "",
    description: tournament.description ?? "",

    city: tournament.location?.city ?? "",
    groundName: tournament.location?.groundName ?? "",
    locationLabel: tournament.location?.locationLabel ?? "",

    startDate: toDateInputValue(tournament.startDate),
    endDate: toDateInputValue(tournament.endDate),

    visibility: tournament.visibility ?? "PUBLIC",
    format: tournament.format ?? "LEAGUE",
    category: tournament.category ?? "OPEN",
    ballType: tournament.ballType ?? "TENNIS",
  };
}

type TournamentFormMode = "CREATE" | "EDIT";

type CreateTournamentFormProps = {
  mode?: TournamentFormMode;
  tournamentId?: string;
  tournament?: Tournament;
};

export default function TournamentForm({
  mode = "CREATE",
  tournamentId,
  tournament,
}: CreateTournamentFormProps) {
  const router = useRouter();

  const isEditMode = mode === "EDIT";

  const [createTournament, { isLoading: isCreating }] =
    useCreateTournamentMutation();

  const [updateTournament, { isLoading: isUpdating }] =
    useUpdateTournamentMutation();

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const isSubmitting = isCreating || isUpdating || isUploading;

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TournamentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: tournamentToFormValues(tournament),
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError("");

    try {
      let logoUrl = tournament?.logoUrl ?? undefined;
      let coverImageUrl = tournament?.coverImageUrl ?? undefined;

      if (logoFile) {
        const uploadLogoResponse = await uploadFile({
          purpose: "TEAM_LOGO",
          file: logoFile,
        }).unwrap();

        logoUrl = uploadLogoResponse.file.key;
      }

      if (bannerFile) {
        const uploadBannerResponse = await uploadFile({
          purpose: "TOURNAMENT_BANNER",
          file: bannerFile,
        }).unwrap();

        coverImageUrl = uploadBannerResponse.file.key;
      }

      const body = {
        name: values.name.trim(),
        shortName: values.shortName?.trim() || undefined,
        description: values.description?.trim() || undefined,

        logoUrl,
        coverImageUrl,

        visibility: values.visibility,
        format: values.format,
        category: values.category,
        ballType: values.ballType,

        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,

        location: {
          city: values.city.trim(),
          groundName: values.groundName?.trim() || undefined,
          locationLabel: values.locationLabel?.trim() || undefined,
        },
      };

      if (isEditMode) {
        if (!tournamentId) {
          setSubmitError("Tournament ID is missing.");
          return;
        }

        await updateTournament({
          tournamentId,
          body,
        }).unwrap();

        router.push(`/tournaments/${tournamentId}`);
        return;
      }

      const createdTournament = await createTournament(body).unwrap();

      router.push(`/tournaments/${createdTournament.id}`);
    } catch (error) {
      console.error(error);

      const message =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
          ? String(error.data.message)
          : isEditMode
            ? "Failed to update tournament. Please try again."
            : "Failed to create tournament. Please try again.";

      setSubmitError(message);
    }
  });

  useEffect(() => {
    if (!isEditMode || !tournament) return;

    reset(tournamentToFormValues(tournament));
  }, [isEditMode, tournament, reset]);

  return (
    <div className="relative flex min-h-full flex-col bg-(--color-bg-base)">
      <form onSubmit={onSubmit} className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto pb-24">
          <section className="bg-(--color-bg-card)">
            <div className="relative">
              {/* <ImageUploader layout="banner" onFileSelect={setBannerFile} /> */}
              <ImageUploader
                layout="banner"
                initialImage={
                  isEditMode
                    ? (tournament?.coverImageUrl ?? undefined)
                    : undefined
                }
                onFileSelect={setBannerFile}
              />

              <div className="absolute -bottom-11 left-4 z-20">
                {/* <ImageUploader layout="logo" onFileSelect={setLogoFile} /> */}
                <ImageUploader
                  layout="logo"
                  initialImage={
                    isEditMode ? (tournament?.logoUrl ?? undefined) : undefined
                  }
                  onFileSelect={setLogoFile}
                />
              </div>
            </div>

            <div className="ml-6 h-14 px-4 pt-12">
              <p className="text-xs font-semibold text-(--color-text-secondary)">
                Add logo
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-3 p-4">
            <section className="rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
              <div className="space-y-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      label="Tournament / Series name"
                      required
                      error={errors.name?.message}
                    >
                      <input
                        {...field}
                        placeholder="Yuva Premier League"
                        className={inputClassName()}
                      />
                    </FormInput>
                  )}
                />

                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      label="City"
                      required
                      error={errors.city?.message}
                    >
                      <input
                        {...field}
                        placeholder="Mumbai"
                        className={inputClassName()}
                      />
                    </FormInput>
                  )}
                />

                <Controller
                  name="groundName"
                  control={control}
                  render={({ field }) => (
                    <FormInput label="Ground">
                      <input
                        {...field}
                        placeholder="Borivali, JB Turf Borivali"
                        className={inputClassName()}
                      />
                    </FormInput>
                  )}
                />

                {/* <Controller
                  name="organiserName"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      label="Organiser name"
                      required
                      error={errors.organiserName?.message}
                    >
                      <input
                        {...field}
                        placeholder="Organiser name"
                        className={inputClassName()}
                      />
                    </FormInput>
                  )}
                /> */}

                {/* <Controller
                  name="organiserNumber"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      label="Organiser number"
                      required
                      error={errors.organiserNumber?.message}
                    >
                      <input
                        {...field}
                        placeholder="9999999999"
                        className={inputClassName()}
                      />
                    </FormInput>
                  )}
                /> */}

                {/* <Controller
                  name="organiserEmail"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      label="Organiser email"
                      error={errors.organiserEmail?.message}
                    >
                      <input
                        {...field}
                        placeholder="organiser@yuvacrix.in"
                        className={inputClassName()}
                      />
                    </FormInput>
                  )}
                /> */}
              </div>
            </section>

            <section className="rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
              <p className="mb-3 text-sm font-bold text-(--color-text-primary)">
                Tournament dates
              </p>

              <div className="flex gap-4">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      label="Start date"
                      required
                      error={errors.startDate?.message}
                    >
                      <input
                        {...field}
                        type="date"
                        className={inputClassName()}
                      />
                    </FormInput>
                  )}
                />

                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      label="End date"
                      required
                      error={errors.endDate?.message}
                    >
                      <input
                        {...field}
                        type="date"
                        className={inputClassName()}
                      />
                    </FormInput>
                  )}
                />
              </div>
            </section>

            <section className="rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <>
                    <p className="text-section-label mb-3">
                      Tournament category{" "}
                      <span className="text-(--color-live)">*</span>
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_OPTIONS.map((item) => (
                        <Chip
                          key={item}
                          active={field.value === item}
                          onClick={() => field.onChange(item)}
                        >
                          {item}
                        </Chip>
                      ))}
                    </div>
                  </>
                )}
              />
            </section>

            <section className="rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
              <Controller
                name="ballType"
                control={control}
                render={({ field }) => (
                  <>
                    <p className="text-section-label mb-3">
                      Select ball type{" "}
                      <span className="text-(--color-live)">*</span>
                    </p>

                    <div className="flex gap-8">
                      {BALL_TYPES.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => field.onChange(item.value)}
                          className="flex flex-col items-center gap-2"
                        >
                          <span
                            className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-md",
                              item.colorClass,
                              field.value === item.value &&
                                "ring-2 ring-(--color-brand) ring-offset-2",
                            )}
                          >
                            {field.value === item.value && (
                              <span className="text-lg font-black text-white">
                                ✓
                              </span>
                            )}
                          </span>

                          <span className="text-xs font-semibold text-(--color-text-body)">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              />
            </section>

            <section className="rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
              <Controller
                name="pitchType"
                control={control}
                render={({ field }) => (
                  <>
                    <p className="text-section-label mb-3">Pitch type</p>

                    <div className="flex flex-wrap gap-2">
                      {PITCH_TYPES.map((item) => (
                        <Chip
                          key={item}
                          active={field.value === item}
                          onClick={() => field.onChange(item)}
                        >
                          {item}
                        </Chip>
                      ))}
                    </div>
                  </>
                )}
              />
            </section>

            <section className="rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
              <Controller
                name="matchType"
                control={control}
                render={({ field }) => (
                  <>
                    <p className="text-section-label mb-3">
                      Match type <span className="text-(--color-live)">*</span>
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {MATCH_TYPES.map((item) => (
                        <Chip
                          key={item.value}
                          active={field.value === item.value}
                          onClick={() => field.onChange(item.value)}
                        >
                          {item.label}
                        </Chip>
                      ))}
                    </div>
                  </>
                )}
              />
            </section>

            <section className="space-y-4 rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
              <Controller
                name="enableLastBatterRule"
                control={control}
                render={({ field }) => (
                  <CheckboxField
                    checked={field.value}
                    onChange={field.onChange}
                    label="Enable last batter batting rule"
                  />
                )}
              />

              <Controller
                name="needMoreTeams"
                control={control}
                render={({ field }) => (
                  <CheckboxField
                    checked={field.value}
                    onChange={field.onChange}
                    label="Do you need more teams for your tournament?"
                  />
                )}
              />

              <Controller
                name="needOfficials"
                control={control}
                render={({ field }) => (
                  <CheckboxField
                    checked={field.value}
                    onChange={field.onChange}
                    label="Do you need officials? (e.g. Umpire, Scorer)"
                  />
                )}
              />
            </section>

            {/* <section className="rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
              <p className="mb-1 text-base font-bold text-(--color-text-primary)">
                Team details
              </p>

              <p className="mb-5 text-xs text-(--color-text-muted)">
                Because you need teams for your tournament
              </p>

              <div className="space-y-5">
                <Controller
                  name="locationLabel"
                  control={control}
                  render={({ field }) => (
                    <FormInput label="Tournament location" required>
                      <input
                        {...field}
                        placeholder="Mumbai"
                        className={inputClassName()}
                      />
                    </FormInput>
                  )}
                />

                <div className="flex gap-4">
                  <Controller
                    name="entryFee"
                    control={control}
                    render={({ field }) => (
                      <FormInput label="Entry fee" required>
                        <input
                          {...field}
                          placeholder="₹"
                          className={inputClassName()}
                        />
                      </FormInput>
                    )}
                  />

                  <Controller
                    name="totalTeams"
                    control={control}
                    render={({ field }) => (
                      <FormInput label="Total no. of teams" required>
                        <input
                          {...field}
                          type="number"
                          placeholder="8"
                          className={inputClassName()}
                        />
                      </FormInput>
                    )}
                  />
                </div>

                <Controller
                  name="requiredTeams"
                  control={control}
                  render={({ field }) => (
                    <FormInput label="How many teams do you require?">
                      <input
                        {...field}
                        type="number"
                        placeholder="4"
                        className={inputClassName()}
                      />
                    </FormInput>
                  )}
                />

                <Controller
                  name="winningPrize"
                  control={control}
                  render={({ field }) => (
                    <>
                      <p className="text-section-label mb-3">
                        Winning prize{" "}
                        <span className="text-(--color-live)">*</span>
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {["CASH", "TROPHIES", "BOTH"].map((item) => (
                          <Chip
                            key={item}
                            active={field.value === item}
                            onClick={() => field.onChange(item)}
                          >
                            {item}
                          </Chip>
                        ))}
                      </div>
                    </>
                  )}
                />

                <Controller
                  name="matchesOn"
                  control={control}
                  render={({ field }) => (
                    <>
                      <p className="text-section-label mb-3">
                        Matches on{" "}
                        <span className="text-(--color-live)">*</span>
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {["WEEKENDS", "WEEKDAYS", "ALL_DAYS"].map((item) => (
                          <Chip
                            key={item}
                            active={field.value === item}
                            onClick={() => field.onChange(item)}
                          >
                            {item.replace("_", " ")}
                          </Chip>
                        ))}
                      </div>
                    </>
                  )}
                />

                <Controller
                  name="matchTiming"
                  control={control}
                  render={({ field }) => (
                    <>
                      <p className="text-section-label mb-3">
                        Match timing{" "}
                        <span className="text-(--color-live)">*</span>
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {["DAY", "NIGHT", "DAY_NIGHT"].map((item) => (
                          <Chip
                            key={item}
                            active={field.value === item}
                            onClick={() => field.onChange(item)}
                          >
                            {item.replace("_", " & ")}
                          </Chip>
                        ))}
                      </div>
                    </>
                  )}
                />

                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <>
                      <p className="text-section-label mb-3">
                        Tournament format{" "}
                        <span className="text-(--color-live)">*</span>
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {["LEAGUE", "KNOCKOUT", "GROUP_STAGE", "CUSTOM"].map(
                          (item) => (
                            <Chip
                              key={item}
                              active={field.value === item}
                              onClick={() => field.onChange(item)}
                            >
                              {item.replace("_", " ")}
                            </Chip>
                          ),
                        )}
                      </div>
                    </>
                  )}
                />

                <Controller
                  name="additionalDetails"
                  control={control}
                  render={({ field }) => (
                    <FormInput label="Any additional details?">
                      <textarea
                        {...field}
                        rows={5}
                        placeholder="Add more details like prizes, trophies, entry fees, rules, etc."
                        className="w-full rounded-md border border-(--color-bg-border) bg-transparent p-3 text-sm font-medium outline-none focus:border-(--color-brand)"
                      />
                    </FormInput>
                  )}
                />

                <Controller
                  name="informPreviousPlayers"
                  control={control}
                  render={({ field }) => (
                    <CheckboxField
                      checked={field.value}
                      onChange={field.onChange}
                      label="Inform all the players of my previous tournaments."
                    />
                  )}
                />
              </div>
            </section> */}

            {submitError && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
                <AlertCircle size={16} className="mt-0.5 text-(--color-live)" />

                <p className="text-sm font-medium text-(--color-live)">
                  {submitError}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="safe-bottom sticky bottom-0 z-40 flex border-t border-(--color-bg-border) bg-(--color-bg-card) p-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center gap-1.5 bg-(--color-brand) py-4 font-(family-name:--font-display) text-xs font-black uppercase tracking-[0.06em] text-white disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                {isEditMode ? "Save Changes" : "Continue"}{" "}
                <ChevronRight size={14} />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
