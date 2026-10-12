/* Módulo: js/enhancements-v14.js | Función: lógica original del bloque 17 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
'use strict';

/* ----- efectos táctiles ----- */
document.addEventListener('pointerdown',e=>{
 const el=e.target.closest('.btn,.icon-btn,.chip,.v12-social-btn,.v12-menu-item,.v12-bottom-nav button');
 if(!el)return;el.classList.add('v14-ripple-host');
 const r=document.createElement('span'),rect=el.getBoundingClientRect(),s=Math.max(rect.width,rect.height)*.45;
 r.className='v14-ripple';r.style.width=r.style.height=s+'px';r.style.left=(e.clientX-rect.left-s/2)+'px';r.style.top=(e.clientY-rect.top-s/2)+'px';
 el.append(r);setTimeout(()=>r.remove(),520);
},{passive:true});

/* ----- configuración pública ----- */
function v14Cfg(){
 state.config.publicProfile ||= {cover:'',avatar:'',bio:'',socials:{},show:true};
 state.config.catalogCategories ||= [];
 return state.config;
}
function v14Categories(){
 const cfg=v14Cfg(),set=new Set(cfg.catalogCategories.filter(Boolean));
 state.products.filter(p=>p.active&&!String(p.category||'').startsWith('_')).forEach(p=>p.category&&set.add(p.category));
 return [...set].sort((a,b)=>a.localeCompare(b,'es'));
}
function v14SocialName(k){return ({facebook:'Facebook',instagram:'Instagram',tiktok:'TikTok',x:'X',telegram:'Telegram',whatsapp:'WhatsApp',youtube:'YouTube',website:'Sitio web'})[k]||k}
async function v14Community(action,payload={}){
 if(!supabaseClient)throw Error('El sitio aún está conectando con Supabase.');
 const {data,error}=await supabaseClient.rpc('catalog_community',{p_action:action,p_payload:payload});
 if(error)throw error;if(data?.error)throw Error(data.error);return data;
}
let v14CommunityState={followers:0,following:false,goals:[],scores:null};

/* ----- portada, redes y seguir ----- */
async function v14RefreshCommunity(){
 try{v14CommunityState=await v14Community('summary',{});v14PaintProfile()}catch(e){console.info('Comunidad V14 pendiente:',e.message)}
}
// El perfil público vive únicamente en la ventana flotante del logotipo.
function v14PaintProfile(){document.getElementById('v14PublicProfile')?.remove()}

/* ----- calificación del sitio ----- */
function v14Stars(host,value,onChange){
 host.innerHTML=[1,2,3,4,5].map(n=>`<button type="button" class="v14-star ${n<=value?'on':''}" data-v14-star="${n}" aria-label="${n} estrellas">★</button>`).join('');
 host.querySelectorAll('[data-v14-star]').forEach(b=>b.onclick=()=>{value=Number(b.dataset.v14Star);host.querySelectorAll('button').forEach(x=>x.classList.toggle('on',Number(x.dataset.v14Star)<=value));onChange(value)});
}
async function v14OpenRating(){
 const m=v4Modal('v14SiteRatingModal','Califica el sitio, servicio y comida'),body=m.querySelector('.modal-body');
 let overall=5,service=5,food=5;
 body.innerHTML=`<div class="v14-review-grid"><div class="v14-score"><strong>General</strong><div id="v14Overall" class="v14-stars"></div></div><div class="v14-score"><strong>Servicio</strong><div id="v14Service" class="v14-stars"></div></div><div class="v14-score"><strong>Experiencia</strong><div id="v14Food" class="v14-stars"></div></div></div>
 <label class="field"><span>Comentario</span><textarea class="textarea" id="v14SiteComment" maxlength="1000" placeholder="Cuéntanos qué te gustó o qué podemos mejorar"></textarea></label>
 <button class="btn full" id="v14SendSiteReview">${V12I.comment}<span>Publicar opinión</span></button>
 <hr><div id="v14PublicReviews">Cargando opiniones…</div>`;
 v14Stars(document.getElementById('v14Overall'),overall,v=>overall=v);v14Stars(document.getElementById('v14Service'),service,v=>service=v);v14Stars(document.getElementById('v14Food'),food,v=>food=v);
 document.getElementById('v14SendSiteReview').onclick=async e=>{
  if(!customerSession){toast('Inicia sesión para publicar una opinión.','info');closeModal(m.id);renderCustomerProfile();openModal('customerProfileModal');return}
  const comment=document.getElementById('v14SiteComment').value.trim();if(comment.length<3)return toast('Escribe un comentario.','info');
  await panelRun(e.currentTarget,async()=>{await v14Community('review',{overall,service,food,comment});document.getElementById('v14SiteComment').value='';await v14LoadReviews()},'Gracias por tu opinión.');
 };
 openModal(m.id);await v14LoadReviews();
}
async function v14LoadReviews(){
 const h=document.getElementById('v14PublicReviews');if(!h)return;
 try{const r=await v14Community('reviews',{});h.innerHTML=(r.reviews||[]).map(x=>`<article class="v12-review-card"><div class="row between"><strong>${esc(x.display_name||'Cliente')}</strong><span>${'★'.repeat(Number(x.overall_rating||5))}</span></div><p>${esc(x.comment||'')}</p><small class="muted">Servicio ${x.service_rating}/5 · Experiencia ${x.food_rating}/5 · ${new Date(x.created_at).toLocaleDateString('es-MX')}</small></article>`).join('')||'<p class="small muted">Aún no hay opiniones.</p>'}catch(e){h.innerHTML='<div class="notice">Instala la migración V14 para habilitar opiniones.</div>'}
}

