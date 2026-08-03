"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronRight,
  LogOut,
  MapPin,
  Pencil,
  Trash2,
  User,
  X,
} from "lucide-react";

import { S3Image } from "@/components/common/S3Image";
import { ImageUploader } from "@/components/common/ImageUploaderV1";
import { cn } from "@/lib/cn";
import {
  useGetPlayerQuery,
  useUpdatePlayerMutation,
} from "@/store/api/playerApi";
import { useLogoutMutation } from "@/store/api/authApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { logout } from "@/store/auth/authSlice";
import { selectUser } from "@/store/auth/authSelectors";
import { useAppSelector } from "@/store/hooks";
import type {
  BattingStyle,
  BowlingStyle,
  Player,
  PlayerRole,
} from "@/types/player";
import { Button } from "@/components/common/Button";

// ─── Types ────────────────────────────────────────────────────────────────────

type Gender = NonNullable<Player["gender"]>;

type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

type SelectDropdownProps<T extends string> = {
  label: string;
  options: readonly SelectOption<T>[];
  value: T | "";
  onChange: (value: T | "") => void;
};

type ChipSelectProps<T extends string> = {
  label: string;
  options: readonly SelectOption<T>[];
  value: T | "";
  onChange: (value: T | "") => void;
};

type EditForm = {
  fullName: string;
  city: string;
  gender: Gender | "";
  dateOfBirth: string;
  playerRole: PlayerRole | "";
  battingStyle: BattingStyle | "";
  bowlingStyle: BowlingStyle | "";
  profileImageFile: File | null;
};

// ─── Options ──────────────────────────────────────────────────────────────────

const GENDER_OPTIONS = [
  {
    value: "MALE",
    label: "Male",
  },
  {
    value: "FEMALE",
    label: "Female",
  },
  {
    value: "OTHER",
    label: "Other",
  },
] satisfies readonly SelectOption<Gender>[];

const PLAYER_ROLE_OPTIONS = [
  {
    value: "BATTER",
    label: "Batter",
  },
  {
    value: "BOWLER",
    label: "Bowler",
  },
  {
    value: "ALL_ROUNDER",
    label: "All-rounder",
  },
  {
    value: "WICKET_KEEPER",
    label: "Wicket Keeper",
  },
] satisfies readonly SelectOption<PlayerRole>[];

const BATTING_STYLE_OPTIONS = [
  {
    value: "RIGHT_HAND_BAT",
    label: "Right Hand Bat",
  },
  {
    value: "LEFT_HAND_BAT",
    label: "Left Hand Bat",
  },
] satisfies readonly SelectOption<BattingStyle>[];

const BOWLING_STYLE_OPTIONS = [
  {
    value: "RIGHT_ARM_FAST",
    label: "Right Arm Fast",
  },
  {
    value: "RIGHT_ARM_FAST_MEDIUM",
    label: "Right Arm Fast Medium",
  },
  {
    value: "RIGHT_ARM_MEDIUM",
    label: "Right Arm Medium",
  },
  {
    value: "RIGHT_ARM_OFF_BREAK",
    label: "Right Arm Off Break",
  },
  {
    value: "RIGHT_ARM_LEG_BREAK",
    label: "Right Arm Leg Break",
  },
  {
    value: "LEFT_ARM_FAST",
    label: "Left Arm Fast",
  },
  {
    value: "LEFT_ARM_FAST_MEDIUM",
    label: "Left Arm Fast Medium",
  },
  {
    value: "LEFT_ARM_ORTHODOX",
    label: "Left Arm Orthodox",
  },
  {
    value: "LEFT_ARM_WRIST_SPIN",
    label: "Left Arm Wrist Spin",
  },
] satisfies readonly SelectOption<BowlingStyle>[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso?: string | null): string {
  if (!iso) {
    return "—";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDateInputValue(iso?: string | null): string {
  if (!iso) {
    return "";
  }

  return iso.split("T")[0] ?? "";
}

function getInitials(name?: string | null): string {
  if (!name?.trim()) {
    return "P";
  }

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getProfileCompletion(
  player: Player,
  mobileNumber?: string | null,
): number {
  const fields = [
    player.fullName,
    player.gender,
    player.dateOfBirth,
    player.city,
    player.profileImageUrl,
    mobileNumber,
    player.playerRole,
    player.battingStyle,
    player.bowlingStyle,
  ];

  const filledFields = fields.filter(
    (field) => typeof field === "string" && field.trim().length > 0,
  ).length;

  return Math.round((filledFields / fields.length) * 100);
}

function getOptionLabel<T extends string>(
  options: readonly SelectOption<T>[],
  value?: T | null,
): string | null {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value)?.label ?? value;
}

// ─── Reusable UI ──────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
      {children}
    </span>
  );
}

