export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-ink-200 bg-white/60 px-4 py-8 text-sm text-ink-500">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-ink-200 border-t-accent"
        aria-hidden
      />
      {label}
    </div>
  );
}
