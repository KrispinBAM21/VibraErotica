/* Módulo: js/enhancements-v11.js | Función: lógica original del bloque 14 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
'use strict';

const V11_PREFS_KEY='VibraErotica.productPrefs.v2';
let v11Prefs={};
try{v11Prefs=JSON.parse(localStorage.getItem(V11_PREFS_KEY)||'{}')||{}}catch{v11Prefs={}}
const saveV11Prefs=()=>localStorage.setItem(V11_PREFS_KEY,JSON.stringify(v11Prefs));

function v11Config(){
  if(!state.config.productCustomization)state.config.productCustomization={};
  if(!state.config.businessAddress)state.config.businessAddress={street:'',ext:'',int:'',neighborhood:'',postalCode:'',city:'',municipality:'',state:'',references:''};
  if(!Array.isArray(state.config.internalExtraIds))state.config.internalExtraIds=[];
  return state.config;
}
function v11ProductCfg(id){
  const cfg=v11Config();
  return cfg.productCustomization[id]||{saleKind:'piece',saleLabel:'Pieza',modifiers:[]};
}
function v11IsInternalProduct(p){
  return !!p && (state.config.internalExtraIds||[]).includes(String(p.id));
}
function v11FullAddress(){
  const a=v11Config().businessAddress||{};
  const parts=[
    [a.street,a.ext].filter(Boolean).join(' '),
    a.int?('Interior '+a.int):'',
    a.neighborhood,
    a.postalCode?('C.P. '+a.postalCode):'',
    a.municipality||a.city,
    a.state
  ].filter(Boolean);
  return parts.join(', ') || state.config.origin?.address || '';
}
function v11SaleLabel(p){
  const c=v11ProductCfg(p.id);
  return (c.saleLabel||'').trim();
}
function v11DirectionsUrl(originLat,originLng){
  const o=state.config.origin||{};
  const dest=(Number.isFinite(Number(o.lat))&&Number.isFinite(Number(o.lng)))?`${Number(o.lat)},${Number(o.lng)}`:encodeURIComponent(v11FullAddress());
  const origin=(originLat!=null&&originLng!=null)?`&origin=${originLat},${originLng}`:'';
  return `https://www.google.com/maps/dir/?api=1${origin}&destination=${dest}&travelmode=driving`;
}
function v11GoToBusiness(btn){
  const original=btn?.innerHTML;
  if(btn){btn.disabled=true;btn.innerHTML=UI.pending+'<span>Obteniendo tu ubicación…</span>'}
  const popup=window.open('about:blank','_blank');
  const finish=(url)=>{
    if(popup)popup.location=url; else window.location.href=url;
    if(btn){btn.disabled=false;btn.innerHTML=original}
  };
  if(!navigator.geolocation){finish(v11DirectionsUrl());return}
  navigator.geolocation.getCurrentPosition(
    p=>finish(v11DirectionsUrl(p.coords.latitude,p.coords.longitude)),
    ()=>finish(v11DirectionsUrl()),
    {enableHighAccuracy:true,timeout:20000,maximumAge:0}
  );
}

/* ---------- NEGOCIO: domicilio completo y ruta desde ubicación del usuario ---------- */
const v11BusinessBase=renderBusinessAdmin;
renderBusinessAdmin=function(c){
  v11Config();
  v11BusinessBase(c);
  const originMapEl=document.getElementById('originMap');
  const section=originMapEl?.closest('.section-card');
  if(!section || document.getElementById('v11BusinessAddress'))return;

  const a=state.config.businessAddress||{};
  const wrap=document.createElement('div');
  wrap.id='v11BusinessAddress';
  wrap.innerHTML=`
    <hr>
    <h3>Domicilio del negocio</h3>
    <p class="small muted">Estos datos se muestran al cliente para recoger y se usan junto con el pin para abrir la ruta.</p>
    <div class="v11-address-grid">
      <label class="field span-2"><span>Calle</span><input class="input" id="v11Street" value="${esc(a.street||'')}" placeholder="Av. / Calle"></label>
      <label class="field"><span>Número exterior</span><input class="input" id="v11Ext" value="${esc(a.ext||'')}"></label>
      <label class="field"><span>Número interior</span><input class="input" id="v11Int" value="${esc(a.int||'')}"></label>
      <label class="field"><span>Colonia</span><input class="input" id="v11Neighborhood" value="${esc(a.neighborhood||'')}"></label>
      <label class="field"><span>Código postal</span><input class="input" id="v11PostalCode" value="${esc(a.postalCode||'')}" inputmode="numeric"></label>
      <label class="field"><span>Ciudad / localidad</span><input class="input" id="v11City" value="${esc(a.city||'')}"></label>
      <label class="field"><span>Municipio / alcaldía</span><input class="input" id="v11Municipality" value="${esc(a.municipality||'')}"></label>
      <label class="field"><span>Estado</span><input class="input" id="v11State" value="${esc(a.state||'')}"></label>
      <label class="field span-2"><span>Referencias</span><textarea class="textarea" id="v11References" placeholder="Entre calles, color de fachada, local, etc.">${esc(a.references||'')}</textarea></label>
    </div>
    <div class="v11-map-actions">
      <button class="btn" id="v11SaveBusinessAddress">${UI.save}<span>Guardar domicilio</span></button>
      <button class="btn secondary" id="v11GeocodeBusinessAddress">${UI.pin}<span>Ubicar domicilio en el pin</span></button>
      <button class="btn secondary" id="v11DirectionsAdmin">${UI.map}<span>Cómo llegar desde mi ubicación</span></button>
    </div>
    <p class="small muted" id="v11AddressPreview">${esc(v11FullAddress())}</p>
  `;
  section.append(wrap);

  const collect=()=>({
    street:document.getElementById('v11Street').value.trim(),
    ext:document.getElementById('v11Ext').value.trim(),
    int:document.getElementById('v11Int').value.trim(),
    neighborhood:document.getElementById('v11Neighborhood').value.trim(),
    postalCode:document.getElementById('v11PostalCode').value.trim(),
    city:document.getElementById('v11City').value.trim(),
    municipality:document.getElementById('v11Municipality').value.trim(),
    state:document.getElementById('v11State').value.trim(),
    references:document.getElementById('v11References').value.trim()
  });
  const saveAddress=async()=>{
    state.config.businessAddress=collect();
    const full=v11FullAddress();
    if(full)state.config.origin.address=full;
    saveLocal();
    clearTimeout(cloudSyncTimer);
    await syncAdminStateToCloud();
    document.getElementById('v11AddressPreview').textContent=full;
    const originInput=document.getElementById('originAddress');if(originInput)originInput.value=full;
  };
  document.getElementById('v11SaveBusinessAddress').onclick=e=>panelRun(e.currentTarget,saveAddress,'Domicilio guardado.');
  document.getElementById('v11GeocodeBusinessAddress').onclick=e=>panelRun(e.currentTarget,async()=>{
    state.config.businessAddress=collect();
    const full=v11FullAddress();
    if(!full)throw Error('Completa al menos la calle y la localidad.');
    const p=await foodSearch(full);
    state.config.origin={...state.config.origin,address:p.address,lat:p.lat,lng:p.lng,confirmed:false};
    const originInput=document.getElementById('originAddress');if(originInput)originInput.value=p.address;
    document.getElementById('foodOriginLat') && (document.getElementById('foodOriginLat').value=p.lat);
    document.getElementById('foodOriginLng') && (document.getElementById('foodOriginLng').value=p.lng);
    originMarker?.setLatLng([p.lat,p.lng]);originMap?.setView([p.lat,p.lng],17);
    saveLocal();
  },'Pin actualizado; confirma el punto de salida.');
  document.getElementById('v11DirectionsAdmin').onclick=e=>v11GoToBusiness(e.currentTarget);
};

