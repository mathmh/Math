/* ================= Imagens prontas no jogo =================
 As imagens em img/ (lista em 44-imagens-prontas.js) carregam sozinhas no começo. Enquanto não chegam, o jogo usa
 os desenhos em código. Uma imagem enviada pela oficina com o mesmo nome tem prioridade. */
const IMGP={};           // slug → Image já carregada (texturas, peças de rua, enfeites do mapa)
let imgRebakeT=null;
function rebakeSoon(){clearTimeout(imgRebakeT); imgRebakeT=setTimeout(()=>{SPR.clear(); for(const k of Object.keys(LPAT))delete LPAT[k]; ckFreeAll(); mapVer++; try{thumbCache.clear();}catch(e){}},150);}
function builtinFor(slug){const m=IMG_PRONTAS[slug]; if(!m||m.textura||m.calcada)return; const im=IMGP[slug]||m.img; if(im)IMG[slug]={d:{img:im,ax:m.ax,ay:m.ay},adj:{},pronta:1};}
// textura em imagem: k = px da imagem por quadrado (4 quadrados por repetição)
function texPat(im,k){const cv=document.createElement('canvas'); cv.width=im.naturalWidth; cv.height=im.naturalHeight; cv.getContext('2d').drawImage(im,0,0);
  const p=g.createPattern(cv,'repeat'); p._k=k; p._src=cv; return p;}
function texReady(slug,im){const k=im.naturalWidth/4;
  if(slug==='chao-grama'){PAT.grass=texPat(im,k);}
  else if(slug==='chao-areia-praia'){PAT.sand=texPat(im,k);}
  else if(slug==='chao-areia-deserto'){PAT.desert=texPat(im,k);}
  else if(slug==='chao-agua'){PAT.sea=texPat(im,im.naturalWidth/3); PAT_SRC.sea=PAT.sea._src;}
  else if(slug==='paredao-rocha'){ROCHA.pat=g.createPattern(im,'repeat'); ROCHA.w=im.naturalWidth;}}
const ROCHA={pat:null,w:512};
function loadBuiltinImages(){for(const slug in IMG_PRONTAS){const m=IMG_PRONTAS[slug]; const im=new Image(); m.img=im;
    im.onload=()=>{IMGP[slug]=im; if(m.textura)texReady(slug,im); rebakeSoon(); try{refreshArt();}catch(e){}};
    im.onerror=()=>{};
    im.src=m.src;
    if(!m.textura&&!m.calcada&&!ARTMAP[slug])builtinFor(slug);}}
// enfeite fixo do mapa (serra, arco, pedras no mar, portal): desenhado na âncora = canto de cima do lote,
// em cima do chão onde ele fica (as montanhas em volta dos platôs ficam no alto), com escala d.s
function decorSprite(slug,night,sc){const s=imgSprite(slug,night); if(!s||!sc||sc===1)return s; return Object.assign({},s,{sx:s.sx/sc,sy:s.sy/sc});}
function decorZ(d){const l=decorLote(d); const x=clamp(Math.floor(d.x+l.w/2),0,N-1), y=clamp(Math.floor(d.y+l.h/2),0,N-1); return G.ht&&G.ht.length?G.ht[y*N+x]*HZ:0;}
function decorBox(d){const s=decorSprite(d.k,false,d.s); const [X,Y]=P(d.x,d.y,decorZ(d));
  if(!s){const m=IMG_PRONTAS[d.k], k=d.s||1; return m?[X-m.w*k/2-4,Y-m.h*k/2,X+m.w*k/2+4,Y+m.h*k/2]:[X-40,Y-80,X+40,Y+20];}
  const w=s.cv.width/s.sx, h=s.cv.height/s.sy, ox=s.ox/s.sx, oy=s.oy/s.sy;
  return d.f?[X-(w-ox)-2,Y-oy-2,X+ox+2,Y-oy+h+2]:[X-ox-2,Y-oy-2,X-ox+w+2,Y-oy+h+2];}
function drawDecor(c,d,n){const s=decorSprite(d.k,n>.5,d.s); if(!s)return; setW(c); const [X,Y]=P(d.x,d.y,decorZ(d)); drawSprite(c,s,X,Y,d.f);}
const decorLote=d=>{const m=IMG_PRONTAS[d.k], k=d.s||1; const w=(m?m.lw||1:1)*k, h=(m?m.lh||1:1)*k; return d.f?{w:h,h:w}:{w,h};};
const decorD=d=>{const l=decorLote(d); return d.x+d.y+(l.w+l.h)/2;};
// borda do mapa (barranco de terra nas bordas esquerda e da frente): uma faixa só, sem emendas entre pedaços
let SKIRT=null;
function skirtImg(col){const c2=document.createElement('canvas'); c2.width=c2.height=4; const c=c2.getContext('2d'); const gr=c.createLinearGradient(0,0,0,4); gr.addColorStop(0,col); gr.addColorStop(1,'#3d2a18'); c.fillStyle=gr; c.fillRect(0,0,4,4); return c2;}
function pushSkirt(){if(!SKIRT)SKIRT={l:skirtImg('#6b4c2e'),b:skirtImg('#7a5a3a')}; const D=22, xc=Math.floor(coastX(N-1))-2;
  // borda esquerda (x=0): de P(0,0) até P(0,N), descendo D px
  pMat(SKIRT.l,[-N*32/4,N*16/4,0,D/4,0,0],1);
  // borda da frente (y=N): de P(0,N) até P(xc,N)
  const [ax,ay]=P(0,N); pMat(SKIRT.b,[xc*32/4,xc*16/4,0,D/4,ax,ay],1);}
// ruas em imagem: 5 peças vistas de cima, giradas para cada caso (0:+x 1:+y 2:-x 3:-y)
const RUA_PECAS=[['rua-reta',[1,3]],['rua-curva',[0,1]],['rua-t',[0,1,3]],['rua-cruz',[0,1,2,3]],['rua-fim',[1]]];
function ruaPeca(nb){const want=[0,1,2,3].filter(d=>nb[d]); const n=want.length;
  for(const [slug,base] of RUA_PECAS){if(base.length!==Math.max(1,n))continue; const im=IMGP[slug]; if(!im)return null;
    for(let k=0;k<4;k++){const rot=base.map(d=>(d+k)%4).sort(); if(n===0?k===0:rot.join()===want.slice().sort().join())return {im,k};}}
  return null;}
