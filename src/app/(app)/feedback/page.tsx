"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ImagePlus,
  Lightbulb,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";
import { useSubmitReportMutation } from "@/store/api/reportApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { useAppSelector } from "@/store/hooks";
import { selectActiveSport } from "@/store/sport/selectors";
import { SPORT_TYPES } from "@/types/sport";
import type { FeedbackType } from "@/types/report";

const MAX_EVIDENCE_FILES = 3;
const MAX_EVIDENCE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const feedbackSchema = z.object({
  type: z.enum(["BUG", "QUERY", "IDEA"]),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(150, "Subject must be 150 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(4000, "Description must be 4000 characters or fewer."),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

type EvidenceFile = {
  id: string;
  file: File;
  previewUrl: string;
};

const REPORT_OPTIONS = [
  {
    type: "BUG",
    label: "Report an Issue",
    description: "Something isn't working as expected.",
    icon: AlertCircle,
  },
  {
    type: "IDEA",
    label: "Suggest an Idea",
    description: "Share an idea that could make YuvaCrix better.",
    icon: Lightbulb,
  },
  {
    type: "QUERY",
    label: "Ask a Question",
    description: "Need help or want to ask us something?",
    icon: HelpCircle,
  },
] satisfies readonly {
  type: FeedbackType;
  label: string;
  description: string;
  icon: typeof AlertCircle;
}[];

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    const message = error.data.message;

    if (message === "INVALID_REPORT_EVIDENCE_KEY") {
      return "One screenshot could not be verified. Please remove it and try again.";
    }

    if (message === "REPORT_EVIDENCE_KEYS_DUPLICATE") {
      return "Duplicate screenshot evidence was detected. Please try again.";
    }

    if (message === "ACCOUNT_ACCESS_RESTRICTED") {
      return "Your account cannot submit feedback right now.";
    }

    return message;
  }

  return fallback;
}

export default function FeedbackPage() {
  const router = useRouter();
  const activeSport = useAppSelector(selectActiveSport);
  const [uploadFile] = useUploadFileMutation();
  const [submitReport, { isLoading: isSubmittingReport }] =
    useSubmitReportMutation();

  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [fileError, setFileError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [submittedSubject, setSubmittedSubject] = useState("");
  const submitInFlightRef = useRef(false);
  const evidenceFilesRef = useRef<EvidenceFile[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "BUG",
      subject: "",
      description: "",
    },
  });

  const selectedType = watch("type");
  const isUploadingEvidence = uploadStatus.length > 0;
  const isBusy =
    isSubmittingReport || isUploadingEvidence || submitInFlightRef.current;

  useEffect(() => {
    evidenceFilesRef.current = evidenceFiles;
  }, [evidenceFiles]);

  useEffect(() => {
    return () => {
      evidenceFilesRef.current.forEach((item) =>
        URL.revokeObjectURL(item.previewUrl),
      );
    };
  }, []);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;

    setFileError("");
    const nextFiles = Array.from(files);

    if (evidenceFiles.length + nextFiles.length > MAX_EVIDENCE_FILES) {
      setFileError("You can attach up to 3 images.");
      return;
    }

    const validEvidence: EvidenceFile[] = [];

    for (const file of nextFiles) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
        setFileError("Only JPEG, PNG, and WebP images are supported.");
        return;
      }

      if (file.size > MAX_EVIDENCE_SIZE_BYTES) {
        setFileError("Each screenshot must be 5 MB or smaller.");
        return;
      }

      validEvidence.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    setEvidenceFiles((current) => [...current, ...validEvidence]);
  };

  const removeEvidence = (id: string) => {
    setEvidenceFiles((current) => {
      const removed = current.find((item) => item.id === id);

      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const onSubmit = async (values: FeedbackFormValues) => {
    if (submitInFlightRef.current || isSubmittingReport || uploadStatus) return;

    submitInFlightRef.current = true;
    setSubmitError("");
    setUploadStatus("");

    try {
      const evidenceKeys: string[] = [];

      for (let index = 0; index < evidenceFiles.length; index += 1) {
        const evidence = evidenceFiles[index];
        setUploadStatus(
          `Uploading screenshot ${index + 1} of ${evidenceFiles.length}...`,
        );

        const uploadResponse = await uploadFile({
          purpose: "REPORT_EVIDENCE",
          file: evidence.file,
        }).unwrap();

        evidenceKeys.push(uploadResponse.file.key);
      }

      setUploadStatus("");

      const uniqueEvidenceKeys = Array.from(new Set(evidenceKeys));
      const requestBody = {
        type: values.type,
        subject: values.subject.trim(),
        description: values.description.trim(),
        ...(uniqueEvidenceKeys.length > 0 && {
          evidenceKeys: uniqueEvidenceKeys,
        }),
      };

      const response = await submitReport(requestBody).unwrap();
      setSubmittedSubject(response.subject);
    } catch (error) {
      console.error(error);
      setUploadStatus("");
      setSubmitError(
        getErrorMessage(
          error,
          "We couldn't submit your feedback. Please try again.",
        ),
      );
    } finally {
      submitInFlightRef.current = false;
    }
  };

  const doneHref =
    activeSport === SPORT_TYPES.VOLLEYBALL ? "/volleyball/home" : "/home";

  if (submittedSubject) {
    return (
      <div className="flex min-h-full flex-col bg-(--color-bg-base) px-5 py-8">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-brand)/10 text-(--color-brand)">
            <CheckCircle2 size={34} strokeWidth={2.5} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-black uppercase tracking-wide text-(--color-navy)">
            Thanks for your feedback!
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-(--color-text-secondary)">
            Your feedback has been submitted to the YuvaCrix team.
          </p>
          <Button className="mt-7" onClick={() => router.replace(doneHref)}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-(--color-bg-base) px-4 py-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-xl flex-col gap-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
      >
        <header>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-brand)/10 text-(--color-brand)">
            <MessageSquare size={24} strokeWidth={2.5} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-black uppercase tracking-wide text-(--color-navy)">
            Feedback & Support
          </h1>
          <p className="mt-2 text-sm leading-6 text-(--color-text-secondary)">
            Help us improve YuvaCrix. Report an issue, suggest an idea, or ask
            us a question.
          </p>
        </header>

        <section aria-labelledby="feedback-type-label">
          <h2
            id="feedback-type-label"
            className="text-xs font-bold uppercase tracking-widest text-(--color-text-muted)"
          >
            What can we help with?
          </h2>
          <div className="mt-3 grid gap-2">
            {REPORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const selected = selectedType === option.type;

              return (
                <button
                  key={option.type}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setValue("type", option.type, { shouldValidate: true })}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border-2 bg-white p-3 text-left transition-colors",
                    selected
                      ? "border-(--color-brand) bg-(--color-bg-tint)"
                      : "border-(--color-bg-border) hover:border-(--color-brand)/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      selected
                        ? "bg-(--color-brand) text-white"
                        : "bg-(--color-bg-base) text-(--color-text-secondary)",
                    )}
                  >
                    <Icon size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-(--color-text-primary)">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-(--color-text-secondary)">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {errors.type && (
            <p className="mt-2 text-sm font-semibold text-(--color-live)">
              {errors.type.message}
            </p>
          )}
        </section>

        <section className="grid gap-4">
          <div>
            <label
              htmlFor="feedback-subject"
              className="text-sm font-bold text-(--color-text-primary)"
            >
              Subject
            </label>
            <input
              id="feedback-subject"
              type="text"
              maxLength={150}
              placeholder="Briefly describe your feedback"
              {...register("subject")}
              className="mt-2 w-full rounded-2xl border-2 border-(--color-bg-border) bg-white px-4 py-3 text-sm font-medium text-(--color-text-primary) outline-none transition-colors placeholder:text-(--color-text-muted) focus:border-(--color-brand)"
            />
            {errors.subject && (
              <p className="mt-2 text-sm font-semibold text-(--color-live)">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="feedback-description"
              className="text-sm font-bold text-(--color-text-primary)"
            >
              Description
            </label>
            <textarea
              id="feedback-description"
              rows={7}
              maxLength={4000}
              placeholder="Tell us what happened or what you'd like to suggest..."
              {...register("description")}
              className="mt-2 w-full resize-y rounded-2xl border-2 border-(--color-bg-border) bg-white px-4 py-3 text-sm font-medium leading-6 text-(--color-text-primary) outline-none transition-colors placeholder:text-(--color-text-muted) focus:border-(--color-brand)"
            />
            {errors.description && (
              <p className="mt-2 text-sm font-semibold text-(--color-live)">
                {errors.description.message}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-(--color-bg-border) bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-tint) text-(--color-brand)">
              <ImagePlus size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-(--color-text-primary)">
                Add screenshots
              </h2>
              <p className="mt-0.5 text-xs leading-5 text-(--color-text-secondary)">
                You can attach up to 3 images.
              </p>
            </div>
          </div>

          {evidenceFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {evidenceFiles.map((item, index) => (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-base)"
                >
                  <div
                    role="img"
                    aria-label={`Screenshot ${index + 1}: ${item.file.name}`}
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.previewUrl})` }}
                  />
                  <button
                    type="button"
                    aria-label={`Remove screenshot ${index + 1}`}
                    onClick={() => removeEvidence(item.id)}
                    disabled={isBusy}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label
            className={cn(
              "mt-4 flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-(--color-bg-border) px-4 py-4 text-center text-sm font-bold text-(--color-brand) transition-colors",
              evidenceFiles.length >= MAX_EVIDENCE_FILES || isBusy
                ? "pointer-events-none opacity-50"
                : "hover:border-(--color-brand)/50 hover:bg-(--color-bg-tint)",
            )}
          >
            Add screenshot
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={evidenceFiles.length >= MAX_EVIDENCE_FILES || isBusy}
              onChange={(event) => {
                handleFilesSelected(event.target.files);
                event.target.value = "";
              }}
              className="sr-only"
            />
          </label>

          {fileError && (
            <p className="mt-3 text-sm font-semibold text-(--color-live)">
              {fileError}
            </p>
          )}
        </section>

        {(uploadStatus || submitError) && (
          <div
            role="status"
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm font-semibold",
              submitError
                ? "border-(--color-live)/20 bg-(--color-live)/8 text-(--color-live)"
                : "border-(--color-brand)/20 bg-(--color-bg-tint) text-(--color-brand)",
            )}
          >
            {submitError || uploadStatus}
          </div>
        )}

        <Button type="submit" fullWidth loading={isBusy} disabled={isBusy}>
          Submit Feedback
        </Button>
      </form>
    </div>
  );
}
