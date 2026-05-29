"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Radio,
  Trophy,
  Users,
  BarChart3,
  Smartphone,
  Share2,
  ChevronRight,
  Check,
  Star,
  Play,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
// ─── UNSPLASH CRICKET IMAGES (free, no attribution required via Unsplash) ────
// All IDs are real Unsplash cricket/sports photos — swap any you like
const IMAGES = {
  heroGround:
    "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1600&q=80&fit=crop", // cricket ground aerial
  playerBat:
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=900&q=80&fit=crop", // cricket bat swing
  turf: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&q=80&fit=crop", // green turf close
  stadium:
    "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=900&q=80&fit=crop", // stadium lights
  ball: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80&fit=crop", // cricket ball
  teamCelebrate:
    "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=900&q=80&fit=crop", // team celebration
};

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=700&q=80&fit=crop",
    label: "Live Match Scoring",
  },
  {
    src: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=700&q=80&fit=crop",
    label: "Player Tracking",
  },
  {
    src: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=700&q=80&fit=crop",
    label: "Tournament Management",
  },
  {
    src: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=700&q=80&fit=crop",
    label: "Team Celebrations",
  },
];

const FEATURES = [
  {
    icon: Radio,
    color: "var(--color-live)",
    bg: "rgba(255,59,48,0.12)",
    title: "Live Ball-by-Ball",
    desc: "Score every delivery in real time — boundaries, wickets, extras with one tap.",
  },
  {
    icon: Trophy,
    color: "var(--color-six)",
    bg: "rgba(245,158,11,0.12)",
    title: "Tournament Engine",
    desc: "Run knockout, league, or custom formats. Auto-generate fixtures and standings.",
  },
  {
    icon: BarChart3,
    color: "var(--color-brand)",
    bg: "rgba(27,63,160,0.12)",
    title: "Deep Analytics",
    desc: "Batting averages, bowling economy, partnerships — every stat beautifully displayed.",
  },
  {
    icon: Users,
    color: "var(--color-four)",
    bg: "rgba(34,197,94,0.12)",
    title: "Team & Player Profiles",
    desc: "Build squad rosters, track career stats, and celebrate milestones across seasons.",
  },
  {
    icon: Share2,
    color: "var(--color-sky)",
    bg: "rgba(75,139,255,0.12)",
    title: "Instant Sharing",
    desc: "Share live scorecards, match summaries, and leaderboards with a single link.",
  },
  {
    icon: Smartphone,
    color: "var(--color-violet)",
    bg: "rgba(124,58,237,0.12)",
    title: "Mobile-First Design",
    desc: "Designed for the boundary rope. Fast, offline-ready, beautiful on any device.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create Your Match",
    desc: "Set up teams, pick the format, and add your squad in under 60 seconds.",
    img: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600&q=80&fit=crop",
  },
  {
    step: "02",
    title: "Score Live",
    desc: "Tap to record every ball. Runs, extras, wickets — synced in real time.",
    img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80&fit=crop",
  },
  {
    step: "03",
    title: "Share & Celebrate",
    desc: "Instant scorecards and match reports your players and fans can follow live.",
    img: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80&fit=crop",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Finally a scoring app that doesn't feel like it was built in 2010. Our whole league runs on YuvaCrix now.",
    name: "Rohan Mehta",
    role: "League Coordinator, Mumbai",
    stars: 5,
  },
  {
    quote:
      "Set up a 16-team knockout in 10 minutes. The auto-fixture generation saved us hours of planning.",
    name: "Priya Sharma",
    role: "Cricket Academy Coach",
    stars: 5,
  },
  {
    quote:
      "Parents love the live link during school matches. The scorecards look incredibly professional.",
    name: "Anil Kumar",
    role: "School Sports Teacher",
    stars: 5,
  },
];

