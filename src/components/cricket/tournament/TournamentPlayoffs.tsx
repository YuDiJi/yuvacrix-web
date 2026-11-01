"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DialogBox } from "@/components/common/DialogBox";
import { Button } from "@/components/common/Button";
import { S3Image } from "@/components/common/S3Image";
import type { Tournament } from "@/store/api/cricket/tournamentApi";
import { useGetTournamentRoundsQuery } from "@/store/api/cricket/tournamentRoundApi";
import { useGetTournamentPointsTableQuery } from "@/store/api/cricket/tournamentPointsApi";
import {
  useGenerateKnockoutFixturesMutation,
  useGetTournamentPlayoffFixturesQuery,
  type GenerateKnockoutFixturesBody,
  type TournamentFixture,
} from "@/store/api/cricket/tournamentFixtureApi";
import { hasLinkedMatch, playoffGenerationBody, playoffPreview, tournamentPlayoffError, validPlayoffConfig } from "./playoffs";

const PLAYOFF_ROUNDS = new Set(["QUARTER_FINAL", "SEMI_FINAL", "FINAL"]);

export function isPlayoffFixture(fixture: TournamentFixture, rounds: { id: string; roundType: string }[]) {
  return fixture.generationKey?.startsWith("cricket-knockout:") || rounds.some((round) => round.id === fixture.roundId && PLAYOFF_ROUNDS.has(round.roundType));
}

function PlayoffSetup({ tournament, onClose, onGenerated }: {
  tournament: Tournament; onClose: () => void; onGenerated: () => void;
}) {
  const standings = useGetTournamentPointsTableQuery({ tournamentId: tournament.id }, { refetchOnMountOrArgChange: true });
  const [generate, { isLoading }] = useGenerateKnockoutFixturesMutation();
  const pending = useRef(false);
  const [error, setError] = useState("");
  const [override, setOverride] = useState(false);
  const config = tournament.formatConfig;
  const rows = standings.currentData?.rows ?? [];
  const preview = validPlayoffConfig(config) ? playoffPreview(config, rows.map((row) => row.teamNameSnapshot)) : [];
  const canGenerate = preview.length > 0 && !standings.isFetching && !standings.isError && !standings.currentData?.validationError;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canGenerate || pending.current) return;
    const form = new FormData(event.currentTarget);
    let body: GenerateKnockoutFixturesBody;
    try {
      body = playoffGenerationBody(override, Object.fromEntries(
        ["oversLimit", "oversPerBowler", "city", "groundName", "pitchType"].map((key) => [key, String(form.get(key) ?? "")]),
      ));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Review the supplied overrides.");
      return;
    }
    pending.current = true;
    setError("");
    try {
      await generate({ tournamentId: tournament.id, body }).unwrap();
      onGenerated();
    } catch (cause) {
      setError(tournamentPlayoffError(cause));
    } finally {
      pending.current = false;
    }
  }

  return <DialogBox open onClose={() => { if (!pending.current) onClose(); }}>
    <form onSubmit={submit} className="max-h-[80dvh] space-y-4 overflow-y-auto p-5" aria-label="Playoff Bracket Setup">
      <h2 className="text-lg font-bold">Playoff Bracket Setup</h2>
      {standings.isFetching ? <p role="status">Loading standings…</p>
        : standings.isError || standings.currentData?.validationError ? <div role="alert"><p>{standings.currentData?.validationError ?? "Unable to load standings."}</p><Button type="button" onClick={() => void standings.refetch()}>Retry</Button></div>
        : !rows.length ? <p>No ranked teams are available yet.</p>
        : !preview.length ? <p>There are not enough ranked teams. This format requires {config?.qualifyingTeamCount} teams.</p>
        : <div className="space-y-2 text-sm">
          <p className="font-bold">Qualified teams (current standings)</p>
          <ol className="list-inside list-decimal">{rows.slice(0, config?.qualifyingTeamCount).map((row) => <li key={row.teamId}>{row.teamNameSnapshot}</li>)}</ol>
          {preview.map((matchup) => <p key={matchup} className="rounded-lg bg-(--color-bg-base) p-2">{matchup}</p>)}
        </div>}
      <p className="text-xs text-(--color-text-secondary)">The server verifies league completion and selects teams from its latest standings. Winners advance automatically.</p>
      <label className="flex gap-2 text-sm"><input type="checkbox" checked={override} onChange={(event) => setOverride(event.target.checked)} disabled={isLoading} />Override inherited rules or venue</label>
      {!override && <p className="text-xs">Keep rules and venue inherited from qualifying fixtures.</p>}
      {override && <fieldset disabled={isLoading} className="space-y-3 text-sm">
        {([['oversLimit', 'Overs'], ['oversPerBowler', 'Overs per bowler'], ['city', 'City'], ['groundName', 'Ground name']] as const).map(([name, label]) => <label key={name} className="block">{label}<input name={name} type={name.startsWith("overs") ? "number" : "text"} min={name.startsWith("overs") ? 1 : undefined} step={name.startsWith("overs") ? 1 : undefined} className="mt-1 w-full rounded-lg border border-(--color-bg-border) p-2" /></label>)}
        <label className="block">Pitch type<select name="pitchType" className="mt-1 w-full rounded-lg border p-2"><option value="">Keep inherited pitch</option>{["ROUGH", "CEMENT", "TURF", "ASTROTURF", "MATTING"].map((type) => <option key={type}>{type}</option>)}</select></label>
      </fieldset>}
      {error && <p role="alert" className="text-sm text-(--color-live)">{error}</p>}
      <div className="flex gap-2"><Button type="button" variant="secondary" disabled={isLoading} onClick={() => { if (!pending.current) onClose(); }}>Cancel</Button><Button type="submit" disabled={!canGenerate || isLoading} loading={isLoading}>Confirm & Generate</Button></div>
    </form>
  </DialogBox>;
}

