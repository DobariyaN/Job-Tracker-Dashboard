import { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ArrowDownUp, Plus } from 'lucide-react';
import JobCard from './JobCard';

export default function Column({ status, jobs, onEdit, onDelete, onQuickAdd }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id, data: { type: 'column' } });
  const [sortMode, setSortMode] = useState('manual');

  const sortedJobs = useMemo(() => {
    if (sortMode === 'newest') {
      return [...jobs].sort((a, b) => (b.dateApplied || '').localeCompare(a.dateApplied || ''));
    }
    if (sortMode === 'oldest') {
      return [...jobs].sort((a, b) => (a.dateApplied || '').localeCompare(b.dateApplied || ''));
    }
    return jobs;
  }, [jobs, sortMode]);

  const cycleSort = () => {
    setSortMode((m) => (m === 'manual' ? 'newest' : m === 'newest' ? 'oldest' : 'manual'));
  };

  const sortLabel = { manual: 'Manual', newest: 'Newest', oldest: 'Oldest' }[sortMode];

  return (
    <div className="flex flex-col w-[300px] shrink-0 h-full rounded-xl border border-line-light dark:border-line-dark bg-panel-light dark:bg-panel-dark overflow-hidden">
      <div className="flex items-center justify-between px-3 pt-3 pb-2.5 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: status.color }}
            aria-hidden="true"
          />
          <h2 className="font-display font-semibold text-[12px] tracking-wide uppercase text-ink-light dark:text-ink-dark truncate">
            {status.label}
          </h2>
          <span className="font-mono text-[11px] text-muted-light dark:text-muted-dark bg-canvas-light dark:bg-white/[0.06] rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shrink-0">
            {jobs.length}
          </span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={cycleSort}
            title={`Sort: ${sortLabel} (click to change)`}
            className="p-1.5 rounded-md text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/[0.06] hover:text-ink-light dark:hover:text-ink-dark focus-ring"
          >
            <ArrowDownUp size={13} />
          </button>
          <button
            onClick={() => onQuickAdd(status.id)}
            title="Add job to this column"
            className="p-1.5 rounded-md text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/[0.06] hover:text-ink-light dark:hover:text-ink-dark focus-ring"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[100px] px-2.5 pb-2 space-y-2 overflow-y-auto scrollbar-thin transition-colors ${
          isOver ? 'bg-accent/10' : ''
        }`}
      >
        <SortableContext items={sortedJobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {sortedJobs.map((job) => (
            <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>

        {sortedJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-8 px-3 text-xs text-muted-light dark:text-muted-dark border border-dashed border-line-light dark:border-line-dark rounded-lg">
            <p>Nothing here yet.</p>
          </div>
        )}
      </div>

      <button
        onClick={() => onQuickAdd(status.id)}
        className="flex items-center gap-1.5 shrink-0 text-[12.5px] text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark hover:bg-canvas-light dark:hover:bg-white/[0.04] px-3 py-2.5 border-t border-line-light dark:border-line-dark focus-ring"
      >
        <Plus size={13} />
        Add card
      </button>
    </div>
  );
}
