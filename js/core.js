/* Módulo: js/core.js | Función: lógica original del bloque 4 | Depende de: scripts anteriores en orden de carga | Expone: declaraciones y efectos globales originales, cuando corresponda. */

'use strict';

/* ==============================
   SVG ICONS
============================== */
const UI = {
  cart:`<svg viewBox="0 0 24 24"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 7H6.2"/><circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>`,
  search:`<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>`,
  close:`<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  plus:`<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,
  minus:`<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>`,
  trash:`<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>`,
  edit:`<svg viewBox="0 0 24 24"><path d="M4 20h4l11-11-4-4L4 16v4zM13.5 6.5l4 4"/></svg>`,
  copy:`<svg viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>`,
  check:`<svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10"/></svg>`,
  settings:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-4v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`,
  lock:`<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`,
  map:`<svg viewBox="0 0 24 24"><path d="M4 5l5-2 6 2 5-2v16l-5 2-6-2-5 2zM9 3v16M15 5v16"/></svg>`,
  pin:`<svg viewBox="0 0 24 24"><path d="M12 21s7-5.8 7-12a7 7 0 1 0-14 0c0 6.2 7 12 7 12z"/><circle cx="12" cy="9" r="2.3"/></svg>`,
  bike:`<svg viewBox="0 0 24 24"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-7h4l4 7M9 10l-2-3h3M12 17l-3-7M13 7h3"/></svg>`,
  moto:`<svg viewBox="0 0 24 24"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M8.5 17h5l2-5h3M9 11h5l2 2M11 8h3"/></svg>`,
  car:`<svg viewBox="0 0 24 24"><path d="M4 16v-5l2-4h12l2 4v5M6 16h12M7 11h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
  truck:`<svg viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>`,
  fuel:`<svg viewBox="0 0 24 24"><path d="M5 21V4h10v17M4 21h12M7 7h6v5H7zM15 8h2l2 2v7a2 2 0 0 0 4 0v-6l-2-2"/></svg>`,
  calc:`<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/></svg>`,
  orders:`<svg viewBox="0 0 24 24"><path d="M7 4h10v3H7zM5 7h14v14H5zM8 11h8M8 15h8"/></svg>`,
  download:`<svg viewBox="0 0 24 24"><path d="M12 4v11M8 11l4 4 4-4M5 20h14"/></svg>`,
  attach:`<svg viewBox="0 0 24 24"><path d="M8 12l6-6a4 4 0 0 1 6 6l-8 8a6 6 0 0 1-8-8l8-8"/></svg>`,
  arrowLeft:`<svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>`,
  arrowRight:`<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  pending:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>`,
  paid:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="m8 12 2.5 2.5L16 9"/></svg>`,
  delivered:`<svg viewBox="0 0 24 24"><path d="M4 6h10v10H4zM14 9h4l2 3v4h-6z"/><circle cx="8" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`,
  whatsapp:`<svg viewBox="0 0 24 24" fill="none"><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6z" stroke="currentColor" stroke-width="1.9"/><path d="M9.2 8.2c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .6.5l.8 1.9c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4-.1.6.4.8 1.1 1.5 1.9 2 .2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.5.3.5.5 0 .5-.2 1.5-.8 2-.6.6-1.4.8-2.3.6-1.1-.2-2.6-.8-4.2-2.2-1.3-1.2-2.3-2.6-2.6-3.7-.3-.9-.1-2 .5-2.6z" fill="currentColor" stroke="none"/></svg>`,
  products:`<svg viewBox="0 0 24 24"><path d="M4 6h16v14H4zM8 6V4h8v2M8 10h8"/></svg>`,
  palette:`<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h4a5 5 0 0 0 5-5c0-3-3.5-5-9-5z"/><circle cx="7.5" cy="9" r="1"/><circle cx="10" cy="6.5" r="1"/><circle cx="15" cy="6.5" r="1"/></svg>`,
  business:`<svg viewBox="0 0 24 24"><path d="M4 21V8l8-5 8 5v13M8 21v-7h8v7M7 9h2M15 9h2"/></svg>`,
  upload:`<svg viewBox="0 0 24 24"><path d="M12 20V9M8 13l4-4 4 4M5 4h14"/></svg>`,
  file:`<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6zM14 3v5h5"/></svg>`,
  save:`<svg viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5zM8 4v6h8V4M8 16h8"/></svg>`,
  refresh:`<svg viewBox="0 0 24 24"><path d="M20 7v5h-5M4 17v-5h5M18 10a7 7 0 0 0-12-2M6 14a7 7 0 0 0 12 2"/></svg>`,
  moon:`<svg viewBox="0 0 24 24"><path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5z"/></svg>`,
  sun:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  database:`<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>`,
  dashboard:`<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z"/></svg>`,
  receipt:`<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h4"/></svg>`,
  review:`<svg viewBox="0 0 24 24"><path d="M5 4h10l4 4v12H5zM15 4v5h5M8 13l2 2 5-5"/></svg>`,
  audit:`<svg viewBox="0 0 24 24"><path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h4"/></svg>`,
  telegram:`<svg viewBox="0 0 24 24"><path d="M21 4 3 11l7 2 2 7 9-16zM10 13l5-4"/></svg>`,
  shield:`<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>`


};

