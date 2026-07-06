// src/app/(app)/add-tournaments-series/_components/CreateTypeChoice.tsx

"use client";

import { useRouter } from "next/navigation";
import { Trophy, ListOrdered } from "lucide-react";
import { ChoiceCard } from "./Choicecard";

export function CreateTypeChoice() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      {/* Intro */}
      <div className="mb-2">
        <h2 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-navy) tracking-[0.03em]">
          What do you want to create?
        </h2>
        <p className="mt-1 text-sm text-(--color-text-secondary)">
          Choose the type of cricket competition you want to organise.
        </p>
      </div>

      {/* Tournament card */}
      <ChoiceCard
        icon={Trophy}
        title="Tournament"
        description="Knockout, league, or group-stage — run any format of competition."
        onClick={() => router.push("/add-tournaments-series/create-tournament")}
      />

      {/* Series card — coming soon */}
      <ChoiceCard
        icon={ListOrdered}
        title="Series"
        description="Multi-match series between two teams, e.g. a 3-match T20 series."
        badge="Coming Soon"
        disabled
        onClick={() => {}}
      />
    </div>
  );
}
