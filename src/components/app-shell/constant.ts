import {
  Home,
  Trophy,
  MoreHorizontal,
  Menu,
  X,
  BarChart3,
  Users,
  User,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Zap,
  ChevronRight,
  Shield,
  ShieldCheck,
  PlayCircle,
  Crown,
  Award,
  Info,
  FileText,
  ScrollText,
  Share2,
  Contact,
  type LucideIcon,
} from "lucide-react";

type DrawerItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  badgeColor?: "live" | "violet";
  danger?: boolean;
  action?: "logout";
};

type DrawerSection = {
  title: string;
  items: DrawerItem[];
};

// ─── Nav Config ───────────────────────────────────────────────────────────────

export const bottomNav = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "My Cricket", icon: Trophy, href: "/my-cricket", hasLive: true },
  { label: "More", icon: MoreHorizontal, href: null },
] as const;

export const drawerSections: DrawerSection[] = [
  {
    title: "Main",
    items: [
      { label: "Home", icon: Home, href: "/dashboard" },
      {
        label: "Go Pro at ₹199",
        icon: Crown,
        href: "/pro",
        badge: "PRO",
        badgeColor: "violet",
      },
      { label: "My Cricket", icon: ShieldCheck, href: "/my-cricket" },
      {
        label: "Start a Match",
        icon: PlayCircle,
        href: "/start-match",
      },
      {
        label: "Add a Tournament/Series",
        icon: Trophy,
        href: "/add-tournaments-series",
      },
      // {
      //   label: "Live Scores",
      //   icon: Zap,
      //   href: "/live",
      //   badge: "LIVE",
      //   badgeColor: "live",
      // },
    ],
  },
  {
    title: "Profile",
    items: [
      { label: "My Profile", icon: User, href: "/profile" },
      {
        label: "Notifications",
        icon: Bell,
        href: "/notifications",
        badge: "3",
      },
      {
        label: "My Performance",
        icon: BarChart3,
        href: "/performance",
      },
      {
        label: "My Awards",
        icon: Award,
        href: "/awards",
      },

      { label: "Settings", icon: Settings, href: "/settings" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "FAQ", icon: HelpCircle, href: "/faq" },
      { label: "Share App", icon: Share2, href: "/shareapp" },
      { label: "About Us", icon: Info, href: "/about" },
      { label: "Contact Us", icon: Contact, href: "/contact" },
      {
        label: "Paid Service Terms",
        icon: FileText,
        href: "/paidServiceTerms",
      },
      { label: "Terms of Service", icon: ScrollText, href: "/termsOfService" },
      // { label: "LogOut", icon: LogOut, danger: true },
      {
        label: "LogOut",
        icon: LogOut,
        href: "/",
        danger: true,
        action: "logout",
      },
    ],
  },
];
