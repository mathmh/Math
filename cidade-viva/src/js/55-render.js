/* ================= Render principal ================= */
function loc(b,u,v){return b.f?[b.x+v,b.y+u]:[b.x+u,b.y+v];}
function dConstruct(c,w,h,p){const i=.15,x0=i,y0=i,x1=w-i,y1=h-i, zb=0;
  const H=Math.max(6,(14+w*8)*(.15+.85*p));
  box(c,x0,y0,x1,y1,zb,zb+3,'#b5aea4'); c.globalAlpha=.55; box(c,x0+.12,y0+.12,x1-.12,y1-.12,zb+3,zb+H,'#d9cfbf'); c.globalAlpha=1;
  c.strokeStyle='#e8871e';c.lineWidth=1.6;
  [[x0,y0],[x1,y0],[x0,y1],[x1,y1]].forEach(([px,py])=>{const a=P(px,py,zb),bb=P(px,py,zb+H+6);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(bb[0],bb[1]);c.stroke();});
  for(let z=10;z<H+6;z+=10){c.beginPath();const pts=[P(x0,y1,zb+z),P(x1,y1,zb+z),P(x1,y0,zb+z)];c.moveTo(pts[0][0],pts[0][1]);c.lineTo(pts[1][0],pts[1][1]);c.lineTo(pts[2][0],pts[2][1]);c.stroke();}
  const [cx,cy]=P(w/2,h/2,zb+H+10); line(c,[cx,cy],[cx,cy-18],'#f2c230',2); line(c,[cx,cy-18],[cx+16,cy-18],'#f2c230',2);}
const constructSprite=(w,h,p)=>{const q=Math.round(p*10); return vecSprite('con:'+w+'x'+h+':'+q,[-(h)*32-4,-(14+w*8)-40,w*32+4,(w+h)*16+4],c=>dConstruct(c,w,h,q/10));};
function plotSprite(b,now){const w=fw(b),h=fh(b); let key='plot:'+w+'x'+h, cr=null, p=0, ready=false;
  if(now>=b.d&&b.s&&C[b.s]){cr=C[b.s]; ready=now>=b.a; p=ready?1:clamp(1-(b.a-now)/(cr.t*1000),0,1); key+=':'+b.s+':'+(ready?'r':Math.round(p*8));}
  return vecSprite(key,[-h*32-2,-24,w*32+2,(w+h)*16+2],c=>dPlotAt(c,w,h,cr,ready?1:Math.round(p*8)/8,ready));}
function drawParkedAt(c,f,full,n){const fb={x:0,y:0,f};
  const car=(u0,u1,col,hgt,load)=>{const a=loc(fb,u0,1.48),bb=loc(fb,u1,1.9); box(c,Math.min(a[0],bb[0]),Math.min(a[1],bb[1]),Math.max(a[0],bb[0]),Math.max(a[1],bb[1]),3,hgt,nc(col,n));
    if(load){const a2=loc(fb,u0+.1,1.55),b2=loc(fb,u1-.1,1.83); box(c,Math.min(a2[0],b2[0]),Math.min(a2[1],b2[1]),Math.max(a2[0],b2[0]),Math.max(a2[1],b2[1]),hgt,hgt+5,nc('#c7843e',n));}};
  car(.15,1.05,'#d62828',20); car(1.15,1.95,'#2f6690',16,full); car(2.05,2.85,'#2f6690',16,full);}
function drawShipAt(c,f,n){const [x,y]=loc({x:0,y:0,f},3,1.05); const tx=f?0:1,ty=f?1:0;
  prism(c,x,y,tx,ty,-.75,.75,.24,-2,6,'#c0392b','#f2efe8',n); prism(c,x,y,tx,ty,-.3,.25,.16,6,14,'#f2efe8','#d8d2c4',n);}
