"use client";

import { Calendar, Edit2, Trophy } from "lucide-react";
import { MY_ACTIVITY } from "./mockData";

const ICON_MAP: Record<string, React.ElementType> = {
  calendar: Calendar,
  edit: Edit2,
  trophy: Trophy,
};

export default function MyActivity() {
  return (
    <div className="mx-3">
      <h2 className="mb-3 font-display text-[13px] font-black uppercase tracking-widest text-[#0D1B3E]">
        My Activity
      </h2>
      <div className="flex divide-x divide-[#E8ECF2] overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_1px_4px_rgba(13,27,62,0.06)]">
        {MY_ACTIVITY.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? Calendar;
          return (
            <div
              key={item.id ?? item.label}
              className="flex flex-1 items-center gap-2 px-2 py-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F5BFF] shadow-[0_4px_12px_rgba(47,91,255,0.25)]">
                <Icon size={16} strokeWidth={2} color="white" />
              </div>
              <div className="flex flex-1 flex-col items-start gap-1">
                <p className="font-display text-[18px] font-black leading-none text-[#0D1B3E]">
                  {item.value}
                </p>
                <p className="text-start text-[10px] font-semibold leading-tight text-[#6B7280]">
                  {item.label}
                </p>
                <button className="text-[10px] font-bold text-[#2F5BFF]">
                  {item.link}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
