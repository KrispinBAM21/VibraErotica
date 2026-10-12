/* Módulo: js/fixes-v15.js | Función: lógica original del bloque 18 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
'use strict';

const PINS={
 pin:`<svg viewBox="0 0 24 24"><path d="M12 21s7-5.8 7-12a7 7 0 1 0-14 0c0 6.2 7 12 7 12z"/><circle cx="12" cy="9" r="2.3"/></svg>`,
 store:`<svg viewBox="0 0 24 24"><path d="M4 10v10h16V10M3 10l2-6h14l2 6"/><path d="M3 10c1 3 4 3 5 0 1 3 4 3 5 0 1 3 4 3 5 0 1 3 3 3 4 0M9 20v-6h6v6"/></svg>`,
 home:`<svg viewBox="0 0 24 24"><path d="M3 11 12 3l9 8v9H5v-9"/><path d="M9 20v-6h6v6"/></svg>`,
 food:`<svg viewBox="0 0 24 24"><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M15 3v18M15 3c4 2 4 8 0 10"/></svg>`,
 burger:`<svg viewBox="0 0 24 24"><path d="M5 10c1-4 3-6 7-6s6 2 7 6M4 10h16M5 14h14M6 18h12"/><path d="M5 14c2 2 4-2 6 0s4-2 8 0"/></svg>`,
 star:`<svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/></svg>`,
 loto:`<svg viewBox="0 0 24 24"><path d="M12 21c-6-3-9-7-9-12 4 0 7 2 9 6 2-4 5-6 9-6 0 5-3 9-9 12z M12 15C8 11 8 7 12 3c4 4 4 8 0 12z"/></svg>`, corazon:`<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/></svg>`, estrella:`<svg viewBox="0 0 24 24"><path d="m12 2 3 6.2 6.8 1-4.9 4.8 1.2 6.8L12 17.6 5.9 20.8l1.2-6.8-4.9-4.8 6.8-1z"/></svg>`, regalo:`<svg viewBox="0 0 24 24"><path d="M3 9h18v12H3z M12 9v12M3 13h18M12 9C4 9 5 2 9 3c2 0 3 3 3 6zm0 0c8 0 7-7 3-6-2 0-3 3-3 6z"/></svg>`, flama:`<svg viewBox="0 0 24 24"><path d="M12 22c-5 0-8-4-8-8 0-4 4-7 7-12 0 5 4 6 5 10 2-2 3-4 3-6 4 6 2 16-7 16z"/></svg>`, ubicacion:`<svg viewBox="0 0 24 24"><path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z M12 9h.01"/></svg>`, calendario:`<svg viewBox="0 0 24 24"><path d="M3 5h18v16H3z M7 2v6M17 2v6M3 11h18"/></svg>`, reloj:`<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v6l4 2"/></svg>`, chat:`<svg viewBox="0 0 24 24"><path d="M4 4h16v13H9l-5 4V4z"/></svg>`, escudo:`<svg viewBox="0 0 24 24"><path d="M12 2 21 6v6c0 6-4 9-9 10-5-1-9-4-9-10V6z M8 12l3 3 5-6"/></svg>`, bolsa:`<svg viewBox="0 0 24 24"><path d="M4 8h16l-1 13H5L4 8zM9 9V6a3 3 0 0 1 6 0v3"/></svg>`, sol:`<svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2"/></svg>`, luna:`<svg viewBox="0 0 24 24"><path d="M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11z"/></svg>`, copa:`<svg viewBox="0 0 24 24"><path d="M5 3h14l-2 10a5 5 0 0 1-10 0L5 3zM12 18v4M7 22h10"/></svg>`, usuario:`<svg viewBox="0 0 24 24"><path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M4 22v-3a8 8 0 0 1 16 0v3"/></svg>`, diamante:`<svg viewBox="0 0 24 24"><path d="M3 9 8 3h8l5 6-9 12L3 9z M3 9h18M8 3l4 18L16 3"/></svg>`, musica:`<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3zM21 16a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3z"/></svg>`, camara:`<svg viewBox="0 0 24 24"><path d="M3 7h5l2-3h4l2 3h5v13H3zM12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>`, check:`<svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg>`, candado:`<svg viewBox="0 0 24 24"><path d="M5 10h14v11H5z M8 10V7a4 4 0 0 1 8 0v3"/></svg>`
};
function cfg(){
 state.config.businessPin ||= {icon:'store',color:'#16324f',label:'Local'};
 state.config.catalogCategories ||= [];
 return state.config;
}

/* -------- Encabezado: vuelve a aplicar tamaño correcto después de cada render -------- */
const headerBase=renderHeader;
renderHeader=function(){
 headerBase();
 const theme=document.getElementById('themeBtn'),account=document.getElementById('customerAccountBtn');
 if(theme)theme.classList.add('v15-header-control');
 if(account)account.classList.add('v15-header-control');
};