// imagens prontas reaproveitadas por quadro
const BEAM={}; function beamImg(kind){if(BEAM[kind])return BEAM[kind]; const L=kind==='cone'?64:300, H=kind==='cone'?40:44, c2=document.createElement('canvas'); c2.width=L; c2.height=H; const c=c2.getContext('2d');
  const gr=c.createLinearGradient(0,0,L,0); const rgb=kind==='cone'?'255,240,190':kind==='farol'?'255,245,200':'255,250,215'; gr.addColorStop(0,'rgba('+rgb+',1)'); gr.addColorStop(1,'rgba('+rgb+',0)'); c.fillStyle=gr;
  c.beginPath(); c.moveTo(0,H/2-2); c.lineTo(L,0); c.lineTo(L,H); c.lineTo(0,H/2+2); c.closePath(); c.fill(); return BEAM[kind]=c2;}
// feixe girado: âncora (px,py), ângulo a, comprimento L e meia-largura em px do mundo
function pBeam(kind,px,py,a,L,half,al){const im=beamImg(kind), sx=L/im.width, sy=half*2/im.height, co=Math.cos(a), si=Math.sin(a);
  pMat(im,[co*sx,si*sx,-si*sy,co*sy,px+si*half,py-co*half],al,true);}
function viewRect(){const [ax,ay]=s2w(-20,-20),[bx,by]=s2w(VW+20,VH+20); return [ax,ay,bx-ax,by-ay];}

