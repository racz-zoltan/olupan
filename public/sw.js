/* Olupan service worker – gyorsítótár: olupan-<tartalom-hash>. A buildet a tools/build.py generálja, ne szerkeszd kézzel. */
const CACHE='olupan-b3a9669c20f4';
const CORE=["/", "/index.html", "/manifest.webmanifest", "/scanner.html", "/utmutato.html", "/guide.html", "/adatvedelem.html", "/privacy.html", "/jogi-nyilatkozat.html", "/disclaimer.html", "/assets/app.css", "/assets/app.js", "/assets/apple-touch-icon.png", "/assets/argon2.js", "/assets/favicon.svg", "/assets/fonts/bricolage-grotesque-600-hu.woff2", "/assets/fonts/bricolage-grotesque-600.woff2", "/assets/fonts/instrument-sans-400-hu.woff2", "/assets/fonts/instrument-sans-400.woff2", "/assets/fonts/instrument-sans-500-hu.woff2", "/assets/fonts/instrument-sans-500.woff2", "/assets/fonts/instrument-sans-600-hu.woff2", "/assets/fonts/instrument-sans-600.woff2", "/assets/fonts/jetbrains-mono-400-hu.woff2", "/assets/fonts/jetbrains-mono-400.woff2", "/assets/fonts/jetbrains-mono-500-hu.woff2", "/assets/fonts/jetbrains-mono-500.woff2", "/assets/fonts/jetbrains-mono-600-hu.woff2", "/assets/fonts/jetbrains-mono-600.woff2", "/assets/icon-192.png", "/assets/icon-32.png", "/assets/icon-512.png", "/assets/icon-maskable-512.png", "/assets/legal.css", "/assets/legal.js", "/assets/scanner.css", "/assets/scanner.js", "/assets/zxing-reader.js"];
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  await c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})));
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k.startsWith('olupan-')&&k!==CACHE)await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(CACHE);
    const hit=await c.match(r,{ignoreSearch:true})||(r.mode==='navigate'?await c.match('/index.html'):null);
    if(hit)return hit;
    const res=await fetch(r);
    if(res.ok&&/(\.wasm|pwcheck\.js|qrcode\.js)$/.test(new URL(r.url).pathname))c.put(r,res.clone()); // a vonalkód-olvasó első használat után offline is elérhető
    return res;
  })());
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil((async()=>{
    const all=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of all)if('focus' in c)return c.focus();
    if(self.clients.openWindow)return self.clients.openWindow('/');
  })());
});
