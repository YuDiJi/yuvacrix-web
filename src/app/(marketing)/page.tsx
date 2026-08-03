// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   Radio,
//   Trophy,
//   Users,
//   BarChart3,
//   Smartphone,
//   Share2,
//   ChevronRight,
//   Check,
//   Star,
//   Play,
//   ArrowRight,
// } from "lucide-react";
// import { cn } from "@/lib/cn";
// // ─── UNSPLASH CRICKET IMAGES (free, no attribution required via Unsplash) ────
// // All IDs are real Unsplash cricket/sports photos — swap any you like
// const IMAGES = {
//   heroGround:
//     "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1600&q=80&fit=crop", // cricket ground aerial
//   playerBat:
//     "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=900&q=80&fit=crop", // cricket bat swing
//   turf: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&q=80&fit=crop", // green turf close
//   stadium:
//     "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=900&q=80&fit=crop", // stadium lights
//   ball: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80&fit=crop", // cricket ball
//   teamCelebrate:
//     "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=900&q=80&fit=crop", // team celebration
// };

// const GALLERY = [
//   {
//     src: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=700&q=80&fit=crop",
//     label: "Live Match Scoring",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=700&q=80&fit=crop",
//     label: "Player Tracking",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=700&q=80&fit=crop",
//     label: "Tournament Management",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=700&q=80&fit=crop",
//     label: "Team Celebrations",
//   },
// ];

// const FEATURES = [
//   {
//     icon: Radio,
//     color: "var(--color-live)",
//     bg: "rgba(255,59,48,0.12)",
//     title: "Live Ball-by-Ball",
//     desc: "Score every delivery in real time — boundaries, wickets, extras with one tap.",
//   },
//   {
//     icon: Trophy,
//     color: "var(--color-six)",
//     bg: "rgba(245,158,11,0.12)",
//     title: "Tournament Engine",
//     desc: "Run knockout, league, or custom formats. Auto-generate fixtures and standings.",
//   },
//   {
//     icon: BarChart3,
//     color: "var(--color-brand)",
//     bg: "rgba(27,63,160,0.12)",
//     title: "Deep Analytics",
//     desc: "Batting averages, bowling economy, partnerships — every stat beautifully displayed.",
//   },
//   {
//     icon: Users,
//     color: "var(--color-four)",
//     bg: "rgba(34,197,94,0.12)",
//     title: "Team & Player Profiles",
//     desc: "Build squad rosters, track career stats, and celebrate milestones across seasons.",
//   },
//   {
//     icon: Share2,
//     color: "var(--color-sky)",
//     bg: "rgba(75,139,255,0.12)",
//     title: "Instant Sharing",
//     desc: "Share live scorecards, match summaries, and leaderboards with a single link.",
//   },
//   {
//     icon: Smartphone,
//     color: "var(--color-violet)",
//     bg: "rgba(124,58,237,0.12)",
//     title: "Mobile-First Design",
//     desc: "Designed for the boundary rope. Fast, offline-ready, beautiful on any device.",
//   },
// ];

// const STEPS = [
//   {
//     step: "01",
//     title: "Create Your Match",
//     desc: "Set up teams, pick the format, and add your squad in under 60 seconds.",
//     img: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600&q=80&fit=crop",
//   },
//   {
//     step: "02",
//     title: "Score Live",
//     desc: "Tap to record every ball. Runs, extras, wickets — synced in real time.",
//     img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80&fit=crop",
//   },
//   {
//     step: "03",
//     title: "Share & Celebrate",
//     desc: "Instant scorecards and match reports your players and fans can follow live.",
//     img: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80&fit=crop",
//   },
// ];

// const TESTIMONIALS = [
//   {
//     quote:
//       "Finally a scoring app that doesn't feel like it was built in 2010. Our whole league runs on YuvaCrix now.",
//     name: "Rohan Mehta",
//     role: "League Coordinator, Mumbai",
//     stars: 5,
//   },
//   {
//     quote:
//       "Set up a 16-team knockout in 10 minutes. The auto-fixture generation saved us hours of planning.",
//     name: "Priya Sharma",
//     role: "Cricket Academy Coach",
//     stars: 5,
//   },
//   {
//     quote:
//       "Parents love the live link during school matches. The scorecards look incredibly professional.",
//     name: "Anil Kumar",
//     role: "School Sports Teacher",
//     stars: 5,
//   },
// ];

// // ─── ANIMATION HOOK ──────────────────────────────────────────────────────────
// function useInView(threshold = 0.15) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const obs = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           obs.disconnect();
//         }
//       },
//       { threshold },
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [threshold]);
//   return { ref, visible };
// }

// // ─── FLOATING CRICKET BALL ────────────────────────────────────────────────────
// function FloatingBall({
//   className,
//   delay = 0,
//   size = 12,
// }: {
//   className?: string;
//   delay?: number;
//   size?: number;
// }) {
//   return (
//     <div
//       className={cn(
//         "absolute rounded-full opacity-20 pointer-events-none",
//         className,
//       )}
//       style={{
//         width: size,
//         height: size,
//         background: "radial-gradient(circle at 35% 35%, #ff6b6b, #cc2200)",
//         boxShadow:
//           "inset -2px -2px 4px rgba(0,0,0,0.4), 0 2px 8px rgba(255,59,48,0.3)",
//         animation: `floatBall ${4 + delay}s ease-in-out infinite`,
//         animationDelay: `${delay}s`,
//       }}
//     />
//   );
// }