function render(now){const t0=performance.now(); camTGT(); const R=visRange(); const ds=dayState(now), n=ds.n, W=weatherNow(now);
  simulate(now); simPeds(now);
  dlReset(); const tsec=now/1000; FR.seaX=(tsec*.06)%2; FR.seaY=(tsec*.03)%2; FR.rain=W.rain*(QUAL.eco?.8:1); FR.rainT=tsec%1000;
  const chunks=ckVisible(R), [vx,vy,vw,vh]=viewRect(); FR.seaCk=chunks.filter(e=>e.wat);
  for(const e of chunks)pLayerB(e.base);
  const fa=.45+.25*Math.sin(tsec*1.6); for(const e of chunks)pLayerB(e.foam,fa);
  if(W.wet>.02)for(const e of chunks)pLayerB(e.pud,W.wet);
  const [ax,ay]=s2w(-150,-150),[bx,by]=s2w(VW+150,VH+500);
  const vis=(b,w,h)=>{const [px,py]=P(b.x+w/2,b.y+h/2); return !(px<ax-200||px>bx+200||py<ay||py>by);};
  for(const b of S.b)if(b.k==='plot'&&!elev(b.y*N+b.x)&&!(mode.t==='move'&&mode.i===b.i)&&vis(b,2,2)){const [X,Y]=P(b.x,b.y,0); pSprite(plotSprite(b,now),X,Y,b.f);}
  if(VIEW){const im=viewImg(); if(im)pMat(im,[8,4,-8,4,0,0],.92);}
  if(n>0){pRect(vx,vy,vw,vh,0x081030,.58*n); for(const e of chunks)pLayerB(e.lg,n,true);
    for(const o of cars){const ps=carPose(o),M=CARS[o.m]; const fx=ps.x+ps.tx*M.len/2, fy=ps.y+ps.ty*M.len/2; const [px,py]=P(fx,fy,ps.z);
      const sx=(ps.tx-ps.ty)*32, sy=(ps.tx+ps.ty)*16, L=Math.hypot(sx,sy); pBeam('cone',px,py,Math.atan2(sy,sx),L*.75,7,.35*n);}}
  if(ds.dusk>0)pRect(vx,vy,vw,vh,0xff823c,.12*ds.dusk);
  // objetos em ordem de profundidade
  const items=[];
  for(const e of chunks)for(const gr of e.groups||[])items.push({d:gr.d,t:0,gr});
  for(const b of S.b){const t=T[b.k]; if(mode.t==='move'&&mode.i===b.i)continue; const w=fw(b),h=fh(b);
    if(t.flat&&!elev(b.y*N+b.x))continue; if(!vis(b,w,h))continue;
    items.push({d:t.flat?b.x+b.y+.5:b.x+b.y+(w+h)/2+.001,t:1,b});}
  for(let y=R[1];y<=R[3];y++)for(let x=R[0];x<=R[2];x++)if(D.inter[y*N+x])items.push({d:x+y+1.05,t:2,x,y});
  for(const o of cars){const p=carPose(o); const tx=Math.floor(p.x),ty=Math.floor(p.y); items.push({d:elev(ty*N+tx)?tx+ty+1.02:p.x+p.y,t:3,o,p});}
  for(const b of S.b)if(b.k==='estacao'){const mv=trainMoving(b,now); for(const tc of trainCars(mv))items.push({d:Math.floor(tc.x)+Math.floor(tc.y)+1.03,t:4,o:tc});}
  pedItems(items,ax,ay,bx,by); extraItems(items,now,n,vis);
  items.sort((a,b)=>a.d-b.d);
  for(const it of items){
    if(it.t===0){const gr=it.gr; if(n<.99)pLayerB(gr.day); if(n>0)pLayerB(groupNight(gr),n>=.99?1:n);}
    else if(it.t===1){const b=it.b,t=T[b.k], zb=G.ht[b.y*N+b.x]*HZ, [X,Y]=P(b.x,b.y,zb);
      if(t.flat){pSprite(plotSprite(b,now),X,Y,b.f); continue;}
      if(now<b.d&&t.time>0){pSprite(constructSprite(fw(b),fh(b),clamp(1-(b.d-now)/(Math.max(1,t.time)*1000),0,1)),X,Y); continue;}
      let sq=null; const bt=bounce.get(b.i); if(bt!=null){const q=(now-bt)/650; if(q>=1)bounce.delete(b.i); else{const e=Math.sin(q*Math.PI*3)*(1-q); const sx=1+.07*e,sy=1-.12*e; const cx=(t.w-t.h)*16,cy=(t.w+t.h)*8; sq=[sx,sy,cx-sx*cx,cy-sy*cy];}}
      if(n<.99)pSprite(sprite('b',b.k,0,false),X,Y,b.f,null,sq); if(n>0)pSprite(sprite('b',b.k,0,true),X,Y,b.f,n>=.99?null:n,sq);
      if(b.k==='estacao'||b.k==='porto'){const moving=b.s&&now<b.a; if(!moving){const nn=n>.5?1:0;
        const s2=b.k==='estacao'?vecSprite('park:'+b.f+':'+(b.s&&b.s!=='exp'?1:0)+':'+nn,[-140,-60,170,110],c=>drawParkedAt(c,b.f,b.s&&b.s!=='exp',nn)):vecSprite('ship:'+b.f+':'+nn,[-140,-40,170,110],c=>drawShipAt(c,b.f,nn)); pSprite(s2,X,Y);}}
      if(b.fire)fireFx(b,now,X,Y);}
    else if(it.t===2){const z=G.ht[it.y*N+it.x]*HZ; for(const [ox,oy,ax2] of SIG){const [px,py]=P(it.x+ox,it.y+oy,z); pSprite(signalSprite(lightState(it.x,it.y,ax2,now),n>.5),px,py);}}
    else if(it.t===3)pushCar(it.o,it.p,n);
    else if(it.t===4)pushTrainCar(it.o,n);
    else if(it.f)it.f(it);}
  // luzes da noite
  if(n>0){for(const e of chunks)pLayerB(e.lh,n,true);
    for(let y=R[1];y<=R[3];y++)for(let x=R[0];x<=R[2];x++)if(D.inter[y*N+x]){const z=G.ht[y*N+x]*HZ; for(const [ox,oy,ax2] of SIG){const st=lightState(x,y,ax2,now); const [px,py]=P(x+ox,y+oy,z); const yy=py-(st==='r'?20:st==='y'?18:16);
      pImg(glowImg(st==='r'?'255,70,60':st==='y'?'255,200,60':'80,255,120'),px-4.5,yy-4.5,9,9,.8*n,false,true);}}
    for(const b of S.b){const t=T[b.k]; if(!t.search||now<b.d)continue; const zb=G.ht[b.y*N+b.x]*HZ;
      for(const [u,v,ph] of [[.8,.8,0],[2.1,.8,2.2]]){const [wx,wy]=loc(b,u,v); const [px,py]=P(wx,wy,47+zb); pBeam('luz',px,py,-Math.PI/2+Math.sin(now/1400+ph)*.55,300,21,.55*n);}}
    lightsExtra(now,n);}
  skyExtra(now,n,W,vx,vy,vw,vh);
  if(W.dark>0.01)pRect(vx,vy,vw,vh,0x2a3646,W.dark);
  BK.draw();
  // por cima: marcas, fantasma, bolhas e textos (canvas 2D)
  drawMarks(g); setW(g);
  if((mode.t==='place'||mode.t==='move')&&mode.has){const k=mode.t==='place'?mode.k:byId(mode.i).k; const z=inMap(mode.gx,mode.gy)?G.ht[mode.gy*N+mode.gx]*HZ:0;
    const pts=mode.line&&mode.line.length?mode.line:[[mode.gx,mode.gy]]; g.globalAlpha=.78; for(const [gx,gy] of pts){const [X,Y]=P(gx,gy,inMap(gx,gy)?G.ht[gy*N+gx]*HZ:z); drawSprite(g,sprite('b',k,0,false),X,Y,mode.f);} g.globalAlpha=1;}
  drawOverlay(g,now);
  if(PERF.on){perfAdd(performance.now()-t0); g.setTransform(DPR,0,0,DPR,0,0); g.font='700 12px system-ui,sans-serif'; const tx=perfText(); const w=g.measureText(tx).width;
    g.fillStyle='rgba(0,0,0,.6)'; g.fillRect(6,VH-26,w+12,20); g.fillStyle='#fff'; g.textAlign='left'; g.textBaseline='middle'; g.fillText(tx,12,VH-16);}}