/* -------- Categorías: siempre visibles en admin y desde Productos -------- */
function categoryNames(){
 const set=new Set((cfg().catalogCategories||[]).filter(Boolean));
 state.products.filter(p=>!String(p.category||'').startsWith('_')).forEach(p=>p.category&&set.add(p.category));
 return [...set].sort((a,b)=>a.localeCompare(b,'es'));
}
function ensureAdminTabs(){
 const add=(after,id,label,icon)=>{
   if(adminTabs.some(x=>x[0]===id))return;
   const i=Math.max(0,adminTabs.findIndex(x=>x[0]===after)+1);
   adminTabs.splice(i,0,[id,label,icon]);
 };
 add('products','categories','Categorías y filtros',UI.products);
 add('business','profile','Perfil, redes y opiniones',UI.business);
}
ensureAdminTabs();

const renderAdminBase=renderAdmin;
renderAdmin=function(){ensureAdminTabs();renderAdminBase()};

const productAdminBase=renderProductsAdmin;
renderProductsAdmin=function(c){
 productAdminBase(c);
 if(!c||document.getElementById('v15CategoryBanner'))return;
 const toolbar=c.querySelector('.toolbar');
 const banner=document.createElement('section');banner.id='v15CategoryBanner';banner.className='v15-category-banner';
 banner.innerHTML=`<h3>Categorías y filtros del catálogo</h3><p>Desde aquí puedes crear categorías, renombrarlas y mover productos. Organiza tus productos y profesionales desde este módulo.</p><button class="btn secondary" id="v15OpenCategories">${UI.products}<span>Administrar categorías y productos</span></button>`;
 toolbar?.after(banner);
 document.getElementById('v15OpenCategories').onclick=()=>renderAdminPane('categories');

 const cats=['Sin categoría',...categoryNames()];
 c.querySelectorAll('.product-admin').forEach(row=>{
   const edit=row.querySelector('[data-edit-product]');if(!edit)return;
   const p=state.products.find(x=>x.id===edit.dataset.editProduct);if(!p||String(p.category||'').startsWith('_'))return;
   const info=row.children[1];if(!info||info.querySelector('.v15-product-category'))return;
   const s=document.createElement('select');s.className='select v15-product-category';s.setAttribute('aria-label','Categoría de '+p.name);
   s.innerHTML=cats.map(x=>`<option value="${esc(x)}" ${x===p.category?'selected':''}>${esc(x)}</option>`).join('');
   s.onchange=async()=>{
     p.category=s.value;saveLocal();renderCategories();renderCatalog();
     try{await syncAdminStateToCloud()}catch{}
     toast('Categoría actualizada.','ok');
   };
   info.append(s);
 });
};

