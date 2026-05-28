/* ============ app.js — lógica do aplicativo ============ */

const $ = s => document.querySelector(s);
const el = $('#app');
let stack = [];

/* ---------- navegação ---------- */
function go(fn, label){ stack.push({fn,label}); render(); }
function back(){ if(stack.length>1){ stack.pop(); render(); } }
function nav(fn){ stack=[{fn}]; render(); setActiveTab(fn.name); }
function render(){ const top=stack[stack.length-1]; el.scrollTo?.(0,0); window.scrollTo(0,0); el.innerHTML=''; top.fn(); }
function backBtn(){ const b=document.createElement('button'); b.className='back'; b.textContent='← Voltar'; b.onclick=back; el.appendChild(b); }

function setActiveTab(name){
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on', b.dataset.t===name));
}

/* helper de construção */
function h(html){ const d=document.createElement('div'); d.innerHTML=html; while(d.firstChild) el.appendChild(d.firstChild); }
function fmt(n,d=2){ return Number(n).toLocaleString('pt-BR',{maximumFractionDigits:d,minimumFractionDigits:0}); }

/* ============ HOME ============ */
function Home(){
  h(`<h2 class="title">Engenharia Elétrica & Predial</h2>
     <p class="sub">Cálculos, dimensionamento e quantitativos — uso offline.</p>
     <div class="grid">
       <div class="card" data-go="Calculos"><span class="ic">⚡</span><h3>Elétrica</h3><p>Corrente, demanda, condutor, FP, curto, SPDA…</p></div>
       <div class="card" data-go="CivilMat"><span class="ic">🧱</span><h3>Civil & Materiais</h3><p>Pintura, piso, alvenaria, reboco</p></div>
       <div class="card" data-go="Hidro"><span class="ic">🚿</span><h3>Hidrossanitário</h3><p>Reservatório, consumo, declividade</p></div>
       <div class="card" data-go="SpdaMenu"><span class="ic">🌩️</span><h3>SPDA</h3><p>Risco, captação e descidas</p></div>
       <div class="card" data-go="Foto"><span class="ic">📷</span><h3>Régua na foto</h3><p>Medir distância e área na imagem</p></div>
       <div class="card" data-go="Meus"><span class="ic">💾</span><h3>Meus Cálculos</h3><p>Salvos e sincronizados</p></div>
       <div class="card" data-go="Biblioteca"><span class="ic">📚</span><h3>Normas</h3><p>NBR / CEMIG / NR</p></div>
       <div class="card" data-go="Guia"><span class="ic">📘</span><h3>Guia por sistema</h3><p>Requisitos-chave das normas</p></div>
       <div class="card" data-go="Checklists"><span class="ic">✓</span><h3>Vistoria</h3><p>Checklists por sistema</p></div>
       <div class="card" data-go="Prazos"><span class="ic">📅</span><h3>Prazos</h3><p>Periodicidades</p></div>
     </div>
     <p class="disc">Apoio à engenharia/fiscalização. Valores consolidados de engenharia — não substituem projeto, ART nem o texto oficial das normas vigentes.</p>`);
  const map={Calculos,CivilMat,Hidro,SpdaMenu,Foto:FotoRegua,Meus:MeusCalculos,Biblioteca,Guia:GuiaNormas,Checklists,Prazos,Notas};
  el.querySelectorAll('[data-go]').forEach(c=>c.onclick=()=>nav(map[c.dataset.go]));
}

/* ============ BIBLIOTECA DE NORMAS ============ */
function Biblioteca(){
  const sistemas=['Todos',...new Set(NORMAS.map(n=>n.sis))];
  h(`<h2 class="title">Biblioteca de Normas</h2><p class="sub">${NORMAS.length} normas · busque ou filtre por sistema.</p>
     <input class="search" id="bq" placeholder="Buscar (ex.: SPDA, hidrante, iluminação)…">
     <div class="filters" id="bf"></div><div id="blist"></div>`);
  const bf=$('#bf'); let filtro='Todos';
  sistemas.forEach(s=>{const b=document.createElement('button');b.textContent=s;if(s==='Todos')b.classList.add('on');b.onclick=()=>{filtro=s;bf.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));draw();};bf.appendChild(b);});
  function draw(){
    const q=$('#bq').value.toLowerCase();
    const list=NORMAS.filter(n=>(filtro==='Todos'||n.sis===filtro)&&(`${n.n} ${n.t} ${n.ap} ${n.sis}`.toLowerCase().includes(q)));
    $('#blist').innerHTML=list.length?list.map(n=>`<div class="item"><span class="chip">${n.sis}</span>
      <div class="nm cite">${n.n}</div><div class="ti">${n.t}</div><div class="ap">${n.ap}</div></div>`).join(''):`<p class="sub">Nada encontrado.</p>`;
  }
  $('#bq').oninput=draw; draw();
}

/* ============ MENU DE CÁLCULOS ============ */
function Calculos(){
  h(`<h2 class="title">⚡ Elétrica</h2><p class="sub">Selecione o cálculo a executar.</p>
     <div class="grid">
       <div class="card" data-c="Circuito"><span class="ic">🧩</span><h3>Dimensionar circuito</h3><p>NBR 5410 completo: condutor + disjuntor + queda + duto</p></div>
       <div class="card" data-c="Corrente"><span class="ic">🔋</span><h3>Corrente / Potência</h3><p>I, P e kVA · mono/trifásico</p></div>
       <div class="card" data-c="Demanda"><span class="ic">📊</span><h3>Demanda (CEMIG)</h3><p>ND-5.2 · D = a+b+c+d+e+f</p></div>
       <div class="card" data-c="Lux"><span class="ic">💡</span><h3>Iluminância</h3><p>NBR ISO/CIE 8995-1 · lux e luminárias</p></div>
       <div class="card" data-c="Queda"><span class="ic">⚡</span><h3>Queda de tensão</h3><p>NBR 5410 · com reatância</p></div>
       <div class="card" data-c="Condutor"><span class="ic">🔌</span><h3>Condutor (ampacidade)</h3><p>Métodos B1/B2/C/D</p></div>
       <div class="card" data-c="Eletroduto"><span class="ic">🪈</span><h3>Eletroduto</h3><p>Taxa de ocupação</p></div>
       <div class="card" data-c="FP"><span class="ic">⚙️</span><h3>Fator de potência</h3><p>Banco de capacitores (kvar)</p></div>
       <div class="card" data-c="Curto"><span class="ic">💥</span><h3>Curto-circuito</h3><p>Icc no secundário do trafo</p></div>
       <div class="card" data-c="Quadro"><span class="ic">🗂️</span><h3>Quadro de cargas</h3><p>Soma e balanceamento de fases</p></div>
       <div class="card" data-c="Utils"><span class="ic">🔧</span><h3>Conversões</h3><p>AWG↔mm², kW/CV/HP</p></div>
       <div class="card" data-c="Meus"><span class="ic">💾</span><h3>Meus Cálculos</h3><p>Salvos · sincroniza com Supabase</p></div>
     </div>`);
  const map={Circuito:CalcCircuito,Corrente:CalcCorrente,Demanda:CalcDemanda,Lux:CalcLux,Queda:CalcQueda,Condutor:CalcCondutor,Eletroduto:CalcEletroduto,FP:CalcFP,Curto:CalcCurto,Quadro:CalcQuadro,Utils:Utils,Meus:MeusCalculos};
  el.querySelectorAll('[data-c]').forEach(c=>c.onclick=()=>go(map[c.dataset.c]));
}

