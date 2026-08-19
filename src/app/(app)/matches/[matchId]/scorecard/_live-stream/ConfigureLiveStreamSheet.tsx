"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Radio,
  Video,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

import { DialogBottom } from "@/components/common/DialogBottom";
import { createYouTubeEmbedUrl, isValidYouTubeUrl } from "@/lib/youtube";
import { MatchLiveStream } from "@/types/cricket/liveStream";

type ConfigureLiveStreamSheetProps = {
  open: boolean;
  currentStream?: MatchLiveStream;
  isSubmitting: boolean;
  actionError?: string;
  onClose: () => void;
  onSubmit: (youtubeUrl: string) => Promise<void>;
};

export function ConfigureLiveStreamSheet({
  open,
  currentStream,
  isSubmitting,
  actionError,
  onClose,
  onSubmit,
}: ConfigureLiveStreamSheetProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [validationError, setValidationError] = useState("");

  const embedUrl = useMemo(
    () => createYouTubeEmbedUrl(youtubeUrl),
    [youtubeUrl],
  );

  const isValidUrl = useMemo(() => isValidYouTubeUrl(youtubeUrl), [youtubeUrl]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setYoutubeUrl(currentStream?.watchUrl ?? "");
    setShowPreview(Boolean(currentStream?.embedUrl));
    setShowHelp(false);
    setValidationError("");
  }, [open, currentStream]);

  function handleClose() {
    if (!isSubmitting) {
      onClose();
    }
  }

  function handleUrlChange(value: string) {
    setYoutubeUrl(value);
    setShowPreview(false);
    setValidationError("");
  }

  function handlePreview() {
    if (!youtubeUrl.trim()) {
      setValidationError("Enter your YouTube Live URL.");
      return;
    }

    if (!isValidUrl) {
      setValidationError("Enter a valid YouTube link.");
      return;
    }

    setValidationError("");
    setShowPreview(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUrl = youtubeUrl.trim();

    if (!trimmedUrl) {
      setValidationError("Enter your YouTube Live URL.");
      return;
    }

    if (!isValidUrl) {
      setValidationError("Enter a valid YouTube link.");
      return;
    }

    setValidationError("");
    await onSubmit(trimmedUrl);
  }

  return (
    <DialogBottom open={open} onClose={handleClose} className="">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-col max-h-[75vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
              <Video className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h2 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
                {currentStream ? "Manage Stream" : "Go Live"}
              </h2>

              <p className="mt-0.5 text-xs text-(--color-text-secondary)">
                Add your YouTube Live link
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            disabled={isSubmitting}
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-bg-base) text-(--color-text-primary)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable area */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto scrollbar-none">
          {/* URL input */}
          <div>
            <label
              htmlFor="youtube-live-url"
              className="mb-2 block text-sm font-bold text-(--color-text-primary)"
            >
              YouTube Live URL
            </label>

            <div
              className={[
                "flex h-12 items-center gap-3 rounded-xl border px-3",
                validationError
                  ? "border-red-500"
                  : youtubeUrl && isValidUrl
                    ? "border-green-500"
                    : "border-(--color-bg-border) focus-within:border-(--color-brand)",
              ].join(" ")}
            >
              <Video className="h-5 w-5 shrink-0 text-red-600" />

              <input
                id="youtube-live-url"
                type="url"
                value={youtubeUrl}
                disabled={isSubmitting}
                onChange={(event) => handleUrlChange(event.target.value)}
                placeholder="Paste YouTube Live URL"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-(--color-text-muted)"
              />

              {youtubeUrl && isValidUrl && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
              )}
            </div>

            {validationError && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {validationError}
              </p>
            )}

            {actionError && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {actionError}
              </p>
            )}

            <p className="mt-2 break-all text-[11px] leading-5 text-(--color-text-muted)">
              Example: youtube.com/watch?v=xxxxxxxx or youtu.be/xxxxxxxx
            </p>
          </div>

          {/* Collapsible help */}
          <div className="rounded-xl border border-(--color-bg-border)">
            <button
              type="button"
              onClick={() => setShowHelp((current) => !current)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="text-sm font-bold text-(--color-text-primary)">
                  Need help?
                </p>

                <p className="mt-0.5 text-xs text-(--color-text-secondary)">
                  See how to get your YouTube Live link
                </p>
              </div>

              {showHelp ? (
                <ChevronUp className="h-5 w-5 text-(--color-text-secondary)" />
              ) : (
                <ChevronDown className="h-5 w-5 text-(--color-text-secondary)" />
              )}
            </button>

            {showHelp && (
              <div className="border-t border-(--color-bg-border) px-4 pb-4 pt-3">
                <div className="space-y-2">
                  <HelpStep number={1}>Open the YouTube app.</HelpStep>
                  <HelpStep number={2}>
                    Tap <strong>＋ Create</strong>.
                  </HelpStep>
                  <HelpStep number={3}>
                    Select <strong>Go Live</strong>.
                  </HelpStep>
                  <HelpStep number={4}>Start the stream.</HelpStep>
                  <HelpStep number={5}>Copy the public stream link.</HelpStep>
                  <HelpStep number={6}>Paste it into YuvaCrix.</HelpStep>
                </div>

                <a
                  href="https://support.google.com/youtube/answer/9227509"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-(--color-brand)"
                >
                  How to stream with YouTube
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Preview */}
          {showPreview && embedUrl && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-(--color-text-primary)">
                  Preview
                </p>

                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="text-xs font-semibold text-(--color-brand)"
                >
                  Change link
                </button>
              </div>

              <div className="aspect-video overflow-hidden rounded-xl bg-black">
                <iframe
                  src={`${embedUrl}?playsinline=1&rel=0`}
                  title="Live-stream preview"
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {!showPreview && (
            <button
              type="button"
              disabled={!youtubeUrl.trim() || isSubmitting}
              onClick={handlePreview}
              className="flex h-11 w-full items-center justify-center rounded-xl border border-(--color-brand) text-sm font-bold text-(--color-brand) disabled:opacity-50"
            >
              Preview Stream
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 shrink-0 border-t border-(--color-bg-border) pt-4">
          <button
            type="submit"
            disabled={!isValidUrl || isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold text-white disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Radio className="h-5 w-5" />
                {currentStream ? "Update Stream" : "Start Live Stream"}
              </>
            )}
          </button>
        </div>
      </form>
    </DialogBottom>
  );
}

type HelpStepProps = {
  number: number;
  children: ReactNode;
};

function HelpStep({ number, children }: HelpStepProps) {
  return (
    <div className="flex items-start gap-2 text-xs leading-5 text-(--color-text-secondary)">
      <span className="font-bold text-(--color-brand)">{number}.</span>
      <span>{children}</span>
    </div>
  );
}
