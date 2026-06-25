import React, { useState } from "react";
import {
  Target,
  Hand,
  RefreshCcw,
  Activity,
  ShieldAlert,
  Zap,
  HeartCrack,
  MoveRight,
  Hammer,
  UserX,
  LogOut,
  Copy,
  Ban,
  Clock,
  DoorOpen,
} from "lucide-react";
import { WicketType } from "@/types/scoring";

const OUT_OPTIONS: {
  id: WicketType;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "BOWLED", label: "Bowled", icon: Target }, ////direct - record bowled wicket
  { id: "CAUGHT", label: "Caught", icon: Hand },
  { id: "CAUGHT_BEHIND", label: "Caught Behind", icon: Hand },
  { id: "CAUGHT_AND_BOWLED", label: "Caught & bowled", icon: RefreshCcw },
  { id: "RUN_OUT", label: "Run out", icon: Activity },
  { id: "LBW", label: "LBW", icon: ShieldAlert },
  { id: "STUMPED", label: "Stumped", icon: Zap },
  { id: "RETIRED_HURT", label: "Retired hurt", icon: HeartCrack },
  { id: "MANKADED", label: "Run out (mankaded)", icon: MoveRight },
  { id: "HIT_WICKET", label: "Hit wicket", icon: Hammer },
  { id: "ABSENT_HURT", label: "Absent Hurt", icon: UserX },
  { id: "RETIRED_OUT", label: "Retired out", icon: LogOut },
  { id: "HIT_BALL_TWICE", label: "Hit the ball twice", icon: Copy },
  { id: "OBSTRUCTING_FIELD", label: "Obstructing the field", icon: Ban },
  { id: "TIMED_OUT", label: "Timed out", icon: Clock },
  { id: "RETIRED", label: "Retired", icon: DoorOpen },
];

interface WicketTypeSelectorProps {
  onSelect: (wicketType: WicketType) => void;
}

const WicketTypeSelector = ({ onSelect }: WicketTypeSelectorProps) => {
  const [showAll, setShowAll] = useState(true);

  const displayedOptions = showAll ? OUT_OPTIONS : OUT_OPTIONS.slice(0, 8);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6 pt-2">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="text-slate-500 text-sm font-medium tracking-wide">
          Select out type
        </span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>
      <div className="grid grid-cols-4 gap-y-6 gap-x-2">
        {displayedOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="flex flex-col items-center group transition-all"
          >
            {/* Circular Icon Container */}
            <div className="w-16 h-16 rounded-full bg-[#f3f4f6] flex items-center justify-center text-slate-700 mb-2 group-hover:bg-[#e5e7eb] group-active:scale-95 transition-all">
              <option.icon size={24} strokeWidth={1.5} />
            </div>

            {/* Label */}
            <span className="text-[10px] text-center text-slate-700 leading-tight font-medium px-1">
              {option.label}
            </span>
          </button>
        ))}
      </div>
      {/* Show More / Show Less Toggle Button */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="w-full text-[#0f766e] text-sm font-semibold mt-8 mb-2 hover:opacity-80 active:scale-95 transition-all"
      >
        {showAll ? "Show less" : "Show more"}
      </button>
    </div>
  );
};

export default WicketTypeSelector;
