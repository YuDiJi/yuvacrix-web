"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";

import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/auth/authSelectors";
import {
  useCreatePlayerMutation,
  useLazySearchPlayerMobileQuery,
} from "@/store/api/playerApi";
import { useAddTeamMemberMutation } from "@/store/api/teamApi";
import type { Player } from "@/types/player";

import MobileSearchForm from "./MobileSearchForm";
import CreatePlayerForm from "./CreatePlayerForm";
import CreatePlayerCard from "./CreatePlayerCard";

type Step = "SEARCH_MOBILE" | "CREATE_PLAYER";

type CreatePlayerFlowProps = {
  teamId?: string | null;
  onDone: (players: Player[]) => void;
  manualAddPath?: string;
  createdSource?:
    | "MATCH_SCORING"
    | "TEAM_MANAGEMENT"
    | "TOURNAMENT_REGISTRATION";
  doneLabel?: (count: number) => string;
};

export function CreatePlayerFlow({
  teamId,
  onDone,
  manualAddPath,
  createdSource = "MATCH_SCORING",
  doneLabel,
}: CreatePlayerFlowProps) {
  const router = useRouter();
  const user = useAppSelector(selectUser);

  const [step, setStep] = useState<Step>("SEARCH_MOBILE");
  const [players, setPlayers] = useState<Player[]>([]);
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const [searchPlayer, { isLoading: isSearching }] =
    useLazySearchPlayerMobileQuery();

  const [createPlayer, { isLoading: isCreatingPlayer }] =
    useCreatePlayerMutation();

  const [addTeamMember, { isLoading: isAddingTeam }] =
    useAddTeamMemberMutation();

  function resetFlow() {
    setMobile("");
    setFullName("");
    setError("");
    setStep("SEARCH_MOBILE");
  }

  async function addToList(player: Player) {
    if (players.some((p) => p.id === player.id)) {
      setError("This player is already in your list.");
      return;
    }

    if (!teamId) {
      setError("Team ID not found.");
      return;
    }

    setError("");

    try {
      await addTeamMember({
        teamId,
        body: { playerId: player.id },
      }).unwrap();

      setPlayers((prev) => [...prev, player]);
      resetFlow();
    } catch (err) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
          ? String(err.data.message)
          : "Failed to add player to team. Please try again.";

      setError(message);
    }
  }

  async function handleSearch() {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");

    try {
      const response = await searchPlayer(mobile).unwrap();

      if (response.player) {
        await addToList(response.player);
      } else {
        setStep("CREATE_PLAYER");
      }
    } catch (err) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
          ? String(err.data.message)
          : "Something went wrong. Please try again.";

      setError(message);
    }
  }

  async function handleCreatePlayer() {
    if (!fullName.trim()) {
      setError("Please enter the player's name.");
      return;
    }

    if (!user) {
      setError("Session expired. Please log in again.");
      return;
    }

    setError("");

    try {
      const response = await createPlayer({
        fullName: fullName.trim(),
        claimMobile: mobile,
        createdSource,
        createdByActorType: "SYSTEM",
        createdByActorId: user.id,
      }).unwrap();

      await addToList(response);
    } catch (err) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
          ? String(err.data.message)
          : "Failed to create player. Please try again.";

      setError(message);
    }
  }

  const primaryLabel =
    step === "SEARCH_MOBILE" ? "Search Player" : "Create Player";

  const primaryAction =
    step === "SEARCH_MOBILE" ? handleSearch : handleCreatePlayer;

  const primaryLoading = isSearching || isCreatingPlayer || isAddingTeam;

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 pt-5">
        {players.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between px-0.5">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-(--color-brand)" />
                <p className="text-section-label">
                  Added Players ({players.length})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPlayers([])}
                className="text-xs font-semibold text-(--color-text-muted) transition-colors hover:text-(--color-live)"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-(--shadow-card)">
              {players.map((player) => (
                <CreatePlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3 shadow-(--shadow-card)">
          <p className="text-section-label mb-0.5">
            {step === "SEARCH_MOBILE" ? "Find Player" : "New Player"}
          </p>

          <p className="text-sm font-medium text-(--color-text-secondary)">
            {step === "SEARCH_MOBILE"
              ? "Enter a mobile number to find or add a player."
              : `No account found for +91 ${mobile}. Enter a name to create one.`}
          </p>

          {step === "CREATE_PLAYER" && (
            <button
              type="button"
              onClick={resetFlow}
              className="mt-2 flex items-center gap-1 text-xs font-semibold text-(--color-text-muted) transition-colors hover:text-(--color-text-primary)"
            >
              <ArrowLeft size={13} />
              Search a different number
            </button>
          )}
        </div>

        {step === "SEARCH_MOBILE" && (
          <MobileSearchForm mobile={mobile} setMobile={setMobile} />
        )}

        {step === "CREATE_PLAYER" && (
          <CreatePlayerForm
            mobile={mobile}
            fullName={fullName}
            setFullName={setFullName}
          />
        )}

        {error && (
          <p className="rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-2.5 text-sm font-medium text-(--color-live)">
            {error}
          </p>
        )}

        {manualAddPath && (
          <button
            type="button"
            onClick={() => router.push(manualAddPath)}
            className="self-start text-sm font-medium text-(--color-brand) underline underline-offset-2 transition-opacity hover:opacity-70"
          >
            Can&apos;t add by mobile? Add manually
          </button>
        )}
      </div>

      <div
        className={cn(
          "safe-bottom shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3",
          "flex flex-col gap-2",
        )}
      >
        <Button fullWidth onClick={primaryAction} loading={primaryLoading}>
          {primaryLabel}
        </Button>

        {players.length > 0 && (
          <Button fullWidth variant="secondary" onClick={() => onDone(players)}>
            {doneLabel
              ? doneLabel(players.length)
              : `Done — Add ${players.length} Player${
                  players.length > 1 ? "s" : ""
                } to Team`}
          </Button>
        )}
      </div>
    </div>
  );
}
