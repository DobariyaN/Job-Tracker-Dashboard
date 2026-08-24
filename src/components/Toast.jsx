import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 2600);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] animate-popIn">
      <div className="flex items-center gap-2 bg-ink-light dark:bg-surface-dark text-white dark:text-ink-dark border border-transparent dark:border-line-dark px-4 py-2.5 rounded-lg shadow-modal text-sm">
        <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
        {message}
      </div>
    </div>
  );
}
