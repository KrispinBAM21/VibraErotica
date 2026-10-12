/* Módulo: js/runtime-final.js | Función: lógica original del bloque 39 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(()=>{
'use strict';
const icon={instagram:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>',facebook:'<svg viewBox="0 0 24 24"><path d="M14 21v-9h3l.6-4H14V6c0-1.2.4-2 2-2h2V1.5A19 19 0 0 0 15 1c-3 0-5 2-5 5v2H7v4h3v9"/></svg>',tiktok:'<svg viewBox="0 0 24 24"><path d="M14 2v12a5 5 0 1 1-5-5v4a1 1 0 1 0 1 1V2zm0 0c.8 3.3 3 5 6 5v4c-2.6 0-4.5-1-6-2.5"/></svg>'};
let lastProfile='';
function enrich(){const modal=document.getElementById('vsmGallery');if(!modal||!modal.classList.contains('open'))return;const head=modal.querySelector('#vsmViewerName'),name=head?.textContent||'';const sidebar=modal.querySelector('.vsm-viewer-sidebar');if(!sidebar)return;
const social=modal.querySelector('#vsmProfileSocial');social?.querySelectorAll('a').forEach(a=>{const kind=Object.keys(icon).find(k=>a.href.toLowerCase().includes(k));if(kind&&!a.querySelector('svg'))a.insertAdjacentHTML('afterbegin',icon[kind]);});
const status=[...modal.querySelectorAll('#vsmProfileInfo p')].find(p=>p.textContent.startsWith('Estado:'));if(status){status.dataset.vibraUnavailable=/No disponible/i.test(status.textContent)?'true':'false';}
let booking=sidebar.querySelector('.vibra-book-service');if(!booking){booking=document.createElement('button');booking.type='button';booking.className='vibra-book-service';booking.innerHTML='<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18M8 16l2 2 5-5"/></svg> Reservar y consultar horarios';const note=document.createElement('p');note.className='vibra-availability-note';note.textContent='Los horarios se consultan al reservar; las horas ocupadas no deben presentarse como libres sin confirmación del servidor.';sidebar.insertBefore(note,sidebar.querySelector('.vsm-viewer-interact'));sidebar.insertBefore(booking,note);}
booking.disabled=status?.dataset.vibraUnavailable==='true';booking.onclick=()=>{const cards=[...document.querySelectorAll('#vibraServiceCatalog .vibra-service-card')];const card=cards.find(c=>c.querySelector('.vibra-service-content')?.textContent.includes(name));const btn=card?.querySelector('[data-vibra-book]');if(!btn){alert('No se encontró el formulario de reservación de este servicio.');return;}modal.querySelector('.vsm-close')?.click();btn.click();};
lastProfile=name;
}
const observer=new MutationObserver(()=>{if(document.getElementById('vsmGallery')?.classList.contains('open'))requestAnimationFrame(enrich)});
const start=()=>{observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});enrich();};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
// Repair a blank public Leaflet container without replacing a functioning CARTO map.
let tested=false;
function restore(){if(tested||typeof L==='undefined')return;const host=document.getElementById('foodPublicMap');if(!host||host.offsetHeight<50)return;const map=typeof publicFoodMap!=='undefined'?publicFoodMap:null;if(!map){try{if(typeof initFoodPublicMap==='function')initFoodPublicMap()}catch(e){console.warn('Inicialización del mapa:',e)}return;}
const tileCount=Object.values(map._layers||{}).filter(l=>l instanceof L.TileLayer).length;
if(tileCount===0){try{if(typeof addConfiguredTileLayer==='function')addConfiguredTileLayer(map,host.id)}catch(e){console.warn('Teselas CARTO:',e)}}
map.invalidateSize(); tested=tileCount>0;
}
window.addEventListener('load',()=>setTimeout(restore,1000),{once:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden){tested=false;restore()}});
setTimeout(restore,2800);
})();
