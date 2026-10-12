/* Módulo: js/enhancements-v18.js | Función: lógica original del bloque 21 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
'use strict';
const V18_MORE_ICON=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
const DAY_KEYS=['sun','mon','tue','wed','thu','fri','sat'];
const DAY_NAMES={sun:'Domingo',mon:'Lunes',tue:'Martes',wed:'Miércoles',thu:'Jueves',fri:'Viernes',sat:'Sábado'};

function v18Cfg(){
  state.config.businessHours ||= {};
  DAY_KEYS.forEach(k=>{if(!state.config.businessHours[k])state.config.businessHours[k]={open:k!=='sun',allDay:false,start:'09:00',end:'20:00'}});
  return state.config;
}
function v18RemoveDuplicateQuickActions(){document.querySelectorAll('.v12-home-nav [data-v17-quick="favorites"],.v12-home-nav [data-v17-quick="coupons"]').forEach(x=>x.remove())}
function v18EnsureMoreButton(){
  const header=document.querySelector('.topbar .header'); if(!header||document.getElementById('v18MoreButton'))return;
  const b=document.createElement('button'); b.id='v18MoreButton'; b.className='icon-btn v18-more-button'; b.type='button'; b.title='Más opciones'; b.setAttribute('aria-label','Más opciones'); b.innerHTML=V18_MORE_ICON; b.setAttribute('aria-haspopup','dialog'); b.setAttribute('aria-controls','v12MoreModal'); b.onclick=()=>{if(typeof window.v12OpenMore==='function'){window.v12OpenMore();b.setAttribute('aria-expanded','true');}else{toast('El menú no está disponible. Actualiza la página.','error')}};
  const cart=document.getElementById('cartBtn'); if(cart)header.insertBefore(b,cart); else header.append(b);
}
const v18HeaderBase=renderHeader;
renderHeader=function(){v18HeaderBase();v18EnsureMoreButton();v18RemoveDuplicateQuickActions()};
const v18TrackingBase=renderTrackingButtons;
renderTrackingButtons=function(){try{v18TrackingBase()}catch{}v18EnsureMoreButton();v18RemoveDuplicateQuickActions()};
new MutationObserver(()=>{v18EnsureMoreButton();v18RemoveDuplicateQuickActions()}).observe(document.documentElement,{subtree:true,childList:true});

/* ---------- Horarios ---------- */
function v18TimeToMinutes(t){const m=String(t||'').match(/^(\d{1,2}):(\d{2})$/);return m?Number(m[1])*60+Number(m[2]):0}
function v18TodayKey(d=new Date()){return DAY_KEYS[d.getDay()]}
function v18HoursStatus(now=new Date()){
  v18Cfg(); const cfg=state.config.businessHours, key=v18TodayKey(now), row=cfg[key];
  if(!row?.open)return {open:false,text:'Cerrado hoy'};
  if(row.allDay)return {open:true,text:'Abierto 24 horas'};
  const cur=now.getHours()*60+now.getMinutes(), start=v18TimeToMinutes(row.start), end=v18TimeToMinutes(row.end);
  const isOpen=end>start?(cur>=start&&cur<end):(cur>=start||cur<end);
  return {open:isOpen,text:isOpen?`Abierto · cierra ${row.end}`:`Cerrado · horario ${row.start}–${row.end}`};
}
function v18HoursHtml(){
  v18Cfg();return `<div class="v18-hours-list">${['mon','tue','wed','thu','fri','sat','sun'].map(k=>{const r=state.config.businessHours[k];return `<div class="v18-hours-line"><strong>${DAY_NAMES[k]}</strong><span>${!r.open?'Cerrado':r.allDay?'24 horas':`${esc(r.start)} – ${esc(r.end)}`}</span></div>`}).join('')}</div>`;
}
const v18BusinessAdminBase=renderBusinessAdmin;
renderBusinessAdmin=function(c){
  v18Cfg();v18BusinessAdminBase(c); if(!c||document.getElementById('v18HoursAdmin'))return;
  const sec=document.createElement('section');sec.id='v18HoursAdmin';sec.className='section-card';
  sec.innerHTML=`<h3>Horarios del negocio</h3><p class="small muted">Configura por día si el local abre, trabaja 24 horas o tiene un horario específico. Esto se mostrará a los clientes en el perfil del negocio.</p><div class="v18-hours-admin">${['mon','tue','wed','thu','fri','sat','sun'].map(k=>{const r=state.config.businessHours[k];return `<div class="v18-hours-row" data-day="${k}"><strong>${DAY_NAMES[k]}</strong><label class="row"><input type="checkbox" data-open ${r.open?'checked':''}> Abierto</label><label class="field"><span>Desde</span><input class="input" type="time" data-start value="${esc(r.start||'09:00')}" ${!r.open||r.allDay?'disabled':''}></label><label class="field"><span>Hasta</span><input class="input" type="time" data-end value="${esc(r.end||'20:00')}" ${!r.open||r.allDay?'disabled':''}></label><label class="row"><input type="checkbox" data-all-day ${r.allDay?'checked':''} ${!r.open?'disabled':''}> 24 horas</label></div>`}).join('')}</div><button class="btn" id="v18SaveHours">${UI.save}<span>Guardar horarios</span></button>`;
  const target=document.getElementById('v15PinSection')||c.firstElementChild; target?.after(sec);
  sec.querySelectorAll('[data-day]').forEach(row=>{const op=row.querySelector('[data-open]'),all=row.querySelector('[data-all-day]'),start=row.querySelector('[data-start]'),end=row.querySelector('[data-end]');const sync=()=>{all.disabled=!op.checked;start.disabled=!op.checked||all.checked;end.disabled=!op.checked||all.checked};op.onchange=sync;all.onchange=sync;sync()});
  document.getElementById('v18SaveHours').onclick=e=>panelRun(e.currentTarget,async()=>{sec.querySelectorAll('[data-day]').forEach(row=>{state.config.businessHours[row.dataset.day]={open:row.querySelector('[data-open]').checked,allDay:row.querySelector('[data-all-day]').checked,start:row.querySelector('[data-start]').value||'09:00',end:row.querySelector('[data-end]').value||'20:00'}});saveLocal();await syncAdminStateToCloud()},'Horarios guardados.');
};