// // ─── REVEAL WRAPPER ──────────────────────────────────────────────────────────
// function Reveal({
//   children,
//   delay = 0,
//   direction = "up",
//   className,
// }: {
//   children: React.ReactNode;
//   delay?: number;
//   direction?: "up" | "left" | "right" | "scale";
//   className?: string;
// }) {
//   const { ref, visible } = useInView();
//   const transforms: Record<string, string> = {
//     up: "translateY(40px)",
//     left: "translateX(-40px)",
//     right: "translateX(40px)",
//     scale: "scale(0.92)",
//   };
//   return (
//     <div
//       ref={ref}
//       className={className}
//       style={{
//         opacity: visible ? 1 : 0,
//         transform: visible ? "none" : transforms[direction],
//         transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// // ─── PAGE ─────────────────────────────────────────────────────────────────────
// export default function LandingPage() {
//   const [heroLoaded, setHeroLoaded] = useState(false);

//   useEffect(() => {
//     const t = setTimeout(() => setHeroLoaded(true), 80);
//     return () => clearTimeout(t);
//   }, []);

//   return (
//     <>
//       <style>{`
//         @keyframes floatBall {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50%       { transform: translateY(-18px) rotate(180deg); }
//         }
//         @keyframes spinSlow {
//           to { transform: rotate(360deg); }
//         }
//         @keyframes shimmer {
//           0%   { background-position: -200% center; }
//           100% { background-position: 200% center; }
//         }
//         @keyframes pulse-ring {
//           0%   { transform: scale(1);   opacity: 0.6; }
//           100% { transform: scale(2.2); opacity: 0; }
//         }
//         @keyframes countUp {
//           from { opacity: 0; transform: translateY(12px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes slideInLeft {
//           from { opacity: 0; transform: translateX(-60px); }
//           to   { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes slideInRight {
//           from { opacity: 0; transform: translateX(60px); }
//           to   { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(30px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes zoomIn {
//           from { opacity: 0; transform: scale(1.06); }
//           to   { opacity: 1; transform: scale(1); }
//         }
//         .hero-bg { animation: zoomIn 1.4s cubic-bezier(0.22,1,0.36,1) forwards; }
//         .hero-headline { animation: slideInLeft 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
//         .hero-sub      { animation: fadeUp 0.8s ease 0.5s both; }
//         .hero-ctas     { animation: fadeUp 0.8s ease 0.7s both; }
//         .hero-proof    { animation: fadeUp 0.8s ease 0.9s both; }
//         .hero-card     { animation: slideInRight 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
//         .shimmer-text {
//           background: linear-gradient(90deg, #fff 0%, var(--color-sky) 40%, #fff 60%, var(--color-sky) 100%);
//           background-size: 200% auto;
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           animation: shimmer 3s linear infinite;
//         }
//         .stat-card:hover { transform: translateY(-4px); }
//         .feature-card:hover .feature-icon { transform: scale(1.15) rotate(-6deg); }
//         .gallery-item:hover img { transform: scale(1.08); }
//         .gallery-item:hover .gallery-overlay { opacity: 1; }
//         .gallery-item img, .gallery-item .gallery-overlay { transition: all 0.4s cubic-bezier(0.22,1,0.36,1); }
//       `}</style>

//       <div className="overflow-x-hidden">
//         {/* ═══════════════════════════════════════════════════════
//             HERO
//         ═══════════════════════════════════════════════════════ */}

//         <section className="relative bg-[#070d1a] text-white overflow-hidden min-h-[96vh] flex items-center">
//           {/* Hero background image */}
//           <div className="absolute inset-0 overflow-hidden">
//             <div className="hero-bg absolute inset-0">
//               <Image
//                 src={IMAGES.heroGround}
//                 alt="Cricket ground"
//                 fill
//                 className="object-cover object-center"
//                 priority
//               />
//             </div>
//             {/* Multi-layer overlay for depth */}
//             <div className="absolute inset-0 bg-linear-to-r from-[#070d1a] via-[#070d1a]/80 to-[#070d1a]/30" />
//             <div className="absolute inset-0 bg-linear-to-t from-[#070d1a] via-transparent to-[#070d1a]/60" />
//             {/* Brand tint */}
//             <div className="absolute inset-0 bg-(--color-brand)/10 mix-blend-multiply" />
//           </div>

//           {/* Floating cricket balls */}
//           <FloatingBall className="top-[20%] left-[8%]" delay={0} size={18} />
//           <FloatingBall
//             className="top-[60%] left-[12%]"
//             delay={1.5}
//             size={10}
//           />
//           <FloatingBall
//             className="top-[40%] right-[6%]"
//             delay={2.2}
//             size={14}
//           />
//           <FloatingBall
//             className="top-[75%] right-[15%]"
//             delay={0.8}
//             size={8}
//           />

