"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, Trash2, UserPlus, Users, X } from "lucide-react";

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
  useRemoveVolleyballTournamentAdminMutation,
} from "@/store/api/volleyball/volleyballTournamentApi";
import type { Player } from "@/types/player";
import type { VolleyballTournamentAdmin } from "@/types/volleyball/tournament";

function getApiError(error: unknown, fallback: string) {
  if (!error || typeof error !== "object" || !("data" in error)) return fallback;
  const data = error.data;
  if (!data || typeof data !== "object") return fallback;
  if ("code" in data && data.code === "PLAYER_HAS_NO_LINKED_USER") {
    return "This player does not have a linked YuvaCrix account yet and cannot be added as a tournament admin.";
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
  const [error, setError] = useState("");

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
  } = useGetVolleyballTournamentAdminsQuery(
    { tournamentId },
    { skip: !tournamentId || !canManageAdmins },
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
    } catch (err) {
      if (isForbidden(err)) {
        setError("Your tournament permissions have changed.");
        await refetchTournament();
        return;
      }
      setError(getApiError(err, "Unable to add this tournament admin."));
    }
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setError("");
    try {
      await removeAdmin({ tournamentId, userId: removeTarget.userId }).unwrap();
      setRemoveTarget(null);
    } catch (err) {
      if (isForbidden(err)) {
        setError("Your tournament permissions have changed.");
        setRemoveTarget(null);
        await refetchTournament();
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
      <h1 className="font-(family-name:--font-display) text-2xl font-black uppercase">Manage Admins</h1>
      <p className="mt-1 truncate text-xs text-(--color-text-muted)">{tournament.name}</p>
      {error && <div className="mt-4 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 p-3 text-xs font-semibold text-(--color-live)">{error}</div>}

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
            <p className="mt-1 text-xs text-(--color-text-muted)">Find a linked YuvaCrix player by mobile number.</p>
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
