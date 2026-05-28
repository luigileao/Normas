/* ============================================================
   cemig.js — Fatores de demanda CEMIG (ND-5.2)
   Valores numéricos de engenharia (fatos). Não reproduzem o
   texto da norma. Confirmar sempre na ND vigente da CEMIG.
   Método: D = a + b + c + d + e + f (kVA)   [ND-5.2, item 7.3.2]
   ============================================================ */

/* a) Iluminação e tomadas — fator de demanda por tipo de ocupação
   (ND-5.2, Tabela 14 — unidades não residenciais).
   Cada faixa: até 'lim' kVA aplica f1; acima aplica f2. */
const CEMIG_ILUM_TOMADA = [
  {tipo:"Residencial / uso geral (fator 1,0)", lim:Infinity, f1:1.00, f2:1.00},
  {tipo:"Oficinas, indústrias e semelhantes", lim:20, f1:1.00, f2:0.80},
  {tipo:"Escritórios, lojas e salas comerciais", lim:20, f1:1.00, f2:0.70},
  {tipo:"Escolas e semelhantes", lim:12, f1:1.00, f2:0.50},
  {tipo:"Hotéis e semelhantes", lim:20, f1:0.50, f2:0.40},
  {tipo:"Clínicas, hospitais e semelhantes", lim:50, f1:0.40, f2:0.20},
  {tipo:"Áreas comuns / condomínios", lim:10, f1:1.00, f2:0.25},
  {tipo:"Auditórios, cinemas e semelhantes", lim:Infinity, f1:1.00, f2:1.00},
  {tipo:"Bancos / clubes / igrejas / restaurantes / salão de festas", lim:Infinity, f1:1.00, f2:1.00},
  {tipo:"Garagens comerciais e semelhantes", lim:Infinity, f1:1.00, f2:1.00},
];
function demIlumTomada(kVA, idx){
  const t=CEMIG_ILUM_TOMADA[idx];
  if(kVA<=t.lim) return kVA*t.f1;
  return t.lim*t.f1 + (kVA-t.lim)*t.f2;
}

/* b) Eletrodomésticos de aquecimento e refrigeração
   (ND-5.2, Tabela 16) — fator de demanda por NÚMERO de aparelhos. */
const CEMIG_FD_APARELHOS = {1:1,2:0.92,3:0.84,4:0.76,5:0.70,6:0.65,7:0.60,8:0.57,9:0.54,10:0.52,
  11:0.49,12:0.48,13:0.46,14:0.45,15:0.44,16:0.43,17:0.42,18:0.41,19:0.40,20:0.40,
  21:0.39,22:0.39,23:0.39,24:0.38,25:0.38};
function fdAparelhos(n){
  if(n<=0) return 0;
  if(CEMIG_FD_APARELHOS[n]) return CEMIG_FD_APARELHOS[n];
  if(n<=30) return 0.37; if(n<=40) return 0.36; if(n<=50) return 0.35;
  if(n<=60) return 0.34; return 0.33;
}

/* c) Condicionadores de ar (ND-5.2, Tabela 15) — fator por nº de aparelhos.
   Unidade central: fator 100%. */
function fdArCondicionado(n){
  if(n<=0) return 0; if(n<=10) return 1; if(n<=20) return 0.86; if(n<=30) return 0.80;
  if(n<=40) return 0.78; if(n<=50) return 0.75; if(n<=75) return 0.70; if(n<=100) return 0.65;
  return 0.60;
}

/* Faixas de demanda x dimensionamento (ND-5.2, Tabela 1 — rede trifásica 127/220 V).
   Referência de triagem: demanda (kVA) -> disjuntor (A) e seção mínima (mm²).
   Valores mínimos; confirmar na ND vigente conforme tipo de fornecimento. */
const CEMIG_ENTRADA = [
  {min:0,    max:23.0,  disj:63,  sec:16},
  {min:23.1, max:27.0,  disj:80,  sec:25},
  {min:27.1, max:38.0,  disj:100, sec:35},
  {min:38.1, max:47.0,  disj:125, sec:50},
  {min:47.1, max:57.0,  disj:150, sec:70},
  {min:57.1, max:66.0,  disj:175, sec:95},
  {min:66.1, max:75.0,  disj:200, sec:95},
  {min:75.1, max:86.0,  disj:225, sec:120},
  {min:86.1, max:95.0,  disj:250, sec:150},
];
function entradaCemig(kVA){ return CEMIG_ENTRADA.find(f=>kVA<=f.max) || null; }

/* Regras aditivas (ND-5.2, 7.3.2):
   e) máquinas de solda: 100% maior + 70% 2º + 40% 3º + 30% demais
   f) raios-X: 100% maior + 10% demais  */
