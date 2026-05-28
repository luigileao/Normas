/* ============================================================
   data.js — Base de dados normativa (valores consolidados)
   Manutenção Predial Integrada — contexto CT 017/2026 TJMG
   Os valores aqui são parâmetros de engenharia consolidados.
   NÃO reproduzem o texto das normas (protegido — ABNT).
   Sempre confirmar no texto oficial da norma vigente.
   ============================================================ */

/* ---------- 1. CATÁLOGO DE NORMAS POR SISTEMA ---------- */
const NORMAS = [
  // CIVIL
  {sis:"Civil", n:"NBR 5674:2012", t:"Manutenção de edificações — Sistema de gestão", ap:"Base geral de toda a manutenção predial"},
  {sis:"Civil", n:"NBR 16280:2015", t:"Reforma em edificações — Sistema de gestão", ap:"Gestão de reformas e intervenções"},
  {sis:"Civil", n:"NBR 15575 (1–6)", t:"Edificações habitacionais — Desempenho", ap:"Vida útil e desempenho de sistemas"},
  {sis:"Civil", n:"NBR 6118:2023", t:"Projeto de estruturas de concreto armado", ap:"Elementos estruturais, diagnóstico de patologias"},
  {sis:"Civil", n:"NBR 9575:2010", t:"Impermeabilização — Seleção e projeto", ap:"Coberturas, lajes, fundações"},
  {sis:"Civil", n:"NBR 13755:2017", t:"Revestimento de fachadas", ap:"Fachadas cerâmicas, ACM, placas"},
  {sis:"Civil", n:"NBR 14432:2001", t:"Exigências de resistência ao fogo", ap:"Elementos estruturais"},

  // HIDROSSANITÁRIO
  {sis:"Hidrossanitário", n:"NBR 5626:2020", t:"Sistemas prediais de água fria e quente", ap:"Projeto, execução e manutenção de água"},
  {sis:"Hidrossanitário", n:"NBR 8160:1999", t:"Sistemas prediais de esgoto sanitário", ap:"Redes de esgoto, ralos, caixas sifonadas"},
  {sis:"Hidrossanitário", n:"NBR 10844:1989", t:"Instalações prediais de águas pluviais", ap:"Calhas, condutores, drenagem"},
  {sis:"Hidrossanitário", n:"NBR 15527:2019", t:"Aproveitamento de água de chuva", ap:"Cisternas e reúso"},

  // ELÉTRICO
  {sis:"Elétrico", n:"NBR 5410:2004 (Em.1:2008)", t:"Instalações elétricas de baixa tensão", ap:"Base de todas as instalações BT"},
  {sis:"Elétrico", n:"NBR 14039:2005", t:"Instalações elétricas de média tensão", ap:"Subestações, cabines primárias"},
  {sis:"Elétrico", n:"NBR 5419-1:2015", t:"SPDA — Princípios gerais", ap:"Proteção contra descargas atmosféricas"},
  {sis:"Elétrico", n:"NBR 5419-2:2015", t:"SPDA — Gerenciamento de risco", ap:"Avaliação de risco R1…R4"},
  {sis:"Elétrico", n:"NBR 5419-3:2015", t:"SPDA — Danos físicos e perigo à vida", ap:"Captores, descidas, aterramento"},
  {sis:"Elétrico", n:"NBR 5419-4:2015", t:"SPDA — Sistemas elétricos e eletrônicos", ap:"DPS, proteção interna"},
  {sis:"Elétrico", n:"NBR ISO/CIE 8995-1:2013", t:"Iluminação de ambientes de trabalho", ap:"Níveis de iluminância (lux) — substitui a NBR 5413"},
  {sis:"Elétrico", n:"NBR 5413:1992 (cancelada)", t:"Iluminância de interiores", ap:"Substituída pela NBR ISO/CIE 8995-1:2013"},
  {sis:"CEMIG", n:"ND-5.1", t:"Fornecimento de energia em tensão secundária — unidades individuais", ap:"Padrão de entrada residencial/comercial individual"},
  {sis:"CEMIG", n:"ND-5.2", t:"Fornecimento em tensão secundária — edificações de uso coletivo", ap:"Demanda, padrão de entrada coletivo, ramal"},
  {sis:"CEMIG", n:"ND-5.3", t:"Fornecimento de energia elétrica em média tensão", ap:"Entrada em MT, subestação do consumidor"},
  {sis:"CEMIG", n:"ND-5.31", t:"Projeto de redes de distribuição", ap:"Diretrizes de redes CEMIG"},
  {sis:"Elétrico", n:"NBR 16690:2019", t:"Instalações elétricas fotovoltaicas", ap:"Cabeamento, inversores, módulos"},
  {sis:"Elétrico", n:"NBR IEC 61439 (1–6)", t:"Conjuntos de manobra de BT", ap:"QDCs, painéis de distribuição"},

  // VOZ E DADOS
  {sis:"Voz e Dados", n:"NBR 14565:2013", t:"Cabeamento estruturado", ap:"Projeto e instalação UTP/FO"},
  {sis:"Voz e Dados", n:"NBR 16521:2016", t:"Cabeamento estruturado — Instalação", ap:"Instalação física do cabeamento"},

  // SPCIP — INCÊNDIO
  {sis:"Incêndio", n:"NBR 12693:2021", t:"Sistemas de extintores de incêndio", ap:"Seleção, distribuição, manutenção de extintores"},
  {sis:"Incêndio", n:"NBR 13714:2000", t:"Hidrantes e mangotinhos", ap:"Sistemas de combate por água"},
  {sis:"Incêndio", n:"NBR 10897:2020", t:"Proteção por chuveiros automáticos (sprinkler)", ap:"Sistemas de sprinkler"},
  {sis:"Incêndio", n:"NBR 17240:2010", t:"Detecção e alarme de incêndio (SDAI)", ap:"Central, detectores, acionadores"},
  {sis:"Incêndio", n:"NBR 11742:2003", t:"Porta corta-fogo para saída de emergência", ap:"Instalação e manutenção de PCF"},
  {sis:"Incêndio", n:"NBR 10898:2013", t:"Sistema de iluminação de emergência", ap:"Luminárias de emergência, autonomia"},
  {sis:"Incêndio", n:"NBR 13434 (1–3)", t:"Sinalização de segurança contra incêndio", ap:"Rotas de fuga e equipamentos"},
  {sis:"Incêndio", n:"NBR 12779:2009", t:"Mangueiras de incêndio — Inspeção e manutenção", ap:"Mangueiras de hidrante"},
  {sis:"Incêndio", n:"IT-08 CBMMG", t:"Saídas de emergência", ap:"Dimensionamento de rotas de fuga"},
  {sis:"Incêndio", n:"IT-17 CBMMG", t:"Hidrantes e mangotinhos (MG)", ap:"Exigências estaduais de hidrantes"},

  // BOMBEAMENTO
  {sis:"Bombeamento", n:"NBR 12214:1992", t:"Sistema de bombeamento de água", ap:"Dimensionamento e operação de bombas"},
  {sis:"Bombeamento", n:"NBR 14631:2012", t:"Portão de garagem automático", ap:"Portões automáticos — segurança"},

  // GLP
  {sis:"GLP", n:"NBR 13523:2015", t:"Centrais de GLP", ap:"Central, botijões, tanques"},
  {sis:"GLP", n:"NBR 15526:2020", t:"Redes internas de gases combustíveis", ap:"Tubulações, válvulas, estanqueidade"},

  // GESTÃO / SEGURANÇA
  {sis:"Segurança (NR)", n:"NR-06", t:"Equipamentos de Proteção Individual (EPI)", ap:"EPI obrigatório das equipes"},
  {sis:"Segurança (NR)", n:"NR-10", t:"Segurança em instalações elétricas", ap:"Eletricistas e equipes elétricas"},
  {sis:"Segurança (NR)", n:"NR-12", t:"Segurança em máquinas e equipamentos", ap:"Bombas, portões, rotativos"},
  {sis:"Segurança (NR)", n:"NR-35", t:"Trabalho em altura", ap:"Coberturas e fachadas"},
  {sis:"Segurança (NR)", n:"NR-33", t:"Espaço confinado", ap:"Reservatórios, poços, cisternas"},
];

