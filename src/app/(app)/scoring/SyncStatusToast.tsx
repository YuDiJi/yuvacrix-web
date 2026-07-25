"use client";

import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";

export type SyncStatus = "idle" | "saving" | "refreshing" | "synced" | "error";

type SyncStatusToastProps = {
  status: SyncStatus;
  successMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
};

export function SyncStatusToast({
  status,
  successMessage = "Synced",
  errorMessage = "Unable to sync",
  onRetry,
  className,
}: SyncStatusToastProps) {
  if (status === "idle") return null;

  const isSaving = status === "saving";
  const isRefreshing = status === "refreshing";
  const isSynced = status === "synced";
  const isError = status === "error";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center px-4",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        disabled={!isError || !onRetry}
        onClick={isError && onRetry ? onRetry : undefined}
        className={cn(
          "pointer-events-auto flex min-h-10 items-center gap-2 rounded-full px-4 py-2",
          "shadow-[0_8px_24px_rgba(13,27,62,0.22)]",
          "font-(family-name:--font-display) text-xs font-black uppercase tracking-[0.06em]",
          "transition-all duration-200",
          (isSaving || isRefreshing) && "bg-(--color-navy) text-white",
          isSynced && "bg-(--color-four) text-white",
          isError && "bg-(--color-live) text-white",
          isError &&
            onRetry &&
            "cursor-pointer active:scale-95 hover:brightness-95",
        )}
      >
        {isSaving && (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Saving delivery...</span>
          </>
        )}

        {isRefreshing && (
          <>
            <RefreshCw size={16} className="animate-spin" />
            <span>Updating score...</span>
          </>
        )}

        {isSynced && (
          <>
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </>
        )}

        {isError && (
          <>
            <AlertCircle size={16} />
            <span>
              {errorMessage}
              {onRetry ? " · Tap to retry" : ""}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