// marcas que vão por cima de tudo (área de expansão, seleção, fantasma, pincel)
function drawMarks(c){
  if(mode.t==='expand'){for(let cy=0;cy<NC;cy++)for(let cx=0;cx<NC;cx++){if(!chunkBuyable(cx,cy))continue; setIso(c); c.fillStyle='rgba(255,214,10,.22)'; c.fillRect(cx*CH,cy*CH,CH,CH);
      c.strokeStyle='rgba(255,214,10,.95)'; c.lineWidth=2.5/(TGT.k*32); c.strokeRect(cx*CH,cy*CH,CH,CH);}}
  const sb=selId!=null?byId(selId):null; if(sb){setIso(c,G.ht[sb.y*N+sb.x]*HZ); c.strokeStyle='#ffd60a'; c.lineWidth=3/(TGT.k*32); c.strokeRect(sb.x,sb.y,fw(sb),fh(sb));}
  if((mode.t==='place'||mode.t==='move')&&mode.has){const k=mode.t==='place'?mode.k:byId(mode.i).k,t=T[k],w=mode.f?t.h:t.w,h=mode.f?t.w:t.h;
    const pts=mode.line&&mode.line.length?mode.line:[[mode.gx,mode.gy]];
    for(const [gx,gy] of pts){const ok=canPlace(k,gx,gy,mode.f,mode.t==='move'?S.b.indexOf(byId(mode.i)):-2); const z=inMap(gx,gy)?G.ht[gy*N+gx]*HZ:0;
      const r=(t.serve?Math.max(...Object.values(t.serve)):0)||(t.buff?t.buff.r:0)||(t.fireR||0); setIso(c,z);
      if(r&&pts.length===1){c.fillStyle='rgba(120,200,255,.13)'; c.fillRect(gx-r,gy-r,w+2*r,h+2*r); c.strokeStyle='rgba(120,200,255,.8)'; c.lineWidth=1.5/(TGT.k*32); c.strokeRect(gx-r,gy-r,w+2*r,h+2*r);}
      c.fillStyle=ok?'rgba(80,220,120,.45)':'rgba(230,57,70,.5)'; c.fillRect(gx,gy,w,h);}}
  if(mode.t==='paint'&&mode.hover){const [hx,hy]=mode.hover; const tl=TOOLS[mode.tool]; const why=toolCheck(mode.tool,hx,hy,curOpt());
    if(tl.q){const tx=hx>>1,ty=hy>>1; if(inMap(tx,ty)){setIsoTile(c,tx,ty); c.fillStyle=why&&why!=='já'?'rgba(230,57,70,.55)':'rgba(255,255,255,.55)'; c.fillRect(hx/2,hy/2,.5,.5);}}
    else if(inMap(hx,hy)){setIsoTile(c,hx,hy); c.fillStyle=why&&why!=='já'?'rgba(230,57,70,.45)':'rgba(255,255,255,.35)'; c.fillRect(hx,hy,1,1);}}}

