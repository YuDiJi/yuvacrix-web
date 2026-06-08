"use client";

import { useEffect } from "react";
import { useHeader } from "@/providers/HeaderProvider";
import { Search, SlidersHorizontal, Plus, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const mockTeams = [
  {
    id: 1,
    name: "ROYAL CHALLENGERS",
    location: "Bangalore",
    players: 15,
    logoColor: "bg-slate-900",
  },
  {
    id: 2,
    name: "CHENNAI SUPER KINGS",
    location: "Chennai",
    players: 18,
    logoColor: "bg-blue-900",
  },
  {
    id: 3,
    name: "KOLKATA KNIGHTS",
    location: "Kolkata",
    players: 14,
    logoColor: "bg-slate-950",
  },
  {
    id: 4,
    name: "GUJARAT GIANTS",
    location: "Ahmedabad",
    players: 16,
    logoColor: "bg-slate-800",
  },
];

export default function SelectTeamPage() {
  const { setHeader } = useHeader();
  const router = useRouter();
  const searchParams = useSearchParams();
  const team = searchParams.get("team");

  useEffect(() => {
    setHeader({
      title: `Select Team ${team?.toUpperCase() || ""}`,
      showBackButton: true,
      showNotifications: false,
    });
  }, [setHeader]);

  return (
    <div className="p-4 bg-slate-50 min-h-full relative pb-20">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm flex items-center px-4 py-3 mb-6">
        <Search className="text-slate-400 mr-3" size={20} />
        <input
          type="text"
          placeholder="SEARCH TEAMS, CLUBS, OR REGIONS..."
          className="flex-1 outline-none text-xs font-bold text-slate-700 placeholder:text-slate-400"
        />
        <SlidersHorizontal className="text-slate-400 ml-3" size={18} />
      </div>

      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
        All Teams
      </h3>

      {/* Team List */}
      <div className="space-y-3">
        {mockTeams.map((team) => (
          <div
            key={team.id}
            className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl ${team.logoColor} flex items-center justify-center text-white text-xs`}
              >
                {/* Placeholder for actual image */}
                LOGO
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {team.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {team.location} • {team.players} Players
                </p>
              </div>
            </div>
            <ChevronRight className="text-slate-300" size={20} />
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => router.push("/start-match/create-team")}
        className="fixed bottom-12 right-[36%] w-14 h-14 bg-blue-800 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