async function v15CategoriesAdmin(c){
 cfg();const cats=categoryNames();
 c.innerHTML=`<section class="section-card">
   <h3>Categorías y filtros</h3>
   <p class="small muted">Crea o elimina categorías y decide exactamente qué productos pertenecen a cada una. Inicio muestra todo; Más vendidos se ordena por ventas; Por tiempo sólo muestra productos con oferta activa.</p>
   <div class="toolbar"><input class="input" id="v15NewCategory" placeholder="Nombre de nueva categoría"><button class="btn" id="v15AddCategory">${UI.plus}<span>Crear categoría</span></button></div>
 </section>
 <section class="section-card"><h3>Categorías actuales</h3><div class="v15-category-table">
 ${cats.map(cat=>{
   const members=state.products.filter(p=>p.category===cat&&!String(p.category||'').startsWith('_'));
   return `<div class="v15-category-row"><div><strong>${esc(cat)}</strong><div class="v15-category-members">${members.length?members.map(p=>esc(p.name)).join(' · '):'Sin productos'}</div></div><button class="btn secondary" data-v15-rename="${esc(cat)}">${UI.edit}<span>Renombrar</span></button><button class="btn ghost" data-v15-delete="${esc(cat)}">${UI.trash}<span>Eliminar</span></button></div>`;
 }).join('')||'<p>No hay categorías.</p>'}
 </div></section>
 <section class="section-card"><h3>Asignar productos</h3>
 ${state.products.filter(p=>!String(p.category||'').startsWith('_')).map(p=>`<div class="product-admin"><div class="product-visual" style="width:50px;height:50px">${productVisual(p)}</div><div><strong>${esc(p.name)}</strong><div class="small muted">${money(p.price)}</div></div><select class="select v15-product-category" data-v15-product-cat="${esc(p.id)}">${['Sin categoría',...cats].map(x=>`<option value="${esc(x)}" ${x===p.category?'selected':''}>${esc(x)}</option>`).join('')}</select></div>`).join('')}
 </section>`;
 document.getElementById('v15AddCategory').onclick=async()=>{
   const n=document.getElementById('v15NewCategory').value.trim();if(!n)return toast('Escribe una categoría.','info');
   const previous=[...state.config.catalogCategories];if(!state.config.catalogCategories.includes(n))state.config.catalogCategories.push(n);
   saveLocal();renderCategories();renderCatalog();try{await syncAdminStateToCloud();toast('Categoría guardada en Supabase.','ok');renderAdminPane('categories')}catch(e){state.config.catalogCategories=previous;saveLocal();renderCategories();renderCatalog();toast('No se guardó en Supabase: '+(e.message||e),'error');renderAdminPane('categories');document.getElementById('v15NewCategory').value=n;}
 };
 c.querySelectorAll('[data-v15-product-cat]').forEach(s=>s.onchange=async()=>{
   const p=state.products.find(x=>x.id===s.dataset.v15ProductCat);if(!p)return;p.category=s.value;
   saveLocal();renderCategories();renderCatalog();try{await syncAdminStateToCloud()}catch{};toast('Producto movido.','ok');
 });
 c.querySelectorAll('[data-v15-rename]').forEach(b=>b.onclick=()=>{
   const old=b.dataset.v15Rename,name=prompt('Nuevo nombre para la categoría:',old);if(name===null)return;const nn=name.trim();if(!nn)return;
   state.products.forEach(p=>{if(p.category===old)p.category=nn});state.config.catalogCategories=state.config.catalogCategories.map(x=>x===old?nn:x);if(!state.config.catalogCategories.includes(nn))state.config.catalogCategories.push(nn);
   saveLocal();syncAdminStateToCloud().then(()=>toast('Categorías guardadas en Supabase.','ok')).catch(e=>toast('Error al guardar categoría: '+e.message,'error'));renderCategories();renderCatalog();renderAdminPane('categories');
 });
 c.querySelectorAll('[data-v15-delete]').forEach(b=>b.onclick=()=>{
   const cat=b.dataset.v15Delete;if(!confirm(`¿Eliminar “${cat}”? Los productos pasarán a “Sin categoría”.`))return;
   state.products.forEach(p=>{if(p.category===cat)p.category='Sin categoría'});state.config.catalogCategories=state.config.catalogCategories.filter(x=>x!==cat);
   saveLocal();syncAdminStateToCloud().then(()=>toast('Categorías guardadas en Supabase.','ok')).catch(e=>toast('Error al guardar categoría: '+e.message,'error'));renderCategories();renderCatalog();renderAdminPane('categories');
 });
}

