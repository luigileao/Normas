# Engenharia Elétrica — Normas (PWA)

Aplicativo **offline-first** (PWA) para engenharia elétrica: consulta de normas
(NBR, CEMIG ND, NR), calculadoras e dimensionamento. Sincroniza os cálculos
salvos com o **Supabase**.

## Funcionalidades
- **Biblioteca de Normas** — NBR / CEMIG ND-5.1/5.2/5.3 / NR (busca + filtro).
- **Calculadoras**
  - Corrente / Potência (mono/bi/trifásico, cos φ, kVA).
  - Demanda (CEMIG ND-5.2) — método D = a+b+c+d+e+f, com fatores reais (Tab. 14/15/16) e triagem de entrada.
  - Iluminância (NBR ISO/CIE 8995-1) — lux por ambiente e método dos lúmens.
  - Queda de tensão (NBR 5410, 6.2.7).
  - Condutor / ampacidade (NBR 5410, método B1).
  - Eletroduto (NBR 5410, taxa de ocupação).
  - SPDA — triagem de exposição (NBR 5419-2).
- **Meus Cálculos** — salva e **sincroniza com o Supabase** (offline-first).
- **Checklists** de vistoria por sistema e **Prazos** (periodicidades).
- **Offline + instalável** na tela inicial.

## Estrutura
```
index.html        app shell
styles.css        estilos (tema claro/escuro)
manifest.json     manifest da PWA (caminhos relativos)
sw.js             service worker (cache offline)
js/config.js       URL + chave anon do Supabase
js/supabase.js     cliente REST + sincronização offline-first
js/data.js        base normativa (valores consolidados)
js/cemig.js       fatores de demanda CEMIG (ND-5.2)
js/app.js         lógica, roteador e calculadoras
supabase-setup.sql script de criação da tabela + RLS
icons/            192 e 512 px
.nojekyll         evita processamento Jekyll no GitHub Pages
```

## Configurar o Supabase (1 vez)
1. No painel do Supabase → **SQL Editor → New query** → cole o conteúdo de
   `supabase-setup.sql` → **Run**. Isso cria a tabela `calculos` e habilita o RLS.
2. A URL e a chave **anon** já estão em `js/config.js`. A chave anon é **pública por
   design** (vai no cliente); quem protege os dados é o RLS.
3. As policies do SQL liberam leitura/escrita para `anon` — adequado a uso **pessoal**.
   Para multiusuário/produção, ative o **Supabase Auth** e restrinja por `auth.uid()`.

## Publicar no GitHub Pages

> ⚠️ **Segurança:** se você expôs um token (`ghp_…`), **revogue-o** em
> GitHub → Settings → Developer settings → Personal access tokens e gere um novo.

1. Coloque todos os arquivos na raiz do repositório `Normas`.
2. Faça o commit e push (use um token **novo** ou autenticação por SSH):
   ```bash
   git init
   git add .
   git commit -m "App de normas (PWA offline)"
   git branch -M main
   git remote add origin https://github.com/luigileao/Normas.git
   git push -u origin main
   ```
3. No GitHub: **Settings → Pages → Source: `main` / root → Save**.
4. Acesse: `https://luigileao.github.io/Normas/`

## Instalar no celular
- Abra o link no Chrome (Android) ou Safari (iOS).
- Menu → **“Adicionar à tela inicial”**.
- Abra uma vez online para o app cachear; depois funciona offline.

## Atualizar
A cada nova versão, **incremente** `CACHE = 'normas-v1'` → `normas-v2` em `sw.js`
para forçar a atualização do cache nos dispositivos.

## Aviso
Os parâmetros são valores **consolidados de engenharia** e **não reproduzem** o
texto das normas (protegido — ABNT). Sempre confirmar no texto oficial vigente.
As calculadoras são ferramentas de apoio e não substituem o projeto/ART responsável.