/* ----- notificaciones: elimina mensajes técnicos/admin ----- */
paintNotifications=function(){
 const host=document.getElementById('notificationsModal')?.querySelector('.modal-body');if(!host)return;
 const cards=[];
 if(!customerSession)cards.push(`<article class="v14-notice-card"><h4>Crea tu cuenta</h4><p>Guarda domicilios, favoritos e historial para no capturarlos de nuevo.</p><button class="btn secondary" data-v14-notice="account">Crear cuenta / iniciar sesión</button></article>`);
 else cards.push(`<article class="v14-notice-card"><h4>Guarda tus domicilios</h4><p>Administra tus direcciones desde Mi cuenta para agilizar tus siguientes pedidos.</p><button class="btn secondary" data-v14-notice="account">Ir a Mi cuenta</button></article>`);
 cards.push(`<article class="v14-notice-card"><h4>¿Cómo fue tu experiencia?</h4><p>Califica el sitio, el servicio y la comida con estrellas y deja un comentario.</p><button class="btn secondary" data-v14-notice="rating">Calificar ahora</button></article>`);
 if(trackingConfig.notifications_enabled){
   cards.push(...trackingEvents.slice().sort((a,b)=>Number(b.id)-Number(a.id)).slice(0,12).map(e=>`<article class="notification-item"><strong>${esc(e.title)}</strong><small>Pedido ${esc(trackingOrders.find(o=>o.id===e.order_id)?.folio||'')} · ${esc(new Date(e.created_at).toLocaleString('es-MX'))}</small></article>`));
 }
 host.innerHTML=cards.join('')||'<p>Sin notificaciones.</p>';
 host.querySelectorAll('[data-v14-notice="account"]').forEach(b=>b.onclick=()=>{closeModal('notificationsModal');renderCustomerProfile();openModal('customerProfileModal')});
 host.querySelectorAll('[data-v14-notice="rating"]').forEach(b=>b.onclick=()=>{closeModal('notificationsModal');v14OpenRating()});
};

/* ----- menú Más: agrega calificar sitio ----- */
const v14MoreBase=v12OpenMore;
v12OpenMore=function(){
 v14MoreBase();
 const body=document.getElementById('v12MoreModal')?.querySelector('.modal-body'),list=body?.querySelector('.v12-menu-list');if(!list||list.querySelector('[data-v14-rating]'))return;
 const b=document.createElement('button');b.className='v12-menu-item';b.dataset.v14Rating='1';b.innerHTML=`${V12I.heart}<span>Calificar sitio y servicio</span>`;b.onclick=()=>{closeModal('v12MoreModal');v14OpenRating()};list.append(b);
};

/* ----- categorías admin ----- */
if(!adminTabs.some(t=>t[0]==='categories')){
 const i=adminTabs.findIndex(t=>t[0]==='products')+1;adminTabs.splice(i,0,['categories','Categorías',V12I.grid]);
}
if(!adminTabs.some(t=>t[0]==='profile')){
 const i=adminTabs.findIndex(t=>t[0]==='business')+1;adminTabs.splice(i,0,['profile','Perfil y redes',V12I.heart]);
}
const v14CanBase=panelCan;
panelCan=function(id){if(id==='categories')return v14CanBase('products');if(id==='profile')return v14CanBase('business');return v14CanBase(id)};