/* -------- Calificación: bloque público siempre visible -------- */
async function community(action,payload={}){
 if(!supabaseClient)throw Error('Conectando con Supabase.');
 const {data,error}=await supabaseClient.rpc('catalog_community',{p_action:action,p_payload:payload});if(error)throw error;return data;
}
let summary={followers:0,following:false,scores:{overall:0,service:0,food:0,reviews:0}};
async function refreshExperience(){
 try{summary=await community('summary',{})||summary}catch{}
 paintExperience();
}
function paintExperience(){
 let h=document.getElementById('v15Experience');
 if(!h){h=document.createElement('section');h.id='v15Experience';h.className='container v15-experience-card';document.querySelector('.container.controls')?.before(h)}
 const s=summary.scores||{},avg=Number(s.overall||0);
 h.innerHTML=`<div><h3>Tu experiencia importa</h3><p>Califica el negocio, servicio y experiencia. También puedes consultar lo que opinan otros clientes.</p><div class="v15-rating-summary"><span class="v15-stars-text">${avg?('★'.repeat(Math.round(avg))):'☆☆☆☆☆'}</span><span>${avg?avg.toFixed(1):'Sin calificaciones'} · ${Number(s.reviews||0)} opiniones · ${Number(summary.followers||0)} seguidores</span></div></div>
 <div class="v15-experience-actions"><button class="btn" id="v15RateBusiness"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3 2.8 6 6.6.9-4.8 4.7 1.2 6.6-5.8-3.1-5.8 3.1 1.2-6.6-4.8-4.7 6.6-.9Z"/></svg> <span>Calificar negocio</span></button><button class="btn secondary" id="v15ViewOpinions">${UI.review}<span>Ver opiniones</span></button><button class="btn secondary" id="v15Follow">${UI.check}<span>${summary.following?'Siguiendo':'Seguir'}</span></button></div>`;
 document.getElementById('v15RateBusiness').onclick=()=>openRating(false);
 document.getElementById('v15ViewOpinions').onclick=()=>openRating(true);
 document.getElementById('v15Follow').onclick=async e=>{
   if(!customerSession){toast('Inicia sesión para seguir al negocio.','info');renderCustomerProfile();openModal('customerProfileModal');return}
   try{const r=await community('toggle_follow',{});summary.following=r.following;summary.followers=r.followers;paintExperience()}catch(err){toast('Instala la migración V14 para activar seguidores.','error')}
 };
}
function starPicker(host,initial,onchange){
 let value=initial;
 const draw=()=>{host.innerHTML=[1,2,3,4,5].map(i=>`<button type="button" class="v14-star ${i<=value?'on':''}" data-v15-star="${i}">★</button>`).join('');host.querySelectorAll('button').forEach(b=>b.onclick=()=>{value=Number(b.dataset.v15Star);draw();onchange(value)})};draw();
}
async function openRating(viewOnly){
 const m=v4Modal('v15RatingModal',viewOnly?'Opiniones del negocio':'Calificar negocio'),body=m.querySelector('.modal-body');
 let overall=5,service=5,food=5;
 body.innerHTML=`${viewOnly?'':`<section class="section-card"><h3>¿Cómo fue tu experiencia?</h3><div class="v14-review-grid"><div class="v14-score"><strong>Negocio</strong><div id="v15Overall" class="v14-stars"></div></div><div class="v14-score"><strong>Servicio</strong><div id="v15Service" class="v14-stars"></div></div><div class="v14-score"><strong>Experiencia</strong><div id="v15Food" class="v14-stars"></div></div></div><textarea class="textarea" id="v15Comment" maxlength="1000" placeholder="Escribe tu comentario"></textarea><button class="btn full" id="v15PublishReview">${UI.check}<span>Publicar opinión</span></button></section>`}<section class="section-card"><h3>Opiniones recientes</h3><div id="v15Reviews">Cargando…</div></section>`;
 if(!viewOnly){
   starPicker(document.getElementById('v15Overall'),5,v=>overall=v);starPicker(document.getElementById('v15Service'),5,v=>service=v);starPicker(document.getElementById('v15Food'),5,v=>food=v);
   document.getElementById('v15PublishReview').onclick=async()=>{
     if(!customerSession){closeModal(m.id);toast('Inicia sesión para publicar.','info');renderCustomerProfile();openModal('customerProfileModal');return}
     const comment=document.getElementById('v15Comment').value.trim();if(comment.length<3)return toast('Escribe un comentario.','info');
     try{await community('review',{overall,service,food,comment});toast('Opinión publicada.','ok');document.getElementById('v15Comment').value='';await loadReviews();await refreshExperience()}catch(e){toast('Instala la migración V14 para publicar opiniones.','error')}
   };
 }
 openModal(m.id);await loadReviews();
}
async function loadReviews(){
 const h=document.getElementById('v15Reviews');if(!h)return;
 try{const r=await community('reviews',{});h.innerHTML=(r.reviews||[]).map(x=>`<article class="v12-review-card"><div class="row between"><strong>${esc(x.display_name||'Cliente')}</strong><span class="v15-stars-text">${'★'.repeat(Number(x.overall_rating||5))}</span></div><p>${esc(x.comment||'')}</p><small class="muted">Servicio ${x.service_rating}/5 · Experiencia ${x.food_rating}/5</small></article>`).join('')||'<p class="small muted">Aún no hay opiniones.</p>'}catch{h.innerHTML='<div class="notice">Las opiniones estarán disponibles al instalar la migración V14.</div>'}
}

