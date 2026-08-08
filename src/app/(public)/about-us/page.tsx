"use client";

import { Target, Zap, Users, Shield, TrendingUp, Heart } from "lucide-react";

// ── Sub-components ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-(--color-brand)/30 bg-(--color-bg-tint) px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-brand)">
      {children}
    </span>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[26px] font-black uppercase leading-tight tracking-tight text-(--color-navy)">
      {children}
    </h2>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] leading-relaxed text-(--color-text-body)">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-(--color-bg-border)" />;
}

// ── Hero ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <div
      className="relative overflow-hidden px-5 pb-10 pt-10"
      style={{
        background:
          "linear-gradient(135deg, var(--color-navy) 0%, var(--color-brand) 100%)",
      }}
    >
      {/* Diagonal pitch-stripe motif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(112deg, transparent, transparent 28px, rgba(255,255,255,0.04) 28px, rgba(255,255,255,0.04) 30px)",
        }}
      />

      {/* Crease lines at bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, transparent 10%, white 10%, white 11%, transparent 11%, transparent 89%, white 89%, white 90%, transparent 90%)",
        }}
      />

      <div className="relative">
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-sky)">
          About YuvaCrix
        </span>

        <h1 className="mt-3 font-display text-[40px] font-black uppercase leading-none tracking-tight text-(--color-text-inverse)">
          Every Match
          <br />
          <span className="text-(--color-sky)">Matters.</span>
        </h1>

        <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/75">
          YuvaCrix was born from a simple belief: every player deserves to be
          recognized, no matter where they play.
        </p>
      </div>
    </div>
  );
}

// ── Origin story ──────────────────────────────────────────────────────
function OriginSection() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 shadow-(--shadow-card)">
      <SectionLabel>Our Story</SectionLabel>
      <div className="flex flex-col gap-3">
        <Para>
          Across parks, schools, academies, corporate grounds, villages, and
          local tournaments, millions of matches are played every year. Yet most
          of these games disappear once the final ball is bowled. Performances
          are forgotten, records are lost, and talented players often go
          unnoticed.
        </Para>
        <Para>
          <span className="font-semibold text-(--color-navy)">
            We set out to change that.
          </span>
        </Para>
        <Para>
          YuvaCrix is a sports technology platform built to digitize grassroots
          sports — making scoring, team management, tournaments, player
          profiles, and performance analytics simple, accessible, and reliable.
        </Para>
      </div>
    </div>
  );
}

// ── Mission ───────────────────────────────────────────────────────────
function MissionSection() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background:
          "linear-gradient(135deg, var(--color-navy) 0%, var(--color-brand) 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(112deg, transparent, transparent 28px, rgba(255,255,255,0.04) 28px, rgba(255,255,255,0.04) 30px)",
        }}
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
          <Target size={20} className="text-(--color-sky)" />
        </div>
        <h2 className="font-display text-[22px] font-black uppercase leading-tight text-(--color-text-inverse)">
          Our Mission
        </h2>
        <p className="text-[14px] leading-relaxed text-white/80">
          To empower every athlete, team, organizer, and community by providing
          modern digital tools that make sports more organized, transparent, and
          enjoyable.
        </p>
        <p className="text-[14px] leading-relaxed text-white/80">
          Whether you&apos;re scoring a friendly weekend match or managing a
          large tournament, YuvaCrix helps you capture every moment and every
          performance.
        </p>
      </div>
    </div>
  );
}

// ── What We Do ───────────────────────────────────────────────────────
const FEATURES = [
  "Score matches ball by ball",
  "Create and manage teams",
  "Build player profiles",
  "Organize tournaments and leagues",
  "Track detailed player and team statistics",
  "Share live scores with friends and fans",
  "Preserve match history and records",
  "Analyze performances over time",
];

function WhatWeDoSection() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 shadow-(--shadow-card)">
      <SectionLabel>What We Do</SectionLabel>
      <Heading>One Platform,{"\n"}Everything You Need</Heading>
      <Para>
        YuvaCrix brings together everything needed to manage grassroots sports
        in one place.
      </Para>

      <div className="grid grid-cols-1 gap-2">
        {FEATURES.map((feat, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--color-brand)" />
            <p className="text-[13px] leading-relaxed text-(--color-text-body)">
              {feat}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-1 rounded-xl border border-(--color-brand)/20 bg-(--color-bg-tint) px-4 py-3">
        <p className="text-[12.5px] leading-relaxed text-(--color-brand)">
          As YuvaCrix evolves, we aim to introduce advanced analytics, live
          streaming, AI-powered insights, and support for multiple sports.
        </p>
      </div>
    </div>
  );
}

// ── Grassroots ────────────────────────────────────────────────────────
function GrassrootsSection() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 shadow-(--shadow-card)">
      <SectionLabel>Built for the Grassroots</SectionLabel>

      {/* Contrast statement */}
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-4 text-center">
          <p className="text-section-label mb-1">Professional Sports</p>
          <p className="font-display text-[13px] font-bold uppercase text-(--color-navy)">
            World-Class Tech
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-(--color-brand) bg-(--color-bg-tint) px-3 py-4 text-center">
          <p className="text-section-label mb-1 text-(--color-brand)">
            Grassroots Sports
          </p>
          <p className="font-display text-[13px] font-bold uppercase text-(--color-brand)">
            Deserves the Same
          </p>
        </div>
      </div>

      <Para>
        Our focus is on local tournaments, academies, schools, colleges, clubs,
        corporate leagues, and community cricket — where passion is highest but
        digital tools are often limited.
      </Para>

      <Para>
        We believe every run scored, every wicket taken, and every match played
        deserves to be recorded and remembered.
      </Para>
    </div>
  );
}

