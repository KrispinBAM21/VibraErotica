/* Módulo: js/enhancements-v10.js | Función: lógica original del bloque 13 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

/* VibraErotica v10: mejoras no destructivas sobre v9. */
(function(){
'use strict';

const V10_PREFS_KEY='VibraErotica.cartPreferences.v1';
const V10_ACCESS_PREFIX='VibraErotica.panelAccess.v1:';
let cartPreferences={};
try{ cartPreferences=JSON.parse(localStorage.getItem(V10_PREFS_KEY)||'{}')||{}; }catch{ cartPreferences={}; }
const saveCartPreferences=()=>localStorage.setItem(V10_PREFS_KEY,JSON.stringify(cartPreferences));

/* ---------- Iconos ampliados ---------- */
Object.assign(FOOD,{
 candy:`<svg viewBox="0 0 64 64"><path d="M22 22h20l8 10-8 10H22l-8-10zM14 32 7 23l9 2M50 32l7-9-9 2"/><path d="M26 27h12M26 37h12"/></svg>`,
 chips:`<svg viewBox="0 0 64 64"><path d="M18 10h28l5 44H13zM20 18h24M22 45c7-8 13-8 20 0"/><circle cx="27" cy="32" r="4"/><circle cx="38" cy="29" r="4"/></svg>`,
 churros:`<svg viewBox="0 0 64 64"><path d="M18 12c8 6 8 34 0 40M30 12c8 6 8 34 0 40M42 12c8 6 8 34 0 40"/><path d="M14 17h8M26 17h8M38 17h8M14 47h8M26 47h8M38 47h8"/></svg>`,
 brownie:`<svg viewBox="0 0 64 64"><path d="M14 22h36v28H14zM14 31h36M26 22v28M38 22v28"/><path d="M19 17h26"/></svg>`,
 flan:`<svg viewBox="0 0 64 64"><path d="M19 21h26l6 27H13z"/><ellipse cx="32" cy="21" rx="13" ry="5"/><path d="M17 48h30"/></svg>`,
 candybag:`<svg viewBox="0 0 64 64"><path d="M20 10h24l-3 9 6 35H17l6-35zM23 19h18"/><circle cx="27" cy="34" r="3"/><circle cx="37" cy="31" r="3"/><circle cx="33" cy="43" r="3"/></svg>`,
 bottle:`<svg viewBox="0 0 64 64"><path d="M26 7h12v9l5 8v28c0 4-3 6-7 6h-8c-4 0-7-2-7-6V24l5-8zM24 29h16M24 45h16"/></svg>`,
 can:`<svg viewBox="0 0 64 64"><path d="M21 10h22l3 6-3 38H21l-3-38zM19 16h26M23 49h18M27 12h10"/></svg>`,
 condiment:`<svg viewBox="0 0 64 64"><path d="M27 8h10l2 8 6 7-4 33H23l-4-33 6-7zM25 16h14M23 31h18"/></svg>`
});
FOOD_PACKS['Snacks y dulces']=['nachos','chips','candy','candybag','chocolate','cookie','donut','churros','brownie','flan','popsicle','icecream','cake','cupcake','muffin'];
FOOD_PACKS['Envases y extras']=['bottle','can','soda','juice','water','condiment'];
Object.assign(EXTRA_LABELS,{
 candy:'Dulce',chips:'Papas o botana',churros:'Churros',brownie:'Brownie',flan:'Flan',
 candybag:'Bolsa de dulces',bottle:'Botella',can:'Lata',condiment:'Condimento'
});

/* ---------- Catálogo sugerido MX (SKUs separados para que el servidor calcule precios) ---------- */
const V10_CATALOG = [
  ['mx_coca_355','Coca-Cola 355 ml','Accesorio para adultos en lata de 355 ml.','Accesorio para adultoss',22,24,'can'],
  ['mx_coca_600','Coca-Cola 600 ml','Accesorio para adultos en botella de 600 ml.','Accesorio para adultoss',30,24,'soda'],
  ['mx_coca_1l','Coca-Cola 1 L','Accesorio para adultos en botella de 1 litro.','Accesorio para adultoss',42,18,'bottle'],
  ['mx_coca_2l','Coca-Cola 2 L','Accesorio para adultos familiar en botella de 2 litros.','Accesorio para adultoss',58,12,'bottle'],
  ['mx_coca_zero_600','Coca-Cola Sin Azúcar 600 ml','Accesorio para adultos sin azúcar en botella de 600 ml.','Accesorio para adultoss',30,18,'soda'],
  ['mx_pepsi_355','Pepsi 355 ml','Accesorio para adultos en lata de 355 ml.','Accesorio para adultoss',21,24,'can'],
  ['mx_pepsi_600','Pepsi 600 ml','Accesorio para adultos en botella de 600 ml.','Accesorio para adultoss',29,24,'soda'],
  ['mx_pepsi_1l','Pepsi 1 L','Accesorio para adultos en botella de 1 litro.','Accesorio para adultoss',40,18,'bottle'],
  ['mx_pepsi_black_600','Pepsi Black 600 ml','Accesorio para adultos sin azúcar en botella de 600 ml.','Accesorio para adultoss',29,18,'soda'],
  ['mx_mirinda_600','Mirinda Naranja 600 ml','Accesorio para adultos sabor naranja.','Accesorio para adultoss',28,18,'soda'],
  ['mx_7up_600','7Up 600 ml','Accesorio para adultos sabor lima-limón.','Accesorio para adultoss',28,18,'soda'],
  ['mx_manzanita_600','Manzanita Sol 600 ml','Accesorio para adultos sabor manzana.','Accesorio para adultoss',28,18,'soda'],
  ['mx_mundet_600','Sidral Mundet 600 ml','Accesorio para adultos sabor manzana.','Accesorio para adultoss',30,18,'soda'],
  ['mx_squirt_600','Squirt 600 ml','Accesorio para adultos sabor toronja.','Accesorio para adultoss',29,18,'soda'],
  ['mx_fresca_600','Fresca 600 ml','Accesorio para adultos sabor toronja.','Accesorio para adultoss',29,18,'soda'],
  ['mx_redcola_600','Red Cola 600 ml','Accesorio para adultos de cola en botella de 600 ml.','Accesorio para adultoss',25,18,'soda'],
  ['mx_bigcola_600','Big Cola 600 ml','Accesorio para adultos de cola en botella de 600 ml.','Accesorio para adultoss',24,18,'soda'],
  ['mx_penafiel_mineral_600','Peñafiel Mineral 600 ml','Agua mineral gasificada.','Accesorio para adultoss',28,18,'water'],
  ['mx_penafiel_limon_600','Peñafiel Limón 600 ml','Bebida gasificada sabor limón.','Accesorio para adultoss',28,18,'soda'],
  ['mx_sangria_600','Sangría Señorial 600 ml','Accesorio para adultos sabor sangría, sin alcohol.','Accesorio para adultoss',29,18,'soda'],
  ['mx_jarritos_mandarina_600','Jarritos Mandarina 600 ml','Accesorio para adultos sabor mandarina.','Accesorio para adultoss',28,18,'soda'],
  ['mx_jarritos_tamarindo_600','Jarritos Tamarindo 600 ml','Accesorio para adultos sabor tamarindo.','Accesorio para adultoss',28,18,'soda'],
  ['mx_jarritos_pina_600','Jarritos Piña 600 ml','Accesorio para adultos sabor piña.','Accesorio para adultoss',28,18,'soda'],
  ['mx_jarritos_torja_600','Jarritos Toronja 600 ml','Accesorio para adultos sabor toronja.','Accesorio para adultoss',28,18,'soda'],
  ['mx_cantaritos_600','Cantaritos 600 ml','Bebida refrescante sabor cítrico; disponibilidad según proveedor.','Accesorio para adultoss',30,12,'soda'],
  ['mx_jumex_mango_450','Jumex Mango 450 ml','Néctar de mango.','Jugos',27,18,'juice'],
  ['mx_jumex_guayaba_450','Jumex Guayaba 450 ml','Néctar de guayaba.','Jugos',27,18,'juice'],
  ['mx_delvalle_naranja_413','Del Valle Naranja 413 ml','Bebida de naranja.','Jugos',28,18,'juice'],
  ['mx_boing_mango_500','Boing Mango 500 ml','Bebida de fruta sabor mango.','Jugos',25,18,'juice'],
  ['mx_boing_guayaba_500','Boing Guayaba 500 ml','Bebida de fruta sabor guayaba.','Jugos',25,18,'juice'],
  ['mx_water_600','Agua natural 600 ml','Agua purificada en botella de 600 ml.','Aguas',20,30,'water'],
  ['mx_water_1l','Agua natural 1 L','Agua purificada en botella de 1 litro.','Aguas',28,24,'bottle'],
  ['mx_water_15l','Agua natural 1.5 L','Agua purificada en botella de 1.5 litros.','Aguas',35,18,'bottle'],
  ['mx_chips_natural','Papas clásicas','Botana de papa individual.','Snacks',25,20,'chips'],
  ['mx_chips_adobadas','Papas adobadas','Botana de papa sabor adobado.','Snacks',25,20,'chips'],
  ['mx_nachos','Nachos','Totopos con porción de queso.','Snacks',48,18,'nachos'],
  ['mx_peanuts','Cacahuates','Porción individual de cacahuates.','Snacks',22,20,'candybag'],
  ['mx_paleta','Paleta de caramelo','Dulce individual.','Dulces',10,30,'candy'],
  ['mx_gomitas','Gomitas','Bolsa individual de gomitas.','Dulces',24,20,'candybag'],
  ['mx_chocolate','Chocolate','Barra individual de chocolate.','Dulces',25,20,'chocolate'],
  ['mx_mazapan','Mazapán','Dulce de cacahuate individual.','Dulces',12,30,'candy'],
  ['mx_churros','Churros con azúcar','Orden de churros espolvoreados con azúcar.','Postres',42,16,'churros'],
  ['mx_flan','Flan napolitano','Rebanada individual de flan.','Postres',48,12,'flan'],
  ['mx_brownie','Brownie','Brownie de chocolate individual.','Postres',45,14,'brownie'],
  ['mx_icecream','Helado','Porción individual; sabor sujeto a disponibilidad.','Postres',40,16,'icecream'],
  ['extra_ketchup','Catsup extra','Porción adicional de catsup.','Extras',8,50,'condiment'],
  ['extra_lime','Limones extra','Porción adicional de limón.','Extras',6,50,'fruit'],
  ['extra_cream','Crema extra','Porción adicional de crema.','Extras',10,40,'condiment'],
  ['extra_salsa','Salsa extra','Porción adicional de salsa.','Extras',8,50,'chili'],
  ['extra_dressing','Aderezo extra','Porción adicional de aderezo.','Extras',10,40,'condiment'],
  ['extra_cheese','Queso extra','Porción adicional de queso.','Extras',15,35,'condiment'],
  ['extra_guacamole','Guacamole extra','Porción adicional de guacamole.','Extras',22,25,'avocado']
].map((r,i)=>({id:r[0],name:r[1],description:r[2],category:r[3],price:r[4],stock:r[5],icon:r[6],image:'',active:true,sort_order:500+i}));

async function v10SeedCatalog(){
  if(!supabaseClient||!adminSession)throw Error('Inicia sesión como administrador.');
  if(!panelCan('products'))throw Error('Tu cuenta no tiene permiso de Productos.');
  const existing=new Set(state.products.map(p=>String(p.id)));
  const rows=V10_CATALOG.filter(p=>!existing.has(p.id) && !state.products.some(x=>x.name===p.name)).map(p=>productRow({...p,id:crypto.randomUUID()},p.sort_order));
  if(!rows.length){ toast('El catálogo sugerido ya está cargado.','info'); return; }
  const {error}=await supabaseClient.from('products').upsert(rows,{onConflict:'id'});
  if(error)throw error;
  await loadPublicCloudState();
  toast(rows.length+' productos sugeridos agregados. Revisa precios y existencias.','ok');
}

/* Inserta botón de carga de catálogo en Productos sin tocar el flujo base. */
const v10RenderProductsAdmin=renderProductsAdmin;
renderProductsAdmin=function(c){
  v10RenderProductsAdmin(c);
  if(!c || document.getElementById('v10SeedCatalog'))return;
  const toolbar=c.querySelector('.toolbar');
  if(!toolbar)return;
  const b=document.createElement('button');
  b.id='v10SeedCatalog'; b.className='btn secondary'; b.type='button';
  b.innerHTML=(FOOD.soda||UI.plus)+'<span>Catálogo sugerido (opcional)</span>';
  b.onclick=e=>panelRun(e.currentTarget,v10SeedCatalog);
  toolbar.append(b);
  const note=document.createElement('div');
  note.className='catalog-seed-card small';
  note.innerHTML='<strong>Catálogo sugerido:</strong> refrescos y jugos por envase (355 ml, 600 ml, 1 L, 2 L según producto), aguas, dulces, snacks, postres y extras con costo. Se crean como SKUs independientes para que el precio sea validado por el servidor.';
  toolbar.after(note);
};

/* ---------- Personalización: "sin ingredientes" + extras reales del catálogo ---------- */
function v10IngredientSuggestions(p){
  const text=(p.description||'').toLowerCase();
  const candidates=['cebolla','jitomate','tomate','lechuga','queso','crema','salsa','aderezo','mayonesa','mostaza','catsup','pepinillos','guacamole','chile','cilantro','frijoles'];
  return [...new Set(candidates.filter(x=>text.includes(x)))];
}
function v10IsFood(p){return false;}
function v10Extras(){
  return state.products.filter(p=>p.active&&p.stock>0&&p.category==='Extras');
}
function v10PrefSummary(id){
  const p=cartPreferences[id];
  if(!p)return '';
  const parts=[];
  if(p.without?.length)parts.push('Sin: '+p.without.join(', '));
  if(p.extras?.length){
    const names=p.extras.map(x=>state.products.find(p=>p.id===x)?.name).filter(Boolean);
    if(names.length)parts.push('Extras: '+names.join(', '));
  }
  return parts.join(' · ');
}
function v10BuildOrderNotes(){
  const rows=Object.entries(cartPreferences)
    .filter(([id])=>state.cart[id])
    .map(([id])=>{
      const p=state.products.find(p=>p.id===id),s=v10PrefSummary(id);
      return p&&s?`${p.name} (aplica a toda la línea): ${s}`:'';
    }).filter(Boolean);
  return rows.length?'Personalización:\n'+rows.join('\n'):'';
}

/* Reemplaza el visor de producto con personalización cuando corresponde. */
const v10BaseOpenProductViewer=openProductViewer;
openProductViewer=function(id,focus){
  const p=state.products.find(p=>p.id===id);
  if(!p || !v10IsFood(p))return v10BaseOpenProductViewer(id,focus);

  productFocus=focus;
  const m=v4Modal('productViewerModal',p.name),body=m.querySelector('.modal-body');
  m.classList.add('product-viewer');m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
  m.querySelector('.modal-head strong').textContent=p.name;

  const current=cartPreferences[id]||{without:[],extras:[]};
  const ingredients=v10IngredientSuggestions(p),extras=v10Extras();

  body.innerHTML=`
    <div class="product-large-view"><div id="productZoomImage">${productVisual(p)}</div></div>
    <label class="field">Ampliar imagen<input id="productZoomRange" type="range" min="100" max="250" value="100" aria-label="Ampliar imagen del producto"></label>
    <h3>${esc(p.name)} · ${money(productPrice(p))}</h3>
    <p>${esc(p.description)}</p><p class="small">${p.stock} disponibles</p>
    <div class="product-customizer">
      ${ingredients.length?`<section class="customizer-box"><h4>¿Qué no quieres que le agreguemos?</h4><p class="small muted">La selección aplica a todas las unidades de este producto en el carrito.</p><div class="customizer-options">${ingredients.map(x=>`<label class="customizer-option"><input type="checkbox" data-v10-without value="${esc(x)}" ${current.without?.includes(x)?'checked':''}>Sin ${esc(x)}</label>`).join('')}</div></section>`:''}
      ${extras.length?`<section class="customizer-box"><h4>Extras con costo adicional</h4><div class="customizer-options">${extras.map(x=>`<label class="customizer-option"><input type="checkbox" data-v10-extra value="${esc(x.id)}" ${current.extras?.includes(x.id)?'checked':''}>${esc(x.name)} · ${money(productPrice(x))}</label>`).join('')}</div></section>`:''}
    </div>
    ${panelButton('productViewerAdd','Guardar personalización y agregar',UI.cart,'full')}
  `;
  body.querySelector('#productZoomRange').oninput=e=>body.querySelector('#productZoomImage').style.width=e.target.value+'%';
  const add=body.querySelector('#productViewerAdd');
  add.disabled=p.stock<=0||(state.cart[id]||0)>=p.stock;
  add.onclick=()=>{
    const without=[...body.querySelectorAll('[data-v10-without]:checked')].map(x=>x.value);
    const selectedExtras=[...body.querySelectorAll('[data-v10-extra]:checked')].map(x=>x.value);
    const prior=new Set(current.extras||[]);
    cartPreferences[id]={without,extras:selectedExtras};
    saveCartPreferences();

    changeQty(id,1);
    /* Extras son productos reales: solo se agrega 1 al activarlos por primera vez. */
    selectedExtras.forEach(extraId=>{
      if(prior.has(extraId))return;
      const ep=state.products.find(x=>x.id===extraId);
      if(ep && (state.cart[extraId]||0)<ep.stock)changeQty(extraId,1);
    });
    add.disabled=(state.cart[id]||0)>=p.stock;
    toast('Producto personalizado y agregado.','ok');
  };
  openModal(m.id);m.querySelector('[data-close-modal]').focus();
};

/* En tarjetas de comida, el botón grande conduce a personalizar; +/- sigue siendo rápido. */
const v10RenderCatalog=renderCatalog;
renderCatalog=function(){
  v10RenderCatalog();
  document.querySelectorAll('#catalogGrid .product-card').forEach(card=>{
    const view=card.querySelector('[data-view-product]');
    if(!view)return;
    const id=view.dataset.viewProduct,p=state.products.find(x=>x.id===id);
    if(!p||!v10IsFood(p))return;
    const add=card.querySelector('.qty-row>.btn[data-inc]');
    if(add){
      add.removeAttribute('data-inc');add.dataset.viewProduct=id;
      add.innerHTML=UI.edit+'<span>Personalizar</span>';
      add.onclick=e=>{e.preventDefault();e.stopPropagation();openProductViewer(id,add)};
    }
  });
};

/* Muestra la personalización en el carrito y limpia preferencias huérfanas. */
const v10RenderCart=renderCart;
renderCart=function(){
  for(const id of Object.keys(cartPreferences))if(!state.cart[id])delete cartPreferences[id];
  saveCartPreferences();
  v10RenderCart();
  document.querySelectorAll('#cartBody .cart-item').forEach(item=>{
    const view=item.querySelector('[data-view-cart-product]');
    if(!view)return;
    const summary=v10PrefSummary(view.dataset.viewCartProduct);
    if(!summary)return;
    const box=document.createElement('div');box.className='cart-customization';box.textContent=summary;
    item.children[1]?.append(box);
  });
};

/* Al enviar, agrega las exclusiones a las notas del pedido.
   Los extras ya viajan como productos normales, por lo que el servidor conserva el precio. */
const v10ConfirmOrder=confirmOrder;
confirmOrder=async function(){
  const original=checkout.notes||'';
  const personalization=v10BuildOrderNotes();
  if(personalization)checkout.notes=[original,personalization].filter(Boolean).join('\n\n');
  try{
    await v10ConfirmOrder();
    if(!Object.keys(state.cart).length){cartPreferences={};saveCartPreferences();}
  }finally{
    if(Object.keys(state.cart).length)checkout.notes=original;
  }
};

/* ---------- Reloj de oferta: aro de carga proporcional, nunca SVG gigante ---------- */
function v10OfferProgress(o){
  if(!o?.ends_at)return 0;
  const now=Date.now()+offerClockOffset,end=new Date(o.ends_at).getTime();
  const start=o.starts_at?new Date(o.starts_at).getTime():Math.min(now,end-3600000);
  if(end<=start)return 100;
  return Math.max(0,Math.min(100,((now-start)/(end-start))*100));
}
function v10RingHtml(o){
  const pct=v10OfferProgress(o);
  return `<span class="offer-progress" style="--p:${(pct*3.6).toFixed(2)}deg" aria-hidden="true"></span>`;
}
tickOfferCountdown=function(){
  document.querySelectorAll('[data-offer-end]').forEach(el=>{
    let seconds=Math.max(0,Math.ceil((new Date(el.dataset.offerEnd).getTime()-Date.now()-offerClockOffset)/1000));
    const d=Math.floor(seconds/86400);seconds%=86400;const h=Math.floor(seconds/3600);seconds%=3600;const m=Math.floor(seconds/60),s=seconds%60;
    el.textContent=d+' días '+String(h).padStart(2,'0')+' h '+String(m).padStart(2,'0')+' min '+String(s).padStart(2,'0')+' s';
    if(!d&&!h&&!m&&!s)el.textContent='Oferta finalizada';
    let row=el.closest('.offer-countdown-row');
    if(!row){
      const old=el.previousElementSibling;if(old?.classList.contains('offer-clock-icon'))old.remove();
      row=document.createElement('span');row.className='offer-countdown-row';el.before(row);row.append(el);
    }
    let ring=row.querySelector('.offer-progress');
    if(!ring){ring=document.createElement('span');ring.className='offer-progress';row.prepend(ring);}
    const offer=foodOffers.find(o=>o.ends_at===el.dataset.offerEnd && o.product_ids?.some(id=>el.closest('.product-card')?.querySelector(`[data-view-product="${CSS.escape(id)}"]`)));
    const pct=offer?v10OfferProgress(offer):0;ring.style.setProperty('--p',(pct*3.6)+'deg');
  });
};

paintFlashOffers=function(){
  let host=document.getElementById('flashOffers');
  if(!host){host=document.createElement('section');host.id='flashOffers';host.className='container flash-offers';document.getElementById('catalogPreparation').before(host)}
  const offers=foodOffers.filter(o=>!o.ends_at||new Date(o.ends_at).getTime()>Date.now()+offerClockOffset);
  host.hidden=!offers.length||!siteStatus?.active;
  host.innerHTML=offers.length?'<h2>Ofertas relámpago</h2><div class="flash-offer-list">'+offers.map(o=>{
    const active=offerActive(o),count=o.product_ids.filter(id=>state.products.some(p=>p.id===id&&p.active&&p.stock>0)).length;
    return `<article class="flash-offer"><h3>${esc(o.title)} · ${o.percent}%</h3><p>${count} productos disponibles · ${active?'Activa':'Programada'}</p><div class="flash-clock">${v10RingHtml(o)}<span data-flash-id="${esc(o.id)}"></span></div><button class="btn secondary" data-open-combo="${esc(o.id)}">${UI.search}<span>Ampliar y ver productos</span></button></article>`;
  }).join('')+'</div>':'';
  host.querySelectorAll('[data-open-combo]').forEach(b=>b.onclick=()=>openOfferCombo(b.dataset.openCombo));
  tickFlashOffers();
};

tickFlashOffers=function(){
  document.querySelectorAll('[data-flash-id]').forEach(el=>{
    const o=foodOffers.find(o=>o.id===el.dataset.flashId);if(!o)return;
    el.textContent=!offerActive(o)&&o.starts_at?'Comienza en '+countdownValue(o.starts_at):o.ends_at?'Termina en '+countdownValue(o.ends_at):'Sin fecha límite';
    const ring=el.parentElement?.querySelector('.offer-progress');
    if(ring)ring.style.setProperty('--p',(v10OfferProgress(o)*3.6)+'deg');
  });
};

openOfferCombo=function(id){
  const o=foodOffers.find(o=>o.id===id);if(!o)return;
  const products=o.product_ids.map(id=>state.products.find(p=>p.id===id)).filter(Boolean);
  const m=v4Modal('offerComboModal',o.title),host=m.querySelector('.modal-body');
  host.innerHTML=`<p>Descuento de ${o.percent}% únicamente en los productos seleccionados.</p><div class="flash-clock">${v10RingHtml(o)}<span data-flash-id="${esc(o.id)}"></span></div><div class="combo-products">${products.map(p=>`<article class="combo-item"><button class="combo-photo product-zoom-trigger" data-combo-view="${esc(p.id)}" aria-label="Ampliar ${esc(p.name)}">${productVisual(p)}</button><h3>${esc(p.name)}</h3><p>${money(productPrice(p))} · ${p.stock} disponibles</p><button class="btn secondary" data-combo-add="${esc(p.id)}" ${p.stock<=0?'disabled':''}>${UI.cart}<span>${v10IsFood(p)?'Personalizar':'Agregar producto'}</span></button></article>`).join('')}</div>`;
  host.querySelectorAll('[data-combo-view]').forEach(b=>b.onclick=()=>{closeModal(m.id);openProductViewer(b.dataset.comboView,b)});
  host.querySelectorAll('[data-combo-add]').forEach(b=>b.onclick=()=>{
    const p=state.products.find(p=>p.id===b.dataset.comboAdd);if(!p)return;
    if(v10IsFood(p)){closeModal(m.id);openProductViewer(p.id,b);return}
    if((state.cart[p.id]||0)>=p.stock)return toast('No hay más existencias.','info');
    changeQty(p.id,1);toast('Producto agregado.','ok');
  });
  openModal(m.id);tickFlashOffers();
};

/* ---------- Sesión / permisos: evita parpadeo del botón admin ---------- */
function v10AccessCache(userId){
  try{
    const x=JSON.parse(localStorage.getItem(V10_ACCESS_PREFIX+userId)||'null');
    if(!x||!x.savedAt||Date.now()-x.savedAt>15*60*1000)return null;
    return x.access||null;
  }catch{return null}
}
function v10SaveAccess(userId,access){
  try{localStorage.setItem(V10_ACCESS_PREFIX+userId,JSON.stringify({savedAt:Date.now(),access}))}catch{}
}
syncAdminVisibility=function(){
  const b=document.getElementById('adminBtn');
  let access=panelAccess;
  if(adminSession && !(access?.master||access?.owner||access?.modules?.length)){
    access=v10AccessCache(adminSession.user.id)||access;
  }
  const allowed=!!adminSession&&(!!access?.master||!!access?.owner||(access?.modules?.length||0)>0);
  b.hidden=!allowed;b.style.display=allowed?'':'none';b.setAttribute('aria-hidden',String(!allowed));
};

panelVerify=async function(){
  if(!supabaseClient||!adminSession){panelAccess={owner:false,master:false,modules:[]};syncAdminVisibility();return false}
  const who=adminSession.user.id,epoch=customerSerial;
  const cached=v10AccessCache(who);
  if(cached && !(panelAccess.master||panelAccess.owner||panelAccess.modules?.length)){panelAccess={owner:false,master:false,modules:[],...cached};syncAdminVisibility()}
  const {data,error}=await supabaseClient.auth.getUser();
  if(error||!data?.user||adminSession?.user.id!==who||epoch!==customerSerial){panelAccess={owner:false,master:false,modules:[]};syncAdminVisibility();return false}
  try{
    const r=await supabaseClient.rpc('catalog_panel',{p_action:'access',p_payload:{}});
    if(r.error)throw r.error;
    if(adminSession?.user.id!==who||epoch!==customerSerial)return false;
    panelAccess={owner:false,master:false,modules:[],...r.data};
    v10SaveAccess(who,panelAccess);
  }catch(e){
    /* En un fallo de red breve se conserva solo la caché visual; las acciones siguen validadas por servidor. */
    if(!cached)panelAccess={owner:false,master:false,modules:[]};
  }
  syncAdminVisibility();
  return !!(panelAccess.master||panelAccess.owner||panelAccess.modules.length);
};

/* Accesorio para adultos de sesión al volver a la pestaña; Supabase ya usa persistSession + autoRefreshToken. */
async function v10RefreshAuth(){
  if(!supabaseClient)return;
  try{
    const {data}=await supabaseClient.auth.getSession();
    if(data?.session){
      customerSession=data.session;adminSession=data.session;
      const exp=(data.session.expires_at||0)*1000;
      if(exp && exp-Date.now()<5*60*1000)await supabaseClient.auth.refreshSession();
      syncAdminVisibility();renderAccountButton();
    }
  }catch{}
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)v10RefreshAuth()});
setInterval(()=>{if(!document.hidden)v10RefreshAuth()},10*60*1000);

/* Limpieza de preferencias al eliminar un producto desde el carrito. */
document.addEventListener('click',e=>{
  const b=e.target.closest('button[data-remove]');
  if(!b)return;
  delete cartPreferences[b.dataset.remove];saveCartPreferences();
},true);

/* Ejecuta una pasada de reparación visual tras la carga. */
setTimeout(()=>{try{renderCatalog();syncAdminVisibility();tickFlashOffers()}catch{}},600);
})();
