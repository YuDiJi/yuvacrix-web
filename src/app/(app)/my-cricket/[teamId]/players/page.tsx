"use client";

import { Users, AlertCircle, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import {
  useGetTeamDetailQuery,
  useGetTeamMembersQuery,
} from "@/store/api/teamApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { PlayerList } from "@/components/Players/Playerlist";
import { PlayerListSkeleton } from "@/components/common/loaders/Skeletonloader";

import { S3Image } from "@/components/common/S3Image";

export default function PlayersPage() {
  const params = useParams();

  const teamId = params.teamId as string;

  const {
    data: allPlayers,
    isLoading,
    isError,
    refetch,
  } = useGetTeamMembersQuery(teamId ? { teamId: teamId } : skipToken);

  const { data: teamDetail } = useGetTeamDetailQuery(
    teamId ? { teamId: teamId } : skipToken,
  );

  const players = allPlayers ?? [];

  if (isLoading) return <PlayerListSkeleton rows={5} />;

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center bg-(--color-bg-base)">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-(--color-live)/10">
          <AlertCircle size={36} className="text-(--color-live)" />
        </div>
        <div>
          <h3
            className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)"
            style={{ letterSpacing: "0.04em" }}
          >
            Failed to Load
          </h3>
          <p className="mt-1.5 text-sm text-(--color-text-secondary)">
            Couldn&apos;t load the squad. Check your connection and try again.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-2xl bg-(--color-brand) px-6 py-3.5 font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em] text-white shadow-(--shadow-button) active:scale-95"
        >
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="flex min-h-full flex-col bg-(--color-bg-base)">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <div className="relative mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-(--color-navy) shadow-[0_8px_32px_rgba(13,27,62,0.18)]">
              <Users size={44} className="text-white/85" />
            </div>

            <div className="absolute inset-0 scale-110 rounded-3xl border-2 border-(--color-brand)/20" />
          </div>

          <h3
            className="font-(family-name:--font-display) text-2xl font-black uppercase text-(--color-text-primary)"
            style={{ letterSpacing: "0.04em" }}
          >
            No Players in Squad
          </h3>

          <p className="mt-2 max-w-64 text-sm leading-relaxed text-(--color-text-secondary)">
            Player details will appear here once the team squad is available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
        {/* Team banner */}
        <div className="mb-4 flex items-center gap-4 rounded-2xl bg-(--color-navy) px-5 py-4 shadow-[0_4px_20px_rgba(13,27,62,0.20)]">
          {teamDetail?.logoUrl ? (
            <S3Image
              imageKey={teamDetail.logoUrl}
              alt={teamDetail?.name}
              width={48}
              height={48}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10"
              fallback={
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
              }
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p
              className="font-(family-name:--font-display) text-xl font-black uppercase text-white truncate"
              style={{ letterSpacing: "0.04em" }}
            >
              {teamDetail?.name}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-white/55">
              {players.length} Player{players.length !== 1 ? "s" : ""} in Squad
            </p>
          </div>
        </div>

        {/* ── PlayerList in team-management mode ── */}
        <PlayerList
          players={players}
          mode="my-teams"
          captainId={null}
          keeperId={null}
          onCaptainChange={() => {}}
          onKeeperChange={() => {}}
        />
      </div>
    </div>
  );
}
