/* Módulo: js/auth-v22.js | Función: lógica original del bloque 23 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

/* Reflejar inmediatamente el acceso sin esperar consultas de perfil ni permisos. */
(function(){
'use strict';
let reconciling=false;
function showAuthenticated(session){
  const id=session?.user?.id;
  if(!id)return;
  // Si cambió el usuario, el flujo normal debe limpiar primero sus datos privados.
  if(customerSession?.user?.id&&customerSession.user.id!==id)return;
  customerSession=session;
  adminSession=session;
  customerAuthView='login';
  renderAccountButton();
  renderTrackingButtons();
  const modal=document.getElementById('customerProfileModal');
  if(modal?.classList.contains('show'))renderCustomerProfile();
  // Nunca conceder permisos: panelVerify debe confirmarlos con el servidor.
}
window.v22AuthSync=showAuthenticated;
async function reconcileSession(){
  if(!supabaseClient||reconciling)return;
  reconciling=true;
  try{
    const {data,error}=await supabaseClient.auth.getSession();
    if(error)throw error;
    const session=data?.session;
    if(!session?.user?.id)return;
    if(customerSession?.user?.id!==session.user.id)await customerAuthChanged(session);
    showAuthenticated(session);
    if(sessionStorage.getItem('VibraErotica.oauthPending')){
      sessionStorage.removeItem('VibraErotica.oauthPending');
      const feedback=document.getElementById('foodAuthStatus');
      if(feedback)feedback.textContent='';
    }
  }catch(error){console.warn('No se pudo sincronizar la sesión:',error.message)}
  finally{reconciling=false}
}
window.addEventListener('pageshow',()=>{setTimeout(reconcileSession,0)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)reconcileSession()});
setTimeout(reconcileSession,250);
setTimeout(reconcileSession,1500);
})();
