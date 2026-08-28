"use client";

import { useState } from "react";
import { MapPin, Palette, Users, X } from "lucide-react";

import { Button } from "@/components/common/Button";
import { ImageUploader } from "@/components/common/ImageUploader";

type CreateTeamFormValues = {
  name: string;
  city: string;
  logoFile: File | null;
  teamColor?: string;
};

type CreateTeamFormProps = {
  title?: string;
  subtitle?: string;
  submitText?: string;
  isLoading?: boolean;
  error?: string;
  showTeamColor?: boolean;
  onSubmit: (values: CreateTeamFormValues) => void | Promise<void>;
};

const DEFAULT_VOLLEYBALL_COLOR_INPUT = "#EA580C";
const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export function CreateTeamForm({
  title = "Create New Team",
  subtitle = "Build your squad and dominate the league.",
  submitText = "Save Team",
  isLoading = false,
  error,
  showTeamColor = false,
  onSubmit,
}: CreateTeamFormProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [teamColor, setTeamColor] = useState<string | null>(null);

  const isValid =
    name.trim().length >= 2 &&
    city.trim().length >= 2 &&
    (!teamColor || HEX_COLOR_PATTERN.test(teamColor));

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

        {showTeamColor && (
          <div className="rounded-xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <label
              htmlFor="teamColor"
              className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted)"
            >
              Team Color
            </label>

            <div className="flex items-center gap-3">
              <Palette size={18} className="shrink-0 text-(--color-text-muted)" />

              <input
                id="teamColor"
                type="color"
                value={teamColor ?? DEFAULT_VOLLEYBALL_COLOR_INPUT}
                onChange={(event) => setTeamColor(event.target.value.toUpperCase())}
                className="h-10 w-12 cursor-pointer rounded-lg border border-(--color-bg-border) bg-transparent p-1"
                aria-label="Choose team color"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-(--color-text-primary)">
                  {teamColor ?? "No color selected"}
                </p>
                <p className="text-[10px] text-(--color-text-muted)">
                  Optional team identity color
                </p>
              </div>

              {teamColor ? (
                <button
                  type="button"
                  onClick={() => setTeamColor(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-bg-base) text-(--color-text-muted)"
                  aria-label="Clear team color"
                >
                  <X size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setTeamColor(DEFAULT_VOLLEYBALL_COLOR_INPUT)}
                  className="rounded-lg bg-(--color-bg-tint) px-3 py-2 text-[10px] font-black text-(--color-brand)"
                >
                  Use Color
                </button>
              )}
            </div>
          </div>
        )}
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
            ...(showTeamColor && teamColor ? { teamColor } : {}),
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
