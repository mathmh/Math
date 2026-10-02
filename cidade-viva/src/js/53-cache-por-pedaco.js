/* ================= Cache do mapa por pedaço (8x8) =================
 Tudo que não se mexe vira imagem pronta por pedaço do mapa e só é refeito quando aquele pedaço muda:
 base (chão), detalhe (ruas, calçadas, trilhos, margens, pontes), espuma, poças, luzes e "fatias" de
 profundidade (morros, cercas, árvores, postes, guarda-corpos) que entram ordenadas junto com prédios e carros. */
const CK=new Map();
let ckPix=0, ckFrame=0;
const RS_TIERS=[.25,.375,.5,.75,1,1.5,2,3];
function rsFor(k){for(const t of RS_TIERS)if(t>=k*.92&&t<=QUAL.maxRs)return t; return Math.min(QUAL.maxRs,RS_TIERS[RS_TIERS.length-1]);}
const hmix=(h,v)=>Math.imul(h^v,16777619)>>>0;
// postes da rua em intervalo regular: só em trechos retos, a cada 3 quadrados, sempre do lado de baixo/direita da rua, em cima da calçada
function streetLampAt(x,y){const i=y*N+x; if(G.rd[i]!==1||G.rp[i])return null; const nb=[0,1,2,3].map(d=>carLink(x,y,d));
  let d; if(nb[0]&&nb[2]&&!nb[1]&&!nb[3]){if(x%3)return null; d=1;} else if(nb[1]&&nb[3]&&!nb[0]&&!nb[2]){if(y%3)return null; d=0;} else return null;
  return [x+.5+DIRS[d][0]*.39,y+.5+DIRS[d][1]*.39,0,G.ht[i]*HZ];}
function streetLamps(R){const out=[]; const [x0,y0,x1,y1]=R; for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const l=streetLampAt(x,y); if(l)out.push(l);}
  const now=Date.now(); for(const b of S.b)if(T[b.k].lamp&&now>=b.d)out.push([b.x+.5,b.y+.5,1,G.ht[b.y*N+b.x]*HZ]); return out;}
// impressões digitais de cada camada do pedaço (mudou → refaz só aquela camada)
function ckHashes(cx,cy){let hb=17,hd=19,hs=23,hl=29; const x0=cx*CH,y0=cy*CH;
  for(let y=y0-1;y<=y0+CH;y++)for(let x=x0-1;x<=x0+CH;x++){if(!inMap(x,y))continue; const i=y*N+x;
    const t=G.tr[i]|(G.ht[i]<<4)|(G.rp[i]<<8); hb=hmix(hb,t+1); const r=G.rd[i]|(G.bm[i]<<2)|(G.rl[i]<<5)|(D.inter[i]<<6)|(isUl(x,y)?128:0);
    hd=hmix(hd,t^(r<<12)); const q0=(y*2)*Q2+x*2, q1=q0+Q2; hd=hmix(hd,G.pv[q0]|G.pv[q0+1]<<4|G.pv[q1]<<8|G.pv[q1+1]<<12);
    hs=hmix(hs,t^(r<<12)^(G.ob[i]<<20)^(D.under[i]<<24)); hs=hmix(hs,G.fc[q0]|G.fc[q0+1]<<4|G.fc[q1]<<8|G.fc[q1+1]<<12);
    hl=hmix(hl,(G.rd[i]|(G.rp[i]<<3)|(G.ht[i]<<8))+(i<<12));}
  hb=hmix(hb,S.ul[cy*NC+cx]?7:3); hs=hmix(hs,(S.seed|0)^(cx*31+cy)^(Object.keys(IMGP).length<<12)); hs=hmix(hs,PORTAL.x>=x0&&PORTAL.x<x0+CH&&PORTAL.y>=y0&&PORTAL.y<y0+CH?11:1);
  const now=Date.now(); for(const b of (D.ckB[cy*NC+cx]||[])){const t=T[b.k]; if(!t.glow&&!t.lamp)continue; hl=hmix(hl,b.i*31+b.x*7+b.y*13+(b.f?5:0)+(now>=b.d?1:0));}
  return [hb,hd,hs,hl];}
