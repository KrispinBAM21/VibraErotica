/* Módulo: js/enhancements-v12.js | Función: lógica original del bloque 15 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
'use strict';

/* ---------- Iconos UI locales ---------- */
const V12I={
  home:`<svg viewBox="0 0 24 24"><path d="M3 11 12 3l9 8v9H5v-9"/><path d="M9 20v-6h6v6"/></svg>`,
  grid:`<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/></svg>`,
  more:`<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h10M4 17h7"/><path d="M19 15v6M16 18h6"/></svg>`,
  heart:`<svg viewBox="0 0 24 24"><path d="M12 21S3 15.5 3 8.5A4.5 4.5 0 0 1 11 5.7L12 7l1-1.3A4.5 4.5 0 0 1 21 8.5C21 15.5 12 21 12 21z"/></svg>`,
  star:`<svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/></svg>`,
  chart:`<svg viewBox="0 0 24 24"><path d="M4 20V9M10 20V4M16 20v-7M22 20H2"/></svg>`,
  wallet:`<svg viewBox="0 0 24 24"><path d="M3 6h16v14H3zM3 8l12-5 2 3"/><path d="M15 12h6v5h-6z"/></svg>`,
  ticket:`<svg viewBox="0 0 24 24"><path d="M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4z"/><path d="M12 7v12"/></svg>`,
  comment:`<svg viewBox="0 0 24 24"><path d="M4 5h16v12H8l-4 4z"/></svg>`,
  settings:UI.settings,
  orders:UI.orders,
  cart:UI.cart
};

let v12View='home';
let v12SocialStats={};
let v12SocialReady=false;
let v12Rating=5;
function v12IsInternalProduct(p){return !!p && ((state.config.internalExtraIds||[]).includes(String(p.id)) || String(p.category||'').startsWith('_'));}
const V12_VISITOR_KEY='VibraErotica.v12SocialVisitor';
let v12SocialVisitor=localStorage.getItem(V12_VISITOR_KEY);
if(!v12SocialVisitor){v12SocialVisitor=(crypto.randomUUID?.()||('v'+Math.random().toString(36).slice(2)));localStorage.setItem(V12_VISITOR_KEY,v12SocialVisitor)}

/* ---------- Social / favoritos / reseñas ---------- */
async function v12Social(action,payload={}){
  if(!supabaseClient)throw Error('Espera a que termine de conectar el sitio.');
  const actor=customerSession?.user?.id?null:v12SocialVisitor;
  const {data,error}=await supabaseClient.rpc('catalog_social',{p_action:action,p_payload:{...payload,visitor_key:actor}});
  if(error)throw error;
  if(data?.error)throw Error(data.error);
  return data;
}
async function v12RefreshSocial(){
  try{
    const data=await v12Social('stats');
    v12SocialStats={};
    (data?.stats||[]).forEach(x=>v12SocialStats[String(x.product_id)]={...x});
    (data?.favorites||[]).forEach(id=>{
      const s=v12SocialStats[String(id)]||(v12SocialStats[String(id)]={product_id:String(id),likes:0,reviews:0,sales_qty:0});
      s.favorite=true;
    });
    (data?.my_likes||[]).forEach(id=>{
      const s=v12SocialStats[String(id)]||(v12SocialStats[String(id)]={product_id:String(id),likes:0,reviews:0,sales_qty:0});
      s.liked=true;
    });
    v12SocialReady=true;
    renderCatalog();
  }catch(e){
    v12SocialReady=false;
    console.info('Funciones sociales V12 pendientes de instalar:',e.message);
  }
}
function v12Stat(id){return v12SocialStats[String(id)]||{likes:0,reviews:0,sales_qty:0,favorite:false,liked:false}}
async function v12ToggleLike(id,button){
  try{
    const r=await v12Social('toggle_like',{product_id:id});
    const s=v12Stat(id);s.liked=!!r.liked;s.likes=Number(r.likes)||0;v12SocialStats[id]=s;
    button?.classList.toggle('active',s.liked);button?.querySelector('span')&&(button.querySelector('span').textContent=s.likes);
  }catch(e){toast('Instala la migración V12 para habilitar likes. '+e.message,'info')}
}
function v12RequireAccount(){
  if(customerSession)return true;
  toast('Crea una cuenta para guardar favoritos y domicilios.','info');
  renderCustomerProfile?.();openModal('customerProfileModal');
  return false;
}
async function v12ToggleFavorite(id,button){
  if(!v12RequireAccount())return;
  try{
    const r=await v12Social('toggle_favorite',{product_id:id});
    const s=v12Stat(id);s.favorite=!!r.favorite;v12SocialStats[id]=s;
    button?.classList.toggle('active',s.favorite);
    toast(s.favorite?'Producto guardado en Favoritos.':'Producto retirado de Favoritos.','ok');
  }catch(e){toast('Instala la migración V12 para habilitar favoritos. '+e.message,'info')}
}
function v12SocialButtons(id){
  const s=v12Stat(id);
  return `<div class="v12-social-row">
    <button class="v12-social-btn like ${s.liked?'active':''}" data-v12-like="${esc(id)}" aria-label="Me gusta">${V12I.heart}<span>${Number(s.likes)||0}</span></button>
    <button class="v12-social-btn favorite ${s.favorite?'active':''}" data-v12-favorite="${esc(id)}" aria-label="Favorito">${V12I.star}<span>Favorito</span></button>
    ${Number(s.reviews)?`<span class="v12-tag">${Number(s.reviews)} opiniones</span>`:''}
  </div>`;
}
function v12BindSocial(root=document){
  root.querySelectorAll('[data-v12-like]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();v12ToggleLike(b.dataset.v12Like,b)}});
  root.querySelectorAll('[data-v12-favorite]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();v12ToggleFavorite(b.dataset.v12Favorite,b)}});
}

/* ---------- Inicio / categorías / más vendidos / ofertas por tiempo ---------- */
function v12HomeNav(){
  let host=document.getElementById('v12HomeNav');
  if(host)return host;
  host=document.createElement('div');host.id='v12HomeNav';host.className='container v12-home-nav';
  host.innerHTML=[
    ['home','Inicio',V12I.home],['categories','Categorías',V12I.grid],['timed','Por tiempo',UI.pending]
  ].map(([id,label,icon])=>`<button class="chip ${id==='home'?'active':''}" data-v12-view="${id}">${icon}<span>${label}</span></button>`).join('');
  const controls=document.querySelector('.container.controls');controls?.before(host);
  host.querySelectorAll('[data-v12-view]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.v12View;
    if(id==='categories'){v12OpenCategories();return}
    v12View=id;host.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x.dataset.v12View===id));renderCatalog();window.scrollTo({top:document.getElementById('catalogGrid').offsetTop-120,behavior:'smooth'});
  });
  return host;
}
function v12ActiveOfferIds(){
  const set=new Set();
  (foodOffers||[]).filter(o=>offerActive(o)).forEach(o=>(o.product_ids||[]).forEach(id=>set.add(String(id))));
  return set;
}
function v12ApplyView(){
  const grid=document.getElementById('catalogGrid');if(!grid)return;
  const cards=[...grid.querySelectorAll('.product-card')];
  if(v12View==='timed'){
    const allowed=v12ActiveOfferIds();
    cards.forEach(card=>{
      const id=card.querySelector('[data-view-product]')?.dataset.viewProduct;
      if(id&&!allowed.has(String(id)))card.remove();
    });
    if(!grid.querySelector('.product-card'))grid.innerHTML='<div class="section-card"><strong>No hay productos con oferta por tiempo activa.</strong></div>';
  }
  if(v12View==='best'){
    cards.sort((a,b)=>{
      const ai=a.querySelector('[data-view-product]')?.dataset.viewProduct,bj=b.querySelector('[data-view-product]')?.dataset.viewProduct;
      return Number(v12Stat(bj).sales_qty||0)-Number(v12Stat(ai).sales_qty||0);
    }).forEach(x=>grid.append(x));
    if(!cards.some(c=>Number(v12Stat(c.querySelector('[data-view-product]')?.dataset.viewProduct).sales_qty)>0)){
      const note=document.createElement('div');note.className='section-card';note.innerHTML='<strong>Más vendidos</strong><p class="small muted">Aún no hay suficientes ventas registradas para ordenar el catálogo.</p>';grid.prepend(note);
    }
  }
}

