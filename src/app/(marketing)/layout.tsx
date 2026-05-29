"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-(--color-bg-base) flex flex-col">
      {/* ─── NAVBAR ──────────────────────────────────────────────── */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#090f22]/92 backdrop-blur-xl shadow-[0_4px_32px_rgba(0,0,0,0.5)] border-b border-white/5"
            : "bg-transparent",
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* ── LOGO — replace with your image ── */}
          <Link href="/" className="flex items-center group">
            {/* 
              LOGO SLOT: Replace this <div> with:
              <Image src="/logo.png" alt="YuvaCrix" width={140} height={36} priority />
            */}
            <div className="relative h-9 w-36 flex items-center">
              {/* <Image
                src="/public/logo/logo_light.png"
                alt="YuvaCrix Logo"
                fill
                className="object-contain object-left"
                priority
                onError={() => {}} // fallback handled below
              /> */}
              <Image
                src="/public/logo/logo_dark.png"
                alt="YuvaCrix"
                width={140}
                height={36}
                priority
              />
              {/* Fallback text shown if image is missing (remove once you add logo) */}
              {/* <span
                className="absolute inset-0 flex items-center font-[family-name:var(--font-display)] font-black uppercase tracking-[0.05em] text-xl text-white"
                style={{ fontWeight: 900 }}
                aria-hidden="true"
              >
                Yuva<span className="text-[var(--color-sky)]">Crix</span>
              </span> */}
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-white/65 hover:text-white text-sm font-medium transition-colors duration-150 tracking-wide relative group"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--color-sky)] group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-white/65 hover:text-white text-sm font-medium transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
                "bg-[var(--color-brand)] text-white px-5 py-2.5 rounded-xl text-sm",
                "shadow-[var(--shadow-button)] hover:bg-[#2449b8] hover:shadow-[0_6px_20px_rgba(27,63,160,0.50)]",
                "transition-all duration-200 active:scale-[0.97]",
              )}
            >
              Start Scoring
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-white p-2 -mr-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </header>

      {/* ─── MOBILE DRAWER ───────────────────────────────────────── */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />
      <aside
        ref={drawerRef}
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[70] w-[280px] flex flex-col md:hidden",
          "bg-[#0a1224] border-l border-white/10",
          "transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Drawer top */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <span
            className="font-[family-name:var(--font-display)] font-black uppercase tracking-[0.05em] text-lg text-white"
            style={{ fontWeight: 900 }}
          >
            Yuva<span className="text-[var(--color-sky)]">Crix</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-5 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "text-white/65 hover:text-white hover:bg-white/6 px-4 py-3.5 rounded-xl",
                "text-base font-medium tracking-wide transition-all duration-150",
                "border-l-2 border-transparent hover:border-[var(--color-sky)]",
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Drawer CTAs */}
        <div className="px-4 pb-10 pt-4 flex flex-col gap-3 border-t border-white/10">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
              "border border-white/20 text-white px-5 py-3.5 rounded-xl text-sm text-center",
              "hover:bg-white/8 transition-all duration-150",
            )}
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
              "bg-[var(--color-brand)] text-white px-5 py-3.5 rounded-xl text-sm text-center",
              "shadow-[var(--shadow-button)] hover:bg-[#2449b8] transition-all duration-150",
            )}
          >
            Start Scoring Free
          </Link>
        </div>
      </aside>

      {/* ─── MAIN ────────────────────────────────────────────────── */}
      <main className="flex-1 pt-16">{children}</main>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-[#070d1a] text-white/50 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <span
                className="block font-[family-name:var(--font-display)] font-black uppercase tracking-[0.05em] text-lg text-white mb-3"
                style={{ fontWeight: 900 }}
              >
                Yuva<span className="text-[var(--color-sky)]">Crix</span>
              </span>
              <p className="text-sm leading-relaxed">
                Modern cricket scoring & tournament management for everyone.
              </p>
            </div>
            {[
              {
                head: "Product",
                links: ["Features", "Changelog", "Roadmap", "API"],
              },
              {
                head: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              { head: "Legal", links: ["Privacy", "Terms", "Cookies"] },
            ].map((col) => (
              <div key={col.head}>
                <p className="text-section-label text-white/30 mb-3">
                  {col.head}
                </p>
                <ul className="space-y-2 text-sm">
                  {col.links.map((t) => (
                    <li key={t}>
                      <Link
                        href="#"
                        className="hover:text-white transition-colors duration-150"
                      >
                        {t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span>
              © {new Date().getFullYear()} YuvaCrix. All rights reserved.
            </span>
            <span className="flex items-center gap-1">
              Made with{" "}
              <span className="text-[var(--color-live)] mx-0.5">♥</span> for
              cricket
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
