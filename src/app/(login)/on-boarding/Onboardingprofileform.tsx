// src/app/(marketing)/on-boarding/_components/OnboardingProfileForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCreatePlayerMutation } from "@/store/api/playerApi";
import { useGetMeQuery } from "@/store/api/authApi";

// ─── Types ────────────────────────────────────────────────────────────────────

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
] as const;

type Gender = (typeof GENDER_OPTIONS)[number]["value"];

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i < current
              ? "bg-(--color-brand) w-6"
              : i === current
                ? "bg-(--color-brand) w-8"
                : "bg-(--color-bg-border) w-4",
          )}
        />
      ))}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function FormField({
  label,
  icon: Icon,
  children,
  focused,
  filled,
  required,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  focused?: boolean;
  filled?: boolean;
  required?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 bg-(--color-bg-card) px-4 py-3 transition-all duration-150",
        focused
          ? "border-(--color-sky) shadow-[0_0_0_3px_rgba(75,139,255,0.10)]"
          : filled
            ? "border-(--color-sky)/50"
            : "border-(--color-bg-border)",
      )}
    >
      <p className="text-section-label mb-1.5">
        {label}
        {required && <span className="ml-0.5 text-(--color-live)">*</span>}
      </p>
      <div className="flex items-center gap-2.5">
        <Icon
          size={16}
          className={cn(
            "shrink-0 transition-colors",
            filled ? "text-(--color-brand)" : "text-(--color-text-muted)",
          )}
        />
        {children}
      </div>
    </div>
  );
}

// ─── Gender chip ──────────────────────────────────────────────────────────────

function GenderChip({
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
      onClick={onClick}
      type="button"
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-3 transition-all duration-150 active:scale-[0.97]",
        selected
          ? "border-(--color-brand) bg-(--color-brand) shadow-[0_4px_14px_rgba(27,63,160,0.25)]"
          : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint)",
      )}
    >
      {selected && <Check size={13} className="text-white" strokeWidth={3} />}
      <span
        className={cn(
          "font-(family-name:--font-display) text-sm font-bold uppercase tracking-[0.06em]",
          selected ? "text-white" : "text-(--color-text-secondary)",
        )}
      >
        {label}
      </span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OnboardingProfileForm() {
  const router = useRouter();

  const [createPlayer, { isLoading }] = useCreatePlayerMutation();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [dob, setDob] = useState("");
  const [nameFocus, setNameFocus] = useState(false);
  const [cityFocus, setCityFocus] = useState(false);
  const [error, setError] = useState("");

  const { data: user } = useGetMeQuery();

  const isValid =
    name.trim().length >= 2 &&
    city.trim().length >= 2 &&
    gender !== null &&
    dob !== "";

  // Max DOB = today (no future dates), min = 100 years ago
  const today = new Date().toISOString().split("T")[0];
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);
  const minDateStr = minDate.toISOString().split("T")[0];

  async function handleContinue() {
    if (!isValid || isLoading) return;
    if (!user) {
      setError("User not authenticated. Please login again.");
      return;
    }
    setError("");
    try {
      await createPlayer({
        fullName: name.trim(),
        city: city.trim(),
        gender,
        dateOfBirth: dob,
        createdSource: "USER_ONBOARDING",
        createdByActorId: user.user._id,
        createdByActorType: "USER",
        userId: user.user._id,
        // claimMobile: user.user.mobile,
      }).unwrap();
      router.push("/on-boarding/profile-picture");
    } catch {
      setError("Failed to save profile. Please try again.");
    }
  }

  return (
    <>
      {/* ── Dark hero header ─────────────────────────────────────────────── */}
      <div
        className="relative shrink-0 overflow-hidden bg-(--color-navy) px-6 pb-8 pt-14"
        style={{ minHeight: "200px" }}
      >
        {/* Backdrop glow */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #4b8bff 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #1b3fa0 0%, transparent 70%)",
          }}
        />

        {/* Step indicator */}
        <StepDots current={0} total={2} />

        <h1
          className="mt-4 font-(family-name:--font-display) text-3xl font-black uppercase text-white"
          style={{ letterSpacing: "0.03em", lineHeight: 1.05 }}
        >
          Your Profile
        </h1>
        <p className="mt-1.5 text-sm font-medium text-white/60">
          Tell us about yourself to get started
        </p>
      </div>

      {/* ── White card body ───────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-1 flex-col overflow-hidden rounded-t-[28px] bg-(--color-bg-base)"
        style={{ marginTop: "-20px" }}
      >
        <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-6 pb-4">
          <div className="flex flex-col gap-3.5">
            {/* Full Name */}
            <FormField
              label="Full Name"
              icon={User}
              focused={nameFocus}
              filled={name.length >= 2}
              required
            >
              <input
                type="text"
                autoComplete="name"
                placeholder="e.g. Virat Kohli"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setNameFocus(true)}
                onBlur={() => setNameFocus(false)}
                className="flex-1 bg-transparent text-base font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
              />
            </FormField>

            {/* City */}
            <FormField
              label="City"
              icon={MapPin}
              focused={cityFocus}
              filled={city.length >= 2}
              required
            >
              <input
                type="text"
                autoComplete="address-level2"
                placeholder="e.g. Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onFocus={() => setCityFocus(true)}
                onBlur={() => setCityFocus(false)}
                className="flex-1 bg-transparent text-base font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
              />
            </FormField>

            {/* Gender */}
            <div className="rounded-2xl border-2 bg-(--color-bg-card) px-4 py-3 transition-all duration-150 border-(--color-bg-border)">
              <p className="text-section-label mb-2.5">
                Gender<span className="ml-0.5 text-(--color-live)">*</span>
              </p>
              {/* <div className="flex gap-2">
                {(["Male", "Female", "Other"] as Gender[]).map((g) => (
                  <GenderChip
                    key={g}
                    value={g}
                    selected={gender === g}
                    onClick={() => setGender(g)}
                  />
                ))}
              </div> */}
              <div className="flex gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <GenderChip
                    key={g.value}
                    label={g.label}
                    selected={gender === g.value}
                    onClick={() => setGender(g.value)}
                  />
                ))}
              </div>
            </div>

            {/* Date of Birth */}
            <div
              className={cn(
                "rounded-2xl border-2 bg-(--color-bg-card) px-4 py-3 transition-all duration-150",
                dob ? "border-(--color-sky)/50" : "border-(--color-bg-border)",
              )}
            >
              <p className="text-section-label mb-1.5">
                Date of Birth
                <span className="ml-0.5 text-(--color-live)">*</span>
              </p>
              <input
                type="date"
                value={dob}
                min={minDateStr}
                max={today}
                onChange={(e) => setDob(e.target.value)}
                className={cn(
                  "w-full bg-transparent text-base font-medium outline-none",
                  "text-(--color-text-primary)",
                  // Fix native date picker color on empty state
                  !dob && "text-(--color-text-muted)",
                )}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-3 text-sm font-medium text-(--color-live)">
              {error}
            </p>
          )}

          <div className="flex-1 min-h-4" />
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <div className="safe-bottom shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-5 py-3">
          <button
            onClick={handleContinue}
            disabled={!isValid || isLoading}
            className={cn(
              "flex h-14 w-full items-center justify-center gap-2 rounded-2xl",
              "font-(family-name:--font-display) text-lg font-black uppercase tracking-[0.06em] text-white",
              "transition-all duration-200 active:scale-[0.97]",
              isValid && !isLoading
                ? "bg-(--color-brand) shadow-(--shadow-button)"
                : "cursor-not-allowed bg-(--color-bg-border) text-(--color-text-muted)",
            )}
          >
            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                Continue
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
