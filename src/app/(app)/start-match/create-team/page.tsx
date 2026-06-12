"use client";

import { useEffect, useRef, useState } from "react";
import { useHeader } from "@/providers/HeaderProvider";
import { Users, MapPin } from "lucide-react";
import { useCreateTeamMutation } from "@/store/api/teamApi";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";
import Image from "next/image";
import { ImageUploader } from "@/components/common/ImageUploader";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import {
  setActiveTeam,
  setTeamA,
  setTeamB,
} from "@/store/startMatch/startMatchSlice";

export default function CreateTeamPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  const teamType = searchParams.get("team");

  const [createTeam, { isLoading, isError, isSuccess }] =
    useCreateTeamMutation();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [error, setError] = useState("");

  const isValid = name.trim().length >= 2 && city.trim().length >= 2;

  async function createTeamHandler() {
    if (!isValid) {
      setError("Please enter a valid team name and city.");
      return;
    }

    setError("");
    try {
      const response = await createTeam({
        name: name.trim(),
        city: city.trim(),
        ...(logoFile && { logoUrl: logoFile.name }),
        sportType: "CRICKET",
      }).unwrap();

      if (teamType === "A") {
        dispatch(setTeamA(response));
        dispatch(setActiveTeam("A"));
      } else {
        dispatch(setTeamB(response));
        dispatch(setActiveTeam("B"));
      }

      router.push("/start-match/create-player?team=" + response.name);
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        "Failed to create team. Please try again.";

      setError(message);
    }
  }

  return (
    <div className="p-4 bg-slate-50 min-h-full flex flex-col items-center">
      <div className="text-center mt-4 mb-4">
        <h2 className="text-xl font-black text-slate-900 tracking-wide uppercase">
          CREATE NEW TEAM
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Build your squad and dominate the league.
        </p>
      </div>

      <div className="flex items-center justify-center flex-col mb-6">
        <ImageUploader
          uploadText="Upload Team Logo"
          changeText="Change Team Logo"
          onFileSelect={setLogoFile}
        />
      </div>

      {/* Form Fields */}
      <div className="w-full space-y-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
            Team Name
          </label>
          <div className="flex items-center gap-3">
            <Users size={18} className="text-slate-400" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="e.g. MUMBAI XI"
              className="flex-1 outline-none text-base text-slate-800 font-medium"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
            City / Town
          </label>
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-slate-400" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              placeholder="e.g. Bangalore"
              className="flex-1 outline-none text-base text-slate-800 font-medium"
            />
          </div>
        </div>
      </div>
      {error && (
        <div className="mb-4 w-full rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}
      <Button
        onClick={() => createTeamHandler()}
        disabled={!isValid || isLoading}
        fullWidth
        loading={isLoading}
        leftIcon={<span>💾</span>}
      >
        SAVE TEAM
      </Button>
    </div>
  );
}