/* ---------- PRODUCTOS: unidad/presentación y modificadores propios ---------- */
const v11OldProductFormHtml=productFormHtml;
productFormHtml=function(){
  const base=v11OldProductFormHtml();
  const p=state.products.find(x=>x.id===editingProductId)||{id:'',name:'',description:'',category:'',price:0,stock:0,icon:'plate',image:'',active:true};
  const cfg=editingProductId?v11ProductCfg(editingProductId):{saleKind:'piece',saleLabel:'Pieza',modifiers:[]};
  const block=`
    <section class="section-card" id="v11ProductOptions">
      <h3>Presentación y personalización</h3>
      <div class="admin-grid two">
        <label class="field"><span>Forma de venta</span>
          <select class="select" id="v11SaleKind">
            ${[['piece','Por pieza'],['order','Por orden'],['liter','Por litro / envase'],['portion','Por porción'],['weight','Por peso'],['other','Otra presentación']].map(([v,l])=>`<option value="${v}" ${cfg.saleKind===v?'selected':''}>${l}</option>`).join('')}
          </select>
        </label>
        <label class="field"><span>Texto que verá el cliente</span><input class="input" id="v11SaleLabel" value="${esc(cfg.saleLabel||'')}" placeholder="Ej. Orden de 4 tacos, 1 litro, 500 ml, pieza"></label>
      </div>
      <p class="small muted">Ejemplos: ceviche “1 litro”, pozole “1/2 litro”, tacos “Orden de 4”, hamburguesa “Pieza”. Para distintos tamaños con precios diferentes conviene crear un producto por presentación.</p>
      <hr>
      <div class="row between wrap">
        <div><strong>Opciones de preparación de este producto</strong><div class="small muted">Sólo aparecerán las que configures aquí; ya no se sugieren extras genéricos.</div></div>
        <button type="button" class="btn secondary" id="v11AddModifier">${UI.plus}<span>Añadir opción</span></button>
      </div>
      <div class="v11-modifier-editor" id="v11ModifierEditor">
        ${(cfg.modifiers||[]).map(m=>v11ModifierRow(m)).join('')}
      </div>
    </section>`;
  return base.replace(/<div class="toolbar"><button class="btn" id="saveProduct">/,block+'<div class="toolbar"><button class="btn" id="saveProduct">');
};

