"use client";

// import { useHeader } from "@/providers/HeaderProvider";
import {
  Search,
  SlidersHorizontal,
  Plus,
  ChevronRight,
  RefreshCw,
  WifiOff,
  AlertTriangle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetOwnedTeamQuery } from "@/store/api/teamApi";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setActiveTeam,
  setTeamA,
  setTeamB,
} from "@/store/startMatch/startMatchSlice";
import { selectTeamA, selectTeamB } from "@/store/startMatch/selectors";
import { TeamCard } from "@/components/cricket/team/TeamCard";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

function getErrorMessage(error: unknown): string {
  if (!error) {
    return "Something went wrong while loading your teams.";
  }

  if ("status" in (error as FetchBaseQueryError)) {
    const apiError = error as FetchBaseQueryError;

    if (apiError.status === "FETCH_ERROR") {
      return "Unable to connect to the server. Check your internet connection and try again.";
    }

    if (apiError.status === "TIMEOUT_ERROR") {
      return "The request took too long. Please try again.";
    }

    if (apiError.status === 401) {
      return "Your session has expired. Please log in again.";
    }

    if (apiError.status === 403) {
      return "You do not have permission to view these teams.";
    }

    if (apiError.status === 404) {
      return "The teams service could not be found.";
    }

    if (typeof apiError.status === "number" && apiError.status >= 500) {
      return "The server is currently unavailable. Please try again shortly.";
    }

    if (
      typeof apiError.data === "object" &&
      apiError.data !== null &&
      "message" in apiError.data &&
      typeof apiError.data.message === "string"
    ) {
      return apiError.data.message;
    }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Something went wrong while loading your teams.";
}

function TeamCardSkeleton() {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "rounded-2xl border border-(--color-bg-border)",
        "bg-(--color-bg-card) p-3.5 shadow-(--shadow-card)",
      )}
    >
      <div className="flex items-center gap-3.5">
        <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-(--color-bg-border)" />

        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded-md bg-(--color-bg-border)" />
          <div className="h-3 w-20 animate-pulse rounded-md bg-(--color-bg-border)" />
        </div>
      </div>

      <div className="h-5 w-5 animate-pulse rounded-md bg-(--color-bg-border)" />
    </div>
  );
}

