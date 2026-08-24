import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-sm bg-surface-light dark:bg-surface-dark rounded-xl shadow-modal p-5 animate-popIn">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
            <AlertTriangle size={17} className="text-stage-rejected" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-ink-light dark:text-ink-dark">{title}</h3>
            <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-canvas-dark focus-ring"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3.5 py-2 rounded-lg text-sm font-medium bg-stage-rejected text-white hover:opacity-90 focus-ring"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