/* ---- Iluminância ---- */
function CalcLux(){
  backBtn();
  h(`<h2 class="title">💡 Iluminância</h2><p class="sub cite">NBR ISO/CIE 8995-1:2013</p>
     <div class="box"><label>Ambiente (preenche o lux exigido)</label>
       <select id="amb"><option value="">— escolher —</option>${ILUMINANCIA.map((a,i)=>`<option value="${a.lux}">${a.amb} · ${a.lux} lux</option>`).join('')}</select>
       <label>Iluminância exigida — Em (lux)</label><input id="lux" type="number" placeholder="500" value="500">
       <label>Área do ambiente (m²)</label><input id="area" type="number" placeholder="ex.: 20">
       <div class="row"><div><label>Fluxo por luminária (lm)</label><input id="flux" type="number" placeholder="ex.: 4000"></div>
       <div><label>Nº de lâmpadas / luminária</label><input id="nlmp" type="number" value="1"></div></div>
       <div class="row"><div><label>Fator de utilização (Fu)</label><input id="fu" type="number" step="0.05" value="0.6"></div>
       <div><label>Fator de manutenção (Fm)</label><input id="fm" type="number" step="0.05" value="0.8"></div></div>
       <button class="btn" id="run">Calcular nº de luminárias</button>
       <div id="res"></div>
       <p class="hint">Método dos lúmens: N = (Em × Área) ÷ (Φ × n × Fu × Fm). Fu depende de refletâncias e índice do recinto; Fm típico 0,7–0,8.</p>
     </div>`);
  $('#amb').onchange=e=>{ if(e.target.value) $('#lux').value=e.target.value; };
  $('#run').onclick=()=>{
    const E=+$('#lux').value,A=+$('#area').value,F=+$('#flux').value,n=+$('#nlmp').value||1,fu=+$('#fu').value,fm=+$('#fm').value;
    if(!(E&&A&&F&&fu&&fm)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha Em, área, fluxo, Fu e Fm.</span></div>`;
    const N=(E*A)/(F*n*fu*fm); const Nr=Math.ceil(N);
    const Ereal=(Nr*F*n*fu*fm)/A;
    $('#res').innerHTML=`<div class="result"><span class="lab">Luminárias necessárias</span>
      <div class="big">${Nr}</div>
      <div class="hint">Valor exato ${fmt(N,1)} → arredondado para ${Nr}.<br>
      Com ${Nr} luminárias a iluminância média estimada é <b>${fmt(Ereal,0)} lux</b> (exigido ${fmt(E,0)}).</div>
      <span class="tag ${Ereal>=E?'ok':'bad'}">${Ereal>=E?'Atende ao mínimo':'Abaixo do exigido'}</span></div>`;
    addSave('Iluminância',`${Nr} luminárias · ${fmt(Ereal,0)} lux`,{E,A,F,n,fu,fm},{N:Nr,Ereal});
  };
  // tabela de referência
  h(`<div class="box"><label>Tabela de referência — iluminância mantida</label>
     <table><tr><th>Ambiente</th><th style="text-align:right">lux</th></tr>
     ${ILUMINANCIA.map(a=>`<tr><td>${a.amb}</td><td class="num">${a.lux}</td></tr>`).join('')}</table></div>`);
}

/* ---- Queda de tensão ---- */
function CalcQueda(){
  backBtn();
  h(`<h2 class="title">⚡ Queda de tensão</h2><p class="sub cite">NBR 5410 · 6.2.7</p>
     <div class="box">
       <div class="row"><div><label>Sistema</label><select id="sis"><option value="1">Monofásico</option><option value="3">Trifásico</option></select></div>
       <div><label>Material</label><select id="mat"><option value="0.0179">Cobre</option><option value="0.0282">Alumínio</option></select></div></div>
       <label>Tensão (V)</label><input id="v" type="number" value="220">
       <label>Corrente — I (A)</label><input id="i" type="number" placeholder="ex.: 20">
       <label>Comprimento — L (m)</label><input id="l" type="number" placeholder="ex.: 35">
       <label>Seção — S (mm²)</label><input id="s" type="number" placeholder="ex.: 4">
       <div class="row"><div><label>Fator de potência (cos φ)</label><input id="fp" type="number" step="0.01" value="0.92"></div>
       <div><label>Reatância X (Ω/km) — opcional</label><input id="x" type="number" step="0.01" placeholder="0"></div></div>
       <label>Limite admissível (%)</label><select id="lim"><option value="4">4 % — circuito terminal</option><option value="7">7 % — desde a origem</option></select>
       <button class="btn" id="run">Calcular queda</button><div id="res"></div>
       <p class="hint">Sem X: ΔV = k·ρ·L·I÷S. Com X: ΔV = k·(L/1000)·I·(R·cosφ + X·senφ), R=ρ·1000/S (Ω/km). k=2 (mono) ou √3 (tri).</p>
     </div>`);
  $('#run').onclick=()=>{
    const k=$('#sis').value==='3'?Math.sqrt(3):2, rho=+$('#mat').value, V=+$('#v').value,I=+$('#i').value,L=+$('#l').value,S=+$('#s').value,lim=+$('#lim').value,fp=+$('#fp').value||1,X=+$('#x').value||0;
    if(!(V&&I&&L&&S)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha tensão, corrente, comprimento e seção.</span></div>`;
    let dv;
    if(X>0){ const R=rho*1000/S, sen=Math.sqrt(Math.max(0,1-fp*fp)); dv=k*(L/1000)*I*(R*fp + X*sen); }
    else { dv=(k*rho*L*I)/S; }
    const pc=(dv/V)*100, ok=pc<=lim;
    $('#res').innerHTML=`<div class="result" style="border-left-color:${ok?'var(--green)':'var(--red)'}">
      <span class="lab">Queda de tensão</span>
      <div class="big ${ok?'ok':'bad'}">${fmt(pc,2)} %</div>
      <div class="hint">ΔV = ${fmt(dv,2)} V · tensão no ponto ≈ ${fmt(V-dv,1)} V${X>0?' · com reatância':''}</div>
      <span class="tag ${ok?'ok':'bad'}">${ok?'Dentro do limite de '+lim+'%':'Acima do limite de '+lim+'% — aumentar seção'}</span></div>`;
    addSave('Queda de tensão',`${fmt(pc,2)}% · ${S}mm² · ${L}m`,{V,I,L,S,fp,X,sis:$('#sis').value,lim},{pc,dv});
  };
}

/* ---- Condutor / ampacidade (B1/B2/C/D) ---- */
function CalcCondutor(){
  backBtn();
  const secoes=Object.keys(AMPACIDADE_METODOS).map(Number);
  h(`<h2 class="title">🔌 Dimensionamento de condutor</h2><p class="sub cite">NBR 5410 · cobre/PVC · 3 carregados · 30 °C</p>
     <div class="box">
       <label>Corrente de projeto — I<sub>B</sub> (A)</label><input id="i" type="number" placeholder="ex.: 38">
       <label>Método de instalação</label><select id="m">${Object.entries(METODO_DESC).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select>
       <div class="row"><div><label>Fator temperatura</label><input id="ft" type="number" step="0.01" value="1"></div>
       <div><label>Fator agrupamento</label><input id="fa" type="number" step="0.01" value="1"></div></div>
       <button class="btn" id="run">Encontrar seção mínima</button><div id="res"></div>
       <p class="hint">I'z = I<sub>B</sub> ÷ (Ft·Fa). Seleciona a menor seção cuja capacidade ≥ I'z. Critério de capacidade apenas — verificar queda de tensão e proteção.</p>
     </div>
     <div class="box"><label>Seções mínimas por uso</label><table><tr><th>Uso</th><th>Seção</th></tr>
       ${SECOES_MINIMAS.map(x=>`<tr><td>${x.uso}</td><td class="cite">${x.sec}</td></tr>`).join('')}</table></div>
     <div class="box"><label>Capacidade de condução (A)</label><table><tr><th>mm²</th><th style="text-align:right">B1</th><th style="text-align:right">B2</th><th style="text-align:right">C</th><th style="text-align:right">D</th></tr>
       ${secoes.map(s=>{const a=AMPACIDADE_METODOS[s];return `<tr><td class="cite">${fmt(s,1)}</td><td class="num">${a.B1}</td><td class="num">${a.B2}</td><td class="num">${a.C}</td><td class="num">${a.D}</td></tr>`;}).join('')}</table></div>`);
  $('#run').onclick=()=>{
    const I=+$('#i').value, m=$('#m').value, ft=+$('#ft').value||1, fa=+$('#fa').value||1;
    if(!I) return $('#res').innerHTML=`<div class="result"><span class="lab">Informe a corrente de projeto.</span></div>`;
    const Iz=I/(ft*fa);
    const sec=secoes.find(s=>AMPACIDADE_METODOS[s][m]>=Iz);
    $('#res').innerHTML=sec?`<div class="result"><span class="lab">Seção mínima (capacidade)</span>
      <div class="big">${fmt(sec,1)} mm²</div>
      <div class="hint">Método ${m} · I'z = ${fmt(Iz,1)} A · capacidade = ${AMPACIDADE_METODOS[sec][m]} A.</div></div>`
      :`<div class="result" style="border-left-color:var(--red)"><span class="lab bad">Acima de 240 mm²</span>
      <div class="hint">I'z = ${fmt(Iz,1)} A excede a tabela. Reavaliar método ou usar condutores em paralelo.</div></div>`;
    if(sec) addSave('Condutor',`${fmt(sec,1)} mm² · método ${m} · I'z ${fmt(Iz,1)} A`,{I,metodo:m,ft,fa},{sec,Iz,capacidade:AMPACIDADE_METODOS[sec][m]});
  };
}

/* ---- Fator de potência ---- */
function CalcFP(){
  backBtn();
  h(`<h2 class="title">⚙️ Correção de fator de potência</h2><p class="sub">Banco de capacitores (kvar).</p>
     <div class="box">
       <label>Potência ativa — P (kW)</label><input id="p" type="number" placeholder="ex.: 100">
       <div class="row"><div><label>cos φ atual</label><input id="f1" type="number" step="0.01" value="0.80"></div>
       <div><label>cos φ desejado</label><input id="f2" type="number" step="0.01" value="0.92"></div></div>
       <button class="btn" id="run">Calcular capacitores</button><div id="res"></div>
       <p class="hint">Q<sub>c</sub> = P·(tg φ₁ − tg φ₂). Referência usual de FP mínimo: 0,92 (Resolução ANEEL).</p>
     </div>`);
  $('#run').onclick=()=>{
    const P=+$('#p').value,f1=+$('#f1').value,f2=+$('#f2').value;
    if(!(P&&f1&&f2)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha P e os fatores.</span></div>`;
    const t1=Math.tan(Math.acos(f1)), t2=Math.tan(Math.acos(f2)), Qc=P*(t1-t2);
    $('#res').innerHTML=`<div class="result"><span class="lab">Potência reativa a instalar</span>
      <div class="big">${fmt(Qc,1)} kvar</div>
      <div class="hint">De cos φ ${f1} para ${f2}. Reativo antes ≈ ${fmt(P*t1,1)} kvar · depois ≈ ${fmt(P*t2,1)} kvar.</div>
      <span class="tag ${f2>=0.92?'ok':'bad'}">${f2>=0.92?'Atinge FP ≥ 0,92':'Abaixo de 0,92'}</span></div>`;
    addSave('Fator de potência',`${fmt(Qc,1)} kvar · ${f1}→${f2}`,{P,f1,f2},{Qc});
  };
}

/* ---- Curto-circuito (secundário do trafo) ---- */
function CalcCurto(){
  backBtn();
  h(`<h2 class="title">💥 Curto-circuito presumido</h2><p class="sub">Icc no secundário do transformador (simplificado).</p>
     <div class="box">
       <label>Potência do trafo — S (kVA)</label><input id="s" type="number" placeholder="ex.: 300">
       <label>Tensão de linha secundária (V)</label><input id="v" type="number" value="220">
       <label>Impedância percentual — Z (%)</label><input id="z" type="number" step="0.1" value="4.5">
       <button class="btn" id="run">Calcular Icc</button><div id="res"></div>
       <p class="hint">I<sub>nom</sub> = S·1000÷(√3·V) · I<sub>cc</sub> = I<sub>nom</sub>÷(Z%/100). Simplificado: considera só a impedância do trafo (fonte infinita), ignora cabos e rede — valor a favor da segurança para escolha de disjuntor.</p>
     </div>`);
  $('#run').onclick=()=>{
    const S=+$('#s').value,V=+$('#v').value,Z=+$('#z').value;
    if(!(S&&V&&Z)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha S, V e Z%.</span></div>`;
    const Inom=S*1000/(Math.sqrt(3)*V), Icc=Inom/(Z/100);
    $('#res').innerHTML=`<div class="result"><span class="lab">Corrente de curto presumida</span>
      <div class="big">${fmt(Icc/1000,1)} kA</div>
      <div class="hint">I nominal ≈ ${fmt(Inom,0)} A · Icc ≈ ${fmt(Icc,0)} A. Disjuntor/quadro deve ter Icu ≥ esse valor.</div></div>`;
    addSave('Curto-circuito',`Icc ${fmt(Icc/1000,1)} kA · ${S}kVA`,{S,V,Z},{Icc,Inom});
  };
}

/* ---- SPDA triagem ---- */
function CalcSpda(){
  backBtn();
  h(`<h2 class="title">🌩️ SPDA — triagem de exposição</h2><p class="sub cite">NBR 5419-2:2015</p>
     <div class="box">
       <div class="row"><div><label>Comprimento L (m)</label><input id="L" type="number" placeholder="ex.: 40"></div>
       <div><label>Largura W (m)</label><input id="W" type="number" placeholder="ex.: 20"></div></div>
       <label>Altura H (m)</label><input id="H" type="number" placeholder="ex.: 12">
       <label>Densidade de descargas N<sub>g</sub> (1/km²/ano)</label><input id="Ng" type="number" step="0.1" value="8">
       <label>Fator de localização C<sub>d</sub></label><select id="Cd">
         <option value="0.25">Cercada por objetos mais altos (0,25)</option>
         <option value="0.5">Cercada por objetos da mesma altura (0,5)</option>
         <option value="1" selected>Isolada, sem objetos próximos (1,0)</option>
         <option value="2">Isolada no topo de morro (2,0)</option></select>
       <button class="btn" id="run">Calcular</button><div id="res"></div>
       <p class="hint">A<sub>d</sub> = L·W + 2·(3H)(L+W) + π·(3H)² · N<sub>d</sub> = N<sub>g</sub>·A<sub>d</sub>·C<sub>d</sub>·10⁻⁶. Triagem da frequência de descargas diretas. A decisão sobre instalar SPDA exige a análise de risco R1 ≤ 10⁻⁵ completa (Parte 2).</p>
     </div>`);
  $('#run').onclick=()=>{
    const L=+$('#L').value,W=+$('#W').value,H=+$('#H').value,Ng=+$('#Ng').value,Cd=+$('#Cd').value;
    if(!(L&&W&&H&&Ng)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha L, W, H e Ng.</span></div>`;
    const Ad=L*W+2*(3*H)*(L+W)+Math.PI*Math.pow(3*H,2);
    const Nd=Ng*Ad*Cd*1e-6;
    const Nc=1e-3; const precisa=Nd>Nc;
    $('#res').innerHTML=`<div class="result">
      <span class="lab">Área de exposição equivalente A<sub>d</sub></span>
      <div class="big">${fmt(Ad,0)} m²</div>
      <div class="hint" style="margin-top:8px"><b>N<sub>d</sub> = ${Nd.toExponential(2)}</b> descargas/ano.</div>
      <span class="tag ${precisa?'bad':'ok'}">${precisa?'N_d acima de 10⁻³ — exige análise de risco R1':'N_d baixo — confirmar com análise de risco R1'}</span>
      <div class="hint">Triagem apenas. A obrigatoriedade do SPDA depende de R1 ≤ 10⁻⁵ (NBR 5419-2), considerando perdas, ocupação e medidas de proteção.</div></div>`;
    addSave('SPDA',`Ad ${fmt(Ad,0)} m² · Nd ${Nd.toExponential(2)}`,{L,W,H,Ng,Cd},{Ad,Nd});
  };
}

/* ---- helper: botão Salvar (Supabase) ---- */
function toast(msg){
  let t=$('#toast'); if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);
    t.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:var(--panel);border:1px solid var(--line);color:var(--txt);padding:10px 16px;border-radius:10px;z-index:100;font-size:13px;box-shadow:0 6px 20px rgba(0,0,0,.4);max-width:88%;text-align:center';}
  t.textContent=msg; t.style.opacity='1'; clearTimeout(t._t); t._t=setTimeout(()=>t.style.opacity='0',2600);
}
const NORMA_DE={Iluminância:'NBR ISO/CIE 8995-1',"Queda de tensão":'NBR 5410 (6.2.7)',Condutor:'NBR 5410 (Tab. 36/37)',Eletroduto:'NBR 5410',SPDA:'NBR 5419-2',Corrente:'P=√3·V·I·cosφ',Demanda:'CEMIG ND-5.2','Fator de potência':'Correção de FP','Curto-circuito':'Icc no secundário'};
function fmtVal(v){ if(typeof v==='number') return fmt(v,2); if(typeof v==='boolean') return v?'sim':'não'; return v??'—'; }
function relatorio(reg){
  const ent=Object.entries(reg.entradas||{}).map(([k,v])=>`<tr><td>${k}</td><td>${fmtVal(v)}</td></tr>`).join('');
  const res=Object.entries(reg.resultado||{}).map(([k,v])=>`<tr><td>${k}</td><td><b>${fmtVal(v)}</b></td></tr>`).join('');
  let r=$('#report'); if(!r){r=document.createElement('div');r.id='report';document.body.appendChild(r);}
  r.innerHTML=`<div class="rpt">
    <h1>Memorial de Cálculo</h1>
    <p class="rmeta">${reg.tipo} · ${NORMA_DE[reg.tipo]||''}<br>${reg.titulo||''}<br>
    Emitido em ${new Date(reg.updated_at||Date.now()).toLocaleString('pt-BR')}${currentUser&&currentUser()?(' · '+currentUser()):''}</p>
    <h2>Dados de entrada</h2><table>${ent||'<tr><td>—</td></tr>'}</table>
    <h2>Resultado</h2><table>${res||'<tr><td>—</td></tr>'}</table>
    <p class="rnote">Triagem de engenharia conforme valores consolidados. Não substitui projeto, ART nem o texto oficial da norma vigente.</p>
  </div>`;
  document.body.classList.add('printing'); window.print();
  setTimeout(()=>document.body.classList.remove('printing'),400);
}
function addSave(tipo,titulo,entradas,resultado){
  el.querySelectorAll('.save-wrap').forEach(x=>x.remove());
  const wrap=document.createElement('div'); wrap.className='save-wrap'; wrap.style.cssText='display:flex;gap:10px;margin-top:10px';
  const b=document.createElement('button'); b.className='btn sec'; b.style.margin='0'; b.innerHTML='💾 Salvar';
  b.onclick=async()=>{
    salvarCalculo(tipo,titulo,entradas,resultado);
    if(!isLogged()){ toast('Salvo no aparelho. Entre na conta para sincronizar.'); atualizaPend(); return; }
    if(!navigator.onLine){ toast('Salvo no aparelho — envia ao reconectar.'); atualizaPend(); return; }
    toast('Salvando…'); const r=await sincronizar(); atualizaPend();
    toast(r.ok?'Salvo e sincronizado ✓':'Salvo no aparelho · falha no envio ('+(r.motivo||'')+')');
  };
  const p=document.createElement('button'); p.className='btn sec'; p.style.margin='0'; p.innerHTML='📄 Relatório';
  p.onclick=()=>relatorio({tipo,titulo,entradas,resultado,updated_at:new Date().toISOString()});
  wrap.appendChild(b); wrap.appendChild(p); el.appendChild(wrap);
}
function atualizaPend(){ const n=pendentes?pendentes():0; const b=$('#pend'); if(b){ b.textContent=n; b.style.display=n?'inline-block':'none'; } }

/* ---- Corrente / Potência ---- */
function CalcCorrente(){
  backBtn();
  h(`<h2 class="title">🔋 Corrente / Potência</h2><p class="sub">Relação entre P, V, I e fator de potência.</p>
     <div class="box">
       <label>Calcular</label><select id="modo"><option value="i">Corrente (a partir da potência)</option><option value="p">Potência (a partir da corrente)</option></select>
       <div class="row"><div><label>Sistema</label><select id="sis"><option value="1">Monofásico</option><option value="2">Bifásico</option><option value="3" selected>Trifásico</option></select></div>
       <div><label>Tensão (V)</label><input id="v" type="number" value="220"></div></div>
       <label id="lp">Potência (kW)</label><input id="pot" type="number" placeholder="ex.: 10">
       <label id="lcur" style="display:none">Corrente (A)</label><input id="cur" type="number" placeholder="ex.: 30" style="display:none">
       <label>Fator de potência (cos φ)</label><input id="fp" type="number" step="0.01" value="0.92">
       <button class="btn" id="run">Calcular</button><div id="res"></div>
       <p class="hint">Trifásico: P = √3·V·I·cosφ. Mono/bifásico: P = V·I·cosφ. kVA = kW ÷ cosφ.</p>
     </div>`);
  $('#modo').onchange=e=>{const p=e.target.value==='p';$('#lp').style.display=p?'none':'block';$('#pot').style.display=p?'none':'block';$('#lcur').style.display=p?'block':'none';$('#cur').style.display=p?'block':'none';};
  $('#run').onclick=()=>{
    const sis=+$('#sis').value, V=+$('#v').value, fp=+$('#fp').value||1, k=sis===3?Math.sqrt(3):1;
    let out='';
    if($('#modo').value==='i'){
      const P=+$('#pot').value*1000; if(!(P&&V)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha potência e tensão.</span></div>`;
      const I=P/(k*V*fp), kVA=(+$('#pot').value)/fp;
      out=`<div class="result"><span class="lab">Corrente</span><div class="big">${fmt(I,1)} A</div>
        <div class="hint">Potência aparente ≈ ${fmt(kVA,2)} kVA</div></div>`;
      $('#res').innerHTML=out; addSave('Corrente',`${fmt(+$('#pot').value,1)} kW → ${fmt(I,1)} A`,{sis,V,P:+$('#pot').value,fp},{I,kVA});
    }else{
      const I=+$('#cur').value; if(!(I&&V)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha corrente e tensão.</span></div>`;
      const P=k*V*I*fp/1000, kVA=k*V*I/1000;
      out=`<div class="result"><span class="lab">Potência ativa</span><div class="big">${fmt(P,2)} kW</div>
        <div class="hint">Potência aparente ≈ ${fmt(kVA,2)} kVA</div></div>`;
      $('#res').innerHTML=out; addSave('Corrente',`${fmt(I,1)} A → ${fmt(P,2)} kW`,{sis,V,I,fp},{P,kVA});
    }
  };
}

/* ---- Demanda CEMIG ---- */
function CalcDemanda(){
  backBtn();
  h(`<h2 class="title">📊 Cálculo de Demanda</h2><p class="sub cite">CEMIG ND-5.2 · D = a+b+c+d+e+f (kVA)</p>
     <div class="box">
       <label>a) Iluminação e tomadas</label>
       <select id="tipo">${CEMIG_ILUM_TOMADA.map((t,i)=>`<option value="${i}">${t.tipo}</option>`).join('')}</select>
       <label>Carga de iluminação + tomadas (kVA)</label><input id="a" type="number" placeholder="ex.: 30" value="0">
       <label>b) Aparelhos de aquecimento/refrigeração</label>
       <div class="row"><div><label>Nº de aparelhos</label><input id="bn" type="number" value="0"></div>
       <div><label>Carga total (kVA)</label><input id="bk" type="number" value="0"></div></div>
       <label>c) Condicionadores de ar</label>
       <div class="row"><div><label>Nº de aparelhos</label><input id="cn" type="number" value="0"></div>
       <div><label>Carga total (kVA)</label><input id="ck" type="number" value="0"></div></div>
       <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="ccentral" style="width:auto">Ar central (fator 100%)</label>
       <label>d) Motores elétricos (kVA, demanda já considerada)</label><input id="d" type="number" value="0">
       <label>e) Máquinas de solda (kVA, demanda)</label><input id="e" type="number" value="0">
       <label>f) Aparelhos de raios-X (kVA, demanda)</label><input id="f" type="number" value="0">
       <button class="btn" id="run">Calcular demanda</button><div id="res"></div>
       <p class="hint">a usa Tabela 14; b usa Tabela 16 (fator por nº de aparelhos); c usa Tabela 15. d/e/f: informe a demanda já apurada (regras 7.3.2). Triagem — o RT do projeto é responsável pela demanda final.</p>
     </div>`);
  $('#run').onclick=()=>{
    const ti=+$('#tipo').value, ak=+$('#a').value||0;
    const a=demIlumTomada(ak,ti);
    const bn=+$('#bn').value||0, bk=+$('#bk').value||0, b=bk*fdAparelhos(bn);
    const cn=+$('#cn').value||0, ck=+$('#ck').value||0, c=$('#ccentral').checked?ck:ck*fdArCondicionado(cn);
    const d=+$('#d').value||0, e=+$('#e').value||0, f=+$('#f').value||0;
    const D=a+b+c+d+e+f;
    const I=D*1000/(Math.sqrt(3)*220);
    const ent=entradaCemig(D);
    const dim=ent?`<div class="hint">Triagem de entrada (rede 127/220V): disjuntor ≥ <b>${ent.disj} A</b>, condutor ≥ <b>${ent.sec} mm²</b>. Confirmar tipo de fornecimento na ND vigente.</div>`
      :`<div class="hint">Demanda &gt; 95 kVA: dimensionamento por câmara/transformador — ver ND-5.2 e CEMIG.</div>`;
    $('#res').innerHTML=`<div class="result"><span class="lab">Demanda provável</span><div class="big">${fmt(D,1)} kVA</div>
      <div class="hint">Parcelas: a=${fmt(a,1)} · b=${fmt(b,1)} · c=${fmt(c,1)} · d=${fmt(d,1)} · e=${fmt(e,1)} · f=${fmt(f,1)} kVA<br>Corrente equivalente ≈ ${fmt(I,1)} A (trifásico 220 V)</div>${dim}</div>`;
    addSave('Demanda',`${fmt(D,1)} kVA — ${CEMIG_ILUM_TOMADA[ti].tipo}`,{ti,ak,bn,bk,cn,ck,central:$('#ccentral').checked,d,e,f},{D,a,b,c,I,disj:ent?.disj,sec:ent?.sec});
  };
}

/* ---- Eletroduto ---- */
function CalcEletroduto(){
  backBtn();
  // diâmetros nominais (mm) com área interna útil aproximada para eletroduto rígido
  const DUTOS=[
    {dn:'16 (1/2")',ai:120},{dn:'20 (3/4")',ai:200},{dn:'25 (1")',ai:320},
    {dn:'32 (1.1/4")',ai:530},{dn:'40 (1.1/2")',ai:830},{dn:'50 (2")',ai:1300},
    {dn:'60 (2.1/2")',ai:1900},{dn:'75 (3")',ai:2700}
  ];
  // área total ocupada por cabo (mm²) ~ por seção (inclui isolação) - referência
  const CABO={1.5:9,2.5:11,4:13,6:16,10:23,16:32,25:49,35:62,50:88,70:120,95:160,120:200,150:250,185:300,240:390};
  h(`<h2 class="title">🪈 Eletroduto</h2><p class="sub cite">NBR 5410 · taxa máx. de ocupação</p>
     <div class="box">
       <label>Seção dos condutores (mm²)</label>
       <select id="sec">${Object.keys(CABO).map(s=>`<option value="${s}">${s} mm²</option>`).join('')}</select>
       <label>Quantidade de condutores</label><input id="qtd" type="number" value="3">
       <p class="hint">Ocupação máxima: 53% (1 cabo), 31% (2 cabos), 40% (3 ou mais) — NBR 5410.</p>
       <button class="btn" id="run">Calcular eletroduto mínimo</button><div id="res"></div>
     </div>`);
  $('#run').onclick=()=>{
    const sec=+$('#sec').value, qtd=+$('#qtd').value||1;
    const areaCabos=CABO[sec]*qtd;
    const taxa=qtd===1?0.53:qtd===2?0.31:0.40;
    const sel=DUTOS.find(d=>d.ai*taxa>=areaCabos);
    $('#res').innerHTML=sel?`<div class="result"><span class="lab">Eletroduto mínimo</span>
      <div class="big">DN ${sel.dn}</div>
      <div class="hint">Área dos cabos ≈ ${areaCabos} mm² · ocupação máx ${(taxa*100)|0}% · área útil do duto ${fmt(sel.ai*taxa,0)} mm².</div></div>`
      :`<div class="result" style="border-left-color:var(--red)"><span class="lab bad">Acima de 75 mm</span><div class="hint">Use eletroduto maior, mais de um trajeto ou eletrocalha.</div></div>`;
    if(sel) addSave('Eletroduto',`${qtd}×${sec}mm² → DN ${sel.dn}`,{sec,qtd},{dn:sel.dn});
  };
}

/* ============ MEUS CÁLCULOS (Supabase) ============ */
function MeusCalculos(){
  backBtn();
  const logged=isLogged();
  h(`<h2 class="title">💾 Meus Cálculos</h2>
     <p class="sub">Salvos no aparelho${logged?' e sincronizados com o Supabase':''}.</p>
     <div class="box" id="conta"></div>
     <div class="box" id="projbox"></div>
     <div class="row"><button class="btn sec" id="sync">↻ Sincronizar agora</button></div>
     <div id="status" class="hint" style="text-align:center;margin:8px 0"></div>
     <div id="lst"></div>`);
  let filtro = currentProject();
  function conta(){
    if(isLogged()){
      $('#conta').innerHTML=`<div class="nm">👤 ${currentUser()}</div>
        <div class="ap">Pendentes de envio: <b>${pendentes()}</b></div>
        <button class="btn sec" id="logout" style="margin-top:10px">Sair</button>`;
      $('#logout').onclick=()=>{sair();MeusCalculos();};
    }else{
      $('#conta').innerHTML=`<div class="nm">Conta</div>
        <div class="ap">Sem login: os cálculos ficam só neste aparelho. Entre para sincronizar.</div>
        <button class="btn" id="login" style="margin-top:10px">Entrar / Criar conta</button>`;
      $('#login').onclick=()=>go(Conta);
    }
  }
  function projbox(){
    const ps=projetos(); const atual=currentProject();
    $('#projbox').innerHTML=`<div class="nm">🏗️ Projeto / Obra</div>
      <div class="ap">Atual: <b>${atual||'— nenhum —'}</b>. Novos cálculos entram neste projeto.</div>
      <div class="row" style="align-items:flex-end;margin-top:8px">
        <div><label>Definir projeto atual</label><input id="pnome" list="plist" placeholder="ex.: Fórum Montes Claros" value="${atual}">
          <datalist id="plist">${ps.map(p=>`<option>${p}</option>`).join('')}</datalist></div>
        <div style="flex:0 0 auto"><button class="btn" id="pset" style="margin:0">Definir</button></div>
      </div>
      <div class="filters" style="margin-top:10px">
        <button data-f="" class="${!filtro?'on':''}">Todos</button>
        ${ps.map(p=>`<button data-f="${p}" class="${filtro===p?'on':''}">${p}</button>`).join('')}
      </div>
      ${filtro?`<button class="btn sec" id="memo" style="margin-top:4px">📄 Memorial do projeto “${filtro}”</button>`:''}`;
    $('#pset').onclick=()=>{ setProject($('#pnome').value.trim()); toast('Projeto definido ✓'); projbox(); paint(); };
    $('#projbox').querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{ filtro=b.dataset.f; projbox(); paint(); });
    const mb=$('#memo'); if(mb) mb.onclick=()=>relatorioProjeto(filtro);
  }
  function paint(){
    const list=listarCalculos().filter(r=>!filtro || (r.projeto||'')===filtro);
    $('#lst').innerHTML=list.length?list.map(r=>`<div class="item">
      <span class="chip">${r.tipo}</span>${r.projeto?`<span class="chip" style="border-color:var(--amber);color:var(--amber)">${r.projeto}</span>`:''}
      <div class="nm">${r.titulo||r.tipo}</div>
      <div class="ap">${new Date(r.updated_at).toLocaleString('pt-BR')}</div>
      <div style="display:flex;gap:14px;margin-top:6px">
        <button class="back" data-rpt="${r.id}" style="color:var(--amber)">📄 relatório</button>
        <button class="back" data-del="${r.id}" style="color:var(--red)">🗑 excluir</button>
      </div></div>`).join(''):`<p class="sub">Nenhum cálculo${filtro?' neste projeto':''}. Use “💾 Salvar” nas calculadoras.</p>`;
    $('#lst').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{excluirCalculo(b.dataset.del);conta();projbox();paint();atualizaPend();});
    $('#lst').querySelectorAll('[data-rpt]').forEach(b=>b.onclick=()=>{const r=listarCalculos().find(x=>x.id===b.dataset.rpt);if(r)relatorio(r);});
  }
  $('#sync').onclick=async()=>{
    if(!isLogged()) return $('#status').textContent='Entre na conta para sincronizar.';
    if(!navigator.onLine) return $('#status').textContent='Offline — sincroniza quando reconectar.';
    $('#status').textContent='Sincronizando…';
    const p=await puxar(); const s=await sincronizar();
    $('#status').textContent = s.ok&&p.ok
      ? `Atualizado · ${p.baixados||0} no servidor, ${s.enviados||0} enviado(s).`
      : `Falha: ${s.motivo||p.motivo||'erro'}. Verifique se a tabela/RLS foram criados (supabase-setup.sql).`;
    conta(); projbox(); paint(); atualizaPend();
  };
  conta(); projbox(); paint();
  if(isLogged() && navigator.onLine){ puxar().then(()=>{conta();projbox();paint();}); }
}

/* ---- Conta (login / cadastro) ---- */
function Conta(){
  backBtn();
  h(`<h2 class="title">👤 Conta</h2><p class="sub">Login com e-mail para sincronizar entre dispositivos.</p>
     <div class="box">
       <label>E-mail</label><input id="email" type="email" placeholder="voce@exemplo.com" autocomplete="username">
       <label>Senha</label><input id="senha" type="password" placeholder="mínimo 6 caracteres" autocomplete="current-password">
       <button class="btn" id="entrar">Entrar</button>
       <button class="btn sec" id="cadastrar">Criar conta</button>
       <div id="msg" class="hint" style="text-align:center;margin-top:10px"></div>
       <p class="hint">A senha vai direto ao Supabase Auth (não fica salva em texto). Se a confirmação por e-mail estiver ativa, confirme antes de entrar.</p>
     </div>`);
  const msg=t=>$('#msg').textContent=t;
  $('#entrar').onclick=async()=>{
    const e=$('#email').value.trim(), s=$('#senha').value;
    if(!(e&&s)) return msg('Preencha e-mail e senha.');
    msg('Entrando…'); const r=await entrar(e,s);
    if(r.ok){ toast('Conectado ✓'); if(navigator.onLine){await puxar();await sincronizar();atualizaPend();} back(); }
    else msg('Erro: '+r.erro);
  };
  $('#cadastrar').onclick=async()=>{
    const e=$('#email').value.trim(), s=$('#senha').value;
    if(!(e&&s)) return msg('Preencha e-mail e senha.');
    if(s.length<6) return msg('A senha precisa de ao menos 6 caracteres.');
    msg('Criando conta…'); const r=await cadastrar(e,s);
    if(r.ok&&r.logado){ toast('Conta criada ✓'); back(); }
    else if(r.ok){ msg(r.msg||'Conta criada. Confirme o e-mail e entre.'); }
    else msg('Erro: '+r.erro);
  };
}

/* ============ DISCIPLINAS — CIVIL & MATERIAIS ============ */
function CivilMat(){
  backBtn();
  h(`<h2 class="title">🧱 Civil & Materiais</h2><p class="sub">Quantitativos de material para manutenção.</p>
     <div class="grid">
       <div class="card" data-c="Pintura"><span class="ic">🎨</span><h3>Pintura</h3><p>Litros e latas por área</p></div>
       <div class="card" data-c="Revest"><span class="ic">🔲</span><h3>Piso / Azulejo</h3><p>m², caixas e perda</p></div>
       <div class="card" data-c="Alvenaria"><span class="ic">🧱</span><h3>Alvenaria</h3><p>Tijolos / blocos</p></div>
       <div class="card" data-c="Reboco"><span class="ic">🪧</span><h3>Reboco / Massa</h3><p>Volume de argamassa</p></div>
       <div class="card" data-c="Foto"><span class="ic">📷</span><h3>Régua na foto</h3><p>Medir distância e área</p></div>
     </div>`);
  const map={Pintura:CalcPintura,Revest:CalcRevest,Alvenaria:CalcAlvenaria,Reboco:CalcReboco,Foto:FotoRegua};
  el.querySelectorAll('[data-c]').forEach(c=>c.onclick=()=>go(map[c.dataset.c]));
}

function areaBox(extra=''){return `<label>Área (m²)</label><input id="area" type="number" placeholder="ex.: 40">
  <button class="btn sec" id="usefoto" style="margin-top:6px">📷 Medir área na foto</button>${extra}`;}
function wireFoto(){ const b=$('#usefoto'); if(b) b.onclick=()=>{ toast('Meça a área na foto e anote o valor.'); go(FotoRegua); }; }

function CalcPintura(){
  backBtn();
  h(`<h2 class="title">🎨 Pintura</h2><p class="sub">Tinta necessária por área.</p>
     <div class="box">
       ${areaBox()}
       <label>Tipo</label><select id="tp">${PINTURA.tipos.map((t,i)=>`<option value="${t.rend}">${t.nome} (~${t.rend} m²/L)</option>`).join('')}</select>
       <div class="row"><div><label>Rendimento (m²/L · demão)</label><input id="rend" type="number" value="10"></div>
       <div><label>Demãos</label><input id="dem" type="number" value="2"></div></div>
       <label>Descontar vãos (m²)</label><input id="vao" type="number" value="0">
       <label>Lata (L)</label><select id="lata"><option value="18">18 L</option><option value="3.6">3,6 L (galão)</option><option value="0.9">0,9 L</option></select>
       <button class="btn" id="run">Calcular tinta</button><div id="res"></div>
       <p class="hint">Litros = (Área − vãos) × demãos ÷ rendimento. Rendimento real varia com a superfície e a cor.</p>
     </div>`);
  $('#tp').onchange=e=>$('#rend').value=e.target.value;
  wireFoto();
  $('#run').onclick=()=>{
    const A=+$('#area').value, r=+$('#rend').value, d=+$('#dem').value||1, vao=+$('#vao').value||0, lata=+$('#lata').value;
    if(!(A&&r)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha área e rendimento.</span></div>`;
    const liq=Math.max(0,A-vao), litros=liq*d/r, latas=Math.ceil(litros/lata);
    $('#res').innerHTML=`<div class="result"><span class="lab">Tinta necessária</span>
      <div class="big">${fmt(litros,1)} L</div>
      <div class="hint">Área pintável ${fmt(liq,1)} m² · ${d} demão(s) · ${latas} lata(s) de ${lata} L.</div></div>`;
    addSave('Pintura',`${fmt(litros,1)} L · ${fmt(liq,0)} m²`,{A,r,d,vao,lata},{litros,latas});
  };
}

