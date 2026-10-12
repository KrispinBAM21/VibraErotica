/* Módulo: js/enhancements-v17.js | Función: lógica original del bloque 20 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
'use strict';
let v17ExperienceTimer=null;
let v17SelectedCoupon=null;
let v17BusinessRoute=null,v17UserMarker=null;
const V17_ICON={star:`<svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/></svg>`,ticket:`<svg viewBox="0 0 24 24"><path d="M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M12 7v12" stroke-dasharray="2 2"/></svg>`,route:`<svg viewBox="0 0 24 24"><circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M7 18h4a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/></svg>`,chev:`<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>`};

/* ---------- Badges robustos ---------- */
function v17ReminderCount(){
  let n=0;
  if(!customerSession)n++;
  if(customerSession&&(!Array.isArray(customerAddresses)||customerAddresses.length===0))n++;
  try{if(localStorage.getItem('vibraerotica.v16.rated.'+(customerSession?.user?.id||'guest'))!=='1')n++}catch{n++}
  return n;
}
function v17ReadState(){try{return JSON.parse(localStorage.getItem('vibraerotica.v16.notifications')||'{"read":[],"readChats":{}}')}catch{return {read:[],readChats:{}}}}
function v17DynamicCount(){
  const s=v17ReadState(),read=new Set(s.read||[]),readChats=s.readChats||{};let n=0;
  if(trackingConfig?.notifications_enabled){
    (trackingEvents||[]).forEach(e=>{if(!read.has('event:'+e.id))n++});
    (trackingOrders||[]).filter(o=>o.chat_open&&o.last_message_sender==='admin'&&Number(o.last_message_id||0)>Math.max(Number(chatSeen[o.id]||0),Number(readChats[o.id]||0))).forEach(()=>n++);
  }
  return n;
}
function v17PaintHeaderBadges(){
  const bell=document.getElementById('notificationsBtn');
  if(bell){bell.classList.add('v17-badge-host');let b=bell.querySelector('.followup-count');if(!b){b=document.createElement('span');b.className='followup-count';bell.append(b)}const n=v17ReminderCount()+v17DynamicCount();b.textContent=n?String(n):'';b.hidden=!n;b.style.display=n?'grid':'none'}
  const cartBtn=document.getElementById('cartBtn');const cart=document.getElementById('cartCount');if(cartBtn)cartBtn.classList.add('v17-badge-host');if(cart){cart.textContent=String(Object.values(state.cart||{}).reduce((a,b)=>a+Number(b||0),0));cart.hidden=false;cart.style.display='grid'}
}
const v17TrackingBase=renderTrackingButtons;
renderTrackingButtons=function(){try{v17TrackingBase()}catch{}v17PaintHeaderBadges();v17InstallQuickActions()};
const v17CartCountBase=updateCartCount;
updateCartCount=function(){v17CartCountBase();v17PaintHeaderBadges()};

