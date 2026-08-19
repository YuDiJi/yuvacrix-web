"use client";

import { useCallback } from "react";
import {
  useGetMyBowlingPerformanceQuery,
  useLazyGetMyBowlingAnalysisQuery,
} from "@/store/api/cricket/performanceApi";
import type {
  BowlingAnalysisResponse,
  BowlingAnalysisSection,
} from "@/types/cricket/performance";

import LazyPerformanceSection from "../batting/components/LazyPerformanceSection";
import PerformanceEmptyState from "../batting/components/PerformanceEmptyState";

import BowlingCurrentForm from "./sections/BowlingCurrentForm";
import BowlingPositionAnalysis from "./sections/BowlingPositionAnalysis";
import BowlingWicketTypes from "./sections/BowlingWicketTypes";
import BowlingImpactAnalysis from "./sections/BowlingImpactAnalysis";
import BowlingInningsAnalysis from "./sections/BowlingInningsAnalysis";
import BowlingSideAnalysis from "./sections/BowlingSideAnalysis";
import BowlingPitchAnalysis from "./sections/BowlingPitchAnalysis";
import BattingPositionWickets from "./sections/BattingPositionWickets";
import BowlingWicketsByInnings from "./sections/BowlingWicketsByInnings";
import BowlingRunTypes from "./sections/BowlingRunTypes";
import BowlingWagonWheel from "./sections/BowlingWagonWheel";
import BowlingExtras from "./sections/BowlingExtras";
import BowlingYearlyAnalysis from "./sections/BowlingYearlyAnalysis";
import BowlingOverallStats from "./sections/BowlingOverallStats";

export default function BowlingPerformance() {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetMyBowlingPerformanceQuery();

  const [loadAngle, angle] = useLazyGetMyBowlingAnalysisQuery();
  const [loadWagonWheel, wagonWheel] = useLazyGetMyBowlingAnalysisQuery();
  const [loadImpact, impact] = useLazyGetMyBowlingAnalysisQuery();
  const [loadBattingPosition, battingPosition] =
    useLazyGetMyBowlingAnalysisQuery();

  const [loadBowlingPosition, bowlingPosition] =
    useLazyGetMyBowlingAnalysisQuery();

  const load = useCallback(
    (trigger: typeof loadAngle, section: BowlingAnalysisSection) => {
      void trigger({ section }, true);
    },
    [],
  );

  if (isLoading) return <PageSkeleton />;

  if (isError || !data) {
    return (
      <div className="p-4">
        <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-6 shadow-(--shadow-card)">
          <PerformanceEmptyState
            title="Bowling data unavailable"
            description="We could not load your bowling performance."
          />
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 h-11 w-full rounded-xl bg-(--color-brand) font-(family-name:--font-display) text-sm font-black uppercase tracking-wide text-white"
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

      <BowlingCurrentForm data={data.currentForm} />
      <LazyPerformanceSection
        onVisible={() => load(loadBowlingPosition, "BOWLING_OVER_SLOT")}
      >
        <BowlingPositionAnalysis
          response={
            bowlingPosition.data as
              | BowlingAnalysisResponse<"BOWLING_OVER_SLOT">
              | undefined
          }
          isLoading={bowlingPosition.isFetching}
          isError={bowlingPosition.isError}
        />
      </LazyPerformanceSection>
      <BowlingWicketTypes data={data.wicketTypes} />

      <LazyPerformanceSection onVisible={() => load(loadImpact, "SHOT_IMPACT")}>
        <BowlingImpactAnalysis
          response={
            impact.data as BowlingAnalysisResponse<"SHOT_IMPACT"> | undefined
          }
          isLoading={impact.isFetching}
          isError={impact.isError}
        />
      </LazyPerformanceSection>

      <BowlingInningsAnalysis items={data.byMatchInnings} />

      <LazyPerformanceSection
        onVisible={() => load(loadAngle, "BOWLING_ANGLE")}
      >
        <BowlingSideAnalysis
          response={
            angle.data as BowlingAnalysisResponse<"BOWLING_ANGLE"> | undefined
          }
          isLoading={angle.isFetching}
          isError={angle.isError}
        />
      </LazyPerformanceSection>

      <BowlingPitchAnalysis items={data.byPitchType} />

      <LazyPerformanceSection
        onVisible={() => load(loadBattingPosition, "BATTING_POSITION_WICKETS")}
      >
        <BattingPositionWickets
          response={
            battingPosition.data as
              | BowlingAnalysisResponse<"BATTING_POSITION_WICKETS">
              | undefined
          }
          isLoading={battingPosition.isFetching}
          isError={battingPosition.isError}
        />
      </LazyPerformanceSection>

      <BowlingWicketsByInnings data={data.wicketsByInnings} />

      <BowlingRunTypes data={data.runComposition} />

      <LazyPerformanceSection
        onVisible={() => load(loadWagonWheel, "WAGON_WHEEL")}
      >
        <BowlingWagonWheel
          response={
            wagonWheel.data as
              | BowlingAnalysisResponse<"WAGON_WHEEL">
              | undefined
          }
          isLoading={wagonWheel.isFetching}
          isError={wagonWheel.isError}
        />
      </LazyPerformanceSection>

      <BowlingExtras data={data.extras} />
      <BowlingYearlyAnalysis items={data.yearly} />
      <BowlingOverallStats data={data.overall} />

      <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3 text-xs leading-5 text-(--color-text-secondary)">
        Based on{" "}
        <strong className="text-(--color-text-primary)">
          {data.metadata.includedCompletedMatches} completed matches
        </strong>{" "}
        and{" "}
        <strong className="text-(--color-text-primary)">
          {data.metadata.includedBowlingInnings} bowling innings
        </strong>
        .
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[330, 300, 280, 300, 240, 300].map((height, index) => (
        <div
          key={index}
          style={{ height }}
          className="animate-pulse rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)"
        />
      ))}
    </div>
  );
}
