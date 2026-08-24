export const STATUSES = [
  {
    id: 'wishlist',
    label: 'Wishlist',
    caption: "Saved, haven't applied",
    color: '#8B90A0',
  },
  {
    id: 'applied',
    label: 'Applied',
    caption: 'Application submitted',
    color: '#3B7DED',
  },
  {
    id: 'followup',
    label: 'Follow-up',
    caption: 'Nudged a recruiter or referral',
    color: '#E8A23D',
  },
  {
    id: 'interview',
    label: 'Interview',
    caption: 'In interview rounds',
    color: '#8B5CF6',
  },
  {
    id: 'offer',
    label: 'Offer',
    caption: 'Offer in hand',
    color: '#1FA97C',
  },
  {
    id: 'rejected',
    label: 'Rejected',
    caption: 'Didn\u2019t move forward',
    color: '#E5566D',
  },
];

export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.id, s]));

export const DEFAULT_RESUMES = ['SDE_Resume_v3', 'QA_Lead_Resume'];

export function uid() {
  return (
    'job_' +
    Date.now().toString(36) +
    '_' +
    Math.random().toString(36).slice(2, 9)
  );
}

export function todayISO() {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d - tzOffset).toISOString().slice(0, 10);
}

export function daysSince(dateStr) {
  if (!dateStr) return null;
  const then = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((nowLocal - then) / (1000 * 60 * 60 * 24));
  return diff;
}

export function daysLabel(n) {
  if (n === null || Number.isNaN(n)) return '\u2014';
  if (n === 0) return 'Today';
  if (n === 1) return '1 day';
  if (n < 0) return `in ${Math.abs(n)}d`;
  return `${n} days`;
}
