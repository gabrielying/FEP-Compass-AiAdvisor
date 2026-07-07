-- Daily FEP Challenge — shared institution leaderboard
-- Apply to the Supabase project referenced by Settings → Daily FEP Challenge
-- (SQL Editor → run this file, or `supabase db push` / MCP apply_migration).
--
-- Privacy: rows are anonymous (institution, correct flag, time, random client
-- id). The raw table has NO select policy — clients only read the aggregated
-- view below.

create table if not exists public.challenge_scores (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  played_on date not null,
  team text not null check (char_length(team) between 1 and 40),
  correct boolean not null,
  ms integer not null check (ms >= 0 and ms <= 3600000),
  client_id text not null check (char_length(client_id) between 8 and 64),
  unique (client_id, played_on) -- one score per device per day
);

alter table public.challenge_scores enable row level security;

drop policy if exists "anon can submit a daily score" on public.challenge_scores;
create policy "anon can submit a daily score"
  on public.challenge_scores for insert to anon with check (true);

-- Aggregated team standings. A SECURITY DEFINER *function* (not a view) is
-- the linter-approved way to expose per-team aggregates from a table whose
-- raw rows anon cannot read: definer runs as the owner (bypassing the
-- no-select RLS on challenge_scores) but returns only the grouped columns,
-- and the empty search_path pin prevents object-shadowing attacks.
-- STABLE lets PostgREST serve it via GET /rest/v1/rpc/challenge_leaderboard.
drop view if exists public.challenge_leaderboard;

create or replace function public.challenge_leaderboard()
returns table (team text, plays int, points int, avg_ms int)
language sql
stable
security definer
set search_path = ''
as $$
  select
    team,
    count(*)::int                                   as plays,
    (count(*) filter (where correct))::int          as points,
    round(avg(ms) filter (where correct))::int      as avg_ms
  from public.challenge_scores
  group by team;
$$;

revoke all on function public.challenge_leaderboard() from public;
grant execute on function public.challenge_leaderboard() to anon;