//           {/* Grid overlay */}
//           <div
//             className="absolute inset-0 opacity-[0.03]"
//             style={{
//               backgroundImage: `linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)`,
//               backgroundSize: "60px 60px",
//             }}
//           />

//           {/* Glow */}
//           <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-(--color-brand) opacity-15 blur-[140px] pointer-events-none" />

//           <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 w-full">
//             <div className="max-w-2xl xl:max-w-3xl">
//               {/* Live badge */}
//               <div className="hero-sub inline-flex items-center gap-2.5 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8">
//                 <span className="relative flex h-2.5 w-2.5">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--color-live) opacity-75" />
//                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-(--color-live)" />
//                 </span>
//                 <span className="text-xs font-semibold tracking-[0.12em] uppercase text-white/80">
//                   Live scoring is here
//                 </span>
//               </div>

//               {/* Headline */}
//               <h1
//                 className="hero-headline font-family-name:(--font-display) font-black uppercase leading-[0.92] tracking-[-0.01em] mb-6"
//                 style={{
//                   fontSize: "clamp(3.2rem, 8.5vw, 6rem)",
//                   fontWeight: 900,
//                 }}
//               >
//                 Cricket Scoring
//                 <br />
//                 <span className="shimmer-text">Built for</span>
//                 <br />
//                 Every Ground.
//               </h1>

//               <p className="hero-sub text-white/65 text-lg sm:text-xl leading-relaxed max-w-xl mb-10">
//                 Ball-by-ball scoring, tournament management, and deep analytics
//                 — all in one app designed for clubs, academies, and weekend
//                 warriors.
//               </p>

//               {/* CTAs */}
//               <div className="hero-ctas flex flex-wrap gap-4 mb-14">
//                 <Link
//                   href="/home"
//                   className={cn(
//                     "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
//                     "group bg-[var(--color-brand)] text-white px-7 py-4 rounded-xl text-base",
//                     "shadow-[var(--shadow-button)] hover:bg-[#2449b8] hover:shadow-[0_8px_28px_rgba(27,63,160,0.55)]",
//                     "transition-all duration-200 active:scale-[0.97] flex items-center gap-2.5",
//                   )}
//                 >
//                   Start Scoring Free
//                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
//                 </Link>
//                 <button
//                   className={cn(
//                     "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
//                     "group border border-white/25 text-white px-7 py-4 rounded-xl text-base",
//                     "hover:bg-white/10 hover:border-white/40 transition-all duration-200 active:scale-[0.97]",
//                     "flex items-center gap-2.5 backdrop-blur-sm",
//                   )}
//                 >
//                   <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
//                     <Play className="w-3 h-3 fill-white ml-0.5" />
//                   </span>
//                   Watch Demo
//                 </button>
//               </div>

//               {/* Social proof */}
//               <div className="hero-proof flex flex-wrap items-center gap-6 text-sm text-white/45">
//                 {[
//                   "No credit card required",
//                   "Free forever plan",
//                   "10,000+ matches scored",
//                 ].map((t) => (
//                   <span key={t} className="flex items-center gap-1.5">
//                     <Check className="w-3.5 h-3.5 text-[var(--color-four)]" />
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Floating scorecard widget */}
//           <div className="hero-card hidden lg:block absolute right-8 xl:right-16 top-1/2 -translate-y-1/2">
//             <div className="relative">
//               {/* Glow ring */}
//               <div className="absolute inset-0 rounded-3xl bg-[var(--color-brand)] blur-2xl opacity-40 scale-110" />
//               <div className="relative bg-gradient-to-b from-[var(--color-brand)] to-[#0f2876] rounded-3xl p-5 w-[280px] shadow-[0_24px_64px_rgba(13,27,62,0.6)] border border-white/10">
//                 {/* Match header */}
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
//                     <span className="w-1.5 h-1.5 rounded-full bg-(--color-live) animate-pulse" />
//                     Live · T20
//                   </span>
//                   <span className="text-[10px] text-white/35">Over 14.3</span>
//                 </div>
//                 {/* Scores */}
//                 <div className="space-y-2.5 mb-4 pb-4 border-b border-white/10">
//                   <div className="flex items-center justify-between">
//                     <span className="font-family-name:(--font-display) font-extrabold uppercase tracking-wide text-white text-[1.1rem]">
//                       Mumbai XI
//                     </span>
//                     <div>
//                       <span
//                         className="font-family-name:(--font-display) font-black text-[2.2rem] text-white leading-none"
//                         style={{ fontWeight: 900 }}
//                       >
//                         138
//                       </span>
//                       <span className="text-white/40 text-sm">/4</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between opacity-40">
//                     <span className="font-family-name:(--font-display) font-extrabold uppercase tracking-wide text-white text-[1.1rem]">
//                       Delhi SC
//                     </span>
//                     <span className="font-family-name:(--font-display) font-bold text-white text-sm">
//                       Yet to bat
//                     </span>
//                   </div>
//                 </div>
//                 {/* This over */}
//                 <div className="mb-4">
//                   <p className="text-[9px] uppercase tracking-[0.14em] text-white/35 mb-2">
//                     This Over
//                   </p>
//                   <div className="flex gap-1.5">
//                     {[
//                       { v: "1", bg: "bg-white/15" },
//                       { v: "4", bg: "bg-[var(--color-four)]" },
//                       { v: "0", bg: "bg-white/8" },
//                       { v: "6", bg: "bg-[var(--color-six)]" },
//                       { v: "W", bg: "bg-[var(--color-live)]" },
//                       { v: "2", bg: "bg-white/15" },
//                     ].map((b, i) => (
//                       <span
//                         key={i}
//                         className={cn(
//                           b.bg,
//                           "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
//                         )}
//                       >
//                         {b.v}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 {/* Current batters */}
//                 <div className="bg-white/8 rounded-xl p-3">
//                   <p className="text-[9px] uppercase tracking-[0.14em] text-white/35 mb-2">
//                     Batting
//                   </p>
//                   <div className="space-y-1.5 text-xs">
//                     <div className="flex justify-between">
//                       <span className="text-white font-semibold">
//                         R. Sharma ●
//                       </span>
//                       <span className="text-white/70">
//                         <span className="text-white font-bold">68</span>(42)
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-white/55">V. Kohli</span>
//                       <span className="text-white/45">
//                         <span className="text-white/65">24</span>(18)
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Bottom wave */}
//           <div className="absolute bottom-0 left-0 right-0">
//             <svg
//               viewBox="0 0 1440 60"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               preserveAspectRatio="none"
//               className="w-full h-12"
//             >
//               <path
//                 d="M0 60L1440 60L1440 20C1200 55 960 5 720 30C480 55 240 5 0 20Z"
//                 fill="var(--color-bg-base)"
//               />
//             </svg>
//           </div>
//         </section>