function CalcRevest(){
  backBtn();
  h(`<h2 class="title">🔲 Piso / Azulejo</h2><p class="sub">Área com perda e número de caixas.</p>
     <div class="box">
       ${areaBox()}
       <div class="row"><div><label>Perda (%)</label><input id="perda" type="number" value="10"></div>
       <div><label>Área por caixa (m²)</label><input id="cx" type="number" value="2"></div></div>
       <button class="btn" id="run">Calcular</button><div id="res"></div>
       <p class="hint">Área total = Área × (1 + perda/100). Argamassa colante ≈ 4–5 kg/m²; rejunte conforme junta.</p>
     </div>`);
  wireFoto();
  $('#run').onclick=()=>{
    const A=+$('#area').value, p=+$('#perda').value||0, cx=+$('#cx').value;
    if(!(A&&cx)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha área e área por caixa.</span></div>`;
    const tot=A*(1+p/100), caixas=Math.ceil(tot/cx), arg=Math.ceil(tot*4.5);
    $('#res').innerHTML=`<div class="result"><span class="lab">Material</span>
      <div class="big">${caixas} caixas</div>
      <div class="hint">Área com perda ${fmt(tot,1)} m² · argamassa colante ≈ ${arg} kg (~${Math.ceil(arg/20)} sacos de 20 kg).</div></div>`;
    addSave('Piso/Azulejo',`${caixas} cx · ${fmt(tot,1)} m²`,{A,p,cx},{caixas,tot,arg});
  };
}

function CalcAlvenaria(){
  backBtn();
  h(`<h2 class="title">🧱 Alvenaria</h2><p class="sub">Quantidade de tijolos / blocos.</p>
     <div class="box">
       ${areaBox()}
       <label>Unidade</label><select id="bl">${BLOCOS.map((b,i)=>`<option value="${b.porM2}">${b.nome} (~${b.porM2}/m²)</option>`).join('')}</select>
       <div class="row"><div><label>Unidades por m²</label><input id="pm" type="number" value="${BLOCOS[0].porM2}"></div>
       <div><label>Perda (%)</label><input id="perda" type="number" value="5"></div></div>
       <button class="btn" id="run">Calcular</button><div id="res"></div>
       <p class="hint">Quantidades aproximadas — variam com a espessura da junta e o assentamento.</p>
     </div>`);
  $('#bl').onchange=e=>$('#pm').value=e.target.value;
  wireFoto();
  $('#run').onclick=()=>{
    const A=+$('#area').value, pm=+$('#pm').value, p=+$('#perda').value||0;
    if(!(A&&pm)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha área e unidades/m².</span></div>`;
    const q=Math.ceil(A*pm*(1+p/100));
    $('#res').innerHTML=`<div class="result"><span class="lab">Unidades necessárias</span>
      <div class="big">${fmt(q,0)}</div><div class="hint">Para ${fmt(A,1)} m² com ${p}% de perda.</div></div>`;
    addSave('Alvenaria',`${fmt(q,0)} un · ${fmt(A,0)} m²`,{A,pm,p},{q});
  };
}

function CalcReboco(){
  backBtn();
  h(`<h2 class="title">🪧 Reboco / Massa</h2><p class="sub">Volume de argamassa.</p>
     <div class="box">
       ${areaBox()}
       <label>Espessura (cm)</label><input id="esp" type="number" value="2">
       <button class="btn" id="run">Calcular volume</button><div id="res"></div>
       <p class="hint">Volume = Área × espessura. Acrescente perda. Traço 1:2:8 (cimento:cal:areia) é comum p/ reboco.</p>
     </div>`);
  wireFoto();
  $('#run').onclick=()=>{
    const A=+$('#area').value, esp=+$('#esp').value;
    if(!(A&&esp)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha área e espessura.</span></div>`;
    const vol=A*(esp/100), litros=vol*1000;
    $('#res').innerHTML=`<div class="result"><span class="lab">Argamassa</span>
      <div class="big">${fmt(vol,2)} m³</div><div class="hint">≈ ${fmt(litros,0)} litros para ${fmt(A,1)} m² × ${esp} cm.</div></div>`;
    addSave('Reboco',`${fmt(vol,2)} m³ · ${fmt(A,0)} m²`,{A,esp},{vol});
  };
}

/* ============ HIDROSSANITÁRIO ============ */
function Hidro(){
  backBtn();
  h(`<h2 class="title">🚿 Hidrossanitário</h2><p class="sub">Reservatório, consumo e declividade.</p>
     <div class="grid">
       <div class="card" data-c="Reserv"><span class="ic">🛢️</span><h3>Reservatório</h3><p>Volume e litros</p></div>
       <div class="card" data-c="Consumo"><span class="ic">👥</span><h3>Consumo / Reserva</h3><p>População × per capita</p></div>
       <div class="card" data-c="Decliv"><span class="ic">📐</span><h3>Declividade</h3><p>Caimento de tubulação</p></div>
     </div>`);
  const map={Reserv:CalcReservatorio,Consumo:CalcConsumo,Decliv:CalcDeclividade};
  el.querySelectorAll('[data-c]').forEach(c=>c.onclick=()=>go(map[c.dataset.c]));
}

function CalcReservatorio(){
  backBtn();
  h(`<h2 class="title">🛢️ Reservatório</h2><p class="sub">Volume de caixa d'água.</p>
     <div class="box">
       <label>Formato</label><select id="fmt"><option value="ret">Retangular</option><option value="cil">Cilíndrico</option></select>
       <div id="ret"><div class="row"><div><label>Comprimento (m)</label><input id="c" type="number"></div>
         <div><label>Largura (m)</label><input id="l" type="number"></div></div></div>
       <div id="cil" style="display:none"><label>Diâmetro (m)</label><input id="d" type="number"></div>
       <label>Altura útil (m)</label><input id="h" type="number">
       <button class="btn" id="run">Calcular volume</button><div id="res"></div>
     </div>`);
  $('#fmt').onchange=e=>{const c=e.target.value==='cil';$('#ret').style.display=c?'none':'block';$('#cil').style.display=c?'block':'none';};
  $('#run').onclick=()=>{
    let vol; const H=+$('#h').value;
    if($('#fmt').value==='cil'){const d=+$('#d').value; if(!(d&&H))return; vol=Math.PI*Math.pow(d/2,2)*H;}
    else {const c=+$('#c').value,l=+$('#l').value; if(!(c&&l&&H))return; vol=c*l*H;}
    if(!vol) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha as dimensões.</span></div>`;
    $('#res').innerHTML=`<div class="result"><span class="lab">Volume</span>
      <div class="big">${fmt(vol*1000,0)} L</div><div class="hint">${fmt(vol,2)} m³.</div></div>`;
    addSave('Reservatório',`${fmt(vol*1000,0)} L`,{fmt:$('#fmt').value,H},{litros:vol*1000});
  };
}

function CalcConsumo(){
  backBtn();
  h(`<h2 class="title">👥 Consumo / Reserva</h2><p class="sub">Demanda de água e reserva.</p>
     <div class="box">
       <label>Uso</label><select id="uso">${CONSUMO.map((c,i)=>`<option value="${c.q}">${c.uso} — ${c.q} ${c.un}</option>`).join('')}</select>
       <div class="row"><div><label>Per capita (L/dia)</label><input id="pc" type="number" value="${CONSUMO[0].q}"></div>
       <div><label>População</label><input id="pop" type="number" placeholder="ex.: 50"></div></div>
       <label>Dias de reserva</label><select id="dias"><option value="1">1 dia</option><option value="2" selected>2 dias (inferior + superior)</option></select>
       <button class="btn" id="run">Calcular</button><div id="res"></div>
       <p class="hint">Consumo diário = per capita × população. Reserva total ≈ consumo × dias.</p>
     </div>`);
  $('#uso').onchange=e=>$('#pc').value=e.target.value;
  $('#run').onclick=()=>{
    const pc=+$('#pc').value,pop=+$('#pop').value,dias=+$('#dias').value;
    if(!(pc&&pop)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha per capita e população.</span></div>`;
    const diario=pc*pop, reserva=diario*dias;
    $('#res').innerHTML=`<div class="result"><span class="lab">Reserva recomendada</span>
      <div class="big">${fmt(reserva,0)} L</div><div class="hint">Consumo diário ${fmt(diario,0)} L · ${dias} dia(s).</div></div>`;
    addSave('Consumo água',`${fmt(reserva,0)} L · ${pop} pessoas`,{pc,pop,dias},{diario,reserva});
  };
}

function CalcDeclividade(){
  backBtn();
  h(`<h2 class="title">📐 Declividade</h2><p class="sub cite">Caimento de tubulação — ref. NBR 8160</p>
     <div class="box">
       <label>Declividade i (%)</label><input id="i" type="number" step="0.1" value="1">
       <label>Comprimento (m)</label><input id="l" type="number" placeholder="ex.: 12">
       <button class="btn" id="run">Calcular desnível</button><div id="res"></div>
     </div>
     <div class="box"><label>Declividade mínima (esgoto)</label><table><tr><th>Tubo</th><th>i mín.</th></tr>
       ${DECLIVIDADE_MIN.map(d=>`<tr><td>${d.dn}</td><td class="cite">${d.imin}</td></tr>`).join('')}</table>
       <p class="hint">Referência — confirmar na NBR 8160 / projeto.</p></div>`);
  $('#run').onclick=()=>{
    const i=+$('#i').value,L=+$('#l').value;
    if(!(i&&L)) return $('#res').innerHTML=`<div class="result"><span class="lab">Preencha i e comprimento.</span></div>`;
    const dh=L*(i/100);
    $('#res').innerHTML=`<div class="result"><span class="lab">Desnível total</span>
      <div class="big">${fmt(dh*100,1)} cm</div><div class="hint">${fmt(dh,3)} m em ${L} m com ${i}%.</div></div>`;
    addSave('Declividade',`${fmt(dh*100,1)} cm · ${i}% · ${L}m`,{i,L},{dh});
  };
}

/* ============ SPDA — menu + captação ============ */
function SpdaMenu(){
  backBtn();
  h(`<h2 class="title">🌩️ SPDA</h2><p class="sub cite">NBR 5419</p>
     <div class="grid">
       <div class="card" data-c="Tri"><span class="ic">⚠️</span><h3>Triagem de risco</h3><p>Ad e Nd (Parte 2)</p></div>
       <div class="card" data-c="Capt"><span class="ic">📡</span><h3>Captação / Descidas</h3><p>Esfera, malha e descidas (Parte 3)</p></div>
     </div>`);
  const map={Tri:CalcSpda,Capt:CalcSpdaCapt};
  el.querySelectorAll('[data-c]').forEach(c=>c.onclick=()=>go(map[c.dataset.c]));
}

function CalcSpdaCapt(){
  backBtn();
  h(`<h2 class="title">📡 Captação e descidas</h2><p class="sub cite">NBR 5419-3 — por NPS</p>
     <div class="box">
       <label>Nível de proteção (NPS)</label><select id="cl"><option value="I">I</option><option value="II">II</option><option value="III" selected>III</option><option value="IV">IV</option></select>
       <div class="row"><div><label>Perímetro (m)</label><input id="per" type="number" placeholder="ex.: 120"></div>
       <div><label>Altura (m)</label><input id="h" type="number" placeholder="ex.: 12"></div></div>
       <button class="btn" id="run">Calcular</button><div id="res"></div>
       <p class="hint">Descidas ≈ perímetro ÷ espaçamento (mín. 2). Esfera rolante e malha conforme a classe.</p>
     </div>
     <div class="box"><label>Parâmetros por NPS</label><table><tr><th>NPS</th><th>Esfera (m)</th><th>Malha (m)</th><th>Descida (m)</th></tr>
       ${Object.entries(SPDA_CLASSE).map(([k,v])=>`<tr><td class="cite">${k}</td><td class="num">${v.esfera}</td><td class="num">${v.malha}×${v.malha}</td><td class="num">${v.desc}</td></tr>`).join('')}</table></div>`);
  $('#run').onclick=()=>{
    const cl=$('#cl').value, per=+$('#per').value, c=SPDA_CLASSE[cl];
    if(!per) return $('#res').innerHTML=`<div class="result"><span class="lab">Informe o perímetro.</span></div>`;
    const desc=Math.max(2,Math.ceil(per/c.desc));
    $('#res').innerHTML=`<div class="result"><span class="lab">Descidas necessárias (NPS ${cl})</span>
      <div class="big">${desc}</div>
      <div class="hint">Espaçamento ${c.desc} m · esfera rolante R=${c.esfera} m · malha ${c.malha}×${c.malha} m.</div></div>`;
    addSave('SPDA captação',`${desc} descidas · NPS ${cl}`,{cl,per},{descidas:desc,esfera:c.esfera,malha:c.malha});
  };
}

/* ============ QUADRO DE CARGAS / BALANCEAMENTO ============ */
function CalcQuadro(){
  backBtn();
  let circ=[];
  h(`<h2 class="title">🗂️ Quadro de cargas</h2><p class="sub">Some cargas e balanceie as fases.</p>
     <div class="box">
       <label>Descrição</label><input id="ds" placeholder="ex.: Tomadas sala">
       <div class="row"><div><label>Potência (W)</label><input id="pw" type="number" placeholder="ex.: 1200"></div>
       <div><label>Fase</label><select id="fs"><option value="auto">Auto</option><option>R</option><option>S</option><option>T</option></select></div></div>
       <button class="btn sec" id="add">+ Adicionar circuito</button>
       <div id="lst" style="margin-top:10px"></div>
       <div id="res"></div>
     </div>`);
  function fases(){const f={R:0,S:0,T:0};circ.forEach(c=>f[c.fase]+=c.pw);return f;}
  function paint(){
    $('#lst').innerHTML=circ.length?circ.map((c,i)=>`<div class="ck"><span>${c.fase} · ${c.ds||'circuito'} — ${fmt(c.pw,0)} W</span>
      <button class="back" data-x="${i}" style="color:var(--red);margin-left:auto">✕</button></div>`).join(''):'';
    $('#lst').querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{circ.splice(+b.dataset.x,1);paint();});
    const f=fases(), tot=f.R+f.S+f.T, max=Math.max(f.R,f.S,f.T), min=Math.min(f.R,f.S,f.T);
    const desb=max? ((max-min)/max*100):0;
    if(circ.length) $('#res').innerHTML=`<div class="result"><span class="lab">Total ${fmt(tot,0)} W</span>
      <div class="hint" style="font-size:14px;margin-top:6px">R: <b>${fmt(f.R,0)} W</b> · S: <b>${fmt(f.S,0)} W</b> · T: <b>${fmt(f.T,0)} W</b></div>
      <span class="tag ${desb<=15?'ok':'bad'}">Desbalanceamento ${fmt(desb,0)}% ${desb<=15?'(bom)':'(reequilibrar)'}</span></div>`;
    else $('#res').innerHTML='';
  }
  $('#add').onclick=()=>{
    const pw=+$('#pw').value; if(!pw) return toast('Informe a potência.');
    let fase=$('#fs').value;
    if(fase==='auto'){const f=fases();fase=Object.entries(f).sort((a,b)=>a[1]-b[1])[0][0];}
    circ.push({ds:$('#ds').value,pw,fase}); $('#ds').value='';$('#pw').value=''; paint();
  };
  paint();
}

/* ============ RÉGUA NA FOTO ============ */
function FotoRegua(){
  backBtn();
  // parar câmera ao voltar
  const bb=el.querySelector('.back'); if(bb){const o=bb.onclick;bb.onclick=()=>{stopCam();o&&o();};}
  h(`<h2 class="title">📷 Régua / Câmera</h2><p class="sub">Câmera ou foto · calibre e meça distância/área.</p>
     <div class="box">
       <div class="filters" style="margin-bottom:8px">
         <button id="camBtn">📸 Abrir câmera</button>
         <button id="capBtn" style="display:none;background:var(--amber);color:#1a1205">⬤ Capturar</button>
         <button id="galBtn">🖼 Galeria</button>
       </div>
       <input type="file" id="img" accept="image/*" capture="environment" style="display:none">
       <video id="vid" playsinline muted style="display:none"></video>
       <div style="position:relative">
         <canvas id="cv" style="width:100%;border:1px solid var(--line);border-radius:10px;background:var(--panel2);touch-action:none"></canvas>
       </div>
       <div class="filters" style="margin-top:10px">
         <button id="mCal" class="on">1· Calibrar</button>
         <button id="mDist">2· Distância</button>
         <button id="mArea">3· Área</button>
         <button id="mClr">Limpar pontos</button>
       </div>
       <div id="calbox" class="row" style="align-items:flex-end">
         <div><label>Medida de referência (m)</label><input id="ref" type="number" step="0.01" placeholder="ex.: 0.80 (porta)"></div>
         <div style="flex:0 0 auto"><button class="btn" id="setScale" style="margin:0">Definir escala</button></div>
       </div>
       <div id="res"></div>
       <p class="hint">Câmera: aponte → <b>Capturar</b> → marque 2 pontos numa medida conhecida e defina a escala → meça (ponto inicial e final). Para boa precisão, fotografe de frente e no mesmo plano da referência.</p>
     </div>`);

  const cv=$('#cv'), ctx=cv.getContext('2d'), video=$('#vid');
  let img=null, scale=null, mode='cal', pts=[];
  let stream=null, live=false, raf=null;
  function stopCam(){ live=false; if(raf)cancelAnimationFrame(raf); raf=null; if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;} const cb=$('#capBtn'); if(cb)cb.style.display='none'; const mb=$('#camBtn'); if(mb)mb.textContent='📸 Abrir câmera'; }

  $('#camBtn').onclick=startCam;
  $('#capBtn').onclick=capturar;
  $('#galBtn').onclick=()=>$('#img').click();

  function setMode(m){mode=m;pts=[];['mCal','mDist','mArea'].forEach(id=>$('#'+id).classList.toggle('on', id===({cal:'mCal',dist:'mDist',area:'mArea'}[m])));$('#calbox').style.display=m==='cal'?'flex':'none';if(!live)draw();info();}
  $('#mCal').onclick=()=>setMode('cal'); $('#mDist').onclick=()=>setMode('dist'); $('#mArea').onclick=()=>setMode('area');
  $('#mClr').onclick=()=>{pts=[];if(!live)draw();info();};

  $('#img').onchange=e=>{
    const f=e.target.files[0]; if(!f)return; stopCam(); const rd=new FileReader();
    rd.onload=()=>{const im=new Image();im.onload=()=>{img=im;const maxW=1280;const sc=Math.min(1,maxW/im.width);cv.width=im.width*sc;cv.height=im.height*sc;pts=[];scale=null;draw();info();};im.src=rd.result;};
    rd.readAsDataURL(f);
  };

  async function startCam(){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia) return toast('Câmera não suportada neste navegador.');
    try{
      stopCam();
      stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
      video.srcObject=stream; await video.play();
      const setSize=()=>{ if(video.videoWidth){cv.width=video.videoWidth;cv.height=video.videoHeight;} };
      setSize(); video.onloadedmetadata=setSize;
      live=true; img=null; scale=null; pts=[];
      $('#capBtn').style.display='inline-block'; $('#camBtn').textContent='🔄 Trocar';
      loop(); info();
    }catch(e){ toast('Não foi possível abrir a câmera ('+(e.name||e.message)+').'); }
  }
  function capturar(){
    if(!live)return;
    ctx.drawImage(video,0,0,cv.width,cv.height);
    const data=cv.toDataURL('image/jpeg',0.85); stopCam();
    const im=new Image(); im.onload=()=>{img=im;pts=[];scale=null;draw();info();toast('Quadro capturado — calibre com uma medida conhecida.');}; im.src=data;
    $('#capBtn').style.display='none'; $('#camBtn').textContent='📸 Abrir câmera';
  }

  function pos(ev){const r=cv.getBoundingClientRect();const t=ev.touches&&ev.touches[0];const cx=((t?t.clientX:ev.clientX)-r.left)*(cv.width/r.width);const cy=((t?t.clientY:ev.clientY)-r.top)*(cv.height/r.height);return{x:cx,y:cy};}
  function add(ev){ev.preventDefault();if(!img&&!live)return;const p=pos(ev);if(mode==='cal'&&pts.length>=2)pts=[];pts.push(p);if(!live)draw();info();}
  cv.addEventListener('click',add); cv.addEventListener('touchstart',add,{passive:false});

  function overlay(){
    ctx.lineWidth=Math.max(2,cv.width/400);ctx.strokeStyle='#ffb000';ctx.fillStyle='#ffb000';
    ctx.beginPath();pts.forEach((p,i)=>{i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});
    if(mode==='area'&&pts.length>2)ctx.closePath();
    ctx.stroke();
    pts.forEach((p,i)=>{ctx.beginPath();ctx.arc(p.x,p.y,ctx.lineWidth*2.2,0,7);ctx.fill();
      if(mode!=='area'){ctx.font=`${Math.max(14,cv.width/45)}px sans-serif`;ctx.fillText(i===0?'início':(i===pts.length-1?'fim':''),p.x+8,p.y-8);} });
  }
  function draw(){ if(!img){ctx.clearRect(0,0,cv.width,cv.height);return;} ctx.drawImage(img,0,0,cv.width,cv.height); overlay(); }
  function loop(){ if(!live)return; ctx.drawImage(video,0,0,cv.width,cv.height); overlay(); raf=requestAnimationFrame(loop); }

  function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
  function info(){
    if(!img&&!live) return $('#res').innerHTML='';
    if(mode==='cal'){
      $('#res').innerHTML=`<div class="result"><span class="lab">Calibração</span><div class="hint">${pts.length<2?'Marque 2 pontos sobre a medida conhecida.':'Informe a medida e toque em “Definir escala”.'}${scale?'<br>Escala: '+fmt(scale*1000,2)+' mm/px':''}${live?'<br>Dica: capture o quadro antes de medir.':''}</div></div>`;
      return;
    }
    if(!scale){$('#res').innerHTML=`<div class="result" style="border-left-color:var(--red)"><span class="lab bad">Calibre primeiro</span></div>`;return;}
    if(mode==='dist'){
      let d=0;for(let i=1;i<pts.length;i++)d+=dist(pts[i-1],pts[i]);const m=d*scale;
      $('#res').innerHTML=`<div class="result"><span class="lab">Distância (início → fim)</span><div class="big">${fmt(m,2)} m</div><div class="hint">${fmt(m*100,0)} cm · ${pts.length} ponto(s).</div></div>`;
      if(pts.length>=2&&!live) addSave('Medida (foto)',`${fmt(m,2)} m`,{pontos:pts.length},{metros:m});
    } else {
      if(pts.length<3){$('#res').innerHTML=`<div class="result"><span class="lab">Área</span><div class="hint">Marque ao menos 3 pontos.</div></div>`;return;}
      let s=0;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];s+=a.x*b.y-b.x*a.y;}
      const areaM=Math.abs(s/2)*scale*scale;
      $('#res').innerHTML=`<div class="result"><span class="lab">Área</span><div class="big">${fmt(areaM,2)} m²</div><div class="hint">${pts.length} vértices.</div></div>`;
      if(!live) addSave('Área (foto)',`${fmt(areaM,2)} m²`,{vertices:pts.length},{area:areaM});
    }
  }
  $('#setScale').onclick=()=>{
    const ref=+$('#ref').value; if(pts.length<2)return toast('Marque 2 pontos primeiro.'); if(!ref)return toast('Informe a medida de referência.');
    scale=ref/dist(pts[0],pts[1]); toast('Escala definida ✓'); info();
  };
  setMode('cal');
}

/* ============ DIMENSIONAMENTO DE CIRCUITO (NBR 5410 completo) ============ */
function CalcCircuito(){
  backBtn();
  h(`<h2 class="title">🧩 Dimensionamento de circuito</h2><p class="sub cite">NBR 5410 — fluxo completo</p>
     <div class="box">
       <div class="row"><div><label>Entrada</label><select id="modo"><option value="p">Potência (kW)</option><option value="i">Corrente (A)</option></select></div>
       <div><label>Sistema</label><select id="sis"><option value="1">Mono</option><option value="3" selected>Tri</option></select></div></div>
       <div class="row"><div><label id="lv">Valor</label><input id="val" type="number" placeholder="ex.: 10"></div>
       <div><label>Tensão (V)</label><input id="v" type="number" value="220"></div></div>
       <div class="row"><div><label>cos φ</label><input id="fp" type="number" step="0.01" value="0.92"></div>
       <div><label>Comprimento (m)</label><input id="L" type="number" placeholder="ex.: 30"></div></div>
       <label>Método de instalação</label><select id="m">${Object.entries(METODO_DESC).map(([k,v])=>`<option value="${k}"${k==='B1'?' selected':''}>${v}</option>`).join('')}</select>
       <div class="row"><div><label>Temp. ambiente (°C)</label><select id="t">${[10,15,20,25,30,35,40,45,50,55,60].map(x=>`<option ${x===30?'selected':''}>${x}</option>`).join('')}</select></div>
       <div><label>Circuitos agrupados</label><input id="ag" type="number" value="1"></div></div>
       <div class="row"><div><label>Uso (seção mín.)</label><select id="uso"><option value="2.5">Tomadas/força</option><option value="1.5">Iluminação</option></select></div>
       <div><label>Queda máx (%)</label><select id="lim"><option value="4">4%</option><option value="7">7%</option></select></div></div>
       <button class="btn" id="run">Dimensionar</button><div id="res"></div>
       <p class="hint">Faz: I<sub>B</sub> → Fct·Fca → seção por capacidade → disjuntor (Ib≤In≤Iz) → verifica queda (aumenta a seção se reprovar) → eletroduto.</p>
     </div>`);
  $('#modo').onchange=e=>$('#lv').textContent=e.target.value==='p'?'Potência (kW)':'Corrente (A)';
  $('#run').onclick=()=>{
    const sis=+$('#sis').value, k=sis===3?Math.sqrt(3):2, V=+$('#v').value, fp=+$('#fp').value||1, L=+$('#L').value, m=$('#m').value;
    const t=+$('#t').value, ag=+$('#ag').value||1, smin=+$('#uso').value, lim=+$('#lim').value, rho=0.0179;
    let Ib;
    if($('#modo').value==='p'){ const P=+$('#val').value*1000; if(!(P&&V))return err(); Ib=P/(k*V*fp); }
    else { Ib=+$('#val').value; if(!Ib)return err(); }
    if(!(V&&L)) return err();
    const Fct=fct(t), Fca=fca(ag);
    const In=DISJUNTORES.find(d=>d>=Ib)||Ib;                 // disjuntor
    const secoes=Object.keys(AMPACIDADE_METODOS).map(Number).filter(s=>s>=smin);
    const Izreq=In/(Fct*Fca);
    // seção por capacidade
    let sec=secoes.find(s=>AMPACIDADE_METODOS[s][m]>=Izreq);
    // verifica queda de tensão e sobe a seção se reprovar
    const dvpc=s=>((k*rho*L*Ib)/s)/V*100;
    let motivoQueda=false;
    while(sec && dvpc(sec)>lim){ const prox=secoes.find(s=>s>sec); if(!prox)break; sec=prox; motivoQueda=true; }
    if(!sec) return $('#res').innerHTML=`<div class="result" style="border-left-color:var(--red)"><span class="lab bad">Fora da tabela</span><div class="hint">I'z requerido ${fmt(Izreq,0)} A. Reavaliar método/paralelismo.</div></div>`;
    const Iz=AMPACIDADE_METODOS[sec][m]*Fct*Fca;
    const pc=dvpc(sec);
    const okCoord = Ib<=In && In<=Iz;
    // eletroduto
    const CABO={1.5:9,2.5:11,4:13,6:16,10:23,16:32,25:49,35:62,50:88,70:120,95:160,120:200,150:250,185:300,240:390};
    const ncond= sis===3?4:3; const areaCabos=(CABO[sec]||0)*ncond;
    const DUTOS=[[16,'1/2"',120],[20,'3/4"',200],[25,'1"',320],[32,'1.1/4"',530],[40,'1.1/2"',830],[50,'2"',1300],[60,'2.1/2"',1900],[75,'3"',2700]];
    const duto=DUTOS.find(d=>d[2]*0.40>=areaCabos);
    $('#res').innerHTML=`<div class="result">
      <span class="lab">Resultado do dimensionamento</span>
      <div class="big">${fmt(sec,1)} mm² · ${In} A</div>
      <div class="hint" style="line-height:1.7;margin-top:8px">
        Corrente de projeto I<sub>B</sub> = <b>${fmt(Ib,1)} A</b><br>
        Fct=${Fct} · Fca=${Fca} → I'z exigido ${fmt(Izreq,1)} A<br>
        Condutor <b>${fmt(sec,1)} mm²</b> (método ${m}) · I<sub>z</sub> corrigida ${fmt(Iz,1)} A<br>
        Disjuntor <b>${In} A</b> · coordenação ${okCoord?'✓ Ib≤In≤Iz':'⚠ revisar'}<br>
        Queda de tensão <b>${fmt(pc,2)}%</b> (limite ${lim}%) ${pc<=lim?'✓':'⚠'}${motivoQueda?' · seção elevada pela queda':''}<br>
        Eletroduto ${duto?('<b>DN '+duto[0]+' ('+duto[1]+')</b>'):'> 75 mm'}
      </div>
      <span class="tag ${okCoord&&pc<=lim?'ok':'bad'}">${okCoord&&pc<=lim?'Conforme NBR 5410':'Verificar pontos marcados'}</span></div>`;
    addSave('Circuito',`${fmt(sec,1)}mm² · ${In}A · ${fmt(pc,1)}%`,{Ib,V,L,m,t,ag,smin,lim,sis},{sec,In,Iz,pc,duto:duto&&duto[0]});
  };
  function err(){ $('#res').innerHTML=`<div class="result"><span class="lab">Preencha valor, tensão e comprimento.</span></div>`; }
}

/* ============ UTILITÁRIOS / CONVERSÕES ============ */
function Utils(){
  backBtn();
  h(`<h2 class="title">🔧 Conversões & Tabelas</h2><p class="sub">Conversores e referências rápidas.</p>
     <div class="box"><label>Potência</label>
       <div class="row"><div><input id="kw" type="number" placeholder="kW"></div><div><input id="cv" type="number" placeholder="CV"></div><div><input id="hp" type="number" placeholder="HP"></div></div>
       <p class="hint">1 CV = 0,7355 kW · 1 HP = 0,7457 kW</p></div>
     <div class="box"><label>Bitola AWG ↔ mm² (cobre)</label>
       <table><tr><th>AWG</th><th style="text-align:right">mm²</th></tr>
       ${AWG_MM2.map(a=>`<tr><td class="cite">${a.awg}</td><td class="num">${a.mm2}</td></tr>`).join('')}</table></div>
     <div class="box"><label>Disjuntores padronizados (A)</label>
       <div class="ap" style="font-family:var(--mono)">${DISJUNTORES.join(' · ')}</div></div>`);
  const kw=$('#kw'),cv=$('#cv'),hp=$('#hp');
  kw.oninput=()=>{const v=+kw.value;cv.value=v?fmt(v/0.7355,2):'';hp.value=v?fmt(v/0.7457,2):'';};
  cv.oninput=()=>{const v=+cv.value;kw.value=v?fmt(v*0.7355,2):'';hp.value=v?fmt(v*0.7355/0.7457,2):'';};
  hp.oninput=()=>{const v=+hp.value;kw.value=v?fmt(v*0.7457,2):'';cv.value=v?fmt(v*0.7457/0.7355,2):'';};
}

/* ============ GUIA DE NORMAS POR SISTEMA ============ */
function GuiaNormas(){
  backBtn();
  h(`<h2 class="title">📘 Guia de aplicação</h2><p class="sub">Requisitos-chave por sistema, com referência à norma.</p>`);
  Object.entries(GUIA_SISTEMA).forEach(([sis,d])=>{
    h(`<div class="box"><span class="chip cite">${d.norma}</span><div class="nm">${sis}</div>
      <ul style="margin:8px 0 0;padding-left:18px;font-size:13.5px;line-height:1.5">${d.reqs.map(r=>`<li>${r}</li>`).join('')}</ul></div>`);
  });
  h(`<p class="disc">Paráfrase técnica para orientação. Sempre confirmar no texto oficial da norma vigente.</p>`);
}

/* ============ PROJETOS / MEMORIAL CONSOLIDADO ============ */
function relatorioProjeto(nome){
  const itens=listarCalculos().filter(r=>(r.projeto||'')===nome);
  if(!itens.length) return toast('Sem cálculos neste projeto.');
  const blocos=itens.map(r=>{
    const ent=Object.entries(r.entradas||{}).map(([k,v])=>`<tr><td>${k}</td><td>${fmtVal(v)}</td></tr>`).join('');
    const res=Object.entries(r.resultado||{}).map(([k,v])=>`<tr><td>${k}</td><td><b>${fmtVal(v)}</b></td></tr>`).join('');
    return `<h2>${r.tipo} — ${r.titulo||''}</h2><div class="rmeta">${NORMA_DE[r.tipo]||''} · ${new Date(r.updated_at).toLocaleDateString('pt-BR')}</div>
      <table>${ent}${res}</table>`;
  }).join('');
  let rep=$('#report'); if(!rep){rep=document.createElement('div');rep.id='report';document.body.appendChild(rep);}
  rep.innerHTML=`<div class="rpt"><h1>Memorial de Cálculo — ${nome||'Projeto'}</h1>
    <p class="rmeta">${itens.length} item(ns) · ${new Date().toLocaleString('pt-BR')}${currentUser&&currentUser()?(' · '+currentUser()):''}</p>
    ${blocos}
    <p class="rnote">Valores consolidados de engenharia. Não substitui projeto, ART nem o texto oficial das normas vigentes.</p></div>`;
  document.body.classList.add('printing'); window.print(); setTimeout(()=>document.body.classList.remove('printing'),400);
}

/* ============ CHECKLISTS ============ */
function Checklists(){
  h(`<h2 class="title">Checklists de Vistoria</h2><p class="sub">Roteiros por sistema · marcações salvas no aparelho.</p>`);
  Object.keys(CHECKLISTS).forEach(k=>{
    const d=CHECKLISTS[k]; const st=loadCk(k); const done=Object.values(st).filter(Boolean).length;
    const card=document.createElement('div'); card.className='item'; card.style.cursor='pointer';
    card.innerHTML=`<span class="chip cite">${d.norma}</span><div class="nm">${k}</div>
      <div class="ap">${done}/${d.itens.length} verificados</div>`;
    card.onclick=()=>go(()=>Checklist(k));
    el.appendChild(card);
  });
}
function ckKey(k){return 'ck:'+k;}
function loadCk(k){try{return JSON.parse(localStorage.getItem(ckKey(k)))||{};}catch{return{};}}
function saveCk(k,o){localStorage.setItem(ckKey(k),JSON.stringify(o));}
function Checklist(k){
  backBtn();
  const d=CHECKLISTS[k]; let st=loadCk(k);
  h(`<h2 class="title">${k}</h2><p class="sub cite">${d.norma}</p>
     <div class="progress"><i id="pg"></i></div><div class="box" id="lst"></div>
     <button class="btn sec" id="reset">Limpar marcações</button>`);
  const lst=$('#lst');
  function paint(){
    lst.innerHTML='';
    d.itens.forEach((t,i)=>{
      const done=!!st[i]; const row=document.createElement('div'); row.className='ck'+(done?' done':'');
      row.innerHTML=`<div class="bx">✓</div><span>${t}</span>`;
      row.onclick=()=>{st[i]=!st[i];saveCk(k,st);paint();};
      lst.appendChild(row);
    });
    const done=Object.values(st).filter(Boolean).length;
    $('#pg').style.width=(done/d.itens.length*100)+'%';
  }
  $('#reset').onclick=()=>{st={};saveCk(k,st);paint();};
  paint();
}

/* ============ PRAZOS / PERIODICIDADES ============ */
function Prazos(){
  h(`<h2 class="title">Prazos & Periodicidades</h2><p class="sub">Calcule o vencimento a partir da última execução.</p>
     <div class="box"><label>Atividade</label>
       <select id="at">${PERIODICIDADES.map((p,i)=>`<option value="${i}">${p.at}</option>`).join('')}</select>
       <label>Data da última execução</label><input id="dt" type="date">
       <button class="btn" id="run">Calcular vencimento</button><div id="res"></div></div>
     <div class="box"><label>Tabela de periodicidades</label>
       <table><tr><th>Atividade</th><th>Periodicidade</th><th>Norma</th></tr>
       ${PERIODICIDADES.map(p=>`<tr><td>${p.at}</td><td>${p.per}</td><td class="cite" style="font-size:11px">${p.norma}</td></tr>`).join('')}</table></div>`);
  $('#run').onclick=()=>{
    const p=PERIODICIDADES[+$('#at').value], dt=$('#dt').value;
    if(!dt) return $('#res').innerHTML=`<div class="result"><span class="lab">Informe a data da última execução.</span></div>`;
    const base=new Date(dt+'T00:00:00'); const venc=new Date(base); venc.setDate(venc.getDate()+p.dias);
    const hoje=new Date(); hoje.setHours(0,0,0,0);
    const diff=Math.round((venc-hoje)/86400000);
    let cls='venc-ok',msg=`Vence em ${diff} dia(s)`;
    if(diff<0){cls='venc-late';msg=`Vencido há ${-diff} dia(s)`;}
    else if(diff<=15){cls='venc-soon';msg=`Vence em ${diff} dia(s) — providenciar`;}
    $('#res').innerHTML=`<div class="result"><span class="lab">${p.at} · ${p.per}</span>
      <div class="big ${cls}">${venc.toLocaleDateString('pt-BR')}</div>
      <div class="hint ${cls}">${msg}</div><span class="cite">${p.norma}</span></div>`;
  };
}

/* ============ NOTAS ============ */
function Notas(){
  h(`<h2 class="title">Notas de Referência</h2><p class="sub">Lembretes normativos de uso frequente.</p>
     ${NOTAS.map(n=>`<div class="box note"><div class="nm">${n.tit}</div><div class="ap" style="margin-top:4px">${n.txt}</div></div>`).join('')}
     <p class="disc">Valores consolidados de engenharia — sempre confirmar no texto vigente da norma oficial.</p>`);
}

/* ============ rede + boot ============ */
function updateNet(){
  const b=$('#net'); const on=navigator.onLine;
  b.textContent=on?'online':'offline'; b.classList.toggle('off',!on);
}
window.addEventListener('online',updateNet);
window.addEventListener('offline',updateNet);

function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme')==='light'?'':'light';
  document.documentElement.setAttribute('data-theme',cur);
  localStorage.setItem('theme',cur);
  $('#tt').textContent=cur==='light'?'🌙':'☀️';
}

let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); deferredPrompt=e; const b=$('#install'); if(b)b.style.display='inline-block'; });