/* ---------- 2. PERIODICIDADES DE MANUTENÇÃO ---------- */
const PERIODICIDADES = [
  {sis:"Incêndio", at:"Extintor — inspeção visual", per:"Mensal", norma:"NBR 12693", dias:30},
  {sis:"Incêndio", at:"Extintor — manutenção nível 1", per:"Anual", norma:"NBR 12693", dias:365},
  {sis:"Incêndio", at:"Hidrante — inspeção do sistema", per:"Trimestral / Semestral", norma:"NBR 13714", dias:90},
  {sis:"Incêndio", at:"Mangueira de incêndio — inspeção", per:"Trimestral", norma:"NBR 12779", dias:90},
  {sis:"Incêndio", at:"Mangueira — ensaio hidrostático", per:"Anual", norma:"NBR 12779", dias:365},
  {sis:"Incêndio", at:"Sprinkler — inspeção visual", per:"Mensal", norma:"NBR 10897", dias:30},
  {sis:"Incêndio", at:"SDAI — teste funcional detectores", per:"Semestral", norma:"NBR 17240", dias:180},
  {sis:"Incêndio", at:"Iluminação de emergência — teste", per:"Mensal (funcional)", norma:"NBR 10898", dias:30},
  {sis:"Incêndio", at:"Porta corta-fogo — inspeção/lubrificação", per:"Semestral", norma:"NBR 11742", dias:180},
  {sis:"Elétrico", at:"SPDA — inspeção visual", per:"Anual", norma:"NBR 5419-3", dias:365},
  {sis:"Elétrico", at:"SPDA — medição de resistência de aterramento", per:"Anual", norma:"NBR 5419-3", dias:365},
  {sis:"Elétrico", at:"Elétrico BT — termografia de quadros", per:"Anual (recomendado)", norma:"NBR 5410", dias:365},
  {sis:"Elétrico", at:"Subestação MT — manutenção preventiva", per:"Anual", norma:"NBR 14039", dias:365},
  {sis:"Bombeamento", at:"Bomba — inspeção de operação", per:"Mensal", norma:"NBR 12214", dias:30},
  {sis:"GLP", at:"GLP — teste de estanqueidade", per:"Anual", norma:"NBR 15526", dias:365},
  {sis:"Civil", at:"Impermeabilização — inspeção", per:"Anual", norma:"NBR 9575", dias:365},
  {sis:"Civil", at:"Cobertura/telhado — inspeção", per:"Semestral", norma:"NBR 5674", dias:180},
];

