/* Módulo: js/main.js | Función: lógica original del bloque 44 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const db=()=>typeof supabaseClient!=='undefined'?supabaseClient:null;
const roomCache=new Map();let lastRoomPreviewKey='';
let couponsAvailable=null, lastEnhanceKey='';
const icon={
  close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  room:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11h18v8H3z"/><path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/><path d="M7 15h.01M17 15h.01"/></svg>',
  gallery:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="m7 13 3-3 3 3 4-4 2 2"/><circle cx="8" cy="8" r="1"/></svg>',
  store:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16"/><path d="M5 10V7l2-3h10l2 3v3"/><path d="M6 10v10h12V10"/><path d="M10 14h4"/></svg>'
};
const modeMap={local:'Local',domicilio:'Domicilio',hotel:'Hotel',motel:'Motel'};
async function activeCouponsExist(){
  if(couponsAvailable!==null) return couponsAvailable;
  const client=db(); if(!client) return couponsAvailable=false;
  try{ const r=await client.from('coupons').select('id',{count:'exact',head:true}).eq('active',true); couponsAvailable=!r.error && Number(r.count||0)>0; }
  catch(_){ couponsAvailable=false; }
  return couponsAvailable;
}
async function fetchRoomInfo(id){
  if(roomCache.has(id)) return roomCache.get(id);
  const client=db(); if(!client) throw Error('Sin conexión');
  const [base,detail,likes]=await Promise.all([
    client.from('rooms').select('id,name,description,active').eq('id',id).single(),
    client.from('vibra_room_details').select('*').eq('room_id',id).maybeSingle(),
    client.from('vibra_room_likes').select('user_id',{count:'exact',head:true}).eq('room_id',id)
  ]);
  const data={...(base.data||{}),...(detail.data||{}),likes:likes.error?0:Number(likes.count||0)};
  if(base.error) throw base.error;
  roomCache.set(id,data);
  return data;
}
function capitalizeOptions(){
  const sel=$('#v9Mode'); if(!sel) return;
  [...sel.options].forEach(o=>{ if(modeMap[o.value]) o.textContent=modeMap[o.value]; });
}
function enhanceModeField(){
  const label=$('#v9Mode')?.closest('label');
  if(!label) return;
  capitalizeOptions();
  if(!label.classList.contains('vibra-mode-field')){
    label.classList.add('vibra-mode-field');
    [...label.childNodes].forEach(node=>{ if(node.nodeType===Node.TEXT_NODE) node.textContent=''; });
    if(!label.querySelector('.vibra-mode-title')){ const title=document.createElement('span'); title.className='vibra-mode-title'; title.textContent='Modalidad de atención'; label.prepend(title); }
    if(!label.querySelector('.vibra-mode-caption')){ const small=document.createElement('span'); small.className='vibra-mode-caption'; small.textContent='Selecciona cómo deseas recibir tu servicio.'; label.append(small); }
  }
  let shell=label.previousElementSibling;
  if(!shell || !shell.classList.contains('vibra-mode-shell')){ shell=document.createElement('div'); shell.className='vibra-mode-shell'; shell.innerHTML=`<span class="vibra-mode-badge">${icon.room}<span>Reserva asistida</span></span>`; label.before(shell); }
}
function ensureLocalDefaults(){
  const mode=$('#v9Mode')?.value;
  const booking=$('#v9Booking');
  if(mode==='local'){
    const continueBtn=$('#v9Continue');
    if(booking?.hidden && continueBtn && !continueBtn.dataset.vibraAutoOpen){
      continueBtn.dataset.vibraAutoOpen='1';
      continueBtn.click();
      setTimeout(()=>delete continueBtn.dataset.vibraAutoOpen,700);
    }
    const roomSel=$('#v9Room');
    if(roomSel && !roomSel.value){
      const first=[...roomSel.options].find(o=>o.value);
      if(first){ roomSel.value=first.value; roomSel.dispatchEvent(new Event('change',{bubbles:true})); }
    }
  }
}
async function updateCouponField(){
  const wrap=$('#v10BookingExtras'); if(!wrap) return;
  const label=[...wrap.querySelectorAll('label')].find(x=>/Cup[oó]n/i.test(x.textContent||''));
  if(!label) return;
  const show=$('#v9Mode')?.value==='local' && await activeCouponsExist();
  label.style.display=show?'':'none';
  if(!show){ const input=label.querySelector('input'); if(input) input.value=''; }
}
async function renderRoomPreview(){
  const booking=$('#v9Booking'); const terms=$('#v9Terms'); const roomSel=$('#v9Room'); const mode=$('#v9Mode')?.value;
  if(!booking || booking.hidden || !terms || !roomSel) return;
  let panel=$('#vibraRoomPreviewPanel');
  if(!panel){ panel=document.createElement('section'); panel.id='vibraRoomPreviewPanel'; terms.closest('label')?.insertAdjacentElement('afterend',panel); }
  if(mode!=='local'){ panel.hidden=true; lastRoomPreviewKey=''; return; }
  panel.hidden=false;
  const roomId=roomSel.value;
  if(lastRoomPreviewKey===roomId && panel.dataset.loaded==='1')return;lastRoomPreviewKey=roomId;panel.dataset.loaded='0';
  if(!roomId){ panel.innerHTML='<div class="vibra-room-empty">Selecciona una habitación para ver sus fotografías y detalles.</div>'; return; }
  panel.innerHTML='<div class="vibra-room-empty">Cargando información de la habitación…</div>';
  try{
    const info=await fetchRoomInfo(roomId);
    const photos=Array.isArray(info.photos)?info.photos.filter(Boolean):[];
    const stateLabel=info.status==='occupied'?'Ocupada':info.status==='pending'?'Pendiente':'Libre';
    panel.innerHTML=`<div class="vibra-room-preview-head"><div><h3>Habitación seleccionada</h3><p>${esc(info.name||'Habitación')}</p></div><button type="button" class="vibra-ghost-btn" id="vibraRoomOpenViewer">${icon.gallery}<span>Ver a detalle</span></button></div><p class="vibra-room-description">${esc(info.description||'Conoce el espacio, sus servicios y cortesías antes de confirmar la reserva.')}</p><div class="vibra-room-preview-meta"><div class="vibra-room-preview-chip"><strong>Estado</strong><span>${esc(stateLabel)}</span></div><div class="vibra-room-preview-chip"><strong>Servicios</strong><span>${esc((info.amenities||[]).join(' · ')||'Sin datos')}</span></div><div class="vibra-room-preview-chip"><strong>Cortesía</strong><span>${esc(info.courtesy||'No especificada')}</span></div><div class="vibra-room-preview-chip"><strong>Me gusta</strong><span>${esc(info.likes||0)} personas</span></div></div><div class="vibra-room-photo-strip">${photos.length?photos.map((src,i)=>`<button type="button" class="vibra-room-thumb" data-room-thumb="${i}" aria-label="Abrir fotografía ${i+1}"><img loading="lazy" src="${esc(src)}" alt="Fotografía de ${esc(info.name||'la habitación')}"></button>`).join(''):'<div class="vibra-room-empty">La habitación aún no tiene fotografías publicadas.</div>'}</div>`;
    panel.dataset.loaded='1';
    $('#vibraRoomOpenViewer')?.addEventListener('click',()=>window.vibraOpenRoomViewer?.(roomId));
    panel.querySelectorAll('[data-room-thumb]').forEach(btn=>btn.addEventListener('click',()=>window.vibraOpenRoomViewer?.(roomId)));
  }catch(e){ panel.innerHTML='<div class="vibra-room-empty">No se pudo cargar la información de la habitación: '+esc(e.message)+'</div>'; }
}
function replaceEmojiBusinessButtons(){
  $$('.v16-glow-btn,#v17KnowBusiness,#v18BusinessBack,#v18BusinessDirections').forEach(btn=>{
    if(/Conocer el negocio/i.test(btn.textContent||'') && !btn.dataset.svgClean){
      btn.dataset.svgClean='1';
      btn.innerHTML=`${icon.store}<span>Conocer el negocio</span>`;
    }
  });
}
function fixReserveClose(){ const btn=$('#vibraReserveClose'); if(btn && !btn.dataset.svgReady){ btn.dataset.svgReady='1'; btn.innerHTML=icon.close; } }
function balanceExperience(){ const card=$('#v15Experience'); if(card) card.classList.add('vibra-experience-balanced'); replaceEmojiBusinessButtons(); }
async function enhanceReserve(){
  if(!$('#vibraReserveOverlay')?.classList.contains('open')) return;
  fixReserveClose();
  enhanceModeField();
  ensureLocalDefaults();
  await updateCouponField();
  await renderRoomPreview();
}
function observe(){
  const key=[$('#v9Mode')?.value,$('#v9Room')?.value,$('#v9Booking')?.hidden,$('#vibraReserveOverlay')?.className,$('#v10BookingExtras')?.childElementCount].join('|');
  if(key===lastEnhanceKey) { balanceExperience(); replaceEmojiBusinessButtons(); return; }
  lastEnhanceKey=key;
  enhanceReserve().catch(console.warn);
  balanceExperience();
}
let scheduled=false;const mo=new MutationObserver(mutations=>{if(scheduled)return;if(!mutations.some(m=>m.type==='childList'&&([...m.addedNodes].some(n=>n.nodeType===1&&(n.id==='vibraReserveOverlay'||n.id==='v9Booking'||n.id==='v15Experience')))))return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;observe()})});
function start(){
  mo.observe(document.body,{subtree:true,childList:true});
  document.addEventListener('change',e=>{ if(['v9Mode','v9Room','v9Duration','v10Coupon'].includes(e.target?.id)) setTimeout(observe,20); },true);
  document.addEventListener('click',e=>{ if(e.target.closest('#v9Continue,[data-vibra-book],#v15RateBusiness,#v15ViewOpinions,#v15Follow,.v16-glow-btn')) setTimeout(observe,80); },true);
  observe();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
