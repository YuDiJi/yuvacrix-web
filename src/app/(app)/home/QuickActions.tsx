"use client";

import { Plus, Trophy, Edit2, Calendar, Users } from "lucide-react";
import { QUICK_ACTIONS } from "./mockData";

const ICON_MAP: Record<string, React.ElementType> = {
  plus: Plus,
  trophy: Trophy,
  edit: Edit2,
  calendar: Calendar,
  users: Users,
};

export default function QuickActions() {
  return (
    <div>
      <h2 className="mb-3 px-4 font-display text-[13px] font-black uppercase tracking-widest text-[#0D1B3E]">
        Quick Actions
      </h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {QUICK_ACTIONS.map((action) => {
          const Icon = ICON_MAP[action.icon] ?? Plus;
          return (
            <button
              key={action.id}
              className="flex flex-shrink-0 flex-col items-center gap-2.5 rounded-2xl border border-[#E8ECF2] bg-white px-4 py-4 shadow-[0_1px_4px_rgba(13,27,62,0.06)] active:scale-95 transition-transform"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2F5BFF] shadow-[0_4px_12px_rgba(47,91,255,0.3)]">
                <Icon size={20} strokeWidth={2} color="white" />
              </div>
              <span className="whitespace-pre-line text-center text-[11px] font-bold leading-tight text-[#0D1B3E]">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
