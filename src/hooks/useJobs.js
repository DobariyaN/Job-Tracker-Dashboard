import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllJobs, putJob, deleteJob as dbDeleteJob, bulkPutJobs, clearAllJobs } from '../db';
import { uid, todayISO, STATUSES } from '../constants';

export function groupByStatus(jobs) {
  const map = {};
  for (const s of STATUSES) map[s.id] = [];
  for (const job of jobs) {
    if (!map[job.status]) map[job.status] = [];
    map[job.status].push(job);
  }
  for (const key of Object.keys(map)) {
    map[key] = map[key].slice().sort((a, b) => a.order - b.order);
  }
  return map;
}

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await getAllJobs();
      if (!cancelled) {
        setJobs(all.sort((a, b) => a.order - b.order));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const jobsByStatus = useMemo(() => groupByStatus(jobs), [jobs]);

  const addJob = useCallback(async (data) => {
    const columnJobs = jobs.filter((j) => j.status === (data.status || 'wishlist'));
    const minOrder = columnJobs.length ? Math.min(...columnJobs.map((j) => j.order)) : 0;
    const job = {
      id: uid(),
      company: '',
      role: '',
      linkedinUrl: '',
      resume: '',
      dateApplied: todayISO(),
      salaryRange: '',
      notes: '',
      status: 'wishlist',
      order: minOrder - 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...data,
    };
    await putJob(job);
    setJobs((prev) => [...prev, job]);
    return job;
  }, [jobs]);

  const updateJob = useCallback(async (id, patch) => {
    setJobs((prev) => {
      const next = prev.map((j) => (j.id === id ? { ...j, ...patch, updatedAt: Date.now() } : j));
      const updated = next.find((j) => j.id === id);
      if (updated) putJob(updated);
      return next;
    });
  }, []);

  const removeJob = useCallback(async (id) => {
    await dbDeleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  // Move a job to a new status/position. targetIndex is the index within the
  // destination column's currently displayed (sorted) array.
  const moveJob = useCallback(async (jobId, destStatus, targetIndex) => {
    setJobs((prev) => {
      const job = prev.find((j) => j.id === jobId);
      if (!job) return prev;

      const destColumn = prev
        .filter((j) => j.status === destStatus && j.id !== jobId)
        .sort((a, b) => a.order - b.order);

      const insertAt = Math.max(0, Math.min(targetIndex, destColumn.length));
      const before = destColumn[insertAt - 1];
      const after = destColumn[insertAt];

      let newOrder;
      if (!before && !after) newOrder = 0;
      else if (!before) newOrder = after.order - 1;
      else if (!after) newOrder = before.order + 1;
      else newOrder = (before.order + after.order) / 2;

      const changed = {
        ...job,
        status: destStatus,
        order: newOrder,
        updatedAt: Date.now(),
      };

      putJob(changed);
      return prev.map((j) => (j.id === jobId ? changed : j));
    });
  }, []);

  const importJobs = useCallback(async (importedJobs) => {
    const cleaned = importedJobs.map((j, i) => ({
      id: j.id || uid(),
      company: j.company || '',
      role: j.role || '',
      linkedinUrl: j.linkedinUrl || '',
      resume: j.resume || '',
      dateApplied: j.dateApplied || todayISO(),
      salaryRange: j.salaryRange || '',
      notes: j.notes || '',
      status: STATUSES.some((s) => s.id === j.status) ? j.status : 'wishlist',
      order: typeof j.order === 'number' ? j.order : i,
      createdAt: j.createdAt || Date.now(),
      updatedAt: Date.now(),
    }));
    await clearAllJobs();
    await bulkPutJobs(cleaned);
    setJobs(cleaned);
  }, []);

  return {
    jobs,
    jobsByStatus,
    loading,
    addJob,
    updateJob,
    removeJob,
    moveJob,
    importJobs,
  };
}
