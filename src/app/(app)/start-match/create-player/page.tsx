"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/providers/HeaderProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/common/Button";
import {
  useCreatePlayerMutation,
  useLazySearchPlayerMobileQuery,
} from "@/store/api/playerApi";
import MobileSearchForm from "./MobileSearchForm";
import CreatePlayerForm from "./CreatePlayerForm";
import PlayerCard from "./PlayerCard";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/auth/authSelectors";
import { Player } from "@/types/player";
import { Users, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAddTeamMemberMutation } from "@/store/api/teamApi";
import { selectTeamA, selectTeamB } from "@/store/startMatch/selectors";

type Step = "SEARCH_MOBILE" | "CREATE_PLAYER";

export default function CreatePlayerPage() {
  const { setHeader } = useHeader();
  const router = useRouter();

  const activeTeam = useAppSelector((state) => state.startMatch.activeTeam);

  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);

  const currentTeam = activeTeam === "A" ? teamA : teamB;

  console.log(currentTeam);
  console.log(activeTeam);
  console.log(teamA);
  console.log(teamB);

  const [step, setStep] = useState<Step>("SEARCH_MOBILE");
  const [players, setPlayers] = useState<Player[]>([]);
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const user = useAppSelector(selectUser);

  const [searchPlayer, { isLoading }] = useLazySearchPlayerMobileQuery();
  const [createPlayer, { isLoading: isCreatingPlayer }] =
    useCreatePlayerMutation();
  const [addTeamMember, { isLoading: isAddingTeam }] =
    useAddTeamMemberMutation();

  useEffect(() => {
    setHeader({
      title: "Add Player",
      showBackButton: true,
      showNotifications: false,
    });
  }, [setHeader]);

  // ── Reset to mobile search ────────────────────────────────────────────────
  function resetFlow() {
    setMobile("");
    setFullName("");
    setError("");
    setStep("SEARCH_MOBILE");
  }

  // ── Helper: add player to team API + local list ──────────────────────────
  async function addToList(player: Player) {
    if (players.some((p) => p.id === player.id)) {
      setError("This player is already in your list.");
      return;
    }
    if (!currentTeam) {
      setError("Team ID not found.");
      return;
    }
    setError("");
    try {
      await addTeamMember({
        teamId: currentTeam.id,
        body: { playerId: player.id },
      }).unwrap();
      setPlayers((prev) => [...prev, player]);
      resetFlow();
    } catch (err: any) {
      setError(
        err?.data?.message ?? "Failed to add player to team. Please try again.",
      );
    }
  }

  // ── Step 1: search by mobile → auto-add if found, else go to CREATE ───────
  async function handleSearch() {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    try {
      const response = await searchPlayer(mobile).unwrap();
      if (response.player) {
        // Player exists — add directly, no confirmation needed
        addToList(response.player);
      } else {
        // No account — let user name the player
        setStep("CREATE_PLAYER");
      }
    } catch (err: any) {
      setError(err?.data?.message ?? "Something went wrong. Please try again.");
    }
  }

  // ── Step 2: create player → auto-add after creation ───────────────────────
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
        createdSource: "MATCH_SCORING",
        createdByActorType: "SYSTEM",
        createdByActorId: user.id,
      }).unwrap();
      // Auto-add the newly created player immediately
      addToList(response);
    } catch (err: any) {
      setError(
        err?.data?.message ?? "Failed to create player. Please try again.",
      );
    }
  }

  // ── Final: done → navigate ────────────────────────────────────────────────
  function handleDone() {
    router.push(`/start-match/select-players`);
  }

  const primaryLabel =
    step === "SEARCH_MOBILE" ? "Search Player" : "Create Player";
  const primaryAction =
    step === "SEARCH_MOBILE" ? handleSearch : handleCreatePlayer;
  const primaryLoading = isLoading || isCreatingPlayer || isAddingTeam;

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4 flex flex-col gap-4">
        {/* ── Added players roster ────────────────────────────────────── */}
        {players?.length > 0 && (
          <div>
            {/* Section header */}
            <div className="mb-2 flex items-center justify-between px-0.5">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-(--color-brand)" />
                <p className="text-section-label">
                  Added Players ({players.length})
                </p>
              </div>
              <button
                onClick={() => setPlayers([])}
                className="text-xs font-semibold text-(--color-text-muted) hover:text-(--color-live) transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-(--shadow-card)">
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        )}

        {/* ── Step header ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3 shadow-(--shadow-card)">
          <p className="text-section-label mb-0.5">
            {step === "SEARCH_MOBILE" ? "Find Player" : "New Player"}
          </p>
          <p className="text-sm font-medium text-(--color-text-secondary)">
            {step === "SEARCH_MOBILE"
              ? "Enter a mobile number to find or add a player."
              : `No account found for +91 ${mobile}. Enter a name to create one.`}
          </p>

          {/* Back to search — only on CREATE_PLAYER */}
          {step === "CREATE_PLAYER" && (
            <button
              onClick={() => resetFlow()}
              className="mt-2 flex items-center gap-1 text-xs font-semibold text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
            >
              <ArrowLeft size={13} />
              Search a different number
            </button>
          )}
        </div>

        {/* ── Step content ────────────────────────────────────────────── */}
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

        {/* Error */}
        {error && (
          <p className="rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-2.5 text-sm font-medium text-(--color-live)">
            {error}
          </p>
        )}

        {/* Manual add link */}
        <button
          onClick={() => router.push("/start-match/create-player?manual=true")}
          className="self-start text-sm font-medium text-(--color-brand) underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          Can&apos;t add by mobile? Add manually
        </button>
      </div>

      {/* ── Sticky bottom CTAs ───────────────────────────────────────────── */}
      <div
        className={cn(
          "safe-bottom shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3",
          "flex flex-col gap-2",
        )}
      >
        {/* Primary action */}
        <Button fullWidth onClick={primaryAction} loading={primaryLoading}>
          {primaryLabel}
        </Button>

        {/* Done — only shown when at least one player is added */}
        {players.length > 0 && (
          <Button fullWidth variant="secondary" onClick={handleDone}>
            Done — Add {players.length} Player{players.length > 1 ? "s" : ""} to
            Team
          </Button>
        )}
      </div>
    </div>
  );
}