function v11ModifierRow(m={}){
  const id=m.id||uid('opt');
  return `<div class="v11-modifier-row" data-v11-modifier="${esc(id)}" data-linked="${esc(m.linkedProductId||'')}">
    <label class="field"><span>Ingrediente / opción</span><input class="input" data-v11-label value="${esc(m.label||'')}" placeholder="Ej. Cebolla, queso, aguacate"></label>
    <label class="v11-check"><input type="checkbox" data-v11-remove ${m.allowRemove?'checked':''}> Puede pedir sin</label>
    <label class="v11-check"><input type="checkbox" data-v11-add ${m.allowAdd?'checked':''}> Puede agregar</label>
    <label class="field"><span>Costo al agregar</span><input class="input" data-v11-price type="number" min="0" step="0.01" value="${Number(m.extraPrice)||0}"></label>
    <button type="button" class="icon-btn" data-v11-delete aria-label="Eliminar opción">${UI.trash}</button>
  </div>`;
}
function v11BindModifierEditor(){
  const editor=document.getElementById('v11ModifierEditor');
  if(!editor)return;
  document.getElementById('v11AddModifier').onclick=()=>{editor.insertAdjacentHTML('beforeend',v11ModifierRow());v11BindModifierEditor()};
  editor.querySelectorAll('[data-v11-delete]').forEach(b=>b.onclick=()=>b.closest('[data-v11-modifier]').remove());
}

const v11OldBindProductAdmin=bindProductAdmin;
bindProductAdmin=function(){
  v11OldBindProductAdmin();
  v11BindModifierEditor();
};

function v11CollectModifiers(){
  return [...document.querySelectorAll('[data-v11-modifier]')].map(row=>({
    id:row.dataset.v11Modifier||uid('opt'),
    linkedProductId:row.dataset.linked||'',
    label:row.querySelector('[data-v11-label]').value.trim(),
    allowRemove:row.querySelector('[data-v11-remove]').checked,
    allowAdd:row.querySelector('[data-v11-add]').checked,
    extraPrice:Math.max(0,Number(row.querySelector('[data-v11-price]').value)||0)
  })).filter(m=>m.label&&(m.allowRemove||m.allowAdd));
}
function v11InternalExtraName(productName,label){return `Extra: ${label} · ${productName}`}