/* ---- Modo de visão (cobertura): imagem 256x256 (4 px por quadrado) desenhada no chão ---- */
const VIEWS=[['happy','Felicidade'],['poll','Poluição'],['com','Comércio'],['sau','Saúde'],['edu','Educação'],['fun','Diversão'],['fe','Fé'],['fire','Bombeiros'],['tour','Turismo'],['set','Bairros']];
let VIEWC=null, viewKey='';
function viewImg(){const key=VIEW+'|'+D.ver; if(VIEWC&&viewKey===key)return VIEWC; if(VIEWC)BK.free(VIEWC);
  const c2=document.createElement("canvas"); c2.width=c2.height=N*4; const c=c2.getContext("2d"); c.scale(4,4); const now=Date.now(); const k=VIEW;
  const rect=(b,i)=>c.fillRect(b.x+i,b.y+i,fw(b)-2*i,fh(b)-2*i);
  if(NEED_I[k]!=null){const col=NEEDS[NEED_I[k]][2]; c.fillStyle=col; c.globalAlpha=.2;
    for(const b of S.b){if(now<b.d)continue; const t=T[b.k]; let r=t.serve&&t.serve[k]; if(!r&&k==='com'&&t.cat==='biz')r=5; if(!r)continue; c.fillRect(b.x-r,b.y-r,fw(b)+2*r,fh(b)+2*r);}
    c.globalAlpha=1; for(const b of S.b){const t=T[b.k]; if(t.cat!=='res')continue; const ok=(cov(b).mask>>NEED_I[k])&1; c.fillStyle=ok?'rgba(47,179,106,.85)':'rgba(229,72,77,.85)'; rect(b,.15);}
    c.strokeStyle=col; c.lineWidth=.22; for(const b of S.b){const t=T[b.k]; if(!(t.serve&&t.serve[k])&&!(k==='com'&&t.cat==='biz'))continue; c.strokeRect(b.x+.1,b.y+.1,fw(b)-.2,fh(b)-.2);}}
  else if(k==='happy'){for(const b of S.b){const t=T[b.k]; if(t.cat!=='res')continue; const h=cov(b).happy; c.fillStyle='hsla('+Math.round(h*120)+',75%,48%,.85)'; rect(b,.1);}}
  else if(k==='poll'){for(let y=0;y<N;y++)for(let x=0;x<N;x++){const v=D.poll[y*N+x]; if(v<3)continue; const q=clamp(v/80,0,1); c.fillStyle='hsla('+Math.round(110-110*q)+',80%,45%,'+(.15+.55*q).toFixed(2)+')'; c.fillRect(x,y,1,1);}
    c.strokeStyle='rgba(30,30,30,.7)'; c.lineWidth=.2; for(const b of S.b){if(polSource(b)>0)c.strokeRect(b.x+.1,b.y+.1,fw(b)-.2,fh(b)-.2);}}
  else if(k==='fire'){c.fillStyle='rgba(229,72,77,.22)'; for(const b of S.b){const t=T[b.k]; if((t.cat==='res'||t.cat==='biz')&&!D.fireCov[b.y*N+b.x])rect(b,.1);}
    c.fillStyle='rgba(62,123,214,.25)'; for(const b of S.b){const t=T[b.k]; if(!t.fireR||now<b.d)continue; const r=t.fireR; c.fillRect(b.x-r,b.y-r,fw(b)+2*r,fh(b)+2*r);}}
  else if(k==='tour'){for(const b of S.b){const t=T[b.k]; if(!t.tour&&!t.beds&&!t.port)continue; c.fillStyle=t.beds?'rgba(43,108,176,.75)':'rgba(242,194,48,.8)'; rect(b,.1);}}
  else if(k==='set'){const cols={china:'#e5484d',brooklyn:'#b5523b',suburbio:'#3e7bd6',popular:'#8a9a5b',luxo:'#b8860b'}; for(const b of S.b){const t=T[b.k]; if(!t.set)continue; c.fillStyle=cols[t.set]; c.globalAlpha=.35+.15*(cov(b).setN||1); rect(b,.1); c.globalAlpha=1;}}
  VIEWC=c2; viewKey=key; return c2;}

