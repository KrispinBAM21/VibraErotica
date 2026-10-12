/* Módulo: js/admin-role-fix.js | Función: lógica original del bloque 24 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
  'use strict';
  let verifiedUserId=null;
  let verifying=null;
  syncAdminVisibility=function(){
    const btn=document.getElementById('adminBtn');
    if(!btn)return;
    const allowed=!!verifiedUserId&&adminSession?.user?.id===verifiedUserId&&
      customerSession?.user?.id===verifiedUserId&&panelAccess?.owner===true;
    btn.hidden=!allowed;
    btn.style.display=allowed?'':'none';
    btn.dataset.authorized=allowed?'true':'false';
    btn.setAttribute('aria-hidden',String(!allowed));
    btn.tabIndex=allowed?0:-1;
  };
  panelVerify=async function(){
    if(verifying)return verifying;
    verifying=(async()=>{
      verifiedUserId=null;
      panelAccess={owner:false,master:false,modules:[]};
      syncAdminVisibility();
      if(!supabaseClient)return false;
      const {data:auth,error:authError}=await supabaseClient.auth.getUser();
      const user=auth?.user;
      if(authError||!user){adminSession=null;return false;}
      const {data:sesh}=await supabaseClient.auth.getSession();
      if(!sesh?.session||sesh.session.user?.id!==user.id)return false;
      customerSession=sesh.session;
      adminSession=sesh.session;
      // La fila solo puede leerse con RLS para el propio usuario.
      const {data:role,error:roleError}=await supabaseClient
        .from('staff_roles').select('role').eq('user_id',user.id).maybeSingle();
      if(roleError){console.warn('No se pudo consultar staff_roles:',roleError.message);return false;}
      if(role?.role!=='admin')return false;
      // No se concede acceso basándose en caché local o metadatos editables.
      verifiedUserId=user.id;
      panelAccess={owner:true,master:false,modules:adminTabs.map(([id])=>id)};
      syncAdminVisibility();
      return true;
    })();
    try{return await verifying}finally{verifying=null;syncAdminVisibility()}
  };
  const button=document.getElementById('adminBtn');
  if(button){
    button.onclick=async()=>{
      if(!await panelVerify()){
        toast('No fue posible verificar el permiso de administrador en Supabase.','error');
        return;
      }
      renderAdmin();openModal('adminModal');
    };
  }
  let attempts=0;
  const bootstrap=async()=>{
    if(!supabaseClient&&attempts++<8){setTimeout(bootstrap,900);return}
    if(supabaseClient)await panelVerify();
  };
  setTimeout(bootstrap,400);
  window.addEventListener('pageshow',()=>{if(supabaseClient)panelVerify()});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&supabaseClient)panelVerify()});
})();
