"use client";

import { useParams, useRouter } from "next/navigation";

import { MatchRulesEditor } from "@/components/match-rules/MatchRulesEditor";
import { CricketLoader } from "@/components/common/loaders/CricketLoader";
import {
  useGetMatchRulePresetsQuery,
  useGetMatchRulesQuery,
  useUpdateMatchRulesMutation,
  useValidateMatchRulesMutation,
} from "@/store/api/matchRulesApi";
import { useMarkReadyForTossMutation } from "@/store/api/matchApi";

export default function MatchRulesPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;
  const {
    data: configuration,
    isLoading,
    isError,
  } = useGetMatchRulesQuery(matchId);
  const { data: presets = [] } = useGetMatchRulePresetsQuery();
  const [validateRules] = useValidateMatchRulesMutation();
  const [updateRules, updateState] = useUpdateMatchRulesMutation();
  const [markReady, readyState] = useMarkReadyForTossMutation();

  if (isLoading || !configuration || presets.length === 0) {
    return <CricketLoader />;
  }
  if (isError) {
    return (
      <div className="p-6 text-center text-sm text-(--color-live)">
        Match rules could not be loaded.
      </div>
    );
  }

  return (
    <MatchRulesEditor
      configuration={configuration}
      presets={presets}
      scopeLabel="This match"
      locked={configuration.isLocked}
      saving={updateState.isLoading || readyState.isLoading}
      confirmLabel="Confirm rules & continue to toss"
      onValidate={(body) => validateRules({ matchId, body }).unwrap()}
      onSave={async (body) => {
        await updateRules({ matchId, body }).unwrap();
        await markReady({ matchId }).unwrap();
        router.push("/start-match/toss");
      }}
    />
  );
}