// cria uma camada desenhando no retângulo do mundo [bx0,by0]-[bx1,by1] com resolução rs
function mkLayer(bx0,by0,bx1,by1,rs,fn){let w=Math.ceil((bx1-bx0)*rs), h=Math.ceil((by1-by0)*rs); if(w<1||h<1)return null;
  if(w*h>12e6){const k=Math.sqrt(12e6/(w*h)); rs*=k; w=Math.ceil((bx1-bx0)*rs); h=Math.ceil((by1-by0)*rs);}
  const cvs=document.createElement('canvas'); cvs.width=w; cvs.height=h; const c=cvs.getContext('2d');
  const sv=[TGT.k,TGT.tx,TGT.ty]; TGT.k=rs; TGT.tx=-bx0*rs; TGT.ty=-by0*rs; let any=true;
  try{any=fn(c)!==false;}catch(e){console.error('camada',e);} TGT.k=sv[0]; TGT.tx=sv[1]; TGT.ty=sv[2];
  if(!any)return null; ckPix+=w*h; const L={cv:cvs,x:bx0,y:by0,w:w/rs,h:h/rs,rs}; L.bands=bandsOf(c,w,h); if(!L.bands.length){ckPix-=w*h; return null;} return L;}
function alphaAny(c,w,h){try{const d=c.getImageData(0,0,w,h).data; for(let i=3;i<d.length;i+=16)if(d[i]>2)return true; return false;}catch(e){return true;}}
// recorta a camada em faixas horizontais justas (evita desenhar pixels transparentes)
function bandsOf(c,w,h){if(w*h<90000){return alphaAny(c,w,h)?[[0,0,w,h]]:[];} let d; try{d=c.getImageData(0,0,w,h).data;}catch(e){return [[0,0,w,h]];}
  const bh=Math.max(8,Math.ceil(h/16)), out=[];
  for(let y0=0;y0<h;y0+=bh){const y1=Math.min(h,y0+bh); let mn=w,mx=-1;
    for(let y=y0;y<y1;y+=2){const row=y*w*4; for(let x=0;x<mn;x+=2)if(d[row+x*4+3]>2){mn=x;break;} for(let x=w-1;x>mx;x-=2)if(d[row+x*4+3]>2){mx=x;break;}}
    if(mx<0)continue; mn=Math.max(0,mn-2); mx=Math.min(w-1,mx+2);
    const last=out[out.length-1]; if(last&&last[1]+last[3]===y0&&Math.abs(last[0]-mn)<6&&Math.abs(last[0]+last[2]-mx-1)<6){last[3]+=y1-y0; last[0]=Math.min(last[0],mn); last[2]=Math.max(last[0]+last[2],mx+1)-last[0];}
    else out.push([mn,y0,mx+1-mn,y1-y0]);}
  return out;}
function freeLayer(L){if(!L)return; ckPix-=L.cv.width*L.cv.height; BK.free(L.cv); L.cv.width=L.cv.height=0;}
function pLayerB(L,al,add){if(!L)return; const k=1/L.rs; for(const b of L.bands)pImg(L.cv,L.x+b[0]*k,L.y+b[1]*k,b[2]*k,b[3]*k,al,false,add,b);}
const tileBox=(x0,y0,x1,y1,zmin,zmax)=>[(x0-y1)*32,(x0+y0)*16-zmax,(x1-y0)*32,(x1+y1)*16-zmin];
function chunkBox(cx,cy){const x0=cx*CH,y0=cy*CH; return tileBox(x0,y0,x0+CH,y0+CH,0,0);}
const isWater=i=>G.tr[i]===1||G.tr[i]===2;

/* ---- camadas planas ---- */
// cantos arredondados entre água/terra e entre tipos de chão (o rio, o lago, a praia e o deserto não ficam em escadinha)
const CORN=[[-1,-1],[1,-1],[1,1],[-1,1]];
const isW2=(x,y)=>inMap(x,y)?isWater(y*N+x):(x>=N);
const soilAt=(x,y)=>inMap(x,y)?G.tr[y*N+x]:-1;
function cornerPiece(p,x,y,k){const [sx,sy]=CORN[k], cx=x+.5, cy=y+.5, a1=sx>0?0:Math.PI, a2=sy>0?Math.PI/2:-Math.PI/2;
  p.moveTo(cx+sx*.5,cy+sy*.5); p.lineTo(cx+sx*.5,cy); p.arc(cx,cy,.5,a1,a2,((a2-a1+Math.PI*4)%(Math.PI*2))>Math.PI); p.closePath();}