/* Extiende el render del catálogo sin reemplazar la personalización V11. */
const v12RenderCatalogBase=renderCatalog;
renderCatalog=function(){
  v12RenderCatalogBase();
  v12HomeNav();
  document.querySelectorAll('#catalogGrid .product-card').forEach(card=>{
    const trigger=card.querySelector('[data-view-product]');if(!trigger)return;
    const id=trigger.dataset.viewProduct;
    if(!card.querySelector('.v12-social-row')){
      const body=card.querySelector('.product-body');
      const qty=body?.querySelector('.qty-row');
      qty?.insertAdjacentHTML('beforebegin',v12SocialButtons(id));
    }
  });
  v12BindSocial(document.getElementById('catalogGrid'));
  v12ApplyView();
};

/* ---------- Modal de categorías ---------- */
function v12OpenCategories(){
  const m=v4Modal('v12CategoriesModal','Categorías'),body=m.querySelector('.modal-body');
  const cats=[...new Set([...(state.config?.catalogCategories||[]),...state.products.filter(p=>p.active&&!v12IsInternalProduct(p)&&!String(p.category).startsWith('_')).map(p=>p.category)].filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
  body.innerHTML=`<div class="v12-menu-list"><button class="v12-menu-item" data-cat="Todos">${V12I.grid}<span>Todos los productos y servicios</span></button>${cats.map(c=>`<button class="v12-menu-item" data-cat="${esc(c)}">${V12I.grid}<span>${esc(c)}</span><small>${/masajista|masaje|servicio/i.test(c)?document.querySelectorAll('#v9Professionals .v9site').length:state.products.filter(p=>p.active&&p.category===c).length}</small></button>`).join('')}</div>`;
  body.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{
    currentCategory=b.dataset.cat;v12View='home';renderCategories();renderCatalog();closeModal(m.id);window.scrollTo({top:document.getElementById('catalogGrid').offsetTop-120,behavior:'smooth'});
  });
  openModal(m.id);
}

/* ---------- Producto: likes, favoritos y comentarios ---------- */
const v12ViewerBase=openProductViewer;
openProductViewer=function(id,focus){
  v12ViewerBase(id,focus);
  setTimeout(()=>v12DecorateProductViewer(id),0);
};
async function v12DecorateProductViewer(id){
  const modal=document.getElementById('productViewerModal'),body=modal?.querySelector('.modal-body');
  if(!body||body.querySelector('#v12ProductSocial'))return;
  const s=v12Stat(id);
  const sec=document.createElement('section');sec.id='v12ProductSocial';sec.className='v11-choice-section';
  sec.innerHTML=`<div class="v12-section-title"><h3>Opiniones del producto</h3><div>${v12SocialButtons(id)}</div></div>
    <div id="v12ProductReviews" class="v12-review-list"><p class="small muted">Cargando opiniones…</p></div>
    <div class="section-card" style="margin-top:12px">
      <strong>Dejar opinión</strong>
      <div class="v12-rating-picker" id="v12ProductRating">${[1,2,3,4,5].map(n=>`<button type="button" data-rate="${n}" class="${n<=5?'selected':''}" aria-label="${n} corazones">♥</button>`).join('')}</div>
      <textarea class="textarea" id="v12ProductComment" maxlength="700" placeholder="¿Qué te pareció este producto?"></textarea>
      <button class="btn secondary" id="v12SendProductReview">${V12I.comment}<span>Publicar opinión</span></button>
    </div>`;
  body.append(sec);v12BindSocial(sec);
  v12Rating=5;
  sec.querySelectorAll('[data-rate]').forEach(b=>b.onclick=()=>{v12Rating=Number(b.dataset.rate);sec.querySelectorAll('[data-rate]').forEach(x=>x.classList.toggle('selected',Number(x.dataset.rate)<=v12Rating))});
  document.getElementById('v12SendProductReview').onclick=async e=>{
    if(!v12RequireAccount())return;
    const text=document.getElementById('v12ProductComment').value.trim();
    if(text.length<3)return toast('Escribe un comentario un poco más completo.','info');
    await panelRun(e.currentTarget,async()=>{await v12Social('review_product',{product_id:id,rating:v12Rating,comment:text});document.getElementById('v12ProductComment').value='';await v12LoadProductReviews(id)},'Opinión publicada.');
  };
  await v12LoadProductReviews(id);
}
async function v12LoadProductReviews(id){
  const host=document.getElementById('v12ProductReviews');if(!host)return;
  try{
    const r=await v12Social('product_reviews',{product_id:id});
    host.innerHTML=(r?.reviews||[]).map(x=>`<article class="v12-review-card"><div class="row between"><strong>${esc(x.display_name||'Cliente')}</strong><span class="v12-hearts">${'♥'.repeat(Math.max(1,Math.min(5,Number(x.rating)||5)))}</span></div><p>${esc(x.comment||'')}</p><small class="muted">${esc(new Date(x.created_at).toLocaleDateString('es-MX'))}</small></article>`).join('')||'<p class="small muted">Aún no hay opiniones de este producto.</p>';
  }catch(e){host.innerHTML='<p class="small muted">Las opiniones estarán disponibles después de instalar la migración V12.</p>'}
}

/* ---------- Favoritos ---------- */
async function v12OpenFavorites(){
  if(!v12RequireAccount())return;
  const m=v4Modal('v12FavoritesModal','Favoritos'),body=m.querySelector('.modal-body');openModal(m.id);
  body.innerHTML='<p class="muted">Cargando favoritos…</p>';
  try{
    const r=await v17Social('favorites');
    const ids=r?.favorites||[];
    const ps=ids.map(id=>state.products.find(p=>String(p.id)===String(id))).filter(Boolean);
    body.innerHTML=ps.length?`<div class="v12-favorite-grid">${ps.map(p=>`<article class="v12-favorite-card"><strong>${esc(p.name)}</strong><p class="small muted">${esc(p.description||'')}</p><p>${money(productPrice(p))}</p><button class="btn secondary" data-v12-open="${esc(p.id)}">Ver producto</button></article>`).join('')}</div>`:'<div class="v12-empty">Todavía no guardas productos como favoritos.</div>';
    body.querySelectorAll('[data-v12-open]').forEach(b=>b.onclick=()=>{closeModal(m.id);openProductViewer(b.dataset.v12Open,b)});
  }catch(e){body.innerHTML='<div class="notice">'+esc(e.message)+'</div>'}
}

/* ---------- Opiniones del local ---------- */
async function v12OpenBusinessReviews(){
  const m=v4Modal('v12BusinessReviewsModal','Opiniones del local'),body=m.querySelector('.modal-body');openModal(m.id);
  body.innerHTML=`<div id="v12BusinessReviewList"><p class="muted">Cargando opiniones…</p></div>
    <section class="section-card">
      <h3>Calificar ${esc(state.config.businessName)}</h3>
      <div class="v12-rating-picker" id="v12BusinessRating">${[1,2,3,4,5].map(n=>`<button type="button" data-biz-rate="${n}" class="selected">♥</button>`).join('')}</div>
      <textarea class="textarea" id="v12BusinessComment" maxlength="900" placeholder="Cuéntanos sobre tu experiencia con el local"></textarea>
      <button class="btn secondary" id="v12SendBusinessReview">${V12I.comment}<span>Publicar opinión</span></button>
    </section>`;
  let rating=5;
  body.querySelectorAll('[data-biz-rate]').forEach(b=>b.onclick=()=>{rating=Number(b.dataset.bizRate);body.querySelectorAll('[data-biz-rate]').forEach(x=>x.classList.toggle('selected',Number(x.dataset.bizRate)<=rating))});
  document.getElementById('v12SendBusinessReview').onclick=async e=>{
    if(!v12RequireAccount())return;
    const comment=document.getElementById('v12BusinessComment').value.trim();if(comment.length<3)return toast('Escribe tu opinión.','info');
    await panelRun(e.currentTarget,async()=>{await v12Social('review_business',{rating,comment});document.getElementById('v12BusinessComment').value='';await v12LoadBusinessReviews()},'Opinión publicada.');
  };
  await v12LoadBusinessReviews();
}
async function v12LoadBusinessReviews(){
  const host=document.getElementById('v12BusinessReviewList');if(!host)return;
  try{
    const r=await v12Social('business_reviews');
    host.innerHTML=(r?.reviews||[]).map(x=>`<article class="v12-review-card"><div class="row between"><strong>${esc(x.display_name||'Cliente')}</strong><span class="v12-hearts">${'♥'.repeat(Math.max(1,Math.min(5,Number(x.rating)||5)))}</span></div><p>${esc(x.comment||'')}</p><small class="muted">${esc(new Date(x.created_at).toLocaleDateString('es-MX'))}</small></article>`).join('')||'<div class="v12-empty">Aún no hay opiniones del local.</div>';
  }catch(e){host.innerHTML='<div class="notice">Instala la migración V12 para habilitar opiniones del local.</div>'}
}

/* ---------- Más: menú adaptado al restaurante ---------- */
function v12OpenMore(){
  const m=v4Modal('v12MoreModal','Menú'),body=m.querySelector('.modal-body');
  body.innerHTML=`${customerSession?`<div class="section-card"><strong>${esc(customerProfile?.full_name||customerSession.user.email||'Mi cuenta')}</strong><p class="small muted">Cuenta activa</p></div>`:`<div class="section-card"><strong>Guarda tus domicilios y favoritos</strong><p class="small muted">Crea una cuenta para no escribir de nuevo tus datos en cada pedido.</p><button class="btn" id="v12MoreAccount">${FOOD.customer||UI.lock}<span>Crear cuenta / iniciar sesión</span></button></div>`}
  <div class="v12-menu-list">
    <button class="v12-menu-item" data-v12-menu="orders">${V12I.orders}<span>Mis reservaciones</span></button>
    <button class="v12-menu-item" data-v12-menu="favorites">${V12I.star}<span>Favoritos</span></button>
    <button class="v12-menu-item" data-v12-menu="offers">${V12I.ticket}<span>Cupones y ofertas</span></button>
    <button class="v12-menu-item" data-v12-menu="categories">${V12I.grid}<span>Categorías</span></button>
    
    <button class="v12-menu-item" data-v12-menu="reviews">${V12I.heart}<span>Opiniones del local</span></button>
    <button class="v12-menu-item" data-v12-menu="settings">${V12I.settings}<span>Configuración</span></button>
  </div>`;
  document.getElementById('v12MoreAccount')?.addEventListener('click',()=>{closeModal(m.id);renderCustomerProfile();openModal('customerProfileModal')});
  body.querySelectorAll('[data-v12-menu]').forEach(b=>b.onclick=()=>{
    const a=b.dataset.v12Menu;closeModal(m.id);
    if(a==='orders')return openMyOrders();
    if(a==='favorites')return window.v12OpenFavorites();
    if(a==='offers')return window.v12OpenOffers();
    if(a==='categories')return v12OpenCategories();
    if(a==='reviews')return v12OpenBusinessReviews();
    if(a==='settings'){renderCustomerProfile();return openModal('customerProfileModal')}
    if(a==='best'){v12View='best';v12HomeNav().querySelectorAll('button').forEach(x=>x.classList.toggle('active',x.dataset.v12View==='best'));renderCatalog();window.scrollTo({top:document.getElementById('catalogGrid').offsetTop-120,behavior:'smooth'})}
  });
  openModal(m.id);
}
function v12OpenOffers(){
  const m=v4Modal('v12OffersModal','Cupones y ofertas'),body=m.querySelector('.modal-body');
  const offers=(foodOffers||[]).filter(o=>!o.ends_at||new Date(o.ends_at)>new Date());
  body.innerHTML=offers.length?offers.map(o=>`<article class="v12-review-card"><strong>${esc(o.title)} · ${Number(o.percent)||0}%</strong><p>${offerActive(o)?'Activa ahora':'Programada'}${o.ends_at?' · termina '+esc(new Date(o.ends_at).toLocaleString('es-MX')):''}</p></article>`).join(''):'<div class="v12-empty">No hay promociones activas por ahora.</div>';
  openModal(m.id);
}

/* ---------- Navegación móvil inferior ---------- */
function v12InstallBottomNav(){
  if(document.getElementById('v12BottomNav'))return;
  const nav=document.createElement('nav');nav.id='v12BottomNav';nav.className='v12-bottom-nav';
  nav.innerHTML=`<button class="active" data-v12-bottom="home">${V12I.home}<span>Inicio</span></button>
    <button data-v12-bottom="categories">${V12I.grid}<span>Categorías</span></button>
    <button data-v12-bottom="cart">${V12I.cart}<span>Carrito</span></button>`;
  document.body.append(nav);
  nav.querySelectorAll('[data-v12-bottom]').forEach(b=>b.onclick=()=>{
    nav.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));
    const a=b.dataset.v12Bottom;
    if(a==='home'){v12View='home';renderCatalog();window.scrollTo({top:0,behavior:'smooth'})}
    if(a==='categories')v12OpenCategories();
    if(a==='cart')document.getElementById('cartBtn')?.click();
  });
}