/* ---------- Accesos visibles: Favoritos y Cupones ---------- */
function v17InstallQuickActions(){
  const nav=document.querySelector('.v12-home-nav');if(!nav)return;
  if(!nav.querySelector('[data-v17-quick="favorites"]')){
    const f=document.createElement('button');f.className='chip';f.dataset.v17Quick='favorites';f.innerHTML=V17_ICON.star+'<span>Favoritos</span>';f.onclick=()=>v17OpenFavorites();nav.append(f);
    const c=document.createElement('button');c.className='chip';c.dataset.v17Quick='coupons';c.innerHTML=V17_ICON.ticket+'<span>Cupones</span>';c.onclick=()=>v17OpenCoupons();nav.append(c);
  }
}
async function v17Social(action,payload={}){
  if(!supabaseClient)throw Error('Espera a que conecte el sitio con Supabase.');
  const {data,error}=await supabaseClient.rpc('catalog_social',{p_action:action,p_payload:payload});
  if(error)throw error;
  if(data?.error)throw Error(data.error);
  return data;
}
async function v17ToggleFavorite(productId){
  if(!customerSession)throw Error('Inicia sesión para administrar tus favoritos.');
  return await v17Social('toggle_favorite',{product_id:productId});
}
async function v17OpenFavorites(){
  if(!customerSession){toast('Inicia sesión para ver tus favoritos personales.','info');renderCustomerProfile();openModal('customerProfileModal');return}
  const m=v4Modal('v17FavoritesModal','Mis favoritos'),body=m.querySelector('.modal-body');openModal(m.id);body.innerHTML='<p class="muted">Cargando tus favoritos…</p>';
  try{
    const r=await v17Social('favorites');const ids=r?.favorites||[];const ps=ids.map(id=>state.products.find(p=>String(p.id)===String(id))).filter(Boolean);
    body.innerHTML=ps.length?`<p class="small muted">Estos favoritos pertenecen únicamente a tu cuenta.</p><div class="v17-fav-grid">${ps.map(p=>`<article class="v17-fav-card"><div class="v17-fav-image">${productVisual(p)}</div><div class="v17-fav-body"><h4>${esc(p.name)}</h4><div class="small muted">${esc(p.description||'')}</div><strong>${money(productPrice(p))}</strong><div class="v17-fav-actions"><button class="btn" data-v17-open-fav="${esc(p.id)}">Ver producto</button><button class="btn ghost" data-v17-remove-fav="${esc(p.id)}">Quitar</button></div></div></article>`).join('')}</div>`:'<div class="v12-empty">Todavía no tienes productos guardados como favoritos.</div>';
    body.querySelectorAll('[data-v17-open-fav]').forEach(b=>b.onclick=()=>{closeModal(m.id);openProductViewer(b.dataset.v17OpenFav,b)});
    body.querySelectorAll('[data-v17-remove-fav]').forEach(b=>b.onclick=async()=>{await v17ToggleFavorite(b.dataset.v17RemoveFav);toast('Producto retirado de favoritos.','ok');v17OpenFavorites()});
  }catch(e){body.innerHTML='<div class="notice">'+esc(e.message)+'</div>'}
}
v12OpenFavorites=v17OpenFavorites;

