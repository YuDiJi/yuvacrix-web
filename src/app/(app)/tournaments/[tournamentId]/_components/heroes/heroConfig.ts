// _components/heroes/heroConfig.ts

import {
  Award,
  CircleDot,
  Crown,
  Hand,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { TournamentHeroType } from "@/types/tournamentAnalytics";

export type HeroVisualConfig = {
  icon: typeof Trophy;
  label: string;
  gradientClassName: string;
  badgeClassName: string;
};

export const HERO_VISUAL_CONFIG: Record<TournamentHeroType, HeroVisualConfig> =
  {
    [TournamentHeroType.ORANGE_CAP]: {
      icon: Crown,
      label: "Batting Hero",
      gradientClassName: "from-[#F59E0B] via-[#EA580C] to-[#9A3412]",
      badgeClassName: "bg-orange-100 text-orange-700",
    },

    [TournamentHeroType.PURPLE_CAP]: {
      icon: Target,
      label: "Bowling Hero",
      gradientClassName: "from-[#7C3AED] via-[#6D28D9] to-[#3B0764]",
      badgeClassName: "bg-violet-100 text-violet-700",
    },

    [TournamentHeroType.TOURNAMENT_MVP]: {
      icon: Trophy,
      label: "Tournament MVP",
      gradientClassName: "from-[#1B3FA0] via-[#312E81] to-[#0D1B3E]",
      badgeClassName: "bg-blue-100 text-blue-700",
    },

    [TournamentHeroType.MOST_FOURS]: {
      icon: Zap,
      label: "Boundary Hero",
      gradientClassName: "from-[#DB2777] via-[#BE185D] to-[#831843]",
      badgeClassName: "bg-pink-100 text-pink-700",
    },

    [TournamentHeroType.MOST_SIXES]: {
      icon: Sparkles,
      label: "Power Hitter",
      gradientClassName: "from-[#0D1B3E] via-[#1B3FA0] to-[#4B8BFF]",
      badgeClassName: "bg-blue-100 text-blue-700",
    },

    [TournamentHeroType.MOST_DOT_BALLS]: {
      icon: CircleDot,
      label: "Pressure Builder",
      gradientClassName: "from-[#B91C1C] via-[#991B1B] to-[#450A0A]",
      badgeClassName: "bg-red-100 text-red-700",
    },

    [TournamentHeroType.MOST_MAIDENS]: {
      icon: Shield,
      label: "Economy Hero",
      gradientClassName: "from-[#047857] via-[#065F46] to-[#022C22]",
      badgeClassName: "bg-emerald-100 text-emerald-700",
    },

    [TournamentHeroType.MOST_CATCHES]: {
      icon: Hand,
      label: "Safe Hands",
      gradientClassName: "from-[#0891B2] via-[#0E7490] to-[#164E63]",
      badgeClassName: "bg-cyan-100 text-cyan-700",
    },

    [TournamentHeroType.MOST_CAUGHT_BEHIND]: {
      icon: Shield,
      label: "Keeper Hero",
      gradientClassName: "from-[#4338CA] via-[#3730A3] to-[#1E1B4B]",
      badgeClassName: "bg-indigo-100 text-indigo-700",
    },

    [TournamentHeroType.MOST_STUMPINGS]: {
      icon: Target,
      label: "Quickest Hands",
      gradientClassName: "from-[#C026D3] via-[#A21CAF] to-[#701A75]",
      badgeClassName: "bg-fuchsia-100 text-fuchsia-700",
    },

    [TournamentHeroType.MOST_RUN_OUTS]: {
      icon: Zap,
      label: "Direct Impact",
      gradientClassName: "from-[#DC2626] via-[#B91C1C] to-[#7F1D1D]",
      badgeClassName: "bg-red-100 text-red-700",
    },

    [TournamentHeroType.MOST_FIELDING_DISMISSALS]: {
      icon: Award,
      label: "Fielding Hero",
      gradientClassName: "from-[#0F766E] via-[#115E59] to-[#042F2E]",
      badgeClassName: "bg-teal-100 text-teal-700",
    },

    [TournamentHeroType.BEST_WICKET_KEEPER]: {
      icon: Shield,
      label: "Best Wicketkeeper",
      gradientClassName: "from-[#1D4ED8] via-[#1E40AF] to-[#172554]",
      badgeClassName: "bg-blue-100 text-blue-700",
    },
  };
