"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

import { CricketLoader } from "@/components/common/loaders/CricketLoader";
import { MatchRulesEditor } from "@/components/cricket/match-rules/MatchRulesEditor";
import {
  useGetMatchRulePresetsQuery,
  useGetTournamentMatchRulesQuery,
  useUpdateTournamentMatchRulesMutation,
  useUpdateTournamentRoundMatchRulesMutation,
} from "@/store/api/cricket/matchRulesApi";
import {
  useGetTournamentRoundDetailsQuery,
  useGetTournamentRoundsQuery,
} from "@/store/api/cricket/tournamentRoundApi";

export default function TournamentRulesPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tournamentId = params.tournamentId as string;
  const roundId = searchParams.get("roundId");
  const { data: tournamentConfig, isLoading } =
    useGetTournamentMatchRulesQuery(tournamentId);
  const { data: round } = useGetTournamentRoundDetailsQuery(
    roundId ? { tournamentId, roundId } : skipToken,
  );
  const { data: rounds = [] } = useGetTournamentRoundsQuery({ tournamentId });
  const { data: presets = [] } = useGetMatchRulePresetsQuery();
  const [updateTournament, tournamentState] =
    useUpdateTournamentMatchRulesMutation();
  const [updateRound, roundState] =
    useUpdateTournamentRoundMatchRulesMutation();

  const storedConfiguration = roundId
    ? (round?.matchRulesConfiguration ?? tournamentConfig)
    : tournamentConfig;

  if (isLoading || !storedConfiguration || presets.length === 0) {
    return <CricketLoader />;
  }
  const presetSnapshot = presets.find(
    (item) =>
      item.key === storedConfiguration.preset.key &&
      item.version === storedConfiguration.preset.version,
  )?.snapshot;
  const configuration = {
    ...storedConfiguration,
    inheritedSnapshot: roundId
      ? tournamentConfig?.resolvedSnapshot
      : presetSnapshot,
  };

  return (
    <div className="bg-(--color-bg-base)">
      <div className="flex gap-2 overflow-x-auto px-4 pt-4">
        <button
          type="button"
          onClick={() => router.replace(`/tournaments/${tournamentId}/rules`)}
          className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold ${!roundId ? "border-(--color-brand) bg-(--color-brand) text-white" : "border-(--color-bg-border) bg-(--color-bg-card) text-(--color-text-secondary)"}`}
        >
          Tournament default
        </button>
        {rounds.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              router.replace(
                `/tournaments/${tournamentId}/rules?roundId=${item.id}`,
              )
            }
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold ${roundId === item.id ? "border-(--color-brand) bg-(--color-brand) text-white" : "border-(--color-bg-border) bg-(--color-bg-card) text-(--color-text-secondary)"}`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <MatchRulesEditor
        key={roundId ?? "tournament"}
        configuration={configuration}
        presets={presets}
        scopeLabel={
          roundId
            ? `Round: ${round?.name ?? "Selected round"}`
            : "Tournament default"
        }
        saving={tournamentState.isLoading || roundState.isLoading}
        confirmLabel={roundId ? "Save round rules" : "Save tournament rules"}
        onSave={async (body) => {
          if (roundId) {
            await updateRound({
              tournamentId,
              roundId,
              body: { overrides: body.overrides },
            }).unwrap();
          } else {
            await updateTournament({ tournamentId, body }).unwrap();
          }
        }}
      />
    </div>
  );
}
