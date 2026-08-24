import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, ExternalLink, NotebookPen, Pencil, Trash2 } from 'lucide-react';
import { STATUS_MAP, daysSince, daysLabel, avatarColor, initialOf } from '../constants';

export default function JobCard({ job, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
    data: { type: 'card', status: job.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const status = STATUS_MAP[job.status];
  const days = daysSince(job.dateApplied);
  const tint = avatarColor(job.company);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative bg-surface-light dark:bg-surface-dark rounded-lg border border-line-light dark:border-line-dark shadow-card hover:shadow-cardHover hover:border-line-light/80 dark:hover:border-white/10 transition-all animate-popIn cursor-grab active:cursor-grabbing"
    >
      {/* status accent rail */}
      <span
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ backgroundColor: status?.color }}
        aria-hidden="true"
      />

      <div className="p-3.5 pl-4">
        <div className="flex items-start gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-display font-semibold shrink-0"
            style={{ backgroundColor: tint }}
            aria-hidden="true"
          >
            {initialOf(job.company)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="font-display font-semibold text-[14px] leading-tight truncate text-ink-light dark:text-ink-dark">
                {job.company}
              </p>
              {job.linkedinUrl && (
                <a
                  href={job.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 text-muted-light/70 dark:text-muted-dark/70 hover:text-accent focus-ring rounded"
                  aria-label="Open LinkedIn job listing"
                  title="Open LinkedIn listing"
                >
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
            <p className="text-[13px] text-muted-light dark:text-muted-dark truncate mt-0.5 leading-tight">
              {job.role}
            </p>
          </div>

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onEdit(job)}
              className="p-1.5 rounded-md text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5 hover:text-ink-light dark:hover:text-ink-dark focus-ring"
              aria-label="Edit job"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onDelete(job)}
              className="p-1.5 rounded-md text-muted-light dark:text-muted-dark hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-stage-rejected focus-ring"
              aria-label="Delete job"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {(job.resume || job.notes) && (
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            {job.resume && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-canvas-light dark:bg-white/[0.06] text-muted-light dark:text-muted-dark border border-line-light dark:border-line-dark truncate max-w-[160px]">
                {job.resume}
              </span>
            )}
            {job.notes && (
              <span
                className="inline-flex items-center gap-1 text-[11px] text-muted-light/80 dark:text-muted-dark/80"
                title={job.notes}
              >
                <NotebookPen size={11} />
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-2.5">
          <span className="font-mono text-[12px] font-medium text-emerald-600 dark:text-emerald-400 truncate">
            {job.salaryRange || '\u00A0'}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-light dark:text-muted-dark shrink-0">
            <Clock size={11} />
            {daysLabel(days)}
          </span>
        </div>
      </div>
    </div>
  );
}
