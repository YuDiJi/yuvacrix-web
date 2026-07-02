"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Shield, FileText, Mail } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────
type Section = {
  number: string;
  title: string;
  content: React.ReactNode;
};

// ── Accordion item ────────────────────────────────────────────────────
function AccordionSection({ section }: { section: Section }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors ${
          open ? "bg-(--color-navy)" : "bg-(--color-bg-card)"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
              open
                ? "bg-white/20 text-(--color-text-inverse)"
                : "bg-(--color-bg-base) text-(--color-text-secondary)"
            }`}
          >
            {section.number}
          </span>
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
            className="flex-shrink-0 text-(--color-text-inverse)"
          />
        ) : (
          <ChevronDown
            size={16}
            className="flex-shrink-0 text-(--color-text-secondary)"
          />
        )}
      </button>

      {open && (
        <div className="border-t border-(--color-bg-border) px-4 py-4">
          {section.content}
        </div>
      )}
    </div>
  );
}

// ── Prose helpers (no lists/bullets — clean runs of text) ─────────────
function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] leading-relaxed text-(--color-text-body)">
      {children}
    </p>
  );
}

function Items({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--color-brand)" />
          <p className="text-[13px] leading-relaxed text-(--color-text-body)">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-lg border-l-4 border-(--color-brand) bg-(--color-bg-tint) px-3 py-2.5">
      <p className="text-[12px] leading-relaxed text-(--color-brand)">
        {children}
      </p>
    </div>
  );
}

// ── Section definitions ───────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    number: "1",
    title: "About YuvaCrix",
    content: (
      <div className="flex flex-col gap-2">
        <Para>
          YuvaCrix is a sports technology platform that simplifies grassroots
          sports management through technology.
        </Para>
        <Items
          items={[
            "Create and manage cricket teams",
            "Score live matches",
            "Organize tournaments and leagues",
            "Manage player profiles",
            "View statistics and analytics",
            "Share live scorecards and match information",
            "Access additional sports features as they become available",
          ]}
        />
      </div>
    ),
  },
  {
    number: "2",
    title: "Eligibility",
    content: (
      <div className="flex flex-col gap-2">
        <Para>
          You must be at least 13 years of age (or the minimum legal age in your
          jurisdiction) to use YuvaCrix.
        </Para>
        <Para>
          If you are under the applicable age, you may only use the Services
          under the supervision of a parent or legal guardian.
        </Para>
        <Para>
          By using YuvaCrix, you represent that you have the legal authority to
          accept these Terms.
        </Para>
      </div>
    ),
  },
  {
    number: "3",
    title: "Your Account",
    content: (
      <div className="flex flex-col gap-2">
        <Para>You are responsible for:</Para>
        <Items
          items={[
            "Maintaining accurate account information",
            "Keeping your login credentials secure",
            "All activities performed using your account",
          ]}
        />
        <Para>
          You must notify us immediately if you believe your account has been
          accessed without authorization.
        </Para>
        <Note>
          YuvaCrix may suspend or terminate accounts involved in fraudulent,
          abusive, or unlawful activities.
        </Note>
      </div>
    ),
  },
  {
    number: "4",
    title: "User Content",
    content: (
      <div className="flex flex-col gap-2">
        <Para>
          You retain ownership of the content you create, including match
          scores, team information, player information, tournament data, photos,
          videos, live streams, and comments.
        </Para>
        <Para>
          By uploading or publishing content on YuvaCrix, you grant us a
          worldwide, non-exclusive, royalty-free license to store, display,
          share, improve our Services, generate statistics, and promote
          YuvaCrix.
        </Para>
        <Note>
          You are solely responsible for ensuring that the content you upload is
          accurate and that you have the necessary rights to publish it.
        </Note>
      </div>
    ),
  },
  {
    number: "5",
    title: "Acceptable Use",
    content: (
      <div className="flex flex-col gap-2">
        <Para>You agree not to:</Para>
        <Items
          items={[
            "Provide false or misleading information",
            "Upload illegal, offensive, or harmful content",
            "Impersonate another individual or organization",
            "Interfere with the operation or security of YuvaCrix",
            "Attempt unauthorized access to our systems",
            "Upload viruses or malicious software",
            "Use automated tools to scrape or copy our Services without permission",
            "Infringe upon the intellectual property rights of others",
          ]}
        />
        <Note>
          Violation of these rules may result in suspension or permanent removal
          of your account.
        </Note>
      </div>
    ),
  },
  {
    number: "6",
    title: "Match Data",
    content: (
      <div className="flex flex-col gap-2">
        <Para>
          YuvaCrix provides tools for recording cricket matches. While we strive
          for accuracy, match scores and statistics are entered by users.
          YuvaCrix does not guarantee the correctness or completeness of any
          score, statistic, ranking, or record published on the platform.
        </Para>
        <Para>
          Tournament organizers and scorers are responsible for ensuring the
          accuracy of official results.
        </Para>
      </div>
    ),
  },
  {
    number: "7",
    title: "Teams & Player Profiles",
    content: (
      <div className="flex flex-col gap-2">
        <Para>
          When creating teams or player profiles, you represent that you have
          permission to manage the team or player, the information submitted is
          accurate, and you will update information when necessary.
        </Para>
        <Para>
          YuvaCrix reserves the right to verify ownership or administration of
          teams and player profiles.
        </Para>
      </div>
    ),
  },
  {
    number: "8",
    title: "Intellectual Property",
    content: (
      <div className="flex flex-col gap-2">
        <Para>
          All rights relating to the YuvaCrix platform — including software,
          design, logos, branding, user interface, graphics, source code, and
          databases — are owned by YuvaCrix or its licensors.
        </Para>
        <Note>
          You may not copy, modify, distribute, reverse engineer, or
          commercially exploit any part of the Services without prior written
          permission.
        </Note>
      </div>
    ),
  },
  {
    number: "9",
    title: "Third-Party Services",
    content: (
      <div className="flex flex-col gap-2">
        <Para>YuvaCrix may integrate with third-party services including:</Para>
        <Items
          items={[
            "Payment providers",
            "Live streaming platforms",
            "Analytics services",
            "Authentication providers",
            "Cloud infrastructure providers",
          ]}
        />
        <Para>
          Your use of such services may also be governed by their respective
          terms and privacy policies.
        </Para>
      </div>
    ),
  },
  {
    number: "10",
    title: "Privacy",
    content: (
      <Para>
        Your use of YuvaCrix is governed by our Privacy Policy. By using our
        Services, you consent to the collection and processing of your
        information as described in the Privacy Policy.
      </Para>
    ),
  },
  {
    number: "11",
    title: "Paid Services",
    content: (
      <div className="flex flex-col gap-2">
        <Para>
          Certain features may require payment. Subscription fees, billing
          cycles, renewal policies, refunds, and cancellation terms will be
          displayed before purchase.
        </Para>
        <Para>
          Failure to pay applicable fees may result in suspension of premium
          features.
        </Para>
      </div>
    ),
  },
  {
    number: "12",
    title: "Availability",
    content: (
      <div className="flex flex-col gap-2">
        <Para>
          We continually improve YuvaCrix and may add, modify, or remove
          features, temporarily suspend services for maintenance, or discontinue
          parts of the platform without prior notice.
        </Para>
      </div>
    ),
  },
  {
    number: "13",
    title: "Termination",
    content: (
      <div className="flex flex-col gap-2">
        <Para>
          We may suspend or terminate your access if you violate these Terms,
          engage in fraudulent activity, misuse the platform, or harm other
          users or YuvaCrix. You may stop using YuvaCrix at any time.
        </Para>
        <Para>
          Termination does not affect obligations that survive under these
          Terms.
        </Para>
      </div>
    ),
  },
  {
    number: "14",
    title: "Disclaimer",
    content: (
      <div className="flex flex-col gap-2">
        <Para>
          YuvaCrix is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis. To the maximum extent permitted by law, we do
          not guarantee continuous availability, error-free operation, complete
          accuracy of user-generated content, or that the Services will meet
          every user&apos;s expectations.
        </Para>
        <Note>Your use of the Services is at your own risk.</Note>
      </div>
    ),
  },
  {
    number: "15",
    title: "Limitation of Liability",
    content: (
      <div className="flex flex-col gap-2">
        <Para>
          To the fullest extent permitted by applicable law, YuvaCrix shall not
          be liable for loss of data, loss of profits, business interruption,
          indirect damages, consequential damages, or reliance on user-generated
          match information arising from your use of the Services.
        </Para>
      </div>
    ),
  },
  {
    number: "16",
    title: "Changes to These Terms",
    content: (
      <Para>
        We may update these Terms periodically. The revised version will become
        effective upon publication on our website or application. Continued use
        of YuvaCrix after updates constitutes acceptance of the revised Terms.
      </Para>
    ),
  },
  {
    number: "17",
    title: "Governing Law",
    content: (
      <Para>
        These Terms shall be governed by and interpreted in accordance with the
        laws of India. Any disputes arising from these Terms shall be subject to
        the exclusive jurisdiction of the courts located in the city where
        YuvaCrix maintains its principal office.
      </Para>
    ),
  },
];

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

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <FileText size={24} className="text-(--color-sky)" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-sky)">
            YuvaCrix
          </span>
          <h1 className="mt-1 font-display text-[32px] font-black uppercase leading-tight tracking-tight text-(--color-text-inverse)">
            Terms of
            <br />
            <span className="text-(--color-sky)">Service</span>
          </h1>
          <p className="mt-2 text-[12px] text-white/60">
            Last updated: July 1, 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Summary banner ────────────────────────────────────────────────────
function SummaryBanner() {
  return (
    <div className="mx-3 mt-3 flex items-start gap-3 rounded-xl border border-(--color-brand)/20 bg-(--color-bg-tint) px-4 py-3">
      <Shield size={18} className="mt-0.5 flex-shrink-0 text-(--color-brand)" />
      <p className="text-[12.5px] leading-relaxed text-(--color-text-body)">
        By creating an account or using YuvaCrix, you agree to these Terms.
        Please read them carefully. If you do not agree, please do not use our
        Services.
      </p>
    </div>
  );
}

// ── Contact + Grievance footer cards ─────────────────────────────────
function ContactCards() {
  return (
    <div className="mx-3 flex flex-col gap-3">
      <p className="text-section-label px-1">Get in Touch</p>

      {/* Contact Us */}
      <a
        href="mailto:support@yuvacrix.in"
        className="flex items-center gap-3 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3.5 shadow-(--shadow-card)"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-(--color-brand)">
          <Mail size={18} color="white" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-[13px] font-bold uppercase tracking-wide text-(--color-navy)">
            Contact Us
          </p>
          <p className="text-meta">support@yuvacrix.in</p>
        </div>
      </a>

      {/* Grievance Officer */}
      <div className="flex items-start gap-3 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3.5 shadow-(--shadow-card)">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-(--color-navy)">
          <Shield size={18} color="white" />
        </div>
        <div className="min-w-0 flex flex-col gap-0.5">
          <p className="font-display text-[13px] font-bold uppercase tracking-wide text-(--color-navy)">
            Grievance Officer
          </p>
          <p className="text-meta">
            For complaints regarding content, user conduct, or legal matters.
          </p>
          <a
            href="mailto:grievance@yuvacrix.in"
            className="mt-1 text-[12px] font-semibold text-(--color-brand)"
          >
            grievance@yuvacrix.in
          </a>
          <p className="text-meta mt-0.5">
            Acknowledges within 48 hours · Resolved per applicable law
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function TermsOfServicePage() {
  return (
    <div className="min-h-dvh bg-(--color-bg-base)">
      <Hero />
      <SummaryBanner />

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
