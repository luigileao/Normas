/* ct017.js — dados do Contrato TJMG CT 017/2026 (RENOVA ENGENHARIA).
   Fonte: Contrato 017/2026 (SEI 0013215-98.2026.8.13.0000) e skills de fiscalização do usuário.
   Documento público (SEI/TJMG). Modelos são esqueletos para o fiscal preencher — não substituem o ato oficial. */

const CT017 = {
  numero:'CT 017/2026 (SIAD nº 9493172)',
  sei:'0013215-98.2026.8.13.0000',
  objeto:'Serviços comuns de engenharia integrados de manutenção predial (preventiva, preditiva e corretiva) em edificações do TJMG no interior de MG. Sem dedicação exclusiva de mão de obra.',
  lei:'Lei federal nº 14.133/2021',
  origem:'Processo SISUP 835/2025 · SIAD 837/2025 · Licitação 147/2025 — Pregão Eletrônico — Lote 01',
  contratante:{nome:'Tribunal de Justiça do Estado de Minas Gerais (TJMG)',cnpj:'21.154.554/0001-13',end:'Av. Afonso Pena, 4.001 — Belo Horizonte/MG',rep:'Juiz Auxiliar da Presidência Luís Fernando de Oliveira Benfatti (Portaria TJMG 6.626/PR/2024)'},
  contratada:{nome:'RENOVA ENGENHARIA LTDA',cnpj:'16.792.884/0001-02',end:'Av. Gov. José de Magalhães Pinto, 390 — Tiradentes — Ituiutaba/MG — CEP 38.301-135',rep:'Sócio Fernando Gouveia de Morais Carvalho'},
  lote:'Lote 1 — Região Norte (Polos: Montes Claros, Teófilo Otoni, Paracatu)',
  valorTotal:14702057.33,
  valorAnual:4900685.78,
  garantia:245034.28,
  bdi:'23,22%',
  vigencia:'36 meses a partir da publicação no PNCP (assinado em 28/01/2026); prorrogável até 10 anos',
  regime:'Empreitada por preço unitário',
  dataBase:'09/10/2025',
  reajuste:'IPCA após 12 meses da data-base',
  dotacao:'4031.02.061.706.2091.3.3.90.39.22',
  gestao:'GEMAP (Gerência de Manutenção Predial), vinculada à DENGEP. Seguro à DIRFIN, com cópia à GEMAP.',
  emails:{gemap:'gemap@tjmg.jus.br',cofis:'cofis@tjmg.jus.br'},
};

/* Tipos de serviço */
const CT017_SERVICOS = [
  {c:'MP',n:'Manutenções Periódicas',planilha:'Item 2.0'},
  {c:'API',n:'Atendimentos Periódicos Intermediários',planilha:'Item 2.0'},
  {c:'ACE',n:'Atendimentos Corretivos Emergenciais',planilha:'Item 3.0'},
  {c:'ITP',n:'Intervenções Técnicas Programadas',planilha:'Item 4.0'},
  {c:'SEC',n:'Serviços Especializados Complementares',planilha:'Item 5.0'},
  {c:'MAT',n:'Materiais, Peças e Componentes',planilha:'Anexo H'},
  {c:'TRP',n:'Transporte',planilha:'Item 7.0'},
];

/* Periodicidade por grupo */
const CT017_PERIODICIDADE = [
  {g:'Grupo A',mp:'A cada 3 meses',api:'Mensalmente (API entre as MP)'},
  {g:'Grupo B',mp:'A cada 3 meses',api:'Não se aplica'},
  {g:'Grupo C',mp:'A cada 6 meses',api:'Não se aplica'},
];

/* Prazos de relatórios */
const CT017_RELATORIOS = [
  {d:'Relatório de Manutenção Periódica (RITMP)',p:'Até o 3º dia útil do mês subsequente'},
  {d:'Ficha de Atendimento Periódico Intermediário',p:'Até o 3º dia útil do mês subsequente'},
  {d:'Relatório de Atendimento Corretivo Emergencial',p:'Até o 3º dia útil após a conclusão'},
  {d:'Relatório de Intervenção Técnica Programada',p:'Até o 3º dia útil após a conclusão'},
];
const CT017_RELATORIO_REQ = 'PDF, assinado digitalmente (certificação válida), nomes legíveis e CREA/MG dos responsáveis técnicos.';

/* Prazos de atendimento emergencial (ACE) */
const CT017_EMERGENCIAL = {
  polo:{corte:12,texto:'Cidade Polo: chamado até 12h00 → concluir até 24h00 do mesmo dia; após 12h00 → até 12h00 do dia seguinte.'},
  demais:{corte:10,texto:'Demais Comarcas: chamado até 10h00 → concluir até 24h00 do mesmo dia; após 10h00 → até 12h00 do dia seguinte.'},
};

