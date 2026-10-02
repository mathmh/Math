/* ================= Lista de desenho e backends (Canvas 2D / WebGL com PixiJS) =================
 Cada quadro vira uma lista de "prims" em coordenadas do mundo. O backend Canvas desenha com drawImage;
 o backend PixiJS reaproveita um conjunto de Sprites. Marcas, bolhas e textos vão num canvas 2D por cima. */
const DL={n:0,a:[]};
function dlReset(){DL.n=0;}
function dlNext(){let p=DL.a[DL.n]; if(!p)p=DL.a[DL.n]={k:0,img:null,x:0,y:0,w:0,h:0,al:1,fl:false,add:false,src:null,m:null,col:0}; DL.n++; return p;}
// imagem num retângulo do mundo
function pImg(img,x,y,w,h,al,fl,add,src){const p=dlNext(); p.k=0; p.img=img; p.x=x; p.y=y; p.w=w; p.h=h; p.al=al==null?1:al; p.fl=!!fl; p.add=!!add; p.src=src||null; return p;}
// imagem com matriz afim: mundo = m · pixel da imagem
function pMat(img,m,al,add){const p=dlNext(); p.k=1; p.img=img; p.m=m; p.al=al==null?1:al; p.add=!!add; p.fl=false; p.src=null; return p;}
// retângulo de cor sólida (col = 0xRRGGBB)
function pRect(x,y,w,h,col,al,add){const p=dlNext(); p.k=2; p.x=x; p.y=y; p.w=w; p.h=h; p.col=col; p.al=al==null?1:al; p.add=!!add; return p;}
// camada já pronta {cv,x,y,w,h}
function pLayer(L,al,add){if(L)pImg(L.cv,L.x,L.y,L.w,L.h,al,false,add);}
// sprite {cv,ox,oy,sx,sy} ancorado em X,Y (mesmo cálculo do drawSprite)
function pSprite(s,X,Y,flip,al,sq,add){if(!s||!s.cv)return; const w=s.cv.width/s.sx,h=s.cv.height/s.sy, u0=-s.ox/s.sx, v0=-s.oy/s.sy;
  let a=1,d=1,e=0,f=0; if(sq){a=sq[0];d=sq[1];e=sq[2];f=sq[3];}
  const x=flip?X-(a*(u0+w)+e):X+a*u0+e; pImg(s.cv,x,Y+d*v0+f,a*w,d*h,al,flip,add);}
const hex6=n=>'#'+(n|0).toString(16).padStart(6,'0');

/* ---- qualidade (modo econômico automático no celular) ---- */
const IS_MOBILE=(()=>{try{return matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<=820;}catch(e){return false;}})();
const QUAL={eco:false,dprCap:2,fps:60,crowd:1,maxRs:3,budget:40e6};
function applyQual(){const m=OPT.qual||'auto', eco=m==='eco'||(m==='auto'&&IS_MOBILE);
  Object.assign(QUAL,{eco,dprCap:eco?1.25:(m==='alto'?3:2),fps:eco?30:60,crowd:eco?.55:1,maxRs:eco?1.5:3,budget:eco?18e6:48e6});}

/* ---- medidor de quadro ---- */
const PERF={on:false,t:[],last:0,fps:0,frames:0,t0:0};
function perfAdd(ms){PERF.t.push(ms); if(PERF.t.length>120)PERF.t.shift(); PERF.frames++; const now=performance.now(); if(now-PERF.t0>1000){PERF.fps=PERF.frames*1000/(now-PERF.t0); PERF.frames=0; PERF.t0=now;}}
function perfText(){if(!PERF.t.length)return ''; const a=PERF.t.slice().sort((x,y)=>x-y); const avg=a.reduce((s,v)=>s+v,0)/a.length;
  return BK.name+' · '+avg.toFixed(1)+' ms/quadro (p90 '+a[Math.floor(a.length*.9)].toFixed(1)+') · '+Math.round(PERF.fps)+' fps'+(QUAL.eco?' · econômico':'');}

