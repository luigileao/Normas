/* ============ supabase.js ============
   Cliente leve via REST (PostgREST). Offline-first:
   - salva local imediatamente (localStorage)
   - empurra para o Supabase quando há rede (fila de pendências)
   - puxa registros na inicialização
   ===================================== */

const SB = {
  url: () => `${CONFIG.SUPABASE_URL}/rest/v1/${CONFIG.TABLE}`,
  headers: (extra={}) => ({
    'apikey': CONFIG.SUPABASE_ANON,
    'Authorization': `Bearer ${CONFIG.SUPABASE_ANON}`,
    'Content-Type': 'application/json',
    ...extra
  }),
};

const LS_CALC = 'calc:local';     // registros locais
const LS_FILA = 'calc:fila';      // ids pendentes de envio

function uid(){ return 'c_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function deviceId(){
  let d=localStorage.getItem('device'); if(!d){d='dev_'+Math.random().toString(36).slice(2,9);localStorage.setItem('device',d);} return d;
}
function lsGet(k){try{return JSON.parse(localStorage.getItem(k))||[];}catch{return [];}}
function lsSet(k,v){localStorage.setItem(k,JSON.stringify(v));}

/* salvar cálculo (local + fila de envio) */
function salvarCalculo(tipo,titulo,entradas,resultado){
  const reg={id:uid(),tipo,titulo,entradas,resultado,device:deviceId(),updated_at:new Date().toISOString()};
  const all=lsGet(LS_CALC); all.unshift(reg); lsSet(LS_CALC,all);
  const fila=lsGet(LS_FILA); fila.push(reg.id); lsSet(LS_FILA,fila);
  sincronizar(); // tenta enviar já
  return reg;
}
function excluirCalculo(id){
  lsSet(LS_CALC, lsGet(LS_CALC).filter(r=>r.id!==id));
  if(navigator.onLine){
    fetch(`${SB.url()}?id=eq.${id}`,{method:'DELETE',headers:SB.headers()}).catch(()=>{});
  }
}
function listarCalculos(){ return lsGet(LS_CALC); }

/* envia pendências */
async function sincronizar(){
  if(!navigator.onLine) return {ok:false,motivo:'offline'};
  const fila=lsGet(LS_FILA); if(!fila.length) return {ok:true,enviados:0};
  const all=lsGet(LS_CALC);
  const pend=all.filter(r=>fila.includes(r.id));
  if(!pend.length){ lsSet(LS_FILA,[]); return {ok:true,enviados:0}; }
  try{
    const res=await fetch(SB.url(),{
      method:'POST',
      headers:SB.headers({'Prefer':'resolution=merge-duplicates,return=minimal'}),
      body:JSON.stringify(pend)
    });
    if(res.ok){ lsSet(LS_FILA,[]); return {ok:true,enviados:pend.length}; }
    return {ok:false,motivo:'http '+res.status};
  }catch(e){ return {ok:false,motivo:e.message}; }
}

/* puxa do servidor e mescla (servidor + local, sem duplicar id) */
async function puxar(){
  if(!navigator.onLine) return {ok:false,motivo:'offline'};
  try{
    const res=await fetch(`${SB.url()}?select=*&order=updated_at.desc&limit=500`,{headers:SB.headers()});
    if(!res.ok) return {ok:false,motivo:'http '+res.status};
    const remoto=await res.json();
    const local=lsGet(LS_CALC);
    const ids=new Set(local.map(r=>r.id));
    const novos=remoto.filter(r=>!ids.has(r.id));
    const merged=[...local,...novos].sort((a,b)=>(b.updated_at||'').localeCompare(a.updated_at||''));
    lsSet(LS_CALC,merged);
    return {ok:true,baixados:novos.length};
  }catch(e){ return {ok:false,motivo:e.message}; }
}

window.addEventListener('online',()=>sincronizar());
