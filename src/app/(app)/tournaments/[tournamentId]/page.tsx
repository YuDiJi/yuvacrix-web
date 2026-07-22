// return (
//   <div className="flex flex-col min-h-dvh bg-(--color-bg-base) w-full">

//   <div className="sticky top-0 z-20 bg-white border-b border-(--color-bg-border)">
//         <div className="flex items-center overflow-x-auto scrollbar-hide px-2">
//           {TABS.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={cn(
//                 "whitespace-nowrap px-4 py-3.5 text-sm font-bold transition-all border-b-2",
//                 activeTab === tab
//                   ? "border-(--color-brand) text-(--color-brand)"
//                   : "border-transparent text-(--color-text-secondary) opacity-80",
//               )}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Shield, AlertCircle } from "lucide-react";

import { cn } from "@/lib/cn";
import {
  useGetTournamentDetailsQuery,
  useGetTournamentDashboardQuery,
} from "@/store/api/tournamentApi";
import About from "./_components/About";
import Teams from "./_components/Teams";
import { S3Image } from "@/components/common/S3Image";
import Matches from "./_components/Matches";
import PointsTable from "./_components/PointsTable";

const TABS = ["About", "Teams", "Matches", "Points Table", "Sponsors"];

function formatDate(date?: string | null) {
  if (!date) return "TBA";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function TournamentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.tournamentId as string;

  const [activeTab, setActiveTab] = useState("Teams");

  const {
    data: tournament,
    isLoading: isTournamentLoading,
    isError: isTournamentError,
  } = useGetTournamentDetailsQuery(tournamentId);

  const isLoading = isTournamentLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col bg-(--color-bg-base)">
        <div className="bg-(--color-navy) px-4 py-6">
          <div className="h-20 animate-pulse rounded-xl bg-white/10" />
        </div>

        <div className="p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl bg-(--color-bg-card)"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isTournamentError || !tournament) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-(--color-bg-base) p-4">
        <div className="rounded-xl bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <AlertCircle className="mx-auto mb-3 text-(--color-live)" />
          <h2 className="font-(family-name:--font-display) text-xl font-black text-(--color-navy)">
            Tournament not found
          </h2>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 rounded-xl bg-(--color-brand) px-5 py-3 text-sm font-bold text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const startDate = formatDate(tournament.startDate);
  const endDate = formatDate(tournament.endDate);
  const dateRange = `${startDate} to ${endDate}`;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-(--color-bg-base)">
      <div className="relative bg-(--color-navy) px-4 pb-4 pt-4 text-white">
        {tournament?.coverImageUrl && (
          <span className="pointer-events-none absolute inset-0 z-0">
            <S3Image
              imageKey={tournament.coverImageUrl}
              alt={tournament.name}
              width={800}
              height={400}
              className="h-full w-full object-cover opacity-30 blur-sm scale-105"
              fallback={null}
            />
          </span>
        )}
        <div className="bg-(--color-navy) px-4 py-4 text-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-20 h-20 rounded-full border-2 border-white/20 bg-white flex items-center justify-center overflow-hidden shadow-sm p-1">
              {tournament?.logoUrl ? (
                <S3Image
                  imageKey={tournament?.logoUrl}
                  alt={tournament.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-full"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-(--color-bg-tint)">
                      <Shield size={34} className="text-(--color-brand)" />
                    </div>
                  }
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-(--color-bg-tint)">
                  <Shield size={34} className="text-(--color-brand)" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-(family-name:--font-display) text-2xl font-black uppercase tracking-wide truncate text-white">
                {tournament.name}
              </h1>
              <p className="text-sm font-medium text-white/80 mt-1 truncate">
                {dateRange}
              </p>
              <p className="text-sm font-medium text-white/80 mt-0.5 truncate">
                {tournament.viewsCount} Views
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-20 border-b border-(--color-bg-border) bg-white">
        <div className="scrollbar-hide flex items-center overflow-x-auto px-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-bold transition-all",
                activeTab === tab
                  ? "border-(--color-brand) text-(--color-brand)"
                  : "border-transparent text-(--color-text-secondary) opacity-80",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "About" && <About />}
      {activeTab === "Teams" && <Teams />}
      {activeTab === "Matches" && <Matches />}
      {activeTab === "Points Table" && <PointsTable />}
      {activeTab === "Sponsors" && <div>Sponsors</div>}
    </div>
  );
}
