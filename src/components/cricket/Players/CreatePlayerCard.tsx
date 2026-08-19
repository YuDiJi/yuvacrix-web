import { S3Image } from "@/components/common/S3Image";
import { cn } from "@/lib/cn";
import { useGetSignedUrlQuery } from "@/store/api/uploadApi";
import { Player } from "@/types/cricket/player";
import { skipToken } from "@reduxjs/toolkit/query";
import { Trash2 } from "lucide-react";
import React from "react";

const CreatePlayerCard = ({
  player,
  onRemove,
  isRemoving,
}: {
  player: Player;
  onRemove?: () => void;
  isRemoving?: boolean;
}) => {
  return (
    <label
      key={player?.id}
      className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between cursor-pointer"
    >
      <div className="flex items-center gap-3 w-full">
        <div
          className={cn(
            "h-12 w-12 shrink-0 overflow-hidden rounded-full",
            !player.profileImageUrl &&
              "flex items-center justify-center bg-(--color-navy)",
          )}
        >
          {player.profileImageUrl ? (
            <S3Image
              imageKey={player.profileImageUrl}
              alt={player.fullName}
              width={48}
              height={48}
              className="h-full w-full object-cover"
              fallback={
                <div className="flex h-full w-full items-center justify-center rounded-full bg-(--color-navy)">
                  {player.fullName.charAt(0)}
                </div>
              }
            />
          ) : (
            <span
              className="font-(family-name:--font-display) text-base font-black text-white"
              style={{ letterSpacing: "0.04em" }}
            >
              {player?.fullName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex justify-between w-full items-center">
          <h4 className="font-bold text-slate-900 text-sm">
            {player?.fullName}
          </h4>
          {/* <p className="text-[11px] text-slate-500">
                  {player.role} {player.hand && `• ${player.hand}`}{" "}
                  {player.bowl && `• ${player.bowl}`}
                </p> */}
          <button
            type="button"
            onClick={onRemove}
            disabled={isRemoving}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--color-live)/20 bg-(--color-live)/8 text-(--color-live) transition-all active:scale-90 disabled:opacity-50"
            aria-label={`Remove ${player.fullName} from team`}
          >
            {isRemoving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--color-live)/30 border-t-(--color-live)" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </div>
      </div>
    </label>
  );
};

export default CreatePlayerCard;