/* ---------- Cupones ---------- */
async function v17CouponRpc(action,payload={}){if(!supabaseClient)throw Error('Espera a que conecte el sitio.');const {data,error}=await supabaseClient.rpc('catalog_coupons',{p_action:action,p_payload:payload});if(error)throw error;if(data?.error)throw Error(data.error);return data}
function v17CouponLabel(c){return c.discount_type==='fixed'?money(c.discount_value):`${Number(c.discount_value||0)}%`}
async function v17OpenCoupons(){
  const m=v4Modal('v17CouponsModal','Cupones vigentes'),body=m.querySelector('.modal-body');openModal(m.id);body.innerHTML='<p class="muted">Consultando cupones…</p>';
  try{
    const r=await v17CouponRpc('list',{}),rows=r?.coupons||[];
    body.innerHTML=`${!customerSession?'<div class="notice">Inicia sesión para usar cupones de un solo uso por cuenta.</div>':''}${rows.length?`<div class="v17-coupon-grid">${rows.map(c=>`<article class="v17-coupon ${c.used?'used':''}"><span class="v17-coupon-code">${esc(c.code)}</span><h4>${esc(c.title)}</h4><p>${esc(c.description||'')}</p><p><strong>${v17CouponLabel(c)} de descuento</strong>${Number(c.min_subtotal||0)>0?' · compra mínima '+money(c.min_subtotal):''}</p><p class="small muted">${c.ends_at?'Vigente hasta '+new Date(c.ends_at).toLocaleString('es-MX'):'Sin fecha de vencimiento'} · 1 uso por cuenta</p><div class="v17-coupon-actions">${c.used?'<span class="v16-pill">Ya utilizado</span>':`<button class="btn" data-v17-use-coupon="${esc(c.code)}">Usar este cupón</button>`}<button class="btn secondary" data-v17-copy="${esc(c.code)}">Copiar código</button></div></article>`).join('')}</div>`:'<div class="v12-empty">No hay cupones vigentes.</div>'}`;
    body.querySelectorAll('[data-v17-copy]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.v17Copy);toast('Código copiado.','ok')}catch{toast('Código: '+b.dataset.v17Copy,'info')}});
    body.querySelectorAll('[data-v17-use-coupon]').forEach(b=>b.onclick=async()=>{if(!customerSession){closeModal(m.id);renderCustomerProfile();openModal('customerProfileModal');return}const c=rows.find(x=>x.code===b.dataset.v17UseCoupon);v17SelectedCoupon=c||null;closeModal(m.id);toast('Cupón '+b.dataset.v17UseCoupon+' seleccionado. Se validará al generar el pedido.','ok');if(document.getElementById('cartDrawer')?.classList.contains('show'))renderCart()});
  }catch(e){body.innerHTML='<div class="notice">Instala la migración V17 para administrar cupones.<br>'+esc(e.message)+'</div>'}
}
v12OpenOffers=async function(){const m=v4Modal('v17OffersCouponsModal','Cupones y ofertas'),body=m.querySelector('.modal-body');openModal(m.id);const offers=(foodOffers||[]).filter(o=>!o.ends_at||new Date(o.ends_at)>new Date());body.innerHTML=`<section class="section-card"><div class="row between"><div><h3>Cupones de tu cuenta</h3><p class="small muted">Cada cupón puede utilizarse una sola vez por cuenta.</p></div><button class="btn" id="v17SeeCoupons">Ver cupones</button></div></section><section class="section-card"><h3>Ofertas por tiempo</h3>${offers.length?offers.map(o=>`<article class="v12-review-card"><strong>${esc(o.title)} · ${Number(o.percent)||0}%</strong><p>${offerActive(o)?'Activa ahora':'Programada'}${o.ends_at?' · termina '+esc(new Date(o.ends_at).toLocaleString('es-MX')):''}</p></article>`).join(''):'<div class="v12-empty">No hay ofertas activas.</div>'}</section>`;document.getElementById('v17SeeCoupons').onclick=()=>{closeModal(m.id);v17OpenCoupons()}};

/* Muestra cupón elegido en carrito. */
const v17RenderCartBase=renderCart;
renderCart=function(){v17RenderCartBase();const body=document.getElementById('cartBody');if(body&&v17SelectedCoupon&&!body.querySelector('#v17SelectedCoupon')){const d=document.createElement('div');d.id='v17SelectedCoupon';d.className='v17-selected-coupon';d.innerHTML=`<div class="row between"><div><strong>Cupón ${esc(v17SelectedCoupon.code)}</strong><div class="small muted">${esc(v17SelectedCoupon.title)} · ${v17CouponLabel(v17SelectedCoupon)}. Se valida al generar el pedido.</div></div><button class="btn ghost" id="v17RemoveCoupon">Quitar</button></div>`;body.prepend(d);document.getElementById('v17RemoveCoupon').onclick=()=>{v17SelectedCoupon=null;renderCart()}}};

/* Cupón se redime después de que catalog-order crea el pedido, antes del comprobante. */
confirmOrder=async function(){
  if(orderCreating)return;orderCreating=true;
  try{
    if(!supabaseClient||!cloudReady)throw Error('No hay conexión al catálogo. Intenta de nuevo antes de enviar el pedido.');
    const items=cartItems();if(!items.length)throw Error('El carrito está vacío.');
    const pay=state.config.payments.find(p=>p.id===checkout.paymentId&&p.visible!==false);if(!pay)throw Error('Selecciona un método de pago disponible.');
    if(v17SelectedCoupon)throw Error('Los cupones VEROTICA solo pueden utilizarse en reservas de masajes. Retira el cupón para comprar productos.');
    if(!orderRequestId){orderRequestId=crypto.randomUUID();sessionStorage.setItem('foodCatalog.orderRequestId',orderRequestId)}
    const {data,error}=await supabaseClient.functions.invoke('catalog-order',{body:{request_id:orderRequestId,customer:{name:checkout.name,phone:checkout.phone,call_phone:checkout.callPhone||checkout.phone,notes:checkout.notes},delivery:{type:checkout.delivery,address:checkout.delivery==='delivery'?checkout.address:'',lat:checkout.lat,lng:checkout.lng},payment_title:pay.title,items:items.map(x=>({id:String(x.p.id),qty:x.qty}))}});
    if(error||data?.error||!data?.order)throw Error(data?.error||error?.message||'No se pudo registrar el pedido.');
    let couponResult=null;
    
    const order=cloudOrderToState(data.order);if(couponResult){order.discount=Number(couponResult.discount||0);order.couponCode=v17SelectedCoupon.code}
    orderRequestId='';sessionStorage.removeItem('foodCatalog.orderRequestId');
    const receipt=await uploadReceiptForOrder(order);if(receipt.ok)order.paymentStatus='PENDING_REVIEW';
    state.orders.unshift(order);state.cart={};saveLocal();lastOrderId=order.id;lastPdfName='pedido-'+order.folio+'.pdf';
    try{lastPdfBlob=await buildPdf(order)}catch(e){lastPdfBlob=null;toast('El pedido se creó, pero no pudo generarse el PDF. Puedes descargarlo desde Pedidos.','error')}
    try{await loadPublicCloudState()}catch{}
    renderCatalog();updateCartCount();renderPostConfirm(order);if(couponResult&&document.getElementById('summaryBody'))document.getElementById('summaryBody').insertAdjacentHTML('afterbegin',`<div class="notice"><strong>Cupón ${esc(order.couponCode)} aplicado:</strong> ahorro de ${money(order.discount)}.</div>`);v17SelectedCoupon=null;toast('Pedido '+order.folio+' registrado.','ok');
  }catch(e){toast(e.message,'error')}finally{orderCreating=false}
};

/* ---------- Admin de cupones ---------- */
function v17EnsureCouponTab(){if(adminTabs.some(x=>x[0]==='coupons'))return;const i=Math.max(0,adminTabs.findIndex(x=>x[0]==='products')+1);adminTabs.splice(i,0,['coupons','Cupones',V17_ICON.ticket])}
v17EnsureCouponTab();const v17PanelCanBase=panelCan;panelCan=id=>id==='coupons'?v17PanelCanBase('products'):v17PanelCanBase(id);
async function v17RenderCouponsAdmin(c){
  let rows=[];try{rows=(await v17CouponRpc('admin_list',{})).coupons||[]}catch(e){c.innerHTML='<div class="notice">Instala la migración V17 para habilitar cupones.<br>'+esc(e.message)+'</div>';return}
  c.innerHTML=`<section class="section-card"><h3>Crear / editar cupón</h3><input type="hidden" id="v17CouponId"><div class="v17-coupon-admin-grid"><label class="field"><span>Código</span><input class="input" id="v17CouponCode" maxlength="32" placeholder="VEROTICA-XXXXXXXX"></label><label class="field"><span>Título</span><input class="input" id="v17CouponTitle" maxlength="120" placeholder="10% de bienvenida"></label><label class="field"><span>Tipo</span><select class="select" id="v17CouponType"><option value="percent">Porcentaje</option><option value="fixed">Cantidad fija</option></select></label><label class="field"><span>Valor</span><input class="input" id="v17CouponValue" type="number" min="0.01" step="0.01" value="10"></label><label class="field"><span>Compra mínima</span><input class="input" id="v17CouponMin" type="number" min="0" step="0.01" value="0"></label><label class="field"><span>Máximo de usos totales (vacío = sin límite)</span><input class="input" id="v17CouponMax" type="number" min="1"></label><label class="field"><span>Inicio</span><input class="input" id="v17CouponStart" type="datetime-local"></label><label class="field"><span>Fin</span><input class="input" id="v17CouponEnd" type="datetime-local"></label></div><label class="field"><span>Descripción</span><textarea class="textarea" id="v17CouponDesc" maxlength="500"></textarea></label><label class="row"><input type="checkbox" id="v17CouponActive" checked> Cupón activo</label><div class="toolbar"><button class="btn" id="v17CouponSave">${UI.save}<span>Guardar cupón</span></button><button class="btn secondary" id="v17CouponGenerate">Generar código VEROTICA</button><button class="btn secondary" id="v17CouponClear">Nuevo / limpiar</button></div></section><section class="section-card"><h3>Cupones creados</h3><div class="v17-coupon-admin-list">${rows.map(x=>`<article class="v17-coupon-admin-card"><div class="row"><div><strong>${esc(x.code)} · ${esc(x.title)}</strong><div class="small muted">${v17CouponLabel(x)} · ${Number(x.uses||0)} usos${x.max_total_uses?' / '+Number(x.max_total_uses):''} · ${x.active?'Activo':'Inactivo'}</div></div><div class="toolbar"><button class="btn secondary" data-v17-edit-coupon="${esc(x.id)}">${UI.edit}<span>Editar</span></button><button class="btn ghost" data-v17-delete-coupon="${esc(x.id)}">${UI.trash}<span>Eliminar</span></button></div></div></article>`).join('')||'<p class="small muted">No hay cupones creados.</p>'}</div></section>`;
  const clear=()=>{['v17CouponId','v17CouponCode','v17CouponTitle','v17CouponDesc','v17CouponMax','v17CouponStart','v17CouponEnd'].forEach(id=>document.getElementById(id).value='');document.getElementById('v17CouponType').value='percent';document.getElementById('v17CouponValue').value='10';document.getElementById('v17CouponMin').value='0';document.getElementById('v17CouponActive').checked=true};
  document.getElementById('v17CouponClear').onclick=clear;document.getElementById('v17CouponGenerate').onclick=()=>{const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',b=new Uint8Array(8);crypto.getRandomValues(b);document.getElementById('v17CouponCode').value='VEROTICA-'+Array.from(b,x=>alphabet[x%alphabet.length]).join('')};
  document.getElementById('v17CouponSave').onclick=e=>panelRun(e.currentTarget,async()=>{const payload={id:document.getElementById('v17CouponId').value||null,code:document.getElementById('v17CouponCode').value.trim().toUpperCase(),title:document.getElementById('v17CouponTitle').value.trim(),description:document.getElementById('v17CouponDesc').value.trim(),discount_type:document.getElementById('v17CouponType').value,discount_value:Number(document.getElementById('v17CouponValue').value),min_subtotal:Number(document.getElementById('v17CouponMin').value||0),max_total_uses:document.getElementById('v17CouponMax').value?Number(document.getElementById('v17CouponMax').value):null,starts_at:document.getElementById('v17CouponStart').value||null,ends_at:document.getElementById('v17CouponEnd').value||null,active:document.getElementById('v17CouponActive').checked};if(!/^VEROTICA-[A-Z0-9]{6,24}$/.test(payload.code))throw Error('Genera un código que comience con VEROTICA-.');if(!payload.title)throw Error('El título es obligatorio.');await v17CouponRpc('admin_save',payload);await v17RenderCouponsAdmin(c)},'Cupón guardado.');
  c.querySelectorAll('[data-v17-edit-coupon]').forEach(b=>b.onclick=()=>{const x=rows.find(q=>q.id===b.dataset.v17EditCoupon);if(!x)return;document.getElementById('v17CouponId').value=x.id;document.getElementById('v17CouponCode').value=x.code;document.getElementById('v17CouponTitle').value=x.title;document.getElementById('v17CouponDesc').value=x.description||'';document.getElementById('v17CouponType').value=x.discount_type;document.getElementById('v17CouponValue').value=x.discount_value;document.getElementById('v17CouponMin').value=x.min_subtotal||0;document.getElementById('v17CouponMax').value=x.max_total_uses||'';document.getElementById('v17CouponStart').value=x.starts_at?new Date(x.starts_at).toISOString().slice(0,16):'';document.getElementById('v17CouponEnd').value=x.ends_at?new Date(x.ends_at).toISOString().slice(0,16):'';document.getElementById('v17CouponActive').checked=!!x.active;document.getElementById('v17CouponCode').scrollIntoView({behavior:'smooth',block:'center'})});
  c.querySelectorAll('[data-v17-delete-coupon]').forEach(b=>b.onclick=e=>{if(!confirm('¿Eliminar este cupón?'))return;panelRun(e.currentTarget,async()=>{await v17CouponRpc('admin_delete',{id:b.dataset.v17DeleteCoupon});await v17RenderCouponsAdmin(c)},'Cupón eliminado.')});
}
const v17AdminPaneBase=renderAdminPane;
renderAdminPane=async function(id){v17EnsureCouponTab();if(id==='coupons'){if(!panelCan(id))return toast('Sin permiso para administrar cupones.','error');activeAdmin=id;document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));const c=document.getElementById('adminContent');c.innerHTML='<p>Cargando cupones…</p>';return v17RenderCouponsAdmin(c)}return v17AdminPaneBase(id)};
const v17RenderAdminBase=renderAdmin;renderAdmin=function(){v17EnsureCouponTab();v17RenderAdminBase()};

