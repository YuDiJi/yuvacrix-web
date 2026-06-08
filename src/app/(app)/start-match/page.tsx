"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/providers/HeaderProvider";
import { useRouter } from "next/navigation";
import { Users, Tv, User, ClipboardList, Video, Users2 } from "lucide-react";
import type { Team } from "./types";

export default function StartMatchPage() {
  const { setHeader } = useHeader();
  const router = useRouter();

  // Mock state: Replace with your Redux store (startMatchSlice)
  const [teamA, setTeamA] = useState<Team | null>(null);
  const [teamB, setTeamB] = useState<Team | null>(null);

  useEffect(() => {
    setHeader({
      title: teamA && teamB ? "START A MATCH" : "TEAM SELECTION",
      showBackButton: true,
      showNotifications: false,
    });
  }, [setHeader, teamA, teamB]);

  const isTeamsSelected = teamA && teamB;

  if (!isTeamsSelected) {
    return (
      <div className="flex flex-col p-4 gap-6 min-h-full">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">TEAM SELECTION</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>STEP 1 OF 5</span>
            <div className="flex gap-1 flex-1 ml-2">
              <div className="h-1 bg-blue-600 rounded w-8"></div>
              <div className="h-1 bg-slate-200 rounded flex-1"></div>
              <div className="h-1 bg-slate-200 rounded flex-1"></div>
              <div className="h-1 bg-slate-200 rounded flex-1"></div>
              <div className="h-1 bg-slate-200 rounded flex-1"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 relative">
          {/* Team A Card */}
          <button
            onClick={() => router.push("/start-match/select-team?team=A")}
            className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-100 rounded-2xl gap-3 shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Users size={24} />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900">SELECT TEAM A</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Home Team
              </p>
            </div>
          </button>

          {/* VS Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-800 text-white text-xs italic font-bold rounded-full flex items-center justify-center border-4 border-white shadow-sm">
            VS
          </div>

          {/* Team B Card */}
          <button
            onClick={() => router.push("/start-match/select-team?team=B")}
            className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-100 rounded-2xl gap-3 shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Users size={24} />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900">SELECT TEAM B</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Opponent Team
              </p>
            </div>
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 border border-slate-100 mt-2">
          <Tv className="text-blue-500" size={24} />
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">
              Match Details
            </p>
            <p className="text-sm font-medium text-slate-800">
              Please select teams to proceed
            </p>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button
            disabled
            className="w-full py-4 bg-slate-200 text-slate-400 font-bold rounded-xl uppercase tracking-wide"
          >
            Continue &gt;
          </button>

          {/* DEV HELPER: Remove in production */}
          <button
            onClick={() => {
              setTeamA({
                id: "1",
                name: "Black Panther",
                location: "Mumbai",
                playersCount: 11,
                shortName: "BP",
              });
              setTeamB({
                id: "2",
                name: "Team 122",
                location: "Mumbai",
                playersCount: 11,
                shortName: "1",
              });
            }}
            className="mt-4 text-xs text-blue-500 underline text-center w-full"
          >
            (Dev: Simulate Teams Selected)
          </button>
        </div>
      </div>
    );
  }

  // SCREEN 8: MATCH DETAILS
  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* Dark Header Extension */}
      <div className="bg-[#0b1727] px-6 py-6 flex items-center justify-between text-white">
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => router.push("/start-match/select-players")}
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-slate-500 flex items-center justify-center text-2xl font-bold border-2 border-transparent">
              {teamA.shortName}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1 rounded-full border-2 border-[#0b1727]">
              <User size={12} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold uppercase">{teamA.name}</p>
            <span className="text-[10px] bg-blue-900/50 px-2 py-0.5 rounded text-blue-200">
              SQUAD (2)
            </span>
          </div>
        </div>

        <div className="w-8 h-8 bg-white text-[#0b1727] text-[10px] italic font-black rounded flex items-center justify-center rotate-45">
          <span className="-rotate-45">VS</span>
        </div>

        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => router.push("/start-match/select-players")}
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold border-2 border-transparent">
              {teamB.shortName}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1 rounded-full border-2 border-[#0b1727]">
              <User size={12} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold uppercase">{teamB.name}</p>
            <span className="text-[10px] bg-blue-900/50 px-2 py-0.5 rounded text-blue-200">
              SQUAD (3)
            </span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 space-y-4">
        {/* Match Type */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-2 border-red-500">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">
            Match Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-1.5 bg-blue-800 text-white text-xs font-semibold rounded-full">
              LIMITED OVERS
            </button>
            <button className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
              BOX/TURF CRICKET
            </button>
            <button className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
              PAIR CRICKET
            </button>
            <button className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
              TEST MATCH
            </button>
            <button className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
              THE HUNDRED
            </button>
          </div>
        </div>

        {/* Overs */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-2 border-red-500 flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              No. of Overs <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              defaultValue={20}
              className="w-full border-b border-slate-200 pb-1 text-sm font-medium outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Overs Per Bowler
            </label>
            <div className="flex justify-between items-end border-b border-slate-200 pb-1">
              <input
                type="number"
                defaultValue={4}
                className="w-full text-sm font-medium outline-none"
              />
              <button className="text-[10px] font-bold text-blue-700 whitespace-nowrap">
                POWER PLAY &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Location & Time */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-2 border-red-500 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              City / Town <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Mumbai"
              className="w-full border-b border-slate-200 pb-1 text-sm font-medium outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Ground <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Search Ground"
              className="w-full border-b border-slate-200 pb-1 text-sm font-medium outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Date & Time
            </label>
            <input
              type="text"
              defaultValue="Sun, May 24 2026 01:24 PM"
              className="w-full border-b border-slate-200 pb-1 text-sm font-medium outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Ball Type */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-2 border-red-500">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Ball Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-green-400 shadow-inner border-2 border-green-300 relative overflow-hidden flex items-center justify-center">
                <div className="w-full h-[2px] bg-green-200/50 absolute rotate-45"></div>
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase">
                Tennis
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-red-600 shadow-inner border-2 border-red-500 relative flex items-center justify-center">
                <div className="w-full h-2 bg-red-700/30 absolute"></div>
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase">
                Leather
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-orange-500 shadow-inner border-2 border-orange-400 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full border-2 border-white/50"></div>
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase">
                Other
              </span>
            </div>
          </div>
        </div>

        {/* Wagon Wheel */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase">
              Wagon Wheel
            </h4>
            <p className="text-xs text-slate-500">
              Show Wagon Wheel for 1s, 2s, & 3s
            </p>
          </div>
          {/* Mock Switch */}
          <div className="w-12 h-6 bg-blue-800 rounded-full p-1 flex justify-end cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>

        {/* Pitch Type */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-2 border-red-500">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Pitch Type
          </label>
          <div className="flex flex-wrap gap-2">
            {["ROUGH", "CEMENT", "TURF", "ASTROTURF", "MATTING"].map((pt) => (
              <button
                key={pt}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md"
              >
                {pt}
              </button>
            ))}
          </div>
        </div>

        {/* Match Officials */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-2 border-red-500">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-4">
            Match Officials
          </label>
          <div className="flex justify-between px-2">
            {[
              { icon: User, label: "UMPIRES" },
              { icon: ClipboardList, label: "SCORERS" },
              { icon: Video, label: "STREAMER" },
              { icon: Users2, label: "OTHERS" },
            ].map((official) => (
              <div
                key={official.label}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 bg-slate-50">
                  <official.icon size={20} />
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">
                  {official.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-auto flex sticky bottom-0">
        <button className="flex-1 py-4 bg-white text-slate-600 font-bold text-xs uppercase tracking-wide border-t border-slate-200">
          Schedule Match
        </button>
        <button className="flex-1 py-4 bg-blue-800 text-white font-bold text-xs uppercase tracking-wide border-t border-blue-800">
          Next (Toss)
        </button>
      </div>
    </div>
  );
}
