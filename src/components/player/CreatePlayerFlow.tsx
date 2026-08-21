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

import type { Player } from "@/types/player";

import MobileSearchForm from "./MobileSearchForm";
import CreatePlayerForm from "./CreatePlayerForm";
import CreatePlayerCard from "./CreatePlayerCard";

type Step = "SEARCH_MOBILE" | "CREATE_PLAYER";

type CreatePlayerFlowProps = {
  onAddPlayer: (player: Player) => boolean | Promise<boolean>;

  onRemovePlayer?: (player: Player) => void | Promise<void>;

  onDone: (players: Player[]) => void;

  manualAddPath?: string;

  createdSource?:
    | "MATCH_SCORING"
    | "TEAM_MANAGEMENT"
    | "TOURNAMENT_REGISTRATION";

  doneLabel?: (count: number) => string;

  isAddingPlayer?: boolean;

  helperText?: string;

  addedPlayers?: Player[];
};

export function CreatePlayerFlow({
  onAddPlayer,
  onRemovePlayer,
  onDone,
  manualAddPath,
  createdSource = "MATCH_SCORING",
  doneLabel,
  isAddingPlayer,
  helperText = "Players are added to the team immediately.",
  addedPlayers,
}: CreatePlayerFlowProps) {
  const router = useRouter();
  const user = useAppSelector(selectUser);

  const [step, setStep] = useState<Step>("SEARCH_MOBILE");
  const [players, setPlayers] = useState<Player[]>([]);
  const isControlled = addedPlayers !== undefined;

  const currentPlayers = isControlled ? addedPlayers : players;

  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const [searchPlayer, { isLoading: isSearching }] =
    useLazySearchPlayerMobileQuery();

  const [createPlayer, { isLoading: isCreatingPlayer }] =
    useCreatePlayerMutation();

  const [removingPlayerId, setRemovingPlayerId] = useState<string | null>(null);

  function resetFlow() {
    setMobile("");
    setFullName("");
    setError("");
    setStep("SEARCH_MOBILE");
  }

  async function addToList(player: Player) {
    if (currentPlayers.some((p) => p.id === player.id)) {
      setError("This player is already in your list.");
      return;
    }

    setError("");

    try {
      const isAdded = await onAddPlayer(player);

      if (!isAdded) {
        return;
      }

      if (!isControlled) {
        setPlayers((prev) => [...prev, player]);
      }

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

  async function handleRemovePlayer(player: Player) {
    if (!onRemovePlayer) {
      return;
    }

    setError("");
    setRemovingPlayerId(player.id);

    try {
      await onRemovePlayer(player);

      if (!isControlled) {
        setPlayers((prev) => prev.filter((item) => item.id !== player.id));
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
          : "Failed to remove player.";

      setError(message);
    } finally {
      setRemovingPlayerId(null);
    }
  }

  const primaryLabel =
    step === "SEARCH_MOBILE" ? "Search Player" : "Create Player";

  const primaryAction =
    step === "SEARCH_MOBILE" ? handleSearch : handleCreatePlayer;

  const primaryLoading = isSearching || isCreatingPlayer || isAddingPlayer;

  return (
    <div className="h-full bg-(--color-bg-base)">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 pt-5">
        <p className="mt-1 text-xs text-(--color-text-muted)">{helperText}</p>
        {currentPlayers.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between px-0.5">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-(--color-brand)" />
                <p className="text-section-label">
                  Recently Added ({currentPlayers.length})
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-(--shadow-card)">
              {currentPlayers.map((player) => (
                <CreatePlayerCard
                  key={player.id}
                  player={player}
                  // onRemove={() => handleRemovePlayer(player.id)}
                  onRemove={
                    onRemovePlayer
                      ? () => handleRemovePlayer(player)
                      : undefined
                  }
                  isRemoving={removingPlayerId === player.id}
                />
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
          "safe-bottom shrink-0 border-t border-(--color-bg-border) px-4 py-3",
          "flex flex-col gap-2",
        )}
      >
        <Button fullWidth onClick={primaryAction} loading={primaryLoading}>
          {primaryLabel}
        </Button>

        {currentPlayers.length > 0 && (
          <Button
            size="sm"
            fullWidth
            variant="secondary"
            onClick={() => onDone(currentPlayers)}
          >
            {doneLabel
              ? doneLabel(currentPlayers.length)
              : `Done — ${currentPlayers.length} Player${
                  currentPlayers.length > 1 ? "s" : ""
                } added to Team`}
          </Button>
        )}
      </div>
    </div>
  );
}
