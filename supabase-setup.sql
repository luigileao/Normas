-- ============================================================
-- supabase-setup.sql (v2 — com autenticação)
-- Execute no Supabase → SQL Editor → New query → Run.
-- ============================================================

create table if not exists public.calculos (
  id          text primary key,
  tipo        text not null,
  titulo      text,
  entradas    jsonb not null default '{}'::jsonb,
  resultado   jsonb not null default '{}'::jsonb,
  device      text,
  user_id     uuid references auth.users(id) on delete cascade,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_calculos_updated on public.calculos(updated_at desc);
create index if not exists idx_calculos_user    on public.calculos(user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_calculos_updated on public.calculos;
create trigger trg_calculos_updated
  before update on public.calculos
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS POR USUÁRIO: cada um só vê/edita os próprios cálculos.
-- ============================================================
alter table public.calculos enable row level security;

drop policy if exists "anon_select" on public.calculos;
drop policy if exists "anon_insert" on public.calculos;
drop policy if exists "anon_update" on public.calculos;
drop policy if exists "anon_delete" on public.calculos;
drop policy if exists "own_select" on public.calculos;
drop policy if exists "own_insert" on public.calculos;
drop policy if exists "own_update" on public.calculos;
drop policy if exists "own_delete" on public.calculos;

create policy "own_select" on public.calculos for select to authenticated using (auth.uid() = user_id);
create policy "own_insert" on public.calculos for insert to authenticated with check (auth.uid() = user_id);
create policy "own_update" on public.calculos for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_delete" on public.calculos for delete to authenticated using (auth.uid() = user_id);

-- ============================================================
-- DICA: para facilitar o teste, em Authentication → Providers → Email,
-- você pode DESATIVAR "Confirm email" para entrar logo após o cadastro.
-- ============================================================
