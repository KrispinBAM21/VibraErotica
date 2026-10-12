/* Módulo: js/linked-locations.js | Función: lógica original del bloque 43 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(()=>{'use strict';
const $=q=>document.querySelector(q), escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let busy=false,epoch=0;
async function render(){
 const host=$('#adminContent');if(!host||!document.querySelector('#adminModal.show')||!(typeof activeAdmin!=='undefined'&&activeAdmin==='business'))return;
 if(busy)return;const ticket=++epoch;const db=typeof supabaseClient!=='undefined'?supabaseClient:null;if(!db)return;
 let panel=$('#vibraAssignmentPanel');if(!panel){panel=document.createElement('section');panel.id='vibraAssignmentPanel';panel.innerHTML='<h3>Asignar sedes a profesionales y habitaciones</h3><p class="small muted">Las sedes guardadas en Negocio son las únicas disponibles para asignar. No se crean sedes duplicadas.</p><div data-assign-list></div><p class="vab-status" data-assign-status aria-live="polite"></p><button type="button" data-assign-refresh>Actualizar sedes</button>';host.prepend(panel);panel.querySelector('[data-assign-refresh]').onclick=()=>render();}
 const [a,b,c]=await Promise.all([db.from('service_locations').select('id,name,address,is_active').order('name'),db.from('practitioners').select('id,display_name,service_location_id').order('display_name'),db.from('rooms').select('id,name,service_location_id').order('name')]);
 if(ticket!==epoch||!panel.isConnected)return;
 const status=panel.querySelector('[data-assign-status]');const err=[a,b,c].find(x=>x.error);
 if(err){status.textContent='No se pudo leer las sedes o asignaciones: '+err.error.message;return;}
 const sites=(a.data||[]).filter(x=>x.is_active!==false);
 if(!sites.length){panel.querySelector('[data-assign-list]').innerHTML='<p>No hay sedes activas. Guarda primero un domicilio desde Negocio → Sedes autorizadas.</p>';return;}
 const opt=[{id:'',name:'Sin asignar'},...sites];const row=(table,obj)=>`<div class="vab-row" data-vab="${table}" data-id="${escapeHTML(obj.id)}"><strong>${escapeHTML(obj.display_name||obj.name)}</strong><select aria-label="Sede asignada">${opt.map(x=>`<option value="${escapeHTML(x.id)}" ${String(obj.service_location_id||'')===String(x.id)?'selected':''}>${escapeHTML(x.name)}</option>`).join('')}</select><button type="button">Guardar sede</button></div>`;
 panel.querySelector('[data-assign-list]').innerHTML='<h4>Profesionales</h4>'+(b.data||[]).map(x=>row('practitioners',x)).join('')+'<h4>Habitaciones</h4>'+(c.data||[]).map(x=>row('rooms',x)).join('');
 panel.querySelectorAll('[data-vab] button').forEach(button=>{button.onclick=async()=>{if(busy)return;const line=button.closest('[data-vab]'),id=line.dataset.id,table=line.dataset.vab;busy=true;button.disabled=true;const original=button.textContent;button.textContent='Guardando…';try{const loc=line.querySelector('select').value||null;const {error}=await db.from(table).update({service_location_id:loc}).eq('id',id);if(error)throw error;status.textContent='Asignación guardada en Supabase.';}catch(e){status.textContent='No se guardó: '+e.message;}finally{busy=false;button.disabled=false;button.textContent=original;}}});
 }
 const observer=new MutationObserver(()=>{if($('#adminModal.show')&&typeof activeAdmin!=='undefined'&&activeAdmin==='business'&&!$('#vibraAssignmentPanel'))render();});
 const start=()=>{const host=$('#adminContent');if(host)observer.observe(host,{childList:true});document.addEventListener('click',e=>{if(e.target.closest('#adminTabs'))setTimeout(render,250)});setTimeout(render,1200)};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
