-- Daily FEP Challenge — shared institution leaderboard
-- Apply to the Supabase project referenced by Settings → Daily FEP Challenge
-- (SQL Editor → run this file, or `supabase db push` / MCP apply_migration).
--
-- Privacy: rows are anonymous (institution, correct flag, time, random client
-- id). The raw table has NO select policy — clients only read the aggregated
-- view below.
--
-- IMPORTANT — same-project coupling: this file MUST be run on the Supabase
-- project whose URL and publishable key are hardcoded as LB_URL / LB_KEY in
-- app.js. Running it on any other project leaves the live project without the
-- table/grants/policy, and every score insert fails with HTTP 401 / Postgres
-- code 42501 (row-level security violation).
--
-- Note: the Supabase SQL Editor runs the whole file in one transaction — if
-- ANY statement errors, everything rolls back silently. After running,
-- re-check that the objects actually exist (see the verification footer at
-- the bottom of this file).

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

-- both the table-level privilege AND the RLS policy are required for the
-- anonymous insert to succeed (a missing grant surfaces as HTTP 401 from
-- PostgREST); the explicit grants make this file self-contained even if the
-- project's default privileges have been altered. The policy carries no TO
-- clause (= applies to every role) so it keeps working regardless of which
-- role the API gateway maps the publishable key to.
grant usage on schema public to anon, authenticated;
grant insert on table public.challenge_scores to anon, authenticated;

drop policy if exists "anon can submit a daily score" on public.challenge_scores;
drop policy if exists "api clients can submit a daily score" on public.challenge_scores;
create policy "api clients can submit a daily score"
  on public.challenge_scores for insert with check (true);

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

-- ━━━ Verification (run manually after applying — all commented, file still
-- ━━━ runs as-is) ━━━
--
-- 1) The insert policy must exist (expect one row,
--    policyname = 'api clients can submit a daily score', cmd = 'INSERT'):
--
--    select * from pg_policies where tablename = 'challenge_scores';
--
-- 2) An anonymous insert through PostgREST must succeed with HTTP 201.
--    Replace <PROJECT_URL> / <PUBLISHABLE_KEY> with the exact LB_URL / LB_KEY
--    values from app.js:
--
--    curl -i -X POST '<PROJECT_URL>/rest/v1/challenge_scores?on_conflict=client_id,played_on' \
--      -H 'apikey: <PUBLISHABLE_KEY>' \
--      -H 'Authorization: Bearer <PUBLISHABLE_KEY>' \
--      -H 'Content-Type: application/json' \
--      -H 'Prefer: return=minimal, resolution=ignore-duplicates' \
--      -d '{"played_on":"2026-01-01","team":"verify-test","correct":true,"ms":1000,"client_id":"verify-test-0001"}'
--
--    Expected: HTTP/2 201. An HTTP 401 with Postgres code 42501 means this
--    file was not applied to the project behind <PROJECT_URL>.
