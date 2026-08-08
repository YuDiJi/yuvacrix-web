"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Shield, AlertCircle } from "lucide-react";

import { cn } from "@/lib/cn";
import { useGetTournamentDetailsQuery } from "@/store/api/tournamentApi";
import About from "./_components/About";
import Teams from "./_components/Teams";
import { S3Image } from "@/components/common/S3Image";
import Matches from "./_components/Matches";
import PointsTable from "./_components/PointsTable";
import RoundsGroups from "./_components/RoundsGroups";
import LeaderboardPage from "./_components/leaderboard/LeaderboardPage";
import StatsPage from "./_components/stats/StatsPage";
import HeroesPage from "./_components/heroes/HeroesPage";

const TABS = [
  "About",
  "Matches",
  "Teams",
  "Rounds & Groups",
  "Points Table",
  "Leaderboard",
  "Heroes",
  "Stats",
  // "Sponsors",
];

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
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-(--color-bg-base)">
      {/* Only this container scrolls */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-hide">
        {/* Tournament hero */}
        <div className="relative bg-(--color-navy) px-4 pb-4 pt-4 text-white">
          {tournament.coverImageUrl && (
            <span className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <S3Image
                imageKey={tournament.coverImageUrl}
                alt={tournament.name}
                width={800}
                height={400}
                className="h-full w-full scale-105 object-cover opacity-30 blur-sm"
                fallback={null}
              />
            </span>
          )}

          <div className="relative z-10 px-4 py-4 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white p-1 shadow-sm">
                {tournament.logoUrl ? (
                  <S3Image
                    imageKey={tournament.logoUrl}
                    alt={tournament.name}
                    width={80}
                    height={80}
                    className="h-full w-full rounded-full object-cover"
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

              <div className="min-w-0 flex-1">
                <h1 className="truncate font-(family-name:--font-display) text-2xl font-black uppercase tracking-wide text-white">
                  {tournament.name}
                </h1>

                <p className="mt-1 truncate text-sm font-medium text-white/80">
                  {dateRange}
                </p>

                <p className="mt-0.5 truncate text-sm font-medium text-white/80">
                  {tournament.viewsCount} Views
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky tabs */}
        <div className="sticky top-0 z-40 border-b border-(--color-bg-border) bg-white shadow-sm">
          <div className="scrollbar-hide flex items-center overflow-x-auto px-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "shrink-0 whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-bold transition-all",
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

        {/* Tab content */}
        <div className="min-h-full">
          {activeTab === "About" && <About />}
          {activeTab === "Matches" && <Matches isAdmin={tournament.isAdmin} />}
          {activeTab === "Teams" && <Teams isAdmin={tournament.isAdmin} />}
          {activeTab === "Rounds & Groups" && <RoundsGroups />}
          {activeTab === "Points Table" && <PointsTable />}

          {activeTab === "Leaderboard" && (
            <LeaderboardPage tournamentId={tournamentId} />
          )}

          {activeTab === "Heroes" && <HeroesPage tournamentId={tournamentId} />}

          {activeTab === "Stats" && <StatsPage tournamentId={tournamentId} />}
        </div>
      </div>
    </div>
  );
}