/* ---------- Perfil del negocio con horarios ---------- */
function v18ProfileCfg(){state.config.publicProfile ||= {cover:'',avatar:'',bio:'',socials:{},show:true};state.config.publicProfile.socials ||= {};return state.config.publicProfile}
function v18LocationText(){const p=v18ProfileCfg(),a=state.config.businessAddress||{};return p.location_label||[[a.street,a.ext].filter(Boolean).join(' '),a.neighborhood||a.colony,a.municipality||a.city,a.state].filter(Boolean).join(', ')||state.config.origin?.address||'Ubicación del negocio'}
function v18SocialLabel(k){return ({facebook:'Facebook',instagram:'Instagram',tiktok:'TikTok',x:'X',telegram:'Telegram',whatsapp:'WhatsApp',youtube:'YouTube',website:'Sitio web'})[k]||k}
async function v18Community(action,payload={}){if(!supabaseClient)throw Error('Conectando con Supabase.');const {data,error}=await supabaseClient.rpc('catalog_community',{p_action:action,p_payload:payload});if(error)throw error;if(data?.error)throw Error(data.error);return data}
async function v18OpenBusiness(){
  v18Cfg();const p=v18ProfileCfg(),status=v18HoursStatus();let info={followers:0,following:false,scores:{overall:0,reviews:0},reviews:[]};
  try{const s=await v18Community('summary',{}),r=await v18Community('reviews',{});info={...info,...s,reviews:r.reviews||[]}}catch{}
  const m=v4Modal('v18BusinessModal','Información del negocio'),body=m.querySelector('.modal-body');m.classList.add('v18-business-modal');
  const socials=Object.entries(p.socials||{}).filter(([,url])=>url).map(([k,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener">${esc(v18SocialLabel(k))}</a>`).join('');
  body.innerHTML=`<div class="v18-business-shell"><section class="v18-business-hero"><div class="v18-business-cover" style="${p.cover?`background-image:url('${esc(p.cover)}')`:''}"></div><div class="v18-business-overlay">${(p.avatar||state.config.logo)?`<img class="v18-business-avatar" src="${esc(p.avatar||state.config.logo)}" alt="Perfil del negocio">`:`<div class="v18-business-avatar"></div>`}<div class="v18-business-title"><h2>${esc(state.config.businessName)}</h2><p>${esc(p.bio||state.config.tagline||'')}</p><div class="v18-business-meta"><span class="v18-business-chip"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6 7-13a7 7 0 1 0-14 0c0 7 7 13 7 13Z"/><circle cx="12" cy="9" r="2"/></svg> ${esc(v18LocationText())}</span><span class="v18-business-chip">${status.open?'<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="7"/></svg>':'<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="7"/></svg>'} ${esc(status.text)}</span><span class="v18-business-chip"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3 2.8 6 6.6.9-4.8 4.7 1.2 6.6-5.8-3.1-5.8 3.1 1.2-6.6-4.8-4.7 6.6-.9Z"/></svg> ${Number(info.scores?.overall||0)?Number(info.scores.overall).toFixed(1):'Sin calificaciones'} · ${Number(info.scores?.reviews||0)} opiniones</span><span class="v18-business-chip"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M17 6a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5"/></svg> ${Number(info.followers||0)} seguidores</span></div></div><div class="v18-business-actions"><button class="btn" id="v18BusinessRate"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3 2.8 6 6.6.9-4.8 4.7 1.2 6.6-5.8-3.1-5.8 3.1 1.2-6.6-4.8-4.7 6.6-.9Z"/></svg> <span>Calificar</span></button><button class="btn secondary" id="v18BusinessFollow"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 8.2c0 4.5-8.8 11-8.8 11s-8.8-6.5-8.8-11a5 5 0 0 1 8.8-3.1 5 5 0 0 1 8.8 3.1Z"/></svg> <span>${info.following?'Siguiendo':'Seguir'}</span></button>${/^https:\/\//i.test(p.donation_url||'')?`<a class="btn secondary" href="${esc(p.donation_url)}" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9C4 9 5 2 9 3c2 0 3 3 3 6Zm0 0c8 0 7-7 3-6-2 0-3 3-3 6Z"/></svg> <span>${esc(p.donation_label||'Apoyar con donación')}</span></a>`:''}<button class="btn ghost" id="v18BusinessBack"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6M20 4 10 14M20 14v6H4V4h6"/></svg> <span>Menú principal</span></button></div></div></section><div class="v18-business-body"><section class="v18-business-card"><h3>Horarios</h3><div class="v18-hours-status ${status.open?'open':'closed'}">${status.open?'●':'●'} ${esc(status.text)}</div>${v18HoursHtml()}</section><section class="v18-business-card"><h3>Ubicación y redes</h3><p>${esc(v18LocationText())}</p><div class="v18-business-socials">${socials||'<span class="small muted">Sin redes configuradas.</span>'}</div><div class="toolbar" style="margin-top:12px"><button class="btn secondary" id="v18BusinessDirections">${UI.map}<span>Cómo llegar</span></button></div></section><section class="v18-business-card v18-business-reviews"><h3>Comentarios recientes</h3>${(info.reviews||[]).slice(0,6).map(x=>`<article class="v18-business-review"><div class="row between"><strong>${esc(x.display_name||'Cliente')}</strong><span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3 2.8 6 6.6.9-4.8 4.7 1.2 6.6-5.8-3.1-5.8 3.1 1.2-6.6-4.8-4.7 6.6-.9Z"/></svg> ${Number(x.overall_rating||5)}/5</span></div><p>${esc(x.comment||'')}</p><small class="muted">Servicio ${Number(x.service_rating||0)}/5 · Experiencia ${Number(x.food_rating||0)}/5</small></article>`).join('')||'<p class="small muted">Aún no hay comentarios.</p>'}</section></div></div>`;
  document.getElementById('v18BusinessBack').onclick=()=>{closeModal(m.id);window.scrollTo({top:0,behavior:'smooth'})};
  document.getElementById('v18BusinessDirections').onclick=()=>window.v17RouteToBusiness?.();
  document.getElementById('v18BusinessRate').onclick=()=>{closeModal(m.id);if(typeof openRateBusinessModal==='function')openRateBusinessModal();else if(typeof v14OpenRating==='function')v14OpenRating()};
  document.getElementById('v18BusinessFollow').onclick=async()=>{if(!customerSession){closeModal(m.id);renderCustomerProfile();openModal('customerProfileModal');return}try{await v18Community('toggle_follow',{});closeModal(m.id);v18OpenBusiness()}catch(e){toast(e.message,'error')}};
  openModal(m.id);
}
window.v18OpenBusiness=v18OpenBusiness;

/* Reemplaza el botón del bloque plegable para que sí abra el perfil V18. */
function v18WireExperience(){const b=document.getElementById('v17KnowBusiness')||document.getElementById('v16OpenBusiness');if(b)b.onclick=v18OpenBusiness}
new MutationObserver(()=>v18WireExperience()).observe(document.body,{subtree:true,childList:true});

/* ---------- Domicilios: búsqueda estructurada + GPS + pin movible + reverse geocode ---------- */
async function v18FetchJson(url){const r=await fetch(url,{headers:{'Accept-Language':'es-MX,es;q=0.9'},signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('El servicio de mapas no respondió.');return await r.json()}
async function v18SearchAddress(fields){
  const street=[fields.number,fields.street].filter(Boolean).join(' ').trim();
  const params=new URLSearchParams({format:'jsonv2',addressdetails:'1',limit:'5',countrycodes:'mx'});if(street)params.set('street',street);if(fields.municipality)params.set('city',fields.municipality);if(fields.state)params.set('state',fields.state);if(fields.postal_code)params.set('postalcode',fields.postal_code);
  let data=[];try{data=await v18FetchJson('https://nominatim.openstreetmap.org/search?'+params.toString())}catch{}
  if(!data.length){const q=[street,fields.colony,fields.postal_code,fields.municipality,fields.state,'México'].filter(Boolean).join(', ');data=await v18FetchJson('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=mx&q='+encodeURIComponent(q))}
  if(!data.length)throw Error('No encontramos una coincidencia exacta. Usa “Mi ubicación exacta” o mueve el pin a la entrada.');return data;
}
async function v18Reverse(lat,lng){const d=await v18FetchJson(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`);return d}
function v18FillAddress(a){
  const ad=a?.address||{};const set=(id,v,force=false)=>{const el=document.getElementById('address_'+id);if(el&&(force||!el.value.trim())&&v)el.value=v};
  set('street',ad.road||ad.pedestrian||ad.residential||ad.footway,true);set('number',ad.house_number,true);set('colony',ad.neighbourhood||ad.suburb||ad.quarter||ad.village,true);set('postal_code',ad.postcode,true);set('municipality',ad.city||ad.town||ad.municipality||ad.county,true);set('state',ad.state,true);
}
openFoodAddressEditor=function(a){
  if(!customerSession){renderCustomerProfile();openModal('customerProfileModal');return}
  const serial=++addressEditorSerial,user=customerSession.user.id,m=v4Modal('foodAddressModal',a?'Editar domicilio':'Guardar domicilio'),host=m.querySelector('.modal-body');let point=a?{lat:Number(a.lat),lng:Number(a.lng)}:null,pin=null;
  const current=()=>serial===addressEditorSerial&&customerSession?.user.id===user;
  host.innerHTML=`<p class="small muted">Para mayor precisión usa tu ubicación actual o busca con calle, número, colonia y código postal. Después mueve el pin exactamente a la entrada.</p><div class="admin-grid two">${[['label','Nombre del domicilio',a?.label||'Casa'],['street','Calle',a?.street||''],['number','Número exterior / S/N',a?.number||''],['colony','Colonia',a?.colony||''],['postal_code','Código postal',a?.postal_code||''],['municipality','Municipio / ciudad',a?.municipality||'Manzanillo'],['state','Estado',a?.state||'Colima'],['references','Referencias',a?.reference_text||'']].map(([id,label,value])=>panelField('address_'+id,label,value)).join('')}</div><div class="v18-address-actions"><button class="btn" id="v18ExactGps">${UI.pin}<span>Usar mi ubicación exacta</span></button><button class="btn secondary" id="v18FindAddress">${UI.search}<span>Buscar dirección escrita</span></button></div><div id="v18AddressSuggestions" class="v18-address-suggestions"></div><div class="map address-editor-map v18-address-map" id="foodAddressMap"></div><p id="addressPointStatus" class="small">${point?'Pin guardado; muévelo a la entrada si hace falta.':'Selecciona una coincidencia o toca/mueve el pin en el mapa.'}</p><label class="row"><input type="checkbox" id="addressDefault" ${a?.is_default||!customerAddresses.length?'checked':''}> Usar como predeterminado</label><button class="btn full" id="addressSave">${UI.save}<span>Guardar y usar domicilio</span></button>`;
  openModal(m.id);
  const choose=async(lat,lng,reverse=false,accuracy=null)=>{if(!current())return;point={lat:Number(lat),lng:Number(lng)};if(pin)pin.setLatLng([point.lat,point.lng]);else if(publicAddressMap){pin=L.marker([point.lat,point.lng],{draggable:true}).addTo(publicAddressMap);pin.on('dragend',async e=>{const p=e.target.getLatLng();await choose(p.lat,p.lng,true)})}const el=document.getElementById('addressPointStatus');if(el)el.innerHTML=`Pin: ${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}${accuracy!=null?`<span class="v18-accuracy">Precisión aprox. ${Math.round(accuracy)} m</span>`:''}`;if(reverse){try{const r=await v18Reverse(point.lat,point.lng);if(current())v18FillAddress(r)}catch{}}};
  setTimeout(()=>{if(!current()||!host.isConnected||!m.classList.contains('show'))return;if(publicAddressMap)publicAddressMap.remove();if(typeof L==='undefined'){document.getElementById('addressPointStatus').textContent='No cargó el mapa.';return}const o=point||state.config.origin||{lat:19.1,lng:-104.3};publicAddressMap=L.map('foodAddressMap',{rotate:true,touchRotate:true,dragRotate:true,shiftKeyRotate:true,rotateControl:{position:"topright",behavior:"reset",closeOnZeroBearing:false}}).setView([Number(o.lat),Number(o.lng)],point?17:14);addConfiguredTileLayer(publicAddressMap,'foodAddressMap');publicAddressMap.on('click',e=>choose(e.latlng.lat,e.latlng.lng,true));if(point)choose(point.lat,point.lng)},100);
  document.getElementById('v18ExactGps').onclick=e=>panelRun(e.currentTarget,async()=>{const p=await foodGps();await choose(p.coords.latitude,p.coords.longitude,true,p.coords.accuracy);publicAddressMap?.setView([p.coords.latitude,p.coords.longitude],19)},'Ubicación detectada. Ajusta el pin si es necesario.');
  document.getElementById('v18FindAddress').onclick=e=>panelRun(e.currentTarget,async()=>{const f=Object.fromEntries(['street','number','colony','postal_code','municipality','state'].map(k=>[k,document.getElementById('address_'+k).value.trim()]));const rows=await v18SearchAddress(f),box=document.getElementById('v18AddressSuggestions');box.innerHTML=rows.map((r,i)=>`<button type="button" class="v18-address-suggestion" data-i="${i}"><strong>${esc(r.display_name.split(',').slice(0,2).join(','))}</strong><small>${esc(r.display_name)}</small></button>`).join('');box.querySelectorAll('[data-i]').forEach(b=>b.onclick=async()=>{const r=rows[Number(b.dataset.i)];await choose(Number(r.lat),Number(r.lon),false);v18FillAddress(r);publicAddressMap?.setView([Number(r.lat),Number(r.lon)],19);box.innerHTML=''});},'Selecciona la coincidencia correcta.');
  document.getElementById('addressSave').onclick=e=>panelRun(e.currentTarget,async()=>{if(!point)throw Error('Selecciona una ubicación o marca la entrada en el mapa.');if(!current())throw Error('Vuelve a abrir el domicilio.');const data={id:a?.id||'',...Object.fromEntries(['label','street','number','colony','postal_code','municipality','state','references'].map(k=>[k,document.getElementById('address_'+k).value.trim()])),...point,is_default:document.getElementById('addressDefault').checked};const r=await customerRpc('address_save',data);if(!current())return;customerAddresses=r.addresses;const saved=customerAddresses.find(x=>a?x.id===a.id:x.label===data.label&&Number(x.lat)===Number(data.lat)&&Number(x.lng)===Number(data.lng));closeModal(m.id);renderCustomerProfile();renderSavedAddressShortcut();if(saved)await useFoodAddress(saved.id)},'Domicilio guardado.');
};

/* Sincroniza el estado del botón al cerrar el menú por X, fondo o Escape. */
document.addEventListener('click',e=>{
  if(e.target.closest('[data-close-modal="v12MoreModal"], #overlay')){
    document.getElementById('v18MoreButton')?.setAttribute('aria-expanded','false');
  }
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&document.getElementById('v12MoreModal')?.classList.contains('show')){
    closeModal('v12MoreModal');
    document.getElementById('v18MoreButton')?.setAttribute('aria-expanded','false');
    document.getElementById('v18MoreButton')?.focus();
  }
});

/* inicio */
v18Cfg();v18EnsureMoreButton();v18RemoveDuplicateQuickActions();v18WireExperience();
setTimeout(()=>{v18EnsureMoreButton();v18RemoveDuplicateQuickActions();v18WireExperience()},700);
})();
