import { cn } from "@/lib/cn";
import { Player } from "@/types/player";
import React from "react";

const PlayerCard = ({ player }: { player: Player }) => {
  return (
    <label
      key={player.id}
      className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "h-12 w-12 shrink-0 overflow-hidden rounded-full",
            !player?.profileImageUrl &&
              "flex items-center justify-center bg-(--color-navy)",
          )}
        >
          {/* {player.profileImageUrl ? (
                  <Image
                    src={player.profileImageUrl}
                    alt={player.fullName}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                ) : ( */}
          <span
            className="font-(family-name:--font-display) text-base font-black text-white"
            style={{ letterSpacing: "0.04em" }}
          >
            {player.fullName.charAt(0).toUpperCase()}
          </span>
          {/* // )} */}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">
            {player.fullName}
          </h4>
          {/* <p className="text-[11px] text-slate-500">
                  {player.role} {player.hand && `• ${player.hand}`}{" "}
                  {player.bowl && `• ${player.bowl}`}
                </p> */}
        </div>
      </div>
    </label>
  );
};

export default PlayerCard;