function roundedTile(p,x,y,rd){const cx=x+.5,cy=y+.5; p.moveTo(cx,y);
  const seq=[[1,-Math.PI/2,0],[2,0,Math.PI/2],[3,Math.PI/2,Math.PI],[0,Math.PI,Math.PI*1.5]];
  for(const [k,a0,a1] of seq){const [sx,sy]=CORN[k]; if(rd[k])p.arc(cx,cy,.5,a0,a1,false); else{p.lineTo(cx+sx*.5,cy+sy*.5); p.lineTo(cx+Math.cos(a1)*.5,cy+Math.sin(a1)*.5);}}
  p.closePath();}
// forma da água do quadrado: cantos arredondados onde há terra nos dois lados do canto
function waterRound(x,y){return [0,1,2,3].map(k=>{const [sx,sy]=CORN[k]; return !isW2(x+sx,y)&&!isW2(x,y+sy)&&inMap(x+sx,y)&&inMap(x,y+sy);});}
function landCut(x,y){return [0,1,2,3].map(k=>{const [sx,sy]=CORN[k]; return isW2(x+sx,y)&&isW2(x,y+sy)&&isW2(x+sx,y+sy);});}
// contorno da água do pedaço (quadrados com cantos redondos + pontas de terra cortadas), um quadrado além da borda
function waterPath(x0,y0){const wp=new Path2D(), lake=new Path2D(); let wat=false, lk=false;
  for(let y=y0-1;y<=y0+CH;y++)for(let x=x0-1;x<=x0+CH;x++){if(!inMap(x,y))continue; const i=y*N+x, inside=x>=x0&&x<x0+CH&&y>=y0&&y<y0+CH;
    if(isWater(i)){roundedTile(wp,x,y,waterRound(x,y)); wat=true; if(G.tr[i]===1&&inside){roundedTile(lake,x,y,waterRound(x,y)); lk=true;}}
    else{const cut=landCut(x,y); for(let k=0;k<4;k++)if(cut[k]){cornerPiece(wp,x,y,k); wat=true; const [sx,sy]=CORN[k]; if(soilAt(x+sx,y)===1&&inside){cornerPiece(lake,x,y,k); lk=true;}}}}
  return {wp,lake,wat,lk};}
function drawBase(c,cx,cy){const x0=cx*CH,y0=cy*CH; setIso(c); const e=.03;
    const under=(x,y)=>{for(const [a,b] of DIRS4){const t=soilAt(x+a,y+b); if(t>=0&&t!==1&&t!==2)return t;} return 0;};   // chão debaixo da água (aparece nos cantos)
    for(const code of [0,3,4,5,6,7]){c.beginPath(); let any=false;
      for(let y=y0;y<y0+CH;y++)for(let x=x0;x<x0+CH;x++){const i=y*N+x; const t=isWater(i)?under(x,y):G.tr[i]; if(t===code){c.rect(x-e,y-e,1+2*e,1+2*e); any=true;}}
      if(any){const p=SOIL_PAT(code); patT(p,32); c.fillStyle=p; c.fill();}}
    // cantos entre tipos de chão: o canto vira o chão dos dois vizinhos quando eles são iguais
    const cp=new Map();
    for(let y=y0;y<y0+CH;y++)for(let x=x0;x<x0+CH;x++){const i=y*N+x; if(isWater(i))continue; const A=G.tr[i];
      for(let k=0;k<4;k++){const [sx,sy]=CORN[k], B=soilAt(x+sx,y), C=soilAt(x,y+sy); if(B<0||B!==C||B===A||B===1||B===2)continue;
        let p=cp.get(B); if(!p)cp.set(B,p=new Path2D()); cornerPiece(p,x,y,k);}}
    for(const [B,p] of cp){const pt=SOIL_PAT(B); patT(pt,32); c.fillStyle=pt; c.fill(p);}
    if(!S.ul[cy*NC+cx]){patT(PAT.lock,32); c.globalAlpha=PAT.grass._k?.38:.55; c.fillStyle=PAT.lock; c.fillRect(x0-e,y0-e,CH+2*e,CH+2*e); c.globalAlpha=1;}
    c.save(); c.beginPath(); c.rect(x0-e,y0-e,CH+2*e,CH+2*e); c.clip(); shadeRect(c,x0-1,y0-1,CH+3,CH+3,true); c.restore(); setIso(c);
    // água: barranco marrom = o contorno engrossado; depois recorta a água (as linhas internas somem junto)
    const W=waterPath(x0,y0);
    if(W.wat){c.save(); c.beginPath(); c.rect(x0-e,y0-e,CH+2*e,CH+2*e); c.clip(); c.lineJoin='round';
      c.fillStyle='#7d5c3b'; c.strokeStyle='#7d5c3b'; c.lineWidth=.3; c.fill(W.wp); c.stroke(W.wp);
      c.strokeStyle='rgba(20,60,90,.3)'; c.lineWidth=.12; c.stroke(W.wp);
      c.globalCompositeOperation='destination-out'; c.fillStyle='#000'; c.fill(W.wp); c.restore(); setIso(c);}
    c.fillStyle='rgba(125,200,240,.42)'; if(W.lk)c.fill(W.lake);}
