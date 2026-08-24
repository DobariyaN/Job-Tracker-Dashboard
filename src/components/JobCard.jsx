import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ExternalLink, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { STATUS_MAP, daysSince, daysLabel } from '../constants';

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

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderLeftColor: status?.color }}
      className="group relative bg-surface-light dark:bg-surface-dark rounded-lg border border-line-light dark:border-line-dark border-l-[3px] shadow-card hover:shadow-cardHover transition-shadow animate-popIn"
    >
      <div className="p-3.5 pl-3">
        <div className="flex items-start gap-2">
          <button
            className="mt-0.5 shrink-0 cursor-grab active:cursor-grabbing text-muted-light/40 dark:text-muted-dark/40 hover:text-muted-light dark:hover:text-muted-dark focus-ring rounded"
            {...attributes}
            {...listeners}
            aria-label="Drag to move card"
          >
            <GripVertical size={15} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="font-display font-semibold text-[15px] leading-tight truncate text-ink-light dark:text-ink-dark">
              {job.company}
            </p>
            <p className="text-sm text-muted-light dark:text-muted-dark truncate mt-0.5">
              {job.role}
            </p>
          </div>

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onEdit(job)}
              className="p-1.5 rounded-md text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-canvas-dark hover:text-ink-light dark:hover:text-ink-dark focus-ring"
              aria-label="Edit job"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(job)}
              className="p-1.5 rounded-md text-muted-light dark:text-muted-dark hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-stage-rejected focus-ring"
              aria-label="Delete job"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* perforated tear line, ticket motif */}
        <div
          className="my-2.5 border-t border-dashed border-line-light dark:border-line-dark"
          aria-hidden="true"
        />

        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            {job.resume && (
              <span className="font-mono px-1.5 py-0.5 rounded bg-canvas-light dark:bg-canvas-dark text-muted-light dark:text-muted-dark truncate border border-line-light dark:border-line-dark">
                {job.resume}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
              {daysLabel(days)}
            </span>
            {job.linkedinUrl && (
              <a
                href={job.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 -m-1 rounded text-[#3B7DED] hover:bg-blue-50 dark:hover:bg-blue-950/40 focus-ring"
                aria-label="Open LinkedIn job listing"
                title="Open LinkedIn listing"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        {job.salaryRange && (
          <p className="mt-2 text-xs font-mono text-muted-light dark:text-muted-dark truncate">
            {job.salaryRange}
          </p>
        )}
      </div>
    </div>
  );
}
