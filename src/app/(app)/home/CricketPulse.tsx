"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { HomeCricketPulse } from "@/types/home";
import { getIcon } from "./iconMap";

type Props = { pulses: HomeCricketPulse[] };

const FALLBACK_GRADIENTS = [
  "from-[#1B3FA0] to-[#0D1B3E]",
  "from-[#F59E0B] to-[#D97706]",
  "from-[#16A34A] to-[#15803D]",
  "from-[#DC2626] to-[#991B1B]",
  "from-[#7C3AED] to-[#4C1D95]",
];

export default function CricketPulse({ pulses }: Props) {
  const router = useRouter();

  if (!pulses || pulses.length === 0) return null;

  const sorted = [...pulses].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="font-display text-[13px] font-black uppercase tracking-widest text-[#0D1B3E]">
          Cricket Pulse
        </h2>
        <button
          onClick={() => router.push("/pulse")}
          className="flex items-center gap-0.5 text-[11px] font-bold text-[#2F5BFF]"
        >
          See All <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {sorted.map((item, idx) => {
          const TagIcon = getIcon(item.tagIcon);
          const fallbackGradient =
            FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length];

          return (
            <button
              key={item.id}
              onClick={() => item.route && router.push(item.route)}
              disabled={!item.route}
              className="flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_2px_8px_rgba(13,27,62,0.08)] text-left active:scale-95 transition-transform disabled:active:scale-100"
            >
              {/* Banner */}
              <div className="relative h-20 w-full overflow-hidden">
                {item.backgroundImageUrl || item.imageUrl ? (
                  <Image
                    src={(item.backgroundImageUrl ?? item.imageUrl)!}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={`h-full w-full bg-linear-to-br ${fallbackGradient} flex items-center justify-center`}
                  >
                    <TagIcon
                      size={32}
                      strokeWidth={1.5}
                      color="white"
                      opacity={0.5}
                    />
                  </div>
                )}
                {/* Tag chip */}
                <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                  <TagIcon size={9} color="white" />
                  <span className="text-[9px] font-bold text-white">
                    {item.tagText}
                  </span>
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between px-3 py-2.5">
                <div>
                  <p className="text-[10px] font-bold text-[#0D1B3E] leading-snug line-clamp-2">
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className="mt-0.5 text-[9px] text-[#6B7280] leading-snug line-clamp-2">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {item.route && (
                  <div className="mt-2.5 flex items-center gap-1 self-start rounded-full bg-[#F0F3FF] px-2.5 py-1">
                    <span className="text-[10px] font-bold text-[#2F5BFF]">
                      View
                    </span>
                    <ArrowRight size={10} className="text-[#2F5BFF]" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
