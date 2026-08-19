// src/app/(app)/cricket-profile/_components/BadgesTab.tsx

"use client";

import {
  Award,
  Check,
  LockKeyhole,
  RefreshCcw,
  ShieldCheck,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { useGetMyCricketProfileBadgesQuery } from "@/store/api/cricket/cricketProfileApi";

import type {
  CricketProfileBadgeCategory,
  CricketProfileBadgeGroup,
  CricketProfileBadgeItem,
  CricketProfileBadgeSection,
} from "@/types/cricket/cricketProfile";

type BadgeCategoryTab = {
  label: string;
  value: CricketProfileBadgeCategory;
};

const BADGE_CATEGORY_TABS: BadgeCategoryTab[] = [
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
];

function getCategoryLabel(category: CricketProfileBadgeCategory) {
  return (
    BADGE_CATEGORY_TABS.find((tab) => tab.value === category)?.label ?? category
  );
}

function getFormatLabel(format: string, fallback: string) {
  const labels: Record<string, string> = {
    LIMITED_OVERS: "Limited-over badges",
    TEST: "Test match badges",
    BOX_CRICKET: "Box cricket badges",
  };

  return labels[format] ?? fallback;
}

function getBadgeProgress(badge: CricketProfileBadgeItem) {
  if (badge.threshold <= 0) {
    return badge.isUnlocked ? 100 : 0;
  }

  return Math.min(
    100,
    Math.max(0, (badge.currentValue / badge.threshold) * 100),
  );
}

function getBadgeIcon(category: CricketProfileBadgeCategory, groupKey: string) {
  const normalizedKey = groupKey.toUpperCase();

  if (
    normalizedKey.includes("RUN") ||
    normalizedKey.includes("FOUR") ||
    normalizedKey.includes("SIX")
  ) {
    return Target;
  }

  if (normalizedKey.includes("WICKET") || normalizedKey.includes("ECONOMY")) {
    return Trophy;
  }

  if (normalizedKey.includes("CATCH") || normalizedKey.includes("STUMP")) {
    return ShieldCheck;
  }

  switch (category) {
    case "BOWLING":
      return Trophy;

    case "FIELDING":
      return ShieldCheck;

    case "BATTING":
    default:
      return Star;
  }
}

function BadgeCategoryTabs({
  value,
  onChange,
}: {
  value: CricketProfileBadgeCategory;
  onChange: (category: CricketProfileBadgeCategory) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {BADGE_CATEGORY_TABS.map((tab) => {
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "min-h-10 rounded-full px-3 text-sm font-bold transition-all",
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

function BadgeProgressRing({
  badge,
  category,
  groupKey,
}: {
  badge: CricketProfileBadgeItem;
  category: CricketProfileBadgeCategory;
  groupKey: string;
}) {
  const Icon = getBadgeIcon(category, groupKey);

  const progress = getBadgeProgress(badge);

  return (
    <div className="relative">
      <div
        className={cn(
          "relative flex h-[78px] w-[78px] items-center justify-center rounded-full border-[5px]",
          badge.isUnlocked
            ? "border-(--color-brand) bg-(--color-bg-tint)"
            : "border-(--color-bg-border) bg-(--color-bg-base)",
        )}
        style={{
          background: badge.isUnlocked
            ? `conic-gradient(
                var(--color-brand) ${progress}%,
                var(--color-bg-border) ${progress}% 100%
              )`
            : undefined,
        }}
      >
        <div
          className={cn(
            "flex h-[62px] w-[62px] items-center justify-center rounded-full",
            badge.isUnlocked
              ? "bg-(--color-bg-card)"
              : "bg-(--color-bg-border)",
          )}
        >
          <Icon
            className={cn(
              "h-7 w-7",
              badge.isUnlocked
                ? "text-(--color-brand)"
                : "text-(--color-text-muted)",
            )}
          />
        </div>
      </div>

      {badge.isUnlocked ? (
        <span className="absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-(--color-four) px-1 text-[9px] font-black text-white">
          {badge.repeatCount > 1 ? (
            `×${badge.repeatCount}`
          ) : (
            <Check className="h-3 w-3" />
          )}
        </span>
      ) : (
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-(--color-text-muted) text-white">
          <LockKeyhole className="h-3 w-3" />
        </span>
      )}
    </div>
  );
}

function BadgeCard({
  badge,
  category,
  groupKey,
}: {
  badge: CricketProfileBadgeItem;
  category: CricketProfileBadgeCategory;
  groupKey: string;
}) {
  const progress = getBadgeProgress(badge);

  return (
    <article
      className={cn(
        "flex min-w-[116px] flex-col items-center rounded-2xl border p-3 text-center",
        badge.isUnlocked
          ? "border-(--color-brand)/20 bg-(--color-bg-card)"
          : "border-(--color-bg-border) bg-(--color-bg-base)",
      )}
    >
      <BadgeProgressRing
        badge={badge}
        category={category}
        groupKey={groupKey}
      />

      <h4
        className={cn(
          "mt-3 line-clamp-2 min-h-9 text-xs font-bold leading-[18px]",
          badge.isUnlocked
            ? "text-(--color-text-primary)"
            : "text-(--color-text-muted)",
        )}
      >
        {badge.name}
      </h4>

      <p className="mt-1 text-[10px] text-(--color-text-muted)">
        {badge.currentValue}/{badge.threshold}
      </p>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-(--color-bg-border)">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            badge.isUnlocked ? "bg-(--color-four)" : "bg-(--color-brand)",
          )}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </article>
  );
}

function BadgeGroup({
  group,
  category,
}: {
  group: CricketProfileBadgeGroup;
  category: CricketProfileBadgeCategory;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-(--color-text-primary)">
            {group.label}
          </h3>

          <p className="mt-0.5 text-[11px] text-(--color-text-muted)">
            {group.unlockedCount} of {group.totalCount} unlocked
          </p>
        </div>

        <span className="rounded-full bg-(--color-bg-tint) px-2.5 py-1 text-[10px] font-bold text-(--color-brand)">
          Current: {group.currentValue}
        </span>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2">
        <div className="flex min-w-max gap-3">
          {group.badges.map((badge) => (
            <BadgeCard
              key={badge.badgeId}
              badge={badge}
              category={category}
              groupKey={group.key}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BadgeFormatSection({
  section,
  category,
}: {
  section: CricketProfileBadgeSection;
  category: CricketProfileBadgeCategory;
}) {
  const totalBadges = section.groups.reduce(
    (total, group) => total + group.totalCount,
    0,
  );

  const totalUnlocked = section.groups.reduce(
    (total, group) => total + group.unlockedCount,
    0,
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
      <div className="flex items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3">
        <div>
          <h2 className="font-(family-name:--font-display) text-lg font-black uppercase tracking-wide text-(--color-text-primary)">
            {getFormatLabel(section.matchFormat, section.label)}
          </h2>

          <p className="mt-0.5 text-[11px] text-(--color-text-secondary)">
            {totalUnlocked} of {totalBadges} badges unlocked
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-bg-card)">
          <Award className="h-5 w-5 text-(--color-brand)" />
        </div>
      </div>

      <div className="divide-y divide-(--color-bg-border)">
        {section.groups.map((group) => (
          <div key={group.key} className="p-4">
            <BadgeGroup group={group} category={category} />
          </div>
        ))}
      </div>
    </section>
  );
}

function BadgesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({
        length: 2,
      }).map((_, sectionIndex) => (
        <div
          key={sectionIndex}
          className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)"
        >
          <div className="flex items-center justify-between border-b border-(--color-bg-border) p-4">
            <div className="space-y-2">
              <div className="h-5 w-40 animate-pulse rounded bg-(--color-bg-border)" />
              <div className="h-3 w-28 animate-pulse rounded bg-(--color-bg-border)" />
            </div>

            <div className="h-10 w-10 animate-pulse rounded-xl bg-(--color-bg-border)" />
          </div>

          <div className="space-y-5 p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-(--color-bg-border)" />

            <div className="flex gap-3 overflow-hidden">
              {Array.from({
                length: 3,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-[150px] min-w-[116px] animate-pulse rounded-2xl bg-(--color-bg-border)"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BadgesEmptyState({
  message,
  category,
}: {
  message?: string;
  category: CricketProfileBadgeCategory;
}) {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-6 py-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-(--color-bg-tint)">
        <Award className="h-8 w-8 text-(--color-brand)" />
      </div>

      <h3 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
        No {getCategoryLabel(category)} badges yet
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-(--color-text-secondary)">
        {message ??
          `${getCategoryLabel(category)} badges will appear here when badge definitions are available.`}
      </p>
    </div>
  );
}

function BadgesError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--color-bg-tint)">
        <Award className="h-7 w-7 text-(--color-brand)" />
      </div>

      <h3 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
        Unable to load badges
      </h3>

      <p className="mt-2 text-sm text-(--color-text-secondary)">
        Something went wrong while loading badge progress.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mx-auto mt-5 flex items-center gap-2 rounded-xl bg-(--color-brand) px-5 py-2.5 text-sm font-bold text-white"
      >
        <RefreshCcw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}

export function BadgesTab() {
  const [activeCategory, setActiveCategory] =
    useState<CricketProfileBadgeCategory>("BATTING");

  const { currentData, isLoading, isFetching, isError, refetch } =
    useGetMyCricketProfileBadgesQuery(activeCategory);

  const sections = useMemo(() => currentData?.sections ?? [], [currentData]);

  const showSkeleton = isLoading || (isFetching && !currentData);

  const emptyMessage = currentData?.emptyState?.message;

  return (
    <section className="flex flex-col gap-5 p-4">
      <BadgeCategoryTabs value={activeCategory} onChange={setActiveCategory} />

      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
            {getCategoryLabel(activeCategory)} badges
          </h2>

          <p className="mt-0.5 text-xs text-(--color-text-secondary)">
            Track your milestones and unlock achievements
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-bg-tint)">
          <Award className="h-5 w-5 text-(--color-brand)" />
        </div>
      </div>

      {showSkeleton ? (
        <BadgesSkeleton />
      ) : isError ? (
        <BadgesError
          onRetry={() => {
            void refetch();
          }}
        />
      ) : sections.length === 0 ? (
        <BadgesEmptyState message={emptyMessage} category={activeCategory} />
      ) : (
        <div className="space-y-5">
          {sections.map((section) => (
            <BadgeFormatSection
              key={section.matchFormat}
              section={section}
              category={activeCategory}
            />
          ))}
        </div>
      )}
    </section>
  );
}