const FOOD = {
 plate:`<svg viewBox="0 0 64 64"><circle cx="30" cy="34" r="16"/><circle cx="30" cy="34" r="9"/><path d="M51 12v40M47 12v13M55 12v13M47 25h8"/></svg>`,
 burger:`<svg viewBox="0 0 64 64"><path d="M14 28c1-10 8-15 18-15s17 5 18 15H14zM12 31h40M15 37h34M14 42h36l-3 8H17z"/></svg>`,
 pizza:`<svg viewBox="0 0 64 64"><path d="M15 17c12-5 25-5 37 0L31 52zM18 22h30"/><circle cx="30" cy="29" r="3"/><circle cx="37" cy="38" r="3"/></svg>`,
 taco:`<svg viewBox="0 0 64 64"><path d="M11 39c5-15 14-23 27-25 8 8 12 19 13 32H16c-3 0-5-3-5-7z"/><path d="M18 36c8-5 16-7 26-6"/></svg>`,
 burrito:`<svg viewBox="0 0 64 64"><path d="M20 12h24l8 15-17 25H19L11 37zM20 12l15 40M44 12 19 52"/></svg>`,
 hotdog:`<svg viewBox="0 0 64 64"><path d="M13 40c0-9 7-16 16-16h16c5 0 9 4 9 9s-4 9-9 9H20c-4 0-7 3-7 7"/><path d="M19 35c9-8 18-8 28 0"/></svg>`,
 fries:`<svg viewBox="0 0 64 64"><path d="M18 23l2-14M27 23V8M36 23l2-15M45 23l3-13M16 22h34l-5 30H21z"/></svg>`,
 chicken:`<svg viewBox="0 0 64 64"><path d="M22 19c6-6 16-6 22 0s6 16 0 22-16 6-22 0-6-16 0-22zM20 40l-8 8M12 48l-3 5M12 48l5 3"/></svg>`,
 salad:`<svg viewBox="0 0 64 64"><path d="M14 30h36c0 13-7 22-18 22S14 43 14 30zM20 26c0-7 6-12 12-12 1 7-3 12-12 12zM33 25c0-6 5-10 11-10 1 6-3 10-11 10z"/></svg>`,
 soup:`<svg viewBox="0 0 64 64"><path d="M12 31h40c-2 12-9 20-20 20S14 43 12 31zM18 56h28M23 24c-4-4 2-7 0-11M34 24c-4-4 2-7 0-11M45 24c-4-4 2-7 0-11"/></svg>`,
 sushi:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="18" rx="18" ry="8"/><path d="M14 18v25c0 5 8 9 18 9s18-4 18-9V18"/><ellipse cx="32" cy="18" rx="8" ry="3"/></svg>`,
 pasta:`<svg viewBox="0 0 64 64"><path d="M14 31h36c0 12-7 20-18 20S14 43 14 31zM20 27c5-10 19-10 24 0M24 27c3-7 13-7 16 0"/></svg>`,
 sandwich:`<svg viewBox="0 0 64 64"><path d="M12 25l20-14 20 14-20 14zM14 34l18 13 18-13M15 39l17 13 17-13"/></svg>`,
 torta:`<svg viewBox="0 0 64 64"><path d="M13 28c2-9 9-14 19-14s17 5 19 14H13zM12 31h40M15 38h34M14 42h36l-3 8H17z"/></svg>`,
 quesadilla:`<svg viewBox="0 0 64 64"><path d="M12 42c5-16 15-25 31-28 6 6 9 14 9 25H16c-2 0-3 1-4 3z"/><path d="M20 35h23"/></svg>`,
 eggs:`<svg viewBox="0 0 64 64"><path d="M15 35c0-10 8-18 17-18s17 8 17 18-8 17-17 17-17-7-17-17z"/><circle cx="32" cy="35" r="7"/></svg>`,
 coffee:`<svg viewBox="0 0 64 64"><path d="M14 20h32v21c0 7-6 12-14 12h-4c-8 0-14-5-14-12V20zM46 25h4c5 0 8 3 8 8s-3 8-8 8h-4M22 14c-3-3 2-5 0-8M33 14c-3-3 2-5 0-8"/></svg>`,
 soda:`<svg viewBox="0 0 64 64"><path d="M21 15h22l-3 38H24zM18 15h28M26 9h13M39 9l4-5"/></svg>`,
 juice:`<svg viewBox="0 0 64 64"><path d="M20 18h24l-3 35H23zM17 18h30M34 18l6-12M40 6h8"/><circle cx="33" cy="34" r="7"/></svg>`,
 water:`<svg viewBox="0 0 64 64"><path d="M25 11h14l-2 8 5 8v23c0 4-3 6-6 6h-8c-3 0-6-2-6-6V27l5-8zM24 31h16"/></svg>`,
 beer:`<svg viewBox="0 0 64 64"><path d="M17 17h27v35H17zM44 24h5c6 0 9 4 9 10s-3 10-9 10h-5M17 22h27"/></svg>`,
 icecream:`<svg viewBox="0 0 64 64"><circle cx="32" cy="20" r="12"/><path d="M21 30h22L32 56z"/></svg>`,
 cake:`<svg viewBox="0 0 64 64"><path d="M13 31h38v21H13zM16 31c3-8 9-12 16-12s13 4 16 12M22 19v-6M32 19v-6M42 19v-6"/></svg>`,
 cookie:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20"/><circle cx="24" cy="25" r="2"/><circle cx="38" cy="20" r="2"/><circle cx="42" cy="36" r="2"/><circle cx="26" cy="42" r="2"/><circle cx="34" cy="31" r="2"/></svg>`,
 donut:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="7"/><path d="M15 27c8 5 26 5 34 0"/></svg>`,
 fruit:`<svg viewBox="0 0 64 64"><path d="M31 18c-3-8 0-12 7-15M35 12c8-3 13 0 15 6-7 3-12 2-15-6z"/><circle cx="31" cy="36" r="17"/></svg>`,
 ramen:`<svg viewBox="0 0 64 64"><path d="M12 31h40c-2 13-9 21-20 21S14 44 12 31zM18 27h28M20 22c5-6 10 5 15-1s10 5 15-1M42 9l-8 18M51 11l-9 16"/></svg>`,
 steak:`<svg viewBox="0 0 64 64"><path d="M17 19c8-8 24-9 32 0 7 8 2 22-8 29-9 7-24 5-29-5-4-9-1-18 5-24z"/><path d="M25 25c5-4 13-4 17 1 4 5 1 12-4 15-6 4-14 2-16-4-2-5 0-9 3-12z"/></svg>`,
 fish:`<svg viewBox="0 0 64 64"><path d="M12 32c10-13 24-16 36-7l8-8v30l-8-8c-12 9-26 6-36-7z"/><circle cx="39" cy="29" r="2"/></svg>`,
 shrimp:`<svg viewBox="0 0 64 64"><path d="M47 20c-4-8-17-9-25-2-9 8-8 22 1 29 8 7 21 4 26-5-8 3-17 0-20-7-3-8 3-15 11-16 3 0 5 0 7 1zM22 47l-8 5M28 48l-3 8"/></svg>`,
 nachos:`<svg viewBox="0 0 64 64"><path d="M13 47l13-30 13 30zM29 45l13-27 10 29zM21 39h12M38 39h9"/></svg>`,
 wings:`<svg viewBox="0 0 64 64"><path d="M20 19c9-7 21-4 25 5 4 10-3 21-14 23-10 2-20-5-20-15 0-5 3-10 9-13zM43 39l9 9M52 48l3 5M52 48l-5 3"/></svg>`,
 kebab:`<svg viewBox="0 0 64 64"><path d="M32 7v50M22 15l10-5 10 5-10 6zM21 27l11-5 11 5-11 6zM22 40l10-5 10 5-10 6z"/></svg>`,
 croissant:`<svg viewBox="0 0 64 64"><path d="M15 38c-5-6-3-15 3-20l8 8c-3 4-3 8 0 11 4 4 9 4 13 0 3-3 3-8 0-11l8-8c7 6 8 16 2 22-9 10-25 9-34-2z"/></svg>`,
 pancakes:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="20" rx="19" ry="8"/><path d="M13 20v8c0 4 8 8 19 8s19-4 19-8v-8M13 28v8c0 4 8 8 19 8s19-4 19-8v-8M13 36v8c0 4 8 8 19 8s19-4 19-8v-8"/><path d="M29 16h7"/></svg>`,
 waffle:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="21"/><path d="M18 20l28 24M14 30l20 20M30 14l20 20M46 20L20 46M50 30L30 50M34 14L14 34"/></svg>`,
 cereal:`<svg viewBox="0 0 64 64"><path d="M12 28h40c-1 14-9 24-20 24S13 42 12 28z"/><circle cx="23" cy="25" r="3"/><circle cx="33" cy="22" r="3"/><circle cx="42" cy="25" r="3"/></svg>`,
 avocado:`<svg viewBox="0 0 64 64"><path d="M32 9c7 11 18 19 18 31 0 10-8 17-18 17s-18-7-18-17c0-12 11-20 18-31z"/><circle cx="32" cy="40" r="9"/></svg>`,
 chili:`<svg viewBox="0 0 64 64"><path d="M48 18c-4 22-16 33-35 28 13-3 19-12 22-24zM47 18c2-6 7-8 11-5"/></svg>`,
 corn:`<svg viewBox="0 0 64 64"><path d="M32 11c9 0 14 10 14 23S41 55 32 55 18 47 18 34s5-23 14-23z"/><path d="M22 20h20M20 29h24M20 38h24M22 47h20M27 12v42M37 12v42"/></svg>`,
 bread:`<svg viewBox="0 0 64 64"><path d="M14 28c0-9 7-16 16-16 4 0 8 2 11 5 8-2 14 4 14 12 0 5-3 9-7 11v12H16V39c-1-3-2-7-2-11zM24 26c3-3 7-3 10 0M35 24c3-3 7-3 10 0"/></svg>`,
 muffin:`<svg viewBox="0 0 64 64"><path d="M18 29c0-10 7-17 14-17s14 7 14 17H18zM16 31h32l-5 23H21z"/><circle cx="27" cy="22" r="2"/><circle cx="38" cy="21" r="2"/></svg>`,
 cupcake:`<svg viewBox="0 0 64 64"><path d="M19 27c0-9 6-15 13-15s13 6 13 15H19zM18 30h28l-4 24H22zM24 39h16"/></svg>`,
 chocolate:`<svg viewBox="0 0 64 64"><path d="M17 10h30v44H17zM17 21h30M17 32h30M17 43h30M27 10v44M37 10v44"/></svg>`,
 popsicle:`<svg viewBox="0 0 64 64"><path d="M22 11h20c5 0 8 4 8 9v20H14V20c0-5 3-9 8-9zM14 40h36l-5 9H19zM29 49v8h6v-8"/></svg>`,
 milkshake:`<svg viewBox="0 0 64 64"><path d="M19 22h26l-4 32H23zM17 22h30M29 14c2-7 9-8 13-3 4 5 1 10-4 11M36 22l8-17"/></svg>`,
 tea:`<svg viewBox="0 0 64 64"><path d="M14 22h31v20c0 7-6 12-14 12h-3c-8 0-14-5-14-12V22zM45 27h5c5 0 8 3 8 8s-3 8-8 8h-5M25 15c-3-3 2-5 0-8M36 15c-3-3 2-5 0-8"/></svg>`,
 smoothie:`<svg viewBox="0 0 64 64"><path d="M20 17h24l-4 38H24zM17 17h30M35 17l7-12M42 5h7"/><path d="M24 29c6-5 12 5 17 0"/></svg>`,
 lemonade:`<svg viewBox="0 0 64 64"><path d="M18 18h28l-4 36H22zM15 18h34M35 18l8-12"/><circle cx="32" cy="35" r="9"/><path d="M26 35h12M32 29v12"/></svg>`,
 boba:`<svg viewBox="0 0 64 64"><path d="M20 17h24l-4 38H24zM17 17h30M36 17l7-13"/><circle cx="27" cy="46" r="3"/><circle cx="35" cy="47" r="3"/><circle cx="31" cy="39" r="3"/><circle cx="39" cy="40" r="3"/></svg>`
,
 loto:`<svg viewBox="0 0 24 24"><path d="M12 21c-6-3-9-7-9-12 4 0 7 2 9 6 2-4 5-6 9-6 0 5-3 9-9 12z M12 15C8 11 8 7 12 3c4 4 4 8 0 12z"/></svg>`, corazon:`<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/></svg>`, estrella:`<svg viewBox="0 0 24 24"><path d="m12 2 3 6.2 6.8 1-4.9 4.8 1.2 6.8L12 17.6 5.9 20.8l1.2-6.8-4.9-4.8 6.8-1z"/></svg>`, regalo:`<svg viewBox="0 0 24 24"><path d="M3 9h18v12H3z M12 9v12M3 13h18M12 9C4 9 5 2 9 3c2 0 3 3 3 6zm0 0c8 0 7-7 3-6-2 0-3 3-3 6z"/></svg>`, flama:`<svg viewBox="0 0 24 24"><path d="M12 22c-5 0-8-4-8-8 0-4 4-7 7-12 0 5 4 6 5 10 2-2 3-4 3-6 4 6 2 16-7 16z"/></svg>`, ubicacion:`<svg viewBox="0 0 24 24"><path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z M12 9h.01"/></svg>`, calendario:`<svg viewBox="0 0 24 24"><path d="M3 5h18v16H3z M7 2v6M17 2v6M3 11h18"/></svg>`, reloj:`<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v6l4 2"/></svg>`, chat:`<svg viewBox="0 0 24 24"><path d="M4 4h16v13H9l-5 4V4z"/></svg>`, escudo:`<svg viewBox="0 0 24 24"><path d="M12 2 21 6v6c0 6-4 9-9 10-5-1-9-4-9-10V6z M8 12l3 3 5-6"/></svg>`, bolsa:`<svg viewBox="0 0 24 24"><path d="M4 8h16l-1 13H5L4 8zM9 9V6a3 3 0 0 1 6 0v3"/></svg>`, sol:`<svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2"/></svg>`, luna:`<svg viewBox="0 0 24 24"><path d="M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11z"/></svg>`, copa:`<svg viewBox="0 0 24 24"><path d="M5 3h14l-2 10a5 5 0 0 1-10 0L5 3zM12 18v4M7 22h10"/></svg>`, usuario:`<svg viewBox="0 0 24 24"><path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M4 22v-3a8 8 0 0 1 16 0v3"/></svg>`, diamante:`<svg viewBox="0 0 24 24"><path d="M3 9 8 3h8l5 6-9 12L3 9z M3 9h18M8 3l4 18L16 3"/></svg>`, musica:`<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3zM21 16a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3z"/></svg>`, camara:`<svg viewBox="0 0 24 24"><path d="M3 7h5l2-3h4l2 3h5v13H3zM12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>`, check:`<svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg>`, candado:`<svg viewBox="0 0 24 24"><path d="M5 10h14v11H5z M8 10V7a4 4 0 0 1 8 0v3"/></svg>`
};


FOOD['vino']='<svg viewBox="0 0 64 64"><path d="M18 9h28v10c0 11-5 17-14 17S18 30 18 19zM32 36v17M20 54h24M19 18h26"/></svg>';
FOOD['licor']='<svg viewBox="0 0 64 64"><path d="M25 7h14v9l5 5v31H20V21l5-5zM25 16h14M23 29h18v13H23z"/></svg>';
FOOD['coctel']='<svg viewBox="0 0 64 64"><path d="M12 15h40L32 36zM32 36v18M20 54h24M35 15l8-10M17 19h30"/></svg>';
FOOD['cigarros']='<svg viewBox="0 0 64 64"><path d="M9 34h39v9H9zM40 34v9M48 34v9M16 25c-5-5 6-7 1-15M29 26c-5-5 6-8 1-17"/></svg>';
FOOD['copa']='<svg viewBox="0 0 64 64"><path d="M20 12h24l-3 15a10 10 0 0 1-18 0zM32 35v17M20 52h24"/></svg>';
FOOD['lingerie']='<svg viewBox="0 0 64 64"><path d="M16 12v12c0 9-7 11-7 21 16 9 30 9 46 0 0-10-7-12-7-21V12M16 17l16 12 16-12M20 47l-3 9m27-9 3 9"/></svg>';
FOOD['masaje']='<svg viewBox="0 0 64 64"><circle cx="18" cy="19" r="6"/><path d="M10 41h44M17 34l10-8 10 4 12-7M10 47h44M24 47v7m20-7v7"/></svg>';
FOOD['adultos']='<svg viewBox="0 0 64 64"><rect x="10" y="13" width="44" height="39" rx="10"/><path d="M18 26h15M18 35h20M39 23l7 7m0-7-7 7"/></svg>';
FOOD['agua-mineral']='<svg viewBox="0 0 64 64"><path d="M25 8h14v7l5 8v30H20V23l5-8zM24 32h16M27 9h10"/></svg>';
FOOD['cerveza-botella']='<svg viewBox="0 0 64 64"><path d="M26 6h12v10l5 7v30H21V23l5-7zM26 16h12M22 34h20v13H22z"/></svg>';
FOOD['persona']='<svg viewBox="0 0 64 64"><circle cx="32" cy="16" r="10"/><path d="M13 55V43c0-10 8-17 19-17s19 7 19 17v12"/></svg>';
const FOOD_PACKS={
  'Clásicos':['plate','burger','pizza','taco','burrito','hotdog','fries','chicken','salad','soup','sandwich','torta','quesadilla','eggs'],
  'Internacional':['sushi','pasta','ramen','steak','fish','shrimp','nachos','wings','kebab','croissant','pancakes','waffle','cereal','avocado','chili','corn','bread'],
  'Bebidas':['coffee','soda','juice','water','beer','milkshake','tea','smoothie','lemonade','boba'],
  'Postres':['icecream','cake','cookie','donut','fruit','muffin','cupcake','chocolate','popsicle'],
  'Vinos y licores':['vino','licor','coctel','copa','beer','cerveza-botella'],
  'Cigarros':['cigarros'],
  'Bienestar +18':['lingerie','masaje','adultos','persona','agua-mineral']
};
let activeFoodPack='Todos';
function foodIconKeys(){
  if(activeFoodPack==='Todos')return Object.keys(FOOD);
  return FOOD_PACKS[activeFoodPack]||Object.keys(FOOD);
}

/* ==============================
   SUPABASE
   Pega la URL del proyecto y la Publishable/anon key.
   Nunca uses service_role dentro de este archivo.
============================== */
const SUPABASE_URL='https://qxintonbqxliapnwxapz.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_9GDeQK4VBvSGL4H6TQiy_A_NYmiAPLC';
let supabaseClient=null,adminSession=null,cloudSyncTimer=null,cloudReady=false,supabaseConnectionState='idle',supabaseLastError='';
function supabaseConfigured(){
  return /^https:\/\/.+\.supabase\.co$/i.test(SUPABASE_URL)
    && !SUPABASE_ANON_KEY.includes('PEGA_AQUI');
}

/* ==============================
   DATA & STORAGE
============================== */
const STORE='vibraEroticaRestored_v1';
const VIBRA_PENDING_CONFIG='vibraerotica.config.pending.v1';
const VIBRA_SYNC_STATUS='vibraerotica.config.sync-status.v1';
function vibraPending(){return null}
function vibraMarkDirty(){}
function vibraAckConfig(){}

const defaults={
 config:{
  businessName:'VibraErótica',tagline:'Boutique para adultos y reservas',logo:'',whatsapp:'5213141234567',adminPin:'1234',deliveryEnabled:false,
  origin:{address:'Centro, Manzanillo, Colima, México',lat:19.0522,lng:-104.3158},
  map:{provider:'carto',apiKey:'',style:'voyager',attribution:'OpenStreetMap contributors, CARTO'},
  payments:[{id:'pay1',title:'Transferencia bancaria',data:'Configurar en Administración'},{id:'pay2',title:'Depósito en tienda de conveniencia',data:'Configurar en Administración'}],
  shipping:{base:35,perKm:8,margin:20,rounding:5,freeFrom:600,roundTrip:false,vehicle:'moto',fuel:'Magna',efficiency:{moto:28,auto:13,truck:9,bike:9999},fuelPrice:{Magna:24.5,Premium:26.4,'Diésel':25.9}},
  design:{primary:'#e50091',secondary:'#27182b',accent:'#eaa9cb',text:'#232323',card:'#ffffff',siteBg:'#f7f7f9',bgType:'solid',grad1:'#f7f7f9',grad2:'#fff0e6',gradAngle:135,bgImage:'',bgOpacity:.18,pattern:true,patternOpacity:.055,iconColor:'#c62828',iconSize:72,font:'Inter',rounded:true}
 },
 products:[
  {id:'ve1',name:'Lencería elegante',description:'Colección de lencería para adultos.',category:'Lencería',price:450,stock:12,icon:'gift',image:'',active:true},
  {id:'ve2',name:'Accesorios de bienestar',description:'Artículos de cuidado y bienestar íntimo para adultos.',category:'Bienestar',price:290,stock:15,icon:'gift',image:'',active:true},
  {id:'ve3',name:'Artículos para parejas',description:'Selección de accesorios para adultos.',category:'Accesorios',price:350,stock:10,icon:'gift',image:'',active:true}
 ],
 cart:{},orders:[],folioSeq:1
};
let state=load();
try{const snap=JSON.parse(localStorage.getItem('vibra.published.snapshot.v2')||'null');if(snap&&snap.config&&Array.isArray(snap.products)&&Date.now()-Number(snap.savedAt||0)<86400000){state.config=merge(defaults.config,snap.config);state.products=snap.products;}}catch(e){}

let currentCategory='Todos',searchTerm='',customerMarker=null,clientMap=null,originMap=null,originMarker=null,tripMap=null,tripOriginMarker=null,tripDestMarker=null,tripRouteLayer=null,lastPdfBlob=null,lastPdfName='',lastOrderId=null;
let checkout={delivery:'pickup',address:'',lat:null,lng:null,distance:0,shipping:0,name:'',phone:'',notes:'',paymentId:'',proofFile:null,proofUrl:'',proofName:''};
function deepClone(o){return JSON.parse(JSON.stringify(o));}
function load(){try{const x=JSON.parse(localStorage.getItem(STORE)||'null');if(x&&typeof x==='object')delete x.config;return x?merge(defaults,x):deepClone(defaults)}catch(e){return deepClone(defaults)}}
function merge(base,extra){if(Array.isArray(base))return Array.isArray(extra)?extra:base; if(base&&typeof base==='object'){const out={...base};for(const k in extra)out[k]=k in base?merge(base[k],extra[k]):extra[k];return out}return extra??base}
function saveLocal(){try{const snapshot={...state};delete snapshot.config;localStorage.setItem(STORE,JSON.stringify(snapshot))}catch(error){console.error('Guardado local:',error);if(typeof toast==='function')toast('Almacenamiento lleno: reduce el tamaño de imágenes antes de guardar.','error')}}
function save(){
  saveLocal();
  if(adminSession&&supabaseClient){
    clearTimeout(cloudSyncTimer);
    cloudSyncTimer=setTimeout(()=>syncAdminStateToCloud().catch(e=>console.error(e)),700);
  }
}
function publicConfigForCloud(){
  const cfg=deepClone(state.config);
  delete cfg.adminPin;
  if(cfg.map)delete cfg.map.apiKey;
  return cfg;
}

function setSupabaseStatus(kind,message){
  supabaseConnectionState=kind;
  supabaseLastError=message||'';
  const el=document.getElementById('supabaseStatus');
  if(!el)return;
  el.dataset.kind=kind==='ok'?'ok':kind==='error'?'error':'warn';
  el.innerHTML=(kind==='ok'?UI.check:kind==='error'?UI.close:UI.database)+`<span>${esc(message)}</span>`;
}
function explainSupabaseError(error){
  const msg=String(error?.message||error?.error_description||error||'Error desconocido');
  if(/Invalid API key|No API key/i.test(msg))return 'La clave pública de Supabase no es válida.';
  if(/Failed to fetch|NetworkError|fetch/i.test(msg))return 'No se pudo alcanzar Supabase por red. Revisa la URL del proyecto.';
  if(/relation .* does not exist|Could not find the table/i.test(msg))return 'Supabase responde, pero faltan las tablas. Ejecuta supabase-setup.sql.';
  if(/permission denied|row-level security|policy/i.test(msg))return 'Supabase responde, pero faltan permisos o políticas RLS.';
  return msg;
}

function productRow(p,sortOrder=0){
  return {id:String(p.id),name:p.name,description:p.description||'',category:p.category||'',price:Number(p.price)||0,stock:Math.max(0,Number(p.stock)||0),icon:p.icon||'plate',image:p.image||'',active:p.active!==false,delivery_available:p.deliveryAvailable!==false,background_color:p.backgroundColor||null,sort_order:sortOrder};
}
function rowToProduct(p){
  return {id:String(p.id),name:p.name,description:p.description||'',category:p.category||'',price:Number(p.price)||0,stock:Number(p.stock)||0,icon:p.icon||'plate',image:p.image||'',active:p.active!==false,deliveryAvailable:p.delivery_available!==false,backgroundColor:p.background_color||''};
}
async function loadPublicCloudState(){
  if(!supabaseClient)return;
  const [{data:settings,error:se},{data:products,error:pe}]=await Promise.all([
    supabaseClient.from('catalog_settings').select('data').eq('id',1).maybeSingle(),
    supabaseClient.from('products').select('*').order('sort_order',{ascending:true}).order('name',{ascending:true})
  ]);
  if(se)throw se;if(pe)throw pe;
  if(settings?.data){state.config=merge(defaults.config,settings.data);if(state.config.map)state.config.map.apiKey='';}
  if(Array.isArray(products))state.products=products.map(rowToProduct);
  try{const safeConfig=publicConfigForCloud();localStorage.setItem('vibra.published.snapshot.v2',JSON.stringify({config:safeConfig,products:state.products,savedAt:Date.now()}));}catch(e){}
  saveLocal();applyDesign();renderHeader();renderCategories();renderCatalog();
}
async function syncAdminStateToCloud(){
  if(!supabaseClient||!adminSession)return;
  const {error:settingsError}=await supabaseClient.from('catalog_settings').upsert({id:1,data:publicConfigForCloud(),updated_at:new Date().toISOString()});
  if(settingsError)throw settingsError;
  const rows=state.products.map((p,i)=>productRow(p,i));
  if(rows.length){
    const {error}=await supabaseClient.from('products').upsert(rows,{onConflict:'id'});
    if(error)throw error;
  }
  const {data:existing,error:listError}=await supabaseClient.from('products').select('id');
  if(listError)throw listError;
  const keep=new Set(rows.map(r=>r.id));
  const remove=(existing||[]).map(x=>String(x.id)).filter(id=>!keep.has(id));
  if(remove.length){
    const {error}=await supabaseClient.from('products').delete().in('id',remove);
    if(error)throw error;
  }
}
async function initSupabase(){
  if(!supabaseConfigured()){
    cloudReady=false;
    setSupabaseStatus('error','Falta configurar SUPABASE_URL o la Publishable key en index.html.');
    return;
  }
  if(!window.supabase){
    cloudReady=false;
    setSupabaseStatus('error','No cargó la librería de Supabase desde CDN.');
    return;
  }
  try{
    supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
    });
    const {data,error}=await supabaseClient.auth.getSession();
    if(error)throw error;
    adminSession=data?.session||null;
    cloudReady=true;
    setSupabaseStatus('ok','Supabase conectado. Autenticación disponible.');
  }catch(error){
    cloudReady=false;
    setSupabaseStatus('error',explainSupabaseError(error));
    throw error;
  }

  try{
    await loadPublicCloudState();
  }catch(error){
    console.error('Carga pública Supabase:',error);
    setSupabaseStatus('warn','Supabase está conectado, pero no se pudieron leer productos/configuración: '+explainSupabaseError(error));
  }

  supabaseClient.auth.onAuthStateChange((_event,session)=>{adminSession=session||null});
  try{
    supabaseClient.channel('catalog-live')
      .on('postgres_changes',{event:'*',schema:'public',table:'products'},()=>loadPublicCloudState().catch(()=>{}))
      .on('postgres_changes',{event:'*',schema:'public',table:'catalog_settings'},()=>loadPublicCloudState().catch(()=>{}))
      .subscribe();
  }catch(error){
    console.warn('Realtime no disponible:',error);
  }
}
const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(n||0));
const uid=p=>p+'_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function toast(msg,kind='info'){const el=document.createElement('div');el.className='toast';el.innerHTML=(kind==='ok'?UI.check:kind==='error'?UI.close:UI.file)+`<div>${esc(msg)}</div>`;document.getElementById('toastWrap').appendChild(el);setTimeout(()=>el.remove(),3400)}

/* ==============================
   THEME
============================== */
function applyDesign(){const d=state.config.design,r=document.documentElement.style;r.setProperty('--primary',d.primary);r.setProperty('--secondary',d.secondary);r.setProperty('--accent',d.accent);r.setProperty('--text',d.text);r.setProperty('--card',d.card);r.setProperty('--site-bg',d.siteBg);r.setProperty('--product-icon-color',d.iconColor);r.setProperty('--product-icon-size',d.iconSize+'px');r.setProperty('--font',`'${d.font}',sans-serif`);r.setProperty('--radius',d.rounded?'18px':'4px');r.setProperty('--pattern-opacity',d.patternOpacity);document.body.classList.toggle('pattern-on',!!d.pattern);
 if(d.bgType==='solid')document.body.style.background=publicThemeMode==='dark'?'#0d1015':d.siteBg;
 if(d.bgType==='gradient'&&publicThemeMode!=='dark')document.body.style.background=`linear-gradient(${d.gradAngle}deg,${d.grad1},${d.grad2}) fixed`;
 if(d.bgType==='image'&&d.bgImage&&publicThemeMode!=='dark'){document.body.style.background=`linear-gradient(rgba(255,255,255,${1-d.bgOpacity}),rgba(255,255,255,${1-d.bgOpacity})),url('${d.bgImage}') center/cover fixed`}
 applyPublicTheme();
}


const THEME_STORE='vibraerotica.theme.mode';
let publicThemeMode=localStorage.getItem(THEME_STORE)||'default';
function applyPublicTheme(){
  document.documentElement.dataset.vibraMode=publicThemeMode==='dark'?'dark':'default';document.body.classList.toggle('dark-mode',publicThemeMode==='dark');document.documentElement.classList.toggle('vibra-dark-first',publicThemeMode==='dark');
  const b=document.getElementById('themeBtn');
  if(b){
    b.innerHTML=(publicThemeMode==='dark'?UI.moon:UI.sun)+`<span class="theme-switch-label">${publicThemeMode==='dark'?'Oscuro':'Predeterminado'}</span>`;
    b.setAttribute('aria-label',publicThemeMode==='dark'?'Modo oscuro activo. Cambiar a predeterminado':'Modo predeterminado activo. Cambiar a oscuro');
    b.setAttribute('aria-pressed',String(publicThemeMode==='dark'));
    if(window.innerWidth>=720)b.style.width='auto',b.style.padding='0 12px'; else b.style.width='44px',b.style.padding='0';
  }
}
function togglePublicTheme(){
  publicThemeMode=publicThemeMode==='dark'?'default':'dark';
  localStorage.setItem(THEME_STORE,publicThemeMode);
  applyDesign();
  applyPublicTheme();
}

/* ==============================
   PUBLIC CATALOG
============================== */
function productVisual(p){if(p.image)return `<img src="${esc(p.image)}" alt="${esc(p.name)}">`;return FOOD[p.icon]||FOOD.plate}
function renderHeader(){applyPublicTheme();try{const name=String(state.config.businessName||'VibraErótica');document.title=name;const icon=document.getElementById('vibraDynamicFavicon');const src=state.config.logo||window.VIBRA_DEFAULT_LOGO;if(icon&&src&&icon.href!==src)icon.href=src;}catch(e){console.warn('Identidad de pestaña',e)}document.getElementById('brandName').textContent=state.config.businessName;document.getElementById('brandTagline').textContent=state.config.tagline;document.getElementById('heroTitle').textContent=`${state.config.businessName}`;const l=document.getElementById('brandLogo');l.innerHTML=`<img src="${esc(state.config.logo||window.VIBRA_DEFAULT_LOGO||'')}" alt="Logo VibraErótica">`;document.getElementById('adminBtn').innerHTML=UI.settings;document.getElementById('cartBtn').innerHTML=UI.cart+`<span class="badge-count" id="cartCount">0</span>`;document.querySelector('[data-close-drawer]').innerHTML=UI.close;document.querySelectorAll('[data-close-modal]').forEach(b=>b.innerHTML=UI.close);document.getElementById('whatsappFab').innerHTML=UI.whatsapp;const sw=document.getElementById('searchWrap');if(!sw.querySelector('svg'))sw.insertAdjacentHTML('afterbegin',UI.search);document.getElementById('pinSubmit').innerHTML=UI.lock+' Entrar';updateCartCount()}
function categories(){const configured=Array.isArray(state.config?.catalogCategories)?state.config.catalogCategories:[];return ['Todos',...new Set([...configured,...state.products.filter(p=>p.active).map(p=>p.category)].filter(x=>typeof x==='string'&&x.trim()))]}
function renderCategories(){document.getElementById('categoryChips').innerHTML=categories().map(c=>`<button class="chip ${c===currentCategory?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}
function renderCatalog(){const arr=state.products.filter(p=>p.active&&(currentCategory==='Todos'||p.category===currentCategory)&&(`${p.name} ${p.description}`.toLowerCase().includes(searchTerm.toLowerCase())));document.getElementById('catalogGrid').innerHTML=arr.length?arr.map(p=>{const q=state.cart[p.id]||0;return `<article class="product-card"><div class="product-visual">${productVisual(p)}</div><div class="product-body"><div class="product-head"><h3 class="product-name">${esc(p.name)}</h3><div class="price">${money(p.price)}</div></div><p class="desc">${esc(p.description)}</p><div class="meta"><span>${esc(p.category)}</span><span>Stock: ${p.stock}</span></div><div class="qty-row">${p.stock<=0?'<span class="stock-out">Agotado</span>':`<div class="qty-control"><button class="icon-btn" data-dec="${p.id}" aria-label="Quitar cantidad" ${q<=0?'disabled':''}>${UI.minus}</button><span class="qty-value">${q}</span><button class="icon-btn" data-inc="${p.id}" aria-label="Agregar cantidad" ${q>=p.stock?'disabled':''}>${UI.plus}</button></div>`}<button class="btn secondary" data-inc="${p.id}" ${p.stock<=0||q>=p.stock?'disabled':''}>${UI.cart}<span>Agregar</span></button></div></div></article>`}).join(''):'<div class="section-card"><strong>No hay productos para mostrar.</strong></div>';updateCartCount()}
function changeQty(id,delta){const p=state.products.find(x=>x.id===id);if(!p)return;const next=Math.max(0,Math.min(p.stock,(state.cart[id]||0)+delta));if(next)state.cart[id]=next;else delete state.cart[id];save();renderCatalog();if(document.getElementById('cartDrawer').classList.contains('show'))renderCart()}
function updateCartCount(){const el=document.getElementById('cartCount');if(el)el.textContent=Object.values(state.cart).reduce((a,b)=>a+b,0)}
function cartItems(){return Object.entries(state.cart).map(([id,qty])=>({p:state.products.find(x=>x.id===id),qty})).filter(x=>x.p&&x.qty>0)}
function subtotal(){return cartItems().reduce((s,x)=>s+x.qty*x.p.price,0)}
function shippingCost(distance){if(checkout.delivery!=='delivery')return 0;const s=state.config.shipping;if(s.freeFrom>0&&subtotal()>=s.freeFrom)return 0;let raw=s.base+distance*s.perKm;raw=raw*(1+s.margin/100);if(s.rounding>0)raw=Math.ceil(raw/s.rounding)*s.rounding;return Math.max(0,raw)}
function openDrawer(){document.getElementById('overlay').classList.add('show');document.getElementById('cartDrawer').classList.add('show');renderCart();setTimeout(()=>{if(checkout.delivery==='delivery')initClientMap()},120)}
function closeDrawer(){document.getElementById('overlay').classList.remove('show');document.getElementById('cartDrawer').classList.remove('show')}
function renderCart(){const items=cartItems(),body=document.getElementById('cartBody'),foot=document.getElementById('cartFoot');if(!items.length){body.innerHTML='<div class="section-card"><strong>Tu carrito está vacío.</strong><p class="muted small">Agrega productos del catálogo para continuar.</p></div>';foot.innerHTML='';return}
 body.innerHTML=`<div>${items.map(({p,qty})=>`<div class="cart-item"><div><h4>${esc(p.name)}</h4><p>${qty} por ${money(p.price)} = ${money(qty*p.price)}</p><div class="qty-control" style="margin-top:8px"><button class="icon-btn" data-dec="${p.id}">${UI.minus}</button><span class="qty-value">${qty}</span><button class="icon-btn" data-inc="${p.id}" ${qty>=p.stock?'disabled':''}>${UI.plus}</button></div></div><button class="icon-btn" data-remove="${p.id}" aria-label="Eliminar">${UI.trash}</button></div>`).join('')}</div>
 <div class="form-section"><h3>Tipo de entrega</h3><div class="radio-group"><div class="radio-card"><input type="radio" id="pickup" name="delivery" value="pickup" ${checkout.delivery==='pickup'?'checked':''}><label for="pickup">Recoger en sitio</label></div><div class="radio-card"><input type="radio" id="delivery" name="delivery" value="delivery" ${checkout.delivery==='delivery'?'checked':''} ${!state.config.deliveryEnabled?'disabled':''}><label for="delivery">Domicilio</label></div></div></div>
 <div id="deliveryBox" class="${checkout.delivery==='delivery'?'':'hidden'}"><div class="field"><label>Dirección de entrega</label><input class="input" id="clientAddress" value="${esc(checkout.address)}" placeholder="Calle, número, colonia, ciudad"></div><button class="btn secondary full" id="geocodeClient">${UI.pin}<span>Ubicar en mapa</span></button><div class="small muted" style="margin:8px 0">Puedes mover el marcador para ajustar tu ubicación.</div><div id="clientMap" class="map"></div><div class="notice" id="distanceInfo">${checkout.distance>0?`Distancia calculada: ${checkout.distance.toFixed(2)} km. Envío: ${money(checkout.shipping)}`:'Ubica tu dirección para calcular el envío.'}</div></div>
 <div class="form-section"><h3>Datos del cliente</h3><div class="field"><label>Nombre</label><input class="input" id="customerName" value="${esc(checkout.name)}"></div><div class="field"><label>Teléfono a 10 dígitos</label><input class="input" id="customerPhone" inputmode="numeric" maxlength="10" value="${esc(checkout.phone)}"></div><div class="field"><label>Notas del pedido</label><textarea class="textarea" id="customerNotes">${esc(checkout.notes)}</textarea></div></div>
 <div class="form-section"><h3>Método de pago</h3>${state.config.payments.map(x=>`<div class="payment-item"><div class="row"><input type="radio" name="payment" value="${x.id}" ${checkout.paymentId===x.id?'checked':''}><strong>${esc(x.title)}</strong><button class="icon-btn" data-copy="${esc(x.data)}" data-copy-id="${x.id}">${UI.copy}</button></div><div class="payment-data">${esc(x.data)}</div><div class="copy-note" id="copy_${x.id}">${UI.check}<span>Copiado</span></div></div>`).join('')}</div>
 <div class="form-section"><h3>Comprobante</h3><label class="btn secondary full" for="proofFile">${UI.attach}<span>Adjuntar imagen o PDF</span></label><input class="hidden" id="proofFile" type="file" accept="image/png,image/jpeg,application/pdf"><div class="preview-file ${checkout.proofFile?'show':''}" id="proofPreview">${proofPreviewHtml()}</div><div class="notice" style="margin-top:10px">Al abrir WhatsApp, adjunta tu comprobante en el chat.</div></div>`;
 checkout.shipping=shippingCost(checkout.distance);
 foot.innerHTML=`<div class="total-line"><span>Subtotal</span><strong>${money(subtotal())}</strong></div><div class="total-line"><span>Envío</span><strong>${money(checkout.shipping)}</strong></div><div class="total-line grand"><span>Total</span><span>${money(subtotal()+checkout.shipping)}</span></div><button class="btn full" id="reviewOrder">${UI.arrowRight}<span>Revisar pedido</span></button>`;
 bindCartFields();
}
function proofPreviewHtml(){if(!checkout.proofFile)return '';if(checkout.proofFile.type.startsWith('image/'))return `<img src="${checkout.proofUrl}" alt="Comprobante"><div><strong>${esc(checkout.proofName)}</strong><div class="small muted">Imagen adjunta</div></div>`;return `<div class="file-generic">${UI.file}</div><div><strong>${esc(checkout.proofName)}</strong><div class="small muted">Documento PDF adjunto</div></div>`}
function bindCartFields(){document.querySelectorAll('input[name=delivery]').forEach(r=>r.onchange=e=>{checkout.delivery=e.target.value;checkout.shipping=shippingCost(checkout.distance);renderCart();setTimeout(()=>checkout.delivery==='delivery'&&initClientMap(),100)});const f=id=>document.getElementById(id);if(f('customerName'))f('customerName').oninput=e=>checkout.name=e.target.value;if(f('customerPhone'))f('customerPhone').oninput=e=>checkout.phone=e.target.value.replace(/\D/g,'').slice(0,10);if(f('customerNotes'))f('customerNotes').oninput=e=>checkout.notes=e.target.value;if(f('clientAddress'))f('clientAddress').oninput=e=>checkout.address=e.target.value;document.querySelectorAll('input[name=payment]').forEach(r=>r.onchange=e=>checkout.paymentId=e.target.value);if(f('proofFile'))f('proofFile').onchange=handleProof;if(f('geocodeClient'))f('geocodeClient').onclick=()=>geocodeAddress(checkout.address,'client');if(f('reviewOrder'))f('reviewOrder').onclick=reviewOrder}
function handleProof(e){const file=e.target.files[0];if(!file)return;checkout.proofFile=file;checkout.proofName=file.name;if(checkout.proofUrl)URL.revokeObjectURL(checkout.proofUrl);checkout.proofUrl=URL.createObjectURL(file);const p=document.getElementById('proofPreview');p.classList.add('show');p.innerHTML=proofPreviewHtml()}
function validateCheckout(){if(!cartItems().length)return 'El carrito está vacío.';if(!checkout.name.trim())return 'Escribe tu nombre.';if(!/^\d{10}$/.test(checkout.phone))return 'El teléfono debe tener 10 dígitos.';if(!checkout.paymentId)return 'Selecciona un método de pago.';if(!checkout.proofFile)return 'Adjunta tu comprobante de pago.';if(checkout.delivery==='delivery'){if(!state.config.deliveryEnabled)return 'El envío a domicilio no está disponible.';if(!checkout.address.trim())return 'Escribe tu dirección de entrega.';if(checkout.lat==null||checkout.lng==null||checkout.distance<=0)return 'Ubica y confirma tu dirección en el mapa.'}return ''}
function reviewOrder(){const err=validateCheckout();if(err){toast(err,'error');return}checkout.shipping=shippingCost(checkout.distance);closeDrawer();renderSummary();openModal('summaryModal')}
function renderSummary(){const items=cartItems(),pay=state.config.payments.find(x=>x.id===checkout.paymentId),total=subtotal()+checkout.shipping;document.getElementById('summaryBody').innerHTML=`<div class="table-wrap"><table class="summary-table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Total por producto</th></tr></thead><tbody>${items.map(x=>`<tr><td>${esc(x.p.name)}</td><td>${x.qty}</td><td>${money(x.p.price)}</td><td>${money(x.qty*x.p.price)}</td></tr>`).join('')}</tbody></table></div><div class="total-box"><div class="total-line"><span>Subtotal general</span><strong>${money(subtotal())}</strong></div><div class="total-line"><span>Envío ${checkout.delivery==='delivery'?`(${checkout.distance.toFixed(2)} km)`:''}</span><strong>${money(checkout.shipping)}</strong></div><div class="total-line grand"><span>TOTAL GENERAL</span><span>${money(total)}</span></div></div><hr><div class="stack small"><div><strong>Cliente:</strong> ${esc(checkout.name)} · ${esc(checkout.phone)}</div><div><strong>Entrega:</strong> ${checkout.delivery==='pickup'?'Recoger en sitio':`Domicilio · ${esc(checkout.address)}`}</div><div><strong>Método de pago:</strong> ${esc(pay?.title||'')}</div><div><strong>Notas:</strong> ${esc(checkout.notes||'Sin notas')}</div></div><div class="toolbar" style="margin-top:16px"><button class="btn ghost" id="editOrder">${UI.arrowLeft}<span>Editar pedido</span></button><button class="btn" id="confirmOrder">${UI.file}<span>Confirmar y generar PDF</span></button></div>`;document.getElementById('editOrder').onclick=()=>{closeModal('summaryModal');openDrawer()};document.getElementById('confirmOrder').onclick=confirmOrder}

/* ==============================
   MAP, GEOCODING & ROUTING
============================== */

function mapSettings(){
  state.config.map=state.config.map||{provider:'carto',apiKey:'',style:'voyager',attribution:'OpenStreetMap contributors, CARTO'};
  if(!state.config.map.style)state.config.map.style='voyager';
  return state.config.map;
}
function cartoTileUrl(){
  const m=mapSettings();
  const key=(m.apiKey||'').trim();
  const style=['voyager','light_all','dark_all'].includes(m.style)?m.style:'voyager';
  if(!/^https:\/\/.+\.supabase\.co$/i.test(SUPABASE_URL))return '';
  return `${SUPABASE_URL}/functions/v1/carto-tiles/${style}/{z}/{x}/{y}.png`;
}
function mapConfigured(){return !!cartoTileUrl()}
function showMapConfigNeeded(containerId){
  const el=document.getElementById(containerId);
  if(!el)return;
  el.innerHTML=`<div class="empty-state" style="height:100%;min-height:220px;display:grid;place-items:center;padding:24px;text-align:center"><div>${UI.map}<strong style="display:block;margin:8px 0">Falta configurar CARTO</strong><span class="small muted">El administrador debe guardar una clave CARTO y desplegar la función carto-tiles.</span></div></div>`;
}
function addConfiguredTileLayer(map,containerId){
  const url=cartoTileUrl();
  if(!url){showMapConfigNeeded(containerId);return false}
  try{
    const tiles=L.tileLayer(url,{
      maxZoom:20,
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution/">CARTO</a>'
    }).addTo(map);
    let failures=0;
    tiles.on('tileerror',async()=>{
      if(++failures!==2)return;
      if(!map._vibraFallbackTiles){
        try{
          map.removeLayer(tiles);
          map._vibraFallbackTiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
            maxZoom:19,subdomains:'abc',attribution:'&copy; OpenStreetMap contributors'
          }).addTo(map);
        }catch(fallbackError){console.warn('Mapa alternativo:',fallbackError)}
      }
      let detail='No fue posible descargar las teselas CARTO; se intentó usar OpenStreetMap como respaldo.';
      try{const probe=url.replace('{z}','4').replace('{x}','3').replace('{y}','7');const response=await fetch(probe);if(!response.ok)detail+=' HTTP '+response.status+': '+(await response.text()).slice(0,180)}catch(error){detail+=' '+error.message}
      const host=document.getElementById(containerId);
      if(host&&!host.querySelector('.vibra-map-error')&&!map._vibraFallbackTiles){const note=document.createElement('div');note.className='vibra-map-error';note.textContent=detail;host.append(note)}
    });
    return true;
  }catch(e){
    showMapConfigNeeded(containerId);
    return false;
  }
}