//         {/* ═══════════════════════════════════════════════════════
//             STATS STRIP
//         ═══════════════════════════════════════════════════════ */}
//         <section className="bg-[var(--color-bg-base)] py-14">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {[
//                 {
//                   val: "10K+",
//                   label: "Matches Scored",
//                   color: "var(--color-brand)",
//                 },
//                 {
//                   val: "1,200+",
//                   label: "Teams Registered",
//                   color: "var(--color-live)",
//                 },
//                 {
//                   val: "340+",
//                   label: "Tournaments Run",
//                   color: "var(--color-six)",
//                 },
//                 { val: "99%", label: "Uptime", color: "var(--color-four)" },
//               ].map((s, i) => (
//                 <Reveal key={s.label} delay={i * 80} direction="up">
//                   <div className="stat-card bg-[var(--color-bg-card)] rounded-2xl p-5 border border-[var(--color-bg-border)] shadow-[var(--shadow-card)] text-center transition-all duration-300 hover:shadow-[var(--shadow-hero)]">
//                     <p
//                       className="font-[family-name:var(--font-display)] font-black text-3xl sm:text-4xl mb-1"
//                       style={{ color: s.color, fontWeight: 900 }}
//                     >
//                       {s.val}
//                     </p>
//                     <p className="text-section-label">{s.label}</p>
//                   </div>
//                 </Reveal>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ═══════════════════════════════════════════════════════
//             FEATURES
//         ═══════════════════════════════════════════════════════ */}
//         <section
//           id="features"
//           className="py-20 lg:py-28 bg-[var(--color-bg-base)]"
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <Reveal className="text-center mb-14">
//               <p className="text-section-label text-[var(--color-brand)] mb-3">
//                 Everything you need
//               </p>
//               <h2 className="font-[family-name:var(--font-display)] font-extrabold uppercase text-4xl sm:text-5xl text-[var(--color-navy)] tracking-[0.02em]">
//                 Built for the game.
//               </h2>
//               <p className="text-[var(--color-text-secondary)] mt-4 text-lg max-w-2xl mx-auto">
//                 From gully cricket to inter-district tournaments — every tool
//                 the modern cricket organizer needs.
//               </p>
//             </Reveal>

