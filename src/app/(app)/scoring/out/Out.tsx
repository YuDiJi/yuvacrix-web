import { useState } from "react";
import { DialogBottom } from "@/components/common/DialogBottom"; // Adjust import path

import WicketTypeSelector from "./WicketTypeSelector";
import { OutFlowStep, WICKET_CONFIG } from "./constant";
import {
  RecordBallRequest,
  WicketFlowState,
  WicketType,
} from "@/types/scoring";
import FielderSelector from "./FielderSelector";
import DismissedBatterSelector from "./DismissedBatterSelector";
import { ScoringState } from "@/types/innings";
import { MatchDetailsPlayer } from "@/types/match";
import WicketKeeperSelector from "./WicketKeeperSelector";
import DeliveryTypeRunsSelector from "./DeliveryTypeRunsSelector";
import Confirm from "./ConfirmSelector";
import { useRecordBallMutation } from "@/store/api/scoringApi";
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

  const buildWicketPayload = (form: WicketFlowState): RecordBallRequest => {
    const wicket: NonNullable<RecordBallRequest["wicket"]> = {
      type: form.wicketType!,
      dismissedPlayerId: form.dismissedPlayerId!,
    };

    if (form.fielderIds.length > 0) {
      wicket.fielderIds = form.fielderIds;
    }

    if (form.dismissalEnd) {
      // wicket.dismissalEnd = form.dismissalEnd;
    }

    const payload: RecordBallRequest = {
      matchId: state!.matchId,
      inningsId: state!.inningsId,
      clientEventId: crypto.randomUUID(),

      runs: {
        batRuns: form.batRuns ?? 0,
      },

      wicket,
    };

    if (form.extraType) {
      payload.extra = {
        type: form.extraType,
        additionalRuns: form.additionalRuns ?? 0,
      };
    }

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

  console.log(step, form);

  return (
    <DialogBottom open={open} onClose={onClose}>
      {step !== "SELECT_WICKET_TYPE" && (
        <button onClick={goBack}>
          <ArrowLeft size={20} />
        </button>
      )}
      <div className="max-h-[75vh] flex flex-col min-h-0">
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
            value={form}
            onContinue={(values) => {
              setForm((prev) => ({
                ...prev,
                ...values,
              }));

              goToNextStep();
            }}
          />
        )}

        {step === "CONFIRM" && (
          <Confirm
            form={form}
            players={players}
            onSubmit={() => {
              handleOut();
            }}
          />
        )}
      </div>
    </DialogBottom>
  );
}
