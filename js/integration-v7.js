/* Módulo: js/integration-v7.js | Función: lógica original del bloque 25 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
'use strict';
// Iconos SVG vectoriales (no emojis): opciones de identidad y ticket.
const LINGERIE_ICONS={
  corazon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20C9 18 3 13 3 8a5 5 0 0 1 9-2 5 5 0 0 1 9 2c0 5-6 10-9 12z"/></svg>',
  corset:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h10l2 6-2 12H7L5 9zM9 7l6 10m0-10-6 10"/></svg>',
  lenceria:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3c1 2 2 3 4 3s3-1 4-3M8 3C7 7 5 9 3 13c3 3 6 4 9 4s6-1 9-4c-2-4-4-6-5-10M10 17l-1 4m5-4 1 4"/></svg>',
  rosa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4c4-4 9 2 5 6 4 3 1 9-4 8-4 3-9-1-7-5-4-3-1-8 3-8 0-3 2-3 3-1zM12 10l1 11m0-4 5-3"/></svg>',
  labios:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12c5-5 7-5 10-3 3-2 5-2 10 3-5 5-15 5-20 0zM4 12h16"/></svg>',
  boutique18:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M5 7h14M7 16h10"/></svg>',
  masaje:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="6" r="2"/><path d="M3 19h18M5 16h13M8 9l3 4h8M12 10l-1 6"/></svg>'
};
window.VIBRA_ICONOS_V7=LINGERIE_ICONS;
if(window.FOOD){Object.assign(window.FOOD,LINGERIE_ICONS)}
// Los textos de opiniones siguen usando la clave técnica food_rating para compatibilidad,
// pero la etiqueta pública es Experiencia en vez de Comida.
// Panel: agrega guía de categorías y evita la carga automática de productos de comida.
const originalRenderProductsAdmin=window.renderProductsAdmin;
if(typeof originalRenderProductsAdmin==='function')window.renderProductsAdmin=function(host){
  const result=originalRenderProductsAdmin.apply(this,arguments);
  try{
    host.querySelectorAll('button').forEach(b=>{if(/catálogo sugerido/i.test(b.textContent))b.remove()});
    const form=host.querySelector('#apCategory');
    if(form){const label=form.closest('.field')?.querySelector('label');if(label)label.textContent='Categoría (lencería, accesorios, bienestar o masaje)'}
  }catch(e){console.warn('Ajuste de interfaz',e)}
  return result;
};
// Botón de estilo gráfico adicional en el editor de tickets, sin reescribir su renderizador.
const originalTicket=window.renderTicketAdmin||window.panelTicket;
if(typeof originalTicket==='function'){
  const wrapped=function(host){const r=originalTicket.apply(this,arguments);
    if(!host?.querySelector)return r;
    const root=host.querySelector('.ticket-editor')||host;
    if(root.querySelector('#vibraTicketIcons'))return r;
    const section=document.createElement('section');section.className='section-card';section.id='vibraTicketIcons';
    section.innerHTML='<h3>Iconografía boutique</h3><p class="small muted">Diseños SVG para +18, lencería y bienestar. Las opciones se muestran sin emojis.</p><div class="vibra-custom-icons">'+Object.entries(LINGERIE_ICONS).map(([name,svg])=>'<label>'+svg+'<span>'+name+'</span></label>').join('')+'</div>';
    root.append(section);return r;
  };
  if(window.renderTicketAdmin===originalTicket)window.renderTicketAdmin=wrapped;
  else if(window.panelTicket===originalTicket)window.panelTicket=wrapped;
}
// Solo cambia lo visible en el editor de calificaciones, no el nombre de columna SQL.
const originalRating=window.v15OpenBusinessReviews;
if(typeof originalRating==='function')window.v15OpenBusinessReviews=function(){return originalRating.apply(this,arguments)};
// La revisión usa las tablas actuales y no consulta public.receipts.
window.renderReceiptsAdmin=async function(host){
  host.innerHTML='<div class="section-card"><h3>Comprobantes</h3><p>Documentos privados del bucket payment-proofs.</p><div id="vibraProofs">Cargando…</div></div>';
  const target=host.querySelector('#vibraProofs');
  try{
    if(!supabaseClient)throw Error('Supabase no está conectado');
    const {data,error}=await supabaseClient.from('payment_proofs').select('id,object_path,order_id,reservation_id,review_status,created_at').order('created_at',{ascending:false}).limit(200);
    if(error)throw error;
    target.innerHTML=(data||[]).length?(data||[]).map(p=>'<article class="section-card"><strong>'+esc(p.reservation_id?'Reservación':'Compra')+'</strong><p>'+esc(p.review_status)+' · '+esc(new Date(p.created_at).toLocaleString('es-MX'))+'</p><button class="btn secondary" data-vibra-proof="'+esc(p.id)+'">Ver comprobante</button></article>').join(''):'<p>Aún no se han registrado comprobantes.</p>';
    target.querySelectorAll('[data-vibra-proof]').forEach(b=>b.onclick=async()=>{
      try{
        const r=(data||[]).find(x=>x.id===b.dataset.vibraProof);
        const {data:url,error:e}=await supabaseClient.storage.from('payment-proofs').createSignedUrl(r.object_path,120);
        if(e)throw e;
        window.open(url.signedUrl,'_blank','noopener,noreferrer');
      }catch(e){toast(e.message,'error')}
    });
  }catch(e){target.textContent='Error de consulta: '+e.message}
};
window.renderPaymentReviewAdmin=async function(host){
  host.innerHTML='<div class="section-card"><h3>Revisión de pagos</h3><p>Aprobar o rechazar comprobantes de compras y reservaciones.</p><div id="vibraPaymentRows">Cargando…</div></div>';
  const target=host.querySelector('#vibraPaymentRows');
  try{
    const {data,error}=await supabaseClient.from('payment_proofs').select('id,object_path,order_id,reservation_id,review_status,created_at').eq('review_status','pending').order('created_at',{ascending:false}).limit(200);
    if(error)throw error;
    target.innerHTML=(data||[]).length?(data||[]).map(p=>'<article class="section-card"><strong>'+esc(p.reservation_id?'Reservación':'Compra')+'</strong><p>'+esc(new Date(p.created_at).toLocaleString('es-MX'))+'</p><button class="btn secondary" data-vibra-see="'+esc(p.id)+'">Ver archivo</button> <button class="btn" data-vibra-decide="'+esc(p.id)+'" data-approve="true">Aprobar</button> <button class="btn danger" data-vibra-decide="'+esc(p.id)+'" data-approve="false">Rechazar</button></article>').join(''):'<p>No hay pagos pendientes de revisión.</p>';
    target.querySelectorAll('[data-vibra-see]').forEach(b=>b.onclick=async()=>{try{const r=data.find(x=>x.id===b.dataset.vibraSee);const {data:u,error:e}=await supabaseClient.storage.from('payment-proofs').createSignedUrl(r.object_path,120);if(e)throw e;window.open(u.signedUrl,'_blank','noopener,noreferrer')}catch(e){toast(e.message,'error')}});
    target.querySelectorAll('[data-vibra-decide]').forEach(b=>b.onclick=async()=>{
      if(!confirm('¿Confirmas esta decisión de pago?'))return;
      try{const {error:e}=await supabaseClient.rpc('vibra_review_payment_v7',{p_proof_id:b.dataset.vibraDecide,p_approve:b.dataset.approve==='true'});if(e)throw e;window.renderPaymentReviewAdmin(host)}catch(e){toast(e.message,'error')}
    });
  }catch(e){target.textContent='Error de consulta: '+e.message}
};
// El mapa necesita coordenadas válidas de la marca: no inventar latitud/longitud.
window.vibraMostrarMapa=async function(element){
  if(!element||!supabaseClient)return;
  const {data,error}=await supabaseClient.from('brand_settings').select('latitude,longitude').eq('id',1).maybeSingle();
  if(error||!data||!Number.isFinite(data.latitude)||!Number.isFinite(data.longitude)){
    element.textContent='Configura la ubicación del local desde Administración → Negocio.';return;
  }
  const lat=data.latitude,lon=data.longitude;
  const iframe=document.createElement('iframe');iframe.className='vibra-map';iframe.loading='lazy';iframe.title='Mapa de ubicación del local';
  iframe.src='https://www.openstreetmap.org/export/embed.html?bbox='+encodeURIComponent((lon-.008)+','+(lat-.006)+','+(lon+.008)+','+(lat+.006))+'&layer=mapnik&marker='+encodeURIComponent(lat+','+lon);
  const a=document.createElement('a');a.href='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(lat+','+lon);a.target='_blank';a.rel='noopener noreferrer';a.textContent='Cómo llegar';a.className='btn secondary';
  element.replaceChildren(iframe,a);
};
})();
