-- ============================================================
-- supabase-setup.sql
-- Execute no Supabase → SQL Editor → New query → Run.
-- Cria a tabela 'calculos' e habilita RLS.
-- ============================================================

create table if not exists public.calculos (
  id          text primary key,
  tipo        text not null,
  titulo      text,
  entradas    jsonb not null default '{}'::jsonb,
  resultado   jsonb not null default '{}'::jsonb,
  device      text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_calculos_updated on public.calculos(updated_at desc);
create index if not exists idx_calculos_device  on public.calculos(device);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_calculos_updated on public.calculos;
create trigger trg_calculos_updated
  before update on public.calculos
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS
-- A chave 'anon' é pública (vai no app). As policies abaixo
-- liberam leitura/escrita para anon — adequado para uma
-- ferramenta PESSOAL. Para multiusuário/produção, troque por
-- Supabase Auth e restrinja por auth.uid().
-- ============================================================
alter table public.calculos enable row level security;

drop policy if exists "anon_select" on public.calculos;
drop policy if exists "anon_insert" on public.calculos;
drop policy if exists "anon_update" on public.calculos;
drop policy if exists "anon_delete" on public.calculos;

create policy "anon_select" on public.calculos for select to anon using (true);
create policy "anon_insert" on public.calculos for insert to anon with check (true);
create policy "anon_update" on public.calculos for update to anon using (true) with check (true);
create policy "anon_delete" on public.calculos for delete to anon using (true);
