import {
  Radio,
  Users,
  Trophy,
  Zap,
  FileText,
  User,
  Edit2,
  Calendar,
  BarChart2,
  Plus,
  ArrowRight,
  Tv,
  type LucideIcon,
} from "lucide-react";
import type { HomeIcon } from "@/types/cricket/home";

export const ICON_MAP: Record<HomeIcon, LucideIcon> = {
  LIVE: Radio,
  TEAM: Users,
  TROPHY: Trophy,
  BROADCAST: Tv,
  LIGHTNING: Zap,
  SCORECARD: FileText,
  PLAYER: User,
  EDIT: Edit2,
  CALENDAR: Calendar,
  STATS: BarChart2,
  PLUS: Plus,
  GROUP: Users,
  ARROW_RIGHT: ArrowRight,
};

export function getIcon(icon: HomeIcon): LucideIcon {
  return ICON_MAP[icon] ?? Plus;
}