function bakeGround(cx,cy,rs){const bb=chunkBox(cx,cy);
  return mkLayer(bb[0]-2,bb[1]-64,bb[2]+2,bb[3]+26,rs,c=>{drawBase(c,cx,cy); drawDetail(c,cx,cy);});}
function drawDetail(c,cx,cy){const x0=cx*CH,y0=cy*CH, owned=!!S.ul[cy*NC+cx]; setIso(c);
    const land=(x,y)=>inMap(x,y)&&!isWater(y*N+x);
    for(let y=y0;y<y0+CH;y++)for(let x=x0;x<x0+CH;x++){const i=y*N+x; if(elev(i))continue; if(G.tr[i]===1&&G.rl[i])railTile(c,x,y,true); else if(!isWater(i))tileTop(c,x,y);}
    const br=[]; for(let y=y0;y<y0+CH;y++)for(let x=x0;x<x0+CH;x++)if(G.rd[y*N+x]===2)br.push([x,y]); br.sort((a,b)=>a[0]+a[1]-b[0]-b[1]);
    for(const [x,y] of br)bridgeTile(c,x,y,false);
    setIso(c); if(!owned){c.strokeStyle='rgba(255,255,255,.22)'; c.lineWidth=1.2/(TGT.k*32); c.strokeRect(x0,y0,CH,CH);}
    setW(c); if(cy===NC-1){const xa=x0,xb=Math.min(x0+CH,Math.floor(coastX(N-1))-3); if(xb>xa)poly(c,[P(xa,N),P(xb,N),P(xb,N,-20),P(xa,N,-20)],'#7a5a3a');}
    if(cx===0)poly(c,[P(0,y0),P(0,y0+CH),P(0,y0+CH,-20),P(0,y0,-20)],'#5f4429');}
function qHasPv(x,y){const a=(y*2)*Q2+x*2,b=a+Q2; return G.pv[a]||G.pv[a+1]||G.pv[b]||G.pv[b+1];}
// espuma: anel fino em volta da água, seguindo o contorno redondo
function bakeFoam(cx,cy,rs){const x0=cx*CH,y0=cy*CH, bb=chunkBox(cx,cy); let any=false;
  for(let y=y0;y<y0+CH&&!any;y++)for(let x=x0;x<x0+CH;x++){if(isWater(y*N+x)){any=true;break;}}
  if(!any)return null; const W=waterPath(x0,y0);
  return mkLayer(bb[0]-2,bb[1]-2,bb[2]+2,bb[3]+2,rs,c=>{setIso(c); c.save(); c.beginPath(); c.rect(x0,y0,CH,CH); c.clip(); c.lineJoin='round';
    c.strokeStyle='#fff'; c.lineWidth=.16; c.stroke(W.wp); c.globalCompositeOperation='destination-out'; c.lineWidth=.02; c.fillStyle='#000';
    c.save(); c.clip(W.wp); c.fillRect(x0,y0,CH,CH); c.restore(); c.restore();   // fica só a metade de fora: a linha d'água na beira
  });}
function bakePuddles(cx,cy,rs){const x0=cx*CH,y0=cy*CH, bb=chunkBox(cx,cy); const spots=[];
  for(let y=y0;y<y0+CH;y++)for(let x=x0;x<x0+CH;x++){const i=y*N+x; if(elev(i))continue; const h=hsh(x,y,77);
    if(G.rd[i]===1&&h%5<2)spots.push([x+.25+(h%7)/14,y+.25+((h>>3)%7)/14,.17+(h%3)*.04]); else if(qHasPv(x,y)&&h%4===0)spots.push([x+.5,y+.5,.12]);}
  if(!spots.length)return null;
  return mkLayer(bb[0]-2,bb[1]-2,bb[2]+2,bb[3]+2,rs,c=>{setIso(c); for(const [x,y,r] of spots){c.fillStyle='rgba(95,125,160,.55)'; c.beginPath(); c.ellipse(x,y,r,r*.7,.5,0,7); c.fill();
    c.fillStyle='rgba(220,235,250,.35)'; c.beginPath(); c.ellipse(x-r*.25,y-r*.15,r*.45,r*.18,.5,0,7); c.fill();}});}
