import { redirect } from "next/navigation";

type MatchPageProps = {
  params: {
    matchId: string;
  };
};

export default function MatchPage({ params }: MatchPageProps) {
  redirect(`/matches/${encodeURIComponent(params.matchId)}/scorecard`);
}
