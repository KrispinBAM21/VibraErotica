/* Módulo: js/panel-v11.js | Función: lógica original del bloque 28 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(()=>{
  'use strict';
  const $=s=>document.querySelector(s);
  const note=(s)=>{const e=$('#v11SaveStatus');if(e)e.textContent=s;};
  let lastUser='',lastFetched=0,cache=null,loading=false;
  function sb(){return typeof supabaseClient!=='undefined'?supabaseClient:null;}
  async function admin(){const s=sb();if(!s)return false;const a=await s.auth.getUser();if(!a.data?.user)return false;const r=await s.from('staff_roles').select('role').eq('user_id',a.data.user.id).maybeSingle();return ['admin','manager'].includes(r.data?.role);}
  async function fetchSettings(){if(loading||!sb())return;const now=Date.now();if(cache&&now-lastFetched<20000)return;loading=true;
    try{if(!await admin())return;const r=await sb().from('site_integrations_v11').select('carto_api_key,carto_style,carto_base_url').eq('id',1).maybeSingle();if(r.error)throw r.error;cache=r.data||{carto_api_key:'',carto_style:'voyager'};lastFetched=now;fill();}
    catch(e){note('No se pudo recuperar CARTO: '+e.message)}finally{loading=false;}
  }
  function fill(){const key=$('#cartoApiKey'),style=$('#cartoStyle'),base=$('#cartoBaseUrl');if(key&&cache){if(base&&document.activeElement!==base)base.value=cache.carto_base_url||'https://basemaps.cartocdn.com';if(document.activeElement!==key)key.value=cache.carto_api_key||'';if(document.activeElement!==style)style.value=cache.carto_style||'voyager';}}
  async function saveCarto(){const key=$('#cartoApiKey'),style=$('#cartoStyle'),base=$('#cartoBaseUrl');if(!key||!style||!base)return;const val=key.value.trim();const baseUrl=base.value.trim().replace(/\/+$/,'');try{const u=new URL(baseUrl);if(u.protocol!=='https:'||u.hostname!=='basemaps.cartocdn.com'||u.username||u.password||u.search||u.hash||u.pathname!=='/')throw Error();}catch{note('La URL debe ser https://basemaps.cartocdn.com');return;}if(!val){note('Escribe la API key de CARTO.');return;}if(!await admin()){note('Solo administración puede cambiar CARTO.');return;}
    note('Guardando CARTO en Supabase…');const row={id:1,carto_api_key:val,carto_style:style.value,carto_base_url:baseUrl,updated_at:new Date().toISOString()};
    const r=await sb().from('site_integrations_v11').upsert(row,{onConflict:'id'});
    if(r.error){note('No se guardó: '+r.error.message);return;}
    cache=row;lastFetched=Date.now();
    if(typeof state!=='undefined'&&state.config){state.config.map={provider:'carto',apiKey:'',style:style.value,attribution:'OpenStreetMap contributors, CARTO'};}
    try{if(typeof saveLocal==='function')saveLocal();else if(typeof save==='function')save();}catch{}
    note('CARTO guardado en Supabase. Actualizando mapas…');try{document.querySelectorAll('.vibra-map-error').forEach(e=>e.remove());[clientMap,originMap,tripMap].forEach(m=>{if(!m)return;m.eachLayer(layer=>{if(layer instanceof L.TileLayer){m.removeLayer(layer)}});addConfiguredTileLayer(m,m.getContainer().id)});}catch(e){note('Guardado. Vuelve a abrir el mapa: '+e.message)}
  }
  document.addEventListener('click',event=>{
    const b=event.target.closest('#saveMapConfig');if(b){event.preventDefault();event.stopImmediatePropagation();saveCarto().catch(e=>note(e.message));}
  },true);
  const observer=new MutationObserver(()=>{
    const btn=$('#saveMapConfig');if(btn&&!$('#v11SaveStatus')){const line=document.createElement('p');line.id='v11SaveStatus';line.className='small muted';line.style.marginTop='12px';line.textContent='La clave se guarda en Supabase, no solo en este navegador.';btn.insertAdjacentElement('afterend',line);fetchSettings();}
    const v9=$('#v9Admin');if(v9&&!v9.dataset.v11Compact){v9.dataset.v11Compact='1';v9.classList.add('v11-compact');}
    document.querySelectorAll('[data-admin-tab="deliveries"],[data-admin-tab="routes"],[data-admin-tab="delivery"]').forEach(x=>{x.textContent=x.textContent.replace(/Rutas y entregas|Rutas de servicios|Entregas y seguimiento/gi,'Reservas a domicilio');});
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){lastFetched=0;fetchSettings();}});
  setTimeout(fetchSettings,2000);
})();

