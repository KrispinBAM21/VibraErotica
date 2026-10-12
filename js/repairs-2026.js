/* Módulo: js/repairs-2026.js | Función: lógica original del bloque 29 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(()=>{
  const q=s=>document.querySelector(s);
  const insertSedes=()=>{
    const parent=q('#adminContent');const site=q('#v9Admin');
    if(!parent||!site||!q('#adminModal.show'))return;
    const active=typeof activeAdmin!=='undefined'?activeAdmin:'';
    if(active!=='business'){const here=q('#vibraSedesAdmin');if(here)here.remove();return;}
    let wrapper=q('#vibraSedesAdmin');
    if(!wrapper){wrapper=document.createElement('section');wrapper.id='vibraSedesAdmin';wrapper.className='section-card';wrapper.innerHTML='<h3>Sedes oficiales y modalidades</h3>';parent.append(wrapper)}
    if(site.parentNode!==wrapper){wrapper.append(site);site.classList.add('visible');}
  };
  const rename=()=>{
    document.querySelectorAll('#adminTabs button').forEach(b=>{
      const t=b.dataset.tab;
      if(t==='products')b.querySelector('span')?.replaceChildren(document.createTextNode('Productos y servicios'));
      if(t==='delivery')b.querySelector('span')?.replaceChildren(document.createTextNode('Reservas a domicilio'));
    });
  };
  let scheduled=false;
  const observer=new MutationObserver(()=>{
    if(scheduled)return;scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;rename();insertSedes();});
  });
  document.addEventListener('DOMContentLoaded',()=>{observer.observe(document.body,{subtree:true,childList:true});rename();insertSedes();});
})();