// ── Beyond Cricket ────────────────────────────────────────────────────
function BeyondCricketSection() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 shadow-(--shadow-card)">
      <SectionLabel>More Than Cricket</SectionLabel>
      <Heading>A Vision Beyond One Sport</Heading>
      <Para>
        While YuvaCrix begins with cricket, our vision extends far beyond a
        single sport. We&apos;re building a platform that can support multiple
        sports and provide athletes, organizers, and communities with one place
        to manage competitions, showcase achievements, and celebrate sporting
        excellence.
      </Para>
    </div>
  );
}

// ── Values ────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: Zap,
    title: "Simplicity",
    desc: "Technology should make sports easier, not more complicated.",
    iconBg: "bg-(--color-six)/15",
    iconColor: "text-(--color-six)",
  },
  {
    icon: Target,
    title: "Accuracy",
    desc: "Reliable scoring and trustworthy statistics are at the heart of everything we build.",
    iconBg: "bg-(--color-brand)/10",
    iconColor: "text-(--color-brand)",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Sports bring people together. We build tools that strengthen those communities.",
    iconBg: "bg-(--color-sky)/15",
    iconColor: "text-(--color-sky)",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    desc: "We continuously improve our platform to deliver better experiences through modern technology.",
    iconBg: "bg-(--color-violet)/10",
    iconColor: "text-(--color-violet)",
  },
  {
    icon: Shield,
    title: "Fair Play",
    desc: "We encourage sportsmanship, transparency, and respect across every match and tournament.",
    iconBg: "bg-(--color-four)/15",
    iconColor: "text-(--color-four)",
  },
] as const;

function ValuesSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="px-1">
        <SectionLabel>Our Values</SectionLabel>
      </div>
      <div className="flex flex-col gap-3">
        {VALUES.map((v) => {
          const Icon = v.icon;
          return (
            <div
              key={v.title}
              className="flex items-start gap-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)"
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${v.iconBg}`}
              >
                <Icon size={20} className={v.iconColor} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-display text-[14px] font-black uppercase tracking-wide text-(--color-navy)">
                  {v.title}
                </p>
                <p className="text-[13px] leading-relaxed text-(--color-text-secondary)">
                  {v.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Looking Ahead ─────────────────────────────────────────────────────
function LookingAheadSection() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background:
          "linear-gradient(135deg, var(--color-navy) 0%, var(--color-brand) 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(112deg, transparent, transparent 28px, rgba(255,255,255,0.04) 28px, rgba(255,255,255,0.04) 30px)",
        }}
      />
      <div className="relative flex flex-col gap-3">
        <SectionLabel>Looking Ahead</SectionLabel>
        <h2 className="font-display text-[26px] font-black uppercase leading-tight text-(--color-text-inverse)">
          This is Only
          <br />
          <span className="text-(--color-sky)">The Beginning.</span>
        </h2>
        <p className="text-[14px] leading-relaxed text-white/80">
          Our vision is to build one of India&apos;s leading grassroots sports
          platforms, helping millions of players preserve their achievements,
          improve their performance, and connect with the sporting community.
        </p>
        <div className="mt-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3">
          <p className="text-[13px] font-semibold italic text-(--color-sky)">
            &quot;To ensure that every player, every team, and every match truly
            matters.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Join CTA ──────────────────────────────────────────────────────────
function JoinSection() {
  const roles = ["Player", "Scorer", "Coach", "Organizer", "Umpire", "Fan"];

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-brand)">
        <Heart size={22} color="white" />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-display text-[22px] font-black uppercase leading-tight text-(--color-navy)">
          Join the Journey
        </h2>
        <p className="text-[13px] leading-relaxed text-(--color-text-secondary)">
          You&apos;re an important part of the YuvaCrix community.
        </p>
      </div>

      {/* Role pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {roles.map((role) => (
          <span
            key={role}
            className="rounded-full border border-(--color-brand)/30 bg-(--color-bg-tint) px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-(--color-brand)"
          >
            {role}
          </span>
        ))}
      </div>

      <Divider />

      <p className="font-display text-[15px] font-black uppercase tracking-wide text-(--color-navy)">
        Together, we&apos;re building the future
        <br />
        of grassroots sports.
      </p>

      <div className="rounded-xl bg-(--color-navy) px-5 py-3 w-full">
        <p className="font-display text-[13px] font-bold uppercase tracking-widest text-(--color-sky)">
          Welcome to YuvaCrix
        </p>
        <p className="mt-0.5 font-display text-[18px] font-black uppercase text-(--color-text-inverse)">
          Every Match Matters.
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-(--color-bg-base)">
      <Hero />

      <div className="flex flex-col gap-4 px-3 py-4 pb-10">
        <OriginSection />
        <MissionSection />
        <WhatWeDoSection />
        <GrassrootsSection />
        <BeyondCricketSection />
        <ValuesSection />
        <LookingAheadSection />
        <JoinSection />

        <p className="text-center text-[11px] text-(--color-text-muted)">
          YuvaCrix · Built for cricket lovers, by cricket lovers · © 2026
        </p>
      </div>
    </div>
  );
}
