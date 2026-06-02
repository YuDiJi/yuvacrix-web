"use client";

type Props = {
  error: Error;
  reset: () => void;
};

export default function Error({ reset }: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <span className="text-4xl">🏏</span>
      </div>

      <h1 className="font-(family-name:--font-display) text-2xl font-black text-(--color-text-primary)">
        Something went wrong
      </h1>

      <p className="mt-3 max-w-sm text-sm text-(--color-text-muted)">
        We couldn't load this page. Please try again.
      </p>

      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-(--color-brand) px-6 py-3 font-semibold text-white shadow-lg"
      >
        Try Again
      </button>
    </div>
  );
}