/* ---- Sobreposições de tela ---- */
function bubbleFor(b,now){const t=T[b.k]; if(now<b.d)return null;
  if(b.fire)return ['fire'];
  if(S.req&&S.req.some(r=>r.b===b.i))return ['talk'];
  if(t.cat==='res'&&now>=b.a)return ['coin'];
  if(t.cat==='biz'){if(b.s===0)return [t.item?'item:'+t.item:'crate',supHave(t)<t.sup]; if(now>=b.a)return ['coin'];}
  if(isGen(t)&&now>=b.a)return ['coin'];
  if(t.rec){if(b.s==='run'&&now>=b.a)return ['item:'+Object.keys(t.rec.out)[0]]; if(!b.s)return ['gear',!canStart(b)];}
  if(b.k==='plot'&&b.s&&now>=b.a)return ['leaf'];
  if(b.k==='estacao'){if(!b.s)return D.linked.has(b.i)?['train']:['rail',true]; if(now>=b.a)return [b.s==='exp'?'coin':'crate'];}
  if(b.k==='porto'||b.k==='aeroporto'){if(!b.s)return [b.k==='porto'?'ship':'plane']; if(now>=b.a)return ['coin'];}
  if(b.k==='hall'&&taxAmt()>=10)return ['tour'];
  return null;}
