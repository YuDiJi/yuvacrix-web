import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-(family-name:--font-display) text-7xl font-black text-(--color-brand)">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>

      <p className="mt-2 text-(--color-text-muted)">
        The page you're looking for doesn't exist.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 rounded-xl bg-(--color-brand) px-6 py-3 font-semibold text-white"
      >
        Go Home
      </Link>
    </div>
  );
}
