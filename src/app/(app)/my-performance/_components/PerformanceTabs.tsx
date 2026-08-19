// src/app/(app)/my-performance/_components/PerformanceTabs.tsx

import type { PerformanceTabs as PerformanceTabsAvailability } from "@/types/cricket/performance";

export type PerformanceTab = "BATTING" | "BOWLING";
// | "COMPARE" | "FACE_OFF";

type PerformanceTabsProps = {
  activeTab: PerformanceTab;
  tabs: PerformanceTabsAvailability;
  onTabChange: (tab: PerformanceTab) => void;
};

type TabItem = {
  key: PerformanceTab;
  label: string;
  available: boolean;
};

export default function PerformanceTabs({
  activeTab,
  tabs,
  onTabChange,
}: PerformanceTabsProps) {
  const tabItems: TabItem[] = [
    {
      key: "BATTING",
      label: "Batting",
      available: tabs.battingAvailable,
    },
    {
      key: "BOWLING",
      label: "Bowling",
      available: tabs.bowlingAvailable,
    },
    // {
    //   key: "COMPARE",
    //   label: "Compare",
    //   available: tabs.compareAvailable,
    // },
    // {
    //   key: "FACE_OFF",
    //   label: "Face Off",
    //   available: tabs.faceOffAvailable,
    // },
  ];

  return (
    <nav
      aria-label="Performance categories"
      className="sticky top-0 z-20 border-b border-(--color-bg-border) bg-(--color-bg-card)/95 shadow-sm backdrop-blur"
    >
      <div className="grid grid-cols-2">
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              disabled={!tab.available}
              aria-selected={isActive}
              role="tab"
              onClick={() => {
                if (tab.available) {
                  onTabChange(tab.key);
                }
              }}
              className={[
                "relative min-w-0 px-1 py-4 text-center",
                "font-(family-name:--font-display)",
                "text-xs font-bold uppercase tracking-wide",
                "transition-colors duration-200",
                isActive
                  ? "text-(--color-brand)"
                  : "text-(--color-text-secondary)",
                tab.available
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-40",
              ].join(" ")}
            >
              <span className="block truncate">{tab.label}</span>

              {isActive && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-t-full bg-(--color-brand)" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
