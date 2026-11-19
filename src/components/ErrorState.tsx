interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-5 text-sm text-rose-900">
      <p className="font-medium">Something went wrong</p>
      <p className="mt-1 text-rose-800/90">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md bg-rose-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-800"
        >
          Retry
        </button>
      )}
    </div>
  );
}
