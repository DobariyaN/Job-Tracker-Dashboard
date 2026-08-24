import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Column from './Column';
import JobCard from './JobCard';
import { STATUSES } from '../constants';

export default function Board({ jobsByStatus, allJobs, onEdit, onDelete, onQuickAdd, onMove }) {
  const [activeJob, setActiveJob] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const jobById = useMemo(() => {
    const map = {};
    for (const j of allJobs) map[j.id] = j;
    return map;
  }, [allJobs]);

  function handleDragStart(event) {
    const job = jobById[event.active.id];
    setActiveJob(job || null);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveJob(null);
    if (!over) return;

    const activeJobData = jobById[active.id];
    if (!activeJobData) return;

    let destStatus;
    let destIndex;

    if (over.data.current?.type === 'column') {
      destStatus = over.id;
      const destArray = (jobsByStatus[destStatus] || []).filter((j) => j.id !== active.id);
      destIndex = destArray.length;
    } else {
      const overJob = jobById[over.id];
      if (!overJob) return;
      destStatus = overJob.status;
      const destArray = (jobsByStatus[destStatus] || []).filter((j) => j.id !== active.id);
      destIndex = destArray.findIndex((j) => j.id === overJob.id);
      if (destIndex === -1) destIndex = destArray.length;
    }

    onMove(active.id, destStatus, destIndex);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveJob(null)}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4 px-4 sm:px-6 scrollbar-thin">
        {STATUSES.map((status) => (
          <Column
            key={status.id}
            status={status}
            jobs={jobsByStatus[status.id] || []}
            onEdit={onEdit}
            onDelete={onDelete}
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>

      <DragOverlay>
        {activeJob ? (
          <div className="w-[280px] rotate-1 cursor-grabbing">
            <JobCard job={activeJob} onEdit={() => {}} onDelete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
