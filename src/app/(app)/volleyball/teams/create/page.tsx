"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { SPORT_TYPES } from "@/types/sport";

import { useCreateTeamMutation } from "@/store/api/teamApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";

// Adjust this import path to wherever you moved the shared form.
import { CreateTeamForm } from "@/components/team/CreateTeamForm";

export default function CreateVolleyballTeamPage() {
  const router = useRouter();

  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const [error, setError] = useState("");

  return (
    <CreateTeamForm
      title="Create Volleyball Team"
      subtitle="Create your team and add players to your volleyball roster."
      submitText="Create Team"
      isLoading={isCreating || isUploading}
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

          const team = await createTeam({
            name: name.trim(),
            city: city.trim(),
            sportType: SPORT_TYPES.VOLLEYBALL,
            ...(logoKey && {
              logoUrl: logoKey,
            }),
          }).unwrap();

          router.push(`/volleyball/teams/create/players?teamId=${team.id}`);
        } catch (err) {
          const message =
            err &&
            typeof err === "object" &&
            "data" in err &&
            typeof err.data === "object" &&
            err.data !== null &&
            "message" in err.data
              ? String(err.data.message)
              : "Failed to create volleyball team. Please try again.";

          setError(message);
        }
      }}
    />
  );
}
