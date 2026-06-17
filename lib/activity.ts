// Ported from legacy/app.js — localStorage-backed activity log.
// M2 will replace the storage layer with the `activity_log` Supabase table; the
// shape/types here are kept identical so that swap is a drop-in change.

export type ActivityType =
  | 'advisor'
  | 'analyst'
  | 'scan'
  | 'pdf'
  | 'limit'
  | 'declaration'
  | 'notice'
  | 'check';

export interface ActivityEntry {
  id: string;
  ts: number;
  type: ActivityType;
  text: string;
}

export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  advisor: 'ti-message-dots',
  analyst: 'ti-checkup-list',
  scan: 'ti-scan',
  pdf: 'ti-file-type-pdf',
  limit: 'ti-gauge',
  declaration: 'ti-clipboard-check',
  notice: 'ti-book-2',
  check: 'ti-help-hexagon',
};

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  advisor: 'Advisor',
  analyst: 'Analyst',
  scan: 'Image scan',
  pdf: 'PDF',
  limit: 'Limits',
  declaration: 'Declarations',
  notice: 'Notices',
  check: 'Am I Affected?',
};

const MAX_ACTIVITY = 50;
const STORAGE_KEY = 'fep_activity';

export function loadActivity(): ActivityEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function logActivity(type: ActivityType, text: string): ActivityEntry[] {
  const activity = loadActivity();
  activity.unshift({ id: Date.now() + '_' + Math.random().toString(36).slice(2), ts: Date.now(), type, text });
  const trimmed = activity.slice(0, MAX_ACTIVITY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}
