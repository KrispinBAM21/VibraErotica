/* Módulo: js/panel-v10.js | Función: lógica original del bloque 27 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(()=>{
'use strict';
const $=(s,root=document)=>root.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const db=()=>typeof supabaseClient!=='undefined' ? supabaseClient : null;
let rate=800, items=[], professionals=[], promotions=[];
let available=false, admin=false;
const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(n)||0);
const icons={
 gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 9h18v12H3zM2 9h20M12 9v12M12 9C4 9 5 3 8 3c3 0 4 6 4 6s1-6 4-6c3 0 4 6-4 6z"/></svg>',
 bottle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 2h6v4l2 3v12H7V9l2-3V2zM9 6h6M10 13h4M10 16h4"/></svg>',
 lingerie:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3v5c0 3-3 5-3 8 3 2 6 3 9 3s6-1 9-3c0-3-3-5-3-8V3M6 5l6 4 6-4M9 19l-1 3m7-3 1 3"/></svg>',
 flower:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 8c-3-7 3-8 4-3 4-4 8 1 3 4 7 2 4 8-1 7 1 6-6 8-7 2-6 4-8-3-3-7-7-2-3-8 2-6 0-7 5-6 6 0zM12 13v9"/></svg>'
};
function icon(k){return icons[k]||icons.gift}
function block(){let el=$('#v10Panel');if(el)return el;
 const root=$('#v9Section');if(!root)return null;
 const panel=document.createElement('section');panel.id='v10Panel';panel.className='v9panel';panel.innerHTML=`<div class="v9head">${icon('lingerie')}<h2>Complementos de tu experiencia</h2></div><p class="v9muted">Artículos disponibles durante la reserva en el local. No es necesario que exista una promoción para añadirlos.</p><div id="v10ExtrasPublic" class="v10items"></div><p class="v9small">Disponibilidad y precio finales confirmados al crear la reserva.</p><div id="v10Admin" hidden><h3>Tarifa central del local</h3><div class="v9fields"><label>Tarifa por hora (MXN)<input id="v10Rate" type="number" min="0" step="0.01"></label></div><button class="v9action" id="v10SaveRate">Guardar tarifa</button><h3>Crear producto extra</h3><div class="v9fields"><label>Nombre comercial<input id="v10ProductName" maxlength="120" placeholder="Nombre del artículo"></label><label>Marca (opcional)<input id="v10Brand" maxlength="100" placeholder="Marca comercial"></label><label>Presentación<input id="v10Presentation" maxlength="100" placeholder="Unidad, tamaño, presentación"></label><label>Categoría<select id="v10Category"><option value="Accesorios">Accesorios</option><option value="Lencería">Lencería</option><option value="Bienestar">Bienestar</option><option value="Complementos">Complementos</option><option value="Bebidas">Bebidas</option></select></label><label>Precio MXN<input id="v10Price" min="0" type="number" step="0.01"></label><label>Existencias<input id="v10Stock" min="0" type="number" step="1"></label><label>Icono SVG<select id="v10Icon"><option value="gift">Regalo</option><option value="lingerie">Lencería</option><option value="bottle">Botella</option><option value="flower">Flor</option></select></label></div><button class="v9action" id="v10SaveProduct">Guardar producto</button><h3>Promoción individual o combinada</h3><div class="v9fields"><label>Nombre de promoción<input id="v10PromoName" maxlength="120"></label><label>Ámbito<select id="v10PromoTarget"><option value="practitioner">Masajista</option><option value="product">Producto</option><option value="both">Masajista y producto</option></select></label><label>Masajista<select id="v10PromoStaff"></select></label><label>Producto<select id="v10PromoProduct"></select></label><label>Descuento %<input id="v10PromoPercent" type="number" min="1" max="100" step="0.01"></label><label>Desde<input id="v10PromoStart" type="datetime-local"></label><label>Hasta<input id="v10PromoEnd" type="datetime-local"></label></div><button id="v10PromoSave" class="v9action">Crear promoción</button><h3>Cupón para masajista o producto</h3><div class="v9fields"><label>Código<input id="v10CouponCode" maxlength="32" placeholder="VIBRA10"></label><label>Ámbito<select id="v10CouponScope"><option value="all">Cualquier reserva local</option><option value="products">Producto extra</option><option value="practitioners">Masajista</option><option value="both">Masajista y producto</option></select></label><label>Masajista<select id="v10CouponStaff"></select></label><label>Producto<select id="v10CouponProduct"></select></label><label>Descuento %<input id="v10CouponPercent" type="number" min="1" max="100" step="1"></label><label>Usos máximos<input id="v10CouponUses" type="number" min="1" max="100000" step="1"></label></div><button id="v10CouponSave" class="v9action">Crear cupón</button><p id="v10AdminStatus" class="v9small" role="status"></p><div id="v10Promotions"></div><p class="v9small">Los cupones se consumen al registrar la reservación, aunque esta posteriormente se cancele.</p></div>`;
 const v9Admin=$('#v9Admin');if(v9Admin?.parentElement) v9Admin.after(panel); else root.append(panel);
 $('#v10SaveRate').onclick=saveRate;$('#v10SaveProduct').onclick=saveProduct;$('#v10PromoSave').onclick=savePromotion;$('#v10CouponSave').onclick=saveCoupon;
 return panel;}
const msg=s=>{const n=$('#v10AdminStatus');if(n)n.textContent=s};
async function load(){if(!db()||!block())return;const {data:user}=await db().auth.getUser();
 const uid=user?.user?.id;let allowed=false;
 if(uid){const r=await db().from('staff_roles').select('role').eq('user_id',uid).maybeSingle();allowed=['admin','manager'].includes(r.data?.role)}
 admin=allowed;$('#v10Admin').hidden=!admin;
 const [p,b,s,pr]=await Promise.all([
 db().from('products').select('id,name,brand_name,presentation,category,price,stock,icon,allow_local_extra,active').eq('active',true).eq('allow_local_extra',true).order('name'),
 db().from('business_settings').select('local_massage_hourly_rate').eq('id',1).maybeSingle(),
 db().from('practitioners').select('id,display_name').eq('active',true).order('display_name'),
 db().from('service_promotions').select('*').order('created_at',{ascending:false})]);
 if(p.error||b.error||s.error||pr.error){msg([p.error,b.error,s.error,pr.error].filter(Boolean).map(x=>x.message).join(' · '));return}
 items=p.data||[];rate=Number(b.data?.local_massage_hourly_rate??800);professionals=s.data||[];promotions=pr.data||[];
 if(admin) $('#v10Rate').value=rate;
 renderExtras();renderPromoOptions();renderPromos();attachBooking();
}
function renderExtras(){const w=$('#v10ExtrasPublic');if(!w)return;
 w.innerHTML=items.length?items.map(p=>`<div class="v10extra">${icon(['lingerie','flower','bottle','gift'].includes(p.icon)?p.icon:'gift')}<div><strong>${esc(p.name)}</strong><small>${esc(p.brand_name||'')} ${esc(p.presentation||'')} · Existencias ${p.stock}</small></div><b>${money(p.price)}</b></div>`).join(''):'<p class="v9muted">No hay complementos publicados. El administrador puede añadirlos sin activar ninguna promoción.</p>';
}
function renderPromoOptions(){const staff=$('#v10PromoStaff'),prod=$('#v10PromoProduct');if(!staff||!prod)return;
 staff.innerHTML='<option value="">Selecciona profesional</option>'+professionals.map(x=>`<option value="${x.id}">${esc(x.display_name)}</option>`).join('');
 prod.innerHTML='<option value="">Selecciona producto</option>'+items.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('');
 $('#v10CouponStaff').innerHTML=staff.innerHTML;$('#v10CouponProduct').innerHTML=prod.innerHTML;
}
function renderPromos(){const h=$('#v10Promotions');if(!h||!admin)return;h.innerHTML=promotions.map(p=>`<div class="v10extra"><div><strong>${esc(p.title)}</strong><small>${esc(p.target_kind)} · ${p.discount_percent}% · ${p.active?'Activa':'Inactiva'}</small></div><button class="v9action secondary" data-v10-toggle="${p.id}">${p.active?'Desactivar':'Activar'}</button></div>`).join('');
 h.querySelectorAll('[data-v10-toggle]').forEach(b=>b.onclick=async()=>{const p=promotions.find(x=>x.id===b.dataset.v10Toggle);if(!p)return;const r=await db().from('service_promotions').update({active:!p.active}).eq('id',p.id);msg(r.error?.message||'Promoción actualizada');if(!r.error)load()});
}
async function saveRate(){if(!admin)return;const v=Number($('#v10Rate').value);if(!Number.isFinite(v)||v<0)return msg('Tarifa inválida');const r=await db().from('business_settings').update({local_massage_hourly_rate:v}).eq('id',1);msg(r.error?.message||'Tarifa central guardada');if(!r.error)load()}
async function saveProduct(){if(!admin)return;const name=$('#v10ProductName').value.trim(),price=Number($('#v10Price').value),stock=Number($('#v10Stock').value);if(!name||!Number.isFinite(price)||price<0||!Number.isInteger(stock)||stock<0)return msg('Completa nombre, precio y existencias');
 const row={name,brand_name:$('#v10Brand').value.trim()||null,presentation:$('#v10Presentation').value.trim()||null,category:$('#v10Category').value,price,stock,icon:$('#v10Icon').value,allow_local_extra:true,active:true,description:'Complemento disponible únicamente con reserva local'};
 const r=await db().from('products').insert(row);msg(r.error?.message||'Producto extra registrado');if(!r.error)load();}
async function saveCoupon(){if(!admin)return;
 const code=$('#v10CouponCode').value.trim().toUpperCase(),scope=$('#v10CouponScope').value;
 const discount=Number($('#v10CouponPercent').value),maxUses=Number($('#v10CouponUses').value);
 const product_id=$('#v10CouponProduct').value||null,staff_id=$('#v10CouponStaff').value||null;
 if(!/^[A-Z0-9_-]{3,32}$/.test(code))return msg('El código debe tener de 3 a 32 caracteres (A–Z, 0–9, _ o -).');
 if(!Number.isInteger(discount)||discount<1||discount>100||!Number.isInteger(maxUses)||maxUses<1)return msg('Descuento y usos inválidos');
 if(['products','both'].includes(scope)&&!product_id)return msg('Selecciona producto');
 if(['practitioners','both'].includes(scope)&&!staff_id)return msg('Selecciona masajista');
 const row={code,percent_off:discount,max_uses:maxUses,used_count:0,active:true,applicable_to:scope,target_product_id:['products','both'].includes(scope)?product_id:null,target_practitioner_id:['practitioners','both'].includes(scope)?staff_id:null};
 const r=await db().from('coupons').insert(row);msg(r.error?.message||'Cupón creado y habilitado');if(!r.error){$('#v10CouponCode').value='';}}
async function savePromotion(){if(!admin)return;const target=$('#v10PromoTarget').value,pct=Number($('#v10PromoPercent').value),product_id=$('#v10PromoProduct').value||null,practitioner_id=$('#v10PromoStaff').value||null,title=$('#v10PromoName').value.trim();
 if(!title||!Number.isFinite(pct)||pct<=0||pct>100)return msg('Completa nombre y descuento de 1–100%');
 if((target==='product'||target==='both')&&!product_id)return msg('Selecciona producto');if((target==='practitioner'||target==='both')&&!practitioner_id)return msg('Selecciona masajista');
 const from=$('#v10PromoStart').value,to=$('#v10PromoEnd').value;
 const row={title,target_kind:target,product_id:target==='practitioner'?null:product_id,practitioner_id:target==='product'?null:practitioner_id,discount_percent:pct,starts_at:from?new Date(from).toISOString():null,ends_at:to?new Date(to).toISOString():null,active:false};
 const r=await db().from('service_promotions').insert(row);msg(r.error?.message||'Promoción creada inactiva. Puedes activarla en la lista.');if(!r.error)load();}
function attachBooking(){const form=$('#v9Booking');if(!form||form.dataset.v10Enhanced)return;form.dataset.v10Enhanced='1';
 const host=document.createElement('div');host.id='v10BookingExtras';host.innerHTML='<h3>Productos adicionales (solo dentro del local)</h3><div id="v10BookingList"></div><label class="v9small">Cupón (opcional)<input id="v10Coupon" maxlength="32" placeholder="Código promocional" style="display:block;max-width:340px;width:100%;padding:10px;border-radius:8px;background:#10121c;color:white;border:1px solid #555"></label><p id="v10Quote"></p>';
 const btn=$('#v9SubmitBooking');btn?.parentElement?.before(host);
 const wrap=$('#v10BookingList');wrap.innerHTML=items.map(p=>`<label class="v10orderline"><span>${icon(['lingerie','flower','bottle','gift'].includes(p.icon)?p.icon:'gift')} ${esc(p.name)} · ${money(p.price)}</span><input type="number" min="0" max="${Math.min(20,p.stock)}" step="1" value="0" data-v10-qty="${p.id}" aria-label="Cantidad de ${esc(p.name)}"></label>`).join('')||'<p class="v9muted">Sin productos adicionales publicados.</p>';
 const draw=()=>{const dur=Number($('#v9Duration')?.value||0);const extra=[...wrap.querySelectorAll('[data-v10-qty]')].reduce((s,i)=>s+(Number(i.value)||0)*(items.find(p=>p.id===i.dataset.v10Qty)?.price||0),0);$('#v10Quote').textContent='Importe orientativo: '+money(rate*dur/60+extra)+' MXN antes de descuentos. El servidor confirmará el total.'};
 wrap.addEventListener('input',draw);$('#v9Duration')?.addEventListener('change',draw);draw();
 // intercepta la acción anterior para evitar llamar a la RPC sin extras
 btn?.addEventListener('click',async e=>{e.preventDefault();e.stopImmediatePropagation();if(!db())return setBooking('Falta conexión con Supabase');if($('#v9Mode').value!=='local')return setBooking('Los extras solo están disponibles para atención en local');
 const start=$('#v9Time').value,service=$('#v9Service').value,room=$('#v9Room').value,practitioner=$('#v9Modalities').dataset.practitioner,duration=Number($('#v9Duration').value);
 if(!start||!service||!room||!practitioner||!duration)return setBooking('Selecciona servicio, habitación, duración y hora libre');if(!$('#v9Terms').checked)return setBooking('Debes aceptar las condiciones');
 const extras=[];for(const i of wrap.querySelectorAll('[data-v10-qty]')){const q=Number(i.value),p=items.find(x=>x.id===i.dataset.v10Qty);if(!Number.isInteger(q)||q<0||!p||q>Math.min(p.stock,20))return setBooking('Cantidad de extra inválida');if(q)extras.push({product_id:p.id,quantity:q});}
 btn.disabled=true;setBooking('Registrando reservación…');try{const r=await db().rpc('create_local_reservation_with_extras',{p_service_id:service,p_practitioner_id:practitioner,p_room_id:room,p_starts_at:start,p_duration_minutes:duration,p_contact_name:$('#v9ClientName').value.trim(),p_contact_phone:$('#v9ClientPhone').value.trim(),p_contact_email:null,p_accept_terms:true,p_extras:extras,p_coupon_code:$('#v10Coupon').value.trim()||null});if(r.error)throw r.error;setBooking('Reservación registrada: '+r.data+'. Puedes continuar con el comprobante de pago.');await load();}catch(err){setBooking(err.message)}finally{btn.disabled=false}},true);
}
function setBooking(s){const x=$('#v9BookingStatus');if(x)x.textContent=s}
function boot(){if(!block())return;load().catch(console.warn);}
let count=0;const interval=setInterval(()=>{if(db()&&block()){clearInterval(interval);boot()}else if(++count>120)clearInterval(interval)},500);
window.addEventListener('focus',()=>{if(block()&&db())load().catch(console.warn)});
})();

