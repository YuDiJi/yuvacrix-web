"use client";

import { useRouter } from "next/navigation";
import type { HomeQuickAction } from "@/types/cricket/home";
import { getIcon } from "./iconMap";

type Props = { actions: HomeQuickAction[] };

export default function QuickActions({ actions }: Props) {
  const router = useRouter();

  if (!actions || actions.length === 0) return null;

  const enabled = actions
    .filter((a) => a.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  function handleAction(action: HomeQuickAction) {
    if (action.actionType === "NAVIGATION" && action.route) {
      router.push(action.route);
    } else if (action.actionType === "EXTERNAL_LINK" && action.route) {
      window.open(action.route, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div>
      <h2 className="mb-3 px-4 font-display text-[13px] font-black uppercase tracking-widest text-[#0D1B3E]">
        Quick Actions
      </h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {enabled.map((action) => {
          const Icon = getIcon(action.icon);
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              className="flex shrink-0 flex-col items-center gap-2.5 rounded-2xl border border-[#E8ECF2] bg-white px-4 py-4 shadow-[0_1px_4px_rgba(13,27,62,0.06)] active:scale-95 transition-transform"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2F5BFF] shadow-[0_4px_12px_rgba(47,91,255,0.3)]">
                <Icon size={20} strokeWidth={2} color="white" />
              </div>
              <span className="whitespace-pre-line text-center text-[11px] font-bold leading-tight text-[#0D1B3E]">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
