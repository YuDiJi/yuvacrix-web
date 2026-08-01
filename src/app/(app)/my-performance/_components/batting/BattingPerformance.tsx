"use client";

import { useCallback } from "react";

import {
  useGetMyBattingPerformanceQuery,
  useLazyGetMyBattingAnalysisQuery,
  useLazyGetMyBattingPartnershipsQuery,
} from "@/store/api/performanceApi";

import type {
  BattingAnalysisResponse,
  BattingAnalysisSection,
} from "@/types/performance";

import LazyPerformanceSection from "./components/LazyPerformanceSection";
import PerformanceEmptyState from "./components/PerformanceEmptyState";
import BattingAngleAnalysis from "./sections/BattingAngleAnalysis";
import BattingBowlingStyleAnalysis from "./sections/BattingBowlingStyleAnalysis";
import BattingCurrentForm from "./sections/BattingCurrentForm";
import BattingDismissalAnalysis from "./sections/BattingDismissalAnalysis";
import BattingInningsAnalysis from "./sections/BattingInningsAnalysis";
import BattingOverallStats from "./sections/BattingOverallStats";
import BattingPaceSpinAnalysis from "./sections/BattingPaceSpinAnalysis";
import BattingPartnerships from "./sections/BattingPartnerships";
import BattingPitchAnalysis from "./sections/BattingPitchAnalysis";
import BattingPlayingStyle from "./sections/BattingPlayingStyle";
import BattingPositionAnalysis from "./sections/BattingPositionAnalysis";
import BattingRunTypes from "./sections/BattingRunTypes";
import BattingShotsAnalysis from "./sections/BattingShotsAnalysis";
import BattingWagonWheel from "./sections/BattingWagonWheel";
import BattingYearlyAnalysis from "./sections/BattingYearlyAnalysis";

export default function BattingPerformance() {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetMyBattingPerformanceQuery();

  const [
    loadShots,
    { data: shotsData, isFetching: isShotsLoading, isError: isShotsError },
  ] = useLazyGetMyBattingAnalysisQuery();

  const [
    loadWagonWheel,
    {
      data: wagonWheelData,
      isFetching: isWagonWheelLoading,
      isError: isWagonWheelError,
    },
  ] = useLazyGetMyBattingAnalysisQuery();

  const [
    loadBowlingStyle,
    {
      data: bowlingStyleData,
      isFetching: isBowlingStyleLoading,
      isError: isBowlingStyleError,
    },
  ] = useLazyGetMyBattingAnalysisQuery();

  const [
    loadBowlingAngle,
    {
      data: bowlingAngleData,
      isFetching: isBowlingAngleLoading,
      isError: isBowlingAngleError,
    },
  ] = useLazyGetMyBattingAnalysisQuery();

  const [
    loadPaceSpin,
    {
      data: paceSpinData,
      isFetching: isPaceSpinLoading,
      isError: isPaceSpinError,
    },
  ] = useLazyGetMyBattingAnalysisQuery();

  const [loadPartnerships, partnerships] =
    useLazyGetMyBattingPartnershipsQuery();

  const requestSection = useCallback(
    (trigger: typeof loadShots, section: BattingAnalysisSection) => {
      void trigger({ section }, true);
    },
    [],
  );

  if (isLoading) {
    return <BattingPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-4">
        <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-6 shadow-(--shadow-card)">
          <PerformanceEmptyState
            title="Batting data unavailable"
            description="We could not load your batting performance."
          />

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 h-11 w-full rounded-xl bg-(--color-brand) font-(family-name:--font-display) text-sm font-black uppercase tracking-wide text-white active:scale-[0.98]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {isFetching && (
        <div className="h-1 overflow-hidden rounded-full bg-(--color-bg-border)">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-(--color-brand)" />
        </div>
      )}

      <BattingCurrentForm currentForm={data.currentForm} />

      <BattingPlayingStyle
        overall={data.overall}
        currentForm={data.currentForm}
      />

      <LazyPerformanceSection
        onVisible={() => requestSection(loadShots, "SHOTS")}
      >
        <BattingShotsAnalysis
          response={shotsData as BattingAnalysisResponse<"SHOTS"> | undefined}
          isLoading={isShotsLoading}
          isError={isShotsError}
        />
      </LazyPerformanceSection>

      <LazyPerformanceSection
        onVisible={() => requestSection(loadWagonWheel, "WAGON_WHEEL")}
      >
        <BattingWagonWheel
          response={
            wagonWheelData as BattingAnalysisResponse<"WAGON_WHEEL"> | undefined
          }
          isLoading={isWagonWheelLoading}
          isError={isWagonWheelError}
        />
      </LazyPerformanceSection>

      <BattingRunTypes data={data.runComposition} />

      <BattingPositionAnalysis items={data.byBattingPosition} />

      <BattingInningsAnalysis items={data.byMatchInnings} />

      <LazyPerformanceSection
        onVisible={() => requestSection(loadBowlingStyle, "BOWLING_STYLE")}
      >
        <BattingBowlingStyleAnalysis
          response={
            bowlingStyleData as
              | BattingAnalysisResponse<"BOWLING_STYLE">
              | undefined
          }
          isLoading={isBowlingStyleLoading}
          isError={isBowlingStyleError}
        />
      </LazyPerformanceSection>

      <LazyPerformanceSection
        onVisible={() => requestSection(loadBowlingAngle, "BOWLING_ANGLE")}
      >
        <BattingAngleAnalysis
          response={
            bowlingAngleData as
              | BattingAnalysisResponse<"BOWLING_ANGLE">
              | undefined
          }
          isLoading={isBowlingAngleLoading}
          isError={isBowlingAngleError}
        />
      </LazyPerformanceSection>

      <LazyPerformanceSection
        onVisible={() => requestSection(loadPaceSpin, "PACE_SPIN")}
      >
        <BattingPaceSpinAnalysis
          response={
            paceSpinData as BattingAnalysisResponse<"PACE_SPIN"> | undefined
          }
          isLoading={isPaceSpinLoading}
          isError={isPaceSpinError}
        />
      </LazyPerformanceSection>

      <BattingPitchAnalysis items={data.byPitchType} />

      <BattingDismissalAnalysis data={data.dismissals} />

      <LazyPerformanceSection
        onVisible={() => {
          void loadPartnerships(
            {
              limit: 5,
            },
            true,
          );
        }}
      >
        <BattingPartnerships
          data={partnerships.data}
          isLoading={partnerships.isFetching}
          isError={partnerships.isError}
        />
      </LazyPerformanceSection>

      <BattingYearlyAnalysis items={data.yearly} />

      <BattingOverallStats data={data.overall} />

      <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3">
        <p className="text-xs leading-5 text-(--color-text-secondary)">
          Based on{" "}
          <span className="font-bold text-(--color-text-primary)">
            {data.metadata.includedCompletedMatches} completed matches
          </span>{" "}
          and{" "}
          <span className="font-bold text-(--color-text-primary)">
            {data.metadata.includedBattingInnings} batting innings
          </span>
          .
        </p>
      </div>
    </div>
  );
}

function BattingPageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[330, 280, 260, 340, 260, 300].map((height, index) => (
        <div
          key={index}
          style={{ height }}
          className="animate-pulse rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)"
        />
      ))}
    </div>
  );
}