/* ---------- Notificación para visitantes sin cuenta ---------- */
const v12PaintNotificationsBase=paintNotifications;
paintNotifications=function(){
  v12PaintNotificationsBase();
  if(customerSession)return;
  const host=document.getElementById('notificationsModal')?.querySelector('.modal-body');if(!host||host.querySelector('#v12GuestNotification'))return;
  const n=document.createElement('article');n.id='v12GuestNotification';n.className='notification-item';
  n.innerHTML='<strong>Crea tu cuenta y guarda tus domicilios</strong><small>Así no tendrás que capturar tu dirección nuevamente y podrás conservar favoritos e historial.</small><button class="btn secondary" id="v12NotifAccount" style="margin-top:9px">Crear cuenta / iniciar sesión</button>';
  host.prepend(n);
  document.getElementById('v12NotifAccount').onclick=()=>{closeModal('notificationsModal');renderCustomerProfile();openModal('customerProfileModal')};
};
function v12GuestCallout(){
  let x=document.getElementById('v12GuestCallout');
  if(customerSession){x?.remove();return}
  if(x)return;
  x=document.createElement('div');x.id='v12GuestCallout';x.className='container v12-guest-callout';
  x.innerHTML=`<div><strong>¿Pides seguido?</strong><p class="small muted">Crea una cuenta para guardar domicilios, favoritos y consultar tus compras.</p></div><button class="btn secondary" id="v12GuestCreate">${FOOD.customer||UI.lock}<span>Crear cuenta</span></button>`;
  document.querySelector('.container.controls')?.before(x);
  document.getElementById('v12GuestCreate').onclick=()=>{renderCustomerProfile();openModal('customerProfileModal')};
}

