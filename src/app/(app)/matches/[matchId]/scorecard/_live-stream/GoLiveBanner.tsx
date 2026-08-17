"use client";

import { Radio, Video } from "lucide-react";

type GoLiveBannerProps = {
  hasConfiguredStream?: boolean;
  onGoLive: () => void;
};

export function GoLiveBanner({
  hasConfiguredStream = false,
  onGoLive,
}: GoLiveBannerProps) {
  return (
    <section className="relative overflow-hidden border-b border-(--color-bg-border)">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-r from-[#102451] via-[#1B3FA0] to-[#102451]" />

      {/* Decorative elements */}
      <div className="absolute -left-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-20 right-0 h-44 w-44 rounded-full bg-(--color-sky)/20 blur-3xl" />

      <div className="relative flex min-h-41 flex-col items-center justify-center px-5 py-7 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
          <Radio className="h-5 w-5 text-white" />
        </div>

        <h2 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-white">
          {hasConfiguredStream
            ? "Your live stream is disabled"
            : "Stream your match live"}
        </h2>

        <p className="mt-1.5 max-w-72.5 text-sm leading-5 text-white/75">
          {hasConfiguredStream
            ? "Enable the saved stream so viewers can watch this match."
            : "Add your YouTube Live link and let everyone watch the action."}
        </p>

        <button
          type="button"
          onClick={onGoLive}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white shadow-lg shadow-black/20 transition active:scale-[0.98]"
        >
          <Video className="h-5 w-5" />

          {hasConfiguredStream ? "ENABLE STREAM" : "GO LIVE"}
        </button>
      </div>
    </section>
  );
}
