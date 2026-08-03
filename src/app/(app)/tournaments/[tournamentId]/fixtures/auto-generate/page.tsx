"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  type AutoGenerateFixturesRequest,
  type PreviewAutoFixturesResponse,
  useConfirmAutoFixturesMutation,
} from "@/store/api/tournamentFixtureApi";

import AutoGenerateFixturesForm from "./AutoGenerateFixturesForm";
import AutoFixturesReview from "./AutoFixturesReview";

type FlowStep = "GENERATE" | "REVIEW";

export default function AutoGenerateFixtureFlowPage() {
  const router = useRouter();
  const params = useParams();

  const tournamentId = params.tournamentId as string;

  const [step, setStep] = useState<FlowStep>("GENERATE");

  const [preview, setPreview] = useState<PreviewAutoFixturesResponse | null>(
    null,
  );

  const [generationRequest, setGenerationRequest] = useState<
    AutoGenerateFixturesRequest["body"] | null
  >(null);

  const [confirmError, setConfirmError] = useState("");

  const [confirmAutoFixtures, { isLoading: isConfirming }] =
    useConfirmAutoFixturesMutation();

  function handlePreviewSuccess(
    response: PreviewAutoFixturesResponse,
    request: AutoGenerateFixturesRequest["body"],
  ) {
    setPreview(response);
    setGenerationRequest(request);
    setConfirmError("");
    setStep("REVIEW");
  }

  function handleBackToGenerate() {
    setConfirmError("");
    setStep("GENERATE");
  }

  async function handleConfirm(updatedPreview: PreviewAutoFixturesResponse) {
    if (!updatedPreview.canConfirm || updatedPreview.fixtures.length === 0) {
      return;
    }

    setConfirmError("");

    try {
      await confirmAutoFixtures({
        tournamentId,

        body: {
          roundId: updatedPreview.roundId,
          groupId: updatedPreview.groupId,

          fixtures: updatedPreview.fixtures.map((fixture) => ({
            clientFixtureId: fixture.clientFixtureId,

            teamAId: fixture.teamAId,
            teamBId: fixture.teamBId,

            scheduledAt: fixture.scheduledAt,
            timezone: fixture.timezone,

            sequenceNumber: fixture.sequenceNumber,

            roundMatchNumber: fixture.roundMatchNumber,

            venue: {
              city: fixture.venue.city,
              groundName: fixture.venue.groundName,
              pitchType: fixture.venue.pitchType,
            },

            rules: {
              matchType: fixture.rules.matchType,

              oversLimit: fixture.rules.oversLimit,

              oversPerBowler: fixture.rules.oversPerBowler,

              lineupMode: fixture.rules.lineupMode,

              ballType: fixture.rules.ballType,

              wagonWheelEnabled: fixture.rules.wagonWheelEnabled,
            },

            officials: {
              scorerUserIds: fixture.officials.scorerUserIds,

              umpireNames: fixture.officials.umpireNames,

              liveStreamerUserIds: fixture.officials.liveStreamerUserIds,

              otherNames: fixture.officials.otherNames,
            },
          })),
        },
      }).unwrap();

      router.replace(`/tournaments/${tournamentId}`);
    } catch (error) {
      setConfirmError(getApiErrorMessage(error));
    }
  }

  if (step === "REVIEW" && preview) {
    return (
      <AutoFixturesReview
        preview={preview}
        isConfirming={isConfirming}
        confirmError={confirmError}
        onBack={handleBackToGenerate}
        onDone={handleConfirm}
      />
    );
  }

  return (
    <AutoGenerateFixturesForm
      tournamentId={tournamentId}
      initialValues={generationRequest ?? undefined}
      onPreviewSuccess={handlePreviewSuccess}
      onCancel={() => router.back()}
    />
  );
}

function getApiErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data
  ) {
    return String(error.data.message);
  }

  return "Failed to confirm fixtures. Please try again.";
}