function SelectTeamSkeleton() {
  return (
    <div className="relative min-h-full bg-(--color-bg-base) p-4 pb-24">
      {/* Search skeleton */}
      <div
        className={cn(
          "mb-5 flex items-center gap-3 rounded-2xl border-2",
          "border-(--color-bg-border) bg-(--color-bg-card)",
          "px-4 py-3 shadow-(--shadow-card)",
        )}
      >
        <div className="h-5 w-5 animate-pulse rounded-md bg-(--color-bg-border)" />
        <div className="h-4 flex-1 animate-pulse rounded-md bg-(--color-bg-border)" />
        <div className="h-7 w-7 animate-pulse rounded-lg bg-(--color-bg-border)" />
      </div>

      {/* Section label skeleton */}
      <div className="mb-3 h-3 w-20 animate-pulse rounded-md bg-(--color-bg-border)" />

      {/* Team card skeletons */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <TeamCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default function SelectTeamPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamType = searchParams.get("team");
  const [searchTerm, setSearchTerm] = useState("");

  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);

  const {
    data: teams,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetOwnedTeamQuery();

  const filteredTeams =
    teams?.filter((team) => {
      // Search filter
      const matchesSearch = team.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Prevent selecting same team for both sides
      if (teamType === "B" && team.id === teamA?.id) {
        return false;
      }

      if (teamType === "A" && team.id === teamB?.id) {
        return false;
      }

      return matchesSearch;
    }) ?? [];

  // Initial loading state
  if (isLoading) {
    return <SelectTeamSkeleton />;
  }

  // Error state
  if (isError) {
    const isNetworkError =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === "FETCH_ERROR";

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50 shadow-[0_8px_32px_rgba(239,68,68,0.12)]">
            {isNetworkError ? (
              <WifiOff size={42} className="text-red-500" strokeWidth={1.7} />
            ) : (
              <AlertTriangle
                size={42}
                className="text-red-500"
                strokeWidth={1.7}
              />
            )}
          </div>

          <div className="absolute inset-0 scale-110 rounded-3xl border-2 border-red-500/10" />
        </div>

        <h3
          className="font-(family-name:--font-display) text-2xl font-black uppercase text-(--color-text-primary)"
          style={{ letterSpacing: "0.04em" }}
        >
          Unable To Load Teams
        </h3>

        <p className="mt-2 max-w-72 text-sm leading-relaxed text-(--color-text-secondary)">
          {getErrorMessage(error)}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className={cn(
            "mt-6 flex min-w-36 items-center justify-center gap-2 rounded-xl",
            "bg-(--color-brand) px-5 py-3 text-sm font-bold text-white",
            "shadow-[0_6px_18px_rgba(27,63,160,0.25)]",
            "transition-all duration-150 hover:bg-[#2449b8]",
            "active:scale-[0.97]",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          <RefreshCw size={17} className={cn(isFetching && "animate-spin")} />

          {isFetching ? "Retrying..." : "Try Again"}
        </button>
      </div>
    );
  }

  // Empty team state
  if (teams?.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <button
          type="button"
          onClick={() =>
            router.push(`/start-match/create-team?team=${teamType ?? "A"}`)
          }
          className="relative mb-6"
          aria-label="Create your first team"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-(--color-navy) shadow-[0_8px_32px_rgba(13,27,62,0.18)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 20v-2.03c0-1.242.56-2.46 1.69-2.975C6.068 14.366 7.722 14 9.5 14c1.245 0 2.429.18 3.5.503" />
              <circle cx="9.5" cy="7.5" r="3.5" />
              <path d="M14.5 4.145a3.502 3.502 0 0 1 0 6.71M18 14v6m-3-3h6" />
            </svg>
          </div>

          <div className="absolute inset-0 scale-110 rounded-3xl border-2 border-(--color-brand)/20" />
        </button>

        <h3
          className="font-(family-name:--font-display) text-2xl font-black uppercase text-(--color-text-primary)"
          style={{ letterSpacing: "0.04em" }}
        >
          No Teams Yet
        </h3>

        <p className="mt-2 max-w-55 text-sm leading-relaxed text-(--color-text-secondary)">
          Create your first team and start scoring matches with your squad.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-full bg-(--color-bg-base) p-4 pb-24">
      {/* Search Bar */}
      <div
        className={cn(
          "mb-5 flex items-center gap-3 rounded-2xl border-2 border-(--color-bg-border)",
          "bg-(--color-bg-card) px-4 py-3 shadow-(--shadow-card)",
          "focus-within:border-(--color-sky) focus-within:shadow-[0_0_0_3px_rgba(75,139,255,0.10)]",
          "transition-all duration-150",
        )}
      >
        <Search size={18} className="shrink-0 text-(--color-text-muted)" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search teams..."
          className={cn(
            "flex-1 bg-transparent outline-none",
            "font-(family-name:--font-display) text-sm font-bold uppercase tracking-[0.06em]",
            "text-(--color-text-primary)",
            "placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-(--color-text-muted)",
          )}
        />
        <button
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--color-bg-base) text-(--color-text-secondary) transition-all hover:bg-(--color-bg-tint) hover:text-(--color-brand) active:scale-90"
          aria-label="Filter"
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>

      {/* Section label */}
      <p className="text-section-label mb-3 px-1">All Teams</p>

      {/* Team List */}
      {/* <div className="flex flex-col gap-3">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            onClick={() => {
              if (
                (teamType === "A" && team.id === teamB?.id) ||
                (teamType === "B" && team.id === teamA?.id)
              ) {
                alert("Team A and Team B cannot be the same");
                return;
              }

              if (teamType === "A") {
                dispatch(setTeamA(team));
                dispatch(setActiveTeam("A"));
              } else {
                dispatch(setTeamB(team));
                dispatch(setActiveTeam("B"));
              }

              router.push("/start-match/select-players");
            }}
            className={cn(
              "flex cursor-pointer items-center justify-between",
              "rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3.5",
              "shadow-(--shadow-card) transition-all duration-150",
              "active:scale-[0.98] hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint)",
            )}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  "h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-(--color-bg-border)",
                  !team.logoUrl &&
                    "flex items-center justify-center bg-(--color-navy)",
                )}
              >
                {team.logoUrl ? (
                  <S3Image
                    imageKey={team.logoUrl}
                    alt={team.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                    fallback={
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-brand)">
                        <span className="font-bold text-white">
                          {team.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    }
                  />
                ) : (
                  <span
                    className="font-(family-name:--font-display) text-xl font-black text-white"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    {team.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <h4
                  className="font-(family-name:--font-display) text-base font-black uppercase text-(--color-text-primary)"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {team.name}
                </h4>
                <p className="text-meta mt-0.5">{team.memberCount} Players</p>
              </div>
            </div>

            <ChevronRight
              size={18}
              className="shrink-0 text-(--color-text-muted)"
            />
          </div>
        ))}
      </div> */}
      <div className="flex flex-col gap-3">
        {filteredTeams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            disabled={
              (teamType === "A" && team.id === teamB?.id) ||
              (teamType === "B" && team.id === teamA?.id)
            }
            onClick={(team) => {
              if (teamType === "A") {
                dispatch(setTeamA(team));
                dispatch(setActiveTeam("A"));
              } else {
                dispatch(setTeamB(team));
                dispatch(setActiveTeam("B"));
              }

              router.push("/start-match/select-players");
            }}
          />
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="py-10 text-center text-(--color-text-muted)">
          No teams found
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => router.push("/start-match/create-team?team=" + teamType)}
        className={cn(
          "fixed bottom-10 right-4 md:right-[38%]  z-20",
          "flex h-14 w-14 items-center justify-center rounded-2xl",
          "bg-(--color-brand) text-white",
          "shadow-[0_8px_24px_rgba(27,63,160,0.40)]",
          "transition-all duration-200 active:scale-90 hover:bg-[#2449b8]",
        )}
        aria-label="Create new team"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>
    </div>
  );
}
