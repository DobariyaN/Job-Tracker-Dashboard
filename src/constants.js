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
    color: '#3B82F6',
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
    color: '#22C55E',
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

// Deterministic avatar color per company name, so the same company always
// gets the same tag color across sessions.
export const AVATAR_PALETTE = [
  '#E5566D', // rose
  '#E8A23D', // amber
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#22C55E', // green
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
];

export function avatarColor(name) {
  const str = (name || '?').trim();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

export function initialOf(name) {
  const trimmed = (name || '').trim();
  return trimmed ? trimmed[0].toUpperCase() : '?';
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
