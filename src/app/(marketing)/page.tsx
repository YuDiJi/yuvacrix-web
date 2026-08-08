"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
  Medal,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ScoreDemo from "./ScoreDemo";

/* -------------------------------------------------------------------------- */
/* Match Flow Steps with Exact Image Mappings                                 */
/* -------------------------------------------------------------------------- */

const matchFlow = [
  {
    number: "01",
    tag: "Squad Selection",
    title: "Select teams",
    subtitle: "Pick or create competing squads & manage team rosters in seconds.",
    image: "/yuvacrixlandingpage/select_team.png",
    aspect: "aspect-[862/1598]",
  },
  {
    number: "02",
    tag: "Match Setup",
    title: "Set match details",
    subtitle: "Configure overs, pitch condition, ball type & ground location.",
    image: "/yuvacrixlandingpage/startmatch.png",
    aspect: "aspect-[862/1598]",
  },
  {
    number: "03",
    tag: "Toss Decision",
    title: "Complete the toss",
    subtitle: "Record the toss winning team and choice to bat or bowl with 1 tap.",
    image: "/yuvacrixlandingpage/toss.png",
    aspect: "aspect-[862/1598]",
  },
  {
    number: "04",
    tag: "Playing XI",
    title: "Choose the lineup",
    subtitle: "Select Playing XI squad, captain, and wicketkeeper seamlessly.",
    image: "/yuvacrixlandingpage/lineup.png",
    aspect: "aspect-[870/1566]",
  },
  {
    number: "05",
    tag: "Opening Pair",
    title: "Pick opening pair",
    subtitle: "Designate opening striker, non-striker & opening bowler.",
    image: "/yuvacrixlandingpage/selectstriker.png",
    aspect: "aspect-[870/1566]",
  },
  {
    number: "06",
    tag: "Live Engine",
    title: "Start scoring",
    subtitle: "Tactile live keypad, batsman stats, extras & live sync.",
    image: "/yuvacrixlandingpage/scoring.png",
    aspect: "aspect-[870/1566]",
  },
];

/* -------------------------------------------------------------------------- */
/* Tournament Showcase Screens                                               */
/* -------------------------------------------------------------------------- */

const tournamentScreens = [
  {
    badge: "Brackets & Fixtures",
    label: "Tournament Rounds",
    subtitle: "Knockout brackets, groups & round-by-round scheduling.",
    image: "/yuvacrixlandingpage/Tournament_round.png",
    aspect: "aspect-[862/1598]",
    className: "lg:translate-y-6 lg:-rotate-[2.5deg]",
  },
  {
    badge: "Match Central",
    label: "Live Home & Fixtures",
    subtitle: "Real-time match tracker, upcoming games & circuit standings.",
    image: "/yuvacrixlandingpage/Homepage.png",
    aspect: "aspect-[870/1566]",
    className: "relative z-20 lg:scale-[1.03]",
  },
  {
    badge: "Digital Scorecard",
    label: "Scoreboard Summary",
    subtitle: "Ball-by-ball commentary, partnership stats & full scorecards.",
    image: "/yuvacrixlandingpage/scorecard.png",
    aspect: "aspect-[870/1566]",
    className: "lg:translate-y-6 lg:rotate-[2.5deg]",
  },
];

const audienceItems = [
  "Weekend cricket teams",
  "Tournament organisers",
  "Cricket academies",
  "Schools and colleges",
  "Corporate cricket teams",
  "Local cricket leagues",
];

