interface StatusBadgeProps {
  tone: 'ok' | 'warn' | 'error' | 'neutral';
  label: string;
}

const toneClasses: Record<StatusBadgeProps['tone'], string> = {
  ok: 'bg-accent-soft text-accent-dark ring-accent/20',
  warn: 'bg-amber-50 text-amber-800 ring-amber-200',
  error: 'bg-rose-50 text-rose-800 ring-rose-200',
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
};

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${toneClasses[tone]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === 'ok'
            ? 'bg-accent'
            : tone === 'warn'
              ? 'bg-amber-500'
              : tone === 'error'
                ? 'bg-rose-500'
                : 'bg-ink-500'
        }`}
        aria-hidden
      />
      {label}
    </span>
  );
}
