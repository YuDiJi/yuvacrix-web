import Image from "next/image";
import Link from "next/link";

// ── Social link ───────────────────────────────────────────────────────

type SocialLinkProps = {
  href: string;
  label: string;
  icon: string;
};

function SocialLink({ href, label, icon }: SocialLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
    >
      <Image
        src={icon}
        alt=""
        width={18}
        height={18}
        className="opacity-60 transition-opacity group-hover:opacity-100"
      />
    </Link>
  );
}

// ── Footer link ───────────────────────────────────────────────────────

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[12px] text-white/45 transition-colors duration-150 hover:text-white"
    >
      {children}
    </Link>
  );
}

// ── Footer ────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#070d1a]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
        {/* ── Main row ── */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div className="h-auto w-37.5">
              <Image
                src="/logo/logo_dark.png"
                alt="YuvaCrix"
                width={130}
                height={40}
                className=" h-[150%]"
              />
            </div>
            <p className="max-w-[220px] text-[13px] leading-relaxed text-white/40">
              Every cricket match deserves to be remembered.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2.5 pt-1">
              <SocialLink
                href="https://www.instagram.com/yuvacrix"
                label="Instagram"
                icon="/icons/instagram.svg"
              />
              <SocialLink
                href="https://wa.me/918591771137"
                label="WhatsApp"
                icon="/icons/whatsapp.svg"
              />
              <SocialLink
                href="https://www.youtube.com/@YuvaCrix"
                label="YouTube"
                icon="/icons/youtube.svg"
              />
            </div>
          </div>

          {/* Nav columns */}
          <div className="flex gap-10 sm:gap-14">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
                Product
              </p>
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/contact-us">Contact</FooterLink>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
                Legal
              </p>
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/8 pt-6 sm:flex-row">
          <p className="text-[11px] text-white/25">
            © {new Date().getFullYear()} YuvaCrix. All rights reserved.
          </p>
          <p className="text-[11px] text-white/25">Made for the maidan 🏏</p>
        </div>
      </div>
    </footer>
  );
}
