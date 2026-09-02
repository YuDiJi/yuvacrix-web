"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ShieldCheck, Trash2, UserPlus, Users, X } from "lucide-react";

import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { S3Image } from "@/components/common/S3Image";
import MobileSearchForm from "@/components/player/MobileSearchForm";
import { getInitials } from "@/lib/getInitials";
import { useLazySearchPlayerMobileQuery } from "@/store/api/playerApi";
import {
  useAddVolleyballTournamentAdminMutation,
  useGetVolleyballTournamentAdminsQuery,
  useGetVolleyballTournamentQuery,
  useGetVolleyballTournamentTeamsQuery,
  useRemoveVolleyballTournamentAdminMutation,
} from "@/store/api/volleyball/volleyballTournamentApi";
import { useGetVolleyballTeamMembersQuery } from "@/store/api/volleyball/volleyballTeamApi";
import type { Player } from "@/types/player";
import type { VolleyballTeamMember } from "@/types/volleyball/team";
import type { VolleyballTournamentAdmin, VolleyballTournamentTeam } from "@/types/volleyball/tournament";

function getApiError(error: unknown, fallback: string) {
  if (!error || typeof error !== "object" || !("data" in error)) return fallback;
  const data = error.data;
  if (!data || typeof data !== "object") return fallback;
  if ("code" in data && data.code === "PLAYER_HAS_NO_LINKED_USER") {
    return "This player needs a YuvaCrix account before they can become a tournament admin.";
  }
  if ("message" in data) return String(data.message);
  return fallback;
}

function isForbidden(error: unknown) {
  return Boolean(error && typeof error === "object" && "status" in error && error.status === 403);
}

export default function VolleyballTournamentAdminsPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = typeof params.tournamentId === "string" ? params.tournamentId : "";
  const [mobile, setMobile] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [removeTarget, setRemoveTarget] = useState<VolleyballTournamentAdmin | null>(null);
  const [teamPickerOpen, setTeamPickerOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<VolleyballTournamentTeam | null>(null);
  const [assigningPlayerId, setAssigningPlayerId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    data: tournament,
    isLoading: tournamentLoading,
    refetch: refetchTournament,
  } = useGetVolleyballTournamentQuery({ tournamentId }, { skip: !tournamentId });
  const canManageAdmins = tournament?.viewerAccess.canManageAdmins === true;
  const {
    data,
    isLoading: adminsLoading,
    isError: adminsError,
    refetch: refetchAdmins,
  } = useGetVolleyballTournamentAdminsQuery(
    { tournamentId },
    { skip: !tournamentId || !canManageAdmins },
  );
  const { data: registeredTeams = [], isLoading: teamsLoading } =
    useGetVolleyballTournamentTeamsQuery(
      { tournamentId },
      { skip: !tournamentId || !canManageAdmins },
    );
  const { data: selectedTeamMembers, isLoading: membersLoading, isError: membersError } =
    useGetVolleyballTeamMembersQuery(
      { teamId: selectedTeam?.teamId ?? "" },
      { skip: !teamPickerOpen || !selectedTeam },
    );
  const [searchPlayer, { isLoading: searching }] = useLazySearchPlayerMobileQuery();
  const [addAdmin, { isLoading: adding }] = useAddVolleyballTournamentAdminMutation();
  const [removeAdmin, { isLoading: removing }] = useRemoveVolleyballTournamentAdminMutation();

  async function handleSearch() {
    if (!/^\d{10}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setSelectedPlayer(null);
    try {
      const response = await searchPlayer(mobile).unwrap();
      if (!response.player) {
        setError("No linked YuvaCrix player was found for this mobile number.");
        return;
      }
      setSelectedPlayer(response.player as Player);
    } catch (err) {
      setError(getApiError(err, "Unable to search for this player."));
    }
  }

  async function handleAdd() {
    if (!selectedPlayer) return;
    setError("");
    try {
      await addAdmin({ tournamentId, body: { playerId: selectedPlayer.id } }).unwrap();
      setSelectedPlayer(null);
      setMobile("");
      setSuccess(`${selectedPlayer.fullName} is now a tournament admin.`);
      await refetchAdmins();
    } catch (err) {
      if (isForbidden(err)) {
        setError("Your tournament permissions have changed.");
        await refetchTournament();
        return;
      }
      setError(getApiError(err, "Unable to add this tournament admin."));
    }
  }

  async function handleAddTeamPlayer(member: VolleyballTeamMember) {
    if (!member.userId || assigningPlayerId) return;
    setError("");
    setSuccess("");
    setAssigningPlayerId(member.playerId);
    try {
      await addAdmin({ tournamentId, body: { playerId: member.playerId } }).unwrap();
      setSuccess(`${member.fullName} is now a tournament admin.`);
      await refetchAdmins();
    } catch (err) {
      if (isForbidden(err)) {
        setError("Your tournament permissions have changed.");
        await refetchTournament();
        return;
      }
      setError(getApiError(err, "Unable to add this tournament admin."));
    } finally {
      setAssigningPlayerId(null);
    }
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setError("");
    try {
      await removeAdmin({ tournamentId, userId: removeTarget.userId }).unwrap();
      const removedName = removeTarget.player.fullName;
      setRemoveTarget(null);
      setSuccess(`${removedName} is no longer a tournament admin.`);
      await refetchAdmins();
    } catch (err) {
      if (isForbidden(err)) {
        setError("Your tournament permissions have changed.");
        setRemoveTarget(null);
        await refetchTournament();
        return;
      }
      if (getApiStatus(err) === 404) {
        setError("This tournament admin is no longer available.");
        setRemoveTarget(null);
        await refetchAdmins();
        return;
      }
      setError(getApiError(err, "Unable to remove this tournament admin."));
    }
  }

  if (tournamentLoading) {
    return <div className="min-h-full animate-pulse bg-(--color-bg-base) p-4"><div className="h-72 rounded-2xl bg-(--color-bg-card)" /></div>;
  }

  if (!tournament || !canManageAdmins) {
    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) p-4">
        <div className="w-full rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center">
          <ShieldCheck className="mx-auto text-(--color-brand)" />
          <p className="mt-3 text-sm font-black">Owner access required</p>
          <p className="mt-1 text-xs text-(--color-text-muted)">Only the tournament owner can manage admins.</p>
          <Button className="mt-4" fullWidth onClick={() => router.replace(`/volleyball/tournaments/${tournamentId}`)}>Back to Tournament</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-(--color-bg-base) px-4 py-5">
      <p className="text-section-label">Tournament</p>
      <p className="mt-1 truncate text-sm font-bold text-(--color-text-primary)">{tournament.name}</p>
      {error && <div className="mt-4 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 p-3 text-xs font-semibold text-(--color-live)">{error}</div>}
      {success && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">{success}</div>}

      {adminsLoading ? (
        <div className="mt-5 h-48 animate-pulse rounded-2xl bg-(--color-bg-card)" />
      ) : adminsError || !data ? (
        <div className="mt-5 rounded-2xl bg-(--color-bg-card) p-4 text-sm">Unable to load tournament admins.</div>
      ) : (
        <>
          <section className="mt-5">
            <p className="text-section-label">Tournament Organizer</p>
            <div className="mt-2"><PersonRow name={data.owner.fullName ?? "Tournament Owner"} imageKey={data.owner.profileImageUrl} role="OWNER" /></div>
          </section>

          <section className="mt-5">
            <div className="flex items-center justify-between"><p className="text-section-label">Tournament Admins</p><span className="text-xs text-(--color-text-muted)">{data.admins.length}</span></div>
            <div className="mt-2 space-y-2">
              {data.admins.length ? data.admins.map((admin) => (
                <PersonRow key={admin.id} name={admin.player.fullName} imageKey={admin.player.profileImageUrl} role="ADMIN" action={<button type="button" onClick={() => setRemoveTarget(admin)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600"><Trash2 size={15} /></button>} />
              )) : <div className="rounded-2xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center text-xs text-(--color-text-muted)">No delegated admins yet.</div>}
            </div>
          </section>

          <section className="mt-5 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3">
            <div className="flex items-center gap-2"><UserPlus size={16} className="text-(--color-brand)" /><p className="text-section-label">Add Admin</p></div>
            <p className="mt-1 text-xs text-(--color-text-muted)">Choose a player from a registered team or search by mobile.</p>
            <Button
              className="mt-3"
              fullWidth
              variant="secondary"
              leftIcon={<Users size={16} />}
              onClick={() => {
                setError("");
                setSuccess("");
                setSelectedTeam(null);
                setTeamPickerOpen(true);
              }}
            >
              Choose from tournament teams
            </Button>
            <div className="my-4 flex items-center gap-3"><span className="h-px flex-1 bg-(--color-bg-border)" /><span className="text-[9px] font-black uppercase text-(--color-text-muted)">Search by mobile</span><span className="h-px flex-1 bg-(--color-bg-border)" /></div>
            <div className="mt-3"><MobileSearchForm mobile={mobile} setMobile={(value) => { setMobile(value.replace(/\D/g, "").slice(0, 10)); setSelectedPlayer(null); setError(""); }} /></div>
            <Button className="mt-3" fullWidth loading={searching} onClick={() => void handleSearch()}>Search Player</Button>
            {selectedPlayer && (
              <div className="mt-3 rounded-xl bg-(--color-bg-tint) p-3">
                <PersonRow name={selectedPlayer.fullName} imageKey={selectedPlayer.profileImageUrl ?? null} role="PLAYER" />
                <Button className="mt-3" fullWidth loading={adding} onClick={() => void handleAdd()}>Confirm Admin</Button>
              </div>
            )}
          </section>
        </>
      )}

      {teamPickerOpen && (
        <DialogBottom
          open
          onClose={() => {
            if (adding || removing) return;
            setTeamPickerOpen(false);
            setSelectedTeam(null);
          }}
          className="h-[82dvh] overflow-hidden rounded-t-3xl bg-(--color-bg-card)"
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex shrink-0 items-center justify-between border-b border-(--color-bg-border) pb-3">
              <div className="flex min-w-0 items-center gap-2">
                {selectedTeam && (
                  <button type="button" onClick={() => setSelectedTeam(null)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-base)"><ChevronLeft size={18} /></button>
                )}
                <div className="min-w-0">
                  <p className="text-section-label">{selectedTeam ? "Team Players" : "Tournament Teams"}</p>
                  <h2 className="mt-1 truncate text-lg font-black">{selectedTeam?.teamSnapshot.name ?? "Choose a team"}</h2>
                </div>
              </div>
              <button type="button" onClick={() => { setTeamPickerOpen(false); setSelectedTeam(null); }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-base)"><X size={18} /></button>
            </div>

            {error && <div className="mt-3 shrink-0 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 p-3 text-xs font-semibold text-(--color-live)">{error}</div>}
            {success && <div className="mt-3 shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">{success}</div>}

            <div className="min-h-0 flex-1 overflow-y-auto py-3 scrollbar-hide">
              {!selectedTeam ? (
                teamsLoading ? <SheetSkeleton /> : registeredTeams.length ? (
                  <div className="space-y-2">
                    {registeredTeams.map((team) => (
                      <button key={team.id} type="button" onClick={() => setSelectedTeam(team)} className="flex w-full items-center gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 text-left">
                        <InitialAvatar name={team.teamSnapshot.name} />
                        <div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{team.teamSnapshot.name}</p>{team.teamSnapshot.shortName && <p className="mt-0.5 text-[9px] text-(--color-text-muted)">{team.teamSnapshot.shortName}</p>}</div>
                        <ChevronRight size={17} className="shrink-0 text-(--color-text-muted)" />
                      </button>
                    ))}
                  </div>
                ) : <EmptySheet text="No teams are registered in this tournament yet." />
              ) : membersLoading ? <SheetSkeleton /> : membersError ? (
                <EmptySheet text="Unable to load this team's players." />
              ) : selectedTeamMembers?.members.length ? (
                <div className="space-y-2">
                  {selectedTeamMembers.members.map((member) => {
                    const admin = data?.admins.find((item) => item.player.playerId === member.playerId);
                    return <TeamPlayerRow key={member.membershipId} member={member} admin={admin} assigning={assigningPlayerId === member.playerId} actionsDisabled={adding || removing || assigningPlayerId !== null} onMakeAdmin={() => void handleAddTeamPlayer(member)} onRemoveAdmin={() => admin && setRemoveTarget(admin)} />;
                  })}
                </div>
              ) : <EmptySheet text="This team has no players yet." />}
            </div>
          </div>
        </DialogBottom>
      )}

      {removeTarget && (
        <DialogBottom open onClose={() => !removing && setRemoveTarget(null)} className="rounded-t-3xl bg-(--color-bg-card) p-4">
          <div className="flex items-start justify-between"><div><p className="text-section-label">Remove Admin</p><h2 className="mt-1 text-lg font-black">Remove {removeTarget.player.fullName}?</h2></div><button onClick={() => setRemoveTarget(null)} disabled={removing}><X size={18} /></button></div>
          <p className="mt-3 text-xs leading-5 text-(--color-text-muted)">They will lose tournament management and scoring access.</p>
          <div className="mt-4 grid grid-cols-2 gap-2"><Button variant="outline" disabled={removing} onClick={() => setRemoveTarget(null)}>Cancel</Button><Button variant="danger" loading={removing} onClick={() => void handleRemove()}>Remove Admin</Button></div>
        </DialogBottom>
      )}
    </div>
  );
}

function PersonRow({ name, imageKey, role, action }: { name: string; imageKey: string | null; role: string; action?: React.ReactNode }) {
  const fallback = <span className="text-sm font-black text-(--color-brand)">{getInitials(name)}</span>;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--color-bg-tint)"><S3Image imageKey={imageKey} alt={name} width={44} height={44} className="h-full w-full object-cover" fallback={fallback} /></div>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{name}</p><p className="mt-0.5 text-[9px] font-black tracking-widest text-(--color-brand)">{role}</p></div>
      {action}
    </div>
  );
}

function TeamPlayerRow({
  member,
  admin,
  assigning,
  actionsDisabled,
  onMakeAdmin,
  onRemoveAdmin,
}: {
  member: VolleyballTeamMember;
  admin?: VolleyballTournamentAdmin;
  assigning: boolean;
  actionsDisabled: boolean;
  onMakeAdmin: () => void;
  onRemoveAdmin: () => void;
}) {
  const fallback = <span className="text-sm font-black text-(--color-brand)">{getInitials(member.fullName)}</span>;

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--color-bg-tint)">
        <S3Image imageKey={member.profileImageUrl} alt={member.fullName} width={44} height={44} className="h-full w-full object-cover" fallback={fallback} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{member.fullName}</p>
        <p className="mt-0.5 text-[9px] text-(--color-text-muted)">Jersey {member.jerseyNumber}</p>
        {!member.userId && <p className="mt-1 text-[9px] font-semibold leading-3 text-amber-700">Needs YuvaCrix account</p>}
      </div>
      {admin ? (
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-black uppercase text-emerald-700">Admin</span>
          <button type="button" disabled={actionsDisabled} onClick={onRemoveAdmin} className="text-[9px] font-black text-(--color-live) disabled:opacity-40">Remove Admin</button>
        </div>
      ) : (
        <Button size="xs" disabled={!member.userId || actionsDisabled} loading={assigning} onClick={onMakeAdmin}>
          {assigning ? "Assigning" : "Make Admin"}
        </Button>
      )}
    </div>
  );
}

function InitialAvatar({ name }: { name: string }) {
  return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-tint) text-sm font-black text-(--color-brand)">{getInitials(name)}</div>;
}

function SheetSkeleton() {
  return <div className="space-y-2">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-16 animate-pulse rounded-2xl bg-(--color-bg-base)" />)}</div>;
}

function EmptySheet({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-(--color-bg-border) p-6 text-center text-xs text-(--color-text-muted)">{text}</div>;
}

function getApiStatus(error: unknown) {
  if (!error || typeof error !== "object" || !("status" in error)) return null;
  return typeof error.status === "number" ? error.status : null;
}
