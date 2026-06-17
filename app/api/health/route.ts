import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json(
      { status: 'error', supabase: 'missing_env_vars' },
      { status: 500 }
    );
  }

  try {
    const supabase = createSupabaseClient(url, anonKey);
    const { error } = await supabase.from('activity_log').select('id', { head: true, count: 'exact' });

    if (error) {
      return NextResponse.json({ status: 'error', supabase: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok', supabase: 'reachable' });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', supabase: err instanceof Error ? err.message : 'unreachable' },
      { status: 500 }
    );
  }
}