/* ---------- Gastos e insumos ---------- */
if(!adminTabs.some(t=>t[0]==='expenses'))adminTabs.push(['expenses','Gastos e insumos',V12I.wallet]);
const v12PanelCanBase=panelCan;
panelCan=function(id){return id==='expenses'?(v12PanelCanBase('orders')||v12PanelCanBase('business')):v12PanelCanBase(id)};

async function v12Expense(action,payload={}){
  if(!supabaseClient||!adminSession)throw Error('Inicia sesión en administración.');
  const {data,error}=await supabaseClient.rpc('catalog_expense',{p_action:action,p_payload:payload});
  if(error)throw error;if(data?.error)throw Error(data.error);return data;
}
async function v12RenderExpenses(c){
  c.innerHTML=`<section class="section-card">
    <h3>Registrar gasto / insumo</h3>
    <div class="admin-grid two">
      <label class="field"><span>Fecha</span><input class="input" id="v12ExpenseDate" type="date" value="${new Date().toISOString().slice(0,10)}"></label>
      <label class="field"><span>Tipo</span><select class="select" id="v12ExpenseType"><option value="product">Compra de producto / insumo</option><option value="fuel">Gasolina</option><option value="packaging">Envases / empaques</option><option value="service">Servicio</option><option value="other">Otro</option></select></label>
      <label class="field"><span>Producto relacionado</span><select class="select" id="v12ExpenseProduct"><option value="">Sin producto específico</option>${state.products.filter(p=>!v12IsInternalProduct(p)).map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')}</select></label>
      <label class="field"><span>Descripción</span><input class="input" id="v12ExpenseDescription" placeholder="Ej. carne, tortillas, gasolina reparto"></label>
      <label class="field"><span>Cantidad de insumo</span><input class="input" id="v12ExpenseQty" type="number" min="0" step="0.001" value="1"></label>
      <label class="field"><span>Unidad</span><input class="input" id="v12ExpenseUnit" placeholder="kg, L, pieza, paquete" value="pieza"></label>
      <label class="field"><span>Precio por unidad</span><input class="input" id="v12ExpenseUnitCost" type="number" min="0" step="0.01" value="0"></label>
      <label class="field"><span>Gasolina / importe adicional</span><input class="input" id="v12ExpenseFuel" type="number" min="0" step="0.01" value="0"></label>
    </div>
    <label class="field"><span>Notas</span><textarea class="textarea" id="v12ExpenseNotes"></textarea></label>
    <button class="btn" id="v12ExpenseSave">${UI.save}<span>Guardar gasto</span></button>
    <p class="v12-report-note">Total = cantidad × precio unitario + importe adicional. Para gasolina puedes dejar cantidad/precio en cero y capturar el total en “Gasolina / importe adicional”.</p>
  </section>
  <section class="section-card"><div class="v12-section-title"><h3>Gastos recientes</h3><button class="btn secondary" id="v12ExpenseReload">${UI.refresh}<span>Actualizar</span></button></div><div id="v12ExpenseList" class="v12-expense-list"><p>Cargando…</p></div></section>`;
  const load=async()=>{
    const host=document.getElementById('v12ExpenseList');
    try{
      const r=await v12Expense('list',{limit:300});
      const rows=r?.expenses||[];
      host.innerHTML=rows.length?rows.map(x=>`<article class="v12-expense-row"><div><strong>${esc(x.description||x.expense_type)}</strong><p class="small muted">${esc(new Date(x.expense_date).toLocaleDateString('es-MX'))} · ${esc(x.expense_type)}${x.product_name?' · '+esc(x.product_name):''}</p><p>${Number(x.quantity||0)} ${esc(x.unit||'')} × ${money(Number(x.unit_cost||0))}${Number(x.extra_amount||0)?' + '+money(Number(x.extra_amount))+' adicional':''}</p><p class="small">${esc(x.notes||'')}</p></div><div class="right"><div class="v12-expense-total">${money(Number(x.total_amount||0))}</div><button class="icon-btn" data-v12-expense-delete="${esc(x.id)}">${UI.trash}</button></div></article>`).join(''):'<div class="v12-empty">Aún no hay gastos registrados.</div>';
      host.querySelectorAll('[data-v12-expense-delete]').forEach(b=>b.onclick=e=>panelRun(e.currentTarget,async()=>{if(!confirm('¿Eliminar este gasto?'))return;await v12Expense('delete',{id:b.dataset.v12ExpenseDelete});await load()},'Gasto eliminado.'));
    }catch(e){host.innerHTML='<div class="notice">Instala vibraerotica_v12_migracion.sql para habilitar gastos. '+esc(e.message)+'</div>'}
  };
  document.getElementById('v12ExpenseSave').onclick=e=>panelRun(e.currentTarget,async()=>{
    const qty=Math.max(0,Number(document.getElementById('v12ExpenseQty').value)||0);
    const unitCost=Math.max(0,Number(document.getElementById('v12ExpenseUnitCost').value)||0);
    const extra=Math.max(0,Number(document.getElementById('v12ExpenseFuel').value)||0);
    const description=document.getElementById('v12ExpenseDescription').value.trim();
    if(!description)throw Error('Escribe la descripción del gasto.');
    await v12Expense('save',{
      expense_date:document.getElementById('v12ExpenseDate').value,
      expense_type:document.getElementById('v12ExpenseType').value,
      product_id:document.getElementById('v12ExpenseProduct').value||null,
      product_name:document.getElementById('v12ExpenseProduct').selectedOptions[0]?.textContent||'',
      description,quantity:qty,unit:document.getElementById('v12ExpenseUnit').value.trim(),
      unit_cost:unitCost,extra_amount:extra,total_amount:qty*unitCost+extra,
      notes:document.getElementById('v12ExpenseNotes').value.trim()
    });await load();
  },'Gasto registrado.');
  document.getElementById('v12ExpenseReload').onclick=load;
  await load();
}