function initClientMap(){if(!document.getElementById('clientMap')||typeof L==='undefined')return;const center=checkout.lat!=null?[checkout.lat,checkout.lng]:[state.config.origin.lat,state.config.origin.lng];if(clientMap){clientMap.remove();clientMap=null}clientMap=L.map('clientMap',{rotate:true,touchRotate:true,dragRotate:true,shiftKeyRotate:true,rotateControl:{position:"topright",behavior:"reset",closeOnZeroBearing:false}}).setView(center,13);if(!addConfiguredTileLayer(clientMap,'clientMap')){clientMap.remove();clientMap=null;return;}customerMarker=L.marker(center,{draggable:true}).addTo(clientMap);customerMarker.on('dragend',async e=>{const ll=e.target.getLatLng();checkout.lat=ll.lat;checkout.lng=ll.lng;await computeClientRoute()});clientMap.on('click',e=>{customerMarker.setLatLng(e.latlng);checkout.lat=e.latlng.lat;checkout.lng=e.latlng.lng;computeClientRoute()})}
async function geocodeAddress(address,target){if(!address.trim()){toast('Escribe una dirección.','error');return}try{const url=`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;const r=await fetch(url,{headers:{'Accept':'application/json'}});if(!r.ok)throw new Error();const d=await r.json();if(!d.length)throw new Error();const lat=Number(d[0].lat),lng=Number(d[0].lon);if(target==='client'){checkout.lat=lat;checkout.lng=lng;checkout.address=d[0].display_name;document.getElementById('clientAddress').value=checkout.address;if(customerMarker)customerMarker.setLatLng([lat,lng]);if(clientMap)clientMap.setView([lat,lng],15);await computeClientRoute()}else if(target==='origin'){state.config.origin={address:d[0].display_name,lat,lng};save();renderAdminPane('business');toast('Origen actualizado.','ok')}else if(target==='trip'){document.getElementById('tripDestination').value=d[0].display_name;setTripDestination(lat,lng)}}catch(e){toast('No se pudo geocodificar la dirección. Puedes marcar el punto manualmente en el mapa.','error')}}
function haversine(a,b,c,d){const R=6371,toRad=x=>x*Math.PI/180,da=toRad(c-a),db=toRad(d-b),q=Math.sin(da/2)**2+Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(db/2)**2;return 2*R*Math.atan2(Math.sqrt(q),Math.sqrt(1-q))}
async function routeDistance(aLat,aLng,bLat,bLng){try{const u=`https://router.project-osrm.org/route/v1/driving/${aLng},${aLat};${bLng},${bLat}?overview=full&geometries=geojson`;const r=await fetch(u);if(!r.ok)throw new Error();const d=await r.json();if(!d.routes?.length)throw new Error();return {km:d.routes[0].distance/1000,geo:d.routes[0].geometry}}catch(e){return {km:haversine(aLat,aLng,bLat,bLng)*1.3,geo:null,fallback:true}}}
async function computeClientRoute(){if(checkout.lat==null)return;const o=state.config.origin,res=await routeDistance(o.lat,o.lng,checkout.lat,checkout.lng);checkout.distance=res.km;checkout.shipping=shippingCost(res.km);const info=document.getElementById('distanceInfo');if(info)info.textContent=`Distancia calculada: ${res.km.toFixed(2)} km. Envío: ${money(checkout.shipping)}${res.fallback?' (estimación de respaldo)':''}`;const foot=document.getElementById('cartFoot');if(foot){const lines=foot.querySelectorAll('.total-line strong,.total-line.grand span:last-child');if(lines.length>=3){lines[1].textContent=money(checkout.shipping);lines[2].textContent=money(subtotal()+checkout.shipping)}}}

/* ==============================
   PDF, ORDER & WHATSAPP
============================== */
function nextFolio(){const d=new Date(),stamp=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;return `${stamp}-${String(state.folioSeq).padStart(4,'0')}`}
async function buildPdf(order){const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:'mm',format:'a4'});let titleX=14;if(state.config.logo&&/^data:image\/(png|jpe?g|webp);/i.test(state.config.logo)){try{const fmt=(state.config.logo.match(/^data:image\/(png|jpe?g|webp);/i)||[])[1];doc.addImage(state.config.logo,fmt&&fmt.toLowerCase().startsWith('jp')?'JPEG':fmt.toUpperCase(),14,9,16,16);titleX=34}catch(e){}}doc.setFont('helvetica','bold');doc.setFontSize(18);doc.text(state.config.businessName,titleX,18);doc.setFontSize(10);doc.setFont('helvetica','normal');doc.text(`Folio: ${order.folio}`,14,25);doc.text(`Fecha: ${order.dateText}`,14,31);doc.text(`Cliente: ${order.customer.name}`,14,39);doc.text(`Teléfono: ${order.customer.phone}`,14,45);doc.text(`Entrega: ${order.delivery.label}`,14,51);if(order.delivery.address)doc.text(`Dirección: ${order.delivery.address}`,14,57,{maxWidth:180});const y=order.delivery.address?66:58;doc.autoTable({startY:y,head:[['Producto','Cantidad','Precio unitario','Total']],body:order.items.map(i=>[i.name,String(i.qty),money(i.price),money(i.total)]),styles:{fontSize:9},headStyles:{fillColor:[60,60,60]},theme:'grid'});let yy=doc.lastAutoTable.finalY+8;doc.setFont('helvetica','normal');doc.text(`Subtotal: ${money(order.subtotal)}`,140,yy);yy+=6;doc.text(`Envío: ${money(order.shipping)}`,140,yy);yy+=7;doc.setFont('helvetica','bold');doc.text(`TOTAL GENERAL: ${money(order.total)}`,140,yy);yy+=10;doc.setFont('helvetica','normal');doc.text(`Método de pago elegido: ${order.paymentTitle}`,14,yy,{maxWidth:180});yy+=8;doc.text('Métodos de pago disponibles:',14,yy);yy+=6;state.config.payments.forEach(p=>{doc.text(`${p.title}: ${p.data}`,18,yy,{maxWidth:175});yy+=6});return doc.output('blob')}
function whatsappText(order){return [`PEDIDO #${order.folio}`,`CLIENTE: ${order.customer.name} y ${order.customer.phone}`,'DETALLE:',...order.items.map(i=>`${i.qty} x ${i.name} - ${money(i.price)} c/u = ${money(i.total)}`),`ENTREGA: ${order.delivery.label}${order.delivery.address?' - '+order.delivery.address:''}${order.delivery.km?` - ${order.delivery.km.toFixed(2)} km`:''}`,`SUBTOTAL: ${money(order.subtotal)}`,`ENVIO: ${money(order.shipping)}`,`TOTAL: ${money(order.total)}`,`METODO DE PAGO: ${order.paymentTitle}`,'Adjunto mi comprobante a continuación.'].join('\n')}