async function v14RenderCategoriesAdmin(c){
 v14Cfg();const cats=v14Categories();
 c.innerHTML=`<section class="section-card"><h3>Catálogo de categorías</h3><p class="small muted">Las categorías controlan dónde aparece cada producto en el catálogo público.</p><div class="toolbar"><input class="input" id="v14NewCat" placeholder="Nueva categoría"><button class="btn" id="v14AddCat">${UI.plus}<span>Agregar categoría</span></button></div></section>
 <div id="v14CategoryAdmin">${cats.map(cat=>`<section class="v14-category-card" data-v14-cat="${esc(cat)}"><div class="v14-category-head"><div><strong>${esc(cat)}</strong><div class="small muted">${state.products.filter(p=>p.category===cat&&!v12IsInternalProduct(p)).length} productos</div></div><div class="toolbar"><button class="btn secondary" data-v14-rename="${esc(cat)}">${UI.edit}<span>Renombrar</span></button><button class="btn ghost" data-v14-deletecat="${esc(cat)}">${UI.trash}<span>Eliminar</span></button></div></div><div class="v14-category-products">${state.products.filter(p=>p.category===cat&&!v12IsInternalProduct(p)).map(p=>`<div class="v14-category-product"><span>${esc(p.name)}</span><select class="select" data-v14-move="${esc(p.id)}">${['Sin categoría',...cats].map(x=>`<option value="${esc(x)}" ${x===cat?'selected':''}>${esc(x)}</option>`).join('')}</select></div>`).join('')||'<span class="small muted">Sin productos.</span>'}</div></section>`).join('')}</div>`;
 document.getElementById('v14AddCat').onclick=e=>panelRun(e.currentTarget,async()=>{const name=document.getElementById('v14NewCat').value.trim();if(!name)throw Error('Escribe el nombre de la categoría.');if(!state.config.catalogCategories.includes(name))state.config.catalogCategories.push(name);saveLocal();await syncAdminStateToCloud();renderAdminPane('categories')},'Categoría agregada.');
 c.querySelectorAll('[data-v14-move]').forEach(s=>s.onchange=e=>panelRun(e.target,async()=>{const p=state.products.find(x=>x.id===s.dataset.v14Move);if(!p)return;p.category=s.value;saveLocal();await syncAdminStateToCloud();renderCategories();renderCatalog();renderAdminPane('categories')},'Producto movido.'));
 c.querySelectorAll('[data-v14-rename]').forEach(b=>b.onclick=()=>v14RenameCategory(b.dataset.v14Rename));
 c.querySelectorAll('[data-v14-deletecat]').forEach(b=>b.onclick=()=>v14DeleteCategory(b.dataset.v14Deletecat));
}
function v14TextModal(title,label,value,onSave){
 const m=v4Modal('v14TextModal',title),body=m.querySelector('.modal-body');body.innerHTML=`<div class="v14-reject-form"><label class="field"><span>${esc(label)}</span><input class="input" id="v14TextValue" value="${esc(value||'')}"></label><div class="toolbar"><button class="btn" id="v14TextSave">${UI.check}<span>Guardar</span></button><button class="btn secondary" data-close-modal="${m.id}">${UI.close}<span>Cancelar</span></button></div></div>`;body.querySelector('[data-close-modal]').onclick=()=>closeModal(m.id);document.getElementById('v14TextSave').onclick=async e=>{const v=document.getElementById('v14TextValue').value.trim();await panelRun(e.currentTarget,()=>onSave(v));closeModal(m.id)};openModal(m.id);setTimeout(()=>document.getElementById('v14TextValue').focus(),50)
}
function v14RenameCategory(old){
 v14TextModal('Renombrar categoría','Nuevo nombre',old,async name=>{if(!name)throw Error('Escribe un nombre.');state.products.forEach(p=>{if(p.category===old)p.category=name});state.config.catalogCategories=state.config.catalogCategories.map(x=>x===old?name:x);if(!state.config.catalogCategories.includes(name))state.config.catalogCategories.push(name);saveLocal();await syncAdminStateToCloud();renderCategories();renderCatalog();renderAdminPane('categories')});
}
function v14DeleteCategory(cat){
 const used=state.products.some(p=>p.category===cat&&!v12IsInternalProduct(p));
 const msg=used?'Los productos de esta categoría se moverán a “Sin categoría”. ¿Continuar?':'¿Eliminar esta categoría?';if(!confirm(msg))return;
 state.products.forEach(p=>{if(p.category===cat)p.category='Sin categoría'});state.config.catalogCategories=state.config.catalogCategories.filter(x=>x!==cat);saveLocal();syncAdminStateToCloud().then(()=>toast('Categorías guardadas en Supabase.','ok')).catch(e=>toast('Error al guardar categoría: '+e.message,'error'));renderCategories();renderCatalog();renderAdminPane('categories');
}

