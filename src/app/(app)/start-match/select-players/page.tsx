"use client";

import { useEffect } from "react";
import { useHeader } from "@/providers/HeaderProvider";
import { Search, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

const mockPlayers = [
  {
    id: 1,
    name: "Arjun Sharma",
    role: "All Rounder",
    hand: "RHB",
    bowl: "Right-arm Fast",
    profileImageUrl: "bg-slate-800",
  },
  {
    id: 2,
    name: "Priya Verma",
    role: "Top Order Batter",
    hand: "RHB",
    bowl: "",
    profileImageUrl: "bg-slate-900",
  },
  {
    id: 3,
    name: "Rohan Das",
    role: "Wicketkeeper Batter",
    hand: "LHB",
    bowl: "",
    profileImageUrl: "bg-teal-900",
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Bowler",
    hand: "",
    bowl: "Right-arm Leg Spin",
    profileImageUrl: "bg-slate-800",
  },
];

export default function SelectPlayersPage() {
  const { setHeader } = useHeader();
  const router = useRouter();

  useEffect(() => {
    setHeader({
      title: "Select Players",
      showBackButton: true,
      showNotifications: false,
    });
  }, [setHeader]);

  return (
    <div className="p-4 bg-slate-50 min-h-full pb-28">
      {/* Top Card */}
      <div className="bg-[#0b1727] text-white p-4 rounded-xl flex justify-between items-center mb-4 shadow-md">
        <div>
          <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-1">
            Team A Roster
          </p>
          <h2 className="text-lg font-black uppercase">ROYAL CHALLENGERS</h2>
        </div>
        <div className="bg-blue-600/20 border border-blue-500/30 px-3 py-2 rounded-lg text-center">
          <p className="text-[9px] text-blue-200 uppercase font-bold mb-0.5">
            Selected
          </p>
          <p className="text-base font-black text-blue-400">0/11</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm flex items-center px-4 py-3 mb-4">
        <Search className="text-slate-400 mr-3" size={20} />
        <input
          type="text"
          placeholder="Search by name or role..."
          className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400"
        />
      </div>

      {/* Player List */}
      <div className="space-y-3">
        {mockPlayers.map((player) => (
          <label
            key={player.id}
            className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full ${player.profileImageUrl} flex items-center justify-center text-white text-xs`}
              >
                IMG
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {player.name}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {player.role} {player.hand && `• ${player.hand}`}{" "}
                  {player.bowl && `• ${player.bowl}`}
                </p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-slate-200 bg-slate-50"></div>
          </label>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400 italic mt-8">
        No more players in roster
      </p>

      {/* Bottom Sticky Action */}
      <div className="fixed bottom-6 left-4 right-4 flex items-center">
        <button className="flex-1 bg-indigo-400/80 backdrop-blur text-white font-bold py-4 rounded-l-xl uppercase tracking-wider flex items-center justify-center gap-2">
          Confirm Selection &gt;
        </button>
        <button
          onClick={() => router.push("/start-match/add-player")}
          className="bg-blue-800 text-white w-16 h-16 rounded-full flex items-center justify-center -ml-6 z-10 shadow-lg border-4 border-slate-50"
        >
          <UserPlus size={24} />
        </button>
      </div>
    </div>
  );
}