/* ---------- Dashboard avanzado ---------- */
function v12OrderCompleted(o){
  return !o.suspected_false && (String(o.fulfillment_stage||'').toLowerCase()==='entregado'||String(o.status||'').toLowerCase()==='entregado'||(String(o.payment_status||'').toUpperCase()==='APPROVED'&&String(o.status||'').toLowerCase()!=='cancelado'));
}
function v12OrderFalse(o){return !!o.suspected_false}
function v12OrderIncomplete(o){return !v12OrderCompleted(o)&&!v12OrderFalse(o)}
function v12OrderDate(o){return new Date(o.created_at||o.date||Date.now())}
function v12StartOf(period,date=new Date()){
  const d=new Date(date);
  if(period==='day')return new Date(d.getFullYear(),d.getMonth(),d.getDate());
  if(period==='year')return new Date(d.getFullYear(),0,1);
  return new Date(d.getFullYear(),d.getMonth(),1);
}
function v12EndOf(period,date=new Date()){
  const s=v12StartOf(period,date);
  if(period==='day')return new Date(s.getFullYear(),s.getMonth(),s.getDate()+1);
  if(period==='year')return new Date(s.getFullYear()+1,0,1);
  return new Date(s.getFullYear(),s.getMonth()+1,1);
}
async function v12DashboardData(period='month',anchor=new Date()){
  const [ordersResult,expenseResult]=await Promise.allSettled([
    safeSelect('orders','*',{order:'created_at',limit:1500}),
    v12Expense('list',{limit:2000})
  ]);
  const orders=ordersResult.status==='fulfilled'?ordersResult.value:(state.orders||[]);
  const expenses=expenseResult.status==='fulfilled'?(expenseResult.value?.expenses||[]):[];
  const start=v12StartOf(period,anchor),end=v12EndOf(period,anchor);
  const po=orders.filter(o=>{const d=v12OrderDate(o);return d>=start&&d<end});
  const pe=expenses.filter(x=>{const d=new Date(x.expense_date+'T12:00:00');return d>=start&&d<end});
  return {orders,expenses,po,pe,start,end,expenseError:expenseResult.status==='rejected'?expenseResult.reason:null};
}
function v12Money(n){return money(Number(n)||0)}
function v12MetricLabel(period,start){
  if(period==='day')return start.toLocaleDateString('es-MX',{dateStyle:'long'});
  if(period==='year')return String(start.getFullYear());
  return start.toLocaleDateString('es-MX',{month:'long',year:'numeric'});
}
function v12DrawChart(canvas,labels,values,title){
  if(!canvas)return;
  const dpr=window.devicePixelRatio||1,w=Math.max(320,canvas.clientWidth||600),h=250;
  canvas.width=w*dpr;canvas.height=h*dpr;
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,w,h);
  const css=getComputedStyle(document.body),text=css.getPropertyValue('--text').trim()||'#222',muted=css.getPropertyValue('--muted').trim()||'#777',primary=css.getPropertyValue('--primary').trim()||'#c62828',line=css.getPropertyValue('--line').trim()||'#ddd';
  ctx.font='12px sans-serif';ctx.fillStyle=text;ctx.fillText(title,10,18);
  const pad={l:44,r:12,t:32,b:42},cw=w-pad.l-pad.r,ch=h-pad.t-pad.b,max=Math.max(1,...values.map(Number));
  ctx.strokeStyle=line;ctx.beginPath();ctx.moveTo(pad.l,pad.t);ctx.lineTo(pad.l,pad.t+ch);ctx.lineTo(pad.l+cw,pad.t+ch);ctx.stroke();
  const bw=Math.max(4,cw/Math.max(1,values.length)*.58);
  values.forEach((v,i)=>{
    const x=pad.l+(i+.5)*cw/values.length-bw/2,bh=(Number(v)/max)*ch,y=pad.t+ch-bh;
    ctx.fillStyle=primary;ctx.fillRect(x,y,bw,bh);
    ctx.save();ctx.translate(x+bw/2,pad.t+ch+8);ctx.rotate(-.45);ctx.textAlign='right';ctx.fillStyle=muted;ctx.font='10px sans-serif';ctx.fillText(String(labels[i]||''),0,0);ctx.restore();
  });
  ctx.fillStyle=muted;ctx.font='10px sans-serif';ctx.fillText(v12Money(max),3,pad.t+4);ctx.fillText('$0',18,pad.t+ch);
}
function v12DailySeries(orders,start,end){
  const labels=[],values=[],d=new Date(start);
  while(d<end){
    const key=d.toISOString().slice(0,10);labels.push(d.toLocaleDateString('es-MX',{day:'2-digit',month:'short'}));
    values.push(orders.filter(o=>v12OrderCompleted(o)&&v12OrderDate(o).toISOString().slice(0,10)===key).reduce((a,o)=>a+Number(o.total||0),0));
    d.setDate(d.getDate()+1);
  }
  return {labels,values};
}
function v12OrderItems(o){
  const items=o.items||o.order_items||o.line_items||o.products;
  return Array.isArray(items)?items:[];
}
function v12TopProducts(orders){
  const map=new Map();
  orders.filter(v12OrderCompleted).forEach(o=>v12OrderItems(o).forEach(i=>{
    const id=String(i.id||i.product_id||i.product?.id||i.name||'');
    const name=i.name||i.product_name||i.product?.name||state.products.find(p=>String(p.id)===id)?.name||id;
    const qty=Number(i.qty||i.quantity||1),amount=Number(i.total||i.line_total||((i.price||i.unit_price||0)*qty));
    const x=map.get(id)||{id,name,qty:0,revenue:0};x.qty+=qty;x.revenue+=amount;map.set(id,x);
  }));
  /* Si el backend no devuelve líneas, usa el agregado público de ventas. */
  if(!map.size)Object.values(v12SocialStats).forEach(s=>{
    const p=state.products.find(p=>String(p.id)===String(s.product_id));
    if(p&&Number(s.sales_qty)>0)map.set(String(p.id),{id:String(p.id),name:p.name,qty:Number(s.sales_qty),revenue:0});
  });
  return [...map.values()].sort((a,b)=>b.qty-a.qty).slice(0,10);
}
function v12ExpenseByProduct(expenses){
  const m=new Map();
  expenses.forEach(x=>{
    const id=String(x.product_id||x.product_name||'Otros'),name=x.product_name||x.description||'Otros';
    const r=m.get(id)||{name,cost:0};r.cost+=Number(x.total_amount||0);m.set(id,r);
  });
  return m;
}
async function renderAdminDashboard(c){
  const today=new Date().toISOString().slice(0,10);
  c.innerHTML=`<section class="section-card">
    <div class="v12-section-title"><div><h3>Dashboard de ventas</h3><p class="small muted">Ventas concretadas, pedidos no completados/falsos, gastos y utilidad estimada.</p></div></div>
    <div class="v12-dashboard-toolbar">
      <label class="field"><span>Periodo</span><select class="select" id="v12DashPeriod"><option value="day">Diario</option><option value="month" selected>Mensual</option><option value="year">Anual</option></select></label>
      <label class="field"><span>Fecha de referencia</span><input class="input" id="v12DashDate" type="date" value="${today}"></label>
      <button class="btn secondary" id="v12DashRefresh">${UI.refresh}<span>Actualizar</span></button>
      <button class="btn secondary" id="v12DashPdf">${UI.download}<span>PDF mensual</span></button>
      <button class="btn secondary" id="v12DashExcel">${UI.download}<span>Excel</span></button>
    </div>
  </section>
  <div id="v12DashboardBody"><p class="muted">Cargando métricas…</p></div>`;
  let current=null;
  const load=async()=>{
    const period=document.getElementById('v12DashPeriod').value,anchor=new Date(document.getElementById('v12DashDate').value+'T12:00:00');
    current=await v12DashboardData(period,anchor);
    const completed=current.po.filter(v12OrderCompleted),falseOrders=current.po.filter(v12OrderFalse),incomplete=current.po.filter(v12OrderIncomplete);
    const sales=completed.reduce((a,o)=>a+Number(o.total||0),0),expenses=current.pe.reduce((a,x)=>a+Number(x.total_amount||0),0),profit=sales-expenses;
    const avg=completed.length?sales/completed.length:0;
    const series=v12DailySeries(completed,current.start,current.end);
    const tops=v12TopProducts(current.po),costMap=v12ExpenseByProduct(current.pe),maxQty=Math.max(1,...tops.map(x=>x.qty));
    const host=document.getElementById('v12DashboardBody');
    host.innerHTML=`<div class="v12-kpis">
      <div class="v12-kpi"><span>Ventas concretadas</span><strong>${completed.length}</strong></div>
      <div class="v12-kpi"><span>Ingresos</span><strong>${v12Money(sales)}</strong></div>
      <div class="v12-kpi"><span>Gastos</span><strong>${v12Money(expenses)}</strong></div>
      <div class="v12-kpi"><span>Ganancia estimada</span><strong>${v12Money(profit)}</strong></div>
      <div class="v12-kpi"><span>No completadas</span><strong>${incomplete.length}</strong></div>
      <div class="v12-kpi"><span>Marcadas falsas</span><strong>${falseOrders.length}</strong></div>
    </div>
    <div class="section-card"><strong>${esc(v12MetricLabel(period,current.start))}</strong><p class="small muted">Ticket promedio ${v12Money(avg)} · ${current.po.length} pedidos en el periodo.</p>${current.expenseError?'<div class="notice">Gastos no disponibles: instala la migración V12.</div>':''}</div>
    <div class="v12-chart-grid">
      <section class="v12-chart-card"><canvas id="v12SalesChart"></canvas></section>
      <section class="v12-chart-card"><canvas id="v12StatusChart"></canvas></section>
    </div>
    <section class="section-card">
      <h3>Productos más vendidos</h3>
      <div class="v12-top-products">${tops.length?tops.map(t=>`<div class="v12-top-product"><div><strong>${esc(t.name)}</strong><div class="small muted">${t.qty} unidades${t.revenue?' · '+v12Money(t.revenue)+' vendidos':''}${costMap.get(String(t.id))?' · '+v12Money(costMap.get(String(t.id)).cost)+' en gastos asociados':''}</div><div class="v12-bar"><span style="width:${Math.max(3,t.qty/maxQty*100)}%"></span></div></div><strong>${t.qty}</strong></div>`).join(''):'<div class="v12-empty">No hay detalle de productos en las ventas de este periodo.</div>'}</div>
    </section>
    <section class="section-card"><h3>Comparación gasto / ganancia</h3><div class="table-wrap"><table class="admin-table"><thead><tr><th>Concepto</th><th>Importe</th></tr></thead><tbody><tr><td>Ventas concretadas</td><td>${v12Money(sales)}</td></tr><tr><td>Gastos e insumos</td><td>${v12Money(expenses)}</td></tr><tr><td><strong>Ganancia estimada</strong></td><td><strong>${v12Money(profit)}</strong></td></tr></tbody></table></div><p class="v12-report-note">Ganancia estimada = ventas concretadas − gastos registrados. No sustituye contabilidad fiscal ni incluye costos que no hayas capturado.</p></section>`;
    requestAnimationFrame(()=>{
      v12DrawChart(document.getElementById('v12SalesChart'),series.labels,series.values,'Ventas concretadas por día');
      v12DrawChart(document.getElementById('v12StatusChart'),['Concretadas','No completadas','Falsas'],[sales,incomplete.reduce((a,o)=>a+Number(o.total||0),0),falseOrders.reduce((a,o)=>a+Number(o.total||0),0)],'Importe por estado');
    });
  };
  document.getElementById('v12DashRefresh').onclick=e=>panelRun(e.currentTarget,load);
  document.getElementById('v12DashPdf').onclick=e=>panelRun(e.currentTarget,async()=>{await v12MonthlyPdf(new Date(document.getElementById('v12DashDate').value+'T12:00:00'))},'Reporte PDF generado.');
  document.getElementById('v12DashExcel').onclick=e=>panelRun(e.currentTarget,async()=>{await v12ExportExcel(new Date(document.getElementById('v12DashDate').value+'T12:00:00'))},'Reporte Excel generado.');
  await load();
}
async function v12MonthlyPdf(anchor){
  const d=await v12DashboardData('month',anchor),completed=d.po.filter(v12OrderCompleted),falseOrders=d.po.filter(v12OrderFalse),incomplete=d.po.filter(v12OrderIncomplete);
  const sales=completed.reduce((a,o)=>a+Number(o.total||0),0),expenses=d.pe.reduce((a,x)=>a+Number(x.total_amount||0),0),profit=sales-expenses;
  const {jsPDF}=window.jspdf,doc=new jsPDF({unit:'mm',format:'a4'});
  doc.setFont('helvetica','bold');doc.setFontSize(18);doc.text('Reporte mensual · '+state.config.businessName,14,18);
  doc.setFontSize(11);doc.setFont('helvetica','normal');doc.text(v12MetricLabel('month',d.start),14,26);
  doc.autoTable({startY:33,head:[['Métrica','Resultado']],body:[
    ['Ventas concretadas',String(completed.length)],['Ingresos',v12Money(sales)],['Gastos',v12Money(expenses)],['Ganancia estimada',v12Money(profit)],['No completadas',String(incomplete.length)],['Marcadas falsas',String(falseOrders.length)]
  ],theme:'grid'});
  const y=doc.lastAutoTable.finalY+8;
  doc.text('Gastos e insumos',14,y);
  doc.autoTable({startY:y+3,head:[['Fecha','Tipo','Descripción','Cantidad','Total']],body:d.pe.map(x=>[String(x.expense_date||''),String(x.expense_type||''),String(x.description||''),`${Number(x.quantity||0)} ${x.unit||''}`,v12Money(x.total_amount)])||[] ,theme:'striped'});
  doc.save(`reporte-${d.start.getFullYear()}-${String(d.start.getMonth()+1).padStart(2,'0')}.pdf`);
}
async function v12ExportExcel(anchor){
  if(!window.XLSX)throw Error('No se cargó el módulo de Excel. Revisa la conexión a internet.');
  const d=await v12DashboardData('month',anchor),completed=d.po.filter(v12OrderCompleted);
  const summary=[
    {Metrica:'Periodo',Valor:v12MetricLabel('month',d.start)},
    {Metrica:'Ventas concretadas',Valor:completed.length},
    {Metrica:'Ingresos',Valor:completed.reduce((a,o)=>a+Number(o.total||0),0)},
    {Metrica:'Gastos',Valor:d.pe.reduce((a,x)=>a+Number(x.total_amount||0),0)},
    {Metrica:'Ganancia estimada',Valor:completed.reduce((a,o)=>a+Number(o.total||0),0)-d.pe.reduce((a,x)=>a+Number(x.total_amount||0),0)},
    {Metrica:'No completadas',Valor:d.po.filter(v12OrderIncomplete).length},
    {Metrica:'Falsas',Valor:d.po.filter(v12OrderFalse).length}
  ];
  const orders=d.po.map(o=>({Folio:o.public_id||o.folio||o.id,Fecha:v12OrderDate(o).toLocaleString('es-MX'),Cliente:o.customer_name||o.customer?.name||'',Total:Number(o.total||0),Pago:o.payment_status||'',Estado:o.fulfillment_stage||o.status||'',Falso:!!o.suspected_false}));
  const expenses=d.pe.map(x=>({Fecha:x.expense_date,Tipo:x.expense_type,Producto:x.product_name||'',Descripcion:x.description,Cantidad:Number(x.quantity||0),Unidad:x.unit||'',Precio_unitario:Number(x.unit_cost||0),Adicional:Number(x.extra_amount||0),Total:Number(x.total_amount||0),Notas:x.notes||''}));
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(summary),'Resumen');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(orders),'Pedidos');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(expenses),'Gastos');
  XLSX.writeFile(wb,`reporte-${d.start.getFullYear()}-${String(d.start.getMonth()+1).padStart(2,'0')}.xlsx`);
}