function renderOrdersAdmin(c,skipFetch=false){
  c.innerHTML=`<div class="section-card"><h3>Historial de pedidos</h3><div class="table-wrap"><table class="admin-table"><thead><tr><th>Orden</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Pago</th><th>Entrega</th><th>Acciones</th></tr></thead><tbody>${state.orders.length?state.orders.map(o=>`<tr><td>${esc(o.publicId||o.folio)}</td><td>${esc(new Date(o.date).toLocaleString('es-MX'))}</td><td>${esc(o.customer.name)}</td><td>${money(o.total)}</td><td>${paymentBadge(o.paymentStatus||'WAITING_PAYMENT')}</td><td><span class="status-badge status-${o.status}">${o.status==='pendiente'?UI.pending:o.status==='pagado'?UI.paid:UI.delivered}<span>${o.status}</span></span></td><td><div class="row"><select class="select" data-order-status="${o.id}"><option value="pendiente" ${o.status==='pendiente'?'selected':''}>Pendiente</option><option value="pagado" ${o.status==='pagado'?'selected':''}>Pagado</option><option value="entregado" ${o.status==='entregado'?'selected':''}>Entregado</option></select><button class="icon-btn" data-reprint="${o.id}">${UI.download}</button></div></td></tr>`).join(''):`<tr><td colspan="7">Todavía no hay pedidos.</td></tr>`}</tbody></table></div></div><div class="section-card"><h3>Respaldo</h3><div class="toolbar"><button class="btn" id="exportJson">${UI.download}<span>Exportar JSON</span></button><label class="btn secondary" for="importJson">${UI.upload}<span>Importar JSON</span></label><input class="hidden" id="importJson" type="file" accept="application/json"></div></div>`;
  document.querySelectorAll('[data-order-status]').forEach(s=>s.onchange=async e=>{const o=state.orders.find(x=>x.id===e.target.dataset.orderStatus);if(!o)return;o.status=e.target.value;saveLocal();if(supabaseClient&&adminSession){const {error}=await supabaseClient.from('orders').update({status:o.status}).eq('id',o.id);if(error)toast('No se pudo actualizar el estado.','error')}renderOrdersAdmin(document.getElementById('adminContent'),true)});
  document.querySelectorAll('[data-reprint]').forEach(b=>b.onclick=()=>reprintOrder(b.dataset.reprint));
  document.getElementById('exportJson').onclick=exportJson;document.getElementById('importJson').onchange=importJson;
  if(!skipFetch&&supabaseClient&&adminSession)fetchCloudOrders().then(()=>{if(activeAdmin==='orders')renderOrdersAdmin(document.getElementById('adminContent'),true)}).catch(e=>toast(e.message||'No se pudo cargar el historial de Supabase.','error'));
}

