"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-(family-name:--font-display) text-7xl font-black text-(--color-brand)">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>

      <p className="mt-2 text-(--color-text-muted)">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>

      {/* <Link
        href="/home"
        className="mt-6 rounded-xl bg-(--color-brand) px-6 py-3 font-semibold text-white"
      >
        Go Home
      </Link> */}
      <button
        onClick={() => router.back()}
        className="mt-6 rounded-xl bg-(--color-brand) px-6 py-3 font-semibold text-white"
      >
        Go Back
      </button>
    </div>
  );
}
