// src/app/(app)/cricket-profile/_components/StatsTab.tsx

"use client";

import { useMemo, useState } from "react";
import { Activity, BarChart3, RotateCcw } from "lucide-react";

import { cn } from "@/lib/cn";
import { useGetMyCricketProfileStatsQuery } from "@/store/api/cricketProfileApi";

import type {
  CricketProfileBattingStats,
  CricketProfileBowlingStats,
  CricketProfileCaptaincyStats,
  CricketProfileFieldingStats,
  CricketProfileStatsCategory,
  CricketProfileStatsResponse,
} from "@/types/cricketProfile";

type StatsSubTab = {
  label: string;
  value: CricketProfileStatsCategory;
};

type StatMetric = {
  label: string;
  value: string | number;
};

const STATS_TABS: StatsSubTab[] = [
  {
    label: "Batting",
    value: "BATTING",
  },
  {
    label: "Bowling",
    value: "BOWLING",
  },
  {
    label: "Fielding",
    value: "FIELDING",
  },
  {
    label: "Captain",
    value: "CAPTAINCY",
  },
];

function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits,
  }).format(value);
}

function formatPercentage(value: number) {
  return `${formatNumber(value, 2)}%`;
}

function getBattingMetrics(stats: CricketProfileBattingStats): StatMetric[] {
  return [
    {
      label: "Matches",
      value: stats.matches,
    },
    {
      label: "Innings",
      value: stats.innings,
    },
    {
      label: "Not Outs",
      value: stats.notOuts,
    },
    {
      label: "Runs",
      value: stats.runs,
    },
    {
      label: "Highest Score",
      value: `${stats.highestScore}${stats.highestScoreNotOut ? "*" : ""}`,
    },
    {
      label: "Average",
      value: formatNumber(stats.average),
    },
    {
      label: "Strike Rate",
      value: formatNumber(stats.strikeRate),
    },
    {
      label: "Balls Faced",
      value: stats.balls,
    },
    {
      label: "Dot Balls",
      value: stats.dotBalls,
    },
    {
      label: "30s",
      value: stats.thirties,
    },
    {
      label: "50s",
      value: stats.fifties,
    },
    {
      label: "100s",
      value: stats.hundreds,
    },
    {
      label: "Fours",
      value: stats.fours,
    },
    {
      label: "Sixes",
      value: stats.sixes,
    },
    {
      label: "Ducks",
      value: stats.ducks,
    },
  ];
}

function getBowlingMetrics(stats: CricketProfileBowlingStats): StatMetric[] {
  return [
    {
      label: "Matches",
      value: stats.matches,
    },
    {
      label: "Innings",
      value: stats.innings,
    },
    {
      label: "Overs",
      value: stats.overs,
    },
    {
      label: "Maidens",
      value: stats.maidens,
    },
    {
      label: "Runs Conceded",
      value: stats.runsConceded,
    },
    {
      label: "Wickets",
      value: stats.wickets,
    },
    {
      label: "Best Bowling",
      value: stats.bestBowling,
    },
    {
      label: "Economy",
      value: formatNumber(stats.economy),
    },
    {
      label: "Strike Rate",
      value: formatNumber(stats.strikeRate),
    },
    {
      label: "Average",
      value: formatNumber(stats.average),
    },
    {
      label: "Wides",
      value: stats.wides,
    },
    {
      label: "No Balls",
      value: stats.noBalls,
    },
    {
      label: "Dot Balls",
      value: stats.dotBalls,
    },
    {
      label: "Fours Conceded",
      value: stats.foursConceded,
    },
    {
      label: "Sixes Conceded",
      value: stats.sixesConceded,
    },
    {
      label: "3 Wickets",
      value: stats.threeWicketHauls,
    },
    {
      label: "5 Wickets",
      value: stats.fiveWicketHauls,
    },
    {
      label: "10 Wickets",
      value: stats.tenWicketHauls,
    },
    {
      label: "Legal Balls",
      value: stats.legalBalls,
    },
  ];
}

function getFieldingMetrics(stats: CricketProfileFieldingStats): StatMetric[] {
  return [
    {
      label: "Matches",
      value: stats.matches,
    },
    {
      label: "Catches",
      value: stats.catches,
    },
    {
      label: "Caught Behind",
      value: stats.caughtBehind,
    },
    {
      label: "Run Outs",
      value: stats.runOutInvolvements,
    },
    {
      label: "Stumpings",
      value: stats.stumpings,
    },
    {
      label: "WK Dismissals",
      value: stats.wicketKeeperDismissals,
    },
    {
      label: "Total Dismissals",
      value: stats.totalDismissals,
    },
  ];
}

function getCaptaincyMetrics(
  stats: CricketProfileCaptaincyStats,
): StatMetric[] {
  return [
    {
      label: "Matches",
      value: stats.matchesCaptained,
    },
    {
      label: "Toss Data",
      value: stats.matchesWithTossData,
    },
    {
      label: "Tosses Won",
      value: stats.tossesWon,
    },
    {
      label: "Wins",
      value: stats.wins,
    },
    {
      label: "Losses",
      value: stats.losses,
    },
    {
      label: "Ties",
      value: stats.ties,
    },
    {
      label: "Draws",
      value: stats.draws,
    },
    {
      label: "No Results",
      value: stats.noResults,
    },
    {
      label: "Win Percentage",
      value: formatPercentage(stats.winPercentage),
    },
    {
      label: "Toss Win Percentage",
      value: formatPercentage(stats.tossWinPercentage),
    },
  ];
}

