/* Módulo: js/catalog-cart.js | Función: lógica original del bloque 35 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

(function(){
'use strict';
function enhance(){
  const grid=document.getElementById('catalogGrid');if(!grid)return;
  grid.querySelectorAll('.product-card').forEach(card=>{
    const image=card.querySelector('[data-view-product]');
    const id=image?.dataset.viewProduct;
    if(!id)return;
    const p=typeof state!=='undefined'?state.products.find(x=>String(x.id)===String(id)):null;
    if(!p)return;
    const qty=card.querySelector('.qty-row');if(!qty)return;
    const main=[...qty.querySelectorAll('button')].find(b=>b.classList.contains('btn'));
    if(!main)return;
    main.removeAttribute('data-view-product');
    main.setAttribute('data-inc',id);
    main.removeAttribute('onclick');main.onclick=null;
    main.disabled=Number(p.stock)<=0 || Number(state.cart[id]||0)>=Number(p.stock);
    const desired=(main.disabled?'Agotado':'Añadir al carrito');
    if(main.dataset.vibraCartLabel!==desired){main.innerHTML=(typeof UI!=='undefined'?UI.cart:'')+'<span>'+desired+'</span>';main.dataset.vibraCartLabel=desired;}
    main.setAttribute('aria-label','Añadir '+p.name+' al carrito');
    const qc=qty.querySelector('.qty-control');if(qc&&qc.getAttribute('aria-hidden')!=='true')qc.setAttribute('aria-hidden','true');
    const meta=card.querySelector('.meta');
    if(meta){const stock=[...meta.querySelectorAll('span')].find(e=>e.textContent.trim().startsWith('Stock:')||e.textContent.trim().startsWith('Disponibles:'));
      if(stock){const count='Disponibles: '+Math.max(0,Number(p.stock)||0);if(stock.textContent!==count)stock.textContent=count;stock.dataset.vibraStock='1'}
      if(p.deliveryAvailable===false && !meta.querySelector('[data-vibra-pickup]')){
        const el=document.createElement('span');el.dataset.vibraPickup='1';el.textContent='Solo recogida en local';meta.append(el);
      }
    }
  });
}
let queued=false;
const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
document.addEventListener('DOMContentLoaded',()=>{
 const grid=document.getElementById('catalogGrid');if(!grid)return;
 new MutationObserver(schedule).observe(grid,{childList:true,subtree:true});enhance();
});
})();