//             {/* Feature image banner */}
//             <Reveal className="mb-10 rounded-3xl overflow-hidden relative h-56 sm:h-72 lg:h-80 group">
//               <Image
//                 src={IMAGES.turf}
//                 alt="Cricket turf"
//                 fill
//                 className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-navy)]/80 to-transparent flex items-center px-8 lg:px-14">
//                 <div>
//                   <p className="text-section-label text-[var(--color-sky)] mb-2">
//                     The platform
//                   </p>
//                   <h3
//                     className="font-[family-name:var(--font-display)] font-black uppercase text-white text-3xl sm:text-5xl leading-tight"
//                     style={{ fontWeight: 900 }}
//                   >
//                     Score faster.
//                     <br />
//                     Play harder.
//                   </h3>
//                 </div>
//               </div>
//             </Reveal>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {FEATURES.map((f, i) => (
//                 <Reveal key={f.title} delay={i * 70} direction="up">
//                   <div className="feature-card bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-bg-border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hero)] transition-all duration-300 h-full">
//                     <span
//                       className="feature-icon inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 transition-transform duration-300"
//                       style={{ background: f.bg }}
//                     >
//                       <f.icon className="w-5 h-5" style={{ color: f.color }} />
//                     </span>
//                     <h3 className="font-[family-name:var(--font-display)] font-extrabold uppercase tracking-wide text-[var(--color-navy)] text-lg mb-2">
//                       {f.title}
//                     </h3>
//                     <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
//                       {f.desc}
//                     </p>
//                   </div>
//                 </Reveal>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ═══════════════════════════════════════════════════════
//             HOW IT WORKS — with images
//         ═══════════════════════════════════════════════════════ */}
//         <section
//           id="how-it-works"
//           className="py-20 lg:py-28 bg-[#070d1a] relative overflow-hidden"
//         >
//           {/* Background image with overlay */}
//           <div className="absolute inset-0">
//             <Image
//               src={IMAGES.stadium}
//               alt="Stadium"
//               fill
//               className="object-cover object-center opacity-20"
//             />
//             <div className="absolute inset-0 bg-gradient-to-b from-[#070d1a] via-[#070d1a]/80 to-[#070d1a]" />
//           </div>

//           {/* Floating balls bg */}
//           <FloatingBall className="top-[10%] right-[5%]" delay={0} size={24} />
//           <FloatingBall
//             className="bottom-[15%] left-[4%]"
//             delay={1.2}
//             size={16}
//           />

//           <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <Reveal className="text-center mb-16">
//               <p className="text-section-label text-[var(--color-sky)] mb-3">
//                 Simple as cricket
//               </p>
//               <h2
//                 className="font-[family-name:var(--font-display)] font-black uppercase text-white text-4xl sm:text-5xl tracking-[0.02em]"
//                 style={{ fontWeight: 900 }}
//               >
//                 Up and running
//                 <br />
//                 in minutes.
//               </h2>
//             </Reveal>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
//               {STEPS.map((s, i) => (
//                 <Reveal key={s.step} delay={i * 120} direction="up">
//                   <div className="group relative">
//                     {/* Image */}
//                     <div className="relative h-48 rounded-2xl overflow-hidden mb-5 border border-white/10">
//                       <Image
//                         src={s.img}
//                         alt={s.title}
//                         fill
//                         className="object-cover object-center group-hover:scale-105 transition-transform duration-600"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//                       {/* Step number overlay */}
//                       <div className="absolute top-4 left-4">
//                         <span
//                           className="font-[family-name:var(--font-display)] font-black text-5xl leading-none opacity-80"
//                           style={{
//                             fontWeight: 900,
//                             color: "rgba(255,255,255,0.15)",
//                             textShadow: "0 2px 12px rgba(0,0,0,0.5)",
//                           }}
//                         >
//                           {s.step}
//                         </span>
//                       </div>
//                       {/* Step badge */}
//                       <div className="absolute bottom-4 left-4 right-4">
//                         <span className="inline-block bg-[var(--color-brand)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
//                           Step {s.step}
//                         </span>
//                       </div>
//                     </div>

//                     <h3 className="font-[family-name:var(--font-display)] font-extrabold uppercase tracking-wide text-white text-xl mb-2">
//                       {s.title}
//                     </h3>
//                     <p className="text-white/50 text-sm leading-relaxed">
//                       {s.desc}
//                     </p>
//                   </div>
//                 </Reveal>
//               ))}
//             </div>

//             <Reveal className="mt-14 text-center">
//               <Link
//                 href="/home"
//                 className={cn(
//                   "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
//                   "inline-flex items-center gap-2.5 group",
//                   "bg-[var(--color-brand)] text-white px-8 py-4 rounded-xl text-base",
//                   "shadow-[var(--shadow-button)] hover:bg-[#2449b8] hover:shadow-[0_8px_28px_rgba(27,63,160,0.55)]",
//                   "transition-all duration-200 active:scale-[0.97]",
//                 )}
//               >
//                 Create Your First Match
//                 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </Reveal>
//           </div>
//         </section>

//         {/* ═══════════════════════════════════════════════════════
//             GALLERY
//         ═══════════════════════════════════════════════════════ */}
//         <section
//           id="gallery"
//           className="py-20 lg:py-28 bg-[var(--color-bg-base)]"
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <Reveal className="text-center mb-12">
//               <p className="text-section-label text-[var(--color-brand)] mb-3">
//                 The game, captured
//               </p>
//               <h2 className="font-[family-name:var(--font-display)] font-extrabold uppercase text-4xl sm:text-5xl text-[var(--color-navy)] tracking-[0.02em]">
//                 Made for real cricket.
//               </h2>
//             </Reveal>

