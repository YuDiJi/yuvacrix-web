"use client";

import { AlertCircle, Trophy } from "lucide-react";
import { useParams } from "next/navigation";

import { S3Image } from "@/components/common/S3Image";
import { cn } from "@/lib/cn";
import { useGetTournamentPointsTableQuery } from "@/store/api/tournamentPointsApi";

function formatNrr(nrr: number) {
  if (nrr > 0) return `+${nrr.toFixed(3)}`;
  return nrr.toFixed(3);
}

function PointsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-3 border-b border-(--color-bg-border) p-4 last:border-b-0"
        >
          <div className="h-5 w-5 rounded bg-(--color-bg-border)" />
          <div className="h-10 w-10 rounded-full bg-(--color-bg-border)" />
          <div className="h-4 flex-1 rounded bg-(--color-bg-border)" />
          <div className="h-4 w-8 rounded bg-(--color-bg-border)" />
          <div className="h-4 w-8 rounded bg-(--color-bg-border)" />
        </div>
      ))}
    </div>
  );
}

export default function TournamentPointsTable() {
  const params = useParams();
  const tournamentId = params.tournamentId as string;

  const { data, isLoading, isError, refetch } =
    useGetTournamentPointsTableQuery({
      tournamentId,
    });

  if (isLoading) {
    return (
      <div className="p-4">
        <PointsTableSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <AlertCircle size={34} className="text-(--color-live)" />

        <div>
          <h3 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
            Failed to load points table
          </h3>

          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Please check your connection and try again.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-xl bg-(--color-brand) px-5 py-3 text-sm font-bold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (data.rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-(--color-bg-tint)">
          <Trophy size={34} className="text-(--color-brand)" />
        </div>

        <h3 className="mt-5 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
          Points Table Not Available
        </h3>

        <p className="mt-2 max-w-64 text-sm leading-6 text-(--color-text-secondary)">
          The standings will appear after tournament matches are completed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-(--color-bg-base) p-4">
      <div className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full border-collapse">
            <thead>
              <tr className="border-b border-(--color-bg-border) bg-(--color-bg-tint)">
                <th className="w-12 px-3 py-3 text-center text-[10px] font-black uppercase tracking-wider text-(--color-text-muted)">
                  Pos
                </th>

                <th className="min-w-52 px-3 py-3 text-left text-[10px] font-black uppercase tracking-wider text-(--color-text-muted)">
                  Team
                </th>

                <th className="px-3 py-3 text-center text-[10px] font-black uppercase text-(--color-text-muted)">
                  P
                </th>

                <th className="px-3 py-3 text-center text-[10px] font-black uppercase text-(--color-text-muted)">
                  W
                </th>

                <th className="px-3 py-3 text-center text-[10px] font-black uppercase text-(--color-text-muted)">
                  L
                </th>

                <th className="px-3 py-3 text-center text-[10px] font-black uppercase text-(--color-text-muted)">
                  T
                </th>

                <th className="px-3 py-3 text-center text-[10px] font-black uppercase text-(--color-text-muted)">
                  NR
                </th>

                <th className="px-3 py-3 text-center text-[10px] font-black uppercase text-(--color-text-muted)">
                  NRR
                </th>

                <th className="px-3 py-3 text-center text-[10px] font-black uppercase text-(--color-text-muted)">
                  Pts
                </th>
              </tr>
            </thead>

            <tbody>
              {data.rows.map((row) => (
                <tr
                  key={row.teamId}
                  className="border-b border-(--color-bg-border) last:border-b-0"
                >
                  <td className="px-3 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2",
                        "font-(family-name:--font-display) text-sm font-black",
                        row.position === 1
                          ? "bg-(--color-six)/15 text-(--color-six)"
                          : "bg-(--color-bg-base) text-(--color-text-secondary)",
                      )}
                    >
                      {row.position}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-tint)">
                        {row.teamLogoSnapshot ? (
                          <S3Image
                            imageKey={row.teamLogoSnapshot}
                            alt={row.teamNameSnapshot}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                            fallback={
                              <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
                                <span className="font-bold text-white">
                                  {row.teamNameSnapshot.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            }
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
                            <span className="font-bold text-white">
                              {row.teamNameSnapshot.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-(family-name:--font-display) text-sm font-black uppercase text-(--color-text-primary)">
                          {row.teamNameSnapshot}
                        </p>

                        {row.penaltyPoints > 0 && (
                          <p className="mt-0.5 text-[10px] font-semibold text-(--color-live)">
                            -{row.penaltyPoints} penalty point
                            {row.penaltyPoints !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-center text-sm font-semibold text-(--color-text-secondary)">
                    {row.matchesPlayed}
                  </td>

                  <td className="px-3 py-3 text-center text-sm font-semibold text-(--color-four)">
                    {row.wins}
                  </td>

                  <td className="px-3 py-3 text-center text-sm font-semibold text-(--color-live)">
                    {row.losses}
                  </td>

                  <td className="px-3 py-3 text-center text-sm font-semibold text-(--color-text-secondary)">
                    {row.ties}
                  </td>

                  <td className="px-3 py-3 text-center text-sm font-semibold text-(--color-text-secondary)">
                    {row.noResults}
                  </td>

                  <td
                    className={cn(
                      "px-3 py-3 text-center text-sm font-bold",
                      row.nrr > 0
                        ? "text-(--color-four)"
                        : row.nrr < 0
                          ? "text-(--color-live)"
                          : "text-(--color-text-secondary)",
                    )}
                  >
                    {row.nrrCalculationStatus === "COMPLETE"
                      ? formatNrr(row.nrr)
                      : "—"}
                  </td>

                  <td className="px-3 py-3 text-center font-(family-name:--font-display) text-base font-black text-(--color-brand)">
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3">
          <p className="text-[10px] leading-4 text-(--color-text-muted)">
            P: Played, W: Won, L: Lost, T: Tied, NR: No Result, NRR: Net Run
            Rate, Pts: Points
          </p>

          <p className="mt-1 text-[10px] text-(--color-text-muted)">
            Last calculated{" "}
            {new Intl.DateTimeFormat("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(data.calculatedAt))}
          </p>
        </div>
      </div>
    </div>
  );
}
