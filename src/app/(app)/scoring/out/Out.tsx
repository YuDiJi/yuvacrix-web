import { useState } from "react";
import { DialogBottom } from "@/components/common/DialogBottom"; // Adjust import path

import WicketTypeSelector from "./WicketTypeSelector";
import { BuildRunsResult, OutFlowStep, WICKET_CONFIG } from "./constant";
import {
  RecordBallRequest,
  WicketFlowState,
  WicketType,
} from "@/types/cricket/scoring";
import FielderSelector from "./FielderSelector";
import DismissedBatterSelector from "./DismissedBatterSelector";
import { ScoringState } from "@/types/cricket/innings";
import { MatchDetailsPlayer } from "@/types/cricket/match";
import DeliveryTypeRunsSelector from "./DeliveryTypeRunsSelector";
import Confirm from "./ConfirmSelector";
import { useRecordBallMutation } from "@/store/api/cricket/scoringApi";
import { ArrowLeft } from "lucide-react";

interface OutSheetProps {
  open: boolean;
  onClose: () => void;
  state: ScoringState | undefined;
  players: MatchDetailsPlayer[] | undefined;
  //   onSelect: (type: OutType) => void;
}

export function OutSheet({ open, onClose, state, players }: OutSheetProps) {
  const [step, setStep] = useState<OutFlowStep>("SELECT_WICKET_TYPE");

  const [form, setForm] = useState<WicketFlowState>({
    fielderIds: [],
  });

  const [recordBall, { isLoading: isRecordingWicket }] =
    useRecordBallMutation();

  const handleWicketTypeSelect = (wicketType: WicketType) => {
    setForm({
      fielderIds: [],
    });
    const config = WICKET_CONFIG[wicketType];

    setForm((prev) => ({
      ...prev,
      wicketType,
      ...(config.autoDismissedPlayer === "STRIKER" && {
        dismissedPlayerId: state?.currentStrikerId,
        dismissalEnd: "STRIKER",
      }),
    }));

    setStep(config.flow[0]);
  };

  const goToNextStep = () => {
    if (!form.wicketType) return;

    const flow = WICKET_CONFIG[form.wicketType].flow;

    const currentIndex = flow.indexOf(step);

    setStep(flow[currentIndex + 1]);
  };

  const goBack = () => {
    if (step === "SELECT_WICKET_TYPE") return;

    if (!form.wicketType) {
      setStep("SELECT_WICKET_TYPE");
      return;
    }

    const flow = WICKET_CONFIG[form.wicketType].flow;

    const currentIndex = flow.indexOf(step);

    if (currentIndex === -1) {
      setStep("SELECT_WICKET_TYPE");
      return;
    }

    if (currentIndex === 0) {
      setStep("SELECT_WICKET_TYPE");
      return;
    }

    setStep(flow[currentIndex - 1]);
  };

  const buildRunsAndExtras = (form: WicketFlowState): BuildRunsResult => {
    const runs = form.selectedRuns ?? 0;

    // Normal runs
    if (!form.extraType) {
      return {
        runs: {
          batRuns: runs,
        },
      };
    }

    // Wide
    if (form.extraType === "WIDE") {
      return {
        extra: {
          type: "WIDE",
          additionalRuns: runs,
        },
      };
    }

    // Bye
    if (form.extraType === "BYE") {
      return {
        extra: {
          type: "BYE",
          additionalRuns: runs,
        },
      };
    }

    // Leg Bye
    if (form.extraType === "LEG_BYE") {
      return {
        extra: {
          type: "LEG_BYE",
          additionalRuns: runs,
        },
      };
    }

    if (form.extraType === "NO_BALL") {
      if (form.nbRunSource === "BAT") {
        return {
          runs: {
            batRuns: runs,
          },
          extra: {
            type: "NO_BALL",
            additionalRuns: 0,
          },
        };
      }

      if (form.nbRunSource === "BYE") {
        return {
          extra: {
            type: "NO_BALL",
            additionalRuns: runs,
          },
        };
      }

      if (form.nbRunSource === "LEG_BYE") {
        return {
          extra: {
            type: "NO_BALL",
            additionalRuns: runs,
          },
        };
      }

      return {
        extra: {
          type: "NO_BALL",
          additionalRuns: 0,
        },
      };
    }

    return {};
  };

  const buildWicketPayload = (form: WicketFlowState): RecordBallRequest => {
    const scoring = buildRunsAndExtras(form);
    const wicket: NonNullable<RecordBallRequest["wicket"]> = {
      type: form.wicketType!,
      dismissedPlayerId: form.dismissedPlayerId!,
    };

    if (form.fielderIds.length > 0) {
      wicket.fielderIds = form.fielderIds;
    }

    if (form.dismissalEnd) {
      wicket.dismissalEnd = form.dismissalEnd;
    }

    const payload: RecordBallRequest = {
      matchId: state!.matchId,
      inningsId: state!.inningsId,
      clientEventId: crypto.randomUUID(),

      wicket,

      runs: scoring.runs ?? {
        batRuns: 0,
      },

      ...(scoring.extra && {
        extra: scoring.extra,
      }),
    };

    return payload;
  };

  const handleOut = async () => {
    if (!state?.inningsId || !form.wicketType) return;

    try {
      const payload = buildWicketPayload(form);

      await recordBall(payload).unwrap();

      onClose();

      setStep("SELECT_WICKET_TYPE");
      setForm({
        fielderIds: [],
      });
      setStep("SELECT_WICKET_TYPE");
    } catch (error) {
      console.error("Failed to record wicket", error);
    }
  };

  return (
    <DialogBottom
      open={open}
      onClose={() => {
        onClose();
        setStep("SELECT_WICKET_TYPE");
      }}
    >
      {step !== "SELECT_WICKET_TYPE" && (
        <button onClick={goBack}>
          <ArrowLeft size={20} />
        </button>
      )}
      <div className="max-h-[75vh] flex flex-col min-h-0 overflow-y-auto scrollbar-none">
        {step === "SELECT_WICKET_TYPE" && (
          <WicketTypeSelector onSelect={handleWicketTypeSelect} />
        )}

        {step === "SELECT_DISMISSED_BATTER" && (
          <DismissedBatterSelector
            players={players}
            state={state}
            onlyStriker={
              form.wicketType
                ? WICKET_CONFIG[form.wicketType].autoDismissedPlayer ===
                  "STRIKER"
                : false
            }
            onContinue={(player, dismissalEnd) => {
              setForm((prev) => ({
                ...prev,
                dismissedPlayerId: player.playerId,
                dismissalEnd,
              }));

              goToNextStep();
            }}
          />
        )}

        {step === "SELECT_FIELDER" && (
          <FielderSelector
            numberOfFielders={
              form.wicketType
                ? (WICKET_CONFIG[form.wicketType].fieldersRequired ?? 1)
                : 1
            }
            players={players}
            state={state}
            onContinue={(fielders) => {
              setForm((prev) => ({
                ...prev,
                fielderIds: fielders
                  .filter(
                    (fielder): fielder is MatchDetailsPlayer =>
                      fielder !== null,
                  )
                  .map((fielder) => fielder.playerId),
              }));

              goToNextStep();
            }}
          />
        )}

        {/* {step === "SELECT_WICKET_KEEPER" && (
          <WicketKeeperSelector players={players} state={state} />
        )} */}

        {step === "SELECT_DELIVERY_TYPE_AND_RUNS" && (
          <DeliveryTypeRunsSelector
            wicketType={form.wicketType!}
            form={form}
            setForm={setForm}
            onContinue={goToNextStep}
          />
        )}

        {step === "CONFIRM" && (
          <Confirm
            form={form}
            setForm={setForm}
            players={players}
            onSubmit={() => {
              handleOut();
            }}
          />
        )}
      </div>
      {state && (
        <div className="overflow-hidden px-5 py-1">
          <div className="whitespace-nowrap animate-marquee">
            <span className="text-sm font-bold">
              Target: {state.score} in {state.oversText} ({state.runRateSummary}
              )
            </span>
          </div>
        </div>
      )}
    </DialogBottom>
  );
}
