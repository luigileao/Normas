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
  h(`<h2 class="title">Engenharia Elétrica · Normas</h2>
     <p class="sub">Consulta de normas, cálculos e dimensionamento (NBR / CEMIG / NR) — offline.</p>
     <div class="grid">
       <div class="card" data-go="Biblioteca"><span class="ic">📚</span><h3>Biblioteca</h3><p>Qual norma se aplica a cada sistema</p></div>
       <div class="card" data-go="Calculos"><span class="ic">🧮</span><h3>Calculadoras</h3><p>Iluminância, queda de tensão, condutor, SPDA</p></div>
       <div class="card" data-go="Checklists"><span class="ic">✓</span><h3>Checklists</h3><p>Roteiros de vistoria por sistema</p></div>
       <div class="card" data-go="Prazos"><span class="ic">📅</span><h3>Prazos</h3><p>Periodicidades e vencimentos</p></div>
       <div class="card" data-go="Notas"><span class="ic">📌</span><h3>Notas</h3><p>Referências rápidas</p></div>
     </div>
     <p class="disc">Ferramenta de apoio à fiscalização (CT 017/2026 — TJMG). Os parâmetros são valores consolidados de engenharia e não substituem o texto oficial das normas ABNT/ITs vigentes.</p>`);
  const map={Biblioteca,Calculos,Checklists,Prazos,Notas};
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
  h(`<h2 class="title">Calculadoras</h2><p class="sub">Selecione o cálculo a executar.</p>
     <div class="grid">
       <div class="card" data-c="Corrente"><span class="ic">🔋</span><h3>Corrente / Potência</h3><p>I, P e kVA · mono/trifásico</p></div>
       <div class="card" data-c="Demanda"><span class="ic">📊</span><h3>Demanda (CEMIG)</h3><p>ND-5.2 · D = a+b+c+d+e+f</p></div>
       <div class="card" data-c="Lux"><span class="ic">💡</span><h3>Iluminância</h3><p>NBR ISO/CIE 8995-1 · lux e luminárias</p></div>
       <div class="card" data-c="Queda"><span class="ic">⚡</span><h3>Queda de tensão</h3><p>NBR 5410 · 6.2.7</p></div>
       <div class="card" data-c="Condutor"><span class="ic">🔌</span><h3>Condutor (ampacidade)</h3><p>NBR 5410 · método B1</p></div>
       <div class="card" data-c="Eletroduto"><span class="ic">🪈</span><h3>Eletroduto</h3><p>NBR 5410 · taxa de ocupação</p></div>
       <div class="card" data-c="FP"><span class="ic">⚙️</span><h3>Fator de potência</h3><p>Banco de capacitores (kvar)</p></div>
       <div class="card" data-c="Curto"><span class="ic">💥</span><h3>Curto-circuito</h3><p>Icc no secundário do trafo</p></div>
       <div class="card" data-c="Spda"><span class="ic">🌩️</span><h3>SPDA (triagem)</h3><p>NBR 5419-2 · Ad e Nd</p></div>
       <div class="card" data-c="Meus"><span class="ic">💾</span><h3>Meus Cálculos</h3><p>Salvos · sincroniza com Supabase</p></div>
     </div>`);
  const map={Corrente:CalcCorrente,Demanda:CalcDemanda,Lux:CalcLux,Queda:CalcQueda,Condutor:CalcCondutor,Eletroduto:CalcEletroduto,FP:CalcFP,Curto:CalcCurto,Spda:CalcSpda,Meus:MeusCalculos};
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
     <div class="row"><button class="btn sec" id="sync">↻ Sincronizar agora</button></div>
     <div id="status" class="hint" style="text-align:center;margin:8px 0"></div>
     <div id="lst"></div>`);
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
  function paint(){
    const list=listarCalculos();
    $('#lst').innerHTML=list.length?list.map(r=>`<div class="item">
      <span class="chip">${r.tipo}</span>
      <div class="nm">${r.titulo||r.tipo}</div>
      <div class="ap">${new Date(r.updated_at).toLocaleString('pt-BR')}</div>
      <div style="display:flex;gap:14px;margin-top:6px">
        <button class="back" data-rpt="${r.id}" style="color:var(--amber)">📄 relatório</button>
        <button class="back" data-del="${r.id}" style="color:var(--red)">🗑 excluir</button>
      </div></div>`).join(''):`<p class="sub">Nenhum cálculo salvo. Use “💾 Salvar” nas calculadoras.</p>`;
    $('#lst').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{excluirCalculo(b.dataset.del);conta();paint();atualizaPend();});
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
    conta(); paint(); atualizaPend();
  };
  conta(); paint();
  if(isLogged() && navigator.onLine){ puxar().then(()=>{conta();paint();}); }
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
