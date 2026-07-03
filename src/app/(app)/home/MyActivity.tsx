"use client";

import { useRouter } from "next/navigation";
import type { HomeActivityItem } from "@/types/home";
import { getIcon } from "./iconMap";

type Props = { items: HomeActivityItem[] };

export default function MyActivity({ items }: Props) {
  const router = useRouter();

  if (!items || items.length === 0) return null;

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mx-3">
      <h2 className="mb-3 font-display text-[13px] font-black uppercase tracking-widest text-[#0D1B3E]">
        My Activity
      </h2>
      <div className="flex divide-x divide-[#E8ECF2] overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_1px_4px_rgba(13,27,62,0.06)]">
        {sorted.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.route)}
              className="flex flex-1 items-center gap-2 px-2 py-2 active:scale-95 transition-transform"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2F5BFF] shadow-[0_4px_12px_rgba(47,91,255,0.25)]">
                <Icon size={16} strokeWidth={2} color="white" />
              </div>
              <div className="flex flex-1 flex-col items-start gap-1">
                <p className="font-display text-[18px] font-black leading-none text-[#0D1B3E]">
                  {item.value}
                </p>
                <p className="text-start text-[10px] font-semibold leading-tight text-[#6B7280]">
                  {item.title}
                </p>
                <span className="text-[10px] font-bold text-[#2F5BFF]">
                  {item.actionText}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
