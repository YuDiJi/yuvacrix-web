// src/app/(marketing)/on-boarding/_components/OnboardingProfilePicture.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useUpdateProfileMutation } from "@/store/api/authApi";
import { useUpdatePlayerMutation } from "@/store/api/playerApi";
import Image from "next/image";
import { ImageUploader } from "@/components/common/ImageUploader";

// ─── Step indicator (shared style) ────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export function OnboardingProfilePicture() {
  const router = useRouter();
  const [updatePlayer, { isLoading }] = useUpdatePlayerMutation();

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  async function handleContinue(skip = false) {
    if (isLoading) return;
    setError("");
    try {
      if (!skip && file) {
        // Send as FormData for file upload — adjust to your API as needed
        // const formData = new FormData();
        // formData.append("profileImageUrl", file);
        // await useUpdatePlayerMutation(formData).unwrap();
        await updatePlayer({
          profileImageUrl: file.name,
        }).unwrap();
      }
      router.push("/dashboard");
    } catch {
      setError("Failed to upload photo. You can skip for now.");
    }
  }

  return (
    <>
      {/* ── Dark hero header ─────────────────────────────────────────────── */}
      <div
        className="relative shrink-0 overflow-hidden bg-(--color-navy) px-6 pb-8 pt-14"
        style={{ minHeight: "200px" }}
      >
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

        <StepDots current={1} total={2} />

        <h1
          className="mt-4 font-(family-name:--font-display) text-3xl font-black uppercase text-white"
          style={{ letterSpacing: "0.03em", lineHeight: 1.05 }}
        >
          Profile Photo
        </h1>
        <p className="mt-1.5 text-sm font-medium text-white/60">
          Add a photo so your teammates recognise you
        </p>
      </div>

      {/* ── White card body ───────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-1 flex-col rounded-t-[28px] bg-(--color-bg-base) px-5 pt-8 pb-4"
        style={{ marginTop: "-20px" }}
      >
        {/* ── Avatar picker ─────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          {/* Upload label */}

          <ImageUploader uploadText="Upload Photo" onFileSelect={setFile} />

          {/* Info card — only shown when no photo yet */}
          {!file && (
            <div className="w-full rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-4 shadow-(--shadow-card)">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-tint)">
                  <Camera size={16} className="text-(--color-brand)" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-(--color-text-primary)">
                    Why add a photo?
                  </p>
                  <p className="mt-0.5 text-xs text-(--color-text-muted) leading-relaxed">
                    Your photo helps teammates and opponents identify you on the
                    scorecard and match feed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm font-medium text-(--color-live)">{error}</p>
          )}
        </div>

        {/* ── CTAs ─────────────────────────────────────────────────────── */}
        <div className="safe-bottom mt-4 shrink-0 flex flex-col gap-2.5 border-t border-(--color-bg-border) bg-(--color-bg-base) pt-3">
          {/* Continue / Save */}
          <button
            onClick={() => handleContinue(false)}
            disabled={isLoading}
            className={cn(
              "flex h-14 w-full items-center justify-center gap-2 rounded-2xl",
              "font-(family-name:--font-display) text-lg font-black uppercase tracking-[0.06em] text-white",
              "transition-all duration-200 active:scale-[0.97]",
              preview && !isLoading
                ? "bg-(--color-brand) shadow-(--shadow-button)"
                : !isLoading
                  ? "bg-(--color-brand)/70 text-white/80"
                  : "cursor-not-allowed bg-(--color-bg-border) text-(--color-text-muted)",
            )}
          >
            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                {preview ? "Save & Continue" : "Continue"}
                <ChevronRight size={18} />
              </>
            )}
          </button>

          {/* Skip */}
          <button
            onClick={() => handleContinue(true)}
            disabled={isLoading}
            className={cn(
              "flex h-11 w-full items-center justify-center rounded-xl",
              "font-(family-name:--font-display) text-sm font-bold uppercase tracking-[0.06em]",
              "text-(--color-text-secondary) transition-all hover:text-(--color-text-primary)",
              "active:scale-[0.97]",
            )}
          >
            Skip for now
          </button>
        </div>
      </div>
    </>
  );
}