/* -------------------------------------------------------------------------- */
/* Main Landing Page Component                                                */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  return (
    <div className="landing-page bg-[#060B1F] text-white selection:bg-[#4B8BFF]/30 selection:text-white">
      <HeroScene />
      <LiveScoringScene />
      <MatchJourneyScene />
      <TournamentScene />
      <PlayerScene />
      <OnboardingPreviewScene />
      <AudienceTicker />
      <FinalCtaScene />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero Static Responsive Headline Component                                  */
/* -------------------------------------------------------------------------- */

function HeroHeadline() {
  return (
    <div className="w-full select-none">
      {/* Line 1: Cricket. */}
      <h1 className="font-display text-[clamp(3.2rem,6.8vw,5.6rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-white">
        Cricket.
      </h1>

      {/* Line 2: Scored */}
      <div className="font-display text-[clamp(3.2rem,6.8vw,5.6rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-[#4B8BFF] my-1 sm:my-1.5">
        Scored
      </div>

      {/* Line 3: Everyday. */}
      <div className="font-display text-[clamp(3.2rem,6.8vw,5.6rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-stroke text-white drop-shadow-[0_4px_24px_rgba(0,214,255,0.2)]">
        Everyday.
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero Scene                                                                 */
/* -------------------------------------------------------------------------- */

function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const screenshotY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] overflow-hidden bg-[#060B1F]"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:pb-20 lg:pt-28">
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : {
                  y: contentY,
                  opacity: contentOpacity,
                }
          }
          className="relative z-20 max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 backdrop-blur-xl"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF3B30] opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF3B30]" />
            </span>

            <span className="font-body text-xs font-bold uppercase tracking-[0.18em] text-white/75">
              Cricket scoring, made simple
            </span>
          </motion.div>

          {/* Static Perfectly Proportioned Headline */}
          <HeroHeadline />

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.55 }}
            className="mt-8 max-w-lg font-body text-base font-medium leading-7 text-white/55 sm:text-lg"
          >
            Create teams, score every ball, organise tournaments and celebrate
            every player through one powerful cricket platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.7 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/login?redirect=/start-match"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#1B3FA0] px-7 py-4 font-display text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_18px_50px_rgba(27,63,160,0.42)] transition duration-300 hover:-translate-y-1 hover:bg-[#254EC0]"
            >
              Start scoring
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#live-scoring"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.05] px-7 py-4 font-display text-sm font-bold uppercase tracking-[0.08em] text-white backdrop-blur-xl transition duration-300 hover:border-white/30 hover:bg-white/[0.09]"
            >
              <Play className="h-4 w-4 fill-current" />
              Explore YuvaCrix
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-9 flex flex-wrap gap-x-6 gap-y-3"
          >
            {["Live scoring", "Tournament fixtures", "Player stats"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 font-body text-xs font-semibold text-white/45"
                >
                  <Check className="h-3.5 w-3.5 text-[#5EE8C8]" />
                  {item}
                </div>
              ),
            )}
          </motion.div>
        </motion.div>

        <motion.div
          style={shouldReduceMotion ? undefined : { y: screenshotY }}
          className="relative mx-auto w-full max-w-[680px]"
        >
          <HeroScreens />
        </motion.div>
      </div>

      <motion.a
        href="#live-scoring"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/35 lg:flex"
      >
        <span className="font-body text-[10px] font-bold uppercase tracking-[0.24em]">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.a>
    </section>
  );
}

function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(75,139,255,0.18),transparent_32%),radial-gradient(circle_at_85%_32%,rgba(124,58,237,0.14),transparent_30%),linear-gradient(180deg,#060B1F_0%,#08112B_60%,#060B1F_100%)]" />

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      <div className="absolute -left-32 top-1/4 h-[430px] w-[430px] rounded-full bg-[#1B3FA0]/20 blur-[110px]" />
      <div className="absolute -right-24 top-16 h-[420px] w-[420px] rounded-full bg-[#7C3AED]/15 blur-[115px]" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        className="absolute right-[12%] top-[14%] h-48 w-48 rounded-full border border-dashed border-white/10"
      />

      <div className="absolute bottom-0 left-1/2 h-[40%] w-[80%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(75,139,255,0.06),transparent)] blur-3xl" />
    </div>
  );
}

