// M2: activity is now stored in the `activity_log` Supabase table, scoped to the
// signed-in user via RLS. Shape/types are kept identical to the localStorage version.
import { createClient } from '@/lib/supabase/client';

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

export async function loadActivity(): Promise<ActivityEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('activity_log')
    .select('id, ts, type, text')
    .order('ts', { ascending: false })
    .limit(MAX_ACTIVITY);

  if (error || !data) return [];
  return data as ActivityEntry[];
}

export async function logActivity(type: ActivityType, text: string): Promise<ActivityEntry[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  await supabase.from('activity_log').insert({ user_id: user.id, ts: Date.now(), type, text });

  return loadActivity();
}