/* ---- estado por quadro para camadas repetidas (mar e chuva) ---- */
const FR={seaX:0,seaY:0,rain:0,rainT:0,seaCk:[]};
// mar fora do mapa (a leste) — dentro do mapa o mar só é pintado nos pedaços que têm água
const SEA_OUT=[[64,-60,64,64*2+120],[48,-60,16,60],[48,64,16,60]];
let RAINPAT=null, RAINCV=null;
function rainTex(){if(RAINCV)return RAINCV; const s=128, c2=document.createElement('canvas'); c2.width=c2.height=s; const c=c2.getContext('2d'); const r=rng(31);
  c.strokeStyle='rgba(210,225,245,.55)'; c.lineCap='round';
  for(let k=0;k<26;k++){const x=r()*s,y=r()*s,l=7+r()*9; c.lineWidth=.8+r()*.7; c.beginPath(); c.moveTo(x,y); c.lineTo(x-l*.28,y+l); c.stroke();
    c.beginPath(); c.moveTo(x-s,y); c.lineTo(x-s-l*.28,y+l); c.stroke(); c.beginPath(); c.moveTo(x,y-s); c.lineTo(x-l*.28,y-s+l); c.stroke();}
  RAINCV=c2; return c2;}

/* ---- backend Canvas 2D ---- */
const BK2D={name:'Canvas',
  draw(){const c=g; c.setTransform(1,0,0,1,0,0); c.globalAlpha=1; c.globalCompositeOperation='source-over';
    c.fillStyle='#3d6a34'; c.fillRect(0,0,cv.width,cv.height);
    setIso(c); patT(PAT.sea,32,FR.seaX,FR.seaY); c.fillStyle=PAT.sea; c.beginPath(); for(const [x,y,w,h] of SEA_OUT)c.rect(x,y,w,h); for(const e of FR.seaCk)c.rect(e.cx*CH,e.cy*CH,CH,CH); c.fill();
    const K=TGT.k,TX=TGT.tx,TY=TGT.ty; let add=false, al=1, id=false; c.setTransform(1,0,0,1,0,0); id=true;
    for(let i=0;i<DL.n;i++){const p=DL.a[i];
      if(p.add!==add){c.globalCompositeOperation=p.add?'lighter':'source-over'; add=p.add;}
      if(p.al!==al){c.globalAlpha=p.al; al=p.al;}
      if(p.k===0){const im=p.img; if(!im||(im.complete===false))continue;
        if(!p.fl){if(!id){c.setTransform(1,0,0,1,0,0); id=true;} if(p.src){let dx=K*p.x+TX,dy=K*p.y+TY,dw=K*p.w,dh=K*p.h; if(Math.abs(dw-p.src[2])<.6&&Math.abs(dh-p.src[3])<.6){dx=Math.round(dx);dy=Math.round(dy);dw=p.src[2];dh=p.src[3];} c.drawImage(im,p.src[0],p.src[1],p.src[2],p.src[3],dx,dy,dw,dh);} else c.drawImage(im,K*p.x+TX,K*p.y+TY,K*p.w,K*p.h);}
        else{c.setTransform(-K,0,0,K,K*(p.x+p.w)+TX,K*p.y+TY); id=false; if(p.src)c.drawImage(im,p.src[0],p.src[1],p.src[2],p.src[3],0,0,p.w,p.h); else c.drawImage(im,0,0,p.w,p.h);}}
      else if(p.k===1){const m=p.m; c.setTransform(K*m[0],K*m[1],K*m[2],K*m[3],K*m[4]+TX,K*m[5]+TY); id=false; c.drawImage(p.img,0,0);}
      else{if(!id){c.setTransform(1,0,0,1,0,0); id=true;} c.fillStyle=hex6(p.col); c.fillRect(K*p.x+TX,K*p.y+TY,K*p.w,K*p.h);}}
    c.globalCompositeOperation='source-over'; c.globalAlpha=1;
    if(FR.rain>0.01){if(!RAINPAT)RAINPAT=g.createPattern(rainTex(),'repeat'); c.setTransform(DPR,0,0,DPR,0,0);
      for(const [sp,sc,a] of [[1,1,1],[.7,1.6,.6]]){const o=FR.rainT*sp; RAINPAT.setTransform(new DOMMatrix([sc,0,0,sc,(o*-90)%(128*sc),(o*320)%(128*sc)])); c.globalAlpha=FR.rain*a; c.fillStyle=RAINPAT; c.fillRect(0,0,VW,VH);}
      c.globalAlpha=1;}},
  flush(){g.getImageData(0,0,1,1);}, free(){}, resize(){}};

