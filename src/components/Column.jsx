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
    <div className="flex flex-col w-[300px] shrink-0 h-full">
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: status.color }}
            aria-hidden="true"
          />
          <h2 className="font-display font-semibold text-sm text-ink-light dark:text-ink-dark truncate">
            {status.label}
          </h2>
          <span className="font-mono text-xs text-muted-light dark:text-muted-dark bg-surface-light dark:bg-surface-dark border border-line-light dark:border-line-dark rounded-full px-1.5 py-0.5 shrink-0">
            {jobs.length}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={cycleSort}
            title={`Sort: ${sortLabel} (click to change)`}
            className="p-1.5 rounded-md text-muted-light dark:text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark hover:text-ink-light dark:hover:text-ink-dark focus-ring"
          >
            <ArrowDownUp size={13} />
          </button>
          <button
            onClick={() => onQuickAdd(status.id)}
            title="Add job to this column"
            className="p-1.5 rounded-md text-muted-light dark:text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark hover:text-ink-light dark:hover:text-ink-dark focus-ring"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <p className="px-1 mb-2 text-[11px] text-muted-light dark:text-muted-dark truncate">
        {status.caption}
      </p>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[120px] rounded-xl p-2 space-y-2 overflow-y-auto scrollbar-thin transition-colors ${
          isOver ? 'bg-blue-50/60 dark:bg-blue-950/20 ring-2 ring-[#3B7DED]/30' : 'bg-transparent'
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
            <button
              onClick={() => onQuickAdd(status.id)}
              className="mt-1.5 text-[#3B7DED] hover:underline focus-ring rounded"
            >
              Add a job
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
