/* Módulo: js/fixes-v16.js | Función: lógica original del bloque 19 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
'use strict';
const V16_NOTIF_KEY='vibraerotica.v16.notifications';
function publicProfileCfg(){
  state.config.publicProfile ||= {cover:'',avatar:'',bio:'',socials:{},show:true};
  state.config.publicProfile.socials ||= {};
  if(state.config.publicProfile.donation_url===undefined)state.config.publicProfile.donation_url='';
  if(state.config.publicProfile.donation_label===undefined)state.config.publicProfile.donation_label='Apoyar con donación';
  if(state.config.publicProfile.location_label===undefined)state.config.publicProfile.location_label='';
  return state.config.publicProfile;
}
function businessLocationText(){
  const p=publicProfileCfg();
  const a=state.config.businessAddress||{};
  return p.location_label||[a.street,a.ext,a.colony,a.city,a.state].filter(Boolean).join(', ')||state.config.origin?.address||'Ubicación del negocio';
}
function v16Community(action,payload={}){if(!supabaseClient)return Promise.reject(Error('El sitio aún conecta con Supabase.'));return supabaseClient.rpc('catalog_community',{p_action:action,p_payload:payload}).then(r=>{if(r.error)throw r.error;if(r.data?.error)throw Error(r.data.error);return r.data})}
function readNotifState(){try{return JSON.parse(localStorage.getItem(V16_NOTIF_KEY)||'{"read":[],"readChats":{}}')}catch{return {read:[],readChats:{}}}}
function saveNotifState(x){localStorage.setItem(V16_NOTIF_KEY,JSON.stringify(x))}
function rateKey(){return 'vibraerotica.v16.rated.'+(customerSession?.user?.id||'guest')}
function hasRatedReminderDone(){return localStorage.getItem(rateKey())==='1'}
function setRatedDone(){localStorage.setItem(rateKey(),'1')}
function reminderNotifications(){
  const items=[];
  if(!customerSession){items.push({id:'rem-account',title:'Crea tu cuenta',text:'Guarda domicilios, favoritos e historial para no capturar todo nuevamente.',button:'Ir a Mi cuenta',action:()=>{renderCustomerProfile();openModal('customerProfileModal')}})}
  if(customerSession&&(!Array.isArray(customerAddresses)||customerAddresses.length===0)){items.push({id:'rem-address',title:'Guarda tus domicilios',text:'Agrega Casa, Trabajo u otras direcciones para pedir más rápido.',button:'Abrir Mi cuenta',action:()=>{renderCustomerProfile();openModal('customerProfileModal')}})}
  if(!hasRatedReminderDone()){items.push({id:'rem-rate',title:'¿Cómo fue tu experiencia?',text:'Califica el sitio, el servicio y la comida con estrellas y deja un comentario.',button:'Calificar ahora',action:()=>openRateBusinessModal()})}
  return items;
}
function dynamicNotifications(){
  const stateN=readNotifState();
  const read=new Set(stateN.read||[]),chatMap=stateN.readChats||{}; const list=[];
  if(trackingConfig?.notifications_enabled){
    (trackingEvents||[]).slice().sort((a,b)=>Number(b.id)-Number(a.id)).forEach(e=>{
      const id='event:'+e.id;if(read.has(id))return;const order=trackingOrders.find(o=>o.id===e.order_id);
      list.push({id,title:e.title||'Actualización de pedido',text:`${order?.folio?('Pedido '+order.folio+' · '):''}${new Date(e.created_at).toLocaleString('es-MX')}`,button:'Marcar como leído',action:()=>markNotificationRead(id)});
    });
    (trackingOrders||[]).filter(o=>o.chat_open&&o.last_message_sender==='admin'&&Number(o.last_message_id||0)>(Number(chatSeen[o.id]||0))).forEach(o=>{
      const id='chat:'+o.id+':'+(o.last_message_id||0);if(read.has(id)||Number(chatMap[o.id]||0)>=Number(o.last_message_id||0))return;
      list.push({id,title:'Nuevo mensaje del local',text:`Pedido ${o.folio||''}. El local respondió a tu pedido.`,button:'Abrir chat',action:()=>{markChatRead(o.id,o.last_message_id);openOrderChat(o.id)}});
    });
  }
  return list;
}
function pendingNotificationCount(){return reminderNotifications().length+dynamicNotifications().length}
function markNotificationRead(id){const s=readNotifState();s.read=Array.from(new Set([...(s.read||[]),id]));saveNotifState(s);paintNotifications();renderTrackingButtons()}
function markChatRead(orderId,messageId){const s=readNotifState();s.readChats=s.readChats||{};s.readChats[orderId]=Number(messageId||0);saveNotifState(s);paintNotifications();renderTrackingButtons()}

const v16RenderTrackingBase=renderTrackingButtons;
renderTrackingButtons=function(){
  try{v16RenderTrackingBase()}catch{}
  const adminBtn=document.getElementById('adminBtn'); if(!adminBtn)return;
  let bell=document.getElementById('notificationsBtn');
  if(!bell){bell=document.createElement('button');bell.id='notificationsBtn';bell.className='icon-btn followup-button';adminBtn.before(bell)}
  bell.classList.add('followup-button'); bell.title='Notificaciones'; bell.setAttribute('aria-label','Notificaciones'); bell.onclick=openNotifications;
  const count=pendingNotificationCount();
  bell.innerHTML=BELL_ICON+`<span class="followup-count">${count}</span>`;
  const bubble=bell.querySelector('.followup-count'); if(bubble)bubble.hidden=false;
  const cart=document.getElementById('cartCount'); if(cart){cart.textContent=String(Object.values(state.cart||{}).reduce((a,b)=>a+b,0)); cart.style.display='grid';}
 };

paintNotifications=function(){
  const host=document.getElementById('notificationsModal')?.querySelector('.modal-body'); if(!host)return;
  const reminders=reminderNotifications(), dynamic=dynamicNotifications();
  host.innerHTML=`<div class="v16-notif-group">
    <section class="v16-notif-card"><h4>Recordatorios importantes</h4><p>${reminders.length?'Completa estas acciones para mejorar tu experiencia.':'No tienes recordatorios pendientes.'}</p><div id="v16Reminders"></div></section>
    <section class="v16-notif-card"><h4>Actividad y seguimiento</h4><p>${dynamic.length?'Puedes marcar como leído lo que ya revisaste.':'No hay novedades nuevas por ahora.'}</p><div id="v16Dynamic"></div></section>
  </div>`;
  const r=document.getElementById('v16Reminders'), d=document.getElementById('v16Dynamic');
  r.innerHTML=reminders.map(n=>`<article class="notification-item"><strong>${esc(n.title)}</strong><small>${esc(n.text)}</small><div class="v16-notif-actions"><button class="btn secondary" data-v16-notif="${esc(n.id)}">${esc(n.button)}</button></div></article>`).join('')||'<p class="small muted">Sin recordatorios.</p>';
  d.innerHTML=dynamic.map(n=>`<article class="notification-item"><strong>${esc(n.title)}</strong><small>${esc(n.text)}</small><div class="v16-notif-actions"><button class="btn secondary" data-v16-notif="${esc(n.id)}">${esc(n.button)}</button><button class="btn ghost" data-v16-read="${esc(n.id)}">Marcar leído</button></div></article>`).join('')||'<p class="small muted">Sin avisos nuevos.</p>';
  [...host.querySelectorAll('[data-v16-notif]')].forEach(btn=>btn.onclick=()=>{const all=[...reminders,...dynamic];const item=all.find(x=>x.id===btn.dataset.v16Notif);item?.action?.();if(dynamic.find(x=>x.id===btn.dataset.v16Notif))markNotificationRead(btn.dataset.v16Notif)});
  [...host.querySelectorAll('[data-v16-read]')].forEach(btn=>btn.onclick=()=>markNotificationRead(btn.dataset.v16Read));
};
openNotifications=async function(){v4Modal('notificationsModal','Notificaciones');openModal('notificationsModal');try{await refreshTracking();paintNotifications();renderTrackingButtons()}catch(e){document.getElementById('notificationsModal').querySelector('.modal-body').textContent=e.message}};

function socialLabel(k){return ({facebook:'Facebook',instagram:'Instagram',tiktok:'TikTok',x:'X',telegram:'Telegram',whatsapp:'WhatsApp',youtube:'YouTube',website:'Sitio web'})[k]||k}
function statStars(n){n=Math.max(0,Math.min(5,Math.round(Number(n||0))));return '★'.repeat(n)+'☆'.repeat(5-n)}
async function fetchBusinessCommunity(){
  const empty={followers:0,following:false,goals:[],scores:{overall:0,service:0,food:0,reviews:0},reviews:[]};
  try{const s=await v16Community('summary',{}); const r=await v16Community('reviews',{}).catch(()=>({reviews:[]})); return {...empty,...s,reviews:r.reviews||[]}}catch{return empty}
}
async function toggleBusinessFollow(){ if(!customerSession){renderCustomerProfile();openModal('customerProfileModal');return toast('Inicia sesión para seguir al negocio.','info')} await v16Community('toggle_follow',{}); await openBusinessShowcase(); renderTrackingButtons(); }
async function openBusinessShowcase(){
  const modal=v4Modal('v16BusinessModal','Conoce el negocio'); modal.classList.add('v16-business-modal');
  const body=modal.querySelector('.modal-body');
  const p=publicProfileCfg(), info=await fetchBusinessCommunity();
  const reviews=(info.reviews||[]).slice(0,6); const links=Object.entries(p.socials||{}).filter(([,v])=>v).map(([k,v])=>`<a class="v16-social-link" href="${esc(v)}" target="_blank" rel="noopener">${esc(socialLabel(k))}</a>`).join('');
  body.innerHTML=`<div class="v16-business-shell">
    <section class="v16-business-hero">
      <div class="v16-business-cover" style="${p.cover?`background-image:url('${esc(p.cover)}')`:''}"></div>
      <div class="v16-business-overlay">
        ${p.avatar?`<img class="v16-business-avatar" src="${esc(p.avatar)}" alt="${esc(state.config.businessName)}">`:`<div class="v16-business-avatar v16-avatar-placeholder">${state.config.logo?`<img class="v16-business-avatar" src="${esc(state.config.logo)}" alt="Logo">`:FOOD.plate}</div>`}
        <div class="v16-business-title">
          <h2>${esc(state.config.businessName)}</h2>
          <p>${esc(p.bio||state.config.tagline||'Boutique y experiencias de bienestar para adultos')}</p>
          <div class="v16-business-meta">
            <span class="v16-meta-chip"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6 7-13a7 7 0 1 0-14 0c0 7 7 13 7 13Z"/><circle cx="12" cy="9" r="2"/></svg> ${esc(businessLocationText())}</span>
            <span class="v16-meta-chip"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3 2.8 6 6.6.9-4.8 4.7 1.2 6.6-5.8-3.1-5.8 3.1 1.2-6.6-4.8-4.7 6.6-.9Z"/></svg> ${Number(info.scores?.overall||0)?Number(info.scores.overall).toFixed(1):'Sin calificaciones'} · ${Number(info.scores?.reviews||0)} opiniones</span>
            <span class="v16-meta-chip"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M17 6a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5"/></svg> ${Number(info.followers||0)} seguidores</span>
          </div>
        </div>
        <div class="v16-business-actions">
          <button class="btn v16-glow-btn" id="v16ModalRate"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3 2.8 6 6.6.9-4.8 4.7 1.2 6.6-5.8-3.1-5.8 3.1 1.2-6.6-4.8-4.7 6.6-.9Z"/></svg> <span>Calificar</span></button>
          <button class="btn secondary" id="v16ModalFollow"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 8.2c0 4.5-8.8 11-8.8 11s-8.8-6.5-8.8-11a5 5 0 0 1 8.8-3.1 5 5 0 0 1 8.8 3.1Z"/></svg> <span>${info.following?'Siguiendo':'Seguir'}</span></button>
          ${p.donation_url?`<a class="btn secondary" href="${esc(p.donation_url)}" target="_blank" rel="noopener"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9C4 9 5 2 9 3c2 0 3 3 3 6Zm0 0c8 0 7-7 3-6-2 0-3 3-3 6Z"/></svg> <span>${esc(p.donation_label||'Donar')}</span></a>`:''}
          <button class="btn ghost" id="v16BackToMenuTop"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6M20 4 10 14M20 14v6H4V4h6"/></svg> <span>Menú principal</span></button>
        </div>
      </div>
    </section>
    <div class="v16-business-body">
      <div class="v16-business-main">
        <section class="v16-section-card"><h3>Comunidad y reseñas</h3><div class="v16-stats"><div class="v16-stat"><strong>${Number(info.scores?.overall||0)?Number(info.scores.overall).toFixed(1):'—'}</strong><span>Calificación general</span></div><div class="v16-stat"><strong>${Number(info.scores?.service||0)?Number(info.scores.service).toFixed(1):'—'}</strong><span>Servicio</span></div><div class="v16-stat"><strong>${Number(info.scores?.food||0)?Number(info.scores.food).toFixed(1):'—'}</strong><span>Experiencia</span></div></div><div class="v16-trigger-row" style="margin-top:12px"><button class="btn" id="v16InlineRate">Dejar comentario y calificar</button><button class="btn secondary" id="v16RefreshBusiness">Actualizar opiniones</button></div></section>
        <section class="v16-section-card"><h3>Comentarios recientes</h3><div class="v16-review-list">${reviews.map(x=>`<article class="v16-review-card"><div class="row between"><strong>${esc(x.display_name||'Cliente')}</strong><span class="v16-review-stars">${statStars(x.overall_rating||5)}</span></div><small class="muted">Servicio ${Number(x.service_rating||0)}/5 · Experiencia ${Number(x.food_rating||0)}/5</small><p>${esc(x.comment||'')}</p></article>`).join('')||'<p class="small muted">Aún no hay opiniones públicas.</p>'}</div></section>
      </div>
      <aside class="v16-business-side">
        <section class="v16-section-card"><h3>Redes sociales</h3><div class="v16-social-grid">${links||'<span class="small muted">Aún no se configuraron redes sociales.</span>'}</div></section>
        <section class="v16-section-card"><h3>Ubicación</h3><p>${esc(businessLocationText())}</p><div class="v16-trigger-row">${state.config.origin?.lat!=null?`<a class="btn secondary" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(String(state.config.origin.lat)+','+String(state.config.origin.lng))}">Abrir en mapa</a>`:''}</div></section>
        <section class="v16-section-card v16-donation"><h3>Apoyo al negocio</h3><p class="small muted">Puedes apoyar con una donación voluntaria o seguir nuestras redes.</p>${p.donation_url?`<a class="btn v16-glow-btn" href="${esc(p.donation_url)}" target="_blank" rel="noopener"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9C4 9 5 2 9 3c2 0 3 3 3 6Zm0 0c8 0 7-7 3-6-2 0-3 3-3 6Z"/></svg> <span>${esc(p.donation_label||'Donar')}</span></a>`:'<p class="small muted">El negocio aún no configuró un enlace de donación.</p>'}</section>
      </aside>
    </div>
    <div class="v16-back-menu"><button class="btn" id="v16BackToMenuBottom">Regresar al menú principal</button></div>
  </div>`;
  const closer=()=>{closeModal('v16BusinessModal');window.scrollTo({top:0,behavior:'smooth'})};
  body.querySelector('#v16BackToMenuTop').onclick=closer; body.querySelector('#v16BackToMenuBottom').onclick=closer;
  body.querySelector('#v16InlineRate').onclick=()=>{closeModal('v16BusinessModal');openRateBusinessModal()};
  body.querySelector('#v16ModalRate').onclick=()=>{closeModal('v16BusinessModal');openRateBusinessModal()};
  body.querySelector('#v16RefreshBusiness').onclick=()=>openBusinessShowcase();
  body.querySelector('#v16ModalFollow').onclick=async()=>{await toggleBusinessFollow()};
  openModal(modal.id);
}

async function submitBusinessReview(payload){return v16Community('review',payload)}
function starPicker(host,initial,onchange){let value=initial;const draw=()=>{host.innerHTML=[1,2,3,4,5].map(i=>`<button type="button" class="v14-star ${i<=value?'on':''}" data-star="${i}">★</button>`).join('');host.querySelectorAll('button').forEach(b=>b.onclick=()=>{value=Number(b.dataset.star);draw();onchange(value)})};draw();}
async function openRateBusinessModal(viewOnly=false){
  const m=v4Modal('v16RateBusinessModal',viewOnly?'Opiniones del negocio':'Calificar negocio');
  const body=m.querySelector('.modal-body'); let overall=5,service=5,food=5;
  const composeCard=viewOnly?'':'<section class="section-card"><h3>Califica tu experiencia</h3><div class="v14-review-grid"><div class="v14-score"><strong>Negocio</strong><div id="v16Overall" class="v14-stars"></div></div><div class="v14-score"><strong>Servicio</strong><div id="v16Service" class="v14-stars"></div></div><div class="v14-score"><strong>Experiencia</strong><div id="v16Food" class="v14-stars"></div></div></div><textarea class="textarea" id="v16Comment" maxlength="1000" placeholder="Escribe tu comentario"></textarea><div class="toolbar"><button class="btn v16-glow-btn" id="v16PublishReview">Publicar opinión</button><button class="btn ghost" id="v16OpenBusinessBack">Volver al perfil del negocio</button></div></section>';
  body.innerHTML=composeCard+'<section class="section-card"><h3>Opiniones recientes</h3><div id="v16ReviewRows">Cargando…</div></section>';
  if(!viewOnly){starPicker(document.getElementById('v16Overall'),5,v=>overall=v);starPicker(document.getElementById('v16Service'),5,v=>service=v);starPicker(document.getElementById('v16Food'),5,v=>food=v);
    document.getElementById('v16OpenBusinessBack').onclick=()=>{closeModal(m.id);openBusinessShowcase()};
    document.getElementById('v16PublishReview').onclick=async e=>panelRun(e.currentTarget,async()=>{if(!customerSession){closeModal(m.id);renderCustomerProfile();openModal('customerProfileModal');return toast('Inicia sesión para publicar tu opinión.','info')} const comment=document.getElementById('v16Comment').value.trim(); if(comment.length<3)throw Error('Escribe un comentario.'); await submitBusinessReview({overall,service,food,comment}); setRatedDone(); renderTrackingButtons(); await loadV16Reviews();},'Opinión publicada.');
  }
  async function loadV16Reviews(){try{const r=await v16Community('reviews',{});document.getElementById('v16ReviewRows').innerHTML=(r.reviews||[]).map(x=>`<article class="v16-review-card"><div class="row between"><strong>${esc(x.display_name||'Cliente')}</strong><span class="v16-review-stars">${statStars(x.overall_rating||5)}</span></div><small class="muted">Servicio ${Number(x.service_rating||0)}/5 · Experiencia ${Number(x.food_rating||0)}/5</small><p>${esc(x.comment||'')}</p></article>`).join('')||'<p class="small muted">Aún no hay opiniones.</p>'}catch(e){document.getElementById('v16ReviewRows').innerHTML=`<p class="small muted">${esc(e.message||'No se pudieron cargar las opiniones.')}</p>`}}
  openModal(m.id); await loadV16Reviews();
}

function ensureBusinessTrigger(){
  const host=document.getElementById('v15Experience'); if(!host)return;
  const actions=host.querySelector('.v15-experience-actions'); if(!actions||actions.querySelector('#v16OpenBusiness'))return;
  const btn=document.createElement('button'); btn.className='btn v16-glow-btn'; btn.id='v16OpenBusiness'; btn.innerHTML='🏪 <span>Conocer el negocio</span>'; btn.onclick=openBusinessShowcase; actions.prepend(btn);
}
new MutationObserver(()=>ensureBusinessTrigger()).observe(document.body,{childList:true,subtree:true});

async function fileToDataURL(file){return await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(Error('No se pudo leer la imagen.'));r.readAsDataURL(file)})}
function openCropper(opts){
  const {title='Ajustar imagen',src,aspect=1,shape='rect',apply}=opts;
  const m=v4Modal('v16CropModal',title); const body=m.querySelector('.modal-body');
  const stageH=Math.round(380/Math.max(.65,aspect));
  body.innerHTML=`<div class="v16-crop-layout"><div class="v16-crop-stage-wrap"><div class="v16-crop-stage" data-shape="${shape}" id="v16CropStage" style="aspect-ratio:${aspect};min-height:${Math.max(180,stageH)}px"><img id="v16CropImage" class="v16-crop-image" src="${src}"></div><div class="small muted">Arrastra con los controles para decidir qué parte se verá en la imagen final.</div></div><div class="v16-crop-controls"><label class="field"><span>Zoom</span><input class="v16-range" id="v16Zoom" type="range" min="1" max="3" step="0.01" value="1"></label><label class="field"><span>Horizontal</span><input class="v16-range" id="v16X" type="range" min="-100" max="100" step="1" value="0"></label><label class="field"><span>Vertical</span><input class="v16-range" id="v16Y" type="range" min="-100" max="100" step="1" value="0"></label><div class="v16-crop-preview"><div class="v16-crop-thumb ${shape==='circle'?'circle':'rect'}"><img id="v16CropMini" src="${src}"></div><span class="small muted">Vista previa</span></div><div class="toolbar"><button class="btn" id="v16CropApply">Usar recorte</button><button class="btn ghost" data-close-modal="v16CropModal">Cancelar</button></div></div></div>`;
  const stage=body.querySelector('#v16CropStage'), img=body.querySelector('#v16CropImage'), mini=body.querySelector('#v16CropMini');
  let zoom=1, x=0, y=0, naturalW=0, naturalH=0;
  function redraw(){if(!naturalW||!naturalH)return; const fw=stage.clientWidth, fh=stage.clientHeight; const base=Math.max(fw/naturalW, fh/naturalH); const displayW=naturalW*base*zoom, displayH=naturalH*base*zoom; const maxX=Math.max(0,(displayW-fw)/2), maxY=Math.max(0,(displayH-fh)/2); const px=(x/100)*maxX, py=(y/100)*maxY; img.style.width=displayW+'px'; img.style.height=displayH+'px'; img.style.transform=`translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`; mini.style.objectPosition=`${50+(x/2)}% ${50+(y/2)}%`; mini.style.transform=`scale(${Math.min(1.9,zoom)})`; stage.dataset.left=String(fw/2-displayW/2+px); stage.dataset.top=String(fh/2-displayH/2+py); stage.dataset.scale=String(base*zoom); }
  const onload=()=>{naturalW=img.naturalWidth;naturalH=img.naturalHeight;redraw()}; if(img.complete)onload(); else img.onload=onload;
  body.querySelector('#v16Zoom').oninput=e=>{zoom=Number(e.target.value);redraw()}; body.querySelector('#v16X').oninput=e=>{x=Number(e.target.value);redraw()}; body.querySelector('#v16Y').oninput=e=>{y=Number(e.target.value);redraw()};
  body.querySelector('#v16CropApply').onclick=()=>{const fw=stage.clientWidth, fh=stage.clientHeight; const scale=Number(stage.dataset.scale||1), left=Number(stage.dataset.left||0), top=Number(stage.dataset.top||0); const sx=Math.max(0,-left/scale), sy=Math.max(0,-top/scale), sw=Math.min(naturalW,fw/scale), sh=Math.min(naturalH,fh/scale); const canvas=document.createElement('canvas'); const outW=aspect>=1?1200:900, outH=Math.round(outW/aspect); canvas.width=outW; canvas.height=outH; const ctx=canvas.getContext('2d'); ctx.drawImage(img,sx,sy,sw,sh,0,0,outW,outH); const data=canvas.toDataURL('image/jpeg',.92); closeModal('v16CropModal'); apply(data)};
  openModal(m.id);
}

const v16CustomerProfileBase=renderCustomerProfile;
renderCustomerProfile=function(){
  v16CustomerProfileBase();
  if(!customerSession||customerAuthView==='update')return;
  const input=document.getElementById('profilePhoto');
  if(input&&!input.dataset.v16Bound){
    input.dataset.v16Bound='1';
    const note=document.createElement('div'); note.className='small muted'; note.textContent='Puedes subir cualquier tamaño de imagen y ajustar el recorte antes de guardar.'; input.parentElement.append(note);
    input.onchange=async e=>{try{if(!e.target.files?.[0])return; const src=await fileToDataURL(e.target.files[0]); openCropper({title:'Ajustar foto de perfil',src,aspect:1,shape:'circle',apply:(data)=>{avatarDraft=data; const photo=document.querySelector('#customerProfileModal .profile-photo'); if(photo)photo.src=data; toast('Foto preparada. Pulsa Guardar perfil.','ok')}})}catch(err){toast(err.message,'error')}};
  }
};

async function renderV16ProfileAdmin(c){
  const p=publicProfileCfg(); let goals=[]; try{goals=(await v16Community('goals_admin',{})).goals||[]}catch{}
  const s=p.socials||{};
  c.innerHTML=`<section class="section-card"><h3>Portada y perfil público</h3><div class="admin-grid two"><label class="field"><span>URL de portada</span><input class="input" id="v16Cover" value="${esc(p.cover||'')}"></label><label class="field"><span>URL de foto de perfil</span><input class="input" id="v16Avatar" value="${esc(p.avatar||'')}"></label><label class="field"><span>Subir portada</span><input class="input" id="v16CoverUpload" type="file" accept="image/png,image/jpeg,image/webp"></label><label class="field"><span>Subir foto de perfil</span><input class="input" id="v16AvatarUpload" type="file" accept="image/png,image/jpeg,image/webp"></label></div><label class="row v19-logo-reuse"><input type="checkbox" id="v16UseLogo" __REPLACE_ME__ > Usar el logotipo actual como foto del perfil público</label><div class="admin-grid two"><div class="v16-crop-thumb rect">${p.cover?`<img id="v16CoverPreview" src="${esc(p.cover)}">`:'<img id="v16CoverPreview" style="display:none">'} </div><div class="v16-crop-thumb circle">${p.avatar?`<img id="v16AvatarPreview" src="${esc(p.avatar)}">`:'<img id="v16AvatarPreview" style="display:none">'}</div></div><label class="field"><span>Descripción</span><textarea class="textarea" id="v16Bio">${esc(p.bio||'')}</textarea></label><div class="admin-grid two"><label class="field"><span>Texto de ubicación</span><input class="input" id="v16LocationLabel" value="${esc(p.location_label||'')}" placeholder="Ej. Manzanillo, Colima"></label><label class="field"><span>Enlace de donación</span><input class="input" id="v16DonationUrl" value="${esc(p.donation_url||'')}" placeholder="https://..."></label><label class="field"><span>Texto del botón de donación</span><input class="input" id="v16DonationLabel" value="${esc(p.donation_label||'Apoyar con donación')}" maxlength="40"></label><label class="row"><input id="v16ProfileShow" type="checkbox" ${p.show!==false?'checked':''}> Mostrar perfil público</label></div></section>
 <section class="section-card"><h3>Redes sociales</h3><div class="admin-grid two">${['facebook','instagram','tiktok','x','telegram','whatsapp','youtube','website'].map(k=>`<label class="field"><span>${socialLabel(k)}</span><input class="input" data-v16-social="${k}" value="${esc(s[k]||'')}" placeholder="https://..."></label>`).join('')}</div><button class="btn v16-glow-btn" id="v16SaveProfile">${UI.save}<span>Guardar perfil del negocio</span></button></section>
 <section class="section-card"><h3>Metas de seguidores / likes externos</h3><p class="small muted">Para actualizar automáticamente las metas usa la función Edge social-metrics con API oficial del proveedor. Aquí puedes crear, sincronizar y eliminar metas.</p><div class="admin-grid two"><label class="field"><span>Plataforma</span><select class="select" id="v16GoalPlatform">${['facebook','instagram','tiktok','x','telegram','youtube'].map(x=>`<option value="${x}">${socialLabel(x)}</option>`).join('')}</select></label><label class="field"><span>Meta</span><input class="input" id="v16GoalTarget" type="number" min="1" value="1000"></label><label class="field"><span>Texto</span><input class="input" id="v16GoalLabel" placeholder="Llegar a 1,000 seguidores"></label><label class="field"><span>URL que visitará el usuario</span><input class="input" id="v16GoalUrl" placeholder="https://..."></label><label class="field"><span>ID externo / username</span><input class="input" id="v16GoalExternal" placeholder="page_id, user_id, chat_id..."></label><label class="field"><span>Métrica</span><select class="select" id="v16GoalMetric"><option value="followers">Seguidores</option><option value="likes">Likes</option><option value="members">Miembros</option></select></label></div><button class="btn secondary" id="v16GoalSave">${UI.plus}<span>Agregar meta</span></button></section>
 <section class="section-card"><h3>Metas activas</h3><div id="v16GoalList">${goals.map(g=>`<article class="v14-goal"><div class="v14-goal-head"><span>${esc(g.label)}</span><span>${Number(g.current_count||0)} / ${Number(g.target_count||0)}</span></div><div class="v14-goal-bar"><span style="width:${Math.min(100,Number(g.current_count||0)/Math.max(1,Number(g.target_count||1))*100)}%"></span></div><div class="toolbar"><button class="btn secondary" data-v16-syncgoal="${esc(g.id)}">${UI.refresh}<span>Actualizar métrica</span></button><button class="btn ghost" data-v16-deletegoal="${esc(g.id)}">${UI.trash}<span>Eliminar</span></button></div></article>`).join('')||'<p class="small muted">Sin metas.</p>'}</div></section>`;
  const bindCropUpload=(id,aspect,shape,inputId,previewId)=>{const el=document.getElementById(id); el.onchange=async e=>{try{if(!e.target.files?.[0])return; const src=await fileToDataURL(e.target.files[0]); openCropper({title:shape==='circle'?'Ajustar foto de perfil':'Ajustar portada',src,aspect,shape,apply:(data)=>{document.getElementById(inputId).value=data; const img=document.getElementById(previewId); img.src=data; img.style.display='block'; toast('Imagen ajustada. Guarda el perfil para aplicar.','ok')}})}catch(err){toast(err.message,'error')}}};
  bindCropUpload('v16CoverUpload',16/5,'rect','v16Cover','v16CoverPreview'); bindCropUpload('v16AvatarUpload',1,'circle','v16Avatar','v16AvatarPreview');
  const reuseLogo=document.getElementById('v16UseLogo');
  reuseLogo.disabled=!state.config.logo;
  if(!state.config.logo)reuseLogo.parentElement.title='Primero configura el logotipo en Personalización.';
  reuseLogo.onchange=()=>{
    if(!reuseLogo.checked)return;
    document.getElementById('v16Avatar').value=state.config.logo;
    const img=document.getElementById('v16AvatarPreview');img.src=state.config.logo;img.style.display='block';
  };
  document.getElementById('v16SaveProfile').onclick=e=>panelRun(e.currentTarget,async()=>{state.config.publicProfile={...state.config.publicProfile,cover:document.getElementById('v16Cover').value.trim(),avatar:(document.getElementById('v16UseLogo').checked&&state.config.logo?state.config.logo:document.getElementById('v16Avatar').value.trim()),bio:document.getElementById('v16Bio').value.trim(),show:document.getElementById('v16ProfileShow').checked,location_label:document.getElementById('v16LocationLabel').value.trim(),donation_url:document.getElementById('v16DonationUrl').value.trim(),donation_label:document.getElementById('v16DonationLabel').value.trim(),socials:Object.fromEntries([...c.querySelectorAll('[data-v16-social]')].map(x=>[x.dataset.v16Social,x.value.trim()]))}; saveLocal(); await syncAdminStateToCloud(); ensureBusinessTrigger();},'Perfil guardado.');
  document.getElementById('v16GoalSave').onclick=e=>panelRun(e.currentTarget,async()=>{await v16Community('goal_save',{platform:document.getElementById('v16GoalPlatform').value,label:document.getElementById('v16GoalLabel').value.trim(),target_count:Number(document.getElementById('v16GoalTarget').value),target_url:document.getElementById('v16GoalUrl').value.trim(),external_id:document.getElementById('v16GoalExternal').value.trim(),metric_kind:document.getElementById('v16GoalMetric').value}); await renderV16ProfileAdmin(c)},'Meta agregada.');
  c.querySelectorAll('[data-v16-deletegoal]').forEach(b=>b.onclick=e=>panelRun(e.currentTarget,async()=>{await v16Community('goal_delete',{id:b.dataset.v16Deletegoal}); await renderV16ProfileAdmin(c)},'Meta eliminada.'));
  c.querySelectorAll('[data-v16-syncgoal]').forEach(b=>b.onclick=e=>panelRun(e.currentTarget,async()=>{if(!supabaseClient)throw Error('Sin conexión con Supabase.'); const {data,error}=await supabaseClient.functions.invoke('social-metrics',{body:{action:'sync_goal',goal_id:b.dataset.v16Syncgoal}}); if(error||data?.error)throw Error(data?.error||error.message||'No se pudo sincronizar la meta.'); await renderV16ProfileAdmin(c)},'Métrica actualizada.'));
 }

const v16AdminPaneBase=renderAdminPane;
renderAdminPane=async function(id){
  if(id==='profile'){activeAdmin=id; document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===id)); const c=document.getElementById('adminContent'); c.innerHTML='<p class="muted">Cargando…</p>'; const row=document.createElement('div'); row.className='faithful-session'; const who=document.createElement('span'); who.className='small muted'; who.textContent=(adminSession?.user?.email||'')+' · '+(panelAccess.owner?'Propietario':'Colaborador'); const logout=document.createElement('button'); logout.className='btn ghost'; logout.innerHTML=UI.lock+'<span>Cerrar sesión</span>'; logout.onclick=()=>adminSignOut(); c.replaceChildren(row); row.append(who,logout); const inner=document.createElement('div'); c.append(inner); return renderV16ProfileAdmin(inner)}
  const result=await v16AdminPaneBase(id); if(id==='business'||id==='products')ensureBusinessTrigger(); return result;
 };

// extra bindings after current render lifecycle
const v16AuthChangedBase=customerAuthChanged;
customerAuthChanged=async function(session){await v16AuthChangedBase(session); renderTrackingButtons(); ensureBusinessTrigger();};
const v16ClearBase=clearCustomerState; clearCustomerState=function(){v16ClearBase(); renderTrackingButtons(); ensureBusinessTrigger();};
const v16AddressEditorBase=openFoodAddressEditor; openFoodAddressEditor=function(...args){return v16AddressEditorBase.apply(this,args)};

// initial pass
publicProfileCfg();
renderTrackingButtons();
ensureBusinessTrigger();
setTimeout(()=>{renderTrackingButtons();ensureBusinessTrigger()},800);
})();
