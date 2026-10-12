/* Módulo: js/admin-ux.js | Función: lógica original del bloque 33 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(()=>{
'use strict';
const showCreate=()=>{const editor=document.getElementById('vibraServicesEditor');const pane=document.getElementById('adminContent');if(!editor||!pane)return; if(editor.parentElement!==pane)pane.insertBefore(editor,pane.firstChild);editor.hidden=false;const form=document.getElementById('vibraServiceForm');if(form)form.hidden=false;editor.scrollIntoView({behavior:'smooth',block:'start'});};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!document.getElementById('adminModal')?.classList.contains('show'))return;if(b.id==='vibraNewService'||b.id==='vibraCreateServiceTop'||b.textContent.trim()==='Nuevo servicio'){e.preventDefault();e.stopImmediatePropagation();showCreate();}},true);
// Restore the admin editor when a products redraw removes it. Reuse the same node, never clone controls.
let editor;const admin=document.getElementById('adminContent');const observer=new MutationObserver(()=>{const active=typeof activeAdmin!=='undefined'&&activeAdmin==='products';if(!active)return;editor=editor||document.getElementById('vibraServicesEditor');if(editor&&editor.parentElement!==admin)admin.appendChild(editor);});if(admin)observer.observe(admin,{childList:true});
})();