function HeroScreens() {
  return (
    <div className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center">
      {/* Left phone: Team Selection */}
      <motion.div
        initial={{ opacity: 0, y: 70, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -5 }}
        transition={{
          duration: 1,
          delay: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute left-[2%] top-[14%] z-10 hidden w-[32%] max-w-[210px] overflow-hidden rounded-[26px] border-[3px] border-white/15 bg-[#101A37] p-1 shadow-[0_30px_70px_rgba(0,0,0,0.55)] sm:block"
      >
        <div className="relative w-full aspect-[862/1598] overflow-hidden rounded-[20px] bg-[#0A0F24]">
          <Image
            src="/yuvacrixlandingpage/select_team.png"
            alt="Select teams in YuvaCrix"
            fill
            sizes="210px"
            className="object-contain object-top"
          />
        </div>
      </motion.div>

      {/* Center main phone: MVP & Match Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 90, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-20 w-[62%] max-w-[290px] sm:max-w-[310px] overflow-hidden rounded-[38px] border-[4.5px] border-white/25 bg-[#0B1023] p-1.5 shadow-[0_45px_110px_rgba(0,0,0,0.65),0_0_80px_rgba(75,139,255,0.22)]"
      >
        {/* Dynamic Island Pill */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-2 bg-black/80 rounded-full z-20 border border-white/10" />

        <div className="relative w-full aspect-[870/1566] overflow-hidden rounded-[30px] bg-[#10182F]">
          <Image
            src="/yuvacrixlandingpage/mvp.png"
            alt="YuvaCrix MVP awards and match heroes"
            fill
            priority
            sizes="310px"
            className="object-contain object-top"
          />
        </div>
      </motion.div>

      {/* Right phone: Ball-by-Ball Commentary */}
      <motion.div
        initial={{ opacity: 0, y: 70, rotate: 8 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{
          duration: 1,
          delay: 0.48,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute right-[2%] top-[18%] z-10 hidden w-[32%] max-w-[210px] overflow-hidden rounded-[26px] border-[3px] border-white/15 bg-[#101A37] p-1 shadow-[0_30px_70px_rgba(0,0,0,0.55)] sm:block"
      >
        <div className="relative w-full aspect-[870/1566] overflow-hidden rounded-[20px] bg-[#0A0F24]">
          <Image
            src="/yuvacrixlandingpage/commentary.png"
            alt="YuvaCrix ball-by-ball commentary"
            fill
            sizes="210px"
            className="object-contain object-top"
          />
        </div>
      </motion.div>

      {/* Live Badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute right-[0%] top-[8%] z-30 rounded-2xl border border-white/15 bg-[#111A33]/90 px-4 py-2.5 shadow-2xl backdrop-blur-xl sm:right-[4%]"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-[#FF3B30] opacity-60" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-[#FF3B30]" />
          </span>

          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-white">
              Match live
            </p>
            <p className="text-[10px] font-medium text-white/40">
              86/3 · 8.4 overs
            </p>
          </div>
        </div>
      </motion.div>

      <FloatingEvent
        label="FOUR"
        color="#22C55E"
        className="left-[0%] top-[4%]"
        delay={0}
      />

      <FloatingEvent
        label="SIX"
        color="#F59E0B"
        className="bottom-[6%] right-[1%]"
        delay={1.3}
      />

      <FloatingEvent
        label="WICKET"
        color="#FF3B30"
        className="bottom-[10%] left-[2%]"
        delay={2.2}
      />

      <div className="absolute bottom-[2%] left-1/2 h-20 w-[66%] -translate-x-1/2 rounded-full bg-[#4B8BFF]/20 blur-[48px]" />
    </div>
  );
}

function FloatingEvent({
  label,
  color,
  className,
  delay,
}: {
  label: string;
  color: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        delay,
      }}
      className={`absolute z-30 hidden rounded-xl border px-3.5 py-1.5 font-display text-xs font-black uppercase tracking-[0.08em] shadow-xl sm:block ${className}`}
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}18`,
        boxShadow: `0 12px 38px ${color}20`,
      }}
    >
      {label}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Live Scoring Scene                                                         */
/* -------------------------------------------------------------------------- */

function LiveScoringScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.25,
    once: true,
  });

  return (
    <section
      ref={sectionRef}
      id="live-scoring"
      className="relative min-h-screen overflow-hidden bg-[#060B1F] py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[10%] top-[-10%] h-[60%] w-[55%] bg-[radial-gradient(ellipse,rgba(75,139,255,0.13),transparent_68%)]" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[55%] bg-[radial-gradient(ellipse,rgba(245,158,11,0.08),transparent_68%)]" />

        <div
          className="absolute inset-y-0 right-[8%] hidden w-[43%] opacity-[0.07] lg:block"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "100% 90px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 md:grid-cols-2 lg:gap-24 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : undefined}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="mb-7 font-display text-xs font-bold uppercase tracking-[0.3em] text-white/35">
            02 — Live scoring
          </p>

          <h2 className="font-display text-[clamp(4rem,8vw,7rem)] font-black uppercase leading-[0.82] tracking-[-0.03em]">
            <motion.span
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.1 }}
              className="block"
            >
              Tap.
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.2 }}
              className="landing-text-stroke block"
            >
              Score.
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.3 }}
              className="block text-[#4B8BFF]"
            >
              Remember.
            </motion.span>
          </h2>

          <p className="mt-8 max-w-md font-body text-base font-medium leading-7 text-white/50">
            Professional-grade match scoring for your local maidan. Every ball,
            boundary, wicket and over is captured in real time.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "Ball-by-ball",
              "Automatic overs",
              "Live scorecard",
              "Undo scoring",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-body text-xs font-semibold text-white/60 backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-6">
            <ScoringStat value="1 Tap" label="To record runs" />
            <ScoringStat value="Live" label="Match updates" />
            <ScoringStat value="Full" label="Digital scorecard" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 55, rotate: 3 }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  x: 0,
                  rotate: 0,
                }
              : undefined
          }
          transition={{
            duration: 0.95,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative flex justify-center"
        >
          <div className="absolute left-1/2 top-1/2 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4B8BFF]/15 blur-[85px]" />

          <ScoreDemo />
        </motion.div>
      </div>
    </section>
  );
}

function ScoringStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-4 first:pl-0 last:pr-0">
      <p className="font-display text-xl font-black uppercase text-white">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
        {label}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Match Journey Scene (Proper Card Grid with Framed Mobile Mockups)          */
/* -------------------------------------------------------------------------- */

function MatchJourneyScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.15,
  });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden bg-[#F3F6FB] py-24 text-[#0D1B3E] lg:py-32"
    >
      <div className="absolute left-[-15%] top-[8%] h-96 w-96 rounded-full bg-[#4B8BFF]/10 blur-[100px]" />
      <div className="absolute right-[-10%] top-[45%] h-96 w-96 rounded-full bg-[#7C3AED]/8 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end mb-16">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-[#1B3FA0]/60">
              03 — Match journey
            </p>

            <h2 className="mt-6 font-display text-[clamp(3.8rem,8vw,6.5rem)] font-black uppercase leading-[0.84] tracking-[-0.035em]">
              From toss
              <span className="block text-[#1B3FA0]">to scorecard.</span>
            </h2>
          </div>

          <p className="max-w-lg pb-2 font-body text-base font-medium leading-7 text-[#667085] lg:justify-self-end">
            YuvaCrix guides the scorer through every step, so setting up a match
            feels simple even before the first ball is bowled.
          </p>
        </div>

        {/* 6-Step Card Grid: Proper Card Design with Fitted Mockups */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {matchFlow.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.65,
                delay: index * 0.1,
              }}
              className="group relative flex flex-col justify-between rounded-[28px] border border-[#DDE4EE] bg-white p-5 shadow-[0_14px_40px_rgba(13,27,62,0.06)] hover:shadow-[0_24px_65px_rgba(13,27,62,0.12)] hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Card Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-7 px-3 items-center justify-center rounded-full bg-[#1B3FA0] font-display text-xs font-black text-white">
                    Step {step.number}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B3FA0]/70">
                    {step.tag}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-extrabold uppercase tracking-wide text-[#0D1B3E]">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs text-[#667085] font-body leading-relaxed">
                  {step.subtitle}
                </p>
              </div>

              {/* Phone Mockup Frame - Perfectly Fitted without Overstretching */}
              <div className="mt-2 flex-1 flex items-center justify-center p-3 rounded-[22px] bg-[#F7F9FD] border border-[#E9EEF5]">
                <div className={`relative w-full max-w-[210px] sm:max-w-[220px] ${step.aspect} mx-auto rounded-[24px] border-[3.5px] border-[#CBD5E1] bg-[#0A0F24] p-1 shadow-[0_12px_32px_rgba(0,0,0,0.14)] overflow-hidden group-hover:scale-[1.02] transition-transform duration-300`}>
                  {/* Notch */}
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-11 h-1.5 bg-black/60 rounded-full z-20" />

                  <div className="relative w-full h-full rounded-[18px] overflow-hidden bg-[#0A0F24]">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="220px"
                      className="object-contain object-top"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Tournament Scene (3 Card Showcase with Proper Frame Mockups)               */
/* -------------------------------------------------------------------------- */

function TournamentScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  });

  return (
    <section
      ref={sectionRef}
      id="tournaments"
      className="relative overflow-hidden bg-[#0A1025] py-24 lg:py-32 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(75,139,255,0.15),transparent_38%)]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.8 }}
        >
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/35">
            04 — Tournaments
          </p>

          <h2 className="mt-7 font-display text-[clamp(4rem,8vw,6.7rem)] font-black uppercase leading-[0.82] tracking-[-0.035em]">
            Fixtures
            <span className="landing-text-stroke block">to finals.</span>
          </h2>

          <p className="mt-8 max-w-md font-body text-base font-medium leading-7 text-white/50">
            Create competitions, add teams, generate fixtures, schedule matches
            and follow the tournament from opening match to champion.
          </p>

          <div className="mt-9 space-y-4">
            {[
              "Manual and automatic fixtures",
              "Tournament rounds and groups",
              "Match scheduling and venues",
              "Points tables and NRR calculation",
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : undefined}
                transition={{ delay: 0.25 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B3FA0]">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </span>
                <p className="text-sm font-semibold text-white/70">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 3 Tournament Cards with Fitted Device Mockups */}
        <div className="relative">
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4B8BFF]/15 blur-[90px]" />

          <div className="relative grid grid-cols-1 sm:grid-cols-3 items-center gap-5 sm:gap-4">
            {tournamentScreens.map((screen, index) => (
              <motion.div
                key={screen.label}
                initial={{ opacity: 0, y: 70, rotate: index === 0 ? -6 : index === 2 ? 6 : 0 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        y: 0,
                        rotate: 0,
                      }
                    : undefined
                }
                transition={{
                  duration: 0.85,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`group rounded-[26px] border border-white/15 bg-[#11182F]/90 backdrop-blur-xl p-4 shadow-[0_25px_65px_rgba(0,0,0,0.55)] hover:border-[#4B8BFF]/40 transition-all duration-300 ${screen.className}`}
              >
                <div className="mb-3 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#00D6FF]">
                    {screen.badge}
                  </span>
                  <h3 className="font-display text-sm font-bold uppercase text-white tracking-wide mt-0.5">
                    {screen.label}
                  </h3>
                  <p className="text-[11px] text-white/50 font-body leading-tight mt-0.5">
                    {screen.subtitle}
                  </p>
                </div>

                {/* Phone Device Mockup Frame */}
                <div className={`relative w-full max-w-[210px] sm:max-w-[220px] mx-auto ${screen.aspect} rounded-[22px] border-[3px] border-white/20 bg-[#080D1F] p-1 shadow-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300`}>
                  {/* Notch */}
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-black/70 rounded-full z-20" />

                  <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-[#080D1F]">
                    <Image
                      src={screen.image}
                      alt={screen.label}
                      fill
                      sizes="220px"
                      className="object-contain object-top"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-8 left-1/2 z-30 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0C142B]/90 px-5 py-3 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-[#F59E0B]" />
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.08em] text-white">
                  Tournament ready
                </p>
                <p className="mt-0.5 text-[10px] text-white/40">
                  Fixtures generated successfully
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 05 — Player Performance Scene with myperformance.png                       */
/* -------------------------------------------------------------------------- */

function PlayerScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  });

  return (
    <section
      ref={sectionRef}
      id="players"
      className="relative overflow-hidden bg-[#F3F6FB] py-24 text-[#0D1B3E] lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="relative mx-auto w-full max-w-[620px]">
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1B3FA0]/10 blur-[90px]" />

          {/* Proper Card Frame around Player Performance Screen */}
          <motion.div
            initial={{ opacity: 0, y: 55, rotate: -3 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                  }
                : undefined
            }
            transition={{ duration: 0.85 }}
            className="relative mx-auto w-full max-w-[280px] sm:max-w-[310px] rounded-[36px] border-[4.5px] border-[#CBD5E1] bg-white p-1.5 shadow-[0_30px_80px_rgba(13,27,62,0.16)] overflow-hidden"
          >
            {/* Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-2 bg-black/70 rounded-full z-20" />

            <div className="relative w-full aspect-[862/1598] rounded-[28px] overflow-hidden bg-[#0A0F24]">
              <Image
                src="/yuvacrixlandingpage/myperformance.png"
                alt="YuvaCrix player performance, stats and match awards"
                fill
                sizes="310px"
                className="object-contain object-top"
              />
            </div>
          </motion.div>

          <PlayerBadge
            icon={<Medal className="h-5 w-5" />}
            title="Player of the match"
            value="3 awards"
            className="left-0 top-[13%]"
            delay={0}
          />

          <PlayerBadge
            icon={<Trophy className="h-5 w-5" />}
            title="Top scorer"
            value="342 runs"
            className="bottom-[16%] right-0"
            delay={0.8}
          />

          <PlayerBadge
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Best bowling"
            value="4/18"
            className="bottom-[2%] left-[3%]"
            delay={1.5}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 45 }}
          animate={isInView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.8 }}
        >
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-[#1B3FA0]/60">
            05 — Player performance
          </p>

          <h2 className="mt-7 font-display text-[clamp(4rem,8vw,6.7rem)] font-black uppercase leading-[0.82] tracking-[-0.035em]">
            Every player
            <span className="block text-[#1B3FA0]">gets a story.</span>
          </h2>

          <p className="mt-8 max-w-md font-body text-base font-medium leading-7 text-[#667085]">
            Keep every performance visible. Players can track runs, wickets,
            awards and match achievements over time.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <PerformanceStat value="342" label="Runs" delay={0.15} />
            <PerformanceStat value="18" label="Wickets" delay={0.25} />
            <PerformanceStat value="06" label="Matches" delay={0.35} />
            <PerformanceStat value="03" label="Awards" delay={0.45} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PlayerBadge({
  icon,
  title,
  value,
  className,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
      }}
      className={`absolute z-20 hidden items-center gap-3 rounded-2xl border border-[#DCE4EF] bg-white/95 p-3.5 shadow-[0_18px_50px_rgba(13,27,62,0.14)] backdrop-blur md:flex ${className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1B3FA0]">
        {icon}
      </span>

      <div>
        <p className="text-xs font-extrabold text-[#0D1B3E]">{title}</p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#8A94A6]">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function PerformanceStat({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.7,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ delay }}
      className="rounded-3xl border border-[#DFE5EE] bg-white p-5 shadow-[0_15px_45px_rgba(13,27,62,0.06)]"
    >
      <p className="font-display text-4xl font-black text-[#1B3FA0]">{value}</p>
      <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.1em] text-[#7C8799]">
        {label}
      </p>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Onboarding & Instant Access Preview Scene                                  */
/* -------------------------------------------------------------------------- */

function OnboardingPreviewScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0A1025] py-24 text-white lg:py-32 border-t border-white/10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,214,255,0.12),transparent_45%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 backdrop-blur-xl">
              <Sparkles className="w-3.5 h-3.5 text-[#00D6FF]" />
              <span className="font-body text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                Frictionless Onboarding
              </span>
            </div>

            <h2 className="font-display text-[clamp(3.5rem,7vw,5.5rem)] font-black uppercase leading-[0.85] tracking-[-0.03em]">
              Instant access. <span className="text-[#00D6FF]">Zero barrier.</span>
            </h2>

            <p className="font-body text-base text-white/60 leading-relaxed max-w-lg">
              Sign in with your phone or email and start scoring matches right away. Manage squads, sync scorecards across devices, and organize local circuits with ease.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-2xl font-display font-black text-[#00D6FF]">100% Free</div>
                <div className="text-xs text-white/50 font-body mt-1">For grassroots & club matches</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-2xl font-display font-black text-[#22C55E]">&lt; 10 Sec</div>
                <div className="text-xs text-white/50 font-body mt-1">Quick match start time</div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white font-display font-bold text-sm uppercase tracking-wider shadow-[0_15px_40px_rgba(0,214,255,0.35)] hover:scale-105 active:scale-95 transition-all"
              >
                Sign In to YuvaCrix
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Device Mockup with login.png */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={isInView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.85, delay: 0.2 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[310px] rounded-[36px] border-[4.5px] border-white/20 bg-[#10182F] p-1.5 shadow-[0_35px_90px_rgba(0,0,0,0.65)] overflow-hidden">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-2 bg-black/80 rounded-full z-20" />

              <div className="relative w-full aspect-[870/1566] rounded-[28px] overflow-hidden bg-[#0A0F24]">
                <Image
                  src="/yuvacrixlandingpage/login.png"
                  alt="YuvaCrix login and onboarding interface"
                  fill
                  sizes="310px"
                  className="object-contain object-top"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Audience Ticker                                                            */
/* -------------------------------------------------------------------------- */

function AudienceTicker() {
  const items = [...audienceItems, ...audienceItems];

  return (
    <section className="overflow-hidden border-y border-white/10 bg-[#0A1025] py-7">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex w-max items-center"
      >
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-7 px-7"
          >
            <span className="font-display text-xl font-black uppercase tracking-[0.06em] text-white/55 sm:text-2xl">
              {item}
            </span>

            <CircleDot className="h-4 w-4 text-[#4B8BFF]" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Final CTA Scene                                                            */
/* -------------------------------------------------------------------------- */

function FinalCtaScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3,
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#060B1F] px-5 py-28 text-center sm:px-8 lg:py-36"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(27,63,160,0.28),transparent_50%)]" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[610px] w-[610px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isInView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#4B8BFF] backdrop-blur"
        >
          <Sparkles className="h-7 w-7" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8 }}
          className="font-display text-[clamp(4.2rem,10vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.03em]"
        >
          Your next match
          <span className="block text-[#4B8BFF]">starts here.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-8 max-w-xl font-body text-base font-medium leading-7 text-white/50"
        >
          Create your teams, set up your match and begin scoring every
          cricketing moment with YuvaCrix.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.28 }}
        >
          <Link
            href="/login?redirect=/start-match"
            className="group mt-10 inline-flex min-h-15 items-center justify-center gap-3 rounded-2xl bg-[#1B3FA0] px-9 py-4 font-display text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_22px_60px_rgba(27,63,160,0.42)] transition duration-300 hover:-translate-y-1 hover:bg-[#254EC0]"
          >
            Start scoring free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-semibold text-white/35">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#5EE8C8]" />
            Create teams
          </span>

          <span className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-[#FF3B30]" />
            Score live
          </span>

          <span className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#F59E0B]" />
            Run tournaments
          </span>
        </div>
      </div>
    </section>
  );
}
