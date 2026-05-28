# Engenharia Elétrica — Normas (PWA)

Aplicativo **offline-first** (PWA) para engenharia elétrica: consulta de normas
(NBR, CEMIG ND, NR), calculadoras, dimensionamento, **relatório em PDF** e
sincronização com **Supabase** (login por usuário).

## Funcionalidades
- **Biblioteca de Normas** — NBR / CEMIG ND-5.1/5.2/5.3 / NR (busca + filtro).
- **Calculadoras**
  - Corrente / Potência (mono/bi/trifásico, cos φ, kVA).
  - Demanda (CEMIG ND-5.2) — D = a+b+c+d+e+f, fatores reais (Tab. 14/15/16).
  - Iluminância (NBR ISO/CIE 8995-1) — lux por ambiente e método dos lúmens.
  - Queda de tensão (NBR 5410) — com **reatância** opcional e cos φ.
  - Condutor / ampacidade (NBR 5410) — métodos **B1, B2, C, D**.
  - Eletroduto (taxa de ocupação).
  - **Fator de potência** — banco de capacitores (kvar).
  - **Curto-circuito** presumido no secundário do trafo.
  - SPDA — triagem de exposição (NBR 5419-2).
- **Relatório / memorial de cálculo** — botão 📄 gera documento para imprimir/salvar em PDF.
- **Meus Cálculos** — salva local e **sincroniza com o Supabase**; status real de envio e contador de pendências.
- **Login por usuário** (Supabase Auth) — cada um vê só os próprios cálculos (RLS).
- **Checklists** de vistoria e **Prazos** (periodicidades).
- **PWA**: offline, instalável, **aviso de nova versão** e botão **Instalar**.

## Configurar o Supabase (1 vez)
1. Supabase → **SQL Editor → New query** → cole `supabase-setup.sql` → **Run**.
   Cria a tabela `calculos`, o trigger de `updated_at` e o **RLS por usuário**.
2. (Opcional, para testar rápido) Authentication → Providers → Email →
   desative **Confirm email** para entrar logo após o cadastro.
3. URL e chave **anon** já estão em `js/config.js` (a anon é pública por design;
   os dados são protegidos pelo RLS + login).

## Publicar no GitHub Pages
Arquivos na raiz do repo → `git push` (token novo) → Settings → Pages → `main`/root.
URL: `https://luigileao.github.io/Normas/`. A cada deploy, incremente
`CACHE = 'normas-vN'` em `sw.js`.

## Aviso
Parâmetros são valores **consolidados de engenharia**; não reproduzem o texto das
normas (ABNT/CEMIG). As calculadoras são apoio (triagem) e não substituem projeto,
ART nem o texto oficial vigente.
