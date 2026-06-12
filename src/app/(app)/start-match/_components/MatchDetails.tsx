import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  User,
  ClipboardList,
  Video,
  Users2,
  ChevronRight,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Team } from "@/types/team";
import Image from "next/image";
import {
  selectTeamACaptain,
  selectTeamAKeeper,
  selectTeamBCaptain,
  selectTeamBKeeper,
} from "@/store/startMatch/selectors";
import { useAppSelector } from "@/store/hooks";
import { useGetTeamDetailQuery } from "@/store/api/teamApi";
import {
  useCreateMatchMutation,
  useSubmitTeamLineupMutation,
} from "@/store/api/matchApi";
import type { MatchType, BallType, PitchType } from "@/types/match";
import { LineupModeSheet } from "./LineupModeSheet";
import ScheduleModal from "./ScheduleModal";

// ─── Zod schema ───────────────────────────────────────────────────────────────

const schema = z.object({
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
    .min(1, "Min 1 over")
    .max(200, "Max 200 overs"),
  oversPerBowler: z
    .number({ error: "Required" })
    .int()
    .min(1, "Min 1")
    .max(50, "Max 50"),
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
  wagonWheel: z.boolean(),
  scheduledAt: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type LineupMode = "FLEXIBLE" | "FIXED";

// ─── Constants ────────────────────────────────────────────────────────────────

const MATCH_TYPES: { value: MatchType; label: string }[] = [
  { value: "LIMITED_OVERS", label: "Limited Overs" },
  { value: "BOX_TURF", label: "Box/Turf Cricket" },
  { value: "PAIR_CRICKET", label: "Pair Cricket" },
  { value: "TEST", label: "Test Match" },
  { value: "THE_HUNDRED", label: "The Hundred" },
];

const BALL_TYPES: {
  value: BallType;
  label: string;
  color: string;
  dot?: boolean;
}[] = [
  { value: "TENNIS", label: "Tennis", color: "#84cc16" },
  { value: "LEATHER", label: "Leather", color: "#ef4444" },
  { value: "OTHER", label: "Other", color: "#f59e0b", dot: true },
];

const PITCH_TYPES: PitchType[] = [
  "ROUGH",
  "CEMENT",
  "TURF",
  "ASTROTURF",
  "MATTING",
  "OTHER",
];

// ─── Sub-components (hero banner) ─────────────────────────────────────────────

function OfficialRow({
  label,
  name,
}: {
  label: "C" | "WK";
  name: string | undefined;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-1">
      <span className="w-5 shrink-0 font-(family-name:--font-display) text-[9px] font-black uppercase tracking-widest text-(--color-sky)">
        {label}
      </span>
      <span
        className={cn(
          "flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-medium",
          name ? "text-white/65" : "italic text-white/25",
        )}
      >
        {name ?? "Not set"}
      </span>
    </div>
  );
}

function TeamColumn({
  detail,
  captainName,
  keeperName,
  onClick,
}: {
  detail: { name?: string; logoUrl?: string; memberCount?: number } | undefined;
  captainName: string | undefined;
  keeperName: string | undefined;
  onClick: () => void;
}) {
  return (
    <div
      className="flex flex-1 cursor-pointer flex-col items-center gap-1.5"
      onClick={onClick}
    >
      <div className="relative mb-0.5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4b5563] shadow-[0_4px_16px_rgba(0,0,0,0.30)]">
          {detail?.logoUrl ? (
            <Image
              src={detail.logoUrl}
              alt={detail.name ?? ""}
              height={40}
              width={40}
              className="rounded-full object-cover"
            />
          ) : (
            <span
              className="font-(family-name:--font-display) text-lg font-black text-white"
              style={{ letterSpacing: "0.02em" }}
            >
              {detail?.name?.slice(0, 1).toUpperCase() ?? "?"}
            </span>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-sky) ring-2 ring-(--color-navy)">
          <User size={10} className="text-white" />
        </div>
      </div>
      <p
        className="font-(family-name:--font-display) text-xs font-black uppercase text-white text-center"
        style={{ letterSpacing: "0.04em", maxWidth: 96 }}
      >
        {detail?.name ?? "—"}
      </p>
      <span className="inline-block rounded-full bg-(--color-brand) px-2.5 py-0.5 font-(family-name:--font-display) text-[9px] font-bold uppercase tracking-widest text-white">
        Squad ({detail?.memberCount ?? 0})
      </span>
      <div className="mt-0.5 flex w-full flex-col gap-1">
        <OfficialRow label="C" name={captainName} />
        <OfficialRow label="WK" name={keeperName} />
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-(--color-live)">
      <AlertCircle size={11} className="shrink-0" /> {message}
    </p>
  );
}

// ─── Schedule bottom sheet ────────────────────────────────────────────────────

// ─── Lineup Mode bottom sheet ─────────────────────────────────────────────────
// Shown after createMatch() succeeds when user taps "Next (Toss)".
// FLEXIBLE → submitTeamLineup for both teams → navigate to /start-match/toss
// FIXED    → navigate to /start-match/fixed-lineup?matchId=<id> (future screen)

// ─── Main Component ───────────────────────────────────────────────────────────

const MatchDetails = ({ teamA, teamB }: { teamA: Team; teamB: Team }) => {
  const router = useRouter();
  const [createMatch, { isLoading: isCreating }] = useCreateMatchMutation();
  const [submitTeamLineup, { isLoading: isSubmittingLineup }] =
    useSubmitTeamLineupMutation();

  const { data: teamADetail } = useGetTeamDetailQuery({ teamId: teamA.id });
  const { data: teamBDetail } = useGetTeamDetailQuery({ teamId: teamB.id });

  const teamACaptain = useAppSelector(selectTeamACaptain);
  const teamAKeeper = useAppSelector(selectTeamAKeeper);
  const teamBCaptain = useAppSelector(selectTeamBCaptain);
  const teamBKeeper = useAppSelector(selectTeamBKeeper);

  // ── Local UI state ────────────────────────────────────────────────────────
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Lineup sheet state — populated after createMatch() succeeds
  const [lineupSheetOpen, setLineupSheetOpen] = useState(false);
  const [lineupError, setLineupError] = useState("");
  const [createdMatch, setCreatedMatch] = useState<{
    id: string;
    teamAId: string;
    teamBId: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      matchType: "LIMITED_OVERS",
      oversLimit: 20,
      oversPerBowler: 4,
      ballType: "TENNIS",
      city: "",
      groundName: "",
      pitchType: "CEMENT",
      wagonWheel: true,
      scheduledAt: undefined,
    },
  });

  // ── Build payload ─────────────────────────────────────────────────────────

  function buildPayload(values: FormValues, withSchedule?: string) {
    return {
      teamAId: teamA.id,
      teamBId: teamB.id,
      matchType: values.matchType,
      oversLimit: values.oversLimit,
      oversPerBowler: values.oversPerBowler,
      ballType: values.ballType,
      venue: {
        city: values.city.trim(),
        groundName: values.groundName.trim(),
        pitchType: values.pitchType,
      },
      ...(withSchedule && {
        scheduledAt: new Date(withSchedule).toISOString(),
      }),
      scoringSettings: {
        wagonWheelEnabled: values.wagonWheel,
        wagonWheelForRuns: values.wagonWheel ? [1, 2, 3] : [],
      },
    };
  }

  // ── SCHEDULE MATCH flow ───────────────────────────────────────────────────
  // Validates form → opens date-time picker → createMatch with scheduledAt → /dashboard

  const onSchedule = handleSubmit(async (values) => {
    if (!scheduledAt) return;
    setSubmitError("");
    try {
      await createMatch(buildPayload(values, scheduledAt)).unwrap();
      setScheduleOpen(false);
      router.push("/dashboard");
    } catch (err: any) {
      setSubmitError(
        err?.data?.message ?? "Failed to schedule match. Please try again.",
      );
    }
  });

  // ── NEXT (TOSS) flow — Step 1: createMatch ────────────────────────────────
  // Validates form → createMatch (no scheduledAt) → stores matchId → opens lineup sheet.
  // Does NOT navigate — that happens inside handleLineupContinue.

  const onToss = handleSubmit(async () => {
    setSubmitError("");
    setLineupError("");

    // Just open the lineup mode sheet
    setLineupSheetOpen(true);
  });

  // ── NEXT (TOSS) flow — Step 2: lineup mode chosen ────────────────────────

  async function handleLineupContinue(mode: LineupMode) {
    setLineupError("");

    try {
      const values = getValues();

      const match = await createMatch({
        ...buildPayload(values),
        lineupMode: mode,
      }).unwrap();

      const matchId = match.match.id;

      setLineupSheetOpen(false);

      router.push(`/start-match/line-up?matchId=${matchId}&mode=${mode}`);
    } catch (err: any) {
      setLineupError(
        err?.data?.message ?? "Failed to create match. Please try again.",
      );
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="relative flex min-h-full flex-col bg-(--color-bg-base)">
      {/* Team hero banner */}
      <div className="relative bg-(--color-navy) px-5 py-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, white 0%, transparent 70%)",
          }}
        />
        <div className="relative flex items-start justify-between gap-2">
          <TeamColumn
            detail={teamADetail}
            captainName={teamACaptain?.name}
            keeperName={teamAKeeper?.name}
            onClick={() => router.push("/start-match/select-team?team=A")}
          />
          <div
            className="mt-4 flex h-9 w-9 shrink-0 items-center justify-center bg-white shadow-[0_2px_12px_rgba(255,255,255,0.25)]"
            style={{ transform: "rotate(45deg)" }}
          >
            <span
              className="font-(family-name:--font-display) text-[9px] font-black text-(--color-navy)"
              style={{ transform: "rotate(-45deg)", letterSpacing: "0.04em" }}
            >
              VS
            </span>
          </div>
          <TeamColumn
            detail={teamBDetail}
            captainName={teamBCaptain?.name}
            keeperName={teamBKeeper?.name}
            onClick={() => router.push("/start-match/select-team?team=B")}
          />
        </div>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="flex flex-col gap-3 p-4">
          {/* Match Type */}
          <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <p className="text-section-label mb-3">
              Match Type <span className="text-(--color-live)">*</span>
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
          <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <p className="text-section-label mb-1.5">
                  No. of Overs <span className="text-(--color-live)">*</span>
                </p>
                <Controller
                  name="oversLimit"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1 text-xl font-bold text-(--color-text-primary) outline-none transition-colors focus:border-(--color-sky)"
                    />
                  )}
                />
                <FieldError message={errors.oversLimit?.message} />
              </div>
              <div className="flex-1">
                <p className="text-section-label mb-1.5">Overs Per Bowler</p>
                <div className="flex items-end justify-between border-b-2 border-(--color-bg-border) pb-1 transition-colors focus-within:border-(--color-sky)">
                  <Controller
                    name="oversPerBowler"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full bg-transparent text-xl font-bold text-(--color-text-primary) outline-none"
                      />
                    )}
                  />
                  <button
                    type="button"
                    className="flex items-center gap-0.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-(--color-brand)"
                  >
                    Power Play <ChevronRight size={11} />
                  </button>
                </div>
                <FieldError message={errors.oversPerBowler?.message} />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="fixture-bar flex flex-col gap-4 rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <div>
              <p className="text-section-label mb-1.5">
                City / Town <span className="text-(--color-live)">*</span>
              </p>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Mumbai"
                    className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1.5 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) transition-colors focus:border-(--color-sky)"
                  />
                )}
              />
              <FieldError message={errors.city?.message} />
            </div>
            <div>
              <p className="text-section-label mb-1.5">
                Ground <span className="text-(--color-live)">*</span>
              </p>
              <Controller
                name="groundName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Andheri Box Cricket Arena"
                    className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1.5 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) transition-colors focus:border-(--color-sky)"
                  />
                )}
              />
              <FieldError message={errors.groundName?.message} />
            </div>
          </div>

          {/* Ball Type */}
          <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <p className="text-section-label mb-3">
              Ball Type <span className="text-(--color-live)">*</span>
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

          {/* Wagon Wheel */}
          <div className="flex items-center justify-between rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <div>
              <p
                className="font-(family-name:--font-display) text-sm font-black uppercase text-(--color-text-primary)"
                style={{ letterSpacing: "0.04em" }}
              >
                Wagon Wheel
              </p>
              <p className="text-meta mt-0.5">
                Show Wagon Wheel for 1s, 2s, &amp; 3s
              </p>
            </div>
            <Controller
              name="wagonWheel"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    "flex h-7 w-12 items-center rounded-full p-1 transition-all duration-200",
                    field.value
                      ? "bg-(--color-brand) justify-end"
                      : "bg-(--color-bg-border) justify-start",
                  )}
                >
                  <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
                </button>
              )}
            />
          </div>

          {/* Pitch Type */}
          <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <p className="text-section-label mb-3">Pitch Type</p>
            <Controller
              name="pitchType"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {PITCH_TYPES.map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => field.onChange(pt)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95",
                        field.value === pt
                          ? "border-(--color-brand) bg-(--color-brand) text-white"
                          : "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary) hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint)",
                      )}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Match Officials */}
          <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <p className="text-section-label mb-4">Match Officials</p>
            <div className="flex items-center justify-around">
              {[
                { icon: User, label: "Umpires" },
                { icon: ClipboardList, label: "Scorers" },
                { icon: Video, label: "Streamer" },
                { icon: Users2, label: "Others" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="flex flex-col items-center gap-2 transition-transform active:scale-90"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-(--color-bg-border) bg-(--color-bg-base) transition-colors hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint)">
                    <Icon size={20} className="text-(--color-text-secondary)" />
                  </div>
                  <span className="text-section-label">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit error */}
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
      <div className="safe-bottom sticky bottom-0 flex shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card)">
        <button
          type="button"
          onClick={() => {
            setSubmitError("");
            setScheduleOpen(true);
          }}
          disabled={isCreating}
          className="flex flex-1 items-center justify-center gap-1.5 py-4 font-(family-name:--font-display) text-xs font-black uppercase tracking-[0.06em] text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) disabled:opacity-50"
        >
          {isCreating ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--color-text-muted)/30 border-t-(--color-text-muted)" />
          ) : (
            <Calendar size={13} />
          )}
          Schedule Match
        </button>

        <div className="h-8 w-px self-center bg-(--color-bg-border)" />

        <button
          type="button"
          onClick={onToss}
          disabled={isCreating}
          className="flex flex-1 items-center justify-center gap-1.5 bg-(--color-brand) py-4 font-(family-name:--font-display) text-xs font-black uppercase tracking-[0.06em] text-white shadow-[0_-2px_12px_rgba(27,63,160,0.20)] transition-all active:scale-[0.97] disabled:opacity-60"
        >
          {isCreating ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              Next (Toss) <ChevronRight size={14} />
            </>
          )}
        </button>
      </div>

      {/* Schedule bottom sheet */}
      <ScheduleModal
        open={scheduleOpen}
        value={scheduledAt}
        onChange={setScheduledAt}
        onConfirm={onSchedule}
        onClose={() => setScheduleOpen(false)}
        loading={isCreating}
        error={submitError}
      />

      {/* Lineup Mode bottom sheet — opens after createMatch() succeeds */}
      <LineupModeSheet
        open={lineupSheetOpen}
        onClose={() => {
          setLineupSheetOpen(false);
          setLineupError("");
        }}
        onContinue={handleLineupContinue}
        loading={isSubmittingLineup}
        error={lineupError}
      />
    </div>
  );
};

export default MatchDetails;
