/* ============================================================
   eng.js — Constantes de engenharia (manutenção predial)
   Valores típicos/consolidados. Ajustáveis pelo usuário.
   Confirmar rendimentos com a ficha técnica do produto e
   os mínimos com a norma vigente (NBR 8160, 5419, etc.).
   ============================================================ */

/* ---------- PINTURA ---------- */
const PINTURA = {
  rendimento: 10,   // m²/L por demão (látex típico ~10–12)
  demaos: 2,
  tipos: [
    {nome:"Látex PVA / acrílica", rend:10},
    {nome:"Esmalte sintético", rend:11},
    {nome:"Selador acrílico", rend:8},
    {nome:"Textura / grafiato", rend:1.2},
    {nome:"Verniz", rend:12},
  ]
};

/* ---------- ALVENARIA — unidades por m² (sugestões) ---------- */
const BLOCOS = [
  {nome:"Bloco concreto 14×19×39", porM2:12.5},
  {nome:"Bloco concreto 9×19×39", porM2:12.5},
  {nome:"Tijolo cerâmico 9×19×39 (½ vez)", porM2:13},
  {nome:"Tijolo cerâmico 9×14×19", porM2:46},
  {nome:"Tijolo maciço 5×10×20", porM2:80},
];

/* ---------- HIDROSSANITÁRIO — consumo per capita ---------- */
const CONSUMO = [
  {uso:"Residência popular", q:120, un:"L/hab·dia"},
  {uso:"Residência padrão", q:200, un:"L/hab·dia"},
  {uso:"Apartamento", q:200, un:"L/hab·dia"},
  {uso:"Escritório", q:50, un:"L/pessoa·dia"},
  {uso:"Escola (externato)", q:50, un:"L/aluno·dia"},
  {uso:"Fórum / repartição pública", q:50, un:"L/pessoa·dia"},
  {uso:"Restaurante", q:25, un:"L/refeição"},
  {uso:"Hotel", q:200, un:"L/hóspede·dia"},
];

/* Declividade mínima — esgoto (NBR 8160) — referência (conferir norma) */
const DECLIVIDADE_MIN = [
  {dn:"DN 40", imin:"2,5 %"},
  {dn:"DN 50", imin:"2,0 %"},
  {dn:"DN 75", imin:"1,0 %"},
  {dn:"DN 100", imin:"1,0 %"},
  {dn:"DN 150", imin:"0,7 %"},
];

/* ---------- SPDA — parâmetros por NPS (NBR 5419-3) ---------- */
const SPDA_CLASSE = {
  I:  {esfera:20, malha:5,  desc:10},
  II: {esfera:30, malha:10, desc:10},
  III:{esfera:45, malha:15, desc:15},
  IV: {esfera:60, malha:20, desc:20},
};