/* selector de categoría en el formulario de producto */
const v14BindProductBase=bindProductAdmin;
bindProductAdmin=function(){v14BindProductBase();const input=document.getElementById('apCategory');if(input&&!document.getElementById('v14CategoryOptions')){const d=document.createElement('datalist');d.id='v14CategoryOptions';d.innerHTML=v14Categories().map(x=>`<option value="${esc(x)}">`).join('');input.setAttribute('list',d.id);input.after(d)}};

/* ----- admin perfil/redes/metas ----- */
async function v14RenderProfileAdmin(c){
 v14Cfg();let goals=[];try{goals=(await v14Community('goals_admin',{})).goals||[]}catch{}
 const p=state.config.publicProfile,s=p.socials||{};
 c.innerHTML=`<section class="section-card"><h3>Portada y perfil público</h3><div class="admin-grid two"><label class="field"><span>URL de portada</span><input class="input" id="v14Cover" value="${esc(p.cover||'')}"></label><label class="field"><span>URL de foto de perfil</span><input class="input" id="v14Avatar" value="${esc(p.avatar||'')}"></label></div><label class="field"><span>Descripción</span><textarea class="textarea" id="v14Bio">${esc(p.bio||'')}</textarea></label><label class="row"><input id="v14ProfileShow" type="checkbox" ${p.show!==false?'checked':''}> Mostrar perfil público</label></section>
 <section class="section-card"><h3>Redes sociales</h3><div class="admin-grid two">${['facebook','instagram','tiktok','x','telegram','whatsapp','youtube','website'].map(k=>`<label class="field"><span>${v14SocialName(k)}</span><input class="input" data-v14-social="${k}" value="${esc(s[k]||'')}" placeholder="https://..."></label>`).join('')}</div><button class="btn" id="v14SaveProfile">${UI.save}<span>Guardar perfil y redes</span></button></section>
 <section class="section-card"><h3>Metas de seguidores / likes externos</h3><p class="small muted">Para actualización automática usa la función Edge social-metrics con API oficial del proveedor. El navegador no hace scraping directo.</p><div class="admin-grid two"><label class="field"><span>Plataforma</span><select class="select" id="v14GoalPlatform">${['facebook','instagram','tiktok','x','telegram','youtube'].map(x=>`<option value="${x}">${v14SocialName(x)}</option>`).join('')}</select></label><label class="field"><span>Meta</span><input class="input" id="v14GoalTarget" type="number" min="1" value="1000"></label><label class="field"><span>Texto</span><input class="input" id="v14GoalLabel" placeholder="Llegar a 1,000 seguidores"></label><label class="field"><span>URL que visitará el usuario</span><input class="input" id="v14GoalUrl" placeholder="https://..."></label><label class="field"><span>ID externo / username según API</span><input class="input" id="v14GoalExternal" placeholder="page_id, user_id, chat_id..."></label><label class="field"><span>Métrica</span><select class="select" id="v14GoalMetric"><option value="followers">Seguidores</option><option value="likes">Likes</option><option value="members">Miembros</option></select></label></div><button class="btn" id="v14GoalSave">${UI.plus}<span>Agregar meta</span></button></section>
 <section class="section-card"><h3>Metas activas</h3><div id="v14GoalList">${goals.map(g=>`<article class="v14-goal"><div class="v14-goal-head"><span>${esc(g.label)}</span><span>${Number(g.current_count||0)} / ${Number(g.target_count||0)}</span></div><div class="v14-goal-bar"><span style="width:${Math.min(100,Number(g.current_count||0)/Math.max(1,Number(g.target_count))*100)}%"></span></div><div class="toolbar"><button class="btn secondary" data-v14-syncgoal="${esc(g.id)}">${UI.refresh}<span>Actualizar métrica</span></button><button class="btn ghost" data-v14-deletegoal="${esc(g.id)}">${UI.trash}<span>Eliminar</span></button></div></article>`).join('')||'<p class="small muted">Sin metas.</p>'}</div></section>`;
 document.getElementById('v14SaveProfile').onclick=e=>panelRun(e.currentTarget,async()=>{state.config.publicProfile={cover:document.getElementById('v14Cover').value.trim(),avatar:document.getElementById('v14Avatar').value.trim(),bio:document.getElementById('v14Bio').value.trim(),show:document.getElementById('v14ProfileShow').checked,socials:Object.fromEntries([...c.querySelectorAll('[data-v14-social]')].map(x=>[x.dataset.v14Social,x.value.trim()]))};saveLocal();await syncAdminStateToCloud();v14PaintProfile()},'Perfil guardado.');
 document.getElementById('v14GoalSave').onclick=e=>panelRun(e.currentTarget,async()=>{await v14Community('goal_save',{platform:document.getElementById('v14GoalPlatform').value,label:document.getElementById('v14GoalLabel').value.trim(),target_count:Number(document.getElementById('v14GoalTarget').value),target_url:document.getElementById('v14GoalUrl').value.trim(),external_id:document.getElementById('v14GoalExternal').value.trim(),metric_kind:document.getElementById('v14GoalMetric').value});await v14RenderProfileAdmin(c);await v14RefreshCommunity()},'Meta agregada.');
 c.querySelectorAll('[data-v14-deletegoal]').forEach(b=>b.onclick=e=>panelRun(e.currentTarget,async()=>{await v14Community('goal_delete',{id:b.dataset.v14Deletegoal});await v14RenderProfileAdmin(c);await v14RefreshCommunity()},'Meta eliminada.'));
 c.querySelectorAll('[data-v14-syncgoal]').forEach(b=>b.onclick=e=>panelRun(e.currentTarget,async()=>{const {data,error}=await supabaseClient.functions.invoke('social-metrics',{body:{goal_id:b.dataset.v14Syncgoal}});if(error)throw error;if(data?.error)throw Error(data.error);await v14RenderProfileAdmin(c);await v14RefreshCommunity()},'Métrica actualizada.'));
}

