/* Módulo: js/locations-v9.js | Función: lógica original del bloque 26 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

/* VibraErótica V9: ubicaciones, modos y cotizador. No toca la impresión de tickets. */
(()=>{
const el=(s)=>document.querySelector(s);
const db=()=>typeof supabaseClient!=='undefined'?supabaseClient:null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=(type)=>({pin:'<path d="M12 22s7-7 7-13A7 7 0 1 0 5 9c0 6 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/>',spa:'<path d="M12 21V9m0 4C7 13 4 10 3 5c6 1 9 4 9 8zm0 0c5 0 8-3 9-8-6 1-9 4-9 8z"/>',car:'<path d="M4 16l1-6h14l1 6m-15 0h14M7 10l2-4h6l2 4M6 19v-3m12 3v-3"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/>',arrow:'<path d="M3 12h18m-8-8 8 8-8 8"/>'}[type]||'');
const ic=(k)=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${svg(k)}</svg>`;
let locations=[],modes=[],price=null,staff=[],services=[],hours=[],theme=null,admin=false,selected=null,links=[],durations=[],rooms=[];
const css=`
#v9Section{max-width:1260px;margin:24px auto;padding:0 14px;position:relative;z-index:1;color:var(--text,#f3eaf0)}
.v9panel{border:1px solid rgba(253,138,191,.18);border-radius:22px;padding:24px;background:linear-gradient(150deg,rgba(39,24,37,.97),rgba(17,20,30,.97));box-shadow:0 8px 36px #0002;margin-bottom:18px}
.v9head{display:flex;gap:12px;align-items:center;margin-bottom:12px}.v9head svg{color:#ed4190}.v9head h2{font-size:1.45rem;margin:0}
.v9muted{color:#bcb2bd}.v9grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}
.v9site{border:1px solid #3f3246;border-radius:15px;padding:17px;background:#1d1c29;cursor:pointer;text-align:left;color:#f8f1f5}
.v9site[aria-pressed=true]{border-color:#f13e92;box-shadow:0 0 0 1px #f13e92}
.v9site h3{margin:4px 0 10px}.v9site p{margin:3px 0;color:#c8bfca}
.v9action{cursor:pointer;border:0;border-radius:12px;background:#d51f7c;color:white;padding:12px 15px;font-weight:700;display:inline-flex;gap:8px;align-items:center;margin:5px 6px 5px 0}
.v9action.secondary{background:#302a3b;border:1px solid #65536c}.v9action:disabled{opacity:.45;cursor:not-allowed}
.v9fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}
.v9fields label{display:grid;gap:5px;font-weight:600;font-size:13px}.v9fields input,.v9fields select,.v9fields textarea{width:100%;box-sizing:border-box;border:1px solid #514154;border-radius:9px;background:#111520;color:#f6eff8;padding:10px;min-height:40px}
.v9map{height:345px;border-radius:14px;overflow:hidden;margin-top:12px;background:#182331}.v9map iframe{width:100%;height:100%;border:0}
.v9staff{display:flex;gap:14px;align-items:flex-start}.v9staff-photo{width:100px;height:110px;flex-shrink:0;border-radius:12px;object-fit:cover;background:#29253a}
.v9small{font-size:12px;color:#c4b5c6}#v9Admin{display:none}#v9Admin.visible{display:block}
body[data-v9-template="lace"] #v9Section:before{content:"";position:absolute;z-index:-1;inset:0;background:repeating-radial-gradient(circle at 20px 20px,transparent 0 12px,#f1348a20 13px 14px,transparent 15px 42px);pointer-events:none}
body[data-v9-template="velvet"] #v9Section{background:linear-gradient(120deg,#43113455,#18131c55);border-radius:20px}
body[data-v9-template="silk"] #v9Section{background:radial-gradient(ellipse at 20% 10%,#92205022,transparent 60%);border-radius:20px}
/* Antiguo panel exclusivamente de reparto; NO borrar operaciones ni la configuración del mapa en Negocio */
[data-admin-tab="trip"],[data-admin-tab="deliveries"],[data-admin-tab="expenses"],[data-admin-tab="routes"]{display:none!important}
`;const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function setup(){
if(el('#v9Section'))return;
const older=el('#v8Section');if(older)older.remove();
const n=document.createElement('section');n.id='v9Section';n.innerHTML=`
<section class="v9panel" id="vibraOldPublicLocations" hidden><div class="v9head">${ic('pin')}<h2>Visítanos · sedes oficiales</h2></div><p class="v9muted">Selecciona la sede que deseas visitar. Solo se muestran ubicaciones publicadas por el negocio.</p><div id="v9Locations" class="v9grid"></div><div id="v9Map" class="v9map"></div><p id="v9PlaceInfo" class="v9muted"></p><button class="v9action" id="v9Directions">${ic('arrow')} Cómo llegar desde mi ubicación</button><a class="v9action secondary" id="v9OpenMap" target="_blank" rel="noopener">Abrir mapa</a><p id="v9GeoState" class="v9small"></p></section>
<section class="v9panel"><div class="v9head">${ic('spa')}<h2>Profesionales y servicios</h2></div><p class="v9muted">Sesiones de bienestar con opciones según disponibilidad: en el local, a domicilio, hotel o motel.</p><div id="v9Professionals" class="v9grid"></div><div id="v9Modalities" hidden><h3>Opciones de atención</h3><p id="v9ModesText"></p><label class="v9small">Selecciona modalidad<select id="v9Mode" class="v9select"></select></label><button class="v9action" id="v9Continue">Consultar horarios y reservar</button><p class="v9small">Los horarios ocupados se consultan en Supabase. El trayecto externo requiere confirmación.</p><div id="v9Booking" hidden><h3>Selecciona fecha y hora</h3><div class="v9fields"><label>Servicio<select id="v9Service"></select></label><label>Habitación<select id="v9Room"></select></label><label>Duración<select id="v9Duration"></select></label><label>Fecha<input id="v9Date" type="date"></label><label>Horarios disponibles<select id="v9Time"></select></label><label>Nombre<input id="v9ClientName" maxlength="90"></label><label>Teléfono<input id="v9ClientPhone" maxlength="25"></label></div><label><input id="v9Terms" type="checkbox"> Acepto las condiciones de reserva: el tiempo inicia a la hora seleccionada y la ausencia o retraso no prolongan el servicio. Consulta las condiciones de cancelación aplicables.</label><p><button class="v9action" id="v9SubmitBooking">Confirmar reserva local</button></p><p id="v9BookingStatus" class="v9small"></p></div></div></section>
<section id="v9Admin" class="v9panel"><div class="v9head">${ic('car')}<h2>Administrar sedes, modalidades y rutas de servicios</h2></div><p class="v9small">Sólo personal autorizado. Hasta 3 sedes. Las direcciones privadas de clientes no aparecen en el mapa público.</p>
<h3>Sedes autorizadas</h3><div class="v9fields"><label>Nombre de sede<input id="v9LocName" placeholder="Sede Centro"></label><label>Dirección completa<input id="v9LocAddress"></label><label>Latitud<input id="v9LocLat" type="number" step="any"></label><label>Longitud<input id="v9LocLng" type="number" step="any"></label><label>Visible al público<select id="v9LocActive"><option value="true">Sí</option><option value="false">No</option></select></label></div><button class="v9action" id="v9SaveLoc">Guardar nueva sede</button><div id="v9ManageSites"></div>
<h3>Modalidades por profesional</h3><div class="v9fields"><label>Profesional<select id="v9Practitioner"></select></label><label><span>Local</span><input type="checkbox" data-mode="local" checked></label><label><span>Domicilio</span><input type="checkbox" data-mode="domicilio"></label><label><span>Hotel</span><input type="checkbox" data-mode="hotel"></label><label><span>Motel</span><input type="checkbox" data-mode="motel"></label></div><button class="v9action" id="v9SaveModes">Guardar modalidades</button>
<h3>Cotizador de rutas para servicios fuera del local</h3><div class="v9fields"><label>Habilitar cálculo<select id="v9TravelEnabled"><option value="false">No</option><option value="true">Sí</option></select></label><label>Vehículo<input id="v9Vehicle" placeholder="Automóvil"></label><label>Rendimiento km/L<input id="v9Consumption" type="number" step="0.1" min="0.1"></label><label>Gasolina $/L<input id="v9Fuel" type="number" step=".01" min="0"></label><label>Salida fija $<input id="v9Fixed" type="number" step=".01" min="0"></label><label>Extra por km $<input id="v9PerKm" type="number" step=".01" min="0"></label><label>Kilómetros reales de ruta<input id="v9Distance" type="number" step=".1" min="0" placeholder="Captura distancia de ruta"></label></div><button class="v9action secondary" id="v9Calc">${ic('car')} Calcular presupuesto</button><button class="v9action" id="v9SaveTravel">Guardar configuración</button><p id="v9CostResult"></p><p class="v9small">Introduce km de carretera obtenidos de tu proveedor de rutas. No se calcula la distancia en línea recta. El coste se estima como salida fija + (km / rendimiento × precio del combustible) + (km × extra por km). Decide si tarifar ida o ida y vuelta.</p>
<h3>Diseño del sitio</h3><div class="v9fields"><label>Color principal<input id="v9Primary" type="color" value="#d41780"></label><label>Color secundario<input id="v9Secondary" type="color" value="#36152f"></label><label>Plantilla de fondo<select id="v9Template"><option value="silk">Seda abstracta</option><option value="lace">Encaje vectorial</option><option value="velvet">Terciopelo</option><option value="minimal">Minimalista</option></select></label></div><button class="v9action" id="v9SaveTheme">Guardar personalización en Supabase</button><p id="v9AdminStatus" class="v9small"></p></section>`;
(el('main')||document.body).append(n);
el('#v9Directions').onclick=route;el('#v9SaveLoc').onclick=saveLocation;el('#v9SaveModes').onclick=saveModes;el('#v9SaveTravel').onclick=saveTravel;el('#v9Calc').onclick=calc;el('#v9SaveTheme').onclick=saveTheme;el('#v9Continue').onclick=continueBooking;el('#v9Practitioner').onchange=displayModeForm;el('#v9Service').onchange=refreshDurations;el('#v9Duration').onchange=refreshSlots;el('#v9Room').onchange=refreshSlots;el('#v9Date').onchange=refreshSlots;el('#v9SubmitBooking').onclick=submitBooking;
}
function setMsg(s){const n=el('#v9AdminStatus');if(n)n.textContent=s}
async function getTable(table){const s=db();if(!s)return [];const r=await s.from(table).select('*');if(r.error){console.warn('V9 '+table+': '+r.error.message);return []}return r.data||[]}
async function load(){setup();const s=db();if(!s)return;
const results=await Promise.all(['service_locations','practitioner_service_modes','travel_pricing','practitioners','services','practitioner_work_hours','site_theme_v9','practitioner_media','practitioner_services','service_durations','rooms'].map(getTable));
[locations,modes,pArr,staff,services,hours,tArr,media,links,durations,rooms]=results;price=pArr?.[0]||null;theme=tArr?.[0]||null;
const {data:{user}}=await s.auth.getUser();admin=false;if(user){const r=await s.from('staff_roles').select('role').eq('user_id',user.id).maybeSingle();admin=['admin','manager'].includes(r.data?.role)}
el('#v9Admin').classList.toggle('visible',admin);renderLocations();renderStaff();renderAdmin();applyTheme();}
let media=[];
function renderLocations(){const wrap=el('#v9Locations');if(!wrap)return;const active=locations.filter(x=>x.is_active).sort((a,b)=>a.sort_order-b.sort_order);
if(!selected||!active.some(a=>a.id===selected))selected=active[0]?.id;
wrap.innerHTML=active.length?active.map(x=>`<button class="v9site" aria-pressed="${x.id===selected}" data-site="${esc(x.id)}"><h3>${ic('pin')} ${esc(x.name)}</h3><p>${esc(x.address)}</p></button>`).join(''):'<p class="v9muted">La ubicación del establecimiento se configura en Administración → Negocio.</p>';
wrap.querySelectorAll('[data-site]').forEach(b=>b.onclick=()=>{selected=b.dataset.site;renderLocations()});
const loc=active.find(x=>x.id===selected);const map=el('#v9Map');if(!loc){map.innerHTML='<p class="v9muted">El mapa se mostrará cuando exista una sede publicada.</p>';el('#v9Directions').disabled=true;el('#v9OpenMap').removeAttribute('href');return}
el('#v9Directions').disabled=false;el('#v9PlaceInfo').textContent=loc.name+' — '+loc.address;
// CARTO light tiles delivered by an iframe (Leaflet loaded inside iframe via srcdoc; no key is needed for public CARTO basemap).
const lat=Number(loc.latitude),lng=Number(loc.longitude);const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>html,body,#map{height:100%;margin:0} .label{font:700 13px system-ui;color:#fff;background:#251b37;padding:5px 10px;border-radius:9px}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script><script>const map=L.map('map',{rotate:true,touchRotate:true,dragRotate:true,shiftKeyRotate:true,rotateControl:{position:"topright",behavior:"reset",closeOnZeroBearing:false}}).setView([${lat},${lng}],15);L.tileLayer('${SUPABASE_URL}/functions/v1/carto-tiles/light_all/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap &copy; CARTO',subdomains:'abcd',maxZoom:19}).addTo(map);L.marker([${lat},${lng}]).addTo(map).bindPopup(${JSON.stringify(loc.name)}).openPopup();<\/script>

<style id="vibra-mobile-service-discovery">@media(max-width:760px){#vibraServiceCatalog .vsm-media-button{display:flex!important;align-items:center;justify-content:center;gap:8px;min-height:44px;width:100%;font-size:.87rem}#vibraServiceCatalog .vibra-service-card{display:flex;flex-direction:column!important}#vibraServiceCatalog .vibra-service-card .btn{min-height:44px}}#vibraReserveShell #v9Booking .v9fields{grid-template-columns:repeat(auto-fit,minmax(165px,1fr))}#vibraReserveShell #v9Modalities{margin:0;padding:6px}#vibraReserveShell select,#vibraReserveShell input{max-width:100%}</style></body>
</html>`;
map.replaceChildren();const iframe=document.createElement('iframe');iframe.title='Mapa CARTO: '+loc.name;iframe.loading='lazy';iframe.srcdoc=html;map.append(iframe);
el('#v9OpenMap').removeAttribute('href');el('#v9OpenMap').hidden=true;
}
function route(){const site=locations.find(x=>x.id===selected);if(!site)return;const target=el('#v9GeoState');target.textContent='Solicitando permiso de ubicación precisa…';if(!navigator.geolocation){target.textContent='Tu navegador no permite geolocalización.';return}navigator.geolocation.getCurrentPosition(p=>{const {latitude,longitude,accuracy}=p.coords;target.textContent=`Precisión aproximada del dispositivo: ${Math.round(accuracy)} m. Tu punto de partida se localizó; la navegación por carretera requiere el motor de rutas.`;},e=>target.textContent='No se pudo obtener tu ubicación: '+e.message,{enableHighAccuracy:true,timeout:20000,maximumAge:0})}
function renderStaff(){const w=el('#v9Professionals');if(!w)return;const active=staff.filter(p=>p.active!==false);w.innerHTML=active.length?active.map(p=>{const enabled=modes.filter(x=>x.practitioner_id===p.id&&x.enabled).map(x=>x.mode);const m=media.find(x=>x.practitioner_id===p.id&&x.media_type==='image');const url=m?db()?.storage.from('catalog-media').getPublicUrl(m.object_path).data.publicUrl:'';
return `<article class="v9site"><div class="v9staff">${url?`<img class="v9staff-photo" src="${esc(url)}" alt="Foto profesional">`:`<div class="v9staff-photo" style="display:grid;place-items:center">${ic('spa')}</div>`}<div><h3>${esc(p.display_name)}</h3><p>${esc(p.bio)}</p><p class="v9small">${enabled.length?enabled.join(' · '):'Modalidades por confirmar'}</p><p class="v9small">${hours.filter(h=>h.practitioner_id===p.id).map(h=>['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][h.weekday]+' '+h.start_time.slice(0,5)+'–'+h.end_time.slice(0,5)).join(', ')||'Sin horarios publicados'}</p>${p.contact_phone?`<p><a href="tel:${esc(p.contact_phone)}">Contactar</a></p>`:''}</div></div><button class="v9action" data-p="${p.id}">Reservar</button></article>`}).join(''):'<p class="v9muted">Aún no se publican perfiles profesionales. Se mostrarán cuando los configure el administrador.</p>';
w.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const id=b.dataset.p;el('#v9Modalities').hidden=false;el('#v9Mode').innerHTML=modes.filter(x=>x.practitioner_id===id&&x.enabled).map(m=>`<option value="${esc(m.mode)}">${esc(m.mode)}</option>`).join('');el('#v9Modalities').dataset.practitioner=id;el('#v9ModesText').textContent=staff.find(x=>x.id===id)?.display_name||'';el('#v9Modalities').scrollIntoView({behavior:'smooth',block:'nearest'})})}
function continueBooking(){
const mode=el('#v9Mode').value;if(!mode){alert('No hay modalidades publicadas para esta profesional.');return}
if(mode!=='local'){alert('Esta modalidad requiere confirmar destino y tarifa con el local. La reserva automática aún no está activada para servicios externos.');return}
const id=el('#v9Modalities').dataset.practitioner;el('#v9Booking').hidden=false;
const offered=links.filter(x=>x.practitioner_id===id).map(x=>x.service_id);
el('#v9Service').innerHTML=services.filter(s=>s.active&&offered.includes(s.id)).map(s=>`<option value="${s.id}">${esc(s.name)} · $${s.hourly_price} MXN/h</option>`).join('');
el('#v9Room').innerHTML=rooms.filter(r=>r.active).map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join('');
const d=new Date();el('#v9Date').min=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');el('#v9Date').value=el('#v9Date').min;
refreshDurations();/* modal keeps reservation in place */
}
function refreshDurations(){const id=el('#v9Service').value;el('#v9Duration').innerHTML=durations.filter(x=>x.service_id===id).map(x=>`<option value="${x.minutes}">${x.minutes} minutos</option>`).join('');refreshSlots()}
async function refreshSlots(){const id=el('#v9Modalities')?.dataset.practitioner;
const s=el('#v9Time');if(!s||!id)return;s.innerHTML='<option value="">Consultando disponibilidad…</option>';
const inputs=['#v9Service','#v9Room','#v9Duration','#v9Date'].map(x=>el(x)?.value);
if(inputs.some(x=>!x)){s.innerHTML='<option value="">Configura servicio, habitación, duración y fecha</option>';return}
const {data,error}=await db().rpc('available_massage_slots',{p_practitioner_id:id,p_service_id:inputs[0],p_room_id:inputs[1],p_duration_minutes:Number(inputs[2]),p_date:inputs[3]});
if(error){s.innerHTML='<option value="">No se pudo consultar disponibilidad</option>';el('#v9BookingStatus').textContent=error.message;return}
s.innerHTML=(data||[]).length?data.map(x=>`<option value="${esc(x.starts_at)}">${esc(x.label)}</option>`).join(''):'<option value="">Sin horarios disponibles</option>';
}
async function submitBooking(){const msg=el('#v9BookingStatus');msg.textContent='Comprobando reserva…';if(!db())return msg.textContent='Falta conexión';
const user=(await db().auth.getUser()).data.user;if(!user)return msg.textContent='Primero inicia sesión en Mi cuenta.';
const start=el('#v9Time').value;if(!start)return msg.textContent='Selecciona un horario disponible.';
if(!el('#v9Terms').checked)return msg.textContent='Debes aceptar las condiciones.';
const r=await db().rpc('create_reservation',{p_service_id:el('#v9Service').value,p_practitioner_id:el('#v9Modalities').dataset.practitioner,p_room_id:el('#v9Room').value,p_starts_at:start,p_duration_minutes:Number(el('#v9Duration').value),p_contact_name:el('#v9ClientName').value.trim(),p_contact_phone:el('#v9ClientPhone').value.trim(),p_contact_email:user.email||null,p_accept_terms:true});
if(r.error){msg.textContent=r.error.message;await refreshSlots();return}msg.textContent='Solicitud creada. Folio interno: '+r.data+'. Espera la confirmación de pago y del local.';await refreshSlots();
}
function renderAdmin(){if(!admin)return;el('#v9ManageSites').innerHTML=locations.map(s=>`<p class="v9small">${esc(s.name)} — ${esc(s.address)} · ${s.is_active?'Visible':'Oculta'} <button class="v9action secondary" data-toggle="${s.id}">${s.is_active?'Ocultar':'Mostrar'}</button> <button class="v9action secondary" data-delete="${s.id}">Eliminar</button></p>`).join('');el('#v9ManageSites').querySelectorAll('[data-toggle]').forEach(b=>b.onclick=async()=>{const s=locations.find(x=>x.id===b.dataset.toggle);const r=await db().from('service_locations').update({is_active:!s.is_active}).eq('id',s.id);if(r.error)setMsg(r.error.message);else load()});el('#v9ManageSites').querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('¿Eliminar esta sede?'))return;const r=await db().from('service_locations').delete().eq('id',b.dataset.delete);if(r.error)setMsg(r.error.message);else load()});el('#v9Practitioner').innerHTML=staff.map(p=>`<option value="${p.id}">${esc(p.display_name)}</option>`).join('');displayModeForm();if(price){el('#v9TravelEnabled').value=String(price.enabled);el('#v9Vehicle').value=price.vehicle_name;el('#v9Consumption').value=price.km_per_liter;el('#v9Fuel').value=price.fuel_price_per_liter;el('#v9Fixed').value=price.fixed_departure_fee;el('#v9PerKm').value=price.extra_per_km;}if(theme){el('#v9Primary').value=theme.primary_color;el('#v9Secondary').value=theme.secondary_color;el('#v9Template').value=theme.background_template;}}
function displayModeForm(){const id=el('#v9Practitioner')?.value;if(!id)return;document.querySelectorAll('[data-mode]').forEach(c=>{c.checked=modes.some(m=>m.practitioner_id===id&&m.mode===c.dataset.mode&&m.enabled)})}
async function saveLocation(){if(!admin)return;const p={name:el('#v9LocName').value.trim(),address:el('#v9LocAddress').value.trim(),latitude:Number(el('#v9LocLat').value),longitude:Number(el('#v9LocLng').value),is_active:el('#v9LocActive').value==='true'};if(!p.name||!p.address||!el('#v9LocLat').value||!el('#v9LocLng').value||Math.abs(p.latitude)>90||Math.abs(p.longitude)>180)return setMsg('Completa nombre, dirección y coordenadas válidas.');const r=await db().from('service_locations').insert(p);if(r.error)setMsg(r.error.message);else{setMsg('Sede guardada.');load()}}
async function saveModes(){if(!admin)return;const id=el('#v9Practitioner').value;if(!id)return setMsg('Primero crea una profesional en Servicios.');const list=[...document.querySelectorAll('[data-mode]')].map(c=>({practitioner_id:id,mode:c.dataset.mode,enabled:c.checked}));const r=await db().from('practitioner_service_modes').upsert(list);if(r.error)setMsg(r.error.message);else{setMsg('Modalidades guardadas.');load()}}
function pricingData(){return {enabled:el('#v9TravelEnabled').value==='true',vehicle_name:el('#v9Vehicle').value.trim()||'Automóvil',km_per_liter:Number(el('#v9Consumption').value),fuel_price_per_liter:Number(el('#v9Fuel').value),fixed_departure_fee:Number(el('#v9Fixed').value),extra_per_km:Number(el('#v9PerKm').value)}}
function calc(){const p=pricingData(),km=Number(el('#v9Distance').value);if(!el('#v9Distance').value||km<0||p.km_per_liter<=0||Object.values(p).some(x=>typeof x==='number'&&(!Number.isFinite(x)||x<0)))return el('#v9CostResult').textContent='Verifica km y precios no negativos, así como rendimiento mayor que cero.';const fuel=km/p.km_per_liter*p.fuel_price_per_liter,total=p.fixed_departure_fee+fuel+km*p.extra_per_km;el('#v9CostResult').textContent=`Gasolina estimada: $${fuel.toFixed(2)} MXN · Total estimado: $${total.toFixed(2)} MXN (para ${km.toFixed(1)} km de ruta introducidos)`;}
async function saveTravel(){if(!admin)return;const p=pricingData();if(p.km_per_liter<=0||Object.values(p).some(x=>typeof x==='number'&&(!Number.isFinite(x)||x<0)))return setMsg('Revisa los datos del vehículo.');const r=await db().from('travel_pricing').upsert({id:1,...p});setMsg(r.error?r.error.message:'Cotizador guardado en Supabase.');if(!r.error)price=p}
function applyTheme(){if(!theme)return;document.body.dataset.v9Template=theme.background_template;document.querySelectorAll('.v9action:not(.secondary)').forEach(x=>x.style.background='var(--primary)')}
async function saveTheme(){
 if(!admin)return setMsg('Se requiere sesión administrativa.');
 const p={id:1,primary_color:el('#v9Primary').value,secondary_color:el('#v9Secondary').value,background_template:el('#v9Template').value};
 try{
   // El catálogo principal es la única fuente de colores globales.
   if(typeof state!=='undefined'&&state.config?.design){
     state.config.design.primary=p.primary_color;
     state.config.design.secondary=p.secondary_color;
     if(typeof saveLocal==='function')saveLocal();
     if(typeof applyDesign==='function')applyDesign();
     if(typeof syncAdminStateToCloud==='function')await syncAdminStateToCloud();
   }
   const r=await db().from('site_theme_v9').upsert(p);
   if(r.error)console.warn('Tema complementario sin sincronizar:',r.error.message);
   theme=p;applyTheme();setMsg('Diseño guardado como configuración principal.');
 }catch(error){setMsg('No se pudo sincronizar el diseño: '+error.message)}
}
let retries=0;async function initialize(){setup();if(db()){await load()}else if(retries++<25)setTimeout(initialize,800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
window.addEventListener('focus',()=>{if(db())load()});
})();

