// src/app/(app)/my-performance/_components/MyPerformance.tsx

"use client";

import { useState } from "react";

import { useGetMyPerformanceQuery } from "@/store/api/performanceApi";

import PerformanceHeader from "./PerformanceHeader";
import PerformanceTabs, { type PerformanceTab } from "./PerformanceTabs";
import BattingPerformance from "./batting/BattingPerformance";
import BowlingPerformance from "./bowling/BowlingPerformance";

export default function MyPerformance() {
  const [activeTab, setActiveTab] = useState<PerformanceTab>("BATTING");

  const {
    data: performance,
    isLoading,
    isError,
    refetch,
  } = useGetMyPerformanceQuery();

  if (isLoading) {
    return <PerformancePageSkeleton />;
  }

  if (isError || !performance) {
    return (
      <PerformanceErrorState
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide bg-(--color-bg-base)">
      <PerformanceHeader player={performance.player} />

      <PerformanceTabs
        activeTab={activeTab}
        tabs={performance.tabs}
        onTabChange={setActiveTab}
      />

      <main>
        {activeTab === "BATTING" && <BattingPerformance />}

        {activeTab === "BOWLING" && <BowlingPerformance />}

        {/* {activeTab === "COMPARE" && (
          <TabPlaceholder
            title="Compare Players"
            description="Search for another player and compare performance."
          />
        )}

        {activeTab === "FACE_OFF" && (
          <TabPlaceholder
            title="Face Off"
            description="Select an opponent to view head-to-head statistics."
          />
        )} */}
      </main>
    </div>
  );
}

type TabPlaceholderProps = {
  title: string;
  description: string;
};

function TabPlaceholder({ title, description }: TabPlaceholderProps) {
  return (
    <div className="p-4">
      <section className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-6 text-center shadow-(--shadow-card)">
        <h2 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
          {title}
        </h2>

        <p className="mt-2 text-sm text-(--color-text-secondary)">
          {description}
        </p>
      </section>
    </div>
  );
}

function PerformancePageSkeleton() {
  return (
    <div className="min-h-full animate-pulse bg-(--color-bg-base)">
      <div className="h-56 bg-(--color-navy)" />

      <div className="grid grid-cols-4 border-b border-(--color-bg-border) bg-(--color-bg-card)">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="px-3 py-5">
            <div className="mx-auto h-3 w-14 rounded bg-(--color-bg-border)" />
          </div>
        ))}
      </div>

      <div className="space-y-4 p-4">
        <div className="h-48 rounded-2xl bg-(--color-bg-card)" />
        <div className="h-72 rounded-2xl bg-(--color-bg-card)" />
      </div>
    </div>
  );
}

function PerformanceErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[65vh] items-center justify-center bg-(--color-bg-base) px-4">
      <div className="w-full max-w-sm rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-6 text-center shadow-(--shadow-card)">
        <h2 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
          Unable to load performance
        </h2>

        <p className="mt-2 text-sm text-(--color-text-secondary)">
          Something went wrong while loading your performance.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 h-11 w-full rounded-xl bg-(--color-brand) font-(family-name:--font-display) text-sm font-black uppercase tracking-wide text-white active:scale-[0.98]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