//             {/* Asymmetric grid */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[220px] md:auto-rows-[240px]">
//               {/* Big card */}
//               <Reveal
//                 delay={0}
//                 className="gallery-item col-span-2 row-span-2 rounded-3xl overflow-hidden relative cursor-pointer"
//               >
//                 <Image
//                   src={GALLERY[0].src}
//                   alt={GALLERY[0].label}
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="gallery-overlay absolute inset-0 bg-[var(--color-navy)]/50 opacity-0 flex items-end p-6 transition-opacity duration-400">
//                   <span className="font-[family-name:var(--font-display)] font-bold uppercase tracking-wide text-white text-xl">
//                     {GALLERY[0].label}
//                   </span>
//                 </div>
//                 <div className="absolute bottom-5 left-5 bg-[var(--color-brand)]/90 backdrop-blur-sm rounded-xl px-4 py-2">
//                   <span className="font-[family-name:var(--font-display)] font-bold uppercase tracking-wide text-white text-sm">
//                     {GALLERY[0].label}
//                   </span>
//                 </div>
//               </Reveal>

//               {/* Small cards */}
//               {GALLERY.slice(1).map((g, i) => (
//                 <Reveal
//                   key={g.label}
//                   delay={(i + 1) * 80}
//                   className="gallery-item rounded-2xl overflow-hidden relative cursor-pointer"
//                 >
//                   <Image
//                     src={g.src}
//                     alt={g.label}
//                     fill
//                     className="object-cover"
//                   />
//                   <div className="gallery-overlay absolute inset-0 bg-[var(--color-navy)]/50 opacity-0 flex items-end p-4 transition-opacity duration-400">
//                     <span className="font-[family-name:var(--font-display)] font-bold uppercase tracking-wide text-white text-sm">
//                       {g.label}
//                     </span>
//                   </div>
//                   <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1">
//                     <span className="font-[family-name:var(--font-display)] font-bold uppercase tracking-wide text-white text-xs">
//                       {g.label}
//                     </span>
//                   </div>
//                 </Reveal>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ═══════════════════════════════════════════════════════
//             TESTIMONIALS
//         ═══════════════════════════════════════════════════════ */}
//         <section className="py-20 lg:py-28 bg-[var(--color-bg-base)]">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <Reveal className="text-center mb-12">
//               <p className="text-section-label text-[var(--color-brand)] mb-3">
//                 Loved by cricket fans
//               </p>
//               <h2 className="font-[family-name:var(--font-display)] font-extrabold uppercase text-4xl sm:text-5xl text-[var(--color-navy)] tracking-[0.02em]">
//                 What players say.
//               </h2>
//             </Reveal>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//               {TESTIMONIALS.map((t, i) => (
//                 <Reveal key={t.name} delay={i * 90} direction="up">
//                   <div className="fixture-bar bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-bg-border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hero)] transition-all duration-300 h-full flex flex-col">
//                     <div className="flex gap-0.5 mb-4">
//                       {Array.from({ length: t.stars }).map((_, j) => (
//                         <Star
//                           key={j}
//                           className="w-4 h-4 fill-[var(--color-six)] text-[var(--color-six)]"
//                         />
//                       ))}
//                     </div>
//                     <p className="text-[var(--color-text-body)] text-sm leading-relaxed mb-5 italic flex-1">
//                       &ldquo;{t.quote}&rdquo;
//                     </p>
//                     <div className="flex items-center gap-3">
//                       <div className="w-9 h-9 rounded-full bg-[var(--color-bg-tint)] border border-[var(--color-bg-border)] flex items-center justify-center">
//                         <span className="font-[family-name:var(--font-display)] font-bold text-[var(--color-brand)] text-sm">
//                           {t.name[0]}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="font-[family-name:var(--font-display)] font-bold uppercase tracking-wide text-[var(--color-navy)] text-sm">
//                           {t.name}
//                         </p>
//                         <p className="text-meta">{t.role}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </Reveal>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ═══════════════════════════════════════════════════════
//             FINAL CTA BANNER — with bat+ball image
//         ═══════════════════════════════════════════════════════ */}
//         <section className="relative py-24 lg:py-32 overflow-hidden">
//           {/* Background */}
//           <div className="absolute inset-0">
//             <Image
//               src={IMAGES.playerBat}
//               alt="Cricket player"
//               fill
//               className="object-cover object-center"
//             />
//             <div className="absolute inset-0 bg-[var(--color-navy)]/88" />
//             <div className="absolute inset-0 bg-[var(--color-brand)]/30 mix-blend-multiply" />
//           </div>

//           {/* Floating balls */}
//           <FloatingBall className="top-[15%] left-[5%]" delay={0} size={20} />
//           <FloatingBall
//             className="bottom-[20%] right-[6%]"
//             delay={1.8}
//             size={28}
//           />

//           <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
//             <Reveal>
//               {/* Live dot */}
//               <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
//                 <span className="relative flex h-2 w-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-four)] opacity-75" />
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-four)]" />
//                 </span>
//                 <span className="text-xs font-bold tracking-widest uppercase text-white/75">
//                   Join the community
//                 </span>
//               </div>

