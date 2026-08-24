import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { STATUSES, todayISO, DEFAULT_RESUMES } from '../constants';

const emptyForm = {
  company: '',
  role: '',
  linkedinUrl: '',
  resume: '',
  dateApplied: todayISO(),
  salaryRange: '',
  notes: '',
  status: 'wishlist',
};

export default function JobModal({ open, initialData, defaultStatus, knownResumes, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
    } else {
      setForm({ ...emptyForm, status: defaultStatus || 'wishlist' });
    }
    setErrors({});
  }, [open, initialData, defaultStatus]);

  const resumeOptions = useMemo(() => {
    const set = new Set([...DEFAULT_RESUMES, ...knownResumes]);
    return Array.from(set).filter(Boolean);
  }, [knownResumes]);

  if (!open) return null;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.company.trim()) next.company = 'Company name is required.';
    if (!form.role.trim()) next.role = 'Job title / role is required.';
    if (form.linkedinUrl.trim()) {
      try {
        new URL(form.linkedinUrl.trim());
      } catch {
        next.linkedinUrl = 'Enter a valid URL, including https://';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      linkedinUrl: form.linkedinUrl.trim(),
      resume: form.resume.trim(),
      salaryRange: form.salaryRange.trim(),
      notes: form.notes.trim(),
    });
  }

  const isEdit = Boolean(initialData);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      <form
        onSubmit={handleSubmit}
        className="relative h-full w-full max-w-md bg-surface-light dark:bg-surface-dark shadow-modal flex flex-col animate-slideOver"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line-light dark:border-line-dark">
          <h2 className="font-display font-semibold text-lg text-ink-light dark:text-ink-dark">
            {isEdit ? 'Edit application' : 'New application'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-canvas-dark focus-ring"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5 space-y-4">
          <Field label="Company name" required error={errors.company}>
            <input
              autoFocus
              type="text"
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              placeholder="e.g. Acme Corp"
              className={inputClass(errors.company)}
            />
          </Field>

          <Field label="Job title / role" required error={errors.role}>
            <input
              type="text"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className={inputClass(errors.role)}
            />
          </Field>

          <Field label="LinkedIn job URL" error={errors.linkedinUrl}>
            <input
              type="url"
              value={form.linkedinUrl}
              onChange={(e) => update('linkedinUrl', e.target.value)}
              placeholder="https://www.linkedin.com/jobs/view/..."
              className={inputClass(errors.linkedinUrl)}
            />
          </Field>

          <Field label="Resume used">
            <input
              type="text"
              list="resume-options"
              value={form.resume}
              onChange={(e) => update('resume', e.target.value)}
              placeholder="e.g. SDE_Resume_v3"
              className={inputClass()}
            />
            <datalist id="resume-options">
              {resumeOptions.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date applied">
              <input
                type="date"
                value={form.dateApplied}
                onChange={(e) => update('dateApplied', e.target.value)}
                className={inputClass()}
              />
            </Field>

            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className={inputClass()}
              >
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Salary range" hint="optional">
            <input
              type="text"
              value={form.salaryRange}
              onChange={(e) => update('salaryRange', e.target.value)}
              placeholder="e.g. ₹25-30 LPA or $150-180K"
              className={inputClass()}
            />
          </Field>

          <Field label="Notes" hint="optional — recruiter name, referral, etc.">
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={4}
              placeholder="Anything worth remembering about this one..."
              className={inputClass() + ' resize-none'}
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-line-light dark:border-line-dark">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-canvas-dark focus-ring"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#3B7DED] text-white hover:bg-[#2f6bd4] focus-ring shadow-sm"
          >
            {isEdit ? 'Save changes' : 'Add application'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, hint, error, children }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-ink-light dark:text-ink-dark">
          {label}
          {required && <span className="text-stage-rejected ml-0.5">*</span>}
        </span>
        {hint && <span className="text-[11px] text-muted-light dark:text-muted-dark">{hint}</span>}
      </span>
      {children}
      {error && <span className="block mt-1 text-[11px] text-stage-rejected">{error}</span>}
    </label>
  );
}

function inputClass(hasError) {
  return `w-full rounded-lg border ${
    hasError ? 'border-stage-rejected' : 'border-line-light dark:border-line-dark'
  } bg-canvas-light dark:bg-canvas-dark text-ink-light dark:text-ink-dark text-sm px-3 py-2 placeholder:text-muted-light/60 dark:placeholder:text-muted-dark/60 focus-ring`;
}