document.addEventListener('DOMContentLoaded',()=>{
  if(localStorage.getItem('theme')==='light'){document.documentElement.setAttribute('data-theme','light');$('#tt').textContent='🌙';}
  $('#tt').onclick=toggleTheme;
  const acct=$('#acct'); if(acct) acct.onclick=()=>{ nav(Calculos); go(isLogged()?MeusCalculos:Conta); };
  const inst=$('#install'); if(inst) inst.onclick=async()=>{ if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;inst.style.display='none';} };
  document.querySelectorAll('nav button').forEach(b=>{
    const map={Home,Biblioteca,Calculos,Checklists,Prazos};
    b.onclick=()=>nav(map[b.dataset.t]);
  });
  updateNet(); atualizaPend(); nav(Home);

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').then(reg=>{
      reg.addEventListener('updatefound',()=>{
        const nw=reg.installing;
        nw && nw.addEventListener('statechange',()=>{
          if(nw.state==='installed' && navigator.serviceWorker.controller){
            const bar=$('#updbar'); if(bar){ bar.style.display='flex';
              $('#updbtn').onclick=()=>{ nw.postMessage('skip'); location.reload(); }; }
          }
        });
      });
    }).catch(()=>{});
  }
  if(isLogged() && navigator.onLine){ puxar().then(()=>atualizaPend()).catch(()=>{}); }
});
