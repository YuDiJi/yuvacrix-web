"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/providers/HeaderProvider";
import { Camera, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/common/Button";
import {
  useCreatePlayerMutation,
  useLazySearchPlayerMobileQuery,
} from "@/store/api/playerApi";
import Image from "next/image";
import { cn } from "@/lib/cn";
import MobileSearchForm from "./MobileSearchForm";
import CreatePlayerForm from "./CreatePlayerForm";
import PlayerCard from "./PlayerCard";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/auth/authSelectors";

export default function CreatePlayerPage() {
  const { setHeader } = useHeader();

  const searchParams = useSearchParams();
  const team = searchParams.get("team");

  type Step = "SEARCH_MOBILE" | "PLAYER_FOUND" | "CREATE_PLAYER";
  const [step, setStep] = useState<Step>("SEARCH_MOBILE");

  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);

  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const resetFlow = () => {
    setMobile("");
    setFullName("");
    setCurrentPlayer(null);
    setError("");
    setStep("SEARCH_MOBILE");
  };

  useEffect(() => {
    setHeader({
      title: "CREATE PLAYER",
      showBackButton: true,
      showNotifications: false,
    });
  }, [setHeader]);

  const [searchPlayer, { data, isLoading, error: searchError }] =
    useLazySearchPlayerMobileQuery();
  const [createPlayer, { isLoading: isCreatingPlayer }] =
    useCreatePlayerMutation();

  const user = useAppSelector(selectUser);

  const handleSearch = async () => {
    if (mobile.length !== 10) {
      setError("Please enter a valid mobile number");
      return;
    }
    setError("");
    try {
      const response = await searchPlayer(mobile).unwrap();

      if (response.player) {
        setCurrentPlayer(response.player);
        setStep("PLAYER_FOUND");
      } else {
        setStep("CREATE_PLAYER");
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleCreatePlayer = async () => {
    if (!fullName.trim()) {
      setError("Please enter player name");
      return;
    }

    if (!user) {
      setError("User not found");
      return;
    }
    try {
      const response = await createPlayer({
        fullName,
        claimMobile: mobile,
        createdSource: "MATCH_SCORING",
        createdByActorType: "SYSTEM",
        createdByActorId: user._id,
      }).unwrap();

      setCurrentPlayer(response.player);
      setStep("PLAYER_FOUND");
    } catch (err: any) {
      setError("Failed to create player");
    }
  };

  const handleAddPlayerToList = () => {
    if (!currentPlayer) return;

    const alreadyAdded = players.some(
      (player) => player._id === currentPlayer._id,
    );

    if (alreadyAdded) {
      setError("Player already added");
      return;
    }

    setPlayers((prev) => [...prev, currentPlayer]);

    resetFlow();
  };

  const handleAddPlayerToTeam = async () => {
    if (!players.length) {
      setError("Please add at least one player");
      return;
    }

    try {
      // await addPlayersToTeam({
      //   teamId: team,
      //   playerIds: players.map((player) => player._id),
      // }).unwrap();
      // navigate to next screen
    } catch (err) {
      setError("Failed to add players to team");
    }
  };

  console.log(user);
  console.log(step);

  return (
    <div className="p-4 bg-slate-50 min-h-full flex flex-col items-center pt-8">
      {/* Form Fields */}
      <div className="w-full space-y-4 mb-8">
        {players.length > 0 && (
          <div className="w-full mb-6">
            <h3 className="mb-2 text-sm font-bold text-slate-500 uppercase">
              Added Players ({players.length})
            </h3>

            <div className="space-y-2">
              {players.map((player) => (
                <PlayerCard key={player._id} player={player} />
              ))}
            </div>
          </div>
        )}

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

        {step === "PLAYER_FOUND" && <PlayerCard player={currentPlayer} />}

        <p className="text-sm font-medium text-(--color-brand) underline underline-offset-2 transition-opacity hover:opacity-70">
          Can&apos;t add by mobile number? Add player manually
        </p>
      </div>

      {/* <Button onClick={() => handleDone()}>Done</Button> */}
      <Button
        onClick={
          step === "SEARCH_MOBILE"
            ? handleSearch
            : step === "CREATE_PLAYER"
              ? handleCreatePlayer
              : handleAddPlayerToList
        }
        loading={isLoading || isCreatingPlayer}
      >
        {step === "SEARCH_MOBILE" && "Search"}
        {step === "CREATE_PLAYER" && "Create Player"}
        {step === "PLAYER_FOUND" && "Add Player"}
      </Button>

      {players.length > 0 && (
        <Button fullWidth variant="secondary" onClick={handleAddPlayerToTeam}>
          Done ({players.length})
        </Button>
      )}
    </div>
  );
}