export default function TournamentPlayoffs({ tournament, showBracket, onGenerated }: {
  tournament: Tournament; showBracket: boolean; onGenerated: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const fixturesQuery = useGetTournamentPlayoffFixturesQuery(tournament.id, { refetchOnMountOrArgChange: true });
  const roundsQuery = useGetTournamentRoundsQuery({ tournamentId: tournament.id }, { refetchOnMountOrArgChange: true });
  const fixtures = fixturesQuery.currentData ?? [];
  const rounds = roundsQuery.currentData ?? [];
  const bracket = fixtures.filter((fixture) => isPlayoffFixture(fixture, rounds));
  const qualifying = fixtures.filter((fixture) => !isPlayoffFixture(fixture, rounds));
  const hasPlayoffRounds = rounds.some((round) => PLAYOFF_ROUNDS.has(round.roundType));
  const ready = qualifying.length > 0 && qualifying.some((fixture) => fixture.status === "COMPLETED") && qualifying.every((fixture) => ["COMPLETED", "CANCELLED"].includes(fixture.status));
  const config = tournament.formatConfig;
  const validConfig = validPlayoffConfig(config);
  const terminal = ["COMPLETED", "CANCELLED", "ARCHIVED"].includes(tournament.status);
  const loading = fixturesQuery.isFetching || roundsQuery.isFetching;
  const failed = fixturesQuery.isError || roundsQuery.isError;

  return <section className="space-y-3 p-4" aria-label="Tournament playoffs">
    {tournament.isAdmin && !terminal && !bracket.length && <div className="space-y-3 rounded-xl border border-(--color-brand)/20 bg-(--color-bg-card) p-4 text-sm">
      <h2 className="font-bold">{ready && !hasPlayoffRounds ? "League Stage Complete: Ready for Playoffs" : "Tournament Playoffs"}</h2>
      {loading ? <p role="status">Checking fixtures…</p>
        : failed ? <><p role="alert">Unable to verify playoff readiness.</p><Button type="button" onClick={() => { void fixturesQuery.refetch(); void roundsQuery.refetch(); }}>Retry</Button></>
        : !validConfig ? <p>Select a playoff structure in tournament settings if format editing is permitted.</p>
        : hasPlayoffRounds ? <p>Playoff rounds already exist. Review them in Rounds & Groups before generating another bracket.</p>
        : !ready ? <p>Complete or cancel all qualifying fixtures, including at least one completed match, before generating playoffs.</p>
        : <><p>Top {config.qualifyingTeamCount} teams qualify according to current standings. {config.playoffStructure === "TOP_3_FIRST_TO_FINAL" && "Seed #1 receives a bye to the Final; Seeds #2 & #3 play the Semifinal."}</p><Button type="button" onClick={() => setOpen(true)}>Generate Playoff Bracket</Button></>}
    </div>}
    {showBracket && bracket.length > 0 && <div className="space-y-3">
      <div className="flex items-center justify-between"><h2 className="font-bold">Playoff Bracket</h2><Button type="button" variant="secondary" disabled={loading} onClick={() => { void fixturesQuery.refetch(); void roundsQuery.refetch(); }}>Refresh</Button></div>
      {failed && <p role="alert">Unable to refresh the bracket. Showing the last loaded fixtures.</p>}
      {bracket.map((fixture) => {
        const final = rounds.find((round) => round.id === fixture.roundId)?.roundType === "FINAL" || (!fixture.nextFixtureId && !!(fixture.teamASourceFixtureId || fixture.teamBSourceFixtureId)) || (bracket.length === 1 && tournament.formatConfig?.qualifyingTeamCount === 2);
        const label = final ? "Final" : "Semifinal";
        return <article key={fixture.id} className="space-y-2 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) p-4">
          <div className="flex justify-between text-sm font-bold"><h3>{label}</h3><span>{fixture.status.replaceAll("_", " ")}</span></div>
          {(["A", "B"] as const).map((slot) => {
            const team = slot === "A" ? fixture.teamASnapshot : fixture.teamBSnapshot;
            const teamId = slot === "A" ? fixture.teamAId : fixture.teamBId;
            const sourceId = slot === "A" ? fixture.teamASourceFixtureId : fixture.teamBSourceFixtureId;
            return <div key={slot} className="flex items-center gap-2 text-sm">
              {team?.logoUrl && <S3Image imageKey={team.logoUrl} alt={team.name} width={28} height={28} className="h-7 w-7 rounded-full" fallback={null} />}
              <div>{team?.name ?? (sourceId ? "Winner of Semifinal (TBD)" : teamId ? "Team details pending" : "Team to be confirmed")}
                {final && teamId && !sourceId && tournament.formatConfig?.playoffStructure === "TOP_3_FIRST_TO_FINAL" && <span className="block text-xs text-emerald-700">Seeded #1 (Bye)</span>}
              </div>
            </div>;
          })}
          {hasLinkedMatch(fixture) ? <Button type="button" variant="secondary" onClick={() => {
            if (hasLinkedMatch(fixture)) router.push(`/matches/${fixture.matchId}/scorecard`);
          }}>Scorecard</Button> : <p className="text-xs text-(--color-text-secondary)">{fixture.teamAId && fixture.teamBId ? "Awaiting linked match. Refresh to check availability." : "Waiting for the semifinal winner. Match actions will be available once the server creates the final."}</p>}
          {hasLinkedMatch(fixture) && tournament.isAdmin && <p className="text-xs">Use the match card below to start or resume scoring.</p>}
        </article>;
      })}
    </div>}
    {open && <PlayoffSetup tournament={tournament} onClose={() => setOpen(false)} onGenerated={() => { setOpen(false); onGenerated(); }} />}
  </section>;
}
