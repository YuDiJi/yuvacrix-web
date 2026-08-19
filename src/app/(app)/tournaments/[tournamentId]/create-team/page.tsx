"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { CreateTeamForm } from "@/components/cricket/team/CreateTeamForm";
import { useCreateTeamMutation } from "@/store/api/cricket/teamApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { useAppDispatch } from "@/store/hooks";
import { useAddTeamToTournamentMutation } from "@/store/api/cricket/tournamentTeamApi";

export default function CreateTournamentTeam() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useParams();
  const tournamentId = params.tournamentId as string;

  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const [addTeamToTournament, { isLoading: isAdding }] =
    useAddTeamToTournamentMutation();

  const [error, setError] = useState("");

  return (
    <CreateTeamForm
      isLoading={isLoading || isUploading || isAdding}
      error={error}
      onSubmit={async ({ name, city, logoFile }) => {
        setError("");

        try {
          let logoKey: string | undefined;

          if (logoFile) {
            const uploadResponse = await uploadFile({
              purpose: "TEAM_LOGO",
              file: logoFile,
            }).unwrap();

            logoKey = uploadResponse.file.key;
          }

          const response = await createTeam({
            name: name.trim(),
            city: city.trim(),
            sportType: "CRICKET",
            ...(logoKey && { logoUrl: logoKey }),
          }).unwrap();

          addTeamToTournament({
            tournamentId,
            teamId: response.id,
            // seedNumber: index + 1,
          }).unwrap();

          router.push(
            `/tournaments/${tournamentId}/create-player?team=${response.id}`,
          );
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to create team. Please try again.";

          setError(message);
        }
      }}
    />
  );
}
