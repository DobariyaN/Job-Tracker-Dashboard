import { useCallback, useMemo, useState } from 'react';
import Header from './components/Header';
import Board from './components/Board';
import JobModal from './components/JobModal';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import { useJobs, groupByStatus } from './hooks/useJobs';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { jobs, loading, addJob, updateJob, removeJob, moveJob, importJobs } = useJobs();
  const { theme, toggleTheme } = useTheme();

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ open: false, initialData: null, defaultStatus: 'wishlist' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, job: null });
  const [confirmImport, setConfirmImport] = useState({ open: false, data: null, count: 0 });
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => setToast(msg), []);

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (j) => j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q)
    );
  }, [jobs, search]);

  const filteredJobsByStatus = useMemo(() => groupByStatus(filteredJobs), [filteredJobs]);

  const knownResumes = useMemo(() => {
    const set = new Set(jobs.map((j) => j.resume).filter(Boolean));
    return Array.from(set);
  }, [jobs]);

  function openAddModal(status) {
    setModal({ open: true, initialData: null, defaultStatus: status || 'wishlist' });
  }

  function openEditModal(job) {
    setModal({ open: true, initialData: job, defaultStatus: job.status });
  }

  function closeModal() {
    setModal((m) => ({ ...m, open: false }));
  }

  async function handleSave(formData) {
    if (modal.initialData) {
      await updateJob(modal.initialData.id, formData);
      showToast(`Saved changes to ${formData.company}`);
    } else {
      await addJob(formData);
      showToast(`Added ${formData.company} to ${formData.status}`);
    }
    closeModal();
  }

  function requestDelete(job) {
    setConfirmDelete({ open: true, job });
  }

  async function confirmDeleteAction() {
    const job = confirmDelete.job;
    if (job) {
      await removeJob(job.id);
      showToast(`Deleted ${job.company}`);
    }
    setConfirmDelete({ open: false, job: null });
  }

  function handleExport() {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'trackline',
      version: 1,
      jobs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `trackline-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(`Exported ${jobs.length} job${jobs.length === 1 ? '' : 's'}`);
  }

  function handleImportFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const list = Array.isArray(parsed) ? parsed : parsed.jobs;
        if (!Array.isArray(list)) throw new Error('No jobs array found in file.');
        setConfirmImport({ open: true, data: list, count: list.length });
      } catch {
        showToast('Could not read that file — is it a Trackline export?');
      }
    };
    reader.readAsText(file);
  }

  async function confirmImportAction() {
    await importJobs(confirmImport.data);
    showToast(`Imported ${confirmImport.count} job${confirmImport.count === 1 ? '' : 's'}`);
    setConfirmImport({ open: false, data: null, count: 0 });
  }

  return (
    <div className="h-screen flex flex-col bg-canvas-light dark:bg-canvas-dark">
      <Header
        search={search}
        onSearchChange={setSearch}
        theme={theme}
        onToggleTheme={toggleTheme}
        onAddJob={openAddModal}
        onExport={handleExport}
        onImportFile={handleImportFile}
        totalCount={jobs.length}
        shownCount={filteredJobs.length}
      />

      <main className="flex-1 overflow-hidden pt-4">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-light dark:text-muted-dark text-sm">
            Loading your tracker…
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState onAdd={() => openAddModal('wishlist')} />
        ) : (
          <Board
            jobsByStatus={filteredJobsByStatus}
            allJobs={jobs}
            onEdit={openEditModal}
            onDelete={requestDelete}
            onQuickAdd={openAddModal}
            onMove={moveJob}
          />
        )}
      </main>

      <JobModal
        open={modal.open}
        initialData={modal.initialData}
        defaultStatus={modal.defaultStatus}
        knownResumes={knownResumes}
        onClose={closeModal}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete this application?"
        description={
          confirmDelete.job
            ? `This removes ${confirmDelete.job.company} — ${confirmDelete.job.role} permanently. This can't be undone.`
            : ''
        }
        onCancel={() => setConfirmDelete({ open: false, job: null })}
        onConfirm={confirmDeleteAction}
      />

      <ConfirmDialog
        open={confirmImport.open}
        title="Replace all data?"
        description={`Importing will replace your current board with ${confirmImport.count} job${
          confirmImport.count === 1 ? '' : 's'
        } from the file. This can't be undone.`}
        confirmLabel="Import & replace"
        onCancel={() => setConfirmImport({ open: false, data: null, count: 0 })}
        onConfirm={confirmImportAction}
      />

      <Toast message={toast} onDismiss={() => setToast('')} />
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-surface-light dark:bg-surface-dark border border-line-light dark:border-line-dark flex items-center justify-center mb-4">
        <span className="text-2xl">✨</span>
      </div>
      <h2 className="font-display font-semibold text-lg text-ink-light dark:text-ink-dark">
        Your board is empty
      </h2>
      <p className="mt-1.5 text-sm text-muted-light dark:text-muted-dark max-w-sm">
        Add the first role you're tracking — save it to Wishlist, or drop it straight into
        Applied if you've already sent it off.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-hover focus-ring shadow-sm"
      >
        Add your first job
      </button>
    </div>
  );
}