/* ---------- 3. ILUMINÂNCIAS (NBR ISO/CIE 8995-1) ---------- */
/* Em = iluminância mantida recomendada (lux). Valores consolidados da
   norma para ambientes típicos de edificações administrativas/forenses. */
const ILUMINANCIA = [
  {amb:"Escritório / sala de trabalho (escrita, digitação)", lux:500},
  {amb:"Gabinete / sala de audiência (leitura de processos)", lux:500},
  {amb:"Sala de reunião (sobre a mesa)", lux:500},
  {amb:"Sala de aula / treinamento", lux:300},
  {amb:"Balcão de atendimento / protocolo", lux:300},
  {amb:"Recepção / saguão", lux:200},
  {amb:"Arquivo (consulta de documentos)", lux:200},
  {amb:"Arquivo morto / depósito", lux:100},
  {amb:"Sala técnica / CPD / rack", lux:500},
  {amb:"Copa / cozinha", lux:300},
  {amb:"Sanitários", lux:200},
  {amb:"Circulação e corredores", lux:100},
  {amb:"Escadas", lux:150},
  {amb:"Casa de máquinas / áreas técnicas", lux:200},
  {amb:"Estacionamento coberto (circulação interna)", lux:75},
  {amb:"Auditório (plateia)", lux:200},
  {amb:"Almoxarifado / estoque", lux:100},
];

/* ---------- 4. CAPACIDADE DE CONDUÇÃO (NBR 5410) ----------
   Método de referência B1, cobre, isolação PVC, 2 ou 3 condutores
   carregados, temperatura ambiente 30 °C. Valores de referência (A).
   Aplicar fatores de correção de temperatura e agrupamento. */