// luzes da noite (ficam prontas e entram com mistura aditiva): 0 = brilho no chão, 1 = lâmpadas e letreiros
function bakeLights(cx,cy,rs,which){const x0=cx*CH,y0=cy*CH, gl=[]; const now=Date.now();
  for(let y=y0;y<y0+CH;y++)for(let x=x0;x<x0+CH;x++){const l=streetLampAt(x,y); if(!l)continue; const [px,py]=P(l[0],l[1],l[3]);
    if(which===0)gl.push([px,py,46,23,'255,200,110',.55]); else{const [hx,hy]=P(l[0],l[1],l[3]+31); gl.push([hx+6,hy,16,16,'255,230,160',.85]);}}
  for(const b of (D.ckB[cy*NC+cx]||[])){const t=T[b.k]; if(now<b.d)continue; const zb=G.ht[b.y*N+b.x]*HZ;
    if(t.lamp){if(which===0){const [px,py]=P(b.x+.5,b.y+.5,zb); gl.push([px,py,46,23,'255,200,110',.55]);} else{const [px,py]=P(b.x+.5,b.y+.5,zb+40); gl.push([px,py,16,16,'255,230,160',.85]);}}
    if(t.glow&&which===1)for(const [u,v,z,r,rgb] of t.glow){const [wx,wy]=loc(b,u,v); const [px,py]=P(wx,wy,z+zb); gl.push([px,py,r,r,rgb,.8]);}}
  if(which===1&&!IMGP['portal-tunel']&&PORTAL.x>=x0&&PORTAL.x<x0+CH&&PORTAL.y>=y0&&PORTAL.y<y0+CH){for(const dy of [-.62,.62]){const [px,py]=P(PORTAL.x+1.08,PORTAL.y+.5+dy,23); gl.push([px,py,12,12,'255,215,150',.9]);}
    const [tx,ty]=P(PORTAL.x+1,PORTAL.y+.5,10); gl.push([tx,ty,16,12,'255,210,140',.5]);}
  if(!gl.length)return null; let a=[1e9,1e9,-1e9,-1e9]; for(const [px,py,rx,ry] of gl){a[0]=Math.min(a[0],px-rx);a[1]=Math.min(a[1],py-ry);a[2]=Math.max(a[2],px+rx);a[3]=Math.max(a[3],py+ry);}
  return mkLayer(a[0]-1,a[1]-1,a[2]+1,a[3]+1,Math.min(rs,1.5),c=>{setW(c); c.globalCompositeOperation='lighter'; for(const [px,py,rx,ry,rgb,al] of gl)glow(c,px,py,rx,ry,rgb,al);});}

/* ---- fatias de profundidade ---- */
const UNDER_D=(cx,cy)=>-1e6+(cx+cy)*CH;
function ckItems(cx,cy){const x0=cx*CH,y0=cy*CH, out=[];
  for(let y=y0;y<y0+CH;y++)for(let x=x0;x<x0+CH;x++){const i=y*N+x, el=elev(i);
    if(el)out.push({d:D.under[i]?UNDER_D(cx,cy)+x+y:x+y+.99,t:0,x,y});
    if(G.ob[i])out.push({d:x+y+1,t:1,x,y});
    if(G.rd[i]===2)out.push({d:x+y+1.9,t:2,x,y});
    for(const [a,b] of [[0,0],[1,0],[0,1],[1,1]]){const qx=x*2+a,qy=y*2+b; if(G.fc[qy*Q2+qx])out.push({d:el?x+y+1.01+(a+b)*.01:(qx+.5)/2+(qy+.5)/2+.02,t:3,qx,qy,x,y});}
    const l=streetLampAt(x,y); if(l)out.push({d:el?x+y+1.01:l[0]+l[1]+.01,t:4,lx:l[0],ly:l[1],z:l[3],x,y});
    if(x===PORTAL.x&&y===PORTAL.y)out.push({d:x+y+1.4,t:5,x,y});}
  for(const dc of DECOR){const [kx,ky]=decorChunk(dc); if(kx===cx&&ky===cy)out.push({d:decorD(dc),t:6,x:dc.x,y:dc.y,dc});}
  return out;}
