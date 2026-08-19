// src/app/(app)/my-performance/_components/PerformanceHeader.tsx

import Image from "next/image";
import { Activity, MapPin, UserRound } from "lucide-react";

import type { PerformancePlayer } from "@/types/cricket/performance";
import { S3Image } from "@/components/common/S3Image";

type PerformanceHeaderProps = {
  player: PerformancePlayer;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatEnum(value: string | null | undefined) {
  if (!value) return "Not specified";

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function PerformanceHeader({ player }: PerformanceHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-(--color-navy) text-white">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-(--color-brand)/45" />
      <div className="pointer-events-none absolute -bottom-28 right-16 h-52 w-52 rounded-full border-[28px] border-white/5" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-(--color-sky)/15" />

      <div className="relative px-4 pb-6 pt-5">
        <div className="flex items-start gap-4">
          <PlayerAvatar
            name={player.displayName}
            imageUrl={player.profileImageUrl}
          />

          <div className="min-w-0 flex-1 pt-1">
            <h1 className="truncate font-(family-name:--font-display) text-2xl font-black uppercase tracking-wide">
              {player.displayName}
            </h1>

            <div className="mt-4 space-y-2.5">
              <PlayerDetail
                icon={<UserRound size={14} />}
                label="Player role"
                value={formatEnum(player.playerRole)}
              />

              {/* <PlayerDetail
                icon={<Activity size={14} />}
                label="Batting style"
                value={formatEnum(player.battingStyle)}
              /> */}

              {player.city && (
                <PlayerDetail
                  icon={<MapPin size={14} />}
                  label="City"
                  value={player.city}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <StyleCard label="Batting" value={formatEnum(player.battingStyle)} />

          <StyleCard label="Bowling" value={formatEnum(player.bowlingStyle)} />
        </div>
      </div>
    </section>
  );
}

type PlayerAvatarProps = {
  name: string;
  imageUrl: string | null;
};

function PlayerAvatar({ name, imageUrl }: PlayerAvatarProps) {
  return (
    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-white/10 shadow-lg">
      {imageUrl ? (
        <S3Image
          imageKey={imageUrl}
          alt={name}
          width={96}
          height={96}
          className="object-cover w-full h-full"
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-(--color-brand)">
              <span className="font-(family-name:--font-display) text-3xl font-black uppercase tracking-wider text-white">
                {getInitials(name)}
              </span>
            </div>
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-(--color-brand)">
          <span className="font-(family-name:--font-display) text-3xl font-black uppercase tracking-wider text-white">
            {getInitials(name)}
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-2 pb-1.5 pt-6">
        <p className="truncate text-center text-[9px] font-bold uppercase tracking-widest text-white">
          YuvaCrix Player
        </p>
      </div>
    </div>
  );
}

type PlayerDetailProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function PlayerDetail({ icon, label, value }: PlayerDetailProps) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-(--color-sky)">{icon}</span>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/45">
          {label}
        </p>

        <p className="truncate text-xs font-semibold text-white/90">{value}</p>
      </div>
    </div>
  );
}

type StyleCardProps = {
  label: string;
  value: string;
};

function StyleCard({ label, value }: StyleCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 backdrop-blur-sm">
      <p className="text-[9px] font-bold uppercase tracking-widest text-white/45">
        {label}
      </p>

      <p className="mt-0.5 truncate font-(family-name:--font-display) text-sm font-bold uppercase tracking-wide text-white">
        {value}
      </p>
    </div>
  );
}