const v11OldSaveProductForm=saveProductForm;
saveProductForm=async function(){
  const productId=editingProductId||crypto.randomUUID();
  const isNew=!editingProductId;
  const selected=document.querySelector('.icon-option.selected');
  const obj={
    id:productId,
    name:document.getElementById('apName').value.trim(),
    description:document.getElementById('apDesc').value.trim(),
    category:document.getElementById('apCategory').value.trim(),
    price:Number(document.getElementById('apPrice').value),
    stock:Math.max(0,Math.floor(Number(document.getElementById('apStock').value))),
    icon:selected?.dataset.icon||state.products.find(x=>x.id===productId)?.icon||'plate',
    image:document.getElementById('apImageData').value,
    active:document.getElementById('apActive').checked
  };
  if(!obj.name||!obj.category||!Number.isFinite(obj.price)||obj.price<0||!Number.isInteger(obj.stock)){toast('Completa nombre, categoría, precio y existencias válidos.','error');return}
  if(!supabaseClient||!adminSession){toast('Inicia sesión como administrador antes de guardar.','error');return}
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(obj.id)){toast('Este producto tiene un ID heredado incompatible. Crea uno nuevo para migrarlo.','error');return}
  if(obj.image && /^data:image\//.test(obj.image)){
    try{
      const response=await fetch(obj.image), blob=await response.blob();
      const ext=blob.type==='image/jpeg'?'jpg':blob.type==='image/webp'?'webp':'png';
      const path='products/'+obj.id+'/'+crypto.randomUUID()+'.'+ext;
      const result=await supabaseClient.storage.from('catalog-media').upload(path,blob,{contentType:blob.type,upsert:false});
      if(result.error)throw result.error;
      const publicUrl=supabaseClient.storage.from('catalog-media').getPublicUrl(path).data?.publicUrl;
      if(!publicUrl)throw Error('No fue posible recuperar la URL pública de la imagen.');
      obj.image=publicUrl;
    }catch(error){toast('No se pudo subir la imagen: '+error.message,'error');return}
  }

  v11Config();
  const previous=v11ProductCfg(productId);
  const mods=v11CollectModifiers();
  const keepLinked=new Set();

  for(const m of mods){
    if(m.allowAdd && m.extraPrice>0){
      let linked=m.linkedProductId && state.products.find(p=>p.id===m.linkedProductId);
      if(!linked){
        m.linkedProductId=crypto.randomUUID();
        linked={id:m.linkedProductId,name:'',description:'',category:'_Extras internos',price:0,stock:999999,icon:'condiment',image:'',active:true};
        state.products.push(linked);
      }
      linked.name=v11InternalExtraName(obj.name,m.label);
      linked.description=`Opción adicional para ${obj.name}.`;
      linked.category='_Extras internos';
      linked.price=m.extraPrice;
      linked.stock=Math.max(999999,Number(linked.stock)||0);
      linked.icon='condiment';
      linked.active=true;
      keepLinked.add(String(linked.id));
    }else{
      m.linkedProductId='';
    }
  }

  for(const old of (previous.modifiers||[])){
    if(old.linkedProductId && !keepLinked.has(String(old.linkedProductId))){
      state.products=state.products.filter(p=>String(p.id)!==String(old.linkedProductId));
      delete state.cart[old.linkedProductId];
      state.config.internalExtraIds=state.config.internalExtraIds.filter(x=>String(x)!==String(old.linkedProductId));
    }
  }
  for(const id of keepLinked)if(!state.config.internalExtraIds.includes(id))state.config.internalExtraIds.push(id);

  const idx=state.products.findIndex(x=>x.id===productId);
  if(idx>=0)state.products[idx]=obj; else state.products.push(obj);
  state.config.productCustomization[productId]={
    saleKind:document.getElementById('v11SaleKind')?.value||'piece',
    saleLabel:document.getElementById('v11SaleLabel')?.value.trim()||'',
    modifiers:mods
  };

  clearTimeout(cloudSyncTimer);
  queueCloudModule('products');
  try{
    await syncAdminStateToCloud();
  }catch(e){
    toast('Supabase no guardó el producto: '+e.message,'error');
    return;
  }
  editingProductId=null;
  saveLocal();
  renderProductsAdmin(document.getElementById('adminContent'));
  renderCategories();renderCatalog();
  toast(isNew?'Producto creado en Supabase.':'Producto actualizado en Supabase.','ok');
};

