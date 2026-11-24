// PopDex : garde les pochettes et les photos en mémoire sur l'appareil, pour ne plus les recharger à chaque fois.
const CACHE="popdex-img-v1",HOSTS=["coverartarchive.org","upload.wikimedia.org"];
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  let u;try{u=new URL(r.url)}catch(_){return}
  if(!HOSTS.includes(u.hostname))return;
  e.respondWith((async()=>{
    const c=await caches.open(CACHE),hit=await c.match(r.url);
    if(hit)return hit;
    try{
      const res=await fetch(r.url,{mode:"cors",redirect:"follow"});   // CORS : on peut vérifier que la réponse est bonne avant de la garder
      if(res.ok)c.put(r.url,res.clone());
      return res;
    }catch(_){return fetch(r)}
  })());
});
