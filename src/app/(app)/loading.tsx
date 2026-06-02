export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-(--color-bg-base)">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-(--color-brand)/20" />

        <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-(--color-brand)" />
      </div>

      <h2 className="mt-6 font-(family-name:--font-display) text-lg font-bold text-(--color-text-primary)">
        Loading YuvaCrix
      </h2>

      <p className="mt-2 text-sm text-(--color-text-muted)">
        Preparing your cricket experience...
      </p>
    </div>
  );
}
