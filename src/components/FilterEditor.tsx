import type { FilterAction, FilterDraft } from '../types';
import { formatTime, parseTimeInput } from '../utils/formatTime';

interface FilterEditorProps {
  drafts: FilterDraft[];
  onChange: (drafts: FilterDraft[]) => void;
}

function emptyDraft(index: number): FilterDraft {
  return {
    key: `new-${Date.now()}-${index}`,
    id: '',
    start: '',
    end: '',
    action: 'mute',
    label: '',
  };
}

function normalizeTimeField(value: string): string {
  const parsed = parseTimeInput(value);
  if (parsed === null) return value;
  return formatTime(parsed);
}

export function FilterEditor({ drafts, onChange }: FilterEditorProps) {
  function updateRow(key: string, patch: Partial<FilterDraft>) {
    onChange(drafts.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  }

  function removeRow(key: string) {
    onChange(drafts.filter((d) => d.key !== key));
  }

  function addRow(action: FilterAction) {
    onChange([...drafts, { ...emptyDraft(drafts.length), action }]);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-ink-700">Timestamp filters</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => addRow('mute')}
            className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-amber-300 hover:bg-amber-50"
          >
            + Mute
          </button>
          <button
            type="button"
            onClick={() => addRow('skip')}
            className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-accent/40 hover:bg-accent-soft"
          >
            + Skip
          </button>
        </div>
      </div>

      {drafts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-ink-200 bg-white/50 px-4 py-6 text-sm text-ink-500">
          No timestamps yet. Add mute or skip intervals, then publish.
        </p>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft, index) => {
            const startSeconds = parseTimeInput(draft.start);
            const endSeconds = parseTimeInput(draft.end);

            return (
              <div
                key={draft.key}
                className="grid gap-3 rounded-lg border border-ink-200 bg-white/70 p-3 sm:grid-cols-[minmax(7rem,1fr)_minmax(7rem,1fr)_auto_minmax(8rem,1.2fr)_auto]"
              >
                <label className="space-y-1 text-xs">
                  <span className="font-medium text-ink-500">Start (m:ss)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={draft.start}
                    onChange={(e) =>
                      updateRow(draft.key, { start: e.target.value })
                    }
                    onBlur={(e) =>
                      updateRow(draft.key, {
                        start: normalizeTimeField(e.target.value),
                      })
                    }
                    placeholder="10:00"
                    className="w-full rounded-md border border-ink-200 px-2.5 py-1.5 font-mono text-sm tabular-nums tracking-wide text-ink-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                  <span className="block text-[11px] text-ink-500">
                    {startSeconds === null
                      ? 'e.g. 10:00 or 600'
                      : `${startSeconds}s`}
                  </span>
                </label>

                <label className="space-y-1 text-xs">
                  <span className="font-medium text-ink-500">End (m:ss)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={draft.end}
                    onChange={(e) =>
                      updateRow(draft.key, { end: e.target.value })
                    }
                    onBlur={(e) =>
                      updateRow(draft.key, {
                        end: normalizeTimeField(e.target.value),
                      })
                    }
                    placeholder="12:00"
                    className="w-full rounded-md border border-ink-200 px-2.5 py-1.5 font-mono text-sm tabular-nums tracking-wide text-ink-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                  <span className="block text-[11px] text-ink-500">
                    {endSeconds === null
                      ? 'e.g. 12:00 or 720'
                      : `${endSeconds}s`}
                  </span>
                </label>

                <label className="space-y-1 text-xs">
                  <span className="font-medium text-ink-500">Action</span>
                  <select
                    value={draft.action}
                    onChange={(e) =>
                      updateRow(draft.key, {
                        action: e.target.value as FilterAction,
                      })
                    }
                    className="w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="mute">mute</option>
                    <option value="skip">skip</option>
                  </select>
                </label>

                <label className="space-y-1 text-xs">
                  <span className="font-medium text-ink-500">Label (optional)</span>
                  <input
                    type="text"
                    value={draft.label}
                    onChange={(e) =>
                      updateRow(draft.key, { label: e.target.value })
                    }
                    placeholder={`Interval ${index + 1}`}
                    className="w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </label>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeRow(draft.key)}
                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