function itemBox(it){const x=it.x,y=it.y;
  switch(it.t){case 0:{const cz=cornerZ(x,y); return tileBox(x,y,x+1,y+1,-22,Math.max(...cz)+2);}
    case 1:{const o=G.ob[y*N+x], v=hsh(x,y,1)%3, s=sprite('o',o,v,false); const [X,Y]=P(x,y,G.ht[y*N+x]*HZ); if(!s)return tileBox(x,y,x+1,y+1,0,60);
      const w=s.cv.width/s.sx,h=s.cv.height/s.sy,ox=s.ox/s.sx,oy=s.oy/s.sy, m=Math.max(ox,w-ox); return [X-m-1,Y-oy-1,X+m+1,Y-oy+h+1];}
    case 2:return tileBox(x,y,x+1,y+1,-8,52);
    case 3:{const z=hAt((it.qx+.5)/2,(it.qy+.5)/2); return tileBox(it.qx/2,it.qy/2,it.qx/2+.5,it.qy/2+.5,z-2,z+16);}
    case 4:{const [X,Y]=P(it.lx,it.ly,it.z); return [X-7,Y-36,X+10,Y+4];}
    case 5:{const L=PORTAL_LOTE; return decorSprite('portal-tunel',false)?decorBox({k:'portal-tunel',x:L.x,y:L.y,f:false}):tileBox(x-2,y-2,x+2,y+3,-4,64);}
    case 6:return decorBox(it.dc);}
  return tileBox(x,y,x+1,y+1,0,40);}
function drawItem(c,it,n){const x=it.x,y=it.y;
  switch(it.t){case 0:drawColumn(c,x,y,n);break;
    case 1:{const o=G.ob[y*N+x], v=hsh(x,y,1)%3; setW(c); const [X,Y]=P(x,y,G.ht[y*N+x]*HZ); drawSprite(c,sprite('o',o,v,n>.5),X,Y,v===1);break;}
    case 2:setW(c); bridgeTile(c,x,y,true,n);break;
    case 3:setW(c); drawFence(c,it.qx,it.qy,n);break;
    case 4:setW(c); drawLampPost(c,it.lx,it.ly,n,it.z);break;
    case 5:{const L=PORTAL_LOTE, dc={k:'portal-tunel',x:L.x,y:L.y,f:false}; if(decorSprite(dc.k,false))drawDecor(c,dc,n); else{setW(c); drawPortal(c,n);} break;}
    case 6:drawDecor(c,it.dc,n);break;}}
function bakeGroups(cx,cy,rs,night){const items=ckItems(cx,cy), m=new Map();
  for(const it of items){const key=it.d<-1e5?UNDER_D(cx,cy):Math.round(it.d*10)/10; let gr=m.get(key); if(!gr)m.set(key,gr={d:key,items:[]}); gr.items.push(it);}
  const out=[...m.values()].sort((a,b)=>a.d-b.d);
  for(const gr of out){gr.items.sort((a,b)=>a.d-b.d||a.t-b.t); let bb=[1e9,1e9,-1e9,-1e9];
    for(const it of gr.items){const q=itemBox(it); bb[0]=Math.min(bb[0],q[0]); bb[1]=Math.min(bb[1],q[1]); bb[2]=Math.max(bb[2],q[2]); bb[3]=Math.max(bb[3],q[3]);}
    gr.bb=bb; gr.day=mkLayer(bb[0]-1,bb[1]-1,bb[2]+1,bb[3]+1,rs,c=>{for(const it of gr.items)drawItem(c,it,0);}); gr.night=null; gr.rs=rs;}
  return out;}