function getSectionMetrics(
  response: CricketProfileStatsResponse,
  sectionIndex: number,
): StatMetric[] {
  switch (response.category) {
    case "BATTING": {
      const section = response.sections[sectionIndex];

      return section ? getBattingMetrics(section.stats) : [];
    }

    case "BOWLING": {
      const section = response.sections[sectionIndex];

      return section ? getBowlingMetrics(section.stats) : [];
    }

    case "FIELDING": {
      const section = response.sections[sectionIndex];

      return section ? getFieldingMetrics(section.stats) : [];
    }

    case "CAPTAINCY": {
      const section = response.sections[sectionIndex];

      return section ? getCaptaincyMetrics(section.stats) : [];
    }

    default:
      return [];
  }
}

function StatsTabs({
  value,
  onChange,
}: {
  value: CricketProfileStatsCategory;
  onChange: (category: CricketProfileStatsCategory) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {STATS_TABS.map((tab) => {
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "min-h-10 rounded-full px-2 text-xs font-bold transition-colors sm:text-sm",
              isActive
                ? "bg-(--color-brand) text-white shadow-sm"
                : "bg-(--color-bg-border) text-(--color-text-secondary)",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function StatCard({ metric }: { metric: StatMetric }) {
  return (
    <article className="flex min-h-[94px] flex-col items-center justify-center rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-2 py-3 text-center shadow-sm">
      <strong className="font-(family-name:--font-display) text-[22px] font-black leading-none text-(--color-text-primary)">
        {metric.value}
      </strong>

      <span className="mt-2 text-[11px] font-medium leading-tight text-(--color-text-muted)">
        {metric.label}
      </span>
    </article>
  );
}

function StatsSectionSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-6 w-24 animate-pulse rounded bg-(--color-bg-border)" />

      <div className="grid grid-cols-3 gap-2">
        {Array.from({
          length: 9,
        }).map((_, index) => (
          <div
            key={index}
            className="h-[94px] animate-pulse rounded-xl bg-(--color-bg-border)"
          />
        ))}
      </div>
    </div>
  );
}

function StatsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-(--color-bg-tint)">
        <Activity className="h-5 w-5 text-(--color-brand)" />
      </div>

      <h3 className="mt-3 font-(family-name:--font-display) text-lg font-black uppercase text-(--color-text-primary)">
        Unable to load stats
      </h3>

      <p className="mt-1 text-sm text-(--color-text-secondary)">
        Something went wrong while loading your cricket statistics.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-(--color-brand) px-5 py-2.5 text-sm font-bold text-white"
      >
        <RotateCcw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}

function EmptyStatsState() {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-9 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--color-bg-tint)">
        <BarChart3 className="h-6 w-6 text-(--color-brand)" />
      </div>

      <h3 className="mt-3 font-(family-name:--font-display) text-lg font-black uppercase text-(--color-text-primary)">
        No stats available
      </h3>

      <p className="mt-1 text-sm text-(--color-text-secondary)">
        Stats will appear after you play scored matches.
      </p>
    </div>
  );
}

export function Stats() {
  const [activeCategory, setActiveCategory] =
    useState<CricketProfileStatsCategory>("BATTING");

  const { currentData, isLoading, isFetching, isError, refetch } =
    useGetMyCricketProfileStatsQuery(activeCategory);

  const sections = useMemo(() => {
    if (!currentData) {
      return [];
    }

    return currentData.sections.map((section, index) => ({
      key: `${section.key}-${index}`,
      label: section.label,
      metrics: getSectionMetrics(currentData, index),
    }));
  }, [currentData]);

  const showSkeleton = isLoading || (isFetching && !currentData);

  return (
    <section className="flex flex-col gap-5 p-4">
      <StatsTabs value={activeCategory} onChange={setActiveCategory} />

      {showSkeleton ? (
        <StatsSectionSkeleton />
      ) : isError ? (
        <StatsError
          onRetry={() => {
            void refetch();
          }}
        />
      ) : sections.length === 0 ? (
        <EmptyStatsState />
      ) : (
        <div className="space-y-7">
          {sections.map((section) => (
            <section key={section.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
                    {section.label}
                  </h3>

                  <p className="mt-0.5 text-xs text-(--color-text-secondary)">
                    {STATS_TABS.find((tab) => tab.value === activeCategory)
                      ?.label ?? "Cricket"}{" "}
                    performance
                  </p>
                </div>

                <div className="rounded-lg bg-(--color-bg-tint) px-3 py-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-(--color-brand)">
                    {activeCategory === "CAPTAINCY"
                      ? "Captain"
                      : activeCategory}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {section.metrics.map((metric) => (
                  <StatCard key={metric.label} metric={metric} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
