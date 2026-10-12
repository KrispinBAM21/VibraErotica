/* Módulo: js/ui-v19.js | Función: lógica original del bloque 22 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
'use strict';
// The logo is the one public entry point to the complete business showcase.
const logo=document.getElementById('brandLogo');
if(logo){
  logo.classList.add('v19-logo-action');
  logo.setAttribute('role','button');
  logo.setAttribute('tabindex','0');
  logo.setAttribute('aria-label','Ver perfil, horarios, seguidores y opiniones del negocio');
  logo.setAttribute('title','Conocer el negocio');
  function openFromLogo(){
    if(typeof window.v18OpenBusiness==='function')window.v18OpenBusiness();
    else toast('El perfil del negocio aún no está disponible.','info');
  }
  logo.addEventListener('click',openFromLogo);
  logo.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openFromLogo()}});
}
// Only show the admin gear after the server confirms the current user's access.
// A previously cached role is never enough to expose the control.
let confirmedAdminUser=null;
const originalAdminVisibility=syncAdminVisibility;
syncAdminVisibility=function(){
  const btn=document.getElementById('adminBtn');
  if(!btn)return;
  const userId=adminSession?.user?.id;
  const permitted=!!userId&&!!customerSession&&customerSession.user?.id===userId&&
    confirmedAdminUser===userId&&!!(panelAccess?.master||panelAccess?.owner||panelAccess?.modules?.length);
  btn.dataset.authorized=permitted?'true':'false';
  btn.hidden=!permitted;
  btn.style.display=permitted?'':'none';
  btn.setAttribute('aria-hidden',String(!permitted));
  btn.tabIndex=permitted?0:-1;
};
const originalPanelVerify=panelVerify;
panelVerify=async function(){
  const session=adminSession;
  confirmedAdminUser=null;
  if(!supabaseClient||!session?.user?.id){syncAdminVisibility();return false}
  const uid=session.user.id;
  const auth=await supabaseClient.auth.getUser();
  if(auth.error||auth.data?.user?.id!==uid||adminSession?.user?.id!==uid){
    panelAccess={owner:false,master:false,modules:[]};syncAdminVisibility();return false;
  }
  let access=null;
  try{
    const result=await supabaseClient.rpc('catalog_panel',{p_action:'access',p_payload:{}});
    if(result.error)throw result.error;
    if(result.data?.error)throw Error(String(result.data.error));
    if(result.data&&typeof result.data==='object'&&!Array.isArray(result.data))access=result.data;
  }catch(err){console.warn('catalog_panel: ',err?.message||err)}
  if(adminSession?.user?.id!==uid)return false;
  const granted=!!(access?.master||access?.owner||(Array.isArray(access?.modules)&&access.modules.length));
  if(granted){panelAccess={owner:false,master:false,modules:[],...access};confirmedAdminUser=uid;syncAdminVisibility();return true}
  for(const fn of ['is_catalog_admin','vibra_admin_check']){
    try{
      const r=await supabaseClient.rpc(fn);
      if(r.error)continue;
      const d=r.data;
      const ok=d===true||d==='true'||(d&&typeof d==='object'&&!Array.isArray(d)&&(d.is_admin===true||d.isAdmin===true||d.admin===true||d.owner===true||d.authorized===true||d.allowed===true));
      if(ok&&adminSession?.user?.id===uid){
        panelAccess={owner:true,master:false,modules:[]};
        confirmedAdminUser=uid;syncAdminVisibility();return true;
      }
    }catch(err){console.warn('Verificación '+fn+':',err?.message||err)}
  }
  panelAccess={owner:false,master:false,modules:[]};
  syncAdminVisibility();return false;
};

})();
