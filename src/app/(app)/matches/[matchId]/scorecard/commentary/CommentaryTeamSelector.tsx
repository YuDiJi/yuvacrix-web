import { MatchTeamSnapshot } from "@/types/scorecard";

export type TeamSide = "teamA" | "teamB";

type Props = {
  teamA: MatchTeamSnapshot;
  teamB: MatchTeamSnapshot;
  active: TeamSide;
  onChange: (side: TeamSide) => void;
};

export default function CommentaryTeamSelector({
  teamA,
  teamB,
  active,
  onChange,
}: Props) {
  const options: { side: TeamSide; team: MatchTeamSnapshot }[] = [
    { side: "teamA", team: teamA },
    { side: "teamB", team: teamB },
  ];

  return (
    <div className="flex gap-2 px-3 pt-3">
      {options.map(({ side, team }) => {
        const isActive = side === active;
        return (
          <button
            key={side}
            onClick={() => onChange(side)}
            className={`flex-1 rounded-xl border px-3 py-1 text-center transition-colors ${
              isActive
                ? "border-(--color-brand) bg-(--color-brand)"
                : "border-(--color-bg-border) bg-(--color-bg-card)"
            }`}
          >
            <span
              className={`font-display text-[13px] font-bold uppercase tracking-wide ${
                isActive ? "text-(--color-text-inverse)" : "text-(--color-navy)"
              }`}
            >
              {team.teamNameSnapshot}
            </span>
          </button>
        );
      })}
    </div>
  );
}
