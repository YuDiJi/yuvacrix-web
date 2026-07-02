"use client";

import {
  Mail,
  Phone,
  ArrowUpRight,
  MessageCircle,
  Camera,
  Briefcase,
} from "lucide-react";

// ── Contact channel definitions ──────────────────────────────────────
const CHANNELS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Fastest way to reach us. Drop a message any time.",
    value: "+91 99999 99999",
    cta: "Open WhatsApp",
    href: "https://wa.me/919999999999",
    Icon: MessageCircle,
    iconBg: "#22C55E",
    chipText: "Usually replies in an hour",
    chipBg: "bg-[#22C55E]/10",
    chipFg: "text-[#22C55E]",
  },
  {
    id: "email",
    label: "Email",
    description: "For detailed queries, partnerships, or feedback.",
    value: "yuvacrix@gmail.com",
    cta: "Send Email",
    href: "mailto:yuvacrix@gmail.com",
    Icon: Mail,
    iconBg: "#1B3FA0",
    chipText: "Replies within 24 hours",
    chipBg: "bg-(--color-brand)/10",
    chipFg: "text-(--color-brand)",
  },
  {
    id: "instagram",
    label: "Instagram",
    description:
      "Follow us for match highlights, live updates & cricket content.",
    value: "@yuvacrix",
    cta: "Follow on Instagram",
    href: "https://instagram.com/yuvacrix",
    Icon: Camera,
    iconBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
    isGradient: true,
    chipText: "Cricket updates daily",
    chipBg: "bg-pink-50",
    chipFg: "text-pink-600",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Connect with us for professional inquiries and partnerships.",
    value: "YuvaCrix",
    cta: "Connect on LinkedIn",
    href: "https://linkedin.com/company/yuvacrix",
    Icon: Briefcase,
    iconBg: "#0A66C2",
    chipText: "Open to collaborations",
    chipBg: "bg-blue-50",
    chipFg: "text-blue-600",
  },
] as const;

// ── Channel card ──────────────────────────────────────────────────────
function ChannelCard({ channel }: { channel: (typeof CHANNELS)[number] }) {
  const { Icon } = channel;
  const isGradient = "isGradient" in channel && channel.isGradient;

  return (
    <a
      href={channel.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card) transition-shadow hover:shadow-(--shadow-hero) active:scale-[0.98] transition-transform"
    >
      {/* Top row: icon + chip */}
      <div className="flex items-center justify-between">
        {/* Icon tile */}
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl shadow-sm"
          style={{
            background: isGradient
              ? (channel as { iconBg: string }).iconBg
              : (channel as { iconBg: string }).iconBg,
          }}
        >
          <Icon size={22} strokeWidth={2} color="white" />
        </div>

        {/* Response chip */}
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${channel.chipBg} ${channel.chipFg}`}
        >
          {channel.chipText}
        </span>
      </div>

      {/* Channel name + description */}
      <div className="flex flex-col gap-0.5">
        <p className="font-display text-[15px] font-black uppercase tracking-wide text-(--color-navy)">
          {channel.label}
        </p>
        <p className="text-body leading-snug text-(--color-text-secondary)">
          {channel.description}
        </p>
      </div>

      {/* Contact value */}
      <p className="text-[13px] font-semibold text-(--color-brand)">
        {channel.value}
      </p>

      {/* CTA row */}
      <div className="flex items-center justify-between border-t border-(--color-bg-border) pt-3">
        <span className="font-display text-[13px] font-bold uppercase tracking-wide text-(--color-navy)">
          {channel.cta}
        </span>
        <ArrowUpRight
          size={18}
          strokeWidth={2.5}
          className="flex-shrink-0 text-(--color-navy) transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
    </a>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <div
      className="relative overflow-hidden px-5 pb-8 pt-10"
      style={{
        background:
          "linear-gradient(135deg, var(--color-navy) 0%, var(--color-brand) 100%)",
      }}
    >
      {/* Cricket pitch-stripe motif — diagonal repeating lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(112deg, transparent, transparent 28px, rgba(255,255,255,0.04) 28px, rgba(255,255,255,0.04) 30px)",
        }}
      />

      {/* Crease-line accent at the bottom */}
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
          YuvaCrix
        </span>

        <h1 className="mt-3 font-display text-[38px] font-black uppercase leading-none tracking-tight text-(--color-text-inverse)">
          Let&apos;s Talk
          <br />
          <span className="text-(--color-sky)">Cricket</span>
        </h1>

        <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-white/70">
          Questions, partnerships, or just want to geek out about the game —
          we&apos;re always on.
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-(--color-bg-base)">
      <Hero />

      <div className="flex flex-col gap-3 px-3 py-4 pb-10">
        <p className="text-section-label px-1 pt-1">Reach us on</p>

        {CHANNELS.map((ch) => (
          <ChannelCard key={ch.id} channel={ch} />
        ))}

        <p className="mt-2 text-center text-[11px] text-(--color-text-muted)">
          YuvaCrix · Built for cricket lovers, by cricket lovers
        </p>
      </div>
    </div>
  );
}
