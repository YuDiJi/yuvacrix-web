"use client";

import { AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useGetTournamentDetailsQuery } from "@/store/api/tournamentApi";
import TournamentForm from "@/components/tournament/TournamentForm";

export default function EditTournamentPage() {
  const router = useRouter();
  const params = useParams();

  const tournamentId = params.tournamentId as string;

  const {
    data: tournament,
    isLoading,
    isError,
  } = useGetTournamentDetailsQuery(tournamentId);

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-col gap-4 bg-(--color-bg-base) p-4">
        <div className="h-48 animate-pulse rounded-2xl bg-(--color-bg-card)" />
        <div className="h-28 animate-pulse rounded-2xl bg-(--color-bg-card)" />
        <div className="h-28 animate-pulse rounded-2xl bg-(--color-bg-card)" />
        <div className="h-28 animate-pulse rounded-2xl bg-(--color-bg-card)" />
      </div>
    );
  }

  if (isError || !tournament) {
    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) p-4">
        <div className="rounded-2xl bg-(--color-bg-card) p-6 text-center shadow-(--shadow-card)">
          <AlertCircle className="mx-auto text-(--color-live)" />

          <h2 className="mt-3 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
            Failed to load tournament
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

  return (
    <TournamentForm
      mode="EDIT"
      tournamentId={tournamentId}
      tournament={tournament}
    />
  );
}