/* Eliminar también configuración e internos al borrar un producto principal. */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-delete-product]');
  if(!b)return;
  const id=b.dataset.deleteProduct;
  const cfg=v11ProductCfg(id);
  setTimeout(()=>{
    if(state.products.some(p=>p.id===id))return;
    (cfg.modifiers||[]).forEach(m=>{
      if(m.linkedProductId){
        state.products=state.products.filter(p=>p.id!==m.linkedProductId);
        state.config.internalExtraIds=state.config.internalExtraIds.filter(x=>x!==m.linkedProductId);
      }
    });
    delete state.config.productCustomization[id];
    saveLocal();
  },0);
},true);

/* ---------- Catálogo: ocultar SKUs internos y mostrar presentación ---------- */
const v11RenderCategoriesBase=renderCategories;
renderCategories=function(){
  v11RenderCategoriesBase();
  document.querySelectorAll('#categoryChips .chip').forEach(b=>{if(String(b.dataset.cat||'').startsWith('_'))b.remove()});
};
const v11RenderCatalogBase=renderCatalog;
renderCatalog=function(){
  v11RenderCatalogBase();
  document.querySelectorAll('#catalogGrid .product-card').forEach(card=>{
    const trigger=card.querySelector('[data-view-product]');
    if(!trigger)return;
    const p=state.products.find(x=>x.id===trigger.dataset.viewProduct);
    if(!p)return;
    if(v11IsInternalProduct(p)){card.remove();return}
    const label=v11SaleLabel(p);
    if(label && !card.querySelector('.v11-unit-badge')){
      const meta=card.querySelector('.meta')||card.querySelector('.product-body');
      meta?.insertAdjacentHTML('beforeend',`<span class="v11-unit-badge">${UI.orders||UI.receipt}<span>${esc(label)}</span></span>`);
    }
  });
};

/* ---------- Personalizador según opciones del admin ---------- */
function v11PrefText(productId){
  const pref=v11Prefs[productId];if(!pref)return '';
  const cfg=v11ProductCfg(productId),mods=cfg.modifiers||[];
  const parts=[];
  const removed=(pref.removed||[]).map(id=>mods.find(m=>m.id===id)?.label).filter(Boolean);
  const added=(pref.added||[]).map(id=>{
    const m=mods.find(x=>x.id===id);if(!m)return '';
    return m.extraPrice>0?`${m.label} (+${money(m.extraPrice)})`:m.label;
  }).filter(Boolean);
  if(removed.length)parts.push('Sin: '+removed.join(', '));
  if(added.length)parts.push('Agregar: '+added.join(', '));
  return parts.join(' · ');
}
function v11OrderNotes(){
  const lines=Object.keys(v11Prefs).filter(id=>state.cart[id]).map(id=>{
    const p=state.products.find(x=>x.id===id),txt=v11PrefText(id);
    return p&&txt?`${p.name}: ${txt}`:'';
  }).filter(Boolean);
  return lines.length?'Preparación solicitada:\n'+lines.join('\n'):'';
}
function v11PaidLinkedFor(productId,pref=v11Prefs[productId]){
  const cfg=v11ProductCfg(productId);
  if(!pref)return [];
  return (pref.added||[]).map(id=>cfg.modifiers.find(m=>m.id===id)).filter(m=>m?.linkedProductId&&m.extraPrice>0).map(m=>m.linkedProductId);
}