async function confirmOrder(){const items=cartItems(),folio=nextFolio(),pay=state.config.payments.find(x=>x.id===checkout.paymentId),now=new Date();const order={id:uid('o'),folio,date:now.toISOString(),dateText:now.toLocaleString('es-MX'),customer:{name:checkout.name,phone:checkout.phone,call_phone:checkout.callPhone||checkout.phone,notes:checkout.notes},items:items.map(x=>({id:x.p.id,name:x.p.name,qty:x.qty,price:x.p.price,total:x.qty*x.p.price})),subtotal:subtotal(),shipping:checkout.shipping,total:subtotal()+checkout.shipping,paymentId:checkout.paymentId,paymentTitle:pay?.title||'',delivery:{type:checkout.delivery,label:checkout.delivery==='pickup'?'Recoger en sitio':'Domicilio',address:checkout.delivery==='delivery'?checkout.address:'',km:checkout.delivery==='delivery'?checkout.distance:0},status:'pendiente'};lastPdfBlob=await buildPdf(order);lastPdfName=`pedido-${folio}.pdf`;lastOrderId=order.id;state.orders.unshift(order);state.folioSeq++;items.forEach(x=>{x.p.stock=Math.max(0,x.p.stock-x.qty)});state.cart={};save();renderCatalog();updateCartCount();renderPostConfirm(order)}
function renderPostConfirm(order){document.getElementById('summaryBody').innerHTML=`<div class="section-card"><div class="row">${UI.check}<div><strong>Pedido generado</strong><div class="small muted">Folio ${order.folio}</div></div></div></div><div class="total-line grand"><span>TOTAL GENERAL</span><span>${money(order.total)}</span></div><div class="stack" style="margin-top:16px"><button class="btn full" id="downloadPdf">${UI.download}<span>Descargar PDF</span></button>${navigator.canShare?`<button class="btn secondary full" id="shareFiles">${UI.attach}<span>Compartir PDF + comprobante</span></button>`:''}<button class="btn success full" id="payWhatsapp">${UI.whatsapp}<span>PAGAR</span></button></div><div class="notice" style="margin-top:12px">Tu comprobante se registra en el sistema cuando la conexión está disponible. WhatsApp se mantiene como canal de contacto del negocio.</div>`;document.getElementById('downloadPdf').onclick=downloadLastPdf;document.getElementById('payWhatsapp').onclick=()=>{window.open(`https://wa.me/${state.config.whatsapp}?text=${encodeURIComponent(whatsappText(order))}`,'_blank');resetCheckout();closeModal('summaryModal')};if(document.getElementById('shareFiles'))document.getElementById('shareFiles').onclick=()=>shareFiles(order)}
function downloadLastPdf(){if(!lastPdfBlob)return;const a=document.createElement('a');a.href=URL.createObjectURL(lastPdfBlob);a.download=lastPdfName;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
async function shareFiles(order){if(!lastPdfBlob||!checkout.proofFile)return;const pdfFile=new File([lastPdfBlob],lastPdfName,{type:'application/pdf'}),files=[pdfFile,checkout.proofFile];try{if(navigator.canShare?.({files}))await navigator.share({title:`Pedido ${order.folio}`,text:'Cuenta del pedido y comprobante',files});else toast('Tu navegador no permite compartir estos archivos juntos.','error')}catch(e){if(e.name!=='AbortError')toast('No se pudieron compartir los archivos.','error')}}
function resetCheckout(){checkout={delivery:'pickup',address:'',lat:null,lng:null,distance:0,shipping:0,name:'',phone:'',notes:'',paymentId:'',proofFile:null,proofUrl:'',proofName:''}}
async function reprintOrder(id){const order=state.orders.find(o=>o.id===id);if(!order)return;lastPdfBlob=await buildPdf(order);lastPdfName=`pedido-${order.folio}.pdf`;downloadLastPdf()}

/* ==============================
   MODALS
============================== */
function openModal(id){document.getElementById('overlay').classList.add('show');document.getElementById(id).classList.add('show')}
function closeModal(id){document.getElementById(id).classList.remove('show');if(!document.querySelector('.modal.show')&&!document.getElementById('cartDrawer').classList.contains('show'))document.getElementById('overlay').classList.remove('show')}

/* ==============================
   ADMIN PANEL
============================== */
const adminTabs=[
['dashboard','Dashboard',UI.dashboard],
['products','Productos y servicios',UI.products],
['design','Personalización',UI.palette],
['business','Negocio',UI.business],
['trip','Calculadora de viajes (heredado)',UI.calc],
['orders','Pedidos',UI.orders],
['review','Revisión de pagos',UI.review],
['receipts','Comprobantes',UI.receipt],
['audit','Auditoría',UI.audit],
['integrations','Integraciones',UI.telegram]
];
let activeAdmin='dashboard',editingProductId=null;
async function openAdmin(){
  if(adminSession&&supabaseClient){renderAdmin();openModal('adminModal');return}
  const email=document.getElementById('adminEmailInput');
  const pass=document.getElementById('adminPasswordInput');
  if(email)email.value=localStorage.getItem('foodCatalogAdminEmail')||'';
  if(pass)pass.value='';
  openModal('pinModal');
  setTimeout(()=>email?.focus(),80);
}
async function checkPin(){
  if(!supabaseConfigured()){toast('Configura primero la URL y la clave pública de Supabase.','error');return}if(!supabaseClient){try{await initSupabase()}catch(e){toast(explainSupabaseError(e),'error');return}}
  const email=document.getElementById('adminEmailInput').value.trim().toLowerCase();
  const password=document.getElementById('adminPasswordInput').value;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('Escribe un correo válido.','error');return}
  if(password.length<6){toast('La contraseña debe tener al menos 6 caracteres.','error');return}
  const btn=document.getElementById('pinSubmit');btn.disabled=true;
  try{
    const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});
    if(error)throw error;
    const {data:isAdmin,error:adminError}=await supabaseClient.rpc('is_catalog_admin');
    if(adminError){throw new Error('No se pudo verificar el rol administrador: '+explainSupabaseError(adminError))}if(isAdmin!==true){
      await supabaseClient.auth.signOut();
      throw new Error('Esta cuenta no tiene permisos de administrador.');
    }
    adminSession=data.session;
    localStorage.setItem('foodCatalogAdminEmail',email);
    closeModal('pinModal');renderAdmin();openModal('adminModal');toast('Acceso administrativo iniciado.','ok');
  }catch(e){toast(e?.message||'No se pudo iniciar sesión.','error')}
  finally{btn.disabled=false}
}
function renderAdmin(){document.getElementById('adminTabs').innerHTML=adminTabs.map(([id,label,ico])=>`<button class="tab-btn ${activeAdmin===id?'active':''}" data-tab="${id}">${ico}<span>${label}</span></button>`).join('');renderAdminPane(activeAdmin)}
function renderAdminPane(id){
  activeAdmin=id;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  const c=document.getElementById('adminContent');
  if(id==='dashboard')renderAdminDashboard(c);
  if(id==='products')renderProductsAdmin(c);
  if(id==='design')renderDesignAdmin(c);
  if(id==='business')renderBusinessAdmin(c);
  if(id==='trip')renderTripAdmin(c);
  if(id==='orders')renderOrdersAdmin(c);
  if(id==='review')renderPaymentReviewAdmin(c);
  if(id==='receipts')renderReceiptsAdmin(c);
  if(id==='audit')renderAuditAdmin(c);
  if(id==='integrations')renderIntegrationsAdmin(c);
}
function renderProductsAdmin(c){c.innerHTML=`<div class="toolbar"><button class="btn" id="newProduct">${UI.plus}<span>Nuevo producto</span></button></div><div class="section-card" id="productFormWrap" style="display:${editingProductId?'block':'none'}">${productFormHtml()}</div><div class="section-card"><h3>Productos</h3>${state.products.map(p=>`<div class="product-admin"><div class="product-visual" style="width:54px;height:54px">${productVisual(p)}</div><div><strong>${esc(p.name)}</strong><div class="small muted">${esc(p.category)} · ${money(p.price)} · Stock ${p.stock} · ${p.active?'Activo':'Inactivo'}</div><div class="row" style="margin-top:6px"><button class="icon-btn" data-stock-dec="${p.id}">${UI.minus}</button><button class="icon-btn" data-stock-inc="${p.id}">${UI.plus}</button></div></div><div class="row"><button class="icon-btn" data-edit-product="${p.id}">${UI.edit}</button><button class="icon-btn" data-delete-product="${p.id}">${UI.trash}</button></div></div>`).join('')}</div>`;bindProductAdmin()}
function productFormHtml(){const p=state.products.find(x=>x.id===editingProductId)||{name:'',description:'',category:'',price:0,stock:0,icon:'plate',image:'',active:true};return `<h3>${editingProductId?'Editar producto':'Nuevo producto'}</h3><div class="admin-grid two"><div><div class="field"><label>Nombre</label><input class="input" id="apName" value="${esc(p.name)}"></div><div class="field"><label>Descripción</label><textarea class="textarea" id="apDesc">${esc(p.description)}</textarea></div><div class="field"><label>Categoría</label><input class="input" id="apCategory" value="${esc(p.category)}"></div><div class="field"><label>Precio</label><input class="input" id="apPrice" type="number" min="0" step="0.01" value="${p.price}"></div><div class="field"><label>Stock</label><input class="input" id="apStock" type="number" min="0" step="1" value="${p.stock}"></div><label class="row"><input type="checkbox" id="apActive" ${p.active?'checked':''}><span>Producto activo</span></label><label class="row"><input type="checkbox" id="apDelivery" ${p.deliveryAvailable!==false?'checked':''}><span>Permitir entrega a domicilio</span></label><div class="field" style="margin-top:12px"><label>Fondo de tarjeta del producto</label><div class="row"><input id="apBackground" type="color" value="${/^#[0-9a-fA-F]{6}$/.test(p.backgroundColor||'')?p.backgroundColor:'#242a33'}" style="height:40px;width:68px"><span class="small muted">Solo administrador. Se guarda en Supabase.</span></div></div><p class="small muted">Desactívalo para artículos exclusivos de recogida en el local.</p></div><div><div class="field"><label>Biblioteca de iconos SVG</label><div class="icon-pack-tabs">${['Todos',...Object.keys(FOOD_PACKS)].map(pack=>`<button class="icon-pack-btn ${activeFoodPack===pack?'active':''}" data-icon-pack="${pack}" type="button">${pack}</button>`).join('')}</div><div class="icon-picker" id="iconPicker">${foodIconKeys().map(k=>`<button class="icon-option ${p.icon===k&&!p.image?'selected':''}" data-icon="${k}" title="${k}" type="button">${FOOD[k]}</button>`).join('')}</div></div><div class="field"><label>Imagen propia PNG, JPG o SVG</label><label class="btn secondary" for="apImage">${UI.upload}<span>Subir imagen</span></label><input class="hidden" type="file" id="apImage" accept="image/png,image/jpeg,image/svg+xml"><input type="hidden" id="apImageData" value="${esc(p.image||'')}"></div></div></div><div class="toolbar"><button class="btn" id="saveProduct">${UI.save}<span>Guardar</span></button><button class="btn ghost" id="cancelProduct">${UI.close}<span>Cancelar</span></button></div>`}
function bindProductAdmin(){
document.querySelectorAll('[data-icon-pack]').forEach(b=>b.onclick=()=>{activeFoodPack=b.dataset.iconPack;renderProductsAdmin(document.getElementById('adminContent'));if(editingProductId!==null)document.getElementById('productFormWrap').style.display='block'});
const n=document.getElementById('newProduct');if(n)n.onclick=()=>{editingProductId='';renderProductsAdmin(document.getElementById('adminContent'));document.getElementById('productFormWrap').style.display='block'};document.querySelectorAll('[data-edit-product]').forEach(b=>b.onclick=()=>{editingProductId=b.dataset.editProduct;renderProductsAdmin(document.getElementById('adminContent'))});document.querySelectorAll('[data-delete-product]').forEach(b=>b.onclick=()=>{if(confirm('¿Eliminar este producto?')){state.products=state.products.filter(p=>p.id!==b.dataset.deleteProduct);delete state.cart[b.dataset.deleteProduct];save();renderProductsAdmin(document.getElementById('adminContent'));renderCatalog()}});document.querySelectorAll('[data-stock-inc]').forEach(b=>b.onclick=()=>quickStock(b.dataset.stockInc,1));document.querySelectorAll('[data-stock-dec]').forEach(b=>b.onclick=()=>quickStock(b.dataset.stockDec,-1));document.querySelectorAll('.icon-option').forEach(b=>b.onclick=()=>{document.querySelectorAll('.icon-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');document.getElementById('apImageData').value='';b.dataset.chosen='1'});const image=document.getElementById('apImage');if(image)image.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{document.getElementById('apImageData').value=r.result;document.querySelectorAll('.icon-option').forEach(x=>x.classList.remove('selected'))};r.readAsDataURL(f)};const sp=document.getElementById('saveProduct');if(sp)sp.onclick=saveProductForm;const cp=document.getElementById('cancelProduct');if(cp)cp.onclick=()=>{editingProductId=null;renderProductsAdmin(document.getElementById('adminContent'))}}
function quickStock(id,d){const p=state.products.find(x=>x.id===id);if(!p)return;p.stock=Math.max(0,p.stock+d);save();renderProductsAdmin(document.getElementById('adminContent'));renderCatalog()}
function saveProductForm(){const selected=document.querySelector('.icon-option.selected');const obj={id:editingProductId||crypto.randomUUID(),name:document.getElementById('apName').value.trim(),description:document.getElementById('apDesc').value.trim(),category:document.getElementById('apCategory').value.trim(),price:Number(document.getElementById('apPrice').value),stock:Math.max(0,Math.floor(Number(document.getElementById('apStock').value))),icon:selected?.dataset.icon||'plate',image:document.getElementById('apImageData').value,active:document.getElementById('apActive').checked,deliveryAvailable:document.getElementById('apDelivery')?.checked!==false,backgroundColor:document.getElementById('apBackground')?.value||''};if(!obj.name||!obj.category||obj.price<0){toast('Completa nombre, categoría y precio válido.','error');return}const i=state.products.findIndex(x=>x.id===obj.id);if(i>=0)state.products[i]=obj;else state.products.push(obj);editingProductId=null;save();renderProductsAdmin(document.getElementById('adminContent'));renderCategories();renderCatalog();toast('Producto guardado.','ok')}
const palettes=[['Clásica rojo','#c62828','#fff3f3','#ffb300','#232323','#ffffff'],['Verde fresco','#197a4b','#effbf3','#f2b134','#1f2a24','#ffffff'],['Naranja cálido','#d65f16','#fff4e8','#9d4edd','#2c231d','#ffffff'],['Oscuro elegante','#27272a','#3f3f46','#d4af37','#f4f4f5','#18181b'],['Azul marino','#16324f','#edf4fb','#f0a202','#18212a','#ffffff'],['Rosa pastel','#b85c7f','#fff0f6','#7b61a8','#3a2630','#ffffff']];
function renderDesignAdmin(c){const d=state.config.design;c.innerHTML=`<div class="section-card"><h3>Paletas predefinidas</h3><div class="palette-grid">${palettes.map((p,i)=>`<button class="palette-card" data-palette="${i}"><strong>${p[0]}</strong><div class="swatches">${p.slice(1).map(x=>`<span style="background:${x}"></span>`).join('')}</div></button>`).join('')}</div></div><div class="section-card"><h3>Colores personalizados</h3><div class="color-grid">${[['Primario','primary'],['Secundario','secondary'],['Acento','accent'],['Texto','text'],['Fondo tarjetas','card'],['Fondo sitio','siteBg'],['Iconos producto','iconColor']].map(([lab,key])=>`<label class="color-input"><input type="color" data-design="${key}" value="${d[key]}"><span>${lab}</span></label>`).join('')}</div></div><div class="section-card"><h3>Fondo del sitio</h3><div class="field"><label>Tipo</label><select class="select" id="bgType"><option value="solid" ${d.bgType==='solid'?'selected':''}>Color sólido</option><option value="gradient" ${d.bgType==='gradient'?'selected':''}>Degradado</option><option value="image" ${d.bgType==='image'?'selected':''}>Imagen</option></select></div><div class="admin-grid two"><div class="field"><label>Color 1</label><input type="color" class="input" id="grad1" value="${d.grad1}"></div><div class="field"><label>Color 2</label><input type="color" class="input" id="grad2" value="${d.grad2}"></div></div><div class="field"><label>Ángulo del degradado</label><input class="input" id="gradAngle" type="range" min="0" max="360" value="${d.gradAngle}"></div><div class="field"><label>Imagen de fondo</label><label class="btn secondary" for="bgImage">${UI.upload}<span>Subir imagen</span></label><input class="hidden" id="bgImage" type="file" accept="image/*"></div><div class="field"><label>Opacidad de imagen</label><input class="input" id="bgOpacity" type="range" min="0" max="1" step="0.05" value="${d.bgOpacity}"></div><label class="row"><input type="checkbox" id="pattern" ${d.pattern?'checked':''}><span>Patrón de ilustraciones de comida</span></label><div class="field"><label>Opacidad del patrón</label><input class="input" id="patternOpacity" type="range" min="0" max="0.2" step="0.005" value="${d.patternOpacity}"></div></div><div class="section-card"><h3>Tipografía e iconos</h3><div class="admin-grid two"><div class="field"><label>Tipografía</label><select class="select" id="fontSelect">${['Inter','Nunito','Poppins','Roboto'].map(f=>`<option ${d.font===f?'selected':''}>${f}</option>`).join('')}</select></div><div class="field"><label>Tamaño de iconos de producto</label><input class="input" id="iconSize" type="range" min="54" max="110" value="${d.iconSize}"></div></div><label class="row"><input type="checkbox" id="rounded" ${d.rounded?'checked':''}><span>Bordes redondeados</span></label></div><div class="section-card"><h3>Vista previa</h3><div class="product-card"><div class="product-visual">${FOOD.burger}</div><div class="product-body"><div class="product-head"><h3 class="product-name">Producto de muestra</h3><div class="price">${money(99)}</div></div><p class="desc">La vista previa cambia con tu diseño.</p><button class="btn">${UI.cart}<span>Agregar</span></button></div></div></div><div class="toolbar"><button class="btn ghost" id="resetDesign">${UI.refresh}<span>Restablecer diseño</span></button></div>`;bindDesignAdmin()}
function bindDesignAdmin(){document.querySelectorAll('[data-palette]').forEach(b=>b.onclick=()=>{const p=palettes[Number(b.dataset.palette)],d=state.config.design;[d.primary,d.secondary,d.accent,d.text,d.card]=p.slice(1);d.iconColor=d.primary;save();applyDesign();renderDesignAdmin(document.getElementById('adminContent'))});document.querySelectorAll('[data-design]').forEach(i=>i.oninput=e=>{state.config.design[e.target.dataset.design]=e.target.value;save();applyDesign()});const ids=['bgType','grad1','grad2','gradAngle','bgOpacity','pattern','patternOpacity','fontSelect','iconSize','rounded'];ids.forEach(id=>{const el=document.getElementById(id);if(!el)return;const evt=el.type==='range'||el.type==='color'?'input':'change';el.addEventListener(evt,()=>{const d=state.config.design;if(id==='pattern'||id==='rounded')d[id]=el.checked;else if(id==='fontSelect')d.font=el.value;else if(id==='iconSize')d.iconSize=Number(el.value);else if(id==='gradAngle')d.gradAngle=Number(el.value);else if(id==='bgOpacity'||id==='patternOpacity')d[id]=Number(el.value);else d[id]=el.value;save();applyDesign()})});document.getElementById('bgImage').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{state.config.design.bgImage=r.result;state.config.design.bgType='image';save();applyDesign();renderDesignAdmin(document.getElementById('adminContent'))};r.readAsDataURL(f)};document.getElementById('resetDesign').onclick=()=>{state.config.design=deepClone(defaults.config.design);save();applyDesign();renderDesignAdmin(document.getElementById('adminContent'));renderHeader()}}
function renderBusinessAdmin(c){const cfg=state.config;c.innerHTML=`<div class="section-card"><h3>Identidad</h3><div class="admin-grid two"><div class="field"><label>Nombre del negocio</label><input class="input" id="bizName" value="${esc(cfg.businessName)}"></div><div class="field"><label>Eslogan</label><input class="input" id="bizTagline" value="${esc(cfg.tagline)}"></div></div><div class="field"><label>Logo</label><label class="btn secondary" for="bizLogo">${UI.upload}<span>Subir logo</span></label><input class="hidden" id="bizLogo" type="file" accept="image/*"></div><button class="btn" id="saveIdentity">${UI.save}<span>Guardar identidad</span></button></div><div class="section-card"><h3>WhatsApp y acceso</h3><div class="admin-grid two"><div class="field"><label>Número de WhatsApp</label><input class="input" id="bizWhatsapp" value="${esc(cfg.whatsapp)}"></div><div class="field"><label>Nuevo PIN</label><input class="input" id="bizPin" type="password" value="${esc(cfg.adminPin)}"></div></div><button class="btn" id="saveAccess">${UI.save}<span>Guardar</span></button></div><div class="section-card"><h3>Métodos de pago</h3><div id="paymentAdmin">${cfg.payments.map(p=>`<div class="admin-grid two" style="margin-bottom:8px"><input class="input" data-pay-title="${p.id}" value="${esc(p.title)}"><div class="row"><input class="input" data-pay-data="${p.id}" value="${esc(p.data)}"><button class="icon-btn" data-pay-delete="${p.id}">${UI.trash}</button></div></div>`).join('')}</div><div class="toolbar"><button class="btn secondary" id="addPayment">${UI.plus}<span>Agregar método</span></button><button class="btn" id="savePayments">${UI.save}<span>Guardar métodos</span></button></div></div><div class="section-card"><h3>Origen del negocio</h3><div class="field"><label>Dirección</label><input class="input" id="originAddress" value="${esc(cfg.origin.address)}"></div><button class="btn secondary" id="geocodeOrigin">${UI.pin}<span>Ubicar dirección</span></button><div class="small muted" style="margin:8px 0">También puedes dar clic en el mapa o mover el marcador.</div><div id="originMap" class="map"></div><label class="row" style="margin-top:10px"><input type="checkbox" id="deliveryEnabled" ${cfg.deliveryEnabled?'checked':''}><span>Activar envío a domicilio</span></label></div>`;bindBusinessAdmin();setTimeout(initOriginMap,100)}
function bindBusinessAdmin(){const adminStatus=document.getElementById('adminSupabaseStatus');if(adminStatus){adminStatus.dataset.kind=supabaseConnectionState==='ok'?'ok':supabaseConnectionState==='error'?'error':'warn';adminStatus.innerHTML=(supabaseConnectionState==='ok'?UI.check:supabaseConnectionState==='error'?UI.close:UI.database)+`<span>${esc(supabaseLastError||'Supabase listo.')}</span>`}
document.getElementById('retrySupabase').onclick=async()=>{try{await initSupabase();toast('Prueba de Supabase completada.','ok');renderBusinessAdmin(document.getElementById('adminContent'))}catch(e){toast(explainSupabaseError(e),'error')}};
  document.getElementById('saveIdentity').onclick=()=>{state.config.businessName=document.getElementById('bizName').value.trim()||defaults.config.businessName;state.config.tagline=document.getElementById('bizTagline').value.trim();save();renderHeader();toast('Identidad guardada.','ok')};document.getElementById('bizLogo').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{state.config.logo=r.result;save();renderHeader()};r.readAsDataURL(f)};document.getElementById('saveAccess').onclick=()=>{const w=document.getElementById('bizWhatsapp').value.replace(/\D/g,''),p=document.getElementById('bizPin').value.trim();if(!w||!p){toast('Completa WhatsApp y PIN.','error');return}state.config.whatsapp=w;state.config.adminPin=p;save();toast('Datos de acceso guardados.','ok')};document.getElementById('addPayment').onclick=()=>{state.config.payments.push({id:uid('pay'),title:'Nuevo método',data:'Dato para copiar'});save();renderBusinessAdmin(document.getElementById('adminContent'))};document.getElementById('savePayments').onclick=()=>{state.config.payments.forEach(p=>{p.title=document.querySelector(`[data-pay-title="${p.id}"]`)?.value.trim()||p.title;p.data=document.querySelector(`[data-pay-data="${p.id}"]`)?.value.trim()||p.data});save();toast('Métodos guardados.','ok')};document.querySelectorAll('[data-pay-delete]').forEach(b=>b.onclick=()=>{state.config.payments=state.config.payments.filter(p=>p.id!==b.dataset.payDelete);save();renderBusinessAdmin(document.getElementById('adminContent'))});document.getElementById('geocodeOrigin').onclick=()=>geocodeAddress(document.getElementById('originAddress').value,'origin');document.getElementById('deliveryEnabled').onchange=e=>{state.config.deliveryEnabled=e.target.checked;save()}}