function drawOverlay(c,now){setS(c); bubbles=[]; const R=clamp(13*Math.sqrt(cam.z)+3,11,20);
  if(mode.t==='expand'){for(let cy=0;cy<NC;cy++)for(let cx=0;cx<NC;cx++){if(!chunkBuyable(cx,cy))continue; const [wx,wy]=P(cx*CH+CH/2,cy*CH+CH/2); const [sx,sy]=w2s(wx,wy);
      c.strokeStyle='#6b4423';c.lineWidth=3;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx,sy-30);c.stroke(); rr(c,sx-44,sy-58,88,30,8); c.fillStyle='#fff7d6';c.fill(); c.strokeStyle='#6b4423';c.lineWidth=2;c.stroke();
      c.fillStyle='#3b2a00';c.font='800 15px "Baloo 2",system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(fmtS(chunkCost(cx,cy)),sx,sy-42);}}
  if(mode.t==='idle')for(const b of S.b){const t=T[b.k]; let ic=null,prog=null;
    if(now<b.d){if(t.time>0)prog=clamp(1-(b.d-now)/(t.time*1000),0,1);} else ic=bubbleFor(b,now);
    if(!ic&&prog==null)continue;
    const w=fw(b),h=fh(b),zb=G.ht[b.y*N+b.x]*HZ; const top=t.flat?8:(now<b.d?24+w*8:spriteTop('b',b.k,0)); const [wx]=P(b.x+w/2,b.y+h/2); const [,wy0]=P(b.x,b.y,zb); const [sx,sy0]=w2s(wx,wy0-top-6);
    const sy=sy0+(ic?Math.sin(now/380+b.i)*2.5:0);
    if(sx<-30||sy<-30||sx>VW+30||sy>VH+40)continue;
    if(prog!=null){const ww=40,hh=7; c.fillStyle='rgba(0,0,0,.45)';rr(c,sx-ww/2-2,sy-hh/2-2,ww+4,hh+4,5);c.fill(); c.fillStyle='#ffd60a';rr(c,sx-ww/2,sy-hh/2,ww*prog,hh,3.5);c.fill(); continue;}
    drawBubble(c,sx,sy-R*.4,R,ic[0],ic[1]); bubbles.push({b,x:sx,y:sy-R*.4,r:R+6});}
  puffs=puffs.filter(p=>now-p.t0<700); for(const p of puffs){const q=(now-p.t0)/700; const [wx,wy]=P(p.x,p.y,hAt(clamp(p.x,0,N-.01),clamp(p.y,0,N-.01))); const [sx,sy]=w2s(wx,wy); c.globalAlpha=1-q;
    for(let k=0;k<6;k++){const a=k*Math.PI/3+p.r; ell2(c,sx+Math.cos(a)*q*22*cam.z,sy-6-Math.sin(a)*q*10*cam.z-q*8,(4+q*5)*cam.z,'rgba(235,225,205,.9)');} c.globalAlpha=1;}
  floats=floats.filter(f=>now-f.t0<1400);
  for(const f of floats){const p=(now-f.t0)/1400; const [sx,sy]=w2s(f.wx,f.wy); c.globalAlpha=1-p*p;
    c.font='800 '+Math.round(17+3*Math.sqrt(cam.z))+'px "Baloo 2",system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';
    c.lineWidth=4;c.strokeStyle='rgba(30,20,10,.75)';c.strokeText(f.text,sx,sy-f.dy-p*44);c.fillStyle=f.color;c.fillText(f.text,sx,sy-f.dy-p*44);c.globalAlpha=1;}}
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect?c.roundRect(x,y,Math.max(0,w),h,r):c.rect(x,y,Math.max(0,w),h);}
const BCOL={fire:'#e5484d',talk:'#3e7bd6',plane:'#2b6cb0',lab:'#8a5cc7',coin:'#e0a400',leaf:'#3f9a3a',train:'#d62828',crate:'#c7843e',gear:'#5a6a74',ship:'#2b6cb0',rail:'#7a5434',tour:'#a64fd6'};
function drawBubble(c,x,y,r,icon,dim){
  c.fillStyle='rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(x,y+r+7,r*.6,r*.18,0,0,Math.PI*2); c.fill();
  c.beginPath();c.moveTo(x-r*.35,y+r*.8);c.lineTo(x,y+r+6);c.lineTo(x+r*.35,y+r*.8);c.closePath();c.fillStyle='#fff';c.fill();
  c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle='#fff';c.fill();c.lineWidth=2.4;c.strokeStyle=dim?'#c9c9c9':(BCOL[icon]||'#c7843e');c.stroke();
  c.globalAlpha=dim?.45:1; const s=r*.62;
  if(icon==='coin'){const gr=c.createRadialGradient(x-s*.3,y-s*.3,1,x,y,s); gr.addColorStop(0,'#fff1a8'); gr.addColorStop(1,'#f5b400'); c.fillStyle=gr; c.beginPath();c.arc(x,y,s,0,Math.PI*2);c.fill(); c.lineWidth=2;c.strokeStyle='#c98f00';c.stroke(); c.fillStyle='#c98f00'; c.font='800 '+Math.round(s*1.2)+'px "Baloo 2",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('$',x,y+1);}
  else if(icon==='crate'){c.fillStyle='#d9954b';c.fillRect(x-s,y-s*.85,s*2,s*1.7);c.strokeStyle='#7d4f1f';c.lineWidth=1.8;c.strokeRect(x-s,y-s*.85,s*2,s*1.7);c.beginPath();c.moveTo(x-s,y-s*.85);c.lineTo(x+s,y+s*.85);c.moveTo(x+s,y-s*.85);c.lineTo(x-s,y+s*.85);c.stroke();}
  else if(icon==='leaf'){c.save();c.translate(x,y);c.rotate(-.6);c.beginPath();c.ellipse(0,0,s*.6,s*1.05,0,0,Math.PI*2);c.fillStyle='#46b33f';c.fill();c.strokeStyle='#d9f2c9';c.lineWidth=1.4;c.beginPath();c.moveTo(0,-s*.9);c.lineTo(0,s*.9);c.stroke();c.restore();}
  else if(icon==='train'){c.fillStyle='#d62828';c.fillRect(x-s,y-s*.5,s*1.5,s*.9);c.fillStyle='#3a3a3a';c.fillRect(x-s*.8,y-s,s*.6,s*.55);c.fillRect(x+s*.5,y-s*.2,s*.5,s*.6);ell2(c,x-s*.55,y+s*.55,s*.3,'#222');ell2(c,x+s*.25,y+s*.55,s*.3,'#222');}
  else if(icon==='gear'){c.fillStyle='#5a6a74'; c.beginPath(); for(let k=0;k<16;k++){const a=k*Math.PI/8, rr2=k%2?s*.72:s; c.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2);} c.closePath(); c.fill(); ell2(c,x,y,s*.32,'#fff');}
  else if(icon==='ship'){c.fillStyle='#c0392b';c.beginPath();c.moveTo(x-s,y);c.lineTo(x+s,y);c.lineTo(x+s*.7,y+s*.55);c.lineTo(x-s*.7,y+s*.55);c.fill();c.fillStyle='#2b6cb0';c.fillRect(x-s*.4,y-s*.7,s*.8,s*.7);}
  else if(icon==='rail'){c.strokeStyle='#5b6068';c.lineWidth=2;for(const o of [-.35,.35]){c.beginPath();c.moveTo(x+o*s,y-s);c.lineTo(x+o*s,y+s);c.stroke();} c.strokeStyle='#7a5434';c.lineWidth=2.4;for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(x-s*.65,y+k*s*.55);c.lineTo(x+s*.65,y+k*s*.55);c.stroke();}}
  else if(icon==='fire'||icon==='talk'||icon==='plane'||icon==='lab'){c.font=Math.round(s*1.5)+'px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText({fire:'🔥',talk:'💬',plane:'✈️',lab:'🔬'}[icon],x,y+1);}
  else if(icon==='tour'){c.font=Math.round(s*1.6)+'px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('📷',x,y+1);}
  else if(icon.startsWith('item:')){c.font=Math.round(s*1.6)+'px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(ITEMS[icon.slice(5)].ico,x,y+1);}
  c.globalAlpha=1;}
function floatAt(b,text,color){const w=fw(b),h=fh(b); const [wx,wy]=P(b.x+w/2,b.y+h/2,30+G.ht[b.y*N+b.x]*HZ); const n=floats.filter(f=>f.b===b&&Date.now()-f.t0<400).length; floats.push({b,wx,wy,text,color,t0:Date.now(),dy:n*22});}
function floatXY(x,y,z,text,color){const [wx,wy]=P(x,y,z); floats.push({wx,wy,text,color,t0:Date.now(),dy:0});}
function puff(x,y){puffs.push({x,y,t0:Date.now(),r:Math.random()});}
const GLOW=new Map();
function glowImg(rgb){let g2=GLOW.get(rgb); if(g2)return g2; g2=document.createElement('canvas'); g2.width=g2.height=64; const c=g2.getContext('2d'); const gr=c.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,'rgba('+rgb+',1)'); gr.addColorStop(.4,'rgba('+rgb+',.45)'); gr.addColorStop(1,'rgba('+rgb+',0)'); c.fillStyle=gr; c.fillRect(0,0,64,64); GLOW.set(rgb,g2); return g2;}
function glow(c,px,py,rx,ry,rgb,a){c.globalAlpha=a; c.drawImage(glowImg(rgb),px-rx,py-ry,2*rx,2*ry); c.globalAlpha=1;}
let lastFrame=0;
function loop(now){requestAnimationFrame(loop); if(document.hidden||!S)return;
  if(QUAL.fps<60&&now-lastFrame<1000/QUAL.fps-3)return; lastFrame=now; render(Date.now());}