openProductViewer=function(id,focus){
  const p=state.products.find(p=>p.id===id);
  if(!p||v11IsInternalProduct(p))return;
  productFocus=focus;
  const cfg=v11ProductCfg(id),mods=(cfg.modifiers||[]).filter(m=>m.label&&(m.allowRemove||m.allowAdd));
  const current=v11Prefs[id]||{removed:[],added:[]};
  const removable=mods.filter(m=>m.allowRemove);
  const addable=mods.filter(m=>m.allowAdd);

  const m=v4Modal('productViewerModal',p.name),body=m.querySelector('.modal-body');
  m.classList.add('product-viewer');m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
  m.querySelector('.modal-head strong').textContent=p.name;
  body.innerHTML=`
    <div class="product-large-view"><div id="productZoomImage">${productVisual(p)}</div></div>
    <label class="field">Ampliar imagen<input id="productZoomRange" type="range" min="100" max="250" value="100" aria-label="Ampliar imagen del producto"></label>
    <h3>${esc(p.name)} · ${money(productPrice(p))}</h3>
    ${v11SaleLabel(p)?`<div class="v11-unit-badge">${UI.orders||UI.receipt}<span>${esc(v11SaleLabel(p))}</span></div>`:''}
    <p>${esc(p.description||'')}</p><p class="small">${p.stock} disponibles</p>
    ${mods.length?`<div class="v11-customizer-grid">
      ${removable.length?`<section class="v11-choice-section"><h4>¿Qué no quieres que le pongamos?</h4><div class="v11-choice-list">${removable.map(x=>`<label class="v11-choice"><input type="checkbox" data-v11-remove-choice value="${esc(x.id)}" ${current.removed?.includes(x.id)?'checked':''}><span>Sin ${esc(x.label)}</span></label>`).join('')}</div></section>`:''}
      ${addable.length?`<section class="v11-choice-section"><h4>¿Quieres agregar algo?</h4><div class="v11-choice-list">${addable.map(x=>`<label class="v11-choice"><input type="checkbox" data-v11-add-choice value="${esc(x.id)}" ${current.added?.includes(x.id)?'checked':''}><span>${esc(x.label)}${x.extraPrice>0?' · +'+money(x.extraPrice):' · sin costo'}</span></label>`).join('')}</div></section>`:''}
    </div>`:'<div class="notice">Este producto no tiene opciones especiales configuradas por el negocio.</div>'}
    ${panelButton('productViewerAdd',mods.length?'Guardar opciones y agregar':'Agregar al carrito',UI.cart,'full')}
  `;
  body.querySelector('#productZoomRange').oninput=e=>body.querySelector('#productZoomImage').style.width=e.target.value+'%';
  const add=body.querySelector('#productViewerAdd');
  add.disabled=p.stock<=0||(state.cart[id]||0)>=p.stock;
  add.onclick=()=>{
    const oldPaid=v11PaidLinkedFor(id,current);
    const removed=[...body.querySelectorAll('[data-v11-remove-choice]:checked')].map(x=>x.value);
    const added=[...body.querySelectorAll('[data-v11-add-choice]:checked')].map(x=>x.value);
    v11Prefs[id]={removed,added};saveV11Prefs();

    /* Retira extras pagados de la preferencia anterior de esta línea antes de aplicar la nueva. */
    oldPaid.forEach(extraId=>{if(state.cart[extraId]){delete state.cart[extraId]}});
    changeQty(id,1);
    const qty=state.cart[id]||1;
    v11PaidLinkedFor(id,v11Prefs[id]).forEach(extraId=>{
      const ep=state.products.find(x=>x.id===extraId);
      if(ep)state.cart[extraId]=Math.min(ep.stock,qty);
    });
    save();renderCatalog();if(document.getElementById('cartDrawer')?.classList.contains('show'))renderCart();
    add.disabled=(state.cart[id]||0)>=p.stock;
    toast(mods.length?'Producto personalizado y agregado.':'Producto agregado.','ok');
  };
  openModal(m.id);m.querySelector('[data-close-modal]').focus();
};

