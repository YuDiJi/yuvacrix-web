"use client";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  useConfigureMatchLiveStreamMutation,
  useGetMatchLiveStreamQuery,
  useUpdateMatchLiveStreamStatusMutation,
} from "@/store/api/liveStreamApi";
import { ConfigureLiveStreamSheet } from "./ConfigureLiveStreamSheet";
import { GoLiveBanner } from "./GoLiveBanner";
import { LiveStreamPlayer } from "./LiveStreamPlayer";
import { LiveStreamSkeleton } from "./LiveStreamSkeleton";

type MatchLiveStreamSectionProps = {
  matchId: string;
  matchStatus: string;
  teamAName: string;
  teamBName: string;

  /**
   * true for match owner, scorer, tournament admin or anyone
   * who is allowed to configure the stream.
   */
  canManageStream: boolean;
};

function getErrorStatus(error: unknown): number | string | undefined {
  if (!error || typeof error !== "object" || !("status" in error)) {
    return undefined;
  }

  return (error as FetchBaseQueryError).status;
}

function getApiErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Something went wrong. Please try again.";
  }

  if ("data" in error) {
    const data = error.data;

    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  }

  return "Something went wrong. Please try again.";
}

export function MatchLiveStreamSection({
  matchId,
  matchStatus,
  teamAName,
  teamBName,
  canManageStream,
}: MatchLiveStreamSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  const {
    data: liveStream,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMatchLiveStreamQuery(matchId, {
    skip: !matchId,
    refetchOnMountOrArgChange: true,
  });

  const [configureLiveStream, { isLoading: isConfiguring }] =
    useConfigureMatchLiveStreamMutation();

  const [updateLiveStreamStatus, { isLoading: isUpdatingStatus }] =
    useUpdateMatchLiveStreamStatusMutation();

  const errorStatus = getErrorStatus(error);

  /**
   * Adjust this depending on what your backend returns when no stream
   * has been configured.
   */
  const streamNotConfigured =
    errorStatus === 404 || errorStatus === "PARSING_ERROR";

  const isMatchLive = matchStatus === "LIVE";

  async function handleConfigure(youtubeUrl: string) {
    try {
      setActionError("");

      await configureLiveStream({
        matchId,
        body: {
          youtubeUrl,
          isEnabled: true,
        },
      }).unwrap();

      setSheetOpen(false);
    } catch (configureError) {
      setActionError(getApiErrorMessage(configureError));
    }
  }

  async function handleDisable() {
    try {
      setActionError("");

      await updateLiveStreamStatus({
        matchId,
        body: {
          isEnabled: false,
        },
      }).unwrap();
    } catch (statusError) {
      setActionError(getApiErrorMessage(statusError));
    }
  }

  async function handleEnable() {
    try {
      setActionError("");

      /**
       * If the backend returns a disabled configured stream,
       * this PATCH call enables it again.
       */
      if (liveStream) {
        await updateLiveStreamStatus({
          matchId,
          body: {
            isEnabled: true,
          },
        }).unwrap();

        return;
      }

      /**
       * When no stream exists, open the configuration sheet.
       */
      setSheetOpen(true);
    } catch (statusError) {
      setActionError(getApiErrorMessage(statusError));
    }
  }

  if (isLoading) {
    return <LiveStreamSkeleton />;
  }

  /**
   * Enabled stream:
   * Admin and viewer can both watch.
   */
  if (liveStream?.isEnabled) {
    return (
      <>
        <LiveStreamPlayer
          stream={liveStream}
          title={`${teamAName} vs ${teamBName} live stream`}
          canManageStream={canManageStream}
          isUpdatingStatus={isUpdatingStatus}
          onDisable={handleDisable}
          onChangeUrl={() => {
            setActionError("");
            setSheetOpen(true);
          }}
        />

        {actionError && canManageStream && (
          <AdminActionError
            message={actionError}
            onRetry={() => setActionError("")}
          />
        )}

        <ConfigureLiveStreamSheet
          open={sheetOpen}
          currentStream={liveStream}
          isSubmitting={isConfiguring}
          actionError={actionError}
          onClose={() => {
            if (!isConfiguring) {
              setSheetOpen(false);
              setActionError("");
            }
          }}
          onSubmit={handleConfigure}
        />
      </>
    );
  }

  /**
   * Stream exists but is disabled.
   * Only the admin sees the banner.
   */
  if (liveStream && !liveStream.isEnabled) {
    if (!canManageStream) {
      return null;
    }

    return (
      <>
        <GoLiveBanner hasConfiguredStream onGoLive={handleEnable} />

        {isUpdatingStatus && (
          <div className="flex items-center justify-center gap-2 border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3 text-sm text-(--color-text-secondary)">
            <Loader2 className="h-4 w-4 animate-spin" />
            Enabling live stream...
          </div>
        )}

        {actionError && (
          <AdminActionError message={actionError} onRetry={handleEnable} />
        )}

        <ConfigureLiveStreamSheet
          open={sheetOpen}
          currentStream={liveStream}
          isSubmitting={isConfiguring}
          actionError={actionError}
          onClose={() => {
            if (!isConfiguring) {
              setSheetOpen(false);
              setActionError("");
            }
          }}
          onSubmit={handleConfigure}
        />
      </>
    );
  }

  /**
   * No stream:
   * Show Go Live only to the admin while the match is live.
   */
  if (canManageStream && isMatchLive && (streamNotConfigured || !liveStream)) {
    return (
      <>
        <GoLiveBanner
          onGoLive={() => {
            setActionError("");
            setSheetOpen(true);
          }}
        />

        {actionError && (
          <AdminActionError
            message={actionError}
            onRetry={() => setSheetOpen(true)}
          />
        )}

        <ConfigureLiveStreamSheet
          open={sheetOpen}
          isSubmitting={isConfiguring}
          actionError={actionError}
          onClose={() => {
            if (!isConfiguring) {
              setSheetOpen(false);
              setActionError("");
            }
          }}
          onSubmit={handleConfigure}
        />
      </>
    );
  }

  /**
   * A real API failure should not break the match page.
   * Show it only to an admin.
   */
  if (error && !streamNotConfigured && canManageStream) {
    return (
      <div className="border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-4">
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-red-700">
              Could not load live stream
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              The match scorecard will continue to work normally.
            </p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => refetch()}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-bold text-red-600 disabled:opacity-50"
          >
            <RefreshCw
              className={["h-3.5 w-3.5", isFetching ? "animate-spin" : ""].join(
                " ",
              )}
            />
            Retry
          </button>
        </div>
      </div>
    );
  }

  /**
   * Viewer + missing/disabled stream:
   * Render nothing.
   *
   * Completed/scheduled match + no stream:
   * Render nothing.
   */
  return null;
}

type AdminActionErrorProps = {
  message: string;
  onRetry: () => void;
};

function AdminActionError({ message, onRetry }: AdminActionErrorProps) {
  return (
    <div className="border-b border-(--color-bg-border) bg-red-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />

        <p className="min-w-0 flex-1 text-xs font-medium text-red-700">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 text-xs font-bold text-red-700 underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
