import type { ReactNode } from "react";
import { Trophy, Home, Users, BarChart3, User } from "lucide-react";

const navItems = [
  {
    label: "Home",
    icon: Home,
  },
  {
    label: "Matches",
    icon: Trophy,
  },
  {
    label: "Teams",
    icon: Users,
  },
  {
    label: "Stats",
    icon: BarChart3,
  },
  {
    label: "Profile",
    icon: User,
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-(--color-bg-base)">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-(--color-bg-border) bg-white md:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-(--color-bg-border) px-6 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-brand) text-xl font-black text-white">
            Y
          </div>

          <div>
            <h1 className="font-family-name:(--font-display) text-2xl uppercase font-black text-(--color-text-primary)">
              YuvaCrix
            </h1>

            <p className="text-sm text-(--color-text-secondary)">
              Cricket Platform
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all hover:bg-(--color-bg-tint)"
              >
                <Icon size={20} />

                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="md:ml-72">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-(--color-bg-border) bg-white/90 px-4 backdrop-blur-xl md:hidden">
          <h1 className="font-family-name:(--font-display) text-2xl uppercase font-black">
            YuvaCrix
          </h1>

          <button className="rounded-xl bg-(--color-brand) px-4 py-2 text-sm font-bold uppercase text-white">
            Live
          </button>
        </header>

        {/* Page */}
        <main className="min-h-screen px-4 py-4 pb-24 md:px-8 md:py-8 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-(--color-bg-border) bg-white/95 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className="flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium text-(--color-text-secondary)"
              >
                <Icon size={20} />

                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