// noite: morros desenhados de dia e escurecidos de uma vez (sem emenda entre quadrados); o resto usa a versão noturna
let NSCR=null;
function groupNight(gr){if(gr.night)return gr.night;
  gr.night=mkLayer(gr.bb[0]-1,gr.bb[1]-1,gr.bb[2]+1,gr.bb[3]+1,gr.rs,c=>{const w=c.canvas.width,h=c.canvas.height;
    if(!NSCR)NSCR=document.createElement('canvas'); if(NSCR.width<w||NSCR.height<h){NSCR.width=Math.max(NSCR.width,w); NSCR.height=Math.max(NSCR.height,h);}
    const s=NSCR.getContext('2d'); let run=false;
    const flush=()=>{if(!run)return; s.setTransform(1,0,0,1,0,0); s.globalCompositeOperation='source-atop'; s.fillStyle='rgba(8,16,48,.58)'; s.fillRect(0,0,w,h); s.globalCompositeOperation='source-over';
      c.setTransform(1,0,0,1,0,0); c.drawImage(NSCR,0,0,w,h,0,0,w,h); run=false;};
    for(const it of gr.items){if(it.t===0){if(!run){s.setTransform(1,0,0,1,0,0); s.clearRect(0,0,w,h); run=true;} drawItem(s,it,0);} else{flush(); drawItem(c,it,1);}}
    flush();});
  return gr.night;}

/* ---- gerenciamento ---- */
function ckFree(e){for(const k of ['base','foam','pud','lg','lh'])freeLayer(e[k]); if(e.groups)for(const gr of e.groups){freeLayer(gr.day); freeLayer(gr.night);}}
function ckFreeAll(){for(const e of CK.values())ckFree(e); CK.clear(); ckPix=0;}
let ckBudgetMs=6;
const ckVer=()=>geoVer*65536+mapVer;
function ckUpdate(e,want,force){const v=ckVer(); const h=e.hv===v?e.h:ckHashes(e.cx,e.cy); e.hv=v; const old=e.h||[];
  const tierOk=e.rs===want, t0=performance.now();
  const dirty=[h[0]!==old[0],h[1]!==old[1],h[2]!==old[2],h[3]!==old[3]];
  if(!tierOk&&!force&&e.baked&&!dirty.some(Boolean))return false;
  const all=!tierOk; const {cx,cy}=e;
  if(all||dirty[0]||dirty[1]){freeLayer(e.base); e.base=bakeGround(cx,cy,want);}
  if(all||dirty[0]){freeLayer(e.foam); e.foam=bakeFoam(cx,cy,want); let w=false; for(let y=cy*CH;y<cy*CH+CH&&!w;y++)for(let x=cx*CH;x<cx*CH+CH;x++)if(isWater(y*N+x)){w=true;break;} e.wat=w;}
  if(all||dirty[1]){freeLayer(e.pud); e.pud=bakePuddles(cx,cy,want);}
  if(all||dirty[2]||dirty[0]){if(e.groups)for(const gr of e.groups){freeLayer(gr.day); freeLayer(gr.night);} e.groups=bakeGroups(cx,cy,want);}
  if(all||dirty[3]||dirty[1]){freeLayer(e.lg); freeLayer(e.lh); e.lg=bakeLights(cx,cy,want,0); e.lh=bakeLights(cx,cy,want,1);}
  e.rs=want; e.h=h; e.baked=true; e.ms=performance.now()-t0; return true;}
// pedaços visíveis, refeitos se preciso (tempo limitado por quadro para troca de zoom)
function ckVisible(R){ckFrame++; const want=rsFor(TGT.k); const [x0,y0,x1,y1]=R;
  const cx0=clamp(Math.floor(x0/CH),0,NC-1),cy0=clamp(Math.floor(y0/CH),0,NC-1),cx1=clamp(Math.floor(x1/CH),0,NC-1),cy1=clamp(Math.floor(y1/CH),0,NC-1);
  const list=[]; let spent=0; const t0=performance.now();
  for(let cy=cy0;cy<=cy1;cy++)for(let cx=cx0;cx<=cx1;cx++){const key=cy*NC+cx; let e=CK.get(key);
    if(!e){e={cx,cy,h:null,hv:-1,rs:0}; CK.set(key,e);}
    const content=e.hv!==ckVer();
    if(!e.baked||content)ckUpdate(e,e.baked?e.rs:want,true);
    else if(e.rs!==want&&performance.now()-t0<ckBudgetMs)ckUpdate(e,want,true);
    e.used=ckFrame; list.push(e);}
  list.sort((a,b)=>(a.cx+a.cy)-(b.cx+b.cy)||a.cx-b.cx);
  if(ckPix>QUAL.budget){const old=[...CK.values()].filter(e=>e.used!==ckFrame).sort((a,b)=>a.used-b.used);
    for(const e of old){if(ckPix<=QUAL.budget*.8)break; ckFree(e); CK.delete(e.cy*NC+e.cx);}}
  return list;}