/* ---------- Tu experiencia: plegable y autocierre a 10 min ---------- */
let paintExperience=window.vibraPaintExperience||function(){};
paintExperience=function(){
  let h=document.getElementById('v15Experience');if(!h){h=document.createElement('section');h.id='v15Experience';document.querySelector('.container.controls')?.before(h)}
  h.className='container v17-experience';const s=summary?.scores||{},avg=Number(s.overall||0);
  h.innerHTML=`<button class="v17-experience-toggle" id="v17ExperienceToggle" aria-expanded="false"><div><h3>Tu experiencia importa</h3><p>Califica el negocio, conoce el perfil, consulta opiniones y síguenos.</p></div><span class="v17-experience-chevron">${V17_ICON.chev}</span></button><div class="v17-experience-panel"><div><div class="v17-experience-inner"><div class="v17-experience-summary"><span class="v17-stars">${avg?'★'.repeat(Math.round(avg)):'☆☆☆☆☆'}</span><span>${avg?avg.toFixed(1):'Sin calificaciones'} · ${Number(s.reviews||0)} opiniones · ${Number(summary?.followers||0)} seguidores</span></div><div class="v17-experience-actions"><button class="btn v16-glow-btn" id="v17KnowBusiness">🏪 <span>Conocer el negocio</span></button><button class="btn" id="v17Rate">${V12I.comment}<span>Opiniones y calificar</span></button><button class="btn secondary" id="v17Follow">${UI.check}<span>${summary?.following?'Siguiendo':'Seguir'}</span></button></div></div></div></div>`;
  const toggle=document.getElementById('v17ExperienceToggle');toggle.onclick=()=>{const open=!h.classList.contains('open');h.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));clearTimeout(v17ExperienceTimer);if(open)v17ExperienceTimer=setTimeout(()=>{if(h.isConnected){h.classList.remove('open');toggle.setAttribute('aria-expanded','false')}},10*60*1000)};
  document.getElementById('v17KnowBusiness').onclick=()=>openBusinessShowcase();document.getElementById('v17Rate').onclick=()=>openRateBusinessModal();document.getElementById('v17Follow').onclick=async e=>{if(!customerSession){renderCustomerProfile();openModal('customerProfileModal');return toast('Inicia sesión para seguir al negocio.','info')}try{const r=await v16Community('toggle_follow',{});summary.following=r.following;summary.followers=r.followers;paintExperience()}catch(err){toast(err.message,'error')}};
};