/* Penalidades (base: valor anual ≈ R$ 4.900.685,78; total R$ 14.702.057,33) */
const CT017_PENALIDADES = [
  {id:'gar',nome:'Atraso na apresentação/reposição de garantia',tipo:'Moratória',base:'anual',modo:'dia',pct:0.01,pctMax:0.01,capDias:30,nota:'0,01%/dia, limitado a 30 dias, sobre o valor anual.'},
  {id:'doc',nome:'Descumprimento de obrigação documental',tipo:'Moratória',base:'anual',modo:'evento',pct:0.01,pctMax:0.01,nota:'Até 0,01% por inadimplemento, sobre o valor anual.'},
  {id:'atr',nome:'Atraso >30 dias na conclusão de MP/API/ACE/ITP',tipo:'Moratória',base:'anual',modo:'evento',pct:0.1,pctMax:0.1,nota:'Até 0,1% por evento, sobre o valor anual.'},
  {id:'inex',nome:'Inexecução total / extinção por culpa da contratada',tipo:'Compensatória',base:'total',modo:'unico',pct:0.5,pctMax:30,nota:'De 0,5% a 30% sobre o valor total do contrato.'},
  {id:'dem',nome:'Demais infrações contratuais',tipo:'Compensatória',base:'anual',modo:'unico',pct:1,pctMax:3,nota:'Até 3% sobre o valor anual.'},
];

/* 8 tipos de documento oficial */
const CT017_DOCS = [
  {c:'NOT-INA',n:'Notificação de Inadimplemento',q:'Descumprimento de prazo, ausência de relatório, profissional inadequado, obrigação não cumprida.'},
  {c:'NOT-PEN',n:'Notificação de Penalidade c/ Abertura de Prazo de Defesa',q:'Infração configurada; abre prazo de defesa prévia antes de aplicar multa.'},
  {c:'COM-PEN',n:'Comunicado de Aplicação de Penalidade',q:'Após defesa (ou decurso do prazo) — formaliza a multa.'},
  {c:'ROC',n:'Relatório de Ocorrência Contratual',q:'Registro formal para instruir o processo SEI.'},
  {c:'PTF',n:'Parecer Técnico de Fiscalização',q:'Documento técnico do fiscal embasando decisão (aprovar/rejeitar/ITP).'},
  {c:'OFI-GES',n:'Ofício à Gestão (GEMAP/DENGEP)',q:'Escalar problema grave / solicitar providências.'},
  {c:'DES-SEI',n:'Despacho de Instrução Processual',q:'Orientar próximos passos no SEI / encaminhar documentos.'},
  {c:'COM-DEF',n:'Comunicado de Recebimento de Defesa',q:'Acusa recebimento da defesa e informa prazo de análise.'},
];

/* Pronomes de tratamento (e-mail) */
const CT017_TRATAMENTO = [
  {d:'Desembargador(a)',pron:'Vossa Excelência (V. Ex.ª)',voc:'Excelentíssimo(a) Senhor(a) Desembargador(a)'},
  {d:'Juiz(a) de Direito',pron:'Vossa Excelência (V. Ex.ª)',voc:'Excelentíssimo(a) Senhor(a) Juiz(íza)'},
  {d:'Diretor(a) do Fórum (Juiz)',pron:'Vossa Excelência (V. Ex.ª)',voc:'Excelentíssimo(a) Senhor(a) Juiz(íza) Diretor(a)'},
  {d:'Servidor / Fiscal',pron:'Vossa Senhoria (V. S.ª)',voc:'Prezado(a) Senhor(a)'},
  {d:'Gestor / Coordenador',pron:'Vossa Senhoria (V. S.ª)',voc:'Prezado(a) Senhor(a)'},
  {d:'RENOVA (preposto)',pron:'Vossa Senhoria (V. S.ª)',voc:'Prezados Senhores'},
];

/* Catálogo de textos-padrão do SEI (referência de qual modelo usar) */
const CT017_TEXTOS = [
  {c:'O_C_05',t:'Carga elétrica DISPONÍVEL para ar-condicionado'},
  {c:'O_C_06',t:'Carga elétrica LIMITADA para ar-condicionado'},
  {c:'O_C_07',t:'Carga elétrica INDISPONÍVEL para ar-condicionado'},
  {c:'O_C_08',t:'Diretrizes para novos pontos de ar-condicionado'},
  {c:'O_C_09',t:'Ligação indevida de aparelhos de ar'},
  {c:'O_C_10',t:'Obstrução de quadros elétricos'},
  {c:'O_C_11',t:'Copa/cozinha — solicitação (indeferir)'},
  {c:'O_C_12',t:'Copa/cozinha — utilização liberada'},
  {c:'O_C_13',t:'Descarte de lâmpadas'},
  {c:'O_C_14',t:'Verba de pronto pagamento'},
  {c:'O_C_15',t:'Filtros de linha / extensões / adaptadores'},
  {c:'O_C_16',t:'Uso inadequado de salas técnicas'},
  {c:'O_C_18',t:'Instalação de extintores'},
  {c:'O_C_20',t:'Antenas na cobertura'},
  {c:'O_C_24',t:'Uso inadequado da sala CPD'},
  {c:'O_C_27',t:'Isolamento de área de risco'},
  {c:'O_C_28',t:'Infiltração em áreas de prédios'},
  {c:'O_C_29',t:'Cuidados em períodos de chuvas'},
  {c:'O_C_30',t:'Bebedouros dentro de salas de trabalho'},
  {c:'O_C_01',t:'Abertura de OSE após chamado da comarca'},
  {c:'O_C_02',t:'Abertura de OSE após vistoria técnica'},
  {c:'O_C_03',t:'Abertura de OSP/OSS após chamado da comarca'},
  {c:'O_C_04',t:'Abertura de OSP/OSS após vistoria técnica'},
  {c:'S_C_01',t:'Solicitação de acréscimo de pontos (comarca)'},
];
const CT017_PORTARIAS = 'Portaria Conjunta 618/PR/2017 (copa/cozinha) · Portaria 3102/PR/2014 (verba de pronto pagamento) · Portaria 1529/2024. Confirme sempre a vigência.';
