/* ================= Sprites (código ou imagem) ================= */
const SPR=new Map();
function cropCanvas(cv){const c=cv.getContext('2d'); const W=cv.width,H=cv.height; const d=c.getImageData(0,0,W,H).data;
  let x0=W,y0=H,x1=-1,y1=-1; for(let y=0;y<H;y+=1){const row=y*W*4; for(let x=0;x<W;x+=1){if(d[row+x*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}}
  if(x1<0)return {cv,x:0,y:0}; x0=Math.max(0,x0-2);y0=Math.max(0,y0-2);x1=Math.min(W-1,x1+2);y1=Math.min(H-1,y1+2);
  const o=document.createElement('canvas'); o.width=x1-x0+1; o.height=y1-y0+1; o.getContext('2d').drawImage(cv,-x0,-y0); return {cv:o,x:x0,y:y0};}
function codeSprite(dims,art,v){const w=dims.w,h=dims.h, ZM=380, W=(w+h)*32+90, Hh=(w+h)*16+ZM+50;
  const cv=document.createElement('canvas'); cv.width=W*SS; cv.height=Hh*SS; const c=cv.getContext('2d'); const ox=h*32+45, oy=ZM+25;
  c.setTransform(SS,0,0,SS,ox*SS,oy*SS); SID=7+v*13; LM=false; try{ART[art.f](c,dims,art,v);}catch(e){console.error(art.f,e);}
  const cr=cropCanvas(cv); return {cv:cr.cv,ox:ox*SS-cr.x,oy:oy*SS-cr.y,sx:SS,sy:SS};}
function nightOf(spr,dims,art,v){const cv=document.createElement('canvas'); cv.width=spr.cv.width; cv.height=spr.cv.height; const c=cv.getContext('2d');
  c.drawImage(spr.cv,0,0); c.globalCompositeOperation='source-atop'; c.fillStyle='rgba(14,22,58,.62)'; c.fillRect(0,0,cv.width,cv.height); c.globalCompositeOperation='source-over';
  if(art){c.setTransform(spr.sx,0,0,spr.sy,spr.ox,spr.oy); SID=7+v*13; LM=true; try{ART[art.f](c,dims,art,v);}catch(e){} LM=false;}
  return {cv,ox:spr.ox,oy:spr.oy,sx:spr.sx,sy:spr.sy};}
// slug → {d:{img,ax,ay}, n:{img,ax,ay}, adj:{k,vy,dx,dy}}
const IMG={};
function imgSprite(slug,night){const e=IMG[slug]; if(!e)return null; const a=e.adj||{}; const k=a.k||1, vy=a.vy||1;
  const pick=night&&e.n&&e.n.img&&e.n.img.complete&&e.n.img.naturalWidth?e.n:(e.d&&e.d.img&&e.d.img.complete&&e.d.img.naturalWidth?e.d:null); if(!pick)return null;
  const sx=2/k, sy=2/(k*vy); const base={cv:pick.img,ox:pick.ax+(a.dx||0)*sx,oy:pick.ay-(a.dy||0)*sy,sx,sy};
  if(night&&pick===e.d){if(!e.dn||e.dnSrc!==pick.img.src){const s=nightOf({cv:pick.img,ox:0,oy:0,sx:1,sy:1},null,null,0); e.dn=s.cv; e.dnSrc=pick.img.src;} return Object.assign({},base,{cv:e.dn});}
  return base;}
function sprite(kind,key,v,night){const slug=kind==='o'?OB[key].slug:T[key].slug;
  const im=imgSprite(slug,night); if(im)return im;
  const id=kind+':'+key+':'+v+(night?':n':''); let s=SPR.get(id); if(s)return s;
  const dims=kind==='o'?{w:1,h:1}:T[key], art=kind==='o'?OB[key].art:T[key].art; if(!art)return null;
  if(night){const day=sprite(kind,key,v,false); s=nightOf(day,dims,art,v);} else s=codeSprite(dims,art,v);
  SPR.set(id,s); return s;}
function spriteTop(kind,key,v){const s=sprite(kind,key,v,false); return s?s.oy/s.sy:20;}
function drawSprite(c,s,X,Y,flip,alpha,sq){if(!s)return; const w=s.cv.width/s.sx,h=s.cv.height/s.sy;
  c.save(); c.translate(X,Y); if(flip)c.scale(-1,1); if(sq)c.transform(sq[0],0,0,sq[1],sq[2],sq[3]); if(alpha!=null)c.globalAlpha=alpha; c.drawImage(s.cv,-s.ox/s.sx,-s.oy/s.sy,w,h); c.restore();}

/* ---- Armazém de imagens (oficina) ---- */
let ARTMAP={}, assetsNS=null, artDbRef=null;
function loadArtLocal(){try{const j=localStorage.getItem(ART_KEY); if(j)ARTMAP=JSON.parse(j)||{};}catch(e){ARTMAP={};}}
function saveArtLocal(){try{localStorage.setItem(ART_KEY,JSON.stringify(ARTMAP));}catch(e){}}
const IDB={db:null,open(){return this.db||(this.db=new Promise((res,rej)=>{try{const r=indexedDB.open('cidadeviva_img',1);r.onupgradeneeded=()=>r.result.createObjectStore('img');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}catch(e){rej(e);}}));},
  async put(k,v){const db=await this.open();return new Promise((res,rej)=>{const tx=db.transaction('img','readwrite');tx.objectStore('img').put(v,k);tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});},
  async get(k){const db=await this.open();return new Promise((res,rej)=>{const tx=db.transaction('img');const q=tx.objectStore('img').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error);});}};
async function urlFor(u){if(!u)return null; if(u.startsWith('a:'))return '/_blob/'+u.slice(2); if(u.startsWith('idb:')){try{const b=await IDB.get(u.slice(4)); return b?URL.createObjectURL(b):null;}catch(e){return null;}} return u;}
async function applyArt(slug){const m=ARTMAP[slug]; if(!m){delete IMG[slug]; refreshArt(); return;}
  const e={adj:m.adj||{}}; for(const side of ['d','n']){const r=m[side]; if(!r)continue; const src=await urlFor(r.u); if(!src)continue;
    const img=new Image(); img.onload=()=>{refreshArt();}; img.onerror=()=>{}; img.src=src; e[side]={img,ax:r.ax,ay:r.ay};}
  IMG[slug]=e; refreshArt();}
function refreshArt(){thumbCache.clear(); if(sheetKind==='shop')openShop(); if(sheetKind==='art')drawArtPreview();}
async function loadAllArt(){for(const slug in ARTMAP)await applyArt(slug);}
async function initArtCloud(db){try{assetsNS=await window.claude.use('assets');}catch(e){assetsNS=null;}
  try{artDbRef=db.doc('art/map'); const snap=await artDbRef.get(); if(snap.exists){const m=snap.data().map||{}; let ch=false;
      for(const s in m){if(!ARTMAP[s]||(m[s].t||0)>(ARTMAP[s].t||0)){ARTMAP[s]=m[s];ch=true;}}
      if(ch){saveArtLocal(); loadAllArt();}}}catch(e){artDbRef=null;}}
function pushArt(){saveArtLocal(); if(artDbRef)artDbRef.set({map:ARTMAP,t:Date.now()}).catch(()=>{});}
// Lê o PNG, acha o lote, normaliza o ângulo (até 15%) e reamostra para 2 px por pixel do mundo
function loadImgFile(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file); const im=new Image(); im.onload=()=>res(im); im.onerror=rej; im.src=u;});}
function analyzeImage(im,kind,dims){const W=im.naturalWidth,H=im.naturalHeight; const cv=document.createElement('canvas'); cv.width=W; cv.height=H; const c=cv.getContext('2d'); c.drawImage(im,0,0);
  const d=c.getImageData(0,0,W,H).data, A=(x,y)=>d[(y*W+x)*4+3]>60;
  let x0=W,y0=H,x1=-1,y1=-1; for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(A(x,y)){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  if(x1<0)throw new Error('vazia');
  const avgY=(x)=>{let s=0,n=0;for(let y=0;y<H;y++)if(A(x,y)){s+=y;n++;}return n?s/n:0;};
  const avgX=(y)=>{let s=0,n=0;for(let x=0;x<W;x++)if(A(x,y)){s+=x;n++;}return n?s/n:0;};
  let s,vy=1,ax,ay,note='';
  if(kind==='lot'){const w=dims.w,h=dims.h; const yl=(avgY(x0)+avgY(x0+1))/2, yr=(avgY(x1)+avgY(x1-1))/2, yb=y1;
    s=(x1-x0)/((w+h)*32); const meas=(yb-yl)+(yb-yr), exp=(w+h)*16*s; let raw=exp/Math.max(1,meas); vy=clamp(raw,.85,1.15);
    if(Math.abs(raw-1)>.15)note='O ângulo da imagem está bem diferente do padrão; ajustei o máximo (15%). Talvez valha gerar de novo.';
    ax=x0+h*32*s; ay=yl-h*16*s/vy;}
  else if(kind==='car'){s=(x1-x0)/(dims.vw); ax=(x0+x1)/2; ay=y1-6*s;}
  else{s=(x1-x0)/(dims.vw||58); ax=(x0+x1)/2; ay=y1-4*s-16*s;}
  const fx=2/s, fy=2*vy/s; const ow=Math.max(1,Math.round((x1-x0+1)*fx)), oh=Math.max(1,Math.round((y1-y0+1)*fy));
  const o=document.createElement('canvas'); o.width=ow; o.height=oh; const oc=o.getContext('2d'); oc.imageSmoothingQuality='high'; oc.drawImage(cv,x0,y0,x1-x0+1,y1-y0+1,0,0,ow,oh);
  return {cv:o,ax:(ax-x0)*fx,ay:(ay-y0)*fy,vy,note};}
// sprite feito com desenho vetorial em volta da âncora (0,0); bb = [x0,y0,x1,y1] em px do mundo
const VSP=new Map();
function vecSprite(key,bb,fn,ss,noCrop){let s=VSP.get(key); if(s)return s; ss=ss||SS;
  const w=Math.max(1,Math.ceil((bb[2]-bb[0])*ss)), h=Math.max(1,Math.ceil((bb[3]-bb[1])*ss)); const c2=document.createElement('canvas'); c2.width=w; c2.height=h; const c=c2.getContext('2d');
  const sv=[TGT.k,TGT.tx,TGT.ty]; TGT.k=ss; TGT.tx=-bb[0]*ss; TGT.ty=-bb[1]*ss; setW(c); const lm=LM; LM=false;
  try{fn(c);}catch(e){console.error('vecSprite',key,e);} LM=lm; TGT.k=sv[0]; TGT.tx=sv[1]; TGT.ty=sv[2];
  if(noCrop)s={cv:c2,ox:-bb[0]*ss,oy:-bb[1]*ss,sx:ss,sy:ss}; else{const cr=cropCanvas(c2); s={cv:cr.cv,ox:-bb[0]*ss-cr.x,oy:-bb[1]*ss-cr.y,sx:ss,sy:ss};}
  VSP.set(key,s); if(VSP.size>6000){const k0=VSP.keys().next().value; const o=VSP.get(k0); VSP.delete(k0); BK.free(o.cv);} return s;}
