"use client";

type Props = {
  logoUrl?: string | null;
  name: string;
  size?: number; // px
  bg?: string; // tailwind bg class for initials fallback
};

function getInitials(name?: string): string {
  if (!name) return "T";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TeamLogo({
  logoUrl,
  name,
  size = 32,
  bg = "bg-(--color-navy)",
}: Props) {
  return (
    <div
      className={`relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--color-bg-border) ${bg}`}
      style={{ width: size, height: size }}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span
          className="font-display font-black text-(--color-text-inverse)"
          style={{ fontSize: Math.max(10, size * 0.36) }}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