const AMPACIDADE_B1_PVC = [ // [seção mm², 2 cond., 3 cond.]
  {s:1.5, c2:17.5, c3:15.5},
  {s:2.5, c2:24,   c3:21},
  {s:4,   c2:32,   c3:28},
  {s:6,   c2:41,   c3:36},
  {s:10,  c2:57,   c3:50},
  {s:16,  c2:76,   c3:68},
  {s:25,  c2:101,  c3:89},
  {s:35,  c2:125,  c3:111},
  {s:50,  c2:151,  c3:134},
  {s:70,  c2:192,  c3:171},
  {s:95,  c2:232,  c3:207},
  {s:120, c2:269,  c3:239},
  {s:150, c2:309,  c3:275},
  {s:185, c2:353,  c3:314},
  {s:240, c2:415,  c3:369},
];

const SECOES_MINIMAS = [
  {uso:"Iluminação", sec:"1,5 mm²", norma:"NBR 5410 — Tab. 47"},
  {uso:"Circuitos de força / tomadas", sec:"2,5 mm²", norma:"NBR 5410 — Tab. 47"},
  {uso:"Sinalização e comando", sec:"0,5 mm²", norma:"NBR 5410 — Tab. 47"},
];

/* ---------- 5. CHECKLISTS DE VISTORIA POR SISTEMA ---------- */
/* Itens redigidos como roteiro operacional de fiscalização. */
const CHECKLISTS = {
  "SPDA / Para-raios": {norma:"NBR 5419-3", itens:[
    "Captores e mastros íntegros, sem corrosão ou afrouxamento",
    "Condutores de descida fixados, contínuos e sem rompimentos",
    "Conexões e soldas exotérmicas/conectores em bom estado",
    "Caixas de inspeção de aterramento acessíveis e identificadas",
    "Medição de resistência de aterramento registrada (≤ projeto)",
    "Equipotencialização das massas metálicas verificada",
    "DPS instalados e sem indicação de fim de vida (NBR 5419-4)",
    "Laudo/ART do SPDA vigente e arquivado",
  ]},
  "Elétrico — Quadros BT": {norma:"NBR 5410 / NR-10", itens:[
    "Quadro identificado, com diagrama unifilar e circuitos legendados",
    "Disjuntores compatíveis com seção dos condutores (proteção)",
    "Ausência de pontos quentes (termografia) e cheiro de queimado",
    "Aperto de conexões e barramentos verificado",
    "Aterramento e DR (DDR) presentes e funcionais",
    "Tampa, fechadura e grau de proteção (IP) adequados",
    "Sem improvisos, emendas irregulares ou circuitos sobrecarregados",
    "Sinalização de risco elétrico e bloqueio/etiquetagem (NR-10)",
  ]},
  "Subestação / Média Tensão": {norma:"NBR 14039 / NR-10", itens:[
    "Acesso restrito, sinalização de alta tensão e EPC presentes",
    "Transformador: nível e vazamento de óleo, temperatura, ruído",
    "Buchas, isoladores e barramentos sem trincas ou flashover",
    "Cubículos limpos, secos e sem infiltração",
    "Aterramento da malha medido e dentro do projeto",
    "Equipamentos de manobra operando e intertravamentos OK",
    "EPIs específicos, vara de manobra e estrado isolante disponíveis",
    "Prontuário das instalações elétricas (NR-10) atualizado",
  ]},
  "Extintores": {norma:"NBR 12693", itens:[
    "Posicionamento, sinalização e desobstrução do acesso",
    "Lacre íntegro e manômetro na faixa verde (quando aplicável)",
    "Carga e validade de recarga/teste hidrostático vigentes",
    "Etiqueta de manutenção e selo do Inmetro presentes",
    "Suporte/altura de instalação conforme exigência",
    "Tipo de agente compatível com a classe de risco do ambiente",
  ]},
  "Hidrantes e Mangotinhos": {norma:"NBR 13714 / IT-17", itens:[
    "Abrigo sinalizado, desobstruído e em bom estado",
    "Mangueiras presentes, sem furos/ressecamento (inspeção NBR 12779)",
    "Esguicho, chave de mangueira e adaptadores completos",
    "Registro de recalque acessível e tampão presente",
    "Pressão e vazão verificadas no hidrante mais desfavorável",
    "Bomba de incêndio operante (automático/manual) e teste registrado",
    "Reserva técnica de incêndio (RTI) no nível adequado",
  ]},
  "Sprinklers (Chuveiros Automáticos)": {norma:"NBR 10897", itens:[
    "Bicos sem pintura, obstrução ou dano; ampolas íntegras",
    "Distância mínima de bicos a obstruções respeitada",
    "Válvula de governo e alarme (VGA) operante e selada",
    "Manômetros indicando pressão de trabalho correta",
    "Bicos sobressalentes e chave própria no local",
    "Teste de fluxo/alarme registrado no período",
  ]},
  "Iluminação de Emergência": {norma:"NBR 10898", itens:[
    "Pontos cobrindo rotas de fuga, escadas e mudanças de direção",
    "Autonomia mínima de 1 hora confirmada em teste",
    "Acionamento automático na falta de energia funcionando",
    "Baterias/luminárias sem sinais de fim de vida",
    "Iluminância sobre o piso da rota adequada (mín. de referência 1 lux)",
    "Blocos autônomos com lâmpada-piloto de carga acesa",
  ]},
  "Porta Corta-Fogo": {norma:"NBR 11742", itens:[
    "Fechamento automático completo (mola) sem necessidade de empurrar",
    "Folga inferior e vedações (selo intumescente) íntegras",
    "Maçaneta/barra antipânico operando pelo lado interno",
    "Sem calços, cunhas ou amarrações mantendo a porta aberta",
    "Dobradiças e ferragens lubrificadas e firmes (NBR 13768)",
    "Etiqueta de identificação/resistência ao fogo presente",
  ]},
  "GLP — Central de Gás": {norma:"NBR 13523 / NBR 15526", itens:[
    "Central ventilada, sinalizada e com acesso restrito",
    "Reguladores e válvulas sem vazamento (teste de bolha)",
    "Teste de estanqueidade da rede registrado (anual)",
    "Extintor de incêndio próximo e desobstruído",
    "Tubulação aparente protegida e pintada/identificada",
    "Distâncias de segurança a fontes de ignição respeitadas",
  ]},
  "Cobertura e Impermeabilização": {norma:"NBR 9575 / NBR 5674", itens:[
    "Telhas/calhas sem trincas, deslocamento ou entupimento",
    "Sistema de impermeabilização sem bolhas, fissuras ou descolamento",
    "Rufos, pingadeiras e juntas de dilatação íntegros",
    "Ralos e condutores pluviais desobstruídos",
    "Ausência de infiltração nas lajes/forros abaixo",
    "Acesso à cobertura seguro (NR-35) com pontos de ancoragem",
  ]},
};

/* ---------- 6. NOTAS RÁPIDAS DE REFERÊNCIA ---------- */
const NOTAS = [
  {tit:"Queda de tensão (NBR 5410, 6.2.7)", txt:"Limites usuais: até 4 % em circuitos terminais e até 7 % desde a origem da instalação (medição ou secundário do trafo). Confirmar a condição de alimentação no item 6.2.7."},
  {tit:"Seções mínimas (NBR 5410, Tab. 47)", txt:"Iluminação 1,5 mm²; tomadas/força 2,5 mm²; comando/sinalização 0,5 mm² (cobre)."},
  {tit:"Iluminação de emergência (NBR 10898)", txt:"Autonomia mínima de 1 h; deve cobrir rotas de fuga, escadas e equipamentos de combate; acionamento automático na falha da rede."},
  {tit:"SPDA (NBR 5419-2)", txt:"A necessidade de SPDA decorre da análise de risco R1 ≤ 10⁻⁵. O cálculo de Nd nesta ferramenta é triagem; a decisão final exige a avaliação completa da Parte 2."},
  {tit:"Termografia de quadros (NBR 5410)", txt:"Inspeção termográfica anual recomendada para identificar pontos quentes em conexões e proteções."},
];