/* ---------- Ruta del usuario al local al pulsar el pin ---------- */
function v17OriginPopup(){return `<div class="v17-route-popup"><h4>${esc(state.config.businessName)}</h4><p>${esc(businessLocationText())}</p><button class="btn" onclick="window.v17RouteToBusiness()">${V17_ICON.route}<span>Cómo llegar desde mi ubicación</span></button></div>`}
async function v17GetPosition(){return await new Promise((resolve,reject)=>{if(!navigator.geolocation)return reject(Error('Tu navegador no ofrece ubicación.'));navigator.geolocation.getCurrentPosition(p=>resolve({lat:p.coords.latitude,lng:p.coords.longitude}),()=>reject(Error('No se pudo obtener tu ubicación. Activa el permiso de ubicación e inténtalo de nuevo.')),{enableHighAccuracy:true,timeout:20000,maximumAge:0})})}
window.v17RouteToBusiness=async function(){
  try{
    const pos=await v17GetPosition(),o=state.config.origin;if(!o||o.lat==null||o.lng==null)throw Error('El negocio aún no tiene una ubicación configurada.');
    if(!publicFoodMap)initFoodPublicMap();if(!publicFoodMap)throw Error('No se pudo abrir el mapa.');
    if(v17BusinessRoute){publicFoodMap.removeLayer(v17BusinessRoute);v17BusinessRoute=null}if(v17UserMarker){publicFoodMap.removeLayer(v17UserMarker);v17UserMarker=null}
    v17UserMarker=L.marker([pos.lat,pos.lng],{icon:L.divIcon({className:'',html:'<div class="v17-user-pin"></div>',iconSize:[18,18],iconAnchor:[9,9]})}).addTo(publicFoodMap).bindPopup('Tu ubicación');
    const url=`https://router.project-osrm.org/route/v1/driving/${pos.lng},${pos.lat};${o.lng},${o.lat}?overview=full&geometries=geojson`;
    const r=await fetch(url);if(!r.ok)throw Error('No se pudo calcular la ruta.');const data=await r.json();if(!data.routes?.length)throw Error('No se encontró una ruta disponible.');const rt=data.routes[0];
    v17BusinessRoute=L.geoJSON(rt.geometry,{style:{color:'#1976d2',weight:5,opacity:.9}}).addTo(publicFoodMap);publicFoodMap.fitBounds(v17BusinessRoute.getBounds(),{padding:[35,35]});
    const km=(rt.distance/1000).toFixed(1),mins=Math.max(1,Math.round(rt.duration/60));
    publicFoodOrigin?.setPopupContent(`<div class="v17-route-popup"><h4>${esc(state.config.businessName)}</h4><p>Ruta desde tu ubicación: <strong>${km} km · ${mins} min aprox.</strong></p><button class="btn" onclick="window.open('https://www.google.com/maps/dir/?api=1&origin=${pos.lat},${pos.lng}&destination=${o.lat},${o.lng}&travelmode=driving','_blank','noopener')">Abrir navegación</button></div>`).openPopup();
  }catch(e){toast(e.message,'error')}
};
initFoodPublicMap=function(){
  if(typeof L==='undefined')return;const host=document.getElementById('foodPublicMap');if(!host||publicFoodMap)return;const o=state.config.origin;publicFoodMap=L.map(host,{rotate:true,touchRotate:true,dragRotate:true,shiftKeyRotate:true,rotateControl:{position:"topright",behavior:"reset",closeOnZeroBearing:false}}).setView([o.lat,o.lng],13);addConfiguredTileLayer(publicFoodMap,'foodPublicMap');publicFoodOrigin=L.marker([o.lat,o.lng],{icon:labeledFoodPin('origin'),bubblingMouseEvents:false}).addTo(publicFoodMap).bindPopup(v17OriginPopup());publicFoodOrigin.on('click',ev=>{try{L.DomEvent.stopPropagation(ev.originalEvent)}catch{}});publicFoodMap.on('click',e=>chooseFoodDestination(e.latlng.lat,e.latlng.lng).catch(err=>toast(err.message,'error')));publicFoodMap.invalidateSize()
};

/* inicio */
window.vibraPaintExperience=paintExperience;v17InstallQuickActions();v17PaintHeaderBadges();paintExperience();setTimeout(()=>{v17InstallQuickActions();v17PaintHeaderBadges()},900);
})();