/* Intercepta el nuevo módulo, manteniendo el resto del panel. */
const v12AdminPaneBase=renderAdminPane;
renderAdminPane=async function(id){
  if(id!=='expenses')return v12AdminPaneBase(id);
  if(!panelCan(id))return toast('Sin permiso para gastos.','error');
  activeAdmin=id;const epoch=++panelEpoch;document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  const c=document.getElementById('adminContent');c.innerHTML='<p>Cargando gastos…</p>';
  try{await v12RenderExpenses(c)}catch(e){if(epoch===panelEpoch)c.innerHTML='<div class="notice">'+esc(e.message)+'</div>'}
};

/* ---------- Auth: refresca favoritos y callout ---------- */
const v12AuthChangedBase=customerAuthChanged;
customerAuthChanged=async function(session){
  await v12AuthChangedBase(session);
  v12GuestCallout();
  v12RefreshSocial().catch(()=>{});
};
const v12AccountButtonBase=renderAccountButton;
renderAccountButton=function(){v12AccountButtonBase();v12GuestCallout()};

/* ---------- API de navegación para módulos de versiones posteriores ---------- */
Object.assign(window, {
  V12I,
  v12OpenMore,
  v12OpenOffers,
  v12OpenFavorites,
  v12OpenCategories,
  v12OpenBusinessReviews,
  v12HomeNav,
  v12IsInternalProduct
});

/* ---------- Inicio ---------- */
v12InstallBottomNav();
v12HomeNav();
v12GuestCallout();
setTimeout(()=>{v12RefreshSocial().catch(()=>{});renderCatalog()},1000);
})();