/* ---- backend WebGL (PixiJS v7) ---- */
const BKGL={name:'WebGL',ok:false,R:null,root:null,world:null,iso:null,pool:null,scr:null,seaA:null,seaB:null,rainA:null,rainB:null,tex:new Map(),M:null,el:null,
  init(){try{if(!window.PIXI||!PIXI.utils.isWebGLSupported())return false;
      PIXI.settings.ROUND_PIXELS=false;
      const el=document.createElement('canvas'); el.id='gl'; el.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';
      cv.parentNode.insertBefore(el,cv); this.el=el;
      this.R=new PIXI.Renderer({view:el,width:Math.max(1,VW),height:Math.max(1,VH),resolution:DPR,autoDensity:false,backgroundColor:0x3d6a34,antialias:false,powerPreference:'high-performance'});
      el.addEventListener('webglcontextlost',e=>{e.preventDefault(); toast('O WebGL parou; voltando para o desenho em Canvas'); switchBackend('canvas',true);});
      this.root=new PIXI.Container(); this.world=new PIXI.Container(); this.iso=new PIXI.Container(); this.pool=new PIXI.Container(); this.scr=new PIXI.Container();
      this.root.addChild(this.world,this.scr); this.world.addChild(this.iso,this.pool);
      this.iso.transform.setFromMatrix(new PIXI.Matrix(32,16,-32,16,0,0));
      const seaT=this.texOf(PAT_SRC.sea); this.seaT=seaT; this.seaOut=SEA_OUT.map(([x,y,w,h])=>{const t=new PIXI.TilingSprite(seaT,w,h); t.position.set(x,y); t.tileScale.set(1/32); this.iso.addChild(t); return t;}); this.seaCk=[];
      const rt=this.texOf(rainTex()); this.rainA=new PIXI.TilingSprite(rt,100,100); this.rainB=new PIXI.TilingSprite(rt,100,100); this.rainB.tileScale.set(1.6); this.scr.addChild(this.rainA,this.rainB);
      this.M=new PIXI.Matrix(); this.ok=true; this.resize(); return true;}
    catch(e){console.warn('PixiJS indisponível',e); if(this.el)this.el.remove(); this.ok=false; return false;}},
  texOf(img,src){let e=this.tex.get(img); if(!e){if(img.complete===false||!(img.width||img.naturalWidth))return null;
      const bt=new PIXI.BaseTexture(img,{mipmap:PIXI.MIPMAP_MODES.ON,scaleMode:PIXI.SCALE_MODES.LINEAR}); e={t:new PIXI.Texture(bt),subs:null}; this.tex.set(img,e);}
    if(!src)return e.t; if(!e.subs)e.subs=new Map(); const key=src[0]+','+src[1]+','+src[2]+','+src[3]; let t=e.subs.get(key);
    if(!t){t=new PIXI.Texture(e.t.baseTexture,new PIXI.Rectangle(src[0],src[1],src[2],src[3])); e.subs.set(key,t);} return t;},
  free(img){const e=this.tex.get(img); if(!e)return; try{e.t.destroy(true);}catch(er){} this.tex.delete(img);},
  resize(){if(!this.ok)return; this.R.resolution=DPR; this.R.resize(Math.max(1,VW),Math.max(1,VH)); this.el.style.width=VW+'px'; this.el.style.height=VH+'px';
    this.rainA.width=this.rainB.width=VW; this.rainA.height=this.rainB.height=VH;},
  draw(){const z=cam.z; this.world.position.set(VW/2-cam.x*z,VH/2-cam.y*z); this.world.scale.set(z);
    for(const t of this.seaOut)t.tilePosition.set(FR.seaX,FR.seaY);
    let si=0; for(const e of FR.seaCk){let t=this.seaCk[si]; if(!t){t=new PIXI.TilingSprite(this.seaT,CH,CH); t.tileScale.set(1/32); this.iso.addChild(t); this.seaCk.push(t);} si++; t.visible=true; t.position.set(e.cx*CH,e.cy*CH); t.tilePosition.set(FR.seaX,FR.seaY);}
    for(let i=si;i<this.seaCk.length;i++)this.seaCk[i].visible=false;
    const pool=this.pool.children, W=PIXI.Texture.WHITE, ADD=PIXI.BLEND_MODES.ADD, NOR=PIXI.BLEND_MODES.NORMAL; let used=0;
    for(let i=0;i<DL.n;i++){const p=DL.a[i]; let tex;
      if(p.k===2)tex=W; else{tex=this.texOf(p.img,p.src); if(!tex)continue;}
      let sp=pool[used]; if(!sp){sp=new PIXI.Sprite(tex); this.pool.addChild(sp);} used++;
      sp.visible=true; sp.texture=tex; sp.alpha=p.al; sp.blendMode=p.add?ADD:NOR;
      if(p.k===1){const m=p.m; this.M.set(m[0],m[1],m[2],m[3],m[4],m[5]); sp.transform.setFromMatrix(this.M); sp.tint=0xffffff;}
      else{sp.rotation=0; sp.skew.set(0,0); if(p.k===2){sp.position.set(p.x,p.y); sp.scale.set(p.w/W.width,p.h/W.height); sp.tint=p.col;}
        else{sp.position.set(p.fl?p.x+p.w:p.x,p.y); sp.scale.set((p.fl?-1:1)*p.w/tex.width,p.h/tex.height); sp.tint=0xffffff;}}}
    for(let i=used;i<pool.length;i++)pool[i].visible=false;
    if(pool.length>used+600){const extra=pool.slice(used+300); for(const s of extra){this.pool.removeChild(s); s.destroy();}}
    const ra=FR.rain>0.01; this.rainA.visible=this.rainB.visible=ra;
    if(ra){this.rainA.alpha=FR.rain; this.rainB.alpha=FR.rain*.6; this.rainA.tilePosition.set((-90*FR.rainT)%128,(320*FR.rainT)%128); this.rainB.tilePosition.set((-90*.7*FR.rainT)%204.8,(320*.7*FR.rainT)%204.8);}
    this.R.render(this.root);
    // o canvas 2D por cima fica só com marcas e bolhas
    g.setTransform(1,0,0,1,0,0); g.clearRect(0,0,cv.width,cv.height);},
  flush(){const gl=this.R.gl; const px=new Uint8Array(4); gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);},
  destroy(){if(!this.ok)return; for(const e of this.tex.values()){try{e.t.destroy(true);}catch(er){}} this.tex.clear(); try{this.R.destroy(false);}catch(e){} this.el.remove(); this.ok=false;}};

let BK=BK2D;
function wantGL(){const r=OPT.renderer||'auto'; return r!=='canvas';}
function switchBackend(to,force){if(to==='webgl'&&BK!==BKGL){if(BKGL.ok||BKGL.init()){BK=BKGL; ckFreeAll();} else if(!force)toast('WebGL indisponível neste aparelho; usando Canvas');}
  else if(to==='canvas'&&BK!==BK2D){if(BKGL.ok)BKGL.destroy(); BK=BK2D; ckFreeAll();}
  window.__backendName=()=>BK.name;}
// usado pelo teste de desempenho
window.__flush=()=>BK.flush();