/* -------- Pin de negocio personalizable -------- */
function pinHtml(){
 const p=cfg().businessPin||{},ico=PINS[p.icon]||PINS.store,color=p.color||'#16324f',label=p.label||'Local';
 return `<div class="v15-business-pin"><div class="label" style="background:${esc(color)}">${esc(label)}</div><div class="bubble" style="background:${esc(color)}"><span>${ico}</span></div></div>`;
}
labeledFoodPin=function(kind){
 if(kind!=='origin')return L.divIcon({className:'food-map-pin',html:`<span>Entrega</span>${FOOD.pin}`,iconSize:[44,56],iconAnchor:[22,52]});
 return L.divIcon({className:'',html:pinHtml(),iconSize:[54,64],iconAnchor:[27,58]});
};

const businessBase=renderBusinessAdmin;
renderBusinessAdmin=function(c){
 cfg();businessBase(c);
 if(document.getElementById('v15PinSection'))return;
 const p=state.config.businessPin;
 const section=document.createElement('section');section.id='v15PinSection';section.className='section-card';
 section.innerHTML=`<h3>Pin del negocio</h3><p class="small muted">Personaliza cómo se identifica tu local en los mapas públicos.</p><div class="v15-pin-picker">${Object.entries(PINS).filter(([k])=>!['food','burger'].includes(k)).map(([k,svg])=>`<button type="button" class="v15-pin-option ${p.icon===k?'selected':''}" data-v15-pin="${k}" title="${k}">${svg}</button>`).join('')}</div><div class="admin-grid two"><label class="field"><span>Color del pin</span><input id="v15PinColor" type="color" value="${esc(p.color||'#16324f')}"></label><label class="field"><span>Texto del pin</span><input class="input" id="v15PinLabel" value="${esc(p.label||'Local')}" maxlength="24"></label></div><div class="v15-pin-preview"><div id="v15PinPreview">${pinHtml()}</div><button class="btn" id="v15SavePin">${UI.save}<span>Guardar pin</span></button></div>`;
 c.prepend(section);
 section.querySelectorAll('[data-v15-pin]').forEach(b=>b.onclick=()=>{section.querySelectorAll('[data-v15-pin]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.config.businessPin.icon=b.dataset.v15Pin;document.getElementById('v15PinPreview').innerHTML=pinHtml()});
 document.getElementById('v15PinColor').oninput=e=>{state.config.businessPin.color=e.target.value;document.getElementById('v15PinPreview').innerHTML=pinHtml()};
 document.getElementById('v15PinLabel').oninput=e=>{state.config.businessPin.label=e.target.value||'Local';document.getElementById('v15PinPreview').innerHTML=pinHtml()};
 document.getElementById('v15SavePin').onclick=async e=>panelRun(e.currentTarget,async()=>{saveLocal();await syncAdminStateToCloud();if(originMap){originMap.remove();originMap=null;setTimeout(initOriginMap,60)}if(window.publicFoodMap){try{publicFoodMap.remove();publicFoodMap=null;setTimeout(initFoodPublicMap,60)}catch{}}},'Pin actualizado.');
};

/* -------- Router admin robusto -------- */
const paneBase=renderAdminPane;
renderAdminPane=async function(id){
 ensureAdminTabs();
 if(id==='categories'){
   activeAdmin=id;document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));const c=document.getElementById('adminContent');return v15CategoriesAdmin(c);
 }
 return paneBase(id);
};

/* ----- inicio ----- */
window.vibraPaintExperience=paintExperience;cfg();renderHeader();paintExperience();setTimeout(refreshExperience,900);
})();