/* ----- pagos: sólo pendientes + rechazo modal integrado ----- */
function v14RejectPayment(orderId,c){
 const m=v4Modal('v14RejectPaymentModal','Rechazar comprobante'),body=m.querySelector('.modal-body');
 body.innerHTML=`<div class="v14-reject-form"><div class="notice">Indica al cliente por qué el comprobante no puede aprobarse.</div><label class="field"><span>Motivo del rechazo</span><textarea class="textarea" id="v14RejectReason" maxlength="500">Comprobante no válido</textarea></label><div class="toolbar"><button class="btn danger" id="v14RejectConfirm">${UI.close}<span>Confirmar rechazo</span></button><button class="btn secondary" id="v14RejectCancel">${UI.arrowLeft}<span>Cancelar</span></button></div></div>`;
 document.getElementById('v14RejectCancel').onclick=()=>closeModal(m.id);
 document.getElementById('v14RejectConfirm').onclick=e=>panelRun(e.currentTarget,async()=>{const reason=document.getElementById('v14RejectReason').value.trim();if(!reason)throw Error('Escribe el motivo.');await setPaymentDecision(orderId,'REJECTED',reason);closeModal(m.id);toast('Pago rechazado.','ok');renderPaymentReviewAdmin(c)});
 openModal(m.id);setTimeout(()=>document.getElementById('v14RejectReason').focus(),50);
}
renderPaymentReviewAdmin=async function(c){
 const token=panelEpoch;c.innerHTML=`<div class="section-card"><h3>Revisión de pagos</h3><div class="notice">Aquí sólo aparecen pagos que requieren una decisión. Los aprobados y rechazados pasan al historial.</div></div><div class="review-list" id="reviewList">Cargando...</div><section class="section-card v14-payment-history"><h3>Historial reciente</h3><div id="v14PaymentHistory">Cargando…</div></section>`;
 try{
  const [orders,receipts]=await Promise.all([safeSelect('orders','id,folio,public_id,customer_name,total,expected_amount,payment_status,rejection_reason,created_at',{order:'created_at',limit:250}),safeSelect('receipts','*',{order:'created_at',limit:250})]);if(token!==panelEpoch)return;
  const rm=new Map();receipts.forEach(r=>{if(!rm.has(String(r.order_id)))rm.set(String(r.order_id),r)});
  const pending=orders.filter(o=>['PROCESSING','PENDING_REVIEW','EXPIRED_REVIEW','WAITING_PAYMENT'].includes(o.payment_status||'WAITING_PAYMENT'));
  const history=orders.filter(o=>['APPROVED','REJECTED'].includes(o.payment_status)).slice(0,40);
  document.getElementById('reviewList').innerHTML=pending.length?pending.map(o=>{const r=rm.get(String(o.id));return `<article class="review-card"><div class="review-card-head"><div><strong>${esc(o.public_id||o.folio)}</strong><div class="small muted">${esc(o.customer_name||'')}</div></div>${paymentBadge(o.payment_status||'WAITING_PAYMENT')}</div><div class="review-meta"><span>Esperado: ${money(o.expected_amount??o.total)}</span></div><div class="review-actions">${r?`<button class="btn secondary" data-view-receipt="${r.id}">${UI.receipt}<span>Ver comprobante</span></button>`:''}<button class="btn success" data-payment-approve="${o.id}">${UI.check}<span>Aprobar</span></button><button class="btn danger" data-payment-reject="${o.id}">${UI.close}<span>Rechazar</span></button></div></article>`}).join(''):'<div class="notice">No hay pagos pendientes de revisión.</div>';
  document.getElementById('v14PaymentHistory').innerHTML=history.length?history.map(o=>`<article class="review-card"><div class="review-card-head"><div><strong>${esc(o.public_id||o.folio)}</strong><div class="small muted">${esc(o.customer_name||'')}</div></div>${paymentBadge(o.payment_status)}</div>${o.rejection_reason?`<p class="small muted">Motivo: ${esc(o.rejection_reason)}</p>`:''}</article>`).join(''):'<p class="small muted">Sin decisiones recientes.</p>';
  c.querySelectorAll('[data-payment-approve]').forEach(b=>b.onclick=async()=>{try{await setPaymentDecision(b.dataset.paymentApprove,'APPROVED');toast('Pago aprobado.','ok');renderPaymentReviewAdmin(c)}catch(e){toast(e.message,'error')}});
  c.querySelectorAll('[data-payment-reject]').forEach(b=>b.onclick=()=>v14RejectPayment(b.dataset.paymentReject,c));
  c.querySelectorAll('[data-view-receipt]').forEach(b=>b.onclick=()=>openReceiptSecure(b.dataset.viewReceipt));
 }catch(e){if(token!==panelEpoch)return;document.getElementById('reviewList').innerHTML=`<div class="notice">${esc(e.message||'No se pudo cargar.')}</div>`}
};
openReceiptSecure=async function(receiptId){
 try{
  const {data:r,error}=await supabaseClient.from('receipts').select('file_path,file_url,mime_type').eq('id',receiptId).single();if(error)throw error;
  let url=r.file_url;if(r.file_path){const s=await supabaseClient.storage.from('receipts-private').createSignedUrl(r.file_path,120);if(s.error)throw s.error;url=s.data.signedUrl}
  if(!url)throw Error('Comprobante no disponible.');
  const m=v4Modal('v14ReceiptModal','Comprobante');m.classList.add('v14-receipt-modal');const body=m.querySelector('.modal-body');
  const isPdf=/pdf/i.test(r.mime_type||r.file_path||r.file_url||'');body.innerHTML=isPdf?`<iframe src="${esc(url)}" title="Comprobante PDF"></iframe>`:`<img src="${esc(url)}" alt="Comprobante de pago">`;openModal(m.id);
 }catch(e){toast('No se pudo abrir el comprobante. '+e.message,'error')}
};

/* ----- router admin ----- */
const v14PaneBase=renderAdminPane;
renderAdminPane=async function(id){
 if(id==='categories'||id==='profile'){
   if(!panelCan(id))return toast('Sin permiso para este módulo.','error');
   activeAdmin=id;const epoch=++panelEpoch;document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));const c=document.getElementById('adminContent');c.innerHTML='<p>Cargando…</p>';
   try{id==='categories'?await v14RenderCategoriesAdmin(c):await v14RenderProfileAdmin(c)}catch(e){if(epoch===panelEpoch)c.innerHTML='<div class="notice">'+esc(e.message)+'</div>'}return;
 }
 return v14PaneBase(id);
};

/* ----- arranque ----- */
v14Cfg();v14PaintProfile();setTimeout(()=>v14RefreshCommunity(),1100);
})();
