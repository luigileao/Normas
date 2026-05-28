/* ============ supabase.js (v3) ============
   - Autenticação (Supabase Auth / GoTrue) por e-mail+senha
   - Sincronização offline-first com STATUS REAL
   - INSERT + UPDATE (upsert) + DELETE confirmados
   - Fila de pendências + contador
   =========================================== */

const REST = () => `${CONFIG.SUPABASE_URL}/rest/v1/${CONFIG.TABLE}`;
const AUTH = () => `${CONFIG.SUPABASE_URL}/auth/v1`;

const LS_CALC='calc:local', LS_FILA='calc:fila', LS_DEL='calc:del', LS_SESS='sb:session';

function uid(){return 'c_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function deviceId(){let d=localStorage.getItem('device');if(!d){d='dev_'+Math.random().toString(36).slice(2,9);localStorage.setItem('device',d);}return d;}
function lsGet(k){try{return JSON.parse(localStorage.getItem(k))||[];}catch{return [];}}
function lsSet(k,v){localStorage.setItem(k,JSON.stringify(v));}

/* ---------- sessão / auth ---------- */
function getSession(){try{return JSON.parse(localStorage.getItem(LS_SESS));}catch{return null;}}
function setSession(s){if(s)localStorage.setItem(LS_SESS,JSON.stringify(s));else localStorage.removeItem(LS_SESS);}
function isLogged(){const s=getSession();return !!(s&&s.access_token);}
function currentUser(){const s=getSession();return s?(s.user?.email||''):'';}
function userId(){const s=getSession();return s?(s.user?.id||null):null;}

function authHeaders(){
  const s=getSession();
  return {
    'apikey':CONFIG.SUPABASE_ANON,
    'Authorization':`Bearer ${s&&s.access_token?s.access_token:CONFIG.SUPABASE_ANON}`,
    'Content-Type':'application/json'
  };
}

async function entrar(email,senha){
  try{
    const r=await fetch(`${AUTH()}/token?grant_type=password`,{
      method:'POST',headers:{'apikey':CONFIG.SUPABASE_ANON,'Content-Type':'application/json'},
      body:JSON.stringify({email,password:senha})
    });
    const d=await r.json();
    if(!r.ok) return {ok:false,erro:d.error_description||d.msg||d.error||'Falha no login'};
    setSession({access_token:d.access_token,refresh_token:d.refresh_token,user:d.user,exp:Date.now()+ (d.expires_in||3600)*1000});
    return {ok:true};
  }catch(e){return {ok:false,erro:e.message};}
}
async function cadastrar(email,senha){
  try{
    const r=await fetch(`${AUTH()}/signup`,{
      method:'POST',headers:{'apikey':CONFIG.SUPABASE_ANON,'Content-Type':'application/json'},
      body:JSON.stringify({email,password:senha})
    });
    const d=await r.json();
    if(!r.ok) return {ok:false,erro:d.error_description||d.msg||d.error||'Falha no cadastro'};
    if(d.access_token){setSession({access_token:d.access_token,refresh_token:d.refresh_token,user:d.user,exp:Date.now()+(d.expires_in||3600)*1000});return {ok:true,logado:true};}
    return {ok:true,logado:false,msg:'Cadastro criado. Se a confirmação por e-mail estiver ativa, confirme antes de entrar.'};
  }catch(e){return {ok:false,erro:e.message};}
}
function sair(){setSession(null);}

/* ---------- CRUD local ---------- */
function salvarCalculo(tipo,titulo,entradas,resultado){
  const reg={id:uid(),tipo,titulo,entradas,resultado,device:deviceId(),user_id:userId(),updated_at:new Date().toISOString()};
  const all=lsGet(LS_CALC); all.unshift(reg); lsSet(LS_CALC,all);
  const fila=lsGet(LS_FILA); if(!fila.includes(reg.id)){fila.push(reg.id);lsSet(LS_FILA,fila);}
  return reg;
}
function atualizarCalculo(id,patch){
  const all=lsGet(LS_CALC); const i=all.findIndex(r=>r.id===id); if(i<0)return;
  all[i]={...all[i],...patch,updated_at:new Date().toISOString()}; lsSet(LS_CALC,all);
  const fila=lsGet(LS_FILA); if(!fila.includes(id)){fila.push(id);lsSet(LS_FILA,fila);}
}
function excluirCalculo(id){
  lsSet(LS_CALC, lsGet(LS_CALC).filter(r=>r.id!==id));
  lsSet(LS_FILA, lsGet(LS_FILA).filter(x=>x!==id));
  const del=lsGet(LS_DEL); del.push(id); lsSet(LS_DEL,del);
}
function listarCalculos(){return lsGet(LS_CALC);}
function pendentes(){return lsGet(LS_FILA).length + lsGet(LS_DEL).length;}

/* ---------- sincronização (status real) ---------- */
async function sincronizar(){
  if(!navigator.onLine) return {ok:false,motivo:'offline'};
  if(!isLogged()) return {ok:false,motivo:'sem-login'};
  let enviados=0, excluidos=0, erro=null;

  // upsert pendências
  const fila=lsGet(LS_FILA);
  if(fila.length){
    const all=lsGet(LS_CALC);
    const pend=all.filter(r=>fila.includes(r.id)).map(r=>({...r,user_id:userId()}));
    if(pend.length){
      try{
        const res=await fetch(REST(),{method:'POST',
          headers:{...authHeaders(),'Prefer':'resolution=merge-duplicates,return=minimal'},
          body:JSON.stringify(pend)});
        if(res.ok){lsSet(LS_FILA,[]);enviados=pend.length;}
        else {erro='http '+res.status+' '+(await res.text()).slice(0,120);}
      }catch(e){erro=e.message;}
    } else { lsSet(LS_FILA,[]); }
  }
  // exclusões pendentes
  const del=lsGet(LS_DEL);
  if(del.length && !erro){
    try{
      const ids=del.map(encodeURIComponent).join(',');
      const res=await fetch(`${REST()}?id=in.(${ids})`,{method:'DELETE',headers:authHeaders()});
      if(res.ok){lsSet(LS_DEL,[]);excluidos=del.length;}
      else {erro='del http '+res.status;}
    }catch(e){erro=e.message;}
  }
  if(erro) return {ok:false,motivo:erro,enviados,excluidos};
  return {ok:true,enviados,excluidos};
}

async function puxar(){
  if(!navigator.onLine) return {ok:false,motivo:'offline'};
  if(!isLogged()) return {ok:false,motivo:'sem-login'};
  try{
    const res=await fetch(`${REST()}?select=*&order=updated_at.desc&limit=1000`,{headers:authHeaders()});
    if(!res.ok) return {ok:false,motivo:'http '+res.status};
    const remoto=await res.json();
    const local=lsGet(LS_CALC);
    const byId={}; remoto.forEach(r=>byId[r.id]=r);
    local.forEach(r=>{ if(!byId[r.id] || (r.updated_at>byId[r.id].updated_at)) byId[r.id]=r; });
    // remove os marcados para exclusão
    lsGet(LS_DEL).forEach(id=>delete byId[id]);
    const merged=Object.values(byId).sort((a,b)=>(b.updated_at||'').localeCompare(a.updated_at||''));
    lsSet(LS_CALC,merged);
    return {ok:true,baixados:remoto.length};
  }catch(e){return {ok:false,motivo:e.message};}
}

window.addEventListener('online',()=>{ if(isLogged()) sincronizar(); });