function initOriginMap(){if(!document.getElementById('originMap')||typeof L==='undefined')return;if(originMap){originMap.remove();originMap=null}const o=state.config.origin;originMap=L.map('originMap',{rotate:true,touchRotate:true,dragRotate:true,shiftKeyRotate:true,rotateControl:{position:"topright",behavior:"reset",closeOnZeroBearing:false}}).setView([o.lat,o.lng],14);if(!addConfiguredTileLayer(originMap,'originMap')){originMap.remove();originMap=null;return;}originMarker=L.marker([o.lat,o.lng],{draggable:true}).addTo(originMap);const set=e=>{const ll=e.latlng||e.target.getLatLng();state.config.origin.lat=ll.lat;state.config.origin.lng=ll.lng;save()};originMap.on('click',e=>{originMarker.setLatLng(e.latlng);set(e)});originMarker.on('dragend',set)}
function renderTripAdmin(c){const s=state.config.shipping;c.innerHTML=`<div class="section-card"><h3>Ruta y distancia</h3><div class="field"><label>Origen</label><input class="input" value="${esc(state.config.origin.address)}" disabled></div><div class="field"><label>Destino</label><input class="input" id="tripDestination" placeholder="Escribe una dirección"></div><button class="btn secondary" id="tripGeocode">${UI.pin}<span>Buscar destino</span></button><div class="small muted" style="margin:8px 0">También puedes dar clic en el mapa para fijar el destino.</div><div id="tripMap" class="map"></div><label class="row" style="margin-top:10px"><input type="checkbox" id="roundTrip" ${s.roundTrip?'checked':''}><span>Ida y vuelta</span></label></div><div class="section-card"><h3>Vehículo y combustible</h3><div class="field"><label>Vehículo</label><select class="select" id="vehicle"><option value="moto" ${s.vehicle==='moto'?'selected':''}>Moto</option><option value="auto" ${s.vehicle==='auto'?'selected':''}>Auto</option><option value="truck" ${s.vehicle==='truck'?'selected':''}>Camioneta</option><option value="bike" ${s.vehicle==='bike'?'selected':''}>Bicicleta u otro</option></select></div><div class="admin-grid two">${[['Moto','moto',UI.moto],['Auto','auto',UI.car],['Camioneta','truck',UI.truck],['Bicicleta u otro','bike',UI.bike]].map(([lab,key,ico])=>`<div class="field"><label class="row">${ico}<span>${lab} km/l</span></label><input class="input" type="number" step="0.1" data-eff="${key}" value="${s.efficiency[key]}"></div>`).join('')}</div><div class="field"><label>Combustible</label><select class="select" id="fuelType">${['Magna','Premium','Diésel'].map(f=>`<option ${s.fuel===f?'selected':''}>${f}</option>`).join('')}</select></div><div class="admin-grid two">${['Magna','Premium','Diésel'].map(f=>`<div class="field"><label>${f} precio por litro</label><input class="input" type="number" step="0.01" data-fuel="${f}" value="${s.fuelPrice[f]}"></div>`).join('')}</div></div><div class="section-card"><h3>Tarifa de envío</h3><div class="admin-grid two"><div class="field"><label>Costo base</label><input class="input" id="shipBase" type="number" step="0.01" value="${s.base}"></div><div class="field"><label>Tarifa por km</label><input class="input" id="shipPerKm" type="number" step="0.01" value="${s.perKm}"></div><div class="field"><label>Margen de ganancia</label><input class="input" id="shipMargin" type="number" step="0.1" value="${s.margin}"></div><div class="field"><label>Redondeo</label><input class="input" id="shipRound" type="number" step="1" value="${s.rounding}"></div><div class="field"><label>Envío gratis desde</label><input class="input" id="shipFree" type="number" step="1" value="${s.freeFrom}"></div></div></div><div class="section-card"><h3>Resultado</h3><div class="result-grid"><div class="metric"><strong id="resKm">0.00 km</strong><span>Distancia</span></div><div class="metric"><strong id="resLiters">0.00 l</strong><span>Litros</span></div><div class="metric"><strong id="resFuel">${money(0)}</strong><span>Costo combustible</span></div><div class="metric"><strong id="resSuggested">${money(0)}</strong><span>Envío sugerido</span></div></div><div class="toolbar" style="margin-top:12px"><button class="btn" id="useRate">${UI.save}<span>Usar esta tarifa</span></button></div></div>`;bindTripAdmin();setTimeout(initTripMap,100)}
let tripKm=0;
function bindTripAdmin(){document.getElementById('tripGeocode').onclick=()=>geocodeAddress(document.getElementById('tripDestination').value,'trip');document.getElementById('roundTrip').onchange=e=>{state.config.shipping.roundTrip=e.target.checked;save();recalcTrip()};document.querySelectorAll('[data-eff]').forEach(i=>i.oninput=e=>{state.config.shipping.efficiency[e.target.dataset.eff]=Number(e.target.value)||0;recalcTrip()});document.querySelectorAll('[data-fuel]').forEach(i=>i.oninput=e=>{state.config.shipping.fuelPrice[e.target.dataset.fuel]=Number(e.target.value)||0;recalcTrip()});document.getElementById('vehicle').onchange=e=>{state.config.shipping.vehicle=e.target.value;recalcTrip()};document.getElementById('fuelType').onchange=e=>{state.config.shipping.fuel=e.target.value;recalcTrip()};['shipBase','shipPerKm','shipMargin','shipRound','shipFree'].forEach(id=>document.getElementById(id).oninput=recalcTrip);document.getElementById('useRate').onclick=()=>{const s=state.config.shipping;s.base=Number(document.getElementById('shipBase').value)||0;s.perKm=Number(document.getElementById('shipPerKm').value)||0;s.margin=Number(document.getElementById('shipMargin').value)||0;s.rounding=Number(document.getElementById('shipRound').value)||0;s.freeFrom=Number(document.getElementById('shipFree').value)||0;save();toast('Tarifa de envío guardada.','ok')}}
function initTripMap(){if(!document.getElementById('tripMap')||typeof L==='undefined')return;if(tripMap){tripMap.remove();tripMap=null}const o=state.config.origin;tripMap=L.map('tripMap',{rotate:true,touchRotate:true,dragRotate:true,shiftKeyRotate:true,rotateControl:{position:"topright",behavior:"reset",closeOnZeroBearing:false}}).setView([o.lat,o.lng],13);if(!addConfiguredTileLayer(tripMap,'tripMap')){tripMap.remove();tripMap=null;return;}tripOriginMarker=L.marker([o.lat,o.lng]).addTo(tripMap);tripMap.on('click',e=>setTripDestination(e.latlng.lat,e.latlng.lng))}
async function setTripDestination(lat,lng){if(!tripMap)return;if(tripDestMarker)tripDestMarker.setLatLng([lat,lng]);else tripDestMarker=L.marker([lat,lng],{draggable:true}).addTo(tripMap);tripDestMarker.on('dragend',e=>{const ll=e.target.getLatLng();setTripDestination(ll.lat,ll.lng)});const o=state.config.origin,res=await routeDistance(o.lat,o.lng,lat,lng);tripKm=res.km;if(tripRouteLayer){tripMap.removeLayer(tripRouteLayer);tripRouteLayer=null}if(res.geo){tripRouteLayer=L.geoJSON(res.geo).addTo(tripMap);tripMap.fitBounds(tripRouteLayer.getBounds(),{padding:[20,20]})}recalcTrip();if(res.fallback)toast('La ruta no respondió. Se usa una estimación de respaldo.','error')}
function recalcTrip(){const s=state.config.shipping,km=tripKm*(document.getElementById('roundTrip')?.checked?2:1),veh=document.getElementById('vehicle')?.value||s.vehicle,fuel=document.getElementById('fuelType')?.value||s.fuel,eff=Number(document.querySelector(`[data-eff="${veh}"]`)?.value)||s.efficiency[veh],price=Number(document.querySelector(`[data-fuel="${fuel}"]`)?.value)||s.fuelPrice[fuel],liters=veh==='bike'?0:km/Math.max(eff,.1),fuelCost=liters*price,base=Number(document.getElementById('shipBase')?.value)||0,per=Number(document.getElementById('shipPerKm')?.value)||0,margin=Number(document.getElementById('shipMargin')?.value)||0,round=Number(document.getElementById('shipRound')?.value)||0;let suggested=(base+km*per+fuelCost)*(1+margin/100);if(round>0)suggested=Math.ceil(suggested/round)*round;document.getElementById('resKm').textContent=`${km.toFixed(2)} km`;document.getElementById('resLiters').textContent=`${liters.toFixed(2)} l`;document.getElementById('resFuel').textContent=money(fuelCost);document.getElementById('resSuggested').textContent=money(suggested)}
function renderOrdersAdmin(c){c.innerHTML=`<div class="section-card"><h3>Historial de pedidos</h3><div class="table-wrap"><table class="admin-table"><thead><tr><th>Folio</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${state.orders.length?state.orders.map(o=>`<tr><td>${esc(o.folio)}</td><td>${esc(new Date(o.date).toLocaleString('es-MX'))}</td><td>${esc(o.customer.name)}</td><td>${money(o.total)}</td><td><span class="status-badge status-${o.status}">${o.status==='pendiente'?UI.pending:o.status==='pagado'?UI.paid:UI.delivered}<span>${o.status}</span></span></td><td><div class="row"><select class="select" data-order-status="${o.id}"><option value="pendiente" ${o.status==='pendiente'?'selected':''}>Pendiente</option><option value="pagado" ${o.status==='pagado'?'selected':''}>Pagado</option><option value="entregado" ${o.status==='entregado'?'selected':''}>Entregado</option></select><button class="icon-btn" data-reprint="${o.id}">${UI.download}</button></div></td></tr>`).join(''):`<tr><td colspan="6">Todavía no hay pedidos.</td></tr>`}</tbody></table></div></div><div class="section-card"><h3>Respaldo</h3><div class="toolbar"><button class="btn" id="exportJson">${UI.download}<span>Exportar JSON</span></button><label class="btn secondary" for="importJson">${UI.upload}<span>Importar JSON</span></label><input class="hidden" id="importJson" type="file" accept="application/json"></div></div>`;document.querySelectorAll('[data-order-status]').forEach(s=>s.onchange=e=>{const o=state.orders.find(x=>x.id===e.target.dataset.orderStatus);if(o){o.status=e.target.value;save();renderOrdersAdmin(document.getElementById('adminContent'))}});document.querySelectorAll('[data-reprint]').forEach(b=>b.onclick=()=>reprintOrder(b.dataset.reprint));document.getElementById('exportJson').onclick=exportJson;document.getElementById('importJson').onchange=importJson}
function exportJson(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='respaldo-catalogo-comida.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function importJson(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result);state=merge(defaults,data);save();applyDesign();renderHeader();renderCategories();renderCatalog();renderOrdersAdmin(document.getElementById('adminContent'));toast('Respaldo importado.','ok')}catch(err){toast('El archivo JSON no es válido.','error')}};r.readAsText(f)}



/* ==============================
   CENTRO DE ORDENES Y COMPROBANTES V5
============================== */
const PAYMENT_LABELS={
  WAITING_PAYMENT:'Esperando comprobante',
  PROCESSING:'Procesando comprobante',
  PENDING_REVIEW:'En revisión',EXPIRED_REVIEW:'Vencido sin revisión',
  APPROVED:'Pago aprobado',
  REJECTED:'Pago rechazado'
};
function paymentBadge(status){
  const s=PAYMENT_LABELS[status]?status:'WAITING_PAYMENT';
  const ico=s==='APPROVED'?UI.check:s==='REJECTED'?UI.close:s==='PENDING_REVIEW'?UI.review:UI.pending;
  return `<span class="payment-status ps-${s}">${ico}<span>${PAYMENT_LABELS[s]}</span></span>`;
}
async function safeSelect(table,query='*',opts={}){
  if(!supabaseClient||!adminSession)throw new Error('Inicia sesión como administrador.');
  let q=supabaseClient.from(table).select(query);
  if(opts.order)q=q.order(opts.order,{ascending:opts.ascending??false});
  if(opts.limit)q=q.limit(opts.limit);
  const {data,error}=await q;
  if(error)throw error;
  return data||[];
}
async function renderAdminDashboard(c){
  const panelRequestToken=panelEpoch;
  c.innerHTML=`<div class="section-card"><h3>Centro de órdenes</h3><div class="notice">El panel web administra pedidos y comprobantes. Telegram queda como canal interno y nunca se muestra al cliente.</div></div><div class="admin-dashboard" id="adminKpis"></div><div class="section-card"><h3>Órdenes recientes</h3><div id="adminRecent">Cargando...</div></div>`;
  try{
    const orders=await safeSelect('orders','id,folio,public_id,customer_name,total,payment_status,status,created_at',{order:'created_at',limit:100});
    if(panelRequestToken!==panelEpoch)return;
    const counts={all:orders.length,WAITING_PAYMENT:0,PROCESSING:0,PENDING_REVIEW:0,APPROVED:0,REJECTED:0};
    orders.forEach(o=>counts[o.payment_status||'WAITING_PAYMENT']=(counts[o.payment_status||'WAITING_PAYMENT']||0)+1);
    document.getElementById('adminKpis').innerHTML=[
      ['Total',counts.all,UI.orders],['En revisión',counts.PENDING_REVIEW,UI.review],['Aprobadas',counts.APPROVED,UI.check],['Rechazadas',counts.REJECTED,UI.close],['Procesando',counts.PROCESSING,UI.pending]
    ].map(([l,v,i])=>`<div class="admin-kpi">${i}<span>${l}</span><strong>${v}</strong></div>`).join('');
    document.getElementById('adminRecent').innerHTML=orders.length?`<div class="table-wrap"><table class="admin-table"><thead><tr><th>Orden</th><th>Cliente</th><th>Total</th><th>Pago</th><th>Fecha</th></tr></thead><tbody>${orders.slice(0,12).map(o=>`<tr><td>${esc(o.public_id||o.folio)}</td><td>${esc(o.customer_name||'')}</td><td>${money(o.total)}</td><td>${paymentBadge(o.payment_status||'WAITING_PAYMENT')}</td><td>${new Date(o.created_at).toLocaleString('es-MX')}</td></tr>`).join('')}</tbody></table></div>`:'Todavía no hay órdenes.';
  }catch(e){
    if(panelRequestToken!==panelEpoch)return;document.getElementById('adminKpis').innerHTML='';
    document.getElementById('adminRecent').innerHTML=`<div class="notice">Ejecuta la migración V5 para habilitar el centro de órdenes. ${esc(e.message||'')}</div>`;
  }
}
async function setPaymentDecision(orderId,status,reason=''){
  if(!['APPROVED','REJECTED','PENDING_REVIEW'].includes(status))return;
  const patch={payment_status:status,rejection_reason:status==='REJECTED'?reason:null,approved_at:status==='APPROVED'?new Date().toISOString():null,rejected_at:status==='REJECTED'?new Date().toISOString():null,reviewed_by:adminSession?.user?.id||null};
  const {error}=await supabaseClient.from('orders').update(patch).eq('id',orderId);
  if(error)throw error;
  await supabaseClient.from('order_events').insert({order_id:orderId,event_type:status==='APPROVED'?'PAYMENT_APPROVED':status==='REJECTED'?'PAYMENT_REJECTED':'PAYMENT_REVIEW',new_status:status,source:'WEB',user_id:adminSession?.user?.id||null,metadata:{reason}});
}
async function renderPaymentReviewAdmin(c){
  const panelRequestToken=panelEpoch;
  c.innerHTML=`<div class="section-card"><h3>Revisión de pagos</h3><div class="notice">La imagen del comprobante es evidencia auxiliar. La aprobación final se registra como decisión administrativa y queda auditada.</div></div><div class="review-list" id="reviewList">Cargando...</div>`;
  try{
    const [orders,receipts]=await Promise.all([
      safeSelect('orders','id,folio,public_id,customer_name,total,expected_amount,payment_status,created_at',{order:'created_at',limit:250}),
      safeSelect('receipts','*',{order:'created_at',limit:250})
    ]);
    if(panelRequestToken!==panelEpoch)return;
    const rm=new Map();receipts.forEach(r=>{if(!rm.has(String(r.order_id)))rm.set(String(r.order_id),r)});
    const pending=orders.filter(o=>['PROCESSING','PENDING_REVIEW','EXPIRED_REVIEW','REJECTED','WAITING_PAYMENT'].includes(o.payment_status||'WAITING_PAYMENT'));
    const list=document.getElementById('reviewList');
    list.innerHTML=pending.length?pending.map(o=>{const r=rm.get(String(o.id));return `<article class="review-card"><div class="review-card-head"><div><strong>${esc(o.public_id||o.folio)}</strong><div class="small muted">${esc(o.customer_name||'')}</div></div>${paymentBadge(o.payment_status||'WAITING_PAYMENT')}</div><div class="review-meta"><span>Esperado: ${money(o.expected_amount??o.total)}</span>${r?.detected_amount!=null?`<span>Detectado: ${money(r.detected_amount)}</span>`:''}${r?.detected_bank?`<span>Banco: ${esc(r.detected_bank)}</span>`:''}${r?.detected_reference?`<span>Referencia: ${esc(r.detected_reference)}</span>`:''}${r?.confidence!=null?`<span>Confianza: ${Math.round(Number(r.confidence)*100)}%</span>`:''}</div><div class="review-actions">${r?`<button class="btn secondary" data-view-receipt="${r.id}">${UI.receipt}<span>Ver comprobante</span></button>`:''}<button class="btn success" data-payment-approve="${o.id}">${UI.check}<span>Aprobar</span></button><button class="btn danger" data-payment-reject="${o.id}">${UI.close}<span>Rechazar</span></button></div></article>`}).join(''):`<div class="notice">No hay pagos pendientes de revisión.</div>`;
    document.querySelectorAll('[data-payment-approve]').forEach(b=>b.onclick=async()=>{try{await setPaymentDecision(b.dataset.paymentApprove,'APPROVED');toast('Pago aprobado.','ok');renderPaymentReviewAdmin(c)}catch(e){toast(e.message,'error')}});
    document.querySelectorAll('[data-payment-reject]').forEach(b=>b.onclick=async()=>{const reason=prompt('Motivo del rechazo:','Comprobante no válido')||'Rechazado por administrador';try{await setPaymentDecision(b.dataset.paymentReject,'REJECTED',reason);toast('Pago rechazado.','ok');renderPaymentReviewAdmin(c)}catch(e){toast(e.message,'error')}});
    document.querySelectorAll('[data-view-receipt]').forEach(b=>b.onclick=()=>openReceiptSecure(b.dataset.viewReceipt));
  }catch(e){if(panelRequestToken!==panelEpoch)return;document.getElementById('reviewList').innerHTML=`<div class="notice">No se pudo cargar revisión de pagos. ${esc(e.message||'')}</div>`}
}
async function openReceiptSecure(receiptId){
  try{
    const {data:r,error}=await supabaseClient.from('receipts').select('file_path,file_url').eq('id',receiptId).single();
    if(error)throw error;
    if(r.file_path){
      const {data,error:se}=await supabaseClient.storage.from('receipts-private').createSignedUrl(r.file_path,120);
      if(se)throw se;
      window.open(data.signedUrl,'_blank','noopener');
    }else if(r.file_url){window.open(r.file_url,'_blank','noopener')}
  }catch(e){toast('No se pudo abrir el comprobante.','error')}
}
async function renderReceiptsAdmin(c){
  const panelRequestToken=panelEpoch;
  c.innerHTML=`<div class="section-card"><h3>Comprobantes</h3><div class="notice">Los archivos se mantienen privados y se abren mediante enlaces firmados temporales.</div></div><div id="receiptsAdmin">Cargando...</div>`;
  try{
    const [receipts,orders]=await Promise.all([safeSelect('receipts','*',{order:'created_at',limit:300}),safeSelect('orders','id,folio,public_id,customer_name,total')]);
    if(panelRequestToken!==panelEpoch)return;
    const om=new Map(orders.map(o=>[String(o.id),o]));
    document.getElementById('receiptsAdmin').innerHTML=receipts.length?`<div class="table-wrap"><table class="admin-table"><thead><tr><th>Orden</th><th>Archivo</th><th>Hash</th><th>Monto detectado</th><th>Banco</th><th>Confianza</th><th>Fecha</th><th></th></tr></thead><tbody>${receipts.map(r=>{const o=om.get(String(r.order_id));return `<tr><td>${esc(o?.public_id||o?.folio||r.order_id)}</td><td>${esc(r.original_name||'Comprobante')}</td><td>${esc((r.file_hash||'').slice(0,12))}</td><td>${r.detected_amount!=null?money(r.detected_amount):'Pendiente'}</td><td>${esc(r.detected_bank||'')}</td><td>${r.confidence!=null?Math.round(Number(r.confidence)*100)+'%':''}</td><td>${new Date(r.created_at).toLocaleString('es-MX')}</td><td><button class="icon-btn" data-view-receipt="${r.id}" aria-label="Ver">${UI.receipt}</button></td></tr>`}).join('')}</tbody></table></div>`:'<div class="notice">Todavía no hay comprobantes almacenados.</div>';
    document.querySelectorAll('[data-view-receipt]').forEach(b=>b.onclick=()=>openReceiptSecure(b.dataset.viewReceipt));
  }catch(e){if(panelRequestToken!==panelEpoch)return;document.getElementById('receiptsAdmin').innerHTML=`<div class="notice">Ejecuta la migración V5 para habilitar comprobantes. ${esc(e.message||'')}</div>`}
}
async function renderAuditAdmin(c){
  const panelRequestToken=panelEpoch;
  c.innerHTML=`<div class="section-card"><h3>Auditoría</h3><div class="notice">Historial de cambios de estado y decisiones administrativas.</div></div><div class="audit-list" id="auditList">Cargando...</div>`;
  try{
    const events=await safeSelect('order_events','*',{order:'created_at',limit:300});
    if(panelRequestToken!==panelEpoch)return;
    document.getElementById('auditList').innerHTML=events.length?events.map(e=>`<div class="audit-item"><strong>${esc(e.event_type||'EVENTO')}</strong> · ${esc(e.source||'SYSTEM')}<div class="small muted">${new Date(e.created_at).toLocaleString('es-MX')} · ${esc(e.old_status||'')} ${e.new_status?'→ '+esc(e.new_status):''}</div></div>`).join(''):'<div class="notice">Todavía no hay eventos registrados.</div>';
  }catch(e){if(panelRequestToken!==panelEpoch)return;document.getElementById('auditList').innerHTML=`<div class="notice">Ejecuta la migración V5 para habilitar auditoría. ${esc(e.message||'')}</div>`}
}
async function invokeTelegramAdmin(action){
  if(!supabaseClient||!adminSession)throw new Error('Inicia sesión como administrador.');
  const {data,error}=await supabaseClient.functions.invoke('telegram-admin',{body:{action}});
  if(error)throw error;
  if(data?.error)throw new Error(data.error);
  return data;
}
function renderIntegrationsAdmin(c){
  c.innerHTML=`<div class="integration-grid"><div class="integration-card">${UI.telegram}<h3>Telegram administrativo</h3><p class="small muted">Telegram es interno. El navegador nunca recibe el token del bot.</p><div class="code-note">TELEGRAM_BOT_TOKEN
TELEGRAM_ADMIN_CHAT_ID
TELEGRAM_ADMIN_USER_ID
TELEGRAM_WEBHOOK_SECRET
PUBLIC_SITE_URL</div><div class="toolbar" style="margin-top:12px"><button class="btn secondary" id="tgStatus">${UI.refresh}<span>Comprobar</span></button><button class="btn" id="tgWebhook">${UI.telegram}<span>Configurar webhook</span></button><button class="btn ghost" id="tgTest">${UI.telegram}<span>Mensaje de prueba</span></button></div><div id="tgResult" class="small muted"></div></div><div class="integration-card">${UI.shield}<h3>Validación de comprobantes</h3><p class="small muted">El sistema guarda hashes, datos detectados y señales de inconsistencia. La IA no tiene autoridad absoluta para aprobar un pago.</p><div class="code-note">WAITING_PAYMENT
PROCESSING
PENDING_REVIEW
APPROVED
REJECTED</div></div></div>`;
  const out=document.getElementById('tgResult');
  document.getElementById('tgStatus').onclick=async()=>{try{out.textContent='Consultando...';out.textContent=JSON.stringify(await invokeTelegramAdmin('status'))}catch(e){out.textContent=e.message}};
  document.getElementById('tgWebhook').onclick=async()=>{try{out.textContent='Configurando...';out.textContent=JSON.stringify(await invokeTelegramAdmin('set_webhook'))}catch(e){out.textContent=e.message}};
  document.getElementById('tgTest').onclick=async()=>{try{out.textContent='Enviando...';out.textContent=JSON.stringify(await invokeTelegramAdmin('test'))}catch(e){out.textContent=e.message}};
}
async function uploadReceiptForOrder(order){
  if(!checkout.proofFile||!supabaseClient)return {ok:false,skipped:true};
  try{
    const form=new FormData();
    form.append('public_id',order.publicId||order.public_id||order.folio);
    form.append('file',checkout.proofFile,checkout.proofName||checkout.proofFile.name);
    const {data,error}=await supabaseClient.functions.invoke('receipt-upload',{body:form});
    if(error)throw error;
    if(data?.error)throw new Error(data.error);
    return {ok:true,data};
  }catch(e){
    console.error('Receipt upload:',e);
    toast('El pedido se creó, pero el comprobante no pudo guardarse en el sistema. Conserva el archivo y avisa al negocio.','error');
    return {ok:false,error:e};
  }
}

/* ==============================
   SUPABASE: ADMIN, PEDIDOS Y SEGURIDAD
============================== */
async function adminSignOut(){
  if(supabaseClient)await supabaseClient.auth.signOut();
  adminSession=null;closeModal('adminModal');toast('Sesión administrativa cerrada.','ok');
}
function renderBusinessAdmin(c){
  const cfg=state.config,m=mapSettings(),email=adminSession?.user?.email||'';
  c.innerHTML=`<div class="section-card"><h3>Identidad</h3><div class="admin-grid two"><div class="field"><label>Nombre del negocio</label><input class="input" id="bizName" value="${esc(cfg.businessName)}"></div><div class="field"><label>Eslogan</label><input class="input" id="bizTagline" value="${esc(cfg.tagline)}"></div></div><div class="field"><label>Logo</label><label class="btn secondary" for="bizLogo">${UI.upload}<span>Subir logo</span></label><input class="hidden" id="bizLogo" type="file" accept="image/*"></div><button class="btn" id="saveIdentity">${UI.save}<span>Guardar identidad</span></button></div>
  <div class="section-card"><h3>WhatsApp</h3><div class="field"><label>Número internacional sin signo de suma</label><input class="input" id="bizWhatsapp" value="${esc(cfg.whatsapp)}"></div><button class="btn" id="saveAccess">${UI.save}<span>Guardar WhatsApp</span></button></div>
  <div class="section-card"><h3>Seguridad del administrador</h3><div class="notice">Sesión activa: ${esc(email||'Administrador')}</div><div class="admin-grid two" style="margin-top:10px"><div class="field"><label>Nueva contraseña</label><input class="input" id="newAdminPassword" type="password" autocomplete="new-password" minlength="8"></div><div class="field"><label>Confirmar nueva contraseña</label><input class="input" id="confirmAdminPassword" type="password" autocomplete="new-password" minlength="8"></div></div><div class="toolbar"><button class="btn" id="changePassword">${UI.lock}<span>Cambiar contraseña</span></button><button class="btn ghost" id="adminLogout">${UI.lock}<span>Cerrar sesión</span></button></div></div>
  <div class="section-card"><h3>Conexión Supabase</h3><div class="supabase-status" id="adminSupabaseStatus" data-kind="warn">${UI.database}<span>Estado de conexión pendiente.</span></div><div class="toolbar" style="margin-top:10px"><button class="btn secondary" id="retrySupabase">${UI.refresh}<span>Probar conexión</span></button></div></div><div class="section-card"><h3>CARTO</h3><div class="notice">Usa tu API key de CARTO Basemaps. La app agregará la clave automáticamente a las solicitudes de tiles y mantendrá visible la atribución de OpenStreetMap y CARTO.</div><div class="admin-grid two" style="margin-top:10px"><div class="field"><label>API key de CARTO</label><input class="input" id="cartoApiKey" type="password" value="${esc(m.apiKey||'')}" placeholder="Pega tu API key"></div><div class="field"><label>Estilo del mapa</label><select class="select" id="cartoStyle"><option value="voyager" ${m.style==='voyager'?'selected':''}>Voyager</option><option value="light_all" ${m.style==='light_all'?'selected':''}>Positron</option><option value="dark_all" ${m.style==='dark_all'?'selected':''}>Dark Matter</option></select></div><div class="field" style="grid-column:1/-1"><label>URL base CARTO (Raster PNG)</label><input class="input" id="cartoBaseUrl" type="url" value="https://basemaps.cartocdn.com" placeholder="https://basemaps.cartocdn.com"></div></div><button class="btn" id="saveMapConfig">${UI.map}<span>Guardar CARTO</span></button></div>
  <div class="section-card"><h3>Métodos de pago</h3><div id="paymentAdmin">${cfg.payments.map(p=>`<div class="admin-grid two" style="margin-bottom:8px"><input class="input" data-pay-title="${p.id}" value="${esc(p.title)}"><div class="row"><input class="input" data-pay-data="${p.id}" value="${esc(p.data)}"><button class="icon-btn" data-pay-delete="${p.id}">${UI.trash}</button></div></div>`).join('')}</div><div class="toolbar"><button class="btn secondary" id="addPayment">${UI.plus}<span>Agregar método</span></button><button class="btn" id="savePayments">${UI.save}<span>Guardar métodos</span></button></div></div>
  <div class="section-card"><h3>Origen del negocio</h3><div class="field"><label>Dirección</label><input class="input" id="originAddress" value="${esc(cfg.origin.address)}"></div><button class="btn secondary" id="geocodeOrigin">${UI.pin}<span>Ubicar dirección</span></button><div class="small muted" style="margin:8px 0">También puedes dar clic en el mapa o mover el marcador.</div><div id="originMap" class="map"></div><label class="row" style="margin-top:10px"><input type="checkbox" id="deliveryEnabled" ${cfg.deliveryEnabled?'checked':''}><span>Activar envío a domicilio</span></label></div>`;
  bindBusinessAdmin();setTimeout(initOriginMap,100);
}
function bindBusinessAdmin(){
  document.getElementById('saveIdentity').onclick=()=>{state.config.businessName=document.getElementById('bizName').value.trim()||defaults.config.businessName;state.config.tagline=document.getElementById('bizTagline').value.trim();save();renderHeader();toast('Identidad guardada.','ok')};
  document.getElementById('bizLogo').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{state.config.logo=r.result;save();renderHeader()};r.readAsDataURL(f)};
  document.getElementById('saveAccess').onclick=()=>{const w=document.getElementById('bizWhatsapp').value.replace(/\D/g,'');if(!w){toast('Escribe el número de WhatsApp.','error');return}state.config.whatsapp=w;save();toast('WhatsApp guardado.','ok')};
  document.getElementById('changePassword').onclick=changeAdminPassword;
  document.getElementById('adminLogout').onclick=adminSignOut;
  document.getElementById('saveMapConfig').onclick=()=>{
    const apiKey=document.getElementById('cartoApiKey').value.trim();
    const style=document.getElementById('cartoStyle').value;
    if(!apiKey){toast('Pega tu API key de CARTO.','error');return}
    state.config.map={provider:'carto',apiKey,style,attribution:'OpenStreetMap contributors, CARTO'};
    save();toast('CARTO guardado.','ok');setTimeout(initOriginMap,100);
  };
  document.getElementById('addPayment').onclick=()=>{state.config.payments.push({id:uid('pay'),title:'Nuevo método',data:'Dato para copiar'});save();renderBusinessAdmin(document.getElementById('adminContent'))};
  document.getElementById('savePayments').onclick=()=>{state.config.payments=state.config.payments.map(p=>({...p,title:document.querySelector(`[data-pay-title="${p.id}"]`)?.value.trim()||p.title,data:document.querySelector(`[data-pay-data="${p.id}"]`)?.value.trim()||p.data}));save();toast('Métodos de pago guardados.','ok')};
  document.querySelectorAll('[data-pay-delete]').forEach(b=>b.onclick=()=>{state.config.payments=state.config.payments.filter(p=>p.id!==b.dataset.payDelete);save();renderBusinessAdmin(document.getElementById('adminContent'))});
  document.getElementById('geocodeOrigin').onclick=()=>geocodeAddress(document.getElementById('originAddress').value,'origin');
  document.getElementById('deliveryEnabled').onchange=e=>{state.config.deliveryEnabled=e.target.checked;save()};
}
async function changeAdminPassword(){
  if(!supabaseClient||!adminSession){toast('Inicia sesión como administrador.','error');return}
  const a=document.getElementById('newAdminPassword')?.value||'';
  const b=document.getElementById('confirmAdminPassword')?.value||'';
  if(a.length<8){toast('La nueva contraseña debe tener al menos 8 caracteres.','error');return}
  if(a!==b){toast('Las contraseñas no coinciden.','error');return}
  const {error}=await supabaseClient.auth.updateUser({password:a});
  if(error){toast(error.message||'No se pudo cambiar la contraseña.','error');return}
  document.getElementById('newAdminPassword').value='';
  document.getElementById('confirmAdminPassword').value='';
  toast('Contraseña actualizada.','ok');
}
function cloudOrderToState(o){
  return {id:String(o.id),folio:o.folio,publicId:o.public_id||o.folio,date:o.created_at,dateText:new Date(o.created_at).toLocaleString('es-MX'),
    customer:{name:o.customer_name,phone:o.customer_phone,email:o.customer_email||'',notes:o.notes||''},
    items:Array.isArray(o.items)?o.items:[],subtotal:Number(o.subtotal)||0,shipping:Number(o.shipping)||0,total:Number(o.total)||0,
    expectedAmount:Number(o.expected_amount??o.total)||0,paymentStatus:o.payment_status||'WAITING_PAYMENT',
    approvedAt:o.approved_at||null,rejectedAt:o.rejected_at||null,rejectionReason:o.rejection_reason||'',
    paymentTitle:o.payment_title||'',delivery:{type:o.delivery_type,label:o.delivery_type==='pickup'?'Recoger en sitio':'Domicilio',address:o.delivery_address||'',km:Number(o.distance_km)||0},status:o.status||'pendiente'};
}
async function fetchCloudOrders(){
  if(!supabaseClient||!adminSession)return;
  const requester=adminSession.user.id;const token=panelEpoch;
  const {data,error}=await supabaseClient.from('orders').select('*').order('created_at',{ascending:false}).limit(500);
  if(adminSession?.user.id!==requester||token!==panelEpoch)return;
  if(error)throw error;
  state.orders=(data||[]).map(cloudOrderToState);saveLocal();
}
function renderOrdersAdmin(c,skipFetch=false){
  c.innerHTML=`<div class="section-card"><h3>Historial de pedidos</h3><div class="table-wrap"><table class="admin-table"><thead><tr><th>Folio</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${state.orders.length?state.orders.map(o=>`<tr><td>${esc(o.folio)}</td><td>${esc(new Date(o.date).toLocaleString('es-MX'))}</td><td>${esc(o.customer.name)}</td><td>${money(o.total)}</td><td><span class="status-badge status-${o.status}">${o.status==='pendiente'?UI.pending:o.status==='pagado'?UI.paid:UI.delivered}<span>${o.status}</span></span></td><td><div class="row"><select class="select" data-order-status="${o.id}"><option value="pendiente" ${o.status==='pendiente'?'selected':''}>Pendiente</option><option value="pagado" ${o.status==='pagado'?'selected':''}>Pagado</option><option value="entregado" ${o.status==='entregado'?'selected':''}>Entregado</option></select><button class="icon-btn" data-reprint="${o.id}">${UI.download}</button></div></td></tr>`).join(''):`<tr><td colspan="6">Todavía no hay pedidos.</td></tr>`}</tbody></table></div></div><div class="section-card"><h3>Respaldo</h3><div class="toolbar"><button class="btn" id="exportJson">${UI.download}<span>Exportar JSON</span></button><label class="btn secondary" for="importJson">${UI.upload}<span>Importar JSON</span></label><input class="hidden" id="importJson" type="file" accept="application/json"></div></div>`;
  document.querySelectorAll('[data-order-status]').forEach(s=>s.onchange=async e=>{const o=state.orders.find(x=>x.id===e.target.dataset.orderStatus);if(!o)return;o.status=e.target.value;saveLocal();if(supabaseClient&&adminSession){const {error}=await supabaseClient.from('orders').update({status:o.status}).eq('id',o.id);if(error)toast('No se pudo actualizar el estado.','error')}renderOrdersAdmin(document.getElementById('adminContent'),true)});
  document.querySelectorAll('[data-reprint]').forEach(b=>b.onclick=()=>reprintOrder(b.dataset.reprint));
  document.getElementById('exportJson').onclick=exportJson;document.getElementById('importJson').onchange=importJson;
  if(!skipFetch&&supabaseClient&&adminSession)fetchCloudOrders().then(()=>{if(activeAdmin==='orders')renderOrdersAdmin(document.getElementById('adminContent'),true)}).catch(()=>toast('No se pudo cargar el historial de Supabase.','error'));
}
async function confirmOrder(){
  const items=cartItems(),pay=state.config.payments.find(x=>x.id===checkout.paymentId);
  if(supabaseClient&&cloudReady){
    try{
      const payloadItems=items.map(x=>({id:String(x.p.id),qty:x.qty}));
      const {data,error}=await supabaseClient.rpc('submit_order',{
        p_customer:{name:checkout.name,phone:checkout.phone,call_phone:checkout.callPhone||checkout.phone,notes:checkout.notes},
        p_delivery:{type:checkout.delivery,address:checkout.delivery==='delivery'?checkout.address:'',lat:checkout.lat,lng:checkout.lng,distance_km:checkout.delivery==='delivery'?checkout.distance:0},
        p_payment_title:pay?.title||'',
        p_items:payloadItems
      });
      if(error)throw error;
      const order=cloudOrderToState(data);
      const receiptResult=await uploadReceiptForOrder(order);
      if(receiptResult.ok)order.paymentStatus='PENDING_REVIEW';
      lastPdfBlob=await buildPdf(order);lastPdfName=`pedido-${order.folio}.pdf`;lastOrderId=order.id;
      state.cart={};saveLocal();await loadPublicCloudState();renderCatalog();updateCartCount();renderPostConfirm(order);return;
    }catch(e){toast(e?.message||'No se pudo registrar el pedido. Intenta nuevamente.','error');return}
  }
  const folio=nextFolio(),now=new Date(),order={id:uid('o'),folio,date:now.toISOString(),dateText:now.toLocaleString('es-MX'),customer:{name:checkout.name,phone:checkout.phone,call_phone:checkout.callPhone||checkout.phone,notes:checkout.notes},items:items.map(x=>({id:x.p.id,name:x.p.name,qty:x.qty,price:x.p.price,total:x.qty*x.p.price})),subtotal:subtotal(),shipping:checkout.shipping,total:subtotal()+checkout.shipping,paymentId:checkout.paymentId,paymentTitle:pay?.title||'',delivery:{type:checkout.delivery,label:checkout.delivery==='pickup'?'Recoger en sitio':'Domicilio',address:checkout.delivery==='delivery'?checkout.address:'',km:checkout.delivery==='delivery'?checkout.distance:0},status:'pendiente'};
  lastPdfBlob=await buildPdf(order);lastPdfName=`pedido-${folio}.pdf`;lastOrderId=order.id;state.orders.unshift(order);state.folioSeq++;items.forEach(x=>{x.p.stock=Math.max(0,x.p.stock-x.qty)});state.cart={};saveLocal();renderCatalog();updateCartCount();renderPostConfirm(order);
}