//               <h2
//                 className="font-[family-name:var(--font-display)] font-black uppercase text-white leading-[0.95] tracking-[-0.01em] mb-5"
//                 style={{
//                   fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
//                   fontWeight: 900,
//                 }}
//               >
//                 Ready to score your
//                 <br />
//                 next match?
//               </h2>
//               <p className="text-white/65 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
//                 Join thousands of cricket organizers already using YuvaCrix.
//                 Free to start — no credit card needed.
//               </p>

//               <div className="flex flex-wrap justify-center gap-4">
//                 <Link
//                   href="/home"
//                   className={cn(
//                     "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
//                     "group inline-flex items-center gap-2.5",
//                     "bg-white text-[var(--color-brand)] px-8 py-4 rounded-xl text-base",
//                     "shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]",
//                     "hover:bg-[var(--color-bg-tint)] transition-all duration-200 active:scale-[0.97]",
//                   )}
//                 >
//                   Start for Free
//                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                 </Link>
//                 <Link
//                   href="#features"
//                   className={cn(
//                     "font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.06em]",
//                     "border border-white/25 text-white px-8 py-4 rounded-xl text-base",
//                     "hover:bg-white/10 hover:border-white/40 transition-all duration-200 active:scale-[0.97]",
//                   )}
//                 >
//                   Learn More
//                 </Link>
//               </div>
//             </Reveal>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// }

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
import { useRef } from "react";
import ScoreDemo from "./ScoreDemo";

const matchFlow = [
  {
    number: "01",
    title: "Select teams",
    image: "/landing/team-selection.png",
  },
  {
    number: "02",
    title: "Set match details",
    image: "/landing/match-details.png",
  },
  {
    number: "03",
    title: "Complete the toss",
    image: "/landing/toss.png",
  },
  {
    number: "04",
    title: "Choose the lineup",
    image: "/landing/lineup.png",
  },
  {
    number: "05",
    title: "Start scoring",
    image: "/landing/scoring.png",
  },
];

