/* Módulo: js/catalog-integration.js | Función: lógica original del bloque 31 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(()=>{
'use strict';
const $=s=>document.querySelector(s);
const escText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lastServices='';
function updateServices(){
  const grid=$('#catalogGrid'),source=$('#v9Professionals');if(!grid||!source)return;
  let wrap=$('#vibraServiceCatalog');if(!wrap){wrap=document.createElement('section');wrap.id='vibraServiceCatalog';wrap.className='vibra-services-inline';grid.append(wrap);lastServices='';}
  if(wrap.parentElement!==grid)grid.append(wrap);
  const cards=[...source.querySelectorAll('article[data-p],article.v9site')];
  const category=typeof currentCategory==='string'?currentCategory:'Todos';
  const term=($('#searchInput')?.value||'').trim().toLowerCase();
  const show=category==='Todos'||/masaje|masajista|servicio|bienestar|profesional/i.test(category);
  const html=show?cards.filter(c=>c.textContent.toLowerCase().includes(term)).map(c=>{
    const action=c.querySelector('button[data-p]'),id=action?.dataset.p||'';
    const img=c.querySelector('img'),title=c.querySelector('h3')?.textContent||'Servicio',desc=c.querySelector('.v9staff p')?.textContent||'';
    const ps=[...c.querySelectorAll('p')].map(x=>x.textContent).filter(Boolean);
    return `<article class="vibra-service-card"><div>${img?`<img class="vibra-service-photo" src="${escText(img.getAttribute('src'))}" alt="${escText(title)}">`:`<div class="vibra-service-photo" style="display:grid;place-items:center;color:var(--primary)">${typeof UI!=='undefined'?UI.business:''}</div>`}</div><div class="vibra-service-content"><h3>${escText(title)}</h3><p>${escText(desc)}</p>${ps.slice(1,3).map(x=>`<p>${escText(x)}</p>`).join('')}</div><button class="btn" data-vibra-book="${escText(id)}">Reservar</button></article>`;
  }).join(''):'';
  if(html!==lastServices||(html&&!wrap.childElementCount)){wrap.innerHTML=html;lastServices=html;}
  wrap.hidden=!html;
  if(html){grid.querySelectorAll(':scope > .section-card').forEach(n=>{if(n.textContent.includes('No hay productos para mostrar'))n.style.display='none'});}
  wrap.querySelectorAll('[data-vibra-book]').forEach(b=>b.onclick=()=>{
    const real=[...source.querySelectorAll('button[data-p]')].find(x=>x.dataset.p===b.dataset.vibraBook);
    if(real){real.click();$('#v9Modalities')?.scrollIntoView({behavior:'smooth',block:'center'});}
  });
}
const observer=new MutationObserver(changes=>{if(changes.some(x=>x.target.id==='v9Professionals'||x.target.closest?.('#v9Professionals'))){updateServices()}});
function init(){const src=$('#v9Professionals');if(src)observer.observe(src,{childList:true,subtree:true});updateServices();}
const orig=typeof renderCatalog==='function'?renderCatalog:null;
if(orig){renderCatalog=function(){const out=orig.apply(this,arguments);queueMicrotask(updateServices);return out};}
const demo=[['Lencería elegante','Lencería'],['Aceite para masaje','Bienestar'],['Masaje relajante (ejemplo)','Servicios'],['Accesorio para parejas','Accesorios']];
function adminButtons(){const host=$('#adminContent');if(!host||typeof activeAdmin==='undefined'||activeAdmin!=='products')return;
  const toolbar=host.querySelector('.toolbar');if(!toolbar||host.querySelector('#vibraNewService'))return;
  const create=document.createElement('button');create.type='button';create.id='vibraNewService';create.className='btn secondary';create.textContent='Nuevo servicio';create.onclick=()=>{
    const section=$('#vibraServicesEditor');if(section){const pane=$('#adminContent');if(section.parentElement!==pane)pane.append(section);section.hidden=false;const form=$('#vibraServiceForm');if(form)form.hidden=false;section.scrollIntoView({behavior:'smooth',block:'start'});}else alert('Espera a que se cargue el editor de servicios y vuelve a intentarlo.');
  };toolbar.append(create);
  const preview=document.createElement('button');preview.type='button';preview.className='btn ghost';preview.textContent='Vista previa del catálogo';preview.onclick=()=>{
    let panel=host.querySelector('#vibraPreview');if(panel){panel.remove();return;}
    panel=document.createElement('section');panel.id='vibraPreview';panel.className='section-card';panel.innerHTML='<h3>Vista previa (datos de muestra, no publicados)</h3><div class="grid" style="padding:8px 0">'+demo.map(([name,cat])=>`<article class="vibra-demo-card"><strong>${escText(name)}</strong><small>${escText(cat)}</small></article>`).join('')+'</div>';
    toolbar.after(panel);
  };toolbar.append(preview);
}
const catalogObserver=new MutationObserver(mutations=>{
 if(mutations.some(m=>m.target.id==='catalogGrid' && !document.getElementById('vibraServiceCatalog'))){
  queueMicrotask(updateServices);
 }
});
const catalogHost=document.getElementById('catalogGrid');
if(catalogHost)catalogObserver.observe(catalogHost,{childList:true});
const adminObserver=new MutationObserver(()=>adminButtons());
function start(){init();let tries=0;const wait=setInterval(()=>{if($('#v9Professionals')){clearInterval(wait);init()}else if(++tries>40)clearInterval(wait)},500);const host=$('#adminContent');if(host)adminObserver.observe(host,{childList:true});adminButtons();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