/* ==============================
   EVENTS & INIT
============================== */
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.cat){currentCategory=b.dataset.cat;renderCategories();renderCatalog()}if(b.dataset.inc)changeQty(b.dataset.inc,1);if(b.dataset.dec)changeQty(b.dataset.dec,-1);if(b.dataset.remove){delete state.cart[b.dataset.remove];save();renderCart();renderCatalog()}if(b.dataset.closeDrawer!==undefined)closeDrawer();if(b.dataset.closeModal)closeModal(b.dataset.closeModal);if(b.dataset.copy){navigator.clipboard.writeText(b.dataset.copy).then(()=>{const n=document.getElementById('copy_'+b.dataset.copyId);n?.classList.add('show');setTimeout(()=>n?.classList.remove('show'),1600)}).catch(()=>toast('No se pudo copiar.','error'))}if(b.dataset.tab)renderAdminPane(b.dataset.tab)});
document.getElementById('searchInput').addEventListener('input',e=>{searchTerm=e.target.value;renderCatalog()});document.getElementById('cartBtn').onclick=openDrawer;document.getElementById('themeBtn').onclick=togglePublicTheme;document.getElementById('adminBtn').onclick=openAdmin;document.getElementById('pinSubmit').onclick=checkPin;document.getElementById('adminEmailInput').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('adminPasswordInput').focus()});document.getElementById('adminPasswordInput').addEventListener('keydown',e=>{if(e.key==='Enter')checkPin()});document.getElementById('overlay').onclick=()=>{closeDrawer();document.querySelectorAll('.modal.show').forEach(m=>closeModal(m.id))};document.getElementById('whatsappFab').onclick=()=>window.open(`https://wa.me/${state.config.whatsapp}?text=${encodeURIComponent(`Hola, quiero información de ${state.config.businessName}.`)}`,'_blank');
applyDesign();renderHeader();renderCategories();renderCatalog();
setTimeout(async()=>{
  let pendingTimeout;
  try{
    await Promise.race([
      (async()=>{
        await initSupabase();
        if(supabaseClient && typeof refreshSiteStatus==='function'){
          try{await refreshSiteStatus()}catch(error){console.warn('No se pudo verificar el estado de la sede',error)}
        }
      })(),
      new Promise(resolve=>{pendingTimeout=setTimeout(resolve,8000)})
    ]);
  }catch(error){
    console.error('Carga inicial VibraErótica:',error);
    toast(explainSupabaseError(error),'error');
  }finally{
    clearTimeout(pendingTimeout);
    applyDesign();renderHeader();renderCategories();renderCatalog();
    
  }
},0);
