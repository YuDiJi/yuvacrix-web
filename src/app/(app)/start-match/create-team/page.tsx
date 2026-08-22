"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { CreateTeamForm } from "@/components/team/CreateTeamForm";
import { useCreateTeamMutation } from "@/store/api/teamApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { useAppDispatch } from "@/store/hooks";
import {
  setActiveTeam,
  setTeamA,
  setTeamB,
} from "@/store/startMatch/startMatchSlice";
import { SPORT_TYPES } from "@/types/sport";

export default function CreateTeamPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const teamType = searchParams.get("team");

  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const [error, setError] = useState("");

  return (
    <CreateTeamForm
      isLoading={isLoading || isUploading}
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
            sportType: SPORT_TYPES.CRICKET,
            ...(logoKey && { logoUrl: logoKey }),
          }).unwrap();

          if (teamType === "A") {
            dispatch(setTeamA(response));
            dispatch(setActiveTeam("A"));
          } else {
            dispatch(setTeamB(response));
            dispatch(setActiveTeam("B"));
          }

          router.push(`/start-match/create-player?team=${response.name}`);
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
