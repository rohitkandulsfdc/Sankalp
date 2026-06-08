/* Sankalp service worker — caches app shell; backend always live. */
const CACHE='sankalp-v1';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=e.request.url;
  if(u.indexOf('script.google.com')>=0||u.indexOf('googleusercontent.com')>=0||u.indexOf('cdnjs')>=0||u.indexOf('fonts.')>=0||e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{});return res;}).catch(()=>caches.match('./index.html'))));
});