/* Mantiene la cantidad de extras pagados igual a la cantidad de su producto principal. */
const v11ChangeQtyBase=changeQty;
changeQty=function(id,delta){
  const isInternal=v11IsInternalProduct(state.products.find(p=>p.id===id));
  v11ChangeQtyBase(id,delta);
  if(isInternal)return;
  const qty=state.cart[id]||0;
  v11PaidLinkedFor(id).forEach(extraId=>{
    const ep=state.products.find(x=>x.id===extraId);
    if(!ep)return;
    if(qty)state.cart[extraId]=Math.min(ep.stock,qty);else delete state.cart[extraId];
  });
  if(!qty)delete v11Prefs[id];
  saveV11Prefs();saveLocal();
  if(document.getElementById('cartDrawer')?.classList.contains('show'))renderCart();
};

/* Carrito: presentación, preferencias y ruta para recoger. */
const v11RenderCartBase=renderCart;
renderCart=function(){
  v11RenderCartBase();

  document.querySelectorAll('#cartBody .cart-item').forEach(item=>{
    const trigger=item.querySelector('[data-view-cart-product]');
    if(!trigger)return;
    const id=trigger.dataset.viewCartProduct,p=state.products.find(x=>x.id===id);
    if(!p)return;
    if(v11IsInternalProduct(p)){
      item.classList.add('v11-internal-extra');
      return;
    }
    const middle=item.children[1];if(!middle)return;
    const unit=v11SaleLabel(p),pref=v11PrefText(id);
    if(unit&&!middle.querySelector('.v11-unit-badge'))middle.insertAdjacentHTML('beforeend',`<div class="v11-unit-badge">${esc(unit)}</div>`);
    if(pref&&!middle.querySelector('.v11-cart-pref'))middle.insertAdjacentHTML('beforeend',`<div class="v11-cart-pref">${esc(pref)}</div>`);
  });

  const deliveryHeading=[...document.querySelectorAll('#cartBody .form-section h3')].find(h=>h.textContent.trim()==='Entrega');
  const form=deliveryHeading?.closest('.form-section');
  if(form && !document.getElementById('v11PickupRoute')){
    const route=document.createElement('div');route.id='v11PickupRoute';route.className='v11-route-card';
    const address=v11FullAddress(),refs=state.config.businessAddress?.references||'';
    route.innerHTML=`<strong>${UI.pin}<span>Ubicación del negocio</span></strong>
      <div>${esc(address||'Ubicación configurada en el mapa')}</div>
      ${refs?`<div class="small muted">${esc(refs)}</div>`:''}
      <button type="button" class="btn secondary" id="v11RouteClient">${UI.map}<span>Cómo llegar desde mi ubicación</span></button>`;
    form.append(route);
    document.getElementById('v11RouteClient').onclick=e=>v11GoToBusiness(e.currentTarget);
  }
};

/* Añade notas de personalización al pedido sin alterar el precio validado por Supabase.
   Los extras con costo viajan como SKUs internos reales dentro de items. */
const v11ConfirmBase=confirmOrder;
confirmOrder=async function(){
  const original=checkout.notes||'';
  const custom=v11OrderNotes();
  if(custom)checkout.notes=[original,custom].filter(Boolean).join('\n\n');
  try{
    await v11ConfirmBase();
    if(!Object.keys(state.cart).length){v11Prefs={};saveV11Prefs()}
  }finally{
    if(Object.keys(state.cart).length)checkout.notes=original;
  }
};

/* Evita que los SKUs técnicos aparezcan como categorías o resultados visibles. */
document.addEventListener('click',e=>{
  const remove=e.target.closest('[data-remove]');
  if(!remove)return;
  const id=remove.dataset.remove;
  if(v11Prefs[id]){
    v11PaidLinkedFor(id).forEach(extraId=>delete state.cart[extraId]);
    delete v11Prefs[id];saveV11Prefs();saveLocal();
  }
},true);

setTimeout(()=>{try{v11Config();renderCategories();renderCatalog()}catch(e){console.error(e)}},800);
})();