// ─── ANIMATION HOOK ──────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── FLOATING CRICKET BALL ────────────────────────────────────────────────────
function FloatingBall({
  className,
  delay = 0,
  size = 12,
}: {
  className?: string;
  delay?: number;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "absolute rounded-full opacity-20 pointer-events-none",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 35% 35%, #ff6b6b, #cc2200)",
        boxShadow:
          "inset -2px -2px 4px rgba(0,0,0,0.4), 0 2px 8px rgba(255,59,48,0.3)",
        animation: `floatBall ${4 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// ─── REVEAL WRAPPER ──────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  className?: string;
}) {
  const { ref, visible } = useInView();
  const transforms: Record<string, string> = {
    up: "translateY(40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.92)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction],
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatBall {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-18px) rotate(180deg); }
        }
        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(1.06); }
          to   { opacity: 1; transform: scale(1); }
        }
        .hero-bg { animation: zoomIn 1.4s cubic-bezier(0.22,1,0.36,1) forwards; }
        .hero-headline { animation: slideInLeft 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .hero-sub      { animation: fadeUp 0.8s ease 0.5s both; }
        .hero-ctas     { animation: fadeUp 0.8s ease 0.7s both; }
        .hero-proof    { animation: fadeUp 0.8s ease 0.9s both; }
        .hero-card     { animation: slideInRight 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, var(--color-sky) 40%, #fff 60%, var(--color-sky) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .stat-card:hover { transform: translateY(-4px); }
        .feature-card:hover .feature-icon { transform: scale(1.15) rotate(-6deg); }
        .gallery-item:hover img { transform: scale(1.08); }
        .gallery-item:hover .gallery-overlay { opacity: 1; }
        .gallery-item img, .gallery-item .gallery-overlay { transition: all 0.4s cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      <div className="overflow-x-hidden">
        {/* ═══════════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════════ */}

        <section className="relative bg-[#070d1a] text-white overflow-hidden min-h-[96vh] flex items-center">
          {/* Hero background image */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="hero-bg absolute inset-0">
              <Image
                src={IMAGES.heroGround}
                alt="Cricket ground"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            {/* Multi-layer overlay for depth */}
            <div className="absolute inset-0 bg-linear-to-r from-[#070d1a] via-[#070d1a]/80 to-[#070d1a]/30" />
            <div className="absolute inset-0 bg-linear-to-t from-[#070d1a] via-transparent to-[#070d1a]/60" />
            {/* Brand tint */}
            <div className="absolute inset-0 bg-(--color-brand)/10 mix-blend-multiply" />
          </div>

          {/* Floating cricket balls */}
          <FloatingBall className="top-[20%] left-[8%]" delay={0} size={18} />
          <FloatingBall
            className="top-[60%] left-[12%]"
            delay={1.5}
            size={10}
          />
          <FloatingBall
            className="top-[40%] right-[6%]"
            delay={2.2}
            size={14}
          />
          <FloatingBall
            className="top-[75%] right-[15%]"
            delay={0.8}
            size={8}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Glow */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-(--color-brand) opacity-15 blur-[140px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 w-full">
            <div className="max-w-2xl xl:max-w-3xl">
              {/* Live badge */}
              <div className="hero-sub inline-flex items-center gap-2.5 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--color-live) opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-(--color-live)" />
                </span>
                <span className="text-xs font-semibold tracking-[0.12em] uppercase text-white/80">
                  Live scoring is here
                </span>
              </div>

              {/* Headline */}
              <h1
                className="hero-headline font-family-name:(--font-display) font-black uppercase leading-[0.92] tracking-[-0.01em] mb-6"
                style={{
                  fontSize: "clamp(3.2rem, 8.5vw, 6rem)",
                  fontWeight: 900,
                }}
              >
                Cricket Scoring
                <br />
                <span className="shimmer-text">Built for</span>
                <br />
                Every Ground.
              </h1>

              <p className="hero-sub text-white/65 text-lg sm:text-xl leading-relaxed max-w-xl mb-10">
                Ball-by-ball scoring, tournament management, and deep analytics
                — all in one app designed for clubs, academies, and weekend
                warriors.
              </p>

              {/* CTAs */}
              <div className="hero-ctas flex flex-wrap gap-4 mb-14">
                <Link
                  href="/dashboard"
                  className={cn(
                    "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
                    "group bg-[var(--color-brand)] text-white px-7 py-4 rounded-xl text-base",
                    "shadow-[var(--shadow-button)] hover:bg-[#2449b8] hover:shadow-[0_8px_28px_rgba(27,63,160,0.55)]",
                    "transition-all duration-200 active:scale-[0.97] flex items-center gap-2.5",
                  )}
                >
                  Start Scoring Free
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <button
                  className={cn(
                    "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
                    "group border border-white/25 text-white px-7 py-4 rounded-xl text-base",
                    "hover:bg-white/10 hover:border-white/40 transition-all duration-200 active:scale-[0.97]",
                    "flex items-center gap-2.5 backdrop-blur-sm",
                  )}
                >
                  <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </span>
                  Watch Demo
                </button>
              </div>

              {/* Social proof */}
              <div className="hero-proof flex flex-wrap items-center gap-6 text-sm text-white/45">
                {[
                  "No credit card required",
                  "Free forever plan",
                  "10,000+ matches scored",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[var(--color-four)]" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Floating scorecard widget */}
          <div className="hero-card hidden lg:block absolute right-8 xl:right-16 top-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-[var(--color-brand)] blur-2xl opacity-40 scale-110" />
              <div className="relative bg-gradient-to-b from-[var(--color-brand)] to-[#0f2876] rounded-3xl p-5 w-[280px] shadow-[0_24px_64px_rgba(13,27,62,0.6)] border border-white/10">
                {/* Match header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
                    <span className="w-1.5 h-1.5 rounded-full bg-(--color-live) animate-pulse" />
                    Live · T20
                  </span>
                  <span className="text-[10px] text-white/35">Over 14.3</span>
                </div>
                {/* Scores */}
                <div className="space-y-2.5 mb-4 pb-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="font-family-name:(--font-display) font-extrabold uppercase tracking-wide text-white text-[1.1rem]">
                      Mumbai XI
                    </span>
                    <div>
                      <span
                        className="font-family-name:(--font-display) font-black text-[2.2rem] text-white leading-none"
                        style={{ fontWeight: 900 }}
                      >
                        138
                      </span>
                      <span className="text-white/40 text-sm">/4</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between opacity-40">
                    <span className="font-family-name:(--font-display) font-extrabold uppercase tracking-wide text-white text-[1.1rem]">
                      Delhi SC
                    </span>
                    <span className="font-family-name:(--font-display) font-bold text-white text-sm">
                      Yet to bat
                    </span>
                  </div>
                </div>
                {/* This over */}
                <div className="mb-4">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-white/35 mb-2">
                    This Over
                  </p>
                  <div className="flex gap-1.5">
                    {[
                      { v: "1", bg: "bg-white/15" },
                      { v: "4", bg: "bg-[var(--color-four)]" },
                      { v: "0", bg: "bg-white/8" },
                      { v: "6", bg: "bg-[var(--color-six)]" },
                      { v: "W", bg: "bg-[var(--color-live)]" },
                      { v: "2", bg: "bg-white/15" },
                    ].map((b, i) => (
                      <span
                        key={i}
                        className={cn(
                          b.bg,
                          "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                        )}
                      >
                        {b.v}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Current batters */}
                <div className="bg-white/8 rounded-xl p-3">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-white/35 mb-2">
                    Batting
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">
                        R. Sharma ●
                      </span>
                      <span className="text-white/70">
                        <span className="text-white font-bold">68</span>(42)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/55">V. Kohli</span>
                      <span className="text-white/45">
                        <span className="text-white/65">24</span>(18)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="w-full h-12"
            >
              <path
                d="M0 60L1440 60L1440 20C1200 55 960 5 720 30C480 55 240 5 0 20Z"
                fill="var(--color-bg-base)"
              />
            </svg>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            STATS STRIP
        ═══════════════════════════════════════════════════════ */}
        <section className="bg-[var(--color-bg-base)] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  val: "10K+",
                  label: "Matches Scored",
                  color: "var(--color-brand)",
                },
                {
                  val: "1,200+",
                  label: "Teams Registered",
                  color: "var(--color-live)",
                },
                {
                  val: "340+",
                  label: "Tournaments Run",
                  color: "var(--color-six)",
                },
                { val: "99%", label: "Uptime", color: "var(--color-four)" },
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * 80} direction="up">
                  <div className="stat-card bg-[var(--color-bg-card)] rounded-2xl p-5 border border-[var(--color-bg-border)] shadow-[var(--shadow-card)] text-center transition-all duration-300 hover:shadow-[var(--shadow-hero)]">
                    <p
                      className="font-[family-name:var(--font-display)] font-black text-3xl sm:text-4xl mb-1"
                      style={{ color: s.color, fontWeight: 900 }}
                    >
                      {s.val}
                    </p>
                    <p className="text-section-label">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FEATURES
        ═══════════════════════════════════════════════════════ */}
        <section
          id="features"
          className="py-20 lg:py-28 bg-[var(--color-bg-base)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <p className="text-section-label text-[var(--color-brand)] mb-3">
                Everything you need
              </p>
              <h2 className="font-[family-name:var(--font-display)] font-extrabold uppercase text-4xl sm:text-5xl text-[var(--color-navy)] tracking-[0.02em]">
                Built for the game.
              </h2>
              <p className="text-[var(--color-text-secondary)] mt-4 text-lg max-w-2xl mx-auto">
                From gully cricket to inter-district tournaments — every tool
                the modern cricket organizer needs.
              </p>
            </Reveal>

            {/* Feature image banner */}
            <Reveal className="mb-10 rounded-3xl overflow-hidden relative h-56 sm:h-72 lg:h-80 group">
              <Image
                src={IMAGES.turf}
                alt="Cricket turf"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-navy)]/80 to-transparent flex items-center px-8 lg:px-14">
                <div>
                  <p className="text-section-label text-[var(--color-sky)] mb-2">
                    The platform
                  </p>
                  <h3
                    className="font-[family-name:var(--font-display)] font-black uppercase text-white text-3xl sm:text-5xl leading-tight"
                    style={{ fontWeight: 900 }}
                  >
                    Score faster.
                    <br />
                    Play harder.
                  </h3>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 70} direction="up">
                  <div className="feature-card bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-bg-border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hero)] transition-all duration-300 h-full">
                    <span
                      className="feature-icon inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 transition-transform duration-300"
                      style={{ background: f.bg }}
                    >
                      <f.icon className="w-5 h-5" style={{ color: f.color }} />
                    </span>
                    <h3 className="font-[family-name:var(--font-display)] font-extrabold uppercase tracking-wide text-[var(--color-navy)] text-lg mb-2">
                      {f.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            HOW IT WORKS — with images
        ═══════════════════════════════════════════════════════ */}
        <section
          id="how-it-works"
          className="py-20 lg:py-28 bg-[#070d1a] relative overflow-hidden"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <Image
              src={IMAGES.stadium}
              alt="Stadium"
              fill
              className="object-cover object-center opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#070d1a] via-[#070d1a]/80 to-[#070d1a]" />
          </div>

          {/* Floating balls bg */}
          <FloatingBall className="top-[10%] right-[5%]" delay={0} size={24} />
          <FloatingBall
            className="bottom-[15%] left-[4%]"
            delay={1.2}
            size={16}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-16">
              <p className="text-section-label text-[var(--color-sky)] mb-3">
                Simple as cricket
              </p>
              <h2
                className="font-[family-name:var(--font-display)] font-black uppercase text-white text-4xl sm:text-5xl tracking-[0.02em]"
                style={{ fontWeight: 900 }}
              >
                Up and running
                <br />
                in minutes.
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {STEPS.map((s, i) => (
                <Reveal key={s.step} delay={i * 120} direction="up">
                  <div className="group relative">
                    {/* Image */}
                    <div className="relative h-48 rounded-2xl overflow-hidden mb-5 border border-white/10">
                      <Image
                        src={s.img}
                        alt={s.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-600"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {/* Step number overlay */}
                      <div className="absolute top-4 left-4">
                        <span
                          className="font-[family-name:var(--font-display)] font-black text-5xl leading-none opacity-80"
                          style={{
                            fontWeight: 900,
                            color: "rgba(255,255,255,0.15)",
                            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                          }}
                        >
                          {s.step}
                        </span>
                      </div>
                      {/* Step badge */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block bg-[var(--color-brand)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                          Step {s.step}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-[family-name:var(--font-display)] font-extrabold uppercase tracking-wide text-white text-xl mb-2">
                      {s.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-14 text-center">
              <Link
                href="/dashboard"
                className={cn(
                  "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
                  "inline-flex items-center gap-2.5 group",
                  "bg-[var(--color-brand)] text-white px-8 py-4 rounded-xl text-base",
                  "shadow-[var(--shadow-button)] hover:bg-[#2449b8] hover:shadow-[0_8px_28px_rgba(27,63,160,0.55)]",
                  "transition-all duration-200 active:scale-[0.97]",
                )}
              >
                Create Your First Match
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            GALLERY
        ═══════════════════════════════════════════════════════ */}
        <section
          id="gallery"
          className="py-20 lg:py-28 bg-[var(--color-bg-base)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-12">
              <p className="text-section-label text-[var(--color-brand)] mb-3">
                The game, captured
              </p>
              <h2 className="font-[family-name:var(--font-display)] font-extrabold uppercase text-4xl sm:text-5xl text-[var(--color-navy)] tracking-[0.02em]">
                Made for real cricket.
              </h2>
            </Reveal>

            {/* Asymmetric grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[220px] md:auto-rows-[240px]">
              {/* Big card */}
              <Reveal
                delay={0}
                className="gallery-item col-span-2 row-span-2 rounded-3xl overflow-hidden relative cursor-pointer"
              >
                <Image
                  src={GALLERY[0].src}
                  alt={GALLERY[0].label}
                  fill
                  className="object-cover"
                />
                <div className="gallery-overlay absolute inset-0 bg-[var(--color-navy)]/50 opacity-0 flex items-end p-6 transition-opacity duration-400">
                  <span className="font-[family-name:var(--font-display)] font-bold uppercase tracking-wide text-white text-xl">
                    {GALLERY[0].label}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 bg-[var(--color-brand)]/90 backdrop-blur-sm rounded-xl px-4 py-2">
                  <span className="font-[family-name:var(--font-display)] font-bold uppercase tracking-wide text-white text-sm">
                    {GALLERY[0].label}
                  </span>
                </div>
              </Reveal>

              {/* Small cards */}
              {GALLERY.slice(1).map((g, i) => (
                <Reveal
                  key={g.label}
                  delay={(i + 1) * 80}
                  className="gallery-item rounded-2xl overflow-hidden relative cursor-pointer"
                >
                  <Image
                    src={g.src}
                    alt={g.label}
                    fill
                    className="object-cover"
                  />
                  <div className="gallery-overlay absolute inset-0 bg-[var(--color-navy)]/50 opacity-0 flex items-end p-4 transition-opacity duration-400">
                    <span className="font-[family-name:var(--font-display)] font-bold uppercase tracking-wide text-white text-sm">
                      {g.label}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1">
                    <span className="font-[family-name:var(--font-display)] font-bold uppercase tracking-wide text-white text-xs">
                      {g.label}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28 bg-[var(--color-bg-base)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-12">
              <p className="text-section-label text-[var(--color-brand)] mb-3">
                Loved by cricket fans
              </p>
              <h2 className="font-[family-name:var(--font-display)] font-extrabold uppercase text-4xl sm:text-5xl text-[var(--color-navy)] tracking-[0.02em]">
                What players say.
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 90} direction="up">
                  <div className="fixture-bar bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-bg-border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hero)] transition-all duration-300 h-full flex flex-col">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 fill-[var(--color-six)] text-[var(--color-six)]"
                        />
                      ))}
                    </div>
                    <p className="text-[var(--color-text-body)] text-sm leading-relaxed mb-5 italic flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--color-bg-tint)] border border-[var(--color-bg-border)] flex items-center justify-center">
                        <span className="font-[family-name:var(--font-display)] font-bold text-[var(--color-brand)] text-sm">
                          {t.name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-display)] font-bold uppercase tracking-wide text-[var(--color-navy)] text-sm">
                          {t.name}
                        </p>
                        <p className="text-meta">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FINAL CTA BANNER — with bat+ball image
        ═══════════════════════════════════════════════════════ */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <Image
              src={IMAGES.playerBat}
              alt="Cricket player"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[var(--color-navy)]/88" />
            <div className="absolute inset-0 bg-[var(--color-brand)]/30 mix-blend-multiply" />
          </div>

          {/* Floating balls */}
          <FloatingBall className="top-[15%] left-[5%]" delay={0} size={20} />
          <FloatingBall
            className="bottom-[20%] right-[6%]"
            delay={1.8}
            size={28}
          />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <Reveal>
              {/* Live dot */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-four)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-four)]" />
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-white/75">
                  Join the community
                </span>
              </div>

              <h2
                className="font-[family-name:var(--font-display)] font-black uppercase text-white leading-[0.95] tracking-[-0.01em] mb-5"
                style={{
                  fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
                  fontWeight: 900,
                }}
              >
                Ready to score your
                <br />
                next match?
              </h2>
              <p className="text-white/65 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Join thousands of cricket organizers already using YuvaCrix.
                Free to start — no credit card needed.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/dashboard"
                  className={cn(
                    "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
                    "group inline-flex items-center gap-2.5",
                    "bg-white text-[var(--color-brand)] px-8 py-4 rounded-xl text-base",
                    "shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]",
                    "hover:bg-[var(--color-bg-tint)] transition-all duration-200 active:scale-[0.97]",
                  )}
                >
                  Start for Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#features"
                  className={cn(
                    "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
                    "border border-white/25 text-white px-8 py-4 rounded-xl text-base",
                    "hover:bg-white/10 hover:border-white/40 transition-all duration-200 active:scale-[0.97]",
                  )}
                >
                  Learn More
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
