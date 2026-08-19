"use client";

import { useState } from "react";
import { Users, MapPin } from "lucide-react";

import { Button } from "@/components/common/Button";
import { ImageUploader } from "@/components/common/ImageUploader";

type CreateTeamFormValues = {
  name: string;
  city: string;
  logoFile: File | null;
};

type CreateTeamFormProps = {
  title?: string;
  subtitle?: string;
  submitText?: string;
  isLoading?: boolean;
  error?: string;
  onSubmit: (values: CreateTeamFormValues) => void | Promise<void>;
};

export function CreateTeamForm({
  title = "Create New Team",
  subtitle = "Build your squad and dominate the league.",
  submitText = "Save Team",
  isLoading = false,
  error,
  onSubmit,
}: CreateTeamFormProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const isValid = name.trim().length >= 2 && city.trim().length >= 2;

  return (
    <div className="flex min-h-full flex-col items-center bg-(--color-bg-base) p-4">
      <div className="mb-4 mt-4 text-center">
        <h2 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
          {title}
        </h2>
        <p className="mt-1 text-sm text-(--color-text-secondary)">{subtitle}</p>
      </div>

      <div className="mb-6 flex flex-col items-center justify-center">
        {/* <ImageUploader layout="logo" onFileSelect={setLogoFile} /> */}
        <ImageUploader
          uploadText="Upload Team Logo"
          changeText="Change Team Logo"
          onFileSelect={setLogoFile}
        />
      </div>

      <div className="mb-8 w-full space-y-4">
        <div className="rounded-xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted)">
            Team Name
          </label>

          <div className="flex items-center gap-3">
            <Users size={18} className="text-(--color-text-muted)" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="e.g. Mumbai XI"
              className="flex-1 bg-transparent text-base font-medium text-(--color-text-primary) outline-none"
            />
          </div>
        </div>

        <div className="rounded-xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted)">
            City / Town
          </label>

          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-(--color-text-muted)" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              placeholder="e.g. Mumbai"
              className="flex-1 bg-transparent text-base font-medium text-(--color-text-primary) outline-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 w-full rounded-lg border border-(--color-live)/20 bg-(--color-live)/8 p-3">
          <p className="text-sm font-medium text-(--color-live)">{error}</p>
        </div>
      )}

      <Button
        onClick={() =>
          onSubmit({
            name,
            city,
            logoFile,
          })
        }
        disabled={!isValid || isLoading}
        fullWidth
        loading={isLoading}
        leftIcon={<span>💾</span>}
      >
        {submitText}
      </Button>
    </div>
  );
}
