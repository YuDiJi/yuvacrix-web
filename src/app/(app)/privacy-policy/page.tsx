"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Lock,
  Mail,
  Shield,
  Eye,
  Database,
  UserCheck,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────
type Section = {
  number: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
};

// ── Prose helpers ─────────────────────────────────────────────────────
function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] leading-relaxed text-(--color-text-body)">
      {children}
    </p>
  );
}

function Items({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-brand)" />
          <p className="text-[13px] leading-relaxed text-(--color-text-body)">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-(--color-text-muted)">
      {children}
    </p>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border-l-4 border-(--color-brand) bg-(--color-bg-tint) px-3 py-2.5">
      <p className="text-[12px] leading-relaxed text-(--color-brand)">
        {children}
      </p>
    </div>
  );
}

function WarningNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border-l-4 border-(--color-four) bg-(--color-six)/5 px-3 py-2.5">
      <p className="text-[12px] leading-relaxed text-(--color-text-body)">
        {children}
      </p>
    </div>
  );
}

// ── Accordion ─────────────────────────────────────────────────────────
function AccordionSection({ section }: { section: Section }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <div className="overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors ${
          open ? "bg-(--color-navy)" : "bg-(--color-bg-card)"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Number badge */}
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
              open
                ? "bg-white/20 text-(--color-text-inverse)"
                : "bg-(--color-bg-base) text-(--color-text-secondary)"
            }`}
          >
            {section.number}
          </span>
          {/* Icon */}
          <Icon
            size={14}
            className={`shrink-0 ${
              open ? "text-white/60" : "text-(--color-brand)"
            }`}
          />
          {/* Title */}
          <span
            className={`font-display text-[14px] font-bold uppercase tracking-wide ${
              open ? "text-(--color-text-inverse)" : "text-(--color-navy)"
            }`}
          >
            {section.title}
          </span>
        </div>
        {open ? (
          <ChevronUp
            size={16}
            className="shrink-0 text-(--color-text-inverse)"
          />
        ) : (
          <ChevronDown
            size={16}
            className="shrink-0 text-(--color-text-secondary)"
          />
        )}
      </button>

      {open && (
        <div className="flex flex-col gap-3 border-t border-(--color-bg-border) px-4 py-4">
          {section.content}
        </div>
      )}
    </div>
  );
}

// ── Section data ──────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    number: "1",
    title: "Information We Collect",
    icon: Database,
    content: (
      <>
        <SubHeading>Information You Provide</SubHeading>
        <Items
          items={[
            "Full name",
            "Mobile number",
            "Email address (if provided)",
            "Date of birth",
            "Gender",
            "City",
            "Profile photograph",
            "Team, tournament and match information",
            "Player statistics",
            "Feedback and support requests",
          ]}
        />
        <Para>
          You may choose not to provide certain information; however, some
          features may not be available.
        </Para>

        <SubHeading>Information We Collect Automatically</SubHeading>
        <Items
          items={[
            "Device information and identifiers",
            "Browser type and operating system",
            "IP address",
            "Log and app usage information",
            "Crash reports",
            "Approximate location (where permitted)",
          ]}
        />
        <Para>
          This information helps us improve the performance, security, and
          reliability of our Services.
        </Para>
      </>
    ),
  },
  {
    number: "2",
    title: "How We Use Your Information",
    icon: Eye,
    content: (
      <>
        <Items
          items={[
            "Create and manage your account",
            "Verify your identity",
            "Provide cricket scoring and tournament management services",
            "Maintain player profiles and match history",
            "Generate statistics and analytics",
            "Improve our products and services",
            "Respond to customer support requests",
            "Send important service notifications",
            "Prevent fraud and misuse",
            "Comply with legal obligations",
          ]}
        />
        <Note>We do not sell your personal information.</Note>
      </>
    ),
  },
  {
    number: "3",
    title: "Match & Player Data",
    icon: Shield,
    content: (
      <>
        <Para>
          YuvaCrix is designed to record cricket matches and player
          performances. Information such as match scorecards, player statistics,
          team records, tournament standings, and awards may be visible to other
          users depending on the privacy settings and the nature of the
          competition.
        </Para>
        <Note>
          Tournament organizers and scorers are responsible for ensuring the
          accuracy of match data.
        </Note>
      </>
    ),
  },
  {
    number: "4",
    title: "Cookies & Similar Technologies",
    icon: Database,
    content: (
      <>
        <Para>Our website may use cookies and similar technologies to:</Para>
        <Items
          items={[
            "Keep you signed in",
            "Remember your preferences",
            "Improve website performance",
            "Analyze traffic and usage",
            "Enhance your overall experience",
          ]}
        />
        <Para>
          You may disable cookies through your browser settings, although some
          features may not function correctly.
        </Para>
      </>
    ),
  },
  {
    number: "5",
    title: "How We Share Information",
    icon: UserCheck,
    content: (
      <>
        <Para>
          We may share information only when necessary, including with:
        </Para>
        <Items
          items={[
            "Cloud hosting providers",
            "Analytics providers",
            "Authentication providers",
            "Payment providers (when premium features are introduced)",
            "Tournament organizers (where required)",
            "Legal authorities when required by applicable law",
          ]}
        />
        <Note>
          We do not sell, rent, or trade your personal information to third
          parties.
        </Note>
      </>
    ),
  },
  {
    number: "6",
    title: "Data Security",
    icon: Lock,
    content: (
      <>
        <Para>
          We implement reasonable technical and organizational measures to
          protect your information, including:
        </Para>
        <Items
          items={[
            "Secure HTTPS connections",
            "Encrypted data transmission",
            "Access controls",
            "Secure server infrastructure",
            "Regular security monitoring",
          ]}
        />
        <WarningNote>
          While we strive to protect your information, no internet transmission
          or storage system is completely secure.
        </WarningNote>
      </>
    ),
  },
  {
    number: "7",
    title: "Data Retention",
    icon: Database,
    content: (
      <>
        <Para>
          We retain your information only for as long as necessary to:
        </Para>
        <Items
          items={[
            "Provide our Services",
            "Maintain match history and statistics",
            "Comply with legal obligations",
            "Resolve disputes",
            "Enforce our agreements",
          ]}
        />
        <Para>
          When data is no longer required, it is securely deleted or anonymized
          where appropriate.
        </Para>
      </>
    ),
  },
  {
    number: "8",
    title: "Your Rights",
    icon: UserCheck,
    content: (
      <>
        <Para>Depending on applicable law, you may have the right to:</Para>
        <Items
          items={[
            "Access your personal information",
            "Correct inaccurate information",
            "Update your profile",
            "Request deletion of your account",
            "Withdraw consent where applicable",
          ]}
        />
        <Note>
          Requests may be submitted using the contact details provided below.
        </Note>
      </>
    ),
  },
  {
    number: "9",
    title: "Account Deletion",
    icon: UserCheck,
    content: (
      <>
        <Para>
          You may request deletion of your YuvaCrix account. Upon successful
          deletion:
        </Para>
        <Items
          items={[
            "Your personal account information will be removed or anonymized where legally permitted",
            "Certain match records and tournament statistics may be retained to preserve the integrity of historical scorecards and competition records",
            "Information retained for legal or operational reasons will continue to be protected under this Privacy Policy",
          ]}
        />
      </>
    ),
  },
  {
    number: "10",
    title: "Children's Privacy",
    icon: Shield,
    content: (
      <>
        <Para>
          YuvaCrix is not intended for children under the age required by
          applicable law without parental or guardian supervision.
        </Para>
        <Para>
          If we become aware that personal information has been collected from a
          child in violation of applicable law, we will take reasonable steps to
          remove such information.
        </Para>
      </>
    ),
  },
  {
    number: "11",
    title: "Third-Party Services",
    icon: Eye,
    content: (
      <>
        <Para>
          Our Services may contain links to or integrate with third-party
          platforms and services. These third parties have their own privacy
          policies, and YuvaCrix is not responsible for their privacy practices
          or content.
        </Para>
        <Note>
          We encourage users to review the privacy policies of any third-party
          services they use.
        </Note>
      </>
    ),
  },
  {
    number: "12",
    title: "International Data Transfers",
    icon: Database,
    content: (
      <Para>
        Your information may be processed or stored on servers located in
        countries other than your own. Where required, we will implement
        appropriate safeguards to protect your personal information.
      </Para>
    ),
  },
  {
    number: "13",
    title: "Changes to This Policy",
    icon: Shield,
    content: (
      <>
        <Para>
          We may update this Privacy Policy from time to time to reflect changes
          in our Services, legal requirements, or business practices. The
          updated version will be published on this page with a revised
          &quot;Last Updated&quot; date.
        </Para>
        <Para>
          Your continued use of YuvaCrix after changes become effective
          constitutes acceptance of the revised Privacy Policy.
        </Para>
      </>
    ),
  },
];

// ── Privacy commitment banner ─────────────────────────────────────────
function CommitmentBanner() {
  const points = [
    { icon: Lock, label: "We never sell your data" },
    { icon: Shield, label: "Your data is encrypted" },
    { icon: UserCheck, label: "You control your profile" },
    { icon: Eye, label: "Transparent practices" },
  ];

  return (
    <div className="mx-3 mt-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
      <p className="text-section-label mb-3">Our Commitment</p>
      <div className="grid grid-cols-2 gap-3">
        {points.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2.5"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--color-brand)/10">
              <Icon size={14} className="text-(--color-brand)" />
            </div>
            <p className="text-[11px] font-semibold leading-tight text-(--color-navy)">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
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
      {/* Diagonal stripe motif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(112deg, transparent, transparent 28px, rgba(255,255,255,0.04) 28px, rgba(255,255,255,0.04) 30px)",
        }}
      />

      {/* Crease lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, transparent 10%, white 10%, white 11%, transparent 11%, transparent 89%, white 89%, white 90%, transparent 90%)",
        }}
      />

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
          <Lock size={24} className="text-(--color-sky)" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-sky)">
            YuvaCrix
          </span>
          <h1 className="mt-1 font-display text-[32px] font-black uppercase leading-none tracking-tight text-(--color-text-inverse)">
            Privacy
            <br />
            <span className="text-(--color-sky)">Policy</span>
          </h1>
          <p className="mt-2 text-[12px] text-white/60">
            Last updated: July 1, 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Summary strip ─────────────────────────────────────────────────────
function SummaryStrip() {
  return (
    <div className="mx-3 mt-3 flex items-start gap-3 rounded-xl border border-(--color-brand)/20 bg-(--color-bg-tint) px-4 py-3">
      <Shield size={18} className="mt-0.5 shrink-0 text-(--color-brand)" />
      <p className="text-[12.5px] leading-relaxed text-(--color-text-body)">
        YuvaCrix values your privacy and is committed to protecting your
        personal information. By using YuvaCrix, you agree to the practices
        described in this Privacy Policy.
      </p>
    </div>
  );
}

// ── Contact footer cards ──────────────────────────────────────────────
function ContactCards() {
  return (
    <div className="mx-3 flex flex-col gap-3">
      <p className="text-section-label px-1">Get in Touch</p>

      <a
        href="mailto:support@yuvacrix.in"
        className="flex items-center gap-3 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3.5 shadow-(--shadow-card)"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-brand)">
          <Mail size={18} color="white" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-[13px] font-bold uppercase tracking-wide text-(--color-navy)">
            Privacy Questions
          </p>
          <p className="text-meta">support@yuvacrix.in</p>
        </div>
      </a>

      <div className="flex items-start gap-3 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3.5 shadow-(--shadow-card)">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-navy)">
          <Shield size={18} color="white" />
        </div>
        <div className="min-w-0 flex flex-col gap-0.5">
          <p className="font-display text-[13px] font-bold uppercase tracking-wide text-(--color-navy)">
            Grievance Officer
          </p>
          <p className="text-meta">
            For privacy-related complaints or concerns.
          </p>
          <a
            href="mailto:grievance@yuvacrix.in"
            className="mt-1 text-[12px] font-semibold text-(--color-brand)"
          >
            grievance@yuvacrix.in
          </a>
          <p className="text-meta mt-0.5">
            Acknowledged promptly · Resolved per applicable law
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-dvh bg-(--color-bg-base)">
      <Hero />
      <SummaryStrip />
      <CommitmentBanner />

      <div className="flex flex-col gap-2 px-3 py-4">
        <p className="text-section-label px-1">All Sections</p>
        {SECTIONS.map((section) => (
          <AccordionSection key={section.number} section={section} />
        ))}
      </div>

      <div className="pb-6">
        <ContactCards />
      </div>

      <div className="pb-8 text-center">
        <p className="text-[11px] text-(--color-text-muted)">
          YuvaCrix · yuvacrix.in · © 2026
        </p>
      </div>
    </div>
  );
}
