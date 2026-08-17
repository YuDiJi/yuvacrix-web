import { redirect } from "next/navigation";

type LegacyMatchRulesPageProps = {
  searchParams: {
    matchId?: string | string[];
  };
};

export default function LegacyMatchRulesPage({
  searchParams,
}: LegacyMatchRulesPageProps) {
  const matchId = Array.isArray(searchParams.matchId)
    ? searchParams.matchId[0]
    : searchParams.matchId;

  if (!matchId) {
    redirect("/start-match");
  }

  redirect(`/matches/${encodeURIComponent(matchId)}/rules`);
}