function FieldValue({ children }: { children?: React.ReactNode }) {
  return (
    <span className="text-[15px] font-semibold text-(--color-navy)">
      {children || "—"}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <FieldLabel>{label}</FieldLabel>
      <FieldValue>{value}</FieldValue>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border-2 border-(--color-bg-border)",
          "bg-(--color-bg-base) px-3.5 py-2.5",
          "text-[14px] font-medium text-(--color-navy)",
          "outline-none transition-all",
          "placeholder:text-(--color-text-muted)",
          "focus:border-(--color-brand)",
          "focus:shadow-[0_0_0_3px_rgba(27,63,160,0.10)]",
        )}
      />
    </div>
  );
}

function ChipSelect<T extends string>({
  label,
  options,
  value,
  onChange,
}: ChipSelectProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? "" : option.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5",
                "text-[12px] font-semibold transition-all",
                "active:scale-95",
                active
                  ? "border-(--color-brand) bg-(--color-brand) text-white"
                  : "border-(--color-bg-border) bg-white text-(--color-text-secondary)",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SelectDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
}: SelectDropdownProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T | "")}
        className={cn(
          "w-full rounded-xl border-2 border-(--color-bg-border)",
          "bg-(--color-bg-base) px-3.5 py-2.5",
          "text-[14px] font-medium text-(--color-navy)",
          "outline-none transition-all",
          "focus:border-(--color-brand)",
        )}
      >
        <option value="">Select…</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 rounded-full bg-(--color-bg-border)" />

          <div className="flex-1 space-y-2.5">
            <div className="h-5 w-2/3 rounded bg-(--color-bg-border)" />
            <div className="h-3.5 w-1/3 rounded bg-(--color-bg-border)" />
            <div className="h-3.5 w-1/2 rounded bg-(--color-bg-border)" />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-2.5 w-16 rounded bg-(--color-bg-border)" />
              <div className="h-4 w-24 rounded bg-(--color-bg-border)" />
            </div>

            <div className="space-y-1.5">
              <div className="h-2.5 w-16 rounded bg-(--color-bg-border)" />
              <div className="h-4 w-20 rounded bg-(--color-bg-border)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

        <div className="flex-1">
          <p className="text-[14px] font-semibold text-red-700">
            Unable to load your profile
          </p>

          <p className="mt-1 text-[12px] text-red-600">
            Please check your connection and try again.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 w-full rounded-xl bg-(--color-brand) px-4 py-3 font-display text-[12px] font-black uppercase tracking-widest text-white"
      >
        Try Again
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useAppSelector(selectUser);

  const { data, isLoading, isError, refetch } = useGetPlayerQuery();

  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [updatePlayer, { isLoading: isSaving }] = useUpdatePlayerMutation();

  const [uploadFile] = useUploadFileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editSession, setEditSession] = useState(0);

  const [form, setForm] = useState<EditForm>({
    fullName: "",
    city: "",
    gender: "",
    dateOfBirth: "",
    playerRole: "",
    battingStyle: "",
    bowlingStyle: "",
    profileImageFile: null,
  });

  const player = data?.player;

  const completion = player ? getProfileCompletion(player, user?.mobile) : 0;

  function handleEditOpen() {
    if (!player) {
      return;
    }

    setForm({
      fullName: player.fullName ?? "",
      city: player.city ?? "",
      gender: player.gender ?? "",
      dateOfBirth: getDateInputValue(player.dateOfBirth),
      playerRole: player.playerRole ?? "",
      battingStyle: player.battingStyle ?? "",
      bowlingStyle: player.bowlingStyle ?? "",
      profileImageFile: null,
    });

    setSaveError(null);
    setEditSession((current) => current + 1);
    setIsEditing(true);
  }

  function handleEditCancel() {
    setIsEditing(false);
    setSaveError(null);

    setForm((current) => ({
      ...current,
      profileImageFile: null,
    }));
  }

  async function handleSave() {
    const fullName = form.fullName.trim();

    if (!fullName) {
      setSaveError("Full name is required.");
      return;
    }

    setSaveError(null);

    try {
      let profileImageKey: string | undefined;

      if (form.profileImageFile) {
        const uploadResponse = await uploadFile({
          purpose: "PLAYER_AVATAR",
          file: form.profileImageFile,
        }).unwrap();

        profileImageKey = uploadResponse.file.key;
      }

      await updatePlayer({
        fullName,
        fullNameLower: fullName,
        city: form.city.trim() || undefined,
        gender: form.gender || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        playerRole: form.playerRole || undefined,
        battingStyle: form.battingStyle || undefined,
        bowlingStyle: form.bowlingStyle || undefined,
        ...(profileImageKey
          ? {
              profileImageUrl: profileImageKey,
            }
          : {}),
      }).unwrap();

      setIsEditing(false);
      setSaveError(null);
    } catch (error) {
      console.error("Failed to update player profile:", error);

      setSaveError("Failed to save profile. Please try again.");
    }
  }

  async function handleLogout() {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      dispatch(logout());
      router.replace("/login");
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-(--color-bg-base)">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4 pb-10">
          {isLoading && <Skeleton />}

          {!isLoading && isError && (
            <ProfileError onRetry={() => void refetch()} />
          )}

          {!isLoading && !isError && !player && (
            <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
              <AlertCircle
                size={28}
                className="mx-auto text-(--color-text-muted)"
              />

              <p className="mt-3 font-display text-[15px] font-black uppercase tracking-wide text-(--color-navy)">
                Profile not found
              </p>

              <p className="mt-1 text-[13px] text-(--color-text-secondary)">
                We could not find your player profile.
              </p>

              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 rounded-xl bg-(--color-brand) px-5 py-3 font-display text-[12px] font-black uppercase tracking-widest text-white"
              >
                Refresh
              </button>
            </div>
          )}

          {!isLoading && player && !isEditing && (
            <>
              {/* Hero card */}
              <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0">
                    {player.profileImageUrl ? (
                      <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-(--color-bg-border)">
                        <S3Image
                          imageKey={player.profileImageUrl}
                          alt={player.fullName}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                          fallback={
                            <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
                              <span className="font-display text-2xl font-black text-white">
                                {getInitials(player.fullName)}
                              </span>
                            </div>
                          }
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-(--color-bg-border) bg-(--color-navy)">
                        <span className="font-display text-2xl font-black text-white">
                          {getInitials(player.fullName)}
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      aria-label="Edit profile"
                      onClick={handleEditOpen}
                      className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-(--color-brand) shadow-[0_2px_8px_rgba(27,63,160,0.35)]"
                    >
                      <Pencil size={13} color="white" strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="truncate font-display text-[22px] font-black uppercase leading-tight tracking-wide text-(--color-navy)">
                      {player.fullName}
                    </h1>

                    {player.city && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <MapPin
                          size={13}
                          className="shrink-0 text-(--color-brand)"
                        />

                        <span className="truncate text-[13px] font-medium text-(--color-text-secondary)">
                          {player.city}
                        </span>
                      </div>
                    )}

                    <div className="mt-1 flex items-center gap-1.5">
                      <Calendar
                        size={13}
                        className="shrink-0 text-(--color-brand)"
                      />

                      <span className="text-[13px] font-medium text-(--color-text-secondary)">
                        Since {formatDate(player.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/cricket-profile")}
                  className="mt-4 flex w-full items-center justify-between rounded-xl border border-(--color-brand)/25 bg-(--color-brand)/8 px-4 py-1 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-(--color-brand)/15">
                      <User size={12} className="text-(--color-brand)" />
                    </div>

                    <span className="font-display text-[12px] font-bold uppercase tracking-wide text-(--color-brand)">
                      My Cricket Profile
                    </span>
                  </div>

                  <ChevronRight size={16} className="text-(--color-brand)" />
                </button>
              </div>

              {/* Profile details */}
              <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
                <div className="mb-4 flex items-center justify-between border-b border-(--color-bg-border) pb-3">
                  <h2 className="font-display text-[16px] font-black uppercase tracking-wide text-(--color-navy)">
                    My Profile
                  </h2>

                  <button
                    type="button"
                    onClick={handleEditOpen}
                    className="font-display text-[12px] font-black uppercase tracking-widest text-(--color-brand)"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <DetailRow
                      label="Mobile Number"
                      value={user?.mobile ?? null}
                    />

                    <DetailRow
                      label="Gender"
                      value={getOptionLabel(GENDER_OPTIONS, player.gender)}
                    />

                    <DetailRow
                      label="Playing Role"
                      value={getOptionLabel(
                        PLAYER_ROLE_OPTIONS,
                        player.playerRole,
                      )}
                    />

                    <DetailRow
                      label="Batting Style"
                      value={getOptionLabel(
                        BATTING_STYLE_OPTIONS,
                        player.battingStyle,
                      )}
                    />

                    <DetailRow
                      label="Bowling Style"
                      value={getOptionLabel(
                        BOWLING_STYLE_OPTIONS,
                        player.bowlingStyle,
                      )}
                    />

                    <DetailRow
                      label="Date of Birth"
                      value={
                        player.dateOfBirth
                          ? formatDate(player.dateOfBirth)
                          : null
                      }
                    />

                    <DetailRow label="City" value={player.city} />
                  </div>

                  <div className="h-px bg-(--color-bg-border)" />

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <FieldLabel>Profile Completion</FieldLabel>

                      <span className="font-display text-[15px] font-black text-(--color-navy)">
                        {completion}%
                      </span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-(--color-bg-border)">
                      <div
                        className="h-full rounded-full bg-(--color-brand) transition-all duration-500"
                        style={{
                          width: `${Math.min(Math.max(completion, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {completion < 100 && (
                    <Button
                      variant="secondary"
                      type="button"
                      size="sm"
                      onClick={handleEditOpen}
                    >
                      Complete Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Account actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2",
                    "rounded-2xl border-2 border-(--color-bg-border)",
                    "bg-(--color-bg-card) py-3.5",
                    "font-display text-[13px] font-black uppercase tracking-widest",
                    "text-(--color-navy) shadow-(--shadow-card)",
                    "transition-all active:scale-[0.98]",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  <LogOut size={15} strokeWidth={2.5} />

                  {isLoggingOut ? "Logging Out…" : "Logout"}
                </Button>

                <button
                  type="button"
                  disabled
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2",
                    "rounded-2xl border-2 border-(--color-bg-border)",
                    "bg-(--color-bg-card) py-3.5",
                    "font-display text-[13px] font-black uppercase tracking-widest",
                    "text-(--color-navy) shadow-(--shadow-card)",
                    "cursor-not-allowed opacity-50",
                  )}
                >
                  <Trash2 size={15} strokeWidth={2.5} />
                  Clear Data
                </button>
              </div>

              <button
                type="button"
                disabled
                className="cursor-not-allowed py-2 text-center font-display text-[13px] font-black uppercase tracking-widest text-(--color-live) opacity-50"
              >
                Delete Account
              </button>
            </>
          )}

          {!isLoading && player && isEditing && (
            <>
              {saveError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <p className="text-[13px] font-medium text-red-600">
                    {saveError}
                  </p>
                </div>
              )}

              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 shadow-(--shadow-card)">
                <ImageUploader
                  key={editSession}
                  layout="avatar"
                  initialImage={player.profileImageUrl}
                  onFileSelect={(file) =>
                    setForm((previous) => ({
                      ...previous,
                      profileImageFile: file,
                    }))
                  }
                />
              </div>

              {/* Personal information */}
              <div className="flex flex-col gap-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
                <h3 className="font-display text-[14px] font-black uppercase tracking-widest text-(--color-navy)">
                  Personal Info
                </h3>

                <FormInput
                  label="Full Name *"
                  value={form.fullName}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      fullName: value,
                    }))
                  }
                  placeholder="Your full name"
                />

                <FormInput
                  label="City"
                  value={form.city}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      city: value,
                    }))
                  }
                  placeholder="e.g. Mumbai"
                />

                <FormInput
                  label="Date of Birth"
                  value={form.dateOfBirth}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      dateOfBirth: value,
                    }))
                  }
                  type="date"
                />

                <ChipSelect<Gender>
                  label="Gender"
                  options={GENDER_OPTIONS}
                  value={form.gender}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      gender: value,
                    }))
                  }
                />
              </div>

              {/* Cricket information */}
              <div className="flex flex-col gap-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
                <h3 className="font-display text-[14px] font-black uppercase tracking-widest text-(--color-navy)">
                  Cricket Info
                </h3>

                <ChipSelect<BattingStyle>
                  label="Batting Style"
                  options={BATTING_STYLE_OPTIONS}
                  value={form.battingStyle}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      battingStyle: value,
                    }))
                  }
                />

                <SelectDropdown<BowlingStyle>
                  label="Bowling Style"
                  options={BOWLING_STYLE_OPTIONS}
                  value={form.bowlingStyle}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      bowlingStyle: value,
                    }))
                  }
                />

                <SelectDropdown<PlayerRole>
                  label="Playing Role"
                  options={PLAYER_ROLE_OPTIONS}
                  value={form.playerRole}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      playerRole: value,
                    }))
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sticky edit actions */}
      {isEditing && player && (
        <div className="safe-bottom flex shrink-0 gap-3 border-t border-(--color-bg-border) bg-(--color-bg-card) p-4">
          <Button
            variant="secondary"
            type="button"
            onClick={handleEditCancel}
            disabled={isSaving}
            loading={isSaving}
            size="sm"
            fullWidth
          >
            <X size={15} strokeWidth={2.5} />
            Cancel
          </Button>

          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving}
            loading={isSaving}
            size="sm"
            fullWidth
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving…
              </>
            ) : (
              <>
                <Check size={15} strokeWidth={2.5} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