const tournamentScreens = [
  {
    label: "Tournament",
    image: "/landing/tournament-home.png",
    className: "lg:translate-y-10 lg:-rotate-[4deg]",
  },
  {
    label: "Fixtures",
    image: "/landing/fixtures.png",
    className: "relative z-20 lg:scale-105",
  },
  {
    label: "Points table",
    image: "/landing/points-table.png",
    className: "lg:translate-y-10 lg:rotate-[4deg]",
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

export default function LandingPage() {
  return (
    <div className="landing-page bg-[#060B1F] text-white">
      <HeroScene />
      <LiveScoringScene />
      <MatchJourneyScene />
      <TournamentScene />
      <PlayerScene />
      <AudienceTicker />
      <FinalCtaScene />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
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

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-16 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[0.87fr_1.13fr] lg:px-10 lg:pb-20 lg:pt-28">
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

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display text-[clamp(4.6rem,12vw,8.3rem)] font-black uppercase leading-[0.77] tracking-[-0.035em]"
            >
              Cricket.
            </motion.h1>
          </div>

          <div className="overflow-hidden pb-2">
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display text-[clamp(4.6rem,12vw,8.3rem)] font-black uppercase leading-[0.77] tracking-[-0.035em] text-[#4B8BFF]"
            >
              Scored
            </motion.h1>
          </div>

          <div className="overflow-hidden pb-2">
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-stroke font-display text-[clamp(4.6rem,12vw,8.3rem)] font-black uppercase leading-[0.77] tracking-[-0.035em]"
            >
              Differently.
            </motion.h1>
          </div>

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
    <div className="relative min-h-[600px] sm:min-h-[690px]">
      <motion.div
        initial={{ opacity: 0, y: 70, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -5 }}
        transition={{
          duration: 1,
          delay: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute left-[0%] top-[17%] z-10 hidden w-[34%] overflow-hidden rounded-[28px] border border-white/15 bg-[#101A37] p-2 shadow-[0_35px_80px_rgba(0,0,0,0.45)] sm:block"
      >
        <div className="relative aspect-[9/16] overflow-hidden rounded-[22px]">
          <Image
            src="/landing/team-selection.png"
            alt="Select teams in YuvaCrix"
            fill
            sizes="250px"
            className="object-cover object-top"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 90, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute left-1/2 top-[3%] z-20 w-[65%] max-w-[360px] -translate-x-1/2 overflow-hidden rounded-[42px] border border-white/20 bg-[#0B1023] p-2.5 shadow-[0_45px_110px_rgba(0,0,0,0.58),0_0_80px_rgba(75,139,255,0.16)]"
      >
        <div className="relative aspect-[9/18.5] overflow-hidden rounded-[34px] bg-[#10182F]">
          <Image
            src="/landing/scoring.png"
            alt="YuvaCrix live scoring screen"
            fill
            priority
            sizes="360px"
            className="object-cover object-top"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 70, rotate: 8 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{
          duration: 1,
          delay: 0.48,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute right-[0%] top-[22%] z-10 hidden w-[34%] overflow-hidden rounded-[28px] border border-white/15 bg-[#101A37] p-2 shadow-[0_35px_80px_rgba(0,0,0,0.45)] sm:block"
      >
        <div className="relative aspect-[9/16] overflow-hidden rounded-[22px]">
          <Image
            src="/landing/scorecard.png"
            alt="YuvaCrix scorecard"
            fill
            sizes="250px"
            className="object-cover object-top"
          />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute right-[2%] top-[10%] z-30 rounded-2xl border border-white/15 bg-[#111A33]/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:right-[7%]"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute h-full w-full animate-ping rounded-full bg-[#FF3B30] opacity-60" />
            <span className="relative h-3 w-3 rounded-full bg-[#FF3B30]" />
          </span>

          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-white">
              Match live
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-white/40">
              86/3 · 8.4 overs
            </p>
          </div>
        </div>
      </motion.div>

      <FloatingEvent
        label="FOUR"
        color="#22C55E"
        className="left-[2%] top-[4%]"
        delay={0}
      />

      <FloatingEvent
        label="SIX"
        color="#F59E0B"
        className="bottom-[7%] right-[3%]"
        delay={1.3}
      />

      <FloatingEvent
        label="WICKET"
        color="#FF3B30"
        className="bottom-[13%] left-[3%]"
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
        y: [0, -10, 0],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        delay,
      }}
      className={`absolute z-30 hidden rounded-xl border px-4 py-2 font-display text-sm font-black uppercase tracking-[0.08em] shadow-xl sm:block ${className}`}
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
/* Live scoring                                                               */
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
/* Match journey                                                              */
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
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
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

        <div className="mt-16 hidden items-start justify-between gap-4 lg:flex">
          {matchFlow.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.65,
                delay: index * 0.12,
              }}
              className="relative flex flex-1 items-start"
            >
              <div className="w-full">
                <div className="group relative overflow-hidden rounded-[28px] border border-[#DDE4EE] bg-white p-2 shadow-[0_28px_70px_rgba(13,27,62,0.10)] transition duration-500 hover:-translate-y-3 hover:shadow-[0_34px_90px_rgba(13,27,62,0.16)]">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-[22px] bg-[#E7EBF2]">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="220px"
                      className="object-cover object-top transition duration-700 group-hover:scale-[1.035]"
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <span className="font-display text-xs font-black text-[#1B3FA0]">
                    {step.number}
                  </span>
                  <span className="font-display text-sm font-bold uppercase tracking-[0.06em]">
                    {step.title}
                  </span>
                </div>
              </div>

              {index < matchFlow.length - 1 && (
                <ChevronRight className="mt-[45%] h-5 w-5 shrink-0 text-[#AAB5C6]" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-14 space-y-7 lg:hidden">
          {matchFlow.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-[70px_1fr] gap-4"
            >
              <div className="flex flex-col items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1B3FA0] font-display text-sm font-black text-white">
                  {step.number}
                </span>

                {index < matchFlow.length - 1 && (
                  <div className="mt-3 h-full w-px bg-[#CAD3E1]" />
                )}
              </div>

              <div className="pb-7">
                <p className="mb-4 font-display text-lg font-black uppercase">
                  {step.title}
                </p>

                <div className="max-w-[270px] overflow-hidden rounded-[28px] border border-[#DDE4EE] bg-white p-2 shadow-xl">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-[22px]">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="270px"
                      className="object-cover object-top"
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
/* Tournament                                                                 */
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
      className="relative overflow-hidden bg-[#0A1025] py-24 lg:py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(75,139,255,0.15),transparent_38%)]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
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
              "Match scheduling",
              "Points tables and standings",
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

        <div className="relative">
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4B8BFF]/15 blur-[90px]" />

          <div className="relative grid grid-cols-3 items-center gap-2 sm:gap-4">
            {tournamentScreens.map((screen, index) => (
              <motion.div
                key={screen.label}
                initial={{ opacity: 0, y: 70, rotate: index === 0 ? -8 : 8 }}
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
                className={`overflow-hidden rounded-[20px] border border-white/15 bg-[#11182F] p-1.5 shadow-[0_35px_75px_rgba(0,0,0,0.5)] sm:rounded-[28px] sm:p-2 ${screen.className}`}
              >
                <div className="relative aspect-[9/16] overflow-hidden rounded-[15px] bg-[#E8ECF2] sm:rounded-[22px]">
                  <Image
                    src={screen.image}
                    alt={screen.label}
                    fill
                    sizes="250px"
                    className="object-cover object-top"
                  />
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
                <p className="font-display text-xs font-bold uppercase tracking-[0.08em]">
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
/* Players                                                                    */
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
            className="relative mx-auto max-w-[370px] overflow-hidden rounded-[36px] border border-[#D7DFEA] bg-white p-2.5 shadow-[0_35px_90px_rgba(13,27,62,0.16)]"
          >
            <div className="relative aspect-[9/17] overflow-hidden rounded-[29px]">
              <Image
                src="/landing/player-profile.png"
                alt="YuvaCrix player profile"
                fill
                sizes="370px"
                className="object-cover object-top"
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
/* Audience ticker                                                            */
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
/* Final CTA                                                                  */
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
          className="font-display text-[clamp(4.2rem,10vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.04em]"
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
