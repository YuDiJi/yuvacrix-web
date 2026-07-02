// ── Mock data for Dashboard ───────────────────────────────────────────

export const HERO_STATS = [
  { value: "12", label: "Live Matches", icon: "live" },
  { value: "34", label: "Teams", icon: "teams" },
  { value: "4", label: "Active Tournaments", icon: "trophy" },
];

export const HERO_STRIP = [
  { icon: "live", text: "12 matches live now" },
  { icon: "trophy", text: "YuvaCrix Premier League  ·  ongoing" },
  { icon: "zap", text: "127 matches scored today" },
];

export const QUICK_ACTIONS = [
  { id: "create-match", label: "Create\nMatch", icon: "plus" },
  { id: "create-tournament", label: "Create\nTournament", icon: "trophy" },
  { id: "start-scoring", label: "Start\nScoring", icon: "edit" },
  { id: "schedule-match", label: "Schedule\nMatch", icon: "calendar" },
  { id: "join-tournament", label: "Join\nTournament", icon: "users" },
];

export type LiveMatch = {
  id: string;
  format: string;
  teamA: { name: string; short: string; color: string; emoji: string };
  teamB: { name: string; short: string; color: string; emoji: string };
  scoreA: string;
  oversA: string;
  scoreB: string;
  oversB: string;
  status: string;
  venue: string;
  views: string;
};

export const LIVE_MATCHES: LiveMatch[] = [
  {
    id: "m1",
    format: "T20",
    teamA: { name: "Mumbai XI", short: "MXI", color: "#1B3FA0", emoji: "🦁" },
    teamB: { name: "Delhi Kings", short: "DK", color: "#FF6B00", emoji: "👑" },
    scoreA: "142/4",
    oversA: "18.2 Overs",
    scoreB: "135/7",
    oversB: "20 Overs",
    status: "Mumbai XI need 8 runs in 10 balls",
    venue: "Wankhede Stadium, Mumbai",
    views: "1.2K",
  },
  {
    id: "m2",
    format: "T10",
    teamA: { name: "Pune Titans", short: "PT", color: "#7C3AED", emoji: "⚡" },
    teamB: {
      name: "Navi Strikers",
      short: "NS",
      color: "#16A34A",
      emoji: "🐍",
    },
    scoreA: "98/2",
    oversA: "7.1 Overs",
    scoreB: "—",
    oversB: "Yet to Bat",
    status: "Pune Titans elected to bat",
    venue: "Pune Sports Complex",
    views: "856",
  },
  {
    id: "m3",
    format: "T20",
    teamA: { name: "Falcons", short: "FAL", color: "#DC2626", emoji: "🦅" },
    teamB: { name: "Warriors", short: "WAR", color: "#0EA5E9", emoji: "⚔️" },
    scoreA: "73/3",
    oversA: "8.0 Overs",
    scoreB: "—",
    oversB: "Yet to Bat",
    status: "Falcons batting first",
    venue: "Green Field, Nagpur",
    views: "412",
  },
];

export const MY_ACTIVITY = [
  {
    id: 1,
    icon: "calendar",
    value: "3",
    label: "Upcoming Matches",
    link: "View all",
  },
  {
    id: 2,
    icon: "edit",
    value: "2",
    label: "Scoring Assignments",
    link: "View all",
  },
  {
    id: 3,
    icon: "trophy",
    value: "12",
    label: "Matches Played",
    link: "View stats",
  },
];

export type Tournament = {
  id: string;
  name: string;
  format: string;
  gradient: string;
  emoji: string;
  matchesPlayed: number;
  totalMatches: number;
  topTeams: { name: string; emoji: string; pts: number }[];
};

export const TOURNAMENTS: Tournament[] = [
  {
    id: "t1",
    name: "YuvaCrix Premier League",
    format: "T20",
    gradient: "from-[#0D1B3E] to-[#1B3FA0]",
    emoji: "🏆",
    matchesPlayed: 24,
    totalMatches: 32,
    topTeams: [
      { name: "Mumbai XI", emoji: "🦁", pts: 18 },
      { name: "Navi Warriors", emoji: "⚔️", pts: 16 },
      { name: "Pune Titans", emoji: "⚡", pts: 14 },
    ],
  },
  {
    id: "t2",
    name: "Navi Mumbai Championship",
    format: "T10",
    gradient: "from-[#1B3FA0] to-[#4B8BFF]",
    emoji: "🎯",
    matchesPlayed: 12,
    totalMatches: 20,
    topTeams: [
      { name: "Seawoods Royals", emoji: "👑", pts: 12 },
      { name: "Vashi Vipers", emoji: "🐍", pts: 10 },
      { name: "Belapur Blasters", emoji: "💥", pts: 8 },
    ],
  },
  {
    id: "t3",
    name: "College Cricket League",
    format: "T20",
    gradient: "from-[#7C3AED] to-[#DC2626]",
    emoji: "🏏",
    matchesPlayed: 8,
    totalMatches: 16,
    topTeams: [
      { name: "Xavier Knights", emoji: "♟️", pts: 12 },
      { name: "Mithibai Lions", emoji: "🦁", pts: 9 },
      { name: "KC Superstars", emoji: "⭐", pts: 8 },
    ],
  },
];

export const CRICKET_PULSE = [
  {
    id: "p1",
    type: "performance",
    timeAgo: "2h ago",
    player: "Rohit Sharma",
    emoji: "🏏",
    bgGradient: "from-[#1B3FA0] to-[#0D1B3E]",
    headline: "scored 68 runs in Navi Mumbai Championship",
    cta: "68 Runs",
    ctaIcon: "zap",
  },
  {
    id: "p2",
    type: "tournament",
    timeAgo: "4h ago",
    player: "New Tournament",
    emoji: "🏆",
    bgGradient: "from-[#F59E0B] to-[#D97706]",
    headline: "Nerul Sports Club T20 Cup has been started",
    cta: "Join Now",
    ctaIcon: "arrow",
  },
  {
    id: "p3",
    type: "result",
    timeAgo: "5h ago",
    player: "Close Finish!",
    emoji: "🎯",
    bgGradient: "from-[#16A34A] to-[#15803D]",
    headline: "Thriller match finished! Royals won by 2 runs in the last over.",
    cta: "Watch Highlights",
    ctaIcon: "arrow",
  },
  {
    id: "p4",
    type: "record",
    timeAgo: "6h ago",
    player: "Record Breaker",
    emoji: "🔥",
    bgGradient: "from-[#DC2626] to-[#991B1B]",
    headline: "Highest team total score of the day 210/3 by Titans",
    cta: "210/3",
    ctaIcon: "zap",
  },
];
