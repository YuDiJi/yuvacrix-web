// src/app/(app)/start-match/select-players/page.tsx
// ─── Usage: team-management mode ─────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { UserPlus, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  useGetTeamDetailQuery,
  useGetTeamMembersQuery,
  useRemoveTeamMemberMutation,
  // useSetTeamMemberRoleMutation,
} from "@/store/api/teamApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTeamA, selectTeamB } from "@/store/startMatch/selectors";
import { Button } from "@/components/common/Button";
import { PlayerList } from "@/components/Players/Playerlist";
import { PlayerListSkeleton } from "@/components/common/loaders/Skeletonloader";
import { cn } from "@/lib/cn";
import {
  setTeamARoles,
  setTeamBRoles,
} from "@/store/startMatch/startMatchSlice";
import { S3Image } from "@/components/common/S3Image";
import {
  useAssignTournamentPlayerRolesMutation,
  useGetTeamsRoleSummaryQuery,
} from "@/store/api/tournamentTeamApi";

export default function PlayersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useParams();
  const searchParams = useSearchParams();
  const currentTeamId = searchParams.get("team");
  const from = searchParams.get("from");
  const tournamentId = params.tournamentId as string;

  const [removeTeamMember, { isLoading: isRemoving }] =
    useRemoveTeamMemberMutation();
  // const [setTeamMemberRole, { isLoading: isSavingRoles }] =
  //   useSetTeamMemberRoleMutation();

  const {
    data: allPlayers,
    isLoading,
    isError,
    refetch,
  } = useGetTeamMembersQuery(
    currentTeamId ? { teamId: currentTeamId } : skipToken,
  );
  const { data: teamDetail, isLoading: isLoadingTeam } = useGetTeamDetailQuery(
    currentTeamId ? { teamId: currentTeamId } : skipToken,
  );
  const { data: teamRole, isLoading: isLoadingTeamRole } =
    useGetTeamsRoleSummaryQuery(
      currentTeamId ? { tournamentId, teamId: currentTeamId } : skipToken,
    );

  const [assignTournamentPlayerRoles, { isLoading: isAssigningRoles }] =
    useAssignTournamentPlayerRolesMutation();

  const [adminId, setAdminId] = useState<string | null>(null);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [keeperId, setKeeperId] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState("");

  const players = allPlayers ?? [];
  const canConfirm = captainId !== null && keeperId !== null;

  useEffect(() => {
    if (!teamRole) return;

    setCaptainId(teamRole.captain?.playerId ?? null);
    setKeeperId(teamRole.wicketKeeper?.playerId ?? null);
    setAdminId(teamRole.admins[0]?.playerId ?? null);
  }, [teamRole]);

  // ── Delete player via API ─────────────────────────────────────────────────

  async function handleDelete(playerId: string) {
    if (!currentTeamId) return;
    await removeTeamMember({ teamId: currentTeamId, playerId }).unwrap();
    if (captainId === playerId) setCaptainId(null);
    if (keeperId === playerId) setKeeperId(null);
  }

  async function handleConfirm() {
    if (!currentTeamId || !tournamentId || !captainId || !keeperId) return;

    setConfirmError("");

    try {
      const roleRequests = [
        assignTournamentPlayerRoles({
          tournamentId,
          teamId: currentTeamId,
          playerId: captainId,
          body: {
            isCaptain: true,
          },
        }).unwrap(),

        assignTournamentPlayerRoles({
          tournamentId,
          teamId: currentTeamId,
          playerId: keeperId,
          body: {
            isWicketKeeper: true,
          },
        }).unwrap(),
      ];

      if (adminId) {
        roleRequests.push(
          assignTournamentPlayerRoles({
            tournamentId,
            teamId: currentTeamId,
            playerId: adminId,
            body: {
              isAdmin: true,
            },
          }).unwrap(),
        );
      }

      await Promise.all(roleRequests);

      switch (from) {
        case "tournament-start-match":
          router.push(`/tournaments/${tournamentId}/start-match/playing-teams`);
          break;

        case "tournament-team-setup":
          router.push(`/tournaments/${tournamentId}`);
          break;

        default:
          router.push(`/tournaments/${tournamentId}`);
      }
    } catch (err) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data
          ? String(err.data.message)
          : "Failed to assign roles. Please try again.";

      setConfirmError(message);
    }
  }

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
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center bg-(--color-bg-base)">
        <div
          onClick={() =>
            router.push(
              `/tournaments/${tournamentId}/create-player?team=${currentTeamId}`,
            )
          }
          className="relative mb-6 cursor-pointer"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-(--color-navy) shadow-[0_8px_32px_rgba(13,27,62,0.18)]">
            <UserPlus size={44} className="text-white/85" />
          </div>
          <div className="absolute inset-0 scale-110 rounded-3xl border-2 border-(--color-brand)/20" />
        </div>
        <h3
          className="font-(family-name:--font-display) text-2xl font-black uppercase text-(--color-text-primary)"
          style={{ letterSpacing: "0.04em" }}
        >
          No Players Yet
        </h3>
        <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-(--color-text-secondary)">
          Add players to your squad and start scoring matches.
        </p>
        <button
          onClick={() => router.push("/start-match/create-player")}
          className="mt-6 flex items-center gap-2 rounded-2xl bg-(--color-brand) px-6 py-3.5 font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em] text-white shadow-(--shadow-button) active:scale-95"
        >
          <UserPlus size={16} /> Add Players
        </button>
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

        {/* Roles header */}
        <div className="mb-4">
          <h2
            className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-text-primary)"
            style={{ letterSpacing: "0.04em" }}
          >
            Roles Assignment
          </h2>
          <p className="mt-0.5 text-sm text-(--color-text-secondary)">
            Select the Captain (C) and Wicketkeeper (WK). <br />
            Assign an Admin (A) if required.
          </p>
          {!canConfirm && (
            <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-(--color-six)/30 bg-(--color-six)/8 px-3 py-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-six)" />
              <p className="text-xs font-semibold text-(--color-six)">
                {!captainId && !keeperId
                  ? "Select a Captain and Wicketkeeper to continue"
                  : !captainId
                    ? "Select a Captain to continue"
                    : "Select a Wicketkeeper to continue"}
              </p>
            </div>
          )}
        </div>

        {/* ── PlayerList in team-management mode ── */}
        <PlayerList
          players={players}
          mode="team-management-tournament"
          adminId={adminId}
          captainId={captainId}
          keeperId={keeperId}
          onAdminChange={setAdminId}
          onCaptainChange={setCaptainId}
          onKeeperChange={setKeeperId}
          onDelete={handleDelete}
        />
      </div>

      {/* Footer */}
      <div className="safe-bottom shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3">
        {confirmError && (
          <div className="mb-2.5 flex items-center gap-2 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-2">
            <AlertCircle size={14} className="shrink-0 text-(--color-live)" />
            <p className="text-xs font-semibold text-(--color-live)">
              {confirmError}
            </p>
          </div>
        )}
        <div className="flex items-center gap-3 py-1">
          <Button
            fullWidth
            disabled={!canConfirm || isAssigningRoles}
            loading={isAssigningRoles}
            onClick={handleConfirm}
            rightIcon={<ChevronRight size={18} />}
            className={cn(
              (!canConfirm || isAssigningRoles) &&
                "opacity-50 cursor-not-allowed mb-1",
            )}
          >
            Confirm
          </Button>

          <button
            // fullWidth
            onClick={() =>
              router.push(
                `/tournaments/${tournamentId}/create-player?team=${currentTeamId}`,
              )
            }
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary) transition-all active:scale-90 hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint) hover:text-(--color-brand)"
            aria-label="Add player"
          >
            <UserPlus size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
