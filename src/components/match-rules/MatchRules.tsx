"use client";

import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { AlertCircle, RefreshCw } from "lucide-react";

import { MatchRulesEditor } from "@/components/match-rules/MatchRulesEditor";
import { CricketLoader } from "@/components/common/loaders/CricketLoader";

import {
  useGetMatchRulePresetsQuery,
  useGetMatchRulesQuery,
  useUpdateMatchRulesMutation,
  useValidateMatchRulesMutation,
} from "@/store/api/matchRulesApi";

import { useAppSelector } from "@/store/hooks";
import { selectMatchId } from "@/store/startMatch/selectors";

type MatchRulesProps = {
  onClose: () => void;
};

export default function MatchRules({ onClose }: MatchRulesProps) {
  const router = useRouter();

  const matchId = useAppSelector(selectMatchId);

  // ---------------------------------------------------------------------------
  // Match rules
  // ---------------------------------------------------------------------------

  const {
    data: configuration,
    isLoading: isLoadingRules,
    isFetching: isFetchingRules,
    isError: isRulesError,
    refetch: refetchRules,
  } = useGetMatchRulesQuery(matchId ?? skipToken);

  // ---------------------------------------------------------------------------
  // Presets
  // ---------------------------------------------------------------------------

  const {
    data: presets = [],
    isLoading: isLoadingPresets,
    isFetching: isFetchingPresets,
    isError: isPresetsError,
    refetch: refetchPresets,
  } = useGetMatchRulePresetsQuery();

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  const [validateRules, validateState] = useValidateMatchRulesMutation();

  const [updateRules, updateState] = useUpdateMatchRulesMutation();

  // ---------------------------------------------------------------------------
  // Match ID missing
  // ---------------------------------------------------------------------------

  if (!matchId) {
    return (
      <div className="flex min-h-105 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-six)/10">
          <AlertCircle size={26} className="text-(--color-six)" />
        </div>

        <h2 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
          Match not found
        </h2>

        <p className="mt-2 max-w-72 text-sm leading-6 text-(--color-text-secondary)">
          Match information is missing. Open the match again and configure its
          rules.
        </p>

        <button
          type="button"
          onClick={() => {
            onClose();
            router.push("/my-cricket");
          }}
          className="mt-5 rounded-xl bg-(--color-brand) px-5 py-3 font-(family-name:--font-display) text-sm font-black uppercase tracking-wider text-white transition active:scale-95"
        >
          Go to My Cricket
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (
    isLoadingRules ||
    isLoadingPresets ||
    (isFetchingRules && !configuration) ||
    (isFetchingPresets && presets.length === 0)
  ) {
    return (
      <div className="flex min-h-105 flex-1 items-center justify-center">
        <CricketLoader />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // API error
  // ---------------------------------------------------------------------------

  if (isRulesError || isPresetsError) {
    return (
      <div className="flex min-h-105 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-live)/10">
          <AlertCircle size={26} className="text-(--color-live)" />
        </div>

        <h2 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
          Couldn&apos;t load rules
        </h2>

        <p className="mt-2 max-w-72 text-sm leading-6 text-(--color-text-secondary)">
          We couldn&apos;t load the match rule configuration. Please try again.
        </p>

        <button
          type="button"
          onClick={() => {
            if (isRulesError) {
              void refetchRules();
            }

            if (isPresetsError) {
              void refetchPresets();
            }
          }}
          className="mt-5 flex items-center gap-2 rounded-xl bg-(--color-brand) px-5 py-3 font-(family-name:--font-display) text-sm font-black uppercase tracking-wider text-white transition active:scale-95"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Successful requests but expected data is unavailable
  // ---------------------------------------------------------------------------

  if (!configuration || presets.length === 0) {
    return (
      <div className="flex min-h-105 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-six)/10">
          <AlertCircle size={26} className="text-(--color-six)" />
        </div>

        <h2 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
          Rules unavailable
        </h2>

        <p className="mt-2 max-w-72 text-sm leading-6 text-(--color-text-secondary)">
          Match rule configuration is currently unavailable.
        </p>

        <button
          type="button"
          onClick={() => {
            void refetchRules();
            void refetchPresets();
          }}
          className="mt-5 flex items-center gap-2 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-3 font-(family-name:--font-display) text-sm font-black uppercase tracking-wider text-(--color-brand) transition active:scale-95"
        >
          <RefreshCw size={16} />
          Reload
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Editor
  // ---------------------------------------------------------------------------

  return (
    <MatchRulesEditor
      configuration={configuration}
      presets={presets}
      scopeLabel="Match setup"
      locked={configuration.isLocked}
      saving={validateState.isLoading || updateState.isLoading}
      confirmLabel="Save match rules"
      onValidate={(body) =>
        validateRules({
          matchId,
          body,
        }).unwrap()
      }
      onSave={async (body) => {
        await updateRules({
          matchId,
          body,
        }).unwrap();

        onClose();
      }}
    />
  );
}
