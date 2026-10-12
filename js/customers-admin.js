/* Módulo: js/customers-admin.js | Función: lógica original del bloque 36 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
 try{
 panelCustomers=async function(host,epoch){
   if(!host)return;host.innerHTML='<section class="section-card"><h3>Clientes y bloqueos</h3><p id="vibraCustomersMessage">Consultando cuentas…</p><div id="vibraCustomersList"></div></section>';
   let rows;try{rows=await customerRpc('admin_list')}catch(e){document.getElementById('vibraCustomersMessage').textContent='No se pudieron cargar las cuentas: '+(e.message||e);return}
   if(typeof panelEpoch!=='undefined'&&epoch!==panelEpoch)return;
   const notice=document.getElementById('vibraCustomersMessage');notice.textContent=rows.length+' cuenta(s) encontrada(s).';
   const list=document.getElementById('vibraCustomersList');
   const search=document.createElement('input');search.className='input';search.placeholder='Buscar cliente por nombre o correo';notice.after(search);
   const render=()=>{const q=search.value.toLowerCase();list.replaceChildren();
     for(const r of rows.filter(x=>[x.full_name,x.email,x.phone].join(' ').toLowerCase().includes(q))){
       const article=document.createElement('article');article.className='saved-address';
       const info=document.createElement('div');const title=document.createElement('strong');title.textContent=r.full_name||r.email||'Cliente';
       const detail=document.createElement('p');detail.className='small';detail.textContent=[r.email,r.phone].filter(Boolean).join(' · ');
       info.append(title,detail);const blocked=r.blocked_until&&new Date(r.blocked_until)>new Date();
       const btn=document.createElement('button');btn.className='btn secondary';btn.type='button';btn.textContent=blocked?'Desbloquear':'Bloquear';
       btn.onclick=async()=>{const reason=blocked?'':prompt('Motivo del bloqueo');if(reason===null)return;btn.disabled=true;try{await customerRpc('account_block',{user_id:r.user_id,blocked:!blocked,reason,minutes:43200});await panelCustomers(host,epoch)}catch(e){alert('No se pudo actualizar el estado: '+(e.message||e));btn.disabled=false}};
       article.append(info,btn);list.append(article);
     }
   };search.oninput=render;render();
   };
 }catch(e){console.warn('Clientes',e)}
})();
